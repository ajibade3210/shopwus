# DESIGN.md — Shopwus Design System Ground Truth

This document serves as the absolute ground truth for all UI, visual design, typography, color palettes, and component patterns across the Shopwus codebase. Every AI agent and developer must read and adhere to these guidelines before generating or modifying UI code.

---

## 1. Aesthetic Direction & Brand DNA
* **System Name:** Analytics & Enterprise Intelligence UI
* **Style:** High-Density Precision Fintech / Enterprise Intelligence.
* **Mood:** Cool slate ambient clarity, oceanic cyan accents, high-contrast dark accents, fresh mint health indicators, coral critical alerts, and deliberate geometric restraint.
* **Avoid:** Muddy warm-paper tones, Playfair serif on operational UI, generic flat rainbow SaaS palettes, ambiguous progress meters, arbitrary hex code debt, and decorated visual clutter.

---

## 2. Color Palette & Semantic Tokens

### Strict Tailwind CSS Utility Standard
Shopwus strictly follows a **Tailwind CSS utility-first** architecture with Tailwind v4 `@theme` integration (`src/app/globals.css`).
- **NEVER** hardcode arbitrary hex codes (`bg-[#...]`, `text-[#...]`, `border-[#...]`) in component JSX.
- All layouts, sidebars, headers, cards, grids, buttons, and tables must be composed directly in JSX using semantic Tailwind utility tokens.
- Use standard Tailwind breakpoint modifiers (`sm:`, `md:`, `lg:`, `xl:`, `max-lg:`) instead of arbitrary media queries.

### Semantic Utility Tokens (`@theme`)

| Token | Utility Class | Value / Hex | Purpose |
| :--- | :--- | :--- | :--- |
| `surface` | `bg-surface` | `#f7fafe` | Global viewport background (cool slate) |
| `surface-low` | `bg-surface-low` | `#f1f4f8` | Sidebar, table headers, and well boxes |
| `surface-high` | `bg-surface-high` | `#e5e8ec` | Interactive chips, count badges, hover pills |
| `card` | `bg-card` | `#ffffff` | Elevated metric cards, panels, and modals |
| `border-hairline` | `border-border-hairline` | `rgba(203, 213, 225, 0.7)` | Razor-thin structural borders and table lines |
| `primary` | `bg-primary`, `text-primary` | `#13678a` | Oceanic cyan primary action and focus indicator |
| `primary-hover` | `hover:bg-primary-hover` | `#0e526e` | Deep oceanic cyan hover state |
| `secondary` | `bg-secondary`, `text-secondary` | `#476274` | Cool slate secondary accent |
| `secondary-container` | `bg-secondary-container` | `#cae6fc` | Subtle cyan pill background for customer badges |
| `tertiary` | `bg-tertiary`, `text-tertiary` | `#005244` | Deep forest accent |
| `tertiary-container` | `bg-tertiary-container` | `#81efd2` | Fresh mint accent container |
| `on-surface` | `text-on-surface` | `#181c1f` | Primary dark headings, titles, and metrics |
| `on-surface-variant` | `text-on-surface-variant` | `#40484d` | Secondary text, table descriptions, subtitles |
| `outline` | `text-outline`, `border-outline` | `#70787e` | Muted icons, empty state placeholders |
| `error` | `bg-error`, `text-error` | `#ba1a1a` | Coral red critical alerts and archive confirmations |

---

## 3. Typography Standard

* **Primary Font Family (`font-sans`):**
  * Configured globally via `next/font/google` as **Plus Jakarta Sans**.
  * Used across all headings, body text, table cells, metric labels, and interactive buttons.
* **Monospace Font Family (`font-mono`):**
  * Configured globally via `next/font/google` as **JetBrains Mono**.
  * Used strictly for SKUs, transaction IDs, invoice numbers, account codes, and timestamps.
* **⚠️ STRICT NUMERAL RULE:**
  * All currency figures (`₦`, `$`, `£`), financial amounts, metric values, and inventory counts **MUST** use `font-sans font-bold tracking-tight tabular-nums`.
  * **NEVER** use serif fonts or unformatted fonts for financial figures or currencies. Tabular numbers prevent numeral jitter and misalignment across rows.

---

## 4. Status Indicators (`<StatusBadge />`)

All lifecycle and operational statuses use `<StatusBadge status={status} />` (`src/components/admin/common/status-badge.tsx`):

| Meaning / Status Group | Tone | Pill Background | Text Color | Border | Glyph |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Paid, Active, Converted, Completed** | Fresh Mint | `#ebf8f2` | `#2d8a74` | `#81efd2`/40 | `↗` |
| **Overdue, Cancelled, Out of Stock, Critical** | Coral Red | `#feefef` | `#d9383a` | `#ffb4ab`/40 | `↘` |
| **Pending, Draft, Sent, Contacted** | Neutral Slate | `var(--color-surface-high)` | `var(--color-on-surface-variant)` | `var(--color-border-hairline)` | `•` |

---

## 5. Standard Component Patterns

### A. Metric Cards (`<MetricCard>`, `<Metric>`)
* **Standard Variant:** `bg-card border border-border-hairline rounded-xl p-5 shadow-card hover:border-primary/40 transition-all flex flex-col justify-between`.
* **Hero Radial Variant:** Features an inset SVG radial progress ring (`stroke="#13678A"`, `track="rgba(19, 103, 138, 0.15)"`) for primary store telemetry.
* **Numerals:** `text-2xl font-bold font-sans tabular-nums text-on-surface tracking-tight`.

### B. Charting Standards (Recharts / SVG)
* **SVG Color Safety:** SVG elements and Recharts do not reliably resolve CSS variables in `stroke` or `fill` across canvas/print contexts. Always use explicit theme constants:
  ```ts
  export const CHART_THEME = {
    primary: "#13678A",
    secondary: "#012030",
    tertiary: "#45B69C",
    grid: "#E2E8F0",
    textMuted: "#64748B",
    tooltipBg: "#012030",
  };
  ```
* **Tooltips:** Dark high-contrast tooltips (`bg-[#012030] text-white rounded-lg shadow-hero`).

### C. Buttons & Controls
* **Primary Button:**
  ```tsx
  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 sm:py-2.5 rounded-md text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
  ```
  * Border radius is strictly 8px (`rounded-md`).
  * Smooth transition without jump or translate bounce.
* **Secondary / Card Button:**
  ```tsx
  className="inline-flex items-center justify-center gap-1.5 bg-card hover:bg-surface-low text-on-surface border border-border-hairline hover:border-outline px-3.5 py-2 rounded-md text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
  ```

### D. Table Standards (`.table-card`)
* **Card Envelope:** `bg-card border border-border-hairline rounded-xl shadow-card overflow-hidden`.
* **Header (`th`):** `bg-surface-low text-on-surface-variant font-bold text-[10px] uppercase tracking-wider border-b border-border-hairline`.
* **Row (`tr`):** `hover:bg-surface-low/50 transition-colors border-b border-border-hairline`.
* **Search Input:** `bg-surface-low border border-border-hairline rounded-md text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20`.

---

## 6. Zero Hex Debt Rule

To maintain enterprise code quality and prevent theme regression:
1. **Never introduce hardcoded hex colors in JSX:** Do not use `bg-[#f7fafe]`, `text-[#181c1f]`, or `border-[#ded7cb]` in React components.
2. **Use Semantic Tokens:** Always map to `bg-surface`, `bg-card`, `bg-surface-low`, `border-border-hairline`, `text-on-surface`, `text-on-surface-variant`, and `text-primary`.
3. **Storefront Boundaries:** The vendor management portal (`/vendor/*`) uses the Enterprise Intelligence UI. Buyer-facing storefronts (`/[slug]`) and checkout pipelines are decoupled to preserve brand isolation.