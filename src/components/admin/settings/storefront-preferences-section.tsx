"use client";

import { Check, Image as ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import type React from "react";
import { useRef } from "react";
import { Card } from "./card";
import { Toggle } from "./toggle";

type StorefrontPreferencesSectionProps = {
  showStorefrontBanner: boolean;
  setShowStorefrontBanner: (val: boolean) => void;
  storefrontBannerUrl: string;
  setStorefrontBannerUrl: (val: string) => void;
  storefrontBannerHeader: string;
  setStorefrontBannerHeader: (val: string) => void;
  storefrontBannerBody: string;
  setStorefrontBannerBody: (val: string) => void;
  storefrontBannerTextColor: string;
  setStorefrontBannerTextColor: (val: string) => void;
  storefrontBannerBgColor: string;
  setStorefrontBannerBgColor: (val: string) => void;

  showStorefrontSales: boolean;
  setShowStorefrontSales: (val: boolean) => void;
  storefrontSalesPosition: "top" | "bottom";
  setStorefrontSalesPosition: (val: "top" | "bottom") => void;
  storefrontSalesUrl: string;
  setStorefrontSalesUrl: (val: string) => void;
  storefrontSalesHeader: string;
  setStorefrontSalesHeader: (val: string) => void;
  storefrontSalesBody: string;
  setStorefrontSalesBody: (val: string) => void;
  storefrontSalesBtnText: string;
  setStorefrontSalesBtnText: (val: string) => void;
  storefrontSalesBtnUrl: string;
  setStorefrontSalesBtnUrl: (val: string) => void;
  storefrontSalesLinkType: "product" | "category" | "whatsapp" | "custom";
  setStorefrontSalesLinkType: (val: "product" | "category" | "whatsapp" | "custom") => void;

  isUploadingBanner: boolean;
  isUploadingSalesImage: boolean;
  handleStorefrontBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<string | null>;
  handleStorefrontSalesImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<string | null>;
};

const TEXT_COLOR_PRESETS = [
  { label: "Clean White", value: "#FFFFFF" },
  { label: "Dark Slate", value: "#0F172A" },
  { label: "Warm Gold", value: "#FDE68A" },
  { label: "Soft Cream", value: "#F8FAFC" },
];

const BG_COLOR_PRESETS = [
  { label: "Deep Navy", value: "#0F172A" },
  { label: "Charcoal", value: "#18181B" },
  { label: "Forest", value: "#064E3B" },
  { label: "Burgundy", value: "#4C0519" },
  { label: "Pure White", value: "#FFFFFF" },
];

export function StorefrontPreferencesSection({
  showStorefrontBanner,
  setShowStorefrontBanner,
  storefrontBannerUrl,
  setStorefrontBannerUrl,
  storefrontBannerHeader,
  setStorefrontBannerHeader,
  storefrontBannerBody,
  setStorefrontBannerBody,
  storefrontBannerTextColor,
  setStorefrontBannerTextColor,
  storefrontBannerBgColor,
  setStorefrontBannerBgColor,

  showStorefrontSales,
  setShowStorefrontSales,
  storefrontSalesPosition,
  setStorefrontSalesPosition,
  storefrontSalesUrl,
  setStorefrontSalesUrl,
  storefrontSalesHeader,
  setStorefrontSalesHeader,
  storefrontSalesBody,
  setStorefrontSalesBody,
  storefrontSalesBtnText,
  setStorefrontSalesBtnText,
  storefrontSalesBtnUrl,
  setStorefrontSalesBtnUrl,
  storefrontSalesLinkType,
  setStorefrontSalesLinkType,

  isUploadingBanner,
  isUploadingSalesImage,
  handleStorefrontBannerUpload,
  handleStorefrontSalesImageUpload,
}: StorefrontPreferencesSectionProps) {
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const salesFileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      {/* 1. Storefront Top Banner Card */}
      <Card
        title="Storefront Hero Banner"
        description="A bold promotional header displayed prominently at the top of your store catalog."
        action={
          <Toggle
            on={showStorefrontBanner}
            onClick={() => setShowStorefrontBanner(!showStorefrontBanner)}
            ariaLabel="Toggle Storefront Banner"
          />
        }
      >
        {showStorefrontBanner ? (
          <div className="space-y-5 pt-2">
            {/* Header Text */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-on-surface">
                <label htmlFor="banner-header">Banner Headline</label>
                <span
                  className={`text-[11px] font-sans tabular-nums ${
                    storefrontBannerHeader.length >= 45 ? "text-error font-bold" : "text-text-muted"
                  }`}
                >
                  {storefrontBannerHeader.length}/45
                </span>
              </div>
              <input
                id="banner-header"
                type="text"
                maxLength={45}
                value={storefrontBannerHeader}
                onChange={e => setStorefrontBannerHeader(e.target.value)}
                placeholder="e.g. Modern Essentials For Timeless Living"
                className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-border-hairline rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Body Text */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-on-surface">
                <label htmlFor="banner-body">Subheadline / Description</label>
                <span
                  className={`text-[11px] font-sans tabular-nums ${
                    storefrontBannerBody.length >= 140 ? "text-error font-bold" : "text-text-muted"
                  }`}
                >
                  {storefrontBannerBody.length}/140
                </span>
              </div>
              <textarea
                id="banner-body"
                rows={2}
                maxLength={140}
                value={storefrontBannerBody}
                onChange={e => setStorefrontBannerBody(e.target.value)}
                placeholder="e.g. Explore our newly released collections crafted with precision."
                className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-border-hairline rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            {/* Banner Image Uploader */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface block">Banner Image</label>
              <input
                ref={bannerFileRef}
                type="file"
                accept="image/*"
                onChange={handleStorefrontBannerUpload}
                className="hidden"
              />

              {storefrontBannerUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-border-hairline bg-surface-low aspect-[21/9] sm:aspect-[3/1] max-h-48 group">
                  <img
                    src={storefrontBannerUrl}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => bannerFileRef.current?.click()}
                      disabled={isUploadingBanner}
                      className="px-3 py-1.5 bg-white text-on-surface text-xs font-semibold rounded-lg shadow-xs hover:bg-surface-low cursor-pointer transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setStorefrontBannerUrl("")}
                      className="p-1.5 bg-error text-white rounded-lg shadow-xs hover:bg-error/90 cursor-pointer transition-colors"
                      title="Remove image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => bannerFileRef.current?.click()}
                  disabled={isUploadingBanner}
                  className="w-full py-8 border-2 border-dashed border-border-hairline hover:border-primary/40 rounded-2xl bg-surface-low flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
                >
                  {isUploadingBanner ? (
                    <Loader2 size={24} className="animate-spin text-primary" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                      <Upload size={18} />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xs font-semibold text-on-surface">Upload Banner Image</p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      PNG, JPG, or WebP up to 5MB
                    </p>
                  </div>
                </button>
              )}
            </div>

            {/* Colors: Text & Background */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border-hairline">
              {/* Text Color */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface block">Text Color</label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {TEXT_COLOR_PRESETS.map(preset => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setStorefrontBannerTextColor(preset.value)}
                        style={{ backgroundColor: preset.value }}
                        className={`w-7 h-7 rounded-full border border-border-hairline shadow-xs flex items-center justify-center cursor-pointer transition-transform ${
                          storefrontBannerTextColor.toLowerCase() === preset.value.toLowerCase()
                            ? "scale-110 ring-2 ring-primary"
                            : "hover:scale-105"
                        }`}
                        title={preset.label}
                      >
                        {storefrontBannerTextColor.toLowerCase() === preset.value.toLowerCase() && (
                          <Check
                            size={12}
                            className={preset.value === "#FFFFFF" ? "text-black" : "text-white"}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={storefrontBannerTextColor}
                    onChange={e => setStorefrontBannerTextColor(e.target.value)}
                    className="w-24 px-2.5 py-1 text-xs font-mono uppercase bg-surface-low border border-border-hairline rounded-lg text-on-surface"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface block">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {BG_COLOR_PRESETS.map(preset => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setStorefrontBannerBgColor(preset.value)}
                        style={{ backgroundColor: preset.value }}
                        className={`w-7 h-7 rounded-full border border-border-hairline shadow-xs flex items-center justify-center cursor-pointer transition-transform ${
                          storefrontBannerBgColor.toLowerCase() === preset.value.toLowerCase()
                            ? "scale-110 ring-2 ring-primary"
                            : "hover:scale-105"
                        }`}
                        title={preset.label}
                      >
                        {storefrontBannerBgColor.toLowerCase() === preset.value.toLowerCase() && (
                          <Check
                            size={12}
                            className={preset.value === "#FFFFFF" ? "text-black" : "text-white"}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={storefrontBannerBgColor}
                    onChange={e => setStorefrontBannerBgColor(e.target.value)}
                    className="w-24 px-2.5 py-1 text-xs font-mono uppercase bg-surface-low border border-border-hairline rounded-lg text-on-surface"
                    placeholder="#0F172A"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-text-muted py-2">
            The top promotional banner is currently disabled on your storefront.
          </p>
        )}
      </Card>

      {/* 2. Storefront Sales Showcase Card */}
      <Card
        title="Featured Sales Showcase"
        description="Highlight a high-converting deal, limited-time collection, or service consultation with a custom CTA."
        action={
          <Toggle
            on={showStorefrontSales}
            onClick={() => setShowStorefrontSales(!showStorefrontSales)}
            ariaLabel="Toggle Sales Showcase"
          />
        }
      >
        {showStorefrontSales ? (
          <div className="space-y-5 pt-2">
            {/* Position Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface block">
                Showcase Placement
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setStorefrontSalesPosition("top")}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-left ${
                    storefrontSalesPosition === "top"
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-surface-low text-on-surface border-border-hairline hover:bg-surface-container"
                  }`}
                >
                  <p className="font-bold">Top of Page</p>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      storefrontSalesPosition === "top" ? "text-white/80" : "text-text-muted"
                    }`}
                  >
                    Directly beneath banner
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setStorefrontSalesPosition("bottom")}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-left ${
                    storefrontSalesPosition === "bottom"
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-surface-low text-on-surface border-border-hairline hover:bg-surface-container"
                  }`}
                >
                  <p className="font-bold">Bottom of Page</p>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      storefrontSalesPosition === "bottom" ? "text-white/80" : "text-text-muted"
                    }`}
                  >
                    Below products (Default)
                  </p>
                </button>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-on-surface">
                <label htmlFor="sales-header">Headline</label>
                <span
                  className={`text-[11px] font-sans tabular-nums ${
                    storefrontSalesHeader.length >= 50 ? "text-error font-bold" : "text-text-muted"
                  }`}
                >
                  {storefrontSalesHeader.length}/50
                </span>
              </div>
              <input
                id="sales-header"
                type="text"
                maxLength={50}
                value={storefrontSalesHeader}
                onChange={e => setStorefrontSalesHeader(e.target.value)}
                placeholder="e.g. End of Season Archive Sale"
                className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-border-hairline rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-on-surface">
                <label htmlFor="sales-body">Description / Offer Details</label>
                <span
                  className={`text-[11px] font-sans tabular-nums ${
                    storefrontSalesBody.length >= 140 ? "text-error font-bold" : "text-text-muted"
                  }`}
                >
                  {storefrontSalesBody.length}/140
                </span>
              </div>
              <textarea
                id="sales-body"
                rows={2}
                maxLength={140}
                value={storefrontSalesBody}
                onChange={e => setStorefrontSalesBody(e.target.value)}
                placeholder="e.g. Enjoy up to 40% off handcrafted ceramics and home decor while stocks last."
                className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-border-hairline rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            {/* Button Text & Link Target */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-on-surface">
                  <label htmlFor="sales-btn-text">Button Label</label>
                  <span
                    className={`text-[11px] font-sans tabular-nums ${
                      storefrontSalesBtnText.length >= 20
                        ? "text-error font-bold"
                        : "text-text-muted"
                    }`}
                  >
                    {storefrontSalesBtnText.length}/20
                  </span>
                </div>
                <input
                  id="sales-btn-text"
                  type="text"
                  maxLength={20}
                  value={storefrontSalesBtnText}
                  onChange={e => setStorefrontSalesBtnText(e.target.value)}
                  placeholder="e.g. Shop The Sale"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-border-hairline rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="sales-btn-url"
                  className="text-xs font-semibold text-on-surface block"
                >
                  Link Target (URL or Path)
                </label>
                <input
                  id="sales-btn-url"
                  type="text"
                  value={storefrontSalesBtnUrl}
                  onChange={e => setStorefrontSalesBtnUrl(e.target.value)}
                  placeholder="e.g. #catalog or https://wa.me/..."
                  className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-border-hairline rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Link Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface block">
                Link Action Type
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { type: "custom", label: "Custom / Catalog" },
                  { type: "product", label: "Specific Product" },
                  { type: "category", label: "Specific Category" },
                  { type: "whatsapp", label: "WhatsApp Chat" },
                ].map(item => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() =>
                      setStorefrontSalesLinkType(
                        item.type as "product" | "category" | "whatsapp" | "custom"
                      )
                    }
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      storefrontSalesLinkType === item.type
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-surface-low text-on-surface border-border-hairline hover:bg-surface-container"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sales Image Uploader */}
            <div className="space-y-2 pt-2 border-t border-border-hairline">
              <label className="text-xs font-semibold text-on-surface block">
                Showcase Image (Right Column)
              </label>
              <input
                ref={salesFileRef}
                type="file"
                accept="image/*"
                onChange={handleStorefrontSalesImageUpload}
                className="hidden"
              />

              {storefrontSalesUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-border-hairline bg-surface-low aspect-[16/9] max-h-56 group">
                  <img
                    src={storefrontSalesUrl}
                    alt="Sales preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => salesFileRef.current?.click()}
                      disabled={isUploadingSalesImage}
                      className="px-3 py-1.5 bg-white text-on-surface text-xs font-semibold rounded-lg shadow-xs hover:bg-surface-low cursor-pointer transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => setStorefrontSalesUrl("")}
                      className="p-1.5 bg-error text-white rounded-lg shadow-xs hover:bg-error/90 cursor-pointer transition-colors"
                      title="Remove image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => salesFileRef.current?.click()}
                  disabled={isUploadingSalesImage}
                  className="w-full py-8 border-2 border-dashed border-border-hairline hover:border-primary/40 rounded-2xl bg-surface-low flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
                >
                  {isUploadingSalesImage ? (
                    <Loader2 size={24} className="animate-spin text-primary" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                      <ImageIcon size={18} />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xs font-semibold text-on-surface">Upload Showcase Image</p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      High quality landscape image
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-text-muted py-2">
            The sales showcase section is currently disabled on your storefront.
          </p>
        )}
      </Card>
    </div>
  );
}
