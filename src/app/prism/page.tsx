import { PrismCertComingSoon } from "@/components/prism-cert-coming-soon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PRISM_LENSES = [
  {
    title: "Lens 1 — Exact grade comps",
    desc: "Anchors valuation to verified market transactions for the exact card and grade, with recency emphasis and data-quality filtering.",
    role: "Primary anchor",
  },
  {
    title: "Lens 2 — Grade extrapolation",
    desc: "Bridges valuation between exact sales by referencing nearby grades of the same card and applying controlled pass-through logic.",
    role: "Continuity layer",
  },
  {
    title: "Lens 3 — Player market signal",
    desc: "Adds directional context from the broader player market to keep illiquid assets from going stale between direct comps.",
    role: "Directional context",
  },
];

export const metadata = {
  title: "Prism — MANTL",
  description: "Overview of the Prism three-lens valuation framework.",
};

export default function PrismPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <p className="text-mantl-gold-dark font-mono text-[10px] uppercase tracking-[3px]">Valuation engine</p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        Prism valuation overview
      </h1>
      <p className="text-muted-foreground mt-2 max-w-3xl text-[15px] leading-relaxed">
        Prism is MANTL&apos;s internal valuation framework used to estimate fund-level fair value and
        calculate NAV updates. We share the structure publicly to show rigor and consistency,
        while keeping implementation details and calibrations proprietary.
      </p>

      <PrismCertComingSoon />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="ring-mantl-gold-border/80 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Built for reliability</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm leading-relaxed">
            Multiple market signals reduce single-source bias and improve valuation stability across
            both liquid and thinly traded cards.
          </CardContent>
        </Card>
        <Card className="ring-mantl-gold-border/80 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Designed for transparency</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm leading-relaxed">
            Each valuation carries traceable confidence and freshness metadata so investors can judge
            precision vs directionality in context.
          </CardContent>
        </Card>
        <Card className="ring-mantl-gold-border/80 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Connected to NAV</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm leading-relaxed">
            Per-card fair values roll up to gross portfolio value, then risk controls are applied to
            produce fund NAV used throughout the product.
          </CardContent>
        </Card>
      </div>

      <Card className="ring-mantl-gold-border/80 bg-card/80 mt-8">
        <CardHeader>
          <CardTitle className="font-display text-lg">Three-lens framework</CardTitle>
          <CardDescription>
            Exact comps, grade extrapolation, and player market signal blended dynamically by
            confidence and structural priority.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {PRISM_LENSES.map((lens) => (
              <div key={lens.title} className="rounded-xl border border-border/70 bg-background/40 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[2px] text-mantl-gold-dark">
                  {lens.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{lens.desc}</p>
                <p className="mt-3 text-xs font-mono uppercase tracking-[2px] text-foreground/85">
                  {lens.role}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border/70 bg-background/40 p-4 text-sm leading-relaxed">
            <p className="font-medium">Blending approach (high level):</p>
            <p className="mt-1 text-muted-foreground">
              The engine assigns dynamic weights to each lens using confidence and structural
              importance. As exact data improves, the model naturally leans harder on Lens 1; when
              markets are less liquid, supplemental lenses carry more of the signal.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="ring-mantl-gold-border/80 bg-card/80">
          <CardHeader>
            <CardTitle className="font-display text-lg">Update cadence</CardTitle>
            <CardDescription>How Prism stays current over time.</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>- Pulls fresh market signals on a recurring schedule.</p>
            <p>- Applies data quality checks before values enter the model.</p>
            <p>- Tracks staleness and confidence decay when data becomes sparse.</p>
            <p>- Refreshes portfolio-level NAV from updated per-card estimates.</p>
          </CardContent>
        </Card>

        <Card className="ring-mantl-gold-border/80 bg-card/80">
          <CardHeader>
            <CardTitle className="font-display text-lg">Risk controls and guardrails</CardTitle>
            <CardDescription>Framework behavior under uncertainty.</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            <p>- Outlier handling to avoid one-off prints dominating valuation.</p>
            <p>- Confidence caps for indirect signals relative to direct comps.</p>
            <p>- Fallback behavior for low-liquidity or sparse-data assets.</p>
            <p>- Explicit uncertainty signaling instead of fabricated precision.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="ring-mantl-gold-border/80 bg-card/80 mt-6">
        <CardHeader>
          <CardTitle className="font-display text-lg">What we disclose vs keep proprietary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background/40 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[2px] text-mantl-gold-dark">
              Public model view
            </p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Framework structure, signal categories, confidence philosophy, and how values roll into
              NAV.
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/40 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[2px] text-mantl-gold-dark">
              Proprietary layer
            </p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Exact feature weights, threshold parameters, platform normalization curves, and internal
              calibration logic.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
