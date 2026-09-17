import type React from "react";
import type { UserSession } from "./auth";
import type { ButtonRadiusType, CurrencyCode } from "./common";

export interface CurrentStudioResult {
  studioId: string;
  studioName: string;
  slug: string;
  userName: string;
  userRole: string;
  initials: string;
  profile: BusinessProfile | undefined;
  session: UserSession | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/** Classifies the business model to drive dynamic CTA labels and studio behaviour. */
export type BusinessType = "service" | "sales" | "retail" | "ecommerce";

// Business and studio profile types
export type SocialChannelType =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin"
  | "x"
  | "youtube"
  | "whatsapp"
  | "threads"
  | "pinterest"
  | "website";

export interface SocialChannel {
  id: string;
  type: SocialChannelType;
  connected: boolean;
  label: string;
  handle: string;
  url: string;
  lastSynced?: string;
  description?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  role?: string;
  eventType: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  image: string;
  order?: number;
  isCover?: boolean;
  gallery?: string[];
  stats?: string;
  client?: string;
  year?: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  button: string;
  pageBackground?: string;
  cardBackground?: string;
  text: string;
}

export interface ThemePreset {
  name: string;
  colors: ColorScheme;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  priceType?: "fixed" | "range";
  isFeatured?: boolean;
}

export interface BusinessProfile {
  id: string;
  businessId?: string;
  businessName: string;
  slug: string;
  tagline: string;
  description: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  logoUrl?: string;
  bannerUrl?: string;
  emailHeaderUrl?: string;
  headerType?: "AUTO" | "CUSTOM";
  includeHeaderInInvoice?: boolean;
  includeHeaderInEmail?: boolean;
  googleReviewsLink?: string;
  services: ServiceItem[];
  socialChannels: SocialChannel[];
  reviews: ReviewItem[];
  portfolio: PortfolioProject[];
  operatingHours: string;
  timeFrom: string;
  timeTo: string;
  byAppointmentOnly: boolean;
  whatsAppNumber: string;
  emailAddress: string;
  physicalAddress: string;
  colors: ColorScheme;
  buttonRadius: ButtonRadiusType;
  currency?: CurrencyCode;
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  portfolioCategories?: string[];
  showServices?: boolean;
  showPortfolio?: boolean;
  showReviews?: boolean;
  footerEyebrow?: string;
  footerTitle?: string;
  footerDescription?: string;
  showFooterCta?: boolean;
  businessType?: BusinessType;
  totalCustomers?: number;
  isVerified?: boolean;
  updatedAt: string;
}

export interface IdentitySectionProps {
  name: string;
  setName: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  slugStatus: "checking" | "available" | "taken" | "idle";
  website: string;
  setWebsite: (v: string) => void;
  email: string;
  setEmail?: (v: string) => void;
  currency: CurrencyCode;
  setCurrency: (v: CurrencyCode) => void;
  businessType?: BusinessType;
  setBusinessType?: (v: BusinessType) => void;
  about: string;
  setAbout: (v: string) => void;
  logoUrl?: string;
  setLogoUrl: (v: string) => void;
  isUploadingLogo: boolean;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  handleDeleteLogo?: () => Promise<void> | void;
  bannerUrl?: string;
  setBannerUrl?: (v: string) => void;
  isUploadingBanner?: boolean;
  handleBannerUpload?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  handleDeleteBanner?: () => Promise<void> | void;
  onToast: (msg: string) => void;
}

export interface ChannelsSectionProps {
  googleReviewsLink: string;
  setGoogleReviewsLink: (v: string) => void;
  showReviews: boolean;
  setShowReviews: (v: boolean) => void;
  isSyncingReviews: boolean;
  handleSyncReviews: () => void;
  channels: SocialChannel[];
  updateChannelHandle: (id: string, handle: string) => void;
  toggleChannel: (id: string) => void;
  onToast: (msg: string) => void;
}

export interface ServicesSectionProps {
  services: ServiceItem[];
  showServices: boolean;
  setShowServices: (v: boolean) => void;
  editingServiceId: string | null;
  setEditingServiceId: (id: string | null) => void;
  updateService: (id: string, patch: Partial<ServiceItem>) => void;
  removeService: (id: string) => void;
  showAddService: boolean;
  setShowAddService: (v: boolean) => void;
  newServiceInput: string;
  setNewServiceInput: (v: string) => void;
  newServiceCategory: string;
  setNewServiceCategory: (v: string) => void;
  newServiceDesc: string;
  setNewServiceDesc: (v: string) => void;
  newServicePriceType: "fixed" | "range";
  setNewServicePriceType: (v: "fixed" | "range") => void;
  newServicePrice: string;
  setNewServicePrice: (v: string) => void;
  newServiceMinPrice: string;
  setNewServiceMinPrice: (v: string) => void;
  newServiceMaxPrice: string;
  setNewServiceMaxPrice: (v: string) => void;
  currency?: string;
  addService: () => void;
  categories: string[];
  addCategory: (cat: string) => void;
  removeCategory: (cat: string) => void;
}

export interface CategoryDropdownProps {
  value?: string;
  onChange: (category: string) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
  label?: string;
  placeholder?: string;
  maxCategories?: number;
  size?: "sm" | "md";
  labelClassName?: string;
  buttonClassName?: string;
}

export interface PortfolioSectionProps {
  portfolio: PortfolioProject[];
  categories: string[];
  addPortfolioCategory: (cat: string) => void;
  removePortfolioCategory: (cat: string) => void;
  showPortfolio: boolean;
  setShowPortfolio: (v: boolean) => void;
  showAddProjectModal: boolean;
  setShowAddProjectModal: (v: boolean) => void;
  showManageGalleryModal: boolean;
  setShowManageGalleryModal: (v: boolean) => void;
  newProject: Partial<PortfolioProject>;
  setNewProject: React.Dispatch<React.SetStateAction<Partial<PortfolioProject>>>;
  isUploadingProjectImage: boolean;
  isUploadingGalleryImages?: boolean;
  handleProjectImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGalleryImagesUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeGalleryImageFromNewProject?: (index: number) => void;
  handleAddProject: (e: React.FormEvent) => void;
  removeProject: (id: string) => void;
  moveProject: (index: number, direction: "up" | "down") => void;
  draggedProjectIndex: number | null;
  dragOverProjectIndex: number | null;
  handleDragStart: (index: number) => void;
  handleDragEnter: (index: number) => void;
  handleDragEnd: () => void;
  onToast: (msg: string) => void;
}

export interface ContactSectionProps {
  hours: string;
  setHours: (v: string) => void;
  timeFrom: string;
  setTimeFrom: (v: string) => void;
  timeTo: string;
  setTimeTo: (v: string) => void;
  byAppointmentOnly: boolean;
  setByAppointmentOnly: (v: boolean) => void;
}

export interface FooterSectionProps {
  footerEyebrow: string;
  setFooterEyebrow: (v: string) => void;
  footerTitle: string;
  setFooterTitle: (v: string) => void;
  footerDescription: string;
  setFooterDescription: (v: string) => void;
  showFooterCta: boolean;
  setShowFooterCta: (v: boolean) => void;
}

export interface AppearanceSectionProps {
  colors: ColorScheme;
  setColors: (c: ColorScheme) => void;
  radius: ButtonRadiusType;
  setRadius: (r: ButtonRadiusType) => void;
}

export interface StationeryCardProps {
  profile: BusinessProfile;
  slug?: string;
  isFlipped: boolean;
  setIsFlipped: (v: boolean) => void;
  setQuoteModalOpen?: (v: boolean) => void;
  handleCopyLink?: () => void;
  primaryColor: string;
  secondaryColor: string;
  buttonColor?: string;
  textColor?: string;
  cardBgColor?: string;
  monogram: string;
  averageRating?: string | number;
  totalReviews?: number;
  whatsAppLink?: string;
  radiusClass?: string;
}

export interface StudioHighlightsCardProps {
  profile: BusinessProfile;
  totalCustomers?: number;
  setQuoteModalOpen: (v: boolean) => void;
  handleCopyLink: () => void;
  whatsAppLink: string;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  cardBgColor?: string;
  radiusClass: string;
}

export interface StudioServicesSectionProps {
  profile: BusinessProfile;
  setQuoteModalOpen: (v: boolean) => void;
  setQuoteForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      service: string;
      eventDate: string;
      budget: string;
      message: string;
    }>
  >;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  textColor?: string;
  radiusClass: string;
}

export interface StudioPortfolioSectionProps {
  portfolio: PortfolioProject[];
  setSelectedProject: (p: PortfolioProject | null) => void;
  setQuoteModalOpen: (v: boolean) => void;
  businessType?: BusinessType;
  primaryColor: string;
  buttonColor: string;
  textColor?: string;
  radiusClass: string;
}

export interface StudioSocialSectionProps {
  profile: BusinessProfile;
  primaryColor?: string;
  textColor?: string;
  radiusClass?: string;
}

export interface StudioReviewsSectionProps {
  reviews: ReviewItem[];
  averageRating: string | number;
  totalReviews: number;
  setReviewModalOpen: (v: boolean) => void;
  googleReviewsLink?: string;
  primaryColor: string;
  buttonColor: string;
  textColor?: string;
  radiusClass: string;
}

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewForm: {
    author: string;
    eventType: string;
    rating: number;
    comment: string;
  };
  setReviewForm: React.Dispatch<
    React.SetStateAction<{
      author: string;
      eventType: string;
      rating: number;
      comment: string;
    }>
  >;
  reviewSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  primaryColor: string;
  buttonColor: string;
  radiusClass: string;
}

export interface ProjectModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onInquire: () => void;
  primaryColor: string;
}

export interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BusinessProfile;
  quoteForm: {
    name: string;
    email: string;
    phone: string;
    service: string;
    eventDate: string;
    budget: string;
    message: string;
  };
  setQuoteForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      service: string;
      eventDate: string;
      budget: string;
      message: string;
    }>
  >;
  quoteSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  primaryColor: string;
  buttonColor: string;
  radiusClass: string;
}

export interface StudioNavbarProps {
  profile: BusinessProfile;
  slug: string;
  isFromSettings: boolean;
  isScrolled: boolean;
  activeSection: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  setQuoteModalOpen: (v: boolean) => void;
  handleCopyLink: () => void;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  textColor: string;
  pageBgColor?: string;
  monogram: string;
  radiusClass: string;
}

export interface StudioFooterProps {
  profile: BusinessProfile;
  primaryColor: string;
  secondaryColor: string;
  monogram: string;
}

export interface StorefrontPageProps {
  initialProfile?: BusinessProfile;
  slug?: string;
}

export type ElanEventsPageProps = StorefrontPageProps;

export interface ProfileIdentityCardProps {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  studioName?: string;
  onSave: (updates: {
    name: string;
    email: string;
    phone: string;
    studioName?: string;
  }) => Promise<void>;
}

export interface ProfileSecurityCardProps {
  email: string;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export interface ProfileHeaderCardProps {
  business: Partial<BusinessProfile> | null;
  onUpdateHeader: (
    headerUrl: string,
    headerType: "AUTO" | "CUSTOM",
    includeHeaderInInvoice: boolean,
    includeHeaderInEmail: boolean
  ) => Promise<void>;
  onToast: (msg: string) => void;
}

export interface EditHeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  tagline: string;
  logoUrl?: string;
  currentHeaderUrl?: string;
  currentHeaderType?: "AUTO" | "CUSTOM";
  initialIncludeInInvoice?: boolean;
  initialIncludeInEmail?: boolean;
  onSaveHeader: (
    headerUrl: string,
    headerType: "AUTO" | "CUSTOM",
    includeHeaderInInvoice: boolean,
    includeHeaderInEmail: boolean
  ) => Promise<void>;
  onToast: (msg: string) => void;
}

export interface UseServicesSettingsOptions {
  notify: (message: string) => void;
  categories?: string[];
}

export interface UseContactSettingsOptions {
  notify: (message: string) => void;
}

export interface UsePortfolioSettingsOptions {
  notify: (message: string) => void;
}
