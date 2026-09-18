"use client";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { INVOICE_PAGE_CONFIG, INVOICE_STATUS_FILTERS } from "@/constants";
import type { InvoiceStatusFilter, InvoiceTableProps } from "@/types";
import { formatDate, formatMoney, formatStatusLabel } from "@/utils";
import { StatusBadge } from "../common/status-badge";
import { TableEmptyState } from "../common/table-empty-state";

export function InvoiceTable({
  items,
  paginatedItems,
  searchQuery,
  statusFilter,
  onSearch,
  onStatusFilterChange,
  onSelectInvoice,
  onMarkPaid,
  onMarkUnpaid,
  onDeleteDraft,
  currentPage,
  totalPages,
  pageSize,
  startIndex,
  onPageChange,
  onPageSizeChange,
}: InvoiceTableProps) {
  return (
    <div className="table-card font-sans">
      <div className="table-head justify-end">
        <div className="flex items-center gap-3 ml-auto">
          {/* Status Filter Dropdown matching Expenses */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => onStatusFilterChange(e.target.value as InvoiceStatusFilter)}
              aria-label="Filter invoices by status"
              className="h-9 appearance-none pl-3 pr-7 bg-card border border-border-hairline rounded-xl text-[11px] font-medium text-on-surface hover:bg-surface-container-low focus:outline-hidden transition-colors cursor-pointer shadow-2xs font-sans"
            >
              {INVOICE_STATUS_FILTERS.map(f => (
                <option key={f.key} value={f.key} className="text-[11px]">
                  {f.label}
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
              placeholder={INVOICE_PAGE_CONFIG.searchPlaceholder}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full border-collapse sm:min-w-[680px] text-left font-sans">
          <thead>
            <tr>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Invoice #
              </th>
              <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Customer
              </th>
              <th className="hidden md:table-cell px-5 py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Date Issued
              </th>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Due Date
              </th>
              <th className="px-2 sm:px-5 py-3 sm:py-3.5 text-left text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Amount
              </th>
              <th className="text-right sm:text-left px-2 sm:px-5 py-3 sm:py-3.5 text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Status
              </th>
              <th className="hidden sm:table-cell text-right px-5 py-3.5 text-[11px] font-semibold tracking-wider uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Actions
              </th>
              <th className="sm:hidden w-5 px-2 sm:px-5 py-3 sm:py-3.5 bg-surface-container-low border-b border-border-hairline" />
            </tr>
          </thead>
          <tbody className="align-middle">
            {paginatedItems.map(inv => (
              <tr
                key={inv.id}
                onClick={() => onSelectInvoice(inv)}
                className="cursor-pointer hover:bg-surface-container-low/50 transition-colors"
              >
                <td className="hidden sm:table-cell px-5 py-3.5 text-xs text-muted border-b border-border-hairline align-middle">
                  <b className="font-mono text-xs font-semibold text-on-surface block">
                    {inv.invoiceNumber}
                  </b>
                  <small className="text-muted text-[11px] mt-0.5 block font-sans">
                    {inv.items.length} {inv.items.length === 1 ? "item" : "items"}
                  </small>
                </td>
                <td className="px-3 sm:px-5 py-3 sm:py-3.5 text-xs text-muted border-b border-border-hairline align-middle">
                  <b className="text-xs sm:text-sm font-semibold text-on-surface block">
                    {inv.customerName}
                  </b>
                  {/* Mobile Invoice # & item count */}
                  <span className="sm:hidden font-mono text-[10px] text-primary block mt-0.5">
                    {inv.invoiceNumber} · {inv.items.length} item{inv.items.length === 1 ? "" : "s"}
                  </span>
                  <small className="text-[10px] sm:text-xs text-muted truncate block max-w-[140px] sm:max-w-none mt-0.5 font-sans">
                    {inv.customerEmail}
                  </small>
                </td>
                <td className="hidden md:table-cell px-5 py-3.5 text-xs text-muted border-b border-border-hairline align-middle font-sans">
                  {formatDate(inv.issueDate)}
                </td>
                <td className="hidden sm:table-cell px-5 py-3.5 text-xs text-muted border-b border-border-hairline align-middle font-sans">
                  {formatDate(inv.dueDate)}
                </td>
                <td className="whitespace-nowrap px-2 sm:px-5 py-3 sm:py-3.5 text-xs text-muted border-b border-border-hairline align-middle">
                  <span className="font-sans font-bold text-xs sm:text-sm text-on-surface tabular-nums">
                    {formatMoney(inv.total, inv.currency || "NGN")}
                  </span>
                </td>
                <td className="text-right sm:text-left whitespace-nowrap px-2 sm:px-5 py-3 sm:py-3.5 text-xs border-b border-border-hairline align-middle">
                  {/* Mobile: clean text label */}
                  <span
                    className={`sm:hidden text-[11px] font-semibold capitalize ${
                      inv.status === "paid"
                        ? "text-tertiary"
                        : inv.status === "sent"
                          ? "text-primary"
                          : inv.status === "cancelled"
                            ? "text-error"
                            : "text-muted"
                    }`}
                  >
                    {formatStatusLabel(inv.status)}
                  </span>
                  {/* Desktop: standard StatusBadge pill */}
                  <span className="hidden sm:inline-block">
                    <StatusBadge status={inv.status} showGlyph />
                  </span>
                </td>
                <td
                  className="hidden sm:table-cell text-right px-5 py-3.5 border-b border-border-hairline align-middle"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    {inv.status === "sent" && (
                      <button
                        type="button"
                        onClick={() => onMarkPaid(inv.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-tertiary-container hover:bg-tertiary-container/80 text-on-tertiary-container border border-tertiary/20 text-xs font-semibold transition-colors cursor-pointer"
                        title="Mark invoice as paid"
                        aria-label="Mark invoice as paid"
                      >
                        <Check size={12} />
                        <span>Mark Paid</span>
                      </button>
                    )}

                    {inv.status === "paid" && (
                      <button
                        type="button"
                        onClick={() => onMarkUnpaid(inv.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-low hover:bg-surface-container text-muted border border-border-hairline text-xs font-semibold transition-colors cursor-pointer"
                        title="Revert invoice to unpaid"
                        aria-label="Revert invoice to unpaid"
                      >
                        <RefreshCw size={11} />
                        <span>Revert</span>
                      </button>
                    )}

                    {inv.status === "draft" && onDeleteDraft && (
                      <button
                        type="button"
                        onClick={() => onDeleteDraft(inv)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-error hover:bg-error-container/40 border border-error/20 text-xs font-semibold transition-colors cursor-pointer"
                        title="Delete draft invoice"
                        aria-label="Delete draft invoice"
                      >
                        <Trash2 size={11} />
                        <span>Delete</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectInvoice(inv)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-border-hairline hover:border-primary text-xs font-semibold transition-colors cursor-pointer"
                      title="View and edit invoice details"
                      aria-label="View and edit invoice details"
                    >
                      <Eye size={12} />
                      <span>View</span>
                    </button>
                  </div>
                </td>
                <td className="sm:hidden w-5 text-right px-2 py-3 border-b border-border-hairline align-middle">
                  <ChevronRight size={14} className="text-muted ml-auto" />
                </td>
              </tr>
            ))}

            {paginatedItems.length === 0 && (
              <TableEmptyState
                colSpan={7}
                title="No invoices found"
                description={INVOICE_PAGE_CONFIG.emptyStateMessage}
              />
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
