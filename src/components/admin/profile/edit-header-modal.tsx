"use client";

import { Check, Image as ImageIcon, Loader2, Sparkles, Upload, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { uploadMediaFile } from "@/lib/api";
import type { EditHeaderModalProps } from "@/types";

export function EditHeaderModal({
  isOpen,
  onClose,
  businessName,
  tagline,
  logoUrl,
  currentHeaderUrl: _currentHeaderUrl,
  currentHeaderType = "AUTO",
  initialIncludeInInvoice = true,
  initialIncludeInEmail = true,
  onSaveHeader,
  onToast,
}: EditHeaderModalProps) {
  const [activeTab, setActiveTab] = useState<"auto" | "custom">(
    currentHeaderType === "CUSTOM" ? "custom" : "auto"
  );

  // Auto-generate state
  const [headerTitle, setHeaderTitle] = useState(businessName || "Business Name");
  const [headerCaption, setHeaderCaption] = useState(tagline || "Shop With Us");
  const [customLogoUrl, setCustomLogoUrl] = useState(logoUrl || "");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Placement preferences
  const [includeInInvoice, setIncludeInInvoice] = useState(initialIncludeInInvoice);
  const [includeInEmail, setIncludeInEmail] = useState(initialIncludeInEmail);

  // Custom banner state
  const [customBannerUrl, setCustomBannerUrl] = useState<string>(_currentHeaderUrl || "");
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Submission state
  const [isSaving, setIsSaving] = useState(false);

  // Canvas ref for live rendering & exporting
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync inputs when props change
  useEffect(() => {
    if (businessName) setHeaderTitle(businessName);
    if (tagline) setHeaderCaption(tagline);
    if (logoUrl) setCustomLogoUrl(logoUrl);
    if (_currentHeaderUrl) setCustomBannerUrl(_currentHeaderUrl);
  }, [businessName, tagline, logoUrl, _currentHeaderUrl]);

  // Render high-DPI canvas matching typography standards
  useEffect(() => {
    if (!isOpen || activeTab !== "auto") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Render at 1200x360
    canvas.width = 1200;
    canvas.height = 360;

    // Background: Clean White
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1200, 360);

    const boxX = 30;
    const boxY = 30;
    const boxSize = 300;
    const radius = 28;

    const titleText = (headerTitle || "Business Name").trim().toUpperCase();
    const captionText = (headerCaption || "Shop With Us").trim();

    const drawTextGroup = () => {
      // Title typography: 'Inter', system-ui, -apple-system, sans-serif
      let titleSize = 64;
      if (titleText.length > 25) {
        titleSize = 42;
      } else if (titleText.length > 18) {
        titleSize = 52;
      }

      ctx.fillStyle = "#191C1D";
      ctx.font = `800 ${titleSize}px 'Inter', system-ui, -apple-system, sans-serif`;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(titleText, 370, 175);

      // Caption typography
      let captionSize = 36;
      if (captionText.length > 35) {
        captionSize = 28;
      } else if (captionText.length > 25) {
        captionSize = 32;
      }

      ctx.fillStyle = "#0058BE";
      ctx.font = `600 ${captionSize}px 'Inter', system-ui, -apple-system, sans-serif`;
      ctx.fillText(captionText, 370, 245);
    };

    const drawMonogram = () => {
      ctx.save();
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(boxX, boxY, boxSize, boxSize, [radius]);
      } else {
        ctx.rect(boxX, boxY, boxSize, boxSize);
      }
      ctx.fillStyle = "#26282B";
      ctx.fill();

      const initial = (titleText.charAt(0) || "S").toUpperCase();
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 140px 'Inter', system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(initial, boxX + boxSize / 2, boxY + boxSize / 2);
      ctx.restore();
      drawTextGroup();
    };

    if (customLogoUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = customLogoUrl;
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(boxX, boxY, boxSize, boxSize, [radius]);
        } else {
          ctx.rect(boxX, boxY, boxSize, boxSize);
        }
        ctx.clip();
        const scale = Math.max(boxSize / img.width, boxSize / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = boxX + (boxSize - w) / 2;
        const y = boxY + (boxSize - h) / 2;
        ctx.drawImage(img, x, y, w, h);
        ctx.restore();
        drawTextGroup();
      };
      img.onerror = () => {
        drawMonogram();
      };
    } else {
      drawMonogram();
    }
  }, [isOpen, activeTab, headerTitle, headerCaption, customLogoUrl]);

  if (!isOpen) return null;

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const res = await uploadMediaFile(file);
      setCustomLogoUrl(res.url);
      onToast("Logo updated for header generator");
    } catch {
      onToast("Failed to upload logo image");
    } finally {
      setIsUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleCustomBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBanner(true);
    try {
      const res = await uploadMediaFile(file);
      setCustomBannerUrl(res.url);
      onToast("Banner uploaded successfully");
    } catch {
      onToast("Failed to upload banner");
    } finally {
      setIsUploadingBanner(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "auto") {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Canvas not available");

        // Convert canvas to PNG Blob
        const blob = await new Promise<Blob | null>(resolve => {
          canvas.toBlob(b => resolve(b), "image/png");
        });

        if (!blob) throw new Error("Failed to generate image buffer");

        // Upload generated file directly to Cloudflare R2
        const generatedFile = new File([blob], "email-header.png", { type: "image/png" });
        const res = await uploadMediaFile(generatedFile);
        await onSaveHeader(res.url, "AUTO", includeInInvoice, includeInEmail);
        onToast("Auto-generated email header saved successfully");
        onClose();
      } else {
        // Custom banner upload
        const targetUrl = customBannerUrl || _currentHeaderUrl;
        if (!targetUrl) {
          onToast("Please select a banner image file to upload");
          setIsSaving(false);
          return;
        }

        await onSaveHeader(targetUrl, "CUSTOM", includeInInvoice, includeInEmail);
        onToast("Custom email header saved successfully");
        onClose();
      }
    } catch {
      onToast("Failed to save email header");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card rounded-3xl w-full max-w-2xl overflow-hidden shadow-popover border border-border-hairline flex flex-col max-h-[92vh] font-sans text-on-surface animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-border-hairline flex items-center justify-between bg-surface-low">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-on-surface font-sans">
              Email & Document Header
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Customize the branded banner atop your client emails, invoices, and receipts.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:bg-surface-high hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 pb-2 border-b border-border-hairline flex gap-2 bg-card">
          <button
            type="button"
            onClick={() => setActiveTab("auto")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "auto"
                ? "bg-card text-on-surface shadow-2xs border border-border-hairline"
                : "bg-surface-low text-muted hover:text-on-surface hover:bg-surface-high border border-transparent"
            }`}
          >
            <Sparkles size={14} className="text-primary" />
            Auto-Generate Header
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "custom"
                ? "bg-card text-on-surface shadow-2xs border border-border-hairline"
                : "bg-surface-low text-muted hover:text-on-surface hover:bg-surface-high border border-transparent"
            }`}
          >
            <ImageIcon size={14} className="text-primary" />
            Upload Custom Banner
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-card">
          {activeTab === "auto" ? (
            <div className="space-y-5">
              {/* Live Preview Card */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-2">
                  Live Banner Preview (1200×360)
                </label>
                <div className="relative w-full aspect-[10/3] rounded-2xl border border-border-hairline bg-surface-low overflow-hidden shadow-xs flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain"
                    style={{ imageRendering: "auto" }}
                  />
                </div>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface">
                    Header Title
                  </label>
                  <input
                    type="text"
                    value={headerTitle}
                    onChange={e => setHeaderTitle(e.target.value)}
                    placeholder="e.g. SHOPWUS"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-border-hairline bg-surface-low text-on-surface focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface">
                    Caption / Subtitle
                  </label>
                  <input
                    type="text"
                    value={headerCaption}
                    onChange={e => setHeaderCaption(e.target.value)}
                    placeholder="e.g. Shop With Us"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-border-hairline bg-surface-low text-on-surface focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>
              </div>

              {/* Logo Picker in Generator */}
              <div className="bg-surface-low border border-border-hairline rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0 border border-border-hairline">
                    {customLogoUrl ? (
                      <img
                        src={customLogoUrl}
                        alt="Logo"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg font-mono">
                        {headerTitle ? headerTitle.charAt(0).toUpperCase() : "S"}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-on-surface block">
                      Generator Logo Mark
                    </span>
                    <span className="text-[11px] text-muted">
                      {customLogoUrl ? "Custom logo active" : "Using initial monogram"}
                    </span>
                  </div>
                </div>

                <label className="cursor-pointer inline-flex items-center gap-1.5 bg-card hover:bg-surface-high text-on-surface border border-border-hairline px-3.5 py-2 rounded-xl text-xs font-medium shadow-2xs transition-colors select-none">
                  {isUploadingLogo ? (
                    <Loader2 size={13} className="animate-spin text-primary" />
                  ) : (
                    <Upload size={13} />
                  )}
                  <span>{customLogoUrl ? "Change Logo" : "Upload Logo"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={handleLogoFileChange}
                    disabled={isUploadingLogo}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Custom Banner Uploader */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-2">
                  Custom Banner Graphic
                </label>
                <div className="relative w-full aspect-[10/3] rounded-2xl border-2 border-dashed border-border-hairline bg-surface-low hover:bg-surface-high transition-colors flex flex-col items-center justify-center p-4 text-center group cursor-pointer overflow-hidden">
                  {customBannerUrl ? (
                    <img
                      src={customBannerUrl}
                      alt="Custom Banner Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-card shadow-xs border border-border-hairline flex items-center justify-center mx-auto text-muted">
                        <Upload size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-on-surface">
                          Click or drag banner image here
                        </p>
                        <p className="text-[11px] text-muted mt-0.5">
                          Recommended ratio: 10:3 or 1200×360px · PNG, JPG, WEBP
                        </p>
                      </div>
                    </div>
                  )}
                  {isUploadingBanner && (
                    <div className="absolute inset-0 bg-card/80 backdrop-blur-xs flex items-center justify-center">
                      <Loader2 size={24} className="animate-spin text-primary" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleCustomBannerFileChange}
                    disabled={isUploadingBanner}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Placement Preferences Checkboxes */}
        <div className="px-6 py-3.5 bg-surface-low border-t border-border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-on-surface">Header Visibility:</span>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none text-on-surface-variant">
              <input
                type="checkbox"
                checked={includeInInvoice}
                onChange={e => setIncludeInInvoice(e.target.checked)}
                className="w-4 h-4 rounded border-border-hairline text-primary focus:ring-0 cursor-pointer accent-primary"
              />
              <span className="font-medium text-xs">Add to Invoice</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none text-on-surface-variant">
              <input
                type="checkbox"
                checked={includeInEmail}
                onChange={e => setIncludeInEmail(e.target.checked)}
                className="w-4 h-4 rounded border-border-hairline text-primary focus:ring-0 cursor-pointer accent-primary"
              />
              <span className="font-medium text-xs">Add to Email</span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border-hairline bg-surface-low flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving || isUploadingLogo || isUploadingBanner}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface bg-surface-low hover:bg-surface-high border border-border-hairline transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploadingLogo || isUploadingBanner}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin text-white" />
                <span>Generating & Saving…</span>
              </>
            ) : (
              <>
                <Check size={14} />
                <span>Apply Header</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
