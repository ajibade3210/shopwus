"use client";

import { Tag } from "lucide-react";
import type { CheckoutOrderSummaryProps } from "@/types";
import { formatCurrency } from "@/utils/currency";

export function CheckoutOrderSummary({
  items,
  subtotal,
  deliveryFee,
  isFreeShipping,
  grandTotal,
  matchedZone: _matchedZone,
  deliveryType,
}: CheckoutOrderSummaryProps) {
  const totalItemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="space-y-4">
      {/* Order Summary Box */}
      <div className="bg-surface-low border border-border-hairline rounded-2xl p-3.5 space-y-2">
        <div className="flex justify-between font-semibold text-on-surface">
          <span>Items ({totalItemCount}):</span>
          <span className="font-sans font-bold tabular-nums">{formatCurrency(subtotal)}</span>
        </div>
        <div className="text-[11px] text-text-muted space-y-0.5 max-h-24 overflow-y-auto">
          {items.map(i => (
            <div key={i.id} className="flex justify-between">
              <span>
                {i.product.name} {i.variantTitle ? `(${i.variantTitle})` : ""} × {i.quantity}
              </span>
              <span className="font-sans font-bold tabular-nums text-on-surface">
                {formatCurrency(
                  (i.price !== undefined ? i.price : Number(i.product.price)) * i.quantity
                )}
              </span>
            </div>
          ))}
        </div>

        {isFreeShipping && (
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-on-tertiary-container bg-tertiary-container border border-tertiary/20 px-2 py-0.5 rounded-md">
            <Tag size={11} /> You unlocked Free Delivery!
          </div>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-surface-low border border-border-hairline rounded-2xl p-4 space-y-2 text-xs">
        <div className="flex justify-between text-text-muted">
          <span>Subtotal:</span>
          <span className="font-sans font-bold tabular-nums text-on-surface">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-text-muted">
          <span>Delivery ({deliveryType === "STORE_PICKUP" ? "Pickup" : "Shipping"}):</span>
          <span className="font-sans font-bold tabular-nums text-on-surface">
            {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
          </span>
        </div>
        <div className="pt-2 border-t border-border-hairline flex justify-between font-bold text-sm text-on-surface">
          <span>Grand Total:</span>
          <span className="font-sans font-bold tabular-nums">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
