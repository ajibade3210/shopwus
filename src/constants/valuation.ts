import type { ValuationTier } from "@/types";

export const VALUATION_TIER_CONFIG: Record<
  ValuationTier,
  {
    label: string;
    description: string;
    minMultiple: number;
    maxMultiple: number;
    badgeColor: string;
    bg: string;
  }
> = {
  emerging: {
    label: "Emerging Business",
    description:
      "Early-stage business building initial market presence, steady customer orders, and lean operating costs.",
    minMultiple: 1.8,
    maxMultiple: 2.4,
    badgeColor: "#0284c7",
    bg: "#e0f2fe",
  },
  established: {
    label: "Growing Business",
    description:
      "Proven market traction with consistent monthly cashflow, healthy profit margins, and loyal repeat buyers.",
    minMultiple: 2.5,
    maxMultiple: 3.2,
    badgeColor: "#16a34a",
    bg: "#dcfce7",
  },
  flagship: {
    label: "Established Brand",
    description:
      "Strong brand equity commanding premium pricing, defensible profit margins, and high customer retention.",
    minMultiple: 3.3,
    maxMultiple: 4.2,
    badgeColor: "#9333ea",
    bg: "#f3e8ff",
  },
  haute: {
    label: "Scaled Enterprise",
    description:
      "High recurring revenue, established market authority, and premium valuation multiples.",
    minMultiple: 4.3,
    maxMultiple: 5.5,
    badgeColor: "#d97706",
    bg: "#fef3c7",
  },
};

export const VALUATION_GROWTH_LEVERS = [
  "Retain past clients: Increasing repeat buyers can add up to +0.8x to your valuation multiple.",
  "Protect net margins: Maintaining profit margins above 30% qualifies your business for higher valuation tiers.",
  "Centralize CRM records: Clean client histories eliminate buyer risk and streamline due diligence.",
  "Track receipts: Categorizing expenses ensures an audit-ready P&L statement for financing or sale.",
] as const;

export const VALUATION_HEALTH_MODAL_CONFIG = {
  title: "How Your Store Value is Calculated",
  subtitle:
    "Your valuation updates automatically based on 4 verified operational records. Keep these records updated for an accurate, audit-ready appraisal.",
  pillarsSectionTitle: "4 Operational Data Pillars",
  pillarsSectionSubtitle: "Synced in real time",
  heroEstimatedLabel: "Estimated Store Value",
  heroMultipleLabel: "SDE Multiple & Margin",
  accuracyPillLabel: "Live Records Synced",
  growthLeversTitle: "How to Increase Your Valuation",
  closeButtonLabel: "Done",
  auditChecklistButtonLabel: "Audit Checklist",
  auditChecklistTooltip: "View valuation accuracy checklist & formula",
} as const;

export const VALUATION_HEALTH_PILLARS = [
  {
    id: "invoices",
    eyebrow: "Revenue",
    title: "Paid Invoices",
    description:
      "Total sales recorded from paid invoices. Drives your annualized revenue run-rate (ARR).",
    actionLabel: "Manage Invoices",
    actionHref: "/invoices",
    iconName: "Receipt",
  },
  {
    id: "expenses",
    eyebrow: "Bookkeeping",
    title: "Operating Expenses",
    description:
      "Logged overhead, materials, and rent. Proves your take-home net profit margin to buyers.",
    actionLabel: "Log Expenses",
    actionHref: "/expenses",
    iconName: "CreditCard",
  },
  {
    id: "customers",
    eyebrow: "Retention",
    title: "Active CRM Clients",
    description:
      "Repeat customers in your database. Adds direct brand equity and boosts your profit multiple.",
    actionLabel: "View Clients",
    actionHref: "/vendor/customers",
    iconName: "Users",
  },
  {
    id: "leads",
    eyebrow: "Pipeline",
    title: "Inbound Inquiries",
    description: "Quotes and inquiry requests. Proves ongoing customer demand for your business.",
    actionLabel: "Manage Leads",
    actionHref: "/vendor/leads",
    iconName: "TrendingUp",
  },
] as const;

export const VALUATION_DISCLAIMER_NOTE =
  "This automated estimate is for informational planning only and does not constitute a certified appraisal or formal financial audit.";

export const SDE_TOOLTIP_TEXT =
  "Profit multiple is the standard benchmark used to value small-to-medium businesses based on annual net earnings.";

export const VALUATION_EMPTY_STATE = {
  eyebrow: "Valuation Benchmark",
  title: "Unlock Live Valuation",
  description:
    "Log your first paid invoices and operating expenses to calculate an automated real-time valuation model.",
  actionLabel: "View Invoices & Bookkeeping",
} as const;

export const INDUSTRY_SECTORS = {
  retail_ecommerce: {
    label: "Retail & E-Commerce",
    baseMultiple: 2.5,
    description: "Direct-to-consumer physical products, fashion, and retail inventory.",
  },
  luxury_services: {
    label: "Services & Consulting",
    baseMultiple: 2.8,
    description: "Specialized services, event planning, consulting, and client work.",
  },
  agency_consulting: {
    label: "Creative & Marketing Agency",
    baseMultiple: 2.6,
    description: "Design firms, marketing agencies, retainers, and professional services.",
  },
  events_hospitality: {
    label: "Events & Hospitality",
    baseMultiple: 2.2,
    description: "Event production, catering, decor, and event planning.",
  },
  digital_tech: {
    label: "Software & Digital Products",
    baseMultiple: 4.2,
    description: "Digital downloads, software platforms, memberships, and content.",
  },
  general_business: {
    label: "General Business & Trade",
    baseMultiple: 2.2,
    description: "Local merchant services, distribution, and commercial trade.",
  },
} as const;

export const DEFAULT_PUBLIC_VALUATION_INPUTS = {
  currency: "NGN" as const,
  industry: "luxury_services" as const,
  annualRevenue: 50000,
  annualExpenses: 40000,
  netAssets: 15000,
  customerRetentionRate: 50,
};

export const VALUATION_HOW_CALCULATED_SECTIONS = [
  {
    title: "1. Annual Cashflow × Multiple",
    description:
      "Buyers pay for predictable future earnings. Your annual profit after operating expenses is multiplied by an industry benchmark (typically 2.0x to 4.5x for service businesses and retail).",
    badge: "Core Driver",
  },
  {
    title: "2. Net Assets & Inventory",
    description:
      "Physical and liquid assets—cash in bank, tools, business inventory, and pending invoices minus debts—are added directly to your cashflow value.",
    badge: "Balance Sheet",
  },
  {
    title: "3. Repeat Client Loyalty",
    description:
      "Businesses with repeat clients and organized contact records command up to 40% higher purchase offers than businesses relying solely on one-off walk-ins.",
    badge: "Value Multiplier",
  },
] as const;

export const VALUATION_PURPOSE_GUIDES = [
  {
    id: "selling",
    title: "Command Top Value at Exit",
    eyebrow: "Selling Your Business",
    summary:
      "Prove your business is profitable, transferable, and runs on established systems rather than messy phone chats.",
    points: [
      "Prove predictable profit margins with clean, itemized invoice histories.",
      "Package an organized CRM customer database that transfers seamlessly on Day 1.",
      "Demonstrate high repeat client loyalty to eliminate buyer risk.",
    ],
  },
  {
    id: "buying",
    title: "Verify True Worth Before You Buy",
    eyebrow: "Buying an Existing Business",
    summary:
      "Uncover hidden liabilities, verify true take-home earnings, and assess fair asking price before making an offer.",
    points: [
      "Audit physical business assets against unrecorded supplier debts.",
      "Verify historical customer retention to ensure sales won't drop after founder departure.",
      "Analyze cashflow consistency across low and high seasons over a 12-month lookback.",
    ],
  },
  {
    id: "investing",
    title: "Unlock Bank Loans & Capital",
    eyebrow: "Growth & Funding",
    summary:
      "Present clean, audit-ready financial ledgers that prove your business creditworthiness to lenders and investors.",
    points: [
      "Demonstrate healthy profit margins and clear operating expense control.",
      "Show measurable growth levers (like increasing retention) to expand enterprise value.",
      "Keep digital receipts and P&L statements ready for grant and loan applications.",
    ],
  },
] as const;

export const VALUATION_SHOPWUS_BENEFITS = [
  {
    iconName: "Users",
    title: "1. Turn Contacts into a Transferable CRM",
    description:
      "When you sell or raise capital, buyers pay for organized client records. Shopwus replaces lost phone chats with a structured CRM tracking client history, budgets, and lifetime value.",
  },
  {
    iconName: "Send",
    title: "2. Re-Engage Clients with 1-Click Broadcasts",
    description:
      "Repeat customers deliver your highest profit margins. Send targeted WhatsApp and email announcements to past buyers to generate predictable, high-margin revenue.",
  },
  {
    iconName: "Receipt",
    title: "3. Maintain Audit-Ready Invoices & Books",
    description:
      "Messy records kill valuation during due diligence. Shopwus keeps your books audit-ready with multi-currency invoices, expense tracking, and real-time net profit analytics.",
  },
  {
    iconName: "Sparkles",
    title: "4. Command Premium Brand Positioning",
    description:
      "High-trust digital storefronts protect your margins. Your interactive 3D stationery card and verified social links establish immediate credibility and professional trust with every customer.",
  },
] as const;
