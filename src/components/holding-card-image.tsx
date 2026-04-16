"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPsaCertImageCandidates } from "@/lib/card-image";
import { cn } from "@/lib/utils";

type Props = {
  certNumber: string;
  player: string;
  year: string;
  brand: string;
  cardNumber: string;
  grade: number | null;
  cardFrontUrl?: string | null;
  cardBackUrl?: string | null;
};

/** Slab viewer: trading-card proportion, capped so the page stays scannable on tall source images. */
function slideFrameClassName() {
  return "relative mx-auto aspect-[5/7] w-full max-w-[280px] max-h-[min(68vh,400px)] min-h-0";
}

function SlideImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={slideFrameClassName()}>
      {failed ? (
        <div className="text-muted-foreground flex h-full min-h-0 items-center justify-center p-4 text-center text-xs">
          Could not load image. Check the URL or CORS for this host.
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- URLs from DB / any CDN
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function FrontBackSlideshow({
  certNumber,
  slides,
}: {
  certNumber: string;
  slides: { src: string; label: string; alt: string }[];
}) {
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX == null || slides.length < 2) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 48) go(delta > 0 ? -1 : 1);
    setTouchStartX(null);
  };

  const current = slides[index];
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || slides.length < 2) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go, slides.length]);

  const arrowBtn =
    "bg-background/90 text-foreground hover:bg-muted/90 border-border/70 shadow-sm flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors";

  return (
    <div
      ref={rootRef}
      className="relative mx-auto w-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      tabIndex={0}
      role="region"
      aria-label="Card front and back images"
    >
      <div className="flex w-full items-center justify-center gap-3 sm:gap-5">
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => go(-1)}
          className={arrowBtn}
        >
          <ChevronLeft className="size-4" />
        </button>

        <div
          className="ring-mantl-gold-border/60 relative w-[min(280px,calc(100%-7rem))] shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-muted/30 shadow-lg"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s) => (
              <div key={s.label} className="min-w-full shrink-0">
                <SlideImage src={s.src} alt={s.alt} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Next image"
          onClick={() => go(1)}
          className={arrowBtn}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {slides.length > 1 && (
        <nav className="mt-3 flex justify-center gap-2" aria-label="Choose front or back">
          {slides.map((s, i) => (
            <button
              key={s.label}
              type="button"
              aria-label={`Show ${s.label.toLowerCase()}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none",
                i === index ? "bg-mantl-gold w-8" : "bg-muted-foreground/35 hover:bg-muted-foreground/50 w-2"
              )}
            />
          ))}
        </nav>
      )}

      <p className="text-muted-foreground border-border/60 mt-2 border-t px-3 py-2 text-center text-[11px]">
        {current.label}
      </p>
    </div>
  );
}

function DbSideImage({
  src,
  label,
  alt,
  certNumber,
}: {
  src: string;
  label: string;
  alt: string;
  certNumber: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/30 shadow-lg">
      <SlideImage src={src} alt={alt} />
      <p className="text-muted-foreground border-t border-border/60 px-3 py-2 text-center text-[11px]">
        {label} · Cert {certNumber}
      </p>
    </div>
  );
}

export function HoldingCardImage({
  certNumber,
  player,
  year,
  brand,
  cardNumber,
  grade,
  cardFrontUrl,
  cardBackUrl,
}: Props) {
  const front = cardFrontUrl?.trim() || null;
  const back = cardBackUrl?.trim() || null;

  const psaCandidates = useMemo(() => getPsaCertImageCandidates(certNumber), [certNumber]);
  const [psaAttempt, setPsaAttempt] = useState(0);
  const [psaFailed, setPsaFailed] = useState(psaCandidates.length === 0);

  const fallbackCard = (
    <div
      className={cn(
        "from-mantl-bg-3 to-mantl-bg-2 rounded-2xl border border-border/70 bg-linear-to-br p-4 shadow-lg",
        slideFrameClassName()
      )}
    >
      <div className="from-mantl-gold/25 via-mantl-gold/5 to-transparent absolute inset-0 bg-linear-to-br" />
      <div className="relative flex h-full flex-col justify-between rounded-xl border border-mantl-gold-border/60 bg-black/20 p-4">
        <div>
          <p className="text-mantl-gold font-mono text-[10px] uppercase tracking-[2px]">No image</p>
          <p className="mt-2 font-display text-lg font-semibold">{player}</p>
          <p className="text-muted-foreground text-xs">
            {year} {brand} #{cardNumber}
          </p>
          <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
            Set <code className="font-mono text-[10px]">card_front</code> /{" "}
            <code className="font-mono text-[10px]">card_back</code> on{" "}
            <code className="font-mono text-[10px]">card_identity</code>, or check{" "}
            <a
              href={`https://www.psacard.com/cert/${encodeURIComponent(certNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mantl-gold underline-offset-2 hover:underline"
            >
              PSA
            </a>
            .
          </p>
        </div>
        <div className="space-y-1">
          {grade != null && (
            <p className="font-mono text-xs uppercase tracking-[2px]">PSA {grade}</p>
          )}
        </div>
      </div>
    </div>
  );

  if (front || back) {
    const slides = [
      front && {
        src: front,
        label: "Front",
        alt: `Front — ${player}`,
      },
      back && {
        src: back,
        label: "Back",
        alt: `Back — ${player}`,
      },
    ].filter(Boolean) as { src: string; label: string; alt: string }[];

    if (slides.length > 1) {
      return <FrontBackSlideshow certNumber={certNumber} slides={slides} />;
    }

    const only = slides[0];
    return (
      <div className="relative mx-auto w-full max-w-[280px]">
        <DbSideImage
          src={only.src}
          label={only.label}
          alt={only.alt}
          certNumber={certNumber}
        />
      </div>
    );
  }

  const psaSrc = psaCandidates[psaAttempt];
  if (!psaSrc || psaFailed) {
    return fallbackCard;
  }

  return (
    <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-border/70 bg-muted/30 shadow-lg">
      <div className={slideFrameClassName()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`${psaAttempt}-${psaSrc}`}
          src={psaSrc}
          alt={`PSA — ${player}, cert ${certNumber}`}
          className="h-full w-full object-contain"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => {
            setPsaAttempt((i) => {
              if (i + 1 < psaCandidates.length) return i + 1;
              setPsaFailed(true);
              return i;
            });
          }}
        />
      </div>
      <p className="text-muted-foreground border-t border-border/60 px-3 py-2 text-center text-[11px] leading-snug">
        PSA CDN fallback · Cert {certNumber}
      </p>
    </div>
  );
}
