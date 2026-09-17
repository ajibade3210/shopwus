"use client";

import { ChevronDown } from "lucide-react";
import { INDUSTRY_SECTORS } from "@/constants/valuation";
import type { CurrencyCode, IndustrySector, ValuationInputFormProps } from "@/types";
import { CURRENCY_SYMBOLS } from "@/utils/currency";

const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "NGN", label: "NGN (₦)", symbol: "₦" },
  { code: "GBP", label: "GBP (£)", symbol: "£" },
  { code: "USD", label: "USD ($)", symbol: "$" },
  { code: "EUR", label: "EUR (€)", symbol: "€" },
];

export function ValuationInputForm({ values, onChange }: ValuationInputFormProps) {
  const sym = CURRENCY_SYMBOLS[values.currency] || "₦";

  return (
    <div className="bg-card border border-border-hairline rounded-2xl p-6 sm:p-7 shadow-card space-y-5">
      {/* Header with Currency Switch */}
      <div className="flex items-center justify-between border-b border-border-hairline pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-on-surface">Financial Inputs</h2>

        <div className="flex items-center gap-1 bg-surface-container-lowest border border-border-hairline p-1 rounded-xl">
          {CURRENCIES.map(c => (
            <button
              key={c.code}
              type="button"
              onClick={() => onChange("currency", c.code)}
              className={`px-3 py-1 text-xs font-bold font-sans tabular-nums rounded-lg transition-all cursor-pointer ${
                values.currency === c.code
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-on-surface"
              }`}
            >
              {c.symbol} {c.code}
            </button>
          ))}
        </div>
      </div>

      {/* Industry Sector Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-bold text-on-surface block">Industry</label>
        <div className="relative">
          <select
            value={values.industry}
            onChange={e => onChange("industry", e.target.value as IndustrySector)}
            aria-label="Select industry sector"
            className="w-full appearance-none bg-surface-container-lowest hover:bg-surface-container-low border border-border-hairline rounded-xl px-4 py-3 pr-10 text-xs sm:text-sm font-medium text-on-surface transition-all outline-hidden cursor-pointer focus:border-primary"
          >
            {Object.entries(INDUSTRY_SECTORS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label} (Base ~{item.baseMultiple}x)
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
        </div>
      </div>

      {/* Financial Inputs 2-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Annual Revenue */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-on-surface block">
            Annual Revenue
          </label>
          <div className="flex items-center w-full bg-surface-container-lowest hover:bg-surface-container-low border border-border-hairline rounded-xl px-4 py-3 transition-all focus-within:border-primary">
            <span className="text-xs sm:text-sm font-bold text-text-muted font-sans mr-2.5 select-none shrink-0">
              {sym}
            </span>
            <input
              type="number"
              min="0"
              max="999999999999"
              step="1000"
              value={values.annualRevenue === 0 ? "" : values.annualRevenue}
              onChange={e =>
                onChange(
                  "annualRevenue",
                  Math.min(999_999_999_999, Math.max(0, Number(e.target.value) || 0))
                )
              }
              aria-label="Annual Revenue"
              className="w-full bg-transparent text-xs sm:text-sm font-bold font-sans tabular-nums text-on-surface outline-hidden p-0 border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="50000"
            />
          </div>
        </div>

        {/* Annual Expenses */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-on-surface block">
            Annual Expenses
          </label>
          <div className="flex items-center w-full bg-surface-container-lowest hover:bg-surface-container-low border border-border-hairline rounded-xl px-4 py-3 transition-all focus-within:border-primary">
            <span className="text-xs sm:text-sm font-bold text-text-muted font-sans mr-2.5 select-none shrink-0">
              {sym}
            </span>
            <input
              type="number"
              min="0"
              max="999999999999"
              step="1000"
              value={values.annualExpenses === 0 ? "" : values.annualExpenses}
              onChange={e =>
                onChange(
                  "annualExpenses",
                  Math.min(999_999_999_999, Math.max(0, Number(e.target.value) || 0))
                )
              }
              aria-label="Annual Expenses"
              className="w-full bg-transparent text-xs sm:text-sm font-bold font-sans tabular-nums text-on-surface outline-hidden p-0 border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="40000"
            />
          </div>
        </div>
      </div>

      {/* Net Assets */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-bold text-on-surface block">
          Net Assets (Cash, Stock & Equipment)
        </label>
        <div className="flex items-center w-full bg-surface-container-lowest hover:bg-surface-container-low border border-border-hairline rounded-xl px-4 py-3 transition-all focus-within:border-primary">
          <span className="text-xs sm:text-sm font-bold text-text-muted font-sans mr-2.5 select-none shrink-0">
            {sym}
          </span>
          <input
            type="number"
            min="0"
            max="999999999999"
            step="500"
            value={values.netAssets === 0 ? "" : values.netAssets}
            onChange={e =>
              onChange(
                "netAssets",
                Math.min(999_999_999_999, Math.max(0, Number(e.target.value) || 0))
              )
            }
            aria-label="Net Assets"
            className="w-full bg-transparent text-xs sm:text-sm font-bold font-sans tabular-nums text-on-surface outline-hidden p-0 border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="15000"
          />
        </div>
      </div>

      {/* Repeat Customer Rate Slider */}
      <div className="space-y-3 bg-surface-container-lowest border border-border-hairline rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-on-surface block">
            Repeat Customer Rate
          </label>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-sans tabular-nums bg-card border border-border-hairline text-on-surface">
            {values.customerRetentionRate}% Repeat
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={values.customerRetentionRate}
          onChange={e => onChange("customerRetentionRate", Number(e.target.value))}
          aria-label="Repeat Customer Rate slider"
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-xs font-medium text-text-muted">
          <span>0% (All new clients)</span>
          <span>50% (Good retention)</span>
          <span>100% (High loyalty)</span>
        </div>
      </div>
    </div>
  );
}
