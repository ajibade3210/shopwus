"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useOrderSummaryQuery, useOrdersQuery } from "@/hooks/queries";
import { markRegisterViewed } from "@/hooks/use-unseen-badge";
import type { OrderTab } from "@/types";
import { formatMoney, Metric, MetricsGrid, PageTitle } from "./admin-layout";
import { CreateOrderModal } from "./orders/create-order-modal";
import { OrderDetailsDrawer } from "./orders/order-details-drawer";
import { OrdersTable } from "./orders/orders-table";

export function OrdersPage() {
  const [tab, setTab] = useState<OrderTab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
    limit: pageSize,
    tab,
    search: search || undefined,
  });

  const orders = ordersData?.items || [];
  const meta = ordersData?.meta;

  const handleTabChange = (t: OrderTab) => {
    setTab(t);
    setPage(1);
  };

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const action = (
    <button
      type="button"
      onClick={() => setIsCreateModalOpen(true)}
      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 sm:py-2.5 rounded-md text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
    >
      <Plus size={14} />
      <span>Record Sale / Order</span>
    </button>
  );

  return (
    <section className="content font-sans">
      <PageTitle title="Orders & Fulfillment" action={action} />

      {/* Top Metrics Row */}
      <MetricsGrid cols={4}>
        <Metric label="Total Orders" value={String(summary?.totalOrders || 0)} />
        <Metric label="Unfulfilled Orders" value={String(summary?.unfulfilled || 0)} />
        <Metric label="Total Sales Revenue" value={formatMoney(summary?.totalRevenue || 0)} />
        <Metric label="Abandoned Checkouts" value={String(summary?.abandonedCount || 0)} />
      </MetricsGrid>

      {/* Standard Register Table */}
      <OrdersTable
        orders={orders}
        isAbandonedTab={tab === "abandoned"}
        isLoading={isLoading}
        onSelectOrder={id => setSelectedOrderId(id)}
        summary={summary}
        tab={tab}
        onTabChange={handleTabChange}
        searchQuery={search}
        onSearch={handleSearch}
        currentPage={page}
        totalPages={meta?.totalPages || 1}
        pageSize={pageSize}
        totalRecords={meta?.total || 0}
        startIndex={(page - 1) * pageSize}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />

      <OrderDetailsDrawer
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onUpdated={() => refetch()}
      />

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => refetch()}
      />
    </section>
  );
}
