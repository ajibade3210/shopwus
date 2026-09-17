"use client";

import {
  AlertCircle,
  ArrowRight,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { validateStorefrontCartStock } from "@/services/api/product.service";
import type { CartDrawerProps, StockValidationIssue } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { useCart } from "./cart-context";
import { CheckoutModal } from "./checkout-modal";

export function CartDrawer({ slug, studioName, buttonColor, radiusClass }: CartDrawerProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [stockIssues, setStockIssues] = useState<StockValidationIssue[]>([]);

  if (!isCartOpen) return null;

  const handleOpenCheckout = async () => {
    if (items.length === 0) return;
    setStockIssues([]);
    setIsValidating(true);

    try {
      const validation = await validateStorefrontCartStock(slug, {
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId || undefined,
          quantity: i.quantity,
        })),
      });

      if (!validation.isValid && validation.issues.length > 0) {
        setStockIssues(validation.issues);
        return;
      }

      setIsCheckoutOpen(true);
    } catch {
      setIsCheckoutOpen(true);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setIsCartOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-card shadow-popover flex flex-col justify-between border-l border-border-hairline animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-border-hairline flex items-center justify-between bg-surface-low">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-on-surface" />
                <h3 className="text-sm font-bold text-on-surface">Your Shopping Bag</h3>
                <span className="text-[11px] font-sans font-bold tabular-nums bg-surface-lowest border border-border-hairline text-on-surface px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stock Warning Notice */}
            {stockIssues.length > 0 && (
              <div className="p-4 bg-error-container border-b border-error/20 text-xs text-on-error-container space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle size={15} className="text-error shrink-0" />
                  <span>Inventory update before checkout:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                  {stockIssues.map((issue, idx) => (
                    <li key={idx}>
                      <b>{issue.productName}</b>:{" "}
                      {issue.issue === "OUT_OF_STOCK"
                        ? "Out of stock"
                        : `Only ${issue.availableQty} available`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-text-muted">
                  <Package size={40} className="mx-auto mb-3 text-border-subtle" />
                  <p className="text-sm font-semibold text-on-surface">Your bag is empty</p>
                  <p className="text-xs mt-1">Browse our products and add items to your cart.</p>
                </div>
              ) : (
                items.map(item => {
                  const itemPrice =
                    item.price !== undefined ? item.price : Number(item.product.price);
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3.5 p-3.5 rounded-2xl border border-border-hairline bg-card shadow-card"
                    >
                      <div className="w-16 h-16 rounded-xl bg-surface-low overflow-hidden border border-border-hairline shrink-0 flex items-center justify-center">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={20} className="text-text-muted" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-on-surface truncate">
                              {item.product.name}
                            </h4>
                            {item.variantTitle && (
                              <p className="text-[11px] font-semibold text-primary">
                                {item.variantTitle}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-text-muted hover:text-error transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="text-xs font-sans font-bold tabular-nums text-on-surface mt-1.5">
                          {formatCurrency(itemPrice * item.quantity)}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-border-hairline rounded-lg bg-surface-low">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs text-text-muted hover:text-on-surface hover:bg-surface-container rounded-l-lg transition-colors cursor-pointer"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-2.5 text-xs font-sans font-bold tabular-nums text-on-surface">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-text-muted hover:text-on-surface hover:bg-surface-container rounded-r-lg transition-colors cursor-pointer"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout Button */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border-hairline bg-surface-low space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted font-medium">Subtotal</span>
                  <span className="font-sans font-bold tabular-nums text-base text-on-surface">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">
                  Shipping and taxes calculated during checkout.
                </p>

                <button
                  type="button"
                  disabled={isValidating}
                  onClick={handleOpenCheckout}
                  style={{ backgroundColor: buttonColor || "var(--primary)" }}
                  className={`w-full py-3.5 text-white text-xs font-bold shadow-xs hover:shadow-card hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${radiusClass || "rounded-2xl"}`}
                >
                  <span>{isValidating ? "Checking Stock..." : "Proceed to Checkout"}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        slug={slug}
        studioName={studioName}
        buttonColor={buttonColor}
        radiusClass={radiusClass}
        onOrderComplete={() => {
          clearCart();
          setIsCheckoutOpen(false);
          setIsCartOpen(false);
        }}
      />
    </>
  );
}
