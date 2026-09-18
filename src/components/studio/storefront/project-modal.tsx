"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_PORTFOLIO_IMAGE } from "@/constants";
import type { ProjectModalProps } from "@/types";

export function ProjectModal({ project, onClose, onInquire, primaryColor }: ProjectModalProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const allImages = useMemo(() => {
    if (!project) return [];
    if (project.gallery && project.gallery.length > 0) {
      return project.gallery;
    }
    if (project.image) {
      return [project.image];
    }
    return [];
  }, [project]);

  const projectId = project?.id;

  // Reset index when modal opens with a new project
  useEffect(() => {
    if (projectId) {
      setActiveIdx(0);
    }
  }, [projectId]);

  const handlePrev = useCallback(() => {
    setActiveIdx(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    setActiveIdx(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose, handlePrev, handleNext]);

  if (!project) return null;

  const currentImage = allImages[activeIdx] || project.image || DEFAULT_PORTFOLIO_IMAGE;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-card border border-border-hairline rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-popover relative my-auto max-h-[92vh] overflow-y-auto space-y-6">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-outline hover:text-on-surface p-2.5 bg-surface-low hover:bg-surface-high rounded-full cursor-pointer z-20 transition-colors shadow-2xs"
          aria-label="Close project lightbox"
        >
          <X size={18} />
        </button>

        {/* Header Eyebrow & Title */}
        <div className="pr-12">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              style={{ color: primaryColor }}
              className="text-[10px] uppercase tracking-[0.18em] font-semibold"
            >
              {project.category}
            </span>
            <span className="text-outline-variant text-xs">·</span>
            <span className="text-[10px] font-mono text-outline uppercase tracking-wider">
              {project.location}
            </span>
            {project.client && (
              <>
                <span className="text-outline-variant text-xs">·</span>
                <span className="text-[10px] font-medium text-outline">
                  Client: {project.client}
                </span>
              </>
            )}
            {project.year && (
              <>
                <span className="text-outline-variant text-xs">·</span>
                <span className="text-[10px] font-mono text-outline">{project.year}</span>
              </>
            )}
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-on-surface font-normal leading-tight">
            {project.title}
          </h3>
        </div>

        {/* Main Stage Image Viewer */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-surface-high group">
          <Image
            src={currentImage}
            alt={`${project.title} - Preview ${activeIdx + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover transition-all duration-300"
            priority
          />

          {/* Image Counter Badge */}
          {allImages.length > 1 && (
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-full shadow-sm">
              {activeIdx + 1} / {allImages.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-lowest/90 hover:bg-surface-lowest text-on-surface flex items-center justify-center shadow-lg backdrop-blur-xs cursor-pointer transition-all hover:scale-105"
                aria-label="Previous image"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-lowest/90 hover:bg-surface-lowest text-on-surface flex items-center justify-center shadow-lg backdrop-blur-xs cursor-pointer transition-all hover:scale-105"
                aria-label="Next image"
              >
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {allImages.length > 1 && (
          <section
            className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full scrollbar-none"
            aria-label="Project photo gallery thumbnails"
          >
            {allImages.map((imgUrl, i) => {
              const isSelected = i === activeIdx;
              return (
                <button
                  key={`${imgUrl}-${i}`}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-offset-2 scale-95 opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-100"
                  }`}
                  style={{
                    borderColor: isSelected ? primaryColor : "transparent",
                  }}
                  aria-label={`View photo ${i + 1}`}
                >
                  <Image
                    src={imgUrl || DEFAULT_PORTFOLIO_IMAGE}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </section>
        )}

        {/* Stats and Narrative */}
        <div className="space-y-3 pt-1 border-t border-border-hairline">
          {project.stats && (
            <div className="inline-flex items-center gap-2 bg-surface-low border border-border-hairline px-3.5 py-1.5 rounded-full text-xs font-medium text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>{project.stats}</span>
            </div>
          )}
          {project.description && (
            <p className="text-sm text-on-surface-variant leading-relaxed">{project.description}</p>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-outline">
            Commissioning inquiries handled discreetly by Vendor.
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onInquire();
            }}
            style={{ backgroundColor: primaryColor }}
            className="w-full sm:w-auto text-white text-xs font-medium px-7 py-3.5 rounded-full hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Inquire about this project</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
