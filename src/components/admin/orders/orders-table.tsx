"use client";

import { Eye, MessageCircle, ShoppingBag } from "lucide-react";
import type { CheckoutSession, Order, OrdersTableProps } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { StatusBadge } from "../common/status-badge";

export function OrdersTable({
  orders,
  isAbandonedTab,
  isLoading,
  onSelectOrder,
}: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-muted">
        <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-16 text-center text-muted">
        <ShoppingBag size={36} className="mx-auto mb-3 text-muted" />
        <h3 className="text-sm font-bold text-on-surface">
          {isAbandonedTab ? "No abandoned checkouts" : "No orders found"}
        </h3>
        <p className="text-xs mt-1 text-muted">
          {isAbandonedTab
            ? "Great! All customers are completing their checkouts."
            : "Orders placed by buyers will automatically show up here."}
        </p>
      </div>
    );
  }

  if (isAbandonedTab) {
    return (
      <div className="overflow-x-auto font-sans">
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
            {(orders as CheckoutSession[]).map(session => {
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
                    {session.cartSnapshot
                      ? `${session.cartSnapshot.length} item(s)`
                      : "Cart details"}
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
      </div>
    );
  }

  return (
    <div className="overflow-x-auto font-sans">
      <table className="w-full text-left text-xs text-on-surface border-collapse font-sans">
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
          {(orders as Order[]).map(order => (
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
    </div>
  );
}
