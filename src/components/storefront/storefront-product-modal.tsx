"use client";

import { Check, Minus, Package, Plus, Share2, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProductVariant, StorefrontProductModalProps } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { useCart } from "./cart-context";
import { useStorefront } from "./storefront-context";

// Robust color resolver supporting hex codes and luxury/product palette names
function resolveColorValue(val: string): string {
  const trimmed = val.trim();
  if (trimmed.startsWith("#")) return trimmed;
  const hexMatch = trimmed.match(/#(?:[0-9a-fA-F]{3,8})/);
  if (hexMatch) return hexMatch[0];

  const COLOR_PALETTE: Record<string, string> = {
    "onyx black": "#18181B",
    black: "#000000",
    "cognac tan": "#9A532A",
    tan: "#C18C5D",
    brown: "#8B4513",
    "emerald forest": "#064E3B",
    emerald: "#059669",
    green: "#16A34A",
    olive: "#556B2F",
    navy: "#1E3A8A",
    blue: "#2563EB",
    beige: "#E6D5B8",
    cream: "#FFFDD0",
    white: "#FFFFFF",
    charcoal: "#374151",
    gray: "#6B7280",
    grey: "#6B7280",
    burgundy: "#800020",
    red: "#DC2626",
    gold: "#D97706",
    silver: "#9CA3AF",
  };
  return COLOR_PALETTE[trimmed.toLowerCase()] || "#374151";
}

export function StorefrontProductModal({ product, onClose }: StorefrontProductModalProps) {
  const {
    profile,
    primaryColor,
    buttonColor,
    buttonRadius,
    setIsQuoteModalOpen,
    setActiveQuoteService,
  } = useStorefront();
  const { addItem } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setIsAdded(false);

      if (product.hasVariants && product.options && product.options.length > 0) {
        const initialOptions: Record<string, string> = {};
        product.options.forEach(opt => {
          if (opt.values.length > 0) {
            initialOptions[opt.name] = opt.values[0];
          }
        });
        setSelectedOptions(initialOptions);
      } else {
        setSelectedOptions({});
        setSelectedVariant(null);
      }
    }
  }, [product]);

  // Resolve matching variant
  useEffect(() => {
    if (product?.hasVariants && product.variants) {
      const matched = product.variants.find(v => {
        const optMap = (v.options || {}) as Record<string, string>;
        return Object.entries(selectedOptions).every(([key, val]) => optMap[key] === val);
      });
      setSelectedVariant(matched || null);
    } else {
      setSelectedVariant(null);
    }
  }, [product, selectedOptions]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [product]);

  if (!product) return null;

  const isService =
    profile?.businessType === "service" ||
    (product as { type?: string }).type === "service" ||
    product.category?.slug?.startsWith("svc-cat-") ||
    Boolean((product.attributes as { isService?: boolean } | undefined)?.isService);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const activeImage = images[selectedImageIndex] || null;

  const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);
  const comparePrice = selectedVariant?.compareAtPrice
    ? Number(selectedVariant.compareAtPrice)
    : product.compareAtPrice
      ? Number(product.compareAtPrice)
      : null;

  const isOutOfStock = product.hasVariants
    ? selectedVariant
      ? selectedVariant.inventoryCount <= 0 && !product.allowBackorder
      : false
    : product.trackInventory && product.inventoryCount <= 0 && !product.allowBackorder;

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToCart = () => {
    if (isService) {
      setActiveQuoteService(product.name);
      setIsQuoteModalOpen(true);
      onClose();
      return;
    }

    addItem(product, quantity, selectedOptions, selectedVariant);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-card rounded-3xl shadow-popover border border-border-hairline overflow-hidden my-6 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-surface-lowest/90 hover:bg-surface-lowest text-on-surface rounded-full shadow-xs border border-border-hairline transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="bg-surface-low p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border-hairline">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface-container flex items-center justify-center">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <Package size={56} className="text-text-muted" />
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.isFeatured && (
                  <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    Featured
                  </span>
                )}
                {comparePrice && comparePrice > currentPrice && (
                  <span className="bg-tertiary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    Save {Math.round(((comparePrice - currentPrice) / comparePrice) * 100)}%
                  </span>
                )}
                {isOutOfStock && (
                  <span className="bg-error text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    Sold Out
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? "border-primary shadow-xs ring-2 ring-primary/20"
                        : "border-border-hairline opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-5 sm:p-7 flex flex-col justify-between max-h-[85vh] md:max-h-[640px] overflow-y-auto">
            <div className="space-y-4">
              {/* Category */}
              <div className="flex items-center justify-between pr-8">
                {product.category?.name ? (
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                    {product.category.name}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
                    Catalog
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-on-surface leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-sans font-extrabold tabular-nums text-on-surface">
                  {formatCurrency(currentPrice)}
                </span>
                {comparePrice && comparePrice > currentPrice && (
                  <span className="text-sm text-text-muted line-through font-sans tabular-nums">
                    {formatCurrency(comparePrice)}
                  </span>
                )}
              </div>

              {/* Stock / Availability Status */}
              <div className="pt-1">
                {isOutOfStock ? (
                  <span className="inline-flex items-center text-xs font-bold text-error bg-error/10 px-2.5 py-1 rounded-lg">
                    Out of Stock
                  </span>
                ) : selectedVariant &&
                  selectedVariant.inventoryCount <= 5 &&
                  !product.allowBackorder ? (
                  <span className="inline-flex items-center text-xs font-semibold text-amber-800 bg-amber-500/15 px-2.5 py-1 rounded-lg font-sans tabular-nums">
                    Only {selectedVariant.inventoryCount} left in stock!
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-medium text-tertiary bg-tertiary/10 px-2.5 py-1 rounded-lg">
                    Available in stock
                  </span>
                )}
              </div>

              {/* Variant Selectors */}
              {product.hasVariants && product.options && product.options.length > 0 && (
                <div className="space-y-3.5 pt-3 border-t border-border-hairline">
                  {product.options.map(opt => {
                    const isColor = opt.name.toLowerCase() === "color";
                    return (
                      <div key={opt.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-on-surface">
                          <span>{opt.name}:</span>
                          <span className="text-primary font-bold">
                            {selectedOptions[opt.name]}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2.5 items-center">
                          {opt.values.map(val => {
                            const isSelected = selectedOptions[opt.name] === val;

                            if (isColor) {
                              const hex = resolveColorValue(val);
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => handleOptionChange(opt.name, val)}
                                  title={val}
                                  style={{ backgroundColor: hex }}
                                  className={`relative w-8 h-8 rounded-full border border-black/20 dark:border-white/20 transition-all cursor-pointer flex items-center justify-center ${
                                    isSelected
                                      ? "ring-2 ring-primary ring-offset-2 scale-110 shadow-sm"
                                      : "hover:scale-105 opacity-90 hover:opacity-100"
                                  }`}
                                  aria-label={val}
                                >
                                  {isSelected && (
                                    <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                                  )}
                                </button>
                              );
                            }

                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleOptionChange(opt.name, val)}
                                style={{
                                  backgroundColor: isSelected ? primaryColor : undefined,
                                  borderColor: isSelected ? primaryColor : undefined,
                                }}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                                  isSelected
                                    ? "text-white shadow-xs"
                                    : "bg-surface-low text-on-surface border-border-hairline hover:border-border-subtle"
                                }`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="pt-3 border-t border-border-hairline">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Description
                  </h4>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 border-t border-border-hairline mt-6 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity selector for physical products */}
                {!isService && (
                  <div className="h-12 flex items-center border border-border-hairline rounded-xl bg-surface-low px-2 shrink-0">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-1.5 text-on-surface hover:text-primary disabled:opacity-30 cursor-pointer transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-sans tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-1.5 text-on-surface hover:text-primary disabled:opacity-30 cursor-pointer transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}

                {/* Main Action Button */}
                <button
                  type="button"
                  disabled={!isService && isOutOfStock}
                  onClick={handleAddToCart}
                  style={{ backgroundColor: buttonColor || primaryColor }}
                  className={`h-12 flex-1 px-4 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-card hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer ${buttonRadius}`}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} />
                      <span>Added to Cart!</span>
                    </>
                  ) : isService ? (
                    <>
                      <ShoppingCart size={16} />
                      <span>Book Service / Request Quote</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Sold Out</span>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      <span>Add to Cart &bull; {formatCurrency(currentPrice * quantity)}</span>
                    </>
                  )}
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-12 h-12 flex items-center justify-center border border-border-hairline bg-surface-low hover:bg-surface-container rounded-xl text-on-surface transition-colors cursor-pointer shrink-0"
                  title="Share Link"
                  aria-label="Share product"
                >
                  <Share2 size={16} />
                </button>
              </div>

              {copied && (
                <p className="text-[11px] text-center font-medium text-tertiary">
                  Link copied to clipboard!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
