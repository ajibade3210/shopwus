/**
 * Unified Quiet Luxury & Executive Atelier Theme Colors
 * Shared single source of truth for categories, statuses, badges, and telemetry.
 */

export const THEME_PALETTE = {
  bronze: {
    color: "#0e526e",
    bg: "#e0f2fe",
    border: "#bae6fd",
    text: "#0369a1",
  },
  emerald: {
    color: "#2d8a74",
    bg: "#ebf8f2",
    border: "rgba(69, 182, 156, 0.25)",
    text: "#005244",
  },
  amber: {
    color: "#b45309",
    bg: "#fef3c7",
    border: "#fde68a",
    text: "#78350f",
  },
  slate: {
    color: "#475569",
    bg: "#f1f5f9",
    border: "#e2e8f0",
    text: "#1e293b",
  },
  terracotta: {
    color: "#c2410c",
    bg: "#fff7ed",
    border: "#ffedd5",
    text: "#9a3412",
  },
  rose: {
    color: "#d9383a",
    bg: "#feefef",
    border: "rgba(231, 111, 81, 0.25)",
    text: "#991b1b",
  },
  teal: {
    color: "#13678a",
    bg: "#e0f2fe",
    border: "#bae6fd",
    text: "#0369a1",
  },
  stone: {
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
    text: "#334155",
  },
} as const;

export const LEAD_STATUS_CONFIG = {
  new: {
    label: "New",
    ...THEME_PALETTE.amber,
  },
  contacted: {
    label: "Contacted",
    ...THEME_PALETTE.bronze,
  },
  converted: {
    label: "Converted",
    ...THEME_PALETTE.emerald,
  },
  lost: {
    label: "Lost",
    ...THEME_PALETTE.rose,
  },
} as const;

export const INVOICE_STATUS_CONFIG = {
  draft: {
    label: "Draft",
    ...THEME_PALETTE.slate,
  },
  sent: {
    label: "Sent",
    ...THEME_PALETTE.amber,
  },
  paid: {
    label: "Paid",
    ...THEME_PALETTE.emerald,
  },
  overdue: {
    label: "Overdue",
    ...THEME_PALETTE.rose,
  },
} as const;
