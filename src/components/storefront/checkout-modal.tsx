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

        if (Array.isArray(fetchedQuotes) && fetchedQuotes.length > 0) {
          setQuotes(fetchedQuotes);
          // Preserve selected rate if still present in new quotes, else default to first
          setSelectedRateId(prev => {
            const exists = fetchedQuotes.some(q => q.rateId === prev);
            const activeRateId = exists && prev ? prev : fetchedQuotes[0].rateId;
            const activeQuote = fetchedQuotes.find(q => q.rateId === activeRateId);
            setSelectedCarrierName(activeQuote?.carrierName || fetchedQuotes[0].carrierName);
            return activeRateId;
          });
        }
      } catch (_err) {
        // Safe fallback quote on API failure
        const fallbackFee = deliveryConfig?.fallbackShippingFee
          ? Number(deliveryConfig.fallbackShippingFee)
          : 3000;
        const fallbackQuote: DeliveryQuote = {
          rateId: "fallback_standard",
          carrierName: "Standard Delivery",
          fee: fallbackFee,
          feeKobo: fallbackFee * 100,
          currency: "NGN",
          deliveryTime: "2 - 4 business days",
        };
        setQuotes([fallbackQuote]);
        setSelectedRateId("fallback_standard");
        setSelectedCarrierName("Standard Delivery");
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
    address.recipientName,
    address.phone,
    customerName,
    customerPhone,
    slug,
    items,
    deliveryConfig,
    address.addressLine2,
    address.postalCode,
  ]);

  // Shipping Calculation
  const freeThreshold = deliveryConfig?.freeDeliveryThreshold;
  const isFreeShipping = Boolean(freeThreshold && subtotal >= freeThreshold);

  const selectedQuote = useMemo(() => {
    return quotes.find(q => q.rateId === selectedRateId) || quotes[0] || null;
  }, [quotes, selectedRateId]);

  const deliveryFee = useMemo(() => {
    if (!requiresShipping || deliveryType === "STORE_PICKUP") {
      return 0;
    }
    if (isFreeShipping) {
      return 0;
    }
    if (selectedQuote) {
      return selectedQuote.fee;
    }
    return deliveryConfig?.fallbackShippingFee ? Number(deliveryConfig.fallbackShippingFee) : 3000;
  }, [requiresShipping, deliveryType, isFreeShipping, selectedQuote, deliveryConfig]);

  const grandTotal = subtotal + deliveryFee;

  const handleSelectRate = (quote: DeliveryQuote) => {
    setSelectedRateId(quote.rateId);
    setSelectedCarrierName(quote.carrierName);
  };

  // Sync CheckoutSession in background when contact info is typed (for lead recovery)
  const handleBlurContact = async () => {
    if (customerEmail || customerPhone) {
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
        if (session?.id) {
          setSessionId(session.id);
        }
      } catch (_e) {}
    }
  };

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
          requiresShipping && deliveryType === "HOME_DELIVERY"
            ? selectedQuote?.rateId || null
            : null,
        deliveryFee,
        carrierName:
          requiresShipping && deliveryType === "HOME_DELIVERY"
            ? selectedCarrierName || selectedQuote?.carrierName || null
            : null,
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId || null,
          quantity: i.quantity,
          price: i.price !== undefined ? i.price : Number(i.product.price),
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
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#e5e7eb] overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f0f0f0] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#191c1d] tracking-tight">
              {step === "success" ? "Order Confirmed" : `Checkout — ${studioName}`}
            </h2>
            <p className="text-[11px] text-[#6b7280]">
              {step === "success"
                ? `Order #${createdOrder?.orderNumber || ""} has been recorded.`
                : "Complete your details to place your order."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6b7280] hover:text-[#191c1d] rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {step === "success" ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#191c1d]">Thank you for your order!</h3>
              <p className="text-xs text-[#6b7280]">
                We have sent an order confirmation to{" "}
                <span className="font-semibold text-[#191c1d]">{customerEmail}</span>.
              </p>
            </div>

            {/* Order details snapshot */}
            {createdOrder && (
              <div className="bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-[#191c1d]">
                  <span>Order Number:</span>
                  <span className="font-mono">#{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between text-[#6b7280]">
                  <span>Total Amount:</span>
                  <span className="font-bold text-[#191c1d]">
                    {formatCurrency(Number(createdOrder.total))}
                  </span>
                </div>
                <div className="flex justify-between text-[#6b7280]">
                  <span>Fulfillment:</span>
                  <span className="font-semibold text-[#191c1d]">
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
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#191c1d] hover:bg-black text-white text-xs font-bold rounded-2xl shadow-xs transition-all"
                >
                  <CreditCard size={14} /> Pay Now with Paystack
                </a>
                <p className="text-[10px] text-[#6b7280] mt-1.5">
                  Secure checkout powered by Paystack.
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-[#855e2e] bg-amber-50 border border-amber-200/60 p-2.5 rounded-xl">
                Your order is currently pending payment. The studio will reach out to you via
                WhatsApp to confirm your payment and fulfillment.
              </p>
            )}

            <div className="pt-3 border-t border-[#eee]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-[#191c1d] text-xs font-bold rounded-xl transition-all w-full"
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
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl font-medium">
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
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#191c1d]">
                1. Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    onBlur={handleBlurContact}
                    placeholder="e.g. Funmi Adeleke"
                    className="w-full px-3.5 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#191c1d] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    onBlur={handleBlurContact}
                    placeholder="funmi@example.com"
                    className="w-full px-3.5 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#191c1d] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    WhatsApp Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    onBlur={handleBlurContact}
                    placeholder="+234 801 234 5678"
                    className="w-full px-3.5 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#191c1d] outline-none"
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
              <div className="p-3.5 bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl text-xs text-[#6b7280] flex items-center justify-between">
                <span>Your items are digital/service products and do not require delivery.</span>
                <span className="font-bold text-emerald-700 uppercase text-[10px]">
                  ₦0 Delivery
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-[#eee] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#6b7280] hover:text-[#191c1d] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#191c1d] hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
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
