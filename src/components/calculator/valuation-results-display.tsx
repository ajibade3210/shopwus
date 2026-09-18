import { ArrowRight, HelpCircle } from "lucide-react";
import { SDE_TOOLTIP_TEXT, VALUATION_DISCLAIMER_NOTE } from "@/constants/valuation";
import type { ValuationResultsDisplayProps } from "@/types";
import { formatMoney } from "@/utils/currency";

export function ValuationResultsDisplay({ result }: ValuationResultsDisplayProps) {
  const formattedNetProfit = formatMoney(result.averageNetProfit, result.currency);
  const formattedNetAssets = formatMoney(result.netAssets, result.currency);
  const formattedApproxValue = formatMoney(result.approximateValue, result.currency);
  const formattedLow = formatMoney(result.valuationRangeLow, result.currency);
  const formattedHigh = formatMoney(result.valuationRangeHigh, result.currency);

  return (
    <div className="bg-card border border-border-hairline rounded-2xl p-6 sm:p-7 shadow-card space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border-hairline pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-on-surface">Valuation Results</h2>

        <div
          className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-tertiary-container text-on-tertiary-container border border-tertiary/20 cursor-default"
          title={result.tierDescription}
        >
          {result.tierLabel}
        </div>
      </div>

      {/* Primary 3-Metric Hero Results Card */}
      <div className="bg-surface-container-low border border-border-hairline rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        {/* Annual Net Profit & Net Assets Row */}
        <div className="grid grid-cols-2 gap-4 border-b border-border-hairline pb-4">
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-semibold text-text-muted block truncate">
              Annual Net Profit
            </span>
            <div
              className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans tabular-nums tracking-tight text-on-surface truncate"
              title={formattedNetProfit}
            >
              {formattedNetProfit}
            </div>
            <p className="text-xs text-tertiary font-medium truncate">
              {result.profitMargin}% Profit Margin
            </p>
          </div>

          <div className="space-y-1 min-w-0">
            <span className="text-xs font-semibold text-text-muted block truncate">Net Assets</span>
            <div
              className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans tabular-nums tracking-tight text-on-surface truncate"
              title={formattedNetAssets}
            >
              {formattedNetAssets}
            </div>
            <p className="text-xs text-text-muted truncate">Cash, stock & equipment</p>
          </div>
        </div>

        {/* Estimated Business Value (Featured Highlight) */}
        <div className="bg-card border border-border-hairline rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Estimated Business Value
              </span>
              <div className="relative group cursor-pointer" title={SDE_TOOLTIP_TEXT}>
                <HelpCircle size={14} className="text-text-muted" />
              </div>
            </div>
            <div
              className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sans tabular-nums tracking-tight text-on-surface break-words"
              title={formattedApproxValue}
            >
              {formattedApproxValue}
            </div>
            <div className="text-xs text-on-surface-variant flex flex-wrap items-center gap-1">
              <span>Estimated Range:</span>
              <span className="font-semibold font-sans tabular-nums text-on-surface">
                {formattedLow}
              </span>
              <span>–</span>
              <span className="font-semibold font-sans tabular-nums text-on-surface">
                {formattedHigh}
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest px-4 py-3 rounded-xl border border-border-hairline text-left sm:text-right shrink-0">
            <span className="text-xs uppercase font-bold tracking-widest text-text-muted block">
              {result.averageNetProfit > 0 ? "Multiple Applied" : "Method Applied"}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-sans tabular-nums text-primary">
              {result.averageNetProfit > 0 ? `${result.multiple}x Profit` : "Asset-Based"}
            </span>
          </div>
        </div>
      </div>

      {/* Growth Opportunities / Levers */}
      <div className="bg-surface-container-lowest border border-border-hairline rounded-xl p-4 space-y-2.5">
        <div className="text-xs sm:text-sm font-bold text-on-surface">
          <span>How to Increase Your Valuation</span>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
          {result.growthOpportunities.slice(0, 3).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-tertiary font-bold leading-relaxed">•</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Footer & Disclaimer */}
      <div className="space-y-3 pt-1 border-t border-border-hairline">
        <a
          href="/signup"
          className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-3.5 rounded-xl text-xs sm:text-sm font-semibold hover:shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
        >
          <span>Start Free Trial to Track Valuation</span>
          <ArrowRight size={15} />
        </a>

        <p className="text-xs text-text-muted leading-relaxed text-center">
          {VALUATION_DISCLAIMER_NOTE}{" "}
          <a
            href="/terms"
            className="font-semibold text-primary hover:underline underline-offset-2 transition-colors cursor-pointer"
          >
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  );
}
