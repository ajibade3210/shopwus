import type { Product } from "./product";

export type OrderStatus = "OPEN" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type FulfillmentStatus =
  | "UNFULFILLED"
  | "PROCESSING"
  | "READY_FOR_PICKUP"
  | "DISPATCHED"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";
export type DeliveryType = "STORE_PICKUP" | "HOME_DELIVERY";

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode?: string | null;
  deliveryNote?: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  variantId?: string | null;
  productName: string;
  variantTitle?: string | null;
  productSku?: string | null;
  productImage?: string | null;
  unitPrice: number | string;
  quantity: number;
  totalPrice: number | string;
  selectedOptions?: Record<string, unknown> | null;
  product?: Partial<Product> | null;
}

export interface OrderFulfillment {
  id: string;
  orderId: string;
  status: FulfillmentStatus;
  trackingNumber?: string | null;
  courierName?: string | null;
  notes?: string | null;
  notifiedBuyer: boolean;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  reference: string;
  amount: number | string;
  platformFee: number | string;
  gatewayFee: number | string;
  merchantSettlement: number | string;
  currency: string;
  channel?: string | null;
  status: "SUCCESS" | "FAILED" | "REFUNDED";
  paidAt: string;
  createdAt: string;
}

export interface Order {
  id: string;
  businessId: string;
  customerId?: string | null;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string | null;
  currency: string;
  subtotal: number | string;
  discountAmount: number | string;
  deliveryFee: number | string;
  platformFee: number | string;
  merchantEarnings: number | string;
  total: number | string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  deliveryType: DeliveryType;
  shippingAddress?: ShippingAddress | null;
  pickupLocation?: string | null;
  trackingNumber?: string | null;
  courierName?: string | null;
  terminalRateId?: string | null;
  terminalShipmentId?: string | null;
  trackingUrl?: string | null;
  estimatedDelivery?: string | null;
  fulfilledAt?: string | null;
  paymentReference?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
  fulfillments?: OrderFulfillment[];
  transactions?: PaymentTransaction[];
}

export interface OrderSummary {
  totalOrders: number;
  unfulfilled: number;
  pendingPayment: number;
  abandonedCount: number;
  totalRevenue: number;
  merchantEarnings: number;
}

export interface CheckoutSession {
  id: string;
  businessId: string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  cartSnapshot: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
    selectedOptions?: Record<string, unknown>;
  }>;
  subtotal: number | string;
  status: "IN_PROGRESS" | "ABANDONED" | "CONVERTED";
  expiresAt: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// DTOs & SERVICE INTERFACES (AGENTS.md Compliance)
// ---------------------------------------------------------------------------

export interface GetOrdersParams {
  [key: string]: string | number | boolean | null | undefined;
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  tab?: "all" | "unfulfilled" | "completed" | "abandoned";
  sortBy?: "createdAt" | "total" | "orderNumber";
  sortOrder?: "asc" | "desc";
}

export interface OrdersResponse {
  items: Order[] | CheckoutSession[];
  isAbandonedTab: boolean;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string | null;
  deliveryType: DeliveryType;
  shippingAddress?: ShippingAddress | null;
  terminalRateId?: string | null;
  deliveryFee?: number;
  carrierName?: string | null;
  items: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
    selectedOptions?: Record<string, unknown> | null;
  }>;
  checkoutSessionId?: string | null;
}

export interface UpdateOrderStatusInput {
  status?: OrderStatus;
  fulfillmentStatus?: FulfillmentStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string | null;
  courierName?: string | null;
  notes?: string | null;
}

export interface SyncCheckoutSessionInput {
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  cartSnapshot: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
    selectedOptions?: Record<string, unknown> | null;
  }>;
  subtotal: number;
}

export interface OrderDetailsDrawerProps {
  orderId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export type OrderTab = "all" | "unfulfilled" | "completed" | "abandoned";
export type OrderView = "table" | "board";

export interface BoardCardProps {
  order: Order;
  effectiveStatus: FulfillmentStatus;
  onSelect: (id: string) => void;
  onMoveTo: (orderId: string, status: FulfillmentStatus) => Promise<void> | void;
  onDragStart: (e: React.DragEvent, orderId: string) => void;
}

export interface BoardColumnDef {
  key: string;
  title: string;
  headerBg: string;
  statuses: FulfillmentStatus[];
  dropTargetStatus: FulfillmentStatus;
}

export type ColumnDateFilter = "ALL" | "TODAY" | "7_DAYS" | "30_DAYS";

export interface ColumnFilterState {
  dateRange: ColumnDateFilter;
  orderStatus: OrderStatus | "ALL";
  paymentStatus: PaymentStatus | "ALL";
}

export interface OrderBoardMeta {
  totalDelivered: number;
  showingCount: number;
  hasOverflow: boolean;
  overflowCount: number;
  timeframeDays: number;
}

export interface OrderBoardResponse {
  items: Order[];
  deliveredMeta: OrderBoardMeta;
}

export interface OrdersBoardProps {
  orders: Order[];
  isLoading: boolean;
  onSelectOrder: (id: string) => void;
  onMoveTo: (orderId: string, status: FulfillmentStatus) => Promise<void> | void;
  deliveredMeta?: OrderBoardMeta | null;
  onSwitchToTable?: () => void;
}

export interface OrdersTableProps {
  orders: Array<Order | CheckoutSession>;
  isAbandonedTab: boolean;
  isLoading: boolean;
  onSelectOrder: (id: string) => void;
  summary?: OrderSummary;
  tab: OrderTab;
  onTabChange: (tab: OrderTab) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  startIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface CheckoutDeliveryFormProps {
  deliveryConfig?: import("./delivery").StorefrontDeliveryConfig;
  deliveryType: DeliveryType;
  onDeliveryTypeChange: (type: DeliveryType) => void;
  address: ShippingAddress;
  onAddressChange: (address: ShippingAddress) => void;
  quotes?: import("./delivery").DeliveryQuote[];
  selectedRateId?: string | null;
  onSelectRate?: (rate: import("./delivery").DeliveryQuote) => void;
  isLoadingQuotes?: boolean;
  matchedZone?: {
    id: string;
    name: string;
    states: string[];
    fee: number;
    estimatedDays?: string | null;
  } | null;
  deliveryFee: number;
  isFreeShipping: boolean;
}

export interface CheckoutOrderSummaryProps {
  items: import("./product").CartItem[];
  subtotal: number;
  deliveryFee: number;
  isFreeShipping: boolean;
  grandTotal: number;
  deliveryConfig?: import("./delivery").StorefrontDeliveryConfig;
  matchedZone?: {
    id: string;
    name: string;
    states: string[];
    fee: number;
    estimatedDays?: string | null;
  } | null;
  deliveryType: DeliveryType;
}

export interface ManualOrderItemInput {
  productId: string;
  variantId?: string | null;
  quantity: number;
  unitPrice?: number;
}

export interface ManualOrderDraftItem {
  productId: string;
  variantId?: string | null;
  productName: string;
  variantTitle?: string | null;
  unitPrice: number;
  quantity: number;
  maxStock?: number;
}

export interface CreateManualOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: ManualOrderItemInput[];
  fulfillmentMode: "DIRECT_SALE" | "STORE_PICKUP" | "SHIP_TO_CUSTOMER";
  shippingAddress?: ShippingAddress | null;
  deliveryFee?: number;
  paymentStatus: "PAID" | "UNPAID" | "PENDING";
  paymentMethod?: "CASH" | "POS" | "BANK_TRANSFER" | "ONLINE" | "OTHER";
  notes?: string | null;
}

export interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (order: Order) => void;
}
