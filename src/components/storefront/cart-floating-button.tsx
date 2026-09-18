"use client";

import { ShoppingBag } from "lucide-react";
import type { CartFloatingButtonProps } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { useCart } from "./cart-context";

export function CartFloatingButton({
  buttonColor = "var(--primary)",
  radiusClass = "rounded-full",
}: CartFloatingButtonProps) {
  const { cartCount, subtotal, setIsCartOpen } = useCart();

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        style={{ backgroundColor: buttonColor }}
        className={`flex items-center gap-3 px-4 py-3 text-white shadow-card hover:shadow-popover hover:scale-105 active:scale-95 transition-all cursor-pointer ${radiusClass}`}
      >
        <div className="relative">
          <ShoppingBag size={18} />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white font-sans tabular-nums">
            {cartCount}
          </span>
        </div>
        <div className="text-left font-sans text-xs font-bold tabular-nums border-l border-white/20 pl-3">
          {formatCurrency(subtotal)}
        </div>
      </button>
    </div>
  );
}
