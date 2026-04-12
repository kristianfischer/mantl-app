import Link from "next/link";
import { ArrowRight, Lock, Scale, TrendingUp, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FundPerformanceChart } from "@/components/fund-performance-chart";
import { MajorHoldingsShowcase } from "@/components/major-holdings-showcase";
import { getFundSnapshot } from "@/lib/fund";
import { buildFundChartSeries, getFundNavHistory } from "@/lib/fund-api";
import { formatDateIso, formatPct, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Fund — MANTL",
  description:
    "A closed-end portfolio of graded sports cards — curated exposure and institutional-grade valuation.",
};

export default async function FundPage() {
  const fund = await getFundSnapshot();
  const navHistory = await getFundNavHistory();
  const chartSeries = buildFundChartSeries(fund, navHistory);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-10 md:mb-14">
        <p className="text-mantl-gold-dark font-mono text-[10px] uppercase tracking-[3px]">
          Closed-end fund
        </p>
        <h1 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          {fund.name}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed">
          A concentrated basket of PSA-graded assets — diversified across names and eras so you
          participate in the upside of the hobby market without sourcing, grading, or storing slabs
          yourself. This vintage is{" "}
          <span className="text-foreground font-medium">fully allocated</span>; new investors access
          the next raise.
        </p>
        <p className="text-muted-foreground mt-2 font-mono text-xs">
          Valuation snapshot · {formatDateIso(fund.valuationAsOf)}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="ring-mantl-gold-border/80 bg-card/80">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
              <Wallet className="size-3.5" aria-hidden />
              Fund NAV
            </CardDescription>
            <CardTitle className="font-display text-mantl-gold text-2xl font-semibold tabular-nums">
              {formatUsd(fund.fundNavUsd)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-xs leading-relaxed">
            How the portfolio nets
            to members today.
          </CardContent>
        </Card>

        <Card className="ring-mantl-gold-border/80 bg-card/80">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
              <TrendingUp className="size-3.5" aria-hidden />
              Unrealized P&amp;L
            </CardDescription>
            <CardTitle className="font-display text-2xl font-semibold tabular-nums">
              {formatUsd(fund.unrealizedGainLossUsd)}{" "}
              <span className="text-muted-foreground text-lg">
                ({formatPct(fund.unrealizedGainLossPct)})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-xs leading-relaxed">
            Mark-to-market versus aggregate acquisition cost — the story the market is telling about
            this basket.
          </CardContent>
        </Card>

        <Card className="ring-mantl-gold-border/80 bg-card/80">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
              <Scale className="size-3.5" aria-hidden />
              Cost basis
            </CardDescription>
            <CardTitle className="font-display text-2xl font-semibold tabular-nums">
              {formatUsd(fund.totalCostBasisUsd)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-xs leading-relaxed">
            What the fund paid to assemble the book — your reference for how much appreciation is
            already priced in.
          </CardContent>
        </Card>
      </div>

      <section className="mt-10">
        <FundPerformanceChart
          series={chartSeries}
          hasHistoricalData={navHistory.length >= 2}
        />
      </section>

      <section className="mt-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-display text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
            Most Valuable Slabs
          </h2>
          <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
            Our three highest fair-value positions — real slabs and grades, priced by the Prism
            engine. Open any card for the full holding view.
          </p>
        </div>
        <MajorHoldingsShowcase
          holdings={fund.cards}
          grossPortfolioValueUsd={fund.grossPortfolioValueUsd}
        />
      </section>

      <section className="mt-12">
        <Card className="border-mantl-gold-border/50 from-mantl-gold-fill/40 overflow-hidden bg-linear-to-br to-card/90 ring-1 ring-mantl-gold/20">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="border-mantl-gold/40 font-mono text-[10px] uppercase tracking-widest"
              >
                <Lock className="mr-1.5 size-3" aria-hidden />
                Fully subscribed
              </Badge>
              <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-[2px]">
                This allocation is closed
              </span>
            </div>
            <CardTitle className="font-display mt-3 text-xl md:text-2xl">
              You&apos;re looking at a fund that already filled
            </CardTitle>
            <CardDescription className="text-muted-foreground max-w-2xl text-[15px] leading-relaxed">
              The {fund.name} vintage reached its member cap. Investors in this sleeve locked in
              exposure to a curated set of graded cards — the kind of liquidity and headline assets
              most collectors never get at portfolio scale. That window is shut, but the next one
              opens with each new raise.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-t border-border/50 pt-6">
              <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
                Initial Raise (Target)
              </p>
              <p className="font-display mt-1 text-2xl font-semibold tabular-nums md:text-3xl">
                {formatUsd(fund.initialOfferingUsd)}
              </p>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
                    Allocation
                  </p>
                  <span className="text-muted-foreground text-xs">Vintage closed</span>
                </div>
                <div
                  className="bg-muted/80 mt-2 h-3 overflow-hidden rounded-full ring-1 ring-border/60"
                  role="img"
                  aria-label="This vintage is fully allocated; no remaining capacity shown on this page."
                >
                  <div className="from-mantl-gold/90 to-mantl-gold h-full w-full rounded-full bg-linear-to-r" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                Don&apos;t wait for the next headline sale — get in line for the next fund. We handle
                sourcing, custody, and valuation; you get a single line item that tracks the
                portfolio.
              </p>
              <Link
                href="/interested"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "shrink-0 bg-mantl-gold text-primary-foreground hover:opacity-95"
                )}
              >
                Join the next fund waitlist
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-16">
        <div className="mb-6">
          <h2 className="font-display text-foreground text-2xl font-semibold tracking-tight">
            Full holdings
          </h2>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Every line in the fund — cost, fair value, and confidence — in one place.
          </p>
        </div>

        <Card className="ring-mantl-gold-border/80 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-mono text-[10px] uppercase tracking-wider">
                  Asset
                </TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-wider">Grade</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-wider text-right">
                  Cost
                </TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-wider text-right">
                  Fair value
                </TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-wider">Confidence</TableHead>
                <TableHead className="text-right font-mono text-[10px] uppercase tracking-wider">
                  Detail
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fund.cards.map((c, idx) => {
                return (
                  <TableRow key={c.certNumber ?? `pending-${idx}`}>
                    <TableCell>
                      <div className="font-medium">
                        {c.year} {c.brand} — {c.player}
                        {c.cardNumber !== "—" ? ` #${c.cardNumber}` : ""}
                      </div>
                      {c.certNumber && (
                        <div className="text-muted-foreground font-mono text-xs">
                          Cert {c.certNumber}
                        </div>
                      )}
                      {c.status === "pending" && (
                        <Badge variant="secondary" className="mt-1 font-mono text-[10px] uppercase">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{c.grade != null ? `PSA ${c.grade}` : "—"}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatUsd(c.acquisitionCost)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {c.fairValue != null ? (
                        <span>
                          {formatUsd(c.fairValue)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {c.confidence ? (
                        <Badge variant="outline" className="font-mono text-[10px] uppercase">
                          {c.confidence}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {c.certNumber ? (
                        <Link
                          href={`/fund/holdings/${c.certNumber}`}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "inline-flex gap-1"
                          )}
                        >
                          View
                          <ArrowRight className="size-3.5" />
                        </Link>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </section>
    </div>
  );
}
