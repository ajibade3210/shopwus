"use client";

import { useEffect, useRef, useState } from "react";
import { useSettingsForm } from "@/hooks/use-settings-form";
import type { EnhancedSettingsPageProps } from "@/types";
import { useAdminToast } from "./admin-layout";
import { AppearanceSection } from "./settings/appearance-section";
import { BillingSection } from "./settings/billing-section";
import { ChannelsSection } from "./settings/channels-section";
import { ContactSection } from "./settings/contact-section";
import { DeliverySection } from "./settings/delivery-section";
import { FooterSection } from "./settings/footer-section";
import { IdentitySection } from "./settings/identity-section";
import { PortfolioSection } from "./settings/portfolio-section";
import { ServicesSection } from "./settings/services-section";
import { SettingsSaveBar } from "./settings/settings-save-bar";

export function EnhancedSettingsPage({ onToast }: EnhancedSettingsPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;

  const {
    name,
    setName,
    slug,
    setSlug,
    tagline,
    setTagline,
    location,
    setLocation,
    website,
    setWebsite,
    email,
    setEmail,
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
          tagline={tagline}
          setTagline={setTagline}
          location={location}
          setLocation={setLocation}
          website={website}
          setWebsite={setWebsite}
          email={email}
          setEmail={setEmail}
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

        <DeliverySection />

        <BillingSection />

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
