import { NextResponse } from "next/server";
import { buildFundSnapshot } from "@/lib/fund-api";

export const runtime = "nodejs";

export async function GET() {
  try {
    const fund = await buildFundSnapshot();
    return NextResponse.json(fund);
  } catch (error) {
    console.error("GET /api/v1/fund failed", error);
    return NextResponse.json({ error: "Unable to load fund snapshot" }, { status: 500 });
  }
}
