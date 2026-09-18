import { APP_CONFIG } from "@/constants";
import { apiClient } from "@/lib/api-client";
import { InvoiceInputSchema } from "@/lib/schemas";
import type {
  Invoice,
  InvoiceInput,
  InvoicePdfResponse,
  InvoiceStatus,
  InvoicesSummary,
} from "@/types";
import { CURRENCY_SYMBOLS, normalizePhoneNumber } from "@/utils";

/**
 * 1. Get All Invoices (Searchable, Filterable by status & customerId)
 */
export async function getInvoices(status?: InvoiceStatus): Promise<Invoice[]> {
  const data = await apiClient.get<
    Invoice[] | { items?: Invoice[]; invoices?: Invoice[]; data?: Invoice[] }
  >("/invoices", {
    status,
  });
  if (Array.isArray(data)) return data;
  return data?.items || data?.invoices || data?.data || [];
}

export async function getInvoicesSummary(): Promise<InvoicesSummary> {
  return apiClient.get<InvoicesSummary>("/invoices/summary");
}

/**
 * 2. Get Single Invoice by ID
 */
export async function getInvoiceById(id: string): Promise<Invoice> {
  return apiClient.get<Invoice>(`/invoices/${encodeURIComponent(id)}`);
}

/**
 * 3. Get Invoices for a specific Customer / Lead
 */
export async function getInvoicesByCustomerId(customerId: string): Promise<Invoice[]> {
  const data = await apiClient.get<
    Invoice[] | { items?: Invoice[]; invoices?: Invoice[]; data?: Invoice[] }
  >("/invoices", {
    customerId,
  });
  if (Array.isArray(data)) return data;
  return data?.items || data?.invoices || data?.data || [];
}

/**
 * 4. Create or Save Draft Invoice
 */
export async function saveInvoiceDraft(input: InvoiceInput): Promise<Invoice> {
  const validated = InvoiceInputSchema.parse(input);
  if (validated.id && !validated.id.startsWith("inv-new-")) {
    return apiClient.put<Invoice>(`/invoices/${encodeURIComponent(validated.id)}`, {
      ...validated,
      status: "draft",
    });
  }
  return apiClient.post<Invoice>("/invoices", {
    ...validated,
    status: "draft",
  });
}

/**
 * 5. Send Invoice (Creates/updates and triggers email dispatch)
 */
export async function sendInvoice(input: InvoiceInput): Promise<Invoice> {
  const validated = InvoiceInputSchema.parse(input);
  if (validated.id && !validated.id.startsWith("inv-new-")) {
    await apiClient.put<Invoice>(`/invoices/${encodeURIComponent(validated.id)}`, {
      ...validated,
      status: "sent",
    });
    return apiClient.post<Invoice>(`/invoices/${encodeURIComponent(validated.id)}/send`);
  }
  return apiClient.post<Invoice>("/invoices", {
    ...validated,
    status: "sent",
  });
}

/**
 * 6. Resend Invoice (Re-dispatch email delivery to customer)
 */
export async function resendInvoice(id: string): Promise<Invoice> {
  return apiClient.post<Invoice>(`/invoices/${encodeURIComponent(id)}/send`);
}

/**
 * 7. Delete Invoice
 */
export async function deleteInvoice(id: string): Promise<{ success: boolean; id: string }> {
  return apiClient.delete(`/invoices/${encodeURIComponent(id)}`);
}

/**
 * 8. Mark Invoice as Paid
 */
export async function markInvoiceAsPaid(id: string): Promise<Invoice> {
  return apiClient.patch<Invoice>(`/invoices/${encodeURIComponent(id)}/status`, {
    status: "paid",
  });
}

/**
 * 9. Mark Invoice as Unpaid
 */
export async function markInvoiceAsUnpaid(id: string): Promise<Invoice> {
  return apiClient.patch<Invoice>(`/invoices/${encodeURIComponent(id)}/status`, {
    status: "sent",
  });
}

/**
 * 10. Get Invoice PDF Media URL from R2
 */
export async function getInvoicePdfUrl(id: string): Promise<string> {
  const data = await apiClient.get<InvoicePdfResponse>(`/invoices/${encodeURIComponent(id)}/pdf`);
  const url = data?.downloadUrl || data?.pdfUrl;
  if (!url) {
    throw new Error(data?.message || "Invoice PDF is being prepared. Please try again shortly.");
  }
  return url;
}

/**
 * 11. Download Invoice PDF in browser
 */
export async function downloadInvoicePdf(invoice: Invoice | string): Promise<void> {
  const id = typeof invoice === "string" ? invoice : invoice.id;
  const invoiceNumber = typeof invoice === "string" ? invoice : invoice.invoiceNumber;
  const url =
    typeof invoice !== "string" && invoice.pdfUrl ? invoice.pdfUrl : await getInvoicePdfUrl(id);

  if (typeof window !== "undefined") {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("download", `${invoiceNumber || "Invoice"}.pdf`);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    }, 100);
  }
}

/**
 * 12. Generates pre-formatted WhatsApp brief for billing notice
 */
export function createWhatsAppInvoiceUrl(
  invoice: Invoice,
  customerPhone?: string,
  studioName?: string,
  pdfUrl?: string
): string {
  const brandName = studioName || APP_CONFIG.name;
  const sym = CURRENCY_SYMBOLS[invoice.currency || "NGN"] || "₦";

  let formattedDueDate = invoice.dueDate;
  try {
    const d = new Date(invoice.dueDate);
    if (!Number.isNaN(d.getTime())) {
      formattedDueDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch {}

  const directPdfLink = pdfUrl || invoice.pdfUrl || "";
  const linkText = directPdfLink ? `\n📥 *Download PDF Invoice:* ${directPdfLink}\n` : "";

  const message = `📄 *Invoice ${invoice.invoiceNumber} — ${brandName}*
━━━━━━━━━━━━━━━━━━━━━
👤 *Billed To:* ${invoice.customerName}
💰 *Total Due:* ${sym}${Number(invoice.total).toLocaleString()}
📅 *Due Date:* ${formattedDueDate}
⏳ *Payment Terms:* ${invoice.paymentTerms}
${linkText}
Thank you for choosing ${brandName}. Please confirm receipt of your invoice.
━━━━━━━━━━━━━━━━━━━━━`;

  if (customerPhone?.trim()) {
    const normalized = normalizePhoneNumber(customerPhone).replace(/[^0-9]/g, "");
    if (normalized.length >= 7) {
      return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
    }
  }

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * 13. Export Invoices Ledger as CSV
 */
export async function exportInvoicesCSV(): Promise<{ count: number; filename: string }> {
  const csvData = await apiClient.get<string>("/invoices/export");
  const filename = `shopwus-invoices-${new Date().toISOString().split("T")[0]}.csv`;

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
