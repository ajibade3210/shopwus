"use client";

import type { StorefrontCategoryPillsProps } from "@/types";
import { useStorefront } from "./storefront-context";

export function StorefrontCategoryPills({
  categories,
  selectedCategorySlug = "",
  onSelectCategory,
  totalProductCount,
}: StorefrontCategoryPillsProps) {
  const { primaryColor } = useStorefront();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {/* All Items Pill */}
        <button
          type="button"
          onClick={() => onSelectCategory("")}
          style={{
            backgroundColor: selectedCategorySlug === "" ? primaryColor : undefined,
            color: selectedCategorySlug === "" ? "#ffffff" : undefined,
            borderColor: selectedCategorySlug === "" ? primaryColor : undefined,
          }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer flex-shrink-0 ${
            selectedCategorySlug === ""
              ? "shadow-xs ring-2 ring-primary/20"
              : "bg-surface-low border-border-hairline text-on-surface hover:bg-surface-container hover:border-border-subtle"
          }`}
        >
          <span>All Items</span>
          {typeof totalProductCount === "number" && totalProductCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans tabular-nums ${
                selectedCategorySlug === ""
                  ? "bg-white/20 text-white"
                  : "bg-surface-container text-text-muted"
              }`}
            >
              {totalProductCount}
            </span>
          )}
        </button>

        {/* Category Pills */}
        {categories.map(cat => {
          const isSelected = selectedCategorySlug === cat.slug;
          const count = cat._count?.products;

          return (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              style={{
                backgroundColor: isSelected ? primaryColor : undefined,
                color: isSelected ? "#ffffff" : undefined,
                borderColor: isSelected ? primaryColor : undefined,
              }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer flex-shrink-0 ${
                isSelected
                  ? "shadow-xs ring-2 ring-primary/20"
                  : "bg-surface-low border-border-hairline text-on-surface hover:bg-surface-container hover:border-border-subtle"
              }`}
            >
              <span>{cat.name}</span>
              {typeof count === "number" && count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans tabular-nums ${
                    isSelected ? "bg-white/20 text-white" : "bg-surface-container text-text-muted"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
