import { formatStatusLabel } from "@/utils";

export type StatusVariant =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "completed"
  | "active"
  | "paid"
  | "closed"
  | "lost"
  | "overdue"
  | "draft"
  | "pending"
  | "sent"
  | string;

export function getStatusBadgeClass(status: StatusVariant): string {
  switch (status?.toLowerCase()) {
    case "active":
    case "paid":
    case "completed":
    case "converted":
    case "delivered":
    case "qualified":
      return "bg-[#ebf8f2] text-[#2d8a74] border-[#81efd2]";
    case "closed":
    case "lost":
    case "overdue":
    case "cancelled":
    case "unpaid":
      return "bg-[#feefef] text-[#d9383a] border-[#ffdad6]";
    case "new":
    case "pending":
    case "sent":
    case "processing":
      return "bg-[#fef3c7] text-[#92400e] border-[#fde68a]";
    case "contacted":
      return "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]";
    case "draft":
    case "archived":
      return "bg-surface-high text-muted border-border-hairline";
    default:
      return "bg-surface-low text-muted border-border-hairline";
  }
}

export function StatusBadge({
  status,
  className = "",
  showGlyph = false,
}: {
  status: StatusVariant;
  className?: string;
  showGlyph?: boolean;
}) {
  const isPositive = [
    "active",
    "paid",
    "completed",
    "converted",
    "delivered",
    "qualified",
  ].includes(status?.toLowerCase());

  const isCritical = ["closed", "lost", "overdue", "cancelled", "unpaid"].includes(
    status?.toLowerCase()
  );

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 border px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold font-sans rounded-full capitalize whitespace-nowrap leading-tight transition-colors ${getStatusBadgeClass(
        status
      )} ${className}`}
    >
      {showGlyph && isPositive && <span className="text-[10px] font-bold">↗</span>}
      {showGlyph && isCritical && <span className="text-[10px] font-bold">↘</span>}
      {formatStatusLabel(status)}
    </span>
  );
}
