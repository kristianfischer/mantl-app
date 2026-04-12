import { NextResponse } from "next/server";
import { getHoldingByCertFromDb } from "@/lib/fund-api";

export const runtime = "nodejs";

type Context = { params: Promise<{ cert: string }> };

export async function GET(_: Request, { params }: Context) {
  const { cert } = await params;

  try {
    const holding = await getHoldingByCertFromDb(cert);
    if (!holding) {
      return NextResponse.json({ error: "Holding not found" }, { status: 404 });
    }
    return NextResponse.json(holding);
  } catch (error) {
    console.error(`GET /api/v1/fund/holdings/${cert} failed`, error);
    return NextResponse.json({ error: "Unable to load holding" }, { status: 500 });
  }
}
