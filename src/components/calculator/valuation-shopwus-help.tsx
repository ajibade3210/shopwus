import { ArrowRight } from "lucide-react";
import { VALUATION_SHOPWUS_BENEFITS } from "@/constants/valuation";

export function ValuationShopwusHelp() {
  return (
    <section className="bg-card rounded-3xl p-8 sm:p-10 border border-border-hairline shadow-card space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface leading-tight tracking-tight">
          How to Increase Your Business Valuation with Shopwus
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Your business is worth more when it runs on clean systems instead of scattered DMs. Here
          is how Shopwus helps you command a higher market multiple.
        </p>
      </div>

      {/* 4 Value Driver Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {VALUATION_SHOPWUS_BENEFITS.map((item, idx) => (
          <div
            key={idx}
            className="bg-surface-container-low border border-border-hairline rounded-2xl p-6 space-y-2.5 hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-base font-bold text-on-surface leading-snug">{item.title}</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Banner */}
      <div className="border-t border-border-hairline pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-on-surface">
            Ready to track and grow your valuation?
          </h4>
          <p className="text-xs text-text-muted">
            Start your free trial in under 60 seconds. No credit card required.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/signup"
            className="bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold hover:shadow-xs transition-all cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <span>Start My Free Trial Now</span>
            <ArrowRight size={14} />
          </a>
          <a
            href="/login"
            className="bg-card hover:bg-surface-container-low text-on-surface border border-border-hairline px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs"
          >
            Enter Studio
          </a>
        </div>
      </div>
    </section>
  );
}
