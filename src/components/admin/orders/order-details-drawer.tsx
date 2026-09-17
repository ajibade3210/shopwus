"use client";

import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  useDispatchOrderMutation,
  useOrderQuery,
  useUpdateOrderStatusMutation,
} from "@/hooks/queries";
import type { FulfillmentStatus, OrderDetailsDrawerProps, PaymentStatus } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { StatusBadge } from "../common/status-badge";
import { useAdminToast } from "../layout/admin-toast-provider";

export function OrderDetailsDrawer({ orderId, onClose, onUpdated }: OrderDetailsDrawerProps) {
  const { showToast } = useAdminToast();
  const { data: order, isLoading } = useOrderQuery(orderId);
  const updateMutation = useUpdateOrderStatusMutation();
  const dispatchMutation = useDispatchOrderMutation();

  const [fulfillmentStatus, setFulfillmentStatus] = useState<FulfillmentStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("");

  const [isConfirmDispatchOpen, setIsConfirmDispatchOpen] = useState(false);
  const [dispatchError, setDispatchError] = useState<string | null>(null);

  if (!orderId) return null;

  const handleUpdateStatus = async () => {
    if (!order) return;
    await updateMutation.mutateAsync({
      id: order.id,
      input: {
        fulfillmentStatus: (fulfillmentStatus as FulfillmentStatus) || undefined,
        paymentStatus: (paymentStatus as PaymentStatus) || undefined,
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
      },
    });
    showToast("Order status updated successfully!");
    if (onUpdated) onUpdated();
  };

  const handleDispatchCourier = async () => {
    if (!order) return;
    setDispatchError(null);
    try {
      await dispatchMutation.mutateAsync(order.id);
      showToast("Courier pickup arranged with Terminal Africa!");
      setIsConfirmDispatchOpen(false);
      if (onUpdated) onUpdated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to dispatch courier pickup.";
      setDispatchError(msg);
    }
  };

  const isEligibleForTerminalDispatch =
    order &&
    order.deliveryType === "HOME_DELIVERY" &&
    !order.terminalShipmentId &&
    order.fulfillmentStatus !== "DELIVERED" &&
    order.fulfillmentStatus !== "CANCELLED";

  const hasTerminalTracking = order && (order.terminalShipmentId || order.trackingUrl);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-xl bg-card h-full shadow-2xl flex flex-col border-l border-border-hairline animate-in slide-in-from-right duration-200 text-on-surface">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-hairline bg-surface-container-low">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-on-surface font-mono">
                {order?.orderNumber || "Order Details"}
              </h2>
              {order && (
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={order.paymentStatus} />
                  <StatusBadge status={order.fulfillmentStatus} />
                </div>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5">
              Placed on {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "..."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        {isLoading || !order ? (
          <div className="p-12 text-center text-xs text-muted my-auto">
            <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            Loading order details...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-on-surface">
            {/* Terminal Africa Live Tracking Card (If already dispatched) */}
            {hasTerminalTracking && (
              <div className="bg-tertiary-container/30 border border-tertiary/30 rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-tertiary text-white flex items-center justify-center shadow-xs">
                      <Truck size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-xs">Courier Pickup Arranged</h4>
                      <p className="text-[11px] text-on-tertiary-container">
                        {order.courierName || "Terminal Africa Partner Courier"}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-tertiary-container text-on-tertiary-container border border-tertiary/20">
                    Dispatched
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-tertiary/20">
                  <div>
                    <span className="text-muted block text-[10px]">Tracking Number:</span>
                    <span className="font-mono font-bold text-on-surface">
                      {order.trackingNumber || order.terminalShipmentId}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">Shipment Reference:</span>
                    <span className="font-mono text-on-surface truncate block">
                      {order.terminalShipmentId || "N/A"}
                    </span>
                  </div>
                </div>

                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Track Shipment Live</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            )}

            {/* 1-Click Dispatch Courier Section (If eligible) */}
            {isEligibleForTerminalDispatch && (
              <div className="bg-surface-container-low border border-border-hairline rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Truck size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-xs">Dispatch Courier Pickup</h4>
                      <p className="text-[11px] text-muted">
                        {order.courierName
                          ? `Book pickup with ${order.courierName} via Terminal Africa`
                          : "Book automatic courier pickup via Terminal Africa"}
                      </p>
                    </div>
                  </div>
                </div>

                {dispatchError && (
                  <div className="p-2.5 bg-error-container border border-error/20 rounded-xl text-[11px] text-on-error-container flex items-start gap-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5 text-error" />
                    <span>{dispatchError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsConfirmDispatchOpen(true)}
                  disabled={dispatchMutation.isPending}
                  className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Truck size={14} />
                  <span>Dispatch with Terminal Africa</span>
                </button>
              </div>
            )}

            {/* Customer & Delivery Information Card */}
            <div className="bg-surface-container-low border border-border-hairline rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 font-bold text-on-surface text-xs">
                <User size={14} className="text-muted" />
                Customer Contact
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted block text-[11px]">Name:</span>
                  <b className="text-on-surface">{order.customerName}</b>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Phone:</span>
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="text-primary hover:underline font-mono"
                  >
                    {order.customerPhone}
                  </a>
                </div>
                {order.customerEmail && (
                  <div className="col-span-2">
                    <span className="text-muted block text-[11px]">Email:</span>
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="text-primary hover:underline"
                    >
                      {order.customerEmail}
                    </a>
                  </div>
                )}
              </div>

              {/* Delivery Details */}
              <div className="pt-3 border-t border-border-hairline">
                <div className="flex items-center gap-2 font-bold text-on-surface text-xs mb-1">
                  {order.deliveryType === "STORE_PICKUP" ? (
                    <MapPin size={14} className="text-muted" />
                  ) : (
                    <Truck size={14} className="text-muted" />
                  )}
                  {order.deliveryType === "STORE_PICKUP" ? "Store Pickup" : "Home Delivery"}
                </div>
                {order.shippingAddress ? (
                  <div className="text-xs text-on-surface space-y-0.5">
                    <div>{order.shippingAddress.addressLine1}</div>
                    {order.shippingAddress.addressLine2 && (
                      <div>{order.shippingAddress.addressLine2}</div>
                    )}
                    <div>
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted">Customer will pick up at store.</div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted mb-3 flex items-center gap-1.5">
                <Package size={14} /> Purchased Items ({order.items.length})
              </h3>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-surface-container-lowest border border-border-hairline rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-low overflow-hidden border border-border-hairline shrink-0 flex items-center justify-center">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={16} className="text-muted" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-on-surface">{item.productName}</div>
                        {item.variantTitle && (
                          <div className="text-[10px] text-muted">Variant: {item.variantTitle}</div>
                        )}
                        <div className="text-[10px] text-muted">
                          <span className="font-sans font-bold tabular-nums text-on-surface">
                            {formatCurrency(Number(item.unitPrice))}
                          </span>{" "}
                          × {item.quantity} unit{item.quantity > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    <div className="font-sans font-bold tabular-nums text-xs text-on-surface">
                      {formatCurrency(Number(item.totalPrice))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Breakdown & Split Settlement */}
            <div className="bg-surface-container-low border border-border-hairline rounded-2xl p-4 space-y-2 font-sans">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                <ShieldCheck size={14} /> Payment & Split Breakdown
              </h3>
              <div className="flex justify-between text-xs text-muted">
                <span>Product Subtotal:</span>
                <span className="font-sans font-bold tabular-nums text-on-surface">
                  {formatCurrency(Number(order.subtotal))}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Delivery Fee:</span>
                <span className="font-sans font-bold tabular-nums text-on-surface">
                  {formatCurrency(Number(order.deliveryFee))}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Platform Commission:</span>
                <span className="font-sans font-bold tabular-nums text-error">
                  - {formatCurrency(Number(order.platformFee))}
                </span>
              </div>
              <div className="pt-2 border-t border-border-hairline flex justify-between text-xs font-bold text-on-surface">
                <span>Total Paid by Buyer:</span>
                <span className="font-sans font-bold tabular-nums text-sm text-primary">
                  {formatCurrency(Number(order.total))}
                </span>
              </div>
              <div className="pt-1 flex justify-between text-xs font-semibold text-on-tertiary-container bg-tertiary-container p-2 rounded-lg border border-tertiary/20">
                <span>Net Deposited to Vendor Bank:</span>
                <span className="font-sans font-bold tabular-nums">
                  {formatCurrency(Number(order.merchantEarnings))}
                </span>
              </div>
            </div>

            {/* Manual Fulfillment & Status Adjustments */}
            <div className="bg-surface-container-lowest border border-border-hairline rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                <Truck size={14} /> Manual Status Overrides
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    defaultValue={order.fulfillmentStatus}
                    onChange={e => setFulfillmentStatus(e.target.value as FulfillmentStatus)}
                    className="w-full px-3 py-1.5 text-xs bg-surface-container-lowest border border-border-hairline rounded-xl text-on-surface focus:border-primary focus:outline-none"
                  >
                    <option value="UNFULFILLED">Unfulfilled</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                    <option value="DISPATCHED">Dispatched / In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                    Payment Status
                  </label>
                  <select
                    defaultValue={order.paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-1.5 text-xs bg-surface-container-lowest border border-border-hairline rounded-xl text-on-surface focus:border-primary focus:outline-none"
                  >
                    <option value="UNPAID">Unpaid</option>
                    <option value="PAID">Paid</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                    Courier Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Fez Delivery, DHL"
                    defaultValue={order.courierName || ""}
                    onChange={e => setCourierName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-surface-container-lowest border border-border-hairline rounded-xl text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., TRK-982189"
                    defaultValue={order.trackingNumber || ""}
                    onChange={e => setTrackingNumber(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-surface-container-lowest border border-border-hairline rounded-xl font-mono text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updateMutation.isPending}
                className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-xs disabled:opacity-50 mt-2"
              >
                {updateMutation.isPending ? "Updating..." : "Save Status Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Terminal Dispatch */}
        {isConfirmDispatchOpen && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl p-5 max-w-sm w-full shadow-popover border border-border-hairline space-y-4 animate-in zoom-in-95 duration-150 text-on-surface">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Truck size={20} />
              </div>

              <div className="text-center space-y-1">
                <h4 className="font-bold text-on-surface text-sm">Confirm Courier Pickup</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Is this parcel packed and ready today? Terminal Africa will notify the courier to
                  pick up from your registered store address.
                </p>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl text-[11px] space-y-1 text-on-surface border border-border-hairline">
                <div className="flex justify-between">
                  <span className="text-muted">Recipient:</span>
                  <span className="font-medium text-on-surface">{order?.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Destination:</span>
                  <span className="font-medium text-on-surface">
                    {order?.shippingAddress?.city}, {order?.shippingAddress?.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Courier:</span>
                  <span className="font-semibold text-primary">
                    {order?.courierName || "Terminal Africa Partner"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsConfirmDispatchOpen(false)}
                  disabled={dispatchMutation.isPending}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl border border-border-hairline hover:bg-surface-container-low text-on-surface transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDispatchCourier}
                  disabled={dispatchMutation.isPending}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {dispatchMutation.isPending ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={13} />
                      Confirm & Dispatch
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
