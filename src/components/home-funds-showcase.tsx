"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FUTURE_FUNDS = [
  {
    name: "LeBron",
    subtitle: "Career-defining Lakers, Cavs, and Team USA slabs",
  },
  {
    name: "College Hoops",
    subtitle: "Blue-chip NCAA names and tournament-era issues",
  },
  {
    name: "NFL Icons",
    subtitle: "Quarterbacks, skill positions, and championship-era pieces",
  },
  {
    name: "Future MVP",
    subtitle: "Rising stars and second-year breakout candidates",
  },
] as const;

const GAP_PX = 16;
const SLIDE_COUNT = FUTURE_FUNDS.length;

function FutureFundSlide({
  name,
  subtitle,
}: {
  name: string;
  subtitle: string;
}) {
  return (
    <div className="ring-mantl-gold-border/40 bg-card/35 relative flex min-h-[240px] h-full w-full flex-col overflow-hidden rounded-2xl border border-dashed p-5 opacity-95 sm:min-h-[260px] sm:p-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,170,60,0.1),transparent_55%)]"
        aria-hidden
      />
      <div className="relative flex min-h-0 flex-1 flex-col gap-3">
        <div
          className="pointer-events-none relative h-12 overflow-hidden rounded-lg border border-border/40 bg-muted/30 sm:h-14"
          aria-hidden
        >
          <div className="absolute inset-0 bg-linear-to-br from-mantl-gold/20 via-transparent to-muted blur-[6px]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(105deg,transparent,transparent_8px,rgba(255,255,255,0.03)_8px,rgba(255,255,255,0.03)_16px)] opacity-60" />
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-foreground/90 text-lg font-semibold tracking-tight md:text-xl">
            {name}
          </h3>
          <span className="text-muted-foreground inline-flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase tracking-wide">
            <Lock className="size-3" />
            Soon
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-[15px]">{subtitle}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wide">
            Roadmap
          </Badge>
        </div>
        <p className="text-muted-foreground mt-auto text-xs leading-relaxed">
          Join the waitlist to get notified when we open allocation for themed sleeves.
        </p>
        <Link
          href="/interested"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-fit border-mantl-gold-border/50"
          )}
        >
          Join waitlist
        </Link>
      </div>
    </div>
  );
}

export function HomeFundsShowcase() {
  const [visible, setVisible] = useState(2);
  const [index, setIndex] = useState(0);
  const [viewportW, setViewportW] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const maxIndex = Math.max(0, SLIDE_COUNT - visible);
  const cardWidth =
    viewportW > 0 && visible > 0
      ? (viewportW - GAP_PX * Math.max(0, visible - 1)) / visible
      : 0;
  const stepPx = cardWidth > 0 ? cardWidth + GAP_PX : 0;
  const measured = cardWidth > 0;

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqSm = window.matchMedia("(min-width: 640px)");
    const readVisible = () => {
      if (mqLg.matches) return 3;
      if (mqSm.matches) return 2;
      return 1;
    };

    const sync = () => {
      setVisible(readVisible());
      setViewportW(el.clientWidth);
    };

    // Sync before paint: ResizeObserver alone runs after paint and caused a full-width flash.
    sync();

    const onMq = () => sync();
    mqLg.addEventListener("change", onMq);
    mqSm.addEventListener("change", onMq);

    const ro = new ResizeObserver(() => {
      setViewportW(el.clientWidth);
    });
    ro.observe(el);

    return () => {
      mqLg.removeEventListener("change", onMq);
      mqSm.removeEventListener("change", onMq);
      ro.disconnect();
    };
  }, []);

  const clampedIndex = Math.min(index, maxIndex);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => {
        const c = Math.min(i, maxIndex);
        return Math.min(maxIndex, Math.max(0, c + dir));
      });
    },
    [maxIndex]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 48) go(delta > 0 ? -1 : 1);
    setTouchStartX(null);
  };

  const canPrev = clampedIndex > 0;
  const canNext = clampedIndex < maxIndex;

  const arrowBtn =
    "bg-background/90 text-foreground hover:bg-muted/90 border-border/70 shadow-sm flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-35";

  const pages = maxIndex + 1;

  return (
    <div className="mx-auto mt-16 w-full max-w-6xl md:mt-24">
      <div className="text-center">
        <p className="text-mantl-gold-dark font-mono text-[10px] uppercase tracking-[0.25em]">
          After Alpha 1
        </p>
        <h2 className="font-display text-foreground mt-2 text-xl font-semibold tracking-tight md:text-2xl">
          Themed funds in the pipeline
        </h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm leading-relaxed">
          Roadmap sleeves — not live yet. Get notified when we open a new raise.
        </p>
      </div>

      <div className="mt-8 flex w-full items-stretch justify-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Previous funds"
          disabled={!measured || !canPrev}
          onClick={() => go(-1)}
          className={arrowBtn}
        >
          <ChevronLeft className="size-4" />
        </button>

        <div
          ref={viewportRef}
          className="min-w-0 flex-1 overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {!measured ? (
            <div className="flex w-full gap-4" aria-hidden>
              {Array.from({ length: visible }).map((_, i) => (
                <div
                  key={i}
                  className="bg-muted/35 min-h-[260px] min-w-0 flex-1 animate-pulse rounded-2xl sm:min-h-[280px]"
                />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-nowrap gap-4 transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{
                transform: `translateX(-${clampedIndex * stepPx}px)`,
              }}
            >
              {FUTURE_FUNDS.map((f) => (
                <div key={f.name} className="shrink-0" style={{ width: cardWidth }}>
                  <FutureFundSlide name={f.name} subtitle={f.subtitle} />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Next funds"
          disabled={!measured || !canNext}
          onClick={() => go(1)}
          className={arrowBtn}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {measured && (
        <nav className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Carousel position">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`View position ${i + 1} of ${pages}`}
              aria-current={i === clampedIndex ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none",
                i === clampedIndex
                  ? "bg-mantl-gold w-8"
                  : "bg-muted-foreground/35 hover:bg-muted-foreground/50 w-2"
              )}
            />
          ))}
        </nav>
      )}
    </div>
  );
}
