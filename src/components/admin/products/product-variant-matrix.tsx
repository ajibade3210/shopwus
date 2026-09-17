"use client";

import { Plus, Trash2, Zap } from "lucide-react";
import type { ProductVariantMatrixProps } from "@/types";

export function ProductVariantMatrix({
  options,
  variants,
  bulkPrice,
  bulkStock,
  bulkComparePrice,
  onAddOption,
  onRemoveOption,
  onOptionNameChange,
  onOptionValuesChange,
  onBulkPriceChange,
  onBulkStockChange,
  onBulkComparePriceChange,
  onApplyBulkPrice,
  onApplyBulkStock,
  onApplyBulkComparePrice,
  onUpdateVariantField,
}: ProductVariantMatrixProps) {
  return (
    <div className="space-y-4 p-4 bg-surface-container-low border border-border-hairline rounded-2xl">
      {/* 1. Option Definitions Builder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface">
            Options Setup
          </span>
          <button
            type="button"
            onClick={onAddOption}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus size={13} /> Add Another Option
          </button>
        </div>

        {options.map((opt, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center bg-card p-3 border border-border-hairline rounded-xl"
          >
            <div className="w-full sm:w-1/3">
              <label className="block text-[10px] font-bold text-muted uppercase mb-1">
                Option Name
              </label>
              <input
                type="text"
                placeholder="e.g., Size or Color"
                value={opt.name}
                onChange={e => onOptionNameChange(idx, e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-surface-container-lowest border border-border-hairline rounded-xl text-on-surface transition-all focus:border-primary focus:outline-hidden"
              />
            </div>

            <div className="w-full sm:flex-1">
              <label className="block text-[10px] font-bold text-muted uppercase mb-1">
                Option Values (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g., Small, Medium, Large"
                value={opt.values.join(", ")}
                onChange={e => onOptionValuesChange(idx, e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-surface-container-lowest border border-border-hairline rounded-xl text-on-surface transition-all focus:border-primary focus:outline-hidden"
              />
            </div>

            {options.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveOption(idx)}
                className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer self-end sm:self-center mt-2 sm:mt-4"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 2. Bulk Action Bar */}
      {variants.length > 0 && (
        <div className="pt-2 border-t border-border-hairline space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase tracking-wider">
            <Zap size={13} /> Bulk Apply to All ({variants.length} combinations)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-card p-3 border border-border-hairline rounded-xl">
            <div className="flex gap-1.5">
              <input
                type="number"
                placeholder="Price (₦)"
                value={bulkPrice}
                onChange={e => onBulkPriceChange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-surface-container-lowest border border-border-hairline rounded-xl font-sans tabular-nums text-on-surface focus:border-primary focus:outline-hidden"
              />
              <button
                type="button"
                onClick={onApplyBulkPrice}
                className="px-2.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-[11px] font-semibold rounded-xl shrink-0 cursor-pointer shadow-xs transition-colors"
              >
                Apply
              </button>
            </div>

            <div className="flex gap-1.5">
              <input
                type="number"
                placeholder="Stock Units"
                value={bulkStock}
                onChange={e => onBulkStockChange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-surface-container-lowest border border-border-hairline rounded-xl font-sans tabular-nums text-on-surface focus:border-primary focus:outline-hidden"
              />
              <button
                type="button"
                onClick={onApplyBulkStock}
                className="px-2.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-[11px] font-semibold rounded-xl shrink-0 cursor-pointer shadow-xs transition-colors"
              >
                Apply
              </button>
            </div>

            <div className="flex gap-1.5">
              <input
                type="number"
                placeholder="Compare Price"
                value={bulkComparePrice}
                onChange={e => onBulkComparePriceChange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-surface-container-lowest border border-border-hairline rounded-xl font-sans tabular-nums text-on-surface focus:border-primary focus:outline-hidden"
              />
              <button
                type="button"
                onClick={onApplyBulkComparePrice}
                className="px-2.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-[11px] font-semibold rounded-xl shrink-0 cursor-pointer shadow-xs transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Generated Matrix Table */}
      {variants.length > 0 && (
        <div className="overflow-x-auto border border-border-hairline rounded-2xl overflow-hidden bg-card">
          <table className="w-full text-left text-xs text-on-surface">
            <thead>
              <tr className="border-b border-border-hairline bg-surface-container-low text-muted font-semibold text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Variant Combination</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Price (NGN) *</th>
                <th className="py-2.5 px-3">Compare (NGN)</th>
                <th className="py-2.5 px-3">Stock Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {variants.map((v, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-on-surface">{v.title}</td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={v.sku || ""}
                      onChange={e => onUpdateVariantField(idx, "sku", e.target.value)}
                      placeholder="SKU"
                      className="w-24 px-2 py-1 text-xs bg-surface-container-lowest border border-border-hairline rounded-lg font-mono text-on-surface focus:border-primary focus:outline-hidden"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      required
                      value={v.price || ""}
                      onChange={e =>
                        onUpdateVariantField(idx, "price", Number.parseFloat(e.target.value) || 0)
                      }
                      className="w-24 px-2 py-1 text-xs bg-surface-container-lowest border border-border-hairline rounded-lg font-sans font-bold tabular-nums text-on-surface focus:border-primary focus:outline-hidden"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      value={v.compareAtPrice ?? ""}
                      onChange={e =>
                        onUpdateVariantField(
                          idx,
                          "compareAtPrice",
                          e.target.value ? Number.parseFloat(e.target.value) : null
                        )
                      }
                      placeholder="None"
                      className="w-24 px-2 py-1 text-xs bg-surface-container-lowest border border-border-hairline rounded-lg font-sans tabular-nums text-on-surface focus:border-primary focus:outline-hidden"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      value={v.inventoryCount ?? 0}
                      onChange={e =>
                        onUpdateVariantField(
                          idx,
                          "inventoryCount",
                          Number.parseInt(e.target.value, 10) || 0
                        )
                      }
                      className="w-20 px-2 py-1 text-xs bg-surface-container-lowest border border-border-hairline rounded-lg font-sans font-bold tabular-nums text-on-surface focus:border-primary focus:outline-hidden"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
