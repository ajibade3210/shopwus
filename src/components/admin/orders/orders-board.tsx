"use client";

import { ChevronDown, Filter, MoreHorizontal, Plus, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  DATE_FILTER_OPTIONS,
  DEFAULT_COLUMN_FILTER,
  ORDER_BOARD_COLUMNS,
  ORDER_STATUS_FILTER_OPTIONS,
  PAYMENT_STATUS_FILTER_OPTIONS,
} from "@/constants";
import type {
  ColumnDateFilter,
  ColumnFilterState,
  FulfillmentStatus,
  OrderStatus,
  OrdersBoardProps,
  PaymentStatus,
} from "@/types";
import { BoardCard } from "./board-card";

export function OrdersBoard({
  orders,
  isLoading,
  onSelectOrder,
  onMoveTo,
  deliveredMeta,
  onSwitchToTable,
}: OrdersBoardProps) {
  const [activeDragColumn, setActiveDragColumn] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, ColumnFilterState>>({});
  const [openFilterColumn, setOpenFilterColumn] = useState<string | null>(null);
  const filterPopoverRef = useRef<HTMLDivElement>(null);

  // Close filter popover on outside click
  useEffect(() => {
    if (!openFilterColumn) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(e.target as Node)) {
        setOpenFilterColumn(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openFilterColumn]);

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData("text/plain", orderId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (activeDragColumn !== colKey) {
      setActiveDragColumn(colKey);
    }
  };

  const handleDragLeave = (e: React.DragEvent, colKey: string) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (activeDragColumn === colKey) {
      setActiveDragColumn(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: FulfillmentStatus) => {
    e.preventDefault();
    setActiveDragColumn(null);
    const orderId = e.dataTransfer.getData("text/plain");
    if (!orderId) return;

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (order.fulfillmentStatus === targetStatus) return;

    await onMoveTo(orderId, targetStatus);
  };

  const getFilterForColumn = (colKey: string): ColumnFilterState => {
    return columnFilters[colKey] || DEFAULT_COLUMN_FILTER;
  };

  const updateColumnFilter = (colKey: string, partial: Partial<ColumnFilterState>) => {
    setColumnFilters(prev => ({
      ...prev,
      [colKey]: {
        ...(prev[colKey] || DEFAULT_COLUMN_FILTER),
        ...partial,
      },
    }));
  };

  const resetColumnFilter = (colKey: string) => {
    setColumnFilters(prev => {
      const next = { ...prev };
      delete next[colKey];
      return next;
    });
  };

  const getActiveFilterCount = (filter: ColumnFilterState): number => {
    let count = 0;
    if (filter.dateRange !== "ALL") count++;
    if (filter.orderStatus !== "ALL") count++;
    if (filter.paymentStatus !== "ALL") count++;
    return count;
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 font-sans items-start pb-6">
      {ORDER_BOARD_COLUMNS.map(col => {
        const columnRawOrders = orders.filter(order =>
          col.statuses.includes(order.fulfillmentStatus)
        );

        // Strictly order newest-to-oldest for every column:
        // - Delivered column: sort newest completion first (fulfilledAt or updatedAt)
        // - Active columns: sort newest creation first (createdAt)
        const sortedRawOrders = [...columnRawOrders].sort((a, b) => {
          if (col.key === "delivered") {
            const timeA = new Date(a.fulfilledAt || a.updatedAt).getTime();
            const timeB = new Date(b.fulfilledAt || b.updatedAt).getTime();
            return timeB - timeA;
          }
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return timeB - timeA;
        });

        const filter = getFilterForColumn(col.key);
        const activeFilterCount = getActiveFilterCount(filter);
        const isFilterOpen = openFilterColumn === col.key;

        // Real-time Column Filtering
        const columnFilteredOrders = sortedRawOrders.filter(order => {
          // 1. Date Range
          if (filter.dateRange !== "ALL") {
            const orderTime = new Date(order.createdAt).getTime();
            const now = new Date();
            if (filter.dateRange === "TODAY") {
              const startOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
              ).getTime();
              if (orderTime < startOfDay) return false;
            } else if (filter.dateRange === "7_DAYS") {
              const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
              if (orderTime < sevenDaysAgo) return false;
            } else if (filter.dateRange === "30_DAYS") {
              const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
              if (orderTime < thirtyDaysAgo) return false;
            }
          }

          // 2. General Order Status
          if (filter.orderStatus !== "ALL" && order.status !== filter.orderStatus) {
            return false;
          }

          // 3. Payment Status
          if (filter.paymentStatus !== "ALL" && order.paymentStatus !== filter.paymentStatus) {
            return false;
          }

          return true;
        });

        const count = columnFilteredOrders.length;
        const isDragOver = activeDragColumn === col.key;

        return (
          <div
            key={col.key}
            onDragOver={e => handleDragOver(e, col.key)}
            onDragLeave={e => handleDragLeave(e, col.key)}
            onDrop={e => handleDrop(e, col.dropTargetStatus)}
            className={`flex flex-col rounded-2xl border transition-all duration-150 relative ${
              isDragOver
                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                : "border-border-hairline bg-surface-container-lowest/50"
            }`}
          >
            {/* Colored Column Header Banner matching reference image */}
            <div
              className={`${col.headerBg} text-white px-4 py-3 rounded-t-2xl flex items-center justify-between shadow-xs select-none`}
            >
              <div className="flex items-center gap-2.5">
                <h3 className="font-semibold text-xs tracking-wide">{col.title}</h3>
                {/* White pill badge with dark count */}
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-white text-on-surface font-bold text-[11px] shadow-2xs">
                  {isLoading ? "–" : count}
                </span>
              </div>

              <div className="flex items-center gap-1.5 opacity-90">
                <span className="p-1 rounded hover:bg-white/20 transition-colors cursor-pointer">
                  <MoreHorizontal size={14} />
                </span>
                <span className="p-1 rounded hover:bg-white/20 transition-colors cursor-pointer">
                  <Plus size={14} />
                </span>
              </div>
            </div>

            {/* Sub-bar: Filter Pill dropdown with active indicator */}
            <div className="px-3 pt-2 pb-1.5 flex items-center justify-between border-b border-border-hairline/60 relative">
              <button
                type="button"
                onClick={() => setOpenFilterColumn(isFilterOpen ? null : col.key)}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  activeFilterCount > 0
                    ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                    : "text-muted hover:text-on-surface hover:bg-surface-low"
                }`}
              >
                <Filter size={11} />
                <span>
                  Filters
                  {activeFilterCount > 0 && ` (${activeFilterCount})`}
                </span>
                <ChevronDown size={10} />
              </button>

              <span className="text-[10px] text-muted font-medium">
                {col.key === "delivered" && deliveredMeta?.hasOverflow
                  ? `Showing ${count} of ${deliveredMeta.totalDelivered} deliveries`
                  : col.key === "delivered"
                    ? `${count} ${count === 1 ? "delivery" : "deliveries"} (past 14d)`
                    : `${count} ${count === 1 ? "order" : "orders"}`}
              </span>

              {/* Column Filter Popover */}
              {isFilterOpen && (
                <div
                  ref={filterPopoverRef}
                  onClick={e => e.stopPropagation()}
                  className="absolute left-3 top-full mt-1 z-40 w-64 bg-card border border-border-hairline rounded-xl shadow-xl p-3 text-xs text-on-surface animate-in fade-in-50 zoom-in-95 duration-100"
                >
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-border-hairline">
                    <span className="font-semibold text-xs text-on-surface">
                      Filter {col.title}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {activeFilterCount > 0 && (
                        <button
                          type="button"
                          onClick={() => resetColumnFilter(col.key)}
                          className="inline-flex items-center gap-1 text-[10px] text-muted hover:text-primary transition-colors cursor-pointer"
                        >
                          <RotateCcw size={10} />
                          <span>Reset</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setOpenFilterColumn(null)}
                        aria-label="Close filter"
                        className="text-muted hover:text-on-surface transition-colors cursor-pointer ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {/* Date Range Filter */}
                    <div>
                      <label className="block text-[10px] font-medium text-muted uppercase tracking-wider mb-1">
                        Date Created
                      </label>
                      <div className="relative">
                        <select
                          value={filter.dateRange}
                          onChange={e =>
                            updateColumnFilter(col.key, {
                              dateRange: e.target.value as ColumnDateFilter,
                            })
                          }
                          aria-label={`Date filter for ${col.title}`}
                          className="w-full h-8 appearance-none pl-2.5 pr-7 bg-card border border-border-hairline rounded-md text-xs font-medium text-on-surface hover:bg-surface-low focus:outline-none cursor-pointer"
                        >
                          {DATE_FILTER_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={11}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Order Status Filter */}
                    <div>
                      <label className="block text-[10px] font-medium text-muted uppercase tracking-wider mb-1">
                        Order Status
                      </label>
                      <div className="relative">
                        <select
                          value={filter.orderStatus}
                          onChange={e =>
                            updateColumnFilter(col.key, {
                              orderStatus: e.target.value as OrderStatus | "ALL",
                            })
                          }
                          aria-label={`Order status filter for ${col.title}`}
                          className="w-full h-8 appearance-none pl-2.5 pr-7 bg-card border border-border-hairline rounded-md text-xs font-medium text-on-surface hover:bg-surface-low focus:outline-none cursor-pointer"
                        >
                          {ORDER_STATUS_FILTER_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={11}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Payment Status Filter */}
                    <div>
                      <label className="block text-[10px] font-medium text-muted uppercase tracking-wider mb-1">
                        Payment Status
                      </label>
                      <div className="relative">
                        <select
                          value={filter.paymentStatus}
                          onChange={e =>
                            updateColumnFilter(col.key, {
                              paymentStatus: e.target.value as PaymentStatus | "ALL",
                            })
                          }
                          aria-label={`Payment status filter for ${col.title}`}
                          className="w-full h-8 appearance-none pl-2.5 pr-7 bg-card border border-border-hairline rounded-md text-xs font-medium text-on-surface hover:bg-surface-low focus:outline-none cursor-pointer"
                        >
                          {PAYMENT_STATUS_FILTER_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={11}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Column Cards Scroll Area */}
            <div className="p-3 flex flex-col gap-3 min-h-[420px] max-h-[calc(100vh-280px)] overflow-y-auto">
              {isLoading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : columnFilteredOrders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border-hairline/70 rounded-xl bg-card/40 my-2">
                  <p className="text-xs font-medium text-muted">No orders in this stage</p>
                  <p className="text-[11px] text-muted/70 mt-1">
                    {activeFilterCount > 0
                      ? "Try clearing filters to see matching orders"
                      : "Drag orders here or use card actions to transition"}
                  </p>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={() => resetColumnFilter(col.key)}
                      className="mt-2 text-[11px] text-primary font-semibold hover:underline cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                columnFilteredOrders.map(order => (
                  <BoardCard
                    key={order.id}
                    order={order}
                    effectiveStatus={order.fulfillmentStatus}
                    onSelect={onSelectOrder}
                    onMoveTo={onMoveTo}
                    onDragStart={handleDragStart}
                  />
                ))
              )}

              {!isLoading && col.key === "delivered" && onSwitchToTable && (
                <div className="pt-2 pb-1">
                  {deliveredMeta?.hasOverflow ? (
                    <button
                      type="button"
                      onClick={onSwitchToTable}
                      className="w-full py-2.5 px-3 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-primary hover:text-primary-hover border border-dashed border-primary/40 hover:border-primary rounded-xl bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer shadow-2xs"
                    >
                      <span>View {deliveredMeta.overflowCount} older deliveries in Table →</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onSwitchToTable}
                      className="w-full py-2 px-2 text-center text-[11px] font-medium text-muted hover:text-primary transition-colors cursor-pointer hover:underline"
                    >
                      View all historical records in Table →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-card border border-border-hairline rounded-xl p-3.5 shadow-2xs space-y-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-3.5 bg-surface-low rounded w-24" />
        <div className="h-3.5 bg-surface-low rounded w-4" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-surface-low shrink-0" />
        <div className="h-3 bg-surface-low rounded w-32" />
      </div>
      <div className="flex justify-between items-center pt-1">
        <div className="h-3 bg-surface-low rounded w-20" />
        <div className="h-3 bg-surface-low rounded w-12" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-border-hairline">
        <div className="h-3 bg-surface-low rounded w-16" />
        <div className="h-3 bg-surface-low rounded w-14" />
      </div>
    </div>
  );
}
