"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Hourglass,
  Info,
  MoreHorizontal,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { VALUATION_DISCLAIMER_NOTE, VALUATION_TIER_CONFIG } from "@/constants";
import { useBillingSummaryQuery } from "@/hooks/queries";
import type { ValuationCardProps } from "@/types";
import { formatCompactMoney, formatMoney } from "@/utils";
import { ValuationHealthModal } from "./valuation-health-modal";

export function ValuationCard({ valuation, onRefresh, onToast }: ValuationCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    data: billingSummary,
    isLoading: isBillingLoading,
    refetch: refetchBilling,
  } = useBillingSummaryQuery();

  const totalSettled = billingSummary?.stats?.totalSettled || 0;

  // Calculate pending clearing: transactions paid in the last 24h (T+1 Paystack settlement cycle)
  const pendingClearing = useMemo(() => {
    if (!billingSummary?.transactions) return 0;
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return billingSummary.transactions
      .filter(
        tx =>
          tx.status === "SUCCESS" && Boolean(tx.paidAt) && new Date(tx.paidAt).getTime() > oneDayAgo
      )
      .reduce((sum, tx) => sum + (tx.merchantSettlement || 0), 0);
  }, [billingSummary?.transactions]);

  // Valuation Tier config & dynamic rating result
  const tierConfig = valuation?.tier ? VALUATION_TIER_CONFIG[valuation.tier] : undefined;
  const tierLabel = valuation?.tierLabel || tierConfig?.label || "Growing Business";
  const tierDescription =
    valuation?.tierDescription ||
    tierConfig?.description ||
    "Consistent monthly cashflow and healthy profit margins.";

  // Dynamic valuation update timestamp (e.g. "Updated Aug 2026")
  const lastUpdatedText = useMemo(() => {
    const rawDate = valuation?.calculatedAt ? new Date(valuation.calculatedAt) : new Date();
    const validDate = Number.isNaN(rawDate.getTime()) ? new Date() : rawDate;
    const formatted = validDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    return `Updated ${formatted}`;
  }, [valuation?.calculatedAt]);

  // Close popovers on click outside
  useEffect(() => {
    if (!showTooltip && !showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
      setShowTooltip(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showTooltip, showMenu]);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await Promise.all([onRefresh(), refetchBilling()]);
      onToast?.("Valuation model and settlement ledger refreshed.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Synchronized Skeleton State
  if (!valuation || isBillingLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch font-sans animate-pulse">
        {/* Left Dark Card Skeleton */}
        <div className="bg-[#0b333c] border border-[#134954] rounded-2xl p-6 sm:p-7 relative flex flex-col justify-between min-h-[310px] shadow-card">
          <div className="flex items-center justify-between">
            <div className="h-3 w-40 bg-white/10 rounded-md" />
            <div className="w-7 h-7 rounded-lg bg-white/10" />
          </div>
          <div className="flex flex-col items-center my-auto py-4">
            <div className="h-6 w-36 bg-white/10 rounded-full" />
            <div className="h-9 w-64 bg-white/10 rounded-md mt-3" />
            <div className="h-4 w-72 bg-white/10 rounded-md mt-2" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="h-4 w-36 bg-white/10 rounded-md" />
            <div className="h-3 w-24 bg-white/10 rounded-md" />
          </div>
        </div>

        {/* Right Stack Skeleton */}
        <div className="flex flex-col justify-between gap-4 h-full">
          <div className="flex-1 flex items-center justify-between p-5 sm:p-6 bg-card border border-border-hairline rounded-2xl shadow-xs min-h-[145px]">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-surface-high" />
              <div className="space-y-2">
                <div className="h-3 w-20 bg-surface-high rounded-md" />
                <div className="h-6 w-36 bg-surface-high rounded-md" />
              </div>
            </div>
            <div className="h-6 w-16 bg-surface-high rounded-full" />
          </div>

          <div className="flex-1 flex items-center justify-between p-5 sm:p-6 bg-card border border-border-hairline rounded-2xl shadow-xs min-h-[145px]">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-surface-high" />
              <div className="space-y-2">
                <div className="h-3 w-28 bg-surface-high rounded-md" />
                <div className="h-6 w-32 bg-surface-high rounded-md" />
              </div>
            </div>
            <div className="h-6 w-20 bg-surface-high rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch font-sans">
        {/* =========================================================================
            LEFT COLUMN: Business Valuation Index (Hero Dark Card)
           ========================================================================= */}
        <div className="bg-[#0b333c] text-white border border-[#134954] rounded-2xl p-6 sm:p-7 relative flex flex-col justify-between shadow-card overflow-hidden min-h-[310px]">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">
              Business Valuation
            </span>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setShowMenu(prev => !prev);
                }}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Valuation actions"
                title="Actions"
              >
                <MoreHorizontal size={15} />
              </button>

              {/* Action Dropdown Menu */}
              {showMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 bg-card border border-border-hairline rounded-xl shadow-popover p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-on-surface"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowHealthModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg hover:bg-surface-high transition-colors cursor-pointer text-left"
                  >
                    <ShieldCheck size={14} className="text-primary shrink-0" />
                    <span>Audit Checklist</span>
                  </button>
                  {onRefresh && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        handleRefresh();
                      }}
                      disabled={isRefreshing}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg hover:bg-surface-high transition-colors cursor-pointer text-left disabled:opacity-50"
                    >
                      <RefreshCw
                        size={14}
                        className={`text-muted shrink-0 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                      <span>Recalculate Valuation</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowTooltip(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg hover:bg-surface-high transition-colors cursor-pointer text-left"
                  >
                    <Info size={14} className="text-muted shrink-0" />
                    <span>Valuation Methodology</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Center: Valuation Rating Result & Valuation Range */}
          <div className="flex flex-col items-center justify-center my-auto py-4 text-center">
            {/* Dynamic Valuation Rating Pill */}
            <button
              type="button"
              onClick={() => setShowHealthModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#134954]/90 hover:bg-[#1a5b69] text-[#5eead4] border border-[#1f6371] transition-all cursor-pointer group shadow-xs"
              title="Click to view valuation rating audit"
              aria-label="Click to view valuation rating audit"
            >
              <span>{tierLabel}</span>
              {valuation.multiple > 0 && (
                <span className="text-white/60 text-[11px] font-normal border-l border-white/20 pl-1.5 ml-0.5">
                  {Number(valuation.multiple.toFixed(1))}x
                </span>
              )}
            </button>

            {/* Valuation Range */}
            <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-3 tabular-nums font-sans">
              {valuation.estimatedHigh <= 0
                ? formatCompactMoney(0)
                : `${formatCompactMoney(valuation.estimatedLow)} – ${formatCompactMoney(valuation.estimatedHigh)}`}
            </div>

            {/* Dynamic Valuation Rating Summary / Result Description */}
            <p className="text-xs text-white/75 text-center max-w-sm mt-2 leading-relaxed font-normal">
              {tierDescription}
            </p>
          </div>

          {/* Footer Row */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setShowHealthModal(true)}
              className="flex items-center gap-1.5 text-emerald-400 font-semibold cursor-pointer hover:text-emerald-300 transition-colors"
              title="View tier audit details"
            >
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              <span>Verified {tierLabel}</span>
            </button>

            <span className="text-white/60 font-medium">{lastUpdatedText}</span>
          </div>

          {/* Valuation Methodology Tooltip Popover */}
          {showTooltip && (
            <div
              className="absolute inset-x-5 top-14 p-4 bg-inverse-surface text-inverse-on-surface text-xs leading-relaxed rounded-xl shadow-popover border border-white/10 z-50 font-normal animate-in fade-in duration-150"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-semibold text-white">Valuation Methodology</span>
                <button
                  type="button"
                  onClick={() => setShowTooltip(false)}
                  className="text-white/60 hover:text-white cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
              {VALUATION_DISCLAIMER_NOTE}
            </div>
          )}
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Settlement Stack (Total Settled & Pending Clearing)
           ========================================================================= */}
        <div className="flex flex-col justify-between gap-4 h-full">
          {/* Card 1: Total Settled */}
          <div className="flex-1 flex items-center justify-between p-5 sm:p-6 bg-card border border-border-hairline rounded-2xl shadow-xs min-h-[145px]">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#e8f8f0] text-[#10b981] flex items-center justify-center shrink-0">
                <ArrowUpRight size={22} className="stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-muted font-medium block">Total Settled</span>
                <div className="text-lg sm:text-xl font-bold text-on-surface tabular-nums tracking-tight mt-0.5 truncate font-sans">
                  {formatMoney(totalSettled, "NGN", { decimals: 2 })}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e8f8f0] text-[#10b981] shrink-0 ml-3 font-sans">
              +30.6%
            </span>
          </div>

          {/* Card 2: Pending Clearing */}
          <div className="flex-1 flex items-center justify-between p-5 sm:p-6 bg-card border border-border-hairline rounded-2xl shadow-xs min-h-[145px]">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#fef8e7] text-[#f59e0b] flex items-center justify-center shrink-0">
                <Hourglass size={20} className="stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-muted font-medium block">Pending Clearing</span>
                <div className="text-lg sm:text-xl font-bold text-on-surface tabular-nums tracking-tight mt-0.5 truncate font-sans">
                  {formatMoney(pendingClearing, "NGN", { decimals: 2 })}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fef8e7] text-[#d97706] shrink-0 ml-3 font-sans">
              Tomorrow
            </span>
          </div>
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
