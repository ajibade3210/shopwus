"use client";

import { ArrowRight, Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WhatsAppIcon } from "@/components/shared";
import { CartProvider } from "@/components/storefront/cart-context";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { CartFloatingButton } from "@/components/storefront/cart-floating-button";
import {
  APP_CONFIG,
  AUTO_QUOTE_MODAL_DELAY_MS,
  BUSINESS_TYPE_CTA_MAP,
  CUSTOM_EVENTS,
  DEFAULT_BUSINESS_TYPE,
  DEFAULT_FOOTER_DESCRIPTION,
  DEFAULT_FOOTER_EYEBROW,
  DEFAULT_FOOTER_TITLE,
  STORAGE_KEYS,
} from "@/constants";
import {
  createWhatsAppConsultationUrl,
  getBusinessBySlug,
  submitConsultationInquiry,
  submitReview,
} from "@/lib/api";
import type { BusinessProfile, PortfolioProject, ServiceItem, StorefrontPageProps } from "@/types";
import { getButtonRadiusClass, isDarkColor } from "@/utils/helpers";
import { NotFoundView } from "./not-found-view";
import { ConsultationModal } from "./storefront/consultation-modal";
import { StudioPortfolioSection } from "./storefront/portfolio-section";
import { ProjectModal } from "./storefront/project-modal";
import { ReviewModal } from "./storefront/review-modal";
import { StudioReviewsSection } from "./storefront/reviews-section";
import { StudioServicesSection } from "./storefront/services-section";
import { StudioSocialSection } from "./storefront/social-section";
import { StationeryCard } from "./storefront/stationery-card";
import { StudioFooter } from "./storefront/studio-footer";
import { StudioHighlightsCard } from "./storefront/studio-highlights-card";
import { StudioNavbar } from "./storefront/studio-navbar";

export function StorefrontPage({
  initialProfile,
  slug = APP_CONFIG.defaultSlug,
  hasOuterLayout = true,
}: StorefrontPageProps) {
  // Live dynamic profile state
  const [profile, setProfile] = useState<BusinessProfile | null>(initialProfile || null);
  const [isNotFound, setIsNotFound] = useState(false);

  // Fetch freshest profile and subscribe to settings changes
  useEffect(() => {
    getBusinessBySlug(slug)
      .then(res => {
        if (res) {
          setProfile(res);
          setIsNotFound(false);
        } else {
          setIsNotFound(true);
        }
      })
      .catch(() => {
        setIsNotFound(true);
      });

    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BusinessProfile>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
        setIsNotFound(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener(CUSTOM_EVENTS.profileUpdated, handleProfileUpdate);
      return () => window.removeEventListener(CUSTOM_EVENTS.profileUpdated, handleProfileUpdate);
    }
  }, [slug]);

  // UI state
  const [isFromSettings, setIsFromSettings] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check if visitor is studio admin previewing from settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const fromParam = params.get("from");
      const previewParam = params.get("preview");
      const referrer = document.referrer || "";
      if (
        fromParam === "settings" ||
        fromParam === "admin" ||
        previewParam === "true" ||
        referrer.includes("/vendor") ||
        referrer.includes("/settings") ||
        referrer.includes("/leads") ||
        referrer.includes("/customers")
      ) {
        setIsFromSettings(true);
      }
    }
  }, []);

  // Modals
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // Form states
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    eventDate: "",
    budget: "50000",
    message: "",
  });
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    author: "",
    eventType: "Luxury Wedding",
    rating: 5,
    comment: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const customerCount = profile?.totalCustomers ?? 0;

  // Automatically trigger Get a Quote modal once after 1 minute of customer dwell time
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const hasSeenModal = sessionStorage.getItem(STORAGE_KEYS.autoQuoteModalSeen);
      if (hasSeenModal === "true") return;

      const timer = setTimeout(() => {
        setQuoteModalOpen(true);
        sessionStorage.setItem(STORAGE_KEYS.autoQuoteModalSeen, "true");
      }, AUTO_QUOTE_MODAL_DELAY_MS);

      return () => clearTimeout(timer);
    } catch {
      // Fallback if sessionStorage is disabled/blocked in private mode
      const timer = setTimeout(() => {
        setQuoteModalOpen(true);
      }, AUTO_QUOTE_MODAL_DELAY_MS);

      return () => clearTimeout(timer);
    }
  }, []);

  // Scroll listener for sticky header & active nav section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ["social", "portfolio", "services", "reviews"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set default quote service once profile loads
  useEffect(() => {
    if (profile?.services && profile.services.length > 0 && !quoteForm.service) {
      const firstService = profile.services[0];
      const serviceName = typeof firstService === "string" ? firstService : firstService.name;
      setQuoteForm(prev => ({ ...prev, service: serviceName }));
    }
  }, [profile?.services, quoteForm.service]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const primaryColor = profile?.colors?.primary || "#000000";
  const secondaryColor = profile?.colors?.secondary || "#0058BE";
  const buttonColor = profile?.colors?.button || "#000000";
  const textColor = profile?.colors?.text || "#191C1D";
  const pageBgColor = profile?.colors?.pageBackground || "#faf8f5";
  const cardBgColor = profile?.colors?.cardBackground || "#faf6f0";
  const isCardDark = isDarkColor(cardBgColor);
  const radiusClass = getButtonRadiusClass(profile?.buttonRadius);

  // Check if WhatsApp is enabled in connected channels and has a valid number
  const whatsAppChannel = profile?.socialChannels?.find(c => c.type === "whatsapp");
  const whatsAppPhone = whatsAppChannel?.handle || profile?.whatsAppNumber || profile?.phone;
  const isWhatsAppEnabled =
    (whatsAppChannel ? whatsAppChannel.connected : true) && Boolean(whatsAppPhone?.trim());

  // Computed review stats
  const averageRating = useMemo(() => {
    if (!profile?.reviews || profile.reviews.length === 0) return "5.0";
    const sum = profile.reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (sum / profile.reviews.length).toFixed(1);
  }, [profile?.reviews]);

  const totalReviews = profile?.reviews?.length || 0;

  const handleCopyLink = () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `https://shopwus.com/${profile?.slug || slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast("Business profile link copied to clipboard!");
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setQuoteSubmitting(true);
    try {
      const selectedService =
        quoteForm.service || (profile.services as ServiceItem[])?.[0]?.name || "";

      await submitConsultationInquiry(profile.slug || slug, {
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        service: selectedService,
        eventDate: quoteForm.eventDate || new Date().toISOString().slice(0, 10),
        budget: Number(quoteForm.budget) || 50000,
        message: quoteForm.message || "Consultation request submitted via public profile.",
      });

      const whatsappUrl = createWhatsAppConsultationUrl({
        studioPhone: whatsAppPhone || profile.phone,
        studioName: profile.businessName || "Studio",
        clientName: quoteForm.name,
        clientPhone: quoteForm.phone,
        clientEmail: quoteForm.email,
        service: selectedService,
        eventDate: quoteForm.eventDate,
        budget: quoteForm.budget,
        message: quoteForm.message,
      });

      if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }

      setQuoteSubmitting(false);
      setQuoteModalOpen(false);
      try {
        sessionStorage.setItem(STORAGE_KEYS.autoQuoteModalSeen, "true");
      } catch {}
      showToast("Consultation inquiry saved! Opening WhatsApp to start direct chat...");
      setQuoteForm({
        name: "",
        email: "",
        phone: "",
        service: (profile.services as ServiceItem[])?.[0]?.name || "",
        eventDate: "",
        budget: "50000",
        message: "",
      });
    } catch {
      setQuoteSubmitting(false);
      showToast("Failed to submit. Please try again or reach out directly on WhatsApp.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setReviewSubmitting(true);
    try {
      await submitReview({
        studioSlug: profile.slug || slug,
        author: reviewForm.author,
        eventType: reviewForm.eventType,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        role: "Verified Client",
      });
      setReviewSubmitting(false);
      setReviewModalOpen(false);
      showToast("Thank you! Your review has been submitted.");
      setReviewForm({
        author: "",
        eventType: "Luxury Wedding",
        rating: 5,
        comment: "",
      });
    } catch {
      setReviewSubmitting(false);
      showToast("Failed to submit review. Please try again.");
    }
  };

  if (isNotFound) {
    return <NotFoundView slug={slug} />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const monogram = profile.businessName ? profile.businessName[0].toUpperCase() : "Ś";

  const defaultStudioPhoneClean = APP_CONFIG.defaultStudioPhone.replace(/[^0-9]/g, "");
  const cleanPhone = (whatsAppPhone || profile.phone || APP_CONFIG.defaultStudioPhone).replace(
    /[^0-9]/g,
    ""
  );
  const whatsAppLink = `https://wa.me/${cleanPhone || defaultStudioPhoneClean}`;

  const content = (
    <div
      className="min-h-screen font-sans antialiased selection:bg-primary/20 selection:text-primary flex flex-col justify-between"
      style={{ backgroundColor: pageBgColor, color: textColor }}
    >
      {/* Floating Studio Navbar (Only rendered if no outer layout) */}
      {!hasOuterLayout && (
        <StudioNavbar
          profile={profile}
          slug={slug}
          isFromSettings={isFromSettings}
          isScrolled={isScrolled}
          activeSection={activeSection}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setQuoteModalOpen={setQuoteModalOpen}
          handleCopyLink={handleCopyLink}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          buttonColor={buttonColor}
          textColor={textColor}
          pageBgColor={pageBgColor}
          monogram={monogram}
          radiusClass={radiusClass}
        />
      )}

      {/* Main Studio Body */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 pt-10 pb-20 space-y-24">
        {/* HERO SECTION: Interactive 3D Stationery Card & Editorial Narrative */}
        <section id="home" className="pt-4 sm:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* LEFT: Flip Stationery Card */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full max-w-[480px] h-[580px]">
                <StationeryCard
                  profile={profile}
                  slug={slug}
                  isFlipped={isFlipped}
                  setIsFlipped={setIsFlipped}
                  setQuoteModalOpen={setQuoteModalOpen}
                  handleCopyLink={handleCopyLink}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  buttonColor={buttonColor}
                  textColor={textColor}
                  cardBgColor={cardBgColor}
                  monogram={monogram}
                  averageRating={averageRating}
                  totalReviews={totalReviews}
                  whatsAppLink={whatsAppLink}
                  radiusClass={radiusClass}
                />
              </div>
            </div>

            {/* RIGHT: Studio Operational Status & Presence Card */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <StudioHighlightsCard
                profile={profile}
                totalCustomers={customerCount}
                setQuoteModalOpen={setQuoteModalOpen}
                handleCopyLink={handleCopyLink}
                whatsAppLink={whatsAppLink}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                buttonColor={buttonColor}
                cardBgColor={cardBgColor}
                radiusClass={radiusClass}
              />
            </div>
          </div>
        </section>

        {/* SECTION: Connected Social Networks & Verified Channels */}
        {profile.socialChannels?.some(c => c.connected) && (
          <StudioSocialSection
            profile={profile}
            primaryColor={primaryColor}
            textColor={textColor}
            radiusClass={radiusClass}
          />
        )}

        {/* SECTION: Portfolio Gallery */}
        {profile.showPortfolio !== false && profile.portfolio && profile.portfolio.length > 0 && (
          <StudioPortfolioSection
            portfolio={profile.portfolio}
            setSelectedProject={setSelectedProject}
            setQuoteModalOpen={setQuoteModalOpen}
            businessType={profile.businessType}
            primaryColor={primaryColor}
            buttonColor={buttonColor}
            textColor={textColor}
            radiusClass={radiusClass}
          />
        )}

        {/* SECTION: Curated Services */}
        {profile.showServices !== false && profile.services && profile.services.length > 0 && (
          <StudioServicesSection
            profile={profile}
            setQuoteModalOpen={setQuoteModalOpen}
            setQuoteForm={setQuoteForm}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            buttonColor={buttonColor}
            textColor={textColor}
            radiusClass={radiusClass}
          />
        )}

        {/* SECTION: Authenticated Client Reviews */}
        {profile.showReviews !== false && profile.reviews && profile.reviews.length > 0 && (
          <StudioReviewsSection
            reviews={profile.reviews}
            averageRating={averageRating}
            totalReviews={totalReviews}
            setReviewModalOpen={setReviewModalOpen}
            googleReviewsLink={profile.googleReviewsLink}
            primaryColor={primaryColor}
            buttonColor={buttonColor}
            textColor={textColor}
            radiusClass={radiusClass}
          />
        )}

        {/* CTA BANNER */}
        {profile.showFooterCta !== false && (
          <section
            style={{ backgroundColor: cardBgColor }}
            className={`rounded-3xl p-8 sm:p-14 text-center space-y-6 border transition-colors ${
              isCardDark
                ? "border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
                : "border-border-hairline shadow-card"
            }`}
          >
            <div className="max-w-2xl mx-auto space-y-3">
              <span
                style={{ color: primaryColor }}
                className="text-[10px] uppercase tracking-[0.2em] font-semibold block"
              >
                {profile.footerEyebrow || DEFAULT_FOOTER_EYEBROW}
              </span>
              <h2
                style={{ color: textColor }}
                className="font-serif text-3xl sm:text-4xl font-normal"
              >
                {profile.footerTitle || DEFAULT_FOOTER_TITLE}
              </h2>
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isCardDark ? "text-white/70" : "text-outline"
                }`}
              >
                {profile.footerDescription || DEFAULT_FOOTER_DESCRIPTION}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setQuoteModalOpen(true)}
                style={{ backgroundColor: buttonColor }}
                className={`text-white text-sm font-medium px-8 py-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2 ${radiusClass}`}
              >
                <span>{BUSINESS_TYPE_CTA_MAP[profile.businessType ?? DEFAULT_BUSINESS_TYPE]}</span>
                <ArrowRight size={15} />
              </button>

              {isWhatsAppEnabled && (
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`bg-card hover:bg-surface-low text-on-surface border border-border-hairline text-sm font-medium px-8 py-3.5 transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${radiusClass}`}
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>WhatsApp Us</span>
                </a>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Studio Bottom Footer (Only rendered when no outer layout wraps the page) */}
      {!hasOuterLayout && (
        <StudioFooter
          profile={profile}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          monogram={monogram}
        />
      )}

      {/* Modals & Popups */}
      <ConsultationModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        profile={profile}
        quoteForm={quoteForm}
        setQuoteForm={setQuoteForm}
        quoteSubmitting={quoteSubmitting}
        onSubmit={handleQuoteSubmit}
        primaryColor={primaryColor}
        buttonColor={buttonColor}
        radiusClass={radiusClass}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        reviewForm={reviewForm}
        setReviewForm={setReviewForm}
        reviewSubmitting={reviewSubmitting}
        onSubmit={handleReviewSubmit}
        primaryColor={primaryColor}
        buttonColor={buttonColor}
        radiusClass={radiusClass}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={() => {
          setSelectedProject(null);
          setQuoteModalOpen(true);
        }}
        primaryColor={primaryColor}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-lowest text-on-surface text-xs px-5 py-3.5 rounded-2xl shadow-popover flex items-center gap-3 border border-border-hairline animate-fade-in">
          <div
            style={{ backgroundColor: primaryColor }}
            className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
          >
            <Check size={12} />
          </div>
          <span className="font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-outline hover:text-on-surface ml-2 cursor-pointer transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* E-Commerce Cart Drawer & Floating Bag Trigger (Only rendered if no outer layout) */}
      {!hasOuterLayout && (
        <>
          <CartDrawer
            slug={profile.slug || slug}
            studioName={profile.businessName}
            buttonColor={buttonColor}
            radiusClass={radiusClass}
          />
          <CartFloatingButton buttonColor={buttonColor} radiusClass={radiusClass} />
        </>
      )}
    </div>
  );

  if (hasOuterLayout) {
    return content;
  }

  return <CartProvider slug={profile.slug || slug}>{content}</CartProvider>;
}
