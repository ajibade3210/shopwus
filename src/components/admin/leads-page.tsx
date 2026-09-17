"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { APP_CONFIG } from "@/constants";
import { useCurrentStudio } from "@/hooks/use-current-studio";
import { useLeads } from "@/hooks/use-leads";
import { getInvoices } from "@/lib/api";
import { sendLeadMessage } from "@/services/api";
import type { Customer, Invoice, Lead, LeadsPageProps } from "@/types";
import { normalizePhoneNumber } from "@/utils";
import { Metric, PageTitle, useAdminToast } from "./admin-layout";
import { InvoiceModal } from "./invoices/invoice-modal";
import { LeadDetailDrawer } from "./leads/lead-detail-drawer";
import { LeadMessageModal } from "./leads/lead-message-modal";
import { LeadTable } from "./leads/lead-table";

export function LeadsPage({ onToast }: LeadsPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;
  const { studioName } = useCurrentStudio();

  const {
    items,
    setSelectedLeadId,
    selectedLead,
    searchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    paginatedItems,
    isExporting,
    isConverting,
    metrics,
    statusFilter,
    handleStatusFilterChange,
    handleSearch,
    handleExport,
    handleConvertToCustomer,
    handleUpdateStatus,
  } = useLeads(notify);

  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceCustomer, setInvoiceCustomer] = useState<Customer | undefined>(undefined);
  const [invoiceModalInvoice, setInvoiceModalInvoice] = useState<Invoice | undefined>(undefined);

  const handleIssueInvoice = async (lead: Lead) => {
    const allInvoices = await getInvoices();
    const existing = allInvoices.find(
      inv => inv.customerId === lead.id || inv.customerEmail === lead.email
    );

    const tempCustomer: Customer = {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: "",
      totalRevenue: lead.budget || APP_CONFIG.defaultLeadBudget,
      services: [
        {
          id: `svc-${Date.now()}`,
          customerId: lead.id,
          name: lead.service ? `${lead.service} Production` : lead.service || "",
          service: lead.service || "",
          amount: lead.budget || APP_CONFIG.defaultLeadBudget,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ],
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setInvoiceCustomer(tempCustomer);
    setInvoiceModalInvoice(existing);
    setShowInvoiceModal(true);

    if (lead.status === "new") {
      handleUpdateStatus(lead.id, "contacted");
    }
  };

  const handleSendWhatsAppMessage = async (lead: Lead, phone: string, text: string) => {
    const normalized = normalizePhoneNumber(phone).replace(/[^0-9]/g, "");
    const waUrl = normalized
      ? `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
    setShowSendMessageModal(false);
    await handleUpdateStatus(lead.id, "contacted");
    notify("Message prepared via WhatsApp. Lead status updated to Contacted.");
  };

  const handleSendEmailMessage = async (lead: Lead, email: string, name: string, text: string) => {
    try {
      const studio = studioName || "Our Studio";
      const subject = `${studio} · Consultation for ${name}`;
      await sendLeadMessage(lead.id, { message: text, subject });
      setShowSendMessageModal(false);
      await handleUpdateStatus(lead.id, "contacted");
      notify(`Consultation message sent to ${email} with your business header.`);
    } catch {
      notify("Failed to dispatch consultation email. Please try again.");
    }
  };

  const actions = (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-card hover:bg-surface-low text-on-surface border border-border-hairline hover:border-outline px-4 py-2 sm:py-2.5 rounded-md text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
    >
      <Download
        size={13}
        className={isExporting ? "animate-bounce text-primary" : "text-primary"}
      />
      <span>{isExporting ? "Exporting..." : "Export"}</span>
    </button>
  );

  return (
    <section className="content">
      <PageTitle title="Leads & Inquiries" action={actions} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-7">
        <Metric label="Total leads" value={String(metrics.total)} detail="All time" />
        <Metric label="New today" value={String(metrics.newToday)} detail="Needs attention" />
        <Metric label="Conversion rate" value={`${metrics.conversion}%`} detail="Last 30 days" />
      </div>

      <LeadTable
        items={items}
        paginatedItems={paginatedItems}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onSelectLead={setSelectedLeadId}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        startIndex={startIndex}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <LeadDetailDrawer
        lead={selectedLead}
        isConverting={isConverting}
        onClose={() => setSelectedLeadId(null)}
        onOpenMessageModal={() => setShowSendMessageModal(true)}
        onConvertToCustomer={handleConvertToCustomer}
        onIssueInvoice={handleIssueInvoice}
      />

      <LeadMessageModal
        isOpen={showSendMessageModal}
        lead={selectedLead}
        onClose={() => setShowSendMessageModal(false)}
        onSendWhatsApp={handleSendWhatsAppMessage}
        onSendEmail={handleSendEmailMessage}
      />

      {showInvoiceModal && invoiceCustomer && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setInvoiceCustomer(undefined);
            setInvoiceModalInvoice(undefined);
          }}
          onToast={notify}
          initialCustomer={invoiceCustomer}
          existingInvoice={invoiceModalInvoice}
        />
      )}
    </section>
  );
}
