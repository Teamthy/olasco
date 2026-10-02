import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & { olascoPrisma?: PrismaClient };

export function getPrismaClient() {
  if (!process.env.DATABASE_URL) return null;
  if (globalForPrisma.olascoPrisma) return globalForPrisma.olascoPrisma;
  const client = new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"] });
  globalForPrisma.olascoPrisma = client;
  return client;
}

export function isDemoStorage() {
  return !process.env.DATABASE_URL && process.env.NODE_ENV !== "production";
}
