// Formatting helpers for the admin panel.
//
// The API returns money as decimal STRINGS ("512000.00") — never do math on
// the raw string. Parse with toNumber(), display with formatPkr().

export function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

const pkrFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

/** "512000.00" -> "Rs 512,000" */
export function formatPkr(value: string | number | null | undefined): string {
  return `Rs ${pkrFormatter.format(toNumber(value))}`;
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-PK", {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat("en-PK", {
  dateStyle: "medium",
});

export function formatDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateTimeFormatter.format(d);
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFormatter.format(d);
}
