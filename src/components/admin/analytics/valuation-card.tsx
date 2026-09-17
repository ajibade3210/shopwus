"use client";

import { Info, Landmark, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { VALUATION_DISCLAIMER_NOTE, VALUATION_HEALTH_MODAL_CONFIG } from "@/constants";
import type { ValuationCardProps } from "@/types";
import { formatCompactMoney } from "@/utils";
import { ValuationHealthModal } from "./valuation-health-modal";

export function ValuationCard({ valuation, onRefresh, onToast }: ValuationCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!showTooltip) return;
    const handleClickOutside = () => setShowTooltip(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showTooltip]);

  const asOfDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  if (!valuation) {
    return (
      <div className="bg-card border border-border-hairline rounded-xl p-4 sm:p-6 lg:p-7 relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-card animate-pulse">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-56 bg-surface-high rounded-md" />
              <div className="w-5 h-5 rounded-full bg-surface-high" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 bg-surface-high rounded-md" />
              <div className="h-3 w-28 bg-surface-high rounded-md" />
            </div>
          </div>
          <div className="h-10 sm:h-12 w-64 sm:w-80 bg-surface-high rounded-md" />
          <div className="h-3.5 w-full max-w-md bg-surface-high rounded-md" />
        </div>
        <Landmark
          size={120}
          strokeWidth={1}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface/[0.03] pointer-events-none select-none"
        />
      </div>
    );
  }

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
    onToast?.("Valuation model updated with real-time sales and expense records.");
  };

  return (
    <>
      <div className="bg-card border border-border-hairline rounded-xl p-4 sm:p-6 lg:p-7 relative flex flex-col justify-between min-h-[170px] shadow-card">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                ESTIMATED VALUATION RANGE FOR YOUR STORE{" "}
              </span>
              <span className="relative inline-flex items-center group">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setShowTooltip(prev => !prev);
                  }}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:scale-110 transition-all cursor-pointer shadow-xs"
                  aria-label={VALUATION_HEALTH_MODAL_CONFIG.auditChecklistTooltip}
                >
                  <Info size={16} className="stroke-[2.5]" />
                </button>
                {/* Instant Tooltip Popover */}
                <span
                  role="tooltip"
                  className={`absolute right-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-3rem)] p-3.5 bg-inverse-surface text-inverse-on-surface text-[11px] leading-relaxed rounded-xl shadow-popover border border-white/10 transition-all duration-150 z-50 text-left font-normal ${
                    showTooltip
                      ? "opacity-100 visible pointer-events-auto"
                      : "opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none"
                  }`}
                >
                  {VALUATION_DISCLAIMER_NOTE}
                  <span className="absolute right-2 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto -top-1 border-4 border-transparent border-b-inverse-surface" />
                </span>
              </span>
            </div>

            {/* Date & Refresh / Audit Checklist Trigger inside card header */}
            <div className="flex items-center gap-2.5 text-[11px] text-on-surface-variant">
              <button
                type="button"
                onClick={() => setShowHealthModal(true)}
                className="px-2.5 py-1 rounded-md bg-surface-low hover:bg-surface-high text-on-surface border border-border-hairline text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                title={VALUATION_HEALTH_MODAL_CONFIG.auditChecklistTooltip}
                aria-label={VALUATION_HEALTH_MODAL_CONFIG.auditChecklistTooltip}
              >
                <span>{VALUATION_HEALTH_MODAL_CONFIG.auditChecklistButtonLabel}</span>
              </button>

              <span>
                Data as of: <strong className="text-on-surface font-semibold">{asOfDate}</strong>
              </span>
              {onRefresh && (
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="w-6 h-6 rounded-md bg-surface-low hover:bg-surface-high flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer disabled:opacity-50"
                  title="Recalculate valuation"
                  aria-label="Recalculate valuation"
                >
                  <RefreshCw size={11} className={isRefreshing ? "animate-spin" : ""} />
                </button>
              )}
            </div>
          </div>

          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface font-sans tabular-nums pt-1">
            {valuation.estimatedHigh <= 0
              ? formatCompactMoney(0)
              : `${formatCompactMoney(valuation.estimatedLow)} – ${formatCompactMoney(valuation.estimatedHigh)}`}
          </div>

          {valuation.estimatedHigh <= 0 ? (
            <div className="space-y-1">
              <span className="text-xs font-bold text-on-surface block">Unlock Live Valuation</span>
              <p className="text-xs text-on-surface-variant font-normal max-w-xl leading-relaxed">
                Log your first paid invoices and operating expenses to calculate an automated
                real-time valuation model.
              </p>
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant font-normal max-w-xl leading-relaxed">
              {valuation.tierDescription}
            </p>
          )}
        </div>

        {/* Architectural Landmark Pantheon Watermark */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none select-none">
          <Landmark
            size={120}
            strokeWidth={1}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface/[0.03]"
          />
        </div>
      </div>

      {/* Valuation Health & Accuracy Checklist Modal */}
      <ValuationHealthModal
        isOpen={showHealthModal}
        onClose={() => setShowHealthModal(false)}
        valuation={valuation}
      />
    </>
  );
}
