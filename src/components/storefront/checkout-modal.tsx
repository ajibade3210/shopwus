"use client";

import { CheckCircle2, CreditCard, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useStorefrontDeliveryConfigQuery } from "@/hooks/queries";
import { initializeOrderPayment } from "@/services/api/billing.service";
import { getStorefrontDeliveryQuotes } from "@/services/api/delivery.service";
import { placeStorefrontOrder, syncCheckoutSession } from "@/services/api/order.service";
import type {
  CheckoutModalProps,
  DeliveryQuote,
  DeliveryType,
  Order,
  ShippingAddress,
} from "@/types";
import { formatCurrency } from "@/utils/currency";
import { useCart } from "./cart-context";
import { CheckoutDeliveryForm } from "./checkout-delivery-form";
import { CheckoutOrderSummary } from "./checkout-order-summary";

export function CheckoutModal({
  isOpen,
  onClose,
  slug,
  studioName,
  buttonColor,
  radiusClass,
  onOrderComplete,
}: CheckoutModalProps) {
  const { items, subtotal } = useCart();
  const { data: deliveryConfig } = useStorefrontDeliveryConfigQuery(slug);

  const [step, setStep] = useState<"details" | "success">("details");
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("HOME_DELIVERY");
  const [address, setAddress] = useState<ShippingAddress>({
    recipientName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "Ikeja",
    state: "Lagos",
    postalCode: "",
    deliveryNote: "",
  });

  // Check if cart contains physical goods that require delivery
  const requiresShipping = useMemo(() => {
    return items.some(i => i.product.requiresShipping !== false);
  }, [items]);

  // Delivery Quotes State
  const [quotes, setQuotes] = useState<DeliveryQuote[]>([]);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [selectedCarrierName, setSelectedCarrierName] = useState<string | null>(null);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);

  // Default to Store Pickup if merchant doesn't offer Home Delivery or items don't require shipping
  useEffect(() => {
    if (!requiresShipping) {
      setDeliveryType("STORE_PICKUP");
      return;
    }

    if (deliveryConfig) {
      if (!deliveryConfig.enableHomeDelivery && deliveryConfig.enableStorePickup) {
        setDeliveryType("STORE_PICKUP");
      }
    }
  }, [deliveryConfig, requiresShipping]);

  // Autofill recipient name and phone from customer info
  useEffect(() => {
    if (customerName && !address.recipientName) {
      setAddress(prev => ({ ...prev, recipientName: customerName }));
    }
    if (customerPhone && !address.phone) {
      setAddress(prev => ({ ...prev, phone: customerPhone }));
    }
  }, [customerName, customerPhone, address.recipientName, address.phone]);

  // Debounced real-time delivery quotes from Terminal Africa / Fallback
  useEffect(() => {
    if (
      !isOpen ||
      !requiresShipping ||
      deliveryType !== "HOME_DELIVERY" ||
      !address.state ||
      !address.city ||
      items.length === 0
    ) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingQuotes(true);
      try {
        const fetchedQuotes = await getStorefrontDeliveryQuotes(slug, {
          destination: {
            recipientName: address.recipientName || customerName || "Valued Customer",
            phone: address.phone || customerPhone || "+2348000000000",
            addressLine1: address.addressLine1 || "Storefront Delivery",
            addressLine2: address.addressLine2 || null,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode || null,
          },
          items: items.map(i => ({
            productId: i.productId,
            variantId: i.variantId || null,
            quantity: i.quantity,
          })),
        });

        setQuotes(fetchedQuotes);

        // Auto-select lowest rate
        if (fetchedQuotes.length > 0) {
          const sorted = [...fetchedQuotes].sort((a, b) => a.fee - b.fee);
          setSelectedRateId(sorted[0].rateId);
          setSelectedCarrierName(sorted[0].carrierName);
        } else {
          setSelectedRateId(null);
          setSelectedCarrierName(null);
        }
      } catch (_err) {
        setQuotes([]);
      } finally {
        setIsLoadingQuotes(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [
    isOpen,
    requiresShipping,
    deliveryType,
    address.state,
    address.city,
    address.addressLine1,
    address.addressLine2,
    address.postalCode,
    address.recipientName,
    address.phone,
    customerName,
    customerPhone,
    items,
    slug,
  ]);

  // Calculate free shipping threshold
  const isFreeShipping = useMemo(() => {
    if (!deliveryConfig?.freeDeliveryThreshold) return false;
    return subtotal >= Number(deliveryConfig.freeDeliveryThreshold);
  }, [subtotal, deliveryConfig?.freeDeliveryThreshold]);

  // Find selected quote fee
  const selectedQuote = useMemo(() => {
    return quotes.find(q => q.rateId === selectedRateId);
  }, [quotes, selectedRateId]);

  const deliveryFee = useMemo(() => {
    if (!requiresShipping || deliveryType === "STORE_PICKUP" || isFreeShipping) {
      return 0;
    }
    return selectedQuote?.fee || 0;
  }, [requiresShipping, deliveryType, isFreeShipping, selectedQuote]);

  const grandTotal = useMemo(() => {
    return subtotal + deliveryFee;
  }, [subtotal, deliveryFee]);

  const handleSelectRate = (quote: DeliveryQuote) => {
    setSelectedRateId(quote.rateId);
    setSelectedCarrierName(quote.carrierName);
  };

  // Sync session on contact blur
  const handleBlurContact = async () => {
    if (!customerEmail || !customerName) return;
    try {
      const session = await syncCheckoutSession(
        slug,
        {
          customerName: customerName || null,
          customerEmail: customerEmail || null,
          customerPhone: customerPhone || null,
          cartSnapshot: items.map(i => ({
            productId: i.productId,
            variantId: i.variantId || undefined,
            quantity: i.quantity,
            selectedOptions: i.selectedOptions,
          })),
          subtotal,
        },
        sessionId || undefined
      );
      if (session?.id) setSessionId(session.id);
    } catch {
      // Non-blocking sync
    }
  };

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (requiresShipping && deliveryType === "HOME_DELIVERY") {
      if (!address.addressLine1 || !address.city || !address.state) {
        setError("Please enter complete delivery address details.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const order = await placeStorefrontOrder(slug, {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        notes: notes.trim() || null,
        deliveryType: requiresShipping ? deliveryType : "STORE_PICKUP",
        shippingAddress: requiresShipping && deliveryType === "HOME_DELIVERY" ? address : null,
        terminalRateId:
          requiresShipping && deliveryType === "HOME_DELIVERY" ? selectedRateId || null : null,
        deliveryFee,
        carrierName:
          requiresShipping && deliveryType === "HOME_DELIVERY"
            ? selectedCarrierName || selectedQuote?.carrierName || null
            : null,
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId || undefined,
          quantity: i.quantity,
          selectedOptions: i.selectedOptions,
        })),
        checkoutSessionId: sessionId || null,
      });

      setCreatedOrder(order);
      setStep("success");
      onOrderComplete?.(order);

      // Automatically initialize Paystack payment
      try {
        const paymentRes = await initializeOrderPayment({
          orderId: order.id,
          callbackUrl: typeof window !== "undefined" ? window.location.href : undefined,
        });
        if (paymentRes?.authorization_url) {
          setPaymentUrl(paymentRes.authorization_url);
        }
      } catch (_payErr) {
        // Merchant may not have subaccount yet; order is created as pending
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-popover border border-border-hairline overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-hairline flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-on-surface tracking-tight">
              {step === "success" ? "Order Confirmed" : `Checkout — ${studioName}`}
            </h2>
            <p className="text-[11px] text-text-muted">
              {step === "success"
                ? `Order #${createdOrder?.orderNumber || ""} has been recorded.`
                : "Complete your details to place your order."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-low transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {step === "success" ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-on-surface">Thank you for your order!</h3>
              <p className="text-xs text-text-muted">
                We have sent an order confirmation to{" "}
                <span className="font-semibold text-on-surface">{customerEmail}</span>.
              </p>
            </div>

            {/* Order details snapshot */}
            {createdOrder && (
              <div className="bg-surface-low border border-border-hairline rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-on-surface">
                  <span>Order Number:</span>
                  <span className="font-mono">#{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Total Amount:</span>
                  <span className="font-sans font-bold tabular-nums text-on-surface">
                    {formatCurrency(Number(createdOrder.total))}
                  </span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Fulfillment:</span>
                  <span className="font-semibold text-on-surface">
                    {createdOrder.deliveryType === "STORE_PICKUP"
                      ? "Store Pickup"
                      : `${createdOrder.courierName || "Doorstep Delivery"}`}
                  </span>
                </div>
              </div>
            )}

            {/* Payment CTA button if authorization URL available */}
            {paymentUrl ? (
              <div className="pt-2">
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: buttonColor || "var(--primary)" }}
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-white text-xs font-bold shadow-xs hover:shadow-card hover:opacity-95 transition-all ${radiusClass || "rounded-2xl"}`}
                >
                  <CreditCard size={14} /> Pay Now with Paystack
                </a>
                <p className="text-[10px] text-text-muted mt-1.5">
                  Secure checkout powered by Paystack.
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-on-tertiary-container bg-tertiary-container border border-tertiary/20 p-2.5 rounded-xl">
                Your order is currently pending payment. The studio will reach out to you via
                WhatsApp to confirm your payment and fulfillment.
              </p>
            )}

            <div className="pt-3 border-t border-border-hairline">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-surface-low hover:bg-surface-container text-on-surface text-xs font-bold rounded-xl transition-all w-full cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmitOrder}
            className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs"
          >
            {error && (
              <div className="p-3 text-xs text-on-error-container bg-error-container border border-error/20 rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Order Items Summary */}
            <CheckoutOrderSummary
              items={items}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              isFreeShipping={isFreeShipping}
              grandTotal={grandTotal}
              deliveryConfig={deliveryConfig}
              deliveryType={deliveryType}
            />

            {/* Customer Contact */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
                1. Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    onBlur={handleBlurContact}
                    placeholder="e.g. Funmi Adeleke"
                    className="w-full px-3.5 py-2 bg-surface-lowest border border-border-hairline rounded-xl text-xs font-medium text-on-surface focus:ring-1 focus:ring-primary/20 focus:border-border-subtle outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    onBlur={handleBlurContact}
                    placeholder="funmi@example.com"
                    className="w-full px-3.5 py-2 bg-surface-lowest border border-border-hairline rounded-xl text-xs font-medium text-on-surface focus:ring-1 focus:ring-primary/20 focus:border-border-subtle outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    WhatsApp Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    onBlur={handleBlurContact}
                    placeholder="+234 801 234 5678"
                    className="w-full px-3.5 py-2 bg-surface-lowest border border-border-hairline rounded-xl text-xs font-medium text-on-surface focus:ring-1 focus:ring-primary/20 focus:border-border-subtle outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method & Address (Only shown if cart requires physical delivery) */}
            {requiresShipping ? (
              <CheckoutDeliveryForm
                deliveryConfig={deliveryConfig}
                deliveryType={deliveryType}
                onDeliveryTypeChange={setDeliveryType}
                address={address}
                onAddressChange={setAddress}
                quotes={quotes}
                selectedRateId={selectedRateId}
                onSelectRate={handleSelectRate}
                isLoadingQuotes={isLoadingQuotes}
                deliveryFee={deliveryFee}
                isFreeShipping={isFreeShipping}
              />
            ) : (
              <div className="p-3.5 bg-surface-low border border-border-hairline rounded-2xl text-xs text-text-muted flex items-center justify-between">
                <span>Your items are digital/service products and do not require delivery.</span>
                <span className="font-bold text-on-tertiary-container uppercase text-[10px]">
                  ₦0 Delivery
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-border-hairline flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-on-surface rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: buttonColor || "var(--primary)" }}
                className={`px-6 py-2.5 text-white text-xs font-bold shadow-xs hover:shadow-card hover:opacity-95 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer ${radiusClass || "rounded-xl"}`}
              >
                {isSubmitting ? "Placing Order..." : `Place Order (${formatCurrency(grandTotal)})`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
