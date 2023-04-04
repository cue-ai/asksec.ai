import { get10kSection, getEdgarFiling } from "./secApi";
import { prisma } from "@asksec-ai/shared/prisma";
import { openai } from "./openAi";
import {logger} from "./logger";

const chunkText = (text: string, chunkSize: number = 2000) => {
  const words = text.split(" ");
  const contentSections = words.reduce((acc, word, index) => {
    if (index % chunkSize === 0) {
      acc.push("");
    }
    acc[acc.length - 1] += ` ${word}`;
    return acc;
  }, [] as string[]);

  return contentSections;
};

const chunkParagraphs = (text: string, chunkSize: number = 2000): string[] => {
  const paragraphs = text.split("\n");
  const words = paragraphs.reduce((acc, paragraph) => {
    if (paragraph === '' || paragraph.length < 100) return acc;
    if (paragraph.length > 2000) {
      acc.push(...chunkText(paragraph, chunkSize));
    } else {
      acc.push(paragraph);
    }
    return acc;
  }, [] as string[]);

  return words;
};

const generateEmbeddings = async (
  companyId: string,
  section: string,
  text: string,
  index: number
) => {
  const res = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: text,
  });
  await prisma.secCompanySectionItem.create({
    data: {
      companyId,
      text,
      order: index,
      embedding: res.data.data?.[0]?.embedding,
      section: "One",
    },
  });
};

export const processTicker = async (ticker: string) => {
  const filing = await getEdgarFiling(ticker);

  const company = await prisma.secCompany.create({
    data: {
      ticker,
    },
  });

  logger.info(`Created company`, { ticker, companyId: company.id });

  const [oneSection, oneASection, sevenASection] = await Promise.all([
    get10kSection(filing.linkToFilingDetails, "1"),
    get10kSection(filing.linkToFilingDetails, "1A"),
    get10kSection(filing.linkToFilingDetails, "7A"),
  ]);

  logger.info(`Got 10k sections`, { ticker, companyId: company.id });

  const oneSectionChunks = chunkParagraphs(oneSection);
  const oneASectionChunks = chunkParagraphs(oneASection);
  const sevenASectionChunks = chunkParagraphs(sevenASection);


  logger.info(`Generating embeddings`, { ticker, companyId: company.id });

  await Promise.all([
    Promise.all(
      oneSectionChunks.map(async (text, i) =>
        generateEmbeddings(company.id, "One", text, i)
      )
    ),
    Promise.all(
      oneASectionChunks.map(async (text, i) =>
        generateEmbeddings(company.id, "OneA", text, i)
      )
    ),
    Promise.all(
      sevenASectionChunks.map(async (text, i) =>
        generateEmbeddings(company.id, "SevenA", text, i)
      )
    )
  ])

  logger.info(`Ticker processed`, { ticker, companyId: company.id });

  return company;
};
