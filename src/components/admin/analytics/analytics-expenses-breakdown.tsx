import Link from "next/link";
import { EXPENSE_CATEGORY_CONFIG } from "@/constants";
import type { AnalyticsExpensesBreakdownProps, ExpenseCategory } from "@/types";
import { formatMoney } from "../admin-layout";

export function AnalyticsExpensesBreakdown({ data }: AnalyticsExpensesBreakdownProps) {
  return (
    <div className="lg:col-span-5 bg-card border border-border-hairline rounded-xl p-5 sm:p-6 shadow-card flex flex-col justify-between font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
        <div>
          <h2 className="text-sm sm:text-base font-sans font-bold text-on-surface">
            Spending by Category
          </h2>
          <span className="text-[11px] text-muted block mt-0.5 font-sans">
            Expense distribution &amp; budget allocation
          </span>
        </div>
        <Link
          href="/vendor/expenses"
          className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline"
        >
          Manage
        </Link>
      </div>

      {/* Expense Category Progress Bars */}
      <div className="space-y-4 pt-3">
        {data.expenseCategoryBreakdown && data.expenseCategoryBreakdown.length > 0 ? (
          data.expenseCategoryBreakdown.map(cat => {
            const config = EXPENSE_CATEGORY_CONFIG[cat.category as ExpenseCategory];
            const color = config ? config.color : "#13678a";
            return (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-on-surface">{cat.label}</span>
                  <span className="font-sans text-[11px] text-muted tabular-nums">
                    {formatMoney(cat.amount)}{" "}
                    <span className="text-muted/70">({cat.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-surface-high rounded-full h-1.5 overflow-hidden">
                  <div
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: color,
                    }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-xs text-muted">
            No recorded expense categories found.
          </div>
        )}
      </div>
    </div>
  );
}
