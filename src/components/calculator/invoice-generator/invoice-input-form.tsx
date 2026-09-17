"use client";

import { Plus, Trash2, Upload, X } from "lucide-react";
import { GUEST_CURRENCY_OPTIONS } from "@/constants";
import type { InvoiceInputFormProps } from "@/types";

export function InvoiceInputForm({
  invoice,
  onChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onLogoUpload,
  onRemoveLogo,
}: InvoiceInputFormProps) {
  return (
    <div className="space-y-6">
      {/* 1. Sender & Logo Section */}
      <div className="bg-card border border-border-hairline rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-hairline pb-4">
          <div>
            <h2 className="text-sm font-semibold text-on-surface">Your Business Details</h2>
            <p className="text-xs text-on-surface-variant">Who is issuing this invoice?</p>
          </div>

          {/* Logo Uploader */}
          <div className="flex items-center gap-3">
            {invoice.senderLogo ? (
              <div className="relative group w-14 h-14 rounded-xl border border-border-hairline bg-surface-container-lowest overflow-hidden flex items-center justify-center">
                <img
                  src={invoice.senderLogo}
                  alt="Business Logo"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={onRemoveLogo}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                  title="Remove Logo"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-border-hairline hover:border-primary bg-surface-container-lowest hover:bg-surface text-xs font-medium text-text-muted hover:text-on-surface cursor-pointer transition-all">
                <Upload size={13} />
                <span>Upload Logo</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                  onChange={onLogoUpload}
                />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Business Name</label>
            <input
              type="text"
              value={invoice.senderName}
              onChange={e => onChange("senderName", e.target.value)}
              placeholder="e.g. Atelier Forma"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface placeholder:text-text-muted/60 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Billing Email</label>
            <input
              type="email"
              value={invoice.senderEmail}
              onChange={e => onChange("senderEmail", e.target.value)}
              placeholder="e.g. billing@atelierforma.co"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface placeholder:text-text-muted/60 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-text-muted">Business Address</label>
            <textarea
              rows={2}
              value={invoice.senderAddress}
              onChange={e => onChange("senderAddress", e.target.value)}
              placeholder="Studio street address, city, state, postal code"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface placeholder:text-text-muted/60 focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-text-muted">Tax / VAT ID (Optional)</label>
            <input
              type="text"
              value={invoice.senderTaxId}
              onChange={e => onChange("senderTaxId", e.target.value)}
              placeholder="e.g. US-9284729-EIN or VAT Registration"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface placeholder:text-text-muted/60 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 2. Client & Invoice Metadata */}
      <div className="bg-card border border-border-hairline rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
        <div className="border-b border-border-hairline pb-4">
          <h2 className="text-sm font-semibold text-on-surface">Billed To & Terms</h2>
          <p className="text-xs text-on-surface-variant">Client information and invoice scheduling.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Client or Company Name</label>
            <input
              type="text"
              value={invoice.clientName}
              onChange={e => onChange("clientName", e.target.value)}
              placeholder="e.g. Eleanor Vance"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface placeholder:text-text-muted/60 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Client Email</label>
            <input
              type="email"
              value={invoice.clientEmail}
              onChange={e => onChange("clientEmail", e.target.value)}
              placeholder="e.g. eleanor@vancestudio.com"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface placeholder:text-text-muted/60 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-text-muted">Client Address</label>
            <textarea
              rows={2}
              value={invoice.clientAddress}
              onChange={e => onChange("clientAddress", e.target.value)}
              placeholder="Client billing address or office location"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface placeholder:text-text-muted/60 focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Invoice Number</label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={e => onChange("invoiceNumber", e.target.value)}
              placeholder="INV-001"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface placeholder:text-text-muted/60 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Currency</label>
            <select
              value={invoice.currency}
              onChange={e => onChange("currency", e.target.value as typeof invoice.currency)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface focus:border-primary focus:outline-none transition-colors cursor-pointer"
            >
              {GUEST_CURRENCY_OPTIONS.map(c => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Issue Date</label>
            <input
              type="date"
              value={invoice.issueDate}
              onChange={e => onChange("issueDate", e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Due Date</label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={e => onChange("dueDate", e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 3. Line Items Section */}
      <div className="bg-card border border-border-hairline rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
        <div className="flex items-center justify-between border-b border-border-hairline pb-4">
          <div>
            <h2 className="text-sm font-semibold text-on-surface">Items & Services</h2>
            <p className="text-xs text-on-surface-variant">Add line items with quantity and unit rates.</p>
          </div>
          <button
            type="button"
            onClick={onAddItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors"
          >
            <Plus size={13} />
            <span>Add Item</span>
          </button>
        </div>

        {/* Desktop Table Headers */}
        <div className="hidden md:grid md:grid-cols-12 gap-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider px-2">
          <div className="col-span-6">Description</div>
          <div className="col-span-2">Qty</div>
          <div className="col-span-2">Rate</div>
          <div className="col-span-1 text-right">Total</div>
          <div className="col-span-1" />
        </div>

        {/* Items List (Responsive Cards on Mobile, Table Rows on Desktop) */}
        <div className="space-y-3">
          {invoice.items.map((item, index) => (
            <div
              key={item.id}
              className="p-3.5 md:p-2 rounded-xl bg-surface-container-lowest border border-border-hairline md:border-transparent md:bg-transparent grid grid-cols-1 md:grid-cols-12 gap-2.5 md:gap-3 items-center"
            >
              {/* Description */}
              <div className="md:col-span-6">
                <span className="md:hidden text-[10px] font-bold text-text-muted uppercase block mb-1">
                  Item #{index + 1} Description
                </span>
                <input
                  type="text"
                  value={item.description}
                  onChange={e => onUpdateItem(item.id, "description", e.target.value)}
                  placeholder="Service description or item name"
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border-hairline text-xs text-on-surface placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-2 md:block md:col-span-2 gap-2">
                <div>
                  <span className="md:hidden text-[10px] font-bold text-text-muted uppercase block mb-1">
                    Qty
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => onUpdateItem(item.id, "quantity", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border-hairline text-xs text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Rate on mobile alongside Qty */}
                <div className="md:hidden">
                  <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">
                    Rate
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={e => onUpdateItem(item.id, "unitPrice", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border-hairline text-xs text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Rate (Desktop only) */}
              <div className="hidden md:block md:col-span-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={e => onUpdateItem(item.id, "unitPrice", Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border-hairline text-xs text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              {/* Line Total */}
              <div className="flex md:block md:col-span-1 justify-between items-center md:text-right pt-2 md:pt-0 border-t md:border-0 border-border-hairline">
                <span className="md:hidden text-xs font-semibold text-text-muted">Line Total:</span>
                <span className="text-xs font-mono font-semibold text-on-surface">
                  {Number(item.total || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Remove Action */}
              <div className="md:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  disabled={invoice.items.length <= 1}
                  className="p-1.5 rounded-lg text-text-muted hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Remove Item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Adjustments: Discount & Tax */}
        <div className="pt-4 border-t border-border-hairline grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-text-muted">Discount</label>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => onChange("discountType", "percentage")}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                    invoice.discountType === "percentage"
                      ? "bg-primary text-white"
                      : "text-text-muted hover:text-on-surface"
                  }`}
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => onChange("discountType", "fixed")}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                    invoice.discountType === "fixed"
                      ? "bg-primary text-white"
                      : "text-text-muted hover:text-on-surface"
                  }`}
                >
                  Flat
                </button>
              </div>
            </div>
            <input
              type="number"
              min="0"
              step="0.1"
              value={invoice.discountValue}
              onChange={e => onChange("discountValue", Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Tax Rate (%)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={invoice.taxRate}
              onChange={e => onChange("taxRate", Number(e.target.value))}
              placeholder="e.g. 7.5 or 20"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Notes & Payment Terms */}
      <div className="bg-card border border-border-hairline rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
        <div className="border-b border-border-hairline pb-4">
          <h2 className="text-sm font-semibold text-on-surface">Payment Notes & Terms</h2>
          <p className="text-xs text-on-surface-variant">
            Provide wire transfer details and settlement terms.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">
              Payment Instructions / Notes
            </label>
            <textarea
              rows={2}
              value={invoice.notes}
              onChange={e => onChange("notes", e.target.value)}
              placeholder="e.g. Bank wire instructions, payment reference instructions..."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Terms & Conditions</label>
            <textarea
              rows={2}
              value={invoice.terms}
              onChange={e => onChange("terms", e.target.value)}
              placeholder="e.g. Payment due within 14 calendar days. Late balances subject to interest."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-border-hairline text-xs text-on-surface focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
