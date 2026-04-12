import type { WaitlistSource } from "@/lib/waitlist-types";

export type WaitlistSubmitPayload = {
  email: string;
  name?: string;
  certNumber?: string;
  targetAllocation?: string;
  notes?: string;
  source: WaitlistSource;
};

export async function submitWaitlist(payload: WaitlistSubmitPayload): Promise<void> {
  const res = await fetch("/api/v1/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as { ok?: boolean; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Could not save your signup.");
  }
}
