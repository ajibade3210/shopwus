"use client";

import type React from "react";
import { useState } from "react";
import { uploadPortfolioImage } from "@/lib/api";

interface UseStorefrontSettingsOptions {
  notify: (message: string) => void;
}

export function useStorefrontSettings({ notify }: UseStorefrontSettingsOptions) {
  // Banner Settings
  const [showStorefrontBanner, setShowStorefrontBanner] = useState<boolean>(true);
  const [storefrontBannerUrl, setStorefrontBannerUrl] = useState<string>("");
  const [storefrontBannerHeader, setStorefrontBannerHeader] = useState<string>("");
  const [storefrontBannerBody, setStorefrontBannerBody] = useState<string>("");
  const [storefrontBannerTextColor, setStorefrontBannerTextColor] = useState<string>("#FFFFFF");
  const [storefrontBannerBgColor, setStorefrontBannerBgColor] = useState<string>("#0F172A");

  // Sales Section Settings
  const [showStorefrontSales, setShowStorefrontSales] = useState<boolean>(true);
  const [storefrontSalesPosition, setStorefrontSalesPosition] = useState<"top" | "bottom">(
    "bottom"
  );
  const [storefrontSalesUrl, setStorefrontSalesUrl] = useState<string>("");
  const [storefrontSalesHeader, setStorefrontSalesHeader] = useState<string>("");
  const [storefrontSalesBody, setStorefrontSalesBody] = useState<string>("");
  const [storefrontSalesBtnText, setStorefrontSalesBtnText] = useState<string>("");
  const [storefrontSalesBtnUrl, setStorefrontSalesBtnUrl] = useState<string>("");
  const [storefrontSalesLinkType, setStorefrontSalesLinkType] = useState<
    "product" | "category" | "whatsapp" | "custom"
  >("custom");

  // Upload States
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingSalesImage, setIsUploadingSalesImage] = useState(false);

  const handleStorefrontBannerUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<string | null> => {
    const file = e.target.files?.[0];
    if (!file) return null;
    setIsUploadingBanner(true);
    try {
      const res = await uploadPortfolioImage(file);
      setStorefrontBannerUrl(res.url);
      notify("Storefront banner image uploaded successfully");
      return res.url;
    } catch {
      notify("Failed to upload storefront banner image");
      return null;
    } finally {
      setIsUploadingBanner(false);
      e.target.value = "";
    }
  };

  const handleStorefrontSalesImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<string | null> => {
    const file = e.target.files?.[0];
    if (!file) return null;
    setIsUploadingSalesImage(true);
    try {
      const res = await uploadPortfolioImage(file);
      setStorefrontSalesUrl(res.url);
      notify("Sales showcase image uploaded successfully");
      return res.url;
    } catch {
      notify("Failed to upload sales showcase image");
      return null;
    } finally {
      setIsUploadingSalesImage(false);
      e.target.value = "";
    }
  };

  return {
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
  };
}
