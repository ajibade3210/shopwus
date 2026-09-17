"use client";

import { Check, Layers, Package, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStorefrontProductsQuery } from "@/hooks/queries";
import type { Product, ProductVariant, StudioProductsSectionProps } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { useCart } from "./cart-context";

export function StudioProductsSection({
  slug,
  themeColor = "var(--primary)",
  buttonRadius = "rounded-xl",
}: StudioProductsSectionProps) {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const { data, isLoading } = useStorefrontProductsQuery(slug, {
    categorySlug: selectedCategory || undefined,
  });

  const products = data?.items || [];
  const categories = data?.categories || [];

  // Initialize selected options when a product modal opens
  useEffect(() => {
    if (activeProduct) {
      if (activeProduct.hasVariants && activeProduct.options && activeProduct.options.length > 0) {
        const initialOptions: Record<string, string> = {};
        activeProduct.options.forEach(opt => {
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
  }, [activeProduct]);

  // Resolve active variant whenever selectedOptions change
  useEffect(() => {
    if (activeProduct?.hasVariants && activeProduct.variants) {
      const matched = activeProduct.variants.find(v => {
        const optMap = v.options as Record<string, string>;
        return Object.entries(selectedOptions).every(([key, val]) => optMap[key] === val);
      });
      setSelectedVariant(matched || null);
    } else {
      setSelectedVariant(null);
    }
  }, [activeProduct, selectedOptions]);

  if (isLoading) {
    return (
      <section className="py-16 px-4 max-w-6xl mx-auto font-sans">
        <div className="text-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading products...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0 && categories.length === 0) {
    return null;
  }

  const handleQuickAdd = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      setActiveProduct(product);
      return;
    }

    addItem(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };

  return (
    <section id="products" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto font-sans">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Online Store
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-on-surface mt-1">
          Featured Products
        </h2>
        <p className="text-xs sm:text-sm text-text-muted mt-2">
          Browse our curated selection and order directly with instant delivery.
        </p>
      </div>

      {/* Categories Filter Bar */}
      {categories.length > 0 && (
        <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            style={{
              backgroundColor: selectedCategory === "" ? themeColor : undefined,
              color: selectedCategory === "" ? "#ffffff" : undefined,
            }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              selectedCategory === ""
                ? "shadow-xs"
                : "bg-surface-low border border-border-hairline text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            All Items
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.slug)}
              style={{
                backgroundColor: selectedCategory === c.slug ? themeColor : undefined,
                color: selectedCategory === c.slug ? "#ffffff" : undefined,
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory === c.slug
                  ? "shadow-xs"
                  : "bg-surface-low border border-border-hairline text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => {
          const isOutOfStock =
            product.trackInventory && product.inventoryCount <= 0 && !product.allowBackorder;
          const isAdded = addedProductId === product.id;

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
              onClick={() => setActiveProduct(product)}
              className="group relative bg-card border border-border-hairline rounded-2xl overflow-hidden hover:shadow-card hover:border-border-subtle transition-all duration-200 cursor-pointer flex flex-col"
            >
              {/* Product Thumbnail */}
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

                {/* Badges */}
                {isOutOfStock && (
                  <span className="absolute top-2.5 left-2.5 bg-error text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                    Sold Out
                  </span>
                )}
                {product.compareAtPrice && !isOutOfStock && (
                  <span className="absolute top-2.5 left-2.5 bg-tertiary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                    Sale
                  </span>
                )}
                {product.hasVariants && (
                  <span className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 font-sans">
                    <Layers size={11} /> {product.variants?.length || 0} Options
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {product.category?.name && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                      {product.category.name}
                    </span>
                  )}
                  <h3 className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </div>

                <div className="mt-3 pt-3 border-t border-border-hairline flex items-center justify-between">
                  <div>
                    <span className="text-xs font-sans font-bold tabular-nums text-on-surface">
                      {displayPrice}
                    </span>
                    {product.compareAtPrice && !product.hasVariants && (
                      <span className="text-[10px] text-text-muted line-through font-sans tabular-nums ml-1.5">
                        {formatCurrency(Number(product.compareAtPrice))}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={e => handleQuickAdd(product, e)}
                    style={{ backgroundColor: isAdded ? undefined : themeColor }}
                    className={`p-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${buttonRadius} ${
                      isAdded ? "bg-tertiary text-white" : "text-white shadow-xs hover:opacity-95"
                    }`}
                    title={
                      isOutOfStock
                        ? "Out of stock"
                        : product.hasVariants
                          ? "Select Options"
                          : "Add to Bag"
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

      {/* Product Detail & Option Selector Modal */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-card rounded-3xl shadow-popover border border-border-hairline overflow-hidden my-8 animate-in zoom-in-95 duration-150 font-sans">
            <button
              type="button"
              onClick={() => setActiveProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-surface-lowest/90 hover:bg-surface-lowest text-on-surface rounded-full shadow-xs border border-border-hairline transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* Gallery */}
              <div className="aspect-square bg-surface-low p-6 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-border-hairline">
                {activeProduct.images?.[0] ? (
                  <img
                    src={activeProduct.images[0]}
                    alt={activeProduct.name}
                    className="w-full h-full object-contain rounded-2xl"
                  />
                ) : (
                  <Package size={48} className="text-text-muted" />
                )}
              </div>

              {/* Details & Option Selectors */}
              <div className="p-6 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    {activeProduct.category?.name && (
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                        {activeProduct.category.name}
                      </span>
                    )}
                    <h3 className="text-lg font-serif font-bold text-on-surface">
                      {activeProduct.name}
                    </h3>

                    {/* Price Display */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-sans font-bold tabular-nums text-on-surface">
                        {formatCurrency(
                          selectedVariant
                            ? Number(selectedVariant.price)
                            : Number(activeProduct.price)
                        )}
                      </span>
                      {(selectedVariant?.compareAtPrice ||
                        (!activeProduct.hasVariants && activeProduct.compareAtPrice)) && (
                        <span className="text-xs text-text-muted line-through font-sans tabular-nums">
                          {formatCurrency(
                            Number(selectedVariant?.compareAtPrice || activeProduct.compareAtPrice)
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Variant Option Selectors (Pills) */}
                  {activeProduct.hasVariants &&
                    activeProduct.options &&
                    activeProduct.options.length > 0 && (
                      <div className="space-y-3 pt-2 border-t border-border-hairline">
                        {activeProduct.options.map(opt => (
                          <div key={opt.name} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-on-surface">
                              <span>{opt.name}:</span>
                              <span className="text-text-muted font-normal">
                                {selectedOptions[opt.name]}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {opt.values.map(val => {
                                const isSelected = selectedOptions[opt.name] === val;
                                return (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => handleOptionChange(opt.name, val)}
                                    style={{
                                      backgroundColor: isSelected ? themeColor : undefined,
                                      borderColor: isSelected ? themeColor : undefined,
                                    }}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                                      isSelected
                                        ? "text-white shadow-xs"
                                        : "bg-surface-lowest text-on-surface border-border-hairline hover:border-border-subtle"
                                    }`}
                                  >
                                    {val}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Stock Availability Indicator */}
                  <div className="pt-2">
                    {activeProduct.hasVariants ? (
                      selectedVariant ? (
                        selectedVariant.inventoryCount <= 0 && !activeProduct.allowBackorder ? (
                          <span className="text-xs font-bold text-on-error-container bg-error-container border border-error/20 px-2 py-1 rounded-lg">
                            Out of Stock in this variant
                          </span>
                        ) : selectedVariant.inventoryCount <= 5 && !activeProduct.allowBackorder ? (
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-1 rounded-lg font-sans tabular-nums">
                            Only {selectedVariant.inventoryCount} left in stock!
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-on-tertiary-container bg-tertiary-container border border-tertiary/20 px-2 py-1 rounded-lg">
                            In Stock ({selectedVariant.inventoryCount} available)
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-text-muted">Select option combination</span>
                      )
                    ) : activeProduct.trackInventory ? (
                      activeProduct.inventoryCount <= 0 && !activeProduct.allowBackorder ? (
                        <span className="text-xs font-bold text-on-error-container bg-error-container border border-error/20 px-2 py-1 rounded-lg">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-on-tertiary-container bg-tertiary-container border border-tertiary/20 px-2 py-1 rounded-lg">
                          In Stock
                        </span>
                      )
                    ) : null}
                  </div>

                  {activeProduct.description && (
                    <p className="text-xs text-text-muted pt-2 border-t border-border-hairline leading-relaxed whitespace-pre-line">
                      {activeProduct.description}
                    </p>
                  )}
                </div>

                {/* Add to Bag Button */}
                <div className="pt-6 border-t border-border-hairline mt-6">
                  <button
                    type="button"
                    disabled={
                      activeProduct.hasVariants
                        ? !selectedVariant ||
                          (selectedVariant.inventoryCount <= 0 && !activeProduct.allowBackorder)
                        : activeProduct.trackInventory &&
                          activeProduct.inventoryCount <= 0 &&
                          !activeProduct.allowBackorder
                    }
                    onClick={() => {
                      addItem(activeProduct, 1, selectedOptions, selectedVariant);
                      setActiveProduct(null);
                    }}
                    style={{ backgroundColor: themeColor }}
                    className={`w-full py-3.5 text-white text-xs font-bold shadow-xs hover:shadow-card hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer ${buttonRadius}`}
                  >
                    <ShoppingBag size={15} />
                    <span>
                      {activeProduct.hasVariants && !selectedVariant
                        ? "Choose an Option"
                        : "Add to Bag"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
