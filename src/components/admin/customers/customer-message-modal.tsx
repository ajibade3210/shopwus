import { Mail, X } from "lucide-react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/shared";
import type { CustomerMessageModalProps } from "@/types";

export function CustomerMessageModal({
  isOpen,
  customer,
  onClose,
  onToast,
}: CustomerMessageModalProps) {
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (customer) {
      setMessageText(
        `Dear ${customer.name},\n\nThank you for choosing Élan Atelier. We would love to follow up on your project details and ensure everything is progressing flawlessly.\n\nWarm regards,\nÉlan Atelier Team`
      );
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const handleSendWhatsAppMessage = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
    onClose();
    onToast?.("WhatsApp consultation message prepared and opened.");
  };

  const handleSendEmailMessage = (email: string, name: string, text: string) => {
    const subject = encodeURIComponent(`Élan Atelier · Update for ${name}`);
    const body = encodeURIComponent(text);
    if (typeof window !== "undefined") {
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
    onClose();
    onToast?.(`Email dispatched to ${email}.`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border-hairline rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-popover space-y-5 relative max-h-[90vh] overflow-y-auto font-sans"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-border-hairline">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
              Client Communication
            </span>
            <h3 className="text-xl font-sans font-bold text-on-surface tracking-tight mt-0.5">
              Send Message
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Recipient: <b className="text-on-surface">{customer.name}</b>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-muted hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium border ${
              customer.phone
                ? "bg-tertiary-container text-on-tertiary-container border-tertiary/20"
                : "bg-surface-container-high text-outline border-border-hairline"
            }`}
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>{customer.phone ? customer.phone : "No Phone (WhatsApp unavailable)"}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium border ${
              customer.email
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-surface-container-high text-outline border-border-hairline"
            }`}
          >
            <Mail size={12} />
            <span>{customer.email ? customer.email : "No Email (Email unavailable)"}</span>
          </span>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1.5">
            Message Content *
          </label>
          <textarea
            rows={5}
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Type your bespoke message or client update here..."
            className="w-full bg-surface-container-lowest border border-border-hairline rounded-2xl p-4 text-xs text-on-surface focus:outline-hidden focus:border-primary transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            disabled={!customer.phone?.trim()}
            onClick={() => handleSendWhatsAppMessage(customer.phone || "", messageText)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              customer.phone?.trim()
                ? "bg-tertiary hover:bg-tertiary-dim text-on-tertiary shadow-xs cursor-pointer"
                : "bg-surface-container-high text-outline border border-border-hairline cursor-not-allowed opacity-60"
            }`}
          >
            <WhatsAppIcon className="w-4 h-4 text-on-tertiary" />
            <span>{customer.phone?.trim() ? "Send via WhatsApp" : "WhatsApp (No phone)"}</span>
          </button>

          <button
            type="button"
            disabled={!customer.email?.trim()}
            onClick={() => handleSendEmailMessage(customer.email, customer.name, messageText)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              customer.email?.trim()
                ? "bg-primary hover:bg-primary-hover text-white shadow-xs cursor-pointer"
                : "bg-surface-container-high text-outline border border-border-hairline cursor-not-allowed opacity-60"
            }`}
          >
            <Mail size={14} />
            <span>{customer.email?.trim() ? "Send via Email" : "Email (No email)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
