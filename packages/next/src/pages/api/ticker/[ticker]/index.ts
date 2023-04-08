import { NextApiHandler } from "next";
import { prisma } from "@asksec-ai/shared/prisma";
import { SecCompanyRes } from "@asksec-ai/shared/types/apiRes";
import axios from "axios";

const TickerHandler: NextApiHandler<SecCompanyRes> = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const rTicker = req.query.ticker as string;
  const ticker = rTicker.toUpperCase();

  const secCompany = await prisma.secCompany.findFirst({
    where: {
      ticker,
    },
  });

  if (secCompany?.status !== "Success" && secCompany?.status !== "Loading") {
    const c = await prisma.secCompany.upsert({
      where: {
        ticker,
      },
      update: {},
      create: {
        ticker,
      },
    });

    axios.post(`${process.env.BACKEND_URL}/process-ticker`, {
      ticker,
    });

    return res.status(200).json({ secCompany: c });
  } else {
    return res.status(200).json({ secCompany });
  }
};

export default TickerHandler;
