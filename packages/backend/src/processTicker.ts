import { prisma, TenKSection } from "@asksec-ai/shared/prisma";
import { get10kSection, getEdgarFiling } from "./secApi";
import { openai } from "./openAi";
import { logger } from "./logger";

const chunkText = (text: string, chunkSize = 2000) => {
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

const chunkParagraphs = (text: string, chunkSize = 3000): string[] => {
  const paragraphs = text.split("\n");
  const words = paragraphs.reduce((acc, paragraph) => {
    if (paragraph === "" || paragraph.length < 100) return acc;
    if (acc.length === 0) {
      acc.push(paragraph);
    } else if (acc[acc.length - 1].length + paragraph.length > chunkSize) {
      acc.push(paragraph);
    } else if (paragraph.length > 2000) {
      acc.push(...chunkText(paragraph, chunkSize));
    } else {
      acc[acc.length - 1] += ` ${paragraph}`;
    }
    return acc;
  }, [] as string[]);

  return words;
};

const generateEmbeddings = async (
  companyId: string,
  section: TenKSection,
  text: string,
  index: number
) => {
  try {
    const existing = await prisma.secCompanySectionItem.findFirst({
      where: {
        companyId,
        section,
        order: index,
      },
    });
    if (existing?.embedding) return;
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
  } catch (e) {
    logger.error(`Error generating embedding`, {
      companyId,
      section,
      index,
      error: e,
      text,
    });
  }
};

export const processTicker = async (ticker: string) => {
  logger.info(`Processing ticker`, { ticker });
  const filing = await getEdgarFiling(ticker);

  const company = await prisma.secCompany.upsert({
    where: {
      ticker,
    },
    update: {
      status: "Loading",
    },
    create: {
      ticker,
      status: "Loading",
    },
  });

  try {
    logger.info(`Upserted company`, { ticker, companyId: company.id });

    const [oneSection, oneASection, sevenSection, sevenASection] =
      await Promise.all([
        get10kSection(filing.linkToFilingDetails, "1", company.id),
        get10kSection(filing.linkToFilingDetails, "1A", company.id),
        get10kSection(filing.linkToFilingDetails, "7", company.id),
        get10kSection(filing.linkToFilingDetails, "7A", company.id),
      ]);

    logger.info(`Got 10k sections`, {
      ticker,
      companyId: company.id,
      oneSection: oneSection.length,
      oneASection: oneASection.length,
      sevenASection: sevenASection.length,
    });

    const oneSectionChunks = chunkParagraphs(oneSection);
    const oneASectionChunks = chunkParagraphs(oneASection);
    const sevenSectionChunks = chunkParagraphs(sevenSection);
    const sevenASectionChunks = chunkParagraphs(sevenASection);

    logger.info(`Generating embeddings`, {
      ticker,
      companyId: company.id,
      oneSectionChunks: oneSectionChunks.length,
      oneASectionChunks: oneASectionChunks.length,
      sevenSectionChunks: sevenSectionChunks.length,
      sevenASectionChunks: sevenASectionChunks.length,
    });

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
        sevenSectionChunks.map(async (text, i) =>
          generateEmbeddings(company.id, "Seven", text, i)
        )
      ),
      Promise.all(
        sevenASectionChunks.map(async (text, i) =>
          generateEmbeddings(company.id, "SevenA", text, i)
        )
      ),
    ]);

    logger.info(`Ticker processed`, { ticker, companyId: company.id });

    const c = await prisma.secCompany.update({
      where: {
        ticker,
      },
      data: {
        status: "Success",
      },
    });

    return c;
  } catch (e) {
    logger.error(`Error processing ticker`, {
      ticker,
      companyId: company.id,
      error: e,
    });

    const c = await prisma.secCompany.update({
      where: {
        ticker,
      },
      data: {
        status: "Error",
      },
    });
    return c;
  }
};
