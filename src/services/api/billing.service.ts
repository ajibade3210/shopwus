import { apiClient } from "@/lib/api-client";
import type {
  Bank,
  BillingSummary,
  BusinessBilling,
  InitializePaymentParams,
  InitializePaymentResponse,
  ResolveAccountParams,
  ResolvedAccount,
  UpdatePayoutAccountParams,
} from "@/types";

export async function getPaystackBanks(): Promise<Bank[]> {
  const data = await apiClient.get<Bank[] | { items: Bank[] }>("/billing/banks");
  let items: Bank[] = [];
  if (Array.isArray(data)) {
    items = data;
  } else if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: Bank[] }).items)
  ) {
    items = (data as { items: Bank[] }).items;
  }

  const seen = new Set<string>();
  return items.filter(bank => {
    if (!bank.code || seen.has(bank.code)) return false;
    seen.add(bank.code);
    return true;
  });
}

export async function resolvePayoutAccount(params: ResolveAccountParams): Promise<ResolvedAccount> {
  return apiClient.post<ResolvedAccount>("/billing/resolve-account", params);
}

export async function updatePayoutAccount(
  params: UpdatePayoutAccountParams
): Promise<BusinessBilling> {
  return apiClient.post<BusinessBilling>("/billing/payout-account", params);
}

export async function getBillingSummary(): Promise<BillingSummary> {
  return apiClient.get<BillingSummary>("/billing/summary");
}

export async function initializeOrderPayment(
  params: InitializePaymentParams
): Promise<InitializePaymentResponse> {
  return apiClient.post<InitializePaymentResponse>(
    "/billing/storefront/initialize-payment",
    params
  );
}
