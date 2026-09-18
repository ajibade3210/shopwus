"use client";

import { Check, Clock, Loader2, MapPin, Sparkles, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { NIGERIAN_CITIES_BY_STATE, NIGERIAN_STATES } from "@/constants";
import type { CheckoutDeliveryFormProps } from "@/types";
import { formatCurrency } from "@/utils/currency";

export function CheckoutDeliveryForm({
  deliveryConfig,
  deliveryType,
  onDeliveryTypeChange,
  address,
  onAddressChange,
  quotes = [],
  selectedRateId,
  onSelectRate,
  isLoadingQuotes = false,
  deliveryFee,
  isFreeShipping,
}: CheckoutDeliveryFormProps) {
  const citiesForState = useMemo(() => {
    return NIGERIAN_CITIES_BY_STATE[address.state] || [];
  }, [address.state]);

  const [isCustomCity, setIsCustomCity] = useState(false);

  const handleStateChange = (newState: string) => {
    const defaultCities = NIGERIAN_CITIES_BY_STATE[newState] || [];
    setIsCustomCity(defaultCities.length === 0);
    onAddressChange({
      ...address,
      state: newState,
      city: defaultCities[0] || "",
    });
  };

  return (
    <div className="space-y-3 pt-3 border-t border-border-hairline">
      <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
        2. Delivery Method
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {deliveryConfig?.enableHomeDelivery !== false && (
          <label
            className={`p-3 rounded-2xl border flex flex-col gap-1 cursor-pointer transition-all ${
              deliveryType === "HOME_DELIVERY"
                ? "border-primary bg-primary/5"
                : "border-border-hairline bg-surface-low hover:bg-surface-container"
            }`}
          >
            <input
              type="radio"
              name="deliveryType"
              checked={deliveryType === "HOME_DELIVERY"}
              onChange={() => onDeliveryTypeChange("HOME_DELIVERY")}
              className="sr-only"
            />
            <div className="flex items-center gap-1.5 font-bold text-on-surface">
              <Truck size={14} /> Doorstep Delivery
            </div>
            <span className="text-[11px] text-text-muted">
              {isFreeShipping
                ? "Free"
                : deliveryFee > 0
                  ? formatCurrency(deliveryFee)
                  : "Calculated by address"}
            </span>
          </label>
        )}

        {deliveryConfig?.enableStorePickup !== false && (
          <label
            className={`p-3 rounded-2xl border flex flex-col gap-1 cursor-pointer transition-all ${
              deliveryType === "STORE_PICKUP"
                ? "border-primary bg-primary/5"
                : "border-border-hairline bg-surface-low hover:bg-surface-container"
            }`}
          >
            <input
              type="radio"
              name="deliveryType"
              checked={deliveryType === "STORE_PICKUP"}
              onChange={() => onDeliveryTypeChange("STORE_PICKUP")}
              className="sr-only"
            />
            <div className="flex items-center gap-1.5 font-bold text-on-surface">
              <MapPin size={14} /> Store Pickup
            </div>
            <span className="text-[11px] text-on-tertiary-container font-semibold">
              Free Collection
            </span>
          </label>
        )}
      </div>

      {/* Store Pickup Notice */}
      {deliveryType === "STORE_PICKUP" && (
        <div className="bg-surface-low border border-border-hairline rounded-2xl p-3.5 space-y-1 text-xs">
          <div className="font-semibold text-on-surface">Pickup Location:</div>
          <div className="text-text-muted">
            {deliveryConfig?.pickupLocation || "Store Location"}
          </div>
          {deliveryConfig?.pickupInstructions && (
            <div className="text-[11px] text-text-muted italic mt-1 pt-1 border-t border-border-hairline">
              Note: {deliveryConfig.pickupInstructions}
            </div>
          )}
        </div>
      )}

      {/* Delivery Address Fields if Home Delivery */}
      {deliveryType === "HOME_DELIVERY" && (
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-text-muted mb-1">
                State *
              </label>
              <select
                required
                value={address.state}
                onChange={e => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 bg-surface-lowest border border-border-hairline rounded-xl text-xs font-medium text-on-surface focus:ring-1 focus:ring-primary/20 focus:border-border-subtle outline-none"
              >
                {NIGERIAN_STATES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-text-muted">City / Area *</label>
                {citiesForState.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsCustomCity(!isCustomCity)}
                    className="text-[10px] text-primary font-semibold hover:underline"
                  >
                    {isCustomCity ? "Pick from list" : "Type custom"}
                  </button>
                )}
              </div>

              {!isCustomCity && citiesForState.length > 0 ? (
                <select
                  required
                  value={address.city}
                  onChange={e => onAddressChange({ ...address, city: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-lowest border border-border-hairline rounded-xl text-xs font-medium text-on-surface focus:ring-1 focus:ring-primary/20 focus:border-border-subtle outline-none"
                >
                  <option value="">Select City / LGA</option>
                  {citiesForState.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder="e.g. Lekki Phase 1"
                  value={address.city}
                  onChange={e => onAddressChange({ ...address, city: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-lowest border border-border-hairline rounded-xl text-xs font-medium text-on-surface focus:ring-1 focus:ring-primary/20 focus:border-border-subtle outline-none"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-muted mb-1">
              Street Delivery Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 14 Admiralty Way, Block B, Flat 4"
              value={address.addressLine1}
              onChange={e => onAddressChange({ ...address, addressLine1: e.target.value })}
              className="w-full px-3.5 py-2 bg-surface-lowest border border-border-hairline rounded-xl text-xs font-medium text-on-surface focus:ring-1 focus:ring-primary/20 focus:border-border-subtle outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-muted mb-1">
              Delivery Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Leave with security guard / gate code 4920"
              value={address.deliveryNote || ""}
              onChange={e => onAddressChange({ ...address, deliveryNote: e.target.value })}
              className="w-full px-3.5 py-2 bg-surface-lowest border border-border-hairline rounded-xl text-xs font-medium text-on-surface focus:ring-1 focus:ring-primary/20 focus:border-border-subtle outline-none"
            />
          </div>

          {/* Real-Time Courier Options */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface flex items-center gap-1">
                Available Shipping Options
                {isFreeShipping && (
                  <span className="bg-tertiary-container text-on-tertiary-container border border-tertiary/20 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Free Threshold Applied
                  </span>
                )}
              </span>
              {isLoadingQuotes && (
                <span className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                  <Loader2 size={12} className="animate-spin text-primary" /> Fetching rates...
                </span>
              )}
            </div>

            {isLoadingQuotes ? (
              <div className="space-y-2">
                {[1, 2].map(i => (
                  <div
                    key={i}
                    className="p-3 border border-border-hairline rounded-xl bg-surface-low animate-pulse flex items-center justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-28 bg-surface-high rounded" />
                      <div className="h-2.5 w-20 bg-surface-high rounded" />
                    </div>
                    <div className="h-4 w-16 bg-surface-high rounded" />
                  </div>
                ))}
              </div>
            ) : quotes.length > 0 ? (
              <div className="space-y-2">
                {quotes.map(quote => {
                  const isSelected = selectedRateId === quote.rateId;
                  const effectiveFee = isFreeShipping ? 0 : quote.fee;

                  return (
                    <label
                      key={quote.rateId}
                      onClick={() => onSelectRate?.(quote)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-border-hairline bg-card hover:bg-surface-low"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-border-hairline bg-surface-lowest"
                          }`}
                        >
                          {isSelected && <Check size={10} strokeWidth={3} />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                            {quote.carrierName}
                            {quote.rateId.includes("terminal") && (
                              <span className="text-[9px] bg-primary-container text-on-primary-container border border-primary/20 px-1.5 py-0.5 rounded font-medium inline-flex items-center gap-0.5">
                                <Sparkles size={9} /> Verified Courier
                              </span>
                            )}
                          </div>
                          {quote.deliveryTime && (
                            <div className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                              <Clock size={11} /> {quote.deliveryTime}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold font-sans tabular-nums text-on-surface block">
                          {isFreeShipping ? "FREE" : formatCurrency(effectiveFee)}
                        </span>
                        {isFreeShipping && quote.fee > 0 && (
                          <span className="text-[10px] text-text-muted line-through font-sans tabular-nums block">
                            {formatCurrency(quote.fee)}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 border border-border-hairline rounded-xl bg-surface-low text-xs text-text-muted">
                Enter your street address and location to view real-time shipping options.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
