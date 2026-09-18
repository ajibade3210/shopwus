"use client";

import { useParams } from "next/navigation";
import { StorefrontPage } from "@/components/studio/storefront-page";
import { APP_CONFIG } from "@/constants";

export default function Page() {
  const params = useParams();
  const slugParam = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const slug = (slugParam as string) || APP_CONFIG.defaultSlug;

  return <StorefrontPage slug={slug} />;
}
