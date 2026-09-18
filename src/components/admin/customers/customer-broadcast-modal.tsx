import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Image as ImageIcon,
  Mail,
  Send,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/shared";
import {
  BROADCAST_LIMITS,
  createEmailBroadcastMailto,
  createWhatsAppBroadcastUrl,
  createWhatsAppDirectUrl,
  sendBroadcast,
} from "@/services/api/broadcast.service";
import type { BroadcastChannel, CustomerBroadcastModalProps } from "@/types";

export function CustomerBroadcastModal({
  isOpen,
  selectedCustomers,
  onClose,
  onToast,
}: CustomerBroadcastModalProps) {
  const [channel, setChannel] = useState<BroadcastChannel>("whatsapp");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const totalCount = selectedCustomers.length;
  const withPhone = selectedCustomers.filter(c => c.phone && c.phone.trim().length > 0);
  const withEmail = selectedCustomers.filter(c => c.email && c.email.trim().length > 0);

  const maxLength =
    channel === "email"
      ? BROADCAST_LIMITS.EMAIL_MAX_LENGTH
      : channel === "whatsapp"
        ? BROADCAST_LIMITS.WHATSAPP_MAX_LENGTH
        : BROADCAST_LIMITS.BOTH_MAX_LENGTH;

  useEffect(() => {
    if (isOpen) {
      setSubject("Exclusive Studio Update · Élan Atelier");
      setMessage(
        "Dear Esteemed Client,\n\nWe are pleased to share our latest seasonal atelier updates and upcoming event milestones.\n\nWarm regards,\nÉlan Atelier Team"
      );
      setImageUrl("");
      setShowQueue(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const remainingChars = maxLength - message.length;
  const isOverLimit = remainingChars < 0;

  const handleExecuteBroadcast = async () => {
    if (totalCount === 0) {
      onToast?.("Please select at least one customer to broadcast to.");
      return;
    }

    if (!message.trim()) {
      onToast?.("Please compose a message before broadcasting.");
      return;
    }

    if (isOverLimit) {
      onToast?.(`Message exceeds the ${maxLength} character limit for ${channel}.`);
      return;
    }

    if ((channel === "email" || channel === "both") && !subject.trim()) {
      onToast?.("Please provide a subject line for email delivery.");
      return;
    }

    try {
      setIsSubmitting(true);

      await sendBroadcast({
        channel,
        customerIds: selectedCustomers.map(c => c.id),
        message: message.trim(),
        subject: subject.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });

      if (channel === "whatsapp" || channel === "both") {
        const waUrl = createWhatsAppBroadcastUrl(message.trim(), imageUrl.trim() || undefined);
        if (typeof window !== "undefined") {
          window.open(waUrl, "_blank");
        }
      }

      if (channel === "email" || channel === "both") {
        const emails = withEmail.map(c => c.email);
        if (emails.length > 0) {
          const mailtoUrl = createEmailBroadcastMailto(
            emails,
            subject.trim(),
            message.trim(),
            imageUrl.trim() || undefined
          );
          if (typeof window !== "undefined") {
            window.location.href = mailtoUrl;
          }
        }
      }

      onToast?.(
        `Broadcast dispatched to ${totalCount} client${totalCount === 1 ? "" : "s"} via ${channel.toUpperCase()}.`
      );
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to execute broadcast";
      onToast?.(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border-hairline rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-popover space-y-5 relative max-h-[90vh] overflow-y-auto font-sans"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-border-hairline">
          <div>
            <h3 className="text-xl font-sans font-bold text-on-surface tracking-tight">
              Broadcast Message
            </h3>
            <p className="text-xs text-muted mt-0.5 font-medium">
              Targeting {totalCount} active customer{totalCount === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-surface-container-high text-on-surface border border-border-hairline">
            <span>{totalCount} Selected Active</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border ${
              withPhone.length > 0
                ? "bg-tertiary-container text-on-tertiary-container border-tertiary/20"
                : "bg-surface-container-high text-muted border-border-hairline"
            }`}
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>{withPhone.length} WhatsApp numbers</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border ${
              withEmail.length > 0
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-surface-container-high text-muted border-border-hairline"
            }`}
          >
            <Mail size={13} />
            <span>{withEmail.length} Email addresses</span>
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-on-surface uppercase tracking-wider block">
            Select Broadcast Channel
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setChannel("whatsapp")}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                channel === "whatsapp"
                  ? "bg-tertiary-container text-on-tertiary-container border-tertiary/20 font-semibold"
                  : "bg-surface-container-lowest text-muted border-border-hairline hover:bg-surface-container"
              }`}
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                channel === "email"
                  ? "bg-primary/10 text-primary border-primary/20 font-semibold"
                  : "bg-surface-container-lowest text-muted border-border-hairline hover:bg-surface-container"
              }`}
            >
              <Mail size={13} />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => setChannel("both")}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                channel === "both"
                  ? "bg-surface-container-high text-on-surface border-border-hairline font-semibold"
                  : "bg-surface-container-lowest text-muted border-border-hairline hover:bg-surface-container"
              }`}
            >
              <Send size={13} />
              <span>Both (WA + Email)</span>
            </button>
          </div>
        </div>

        {(channel === "email" || channel === "both") && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-on-surface uppercase tracking-wider block">
              Email Subject Line <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Autumn Gala Atelier Invitations"
              className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-border-hairline rounded-xl text-xs text-on-surface focus:outline-hidden focus:border-primary transition-colors"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-on-surface uppercase tracking-wider block">
            Media Attachment / Image Link{" "}
            <span className="text-muted font-normal lowercase">(optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl overflow-hidden transition-colors shadow-2xs focus-within:border-primary">
              <span className="pl-3.5 pr-2 text-muted flex items-center justify-center shrink-0">
                <ImageIcon size={15} />
              </span>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://cdn.example.com/invitation-card.jpg"
                className="w-full py-2.5 pr-3.5 bg-transparent border-0 text-xs text-on-surface focus:outline-hidden placeholder:text-outline"
              />
            </div>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="px-3 py-2.5 text-xs font-semibold text-muted hover:text-error rounded-xl border border-border-hairline hover:bg-surface-container-low cursor-pointer transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          {imageUrl && (
            <div className="mt-2 p-2 bg-surface-container-low border border-border-hairline rounded-xl flex items-center gap-3">
              <img
                src={imageUrl}
                alt="Attachment preview"
                className="w-12 h-12 object-cover rounded-lg border border-border-hairline"
                onError={e => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://placehold.co/100x100?text=Preview";
                }}
              />
              <span className="text-[11px] text-muted truncate flex-1">{imageUrl}</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-on-surface uppercase tracking-wider block">
              Broadcast Message Copy
            </label>
            <span
              className={`text-[11px] font-mono font-semibold ${
                isOverLimit
                  ? "text-error font-bold"
                  : remainingChars < 50
                    ? "text-amber-600"
                    : "text-muted"
              }`}
            >
              {message.length} / {maxLength} chars ({remainingChars} left)
            </span>
          </div>

          <textarea
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={`w-full p-3.5 bg-surface-container-lowest border rounded-xl text-xs text-on-surface focus:outline-hidden focus:border-primary transition-colors leading-relaxed ${
              isOverLimit ? "border-error" : "border-border-hairline"
            }`}
            placeholder="Type your bespoke broadcast message here..."
          />

          {isOverLimit && (
            <div className="flex items-center gap-1.5 text-xs text-error mt-1">
              <AlertCircle size={13} />
              <span>
                Message exceeds the {maxLength} character limit for {channel}. Please shorten your
                copy.
              </span>
            </div>
          )}
        </div>

        {channel === "whatsapp" && withPhone.length > 0 && (
          <div className="pt-1 border-t border-border-hairline">
            <button
              type="button"
              onClick={() => setShowQueue(prev => !prev)}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center justify-between w-full py-1"
            >
              <span>View Individual 1-by-1 WhatsApp Dispatches ({withPhone.length})</span>
              {showQueue ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showQueue && (
              <div className="mt-2 max-h-36 overflow-y-auto p-2 bg-surface-container-low border border-border-hairline rounded-xl space-y-1.5">
                {withPhone.map(cust => (
                  <div
                    key={cust.id}
                    className="flex items-center justify-between px-3 py-2 bg-card border border-border-hairline rounded-lg text-xs"
                  >
                    <div>
                      <b className="text-on-surface font-semibold">{cust.name}</b>
                      <span className="text-muted ml-2">{cust.phone}</span>
                    </div>
                    <a
                      href={createWhatsAppDirectUrl(
                        cust.phone || "",
                        message,
                        imageUrl || undefined
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-on-tertiary-container bg-tertiary-container hover:bg-tertiary-container/80 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <span>Send Direct</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border-hairline text-xs font-semibold text-on-surface bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExecuteBroadcast}
            disabled={isSubmitting || isOverLimit || totalCount === 0 || !message.trim()}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={13} className={isSubmitting ? "animate-spin" : ""} />
            <span>
              {isSubmitting
                ? "Broadcasting..."
                : `Broadcast to ${totalCount} Active Client${totalCount === 1 ? "" : "s"}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
