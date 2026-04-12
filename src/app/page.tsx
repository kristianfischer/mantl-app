import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HomeAlphaFeature } from "@/components/home-alpha-feature";
import { HomeFundsShowcase } from "@/components/home-funds-showcase";
import { getFundSnapshot } from "@/lib/fund";
import { cn } from "@/lib/utils";

export default async function Home() {
  const fund = await getFundSnapshot();

  return (
    <div className="flex flex-col">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col items-center px-4 pb-20 md:px-8">
        <div className="w-full text-center">
          <h1 className="font-display text-mantl-gold mt-14 text-[clamp(2.5rem,10vw,5.75rem)] font-medium tracking-[0.45em] uppercase transition-colors duration-500">
            MANTL
          </h1>
          <div className="from-mantl-gold mx-auto mt-9 h-0.5 w-14 bg-linear-to-r to-transparent" />
          <p className="font-mono text-muted-foreground mt-6 text-[11px] font-light uppercase tracking-[5px]">
            Grail slabs, pooled — ownership you can join
          </p>
          <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-[15px] leading-relaxed">
            MANTL turns headline-grade cards into{" "}
            <strong className="text-foreground font-normal">funds you can own a piece of</strong> —
            not fantasy picks, but real sleeves with published NAV and disclosed holdings.
          </p>
        </div>

        <HomeAlphaFeature fund={fund} />
        <HomeFundsShowcase />
      </section>

      <section className="border-border/80 bg-card/30 mx-auto w-full max-w-6xl border-y px-4 py-20 md:px-8">
        <h2 className="font-display text-foreground text-2xl font-semibold tracking-tight">
          What we do
        </h2>
        <ul className="text-muted-foreground mt-6 space-y-4 text-[15px] leading-relaxed">
          <li>
            <span className="text-foreground font-medium">Collect</span> — We launch themed sleeves
            of authenticated, graded cards (PSA and similar), targeting liquid segments with
            observable comps — rare pieces, clear theses.
          </li>
          <li>
            <span className="text-foreground font-medium">Value</span> — NAV is driven by a
            documented pipeline: identity and population from grading data, market comps (e.g. eBay),
            grade curves, scarcity adjustments, and a liquidity discount before fund-level NAV.
          </li>
          <li>
            <span className="text-foreground font-medium">Own</span> — You own an interest in each
            offering you join; economics track aggregate performance. Holdings are disclosed so you
            can see the cards that back your position.
          </li>
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20 md:px-8">
        <h2 className="font-display text-foreground text-2xl font-semibold tracking-tight">
          Common questions
        </h2>
        <Accordion className="mt-6 w-full" defaultValue={[]}>
          <AccordionItem value="structure">
            <AccordionTrigger>How are offerings structured?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              MANTL Alpha 1 is a defined portfolio of graded cards — not an open-ended mutual fund
              with daily subscriptions at NAV. Future themed funds will follow their own terms.
              Liquidity, duration, and distributions depend on each offering&apos;s documents — this
              site is for transparency, not legal advice.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="nav">
            <AccordionTrigger>How is NAV calculated?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Per-card fair values come from the valuation engine (comps, grade curve, confidence,
              scarcity). Those roll up to gross portfolio value; a liquidity discount is applied to
              reach fund NAV.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cards">
            <AccordionTrigger>How many cards are in Alpha 1?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              The flagship sleeve targets on the order of fifteen graded cards. The holdings table
              shows positions; future funds will
              set their own size and focus.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-8">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border border-mantl-gold/35 p-8 md:p-10",
            "bg-linear-to-br from-mantl-gold-fill/30 via-card/90 to-card/70 shadow-[0_24px_80px_-32px_rgba(212,170,60,0.25)]"
          )}
        >
          <div
            className="pointer-events-none absolute -left-20 bottom-0 size-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,170,60,0.12),transparent_70%)]"
            aria-hidden
          />
          <div className="relative">
            <p className="text-mantl-gold-dark font-mono text-[10px] uppercase tracking-[0.2em]">
              Next fund
            </p>
            <h3 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Get in line for the next sleeve
            </h3>
            <p className="text-muted-foreground mt-4 max-w-2xl text-[15px] leading-relaxed">
              Waitlist for allocation news, launch timing, and new themed funds after Alpha 1.
            </p>
            <div className="mt-8">
              <Link
                href="/interested"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "inline-flex gap-2 bg-mantl-gold px-8 text-primary-foreground shadow-[0_12px_40px_-12px_rgba(212,170,60,0.45)] hover:opacity-[0.97]"
                )}
              >
                Join the waitlist
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
