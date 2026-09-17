"use client";

import { CheckCircle2 } from "lucide-react";
import { VALUATION_HOW_CALCULATED_SECTIONS, VALUATION_PURPOSE_GUIDES } from "@/constants/valuation";

export function ValuationGuideSection() {
  return (
    <section className="space-y-16">
      {/* 1. Valuation Framework / 3 Pillars */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            The 3 Pillars of Your Business Valuation
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Business worth is not guesswork. Professional acquirers and appraisers look at three
            core components to calculate fair market value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUATION_HOW_CALCULATED_SECTIONS.map((sec, idx) => (
            <div
              key={idx}
              className="bg-card border border-border-hairline rounded-2xl p-6 sm:p-7 shadow-card space-y-3.5 flex flex-col justify-between hover:border-primary/40 transition-all"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container-lowest border border-border-hairline text-primary">
                  {sec.badge}
                </div>
                <h3 className="text-base font-bold text-on-surface leading-snug">{sec.title}</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {sec.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Real-World Commercial Applications */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Why Knowing Your Business Worth Matters
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Whether you want to sell, acquire an existing studio, or secure growth funding, an
            accurate valuation gives you leverage in every conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {VALUATION_PURPOSE_GUIDES.map(guide => (
            <div
              key={guide.id}
              className="bg-card border border-border-hairline rounded-2xl p-6 sm:p-7 shadow-card space-y-5 flex flex-col justify-between hover:border-primary/40 transition-all"
            >
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    {guide.eyebrow}
                  </span>
                  <h3 className="text-lg font-bold text-on-surface mt-1 leading-snug">
                    {guide.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{guide.summary}</p>

                <div className="border-t border-border-hairline pt-4 space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                    Key Action Checklist:
                  </span>
                  <ul className="space-y-2.5">
                    {guide.points.map((pt, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface-variant"
                      >
                        <CheckCircle2 size={16} className="text-tertiary shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
