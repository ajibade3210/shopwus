"use client";

import { Loader2, Mail, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmModal, WhatsAppIcon } from "@/components/shared";
import { useCurrentStudio } from "@/hooks/use-current-studio";
import type { LeadMessageModalProps } from "@/types";

export function LeadMessageModal({
  isOpen,
  lead,
  onClose,
  onSendWhatsApp,
  onSendEmail,
}: LeadMessageModalProps) {
  const [messageText, setMessageText] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const { studioName } = useCurrentStudio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSendingEmail) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSendingEmail, onClose]);

  useEffect(() => {
    if (lead) {
      const studio = studioName || "our studio";
      setMessageText(
        `Dear ${lead.name},\n\nThank you for reaching out to ${studio} regarding your upcoming ${lead.service || "inquiry"}.\n\nWe would love to schedule a consultation to discuss your vision and curate a bespoke proposal.\n\nWarm regards,\n${studio} Team`
      );
    }
  }, [lead, studioName]);

  if (!isOpen || !lead) return null;

  const handleSendEmailClick = async () => {
    if (!lead.email?.trim() || isSendingEmail) return;
    setIsSendingEmail(true);
    try {
      await onSendEmail(lead, lead.email, lead.name, messageText);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border-hairline rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-popover space-y-5 relative max-h-[90vh] overflow-y-auto font-sans animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border-hairline">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
              Inquiry Follow-up
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight mt-0.5 font-sans">
              Message {lead.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted hover:text-on-surface hover:bg-surface-high transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lead Summary Card */}
        <div className="p-4 bg-surface-low border border-border-hairline rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-on-surface">{lead.name}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-high text-on-surface-variant">
              {lead.service || "General Inquiry"}
            </span>
          </div>
          {lead.budget && (
            <p className="text-muted">
              <strong className="text-on-surface">Budget:</strong> ₦
              {Number(lead.budget).toLocaleString()}
            </p>
          )}
          {lead.eventDate && (
            <p className="text-muted">
              <strong className="text-on-surface">Target Date:</strong> {lead.eventDate}
            </p>
          )}
          {lead.message && (
            <div className="p-2.5 bg-card border border-border-hairline rounded-xl text-on-surface-variant italic text-[11px]">
              &ldquo;{lead.message}&rdquo;
            </div>
          )}
        </div>

        {/* Contact Info Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              lead.phone
                ? "bg-card border-border-hairline text-on-surface"
                : "bg-surface-low border-border-hairline text-muted"
            }`}
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-[#15803d]" />
            <span>{lead.phone ? lead.phone : "No Phone (WhatsApp unavailable)"}</span>
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              lead.email
                ? "bg-card border-border-hairline text-on-surface"
                : "bg-surface-low border-border-hairline text-muted"
            }`}
          >
            <Mail size={12} />
            <span>{lead.email ? lead.email : "No Email (Email unavailable)"}</span>
          </span>
        </div>

        {/* Message Content */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1.5">
            Message Content *
          </label>
          <textarea
            rows={5}
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Type your bespoke message or consultation reply here..."
            className="w-full bg-surface-low border border-border-hairline rounded-2xl p-4 text-xs text-on-surface focus:outline-none focus:border-primary transition-all font-sans"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            disabled={!lead.phone?.trim() || isSendingEmail}
            onClick={() => onSendWhatsApp(lead, lead.phone || "", messageText)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              lead.phone?.trim() && !isSendingEmail
                ? "bg-[#15803d] hover:bg-[#166534] text-white shadow-xs cursor-pointer"
                : "bg-surface-high text-muted border border-border-hairline cursor-not-allowed opacity-60"
            }`}
            title={
              lead.phone?.trim()
                ? "Open in WhatsApp and mark as Contacted"
                : "Phone number required for WhatsApp"
            }
          >
            <WhatsAppIcon className="w-4 h-4 text-white" />
            <span>Send WhatsApp</span>
          </button>

          <button
            type="button"
            disabled={!lead.email?.trim() || isSendingEmail || !messageText.trim()}
            onClick={() => setShowEmailConfirm(true)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              lead.email?.trim() && !isSendingEmail && messageText.trim()
                ? "bg-primary hover:bg-primary-hover text-on-primary shadow-xs cursor-pointer"
                : "bg-surface-high text-muted border border-border-hairline cursor-not-allowed opacity-60"
            }`}
            title={lead.email?.trim() ? "Send via Email and mark as Contacted" : "Email required"}
          >
            {isSendingEmail ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Sending…</span>
              </>
            ) : (
              <>
                <Mail size={14} />
                <span>Send Email</span>
              </>
            )}
          </button>
        </div>

        <ConfirmModal
          isOpen={showEmailConfirm}
          onClose={() => setShowEmailConfirm(false)}
          onConfirm={async () => {
            setShowEmailConfirm(false);
            await handleSendEmailClick();
          }}
          title="Send Email Message"
          description={`Are you sure you want to send this message to ${lead.name} (${lead.email})?`}
          confirmLabel="Send Email"
          isLoading={isSendingEmail}
        />
      </div>
    </div>
  );
}
