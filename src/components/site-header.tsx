import Link from "next/link";
import { MantlLogo } from "@/components/mantl-logo";

export function SiteHeader() {
  return (
    <header className="border-border/80 bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
        <Link href="/" className="text-mantl-gold flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <MantlLogo size={34} />
          <span className="font-display text-sm font-medium tracking-[0.35em] uppercase">MANTL</span>
        </Link>
        <nav className="flex items-center gap-5 md:gap-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Home
          </Link>
          <Link
            href="/fund"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Fund
          </Link>
          <Link
            href="/prism"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Prism
          </Link>
          <Link
            href="/interested"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Interested?
          </Link>
        </nav>
      </div>
    </header>
  );
}
