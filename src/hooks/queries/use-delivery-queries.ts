"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  createDeliveryZone,
  deleteDeliveryZone,
  getDeliverySettings,
  getDeliveryZones,
  getStorefrontDeliveryConfig,
  updateDeliverySettings,
  updateDeliveryZone,
} from "@/services/api/delivery.service";
import type { CreateDeliveryZoneInput, UpdateDeliverySettingsInput } from "@/types";

export function useDeliveryZonesQuery() {
  return useQuery({
    queryKey: queryKeys.delivery.zones(),
    queryFn: () => getDeliveryZones(),
  });
}

export function useDeliverySettingsQuery() {
  return useQuery({
    queryKey: queryKeys.delivery.settings(),
    queryFn: () => getDeliverySettings(),
  });
}

export function useStorefrontDeliveryConfigQuery(slug: string | null | undefined) {
  return useQuery({
    queryKey: slug ? queryKeys.delivery.storefront(slug) : ["delivery", "storefront", "empty"],
    queryFn: () => {
      if (!slug) throw new Error("Slug required");
      return getStorefrontDeliveryConfig(slug);
    },
    enabled: Boolean(slug),
  });
}

export function useCreateDeliveryZoneMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDeliveryZoneInput) => createDeliveryZone(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.delivery.zones() });
      queryClient.invalidateQueries({ queryKey: queryKeys.delivery.all });
    },
  });
}

export function useUpdateDeliveryZoneMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateDeliveryZoneInput> }) =>
      updateDeliveryZone(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.delivery.zones() });
      queryClient.invalidateQueries({ queryKey: queryKeys.delivery.all });
    },
  });
}

export function useDeleteDeliveryZoneMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDeliveryZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.delivery.zones() });
      queryClient.invalidateQueries({ queryKey: queryKeys.delivery.all });
    },
  });
}

export function useUpdateDeliverySettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateDeliverySettingsInput) => updateDeliverySettings(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.delivery.settings() });
      queryClient.invalidateQueries({ queryKey: queryKeys.delivery.all });
    },
  });
}
