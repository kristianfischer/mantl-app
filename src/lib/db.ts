import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var __prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;

export const db =
  !connectionString
    ? null
    : (globalThis.__prisma ?? new PrismaClient({ adapter: new PrismaPg({ connectionString }) }));

if (db && process.env.NODE_ENV !== "production") {
  globalThis.__prisma = db;
}
