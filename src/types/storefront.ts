import type { ReactNode } from "react";
import type { Category, Product } from "./product";

import type { BusinessProfile } from "./profile";

export type StorefrontSortOption = "featured" | "newest" | "price-asc" | "price-desc";

export interface StorefrontBannerSectionProps {
  profile?: BusinessProfile | null;
}

export interface StorefrontBestSellersProps {
  products: Product[];
}

export interface StorefrontCategoryPillsProps {
  categories: Category[];
  selectedCategorySlug?: string;
  onSelectCategory: (categorySlug: string) => void;
  totalProductCount?: number;
}

export interface StorefrontCategoryViewProps {
  categorySlug: string;
}

export interface StorefrontProductDetailViewProps {
  slug: string;
  productSlug: string;
}

export interface StorefrontProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export interface StorefrontSalesSectionProps {
  profile?: BusinessProfile | null;
}

export interface StorefrontPreferencesSectionProps {
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
}

export interface StorefrontContextType {
  profile: BusinessProfile | null;
  slug: string;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  isNotFound: boolean;
  isLoading: boolean;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isQuoteModalOpen: boolean;
  setIsQuoteModalOpen: (open: boolean) => void;
  activeQuoteService?: string;
  setActiveQuoteService: (service?: string) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  textColor: string;
  pageBgColor: string;
  cardBgColor: string;
  buttonRadius: string;
  monogram: string;
  whatsAppLink: string;
  totalCustomers: number;
}

export interface UseStorefrontSettingsOptions {
  notify: (message: string) => void;
}

export interface CartProviderProps {
  children: ReactNode;
  slug: string;
}

export interface StorefrontLayoutInnerProps {
  children: ReactNode;
  slug: string;
}

export interface StudioLayoutProps {
  children: ReactNode;
}
