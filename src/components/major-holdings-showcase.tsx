"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FundCardHolding } from "@/lib/fund";
import { formatPct, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  holdings: FundCardHolding[];
  grossPortfolioValueUsd: number;
};

function HoldingTile({
  c,
  sharePct,
}: {
  c: FundCardHolding;
  sharePct: number;
}) {
  const href = c.certNumber ? `/fund/holdings/${c.certNumber}` : undefined;
  const front = c.cardFrontUrl?.trim();

  const inner = (
    <>
      <div className="from-mantl-bg-3/80 to-mantl-bg-2/90 relative aspect-[4/5] overflow-hidden rounded-xl border border-border/60 bg-linear-to-br">
        {front ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={front}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="text-mantl-gold-dark font-mono text-[10px] uppercase tracking-[2px]">
              PSA {c.grade ?? "—"}
            </span>
            <span className="font-display text-foreground line-clamp-3 text-sm font-medium leading-snug">
              {c.player}
            </span>
            <span className="text-muted-foreground text-xs">
              {c.year} {c.brand}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute right-0 bottom-0 left-0 p-4">
          <p className="font-display text-foreground line-clamp-2 text-sm font-semibold leading-tight">
            {c.player}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {c.year} {c.brand}
            {c.cardNumber !== "—" ? ` · #${c.cardNumber}` : ""}
          </p>
          {c.fairValue != null && (
            <p className="text-mantl-gold mt-2 font-mono text-sm font-medium tabular-nums">
              {formatUsd(c.fairValue)}
              {sharePct > 0 && (
                <span className="text-muted-foreground ml-2 text-xs font-normal">
                  · {formatPct(sharePct)} of fund
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      <div className="mt-2 pb-1 pr-2 flex justify-end">
        {href && (
          <span className="text-mantl-gold inline-flex items-center gap-1 text-xs font-medium">
            View
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`View holding: ${c.player}`}
        className={cn(
          "group ring-mantl-gold-border/40 focus-visible:ring-mantl-gold block overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:outline-none",
          "transition-shadow duration-300 hover:shadow-[0_0_40px_-8px_rgba(212,170,60,0.25)]"
        )}
      >
        {inner}
      </Link>
    );
  }

  return <div className="group">{inner}</div>;
}

export function MajorHoldingsShowcase({ holdings, grossPortfolioValueUsd }: Props) {
  const ranked = [...holdings]
    .filter((c) => c.status === "active" && c.certNumber && c.fairValue != null && c.fairValue > 0)
    .sort((a, b) => (b.fairValue ?? 0) - (a.fairValue ?? 0))
    .slice(0, 3);

  if (ranked.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Major positions will appear here once the portfolio is valued.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {ranked.map((c) => {
        const sharePct =
          c.fairValue != null && grossPortfolioValueUsd > 0
            ? c.fairValue / grossPortfolioValueUsd
            : 0;
        return (
          <HoldingTile key={c.certNumber ?? c.player} c={c} sharePct={sharePct} />
        );
      })}
    </div>
  );
}
