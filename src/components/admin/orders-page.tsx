"use client";

import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useOrderSummaryQuery, useOrdersQuery } from "@/hooks/queries";
import { markRegisterViewed } from "@/hooks/use-unseen-badge";
import { formatMoney, Metric, MetricsGrid, PageTitle } from "./admin-layout";
import { CreateOrderModal } from "./orders/create-order-modal";
import { OrderDetailsDrawer } from "./orders/order-details-drawer";
import { OrdersTable } from "./orders/orders-table";

export function OrdersPage() {
  const [tab, setTab] = useState<"all" | "unfulfilled" | "completed" | "abandoned">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: summary } = useOrderSummaryQuery();

  // Reset the sidebar unseen-orders badge once total is known
  useEffect(() => {
    if (summary?.totalOrders != null) {
      markRegisterViewed("orders_badge", summary.totalOrders);
    }
  }, [summary?.totalOrders]);

  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useOrdersQuery({
    page,
    limit: 15,
    tab,
    search: search || undefined,
  });

  const orders = ordersData?.items || [];
  const meta = ordersData?.meta;
  const isAbandonedTab = tab === "abandoned";

  return (
    <section className="content font-sans">
      <PageTitle
        title="Orders & Fulfillment"
        action={
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-md transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            Record Sale / Order
          </button>
        }
      />

      {/* Top Metric Strip */}
      <MetricsGrid cols={4}>
        <Metric label="Total Orders" value={String(summary?.totalOrders || 0)} />
        <Metric label="Unfulfilled Orders" value={String(summary?.unfulfilled || 0)} />
        <Metric label="Total Sales Revenue" value={formatMoney(summary?.totalRevenue || 0)} />
        <Metric label="Abandoned Checkouts" value={String(summary?.abandonedCount || 0)} />
      </MetricsGrid>

      {/* Main Register Box */}
      <div className="bg-card border border-border-hairline rounded-xl p-3 sm:p-4 shadow-card space-y-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-border-hairline pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setTab("all");
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              tab === "all"
                ? "bg-primary text-white shadow-2xs"
                : "text-muted hover:bg-surface-low hover:text-on-surface"
            }`}
          >
            All Orders ({summary?.totalOrders || 0})
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("unfulfilled");
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              tab === "unfulfilled"
                ? "bg-primary text-white shadow-2xs"
                : "text-muted hover:bg-surface-low hover:text-on-surface"
            }`}
          >
            Unfulfilled ({summary?.unfulfilled || 0})
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("completed");
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              tab === "completed"
                ? "bg-primary text-white shadow-2xs"
                : "text-muted hover:bg-surface-low hover:text-on-surface"
            }`}
          >
            Completed
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("abandoned");
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              tab === "abandoned"
                ? "bg-primary text-white shadow-2xs"
                : "text-muted hover:bg-surface-low hover:text-on-surface"
            }`}
          >
            Abandoned Checkouts ({summary?.abandonedCount || 0})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder={
              isAbandonedTab
                ? "Search abandoned checkouts by customer name, phone, email..."
                : "Search orders by order #, customer name, phone..."
            }
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-surface border border-border-hairline rounded-md transition-all text-on-surface placeholder:text-muted focus:outline-none focus:border-primary"
          />
        </div>

        {/* Table */}
        <OrdersTable
          orders={orders}
          isAbandonedTab={isAbandonedTab}
          isLoading={isLoading}
          onSelectOrder={id => setSelectedOrderId(id)}
        />

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-border-hairline text-xs text-muted font-sans">
            <div>
              Showing Page <b className="text-on-surface">{meta.page}</b> of{" "}
              <b className="text-on-surface">{meta.totalPages}</b> ({meta.total} records)
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-md border border-border-hairline bg-card hover:bg-surface-low text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-md border border-border-hairline bg-card hover:bg-surface-low text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onUpdated={() => refetch()}
      />

      {/* Manual Order Creation Modal */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => refetch()}
      />
    </section>
  );
}
