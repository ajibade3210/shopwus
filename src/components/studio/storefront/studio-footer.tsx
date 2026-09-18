"use client";

import { ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { StudioFooterProps } from "@/types";

const HOME_ROUTE = "/";

export function StudioFooter({
  profile,
  primaryColor = "var(--primary)",
  secondaryColor = "var(--surface-container-low)",
  monogram,
}: StudioFooterProps) {
  const hasSocials = profile.socialChannels?.some(c => c.connected);
  const hasPortfolio =
    profile.showPortfolio !== false && Boolean(profile.portfolio && profile.portfolio.length > 0);
  const hasServices =
    profile.showServices !== false && Boolean(profile.services && profile.services.length > 0);
  const hasReviews =
    profile.showReviews !== false && Boolean(profile.reviews && profile.reviews.length > 0);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-surface border-t border-border-hairline mt-24 py-14 text-xs text-text-muted">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div
              style={{
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: secondaryColor,
              }}
              className="w-10 h-10 rounded-full border flex items-center justify-center font-sans font-bold text-base overflow-hidden shadow-card shrink-0"
            >
              {profile.logoUrl ? (
                <Image
                  src={profile.logoUrl}
                  alt={profile.businessName}
                  width={40}
                  height={40}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                monogram
              )}
            </div>
            <div>
              <div className="font-sans text-base text-on-surface font-semibold tracking-tight">
                {profile.businessName}
              </div>
              <div className="text-[11px] text-text-muted">
                {profile.physicalAddress || profile.location}
              </div>
            </div>
          </div>

          {/* Dynamic Navigation Links based on vendor's active preferences */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-on-surface-variant font-medium">
            {hasSocials && (
              <a href="#social" className="hover:text-primary transition-colors">
                Socials
              </a>
            )}
            {hasPortfolio && (
              <a href="#portfolio" className="hover:text-primary transition-colors">
                Portfolio
              </a>
            )}
            {hasServices && (
              <a href="#services" className="hover:text-primary transition-colors">
                Services
              </a>
            )}
            {hasReviews && (
              <a href="#reviews" className="hover:text-primary transition-colors">
                Reviews
              </a>
            )}
            <a href="/login" className="hover:text-primary transition-colors">
              Studio Login
            </a>
          </div>

          {/* Back to top button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 bg-surface-lowest border border-border-hairline rounded-full px-3.5 py-1.5 text-xs text-on-surface hover:text-primary hover:border-border-subtle transition-all cursor-pointer shadow-xs"
            aria-label="Back to top"
          >
            <ChevronUp size={13} />
            <span>Back to top</span>
          </button>
        </div>

        {/* Bottom Bar: Copyright & Platform Attribution */}
        <div className="border-t border-border-hairline pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <div>
            © {new Date().getFullYear()} {profile.businessName}. All rights reserved.
          </div>
          <Link
            href={HOME_ROUTE}
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-on-surface transition-colors"
          >
            <span>Powered by</span>
            <span className="font-semibold tracking-tight text-on-surface">Shopwus Platform</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
