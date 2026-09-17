import type { BoardColumnDef, ColumnFilterState } from "@/types";

export const ORDER_BOARD_COLUMNS: BoardColumnDef[] = [
  {
    key: "unfulfilled",
    title: "Unfulfilled",
    headerBg: "bg-[#A05A2C]",
    statuses: ["UNFULFILLED"],
    dropTargetStatus: "UNFULFILLED",
  },
  {
    key: "processing",
    title: "Processing",
    headerBg: "bg-[#1976D2]",
    statuses: ["PROCESSING", "READY_FOR_PICKUP"],
    dropTargetStatus: "PROCESSING",
  },
  {
    key: "dispatched",
    title: "Dispatched",
    headerBg: "bg-[#4F46E5]",
    statuses: ["DISPATCHED"],
    dropTargetStatus: "DISPATCHED",
  },
  {
    key: "delivered",
    title: "Delivered",
    headerBg: "bg-[#16A34A]",
    statuses: ["DELIVERED"],
    dropTargetStatus: "DELIVERED",
  },
];

export const BOARD_AVATAR_PALETTE = [
  { bg: "bg-sky-100 text-sky-700", border: "border-sky-200" },
  { bg: "bg-amber-100 text-amber-700", border: "border-amber-200" },
  { bg: "bg-emerald-100 text-emerald-700", border: "border-emerald-200" },
  { bg: "bg-indigo-100 text-indigo-700", border: "border-indigo-200" },
  { bg: "bg-rose-100 text-rose-700", border: "border-rose-200" },
  { bg: "bg-purple-100 text-purple-700", border: "border-purple-200" },
] as const;

export const BOARD_QUERY_LIMIT = 100;

export const DEFAULT_COLUMN_FILTER: ColumnFilterState = {
  dateRange: "ALL",
  orderStatus: "ALL",
  paymentStatus: "ALL",
};

export const DATE_FILTER_OPTIONS: Array<{
  value: import("@/types").ColumnDateFilter;
  label: string;
}> = [
  { value: "ALL", label: "All Time" },
  { value: "TODAY", label: "Today" },
  { value: "7_DAYS", label: "Last 7 Days" },
  { value: "30_DAYS", label: "Last 30 Days" },
];

export const ORDER_STATUS_FILTER_OPTIONS: Array<{
  value: import("@/types").OrderStatus | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "All Statuses" },
  { value: "OPEN", label: "Open" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const PAYMENT_STATUS_FILTER_OPTIONS: Array<{
  value: import("@/types").PaymentStatus | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "All Payments" },
  { value: "PAID", label: "Paid" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];
