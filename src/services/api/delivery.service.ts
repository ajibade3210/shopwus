import { apiClient } from "@/lib/api-client";
import type {
  CreateDeliveryZoneInput,
  DeliverySettings,
  DeliveryZone,
  StorefrontDeliveryConfig,
  UpdateDeliverySettingsInput,
} from "@/types";

// ---------------------------------------------------------------------------
// VENDOR DELIVERY API
// ---------------------------------------------------------------------------

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  const data = await apiClient.get<DeliveryZone[] | { items: DeliveryZone[] }>("/delivery/zones");
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: DeliveryZone[] }).items)
  ) {
    return (data as { items: DeliveryZone[] }).items;
  }
  return [];
}

export async function createDeliveryZone(input: CreateDeliveryZoneInput): Promise<DeliveryZone> {
  return apiClient.post<DeliveryZone>("/delivery/zones", input);
}

export async function updateDeliveryZone(
  id: string,
  input: Partial<CreateDeliveryZoneInput>
): Promise<DeliveryZone> {
  return apiClient.put<DeliveryZone>(`/delivery/zones/${encodeURIComponent(id)}`, input);
}

export async function deleteDeliveryZone(id: string): Promise<void> {
  return apiClient.delete<void>(`/delivery/zones/${encodeURIComponent(id)}`);
}

export async function getDeliverySettings(): Promise<DeliverySettings> {
  return apiClient.get<DeliverySettings>("/delivery/settings");
}

export async function updateDeliverySettings(
  input: UpdateDeliverySettingsInput
): Promise<DeliverySettings> {
  return apiClient.put<DeliverySettings>("/delivery/settings", input);
}

// ---------------------------------------------------------------------------
// PUBLIC STOREFRONT DELIVERY API
// ---------------------------------------------------------------------------

export async function getStorefrontDeliveryConfig(slug: string): Promise<StorefrontDeliveryConfig> {
  return apiClient.get<StorefrontDeliveryConfig>(
    `/delivery/storefront/${encodeURIComponent(slug)}`
  );
}

export async function getStorefrontDeliveryQuotes(
  slug: string,
  payload: import("@/types").GetDeliveryQuotesPayload
): Promise<import("@/types").DeliveryQuote[]> {
  return apiClient.post<import("@/types").DeliveryQuote[]>(
    `/delivery/storefront/${encodeURIComponent(slug)}/quotes`,
    payload
  );
}
