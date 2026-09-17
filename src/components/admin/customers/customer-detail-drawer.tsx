"use client";

import { ChevronDown, FileText, MessageSquare, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import type { CustomerDetailDrawerProps, ServiceStatus } from "@/types";
import { formatMoney, formatStatusLabel } from "@/utils";

export function CustomerDetailDrawer({
  customer,
  customerInvoices,
  onClose,
  onEditCustomer,
  onToggleStatus,
  onOpenMessageModal,
  onOpenInvoiceModal,
  onOpenAddServiceModal,
  onConfirmResendInvoice,
  onDeleteDraftInvoice,
  onDeleteService,
  onUpdateServiceStatus,
}: CustomerDetailDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!customer) return null;

  const servicesList = customer.services || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose}>
      <aside
        className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-card border-l border-border-hairline shadow-2xl flex flex-col font-sans overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-border-hairline bg-surface-container-low flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                Customer details
              </span>
              <button
                type="button"
                onClick={() => onToggleStatus(customer.id, !customer.isActive)}
                title={`Click to mark as ${customer.isActive ? "Inactive" : "Active"}`}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  customer.isActive
                    ? "bg-tertiary-container text-on-tertiary-container border border-tertiary/20 hover:bg-tertiary-container/80"
                    : "bg-surface-container-high text-muted border border-border-hairline hover:bg-surface-container"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    customer.isActive ? "bg-tertiary" : "bg-outline"
                  }`}
                />
                <span>{customer.isActive ? "Active" : "Inactive"}</span>
              </button>
            </div>
            <h2 className="text-xl font-bold text-on-surface tracking-tight font-sans">
              {customer.name}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              {customer.email}
              {customer.phone ? ` · ${customer.phone}` : ""}
            </p>
            {customer.company && (
              <p className="text-xs text-muted mt-0.5 font-medium">{customer.company}</p>
            )}
          </div>

          <button
            type="button"
            className="p-1.5 text-muted hover:text-on-surface rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close customer details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Actions: Send Message & Customer Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={!customer.isActive}
              className={`inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-xs disabled:opacity-50 w-full ${
                !customer.isActive ? "cursor-not-allowed opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => {
                if (!customer.isActive) return;
                onOpenMessageModal(customer);
              }}
              title={customer.isActive ? "Send Message" : "Customer is inactive"}
            >
              <MessageSquare size={14} />
              <span>Send Message</span>
            </button>

            {onEditCustomer && (
              <button
                type="button"
                onClick={() => onEditCustomer(customer)}
                className="inline-flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-hairline px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer w-full"
                title="View customer profile, notes, and attributes"
              >
                <FileText size={14} />
                <span>Customer Profile</span>
              </button>
            )}
          </div>

          {/* Customer Attributes */}
          {customer.attributes && customer.attributes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  Customer Attributes
                </span>
                <span className="text-[10px] font-bold text-on-surface bg-surface-container-high border border-border-hairline px-2 py-0.5 rounded-md">
                  {customer.attributes.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {customer.attributes.map((attr, idx) => (
                  <div
                    key={`${attr.key}-${idx}`}
                    className="bg-surface-container-low border border-border-hairline rounded-xl p-2.5 flex flex-col gap-0.5 break-words"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted break-words">
                      {attr.key}
                    </span>
                    <span className="text-xs font-semibold text-on-surface break-words">
                      {attr.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoicing Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                Invoices & Billing
              </span>
              <button
                type="button"
                disabled={!customer.isActive}
                onClick={() => {
                  if (!customer.isActive) return;
                  onOpenInvoiceModal(customer);
                }}
                className={`inline-flex items-center justify-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-hairline px-3 py-1.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer disabled:opacity-50 ${
                  !customer.isActive ? "cursor-not-allowed opacity-50 pointer-events-none" : ""
                }`}
                title={customer.isActive ? "New Invoice" : "Customer is inactive"}
              >
                <Plus size={12} />
                <span>New Invoice</span>
              </button>
            </div>

            {customerInvoices.length > 0 ? (
              <div className="space-y-2 pt-1">
                {customerInvoices.map(inv => (
                  <div
                    key={inv.id}
                    className="bg-surface-container-low border border-border-hairline rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <b className="text-on-surface font-semibold">{inv.invoiceNumber}</b>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                            inv.status === "paid"
                              ? "bg-tertiary-container text-on-tertiary-container border-tertiary/20"
                              : inv.status === "sent"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted block mt-0.5">
                        {formatMoney(inv.total)} · Due {inv.dueDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Edit / View in Modal */}
                      <button
                        type="button"
                        onClick={() => onOpenInvoiceModal(customer, inv)}
                        className="inline-flex items-center justify-center px-3 py-1 bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-border-hairline rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs"
                      >
                        {inv.status === "draft" ? "Edit" : "View"}
                      </button>

                      {/* Resend button if sent */}
                      {inv.status === "sent" && (
                        <button
                          type="button"
                          disabled={!customer.isActive}
                          onClick={() => {
                            if (!customer.isActive) return;
                            onConfirmResendInvoice(inv);
                          }}
                          title={
                            customer.isActive ? "Resend invoice to customer" : "Customer is inactive"
                          }
                          className={`p-1.5 rounded-xl border transition-all ${
                            customer.isActive
                              ? "bg-surface-container-lowest hover:bg-surface-container text-on-surface border-border-hairline hover:shadow-xs cursor-pointer shadow-2xs"
                              : "bg-surface-container-high border-border-hairline text-outline cursor-not-allowed opacity-60"
                          }`}
                        >
                          <RefreshCw size={12} />
                        </button>
                      )}

                      {/* Delete button: ONLY IF DRAFT */}
                      {inv.status === "draft" && (
                        <button
                          type="button"
                          disabled={!customer.isActive}
                          onClick={() => {
                            if (!customer.isActive) return;
                            onDeleteDraftInvoice(inv.id);
                          }}
                          title={customer.isActive ? "Delete unsent draft" : "Customer is inactive"}
                          className={`p-1.5 rounded-xl border transition-all ${
                            customer.isActive
                              ? "bg-surface-container-lowest hover:bg-error/10 text-error border-border-hairline hover:border-error/20 hover:shadow-xs cursor-pointer shadow-2xs"
                              : "bg-surface-container-high border-border-hairline text-outline cursor-not-allowed opacity-60"
                          }`}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-outline py-2 italic">No invoices generated yet.</div>
            )}
          </div>

          {/* Services / Projects list */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  Services
                </span>
                <span className="text-[10px] font-bold text-on-surface bg-surface-container-high border border-border-hairline px-2 py-0.5 rounded-md">
                  {servicesList.length}
                </span>
              </div>
              <button
                type="button"
                disabled={!customer.isActive}
                onClick={() => {
                  if (!customer.isActive) return;
                  onOpenAddServiceModal();
                }}
                className={`inline-flex items-center justify-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-hairline px-3 py-1.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer disabled:opacity-50 ${
                  !customer.isActive ? "cursor-not-allowed opacity-50 pointer-events-none" : ""
                }`}
                title={customer.isActive ? "Add Service" : "Customer is inactive"}
              >
                <Plus size={12} />
                <span>Add Service</span>
              </button>
            </div>

            {servicesList.length > 0 ? (
              <div className="space-y-2.5 pt-1">
                {servicesList.map(service => (
                  <div
                    key={service.id}
                    className="group bg-surface-container-low hover:bg-surface-container/60 border border-border-hairline rounded-2xl p-3.5 transition-all shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-on-surface tracking-tight leading-snug truncate">
                          {service.name}
                        </h4>
                        <span className="text-[11px] text-muted block mt-0.5 truncate">
                          {service.service}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={!customer.isActive}
                        onClick={() => {
                          if (!customer.isActive) return;
                          onDeleteService(customer.id, service.id, service.name);
                        }}
                        title={customer.isActive ? "Delete service scope" : "Customer is inactive"}
                        className={`p-1.5 rounded-xl transition-all shrink-0 ${
                          customer.isActive
                            ? "text-outline hover:text-error hover:bg-error/10 cursor-pointer"
                            : "text-outline cursor-not-allowed opacity-40"
                        }`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-border-hairline">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                          Value:
                        </span>
                        <span className="text-xs font-bold text-on-surface tabular-nums">
                          {formatMoney(service.amount)}
                        </span>
                      </div>

                      <div className="relative inline-flex items-center shrink-0">
                        <select
                          disabled={!customer.isActive}
                          value={service.status}
                          onChange={e => {
                            if (!customer.isActive) return;
                            const nextStatus = e.target.value as ServiceStatus;
                            onUpdateServiceStatus(
                              customer.id,
                              service.id,
                              nextStatus,
                              service.name,
                              formatStatusLabel(nextStatus)
                            );
                          }}
                          className={`appearance-none pr-6 pl-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all focus:outline-hidden ${
                            !customer.isActive
                              ? "bg-surface-container-high text-outline border-border-hairline cursor-not-allowed opacity-60"
                              : service.status === "active"
                                ? "bg-tertiary-container text-on-tertiary-container border-tertiary/20 hover:bg-tertiary-container/80 cursor-pointer"
                                : service.status === "completed"
                                  ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 cursor-pointer"
                                  : service.status === "cancelled"
                                    ? "bg-error/10 text-error border-error/20 hover:bg-error/15 cursor-pointer"
                                    : "bg-surface-container-high text-on-surface border-border-hairline hover:bg-surface-container cursor-pointer"
                          }`}
                          title={
                            customer.isActive
                              ? "Click to switch service status"
                              : "Customer is inactive"
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown
                          size={11}
                          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-outline py-3 italic bg-surface-container-low rounded-xl text-center border border-dashed border-border-hairline">
                No services recorded yet.
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
