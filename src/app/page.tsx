import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HomeFundsShowcase } from "@/components/home-funds-showcase";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col items-center justify-center px-4 pb-20 text-center md:px-8">
        <h1 className="font-display text-mantl-gold mt-14 text-[clamp(2.5rem,10vw,5.75rem)] font-medium tracking-[0.45em] uppercase transition-colors duration-500">
          MANTL
        </h1>
        <div className="from-mantl-gold mt-9 h-0.5 w-14 bg-linear-to-r to-transparent" />
        <p className="font-mono text-muted-foreground mt-6 text-[11px] font-light uppercase tracking-[5px]">
          The foundation of value
        </p>
        <p className="text-muted-foreground mx-auto mt-10 max-w-4xl text-[15px] leading-relaxed">
          MANTL is building a <strong className="text-foreground font-normal">family of funds</strong>
          , each filled with rare, graded sports cards around a clear thesis — expensive pieces,
          tailored sleeves, and room to grow.{" "}
          <strong className="text-foreground font-normal">Alpha 1</strong> is live today; more themed
          funds are on the roadmap — from all-time greats and college standouts to NFL icons and the
          next generation of MVPs. Get on the waitlist for what opens next.
        </p>
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
        <div className="ring-mantl-gold-border/80 bg-card/70 rounded-2xl border p-6 md:p-8">
          <p className="text-mantl-gold-dark font-mono text-[10px] uppercase tracking-[3px]">
            Next fund
          </p>
          <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight">
            Interested in the next MANTL fund?
          </h3>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
            Join the waitlist to get early access to upcoming offerings, allocation updates, and
            fund launch details.
          </p>
          <div className="mt-6">
            <Link
              href="/interested"
              className={cn(buttonVariants({ size: "lg" }), "inline-flex")}
            >
              Join waitlist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
