// Chart palette for the admin dashboard.
//
// Status hues are shared with StatusBadge so a colour means the same thing
// everywhere (a pending order is amber in the badge, the donut, and the legend).
// These mid-tone 500-level hues read cleanly on both the light and dark card
// surfaces, so no per-theme swap is needed.

export const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B", // amber
  assigned: "#0EA5E9", // sky
  in_progress: "#8B5CF6", // violet
  completed: "#10B981", // emerald
  cancelled: "#F43F5E", // rose
};

export const WORKER_COLORS: Record<string, string> = {
  available: "#10B981", // emerald
  busy: "#F59E0B", // amber
  inactive: "#94A3B8", // slate
};

// Single-hue green ramp (from the app's --chart tokens) for ranked magnitude
// bars like Top categories — a sequential scale, not categorical.
export const GREEN_RAMP = [
  "#0F6E56",
  "#1D9E75",
  "#2B7A6A",
  "#5AA596",
  "#9ED5C7",
] as const;

export const PRIMARY = "#096C44";
