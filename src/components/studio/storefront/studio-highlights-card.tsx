import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { BUSINESS_TYPE_CTA_MAP, DEFAULT_BUSINESS_TYPE } from "@/constants";
import type { StudioHighlightsCardProps } from "@/types";
import { isDarkColor } from "@/utils/helpers";

export function StudioHighlightsCard({
  profile,
  totalCustomers = 0,
  setQuoteModalOpen,
  handleCopyLink,
  whatsAppLink,
  primaryColor,
  secondaryColor: _secondaryColor,
  buttonColor,
  cardBgColor = "#faf6f0",
  radiusClass,
}: StudioHighlightsCardProps) {
  const isDark = isDarkColor(cardBgColor);

  // Compute live open/closed operational status
  const getStoreStatus = () => {
    if (profile.byAppointmentOnly) {
      return {
        isOpen: true,
        isAppointment: true,
        label: "By Appointment Only",
        dotColor: "bg-amber-500",
        badgeBg: "bg-amber-50 text-amber-800 border-amber-200/80",
        scheduleBadge: "Private Atelier",
      };
    }

    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat

    let isDayOpen = true;
    const hours = (profile.operatingHours || "Mon–Sat").toLowerCase();
    if (hours.includes("mon–fri") || hours.includes("mon-fri")) {
      isDayOpen = day >= 1 && day <= 5;
    } else if (hours.includes("mon–sat") || hours.includes("mon-sat")) {
      isDayOpen = day >= 1 && day <= 6;
    } else if (hours.includes("everyday")) {
      isDayOpen = true;
    }

    const parseTimeToMinutes = (timeStr: string): number => {
      if (!timeStr) return 0;
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (!match) return 0;
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const meridiem = match[3]?.toUpperCase();
      if (meridiem === "PM" && h < 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;
      return h * 60 + m;
    };

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const fromMinutes = parseTimeToMinutes(profile.timeFrom || "09:00 AM");
    const toMinutes = parseTimeToMinutes(profile.timeTo || "06:00 PM");

    const isTimeOpen = currentMinutes >= fromMinutes && currentMinutes <= toMinutes;
    const isOpen = isDayOpen && isTimeOpen;

    if (isOpen) {
      return {
        isOpen: true,
        isAppointment: false,
        label: "Open Now",
        dotColor: "bg-emerald-500",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
        scheduleBadge: profile.operatingHours || "Mon–Sat",
      };
    }

    return {
      isOpen: false,
      isAppointment: false,
      label: "Closed Now",
      dotColor: "bg-stone-400",
      badgeBg: "bg-stone-100 text-stone-700 border-stone-200/80",
      scheduleBadge: profile.operatingHours || "Mon–Sat",
    };
  };

  const status = getStoreStatus();
  const address = profile.physicalAddress || profile.location;
  const hasSubstantialCustomers = totalCustomers > 0;

  // Check if WhatsApp is enabled in settings (connected toggle and valid phone number)
  const whatsAppChannel = profile.socialChannels?.find(c => c.type === "whatsapp");
  const whatsAppPhone = whatsAppChannel?.handle || profile.whatsAppNumber || profile.phone;
  const isWhatsAppEnabled =
    (whatsAppChannel ? whatsAppChannel.connected : true) && Boolean(whatsAppPhone?.trim());

  return (
    <div
      style={{ backgroundColor: cardBgColor }}
      className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between max-w-[480px] w-full h-[580px] transition-colors ${
        isDark
          ? "border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
          : "border border-border-hairline shadow-card"
      }`}
    >
      {/* Top Bar: Verification and Patron Metrics */}
      <div className="flex items-center justify-between">
        {profile.isVerified !== false ? (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-2xs ${
              isDark
                ? "bg-white/10 border border-white/15 text-white"
                : "bg-card border border-border-hairline"
            }`}
          >
            <ShieldCheck size={14} className={isDark ? "text-cyan-400" : "text-primary"} />
            <span
              className={`text-[11px] font-semibold tracking-wide ${
                isDark ? "text-white" : "text-on-surface"
              }`}
            >
              Verified Storefront
            </span>
          </div>
        ) : (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-2xs ${
              isDark
                ? "bg-white/5 border border-white/10 text-white/80"
                : "bg-card border border-border-hairline text-on-surface-variant"
            }`}
          >
            <span
              className={`text-[11px] font-semibold tracking-wide ${
                isDark ? "text-white/80" : "text-on-surface-variant"
              }`}
            >
              Official Storefront
            </span>
          </div>
        )}

        {hasSubstantialCustomers ? (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-2xs ${
              isDark
                ? "bg-white/10 border border-white/15 text-white"
                : "bg-card border border-border-hairline"
            }`}
          >
            <CheckCircle2 size={13} style={{ color: primaryColor }} />
            <span
              className={`text-[11px] font-semibold ${isDark ? "text-white" : "text-on-surface"}`}
            >
              {totalCustomers >= 10 ? `${totalCustomers}+` : totalCustomers} Client
              {totalCustomers === 1 ? "" : "s"} Served
            </span>
          </div>
        ) : (
          <span
            className={`font-mono text-[10px] uppercase tracking-wider ${
              isDark ? "text-white/70" : "text-outline"
            }`}
          >
            ID: {profile.slug?.toUpperCase() || "elan-stores"}
          </span>
        )}
      </div>

      {/* Main Cohesive Details Container */}
      <div className="bg-card border border-border-hairline rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        {/* Live Status Header Row */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border-hairline">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {status.isOpen && (
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.dotColor}`}
                />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.dotColor}`}
              />
            </span>
            <span className="text-xs font-semibold text-on-surface">{status.label}</span>
          </div>

          <span
            className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${status.badgeBg}`}
          >
            {status.scheduleBadge}
          </span>
        </div>

        {/* Concise Contact & Location Stack */}
        <div className="divide-y divide-border-hairline text-xs space-y-0.5">
          <div className="py-2.5 flex items-center justify-between gap-3">
            <span className="text-on-surface-variant flex items-center gap-2 font-medium shrink-0">
              <Clock3 size={14} style={{ color: primaryColor }} /> Operating Hours:
            </span>
            <span className="font-semibold text-on-surface text-right">
              {profile.operatingHours}: {profile.timeFrom} – {profile.timeTo}
            </span>
          </div>

          {address && (
            <div className="py-2.5 flex items-center justify-between gap-3">
              <span className="text-on-surface-variant flex items-center gap-2 font-medium shrink-0">
                <MapPin size={14} style={{ color: primaryColor }} /> Studio Flagship:
              </span>
              <span className="font-semibold text-on-surface truncate max-w-[210px] text-right">
                {address}
              </span>
            </div>
          )}

          {isWhatsAppEnabled && (
            <div className="py-2.5 flex items-center justify-between gap-3">
              <span className="text-on-surface-variant flex items-center gap-2 font-medium shrink-0">
                <Phone size={14} style={{ color: primaryColor }} /> WhatsApp Line:
              </span>
              <span className="font-mono font-semibold text-on-surface text-right">
                {whatsAppPhone}
              </span>
            </div>
          )}

          <div className="pt-2.5 flex items-center justify-between gap-3">
            <span className="text-on-surface-variant flex items-center gap-2 font-medium shrink-0">
              <Mail size={14} style={{ color: primaryColor }} /> Studio Email:
            </span>
            <span className="font-semibold text-on-surface truncate max-w-[200px] text-right">
              {profile.emailAddress || profile.email}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="space-y-3 pt-2">
        <div
          className={
            isWhatsAppEnabled ? "grid grid-cols-2 gap-2.5 sm:gap-3 items-stretch" : "w-full"
          }
        >
          <button
            type="button"
            onClick={() => setQuoteModalOpen(true)}
            style={{ backgroundColor: buttonColor }}
            className={`w-full min-h-[44px] text-white text-[11px] sm:text-xs font-semibold uppercase tracking-normal sm:tracking-wide px-2.5 sm:px-3 py-2.5 shadow-xs hover:brightness-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center leading-tight ${radiusClass}`}
          >
            <span className="truncate">
              {BUSINESS_TYPE_CTA_MAP[profile.businessType ?? DEFAULT_BUSINESS_TYPE]}
            </span>
            <ArrowRight size={13} className="shrink-0" />
          </button>

          {isWhatsAppEnabled && (
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noreferrer"
              className={`w-full min-h-[44px] bg-card hover:bg-surface-low text-on-surface border border-border-hairline text-[11px] sm:text-xs font-semibold uppercase tracking-normal sm:tracking-wide px-2.5 sm:px-3 py-2.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs text-center leading-tight ${radiusClass}`}
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.49 0-2.95-.4-4.22-1.16l-.3-.18-3.13.82.83-3.05-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.28-8.24 2.21 0 4.29.86 5.85 2.43a8.188 8.188 0 0 1 2.41 5.81c0 4.55-3.7 8.26-8.26 8.26zm4.53-6.19c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
              </svg>
              <span className="truncate">WhatsApp Us</span>
            </a>
          )}
        </div>

        <div className="flex items-center justify-center text-xs text-outline">
          <button
            type="button"
            onClick={handleCopyLink}
            style={{ color: primaryColor }}
            className="font-medium hover:underline flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Share2 size={13} />
            <span>Copy Profile Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}
