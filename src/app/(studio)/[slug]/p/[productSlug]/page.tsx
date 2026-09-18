"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { StorefrontProductDetailView } from "@/components/storefront/storefront-product-detail-view";
import { APP_CONFIG } from "@/constants";

function ProductPageEntrypoint() {
  const params = useParams();
  const slugParam = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const productSlugParam = Array.isArray(params?.productSlug)
    ? params.productSlug[0]
    : params?.productSlug;

  const slug = (slugParam as string) || APP_CONFIG.defaultSlug;
  const productSlug = (productSlugParam as string) || "";

  return <StorefrontProductDetailView slug={slug} productSlug={productSlug} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading product...</p>
        </div>
      }
    >
      <ProductPageEntrypoint />
    </Suspense>
  );
}
