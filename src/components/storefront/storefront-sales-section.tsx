"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { StorefrontSalesSectionProps } from "@/types";

export function StorefrontSalesSection({ profile }: StorefrontSalesSectionProps) {
  // Strict Content Guard: Collapse if disabled or if profile missing or if both header and image are empty
  if (
    !profile?.showStorefrontSales ||
    (!profile.storefrontSalesHeader?.trim() && !profile.storefrontSalesUrl?.trim())
  ) {
    return null;
  }

  const headerText = profile.storefrontSalesHeader?.trim() || "Engaging, purposeful, and creative.";
  const bodyText =
    profile.storefrontSalesBody?.trim() ||
    "Crafted to deliver exceptional quality tailored to your lifestyle and brand.";
  const imageUrl = profile.storefrontSalesUrl?.trim();
  const buttonText = profile.storefrontSalesBtnText?.trim() || "Shop Now";
  const buttonUrl = profile.storefrontSalesBtnUrl?.trim() || "#products";
  const buttonColor = profile.colors?.button || "#181c1f";
  const buttonRadius = profile.buttonRadius || "rounded-xl";

  const isExternal = buttonUrl.startsWith("http://") || buttonUrl.startsWith("https://");

  return (
    <section className="w-full my-12 sm:my-16">
      <div className="bg-surface-low border border-border-hairline rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Header, Body & Action Button */}
          <div className="md:col-span-7 space-y-4 sm:space-y-6">
            <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface tracking-tight leading-tight">
              {headerText}
            </h2>

            {bodyText && (
              <p className="text-xs sm:text-sm text-on-surface-variant font-sans leading-relaxed max-w-xl">
                {bodyText}
              </p>
            )}

            <div className="pt-2">
              {isExternal ? (
                <a
                  href={buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: buttonColor }}
                  className={`inline-flex items-center gap-2 text-white text-xs sm:text-sm font-semibold px-6 py-3 shadow-sm hover:shadow-md hover:opacity-95 transition-all cursor-pointer ${buttonRadius}`}
                >
                  <span>{buttonText}</span>
                  <ArrowRight size={14} />
                </a>
              ) : (
                <Link
                  href={buttonUrl}
                  style={{ backgroundColor: buttonColor }}
                  className={`inline-flex items-center gap-2 text-white text-xs sm:text-sm font-semibold px-6 py-3 shadow-sm hover:shadow-md hover:opacity-95 transition-all cursor-pointer ${buttonRadius}`}
                >
                  <span>{buttonText}</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>

          {/* Right: Feature / Product Photo */}
          {imageUrl && (
            <div className="md:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-[380px] h-[220px] sm:h-[280px] rounded-xl sm:rounded-2xl overflow-hidden shadow-card border border-border-hairline bg-card">
                <Image
                  src={imageUrl}
                  alt={headerText}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
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
