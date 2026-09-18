"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { useStorefront } from "@/components/storefront/storefront-context";
import { StorefrontShopView } from "@/components/storefront/storefront-shop-view";
import { StorefrontPage } from "@/components/studio/storefront-page";
import { APP_CONFIG } from "@/constants";
import { useStorefrontProductsQuery } from "@/hooks/queries";

function StorefrontEntrypoint() {
  const params = useParams();
  const slugParam = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const slug = (slugParam as string) || APP_CONFIG.defaultSlug;

  const { profile, isLoading: isProfileLoading } = useStorefront();

  // Query 1 product to check whether the catalog has items
  const { data: productData, isLoading: isProductsLoading } = useStorefrontProductsQuery(slug, {
    limit: 1,
  });

  if (isProfileLoading && isProductsLoading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-xs text-text-muted">Loading storefront...</p>
      </div>
    );
  }

  const catalogCount = productData?.meta?.total ?? 0;
  const serviceCount = profile?.services?.length ?? 0;
  const hasItems = catalogCount > 0 || serviceCount > 0;

  // If the merchant has products or services, route directly to the store catalog
  if (hasItems) {
    return <StorefrontShopView />;
  }

  // Graceful fallback for portfolio-only businesses with 0 products/services
  return <StorefrontPage slug={slug} hasOuterLayout={true} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-xs text-text-muted">Loading storefront...</p>
        </div>
      }
    >
      <StorefrontEntrypoint />
    </Suspense>
  );
}
