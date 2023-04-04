import { NextApiHandler } from "next";
import { prisma } from "@asksec-ai/shared/prisma";
import { cosineSim } from "@asksec-ai/shared/utils/cosineSim";
import {z} from "zod";
import {generateEmbedding, queryOpenAI} from "@/Lib/openAi";

const questionHandlerApiBody = z.object({
  question: z.string(),
});

const QuestionHandler: NextApiHandler = async (req, res) => {
  const rTicker = req.query.ticker as string;
  const ticker = rTicker.toUpperCase();
  const company = await prisma.secCompany.findFirst({
    where: {
      ticker: ticker,
    }
  })

  if (!company) return res.status(400).json({ error: "Ticker invalid or not scraped" });

  const { question } = questionHandlerApiBody.parse(req.body);
  const questionEmbedding = await generateEmbedding(question);

  const embeddings = await prisma.secCompanySectionItem.findMany({
    where: {
      companyId: company.id,
    },
  });

  const relevantContent = embeddings
    .map(({ embedding, text }) => ({
      text,
      sim: cosineSim(embedding, questionEmbedding),
    }))
    .sort((a, b) => b.sim - a.sim)[0].text;

  const answer = await queryOpenAI(
    `${relevantContent} \n ---------- \nBased on above text from a companies SEC documents, answer the question: ${question}`
  );

  return res.status(200).json({ answer });
};

export default QuestionHandler;