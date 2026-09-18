"use client";

import { FileText, Home, Receipt, Settings, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";

export function VendorNotFoundView() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-between selection:bg-primary/20 selection:text-primary font-sans antialiased relative overflow-hidden">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <BrandLogo href="/vendor/overview" subtitle="Vendor Workspace" />

        <div className="flex items-center gap-2.5">
          <Link
            href="/vendor/overview"
            className="text-xs text-muted hover:text-on-surface font-medium transition-colors flex items-center gap-1.5 px-3.5 py-2 rounded-full hover:bg-surface-high text-decoration-none"
          >
            <Home size={13} />
            <span>Dashboard Overview</span>
          </Link>
          <Link
            href="/vendor/settings"
            className="text-xs bg-secondary text-white px-4 py-2 rounded-full font-medium hover:bg-primary transition-all shadow-xs flex items-center gap-1.5 text-decoration-none hover:shadow-sm"
          >
            <Settings size={12} />
            <span>Studio Settings</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-3xl mx-auto px-6 py-8 md:py-12 my-auto z-10 flex flex-col items-center text-center">
        {/* Architectural Watermark 404 & Hero Copy */}
        <div className="relative flex flex-col items-center text-center w-full max-w-xl mx-auto">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-sans text-[120px] sm:text-[160px] md:text-[200px] font-bold text-error/[0.04] select-none pointer-events-none -z-10 leading-none tracking-tight">
            404
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-error-container/40 border border-error/20 text-xs text-error mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            <span className="font-semibold tracking-wide">404 · Vendor Route Not Found</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-on-surface mb-3 leading-[1.18] text-center">
            Workspace module <br />
            <span className="text-primary font-normal">not found.</span>
          </h1>

          <p className="text-sm sm:text-base text-muted max-w-md mx-auto leading-relaxed mt-3 mb-10 text-center">
            The vendor workspace section you requested doesn&apos;t exist, has been moved, or is
            temporarily unavailable.
          </p>

          {/* Primary Action */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-7 w-full">
            <Link
              href="/vendor/overview"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-on-primary text-sm font-semibold px-6 py-2.5 rounded-full transition-all shadow-xs text-decoration-none"
            >
              <Home size={15} />
              <span>Return to Dashboard</span>
            </Link>
            <Link
              href="/vendor/leads"
              className="inline-flex items-center justify-center gap-2 bg-card text-on-surface border border-border-hairline hover:bg-surface-high text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-xs text-decoration-none"
            >
              <TrendingUp size={15} className="text-primary" />
              <span>View Leads</span>
            </Link>
          </div>
        </div>

        {/* Quick Nav Shortcuts Card */}
        <div className="bg-card border border-border-hairline rounded-2xl p-5 sm:p-6 shadow-card text-left max-w-xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-3">
            Quick Navigation
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <Link
              href="/vendor/leads"
              className="p-2.5 rounded-xl hover:bg-surface-low border border-transparent hover:border-border-hairline transition-all flex items-center gap-2 text-on-surface-variant hover:text-on-surface"
            >
              <Users size={14} className="text-primary" />
              <span className="font-medium">Leads</span>
            </Link>
            <Link
              href="/vendor/customers"
              className="p-2.5 rounded-xl hover:bg-surface-low border border-transparent hover:border-border-hairline transition-all flex items-center gap-2 text-on-surface-variant hover:text-on-surface"
            >
              <Users size={14} className="text-primary" />
              <span className="font-medium">Customers</span>
            </Link>
            <Link
              href="/vendor/invoices"
              className="p-2.5 rounded-xl hover:bg-surface-low border border-transparent hover:border-border-hairline transition-all flex items-center gap-2 text-on-surface-variant hover:text-on-surface"
            >
              <FileText size={14} className="text-primary" />
              <span className="font-medium">Invoices</span>
            </Link>
            <Link
              href="/vendor/expenses"
              className="p-2.5 rounded-xl hover:bg-surface-low border border-transparent hover:border-border-hairline transition-all flex items-center gap-2 text-on-surface-variant hover:text-on-surface"
            >
              <Receipt size={14} className="text-primary" />
              <span className="font-medium">Expenses</span>
            </Link>
            <Link
              href="/vendor/analytics"
              className="p-2.5 rounded-xl hover:bg-surface-low border border-transparent hover:border-border-hairline transition-all flex items-center gap-2 text-on-surface-variant hover:text-on-surface"
            >
              <TrendingUp size={14} className="text-primary" />
              <span className="font-medium">Analytics</span>
            </Link>
            <Link
              href="/vendor/settings"
              className="p-2.5 rounded-xl hover:bg-surface-low border border-transparent hover:border-border-hairline transition-all flex items-center gap-2 text-on-surface-variant hover:text-on-surface"
            >
              <Settings size={14} className="text-muted" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-border-hairline flex flex-wrap items-center justify-between gap-4 text-xs text-muted z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary" />
          <span>Vendor Workspace Active</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/vendor/overview" className="hover:text-on-surface transition-colors">
            Overview
          </Link>
          <span className="text-border-hairline">·</span>
          <Link href="/vendor/settings" className="hover:text-on-surface transition-colors">
            Settings
          </Link>
          <span className="text-border-hairline">·</span>
          <span>© 2026 Shopwus</span>
        </div>
      </footer>
    </div>
  );
}
