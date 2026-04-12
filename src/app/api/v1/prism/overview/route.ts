import { NextResponse } from "next/server";
import { getPrismOverviewFromDb } from "@/lib/fund-api";

export const runtime = "nodejs";

export async function GET() {
  try {
    const overview = await getPrismOverviewFromDb();
    return NextResponse.json(overview);
  } catch (error) {
    console.error("GET /api/v1/prism/overview failed", error);
    return NextResponse.json({ error: "Unable to load prism overview" }, { status: 500 });
  }
}
