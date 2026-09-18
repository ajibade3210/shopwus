"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreVertical,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { LeadFilterStatus, LeadTableProps } from "@/types";
import { formatDate, formatStatusLabel } from "@/utils";
import { StatusBadge } from "../common/status-badge";
import { TableEmptyState } from "../common/table-empty-state";

export function LeadTable({
  items,
  paginatedItems,
  searchQuery,
  onSearch,
  statusFilter = "all",
  onStatusFilterChange,
  onSelectLead,
  selectedLeadIds = [],
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  isDeletingBulk = false,
  onDeleteLead,
  currentPage,
  totalPages,
  pageSize,
  startIndex,
  onPageChange,
  onPageSizeChange,
}: LeadTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const isAllSelected =
    paginatedItems.length > 0 && paginatedItems.every(l => selectedLeadIds.includes(l.id));
  return (
    <div className="table-card">
      <div className="table-head">
        <div className="flex items-center gap-3">
          {selectedLeadIds.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high text-muted border border-border-hairline">
              {selectedLeadIds.length} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {selectedLeadIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in duration-150">
              {onDeleteSelected && (
                <button
                  type="button"
                  onClick={onDeleteSelected}
                  disabled={isDeletingBulk}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-error hover:bg-error-hover text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-60"
                >
                  {isDeletingBulk ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Delete ({selectedLeadIds.length})
                </button>
              )}
              {onClearSelection && (
                <button
                  type="button"
                  onClick={onClearSelection}
                  className="px-3 py-2 rounded-xl border border-border-hairline bg-card hover:bg-surface-container-low text-on-surface text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Status Filter Dropdown matching Invoices and Expenses */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => onStatusFilterChange?.(e.target.value as LeadFilterStatus)}
              aria-label="Filter inquiries by status"
              className="h-9 appearance-none pl-3 pr-7 bg-card border border-border-hairline rounded-md text-[11px] font-medium text-on-surface hover:bg-surface-low focus:outline-none transition-colors cursor-pointer shadow-2xs"
            >
              <option value="all" className="text-[11px]">
                All
              </option>
              <option value="active" className="text-[11px]">
                Active
              </option>
              <option value="new" className="text-[11px]">
                New
              </option>
              <option value="contacted" className="text-[11px]">
                Contacted
              </option>
              <option value="qualified" className="text-[11px]">
                Qualified
              </option>
              <option value="converted" className="text-[11px]">
                Converted
              </option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
            />
          </div>

          {/* Search Box */}
          <div className="table-search-box">
            <Search size={13} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search leads..."
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full border-collapse sm:min-w-[680px] text-left">
          <thead>
            <tr>
              <th className="w-8 sm:w-10 px-3 sm:px-5 py-3 sm:py-3.5 bg-surface-low border-b border-border-hairline">
                {onToggleSelect && (
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onSelectAll}
                    title="Select all on this page"
                    aria-label="Select all leads on this page"
                    className="rounded border-border-hairline text-primary focus:ring-primary/30 cursor-pointer"
                  />
                )}
              </th>
              <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-on-surface-variant bg-surface-low border-b border-border-hairline">
                Name
              </th>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-on-surface-variant bg-surface-low border-b border-border-hairline">
                Service requested
              </th>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-on-surface-variant bg-surface-low border-b border-border-hairline">
                Estimated date
              </th>
              <th className="text-right sm:text-left px-2 sm:px-5 py-3 sm:py-3.5 text-[10px] font-bold tracking-[0.08em] uppercase text-on-surface-variant bg-surface-low border-b border-border-hairline">
                Status
              </th>
              <th className="w-5 sm:w-10 px-2 sm:px-5 py-3 sm:py-3.5 bg-surface-low border-b border-border-hairline" />
            </tr>
          </thead>
          <tbody className="align-middle">
            {paginatedItems.map(lead => {
              const isSelected = selectedLeadIds.includes(lead.id);
              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead(lead.id)}
                  className={`cursor-pointer hover:bg-surface-low/50 transition-colors ${
                    isSelected ? "bg-surface-low" : ""
                  }`}
                >
                  <td
                    onClick={e => e.stopPropagation()}
                    className="w-8 sm:w-10 px-3 sm:px-5 py-3 sm:py-3.5 border-b border-border-hairline align-middle"
                  >
                    {onToggleSelect && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(lead.id)}
                        aria-label={`Select lead ${lead.name}`}
                        className="rounded border-border-hairline text-primary focus:ring-primary/30 cursor-pointer"
                      />
                    )}
                  </td>
                  <td className="px-3 sm:px-5 py-3 sm:py-3.5 text-xs text-on-surface-variant border-b border-border-hairline align-middle">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <b className="text-xs sm:text-sm font-semibold text-on-surface block">
                        {lead.name}
                      </b>
                      {lead.isExistingCustomer && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-secondary-container text-on-secondary-container border border-secondary/20">
                          Customer
                        </span>
                      )}
                    </div>
                    {/* Mobile service requested subtitle */}
                    <div className="sm:hidden text-[10px] text-primary font-medium mt-0.5 truncate">
                      {lead.service}
                      {lead.services &&
                        lead.services.length > 1 &&
                        ` (+${lead.services.length - 1})`}
                    </div>
                    <small className="text-[10px] sm:text-xs text-outline truncate block max-w-[150px] sm:max-w-none mt-0.5">
                      {lead.email}
                    </small>
                  </td>
                  <td className="hidden sm:table-cell px-5 py-3.5 text-xs text-on-surface-variant border-b border-border-hairline align-middle">
                    <div className="flex items-center">
                      <span className="font-semibold text-on-surface">{lead.service}</span>
                      {lead.services && lead.services.length > 1 && (
                        <span
                          className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-surface-high text-on-surface-variant font-mono font-bold shrink-0"
                          title={`${lead.services.length} requested services/scopes`}
                        >
                          +{lead.services.length - 1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-5 py-3.5 text-xs text-on-surface-variant border-b border-border-hairline align-middle">
                    {formatDate(lead.eventDate)}
                  </td>
                  <td className="text-right sm:text-left whitespace-nowrap px-2 sm:px-5 py-3 sm:py-3.5 text-xs text-on-surface-variant border-b border-border-hairline align-middle">
                    {/* Mobile: clean text label */}
                    <span
                      className={`sm:hidden text-[11px] font-semibold capitalize ${
                        lead.status === "new"
                          ? "text-amber-700"
                          : lead.status === "contacted"
                            ? "text-primary"
                            : lead.status === "qualified"
                              ? "text-secondary"
                              : lead.status === "converted"
                                ? "text-tertiary"
                                : "text-on-surface-variant"
                      }`}
                    >
                      {formatStatusLabel(lead.status)}
                    </span>
                    {/* Desktop: standard StatusBadge pill */}
                    <span className="hidden sm:inline-block">
                      <StatusBadge status={lead.status} />
                    </span>
                  </td>
                  <td
                    onClick={e => e.stopPropagation()}
                    className="w-12 sm:w-16 text-right px-2 sm:px-4 py-3 sm:py-3.5 border-b border-border-hairline align-middle"
                  >
                    <div className="flex items-center justify-end gap-1">
                      {onDeleteLead && (
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === lead.id ? null : lead.id);
                            }}
                            className="p-1 text-outline hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                            aria-label={`Actions for ${lead.name}`}
                          >
                            <MoreVertical size={14} />
                          </button>
                          {activeMenuId === lead.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={e => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                }}
                              />
                              <div className="absolute right-0 mt-1 w-32 bg-card rounded-xl shadow-popover border border-border-hairline z-20 py-1 overflow-hidden">
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setActiveMenuId(null);
                                    onSelectLead(lead.id);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-container-low text-left font-medium cursor-pointer transition-colors"
                                >
                                  View details
                                </button>
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setActiveMenuId(null);
                                    onDeleteLead(lead);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-error hover:bg-error/10 text-left font-medium cursor-pointer transition-colors"
                                >
                                  <Trash2 size={12} /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onSelectLead(lead.id);
                        }}
                        className="p-1 text-outline hover:text-on-surface cursor-pointer transition-colors"
                        aria-label={`Open details for ${lead.name}`}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {paginatedItems.length === 0 && (
              <TableEmptyState
                colSpan={6}
                title="No inquiries found"
                description="Try adjusting your search query or no inquiries yet"
              />
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border-hairline bg-surface-low text-xs text-on-surface-variant rounded-b-xl">
        <div className="flex items-center gap-2">
          <span>
            Showing <b className="text-on-surface">{items.length === 0 ? 0 : startIndex + 1}</b>–
            <b className="text-on-surface">{Math.min(startIndex + pageSize, items.length)}</b> of{" "}
            <b className="text-on-surface">{items.length}</b> records
          </span>
          <div className="hidden sm:flex items-center gap-1.5 ml-3 border-l border-border-hairline pl-3">
            <span className="text-[11px] text-outline">Per page:</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              className="bg-card border border-border-hairline rounded-md px-2 py-0.5 text-[11px] text-on-surface focus:outline-none focus:border-primary"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-border-hairline bg-card text-xs font-semibold text-on-surface hover:bg-surface-low disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft size={13} />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-7 h-7 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  page === currentPage
                    ? "bg-primary text-white shadow-xs"
                    : "bg-card border border-border-hairline text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-border-hairline bg-card text-xs font-semibold text-on-surface hover:bg-surface-low disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
