"use client";

import { ChevronLeft, ChevronRight, Loader2, MoreVertical, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import type { CustomerTableProps } from "@/types";
import { TableEmptyState } from "../common/table-empty-state";

export function CustomerTable({
  items,
  paginatedItems,
  searchQuery,
  onSearch,
  onSelectCustomer,
  selectedCustomerIds,
  onToggleSelect,
  onSelectAllActive,
  onClearSelection,
  onOpenBroadcast,
  onDeleteSelected,
  isDeletingBulk = false,
  onDeleteCustomer,
  currentPage,
  totalPages,
  pageSize,
  startIndex,
  onPageChange,
  onPageSizeChange,
}: CustomerTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const activeItems = items.filter(c => c.isActive);
  const isAllActiveSelected =
    activeItems.length > 0 && activeItems.every(c => selectedCustomerIds.includes(c.id));

  return (
    <div className="table-card">
      <div className="table-head">
        <div className="flex items-center gap-3">
          {selectedCustomerIds.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high text-muted border border-border-hairline">
              {selectedCustomerIds.length} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {selectedCustomerIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in duration-150">
              <button
                type="button"
                onClick={onOpenBroadcast}
                className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                Broadcast ({selectedCustomerIds.length})
              </button>

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
                  Delete ({selectedCustomerIds.length})
                </button>
              )}

              <button
                type="button"
                onClick={onClearSelection}
                className="px-3 py-2 rounded-xl border border-border-hairline bg-card hover:bg-surface-container-low text-on-surface text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              >
                Clear
              </button>
            </div>
          )}

          <div className="table-search-box">
            <Search size={13} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full border-collapse sm:min-w-[680px] text-left">
          <thead>
            <tr>
              <th className="w-8 sm:w-10 px-3 sm:px-5 py-3 sm:py-3.5 bg-surface-container-low border-b border-border-hairline">
                <input
                  type="checkbox"
                  checked={isAllActiveSelected}
                  onChange={onSelectAllActive}
                  title="Select all active customers"
                  aria-label="Select all active customers"
                  className="rounded border-border-hairline text-primary focus:ring-primary/30 cursor-pointer"
                />
              </th>
              <th className="px-2.5 sm:px-5 py-3 sm:py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Customer
              </th>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Service
              </th>
              <th className="text-right sm:text-left px-2 sm:px-5 py-3 sm:py-3.5 text-[10px] font-bold tracking-[0.08em] uppercase text-muted bg-surface-container-low border-b border-border-hairline">
                Status
              </th>
              <th className="w-5 sm:w-10 px-2 sm:px-5 py-3 sm:py-3.5 bg-surface-container-low border-b border-border-hairline" />
            </tr>
          </thead>
          <tbody className="align-middle">
            {paginatedItems.map(c => {
              const isSelected = selectedCustomerIds.includes(c.id);
              const servicesList = c.services || [];
              const hasServices = servicesList.length > 0;
              const s = hasServices ? servicesList[0] : null;

              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectCustomer(c.id)}
                  className={`cursor-pointer hover:bg-surface-container-low/50 transition-colors ${
                    isSelected ? "bg-surface-container-low" : ""
                  }`}
                >
                  <td
                    onClick={e => e.stopPropagation()}
                    className="w-8 sm:w-10 px-3 sm:px-5 py-3 sm:py-3.5 border-b border-border-hairline align-middle"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(c.id)}
                      aria-label={`Select customer ${c.name}`}
                      className="rounded border-border-hairline text-primary focus:ring-primary/30 cursor-pointer"
                    />
                  </td>
                  <td className="px-2.5 sm:px-5 py-3 sm:py-3.5 text-xs text-muted border-b border-border-hairline align-middle">
                    <b className="text-xs sm:text-sm font-semibold text-on-surface block">
                      {c.name}
                    </b>
                    {/* Mobile service subtitle */}
                    {s && (
                      <span className="sm:hidden text-[10px] text-primary font-medium block truncate mt-0.5">
                        {s.name}
                        {servicesList.length > 1 && ` (+${servicesList.length - 1})`}
                      </span>
                    )}
                    <small className="text-[10px] sm:text-xs text-outline truncate block max-w-[150px] sm:max-w-none mt-0.5">
                      {c.email}
                      {c.phone ? ` · ${c.phone}` : ""}
                    </small>
                  </td>
                  <td className="hidden sm:table-cell px-5 py-3.5 text-xs text-muted border-b border-border-hairline align-middle">
                    {s ? (
                      <div className="flex items-center">
                        <b className="truncate max-w-[220px] font-semibold text-on-surface">
                          {s.name}
                        </b>
                        {servicesList.length > 1 && (
                          <span
                            className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-surface-container-high text-muted font-mono font-bold shrink-0"
                            title={`${servicesList.length} connected services / scopes`}
                          >
                            +{servicesList.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center min-h-[38px]">
                        <span className="text-sm font-semibold text-outline leading-none select-none">
                          —
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="text-right sm:text-left whitespace-nowrap px-2 sm:px-5 py-3 sm:py-3.5 text-xs border-b border-border-hairline align-middle">
                    <div className="flex items-center justify-end sm:justify-start">
                      {/* Mobile: clean green/gray dot indicator */}
                      <span
                        className={`sm:hidden inline-block w-2.5 h-2.5 rounded-full ${
                          c.isActive ? "bg-tertiary" : "bg-outline"
                        }`}
                        title={c.isActive ? "Active" : "Inactive"}
                      />
                      {/* Desktop: full pill badge */}
                      <span
                        className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border ${
                          c.isActive
                            ? "bg-tertiary-container text-on-tertiary-container border-tertiary/20"
                            : "bg-surface-container-high text-muted border-border-hairline"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.isActive ? "bg-tertiary" : "bg-outline"
                          }`}
                        />
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td
                    onClick={e => e.stopPropagation()}
                    className="w-12 sm:w-16 text-right px-2 sm:px-4 py-3 sm:py-3.5 border-b border-border-hairline align-middle"
                  >
                    <div className="flex items-center justify-end gap-1">
                      {onDeleteCustomer && (
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === c.id ? null : c.id);
                            }}
                            className="p-1 text-outline hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                            aria-label={`Actions for ${c.name}`}
                          >
                            <MoreVertical size={14} />
                          </button>
                          {activeMenuId === c.id && (
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
                                    onSelectCustomer(c.id);
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
                                    onDeleteCustomer(c);
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
                          onSelectCustomer(c.id);
                        }}
                        className="p-1 text-outline hover:text-on-surface cursor-pointer transition-colors"
                        aria-label={`Open details for ${c.name}`}
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
                colSpan={5}
                title="No customer records found"
                description="Try adjusting your search query or add a new customer."
              />
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border-hairline bg-surface-container-low text-xs text-muted rounded-b-2xl">
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
              className="bg-card border border-border-hairline rounded-xl px-2 py-0.5 text-[11px] text-on-surface focus:outline-hidden focus:border-primary"
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
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border-hairline bg-card text-xs font-semibold text-on-surface hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
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
                className={`w-7 h-7 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  page === currentPage
                    ? "bg-primary text-white shadow-xs"
                    : "bg-card border border-border-hairline text-muted hover:bg-surface-container-low hover:text-on-surface"
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
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border-hairline bg-card text-xs font-semibold text-on-surface hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
