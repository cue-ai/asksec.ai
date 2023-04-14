import axios from "axios";
import { EdgarFiling } from "@asksec-ai/shared/types/edgar";
import { prisma } from "@asksec-ai/shared/prisma";
import { englishToSection } from "@asksec-ai/shared/enumToEnglish";
import { logger } from "./logger";

const secApiToken = process.env.SEC_API_TOKEN;

export const getEdgarFiling = async (ticker: string): Promise<EdgarFiling> => {
  logger.info(`Getting 10k filing`, { ticker });
  const { data } = await axios.post(
    "https://api.sec-api.io",
    {
      query: {
        query_string: {
          query: `ticker:${ticker} AND formType:"10-K"`,
        },
      },
      from: "0",
      size: "1",
      sort: [
        {
          filedAt: {
            order: "desc",
          },
        },
      ],
    },
    {
      headers: {
        Authorization: secApiToken,
      },
    }
  );

  if (!data.filings || data.filings.length === 0)
    throw new Error(`No 10k filing found for ${ticker}`);

  logger.info(`Got 10k filing`, { ticker, id: data.filings[0].id });

  return data.filings[0];
};

export const get10kSection = async (
  filingLink: string,
  item: "1" | "1A" | "7" | "7A",
  companyId: string
) => {
  try {
    const existing = await prisma.secCompanySectionItem.findMany({
      where: {
        companyId,
        section: englishToSection[item],
      },
    });
    if (existing && existing.length > 10) {
      logger.info(`Found existing 10k ${item}`, { companyId, item });

      return existing.map((e) => e.text).join("");
    }

    logger.info(`Getting 10k ${item}`, { companyId, item });
    const { data } = await axios.request({
      method: "GET",
      url: "https://api.sec-api.io/extractor",
      params: {
        url: filingLink,
        item,
        type: "text",
        token: secApiToken,
      },
      headers: {
        Authorization:
          "e5bd42a7e847ee4c4f5b1b99281e58d93e487b0615f209c0727e2f115614ef71",
        "Content-Type": "application/json",
      },
    });

    logger.info(`Got 10k ${item}`, {
      companyId,
      item,
      dataLength: data.length,
    });

    return data;
  } catch (e) {
    logger.error(`Error getting 10k ${item}`, {
      companyId,
      item,
      error: e,
    });
    return "";
  }
};
