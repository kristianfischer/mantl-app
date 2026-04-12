import type { PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";
import type { WaitlistSource } from "@/lib/waitlist-types";

export type { WaitlistSource } from "@/lib/waitlist-types";

export type WaitlistInsert = {
  email: string;
  name?: string | null;
  certNumber?: string | null;
  targetAllocation?: string | null;
  notes?: string | null;
  source: WaitlistSource;
};

function requireDb(): PrismaClient {
  if (!db) {
    throw new Error("DATABASE_URL is not configured.");
  }
  return db;
}

function optionalText(s: string | null | undefined): string | null {
  if (s == null || s === "") return null;
  const t = s.trim();
  return t === "" ? null : t;
}

/**
 * Inserts via `INSERT` so we don’t depend on Prisma delegate typings (some TS setups miss
 * `waitlistSignup` on `PrismaClient`). Matches table `waitlist_signups`.
 */
export async function insertWaitlistSignup(row: WaitlistInsert) {
  const prisma = requireDb();
  const email = row.email.trim();
  const name = optionalText(row.name ?? null);
  const certNumber = optionalText(row.certNumber ?? null);
  const targetAllocation = optionalText(row.targetAllocation ?? null);
  const notes = optionalText(row.notes ?? null);
  const source = row.source;

  await prisma.$executeRaw`
    INSERT INTO waitlist_signups (email, name, cert_number, target_allocation, notes, source)
    VALUES (${email}, ${name}, ${certNumber}, ${targetAllocation}, ${notes}, ${source})
  `;
}
