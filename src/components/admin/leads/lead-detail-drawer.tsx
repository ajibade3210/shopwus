import { FileText, MessageSquare, Trash2, UserCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { LeadDetailDrawerProps } from "@/types";
import { formatDate, formatMoney, formatStatusLabel } from "@/utils";
import { DeleteConfirmModal } from "../common/delete-confirm-modal";

export function LeadDetailDrawer({
  lead,
  isConverting,
  onClose,
  onOpenMessageModal,
  onConvertToCustomer,
  onIssueInvoice,
  onDeleteLead,
  isDeleting = false,
}: LeadDetailDrawerProps) {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isConfirmDeleteOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isConfirmDeleteOpen]);

  if (!lead) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="drawer-close"
          onClick={onClose}
          aria-label="Close inquiry details"
        >
          <X />
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <h2>{lead.name}</h2>
          {lead.isExistingCustomer && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
              Existing Customer
            </span>
          )}
        </div>
        <p className="drawer-email">
          {lead.email} · {lead.phone || "No phone provided"}
        </p>

        {/* Top Send Message Action */}
        <div className="pt-3 pb-1">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold w-full transition-all shadow-xs cursor-pointer"
            onClick={() => onOpenMessageModal(lead)}
          >
            <MessageSquare size={14} />
            <span>Send Message</span>
          </button>
        </div>

        <div className="detail-grid">
          <div>
            <span className="eyebrow">Primary service</span>
            <b>{lead.service}</b>
          </div>
          <div>
            <span className="eyebrow">Estimated date</span>
            <b>{formatDate(lead.eventDate)}</b>
          </div>
          <div>
            <span className="eyebrow">Budget</span>
            <b>{formatMoney(lead.budget || 0)}</b>
          </div>
          <div>
            <span className="eyebrow">Status</span>
            <div className="mt-1.5 flex items-center">
              <span className={`status ${lead.status}`}>{formatStatusLabel(lead.status)}</span>
            </div>
          </div>
        </div>

        {/* Services Scope List if multiple */}
        {lead.services && lead.services.length > 0 && (
          <div className="drawer-block">
            <span className="eyebrow">Requested Services ({lead.services.length})</span>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {lead.services.map(svc => (
                <span
                  key={svc}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#faf8f5] border border-[#ded7cb] text-[#191c1d]"
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>
        )}

        <blockquote>{lead.message}</blockquote>

        <div className="drawer-actions space-y-2">
          {/* Convert / Add to Customer */}
          <button
            type="button"
            disabled={isConverting}
            className="dark-button bg-[#111827] hover:bg-black border-[#111827] w-full justify-center disabled:opacity-50"
            onClick={() => onConvertToCustomer(lead.id)}
          >
            <UserCheck size={14} />
            <span>
              {isConverting
                ? lead.isExistingCustomer
                  ? "Adding Service..."
                  : "Converting..."
                : lead.isExistingCustomer
                  ? "Add Service to Customer"
                  : "Convert to Customer"}
            </span>
          </button>

          {/* Issue Invoice */}
          <button
            type="button"
            className="outline-button w-full justify-center"
            onClick={() => onIssueInvoice(lead)}
          >
            <FileText size={14} />
            <span>Issue Invoice</span>
          </button>

          {/* Delete Lead */}
          {onDeleteLead && (
            <div className="pt-3 border-t border-border-hairline">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(true)}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-semibold text-error hover:bg-error-container/20 border border-error/20 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={13} />
                <span>Delete Lead</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      <DeleteConfirmModal
        isOpen={isConfirmDeleteOpen}
        title="Delete Lead Inquiry"
        description={`Are you sure you want to delete the lead inquiry from "${lead.name}"? This action cannot be undone.`}
        confirmLabel="Delete Lead"
        isDeleting={isDeleting}
        onConfirm={async () => {
          if (onDeleteLead) {
            await onDeleteLead(lead.id);
            setIsConfirmDeleteOpen(false);
          }
        }}
        onClose={() => setIsConfirmDeleteOpen(false)}
      />
    </div>
  );
}
