"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import type { TransactionStatusFilter, TransactionTableProps } from "@/types";
import { formatDate } from "@/utils";
import { formatCurrency } from "@/utils/currency";
import { StatusBadge } from "../common/status-badge";
import { TableEmptyState } from "../common/table-empty-state";

const STATUS_OPTIONS: Array<{ key: TransactionStatusFilter; label: string }> = [
  { key: "all", label: "All statuses" },
  { key: "SUCCESS", label: "Settled" },
  { key: "FAILED", label: "Failed" },
  { key: "REFUNDED", label: "Refunded" },
];

export function TransactionTable({
  items,
  paginatedItems,
  searchQuery,
  statusFilter,
  onSearch,
  onStatusFilterChange,
  currentPage,
  totalPages,
  pageSize,
  startIndex,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: TransactionTableProps) {
  return (
    <div className="table-card font-sans">
      {/* Table Head matching Expenses and Invoices */}
      <div className="table-head justify-end">
        <div className="flex items-center gap-3 ml-auto">
          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => onStatusFilterChange(e.target.value as TransactionStatusFilter)}
              aria-label="Filter transactions by status"
              className="h-9 appearance-none pl-3 pr-7 bg-card border border-border-hairline rounded-md text-[11px] font-medium text-on-surface hover:bg-surface-low focus:outline-none transition-colors cursor-pointer shadow-2xs font-sans"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.key} value={opt.key} className="text-[11px]">
                  {opt.label}
                </option>
              ))}
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
              placeholder="Search transactions..."
            />
          </div>
        </div>
      </div>

      {/* Table Wrap */}
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full border-collapse sm:min-w-[680px] text-left font-sans">
          <thead>
            <tr>
              <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Order / Reference
              </th>
              <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Customer
              </th>
              <th className="hidden md:table-cell px-5 py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Date
              </th>
              <th className="px-2 sm:px-5 py-3 sm:py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Gross Total
              </th>
              <th className="px-2 sm:px-5 py-3 sm:py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Net Settled
              </th>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Platform Fee
              </th>
              <th className="text-right sm:text-left px-2 sm:px-5 py-3 sm:py-3.5 text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-xs text-muted">
                  <Loader2 size={20} className="animate-spin mx-auto mb-2 text-primary" />
                  Loading transaction records...
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <TableEmptyState
                colSpan={7}
                title="No transactions found"
                description={
                  searchQuery || statusFilter !== "all"
                    ? "No transactions match your search query or selected status filter."
                    : "When customers complete orders and pay through your storefront, verified Paystack split settlement records will appear here."
                }
              />
            ) : (
              paginatedItems.map(tx => (
                <tr key={tx.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-3 sm:px-5 py-3.5 text-xs border-b border-border-hairline align-middle">
                    <b className="font-mono text-xs font-semibold text-on-surface block">
                      {tx.orderNumber}
                    </b>
                    <small className="text-muted text-[11px] font-mono mt-0.5 block truncate max-w-[140px] sm:max-w-[200px]">
                      {tx.reference}
                    </small>
                  </td>
                  <td className="px-3 sm:px-5 py-3.5 text-xs text-on-surface border-b border-border-hairline align-middle font-medium">
                    {tx.customerName}
                  </td>
                  <td className="hidden md:table-cell px-5 py-3.5 text-xs text-muted border-b border-border-hairline align-middle font-sans">
                    {formatDate(tx.paidAt)}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-5 py-3.5 text-xs border-b border-border-hairline align-middle">
                    <span className="font-sans font-bold text-xs sm:text-sm text-on-surface tabular-nums">
                      {formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-5 py-3.5 text-xs border-b border-border-hairline align-middle">
                    <span className="font-sans font-bold text-xs sm:text-sm text-emerald-700 tabular-nums">
                      {formatCurrency(tx.merchantSettlement)}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell whitespace-nowrap px-5 py-3.5 text-xs text-muted border-b border-border-hairline align-middle">
                    <span className="font-sans tabular-nums">{formatCurrency(tx.platformFee)}</span>
                  </td>
                  <td className="text-right sm:text-left whitespace-nowrap px-2 sm:px-5 py-3.5 text-xs border-b border-border-hairline align-middle">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border-hairline bg-surface-container-low text-xs text-muted rounded-b-2xl font-sans">
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
              className="bg-card border border-border-hairline rounded-xl px-2 py-0.5 text-[11px] text-on-surface focus:outline-hidden"
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
            className="p-1.5 rounded-xl border border-border-hairline bg-card hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed text-on-surface transition-colors cursor-pointer"
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
            className="p-1.5 rounded-xl border border-border-hairline bg-card hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed text-on-surface transition-colors cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
