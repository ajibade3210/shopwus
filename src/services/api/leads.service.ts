import { APP_CONFIG } from "@/constants";
import { apiClient } from "@/lib/api-client";
import { CreateLeadInputSchema } from "@/lib/schemas";
import type {
  CreateLeadInput,
  Customer,
  Lead,
  LeadFilterStatus,
  LeadStatus,
  LeadsSummary,
  PublicInquiryInput,
  PublicInquiryResponse,
} from "@/types";

/**
 * Submits a new consultation / booking / quotation inquiry from the public storefront
 */
export async function submitPublicInquiry(
  slug: string,
  input: PublicInquiryInput
): Promise<PublicInquiryResponse> {
  return apiClient.post<PublicInquiryResponse>(`/leads/inquiry/${encodeURIComponent(slug)}`, input);
}

export const submitConsultationInquiry = submitPublicInquiry;

/**
 * Creates a new lead manually in the admin dashboard
 */
export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const validated = CreateLeadInputSchema.parse(input);
  return apiClient.post<Lead>("/leads", validated);
}

/**
 * Fetches all studio leads with optional search query and status filter
 */
export async function getLeads(query?: string, status?: LeadFilterStatus): Promise<Lead[]> {
  const response = await apiClient.get<Lead[] | { items?: Lead[]; leads?: Lead[]; data?: Lead[] }>(
    "/leads",
    {
      q: query,
      status: status === "all" ? undefined : status,
    }
  );
  if (Array.isArray(response)) return response;
  return response?.items || response?.leads || response?.data || [];
}

export async function getLeadsSummary(): Promise<LeadsSummary> {
  return apiClient.get<LeadsSummary>("/leads/summary");
}

/**
 * Retrieves a single lead by ID
 */
export async function getLeadById(id: string): Promise<Lead> {
  return apiClient.get<Lead>(`/leads/${encodeURIComponent(id)}`);
}

/**
 * Updates a lead workflow status
 */
export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  return apiClient.patch<Lead>(`/leads/${encodeURIComponent(id)}/status`, {
    status,
  });
}

/**
 * 1-Click Convert Lead to Customer & Prepare Initial Service Scope
 */
export async function convertLeadToCustomer(
  leadId: string,
  options: {
    serviceName?: string;
    service?: string;
    amount?: number | string;
    createDraftInvoice?: boolean;
  } = {}
): Promise<{ customer: Customer; lead: Lead }> {
  return apiClient.post<{ customer: Customer; lead: Lead }>(
    `/leads/${encodeURIComponent(leadId)}/convert`,
    options
  );
}

/**
 * Deletes a lead
 */
export async function deleteLead(id: string): Promise<{ success: boolean; id: string }> {
  return apiClient.delete(`/leads/${encodeURIComponent(id)}`);
}

/**
 * Sends a consultation/follow-up email message to a lead from backend with Business Email Header
 */
export async function sendLeadMessage(
  id: string,
  payload: { message: string; subject?: string }
): Promise<{ success: boolean; lead: Lead }> {
  return apiClient.post<{ success: boolean; lead: Lead }>(
    `/leads/${encodeURIComponent(id)}/message`,
    payload
  );
}

/**
 * Generates pre-formatted WhatsApp brief for direct client-to-studio routing
 */
export function createWhatsAppConsultationUrl(params: {
  studioPhone?: string;
  studioName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  service: string;
  eventDate?: string;
  budget?: number | string;
  message?: string;
}): string {
  const defaultPhone = APP_CONFIG.defaultStudioPhone.replace(/[^0-9]/g, "");
  const appName = APP_CONFIG.name;

  const rawPhone = (params.studioPhone || defaultPhone).replace(/[^0-9]/g, "");
  const targetPhone = rawPhone.length >= 7 ? rawPhone : defaultPhone;

  const budgetDisplay = params.budget
    ? `₦${Number(params.budget).toLocaleString()}`
    : "Custom / To be discussed";

  const brief = `✨ *New Consultation Inquiry — ${appName}*
━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${params.clientName}
📱 *Phone:* ${params.clientPhone || "Not provided"}
✉️ *Email:* ${params.clientEmail}
🛎️ *Service Requested:* ${params.service}
📅 *Estimated Date:* ${params.eventDate || "Flexible"}
💰 *Target Budget:* ${budgetDisplay}

💬 *Event Vision & Details:*
${params.message || `Consultation requested via ${appName} studio profile.`}
━━━━━━━━━━━━━━━━━━━━━
_Sent via ${params.studioName} on ${appName}_`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(brief)}`;
}

/**
 * Export Leads List as CSV
 */
export async function exportLeadsCSV(): Promise<{ count: number; filename: string }> {
  const csvData = await apiClient.get<string>("/leads/export");
  const filename = `shopwus-leads-${new Date().toISOString().split("T")[0]}.csv`;

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
