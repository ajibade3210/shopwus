"use client";

import { ArrowRight, ChevronDown, ChevronUp, Images } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  BUSINESS_TYPE_PORTFOLIO_SECTION_TITLE,
  DEFAULT_BUSINESS_TYPE,
  DEFAULT_PORTFOLIO_IMAGE,
  INITIAL_VISIBLE_PORTFOLIO_COUNT,
} from "@/constants";
import type { StudioPortfolioSectionProps } from "@/types";

const ALL_CATEGORY = "All";

export function StudioPortfolioSection({
  portfolio,
  setSelectedProject,
  setQuoteModalOpen: _setQuoteModalOpen,
  businessType,
  primaryColor,
  buttonColor: _buttonColor,
  textColor,
  radiusClass: _radiusClass,
}: StudioPortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of portfolio) {
      if (p.category) set.add(p.category);
    }
    return [ALL_CATEGORY, ...Array.from(set)];
  }, [portfolio]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === ALL_CATEGORY) return portfolio;
    return portfolio.filter(p => p.category === selectedCategory);
  }, [portfolio, selectedCategory]);

  const hasMoreProjects = filteredProjects.length > INITIAL_VISIBLE_PORTFOLIO_COUNT;
  const visibleProjects =
    isExpanded || !hasMoreProjects
      ? filteredProjects
      : filteredProjects.slice(0, INITIAL_VISIBLE_PORTFOLIO_COUNT);

  return (
    <section id="portfolio" className="scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span
            style={{ color: primaryColor }}
            className="text-[10px] uppercase tracking-[0.2em] font-semibold block mb-1.5"
          >
            Curated Showcase · {portfolio.length} Projects
          </span>
          <h2 style={{ color: textColor }} className="font-serif text-2xl sm:text-3xl font-normal">
            {BUSINESS_TYPE_PORTFOLIO_SECTION_TITLE[businessType ?? DEFAULT_BUSINESS_TYPE]}
          </h2>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 2 && (
          <div
            className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none"
            role="tablist"
            aria-label="Filter collection by category"
          >
            {categories.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsExpanded(false);
                  }}
                  style={{
                    backgroundColor: isActive ? primaryColor : undefined,
                    borderColor: isActive ? primaryColor : undefined,
                  }}
                  className={`text-xs px-4 py-2 rounded-full border transition-all whitespace-nowrap cursor-pointer font-medium ${
                    isActive
                      ? "shadow-2xs scale-100 text-white"
                      : "bg-surface-low/70 hover:bg-surface-low text-on-surface-variant hover:text-on-surface border-border-hairline"
                  }`}
                >
                  {cat}
                  {cat === ALL_CATEGORY && (
                    <span className="ml-1.5 text-[10px] opacity-70">({portfolio.length})</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProjects.map((proj, idx) => {
          const photoCount = proj.gallery && proj.gallery.length > 0 ? proj.gallery.length : 1;

          return (
            <button
              key={proj.id || idx}
              type="button"
              aria-label={`View ${proj.title} project and gallery`}
              onClick={() => setSelectedProject(proj)}
              className="group relative aspect-[4/3] w-full bg-card border border-border-hairline rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 cursor-pointer block p-0 text-left"
            >
              <Image
                src={proj.image || DEFAULT_PORTFOLIO_IMAGE}
                alt={proj.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-xs text-on-surface text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs z-10 border border-border-hairline/60">
                {proj.category}
              </div>

              {/* Multi-Photo Count Badge */}
              {photoCount > 1 && (
                <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 z-10">
                  <Images size={11} />
                  <span>{photoCount} Images</span>
                </div>
              )}

              {/* Hover Reveal Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10 text-left">
                {proj.location && (
                  <span className="text-[10px] font-mono text-white/80 uppercase tracking-wider block mb-0.5">
                    {proj.location}
                  </span>
                )}
                <h3 className="font-serif text-lg text-white font-normal leading-snug mb-2">
                  {proj.title}
                </h3>
                <span className="text-white text-xs font-medium inline-flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                  <span>View Project & Gallery</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* View More / Show Less Toggle */}
      {hasMoreProjects && (
        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            style={{
              borderColor: isExpanded ? undefined : primaryColor,
              color: isExpanded ? undefined : primaryColor,
            }}
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full border border-border-hairline bg-card hover:bg-surface-low text-on-surface-variant text-xs font-semibold shadow-card hover:shadow-md transition-all cursor-pointer"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>
                <span>Show Less</span>
                <ChevronUp
                  size={14}
                  className="group-hover:-translate-y-0.5 transition-transform"
                />
              </>
            ) : (
              <>
                <span>
                  View More Works ({filteredProjects.length - INITIAL_VISIBLE_PORTFOLIO_COUNT} more)
                </span>
                <ChevronDown
                  size={14}
                  className="group-hover:translate-y-0.5 transition-transform"
                />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
