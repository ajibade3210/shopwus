"use client";

import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useOrderSummaryQuery, useOrdersQuery } from "@/hooks/queries";
import { formatMoney, Metric, PageTitle } from "./admin-layout";
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
    <section className="content">
      <PageTitle
        title="Orders & Fulfillment"
        action={
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-[#191c1d] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus size={15} />
            Record Sale / Order
          </button>
        }
      />

      {/* Top Metric Strip */}
      <div className="metrics">
        <Metric label="Total Orders" value={String(summary?.totalOrders || 0)} />
        <Metric label="Unfulfilled Orders" value={String(summary?.unfulfilled || 0)} />
        <Metric label="Total Sales Revenue" value={formatMoney(summary?.totalRevenue || 0)} />
        <Metric label="Abandoned Checkouts" value={String(summary?.abandonedCount || 0)} />
      </div>

      {/* Main Register Box */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-3 sm:p-4 shadow-2xs space-y-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-[#f0f0f0] pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setTab("all");
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === "all"
                ? "bg-[#191c1d] text-white"
                : "text-[#6b7280] hover:bg-gray-100 hover:text-[#191c1d]"
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
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === "unfulfilled"
                ? "bg-[#191c1d] text-white"
                : "text-[#6b7280] hover:bg-gray-100 hover:text-[#191c1d]"
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
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === "completed"
                ? "bg-[#191c1d] text-white"
                : "text-[#6b7280] hover:bg-gray-100 hover:text-[#191c1d]"
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
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === "abandoned"
                ? "bg-[#191c1d] text-white"
                : "text-[#6b7280] hover:bg-gray-100 hover:text-[#191c1d]"
            }`}
          >
            Abandoned Checkouts ({summary?.abandonedCount || 0})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
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
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl transition-all"
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
          <div className="flex items-center justify-between pt-3 border-t border-[#f0f0f0] text-xs text-[#6b7280]">
            <div>
              Showing Page <b>{meta.page}</b> of <b>{meta.totalPages}</b> ({meta.total} records)
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg border border-[#e5e7eb] hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-[#e5e7eb] hover:bg-gray-50 disabled:opacity-40"
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
