"use client";

import { ArrowRight, Check, ExternalLink, Home, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { CUSTOM_EVENTS } from "@/constants";
import { isAuthenticated } from "@/lib/api";
import type { NotFoundViewProps } from "@/types";

export function NotFoundView({ slug }: NotFoundViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const cleanSlug = (slug || "").trim();

  // Track authentication state
  useEffect(() => {
    setSignedIn(isAuthenticated());
    const handleAuthChange = () => setSignedIn(isAuthenticated());
    window.addEventListener(CUSTOM_EVENTS.authChanged, handleAuthChange);
    return () => window.removeEventListener(CUSTOM_EVENTS.authChanged, handleAuthChange);
  }, []);

  const claimHref = signedIn
    ? `/settings?claim=${encodeURIComponent(cleanSlug)}`
    : `/signup?claim=${encodeURIComponent(cleanSlug)}`;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-surface text-on-surface flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container font-sans antialiased relative overflow-hidden">
      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10 border-b border-border-hairline">
        <BrandLogo subtitle="Atelier Studio" />

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="text-xs text-text-muted hover:text-on-surface font-medium transition-colors flex items-center gap-1.5 px-3.5 py-2 rounded-full hover:bg-surface-low"
          >
            <Home size={13} />
            <span>Home</span>
          </Link>
          <Link
            href="/login"
            className="text-xs bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full font-medium transition-all shadow-xs flex items-center gap-1.5 hover:shadow-card"
          >
            <span>Enter Studio</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-4xl mx-auto px-6 py-12 md:py-20 my-auto z-10">
        {/* Centered Hero Header */}
        <div className="relative text-center max-w-2xl mx-auto mb-10">
          {/* Architectural Watermark 404 */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-serif text-[140px] sm:text-[190px] md:text-[230px] font-bold text-primary/[0.04] select-none pointer-events-none -z-10 leading-none tracking-tight">
            404
          </div>

          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-error-container border border-error/20 text-xs text-on-error-container mb-7">
            <span className="font-semibold tracking-wide">404 · Unregistered Atelier</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-on-surface mb-5 leading-[1.18]">
            This studio has not yet <br />
            <em className="italic font-normal text-primary">opened its doors.</em>
          </h1>

          {/* Explanatory Message */}
          <p
            className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed block"
            style={{ marginTop: "24px", marginBottom: "36px" }}
          >
            {cleanSlug ? (
              <>
                The requested URL{" "}
                <span className="inline-block bg-surface-low text-primary px-2.5 py-0.5 rounded font-mono font-semibold text-xs border border-border-hairline">
                  /{cleanSlug}
                </span>{" "}
                is currently unregistered or has not yet been published by its creator.
              </>
            ) : (
              "The requested studio profile or page could not be located in our registry."
            )}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-6 py-3 rounded-full transition-all shadow-xs hover:shadow-card cursor-pointer"
            >
              <Home size={15} />
              <span>Return to Homepage</span>
            </Link>
            <Link
              href={claimHref}
              className="inline-flex items-center gap-2 bg-surface-lowest text-on-surface border border-border-hairline text-sm font-medium px-6 py-3 rounded-full hover:border-border-subtle hover:bg-surface-low transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle size={15} className="text-primary" />
              <span>Claim & Create Studio</span>
            </Link>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-on-surface px-4 py-2.5 rounded-full hover:bg-surface-low transition-colors border border-border-hairline cursor-pointer"
            >
              {copiedLink ? (
                <Check size={13} className="text-tertiary" />
              ) : (
                <ExternalLink size={13} />
              )}
              <span>{copiedLink ? "Link Copied" : "Copy Link"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-border-hairline flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          <span>Shopwus Global Registry Active</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/" className="hover:text-on-surface transition-colors">
            Home
          </Link>
          <span className="text-border-subtle">·</span>
          <Link href="/vendor/settings" className="hover:text-on-surface transition-colors">
            Studio Settings
          </Link>
          <span className="text-border-subtle">·</span>
          <span>© 2026 Shopwus</span>
        </div>
      </footer>
    </main>
  );
}
