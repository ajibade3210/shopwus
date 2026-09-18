export interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
  active: boolean;
}

export interface ResolvedAccount {
  account_number: string;
  account_name: string;
  bank_id: number;
}

export interface BusinessBilling {
  id: string;
  businessId: string;
  paystackSubaccount?: string | null;
  bankCode?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  isVerified: boolean;
  planTier: string;
  platformFeePercent: number | string;
  subscriptionStatus: string;
  subscriptionCode?: string | null;
  currentPeriodEnd?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BillingTransactionItem {
  id: string;
  orderNumber: string;
  customerName: string;
  reference: string;
  amount: number;
  merchantSettlement: number;
  platformFee: number;
  status: "SUCCESS" | "FAILED" | "REFUNDED";
  paidAt: string;
}

export type TransactionStatusFilter = "all" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface TransactionTableProps {
  items: BillingTransactionItem[];
  paginatedItems: BillingTransactionItem[];
  searchQuery: string;
  statusFilter: TransactionStatusFilter;
  onSearch: (q: string) => void;
  onStatusFilterChange: (s: TransactionStatusFilter) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startIndex: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

export interface BillingSummary {
  billing: BusinessBilling;
  stats: {
    totalVolume: number;
    totalSettled: number;
    totalPlatformFees: number;
  };
  transactions: BillingTransactionItem[];
}

export interface InitializePaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface ResolveAccountParams {
  accountNumber: string;
  bankCode: string;
}

export interface UpdatePayoutAccountParams {
  accountNumber: string;
  bankCode: string;
  bankName: string;
}

export interface InitializePaymentParams {
  orderId: string;
  callbackUrl?: string;
}
