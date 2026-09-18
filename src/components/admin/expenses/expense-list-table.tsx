"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Edit2, Search, Trash2 } from "lucide-react";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_CONFIG, EXPENSE_PAYMENT_METHODS } from "@/constants";
import type { ExpenseCategory, ExpenseListTableProps } from "@/types";
import { formatDate, formatMoney } from "../admin-layout";
import { TableEmptyState } from "../common/table-empty-state";

export function ExpenseListTable({
  items,
  paginatedItems,
  searchQuery,
  selectedCategory,
  categories = [],
  onSearch,
  onCategoryChange,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  pageSize,
  startIndex,
  onPageChange,
  onPageSizeChange,
}: ExpenseListTableProps) {
  return (
    <div className="table-card font-sans">
      {/* Table Head matching Leads and Customers */}
      <div className="table-head justify-end">
        <div className="flex items-center gap-3 ml-auto">
          {/* Category Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => onCategoryChange(e.target.value as ExpenseCategory | "all")}
              aria-label="Filter expenses by category"
              className="h-9 appearance-none pl-3 pr-7 bg-card border border-border-hairline rounded-md text-[11px] font-medium text-on-surface hover:bg-surface-low focus:outline-none transition-colors cursor-pointer shadow-2xs font-sans"
            >
              <option value="all" className="text-[11px]">
                All
              </option>
              {categories && categories.length > 0
                ? categories.map(cat => {
                    const cfg = EXPENSE_CATEGORY_CONFIG[cat.category as ExpenseCategory];
                    const label = cat.label || cfg?.label || cat.category;
                    return (
                      <option key={cat.category} value={cat.category} className="text-[11px]">
                        {label}
                      </option>
                    );
                  })
                : EXPENSE_CATEGORIES.map(cat => {
                    const cfg = EXPENSE_CATEGORY_CONFIG[cat];
                    return (
                      <option key={cat} value={cat} className="text-[11px]">
                        {cfg.label}
                      </option>
                    );
                  })}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
          </div>

          {/* Standard Search Box */}
          <div className="table-search-box">
            <Search size={13} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search expenses..."
            />
          </div>
        </div>
      </div>

      {/* Table Wrap */}
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full border-collapse sm:min-w-[680px] text-left font-sans">
          <thead>
            <tr>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Date
              </th>
              <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Expense & Notes
              </th>
              <th className="hidden md:table-cell px-5 py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Category
              </th>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Payment Method
              </th>
              <th className="px-2 sm:px-5 py-3 sm:py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Amount
              </th>
              <th className="text-right px-2 sm:px-5 py-3 sm:py-3.5 text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {paginatedItems.map(expense => {
              const categoryConfig = EXPENSE_CATEGORY_CONFIG[expense.category] || {
                label: expense.category,
                bg: "var(--surface-container-low)",
                color: "var(--on-surface)",
                border: "var(--border-hairline)",
              };

              return (
                <tr
                  key={expense.id}
                  className="hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="hidden sm:table-cell whitespace-nowrap text-on-surface-variant font-medium px-5 py-3.5 text-xs border-b border-border-hairline align-middle">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-3 sm:px-5 py-3 sm:py-3.5 text-xs text-on-surface-variant border-b border-border-hairline align-middle">
                    <b className="text-xs sm:text-sm font-semibold text-on-surface block">
                      {expense.title}
                    </b>
                    {/* Mobile date and category subtitle */}
                    <div className="sm:hidden flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[10px] text-muted">{formatDate(expense.date)}</span>
                      <span
                        className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold border"
                        style={{
                          backgroundColor: categoryConfig.bg,
                          color: categoryConfig.text || categoryConfig.color,
                          borderColor: categoryConfig.border,
                        }}
                      >
                        {categoryConfig.label}
                      </span>
                    </div>
                    {expense.notes && (
                      <small className="truncate max-w-[140px] sm:max-w-md block text-[10px] sm:text-xs text-muted mt-0.5 font-sans">
                        {expense.notes}
                      </small>
                    )}
                  </td>
                  <td className="hidden md:table-cell px-5 py-3.5 text-xs border-b border-border-hairline align-middle">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
                      style={{
                        backgroundColor: categoryConfig.bg,
                        color: categoryConfig.text || categoryConfig.color,
                        borderColor: categoryConfig.border,
                      }}
                    >
                      {categoryConfig.label}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell text-on-surface-variant px-5 py-3.5 text-xs border-b border-border-hairline align-middle font-sans">
                    {EXPENSE_PAYMENT_METHODS[expense.paymentMethod] || expense.paymentMethod}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-5 py-3 sm:py-3.5 text-xs border-b border-border-hairline align-middle text-right sm:text-left">
                    <span className="font-sans tabular-nums font-bold text-xs sm:text-sm text-on-surface">
                      -{formatMoney(expense.amount)}
                    </span>
                  </td>
                  <td className="text-right px-2 sm:px-5 py-3 sm:py-3.5 border-b border-border-hairline align-middle">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        className="p-1 sm:p-1.5 rounded-md text-muted hover:text-on-surface hover:bg-surface-low transition-colors cursor-pointer"
                        title="Edit expense"
                        aria-label={`Edit ${expense.title}`}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(expense.id, expense.title)}
                        className="p-1 sm:p-1.5 rounded-md text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                        title="Delete expense"
                        aria-label={`Delete ${expense.title}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedItems.length === 0 && (
              <TableEmptyState
                colSpan={6}
                title="No expenses found"
                description="Record business expenses to track cash outflows and evaluate your profit margins."
              />
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border-hairline bg-surface text-xs text-muted rounded-b-xl font-sans">
        <div className="flex items-center gap-2">
          <span>
            Showing <b className="text-on-surface">{items.length === 0 ? 0 : startIndex + 1}</b>–
            <b className="text-on-surface">{Math.min(startIndex + pageSize, items.length)}</b> of{" "}
            <b className="text-on-surface">{items.length}</b> records
          </span>
          <div className="hidden sm:flex items-center gap-1.5 ml-3 border-l border-border-hairline pl-3">
            <span className="text-[11px] text-muted">Per page:</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              className="bg-card border border-border-hairline rounded-md px-2 py-0.5 text-[11px] text-on-surface focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-md border border-border-hairline bg-card hover:bg-surface-low disabled:opacity-40 disabled:cursor-not-allowed text-on-surface transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-2 text-xs font-semibold text-on-surface font-sans">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-md border border-border-hairline bg-card hover:bg-surface-low disabled:opacity-40 disabled:cursor-not-allowed text-on-surface transition-colors cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
