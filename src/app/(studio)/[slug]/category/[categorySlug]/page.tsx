"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { StorefrontCategoryView } from "@/components/storefront/storefront-category-view";

function CategoryContent() {
  const params = useParams();
  const categorySlugParam = Array.isArray(params?.categorySlug)
    ? params.categorySlug[0]
    : params?.categorySlug;
  const categorySlug = (categorySlugParam as string) || "";

  return <StorefrontCategoryView categorySlug={categorySlug} />;
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading category...</p>
        </div>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
