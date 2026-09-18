import { Menu, Share2, X } from "lucide-react";
import {
  BUSINESS_TYPE_CTA_MAP,
  BUSINESS_TYPE_PORTFOLIO_SECTION_TITLE,
  BUSINESS_TYPE_SERVICES_SECTION_TITLE,
  DEFAULT_BUSINESS_TYPE,
} from "@/constants";
import type { StudioNavbarProps } from "@/types";
import { isDarkColor } from "@/utils/helpers";

export function StudioNavbar({
  profile,
  slug,
  isFromSettings,
  isScrolled,
  activeSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  setQuoteModalOpen,
  handleCopyLink,
  primaryColor,
  secondaryColor,
  buttonColor,
  textColor,
  pageBgColor = "#faf8f5",
  monogram,
  radiusClass,
}: StudioNavbarProps) {
  const isDarkPage = isDarkColor(pageBgColor);
  const hasSocials = profile.socialChannels?.some(c => c.connected);
  const hasPortfolio =
    profile.showPortfolio !== false && Boolean(profile.portfolio && profile.portfolio.length > 0);
  const hasServices =
    profile.showServices !== false && Boolean(profile.services && profile.services.length > 0);
  const hasReviews =
    profile.showReviews !== false && Boolean(profile.reviews && profile.reviews.length > 0);

  return (
    <>
      {/* Top Banner / Breadcrumb - Only visible when coming from Studio Settings / Admin */}
      {isFromSettings && (
        <div
          className={`border-b px-4 py-2 text-xs flex items-center justify-between transition-colors ${
            isDarkPage
              ? "bg-black/40 border-white/10 text-white/70"
              : "bg-surface-low border-border-hairline text-text-muted"
          }`}
        >
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <span
              style={{ color: primaryColor }}
              className={`inline-flex items-center gap-1 font-medium ${
                isDarkPage ? "text-white" : "text-on-surface"
              }`}
            >
              Studio Admin Preview
            </span>
            <span className={isDarkPage ? "text-white/30" : "text-border-subtle"}>·</span>
            <span className="font-mono">shopwus.com/{profile.slug || slug}</span>
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                style={{ color: textColor }}
                className="inline-flex items-center gap-1 hover:opacity-80 font-medium transition-colors cursor-pointer"
              >
                <Share2 size={12} /> Share profile
              </button>
              <a
                href="/vendor/settings"
                className={`font-medium transition-colors hidden sm:inline ${
                  isDarkPage
                    ? "text-white/70 hover:text-white"
                    : "text-text-muted hover:text-on-surface"
                }`}
              >
                Return to Studio Settings →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header
        style={{
          backgroundColor: isScrolled
            ? isDarkPage
              ? "rgba(10, 15, 29, 0.92)"
              : "rgba(255, 255, 255, 0.92)"
            : "transparent",
        }}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? isDarkPage
              ? "backdrop-blur-md shadow-card border-b border-white/10"
              : "backdrop-blur-md shadow-card border-b border-border-hairline"
            : "border-b border-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div
              style={{
                backgroundColor: secondaryColor,
                color: primaryColor,
                borderColor: primaryColor,
              }}
              className="w-10 h-10 rounded-full border flex items-center justify-center font-sans text-lg font-bold transition-transform group-hover:scale-105 shadow-card overflow-hidden shrink-0"
            >
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.businessName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                monogram
              )}
            </div>
            <span
              style={{ color: textColor }}
              className="font-sans text-xl font-bold tracking-tight group-hover:opacity-80 transition-opacity"
            >
              {profile.businessName}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav
            className={`hidden md:flex items-center gap-8 text-sm font-medium ${
              isDarkPage ? "text-white/80" : "text-on-surface-variant"
            }`}
          >
            {hasSocials && (
              <a
                href="#social"
                style={{
                  color:
                    activeSection === "social" ? primaryColor : isDarkPage ? "white" : undefined,
                }}
                className={`transition-colors ${isDarkPage ? "hover:text-white" : "hover:text-on-surface"}`}
              >
                Socials
              </a>
            )}
            {hasPortfolio && (
              <a
                href="#portfolio"
                style={{
                  color:
                    activeSection === "portfolio" ? primaryColor : isDarkPage ? "white" : undefined,
                }}
                className={`transition-colors ${isDarkPage ? "hover:text-white" : "hover:text-on-surface"}`}
              >
                {
                  BUSINESS_TYPE_PORTFOLIO_SECTION_TITLE[
                    profile.businessType ?? DEFAULT_BUSINESS_TYPE
                  ]
                }
              </a>
            )}
            <a
              href="#products"
              style={{
                color:
                  activeSection === "products" ? primaryColor : isDarkPage ? "white" : undefined,
              }}
              className={`transition-colors ${isDarkPage ? "hover:text-white" : "hover:text-on-surface"}`}
            >
              Shop
            </a>
            {hasServices && (
              <a
                href="#services"
                style={{
                  color:
                    activeSection === "services" ? primaryColor : isDarkPage ? "white" : undefined,
                }}
                className={`transition-colors ${isDarkPage ? "hover:text-white" : "hover:text-on-surface"}`}
              >
                {
                  BUSINESS_TYPE_SERVICES_SECTION_TITLE[
                    profile.businessType ?? DEFAULT_BUSINESS_TYPE
                  ]
                }
              </a>
            )}
            {hasReviews && (
              <a
                href="#reviews"
                style={{
                  color:
                    activeSection === "reviews" ? primaryColor : isDarkPage ? "white" : undefined,
                }}
                className={`transition-colors ${isDarkPage ? "hover:text-white" : "hover:text-on-surface"}`}
              >
                Reviews
              </a>
            )}
          </nav>

          {/* Primary CTA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuoteModalOpen(true)}
              style={{ backgroundColor: buttonColor }}
              className={`text-white text-xs font-medium px-5 py-2.5 shadow-xs hover:shadow-card hover:opacity-95 transition-all cursor-pointer hidden sm:block ${radiusClass}`}
            >
              {BUSINESS_TYPE_CTA_MAP[profile.businessType ?? DEFAULT_BUSINESS_TYPE]}
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 cursor-pointer md:hidden ${
                isDarkPage
                  ? "text-white/80 hover:text-white"
                  : "text-text-muted hover:text-on-surface"
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-b px-6 py-5 space-y-4 animate-in fade-in duration-150 ${
              isDarkPage
                ? "bg-card border-white/10 text-white"
                : "bg-card border-border-hairline text-on-surface shadow-popover"
            }`}
          >
            <nav
              className={`flex flex-col gap-3.5 text-sm font-medium ${isDarkPage ? "text-white/80" : "text-on-surface-variant"}`}
            >
              {hasSocials && (
                <a
                  href="#social"
                  onClick={() => setMobileMenuOpen(false)}
                  className={isDarkPage ? "hover:text-white" : "hover:text-on-surface"}
                >
                  Social Networks
                </a>
              )}
              {hasPortfolio && (
                <a
                  href="#portfolio"
                  onClick={() => setMobileMenuOpen(false)}
                  className={isDarkPage ? "hover:text-white" : "hover:text-on-surface"}
                >
                  {
                    BUSINESS_TYPE_PORTFOLIO_SECTION_TITLE[
                      profile.businessType ?? DEFAULT_BUSINESS_TYPE
                    ]
                  }
                </a>
              )}
              <a
                href="#products"
                onClick={() => setMobileMenuOpen(false)}
                className={isDarkPage ? "hover:text-white" : "hover:text-on-surface"}
              >
                Shop
              </a>
              {hasServices && (
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className={isDarkPage ? "hover:text-white" : "hover:text-on-surface"}
                >
                  {
                    BUSINESS_TYPE_SERVICES_SECTION_TITLE[
                      profile.businessType ?? DEFAULT_BUSINESS_TYPE
                    ]
                  }
                </a>
              )}
              {hasReviews && (
                <a
                  href="#reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className={isDarkPage ? "hover:text-white" : "hover:text-on-surface"}
                >
                  Reviews
                </a>
              )}
            </nav>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setQuoteModalOpen(true);
              }}
              style={{ backgroundColor: buttonColor }}
              className={`w-full text-white text-xs font-medium py-3 shadow-xs hover:opacity-95 ${radiusClass}`}
            >
              {BUSINESS_TYPE_CTA_MAP[profile.businessType ?? DEFAULT_BUSINESS_TYPE]}
            </button>
          </div>
        )}
      </header>
    </>
  );
}
