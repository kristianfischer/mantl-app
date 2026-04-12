/**
 * Fund + valuation types aligned with `mantl-engine` / valuation_engine.ipynb
 * (`FundReport`, `CardReport`, `Valuation`). Live data comes from `@/lib/fund-api` when DB is configured.
 */

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW" | "STALE";

export type ScarcityFlag = "RARE" | "SCARCE" | "COMMON";

export interface FundCardHolding {
  certNumber: string | null;
  player: string;
  year: string;
  brand: string;
  cardNumber: string;
  grade: number | null;
  acquisitionCost: number;
  fairValue: number | null;
  confidence: ConfidenceLevel | null;
  scarcityFlag: ScarcityFlag | null;
  valuationMethod: "Direct" | "Interpolated" | null;
  status: "active" | "pending";
  /** From `card_identity.card_front` when present. */
  cardFrontUrl?: string | null;
  /** From `card_identity.card_back` when present. */
  cardBackUrl?: string | null;
}

export interface FundSnapshot {
  id: string;
  name: string;
  tagline: string;
  /** When the snapshot was produced (matches `FundReport.valuation_date`). */
  valuationAsOf: string;
  /** Original raise / offering size for the fund (for display vs NAV). */
  initialOfferingUsd: number;
  /** Sum of acquisition costs for all positions (`FundReport.total_cost_basis`). */
  totalCostBasisUsd: number;
  /** Gross fair value before liquidity haircut (`FundReport.gross_portfolio_value`). */
  grossPortfolioValueUsd: number;
  /** e.g. 0.10 (`FundReport.liquidity_discount`). */
  liquidityDiscount: number;
  /** NAV after discount (`FundReport.fund_nav`). */
  fundNavUsd: number;
  unrealizedGainLossUsd: number;
  unrealizedGainLossPct: number;
  /** For display: intended number of member interests (notebook `FUND_MEMBERS`). */
  memberCount: number;
  memberStakeValueUsd: number;
  cards: FundCardHolding[];
}

/** Mock snapshot fallback used when API/DB is unavailable. */
function getMockFundSnapshot(): FundSnapshot {
  const liquidityDiscount = 0.1;
  const memberCount = 3;

  const cards: FundCardHolding[] = [
    {
      certNumber: "83809745",
      player: "Michael Jordan",
      year: "1986",
      brand: "Fleer",
      cardNumber: "57",
      grade: 8,
      acquisitionCost: 200,
      fairValue: 2039.8,
      confidence: "MEDIUM",
      scarcityFlag: "COMMON",
      valuationMethod: "Direct",
      status: "active",
      cardFrontUrl: null,
      cardBackUrl: null,
    },
    ...Array.from({ length: 4 }, () => ({
      certNumber: null,
      player: "Position reserved",
      year: "—",
      brand: "—",
      cardNumber: "—",
      grade: null,
      acquisitionCost: 0,
      fairValue: null,
      confidence: null,
      scarcityFlag: null,
      valuationMethod: null,
      status: "pending" as const,
      cardFrontUrl: null,
      cardBackUrl: null,
    })),
  ];

  const gross = cards.reduce((s, c) => s + (c.fairValue ?? 0), 0);
  const basis = cards.reduce((s, c) => s + c.acquisitionCost, 0);
  const nav = gross * (1 - liquidityDiscount);
  const ugl = nav - basis;
  const uglPct = basis > 0 ? ugl / basis : 0;

  return {
    id: "mantl-alpha",
    name: "MANTL Alpha I",
    tagline: "Closed-end sports card fund — graded inventory, diversified exposure.",
    valuationAsOf: new Date().toISOString(),
    initialOfferingUsd: 125_000,
    totalCostBasisUsd: basis,
    grossPortfolioValueUsd: gross,
    liquidityDiscount,
    fundNavUsd: nav,
    unrealizedGainLossUsd: ugl,
    unrealizedGainLossPct: uglPct,
    memberCount,
    memberStakeValueUsd: nav / memberCount,
    cards,
  };
}

/**
 * Loads fund data via the same Prisma layer as GET /api/v1/fund (no HTTP hop).
 * Server Components run on the Node server — you will not see this in the browser Network tab.
 * If DATABASE_URL is missing or the DB errors, we fall back to the mock snapshot for local dev.
 */
export async function getFundSnapshot(): Promise<FundSnapshot> {
  try {
    const { buildFundSnapshot } = await import("@/lib/fund-api");
    return await buildFundSnapshot();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[mantl] getFundSnapshot: DB unavailable, using mock snapshot.",
        err instanceof Error ? err.message : err
      );
    }
    return getMockFundSnapshot();
  }
}

export async function getHoldingByCert(cert: string): Promise<FundCardHolding | undefined> {
  try {
    const { getHoldingByCertFromDb } = await import("@/lib/fund-api");
    const holding = await getHoldingByCertFromDb(cert);
    if (holding) return holding;
    return undefined;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[mantl] getHoldingByCert: DB unavailable, trying mock cert.",
        err instanceof Error ? err.message : err
      );
    }
    return getMockFundSnapshot().cards.find((c) => c.certNumber === cert);
  }
}
