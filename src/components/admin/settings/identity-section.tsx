import { ChevronDown, Loader2, Trash2, Upload } from "lucide-react";
import type { CurrencyCode, IdentitySectionProps } from "@/types";
import { isValidUrl, slugify } from "@/utils";
import { Card } from "./card";

export function IdentitySection({
  name,
  setName,
  slug,
  setSlug,
  slugStatus,
  website,
  setWebsite,
  currency = "NGN",
  setCurrency,
  businessType: _businessType,
  setBusinessType: _setBusinessType,
  about,
  setAbout,
  logoUrl,
  setLogoUrl: _setLogoUrl,
  isUploadingLogo,
  handleLogoUpload,
  handleDeleteLogo,
  bannerUrl,
  setBannerUrl: _setBannerUrl,
  isUploadingBanner,
  handleBannerUpload,
  handleDeleteBanner,
  onToast: _onToast,
}: IdentitySectionProps) {
  return (
    <Card
      title="Business Profile"
      description="The foundation of your public customer-facing presence."
    >
      <div className="space-y-7">
        {/* Visual Brand Assets: Logo & Storefront Hero Banner (1:3 Grid Ratio) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Logo Upload Card (1 part) */}
          <div className="lg:col-span-1 bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-[#e5e7eb] bg-[#f3f4f6] flex items-center justify-center shadow-xs shrink-0 overflow-hidden group">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Business Logo Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-sans font-bold text-2xl sm:text-3xl text-[#191c1d]">
                      {name ? name.charAt(0).toUpperCase() : "S"}
                    </span>
                  )}
                  {isUploadingLogo && (
                    <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center">
                      <Loader2 size={22} className="animate-spin text-[#0058be]" />
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0058be] block">
                    Brand Logo
                  </span>
                  <span className="text-[10px] text-[#9ca3af] font-medium tracking-wider uppercase mt-0.5 block">
                    PNG · SVG · JPG
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6b7280] leading-relaxed">
                Your official studio crest displayed across your storefront.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#e5e7eb]/60 flex items-center justify-end gap-2">
              {logoUrl && handleDeleteLogo && (
                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  disabled={isUploadingLogo}
                  aria-label="Delete Logo"
                  className="cursor-pointer inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 px-3 h-9 rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0 select-none disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              )}
              <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white px-4 h-9 rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0 select-none">
                <Upload size={13} className="text-white" />
                <span className="text-white">
                  {isUploadingLogo ? "Uploading..." : logoUrl ? "Replace" : "Upload Logo"}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={isUploadingLogo}
                />
              </label>
            </div>
          </div>

          {/* Storefront Hero Banner Upload Card (3 parts) */}
          <div className="lg:col-span-3 bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0058be] block">
                    Storefront Banner
                  </span>
                  <p className="text-xs text-[#6b7280] mt-0.5">
                    Your widescreen hero banner displayed atop your public storefront.
                  </p>
                </div>
                <span className="text-[10px] text-[#9ca3af] font-medium uppercase shrink-0">
                  ~16:9 or 1920×500px
                </span>
              </div>

              <div className="relative w-full h-28 sm:h-32 rounded-xl border border-[#e5e7eb] bg-[#f3f4f6] flex items-center justify-center shadow-xs overflow-hidden group">
                {bannerUrl ? (
                  <img
                    src={bannerUrl}
                    alt="Storefront Banner Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center px-4">
                    <span className="text-xs text-[#9ca3af] font-medium">
                      No storefront banner uploaded yet
                    </span>
                  </div>
                )}
                {isUploadingBanner && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center">
                    <Loader2 size={18} className="animate-spin text-[#0058be]" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#e5e7eb]/60 flex items-center justify-end gap-2">
              {bannerUrl && handleDeleteBanner && (
                <button
                  type="button"
                  onClick={handleDeleteBanner}
                  disabled={isUploadingBanner}
                  aria-label="Delete Banner"
                  className="cursor-pointer inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 px-3.5 h-9 rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0 select-none disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              )}
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white px-5 h-9 rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0 select-none">
                <Upload size={13} className="text-white" />
                <span className="text-white">
                  {isUploadingBanner
                    ? "Uploading..."
                    : bannerUrl
                      ? "Replace Banner"
                      : "Upload Banner"}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={handleBannerUpload}
                  disabled={isUploadingBanner}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Row 1: Name & Slug */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Business name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:outline-none shadow-2xs"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#374151] tracking-wide block">
                Storefront slug
              </label>
              <span className="text-[11px] text-[#6b7280] font-mono truncate max-w-[180px]">
                shopwus.com/{slug || "slug"}
              </span>
            </div>
            <div className="relative">
              <input
                value={slug}
                onChange={e => setSlug(slugify(e.target.value))}
                placeholder="e.g. elan-stores"
                className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:outline-none shadow-2xs pr-24"
              />
              {slugStatus === "checking" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8c827a]">
                  checking...
                </span>
              )}
              {slugStatus === "available" && slug && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#16a34a] font-medium bg-[#f0fdf4] px-2 py-0.5 rounded">
                  available
                </span>
              )}
              {slugStatus === "taken" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#ba1a1a] font-medium bg-[#fef2f2] px-2 py-0.5 rounded">
                  unavailable
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Website & Currency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#374151] tracking-wide block">
                Website
              </label>
              {website && !isValidUrl(website) && (
                <span className="text-[11px] text-amber-600 font-medium">
                  Enter a standard URL (e.g. sitename.com)
                </span>
              )}
            </div>
            <input
              type="text"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="e.g. sitename.com or https://sitename.com"
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] focus:outline-none shadow-2xs transition-colors ${
                website && !isValidUrl(website)
                  ? "border-amber-400 bg-amber-50/20"
                  : "border-[#d1d5db]"
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              Currency
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={e => setCurrency?.(e.target.value as CurrencyCode)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-[#111827] focus:outline-none font-medium shadow-2xs appearance-none cursor-pointer"
              >
                <option value="NGN">₦ NGN</option>
                <option value="USD">$ USD</option>
                <option value="GBP">£ GBP</option>
                <option value="EUR">€ EUR</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#6b7280]">
                <ChevronDown size={15} />
              </div>
            </div>
          </div>

          {/* Row 5: About textarea */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-[#374151] tracking-wide block">
              About store
            </label>
            <textarea
              rows={4}
              value={about}
              onChange={e => setAbout(e.target.value)}
              className="w-full rounded-lg border border-[#d1d5db] bg-white px-3.5 py-3 text-xs sm:text-sm text-[#111827] focus:outline-none shadow-2xs leading-relaxed"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
