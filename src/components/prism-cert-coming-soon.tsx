"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { submitWaitlist } from "@/lib/waitlist-client";

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export function PrismCertComingSoon() {
  const [cert, setCert] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !isValidEmail(email)) {
      setError("Enter a valid email.");
      return;
    }
    setLoading(true);
    try {
      await submitWaitlist({
        email: email.trim(),
        certNumber: cert.trim() || undefined,
        source: "prism_cert",
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="ring-mantl-gold-border/80 from-mantl-gold/8 bg-card/80 relative mt-8 overflow-hidden bg-linear-to-br to-transparent">
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-mantl-gold/10 blur-3xl"
        aria-hidden
      />
      <CardHeader className="relative pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-mantl-gold-border/60 font-mono text-[10px] uppercase tracking-wide"
          >
            Coming soon
          </Badge>
          <span className="text-muted-foreground inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide">
            Prism cert lookup
          </span>
        </div>
        <CardTitle className="font-display mt-2 text-xl md:text-2xl">
          Get a Prism fair value for your slab
        </CardTitle>
        <CardDescription className="max-w-2xl text-[15px] leading-relaxed">
          Add your email so we can notify you when cert valuations go live. Optionally include a PSA
          cert number you care about — same Prism engine as fund NAV, no valuation generated yet.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {submitted ? (
          <div
            className="rounded-xl border border-mantl-gold-border/50 bg-background/50 p-5 text-sm leading-relaxed"
            role="status"
          >
            <p className="text-foreground font-medium">You&apos;re on the list.</p>
            <p className="text-muted-foreground mt-2">
              We saved{" "}
              <span className="text-foreground font-medium">{email.trim()}</span>
              {cert.trim() ? (
                <>
                  {" "}
                  with cert{" "}
                  <span className="text-foreground font-mono tabular-nums">{cert.trim()}</span>
                </>
              ) : null}{" "}
              for when Prism cert lookup launches — no valuation yet.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 rounded-full"
              onClick={() => {
                setSubmitted(false);
                setCert("");
                setEmail("");
                setError(null);
              }}
            >
              Add another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid max-w-xl gap-4">
            <label className="text-sm">
              <span className="mb-1.5 block text-xs font-mono uppercase tracking-[2px] text-muted-foreground">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-xs font-mono uppercase tracking-[2px] text-muted-foreground">
                PSA cert number <span className="font-normal normal-case">(optional)</span>
              </span>
              <input
                name="cert"
                inputMode="numeric"
                autoComplete="off"
                placeholder="e.g. 12345678"
                value={cert}
                onChange={(e) => setCert(e.target.value)}
                className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 font-mono tabular-nums outline-none focus-visible:ring-2"
              />
            </label>
            {error ? (
              <p className="text-destructive text-sm" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" size="lg" className="rounded-full" disabled={loading}>
                {loading ? "Saving…" : "Join Prism cert waitlist"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
