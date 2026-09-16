"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  getBillingSummary,
  getPaystackBanks,
  initializeOrderPayment,
  resolvePayoutAccount,
  updatePayoutAccount,
} from "@/services/api/billing.service";
import type {
  InitializePaymentParams,
  ResolveAccountParams,
  UpdatePayoutAccountParams,
} from "@/types";

export function useBillingSummaryQuery() {
  return useQuery({
    queryKey: queryKeys.billing.summary(),
    queryFn: () => getBillingSummary(),
  });
}

export function usePaystackBanksQuery() {
  return useQuery({
    queryKey: queryKeys.billing.banks(),
    queryFn: () => getPaystackBanks(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useResolveAccountMutation() {
  return useMutation({
    mutationFn: (params: ResolveAccountParams) => resolvePayoutAccount(params),
  });
}

export function useUpdatePayoutAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdatePayoutAccountParams) => updatePayoutAccount(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.summary() });
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.all });
    },
  });
}

export function useInitializeOrderPaymentMutation() {
  return useMutation({
    mutationFn: (params: InitializePaymentParams) => initializeOrderPayment(params),
  });
}
