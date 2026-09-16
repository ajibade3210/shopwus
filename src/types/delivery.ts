export interface DeliveryZone {
  id: string;
  businessId: string;
  name: string;
  states: string[];
  fee: number | string;
  estimatedDays?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeliverySettings {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  senderPhone?: string | null;
  enableStorePickup: boolean;
  pickupInstructions?: string | null;
  enableHomeDelivery: boolean;
  freeDeliveryThreshold?: number | string | null;
  fallbackShippingFee?: number | string | null;
}

export interface DeliveryQuote {
  rateId: string;
  carrierName: string;
  carrierSlug?: string | null;
  carrierLogo?: string | null;
  deliveryEta?: number | null;
  deliveryTime?: string | null;
  currency: string;
  fee: number;
  feeKobo: number;
}

export interface GetDeliveryQuotesPayload {
  destination: {
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    postalCode?: string | null;
  };
  items: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
  }>;
}

export interface StorefrontDeliveryConfig {
  enableStorePickup: boolean;
  pickupLocation?: string | null;
  pickupInstructions?: string | null;
  enableHomeDelivery: boolean;
  freeDeliveryThreshold?: number | null;
  fallbackShippingFee?: number | null;
  deliveryZones?: Array<{
    id: string;
    name: string;
    states: string[];
    fee: number;
    estimatedDays?: string | null;
  }>;
}

export interface CreateDeliveryZoneInput {
  name: string;
  states: string[];
  fee: number;
  estimatedDays?: string | null;
  isActive?: boolean;
}

export interface UpdateDeliverySettingsInput {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  senderPhone?: string | null;
  enableStorePickup?: boolean;
  pickupInstructions?: string | null;
  enableHomeDelivery?: boolean;
  freeDeliveryThreshold?: number | null;
  fallbackShippingFee?: number | null;
}
