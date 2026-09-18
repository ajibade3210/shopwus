"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { LANDING_FAQS } from "@/constants";

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(LANDING_FAQS[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section
      className="py-24 px-5 sm:px-8 bg-[var(--background)]"
      id="faq"
      aria-labelledby="faq-title"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3.5 max-w-2xl mx-auto">
          <h2
            id="faq-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface tracking-tight"
          >
            Everything you need to know.
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {LANDING_FAQS.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-card border rounded-xl transition-all duration-200 overflow-hidden shadow-xs ${
                  isOpen
                    ? "border-primary ring-1 ring-primary/20"
                    : "border-border-hairline hover:border-border-subtle"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-on-surface tracking-tight">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-secondary text-white rotate-180"
                        : "bg-surface-container-low text-text-muted hover:text-on-surface"
                    }`}
                  >
                    <ChevronDown size={14} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-border-hairline animate-in fade-in duration-200"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Desk Prompt */}
        <div className="bg-card border border-border-hairline rounded-xl p-6 sm:p-7 text-center max-w-xl mx-auto space-y-3 shadow-xs">
          <strong className="text-sm font-bold text-on-surface block">
            Have a custom workflow question?
          </strong>
          <p className="text-xs text-text-muted leading-relaxed">
            Our Shopwus support team is available to assist you with onboarding, custom domain
            mapping, and data migrations.
          </p>
          <div className="pt-1">
            <a
              href="mailto:support@shopwus.com"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-primary-container border border-primary/20 text-primary hover:bg-primary-container/80 transition-colors"
            >
              Contact Shopwus Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
