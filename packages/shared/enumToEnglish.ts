import { TenKSection } from "@prisma/client";

export const sectionToEnglish: Record<TenKSection, string> = {
  One: "1",
  OneA: "1A",
  Seven: "7",
  SevenA: "7A",
};
export const englishToSection: Record<string, TenKSection> = {
  "1": "One",
  "1A": "OneA",
  "7": "Seven",
  "7A": "SevenA",
};
