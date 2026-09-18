"use client";

import { ArrowRight, Loader2, Package, Search, Tag, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getStorefrontProducts } from "@/services/api/product.service";
import type { Product, StorefrontProductsResponse } from "@/types";
import { formatCurrency, formatServicePrice } from "@/utils/currency";
import { useStorefront } from "./storefront-context";

export function StorefrontSearchModal() {
  const router = useRouter();
  const {
    slug,
    profile,
    isSearchOpen,
    setIsSearchOpen,
    setIsQuoteModalOpen,
    setActiveQuoteService,
    buttonColor,
    buttonRadius,
  } = useStorefront();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm("");
      setDebouncedTerm("");
      setResults([]);
    }
  }, [isSearchOpen]);

  // Debounce input 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch search results
  useEffect(() => {
    if (!debouncedTerm || !slug) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    getStorefrontProducts(slug, { search: debouncedTerm, limit: 12 })
      .then((res: StorefrontProductsResponse) => {
        if (isMounted) {
          setResults(res.items || []);
        }
      })
      .catch(() => {
        if (isMounted) setResults([]);
      })
      .finally(() => {
        if (isMounted) setIsSearching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedTerm, slug]);

  if (!isSearchOpen) return null;

  const isService = profile?.businessType === "service";

  const handleSelectProduct = (product: Product) => {
    const attrs = product.attributes as { isService?: boolean } | undefined;
    if (isService || attrs?.isService) {
      setActiveQuoteService(product.name);
      setIsQuoteModalOpen(true);
      setIsSearchOpen(false);
      return;
    }

    setIsSearchOpen(false);
    router.push(`/${slug}/p/${product.slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={() => setIsSearchOpen(false)} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-hero border border-border-hairline overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-border-hairline flex items-center gap-3 bg-surface-low">
          <Search size={20} className="text-outline shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={`Search all ${isService ? "services" : "products"} in ${profile?.businessName || "store"}...`}
            className="w-full bg-transparent text-sm sm:text-base text-on-surface placeholder:text-outline focus:outline-none"
          />
          {isSearching && <Loader2 size={18} className="animate-spin text-primary shrink-0" />}
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="text-outline hover:text-on-surface p-1 rounded-md transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="text-xs text-outline hover:text-on-surface border border-border-hairline px-2 py-1 rounded-md bg-card transition-colors shrink-0"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3">
          {isSearching && results.length === 0 && (
            <div className="py-12 text-center text-xs text-outline space-y-2">
              <Loader2 size={24} className="animate-spin mx-auto text-primary" />
              <p>Searching catalog...</p>
            </div>
          )}

          {!isSearching && debouncedTerm && results.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <Package size={32} className="mx-auto text-outline/60" />
              <p className="text-sm font-medium text-on-surface">
                No results found for &ldquo;{debouncedTerm}&rdquo;
              </p>
              <p className="text-xs text-outline">
                Try searching by product title, description, or category.
              </p>
            </div>
          )}

          {!debouncedTerm && (
            <div className="py-10 text-center space-y-2 text-outline">
              <Search size={28} className="mx-auto text-outline/50" />
              <p className="text-xs sm:text-sm">
                Type a product name or category to search instantly
              </p>
              <p className="text-[11px] text-outline/70">
                Press ⌘K or Ctrl+K anytime to open search
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-outline px-1">
                Results ({results.length})
              </p>
              <div className="divide-y divide-border-hairline">
                {results.map(product => {
                  const attrs = product.attributes as
                    | {
                        isService?: boolean;
                        minPrice?: number;
                        maxPrice?: number;
                        priceType?: string;
                      }
                    | undefined;
                  const itemIsService = isService || attrs?.isService;
                  const primaryImage = product.images?.[0];

                  let priceDisplay = "";
                  if (itemIsService && attrs?.priceType === "range") {
                    priceDisplay =
                      formatServicePrice(
                        { minPrice: attrs.minPrice, maxPrice: attrs.maxPrice, priceType: "range" },
                        profile?.currency || "NGN"
                      ) || "Price on request";
                  } else {
                    priceDisplay = formatCurrency(
                      Number(product.price) || 0,
                      profile?.currency || "NGN"
                    );
                  }

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="py-3 px-3 rounded-xl hover:bg-surface-low transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Thumbnail */}
                        <div className="w-12 h-14 bg-surface-high rounded-lg overflow-hidden shrink-0 relative flex items-center justify-center">
                          {primaryImage ? (
                            <Image
                              src={primaryImage}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <Package size={18} className="text-outline" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 space-y-1">
                          <h4 className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            {product.category && (
                              <span className="text-[10px] bg-surface-high text-on-surface-variant px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                <Tag size={9} />
                                {product.category.name}
                              </span>
                            )}
                            <span className="text-xs font-bold font-sans tabular-nums text-on-surface">
                              {priceDisplay}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        style={{ backgroundColor: buttonColor }}
                        className={`text-white text-xs font-medium px-3.5 py-1.5 shrink-0 opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-2xs ${buttonRadius}`}
                      >
                        <span>{itemIsService ? "Book" : "Add"}</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
