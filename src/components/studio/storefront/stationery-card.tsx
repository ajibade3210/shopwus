import { Check, RotateCw } from "lucide-react";
import Image from "next/image";
import type { StationeryCardProps } from "@/types";
import { isDarkColor } from "@/utils/helpers";

export function StationeryCard({
  profile,
  slug: _slug,
  isFlipped,
  setIsFlipped,
  setQuoteModalOpen: _setQuoteModalOpen,
  handleCopyLink: _handleCopyLink,
  primaryColor,
  secondaryColor,
  buttonColor: _buttonColor,
  textColor,
  cardBgColor = "#faf6f0",
  monogram,
  averageRating: _averageRating,
  totalReviews: _totalReviews,
  whatsAppLink: _whatsAppLink,
  radiusClass: _radiusClass,
}: StationeryCardProps) {
  const isDark = isDarkColor(cardBgColor);

  return (
    <div className="card-flip-container relative w-full max-w-[480px] min-h-[560px] mx-auto select-none cursor-pointer">
      <div
        className={`card-flip-inner w-full min-h-[560px] transition-transform duration-700 ${isFlipped ? "is-flipped" : ""}`}
      >
        {/* FRONT FACE: Center Monogram / Logo Only */}
        <div
          style={{ backgroundColor: cardBgColor }}
          className={`card-face card-front rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-colors ${
            isDark
              ? "border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
              : "border border-border-hairline shadow-card"
          }`}
        >
          {/* Top Row: Flip Button top right */}
          <div className="flex justify-end items-center">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.08)" : undefined,
                color: isDark ? "#ffffff" : undefined,
                borderColor: isDark ? "rgba(255,255,255,0.15)" : undefined,
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs ${
                isDark
                  ? ""
                  : "bg-surface-low text-on-surface border-border-hairline hover:bg-surface-high"
              }`}
              aria-label="Flip stationery card"
            >
              <RotateCw size={12} />
              <span>Flip Card</span>
            </button>
          </div>

          {/* Centered Business Identity */}
          <div className="my-auto flex flex-col items-center justify-center text-center space-y-4">
            <div
              style={{
                backgroundColor: secondaryColor,
                color: primaryColor,
                borderColor: primaryColor,
              }}
              className="w-52 h-52 sm:w-60 sm:h-60 rounded-full border-2 flex items-center justify-center font-serif text-7xl sm:text-8xl font-normal overflow-hidden shadow-sm shrink-0"
            >
              {profile.logoUrl ? (
                <Image
                  src={profile.logoUrl}
                  alt={profile.businessName}
                  width={240}
                  height={240}
                  priority
                  loading="eager"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                monogram
              )}
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h2
                style={{ color: textColor }}
                className="font-serif text-2xl sm:text-3xl font-normal leading-tight"
              >
                {profile.businessName}
              </h2>
            </div>
          </div>
        </div>

        {/* BACK FACE: Studio Vision & Atelier Statement */}
        <div
          style={{ backgroundColor: cardBgColor }}
          className={`card-face card-back rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-colors ${
            isDark
              ? "border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
              : "border border-border-hairline shadow-card"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                style={{
                  backgroundColor: secondaryColor,
                  color: primaryColor,
                  borderColor: primaryColor,
                }}
                className="w-10 h-10 rounded-full border flex items-center justify-center font-serif text-lg font-normal overflow-hidden shadow-2xs shrink-0"
              >
                {profile.logoUrl ? (
                  <Image
                    src={profile.logoUrl}
                    alt={profile.businessName}
                    width={40}
                    height={40}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  monogram
                )}
              </div>
              <div>
                <div
                  style={{ color: textColor }}
                  className="text-base font-serif font-semibold leading-tight"
                >
                  {profile.businessName}
                </div>
                <div
                  className={`text-[10px] uppercase tracking-[0.14em] font-medium mt-0.5 ${
                    isDark ? "text-white/60" : "text-outline"
                  }`}
                >
                  Studio Philosophy
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className={`inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shadow-2xs active:scale-95 z-20 ${
                isDark
                  ? "text-white/90 bg-white/10 hover:bg-white/20 border-white/20"
                  : "text-on-surface-variant hover:text-on-surface bg-transparent hover:bg-surface-low border-border-hairline"
              }`}
            >
              <RotateCw size={12} />
              <span className="font-medium text-[11px]">Return to Front</span>
            </button>
          </div>

          {/* Philosophy Statement */}
          <div
            className={`my-auto py-6 px-4 border-l-2 ${
              isDark ? "border-white/30" : "border-border-hairline"
            }`}
          >
            <p
              className={`text-sm sm:text-base font-serif italic leading-relaxed ${
                isDark ? "text-white/90" : "text-on-surface"
              }`}
            >
              &ldquo;{profile.description}&rdquo;
            </p>
          </div>

          {/* Verification Banner */}
          <div
            className={`rounded-2xl px-5 py-3 flex items-center justify-between text-xs shadow-2xs ${
              isDark
                ? "bg-white/10 border border-white/15 text-white"
                : "bg-card border border-border-hairline text-on-surface"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              <div
                style={{ backgroundColor: primaryColor }}
                className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-white text-[10px]"
              >
                <Check size={11} strokeWidth={3} />
              </div>
              <span>Verified Shopwus Studio</span>
            </div>
            <span
              className={`font-mono text-[11px] uppercase ${
                isDark ? "text-white/70" : "text-outline"
              }`}
            >
              ID: {profile.slug?.toUpperCase() || "elan-stores"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
