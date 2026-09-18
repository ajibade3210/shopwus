"use client";

import { Check, Layers, Package, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import type { Product, StorefrontBestSellersProps } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { useCart } from "./cart-context";
import { useStorefront } from "./storefront-context";

export function StorefrontBestSellers({ products }: StorefrontBestSellersProps) {
  const router = useRouter();
  const {
    slug,
    primaryColor,
    buttonColor,
    buttonRadius,
    profile,
    setIsQuoteModalOpen,
    setActiveQuoteService,
  } = useStorefront();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Filter featured items or fallback to top items if catalog is large enough
  const featured = products.filter(p => p.isFeatured);
  const totalCount = products.length;

  // Guard: if fewer than 2 featured items and catalog has fewer than 8 total items, don't show
  if (featured.length < 2 && totalCount < 8) {
    return null;
  }

  // Pick top 4 items (preferring featured, otherwise first 4 from catalog)
  const bestSellers = featured.length >= 2 ? featured.slice(0, 4) : products.slice(0, 4);

  if (bestSellers.length === 0) return null;

  const isService = profile?.businessType === "service";

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();

    if (isService || product.category?.slug?.startsWith("svc-cat-")) {
      setActiveQuoteService(product.name);
      setIsQuoteModalOpen(true);
      return;
    }

    if (product.hasVariants && product.variants && product.variants.length > 0) {
      router.push(`/${slug}/p/${product.slug}`);
      return;
    }

    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="mb-12 sm:mb-16">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <span
            style={{ color: primaryColor }}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest block mb-1"
          >
            Curated Favorites
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-on-surface">
            Best Sellers
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted font-medium">
          <span>Highest rated by our clients</span>
        </div>
      </div>

      {/* Responsive 4-Column Grid: 2 columns on mobile, 4 columns on large screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {bestSellers.map(product => {
          const isOutOfStock =
            product.trackInventory && product.inventoryCount <= 0 && !product.allowBackorder;
          const isAdded = addedId === product.id;

          let displayPrice = formatCurrency(Number(product.price));
          if (product.hasVariants && product.variants && product.variants.length > 0) {
            const prices = product.variants.map(v => Number(v.price));
            const minP = Math.min(...prices);
            const maxP = Math.max(...prices);
            if (minP !== maxP) {
              displayPrice = `From ${formatCurrency(minP)}`;
            }
          }

          return (
            <div
              key={product.id}
              onClick={() => router.push(`/${slug}/p/${product.slug}`)}
              className="group relative bg-card border border-border-hairline rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-card hover:border-border-subtle transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Frame: Compact aspect-square (reduced height by 20%) */}
              <div className="relative aspect-square bg-surface-low overflow-hidden border-b border-border-hairline">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <Package size={32} />
                  </div>
                )}

                {/* Pill Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                  <span className="bg-black/85 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    Best Seller
                  </span>
                  {Boolean(Number(product.compareAtPrice) > 0) && !isOutOfStock && (
                    <span className="bg-tertiary text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                      Sale
                    </span>
                  )}
                </div>

                {isOutOfStock && (
                  <span className="absolute top-2.5 right-2.5 bg-error text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="mb-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider truncate block">
                      {product.category?.name || "Featured"}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                </div>

                {/* Price & Quick Add */}
                <div className="mt-2.5 pt-2.5 border-t border-border-hairline flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-sans font-bold tabular-nums text-on-surface">
                      {displayPrice}
                    </span>
                    {Boolean(Number(product.compareAtPrice) > 0) && !product.hasVariants && (
                      <span className="text-[10px] text-text-muted line-through font-sans tabular-nums">
                        {formatCurrency(Number(product.compareAtPrice))}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={e => handleQuickAdd(product, e)}
                    style={{ backgroundColor: isAdded ? undefined : buttonColor || primaryColor }}
                    className={`p-2 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${buttonRadius} ${
                      isAdded ? "bg-tertiary text-white" : "text-white shadow-xs hover:opacity-95"
                    }`}
                    title={
                      isOutOfStock
                        ? "Out of stock"
                        : product.hasVariants
                          ? "Choose Options"
                          : isService
                            ? "Book Service"
                            : "Add to Cart"
                    }
                  >
                    {isAdded ? (
                      <Check size={14} />
                    ) : product.hasVariants ? (
                      <Layers size={14} />
                    ) : (
                      <Plus size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
