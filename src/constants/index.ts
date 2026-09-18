/**
 * Global Application Constants & Configuration
 * Single Source of Truth for storage keys, default configs, and routing rules.
 */

import { env } from "@/lib/env";
import type { BusinessType, PortfolioProject } from "@/types";

export const APP_CONFIG = {
  name: env.NEXT_PUBLIC_APP_NAME,
  defaultStudioPhone: env.NEXT_PUBLIC_DEFAULT_STUDIO_PHONE,
  defaultSlug: "atelier-forma",
  defaultLeadBudget: 25_000,
  defaultServiceAmount: 35_000,
  siteDomain: env.NEXT_PUBLIC_SITE_DOMAIN,
  baseUrl: env.APP_URL,
} as const;

export const STORAGE_KEYS = {
  profile: "shopwus_business_profile",
  leads: "shopwus_leads_data",
  session: "shopwus_auth_session",
  accessToken: "shopwus_access_token",
  refreshToken: "shopwus_refresh_token",
  autoQuoteModalSeen: "shopwus_auto_quote_modal_seen",
} as const;

export const AUTO_QUOTE_MODAL_DELAY_MS = 60_000; // 1 minute dwell time

export const CUSTOM_EVENTS = {
  leadsUpdated: "shopwus_leads_updated",
  customersUpdated: "shopwus_customers_updated",
  invoicesUpdated: "shopwus_invoices_updated",
  expensesUpdated: "shopwus_expenses_updated",
  profileUpdated: "shopwus_profile_updated",
  authChanged: "shopwus_auth_changed",
  broadcastSent: "shopwus_broadcast_sent",
  valuationUpdated: "shopwus_valuation_updated",
} as const;

export const SOCIAL_PLATFORMS = [
  "instagram",
  "facebook",
  "linkedin",
  "tiktok",
  "x",
  "youtube",
  "whatsapp",
  "threads",
  "pinterest",
  "website",
] as const;

export const SOCIAL_BASE_URLS = {
  instagram: "instagram.com/",
  facebook: "facebook.com/",
  linkedin: "linkedin.com/in/",
  tiktok: "tiktok.com/@",
  x: "x.com/",
  youtube: "youtube.com/@",
  whatsapp: "wa.me/",
  threads: "threads.com/",
  pinterest: "pinterest.com/",
  website: "https://",
} as const;

export const SOCIAL_PREFIX_MAP: Record<string, string> = SOCIAL_BASE_URLS;

export const DEFAULT_PORTFOLIO_IMAGE =
  "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80";

export const DEFAULT_NEW_PROJECT: Partial<PortfolioProject> = {
  title: "",
  category: "Brand Identity",
  location: "Lagos & London",
  description: "",
  image: "",
  gallery: [],
  client: "",
  year: "2026",
};

/** Initial number of projects visible in the public studio before "View More". */
export const INITIAL_VISIBLE_PORTFOLIO_COUNT = 6;

/** Maximum showcase projects allowed per membership tier. */
export const TIER_PROJECT_LIMITS = {
  starter: 3,
  unlimited: 10,
} as const;

export const MAX_PORTFOLIO_PROJECTS = TIER_PROJECT_LIMITS.unlimited; // 10
export const STARTER_PORTFOLIO_PROJECTS = TIER_PROJECT_LIMITS.starter; // 3

/** Maximum showcase categories allowed per membership tier. */
export const TIER_CATEGORY_LIMITS = {
  starter: 3,
  unlimited: 5,
} as const;

export const MAX_PORTFOLIO_CATEGORIES = TIER_CATEGORY_LIMITS.unlimited; // 5
export const STARTER_PORTFOLIO_CATEGORIES = TIER_CATEGORY_LIMITS.starter; // 3

/** Maximum character length for custom portfolio category names. */
export const MAX_CATEGORY_NAME_LENGTH = 30;

/** Maximum services allowed per membership tier. */
export const TIER_SERVICE_LIMITS = {
  starter: 3,
  unlimited: 6,
} as const;

export const MAX_SERVICES = TIER_SERVICE_LIMITS.unlimited; // 6
export const STARTER_SERVICES = TIER_SERVICE_LIMITS.starter; // 3

/** Maximum character length for custom service names. */
export const MAX_SERVICE_NAME_LENGTH = 30;

export const DEFAULT_PORTFOLIO_CATEGORIES = [
  "Brand Identity",
  "UI/UX & Product",
  "Packaging & Print",
  "Art Direction",
] as const;

export const DEFAULT_FOOTER_EYEBROW = "Begin Your Journey";
export const DEFAULT_FOOTER_TITLE = "Ready to Create Something Extraordinary?";
export const DEFAULT_FOOTER_DESCRIPTION =
  "Tell us what you're planning and we'll get back to you to schedule an initial consultation with our creative directors.";

export const MAX_FOOTER_EYEBROW_LENGTH = 50;
export const MAX_FOOTER_TITLE_LENGTH = 100;
export const MAX_FOOTER_DESC_LENGTH = 300;

/** Default fallback business type across the app. */
export const DEFAULT_BUSINESS_TYPE = "sales" as const;

/**
 * Maps each BusinessType to its public-facing CTA button label.
 * Used on the studio navbar, consultation modal, and floating action buttons.
 */
export const BUSINESS_TYPE_CTA_MAP = {
  service: "Book a Consultation",
  sales: "Make an Order",
  retail: "Buy Here",
  ecommerce: "Place Order",
} as const;

/** Human-readable one-word labels for BusinessType selectors in Settings. */
export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  service: "Service",
  sales: "Sales",
  retail: "Retail",
  ecommerce: "Ecommerce",
};

/** Modal eyebrow tag above the title. */
export const BUSINESS_TYPE_MODAL_EYEBROW = {
  service: "Inquiry Desk",
  sales: "Order Desk",
  retail: "Shop Desk",
  ecommerce: "Order Desk",
} as const;

/** Modal subtitle sentence below the title. */
export const BUSINESS_TYPE_MODAL_SUBTITLE = {
  service: "about your project, service requirement, or upcoming occasion.",
  sales: "about your custom order, specifications, or bespoke requirements.",
  retail: "about what you'd like to buy, pick up, or arrange in-store.",
  ecommerce: "what you'd like to order and we'll get it delivered to you.",
} as const;

/** Label for the "what do you need" select in the modal. */
export const BUSINESS_TYPE_ITEM_LABEL = {
  service: "Service Needed",
  sales: "Product / Item",
  retail: "Product / Item",
  ecommerce: "Product / Item",
} as const;

/** Label for the date field in the modal. */
export const BUSINESS_TYPE_DATE_LABEL = {
  service: "Estimated Date",
  sales: "Delivery Date",
  retail: "Collection Date",
  ecommerce: "Delivery Date",
} as const;

/** Placeholder for the message/details textarea. */
export const BUSINESS_TYPE_MESSAGE_PLACEHOLDER = {
  service: "Share details about your requirements, timeline, quantity, or aesthetic preferences...",
  sales: "Share your order details, quantities, specifications, or any customisation notes...",
  retail: "List the items, quantities, and any special requests...",
  ecommerce: "List the items, quantities, and your delivery address or special instructions...",
} as const;

/** Submit button label inside the modal. */
export const BUSINESS_TYPE_SUBMIT_LABEL = {
  service: "Submit Consultation Request",
  sales: "Submit Order Request",
  retail: "Submit Purchase Request",
  ecommerce: "Submit Order",
} as const;

/** Per-service card action link label in the services section. */
export const BUSINESS_TYPE_SERVICE_ACTION = {
  service: "Inquire",
  sales: "Order",
  retail: "Buy",
  ecommerce: "Order",
} as const;

/** Section heading and navigation label for the services/products catalog. */
export const BUSINESS_TYPE_SERVICES_SECTION_TITLE = {
  service: "Services",
  sales: "Products",
  retail: "Products",
  ecommerce: "Products",
} as const;

/** Section heading and navigation label for the gallery/portfolio. */
export const BUSINESS_TYPE_PORTFOLIO_SECTION_TITLE = {
  service: "Portfolio",
  sales: "Collection",
  retail: "Gallery",
  ecommerce: "Showcase",
} as const;

export * from "./blog";
export * from "./delivery";
export * from "./expense";
export * from "./guest-invoice";
export * from "./invoice";
export * from "./landing";
export * from "./order";
export * from "./theme";
export * from "./valuation";
