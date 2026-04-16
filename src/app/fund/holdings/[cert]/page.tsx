import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HoldingCardImage } from "@/components/holding-card-image";
import { getFundSnapshot, getHoldingByCert } from "@/lib/fund";
import { formatPct, formatUsd } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ cert: string }> };

/** Per-cert pages must reflect latest marks, not build-time snapshot. */
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const fund = await getFundSnapshot();
  return fund.cards
    .filter((c) => c.certNumber)
    .map((c) => ({ cert: c.certNumber as string }));
}

export async function generateMetadata({ params }: Props) {
  const { cert } = await params;
  const holding = await getHoldingByCert(cert);
  if (!holding || holding.status !== "active") {
    return { title: "Holding — MANTL" };
  }
  return {
    title: `${holding.player} — MANTL`,
    description: `${holding.year} ${holding.brand} PSA ${holding.grade} · Fund position`,
  };
}

export default async function HoldingPage({ params }: Props) {
  const { cert } = await params;
  const holding = await getHoldingByCert(cert);
  const fund = await getFundSnapshot();

  if (!holding || holding.status !== "active") {
    notFound();
  }

  const shareOfGross =
    holding.fairValue != null && fund.grossPortfolioValueUsd > 0
      ? holding.fairValue / fund.grossPortfolioValueUsd
      : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <Link
        href="/fund"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "text-muted-foreground -ml-2 mb-8 inline-flex gap-1"
        )}
      >
        <ArrowLeft className="size-3.5" />
        Back to fund
      </Link>

      <p className="text-mantl-gold-dark font-mono text-[10px] uppercase tracking-[3px]">
        Your portfolio slice
      </p>
      <h1 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        {holding.year} {holding.brand}
      </h1>
      <p className="text-mantl-gold mt-1 text-lg font-medium">{holding.player}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wide">
          PSA {holding.grade}
        </Badge>
        {holding.scarcityFlag && (
          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wide">
            {holding.scarcityFlag}
          </Badge>
        )}
        {holding.confidence && (
          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wide">
            Confidence {holding.confidence}
          </Badge>
        )}
        {holding.valuationMethod && (
          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wide">
            {holding.valuationMethod}
          </Badge>
        )}
      </div>

      {holding.certNumber && (
        <Card className="ring-mantl-gold-border/80 bg-card/80 mt-8 overflow-hidden">
          <CardHeader className="pb-3">
            
          </CardHeader>
          <CardContent>
            <HoldingCardImage
              certNumber={holding.certNumber}
              player={holding.player}
              year={holding.year}
              brand={holding.brand}
              cardNumber={holding.cardNumber}
              grade={holding.grade}
              cardFrontUrl={holding.cardFrontUrl}
              cardBackUrl={holding.cardBackUrl}
            />
          </CardContent>
        </Card>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">

        <Card className="ring-mantl-gold-border/80 bg-card/80">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-[10px] uppercase tracking-wider">
              Card number
            </CardDescription>
            <CardTitle className="font-display text-lg">#{holding.cardNumber}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="ring-mantl-gold-border/80 bg-card/80 mt-6">
        <CardHeader>
          <CardTitle className="font-display text-lg">Value &amp; ownership</CardTitle>
          <CardDescription>
            How this slab contributes to aggregate NAV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-0 text-sm">
          <div className="flex justify-between gap-4 border-b border-border/60 py-3">
            <span className="text-muted-foreground">Acquisition cost</span>
            <span className="tabular-nums">{formatUsd(holding.acquisitionCost)}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-border/60 py-3">
            <span className="text-muted-foreground">Fair value <a href="/prism" className="text-mantl-gold hover:underline">(Prism)</a></span>
            <span className="text-mantl-gold font-medium tabular-nums">
              {holding.fairValue != null ? formatUsd(holding.fairValue) : "—"}
            </span>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <span className="text-muted-foreground">Share of portfolio</span>
            <span className="tabular-nums">{formatPct(shareOfGross)}</span>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-10" />

      <p className="text-muted-foreground text-sm leading-relaxed">
        Investors hold interests in the fund, not title to individual cards — but the portfolio is
        curated transparently so you can see exactly which assets back NAV.
      </p>
    </div>
  );
}
