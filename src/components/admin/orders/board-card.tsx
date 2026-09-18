"use client";

import { Calendar, MoreVertical, Package, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BOARD_AVATAR_PALETTE } from "@/constants";
import type { BoardCardProps, FulfillmentStatus } from "@/types";
import { formatCurrency } from "@/utils/currency";

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BOARD_AVATAR_PALETTE.length;
  return BOARD_AVATAR_PALETTE[index];
}

function getInitials(name: string): string {
  if (!name) return "CU";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function BoardCard({
  order,
  effectiveStatus,
  onSelect,
  onMoveTo,
  onDragStart,
}: BoardCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  const customerName = order.customerName || "Customer";
  const initials = getInitials(customerName);
  const avatarColor = getAvatarColor(customerName);

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isStorePickup = order.deliveryType === "STORE_PICKUP";
  const isPaid = order.paymentStatus === "PAID";
  const itemCount = order.items?.length || 1;

  const handleAction = async (e: React.MouseEvent, status: FulfillmentStatus) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    await onMoveTo(order.id, status);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onSelect(order.id);
  };

  return (
    <div
      draggable
      onDragStart={e => {
        setIsDragging(true);
        onDragStart(e, order.id);
      }}
      onDragEnd={() => setIsDragging(false)}
      onClick={() => onSelect(order.id)}
      className={`group relative bg-card border border-border-hairline rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all cursor-grab active:cursor-grabbing font-sans select-none ${
        isDragging
          ? "opacity-40 scale-95 border-dashed border-primary"
          : "hover:border-border-subtle"
      }`}
    >
      {/* Top Row: Order Number + Actions Button */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono font-bold text-xs text-on-surface tracking-tight truncate">
          {order.orderNumber}
        </span>

        {/* More Actions Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label={`Actions for order ${order.orderNumber}`}
            onClick={e => {
              e.stopPropagation();
              setIsMenuOpen(prev => !prev);
            }}
            className="p-1 rounded-md text-muted hover:text-on-surface hover:bg-surface-low transition-colors cursor-pointer"
          >
            <MoreVertical size={14} />
          </button>

          {/* Actions Dropdown */}
          {isMenuOpen && (
            <div
              onClick={e => e.stopPropagation()}
              className="absolute right-0 top-full mt-1 z-40 w-48 bg-card border border-border-hairline rounded-xl shadow-xl py-1 text-xs text-on-surface animate-in fade-in-50 zoom-in-95 duration-100"
            >
              <div className="px-3 py-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider border-b border-border-hairline">
                Status Actions
              </div>

              {/* Status Transition Options */}
              {effectiveStatus === "UNFULFILLED" && (
                <button
                  type="button"
                  onClick={e => handleAction(e, "PROCESSING")}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-surface-low hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Start Processing
                </button>
              )}

              {effectiveStatus === "PROCESSING" && (
                <>
                  <button
                    type="button"
                    onClick={e => handleAction(e, "READY_FOR_PICKUP")}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-surface-low hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Ready for Pickup
                  </button>
                  <button
                    type="button"
                    onClick={e => handleAction(e, "DISPATCHED")}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-surface-low hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Dispatch Order
                  </button>
                </>
              )}

              {effectiveStatus === "READY_FOR_PICKUP" && (
                <button
                  type="button"
                  onClick={e => handleAction(e, "DISPATCHED")}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-surface-low hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Dispatch Order
                </button>
              )}

              {effectiveStatus === "DISPATCHED" && (
                <button
                  type="button"
                  onClick={e => handleAction(e, "DELIVERED")}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-surface-low hover:text-emerald-600 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Mark Delivered
                </button>
              )}

              {effectiveStatus === "DELIVERED" && (
                <button
                  type="button"
                  onClick={e => handleAction(e, "DISPATCHED")}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-surface-low hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Move to Dispatched
                </button>
              )}

              <div className="border-t border-border-hairline my-1" />

              <button
                type="button"
                onClick={handleViewDetails}
                className="w-full text-left px-3 py-2 text-xs hover:bg-surface-low text-on-surface transition-colors cursor-pointer"
              >
                View Order Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Customer Row: Avatar + Name */}
      <div className="flex items-center gap-2 mb-2.5">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${avatarColor.bg} ${avatarColor.border}`}
        >
          {initials}
        </div>
        <span className="text-xs font-medium text-on-surface truncate">{customerName}</span>
      </div>

      {/* Date & Payment Status Row */}
      <div className="flex items-center justify-between gap-2 text-xs text-muted mb-2.5">
        <div className="flex items-center gap-1.5 text-[11px]">
          <Calendar size={12} className="text-muted shrink-0" />
          <span>{formattedDate}</span>
        </div>

        {/* Payment Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
            isPaid
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-500" : "bg-amber-500"}`}
          />
          {isPaid ? "Paid" : "Unpaid"}
        </span>
      </div>

      {/* Bottom Row: Delivery/Flag + Items + Price */}
      <div className="flex items-center justify-between pt-2 border-t border-border-hairline text-[11px]">
        <div className="flex items-center gap-2 text-muted">
          <div className="flex items-center gap-1">
            {isStorePickup ? (
              <Package size={12} className="shrink-0" />
            ) : (
              <Truck size={12} className="shrink-0" />
            )}
            <span className="text-[10px] font-medium">{isStorePickup ? "Pickup" : "Delivery"}</span>
          </div>
          <span>•</span>
          <span className="text-[10px]">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>

        <span className="font-bold text-xs text-on-surface tabular-nums">
          {formatCurrency(Number(order.total))}
        </span>
      </div>
    </div>
  );
}
