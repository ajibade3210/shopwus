"use client";

import { Download, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { INVOICE_PAGE_CONFIG } from "@/constants";
import { useInvoices } from "@/hooks";
import { useDeleteInvoiceMutation } from "@/hooks/queries";
import type { Invoice, InvoicesPageProps } from "@/types";
import { formatMoney, Metric, PageTitle, useAdminToast } from "./admin-layout";
import { DeleteConfirmModal } from "./common/delete-confirm-modal";
import { InvoiceModal } from "./invoices/invoice-modal";
import { InvoiceTable } from "./invoices/invoice-table";

export function InvoicesPage({ onToast }: InvoicesPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const deleteInvoiceMutation = useDeleteInvoiceMutation();

  const {
    invoices,
    paginatedItems,
    searchQuery,
    statusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    metrics,
    isExporting,
    selectedInvoice,
    isModalOpen,
    handleSearch,
    handleStatusFilter,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleMarkPaid,
    handleMarkUnpaid,
    handleExportCSV,
    reloadInvoices,
  } = useInvoices(notify);

  const actions = (
    <div className="flex items-center gap-2 sm:gap-2.5 font-sans">
      <button
        type="button"
        onClick={handleOpenCreate}
        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 sm:py-2.5 rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
      >
        <Plus size={14} />
        <span>Add</span>
      </button>

      {/* More Actions Menu Button & Dropdown */}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setShowMoreMenu(prev => !prev)}
          className="inline-flex items-center justify-center p-2 sm:p-2.5 bg-card hover:bg-surface-low text-on-surface border border-border-hairline hover:border-border-subtle rounded-md transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
          title="More actions"
          aria-label="More actions"
        >
          <MoreHorizontal size={14} />
        </button>

        {showMoreMenu && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setShowMoreMenu(false)} />
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-card border border-border-hairline rounded-xl shadow-popover z-30 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  handleExportCSV();
                }}
                disabled={isExporting}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-on-surface hover:bg-surface-low transition-colors text-left font-medium cursor-pointer disabled:opacity-50"
              >
                <Download
                  size={14}
                  className={`text-primary ${isExporting ? "animate-bounce" : ""}`}
                />
                <span>{isExporting ? "Exporting..." : "Export"}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <section className="content">
      <PageTitle title={INVOICE_PAGE_CONFIG.title} action={actions} />

      {/* Top Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-7">
        <Metric
          label={INVOICE_PAGE_CONFIG.metricLabels.totalInvoiced}
          value={formatMoney(metrics.totalInvoiced)}
          detail={`${metrics.totalCount} ${metrics.totalCount === 1 ? "invoice" : "invoices"} total`}
        />
        <Metric
          label={INVOICE_PAGE_CONFIG.metricLabels.paidRevenue}
          value={formatMoney(metrics.paidRevenue)}
          detail={`${metrics.paidCount} settled (${metrics.collectionRate}% collected)`}
        />
        <Metric
          label={INVOICE_PAGE_CONFIG.metricLabels.outstandingRevenue}
          value={formatMoney(metrics.outstandingRevenue)}
          detail={
            metrics.outstandingRevenue > 0
              ? `${metrics.totalCount - metrics.paidCount} pending collection`
              : INVOICE_PAGE_CONFIG.metricDetails.outstandingRevenue
          }
        />
      </div>

      {/* Unified Invoices Table matching Leads, Customers, and Expenses */}
      <InvoiceTable
        items={invoices}
        paginatedItems={paginatedItems}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearch={handleSearch}
        onStatusFilterChange={handleStatusFilter}
        onSelectInvoice={handleOpenEdit}
        onMarkPaid={handleMarkPaid}
        onMarkUnpaid={handleMarkUnpaid}
        onDeleteDraft={setInvoiceToDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        startIndex={startIndex}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Multi-Currency & Full Editing Invoice Modal */}
      {isModalOpen && (
        <InvoiceModal
          isOpen={isModalOpen}
          existingInvoice={selectedInvoice}
          onClose={handleCloseModal}
          onToast={notify}
          onInvoiceSaved={() => {
            reloadInvoices();
          }}
        />
      )}

      <DeleteConfirmModal
        isOpen={Boolean(invoiceToDelete)}
        title={`Delete draft invoice ${invoiceToDelete?.invoiceNumber || ""}?`}
        description="This draft invoice will be permanently removed from your register. This action cannot be undone."
        confirmLabel="Delete draft"
        isDeleting={deleteInvoiceMutation.isPending}
        onConfirm={async () => {
          if (!invoiceToDelete) return;
          try {
            await deleteInvoiceMutation.mutateAsync(invoiceToDelete.id);
            notify(`Draft invoice ${invoiceToDelete.invoiceNumber} deleted.`);
            setInvoiceToDelete(null);
          } catch {
            notify("Failed to delete draft invoice.");
          }
        }}
        onClose={() => setInvoiceToDelete(null)}
      />
    </section>
  );
}
