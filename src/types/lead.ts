// Lead and inquiry types
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost" | "closed";

export interface Lead {
  id: string;
  businessId?: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  services?: string[];
  eventDate: string;
  budget?: number;
  message: string;
  status: LeadStatus;
  isExistingCustomer?: boolean;
  customerId?: string | null;
  createdAt: string;
}

export interface CreateLeadInput {
  businessId?: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  services?: string[];
  eventDate: string;
  budget?: number;
  message: string;
}

export interface PublicInquiryInput {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  services?: string[];
  eventDate?: string;
  budget?: number | string;
  message?: string;
}

export interface PublicInquiryResponse {
  id: string;
  status: string;
  createdAt: string;
}

export interface LeadsSummary {
  total: number;
  newToday: number;
  conversion: number;
}

export type LeadFilterStatus = "all" | "active" | "new" | "contacted" | "qualified" | "converted";

export interface LeadTableProps {
  items: Lead[];
  paginatedItems: Lead[];
  searchQuery: string;
  onSearch: (query: string) => void;
  statusFilter?: LeadFilterStatus;
  onStatusFilterChange?: (status: LeadFilterStatus) => void;
  onSelectLead: (id: string) => void;
  selectedLeadIds?: string[];
  onToggleSelect?: (id: string) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onDeleteSelected?: () => Promise<unknown>;
  isDeletingBulk?: boolean;
  onDeleteLead?: (lead: Lead) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface LeadDetailDrawerProps {
  lead: Lead | null;
  isConverting: boolean;
  onClose: () => void;
  onOpenMessageModal: (lead: Lead) => void;
  onConvertToCustomer: (leadId: string) => void;
  onIssueInvoice: (lead: Lead) => void;
  onDeleteLead?: (leadId: string) => Promise<unknown>;
  isDeleting?: boolean;
}

export interface LeadMessageModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSendWhatsApp: (lead: Lead, phone: string, text: string) => void;
  onSendEmail: (lead: Lead, email: string, name: string, text: string) => void;
}
