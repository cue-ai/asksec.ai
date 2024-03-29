import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

// eslint-disable-next-line import/no-mutable-exports
export let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}
