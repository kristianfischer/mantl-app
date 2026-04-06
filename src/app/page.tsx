import { ThemeToggle } from "@/components/theme-toggle";
import { MantlLogo } from "@/components/mantl-logo";

export default function Home() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <ThemeToggle />

      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-14 animate-[icon-in_1.6s_ease-out_forwards] opacity-0 [animation-fill-mode:forwards]">
          <MantlLogo size={90} />
        </div>
        <h1 className="font-display text-mantl-gold text-[clamp(2.5rem,10vw,5.75rem)] font-medium tracking-[0.45em] uppercase transition-colors duration-500">
          MANTL
        </h1>
        <div className="from-mantl-gold mt-9 h-0.5 w-14 bg-linear-to-r to-transparent" />
        <p className="font-mono text-mantl-muted mt-6 text-[11px] font-light uppercase tracking-[5px] transition-colors duration-500">
          Brand Identity System
        </p>
        <p className="font-mono text-mantl-faint mt-3 text-[10px] tracking-[2px] uppercase transition-colors duration-500">
          v1.0 — 2026
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-20">
        <p className="font-mono text-mantl-gold-dark text-[10px] uppercase tracking-[3px] transition-colors duration-500">
          01 — Essence
        </p>
        <h2 className="font-display text-mantl-text mt-2.5 text-3xl font-semibold tracking-wide transition-colors duration-500 md:text-4xl">
          Cut Light Into Value
        </h2>
        <p className="text-mantl-muted mt-3.5 max-w-[540px] text-[15px] leading-[1.85] transition-colors duration-500">
          Mantl transforms raw collectibles into structured, investable assets. The Prism Split mark
          captures this: one ray enters a gem, multiple exit. Raw value in, diversified returns out.
        </p>
      </section>
    </div>
  );
}
