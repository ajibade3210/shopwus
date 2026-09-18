"use client";

import { ChevronDown, Menu, Search, Share2, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/storefront/cart-context";
import { useOptionalStorefront } from "@/components/storefront/storefront-context";
import { BUSINESS_TYPE_CTA_MAP, DEFAULT_BUSINESS_TYPE } from "@/constants";
import type { StudioNavbarProps } from "@/types";
import { isDarkColor } from "@/utils/helpers";

export function StudioNavbar({
  profile: propProfile,
  slug: propSlug,
  isFromSettings = false,
  isScrolled = false,
  activeSection = "home",
  mobileMenuOpen: propMobileMenuOpen,
  setMobileMenuOpen: propSetMobileMenuOpen,
  setQuoteModalOpen: propSetQuoteModalOpen,
  handleCopyLink: propHandleCopyLink,
  primaryColor: propPrimaryColor,
  secondaryColor: propSecondaryColor,
  buttonColor: propButtonColor,
  textColor: propTextColor,
  pageBgColor: propPageBgColor = "#faf8f5",
  monogram: propMonogram,
  radiusClass: propRadiusClass,
}: Partial<StudioNavbarProps>) {
  // Access global storefront context if available, with prop fallbacks
  const contextValue = useOptionalStorefront();

  const profile = contextValue?.profile || propProfile;
  const slug = contextValue?.slug || propSlug || "";
  const categories = contextValue?.categories || [];
  const primaryColor = contextValue?.primaryColor || propPrimaryColor || "#000000";
  const secondaryColor = contextValue?.secondaryColor || propSecondaryColor || "#0058BE";
  const buttonColor = contextValue?.buttonColor || propButtonColor || "#000000";
  const textColor = contextValue?.textColor || propTextColor || "#191C1D";
  const pageBgColor = contextValue?.pageBgColor || propPageBgColor || "#faf8f5";
  const monogram = contextValue?.monogram || propMonogram || "Ś";
  const radiusClass = contextValue?.buttonRadius || propRadiusClass || "rounded-xl";

  const { items, setIsCartOpen } = useCart();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [localMobileMenuOpen, setLocalMobileMenuOpen] = useState(false);
  const mobileMenuOpen =
    propMobileMenuOpen !== undefined ? propMobileMenuOpen : localMobileMenuOpen;
  const setMobileMenuOpen = propSetMobileMenuOpen || setLocalMobileMenuOpen;

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setCategoriesOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setCategoriesOpen(false);
    }, 200); // 200ms grace period prevents dropdown from closing while moving mouse
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const isDarkPage = isDarkColor(pageBgColor);
  const isService = profile?.businessType === "service";

  const openSearch = () => {
    if (contextValue?.setIsSearchOpen) {
      contextValue.setIsSearchOpen(true);
    }
    setMobileMenuOpen(false);
  };

  const openQuoteModal = () => {
    if (contextValue?.setIsQuoteModalOpen) {
      contextValue.setIsQuoteModalOpen(true);
    } else if (propSetQuoteModalOpen) {
      propSetQuoteModalOpen(true);
    }
    setMobileMenuOpen(false);
  };

  const onCopy = () => {
    if (propHandleCopyLink) {
      propHandleCopyLink();
    } else if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  if (!profile) return null;

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
          <div className="flex items-center gap-2 max-w-6xl mx-auto w-full">
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
                onClick={onCopy}
                style={{ color: textColor }}
                className="inline-flex items-center gap-1 hover:opacity-80 font-medium transition-colors cursor-pointer"
              >
                <Share2 size={12} /> Share
              </button>
              <a
                href="/vendor/settings"
                className={`font-medium transition-colors hidden sm:inline ${
                  isDarkPage
                    ? "text-white/70 hover:text-white"
                    : "text-text-muted hover:text-on-surface"
                }`}
              >
                Settings →
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
              ? "rgba(10, 15, 29, 0.94)"
              : "rgba(255, 255, 255, 0.94)"
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link
            href={`/${slug}`}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0"
          >
            <div
              style={{
                backgroundColor: secondaryColor,
                color: primaryColor,
                borderColor: primaryColor,
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center font-sans text-base sm:text-lg font-bold transition-transform group-hover:scale-105 shadow-card overflow-hidden shrink-0 relative"
            >
              {profile.logoUrl ? (
                <Image
                  src={profile.logoUrl}
                  alt={profile.businessName}
                  fill
                  sizes="40px"
                  className="object-cover rounded-full"
                />
              ) : (
                monogram
              )}
            </div>
            <span
              style={{ color: textColor }}
              className="font-sans text-base sm:text-xl font-bold tracking-tight group-hover:opacity-80 transition-opacity truncate max-w-[130px] sm:max-w-xs"
            >
              {profile.businessName}
            </span>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav
            className={`hidden md:flex items-center gap-7 text-sm font-medium ${
              isDarkPage ? "text-white/80" : "text-on-surface-variant"
            }`}
          >
            {/* Store Home Link */}
            <Link
              href={`/${slug}`}
              className={`transition-colors ${
                activeSection === "store"
                  ? "text-primary font-semibold"
                  : isDarkPage
                    ? "hover:text-white"
                    : "hover:text-on-surface"
              }`}
            >
              Store
            </Link>

            {/* Categories Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => {
                  if (dropdownTimeoutRef.current) {
                    clearTimeout(dropdownTimeoutRef.current);
                  }
                  setCategoriesOpen(prev => !prev);
                }}
                className={`flex items-center gap-1 py-1.5 transition-colors cursor-pointer ${
                  isDarkPage ? "hover:text-white" : "hover:text-on-surface"
                }`}
              >
                <span>Categories</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 pt-1.5 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div
                    className={`rounded-xl border p-2 shadow-hero ${
                      isDarkPage
                        ? "bg-[#0b1320] border-white/10 text-white"
                        : "bg-card border-border-hairline text-on-surface shadow-popover"
                    }`}
                  >
                    <div className="max-h-[280px] overflow-y-auto space-y-0.5">
                      <Link
                        href={`/${slug}`}
                        onClick={() => setCategoriesOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isDarkPage ? "hover:bg-white/10" : "hover:bg-surface-low"
                        }`}
                      >
                        All Categories
                      </Link>
                      {categories && categories.length > 0 ? (
                        categories.map(cat => (
                          <Link
                            key={cat.id}
                            href={`/${slug}/category/${cat.slug}`}
                            onClick={() => setCategoriesOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-xs transition-colors truncate ${
                              isDarkPage ? "hover:bg-white/10" : "hover:bg-surface-low"
                            }`}
                          >
                            {cat.name}
                          </Link>
                        ))
                      ) : (
                        <span className="block px-3 py-2 text-xs text-outline italic">
                          No categories found
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* About Link */}
            <Link
              href={`/${slug}/about`}
              className={`transition-colors ${
                activeSection === "about"
                  ? "text-primary font-semibold"
                  : isDarkPage
                    ? "hover:text-white"
                    : "hover:text-on-surface"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Action Icons & Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Icon Trigger */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search catalog"
              className={`p-2 sm:p-2.5 rounded-full border border-border-hairline transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs ${
                isDarkPage
                  ? "bg-white/5 text-white hover:bg-white/10 border-white/10"
                  : "bg-surface-low text-on-surface hover:bg-surface-high"
              }`}
            >
              <Search size={16} />
            </button>

            {/* Cart Trigger Button (Suppressed for pure Service businesses) */}
            {!isService && (
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label="View shopping bag"
                className={`p-2 sm:p-2.5 rounded-full border border-border-hairline transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs relative ${
                  isDarkPage
                    ? "bg-white/5 text-white hover:bg-white/10 border-white/10"
                    : "bg-surface-low text-on-surface hover:bg-surface-high"
                }`}
              >
                <ShoppingBag size={16} />
                {cartItemCount > 0 && (
                  <span
                    style={{ backgroundColor: buttonColor }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-scale-in"
                  >
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </button>
            )}

            {/* Primary Action Button (Desktop) */}
            <button
              type="button"
              onClick={openQuoteModal}
              style={{ backgroundColor: buttonColor }}
              className={`text-white text-xs font-semibold px-4 py-2 sm:py-2.5 shadow-xs hover:shadow-card hover:opacity-95 transition-all cursor-pointer hidden sm:flex items-center gap-1.5 ${radiusClass}`}
            >
              <span>{BUSINESS_TYPE_CTA_MAP[profile.businessType ?? DEFAULT_BUSINESS_TYPE]}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 cursor-pointer md:hidden rounded-lg ${
                isDarkPage
                  ? "text-white/80 hover:text-white"
                  : "text-text-muted hover:text-on-surface"
              }`}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out / Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-b px-5 py-4 space-y-4 animate-in fade-in duration-150 ${
              isDarkPage
                ? "bg-card border-white/10 text-white"
                : "bg-card border-border-hairline text-on-surface shadow-popover"
            }`}
          >
            {/* Mobile Full-Width Search Input */}
            <div
              onClick={openSearch}
              className="w-full bg-surface-low border border-border-hairline rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-outline cursor-pointer"
            >
              <Search size={15} />
              <span>Search products and categories...</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2.5 text-sm font-medium">
              <Link
                href={`/${slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 ${isDarkPage ? "text-white" : "text-on-surface font-semibold"}`}
              >
                Store
              </Link>

              {/* Categories Accordion */}
              <div className="space-y-1.5 py-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">
                  Categories
                </span>
                <div className="pl-2 space-y-1 max-h-40 overflow-y-auto">
                  <Link
                    href={`/${slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-on-surface-variant hover:text-primary transition-colors"
                  >
                    All Categories
                  </Link>
                  {categories && categories.length > 0 ? (
                    categories.map(cat => (
                      <Link
                        key={cat.id}
                        href={`/${slug}/category/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1 text-xs text-on-surface-variant hover:text-primary transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <span className="block py-1 text-xs text-outline italic">
                      No categories found
                    </span>
                  )}
                </div>
              </div>

              <Link
                href={`/${slug}/about`}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 ${isDarkPage ? "text-white/80 hover:text-white" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                About
              </Link>
            </nav>

            {/* Mobile Primary Action Button */}
            <button
              type="button"
              onClick={openQuoteModal}
              style={{ backgroundColor: buttonColor }}
              className={`w-full text-white text-xs font-semibold py-3 shadow-xs hover:opacity-95 ${radiusClass}`}
            >
              {BUSINESS_TYPE_CTA_MAP[profile.businessType ?? DEFAULT_BUSINESS_TYPE]}
            </button>
          </div>
        )}
      </header>
    </>
  );
}
