"use client";

import { useParams } from "next/navigation";
import React from "react";
import { CartProvider } from "@/components/storefront/cart-context";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { CartFloatingButton } from "@/components/storefront/cart-floating-button";
import { StorefrontProvider, useStorefront } from "@/components/storefront/storefront-context";
import { StorefrontProductModal } from "@/components/storefront/storefront-product-modal";
import { StorefrontSearchModal } from "@/components/storefront/storefront-search-modal";
import { ConsultationModal } from "@/components/studio/storefront/consultation-modal";
import { ReviewModal } from "@/components/studio/storefront/review-modal";
import { StudioFooter } from "@/components/studio/storefront/studio-footer";
import { StudioNavbar } from "@/components/studio/storefront/studio-navbar";
import { APP_CONFIG } from "@/constants";
import { submitConsultationInquiry, submitReview } from "@/lib/api";
import { createWhatsAppConsultationUrl } from "@/services/api/leads.service";
import type { StorefrontLayoutInnerProps, StudioLayoutProps } from "@/types";

function StorefrontLayoutInner({ children, slug }: StorefrontLayoutInnerProps) {
  const {
    profile,
    isQuoteModalOpen,
    setIsQuoteModalOpen,
    activeQuoteService,
    isReviewModalOpen,
    setIsReviewModalOpen,
    primaryColor,
    secondaryColor,
    monogram,
    buttonColor,
    buttonRadius,
    pageBgColor,
    textColor,
    selectedProduct,
    setSelectedProduct,
  } = useStorefront();

  const [quoteForm, setQuoteForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    eventDate: "",
    budget: "50000",
    message: "",
  });
  const [quoteSubmitting, setQuoteSubmitting] = React.useState(false);

  const [reviewForm, setReviewForm] = React.useState({
    author: "",
    eventType: "Client Project",
    rating: 5,
    comment: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = React.useState(false);

  // Sync activeQuoteService
  React.useEffect(() => {
    if (activeQuoteService) {
      setQuoteForm(prev => ({ ...prev, service: activeQuoteService }));
    } else if (profile?.services && profile.services.length > 0 && !quoteForm.service) {
      const first = profile.services[0];
      setQuoteForm(prev => ({ ...prev, service: typeof first === "string" ? first : first.name }));
    }
  }, [activeQuoteService, profile?.services, quoteForm.service]);

  const handleQuoteSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!profile) return;
    setQuoteSubmitting(true);
    try {
      await submitConsultationInquiry(profile.slug || slug, {
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        service: quoteForm.service || "General Inquiry",
        eventDate: quoteForm.eventDate || new Date().toISOString().slice(0, 10),
        budget: Number(quoteForm.budget) || 50000,
        message: quoteForm.message || "Inquiry submitted via storefront.",
      });

      const whatsAppPhone = profile.whatsAppNumber || profile.phone;
      if (whatsAppPhone?.trim()) {
        const whatsappUrl = createWhatsAppConsultationUrl({
          studioPhone: whatsAppPhone,
          studioName: profile.businessName || "Studio",
          clientName: quoteForm.name,
          clientPhone: quoteForm.phone,
          clientEmail: quoteForm.email,
          service: quoteForm.service,
          eventDate: quoteForm.eventDate,
          budget: quoteForm.budget,
          message: quoteForm.message,
        });

        if (typeof window !== "undefined") {
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        }
      }

      setQuoteSubmitting(false);
      setIsQuoteModalOpen(false);
      setQuoteForm({
        name: "",
        email: "",
        phone: "",
        service: "",
        eventDate: "",
        budget: "50000",
        message: "",
      });
    } catch {
      setQuoteSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.SubmitEvent) => {
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
      setIsReviewModalOpen(false);
      setReviewForm({
        author: "",
        eventType: "Client Project",
        rating: 5,
        comment: "",
      });
    } catch {
      setReviewSubmitting(false);
    }
  };

  const isService = profile?.businessType === "service";

  return (
    <div
      className="min-h-screen font-sans antialiased selection:bg-primary/20 selection:text-primary flex flex-col justify-between"
      style={{ backgroundColor: pageBgColor, color: textColor }}
    >
      {/* Persistent Navigation */}
      <StudioNavbar />

      {/* Global Search Modal */}
      <StorefrontSearchModal />

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Persistent Storefront Footer */}
      {profile && (
        <StudioFooter
          profile={profile}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          monogram={monogram}
        />
      )}

      {/* Persistent E-Commerce Cart Drawer */}
      <CartDrawer
        slug={profile?.slug || slug}
        studioName={profile?.businessName}
        buttonColor={buttonColor}
        radiusClass={buttonRadius}
      />

      {/* Floating Cart Button (Suppressed for pure Service businesses) */}
      {!isService && <CartFloatingButton buttonColor={buttonColor} radiusClass={buttonRadius} />}

      {/* Global Consultation Modal */}
      {profile && (
        <ConsultationModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          profile={profile}
          quoteForm={quoteForm}
          setQuoteForm={setQuoteForm}
          quoteSubmitting={quoteSubmitting}
          onSubmit={handleQuoteSubmit}
          primaryColor={primaryColor}
          buttonColor={buttonColor}
          radiusClass={buttonRadius}
        />
      )}

      {/* Global Review Modal */}
      {profile && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          reviewForm={reviewForm}
          setReviewForm={setReviewForm}
          reviewSubmitting={reviewSubmitting}
          onSubmit={handleReviewSubmit}
          primaryColor={primaryColor}
          buttonColor={buttonColor}
          radiusClass={buttonRadius}
        />
      )}

      {/* Global Product Modal */}
      <StorefrontProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}

export default function StudioLayout({ children }: StudioLayoutProps) {
  const params = useParams();
  const slugParam = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const slug = (slugParam as string) || APP_CONFIG.defaultSlug;

  return (
    <StorefrontProvider slug={slug}>
      <CartProvider slug={slug}>
        <StorefrontLayoutInner slug={slug}>{children}</StorefrontLayoutInner>
      </CartProvider>
    </StorefrontProvider>
  );
}
