"use client";

import { ArrowLeft, ArrowRight, Eye, PenLine } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SiteFooter } from "@/components/landing/site-footer";
import { BrandLogo } from "@/components/shared/brand-logo";
import { DEFAULT_GUEST_INVOICE } from "@/constants";
import {
  calculateInvoiceTotals,
  checkGuestQuota,
  clearDraftInvoice,
  downloadVectorPdfInvoice,
  loadDraftInvoice,
  recordGuestInvoiceGeneration,
  saveDraftInvoice,
} from "@/services/api";
import type { GuestInvoiceData, GuestInvoiceItem, MobileTab, QuotaExceededReason } from "@/types";
import { InvoiceActionBar } from "./invoice-generator/invoice-action-bar";
import { InvoiceInputForm } from "./invoice-generator/invoice-input-form";
import { InvoicePreviewCard } from "./invoice-generator/invoice-preview-card";
import { InvoiceQuotaModal } from "./invoice-generator/invoice-quota-modal";

export function InvoiceGeneratorPage() {
  const [invoice, setInvoice] = useState<GuestInvoiceData>(DEFAULT_GUEST_INVOICE);
  const [activeTab, setActiveTab] = useState<MobileTab>("edit");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [quotaReason, setQuotaReason] = useState<QuotaExceededReason>("daily_exceeded");
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Load saved draft on mount
  useEffect(() => {
    const saved = loadDraftInvoice();
    if (saved) {
      setInvoice(saved);
    }
  }, []);

  // Calculate financial totals
  const totals = useMemo(() => {
    return calculateInvoiceTotals(invoice);
  }, [invoice]);

  // Update a single invoice field and persist
  const handleFieldChange = useCallback(
    <K extends keyof GuestInvoiceData>(field: K, value: GuestInvoiceData[K]) => {
      setInvoice(prev => {
        const updated = { ...prev, [field]: value };
        saveDraftInvoice(updated);
        return updated;
      });
    },
    []
  );

  // Add a line item
  const handleAddItem = useCallback(() => {
    setInvoice(prev => {
      const newItem: GuestInvoiceItem = {
        id: `item-${Date.now()}`,
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      };
      const updated = { ...prev, items: [...prev.items, newItem] };
      saveDraftInvoice(updated);
      return updated;
    });
  }, []);

  // Update line item details
  const handleUpdateItem = useCallback(
    (id: string, field: keyof GuestInvoiceItem, value: string | number) => {
      setInvoice(prev => {
        const updatedItems = prev.items.map(item => {
          if (item.id !== id) return item;
          const updatedItem = { ...item, [field]: value };
          const qty = Number(updatedItem.quantity) || 0;
          const price = Number(updatedItem.unitPrice) || 0;
          updatedItem.total = Math.round(qty * price * 100) / 100;
          return updatedItem;
        });
        const updated = { ...prev, items: updatedItems };
        saveDraftInvoice(updated);
        return updated;
      });
    },
    []
  );

  // Remove a line item
  const handleRemoveItem = useCallback((id: string) => {
    setInvoice(prev => {
      if (prev.items.length <= 1) return prev;
      const updated = { ...prev, items: prev.items.filter(i => i.id !== id) };
      saveDraftInvoice(updated);
      return updated;
    });
  }, []);

  // Logo upload handler (100% client-side Base64 with 2MB size cap)
  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        return;
      }

      const reader = new FileReader();
      reader.onload = event => {
        const result = event.target?.result as string;
        if (result) {
          handleFieldChange("senderLogo", result);
        }
      };
      reader.readAsDataURL(file);
    },
    [handleFieldChange]
  );

  const handleRemoveLogo = useCallback(() => {
    handleFieldChange("senderLogo", null);
  }, [handleFieldChange]);

  // Reset form to defaults
  const handleReset = useCallback(() => {
    clearDraftInvoice();
    setInvoice(DEFAULT_GUEST_INVOICE);
  }, []);

  // Direct PDF download with gentle quota check
  const handleDownloadPdf = useCallback(() => {
    const quotaCheck = checkGuestQuota();
    if (!quotaCheck.allowed) {
      setQuotaReason(quotaCheck.reason || "daily_exceeded");
      setIsQuotaModalOpen(true);
      return;
    }

    setIsDownloading(true);
    try {
      recordGuestInvoiceGeneration();
      downloadVectorPdfInvoice(invoice, totals);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsDownloading(false);
    }
  }, [invoice, totals]);

  // Dedicated Print action with gentle quota check
  const handlePrint = useCallback(() => {
    const quotaCheck = checkGuestQuota();
    if (!quotaCheck.allowed) {
      setQuotaReason(quotaCheck.reason || "daily_exceeded");
      setIsQuotaModalOpen(true);
      return;
    }

    recordGuestInvoiceGeneration();
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      {/* 1. Header Navigation */}
      <header className="border-b border-border-hairline bg-surface/90 backdrop-blur-md sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-on-surface transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </a>
            <span className="text-border-hairline hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-text-muted">
              <span>Resources</span>
              <span>/</span>
              <span className="text-on-surface font-bold">Free Invoice Generator</span>
            </div>
          </div>

          <BrandLogo className="public-logo" />

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-xs font-semibold text-text-muted hover:text-on-surface hidden sm:inline"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="bg-primary hover:bg-primary-hover text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </header>

      {/* 2. Main Studio Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 print:p-0 print:m-0 print:max-w-none">
        {/* Hero Section (Print Hidden) */}
        <section className="text-center max-w-3xl mx-auto space-y-3 print:hidden">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary-container text-on-tertiary-container border border-tertiary/20">
            Free Studio Tool
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-on-surface tracking-tight leading-tight">
            Create client-ready invoices in 60 seconds.
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Craft polished, print-ready invoices directly in your browser. No account required, no
            watermarks to pay for, and no hidden fees.
          </p>
        </section>

        {/* Mobile Tab Switcher (Visible only on < md screens, print hidden) */}
        <div className="md:hidden flex rounded-2xl bg-card p-1 border border-border-hairline shadow-2xs print:hidden">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "edit"
                ? "bg-primary text-white shadow-xs"
                : "text-text-muted hover:text-on-surface"
            }`}
          >
            <PenLine size={14} />
            <span>Edit Invoice</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "preview"
                ? "bg-primary text-white shadow-xs"
                : "text-text-muted hover:text-on-surface"
            }`}
          >
            <Eye size={14} />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Universal Action Bar (Sticky & accessible across both desktop and mobile tabs) */}
        <div className="print:hidden">
          <InvoiceActionBar
            onDownloadPdf={handleDownloadPdf}
            onPrint={handlePrint}
            onReset={handleReset}
            isDownloading={isDownloading}
          />
        </div>

        {/* 2-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Inputs (Shown on Desktop OR when activeTab === "edit" on Mobile) */}
          <div
            className={`lg:col-span-7 print:hidden ${
              activeTab === "edit" ? "block" : "hidden lg:block"
            }`}
          >
            <InvoiceInputForm
              invoice={invoice}
              onChange={handleFieldChange}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onRemoveItem={handleRemoveItem}
              onLogoUpload={handleLogoUpload}
              onRemoveLogo={handleRemoveLogo}
            />
          </div>

          {/* Live Stationery Preview Card (Shown on Desktop OR when activeTab === "preview" on Mobile) */}
          <div
            className={`lg:col-span-5 lg:sticky lg:top-24 ${
              activeTab === "preview" ? "block" : "hidden lg:block"
            } print:block print:w-full print:static`}
          >
            <InvoicePreviewCard invoice={invoice} totals={totals} cardRef={cardRef} />
          </div>
        </div>
      </main>

      {/* 3. Site Footer (Print Hidden) */}
      <div className="print:hidden">
        <SiteFooter />
      </div>

      {/* 4. Conversion Quota Modal (Triggered on 4th daily or 7th monthly generation) */}
      <InvoiceQuotaModal
        isOpen={isQuotaModalOpen}
        reason={quotaReason}
        onClose={() => setIsQuotaModalOpen(false)}
      />
    </div>
  );
}
