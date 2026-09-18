"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSettingsForm } from "@/hooks/use-settings-form";
import type { EnhancedSettingsPageProps } from "@/types";
import { useAdminToast } from "./admin-layout";
import { AppearanceSection } from "./settings/appearance-section";
import { ChannelsSection } from "./settings/channels-section";
import { ContactSection } from "./settings/contact-section";
import { FooterSection } from "./settings/footer-section";
import { IdentitySection } from "./settings/identity-section";
import { PortfolioSection } from "./settings/portfolio-section";
import { ServicesSection } from "./settings/services-section";
import { SettingsSaveBar } from "./settings/settings-save-bar";
import { StorefrontPreferencesSection } from "./settings/storefront-preferences-section";

export function EnhancedSettingsPage({ onToast }: EnhancedSettingsPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;

  const {
    name,
    setName,
    slug,
    setSlug,
    website,
    setWebsite,
    currency,
    setCurrency,
    about,
    setAbout,
    businessType,
    setBusinessType,
    showServices,
    setShowServices,
    showPortfolio,
    setShowPortfolio,
    showReviews,
    setShowReviews,
    footerEyebrow,
    setFooterEyebrow,
    footerTitle,
    setFooterTitle,
    footerDescription,
    setFooterDescription,
    showFooterCta,
    setShowFooterCta,
    services,
    showAddService,
    setShowAddService,
    newServiceInput,
    setNewServiceInput,
    newServiceCategory,
    setNewServiceCategory,
    newServiceDesc,
    setNewServiceDesc,
    newServicePriceType,
    setNewServicePriceType,
    newServicePrice,
    setNewServicePrice,
    newServiceMinPrice,
    setNewServiceMinPrice,
    newServiceMaxPrice,
    setNewServiceMaxPrice,
    editingServiceId,
    setEditingServiceId,
    portfolio,
    categories,
    addPortfolioCategory,
    removePortfolioCategory,
    showAddProjectModal,
    setShowAddProjectModal,
    newProject,
    setNewProject,
    googleReviewsLink,
    setGoogleReviewsLink,
    isSyncingReviews,
    channels,
    hours,
    setHours,
    timeFrom,
    setTimeFrom,
    timeTo,
    setTimeTo,
    byAppointmentOnly,
    setByAppointmentOnly,
    logoUrl,
    setLogoUrl,
    bannerUrl,
    setBannerUrl,
    isUploadingLogo,
    isUploadingBanner,
    isUploadingProjectImage,
    isUploadingGalleryImages,
    colors,
    setColors,
    radius,
    setRadius,
    showManageGalleryModal,
    setShowManageGalleryModal,
    draggedProjectIndex,
    dragOverProjectIndex,
    slugStatus,
    saving,
    addService,
    removeService,
    updateService,
    toggleChannel,
    updateChannelHandle,
    removeProject,
    handleAddProject,
    handleLogoUpload,
    handleDeleteLogo,
    handleBannerUpload,
    handleDeleteBanner,
    handleProjectImageUpload,
    handleGalleryImagesUpload,
    removeGalleryImageFromNewProject,
    moveProject,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleSyncReviews,
    handleSave,
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
    isUploadingStorefrontBanner,
    isUploadingStorefrontSalesImage,
    handleStorefrontBannerUpload,
    handleStorefrontSalesImageUpload,
  } = useSettingsForm({ notify });

  const bottomBarRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const target = bottomBarRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full space-y-8 sm:space-y-10 pb-6 sm:pb-8 lg:pb-16">
      {/* Top Header Bar */}
      <div className="pb-5 sm:pb-6 border-b border-border-hairline">
        <h1 className="text-2xl sm:text-3xl font-sans font-bold text-on-surface tracking-tight leading-tight">
          Store Preferences
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-3 sm:mt-2.5 leading-relaxed max-w-2xl">
          Configure your brand identity, storefront slug, services, portfolio, verified social
          badges, and visual aesthetic.
        </p>
      </div>

      {/* Main Settings Sections Grid */}
      <div className="space-y-10">
        <IdentitySection
          name={name}
          setName={setName}
          slug={slug}
          setSlug={setSlug}
          slugStatus={slugStatus}
          website={website}
          setWebsite={setWebsite}
          currency={currency}
          setCurrency={setCurrency}
          businessType={businessType}
          setBusinessType={setBusinessType}
          about={about}
          setAbout={setAbout}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          isUploadingLogo={isUploadingLogo}
          handleLogoUpload={handleLogoUpload}
          handleDeleteLogo={handleDeleteLogo}
          bannerUrl={bannerUrl}
          setBannerUrl={setBannerUrl}
          isUploadingBanner={isUploadingBanner}
          handleBannerUpload={handleBannerUpload}
          handleDeleteBanner={handleDeleteBanner}
          onToast={notify}
        />

        <ChannelsSection
          googleReviewsLink={googleReviewsLink}
          setGoogleReviewsLink={setGoogleReviewsLink}
          showReviews={showReviews}
          setShowReviews={setShowReviews}
          isSyncingReviews={isSyncingReviews}
          handleSyncReviews={handleSyncReviews}
          channels={channels}
          updateChannelHandle={updateChannelHandle}
          toggleChannel={toggleChannel}
          onToast={notify}
        />

        <StorefrontPreferencesSection
          showStorefrontBanner={showStorefrontBanner}
          setShowStorefrontBanner={setShowStorefrontBanner}
          storefrontBannerUrl={storefrontBannerUrl}
          setStorefrontBannerUrl={setStorefrontBannerUrl}
          storefrontBannerHeader={storefrontBannerHeader}
          setStorefrontBannerHeader={setStorefrontBannerHeader}
          storefrontBannerBody={storefrontBannerBody}
          setStorefrontBannerBody={setStorefrontBannerBody}
          storefrontBannerTextColor={storefrontBannerTextColor}
          setStorefrontBannerTextColor={setStorefrontBannerTextColor}
          storefrontBannerBgColor={storefrontBannerBgColor}
          setStorefrontBannerBgColor={setStorefrontBannerBgColor}
          showStorefrontSales={showStorefrontSales}
          setShowStorefrontSales={setShowStorefrontSales}
          storefrontSalesPosition={storefrontSalesPosition}
          setStorefrontSalesPosition={setStorefrontSalesPosition}
          storefrontSalesUrl={storefrontSalesUrl}
          setStorefrontSalesUrl={setStorefrontSalesUrl}
          storefrontSalesHeader={storefrontSalesHeader}
          setStorefrontSalesHeader={setStorefrontSalesHeader}
          storefrontSalesBody={storefrontSalesBody}
          setStorefrontSalesBody={setStorefrontSalesBody}
          storefrontSalesBtnText={storefrontSalesBtnText}
          setStorefrontSalesBtnText={setStorefrontSalesBtnText}
          storefrontSalesBtnUrl={storefrontSalesBtnUrl}
          setStorefrontSalesBtnUrl={setStorefrontSalesBtnUrl}
          storefrontSalesLinkType={storefrontSalesLinkType}
          setStorefrontSalesLinkType={setStorefrontSalesLinkType}
          isUploadingBanner={isUploadingStorefrontBanner}
          isUploadingSalesImage={isUploadingStorefrontSalesImage}
          handleStorefrontBannerUpload={handleStorefrontBannerUpload}
          handleStorefrontSalesImageUpload={handleStorefrontSalesImageUpload}
        />

        <ServicesSection
          services={services}
          showServices={showServices}
          setShowServices={setShowServices}
          editingServiceId={editingServiceId}
          setEditingServiceId={setEditingServiceId}
          updateService={updateService}
          removeService={removeService}
          showAddService={showAddService}
          setShowAddService={setShowAddService}
          newServiceInput={newServiceInput}
          setNewServiceInput={setNewServiceInput}
          newServiceCategory={newServiceCategory}
          setNewServiceCategory={setNewServiceCategory}
          newServiceDesc={newServiceDesc}
          setNewServiceDesc={setNewServiceDesc}
          newServicePriceType={newServicePriceType}
          setNewServicePriceType={setNewServicePriceType}
          newServicePrice={newServicePrice}
          setNewServicePrice={setNewServicePrice}
          newServiceMinPrice={newServiceMinPrice}
          setNewServiceMinPrice={setNewServiceMinPrice}
          newServiceMaxPrice={newServiceMaxPrice}
          setNewServiceMaxPrice={setNewServiceMaxPrice}
          currency={currency}
          addService={addService}
          categories={categories}
          addCategory={addPortfolioCategory}
          removeCategory={removePortfolioCategory}
        />

        <PortfolioSection
          portfolio={portfolio}
          categories={categories}
          addPortfolioCategory={addPortfolioCategory}
          removePortfolioCategory={removePortfolioCategory}
          showPortfolio={showPortfolio}
          setShowPortfolio={setShowPortfolio}
          showAddProjectModal={showAddProjectModal}
          setShowAddProjectModal={setShowAddProjectModal}
          showManageGalleryModal={showManageGalleryModal}
          setShowManageGalleryModal={setShowManageGalleryModal}
          newProject={newProject}
          setNewProject={setNewProject}
          isUploadingProjectImage={isUploadingProjectImage}
          isUploadingGalleryImages={isUploadingGalleryImages}
          handleProjectImageUpload={handleProjectImageUpload}
          handleGalleryImagesUpload={handleGalleryImagesUpload}
          removeGalleryImageFromNewProject={removeGalleryImageFromNewProject}
          handleAddProject={handleAddProject}
          removeProject={removeProject}
          moveProject={moveProject}
          draggedProjectIndex={draggedProjectIndex}
          dragOverProjectIndex={dragOverProjectIndex}
          handleDragStart={handleDragStart}
          handleDragEnter={handleDragEnter}
          handleDragEnd={handleDragEnd}
          onToast={notify}
        />

        <ContactSection
          hours={hours}
          setHours={setHours}
          timeFrom={timeFrom}
          setTimeFrom={setTimeFrom}
          timeTo={timeTo}
          setTimeTo={setTimeTo}
          byAppointmentOnly={byAppointmentOnly}
          setByAppointmentOnly={setByAppointmentOnly}
        />

        {/* Fulfillment & Delivery Notice Callout */}
        <div className="p-4 sm:p-5 bg-surface-low border border-border-hairline rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-on-surface">
              Looking for Delivery Rates & Pickup Settings?
            </h3>
            <p className="text-[11px] text-muted leading-relaxed">
              Store origin address, courier pickup, and customer fulfillment rules are now managed
              in Location Settings.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/vendor/profile?tab=delivery"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-card hover:bg-surface border border-border-hairline text-on-surface text-xs font-semibold rounded-lg transition-colors shadow-2xs text-decoration-none"
            >
              <span>Delivery Settings</span>
              <ArrowUpRight size={13} className="text-muted" />
            </Link>
          </div>
        </div>

        <AppearanceSection
          colors={colors}
          setColors={setColors}
          radius={radius}
          setRadius={setRadius}
        />

        <FooterSection
          footerEyebrow={footerEyebrow}
          setFooterEyebrow={setFooterEyebrow}
          footerTitle={footerTitle}
          setFooterTitle={setFooterTitle}
          footerDescription={footerDescription}
          setFooterDescription={setFooterDescription}
          showFooterCta={showFooterCta}
          setShowFooterCta={setShowFooterCta}
        />
      </div>

      <SettingsSaveBar
        saving={saving}
        slug={slug}
        slugStatus={slugStatus}
        onSave={handleSave}
        bottomBarRef={bottomBarRef}
        isAtBottom={isAtBottom}
      />
    </div>
  );
}
