"use client";

import { RefreshCw, X } from "lucide-react";
import type { CustomerResendInvoiceModalProps } from "@/types";
import { formatMoney } from "@/utils";

export function CustomerResendInvoiceModal({
  invoice,
  onClose,
  onConfirm,
}: CustomerResendInvoiceModalProps) {
  if (!invoice) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border-hairline rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-popover space-y-4 relative font-sans"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-border-hairline">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
              Invoice Re-Dispatch
            </span>
            <h3 className="text-lg font-sans font-bold text-on-surface tracking-tight mt-0.5">
              Resend Invoice {invoice.invoiceNumber}?
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-muted hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="text-xs text-muted space-y-2">
          <p>
            Are you sure you want to re-send this invoice to{" "}
            <b className="text-on-surface">{invoice.customerName}</b>?
          </p>
          <div className="bg-surface-container-low p-3 rounded-xl border border-border-hairline space-y-1">
            <div className="flex justify-between">
              <span className="text-muted">Recipient:</span>
              <b className="text-on-surface">{invoice.customerEmail}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Total Due:</span>
              <b className="font-mono text-on-surface">{formatMoney(invoice.total)}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Due Date:</span>
              <span className="text-on-surface">{invoice.dueDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-hairline">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border-hairline text-xs font-semibold text-on-surface bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
              const success = await onConfirm(invoice.id);
              if (success) {
                onClose();
              }
            }}
            className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw size={13} />
            <span>Confirm Resend</span>
          </button>
        </div>
      </div>
    </div>
  );
}
