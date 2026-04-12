import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { FundCardHolding, FundSnapshot } from "@/lib/fund";
import { HOME_SHOWCASE_CERT_NUMBERS } from "@/lib/home-showcase-certs";
import { formatDateIso, formatPct, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Resolves curated cert numbers to holdings in display order; skips certs not in the book. */
function holdingsForShowcase(cards: FundCardHolding[]): FundCardHolding[] {
  const byCert = new Map<string, FundCardHolding>();
  for (const c of cards) {
    if (c.certNumber) byCert.set(c.certNumber, c);
  }
  const out: FundCardHolding[] = [];
  for (const cert of HOME_SHOWCASE_CERT_NUMBERS) {
    const c = byCert.get(cert);
    if (c && c.status === "active") out.push(c);
  }
  return out;
}

function SlabSpotlight({ c }: { c: FundCardHolding }) {
  const href = c.certNumber ? `/fund/holdings/${c.certNumber}` : "/fund";
  const front = c.cardFrontUrl?.trim();

  const figure = (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-2xl border-2 border-mantl-gold/25 bg-linear-to-b from-mantl-bg-3/90 to-background shadow-[0_24px_80px_-24px_rgba(212,170,60,0.35)] transition-[border-color,box-shadow,transform] duration-300",
        "hover:border-mantl-gold/55 hover:shadow-[0_28px_90px_-20px_rgba(212,170,60,0.45)] hover:-translate-y-0.5"
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/40 md:aspect-[4/5]">
        {front ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={front}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="text-mantl-gold-dark font-mono text-xs uppercase tracking-[0.2em]">
              PSA {c.grade ?? "—"}
            </span>
            <span className="font-display text-foreground line-clamp-3 text-lg font-semibold leading-snug">
              {c.player}
            </span>
            <span className="text-muted-foreground text-sm">
              {c.year} {c.brand}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background via-background/10 to-transparent opacity-80" />
        <figcaption className="absolute right-0 bottom-0 left-0 p-4 md:p-5">
          <p className="font-display text-foreground line-clamp-2 text-base font-semibold leading-tight md:text-lg">
            {c.player}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {c.year} · {c.brand}
            {c.cardNumber !== "—" ? ` · #${c.cardNumber}` : ""}
          </p>
        </figcaption>
      </div>
    </figure>
  );

  return (
    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mantl-gold rounded-2xl">
      {figure}
    </Link>
  );
}

export function HomeAlphaFeature({ fund }: { fund: FundSnapshot }) {
  const showcase = holdingsForShowcase(fund.cards);

  return (
    <div className="mt-14 w-full text-left">
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-mantl-gold/35 p-6 shadow-[0_0_0_1px_rgba(212,170,60,0.12),0_32px_120px_-40px_rgba(0,0,0,0.65)] md:p-10",
          "bg-linear-to-br from-mantl-gold-fill/50 via-card/95 to-card/80"
        )}
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-[min(420px,70vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,170,60,0.14),transparent_65%)]"
          aria-hidden
        />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-12">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-mantl-gold/50 bg-mantl-gold/20 text-mantl-gold-dark font-mono text-[10px] uppercase tracking-[0.15em]">
                Live fund
              </Badge>
            </div>
            <h2 className="font-display text-foreground mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {fund.name}
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl text-[15px] leading-relaxed md:text-base">
              This is where MANTL started — a real sleeve of graded inventory, marked to market and
              fully disclosed. No teaser: you can open every line in the book, trace how we got to
              NAV, and see the actual slabs behind the numbers.
            </p>
            <Link
              href="/fund"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 inline-flex gap-2 bg-mantl-gold px-8 text-primary-foreground shadow-[0_12px_40px_-12px_rgba(212,170,60,0.55)] hover:opacity-[0.97]"
              )}
            >
              Open Alpha 1
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <aside className="ring-mantl-gold-border/60 bg-background/55 flex flex-col gap-4 rounded-2xl border p-5 backdrop-blur-sm">
            <p className="text-mantl-gold-dark font-mono text-[10px] uppercase tracking-[0.2em]">
              Snapshot
            </p>
            <div>
              <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
                Fund NAV
              </p>
              <p className="font-display text-mantl-gold mt-1 text-2xl font-semibold tabular-nums md:text-3xl">
                {formatUsd(fund.fundNavUsd)}
              </p>
            </div>
            <div className="flex items-baseline gap-2 border-t border-border/50 pt-4">
              <TrendingUp className="text-mantl-gold-dark size-4 shrink-0" aria-hidden />
              <div>
                <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
                  Unrealized vs cost
                </p>
                <p className="text-foreground font-medium tabular-nums">
                  {formatUsd(fund.unrealizedGainLossUsd)}{" "}
                  <span className="text-muted-foreground text-sm">
                    ({formatPct(fund.unrealizedGainLossPct)})
                  </span>
                </p>
              </div>
            </div>
            <p className="text-muted-foreground border-t border-border/50 pt-4 font-mono text-[10px] leading-relaxed">
              Marks as of {formatDateIso(fund.valuationAsOf)}
            </p>
          </aside>
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <p className="text-mantl-gold-dark font-mono text-[10px] uppercase tracking-[0.25em]">
          Inside the sleeve
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
            Own the cards you couldn&apos;t buy on your own
          </h3>
          <Link
            href="/fund"
            className="text-mantl-gold hover:text-mantl-gold-light inline-flex items-center gap-1 text-sm font-medium transition-colors"
          >
            Full holdings
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <p className="text-muted-foreground mt-2 max-w-2xl text-[15px] leading-relaxed">
          Rare, expensive graded pieces — the kind most collectors never get to hold — pooled in a
          sleeve you can actually own a piece of.
        </p>

        {showcase.length === 0 ? (
          <p className="text-muted-foreground mt-8 text-sm">
            Add PSA cert numbers in{" "}
            <code className="text-foreground font-mono text-xs">home-showcase-certs.ts</code> that
            exist in the fund, or{" "}
            <Link href="/fund" className="text-mantl-gold underline-offset-4 hover:underline">
              View the fund page
            </Link>
            .
          </p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {showcase.map((c) => (
              <SlabSpotlight key={c.certNumber ?? c.player} c={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
