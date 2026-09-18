"use client";

import { Download, MessageSquare, MoreHorizontal, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { useCustomers } from "@/hooks/use-customers";
import type { Customer, CustomersPageProps, Invoice } from "@/types";
import { formatMoney, Metric, PageTitle, useAdminToast } from "./admin-layout";
import { DeleteConfirmModal } from "./common/delete-confirm-modal";
import { CustomerAddModal } from "./customers/customer-add-modal";
import { CustomerBroadcastModal } from "./customers/customer-broadcast-modal";
import { CustomerDetailDrawer } from "./customers/customer-detail-drawer";
import { CustomerImportModal } from "./customers/customer-import-modal";
import { CustomerMessageModal } from "./customers/customer-message-modal";
import { CustomerResendInvoiceModal } from "./customers/customer-resend-invoice-modal";
import { CustomerServiceModal } from "./customers/customer-service-modal";
import { CustomerTable } from "./customers/customer-table";
import { InvoiceModal } from "./invoices/invoice-modal";

export function CustomersPage({ onToast }: CustomersPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;

  const {
    items,
    selectedCustomer,
    customerInvoices,
    setSelectedCustomerId,
    searchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    paginatedItems,
    totalCustomers,
    totalRevenue,
    activeServicesCount,
    isExporting,
    isSubmitting,
    handleSearch,
    reloadCustomers,
    handleExport,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleAddService,
    handleDeleteService,
    handleUpdateServiceStatus,
    handleToggleCustomerStatus,
    handleResendInvoice,
    handleDeleteDraftInvoice,
    handleDeleteCustomer,
    isDeletingCustomer,
    handleBulkDeleteCustomers,
  } = useCustomers(notify);

  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [confirmResendInvoice, setConfirmResendInvoice] = useState<Invoice | null>(null);

  // Selection helpers
  const activeCustomers = items.filter(c => c.isActive);

  const handleToggleSelectCustomer = (id: string) => {
    setSelectedCustomerIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllActiveCustomers = () => {
    const allActiveSelected =
      activeCustomers.length > 0 && activeCustomers.every(c => selectedCustomerIds.includes(c.id));

    if (allActiveSelected) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(activeCustomers.map(c => c.id));
    }
  };

  const handleClearCustomerSelection = () => {
    setSelectedCustomerIds([]);
  };

  const handleBulkDeleteSelected = async () => {
    if (selectedCustomerIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      await handleBulkDeleteCustomers(selectedCustomerIds);
      setSelectedCustomerIds([]);
    } finally {
      setIsBulkDeleting(false);
      setShowBulkDeleteConfirm(false);
    }
  };

  const handleOpenBroadcastModal = () => {
    setShowBroadcastModal(true);
  };

  // Customers targeted by broadcast
  const broadcastTargetCustomers = items.filter(
    c => selectedCustomerIds.includes(c.id) && c.isActive
  );

  // Invoice Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceModalCustomer, setInvoiceModalCustomer] = useState<Customer | undefined>(undefined);
  const [invoiceModalInvoice, setInvoiceModalInvoice] = useState<Invoice | undefined>(undefined);

  const handleOpenInvoiceModalForCustomer = (customer: Customer, existing?: Invoice) => {
    setInvoiceModalCustomer(customer);
    setInvoiceModalInvoice(existing);
    setShowInvoiceModal(true);
  };

  const actions = (
    <div className="flex items-center gap-2 sm:gap-2.5">
      <button
        type="button"
        onClick={() => {
          setCustomerToEdit(null);
          setShowAddModal(true);
        }}
        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-primary hover:bg-primary-hover text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
      >
        <Plus size={14} />
        <span>Add</span>
      </button>

      {/* More Actions Menu Button & Dropdown */}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setShowMoreMenu(prev => !prev)}
          className="inline-flex items-center justify-center p-2 sm:p-2.5 bg-card hover:bg-surface-low text-on-surface border border-border-hairline rounded-md text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
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
                  handleOpenBroadcastModal();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-on-surface hover:bg-surface-low hover:text-primary transition-colors cursor-pointer text-left"
              >
                <MessageSquare size={14} className="text-primary" />
                <span>Broadcast</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  setShowImportModal(true);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-on-surface hover:bg-surface-low transition-colors text-left font-medium cursor-pointer"
              >
                <Upload size={14} className="text-primary" />
                <span>Import</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  handleExport();
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
      <PageTitle title="Customers" action={actions} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-7">
        <Metric
          label="Total customers"
          value={String(totalCustomers)}
          detail="Active relationships"
        />
        <Metric label="Active services" value={String(activeServicesCount)} detail="In progress" />
        <Metric label="Revenue" value={formatMoney(totalRevenue)} detail="Across all services" />
      </div>

      <CustomerTable
        items={items}
        paginatedItems={paginatedItems}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onSelectCustomer={setSelectedCustomerId}
        selectedCustomerIds={selectedCustomerIds}
        onToggleSelect={handleToggleSelectCustomer}
        onSelectAllActive={handleSelectAllActiveCustomers}
        onClearSelection={handleClearCustomerSelection}
        onOpenBroadcast={handleOpenBroadcastModal}
        onDeleteSelected={async () => setShowBulkDeleteConfirm(true)}
        isDeletingBulk={isBulkDeleting}
        onDeleteCustomer={setCustomerToDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        startIndex={startIndex}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <CustomerDetailDrawer
        customer={selectedCustomer}
        customerInvoices={customerInvoices}
        onClose={() => setSelectedCustomerId(null)}
        onEditCustomer={cust => {
          setCustomerToEdit(cust);
          setShowAddModal(true);
        }}
        onToggleStatus={handleToggleCustomerStatus}
        onOpenMessageModal={() => setShowSendMessageModal(true)}
        onOpenInvoiceModal={handleOpenInvoiceModalForCustomer}
        onOpenAddServiceModal={() => setShowAddServiceModal(true)}
        onConfirmResendInvoice={setConfirmResendInvoice}
        onDeleteDraftInvoice={handleDeleteDraftInvoice}
        onDeleteService={handleDeleteService}
        onDeleteCustomer={async customerId => {
          await handleDeleteCustomer(customerId);
          setSelectedCustomerIds(prev => prev.filter(id => id !== customerId));
        }}
        isDeletingCustomer={isDeletingCustomer}
        onUpdateServiceStatus={handleUpdateServiceStatus}
      />

      <CustomerAddModal
        key={customerToEdit?.id ?? "new"}
        isOpen={showAddModal}
        isSubmitting={isSubmitting}
        initialCustomer={customerToEdit}
        onClose={() => {
          setShowAddModal(false);
          setCustomerToEdit(null);
        }}
        onSubmit={
          customerToEdit
            ? data => handleUpdateCustomer(customerToEdit.id, data)
            : handleCreateCustomer
        }
      />

      <CustomerBroadcastModal
        isOpen={showBroadcastModal}
        selectedCustomers={broadcastTargetCustomers}
        onClose={() => setShowBroadcastModal(false)}
        onToast={notify}
      />

      <CustomerServiceModal
        isOpen={showAddServiceModal}
        customer={selectedCustomer}
        onClose={() => setShowAddServiceModal(false)}
        onSubmit={handleAddService}
      />

      <CustomerMessageModal
        isOpen={showSendMessageModal}
        customer={selectedCustomer}
        onClose={() => setShowSendMessageModal(false)}
        onToast={notify}
      />

      <CustomerResendInvoiceModal
        invoice={confirmResendInvoice}
        onClose={() => setConfirmResendInvoice(null)}
        onConfirm={handleResendInvoice}
      />

      {showInvoiceModal && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setInvoiceModalCustomer(undefined);
            setInvoiceModalInvoice(undefined);
          }}
          onToast={notify}
          onInvoiceSaved={() => {
            reloadCustomers();
          }}
          initialCustomer={invoiceModalCustomer}
          existingInvoice={invoiceModalInvoice}
          allCustomers={items}
        />
      )}

      <CustomerImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onToast={notify}
        onImportSuccess={reloadCustomers}
      />

      <DeleteConfirmModal
        isOpen={Boolean(customerToDelete)}
        title={`Delete customer "${customerToDelete?.name}"?`}
        description={`Are you sure you want to delete customer '${customerToDelete?.name}'? Past orders and invoices will remain intact in your financial records, but will no longer be linked to this customer profile.`}
        confirmLabel="Delete customer"
        isDeleting={isDeletingCustomer}
        onConfirm={async () => {
          if (!customerToDelete) return;
          await handleDeleteCustomer(customerToDelete.id);
          setSelectedCustomerIds(prev => prev.filter(id => id !== customerToDelete.id));
          setCustomerToDelete(null);
        }}
        onClose={() => setCustomerToDelete(null)}
      />

      <DeleteConfirmModal
        isOpen={showBulkDeleteConfirm}
        title={`Delete ${selectedCustomerIds.length} customer${selectedCustomerIds.length > 1 ? "s" : ""}?`}
        description={`This will permanently remove ${selectedCustomerIds.length} customer profile${selectedCustomerIds.length > 1 ? "s" : ""}. Past orders and invoices will remain in your records but will no longer be linked to a customer. This action cannot be undone.`}
        confirmLabel="Delete customers"
        isDeleting={isBulkDeleting}
        onConfirm={handleBulkDeleteSelected}
        onClose={() => setShowBulkDeleteConfirm(false)}
      />
    </section>
  );
}
