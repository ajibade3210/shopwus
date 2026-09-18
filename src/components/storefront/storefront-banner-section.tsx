"use client";

import Image from "next/image";
import type { StorefrontBannerSectionProps } from "@/types";

export function StorefrontBannerSection({ profile }: StorefrontBannerSectionProps) {
  // Strict Content Guard: Collapse if disabled or if profile missing or if both header and image are empty
  if (
    !profile ||
    profile.showStorefrontBanner === false ||
    (!profile.storefrontBannerHeader?.trim() && !profile.storefrontBannerUrl?.trim())
  ) {
    return null;
  }

  const headerText = profile.storefrontBannerHeader?.trim() || "Style for Every You";
  const bodyText =
    profile.storefrontBannerBody?.trim() ||
    "Modern essentials and timeless pieces crafted with intention.";
  const imageUrl = profile.storefrontBannerUrl?.trim();
  const textColor = profile.storefrontBannerTextColor?.trim() || "#ffffff";
  const bgColor = profile.storefrontBannerBgColor?.trim() || "#0f3428"; // Deep emerald default per Ref Image 3

  return (
    <section className="w-full mb-10 sm:mb-14">
      <div
        style={{ backgroundColor: bgColor }}
        className="relative w-full rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden shadow-card border border-white/10"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[180px] sm:min-h-[240px] max-h-[360px]">
          {/* Left Column: Header & Body Narrative */}
          <div className="md:col-span-7 space-y-2.5 sm:space-y-4 z-10">
            <h1
              style={{ color: textColor }}
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight tracking-tight max-w-xl"
            >
              {headerText}
            </h1>

            {bodyText && (
              <p
                style={{ color: textColor }}
                className="text-xs sm:text-sm font-sans opacity-85 leading-relaxed max-w-md line-clamp-3"
              >
                {bodyText}
              </p>
            )}
          </div>

          {/* Right Column: Framed Banner Image */}
          {imageUrl && (
            <div className="md:col-span-5 flex items-center justify-center md:justify-end">
              <div className="relative w-full max-w-[340px] h-[160px] sm:h-[220px] rounded-xl sm:rounded-2xl overflow-hidden shadow-hero border border-white/15">
                <Image
                  src={imageUrl}
                  alt={headerText}
                  fill
                  sizes="(max-width: 768px) 100vw, 340px"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
