"use client";

import { LayoutGrid, List, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { BOARD_QUERY_LIMIT } from "@/constants";
import {
  useOrderSummaryQuery,
  useOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/hooks/queries";
import { markRegisterViewed } from "@/hooks/use-unseen-badge";
import type { FulfillmentStatus, Order, OrderTab, OrderView } from "@/types";
import { formatMoney, Metric, MetricsGrid, PageTitle } from "./admin-layout";
import { useAdminToast } from "./layout/admin-toast-provider";
import { CreateOrderModal } from "./orders/create-order-modal";
import { OrderDetailsDrawer } from "./orders/order-details-drawer";
import { OrdersBoard } from "./orders/orders-board";
import { OrdersTable } from "./orders/orders-table";

export function OrdersPage() {
  const [view, setView] = useState<OrderView>("table");
  const [tab, setTab] = useState<OrderTab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, FulfillmentStatus>>({});

  const { showToast } = useAdminToast();
  const updateStatusMutation = useUpdateOrderStatusMutation();
  const { data: summary } = useOrderSummaryQuery();

  // Reset the sidebar unseen-orders badge once total is known
  useEffect(() => {
    if (summary?.totalOrders != null) {
      markRegisterViewed("orders_badge", summary.totalOrders);
    }
  }, [summary?.totalOrders]);

  // Paginated table query — active only when in table view
  const {
    data: ordersData,
    isLoading: isTableLoading,
    refetch: refetchTable,
  } = useOrdersQuery(
    {
      page,
      limit: pageSize,
      tab,
      search: search || undefined,
    },
    { enabled: view === "table" }
  );

  // Active pipeline orders query — active only when in board view (capped at 100 max by API)
  const {
    data: boardData,
    isLoading: isBoardLoading,
    refetch: refetchBoard,
  } = useOrdersQuery(
    {
      tab: "all",
      limit: BOARD_QUERY_LIMIT,
    },
    { enabled: view === "board" }
  );

  const tableOrders = ordersData?.items || [];
  const meta = ordersData?.meta;

  // Board orders with optimistic overrides applied
  const rawBoardOrders = (boardData?.items as Order[]) || [];
  const boardOrders = rawBoardOrders
    .map(order => {
      const overrideStatus = overrides[order.id];
      if (overrideStatus) {
        return { ...order, fulfillmentStatus: overrideStatus };
      }
      return order;
    })
    .filter(order => order.fulfillmentStatus !== "CANCELLED");

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

  const handleMoveTo = async (orderId: string, targetStatus: FulfillmentStatus) => {
    // 1. Optimistic update
    setOverrides(prev => ({ ...prev, [orderId]: targetStatus }));

    try {
      // 2. Fire backend mutation
      await updateStatusMutation.mutateAsync({
        id: orderId,
        input: { fulfillmentStatus: targetStatus },
      });

      // 3. Clear override once persisted
      setOverrides(prev => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });

      // 4. Feedback toast
      if (targetStatus === "DELIVERED") {
        showToast("Order marked as Delivered");
      } else if (targetStatus === "PROCESSING") {
        showToast("Order status updated to Processing");
      } else if (targetStatus === "READY_FOR_PICKUP") {
        showToast("Order status updated to Ready for Pickup");
      } else if (targetStatus === "DISPATCHED") {
        showToast("Order status updated to Dispatched");
      } else {
        showToast("Order status updated successfully");
      }
    } catch (err: unknown) {
      // Roll back optimistic state on error
      setOverrides(prev => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
      const msg = err instanceof Error ? err.message : "Failed to update order status";
      showToast(msg);
    }
  };

  const action = (
    <div className="flex items-center gap-2.5">
      {/* View Toggle: Table vs Board */}
      <div className="inline-flex items-center p-0.5 rounded-lg border border-border-hairline bg-card shadow-2xs font-sans">
        <button
          type="button"
          onClick={() => setView("table")}
          aria-label="Table view"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            view === "table"
              ? "bg-primary text-white shadow-xs"
              : "text-muted hover:text-on-surface"
          }`}
        >
          <List size={13} />
          <span className="hidden sm:inline">Table</span>
        </button>

        <button
          type="button"
          onClick={() => setView("board")}
          aria-label="Board view"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            view === "board"
              ? "bg-primary text-white shadow-xs"
              : "text-muted hover:text-on-surface"
          }`}
        >
          <LayoutGrid size={13} />
          <span className="hidden sm:inline">Board</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setIsCreateModalOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-primary hover:bg-primary-hover text-white px-3.5 py-1.5 sm:py-2 rounded-md text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
      >
        <Plus size={14} />
        <span>Record Sale / Order</span>
      </button>
    </div>
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

      {/* Conditional View: Standard Register Table OR Fulfillment Board */}
      {view === "table" ? (
        <OrdersTable
          orders={tableOrders}
          isAbandonedTab={tab === "abandoned"}
          isLoading={isTableLoading}
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
      ) : (
        <OrdersBoard
          orders={boardOrders}
          isLoading={isBoardLoading}
          onSelectOrder={id => setSelectedOrderId(id)}
          onMoveTo={handleMoveTo}
        />
      )}

      <OrderDetailsDrawer
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onUpdated={() => {
          refetchTable();
          refetchBoard();
        }}
      />

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => {
          refetchTable();
          refetchBoard();
        }}
      />
    </section>
  );
}
