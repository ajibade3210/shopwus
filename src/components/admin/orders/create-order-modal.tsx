"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Loader2,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  User,
  X,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { NIGERIAN_CITIES_BY_STATE, NIGERIAN_STATES } from "@/constants/delivery";
import { useCreateManualOrderMutation } from "@/hooks/queries/use-order-queries";
import { useProductsQuery } from "@/hooks/queries/use-product-queries";
import type { CreateOrderModalProps, ManualOrderDraftItem, ShippingAddress } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { useAdminToast } from "../layout/admin-toast-provider";

export function CreateOrderModal({ isOpen, onClose, onCreated }: CreateOrderModalProps) {
  const { showToast } = useAdminToast();
  const createMutation = useCreateManualOrderMutation();
  const { data: productsData, isLoading: isLoadingProducts } = useProductsQuery({
    limit: 100,
  });

  const products = productsData?.items || [];

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [items, setItems] = useState<ManualOrderDraftItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");

  const [fulfillmentMode, setFulfillmentMode] = useState<
    "DIRECT_SALE" | "STORE_PICKUP" | "SHIP_TO_CUSTOMER"
  >("DIRECT_SALE");

  const [address, setAddress] = useState<ShippingAddress>({
    recipientName: "",
    phone: "",
    addressLine1: "",
    addressLine2: null,
    city: "",
    state: "Lagos",
    postalCode: null,
    deliveryNote: null,
  });

  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<"PAID" | "UNPAID" | "PENDING">("PAID");
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH" | "POS" | "BANK_TRANSFER" | "ONLINE" | "OTHER"
  >("CASH");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // HTML IDs for Accessibility
  const customerNameId = useId();
  const customerEmailId = useId();
  const customerPhoneId = useId();
  const productSelectId = useId();
  const stateSelectId = useId();
  const citySelectId = useId();
  const addressLine1Id = useId();
  const deliveryFeeId = useId();
  const paymentMethodId = useId();
  const notesId = useId();

  // Active selected product object
  const activeProduct = useMemo(
    () => products.find(p => p.id === selectedProductId),
    [products, selectedProductId]
  );

  const availableVariants = useMemo(() => activeProduct?.variants || [], [activeProduct]);

  const citiesForState = useMemo(
    () => (address.state ? NIGERIAN_CITIES_BY_STATE[address.state] || [] : []),
    [address.state]
  );

  // Cart calculations
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  const effectiveDeliveryFee = fulfillmentMode === "SHIP_TO_CUSTOMER" ? deliveryFee : 0;
  const grandTotal = subtotal + effectiveDeliveryFee;

  if (!isOpen) return null;

  const handleAddProduct = () => {
    if (!activeProduct) return;

    let unitPrice = Number(activeProduct.price);
    let variantTitle: string | null = null;
    let maxStock = activeProduct.trackInventory ? activeProduct.inventoryCount : undefined;

    if (selectedVariantId) {
      const variant = activeProduct.variants?.find(v => v.id === selectedVariantId);
      if (variant) {
        unitPrice = Number(variant.price);
        variantTitle = variant.title;
        if (activeProduct.trackInventory) {
          maxStock = variant.inventoryCount;
        }
      }
    }

    const existingIndex = items.findIndex(
      item => item.productId === activeProduct.id && item.variantId === (selectedVariantId || null)
    );

    if (existingIndex >= 0) {
      // Increase quantity
      setItems(prev =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setItems(prev => [
        ...prev,
        {
          productId: activeProduct.id,
          variantId: selectedVariantId || null,
          productName: activeProduct.name,
          variantTitle,
          unitPrice,
          quantity: 1,
          maxStock,
        },
      ]);
    }

    // Reset selection
    setSelectedProductId("");
    setSelectedVariantId("");
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setItems(prev =>
      prev.map((item, idx) => (idx === index ? { ...item, quantity: newQty } : item))
    );
  };

  const handleUpdateUnitPrice = (index: number, newPrice: number) => {
    setItems(prev =>
      prev.map((item, idx) =>
        idx === index ? { ...item, unitPrice: Math.max(0, newPrice) } : item
      )
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (items.length === 0) {
      setErrorMsg("Please add at least one item to the order.");
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg("Customer name is required.");
      return;
    }

    if (!customerEmail.trim()) {
      setErrorMsg("Customer email is required.");
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMsg("Customer phone number is required.");
      return;
    }

    if (fulfillmentMode === "SHIP_TO_CUSTOMER") {
      if (!address.addressLine1.trim() || !address.city.trim() || !address.state.trim()) {
        setErrorMsg("Please fill in destination address, city, and state for delivery.");
        return;
      }
    }

    try {
      const createdOrder = await createMutation.mutateAsync({
        customerName: customerName.trim(),
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone: customerPhone.trim(),
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId || undefined,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        fulfillmentMode,
        shippingAddress:
          fulfillmentMode === "SHIP_TO_CUSTOMER"
            ? {
                ...address,
                recipientName: address.recipientName || customerName.trim(),
                phone: address.phone || customerPhone.trim(),
              }
            : null,
        deliveryFee: effectiveDeliveryFee,
        paymentStatus,
        paymentMethod: paymentStatus === "PAID" ? paymentMethod : undefined,
        notes: notes.trim() || null,
      });

      showToast(`Order #${createdOrder.orderNumber} recorded successfully!`);
      if (onCreated) onCreated(createdOrder);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record order.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eee] bg-[#fafaf9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#191c1d] text-white flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#191c1d]">Create In-House Order</h2>
              <p className="text-xs text-[#6b7280]">
                Record walk-in, POS, social, or custom customer sales
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#6b7280] hover:text-[#191c1d] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9ca3af] flex items-center gap-1.5">
              <User size={13} />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor={customerNameId}
                  className="block text-xs font-medium text-[#374151] mb-1"
                >
                  Full Name *
                </label>
                <input
                  id={customerNameId}
                  type="text"
                  required
                  placeholder="e.g. Chinedu Eze"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl focus:border-[#191c1d] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor={customerEmailId}
                  className="block text-xs font-medium text-[#374151] mb-1"
                >
                  Email Address *
                </label>
                <input
                  id={customerEmailId}
                  type="email"
                  required
                  placeholder="e.g. customer@example.com"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl focus:border-[#191c1d] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor={customerPhoneId}
                  className="block text-xs font-medium text-[#374151] mb-1"
                >
                  Phone Number *
                </label>
                <input
                  id={customerPhoneId}
                  type="tel"
                  required
                  placeholder="e.g. 08012345678"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl focus:border-[#191c1d] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Items in Order */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9ca3af] flex items-center gap-1.5">
              <Package size={13} />
              Order Items
            </h3>

            {/* Product Selector */}
            <div className="flex flex-col sm:flex-row gap-2 bg-[#fafaf9] p-3 rounded-xl border border-[#e5e7eb]">
              <div className="flex-1">
                <label htmlFor={productSelectId} className="sr-only">
                  Select Product
                </label>
                <select
                  id={productSelectId}
                  value={selectedProductId}
                  onChange={e => {
                    setSelectedProductId(e.target.value);
                    setSelectedVariantId("");
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-xl"
                  disabled={isLoadingProducts}
                >
                  <option value="">-- Choose Product from Catalog --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatCurrency(Number(p.price))}
                      {p.trackInventory ? ` (${p.inventoryCount} in stock)` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {availableVariants.length > 0 && (
                <div className="w-full sm:w-48">
                  <select
                    value={selectedVariantId}
                    onChange={e => setSelectedVariantId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-xl"
                  >
                    <option value="">-- Select Variant --</option>
                    {availableVariants.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.title} — {formatCurrency(Number(v.price))}
                        {v.inventoryCount !== undefined ? ` (${v.inventoryCount})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="button"
                disabled={!selectedProductId}
                onClick={handleAddProduct}
                className="px-4 py-2 bg-[#191c1d] text-white text-xs font-medium rounded-xl hover:bg-black transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus size={14} />
                Add Item
              </button>
            </div>

            {/* Added Items List */}
            {items.length > 0 ? (
              <div className="border border-[#e5e7eb] rounded-xl overflow-hidden divide-y divide-[#eee]">
                {items.map((item, idx) => (
                  <div
                    key={`${item.productId}-${item.variantId || "default"}`}
                    className="p-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#191c1d] truncate">{item.productName}</p>
                      {item.variantTitle && (
                        <p className="text-[11px] text-[#6b7280]">Variant: {item.variantTitle}</p>
                      )}
                      {item.maxStock !== undefined && (
                        <p className="text-[10px] text-amber-700">
                          Stock: {item.maxStock} available
                        </p>
                      )}
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[#6b7280] text-[11px]">₦</span>
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={e => handleUpdateUnitPrice(idx, Number(e.target.value))}
                          className="w-20 px-2 py-1 text-xs border border-[#e5e7eb] rounded-lg text-right"
                          title="Unit Price"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(idx, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center border border-[#e5e7eb] rounded-lg hover:bg-gray-100 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(idx, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center border border-[#e5e7eb] rounded-lg hover:bg-gray-100 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-20 text-right font-bold text-[#191c1d]">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 border-2 border-dashed border-[#e5e7eb] rounded-xl text-center text-xs text-[#9ca3af]">
                No items added yet. Choose a product above to add.
              </div>
            )}
          </div>

          {/* Section 3: Fulfillment Mode */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9ca3af] flex items-center gap-1.5">
              <Truck size={13} />
              Fulfillment Mode
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFulfillmentMode("DIRECT_SALE")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  fulfillmentMode === "DIRECT_SALE"
                    ? "border-[#191c1d] bg-gray-50 ring-1 ring-[#191c1d]"
                    : "border-[#e5e7eb] hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className={
                      fulfillmentMode === "DIRECT_SALE" ? "text-[#191c1d]" : "text-transparent"
                    }
                  />
                  <span className="text-xs font-bold text-[#191c1d]">In-Store Sale</span>
                </div>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Immediate handover. Marked as fulfilled & delivered.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentMode("STORE_PICKUP")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  fulfillmentMode === "STORE_PICKUP"
                    ? "border-[#191c1d] bg-gray-50 ring-1 ring-[#191c1d]"
                    : "border-[#e5e7eb] hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2
                    size={14}
                    className={
                      fulfillmentMode === "STORE_PICKUP" ? "text-[#191c1d]" : "text-transparent"
                    }
                  />
                  <span className="text-xs font-bold text-[#191c1d]">Store Pickup</span>
                </div>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Customer will collect from store. Marked ready for pickup.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentMode("SHIP_TO_CUSTOMER")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  fulfillmentMode === "SHIP_TO_CUSTOMER"
                    ? "border-[#191c1d] bg-gray-50 ring-1 ring-[#191c1d]"
                    : "border-[#e5e7eb] hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Truck
                    size={14}
                    className={
                      fulfillmentMode === "SHIP_TO_CUSTOMER" ? "text-[#191c1d]" : "text-transparent"
                    }
                  />
                  <span className="text-xs font-bold text-[#191c1d]">Ship to Customer</span>
                </div>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Delivery required. Can dispatch with Terminal Africa courier.
                </p>
              </button>
            </div>

            {/* Destination Address Inputs if Ship To Customer */}
            {fulfillmentMode === "SHIP_TO_CUSTOMER" && (
              <div className="p-4 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor={stateSelectId}
                      className="block text-xs font-medium text-[#374151] mb-1"
                    >
                      Destination State *
                    </label>
                    <select
                      id={stateSelectId}
                      value={address.state}
                      onChange={e =>
                        setAddress(prev => ({
                          ...prev,
                          state: e.target.value,
                          city: NIGERIAN_CITIES_BY_STATE[e.target.value]?.[0] || "",
                        }))
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-xl"
                    >
                      {NIGERIAN_STATES.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={citySelectId}
                      className="block text-xs font-medium text-[#374151] mb-1"
                    >
                      City / Area *
                    </label>
                    {citiesForState.length > 0 ? (
                      <select
                        id={citySelectId}
                        value={address.city}
                        onChange={e => setAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-xl"
                      >
                        <option value="">-- Choose City --</option>
                        {citiesForState.map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={citySelectId}
                        type="text"
                        placeholder="City"
                        value={address.city}
                        onChange={e => setAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-xl"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={addressLine1Id}
                    className="block text-xs font-medium text-[#374151] mb-1"
                  >
                    Street Address *
                  </label>
                  <input
                    id={addressLine1Id}
                    type="text"
                    placeholder="House number, Street, Landmark"
                    value={address.addressLine1}
                    onChange={e => setAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-xl"
                  />
                </div>

                <div>
                  <label
                    htmlFor={deliveryFeeId}
                    className="block text-xs font-medium text-[#374151] mb-1"
                  >
                    Shipping Fee (₦)
                  </label>
                  <input
                    id={deliveryFeeId}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={deliveryFee}
                    onChange={e => setDeliveryFee(Math.max(0, Number(e.target.value)))}
                    className="w-full sm:w-48 px-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Payment & Accounting */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">
              Payment & Accounting
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="block text-xs font-medium text-[#374151] mb-1">
                  Payment Status
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentStatus("PAID")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      paymentStatus === "PAID"
                        ? "bg-[#191c1d] text-white border-[#191c1d]"
                        : "bg-white text-[#6b7280] border-[#e5e7eb]"
                    }`}
                  >
                    Paid Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus("UNPAID")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      paymentStatus === "UNPAID"
                        ? "bg-[#191c1d] text-white border-[#191c1d]"
                        : "bg-white text-[#6b7280] border-[#e5e7eb]"
                    }`}
                  >
                    Pay Later / Unpaid
                  </button>
                </div>
              </div>

              {paymentStatus === "PAID" && (
                <div>
                  <label
                    htmlFor={paymentMethodId}
                    className="block text-xs font-medium text-[#374151] mb-1"
                  >
                    Payment Method
                  </label>
                  <select
                    id={paymentMethodId}
                    value={paymentMethod}
                    onChange={e =>
                      setPaymentMethod(
                        e.target.value as "CASH" | "POS" | "BANK_TRANSFER" | "ONLINE" | "OTHER"
                      )
                    }
                    className="w-full px-3 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
                  >
                    <option value="CASH">Cash</option>
                    <option value="POS">POS Terminal</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="ONLINE">Online Checkout</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Order Notes */}
          <div>
            <label htmlFor={notesId} className="block text-xs font-medium text-[#374151] mb-1">
              Internal Notes (Optional)
            </label>
            <textarea
              id={notesId}
              rows={2}
              placeholder="e.g. Paid cash at counter; customer picked up in person"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
            />
          </div>

          {/* Section 6: Financial Breakdown Banner */}
          <div className="p-4 bg-gray-50 rounded-xl border border-[#e5e7eb] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#6b7280]">
              <span>Items Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {fulfillmentMode === "SHIP_TO_CUSTOMER" && (
              <div className="flex justify-between text-[#6b7280]">
                <span>Shipping Fee:</span>
                <span>{formatCurrency(effectiveDeliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-[#191c1d] pt-2 border-t border-[#e5e7eb] text-sm">
              <span>Total Amount:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#eee] bg-[#fafaf9] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#6b7280] hover:text-[#191c1d] transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={createMutation.isPending || items.length === 0}
            className="px-5 py-2.5 bg-[#191c1d] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center gap-2"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Recording Order...
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                Record Order ({formatCurrency(grandTotal)})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
