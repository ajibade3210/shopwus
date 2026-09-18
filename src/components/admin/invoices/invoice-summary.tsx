"use client";

import type { InvoiceSummaryProps } from "@/types";
import { CURRENCY_SYMBOLS, formatMoney } from "@/utils";

export function InvoiceSummary({
  discount,
  taxRate,
  total,
  currency,
  notes,
  onDiscountChange,
  onTaxRateChange,
  onNotesChange,
}: InvoiceSummaryProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3 border-t border-border-hairline">
        <div>
          <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">
            Discount ({CURRENCY_SYMBOLS[currency]})
          </label>
          <input
            type="number"
            min="0"
            step="100"
            value={discount}
            onChange={e => onDiscountChange(Number(e.target.value) || 0)}
            className="w-full bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-hidden focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">
            Tax Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={taxRate}
            onChange={e => onTaxRateChange(Number(e.target.value) || 0)}
            className="w-full bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs text-on-surface focus:outline-hidden focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">
            Total Due
          </label>
          <div className="w-full bg-surface-container border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-primary">
            {formatMoney(total, currency)}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">
          Notes to Customer *
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          placeholder="Thank you for your trust. Please complete the payment before the due date."
          className="w-full bg-surface-container-lowest border border-border-hairline rounded-xl p-3.5 text-xs text-on-surface focus:outline-hidden focus:border-primary transition-all"
        />
      </div>
    </>
  );
}
