"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/landing/site-footer";
import { BrandLogo } from "@/components/shared/brand-logo";
import { DEFAULT_PUBLIC_VALUATION_INPUTS } from "@/constants/valuation";
import { calculatePublicValuation } from "@/services/api/valuation.service";
import type { PublicValuationInputs } from "@/types";
import { ValuationGuideSection } from "./valuation-guide-section";
import { ValuationInputForm } from "./valuation-input-form";
import { ValuationResultsDisplay } from "./valuation-results-display";
import { ValuationShopwusHelp } from "./valuation-shopwus-help";

export function ValuationCalculatorPage() {
  const [inputs, setInputs] = useState<PublicValuationInputs>({
    ...DEFAULT_PUBLIC_VALUATION_INPUTS,
  });

  const handleFieldChange = <K extends keyof PublicValuationInputs>(
    field: K,
    value: PublicValuationInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const result = useMemo(() => {
    return calculatePublicValuation(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Top Header Navigation */}
      <header className="border-b border-border-hairline bg-surface/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-on-surface transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </a>
            <span className="text-border-hairline hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-text-muted">
              <span>Resources</span>
              <span>/</span>
              <span className="text-on-surface font-bold">Valuation Calculator</span>
            </div>
          </div>

          <BrandLogo className="public-logo" />

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-xs font-semibold text-text-muted hover:text-on-surface hidden sm:inline"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="bg-primary hover:bg-primary-hover text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary-container text-on-tertiary-container border border-tertiary/20">
            Valuation Engine
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-on-surface tracking-tight leading-tight">
            Business Valuation Calculator
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Estimate the market worth of your company in seconds using industry SDE multiples, net
            profit run-rates, and balance sheet assets.
          </p>
        </section>

        {/* 2-Column Calculator Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ValuationInputForm values={inputs} onChange={handleFieldChange} />
          <ValuationResultsDisplay result={result} />
        </section>

        {/* Educational Guide Section */}
        <ValuationGuideSection />

        {/* Shopwus Help & Value Growth Section */}
        <ValuationShopwusHelp />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
