"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Layers,
  Package,
  PackageOpen,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState, useTransition } from "react";
import { useStorefrontProductsQuery } from "@/hooks/queries";
import type { Product, StorefrontCategoryViewProps, StorefrontSortOption } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { useCart } from "./cart-context";
import { useStorefront } from "./storefront-context";

export function StorefrontCategoryView({ categorySlug }: StorefrontCategoryViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const {
    profile,
    slug,
    categories,
    setCategories,
    primaryColor,
    buttonColor,
    buttonRadius,
    setIsQuoteModalOpen,
    setActiveQuoteService,
  } = useStorefront();

  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const currentSort = (searchParams.get("sort") as StorefrontSortOption) || "featured";
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  let sortBy: "createdAt" | "price" | undefined;
  let sortOrder: "asc" | "desc" | undefined;

  if (currentSort === "newest") {
    sortBy = "createdAt";
    sortOrder = "desc";
  } else if (currentSort === "price-asc") {
    sortBy = "price";
    sortOrder = "asc";
  } else if (currentSort === "price-desc") {
    sortBy = "price";
    sortOrder = "desc";
  }

  // Query products for this specific category
  const { data, isLoading } = useStorefrontProductsQuery(slug, {
    page: currentPage,
    limit: 12,
    categorySlug,
    sortBy,
    sortOrder,
  });

  const products = data?.items || [];
  const fetchedCategories = data?.categories || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 12, totalPages: 1 };

  useEffect(() => {
    if (fetchedCategories.length > 0) {
      setCategories(fetchedCategories);
    }
  }, [fetchedCategories, setCategories]);

  // Find active category details
  const activeCategory =
    categories.find(c => c.slug === categorySlug) ||
    fetchedCategories.find(c => c.slug === categorySlug) ||
    (products[0]?.category?.slug === categorySlug ? products[0].category : null);

  const categoryName =
    activeCategory?.name ||
    categorySlug
      .replace(/^svc-cat-/, "")
      .split("-")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleSortChange = (newSort: StorefrontSortOption) => {
    updateQuery({
      sort: newSort === "featured" ? null : newSort,
      page: null,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateQuery({ page: newPage > 1 ? String(newPage) : null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <div className="w-full pb-20">
      {/* Category Hero / Header */}
      <div className="bg-surface-low border-b border-border-hairline py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-4">
            <Link href={`/${slug}`} className="hover:text-primary transition-colors">
              Store
            </Link>
            <ChevronRight size={12} />
            <span className="text-on-surface font-semibold truncate">{categoryName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span
                style={{ color: primaryColor }}
                className="text-[10px] sm:text-xs font-bold uppercase tracking-widest block mb-1"
              >
                Category
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-on-surface">
                {categoryName}
              </h1>
              {activeCategory &&
                "description" in activeCategory &&
                typeof activeCategory.description === "string" &&
                activeCategory.description && (
                  <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
                    {activeCategory.description}
                  </p>
                )}
              <p className="text-xs text-text-muted mt-2 font-medium">
                {meta.total} {meta.total === 1 ? "item" : "items"} available
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative inline-flex items-center">
                <SlidersHorizontal
                  size={14}
                  className="absolute left-3.5 text-text-muted pointer-events-none"
                />
                <select
                  value={currentSort}
                  onChange={e => handleSortChange(e.target.value as StorefrontSortOption)}
                  className="pl-9 pr-8 py-2 text-xs font-semibold bg-card border border-border-hairline rounded-xl text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 text-text-muted pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {isLoading ? (
          <div className="py-20 text-center">
            <div
              style={{ borderColor: primaryColor, borderTopColor: "transparent" }}
              className="animate-spin w-8 h-8 border-2 rounded-full mx-auto mb-3"
            />
            <p className="text-xs text-text-muted">Loading items in {categoryName}...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 px-4 text-center bg-card border border-border-hairline rounded-3xl my-6 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-surface-low flex items-center justify-center mx-auto mb-3 text-text-muted">
              <PackageOpen size={24} />
            </div>
            <h3 className="text-base font-serif font-bold text-on-surface mb-1">
              No items in this category
            </h3>
            <p className="text-xs text-text-muted mb-5">
              Check back soon or explore the rest of our catalog.
            </p>
            <Link
              href={`/${slug}`}
              style={{ backgroundColor: buttonColor || primaryColor }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer ${buttonRadius}`}
            >
              <ArrowLeft size={14} />
              <span>Back to All Products</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map(product => {
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
                  {/* Image Container: Compact aspect-square (reduced height by 20%) */}
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
                      {product.isFeatured && (
                        <span
                          style={{ backgroundColor: primaryColor }}
                          className="text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs"
                        >
                          Featured
                        </span>
                      )}
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

                  {/* Card Content */}
                  <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="mb-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider truncate block">
                          {product.category?.name || categoryName}
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
                        style={{
                          backgroundColor: isAdded ? undefined : buttonColor || primaryColor,
                        }}
                        className={`p-2 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${buttonRadius} ${
                          isAdded
                            ? "bg-tertiary text-white"
                            : "text-white shadow-xs hover:opacity-95"
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
        )}

        {/* Pagination Controls */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-border-hairline">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-on-surface bg-card border border-border-hairline rounded-xl hover:bg-surface-low disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(pageNum => {
                const isCurrent = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    style={{
                      backgroundColor: isCurrent ? primaryColor : undefined,
                      color: isCurrent ? "#ffffff" : undefined,
                      borderColor: isCurrent ? primaryColor : undefined,
                    }}
                    className={`w-9 h-9 text-xs font-bold font-sans rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? "shadow-xs"
                        : "bg-card border-border-hairline text-on-surface hover:bg-surface-low"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={currentPage >= meta.totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-on-surface bg-card border border-border-hairline rounded-xl hover:bg-surface-low disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
