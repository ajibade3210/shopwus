import { Send, X } from "lucide-react";
import {
  BUSINESS_TYPE_CTA_MAP,
  BUSINESS_TYPE_DATE_LABEL,
  BUSINESS_TYPE_ITEM_LABEL,
  BUSINESS_TYPE_MESSAGE_PLACEHOLDER,
  BUSINESS_TYPE_MODAL_EYEBROW,
  BUSINESS_TYPE_MODAL_SUBTITLE,
  BUSINESS_TYPE_SUBMIT_LABEL,
  DEFAULT_BUSINESS_TYPE,
} from "@/constants";
import type { ConsultationModalProps } from "@/types";

export function ConsultationModal({
  isOpen,
  onClose,
  profile,
  quoteForm,
  setQuoteForm,
  quoteSubmitting,
  onSubmit,
  primaryColor,
  buttonColor,
  radiusClass,
}: ConsultationModalProps) {
  if (!isOpen) return null;

  const type = profile.businessType ?? DEFAULT_BUSINESS_TYPE;
  const ctaLabel = BUSINESS_TYPE_CTA_MAP[type];
  const eyebrow = BUSINESS_TYPE_MODAL_EYEBROW[type];
  const subtitle = BUSINESS_TYPE_MODAL_SUBTITLE[type];
  const itemLabel = BUSINESS_TYPE_ITEM_LABEL[type];
  const dateLabel = BUSINESS_TYPE_DATE_LABEL[type];
  const messagePlaceholder = BUSINESS_TYPE_MESSAGE_PLACEHOLDER[type];
  const submitLabel = BUSINESS_TYPE_SUBMIT_LABEL[type];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border-hairline rounded-3xl max-w-lg w-full p-8 shadow-popover relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-outline hover:text-on-surface p-1 cursor-pointer transition-colors"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <span
            style={{ color: primaryColor }}
            className="text-[10px] uppercase tracking-[0.18em] font-semibold"
          >
            {eyebrow}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-on-surface font-normal mt-1">
            {ctaLabel}
          </h3>
          <p className="text-xs text-outline mt-1">
            Tell {profile.businessName} {subtitle}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-on-surface-variant font-medium mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Folashade Adeleke"
              value={quoteForm.name}
              onChange={e => setQuoteForm({ ...quoteForm, name: e.target.value })}
              className="w-full bg-surface-lowest border border-border-hairline rounded-lg px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-medium mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="folashade@example.com"
                value={quoteForm.email}
                onChange={e => setQuoteForm({ ...quoteForm, email: e.target.value })}
                className="w-full bg-surface-lowest border border-border-hairline rounded-lg px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-on-surface-variant font-medium mb-1">WhatsApp</label>
              <input
                type="tel"
                placeholder="+234 800 000 0000"
                value={quoteForm.phone}
                onChange={e => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                className="w-full bg-surface-lowest border border-border-hairline rounded-lg px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant font-medium mb-1">{itemLabel}</label>
              <select
                value={quoteForm.service}
                onChange={e => setQuoteForm({ ...quoteForm, service: e.target.value })}
                className="w-full bg-surface-lowest border border-border-hairline rounded-lg px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary"
              >
                {(profile.services || []).map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-on-surface-variant font-medium mb-1">{dateLabel}</label>
              <input
                type="date"
                value={quoteForm.eventDate}
                onChange={e => setQuoteForm({ ...quoteForm, eventDate: e.target.value })}
                className="w-full bg-surface-lowest border border-border-hairline rounded-lg px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-on-surface-variant font-medium mb-1">Details</label>
            <textarea
              rows={3}
              placeholder={messagePlaceholder}
              value={quoteForm.message}
              onChange={e => setQuoteForm({ ...quoteForm, message: e.target.value })}
              className="w-full bg-surface-lowest border border-border-hairline rounded-lg p-3.5 text-xs text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={quoteSubmitting}
              style={{ backgroundColor: buttonColor }}
              className={`w-full text-white text-xs font-medium py-3.5 shadow-sm hover:brightness-95 transition-all cursor-pointer flex items-center justify-center gap-2 ${radiusClass}`}
            >
              {quoteSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <span>{submitLabel}</span>
                  <Send size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
