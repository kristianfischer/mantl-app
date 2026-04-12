import { db } from "@/lib/db";
import type { ConfidenceLevel, FundCardHolding, FundSnapshot, ScarcityFlag } from "@/lib/fund";

type FundPortfolioRow = {
  cert_number: string;
  spec_id: string;
  player: string;
  year: number;
  brand: string;
  card_number: string;
  grade: number;
  acquisition_cost: number | null;
  final_value: number | null;
  final_confidence: number | null;
  is_stale: boolean | null;
  is_interpolated: boolean | null;
  last_valued_at: Date | null;
  card_front: string | null;
  card_back: string | null;
};

type PrismOverviewRow = {
  valuation_count: number;
  stale_count: number;
  avg_confidence: number | null;
  latest_calculated_at: Date | null;
};

type PrismOverview = {
  valuationCount: number;
  staleCount: number;
  averageConfidence: number | null;
  latestCalculatedAt: string | null;
};

function requireDb() {
  if (!db) {
    throw new Error("DATABASE_URL is not configured.");
  }
  return db;
}

function toConfidenceLevel(confidence: number | null, isStale: boolean): ConfidenceLevel | null {
  if (confidence == null) return null;
  if (isStale) return "STALE";
  if (confidence >= 0.75) return "HIGH";
  if (confidence >= 0.4) return "MEDIUM";
  return "LOW";
}

function inferScarcityFlag(grade: number): ScarcityFlag {
  if (grade >= 9) return "RARE";
  if (grade >= 7) return "SCARCE";
  return "COMMON";
}

function mapHolding(row: FundPortfolioRow): FundCardHolding {
  const acquisitionCost = Number(row.acquisition_cost ?? 0);
  const fairValue = row.final_value == null ? null : Number(row.final_value);
  const isStale = Boolean(row.is_stale);
  const confidence = toConfidenceLevel(
    row.final_confidence == null ? null : Number(row.final_confidence),
    isStale
  );

  const front = row.card_front?.trim() || null;
  const back = row.card_back?.trim() || null;

  return {
    certNumber: row.cert_number,
    player: row.player,
    year: String(row.year),
    brand: row.brand,
    cardNumber: row.card_number,
    grade: row.grade,
    acquisitionCost,
    fairValue,
    confidence,
    scarcityFlag: inferScarcityFlag(row.grade),
    valuationMethod: row.is_interpolated ? "Interpolated" : "Direct",
    status: "active",
    cardFrontUrl: front,
    cardBackUrl: back,
  };
}

export async function getFundPortfolioRows(): Promise<FundPortfolioRow[]> {
  return requireDb().$queryRaw<FundPortfolioRow[]>`
    SELECT
      fp.cert_number,
      fp.spec_id,
      fp.player,
      fp.year,
      fp.brand,
      fp.card_number,
      fp.grade,
      fp.acquisition_cost,
      fp.final_value,
      fp.final_confidence,
      fp.is_stale,
      lv.is_interpolated,
      fp.last_valued_at,
      ci.card_front,
      ci.card_back
    FROM fund_portfolio fp
    LEFT JOIN latest_valuations lv
      ON fp.spec_id = lv.spec_id
      AND fp.grade = lv.grade
    LEFT JOIN card_identity ci ON ci.cert_number = fp.cert_number
    ORDER BY fp.player ASC, fp.year DESC
  `;
}

export async function buildFundSnapshot(): Promise<FundSnapshot> {
  const rows = await getFundPortfolioRows();
  const cards = rows.map(mapHolding);

  const liquidityDiscount = Number(process.env.FUND_LIQUIDITY_DISCOUNT ?? 0.1);
  const memberCount = Number(process.env.FUND_MEMBER_COUNT ?? 3);
  const initialOfferingUsd = Number(process.env.FUND_INITIAL_OFFERING_USD ?? 125000);

  const gross = cards.reduce((sum, c) => sum + (c.fairValue ?? 0), 0);
  const basis = cards.reduce((sum, c) => sum + c.acquisitionCost, 0);
  const nav = gross * (1 - liquidityDiscount);
  const ugl = nav - basis;

  const lastValued =
    rows
      .map((r) => r.last_valued_at)
      .filter((d): d is Date => d instanceof Date)
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? new Date();

  return {
    id: process.env.FUND_ID ?? "mantl-alpha",
    name: process.env.FUND_NAME ?? "MANTL Alpha I",
    tagline:
      process.env.FUND_TAGLINE ??
      "Closed-end sports card fund — graded inventory, diversified exposure.",
    valuationAsOf: lastValued.toISOString(),
    initialOfferingUsd,
    totalCostBasisUsd: basis,
    grossPortfolioValueUsd: gross,
    liquidityDiscount,
    fundNavUsd: nav,
    unrealizedGainLossUsd: ugl,
    unrealizedGainLossPct: basis > 0 ? ugl / basis : 0,
    memberCount,
    memberStakeValueUsd: memberCount > 0 ? nav / memberCount : 0,
    cards,
  };
}

export async function getHoldingByCertFromDb(cert: string): Promise<FundCardHolding | null> {
  const rows = await requireDb().$queryRaw<FundPortfolioRow[]>`
    SELECT
      fp.cert_number,
      fp.spec_id,
      fp.player,
      fp.year,
      fp.brand,
      fp.card_number,
      fp.grade,
      fp.acquisition_cost,
      fp.final_value,
      fp.final_confidence,
      fp.is_stale,
      lv.is_interpolated,
      fp.last_valued_at,
      ci.card_front,
      ci.card_back
    FROM fund_portfolio fp
    LEFT JOIN latest_valuations lv
      ON fp.spec_id = lv.spec_id
      AND fp.grade = lv.grade
    LEFT JOIN card_identity ci ON ci.cert_number = fp.cert_number
    WHERE fp.cert_number = ${cert}
    LIMIT 1
  `;

  return rows[0] ? mapHolding(rows[0]) : null;
}

/** Daily fund NAV (after liquidity discount) from valuation snapshot history. */
export type FundNavPoint = { date: string; nav: number };

/**
 * One row per calendar day: sum of latest `final_value` per fund holding that day,
 * then apply the same liquidity discount as `buildFundSnapshot`.
 */
export async function getFundNavHistory(): Promise<FundNavPoint[]> {
  if (!db) return [];
  try {
    const discount = Number(process.env.FUND_LIQUIDITY_DISCOUNT ?? 0.1);
    const rows = await requireDb().$queryRaw<{ d: Date; gross: unknown }[]>`
      WITH daily_latest AS (
        SELECT DISTINCT ON (vs.spec_id, vs.grade, date_trunc('day', vs.calculated_at))
          date_trunc('day', vs.calculated_at)::date AS d,
          vs.final_value
        FROM valuation_snapshots vs
        INNER JOIN card_identity ci ON ci.spec_id = vs.spec_id AND ci.grade = vs.grade
        WHERE vs.final_value IS NOT NULL
        ORDER BY vs.spec_id, vs.grade, date_trunc('day', vs.calculated_at), vs.calculated_at DESC
      )
      SELECT d, SUM(final_value) AS gross
      FROM daily_latest
      GROUP BY d
      ORDER BY d ASC
    `;
    return rows.map((r) => ({
      date: r.d.toISOString().slice(0, 10),
      nav: Number(r.gross) * (1 - discount),
    }));
  } catch {
    return [];
  }
}

/** Ensures at least two points for the chart; fills with flat NAV when history is sparse. */
export function buildFundChartSeries(fund: FundSnapshot, history: FundNavPoint[]): FundNavPoint[] {
  if (history.length >= 2) return history;
  const nav = fund.fundNavUsd;
  if (history.length === 1) {
    const end = new Date(`${history[0].date}T12:00:00Z`);
    const start = new Date(end);
    start.setDate(start.getDate() - 30);
    return [
      { date: start.toISOString().slice(0, 10), nav: history[0].nav },
      history[0],
    ];
  }
  const end = new Date(fund.valuationAsOf);
  const start = new Date(end);
  start.setDate(start.getDate() - 30);
  return [
    { date: start.toISOString().slice(0, 10), nav },
    { date: end.toISOString().slice(0, 10), nav },
  ];
}

export async function getPrismOverviewFromDb(): Promise<PrismOverview> {
  const rows = await requireDb().$queryRaw<PrismOverviewRow[]>`
    SELECT
      COUNT(*)::int AS valuation_count,
      COUNT(*) FILTER (WHERE is_stale = true)::int AS stale_count,
      AVG(final_confidence) AS avg_confidence,
      MAX(calculated_at) AS latest_calculated_at
    FROM latest_valuations
  `;

  const row = rows[0];
  return {
    valuationCount: row?.valuation_count ?? 0,
    staleCount: row?.stale_count ?? 0,
    averageConfidence: row?.avg_confidence == null ? null : Number(row.avg_confidence),
    latestCalculatedAt: row?.latest_calculated_at?.toISOString() ?? null,
  };
}
