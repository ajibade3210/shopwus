"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  createManualOrder,
  deleteOrder,
  dispatchOrder,
  getOrderById,
  getOrderSummary,
  getOrders,
  placeStorefrontOrder,
  updateOrderStatus,
} from "@/services/api/order.service";
import type {
  CreateManualOrderInput,
  CreateOrderInput,
  GetOrdersParams,
  UpdateOrderStatusInput,
} from "@/types";

export function useOrdersQuery(params?: GetOrdersParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => getOrders(params),
    enabled: options?.enabled,
  });
}

export function useOrderSummaryQuery() {
  return useQuery({
    queryKey: queryKeys.orders.summary(),
    queryFn: () => getOrderSummary(),
  });
}

export function useOrderQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.orders.detail(id) : ["orders", "detail", "empty"],
    queryFn: () => {
      if (!id) throw new Error("Order ID required");
      return getOrderById(id);
    },
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOrderStatusInput }) =>
      updateOrderStatus(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.id) });
    },
  });
}

export function useDeleteOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function usePlaceOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, input }: { slug: string; input: CreateOrderInput }) =>
      placeStorefrontOrder(slug, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useCreateManualOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateManualOrderInput) => createManualOrder(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useDispatchOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dispatchOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
    },
  });
}
