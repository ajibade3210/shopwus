"use client";

import { useEffect, useState } from "react";
import { getBusinessProfile } from "@/lib/api";
import type { BusinessProfile, InvoicePreviewProps } from "@/types";
import { formatMoney } from "@/utils";

export function InvoicePreview({
  existingInvoice,
  customerName,
  billingAddress,
  issueDate,
  dueDate,
  paymentTerms,
  currency,
  items,
  subtotal,
  discount,
  taxRate,
  taxAmount,
  total,
  notes,
}: InvoicePreviewProps) {
  const [businessProfile, setBusinessProfile] = useState<Partial<BusinessProfile> | null>(null);

  useEffect(() => {
    getBusinessProfile()
      .then(profile => {
        if (profile) setBusinessProfile(profile);
      })
      .catch(() => {
        // Fallback gracefully to default placeholders
      });
  }, []);

  const hasHeaderBanner =
    businessProfile?.includeHeaderInInvoice !== false && Boolean(businessProfile?.emailHeaderUrl);

  return (
    <div className="lg:col-span-5 space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
          Live Preview
        </span>
      </div>

      {/* Stationery Card */}
      <div className="bg-card border border-border-hairline rounded-3xl p-6 sm:p-7 shadow-popover space-y-6 text-xs text-on-surface print:bg-white print:border-none print:shadow-none print:p-0 print:text-black">
        {/* Logo & Header */}
        {hasHeaderBanner ? (
          <div className="space-y-3 border-b border-border-hairline pb-4">
            <div className="w-full aspect-[10/3] rounded-2xl overflow-hidden border border-border-hairline bg-surface-container flex items-center justify-center">
              <img
                src={businessProfile!.emailHeaderUrl!}
                alt="Invoice Header Banner"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                {existingInvoice?.status?.toUpperCase() || "DRAFT"}
              </span>
              <span className="text-xs font-mono font-bold text-on-surface block">
                {existingInvoice?.invoiceNumber || "INV-2026-DRAFT"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between border-b border-border-hairline pb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-base shadow-xs overflow-hidden">
              {businessProfile?.logoUrl ? (
                <img
                  src={businessProfile.logoUrl}
                  alt="Business Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {businessProfile?.businessName
                    ? businessProfile.businessName.charAt(0).toUpperCase()
                    : "É"}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                {existingInvoice?.status?.toUpperCase() || "DRAFT"}
              </span>
              <span className="text-xs font-mono font-bold text-on-surface block">
                {existingInvoice?.invoiceNumber || "INV-2026-DRAFT"}
              </span>
            </div>
          </div>
        )}

        {/* Meta block */}
        <div className="grid grid-cols-3 gap-2 text-[11px] border-b border-border-hairline pb-4">
          <div>
            <span className="text-muted block">Issue Date</span>
            <b className="text-on-surface block mt-0.5">{issueDate || "---"}</b>
          </div>
          <div>
            <span className="text-muted block">Due Date</span>
            <b className="text-on-surface block mt-0.5">{dueDate || "---"}</b>
          </div>
          <div>
            <span className="text-muted block">Payment Terms</span>
            <b className="text-on-surface block mt-0.5">{paymentTerms || "---"}</b>
          </div>
        </div>

        {/* Billed By & Billed To */}
        <div className="space-y-3 border-b border-border-hairline pb-4 text-[11px]">
          <div>
            <span className="text-muted block">Billed by:</span>
            <b className="text-on-surface block mt-0.5">
              {businessProfile?.businessName || "Élan Atelier Limited"}
            </b>
            <span className="text-muted block text-[10px] mt-0.5">
              {businessProfile?.location || "Plot 14, Victoria Island Waterfront, Lagos, Nigeria"}
            </span>
          </div>

          <div>
            <span className="text-muted block">Billed to:</span>
            <b className="text-on-surface block mt-0.5">{customerName || "Customer Name"}</b>
            <span className="text-muted block text-[10px] mt-0.5">
              {billingAddress || "Billing Address"}
            </span>
          </div>
        </div>

        {/* Itemized List */}
        <div className="space-y-2 border-b border-border-hairline pb-4">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted pb-1">
            <span>Item</span>
            <div className="flex items-center gap-6">
              <span>QTY</span>
              <span>Amount</span>
            </div>
          </div>

          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between text-xs py-1">
              <div className="min-w-0 pr-2">
                <b className="text-on-surface block truncate">{item.description}</b>
                <span className="text-[10px] text-muted block">
                  {formatMoney(item.unitPrice, currency)} each
                </span>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <span className="text-xs font-mono text-muted">{item.quantity}</span>
                <span className="text-xs font-mono font-bold text-on-surface">
                  {formatMoney(item.amount, currency)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Calculation Summary */}
        <div className="space-y-1.5 text-xs border-b border-border-hairline pb-4">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="font-mono">{formatMoney(subtotal, currency)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount</span>
              <span className="font-mono">-{formatMoney(discount, currency)}</span>
            </div>
          )}
          {taxRate > 0 && (
            <div className="flex justify-between text-muted">
              <span>Tax ({taxRate}%)</span>
              <span className="font-mono">+{formatMoney(taxAmount, currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-primary pt-1.5 border-t border-border-hairline">
            <span>Total Due</span>
            <span className="font-mono">{formatMoney(total, currency)}</span>
          </div>
        </div>

        {/* Bank Details: Render only if configured on vendor profile */}
        {(businessProfile?.bankName ||
          businessProfile?.accountName ||
          businessProfile?.accountNumber) && (
          <div className="bg-surface-container rounded-2xl p-3.5 border border-border-hairline space-y-1 text-[11px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
              Remittance Banking Details
            </span>
            <div className="text-muted text-[10px] space-y-0.5 pt-0.5">
              {businessProfile.bankName && (
                <div>
                  Bank Name: <b className="text-on-surface">{businessProfile.bankName}</b>
                </div>
              )}
              {businessProfile.accountName && (
                <div>
                  Account Name: <b className="text-on-surface">{businessProfile.accountName}</b>
                </div>
              )}
              {businessProfile.accountNumber && (
                <div>
                  Account Number:{" "}
                  <b className="text-on-surface font-mono">{businessProfile.accountNumber}</b>
                </div>
              )}
            </div>
          </div>
        )}

        {notes && <div className="text-[10px] text-muted italic">Note: {notes}</div>}
      </div>
    </div>
  );
}
