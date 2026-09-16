import { apiClient } from "@/lib/api-client";
import type {
  CheckoutSession,
  CreateManualOrderInput,
  CreateOrderInput,
  GetOrdersParams,
  Order,
  OrderSummary,
  OrdersResponse,
  SyncCheckoutSessionInput,
  UpdateOrderStatusInput,
} from "@/types";

// ---------------------------------------------------------------------------
// VENDOR ORDERS API
// ---------------------------------------------------------------------------

export async function createManualOrder(input: CreateManualOrderInput): Promise<Order> {
  return apiClient.post<Order>("/orders/manual", input);
}

export async function getOrders(params?: GetOrdersParams): Promise<OrdersResponse> {
  return apiClient.get<OrdersResponse>("/orders", params);
}

export async function getOrderSummary(): Promise<OrderSummary> {
  return apiClient.get<OrderSummary>("/orders/summary");
}

export async function getOrderById(id: string): Promise<Order> {
  return apiClient.get<Order>(`/orders/${encodeURIComponent(id)}`);
}

export async function updateOrderStatus(id: string, input: UpdateOrderStatusInput): Promise<Order> {
  return apiClient.patch<Order>(`/orders/${encodeURIComponent(id)}/status`, input);
}

export async function dispatchOrder(id: string): Promise<Order> {
  return apiClient.post<Order>(`/orders/${encodeURIComponent(id)}/dispatch`);
}

// ---------------------------------------------------------------------------
// PUBLIC STOREFRONT CHECKOUT API
// ---------------------------------------------------------------------------

export async function syncCheckoutSession(
  slug: string,
  input: SyncCheckoutSessionInput,
  sessionId?: string
): Promise<CheckoutSession> {
  return apiClient.post<CheckoutSession>(
    `/orders/storefront/${encodeURIComponent(slug)}/checkout/session`,
    input,
    sessionId ? { params: { sessionId } } : undefined
  );
}

export async function placeStorefrontOrder(slug: string, input: CreateOrderInput): Promise<Order> {
  return apiClient.post<Order>(
    `/orders/storefront/${encodeURIComponent(slug)}/checkout/order`,
    input
  );
}
