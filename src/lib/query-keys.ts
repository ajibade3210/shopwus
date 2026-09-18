import type { ExpenseCategory, InvoiceStatus, LeadFilterStatus, Timeframe } from "@/types";

export const queryKeys = {
  // Authentication & Session
  auth: {
    me: () => ["auth", "me"] as const,
  },

  // Studios & Profiles
  studios: {
    all: ["studios"] as const,
    me: () => ["studios", "me"] as const,
    featured: () => ["studios", "featured"] as const,
    bySlug: (slug: string) => ["studios", "slug", slug.toLowerCase()] as const,
    slugCheck: (slug: string) => ["studios", "slug-check", slug.toLowerCase()] as const,
  },

  // Products & Catalog
  products: {
    all: ["products"] as const,
    list: (params?: Record<string, unknown>) => ["products", "list", params ?? {}] as const,
    detail: (id: string) => ["products", "detail", id] as const,
    summary: () => ["products", "summary"] as const,
    categories: () => ["products", "categories"] as const,
    storefront: (slug: string, params?: Record<string, unknown>) =>
      ["products", "storefront", slug.toLowerCase(), params ?? {}] as const,
    storefrontDetail: (slug: string, productSlug: string) =>
      ["products", "storefront-detail", slug.toLowerCase(), productSlug.toLowerCase()] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    list: (params?: Record<string, unknown>) => ["orders", "list", params ?? {}] as const,
    board: () => ["orders", "board"] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
    summary: () => ["orders", "summary"] as const,
  },

  // Delivery & Logistics
  delivery: {
    all: ["delivery"] as const,
    zones: () => ["delivery", "zones"] as const,
    settings: () => ["delivery", "settings"] as const,
    storefront: (slug: string) => ["delivery", "storefront", slug.toLowerCase()] as const,
  },

  // Billing & Payouts
  billing: {
    all: ["billing"] as const,
    summary: () => ["billing", "summary"] as const,
    banks: () => ["billing", "banks"] as const,
  },

  // Customers
  customers: {
    all: ["customers"] as const,
    list: (query?: string, isActive?: boolean) =>
      ["customers", "list", { query: query ?? "", isActive }] as const,
    detail: (id: string) => ["customers", "detail", id] as const,
    summary: () => ["customers", "summary"] as const,
  },

  // Invoices
  invoices: {
    all: ["invoices"] as const,
    list: (status?: InvoiceStatus) => ["invoices", "list", { status }] as const,
    detail: (id: string) => ["invoices", "detail", id] as const,
    byCustomer: (customerId: string) => ["invoices", "customer", customerId] as const,
    summary: () => ["invoices", "summary"] as const,
  },

  // Expenses
  expenses: {
    all: ["expenses"] as const,
    list: (query?: string, category?: ExpenseCategory | "all") =>
      ["expenses", "list", { query: query ?? "", category: category ?? "all" }] as const,
    detail: (id: string) => ["expenses", "detail", id] as const,
    summary: () => ["expenses", "summary"] as const,
    categories: () => ["expenses", "categories"] as const,
  },

  // Leads
  leads: {
    all: ["leads"] as const,
    list: (query?: string, status?: LeadFilterStatus) =>
      ["leads", "list", { query: query ?? "", status }] as const,
    detail: (id: string) => ["leads", "detail", id] as const,
    summary: () => ["leads", "summary"] as const,
  },

  // Analytics & Dashboards
  analytics: {
    all: ["analytics"] as const,
    overview: (timeframe: Timeframe = "monthly") => ["analytics", "overview", timeframe] as const,
    revenue: () => ["analytics", "revenue"] as const,
    funnel: () => ["analytics", "funnel"] as const,
    servicesPerformance: () => ["analytics", "services-performance"] as const,
  },

  // Broadcasts
  broadcasts: {
    all: ["broadcasts"] as const,
    history: () => ["broadcasts", "history"] as const,
  },

  // Feedback & Feature Requests
  feedback: {
    all: ["feedback"] as const,
    list: () => ["feedback", "list"] as const,
  },

  // Blog
  blog: {
    all: ["blog"] as const,
    list: (category?: string) => ["blog", "list", { category: category ?? "all" }] as const,
    detail: (slug: string) => ["blog", "detail", slug] as const,
    related: (slug: string, limit?: number) => ["blog", "related", slug, limit ?? 2] as const,
  },
} as const;
