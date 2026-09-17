"use client";

import { AlertCircle, Check, CheckCircle2, ChevronDown, Loader2, Phone } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { NIGERIAN_CITIES_BY_STATE, NIGERIAN_STATES } from "@/constants/delivery";
import { useDeliverySettingsQuery, useUpdateDeliverySettingsMutation } from "@/hooks/queries";
import { useAdminToast } from "../layout/admin-toast-provider";
import { Card } from "../settings/card";
import { Toggle } from "../settings/toggle";

export function LocationSection() {
  const { showToast } = useAdminToast();
  const { data: settings, isLoading } = useDeliverySettingsQuery();
  const updateSettingsMutation = useUpdateDeliverySettingsMutation();

  // Local settings form state
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Lagos");
  const [postalCode, setPostalCode] = useState("");
  const [senderPhone, setSenderPhone] = useState("");

  const [enableStorePickup, setEnableStorePickup] = useState(true);
  const [pickupInstructions, setPickupInstructions] = useState("");
  const [enableHomeDelivery, setEnableHomeDelivery] = useState(true);
  const [fallbackShippingFee, setFallbackShippingFee] = useState<string>("3000");
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<string>("");

  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form IDs for Accessibility
  const addr1Id = useId();
  const addr2Id = useId();
  const stateId = useId();
  const cityId = useId();
  const postalCodeId = useId();
  const senderPhoneId = useId();
  const pickupInstructionsId = useId();
  const fallbackFeeId = useId();
  const freeThresholdId = useId();

  useEffect(() => {
    if (settings) {
      setAddressLine1(settings.addressLine1 || "");
      setAddressLine2(settings.addressLine2 || "");
      setCity(settings.city || "");
      setState(settings.state || "Lagos");
      setPostalCode(settings.postalCode || "");
      setSenderPhone(settings.senderPhone || "");
      setEnableStorePickup(settings.enableStorePickup ?? true);
      setPickupInstructions(settings.pickupInstructions || "");
      setEnableHomeDelivery(settings.enableHomeDelivery ?? true);
      setFallbackShippingFee(
        settings.fallbackShippingFee ? String(settings.fallbackShippingFee) : "3000"
      );
      setFreeDeliveryThreshold(
        settings.freeDeliveryThreshold ? String(settings.freeDeliveryThreshold) : ""
      );
    }
  }, [settings]);

  const citiesForState = useMemo(
    () => (state ? NIGERIAN_CITIES_BY_STATE[state] || [] : []),
    [state]
  );

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    try {
      await updateSettingsMutation.mutateAsync({
        addressLine1: addressLine1.trim() || null,
        addressLine2: addressLine2.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        postalCode: postalCode.trim() || null,
        senderPhone: senderPhone.trim() || null,
        enableStorePickup,
        pickupInstructions: pickupInstructions.trim() || null,
        enableHomeDelivery,
        fallbackShippingFee: fallbackShippingFee ? Number(fallbackShippingFee) : 3000,
        freeDeliveryThreshold: freeDeliveryThreshold ? Number(freeDeliveryThreshold) : null,
      });

      setIsSaved(true);
      showToast("Delivery & store origin settings saved successfully!");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save settings.";
      setErrorMsg(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-muted">
        <Loader2 size={18} className="animate-spin mx-auto mb-2 text-primary" />
        Loading delivery settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Origin Address Card */}
      <Card title="Store Origin Address" description="Terminal Africa Courier Pickup Location">
        <div className="space-y-4 font-sans">
          <p className="text-xs text-muted">
            Where couriers (DHL, Fez, etc.) arrive to collect orders for delivery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="sm:col-span-2">
              <label htmlFor={addr1Id} className="block text-xs font-medium text-on-surface mb-1">
                Street Address Line 1 *
              </label>
              <input
                id={addr1Id}
                type="text"
                placeholder="Shop number, Street, Landmark"
                value={addressLine1}
                onChange={e => setAddressLine1(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-border-hairline rounded-xl focus:border-primary focus:bg-white text-on-surface transition-all outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={addr2Id} className="block text-xs font-medium text-on-surface mb-1">
                Address Line 2 (Optional)
              </label>
              <input
                id={addr2Id}
                type="text"
                placeholder="Suite, building, or unit number"
                value={addressLine2}
                onChange={e => setAddressLine2(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-border-hairline rounded-xl focus:border-primary focus:bg-white text-on-surface transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor={stateId} className="block text-xs font-medium text-on-surface mb-1">
                Store State *
              </label>
              <div className="relative">
                <select
                  id={stateId}
                  value={state}
                  onChange={e => {
                    setState(e.target.value);
                    setCity(NIGERIAN_CITIES_BY_STATE[e.target.value]?.[0] || "");
                  }}
                  className="w-full px-3.5 py-2.5 pr-10 text-xs bg-surface-low border border-border-hairline rounded-xl focus:border-primary focus:bg-white text-on-surface transition-all outline-none appearance-none cursor-pointer font-medium"
                >
                  {NIGERIAN_STATES.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted">
                  <ChevronDown size={15} />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor={cityId} className="block text-xs font-medium text-on-surface mb-1">
                City / Area *
              </label>
              {citiesForState.length > 0 ? (
                <div className="relative">
                  <select
                    id={cityId}
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 text-xs bg-surface-low border border-border-hairline rounded-xl focus:border-primary focus:bg-white text-on-surface transition-all outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="">-- Choose City --</option>
                    {citiesForState.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted">
                    <ChevronDown size={15} />
                  </div>
                </div>
              ) : (
                <input
                  id={cityId}
                  type="text"
                  placeholder="e.g. Ikeja"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-border-hairline rounded-xl focus:border-primary focus:bg-white text-on-surface transition-all outline-none"
                />
              )}
            </div>

            <div>
              <label
                htmlFor={senderPhoneId}
                className="block text-xs font-medium text-on-surface mb-1"
              >
                Store / Dispatch Phone Number *
              </label>
              <div className="relative">
                <Phone
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  id={senderPhoneId}
                  type="tel"
                  placeholder="e.g. 08012345678"
                  value={senderPhone}
                  onChange={e => setSenderPhone(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 text-xs bg-surface-low border border-border-hairline rounded-xl focus:border-primary focus:bg-white text-on-surface transition-all outline-none"
                />
              </div>
              <p className="text-[10px] text-outline mt-1">
                Couriers call this number upon arrival to pick up packages.
              </p>
            </div>

            <div>
              <label
                htmlFor={postalCodeId}
                className="block text-xs font-medium text-on-surface mb-1"
              >
                Postal Code (Optional)
              </label>
              <input
                id={postalCodeId}
                type="text"
                placeholder="e.g. 100001"
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-border-hairline rounded-xl focus:border-primary focus:bg-white text-on-surface transition-all outline-none"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Fulfillment Options Card */}
      <Card
        title="Delivery & Fulfillment Modes"
        description="Control which fulfillment channels are visible to your customers during storefront checkout"
      >
        <div className="space-y-6 font-sans">
          {/* Home Delivery & Terminal Quoting Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-on-surface block">
                  Enable Home Delivery
                </span>
                <span className="text-[11px] text-muted">
                  Customers can enter their address and receive real-time courier quotes.
                </span>
              </div>
              <Toggle
                on={enableHomeDelivery}
                onClick={() => setEnableHomeDelivery(!enableHomeDelivery)}
              />
            </div>

            {enableHomeDelivery && (
              <div className="p-4 bg-surface-low border border-border-hairline rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={fallbackFeeId}
                    className="block text-xs font-medium text-on-surface mb-1"
                  >
                    Fallback Flat Shipping Fee (₦)
                  </label>
                  <input
                    id={fallbackFeeId}
                    type="number"
                    min="0"
                    placeholder="3000"
                    value={fallbackShippingFee}
                    onChange={e => setFallbackShippingFee(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-border-hairline rounded-xl focus:border-primary text-on-surface transition-all outline-none"
                  />
                  <p className="text-[10px] text-outline mt-1">
                    Used if couriers are temporarily unreachable or timeout. Default ₦3,000.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={freeThresholdId}
                    className="block text-xs font-medium text-on-surface mb-1"
                  >
                    Free Delivery Threshold (₦)
                  </label>
                  <input
                    id={freeThresholdId}
                    type="number"
                    min="0"
                    placeholder="e.g. 50000"
                    value={freeDeliveryThreshold}
                    onChange={e => setFreeDeliveryThreshold(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-border-hairline rounded-xl focus:border-primary text-on-surface transition-all outline-none"
                  />
                  <p className="text-[10px] text-outline mt-1">
                    Orders with subtotal at or above this amount receive free shipping. Leave blank
                    to disable.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Store Pickup Toggle */}
          <div className="pt-4 border-t border-border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-on-surface block">
                  Enable In-Store Pickup
                </span>
                <span className="text-[11px] text-muted">
                  Allows customers to order online and collect in person with zero shipping fee.
                </span>
              </div>
              <Toggle
                on={enableStorePickup}
                onClick={() => setEnableStorePickup(!enableStorePickup)}
              />
            </div>

            {enableStorePickup && (
              <div>
                <label
                  htmlFor={pickupInstructionsId}
                  className="block text-xs font-medium text-on-surface mb-1"
                >
                  Pickup Instructions for Customer
                </label>
                <textarea
                  id={pickupInstructionsId}
                  rows={2}
                  placeholder="e.g. Available for collection Monday–Saturday between 10am and 6pm. Bring your order reference number."
                  value={pickupInstructions}
                  onChange={e => setPickupInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface-low border border-border-hairline rounded-xl focus:border-primary focus:bg-white text-on-surface transition-all outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Save Button Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {isSaved && (
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 animate-in fade-in">
            <CheckCircle2 size={14} /> Saved
          </span>
        )}

        <button
          type="button"
          onClick={() => handleSaveSettings()}
          disabled={updateSettingsMutation.isPending}
          className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {updateSettingsMutation.isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving Settings...
            </>
          ) : (
            <>
              <Check size={14} />
              Save Delivery Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
