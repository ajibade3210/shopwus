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
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-[#e5e7eb] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#eee] bg-[#fafaf9]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#191c1d] font-mono">
                {order?.orderNumber || "Order Details"}
              </h2>
              {order && (
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={order.paymentStatus} />
                  <StatusBadge status={order.fulfillmentStatus} />
                </div>
              )}
            </div>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Placed on {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "..."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#6b7280] hover:text-[#191c1d] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        {isLoading || !order ? (
          <div className="p-12 text-center text-xs text-[#6b7280] my-auto">
            <div className="animate-spin w-5 h-5 border-2 border-[#191c1d] border-t-transparent rounded-full mx-auto mb-2" />
            Loading order details...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#191c1d]">
            {/* Terminal Africa Live Tracking Card (If already dispatched) */}
            {hasTerminalTracking && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Truck size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-950 text-xs">
                        Courier Pickup Arranged
                      </h4>
                      <p className="text-[11px] text-emerald-700">
                        {order.courierName || "Terminal Africa Partner Courier"}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Dispatched
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-emerald-200/60">
                  <div>
                    <span className="text-emerald-800/70 block text-[10px]">Tracking Number:</span>
                    <span className="font-mono font-bold text-emerald-950">
                      {order.trackingNumber || order.terminalShipmentId}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-800/70 block text-[10px]">
                      Shipment Reference:
                    </span>
                    <span className="font-mono text-emerald-900 truncate block">
                      {order.terminalShipmentId || "N/A"}
                    </span>
                  </div>
                </div>

                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
                  >
                    <span>Track Shipment Live</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            )}

            {/* 1-Click Dispatch Courier Section (If eligible) */}
            {isEligibleForTerminalDispatch && (
              <div className="bg-gradient-to-br from-indigo-50/70 via-sky-50/50 to-white border border-indigo-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Truck size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#191c1d] text-xs">Dispatch Courier Pickup</h4>
                      <p className="text-[11px] text-[#6b7280]">
                        {order.courierName
                          ? `Book pickup with ${order.courierName} via Terminal Africa`
                          : "Book automatic courier pickup via Terminal Africa"}
                      </p>
                    </div>
                  </div>
                </div>

                {dispatchError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 flex items-start gap-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{dispatchError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsConfirmDispatchOpen(true)}
                  disabled={dispatchMutation.isPending}
                  className="w-full py-2.5 px-4 bg-[#191c1d] hover:bg-black text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Truck size={14} />
                  <span>Dispatch with Terminal Africa</span>
                </button>
              </div>
            )}

            {/* Customer & Delivery Information Card */}
            <div className="bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 font-bold text-[#191c1d] text-xs">
                <User size={14} className="text-[#6b7280]" />
                Customer Contact
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#6b7280] block text-[11px]">Name:</span>
                  <b>{order.customerName}</b>
                </div>
                <div>
                  <span className="text-[#6b7280] block text-[11px]">Phone:</span>
                  <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline">
                    {order.customerPhone}
                  </a>
                </div>
                {order.customerEmail && (
                  <div className="col-span-2">
                    <span className="text-[#6b7280] block text-[11px]">Email:</span>
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {order.customerEmail}
                    </a>
                  </div>
                )}
              </div>

              {/* Delivery Details */}
              <div className="pt-3 border-t border-[#eee]">
                <div className="flex items-center gap-2 font-bold text-[#191c1d] text-xs mb-1">
                  {order.deliveryType === "STORE_PICKUP" ? (
                    <MapPin size={14} className="text-[#6b7280]" />
                  ) : (
                    <Truck size={14} className="text-[#6b7280]" />
                  )}
                  {order.deliveryType === "STORE_PICKUP" ? "Store Pickup" : "Home Delivery"}
                </div>
                {order.shippingAddress ? (
                  <div className="text-xs text-[#444748] space-y-0.5">
                    <div>{order.shippingAddress.addressLine1}</div>
                    {order.shippingAddress.addressLine2 && (
                      <div>{order.shippingAddress.addressLine2}</div>
                    )}
                    <div>
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[#6b7280]">Customer will pick up at store.</div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#6b7280] mb-3 flex items-center gap-1.5">
                <Package size={14} /> Purchased Items ({order.items.length})
              </h3>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white border border-[#e5e7eb] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#f3f4f6] overflow-hidden border border-[#e5e7eb] shrink-0 flex items-center justify-center">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={16} className="text-[#9ca3af]" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-[#191c1d]">{item.productName}</div>
                        {item.variantTitle && (
                          <div className="text-[10px] text-[#6b7280]">
                            Variant: {item.variantTitle}
                          </div>
                        )}
                        <div className="text-[10px] text-[#6b7280]">
                          <span className="font-sans font-bold tabular-nums">
                            {formatCurrency(Number(item.unitPrice))}
                          </span>{" "}
                          × {item.quantity} unit{item.quantity > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    <div className="font-sans font-bold tabular-nums text-xs text-[#191c1d]">
                      {formatCurrency(Number(item.totalPrice))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Breakdown & Split Settlement */}
            <div className="bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl p-4 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#6b7280] mb-2 flex items-center gap-1.5">
                <ShieldCheck size={14} /> Payment & Split Breakdown
              </h3>
              <div className="flex justify-between text-xs text-[#6b7280]">
                <span>Product Subtotal:</span>
                <span className="font-sans font-bold tabular-nums text-[#191c1d]">
                  {formatCurrency(Number(order.subtotal))}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#6b7280]">
                <span>Delivery Fee:</span>
                <span className="font-sans font-bold tabular-nums text-[#191c1d]">
                  {formatCurrency(Number(order.deliveryFee))}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#6b7280]">
                <span>Platform Commission:</span>
                <span className="font-sans font-bold tabular-nums text-red-600">
                  - {formatCurrency(Number(order.platformFee))}
                </span>
              </div>
              <div className="pt-2 border-t border-[#eee] flex justify-between text-xs font-bold text-[#191c1d]">
                <span>Total Paid by Buyer:</span>
                <span className="font-sans font-bold tabular-nums text-sm">
                  {formatCurrency(Number(order.total))}
                </span>
              </div>
              <div className="pt-1 flex justify-between text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <span>Net Deposited to Vendor Bank:</span>
                <span className="font-sans font-bold tabular-nums">
                  {formatCurrency(Number(order.merchantEarnings))}
                </span>
              </div>
            </div>

            {/* Manual Fulfillment & Status Adjustments */}
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#191c1d] flex items-center gap-1.5">
                <Truck size={14} /> Manual Status Overrides
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    defaultValue={order.fulfillmentStatus}
                    onChange={e => setFulfillmentStatus(e.target.value as FulfillmentStatus)}
                    className="w-full px-3 py-1.5 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
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
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    Payment Status
                  </label>
                  <select
                    defaultValue={order.paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-1.5 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
                  >
                    <option value="UNPAID">Unpaid</option>
                    <option value="PAID">Paid</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    Courier Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Fez Delivery, DHL"
                    defaultValue={order.courierName || ""}
                    onChange={e => setCourierName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., TRK-982189"
                    defaultValue={order.trackingNumber || ""}
                    onChange={e => setTrackingNumber(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl font-mono"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updateMutation.isPending}
                className="inline-flex items-center justify-center gap-2 w-full bg-[#111827] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-xs disabled:opacity-50 mt-2"
              >
                {updateMutation.isPending ? "Updating..." : "Save Status Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Terminal Dispatch */}
        {isConfirmDispatchOpen && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-[#e5e7eb] space-y-4 animate-in zoom-in-95 duration-150">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
                <Truck size={20} />
              </div>

              <div className="text-center space-y-1">
                <h4 className="font-bold text-[#191c1d] text-sm">Confirm Courier Pickup</h4>
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  Is this parcel packed and ready today? Terminal Africa will notify the courier to
                  pick up from your registered store address.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-[11px] space-y-1 text-[#374151]">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Recipient:</span>
                  <span className="font-medium">{order?.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Destination:</span>
                  <span className="font-medium">
                    {order?.shippingAddress?.city}, {order?.shippingAddress?.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Courier:</span>
                  <span className="font-semibold text-indigo-700">
                    {order?.courierName || "Terminal Africa Partner"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsConfirmDispatchOpen(false)}
                  disabled={dispatchMutation.isPending}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl border border-[#e5e7eb] hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDispatchCourier}
                  disabled={dispatchMutation.isPending}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl bg-[#191c1d] hover:bg-black text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
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
