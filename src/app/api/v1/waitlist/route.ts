import { NextResponse } from "next/server";
import { insertWaitlistSignup } from "@/lib/waitlist";
import type { WaitlistSource } from "@/lib/waitlist-types";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isWaitlistSource(s: string): s is WaitlistSource {
  return s === "interested" || s === "prism_cert";
}

/** Prisma errors expose `code` (e.g. P2021). Avoid `import { Prisma }` — not exported on all generated clients. */
function prismaErrorCode(e: unknown): string | null {
  if (typeof e !== "object" || e === null || !("code" in e)) return null;
  const c = (e as { code: unknown }).code;
  return typeof c === "string" ? c : null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const sourceRaw = typeof body.source === "string" ? body.source.trim() : "";
    if (!isWaitlistSource(sourceRaw)) {
      return NextResponse.json(
        { error: "Invalid source. Use interested or prism_cert." },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name : undefined;
    const certNumber = typeof body.certNumber === "string" ? body.certNumber : undefined;
    const targetAllocation =
      typeof body.targetAllocation === "string" ? body.targetAllocation : undefined;
    const notes = typeof body.notes === "string" ? body.notes : undefined;

    const clamp = (s: string | undefined, max: number) => {
      if (!s) return undefined;
      const t = s.trim();
      if (!t) return undefined;
      return t.length > max ? t.slice(0, max) : t;
    };

    await insertWaitlistSignup({
      email,
      name: clamp(name, 200) ?? null,
      certNumber: clamp(certNumber, 64) ?? null,
      targetAllocation: clamp(targetAllocation, 500) ?? null,
      notes: clamp(notes, 8000) ?? null,
      source: sourceRaw,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    if (message.includes("DATABASE_URL")) {
      return NextResponse.json({ error: "Waitlist is not available right now." }, { status: 503 });
    }

    const pCode = prismaErrorCode(e);
    if (pCode) {
      console.error("POST /api/v1/waitlist Prisma", pCode, e);
      if (pCode === "P2021" || pCode === "P2010") {
        return NextResponse.json(
          {
            error:
              "Database is not ready: create the waitlist_signups table (or run prisma db push) and try again.",
          },
          { status: 503 }
        );
      }
      if (pCode === "P2002") {
        return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
      }
    } else {
      console.error("POST /api/v1/waitlist failed", e);
    }

    const detail =
      process.env.NODE_ENV === "development" && e instanceof Error ? e.message : undefined;
    return NextResponse.json(
      { error: "Could not save your signup.", ...(detail ? { detail } : {}) },
      { status: 500 }
    );
  }
}
