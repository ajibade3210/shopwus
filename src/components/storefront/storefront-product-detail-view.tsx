"use client";

import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  Minus,
  Package,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/storefront/cart-context";
import { useStorefrontProductDetailQuery, useStorefrontProductsQuery } from "@/hooks/queries";
import type { Product, ProductVariant, StorefrontProductDetailViewProps } from "@/types";
import { formatCurrency } from "@/utils/currency";

// Helper to resolve color values from hex or names
function resolveColorValue(val: string): string {
  const trimmed = val.trim();
  if (trimmed.startsWith("#")) return trimmed;

  const hexMatch = trimmed.match(/#(?:[0-9a-fA-F]{3,8})/);
  if (hexMatch) return hexMatch[0];

  const COLOR_PALETTE: Record<string, string> = {
    "onyx black": "#18181B",
    black: "#000000",
    "cognac tan": "#9A532A",
    tan: "#D2B48C",
    brown: "#8B4513",
    "emerald forest": "#064E3B",
    emerald: "#059669",
    green: "#16A34A",
    olive: "#556B2F",
    navy: "#1E3A8A",
    blue: "#2563EB",
    beige: "#F5F5DC",
    cream: "#FFFDD0",
    white: "#FFFFFF",
    charcoal: "#374151",
    gray: "#6B7280",
    grey: "#6B7280",
    burgundy: "#800020",
    red: "#DC2626",
    gold: "#D97706",
    silver: "#9CA3AF",
    orange: "#EA580C",
    purple: "#9333EA",
    pink: "#EC4899",
    yellow: "#EAB308",
  };
  return COLOR_PALETTE[trimmed.toLowerCase()] || "#4B5563";
}

export function StorefrontProductDetailView({
  slug,
  productSlug,
}: StorefrontProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const { data: product, isLoading, isError } = useStorefrontProductDetailQuery(slug, productSlug);

  // Recommendations query
  const { data: catalogData } = useStorefrontProductsQuery(slug, { limit: 8 });

  // State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  // Load wishlist state from localStorage
  useEffect(() => {
    if (!product?.id) return;
    try {
      const stored = localStorage.getItem(`shopwus_wishlist_${slug}`);
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        setIsWishlisted(ids.includes(product.id));
      }
    } catch (_e) {}
  }, [product?.id, slug]);

  const toggleWishlist = () => {
    if (!product?.id) return;
    try {
      const stored = localStorage.getItem(`shopwus_wishlist_${slug}`);
      let ids: string[] = stored ? JSON.parse(stored) : [];
      if (ids.includes(product.id)) {
        ids = ids.filter(id => id !== product.id);
        setIsWishlisted(false);
      } else {
        ids.push(product.id);
        setIsWishlisted(true);
      }
      localStorage.setItem(`shopwus_wishlist_${slug}`, JSON.stringify(ids));
    } catch (_e) {}
  };

  // Initialize selected options when product loads
  useEffect(() => {
    if (product?.options && Array.isArray(product.options) && product.options.length > 0) {
      const initial: Record<string, string> = {};
      product.options.forEach(opt => {
        if (opt.values && opt.values.length > 0) {
          initial[opt.name] = opt.values[0];
        }
      });
      setSelectedOptions(initial);
    }
  }, [product]);

  // Derive all images
  const allImages = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [];
  }, [product]);

  // Match selected variant
  const selectedVariant = useMemo<ProductVariant | null>(() => {
    if (!product?.variants?.length) return null;
    return (
      product.variants.find(v => {
        if (!v.options || typeof v.options !== "object") return false;
        const vOpts = v.options as Record<string, string>;
        return Object.entries(selectedOptions).every(([k, val]) => vOpts[k] === val);
      }) || product.variants[0]
    );
  }, [product?.variants, selectedOptions]);

  // When selected variant changes and has imageUrl, update active gallery image
  useEffect(() => {
    if (selectedVariant?.imageUrl && allImages.length > 0) {
      const imgIdx = allImages.indexOf(selectedVariant.imageUrl);
      if (imgIdx !== -1) {
        setActiveImageIndex(imgIdx);
      }
    }
  }, [selectedVariant, allImages]);

  // Active pricing calculation
  const currentPrice = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product?.price) || 0;
  const compareAtPrice = selectedVariant?.compareAtPrice
    ? Number(selectedVariant.compareAtPrice)
    : product?.compareAtPrice
      ? Number(product.compareAtPrice)
      : null;

  const hasDiscount = Boolean(compareAtPrice && compareAtPrice > currentPrice);
  const discountPercent =
    hasDiscount && compareAtPrice
      ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
      : null;

  // Inventory check
  const inventory = selectedVariant?.inventoryCount ?? product?.inventoryCount ?? 0;
  const isOutOfStock = inventory <= 0;
  const isLowStock = !isOutOfStock && inventory <= 5;

  // Filter recommendations (exclude current product)
  const recommendations = useMemo(() => {
    if (!catalogData?.items) return [];
    return catalogData.items.filter(item => item.id !== product?.id).slice(0, 5);
  }, [catalogData?.items, product?.id]);

  // Gallery Navigation
  const prevImage = () => {
    if (allImages.length <= 1) return;
    setActiveImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  const nextImage = () => {
    if (allImages.length <= 1) return;
    setActiveImageIndex(prev => (prev + 1) % allImages.length);
  };

  const scrollThumbnails = (direction: "left" | "right") => {
    if (!thumbnailScrollRef.current) return;
    const scrollAmount = 140;
    thumbnailScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Cart actions
  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    addItem(product, quantity, selectedOptions, selectedVariant, false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleBuyItNow = () => {
    if (!product || isOutOfStock) return;
    addItem(product, quantity, selectedOptions, selectedVariant, true);
  };

  const handleQuickAddRecommendation = (e: React.MouseEvent, item: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, 1, undefined, null, false);
    setQuickAddedId(item.id);
    setTimeout(() => setQuickAddedId(null), 1500);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-surface-low rounded-2xl" />
          <div className="space-y-6">
            <div className="h-6 w-32 bg-surface-low rounded" />
            <div className="h-10 w-3/4 bg-surface-low rounded" />
            <div className="h-8 w-1/3 bg-surface-low rounded" />
            <div className="h-24 w-full bg-surface-low rounded" />
            <div className="h-12 w-full bg-surface-low rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-low flex items-center justify-center mx-auto mb-4 text-text-muted">
          <Package size={28} />
        </div>
        <h2 className="text-xl font-bold text-text-high mb-2">Product Not Found</h2>
        <p className="text-sm text-text-muted mb-6">
          The item you are looking for might have been moved or is no longer available.
        </p>
        <Link
          href={`/${slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={16} />
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 text-xs text-text-muted">
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <Link
            href={`/${slug}`}
            className="hover:text-text-high transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            <span>Shop</span>
          </Link>
          <span>/</span>
          {product.category?.name && (
            <>
              <Link
                href={`/${slug}/category/${product.category.slug || ""}`}
                className="hover:text-text-high transition-colors truncate"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-text-high font-medium truncate">{product.name}</span>
        </div>

        <button
          onClick={handleShare}
          aria-label="Share product"
          className="flex items-center gap-1 text-text-muted hover:text-text-high transition-colors flex-shrink-0"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
          <span className="hidden sm:inline">{copied ? "Copied Link" : "Share"}</span>
        </button>
      </div>

      {/* Main Product Layout (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* LEFT COLUMN: Gallery */}
        <div className="space-y-4">
          {/* Main Active Image Display */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-surface-low border border-border-hairline group flex items-center justify-center">
            {allImages.length > 0 ? (
              <Image
                src={allImages[activeImageIndex] || allImages[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-all duration-300"
              />
            ) : (
              <div className="text-text-muted flex flex-col items-center gap-2">
                <Package size={48} strokeWidth={1.5} />
                <span className="text-xs">No image available</span>
              </div>
            )}

            {/* Left / Right Chevron Overlay Buttons (visible if > 1 image) */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface-lowest/80 backdrop-blur-md border border-border-hairline shadow-sm flex items-center justify-center text-text-high hover:bg-surface-lowest hover:scale-105 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface-lowest/80 backdrop-blur-md border border-border-hairline shadow-sm flex items-center justify-center text-text-high hover:bg-surface-lowest hover:scale-105 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Top Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
              {product.isFeatured && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm flex items-center gap-1">
                  <Sparkles size={11} />
                  Featured
                </span>
              )}
              {discountPercent !== null && discountPercent > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-rose-500/90 text-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
                  Save {discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Navigation Strip (visible if > 1 image) */}
          {allImages.length > 1 && (
            <div className="relative flex items-center">
              {allImages.length > 4 && (
                <button
                  type="button"
                  onClick={() => scrollThumbnails("left")}
                  aria-label="Scroll thumbnails left"
                  className="w-7 h-7 rounded-full bg-surface-low border border-border-hairline flex items-center justify-center text-text-muted hover:text-text-high transition-colors mr-2 flex-shrink-0"
                >
                  <ChevronLeft size={14} />
                </button>
              )}

              <div
                ref={thumbnailScrollRef}
                className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 scroll-smooth w-full"
              >
                {allImages.map((img, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`View photo ${idx + 1}`}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border transition-all ${
                        isActive
                          ? "ring-2 ring-primary border-primary scale-100"
                          : "border-border-hairline opacity-70 hover:opacity-100 hover:border-text-muted"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                    </button>
                  );
                })}
              </div>

              {allImages.length > 4 && (
                <button
                  type="button"
                  onClick={() => scrollThumbnails("right")}
                  aria-label="Scroll thumbnails right"
                  className="w-7 h-7 rounded-full bg-surface-low border border-border-hairline flex items-center justify-center text-text-muted hover:text-text-high transition-colors ml-2 flex-shrink-0"
                >
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Product Details */}
        <div className="space-y-6">
          {/* Header Row: Title & Wishlist Button */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-high tracking-tight leading-snug">
                {product.name}
              </h1>

              <button
                type="button"
                onClick={toggleWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                  isWishlisted
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
                    : "border-border-hairline bg-surface-low text-text-muted hover:text-text-high hover:border-text-muted"
                }`}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Category / Collection subtitle */}
            {product.category?.name && (
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                {product.category.name}
              </p>
            )}
          </div>

          {/* Pricing Block */}
          <div className="flex items-baseline gap-3 pb-2 border-b border-border-hairline">
            <span className="text-2xl sm:text-3xl font-black text-text-high">
              {formatCurrency(currentPrice)}
            </span>
            {compareAtPrice && compareAtPrice > currentPrice && (
              <span className="text-base text-text-muted line-through font-medium">
                {formatCurrency(compareAtPrice)}
              </span>
            )}
            {discountPercent !== null && discountPercent > 0 && (
              <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 text-xs">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 text-rose-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Out of stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1.5 text-amber-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Only {inventory} left in stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-emerald-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Available in stock
              </span>
            )}
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="text-sm text-text-muted leading-relaxed whitespace-pre-line py-1">
              {product.description}
            </div>
          )}

          {/* Variant Selection (Colors, Sizes, etc.) */}
          {product.options && Array.isArray(product.options) && product.options.length > 0 && (
            <div className="space-y-4 pt-2">
              {product.options.map(opt => {
                const isColor = opt.name.toLowerCase() === "color";
                const selectedVal = selectedOptions[opt.name] || opt.values?.[0] || "";

                return (
                  <div key={opt.name} className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-high">
                        {opt.name}:{" "}
                        <span className="font-normal text-text-muted ml-1">{selectedVal}</span>
                      </span>
                    </div>

                    {isColor ? (
                      /* COLOR SWATCHES - Circular without inner white dot! */
                      <div className="flex flex-wrap items-center gap-3">
                        {opt.values?.map(val => {
                          const isSelected = selectedVal === val;
                          const hexBg = resolveColorValue(val);

                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() =>
                                setSelectedOptions(prev => ({ ...prev, [opt.name]: val }))
                              }
                              title={val}
                              aria-label={`Select color ${val}`}
                              className={`relative w-8 h-8 rounded-full transition-transform border border-black/15 dark:border-white/20 ${
                                isSelected
                                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 shadow-sm"
                                  : "hover:scale-105 opacity-90 hover:opacity-100"
                              }`}
                              style={{ backgroundColor: hexBg }}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      /* NON-COLOR OPTIONS - Clean selectable text pills */
                      <div className="flex flex-wrap gap-2">
                        {opt.values?.map(val => {
                          const isSelected = selectedVal === val;

                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() =>
                                setSelectedOptions(prev => ({ ...prev, [opt.name]: val }))
                              }
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border-hairline bg-surface-low text-text-muted hover:text-text-high hover:border-text-muted"
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-text-high">Quantity</span>
            <div className="flex items-center border border-border-hairline rounded-xl bg-surface-low w-fit p-1">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                aria-label="Decrease quantity"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-high hover:bg-surface-lowest disabled:opacity-40 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-sm font-bold text-text-high">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                disabled={isOutOfStock || (inventory > 0 && quantity >= inventory)}
                aria-label="Increase quantity"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-high hover:bg-surface-lowest disabled:opacity-40 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Action Buttons: Add to Cart (silent) vs Buy It Now (opens drawer) */}
          <div className="space-y-3 pt-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Secondary Button: Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full sm:flex-1 h-12 rounded-xl border border-border-hairline bg-surface-low hover:bg-surface-lowest text-text-high font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {isAdded ? (
                  <>
                    <Check size={18} className="text-emerald-500" />
                    <span className="text-emerald-500">Added to Cart ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Primary Solid Button: Buy It Now */}
              <button
                type="button"
                onClick={handleBuyItNow}
                disabled={isOutOfStock}
                className="w-full sm:flex-1 h-12 rounded-xl bg-text-high text-surface-lowest font-extrabold text-sm hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                Buy It Now
              </button>
            </div>
          </div>

          {/* Reassurance / Trust Strip (Matching Reference) */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border-hairline text-center">
            <div className="p-3 rounded-xl bg-surface-low/50 border border-border-hairline/60 flex flex-col items-center gap-1.5">
              <ShieldCheck size={18} className="text-primary" />
              <span className="text-[11px] font-semibold text-text-high">Privacy Protection</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-low/50 border border-border-hairline/60 flex flex-col items-center gap-1.5">
              <CreditCard size={18} className="text-primary" />
              <span className="text-[11px] font-semibold text-text-high">Safe Payments</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-low/50 border border-border-hairline/60 flex flex-col items-center gap-1.5">
              <Truck size={18} className="text-primary" />
              <span className="text-[11px] font-semibold text-text-high">Secure Logistics</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS SECTION: "Best Sellers" / "You May Also Like" */}
      {recommendations.length > 0 && (
        <section className="mt-20 pt-12 border-t border-border-hairline space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-text-high tracking-tight">
                You May Also Like
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Popular selections and customer favorites from our collection
              </p>
            </div>
            <Link
              href={`/${slug}`}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map(item => {
              const itemPrice = Number(item.price) || 0;
              const itemCompare = item.compareAtPrice ? Number(item.compareAtPrice) : null;
              const isItemAdded = quickAddedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => router.push(`/${slug}/p/${item.slug}`)}
                  className="group cursor-pointer rounded-xl border border-border-hairline bg-surface-lowest overflow-hidden hover:border-text-muted hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full bg-surface-low overflow-hidden">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <Package size={24} />
                      </div>
                    )}

                    {item.isFeatured && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-md">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider truncate mb-0.5">
                        {item.category?.name || "Product"}
                      </p>
                      <h3 className="text-xs font-bold text-text-high line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border-hairline/60">
                      <div>
                        <span className="text-xs font-black text-text-high">
                          {formatCurrency(itemPrice)}
                        </span>
                        {itemCompare && itemCompare > itemPrice && (
                          <span className="block text-[10px] text-text-muted line-through">
                            {formatCurrency(itemCompare)}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={e => handleQuickAddRecommendation(e, item)}
                        aria-label={`Quick add ${item.name}`}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isItemAdded
                            ? "bg-emerald-500 text-white"
                            : "bg-surface-low text-text-high hover:bg-text-high hover:text-surface-lowest border border-border-hairline"
                        }`}
                      >
                        {isItemAdded ? <Check size={13} /> : <ShoppingCart size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
