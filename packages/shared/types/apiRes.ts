import { SecCompany } from "@prisma/client";

export type ErrorRes = {
  error?: string;
};

export type SecCompanyRes = {
  secCompany?: SecCompany;
} & ErrorRes;
