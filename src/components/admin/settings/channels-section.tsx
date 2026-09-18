import { RefreshCw, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getSocialChannelStyle } from "@/components/studio/storefront/social-badge";
import { SOCIAL_PREFIX_MAP } from "@/constants";
import type { ChannelsSectionProps } from "@/types";
import { isValidPhone, isValidUrl, sanitizeHandle } from "@/utils";
import { Card } from "./card";
import { Toggle } from "./toggle";

export function ChannelsSection({
  googleReviewsLink,
  setGoogleReviewsLink,
  showReviews,
  setShowReviews,
  isSyncingReviews,
  handleSyncReviews,
  channels,
  updateChannelHandle,
  toggleChannel,
  onToast,
}: ChannelsSectionProps) {
  const [debouncedHandles, setDebouncedHandles] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const current: Record<string, string> = {};
      for (const c of channels) {
        current[c.id] = c.handle || "";
      }
      setDebouncedHandles(current);
    }, 700);

    return () => clearTimeout(timer);
  }, [channels]);

  return (
    <>
      {/* Card 04: Review Management */}
      <Card
        title="Review Management"
        description="Connect your Google Business Profile to showcase authenticated client reviews."
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6b7280]">Show on page</span>
            <Toggle
              on={showReviews}
              onClick={() => setShowReviews(!showReviews)}
              ariaLabel="Toggle reviews section visibility"
            />
          </div>
        }
      >
        <div className="space-y-4">
          {!showReviews && (
            <div className="bg-[#fef3c7] text-[#92400e] text-xs px-3 py-2 rounded-lg border border-[#fde68a]">
              This section is currently hidden on your public studio page.
            </div>
          )}
          <div className="border border-[#e5e7eb] rounded-xl p-4 sm:p-5 bg-white space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e5e7eb]">
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] border border-[#e5e7eb] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <h4 className="text-sm font-bold text-[#191c1d] leading-snug">
                    Google Business Profile
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6b7280]">
                    <div className="flex text-[#eab308] shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" />
                      ))}
                    </div>
                    <span className="font-bold text-[#191c1d]">5.0</span>
                    <span className="text-[#9ca3af]">·</span>
                    <span className="whitespace-nowrap">
                      48 <span className="hidden xs:inline sm:inline">Verified 5-Star </span>Reviews
                    </span>
                  </div>

                  <div className="pt-0.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] shrink-0 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shrink-0" />
                      Live Sync Active
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncReviews}
                disabled={isSyncingReviews}
                className="h-8 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e5e7eb] hover:border-[#191c1d] bg-white text-[#191c1d] text-xs font-semibold transition-all shrink-0 whitespace-nowrap shadow-2xs hover:bg-neutral-50 self-start sm:self-center disabled:opacity-60 cursor-pointer mt-1 sm:mt-0"
              >
                <RefreshCw
                  size={12}
                  className={isSyncingReviews ? "animate-spin text-[#0058be]" : ""}
                />
                <span>{isSyncingReviews ? "Syncing..." : "Sync Now"}</span>
              </button>
            </div>

            <div className="pt-0.5 space-y-1.5">
              <label className="block text-[#374151] font-semibold text-xs tracking-wide">
                Google Business Profile URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={googleReviewsLink}
                  onChange={e => setGoogleReviewsLink(e.target.value)}
                  placeholder="https://business.google.com/..."
                  className="flex-1 h-9 bg-white border border-[#d1d5db] rounded-lg px-3 text-xs text-[#191c1d] focus:outline-none shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => onToast("Google business link saved")}
                  className="h-9 px-4 inline-flex items-center justify-center rounded-lg bg-[#191c1d] hover:bg-black text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer shadow-2xs"
                >
                  Save Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Card 05: Social Channels Management */}
      <Card
        number="05"
        title="Social Channels Management"
        description="Manage where clients can find you online across all 10 platforms."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {channels.map(channel => {
            const style = getSocialChannelStyle(channel.type);
            const prefix = SOCIAL_PREFIX_MAP[channel.type] || `${channel.type}.com/`;
            const displayHandle = sanitizeHandle(channel.handle, prefix);
            const typeLower = channel.type?.toLowerCase();
            const isWhatsApp = typeLower === "whatsapp";
            const isWebsite = typeLower === "website";
            const trimmedHandle = displayHandle.trim();
            const hasContent = Boolean(trimmedHandle);

            // Check if user is actively typing in this input
            const debouncedRaw = debouncedHandles[channel.id] ?? channel.handle ?? "";
            const debouncedDisplayHandle = sanitizeHandle(debouncedRaw, prefix).trim();
            const isTyping = displayHandle.trim() !== debouncedDisplayHandle;

            let validationError = "";
            let isValid = false;

            if (hasContent) {
              if (isWhatsApp) {
                if (isValidPhone(trimmedHandle)) {
                  isValid = true;
                } else if (!isTyping && debouncedDisplayHandle) {
                  // Only display error after the user has stopped typing
                  validationError = "Invalid phone number (e.g. 0803 123 4567)";
                }
              } else if (isWebsite) {
                if (isValidUrl(trimmedHandle)) {
                  isValid = true;
                } else if (!isTyping && debouncedDisplayHandle) {
                  validationError = "Invalid website URL";
                }
              } else {
                // For all other social channels, valid when 2 or more characters are entered
                if (trimmedHandle.length >= 2) {
                  isValid = true;
                }
              }
            }

            return (
              <div
                className={`p-1.5 sm:p-2 rounded-xl border bg-white flex flex-col justify-center gap-1 shadow-2xs transition-all ${
                  validationError
                    ? "social-item-invalid"
                    : isValid
                      ? "social-item-valid"
                      : "border-[#e5e7eb] hover:border-[#d1d5db]"
                }`}
                key={channel.id}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      style={{
                        backgroundColor: style.bg,
                        borderColor: style.border,
                        color: style.color,
                      }}
                      className="w-6 h-6 rounded-md border flex items-center justify-center shrink-0 shadow-2xs"
                    >
                      <span className="scale-[0.65] flex items-center justify-center">
                        {style.icon}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 flex-1 min-w-0 rounded-md px-2 py-0.5 h-7 transition-colors shadow-2xs border ${
                        validationError
                          ? "social-box-invalid"
                          : isValid
                            ? "social-box-valid"
                            : "bg-[#f9fafb] border-[#e5e7eb]"
                      }`}
                    >
                      <span
                        className={`text-[10px] select-none shrink-0 font-mono transition-colors leading-none ${
                          validationError
                            ? "social-prefix-invalid"
                            : isValid
                              ? "social-prefix-valid"
                              : "text-[#9ca3af] font-medium"
                        }`}
                      >
                        {prefix}
                      </span>
                      <input
                        type={isWhatsApp ? "tel" : isWebsite ? "url" : "text"}
                        value={displayHandle}
                        onChange={e =>
                          updateChannelHandle(channel.id, sanitizeHandle(e.target.value, prefix))
                        }
                        placeholder={
                          isWhatsApp ? "0803 123 4567" : isWebsite ? "sitename.com" : "handle"
                        }
                        style={{
                          outline: "none",
                          border: "none",
                          boxShadow: "none",
                          background: "transparent",
                        }}
                        className="social-input-field w-full text-[10px] text-[#191c1d] border-none p-0 outline-none focus:outline-none placeholder:text-[#9ca3af] bg-transparent font-medium min-h-0 h-auto rounded-none leading-none"
                      />
                    </div>
                  </div>
                  <Toggle on={channel.connected} onClick={() => toggleChannel(channel.id)} />
                </div>

                {validationError && (
                  <div className="social-error-text pl-8 flex items-center gap-1.5 animate-in fade-in duration-150">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
