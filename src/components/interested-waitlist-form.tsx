"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitWaitlist } from "@/lib/waitlist-client";

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export function InterestedWaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [targetAllocation, setTargetAllocation] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!email.trim() || !isValidEmail(email)) {
      setMessage("Enter a valid email.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await submitWaitlist({
        email: email.trim(),
        name: name.trim() || undefined,
        targetAllocation: targetAllocation.trim() || undefined,
        notes: notes.trim() || undefined,
        source: "interested",
      });
      setStatus("success");
      setName("");
      setEmail("");
      setTargetAllocation("");
      setNotes("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-xl border border-mantl-gold-border/50 bg-background/50 p-5 text-sm leading-relaxed"
        role="status"
      >
        <p className="text-foreground font-medium">You&apos;re on the list.</p>
        <p className="text-muted-foreground mt-2">
          We&apos;ll reach out when the next fund opens for allocation.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-full"
          onClick={() => setStatus("idle")}
        >
          Submit another email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
      <label className="text-sm">
        <span className="mb-1 block text-xs font-mono uppercase tracking-[2px] text-muted-foreground">
          Full name <span className="font-normal normal-case">(optional)</span>
        </span>
        <input
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-xs font-mono uppercase tracking-[2px] text-muted-foreground">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
        />
      </label>
      <label className="text-sm md:col-span-2">
        <span className="mb-1 block text-xs font-mono uppercase tracking-[2px] text-muted-foreground">
          Target allocation <span className="font-normal normal-case">(optional)</span>
        </span>
        <input
          name="targetAllocation"
          placeholder="$1,000"
          value={targetAllocation}
          onChange={(e) => setTargetAllocation(e.target.value)}
          className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
        />
      </label>
      <label className="text-sm md:col-span-2">
        <span className="mb-1 block text-xs font-mono uppercase tracking-[2px] text-muted-foreground">
          Notes <span className="font-normal normal-case">(optional)</span>
        </span>
        <textarea
          name="notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
          placeholder="Tell us what types of cards or eras you want exposure to."
        />
      </label>
      {message && status === "error" ? (
        <p className="text-destructive md:col-span-2 text-sm" role="alert">
          {message}
        </p>
      ) : null}
      <div className="md:col-span-2">
        <Button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-mantl-gold text-primary-foreground hover:opacity-90"
        >
          {status === "loading" ? "Joining…" : "Join waitlist"}
        </Button>
      </div>
    </form>
  );
}
