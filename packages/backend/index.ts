import { config } from "dotenv";
import express, { Request, Response, Express, NextFunction } from "express";

config();

import { logger } from "./src/logger";
import { processTicker } from "./src/processTicker";
import { prisma } from "@asksec-ai/shared/prisma";

const port = process.env.PORT ?? 3001;

const expressApp: Express = express();

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  logger.info(req.url, { method: req.method, body: req.body });
  next();
};
const logError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(req.url, { method: req.method, body: req.body, error: err });
  next();
};

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(logRequest);
expressApp.use(logError);

expressApp.get("/", (req, res) => {
  res.status(200).send("Server alive");
});

expressApp.post("/process-ticker", async (req, res) => {
  const { ticker } = req.body;
  console.log(req.body);
  if (!ticker) {
    logger.error("No ticker provided", { body: req.body });
    return res.status(400).json({ error: "No ticker provided" });
  }

  const prevCompany = await prisma.secCompany.findFirst({
    where: {
      ticker,
    },
  });
  if (prevCompany?.status === "Success" || prevCompany?.status === "Loading")
    return res.status(200).json({ company: prevCompany });

  const company = await processTicker(ticker);

  res.status(200).json({ company });
});

expressApp.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend is running at port ${port}`);
});
