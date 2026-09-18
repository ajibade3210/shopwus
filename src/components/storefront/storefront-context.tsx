"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { CUSTOM_EVENTS } from "@/constants";
import { getBusinessBySlug } from "@/lib/api";
import { getStorefrontProducts } from "@/services/api/product.service";
import type { BusinessProfile, Category, Product, StorefrontContextType } from "@/types";

const StorefrontContext = createContext<StorefrontContextType | undefined>(undefined);

export function StorefrontProvider({
  slug,
  initialProfile,
  initialCategories = [],
  children,
}: {
  slug: string;
  initialProfile?: BusinessProfile | null;
  initialCategories?: Category[];
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<BusinessProfile | null>(initialProfile || null);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(!initialProfile);
  const [isNotFound, setIsNotFound] = useState(false);

  // Modal & Search states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [activeQuoteService, setActiveQuoteService] = useState<string | undefined>(undefined);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Fetch freshest profile and subscribe to profile updates
  useEffect(() => {
    let isMounted = true;
    if (!initialProfile) {
      setIsLoading(true);
    }
    getBusinessBySlug(slug)
      .then(res => {
        if (!isMounted) return;
        if (res) {
          setProfile(res);
          setIsNotFound(false);
        } else {
          setIsNotFound(true);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setIsNotFound(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    // Also fetch categories immediately on mount so the navbar dropdown is always populated
    getStorefrontProducts(slug, { limit: 1 })
      .then(prodRes => {
        if (!isMounted) return;
        if (prodRes?.categories && prodRes.categories.length > 0) {
          setCategories(prodRes.categories);
        }
      })
      .catch(() => {});

    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BusinessProfile>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
        setIsNotFound(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener(CUSTOM_EVENTS.profileUpdated, handleProfileUpdate);
      return () => {
        isMounted = false;
        window.removeEventListener(CUSTOM_EVENTS.profileUpdated, handleProfileUpdate);
      };
    }
    return () => {
      isMounted = false;
    };
  }, [slug, initialProfile]);

  // Keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const primaryColor = profile?.colors?.primary || "#000000";
  const secondaryColor = profile?.colors?.secondary || "#0058BE";
  const buttonColor = profile?.colors?.button || "#000000";
  const textColor = profile?.colors?.text || "#191C1D";
  const pageBgColor = profile?.colors?.pageBackground || "#faf8f5";
  const cardBgColor = profile?.colors?.cardBackground || "#faf6f0";
  const buttonRadius = profile?.buttonRadius || "rounded-xl";
  const monogram = profile?.businessName ? profile.businessName[0].toUpperCase() : "Ś";
  const whatsAppPhone = profile?.whatsAppNumber || profile?.phone || "";
  const cleanPhone = whatsAppPhone.replace(/[^0-9]/g, "");
  const whatsAppLink = `https://wa.me/${cleanPhone}`;
  const totalCustomers = profile?.totalCustomers ?? 0;

  return (
    <StorefrontContext.Provider
      value={{
        profile,
        slug,
        categories,
        setCategories,
        isNotFound,
        isLoading,
        isSearchOpen,
        setIsSearchOpen,
        selectedProduct,
        setSelectedProduct,
        isQuoteModalOpen,
        setIsQuoteModalOpen,
        activeQuoteService,
        setActiveQuoteService,
        isReviewModalOpen,
        setIsReviewModalOpen,
        primaryColor,
        secondaryColor,
        buttonColor,
        textColor,
        pageBgColor,
        cardBgColor,
        buttonRadius,
        monogram,
        whatsAppLink,
        totalCustomers,
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error("useStorefront must be used within a StorefrontProvider");
  }
  return context;
}

export function useOptionalStorefront() {
  return useContext(StorefrontContext);
}
