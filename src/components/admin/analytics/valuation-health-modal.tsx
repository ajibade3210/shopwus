"use client";

import { ArrowRight, CreditCard, Receipt, TrendingUp, Users, X } from "lucide-react";
import Link from "next/link";
import {
  VALUATION_DISCLAIMER_NOTE,
  VALUATION_HEALTH_MODAL_CONFIG,
  VALUATION_HEALTH_PILLARS,
} from "@/constants";
import type { ValuationHealthModalProps } from "@/types";
import { formatCompactMoney } from "@/utils";

export function ValuationHealthModal({ isOpen, onClose, valuation }: ValuationHealthModalProps) {
  if (!isOpen) return null;

  const getPillarMetric = (id: string) => {
    switch (id) {
      case "invoices":
        return `${formatCompactMoney(valuation.annualRunRate)} / yr ARR`;
      case "expenses":
        return `${valuation.profitMargin}% Net Margin`;
      case "customers":
        return `${valuation.activeCustomerCount} Clients (${formatCompactMoney(
          valuation.activeCustomerCount * 25000
        )} Equity)`;
      case "leads": {
        const pipelineDriver = valuation.drivers.find(d => d.id === "pipeline");
        return pipelineDriver ? pipelineDriver.value : "Active Inquiries";
      }
      default:
        return "Synced";
    }
  };

  const getPillarIcon = (name: string) => {
    switch (name) {
      case "Receipt":
        return <Receipt size={16} className="text-primary" />;
      case "CreditCard":
        return <CreditCard size={16} className="text-primary" />;
      case "Users":
        return <Users size={16} className="text-primary" />;
      case "TrendingUp":
        return <TrendingUp size={16} className="text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border-hairline rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 relative max-h-[90vh] overflow-y-auto shadow-popover text-on-surface"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-border-hairline">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight mt-0.5">
              {VALUATION_HEALTH_MODAL_CONFIG.title}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 max-w-lg leading-relaxed">
              {VALUATION_HEALTH_MODAL_CONFIG.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-on-surface hover:bg-surface-container-low border border-transparent hover:border-border-hairline transition-all cursor-pointer shrink-0"
            aria-label="Close valuation checklist modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Valuation Overview Summary */}
        <div className="bg-surface-container-low border border-border-hairline rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
              {VALUATION_HEALTH_MODAL_CONFIG.heroEstimatedLabel}
            </span>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-sans tabular-nums mt-0.5">
              {formatCompactMoney(valuation.estimatedLow)} –{" "}
              {formatCompactMoney(valuation.estimatedHigh)}
            </div>
          </div>

          <div className="flex flex-col sm:items-end justify-start border-t sm:border-t-0 pt-2.5 sm:pt-0 border-border-hairline text-xs gap-0.5">
            <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
              {VALUATION_HEALTH_MODAL_CONFIG.heroMultipleLabel}
            </span>
            <span className="font-sans font-bold text-primary text-sm tabular-nums">
              {valuation.multiple}x SDE / {valuation.profitMargin}% Margin
            </span>
          </div>
        </div>

        {/* 4 Pillars Checklist Grid */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
              {VALUATION_HEALTH_MODAL_CONFIG.pillarsSectionTitle}
            </h4>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-tertiary-container text-on-tertiary-container border border-tertiary/20 shrink-0 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary shrink-0" />
              {VALUATION_HEALTH_MODAL_CONFIG.pillarsSectionSubtitle}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {VALUATION_HEALTH_PILLARS.map(pillar => (
              <div
                key={pillar.id}
                className="bg-surface-container-lowest border border-border-hairline rounded-2xl p-4 flex flex-col justify-between hover:border-primary/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="text-primary">{getPillarIcon(pillar.iconName)}</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {pillar.eyebrow}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-on-surface mt-1">{pillar.title}</h5>
                  <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-border-hairline flex items-center justify-between gap-2">
                  <span className="text-[11px] font-sans font-bold text-on-surface tabular-nums truncate">
                    {getPillarMetric(pillar.id)}
                  </span>
                  <Link
                    href={pillar.actionHref}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline transition-colors shrink-0 cursor-pointer"
                  >
                    <span>{pillar.actionLabel}</span>
                    <ArrowRight
                      size={12}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Valuation Growth Levers */}
        <div className="bg-surface-container-low border border-border-hairline rounded-2xl p-4 sm:p-4.5 space-y-2.5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-on-surface">
            {VALUATION_HEALTH_MODAL_CONFIG.growthLeversTitle}
          </h5>
          <div className="space-y-2">
            {valuation.growthLevers?.map((lever, idx) => {
              if (typeof lever === "string") {
                return (
                  <p key={`lever-str-${idx}`} className="text-xs text-on-surface-variant leading-relaxed">
                    {lever}
                  </p>
                );
              }
              return (
                <div
                  key={`lever-obj-${lever.title || idx}`}
                  className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-on-surface block">{lever.title}</span>
                    <span className="text-on-surface-variant text-[11px] leading-relaxed block mt-0.5">
                      {lever.description}
                    </span>
                  </div>
                  {lever.impactMultiple && (
                    <span className="shrink-0 font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md text-[10px] self-start">
                      {lever.impactMultiple}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer Note & Footer */}
        <div className="space-y-3.5 pt-1">
          <p className="text-[11px] text-text-muted leading-relaxed italic text-center sm:text-left">
            {VALUATION_DISCLAIMER_NOTE}
          </p>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer text-center shadow-xs"
            >
              {VALUATION_HEALTH_MODAL_CONFIG.closeButtonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
