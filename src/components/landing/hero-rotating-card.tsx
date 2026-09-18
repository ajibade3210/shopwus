"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFeaturedStudiosQuery } from "@/hooks/queries/use-studio-queries";
import type { HeroRotatingCardProps } from "@/types";

export function HeroRotatingCard({
  organizations: initialOrgs,
  intervalMs = 6000,
}: HeroRotatingCardProps) {
  const { data: queryOrgs } = useFeaturedStudiosQuery();
  const orgs = (initialOrgs && initialOrgs.length > 0 ? initialOrgs : queryOrgs) || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentOrg = orgs[currentIndex] || orgs[0];

  const handleNext = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % orgs.length);
      setIsAnimating(false);
    }, 280);
  }, [orgs.length]);

  const handlePrev = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + orgs.length) % orgs.length);
      setIsAnimating(false);
    }, 280);
  }, [orgs.length]);

  const handleSelect = useCallback(
    (idx: number) => {
      if (idx === currentIndex) return;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(idx);
        setIsAnimating(false);
      }, 280);
    },
    [currentIndex]
  );

  useEffect(() => {
    if (isPaused || orgs.length <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, intervalMs, orgs.length, handleNext]);

  if (!currentOrg) {
    return (
      <div className="hero-card-container relative">
        <div className="profile-card block relative overflow-hidden animate-pulse bg-black/5 min-h-[380px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div
      className="hero-card-container relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-[340px] sm:w-[380px] rounded-2xl border border-border-hairline bg-card shadow-hero overflow-hidden transition-all duration-500 hover:shadow-2xl">
        {/* Browser Mockup Top Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface-low border-b border-border-hairline select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-on-surface-variant bg-card px-2.5 py-0.5 rounded-md border border-border-hairline">
            <span className="text-outline">shopwus.com/</span>
            <span className="font-semibold text-primary">{currentOrg.slug}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-tertiary">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
            <span>Active</span>
          </div>
        </div>

        <a
          href={`/${currentOrg.slug}`}
          className="group transition-all duration-300 block text-decoration-none relative overflow-hidden bg-card"
          aria-label={`View live profile for ${currentOrg.name}`}
        >
          {/* Top Floating Badge */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-md border border-border-hairline shadow-xs text-[10px] font-semibold text-on-surface">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Storefront Preview</span>
          </div>

          {/* Dynamic Studio Logo / Imagery */}
          <div
            className={`profile-image transition-all duration-300 relative overflow-hidden flex items-center justify-center bg-surface-low ${
              isAnimating ? "opacity-30 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {currentOrg.logoUrl ? (
              <img
                src={currentOrg.logoUrl}
                alt={`${currentOrg.name} logo`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-sans text-2xl font-bold text-on-surface">
                {currentOrg.name}
              </div>
            )}
          </div>

          {/* Dynamic Studio Meta */}
          <div
            className={`profile-meta transition-all duration-300 ${
              isAnimating ? "opacity-30 translate-y-1" : "opacity-100 translate-y-0"
            }`}
          >
            <span className="eyebrow text-primary font-bold uppercase tracking-wider text-[10px]">
              {currentOrg.eyebrow}
            </span>
            <h2 className="text-on-surface group-hover:text-primary transition-colors font-sans font-bold text-xl">
              {currentOrg.name}
            </h2>
            <p className="line-clamp-2 text-on-surface-variant text-xs mt-1">
              {currentOrg.tagline}
            </p>
          </div>

          {/* Card Footer with Custom Domain & CTA */}
          <div className="profile-foot border-t border-border-hairline py-3 px-6 flex items-center justify-between text-xs text-on-surface-variant">
            <span>{currentOrg.badge}</span>
            <span className="text-primary font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              View live profile <ArrowRight size={14} />
            </span>
          </div>
        </a>
      </div>

      {/* Floating Studio Switch Controls & Indicators */}
      <div className="hero-card-controls flex items-center justify-between mt-3 px-2">
        {/* Pagination Dots */}
        <div className="flex items-center gap-1.5">
          {orgs.map((org, idx) => (
            <button
              key={org.id || `org-${idx}`}
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleSelect(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? "w-5 bg-primary"
                  : "w-1.5 bg-border-hairline hover:bg-outline"
              }`}
              aria-label={`Switch to ${org.name}`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handlePrev();
            }}
            className="w-6 h-6 rounded-md flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-colors cursor-pointer"
            aria-label="Previous organization"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleNext();
            }}
            className="w-6 h-6 rounded-md flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-colors cursor-pointer"
            aria-label="Next organization"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
