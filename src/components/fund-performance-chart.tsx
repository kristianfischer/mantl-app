"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateIso, formatPct, formatUsd } from "@/lib/format";

export type NavSeriesPoint = { date: string; nav: number };

type Props = {
  series: NavSeriesPoint[];
  /** True when `valuation_snapshots` produced at least two distinct days for the fund. */
  hasHistoricalData: boolean;
};

export function FundPerformanceChart({ series, hasHistoricalData }: Props) {
  const points = useMemo(() => {
    if (series.length >= 2) return series;
    if (series.length === 1) return [series[0], { ...series[0] }];
    return [];
  }, [series]);

  /** -1 = show the latest (rightmost) point until the user hovers. */
  const [hoverIndex, setHoverIndex] = useState(-1);

  const chart = useMemo(() => {
    const w = 860;
    const h = 260;
    const pad = 18;
    if (points.length < 2) {
      return { w, h, pad, points: [] as Array<NavSeriesPoint & { x: number; y: number }>, path: "", area: "" };
    }
    const navs = points.map((p) => p.nav);
    const min = Math.min(...navs);
    const max = Math.max(...navs);
    const span = Math.max(max - min, 1);
    const mapped = points.map((p, i) => {
      const x = pad + (i / (points.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (p.nav - min) / span) * (h - pad * 2);
      return { ...p, x, y };
    });
    const path = mapped
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" ");
    const area = `${path} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`;
    return { w, h, pad, points: mapped, path, area };
  }, [points]);

  const safeIndex =
    hoverIndex < 0
      ? Math.max(0, chart.points.length - 1)
      : Math.min(hoverIndex, Math.max(0, chart.points.length - 1));

  const activePoint = chart.points[safeIndex];
  const startNav = chart.points[0]?.nav ?? 0;
  const deltaPct = activePoint && startNav > 0 ? (activePoint.nav - startNav) / startNav : 0;

  return (
    <Card className="ring-mantl-gold-border/80 bg-card/80">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <CardTitle className="font-display text-lg">Portfolio performance</CardTitle>
          <CardDescription>
            {hasHistoricalData
              ? "Fund NAV by day from valuation snapshot history (after liquidity discount)."
              : "Not enough snapshot history yet — flat line uses the latest fund NAV."}
          </CardDescription>
        </div>
        {activePoint && (
          <div className="text-right">
            <p className="text-mantl-gold font-display text-2xl font-semibold tabular-nums">
              {formatUsd(activePoint.nav)}
            </p>
            <p className="text-muted-foreground font-mono text-xs">
              {formatDateIso(activePoint.date)} ({formatPct(deltaPct)} vs start)
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {chart.points.length < 2 ? (
          <p className="text-muted-foreground text-sm">No chart data available.</p>
        ) : (
          <div className="relative">
            <svg viewBox={`0 0 ${chart.w} ${chart.h}`} className="h-65 w-full" aria-hidden>
              <defs>
                <linearGradient id="mantlNavArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={chart.area} fill="url(#mantlNavArea)" />
              <path
                d={chart.path}
                fill="none"
                stroke="var(--gold)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {chart.points.map((p, i) => (
                <g key={`${p.date}-${i}`}>
                  <circle cx={p.x} cy={p.y} r={i === safeIndex ? 4.5 : 2.5} fill="var(--gold)" />
                  {i === safeIndex && (
                    <>
                      <line
                        x1={p.x}
                        y1={chart.pad}
                        x2={p.x}
                        y2={chart.h - chart.pad}
                        stroke="var(--gold)"
                        strokeWidth="1"
                        strokeDasharray="3 4"
                        opacity="0.35"
                      />
                      <circle cx={p.x} cy={p.y} r={9} fill="none" stroke="var(--gold)" opacity="0.2" />
                    </>
                  )}
                </g>
              ))}
            </svg>
            <div
              className="absolute inset-0 grid"
              style={{ gridTemplateColumns: `repeat(${chart.points.length}, 1fr)` }}
            >
              {chart.points.map((p, i) => (
                <button
                  key={`${p.date}-${i}-hit`}
                  type="button"
                  className="h-full w-full cursor-crosshair bg-transparent"
                  onMouseMove={() => setHoverIndex(i)}
                  onFocus={() => setHoverIndex(i)}
                  onMouseEnter={() => setHoverIndex(i)}
                  aria-label={`Show NAV for ${formatDateIso(p.date)}`}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
