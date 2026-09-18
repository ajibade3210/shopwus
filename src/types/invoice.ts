import type { CurrencyCode } from "./common";
import type { Customer } from "./customer";

// Invoice types
export type InvoiceStatus = "draft" | "sent" | "paid" | "cancelled";
export type PaymentTerms = "Due on receipt" | "Net 14" | "Net 30" | "Net 60";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  businessId?: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  paymentTerms?: PaymentTerms | string;
  currency?: CurrencyCode;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  status: InvoiceStatus;
  pdfUrl?: string;
  pdfKey?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoicesSummary {
  totalInvoiced: number;
  paidRevenue: number;
  outstandingRevenue: number;
  totalCount: number;
  paidCount: number;
  collectionRate: number;
}

export interface InvoicePdfResponse {
  status?: string;
  ready?: boolean;
  downloadUrl?: string;
  pdfUrl?: string;
  filename?: string;
  invoiceNumber?: string;
  message?: string;
}

export interface InvoiceInput {
  id?: string;
  invoiceNumber?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  paymentTerms?: PaymentTerms | string;
  currency?: CurrencyCode;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  status?: InvoiceStatus;
}

export interface InvoiceModalProps {
  initialCustomer?: Customer;
  existingInvoice?: Invoice;
  allCustomers?: Customer[];
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  onInvoiceSaved?: (invoice: Invoice) => void;
}

export interface InvoiceModalHeaderProps {
  existingInvoice?: Invoice;
  isSavingDraft: boolean;
  isSending: boolean;
  isResending: boolean;
  isDownloadingPdf: boolean;
  isSendingWhatsApp?: boolean;
  isCopyingLink?: boolean;
  isMarkingPaid: boolean;
  isMarkingUnpaid: boolean;
  isDeleting: boolean;
  copiedLink: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
  onSendInvoice: () => void;
  onResendInvoice: () => void;
  onDownloadPdf: () => void;
  onSendWhatsApp: () => void;
  onCopyLink: () => void;
  onMarkAsPaid: () => void;
  onMarkAsUnpaid: () => void;
  onDeleteInvoice: () => void;
}

export interface InvoiceFormFieldsProps {
  customerId: string;
  customerName: string;
  customerEmail: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: PaymentTerms | "";
  currency: CurrencyCode;
  items: InvoiceItem[];
  discount: number;
  taxRate: number;
  total: number;
  notes: string;
  allCustomers: Customer[];
  setCustomerName: (v: string) => void;
  setBillingAddress: (v: string) => void;
  setIssueDate: (v: string) => void;
  setDueDate: (v: string) => void;
  setPaymentTerms: (v: PaymentTerms | "") => void;
  setCurrency: (v: CurrencyCode) => void;
  setDiscount: (v: number) => void;
  setTaxRate: (v: number) => void;
  setNotes: (v: string) => void;
  handleCustomerChange: (id: string) => void;
  handleItemChange: (id: string, field: keyof InvoiceItem, val: string | number) => void;
  handleAddItem: () => void;
  handleRemoveItem: (id: string) => void;
}

export interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  currency: CurrencyCode;
  onItemChange: (id: string, field: keyof InvoiceItem, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

export interface InvoiceSummaryProps {
  discount: number;
  taxRate: number;
  total: number;
  currency: CurrencyCode;
  notes: string;
  onDiscountChange: (val: number) => void;
  onTaxRateChange: (val: number) => void;
  onNotesChange: (val: string) => void;
}

export interface InvoicePreviewProps {
  existingInvoice?: Invoice;
  customerName: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: PaymentTerms | "" | string;
  currency: CurrencyCode;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  copiedLink: boolean;
  onCopyLink: () => void;
}

export interface UseInvoiceFormOptions {
  initialCustomer?: Customer;
  existingInvoice?: Invoice;
  allCustomers?: Customer[];
  onToast: (msg: string) => void;
  onInvoiceSaved?: (invoice: Invoice) => void;
  onClose: () => void;
}

export type InvoiceStatusFilter = "all" | InvoiceStatus;

export interface InvoiceMetrics {
  totalInvoiced: number;
  paidRevenue: number;
  outstandingRevenue: number;
  collectionRate: number;
  totalCount: number;
  paidCount: number;
}

export interface InvoicesPageProps {
  onToast?: (msg: string) => void;
}

export interface InvoiceTableProps {
  items: Invoice[];
  paginatedItems: Invoice[];
  searchQuery: string;
  statusFilter: InvoiceStatusFilter;
  onSearch: (query: string) => void;
  onStatusFilterChange: (status: InvoiceStatusFilter) => void;
  onSelectInvoice: (invoice: Invoice) => void;
  onMarkPaid: (id: string) => void;
  onMarkUnpaid: (id: string) => void;
  onDeleteDraft?: (invoice: Invoice) => void;
  isDeleting?: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface UseInvoicesReturn {
  invoices: Invoice[];
  paginatedItems: Invoice[];
  searchQuery: string;
  statusFilter: InvoiceStatusFilter;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  startIndex: number;
  metrics: InvoiceMetrics;
  isExporting: boolean;
  selectedInvoice: Invoice | undefined;
  isModalOpen: boolean;
  handleSearch: (query: string) => void;
  handleStatusFilter: (status: InvoiceStatusFilter) => void;
  handleOpenCreate: () => void;
  handleOpenEdit: (invoice: Invoice) => void;
  handleCloseModal: () => void;
  handleMarkPaid: (id: string) => Promise<void>;
  handleMarkUnpaid: (id: string) => Promise<void>;
  handleExportCSV: () => void;
  reloadInvoices: () => Promise<void>;
}
