"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Eye, MessageCircle, Search } from "lucide-react";
import type {
  AbandonedTableProps,
  CheckoutSession,
  Order,
  OrdersTableProps,
  OrderTab,
} from "@/types";
import { formatCurrency } from "@/utils/currency";
import { StatusBadge } from "../common/status-badge";
import { TableEmptyState } from "../common/table-empty-state";

export function OrdersTable({
  orders,
  isAbandonedTab,
  isLoading,
  onSelectOrder,
  tab,
  onTabChange,
  searchQuery,
  onSearch,
  currentPage,
  totalPages,
  pageSize,
  totalRecords,
  startIndex,
  onPageChange,
  onPageSizeChange,
}: OrdersTableProps) {
  return (
    <div className="table-card font-sans">
      {/* Filter Dropdown + Search — matching standard register head */}
      <div className="table-head justify-end">
        <div className="flex items-center gap-3 ml-auto">
          {/* Tab / View Dropdown */}
          <div className="relative">
            <select
              value={tab}
              onChange={e => onTabChange(e.target.value as OrderTab)}
              aria-label="Filter orders by status"
              className="h-9 appearance-none pl-3 pr-7 bg-card border border-border-hairline rounded-md text-[11px] font-medium text-on-surface hover:bg-surface-low focus:outline-none transition-colors cursor-pointer shadow-2xs font-sans"
            >
              <option value="all">All Orders</option>
              <option value="unfulfilled">Unfulfilled</option>
              <option value="completed">Completed</option>
              <option value="abandoned">Abandoned</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
          </div>

          {/* Search */}
          <div className="table-search-box">
            <Search size={13} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder={isAbandonedTab ? "Search abandoned checkouts..." : "Search orders..."}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1 min-h-0">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted">
            <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <table className="w-full border-collapse font-sans">
            <tbody>
              <TableEmptyState
                colSpan={7}
                title={isAbandonedTab ? "No abandoned checkouts" : "No orders found"}
                description={
                  searchQuery
                    ? "No orders match your search."
                    : isAbandonedTab
                      ? "Great! All customers are completing their checkouts."
                      : "Orders placed by buyers will automatically show up here."
                }
              />
            </tbody>
          </table>
        ) : isAbandonedTab ? (
          <AbandonedTable sessions={orders as CheckoutSession[]} />
        ) : (
          <OrdersRegularTable orders={orders as Order[]} onSelectOrder={onSelectOrder} />
        )}
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border-hairline bg-surface-container-low text-xs text-muted rounded-b-2xl font-sans">
        <div className="flex items-center gap-2">
          <span>
            Showing <b className="text-on-surface">{totalRecords === 0 ? 0 : startIndex + 1}</b>–
            <b className="text-on-surface">{Math.min(startIndex + pageSize, totalRecords)}</b> of{" "}
            <b className="text-on-surface">{totalRecords}</b> records
          </span>
          <div className="hidden sm:flex items-center gap-1.5 ml-3 border-l border-border-hairline pl-3">
            <span className="text-[11px] text-muted">Per page:</span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={e => onPageSizeChange(Number(e.target.value))}
                className="appearance-none bg-card border border-border-hairline rounded-md px-2 pr-5 py-0.5 text-[11px] text-on-surface focus:outline-none cursor-pointer"
              >
                {[10, 20, 50].map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={10}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
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
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
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

function OrdersRegularTable({
  orders,
  onSelectOrder,
}: {
  orders: Order[];
  onSelectOrder: (id: string) => void;
}) {
  return (
    <table className="w-full text-left text-xs text-on-surface border-collapse font-sans sm:min-w-[680px]">
      <thead>
        <tr className="border-b border-border-hairline bg-surface text-muted font-semibold text-[11px] uppercase tracking-wider">
          <th className="py-3.5 px-4">Order #</th>
          <th className="py-3.5 px-4">Date</th>
          <th className="py-3.5 px-4">Customer</th>
          <th className="py-3.5 px-4">Total</th>
          <th className="py-3.5 px-4">Payment</th>
          <th className="py-3.5 px-4">Fulfillment</th>
          <th className="py-3.5 px-4 text-right">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border-hairline">
        {orders.map(order => (
          <tr key={order.id} className="hover:bg-surface/50 transition-colors group">
            <td className="py-3.5 px-4">
              <button
                type="button"
                onClick={() => onSelectOrder(order.id)}
                className="font-mono font-bold text-primary hover:underline cursor-pointer"
              >
                {order.orderNumber}
              </button>
            </td>
            <td className="py-3.5 px-4 text-muted font-sans">
              {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td className="py-3.5 px-4">
              <div className="font-semibold text-on-surface">{order.customerName}</div>
              <div className="text-[10px] text-muted font-sans">{order.customerPhone}</div>
            </td>
            <td className="py-3.5 px-4 font-sans font-bold tabular-nums text-on-surface">
              {formatCurrency(Number(order.total))}
            </td>
            <td className="py-3.5 px-4">
              <StatusBadge status={order.paymentStatus} showGlyph />
            </td>
            <td className="py-3.5 px-4">
              <StatusBadge status={order.fulfillmentStatus} showGlyph />
            </td>
            <td className="py-3.5 px-4 text-right">
              <button
                type="button"
                onClick={() => onSelectOrder(order.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface bg-card hover:bg-surface-low border border-border-hairline px-3 py-1.5 rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                <Eye size={12} /> View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AbandonedTable({ sessions }: AbandonedTableProps) {
  return (
    <table className="w-full text-left text-xs text-on-surface border-collapse font-sans">
      <thead>
        <tr className="border-b border-border-hairline bg-surface text-muted font-semibold text-[11px] uppercase tracking-wider">
          <th className="py-3.5 px-4">Customer Contact</th>
          <th className="py-3.5 px-4">Cart Value</th>
          <th className="py-3.5 px-4">Items</th>
          <th className="py-3.5 px-4">Abandoned On</th>
          <th className="py-3.5 px-4 text-right">Recovery Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border-hairline">
        {sessions.map(session => {
          const phone = session.customerPhone ? session.customerPhone.replace(/\D/g, "") : "";
          const whatsappUrl = phone
            ? `https://wa.me/${phone}?text=Hello%20${encodeURIComponent(session.customerName || "there")},%20we%20noticed%20you%20left%20items%20in%20your%20cart%20at%20our%20store.%20Can%20we%20help%20you%20complete%20your%20order?`
            : null;

          return (
            <tr key={session.id} className="hover:bg-surface/50 transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-semibold text-on-surface">
                  {session.customerName || "Anonymous Guest"}
                </div>
                <div className="text-[11px] text-muted mt-0.5 font-sans">
                  {session.customerEmail || "No email"}{" "}
                  {session.customerPhone ? `• ${session.customerPhone}` : ""}
                </div>
              </td>
              <td className="py-3.5 px-4 font-sans font-bold tabular-nums text-on-surface">
                {formatCurrency(Number(session.subtotal))}
              </td>
              <td className="py-3.5 px-4 text-muted font-sans">
                {session.cartSnapshot ? `${session.cartSnapshot.length} item(s)` : "Cart details"}
              </td>
              <td className="py-3.5 px-4 text-muted font-sans">
                {new Date(session.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3.5 px-4 text-right">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-card hover:bg-surface-low text-on-surface border border-border-hairline hover:border-border-subtle px-3 py-1.5 rounded-md text-xs font-semibold hover:shadow-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    <MessageCircle size={12} className="text-tertiary" /> Contact on WhatsApp
                  </a>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
