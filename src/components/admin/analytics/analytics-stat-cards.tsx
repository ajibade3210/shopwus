import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import type { AnalyticsStatCardsProps } from "@/types";
import { formatMoney } from "../admin-layout";

export function AnalyticsStatCards({ data }: AnalyticsStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* Card 1: Gross Sales */}
      <div className="bg-card border border-border-hairline rounded-xl p-4.5 flex flex-col justify-between space-y-3 shadow-card hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted font-sans">
            Gross Sales (Inflow)
          </span>
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              data.revenue.isPositive
                ? "bg-tertiary-container text-on-tertiary-container"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {data.revenue.isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {data.revenue.change}
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-on-surface font-sans tabular-nums">
          {formatMoney(data.revenue.rawNumber)}
        </div>
      </div>

      {/* Card 2: Operating Expenses */}
      <div className="bg-card border border-border-hairline rounded-xl p-4.5 flex flex-col justify-between space-y-3 shadow-card hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted font-sans">
            Operating Expenses
          </span>
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-destructive/10 text-destructive">
            <ArrowDownRight size={11} />
            {data.expenses?.change || "-5.40%"}
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-on-surface font-sans tabular-nums">
          {data.expenses ? formatMoney(data.expenses.rawNumber) : "₦0"}
        </div>
      </div>

      {/* Card 3: Real Net Profit */}
      <div className="bg-card border border-tertiary/40 rounded-xl p-4.5 flex flex-col justify-between space-y-3 shadow-card hover:border-tertiary/60 transition-all">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-tertiary font-sans">
            Real Net Profit
          </span>
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-tertiary-container text-on-tertiary-container">
            <TrendingUp size={11} />
            {data.netProfit?.change || "+41% margin"}
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-tertiary font-sans tabular-nums">
          {data.netProfit ? formatMoney(data.netProfit.rawNumber) : "₦0"}
        </div>
      </div>

      {/* Card 4: Inquiries */}
      <div className="bg-card border border-border-hairline rounded-xl p-4.5 flex flex-col justify-between space-y-3 shadow-card hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted font-sans">
            New Inquiries
          </span>
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              data.leads.isPositive ? "bg-tertiary-container text-on-tertiary-container" : "bg-destructive/10 text-destructive"
            }`}
          >
            {data.leads.isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {data.leads.change}
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-on-surface font-sans tabular-nums">
          {data.leads.value}
        </div>
      </div>

      {/* Card 5: Storefront Views */}
      <div className="bg-card border border-border-hairline rounded-xl p-4.5 flex flex-col justify-between space-y-3 shadow-card hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted font-sans">
            Profile Views
          </span>
          <span
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              data.views.isPositive ? "bg-tertiary-container text-on-tertiary-container" : "bg-destructive/10 text-destructive"
            }`}
          >
            {data.views.isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {data.views.change}
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-on-surface font-sans tabular-nums">
          {data.views.value}
        </div>
      </div>
    </div>
  );
}
