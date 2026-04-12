export function formatUsd(n: number, opts?: { maximumFractionDigits?: number }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: opts?.maximumFractionDigits ?? 2,
    minimumFractionDigits: opts?.maximumFractionDigits ?? 2,
  }).format(n);
}

export function formatPct(n: number, opts?: { maximumFractionDigits?: number }) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: opts?.maximumFractionDigits ?? 2,
    minimumFractionDigits: 0,
  }).format(n);
}

export function formatDateIso(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
