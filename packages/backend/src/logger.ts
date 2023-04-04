import { createLogger, transports } from "winston";
import { WinstonTransport } from "@axiomhq/axiom-node";

const consoleTransport = new transports.Console();
const axiomTransport = new WinstonTransport({
  dataset: "backend", // defaults to process.env.AXIOM_DATASET
  token: process.env.AXIOM_TOKEN, // defaults to process.env.AXIOM_TOKEN
  orgId: "test-uhes", // defaults to process.env.AXIOM_ORG_ID
});


export const logger = createLogger({
  transports: [consoleTransport, axiomTransport],
  defaultMeta: { service: "asksec-backend" }
});
