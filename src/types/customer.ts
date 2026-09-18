import type { Invoice } from "./invoice";

// Customer and service tracking types
export type ServiceStatus = "active" | "completed" | "pending" | "cancelled";

export interface CustomerService {
  id: string;
  businessId?: string;
  customerId: string;
  name: string;
  service: string;
  amount: number;
  status: ServiceStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Activity {
  id: string;
  businessId?: string;
  customerId: string;
  type: "contact" | "update" | "note" | "service";
  description: string;
  timestamp: string;
}

export interface CustomerAttribute {
  key: string;
  value: string;
}

/**
 * CustomerAttributeValidation mirrors CustomerAttribute — it exists as a
 * named alias so callers can reference the validated/parsed shape without
 * importing the Zod schema itself.
 */
export type CustomerAttributeValidation = CustomerAttribute;

export interface Customer {
  id: string;
  businessId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  services: CustomerService[];
  totalRevenue: number;
  notes?: string;
  attributes?: CustomerAttribute[] | null;
  isActive: boolean;
  isExistingCustomer?: boolean;
  createdAt: string;
}

export interface CustomersSummary {
  total: number;
  activeServicesCount: number;
  totalRevenue: number;
}

export interface NewCustomerInput {
  businessId?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
  attributes?: CustomerAttribute[] | null;
  serviceName?: string;
  service?: string;
  amount?: number;
  status?: ServiceStatus;
  isActive?: boolean;
}

export interface AddServiceInput {
  businessId?: string;
  name: string;
  service: string;
  amount: number;
  status?: ServiceStatus;
}

export interface ImportCustomerRecord {
  name: string;
  phone?: string;
  email: string;
  notes?: string;
  attributes?: CustomerAttribute[] | string | null;
}

export interface CustomerImportResult {
  imported: number;
  importedCount?: number;
  totalRows?: number;
  skipped?: Array<{ line: number; error: string }>;
  customers?: Customer[];
}

export interface CustomerTableProps {
  items: Customer[];
  paginatedItems: Customer[];
  searchQuery: string;
  onSearch: (query: string) => void;
  onSelectCustomer: (id: string) => void;
  selectedCustomerIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAllActive: () => void;
  onClearSelection: () => void;
  onOpenBroadcast: () => void;
  onDeleteSelected?: () => Promise<unknown>;
  isDeletingBulk?: boolean;
  onDeleteCustomer?: (customer: Customer) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface CustomerAddModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  initialCustomer?: Customer | null;
  initialMode?: "view" | "edit";
  onClose: () => void;
  onSubmit: (data: NewCustomerInput) => Promise<boolean>;
}

export interface CustomerServiceModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSubmit: (
    customerId: string,
    customerName: string,
    data: { name: string; service: string; amount: number; status: ServiceStatus }
  ) => Promise<boolean>;
}

export interface CustomerMessageModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onToast?: (message: string) => void;
}

export interface CustomerDetailDrawerProps {
  customer: Customer | null;
  customerInvoices: Invoice[];
  onClose: () => void;
  onEditCustomer?: (customer: Customer) => void;
  onToggleStatus: (customerId: string, isActive: boolean) => void;
  onOpenMessageModal: (customer: Customer) => void;
  onOpenInvoiceModal: (customer: Customer, invoice?: Invoice) => void;
  onOpenAddServiceModal: () => void;
  onConfirmResendInvoice: (invoice: Invoice) => void;
  onDeleteDraftInvoice: (invoiceId: string) => void;
  onDeleteService: (customerId: string, serviceId: string, serviceName: string) => void;
  onDeleteCustomer?: (customerId: string) => Promise<unknown>;
  isDeletingCustomer?: boolean;
  onUpdateServiceStatus: (
    customerId: string,
    serviceId: string,
    status: ServiceStatus,
    serviceName: string,
    statusLabel: string
  ) => void;
}

export interface CustomerResendInvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onConfirm: (invoiceId: string) => Promise<boolean>;
}

export interface CustomerImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  onImportSuccess?: () => void;
}

export interface CustomerBroadcastModalProps {
  isOpen: boolean;
  selectedCustomers: Customer[];
  onClose: () => void;
  onToast?: (message: string) => void;
}

export interface CustomerAttributesEditorProps {
  attributes: CustomerAttribute[];
  isViewMode: boolean;
  attributeError: string;
  keyInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onAddAttributeRow: () => void;
  onRemoveAttributeRow: (index: number) => void;
  onAttributeChange: (index: number, field: "key" | "value", newValue: string) => void;
}
