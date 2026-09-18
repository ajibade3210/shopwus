import { apiClient } from "@/lib/api-client";
import { AddServiceInputSchema, NewCustomerInputSchema } from "@/lib/schemas";
import type {
  AddServiceInput,
  Customer,
  CustomerImportResult,
  CustomersSummary,
  ImportCustomerRecord,
  NewCustomerInput,
  ServiceStatus,
} from "@/types";

/**
 * Fetch all customers with optional search query and active status filter
 */
export async function getCustomers(query?: string, isActive?: boolean): Promise<Customer[]> {
  const data = await apiClient.get<
    Customer[] | { items?: Customer[]; customers?: Customer[]; data?: Customer[] }
  >("/customers", {
    q: query,
    isActive,
  });
  if (Array.isArray(data)) return data;
  return data?.items || data?.customers || data?.data || [];
}

export async function getCustomersSummary(): Promise<CustomersSummary> {
  return apiClient.get<CustomersSummary>("/customers/summary");
}

/**
 * Retrieve single customer by ID
 */
export async function getCustomer(id: string): Promise<Customer> {
  return apiClient.get<Customer>(`/customers/${encodeURIComponent(id)}`);
}

/**
 * Create a new customer in the studio directory
 */
export async function createCustomer(input: NewCustomerInput): Promise<Customer> {
  const validated = NewCustomerInputSchema.parse(input);
  return apiClient.post<Customer>("/customers", validated);
}

/**
 * Update an existing customer's contact details
 */
export async function updateCustomer(
  id: string,
  input: Partial<NewCustomerInput>
): Promise<Customer> {
  return apiClient.put<Customer>(`/customers/${encodeURIComponent(id)}`, input);
}

/**
 * Toggle customer active status (isActive: true/false)
 */
export async function toggleCustomerActiveStatus(
  customerId: string,
  isActive: boolean
): Promise<Customer> {
  return apiClient.patch<Customer>(`/customers/${encodeURIComponent(customerId)}/status`, {
    isActive,
  });
}

/**
 * Delete a customer record
 */
export async function deleteCustomer(id: string): Promise<{ success: boolean; id: string }> {
  return apiClient.delete(`/customers/${encodeURIComponent(id)}`);
}

/**
 * Add a new Service / Scope to an existing customer
 */
export async function addServiceToCustomer(
  customerId: string,
  input: AddServiceInput
): Promise<Customer> {
  const validated = AddServiceInputSchema.parse(input);
  return apiClient.post<Customer>(
    `/customers/${encodeURIComponent(customerId)}/services`,
    validated
  );
}

/**
 * Update a Service status for a customer
 */
export async function updateCustomerServiceStatus(
  customerId: string,
  serviceId: string,
  status: ServiceStatus
): Promise<Customer> {
  return apiClient.patch<Customer>(
    `/customers/${encodeURIComponent(customerId)}/services/${encodeURIComponent(serviceId)}/status`,
    { status }
  );
}

/**
 * Delete a Service from a customer
 */
export async function deleteCustomerService(
  customerId: string,
  serviceId: string
): Promise<Customer> {
  return apiClient.delete<Customer>(
    `/customers/${encodeURIComponent(customerId)}/services/${encodeURIComponent(serviceId)}`
  );
}

/**
 * Retrieve customer audit activity timeline
 */
export async function getCustomerActivity(id: string) {
  return apiClient.get<
    Array<{
      id: string;
      customerId: string;
      type: string;
      description: string;
      createdAt: string;
    }>
  >(`/customers/${encodeURIComponent(id)}/activities`);
}

/**
 * Send an invoice to a customer with pending service/retainer
 */
export async function sendCustomerInvoice(
  customerId: string,
  serviceId?: string
): Promise<{ success: boolean; invoiceId: string; recipient: string; amount: number }> {
  const res = await apiClient.post<{
    invoiceId: string;
    recipient: string;
    amount: number;
  }>("/invoices", {
    customerId,
    serviceId,
  });

  return {
    success: true,
    invoiceId: res.invoiceId,
    recipient: res.recipient,
    amount: res.amount,
  };
}

/**
 * Import Customers from CSV / structured records
 */
export async function importCustomers(
  records: ImportCustomerRecord[]
): Promise<CustomerImportResult> {
  return apiClient.post<CustomerImportResult>("/customers/import", {
    records,
  });
}

/**
 * Export Customers List as CSV
 */
export async function exportCustomersCSV(): Promise<{ count: number; filename: string }> {
  const csvData = await apiClient.get<string>("/customers/export");
  const filename = `shopwus-customers-${new Date().toISOString().split("T")[0]}.csv`;

  if (typeof window !== "undefined") {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const count = typeof csvData === "string" ? Math.max(csvData.split("\n").length - 1, 0) : 0;
  return { count, filename };
}

/**
 * Download standard Customer CSV Import Template
 */
export function downloadCustomerCSVTemplate(): void {
  if (typeof window === "undefined") return;
  const headers = ["Name", "Phone", "Email", "Notes", "Customer Attributes"];
  const sampleRows = [
    [
      "Adeola Adeleke",
      "+234 803 123 4567",
      "adeola@example.com",
      "VIP anniversary celebration client",
      "Waist: 32 | Bust: 36 | Delivery: Morning",
    ],
    [
      "Chinedu Obi",
      "+234 802 987 6543",
      "chinedu@example.com",
      "Executive corporate gala inquiry",
      "Shoe Size: 44 | Preferred Contact: WhatsApp",
    ],
  ];
  const csvContent = [
    headers.join(","),
    ...sampleRows.map(r => r.map(c => `"${c}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "customer_import_template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
