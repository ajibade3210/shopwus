"use client";

import { Plus, Trash2 } from "lucide-react";
import type { InvoiceItemsTableProps } from "@/types";
import { formatMoney } from "@/utils";

export function InvoiceItemsTable({
  items,
  currency,
  onItemChange,
  onAddItem,
  onRemoveItem,
}: InvoiceItemsTableProps) {
  return (
    <div className="space-y-3 pt-2">
      <label className="block text-[11px] font-bold text-muted uppercase tracking-wider">
        Items Details *
      </label>

      <div className="space-y-2.5">
        {items.map(item => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-surface-container p-3 rounded-2xl border border-border-hairline"
          >
            {/* Description */}
            <div className="flex-1">
              <input
                value={item.description}
                onChange={e => onItemChange(item.id, "description", e.target.value)}
                placeholder="Item description"
                className="w-full bg-surface-container-lowest border border-border-hairline rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-hidden focus:border-primary"
              />
            </div>

            {/* QTY */}
            <div className="w-20">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e => onItemChange(item.id, "quantity", Number(e.target.value) || 1)}
                placeholder="Qty"
                className="w-full bg-surface-container-lowest border border-border-hairline rounded-xl px-3 py-2 text-xs text-on-surface text-center focus:outline-hidden focus:border-primary"
              />
            </div>

            {/* Unit Price */}
            <div className="w-28">
              <input
                type="number"
                min="0"
                step="500"
                value={item.unitPrice}
                onChange={e => onItemChange(item.id, "unitPrice", Number(e.target.value) || 0)}
                placeholder="Cost"
                className="w-full bg-surface-container-lowest border border-border-hairline rounded-xl px-3 py-2 text-xs text-on-surface text-right focus:outline-hidden focus:border-primary"
              />
            </div>

            {/* Amount */}
            <div className="w-28 text-right px-2">
              <span className="text-xs font-mono font-bold text-on-surface">
                {formatMoney(item.amount, currency)}
              </span>
            </div>

            {/* Delete button */}
            <button
              type="button"
              onClick={() => onRemoveItem(item.id)}
              className="p-2 text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddItem}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors py-1 cursor-pointer"
      >
        <Plus size={14} />
        <span>Add Item</span>
      </button>
    </div>
  );
}
