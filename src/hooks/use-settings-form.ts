"use client";

import { useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useEffect, useState } from "react";
import {
  createSession,
  getBusinessProfile,
  getCurrentSession,
  publishChanges,
  updateBusinessProfile,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { queryKeys } from "@/lib/query-keys";
import type { PortfolioProject, ServiceItem, UseSettingsFormOptions } from "@/types";
import {
  isValidPhone,
  isValidUrl,
  normalizeButtonRadius,
  normalizeWebsiteUrl,
  sanitizeHandle,
} from "@/utils";
import { useAppearanceSettings } from "./settings/use-appearance-settings";
import { useBrandingSettings } from "./settings/use-branding-settings";
import { useContactSettings } from "./settings/use-contact-settings";
import { usePortfolioSettings } from "./settings/use-portfolio-settings";
import { useServicesSettings } from "./settings/use-services-settings";

export function useSettingsForm({ notify }: UseSettingsFormOptions) {
  const branding = useBrandingSettings();
  const portfolio = usePortfolioSettings({ notify });
  const services = useServicesSettings({ notify, categories: portfolio.categories });
  const appearance = useAppearanceSettings();
  const contact = useContactSettings({ notify });
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);

  // Synchronize website input with social channels website section
  const handleWebsiteChange = (newWebsite: string) => {
    branding.setWebsite(newWebsite);
    const cleanHandle = sanitizeHandle(newWebsite, "https://");
    contact.setChannels(prev => {
      const idx = prev.findIndex(c => c.type === "website");
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          handle: cleanHandle,
          url: normalizeWebsiteUrl(newWebsite),
          connected: Boolean(cleanHandle),
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: "ch-website",
          type: "website",
          label: "Website",
          handle: cleanHandle,
          url: normalizeWebsiteUrl(newWebsite),
          connected: Boolean(cleanHandle),
        },
      ];
    });
  };

  const handleUpdateChannelHandle = (id: string, handle: string) => {
    contact.updateChannelHandle(id, handle);
    const targetChannel = contact.channels.find(c => c.id === id);
    if (targetChannel?.type === "website") {
      const cleanHandle = sanitizeHandle(handle, "https://");
      branding.setWebsite(cleanHandle ? normalizeWebsiteUrl(cleanHandle) : "");
    }
  };

  const handleToggleChannel = (id: string) => {
    contact.toggleChannel(id);
    const targetChannel = contact.channels.find(c => c.id === id);
    if (targetChannel?.type === "website") {
      if (!targetChannel.connected && branding.website) {
        const cleanHandle = sanitizeHandle(branding.website, "https://");
        contact.setChannels(prev =>
          prev.map(c =>
            c.id === id
              ? {
                  ...c,
                  handle: cleanHandle,
                  url: normalizeWebsiteUrl(branding.website),
                  connected: true,
                }
              : c
          )
        );
      }
    }
  };

  // Load freshest profile on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      getBusinessProfile()
        .then(profile => {
          if (!profile) return;
          branding.setName(profile.businessName || "");
          branding.setSlug(profile.slug || "");
          branding.setInitialSlug(profile.slug || "");
          branding.setTagline(profile.tagline || "");
          branding.setLocation(profile.location || "");
          const rawWebsite = profile.website || "";
          branding.setWebsite(rawWebsite);
          branding.setEmail(profile.email || "");
          branding.setCurrency(profile.currency || "NGN");
          branding.setAbout(profile.description || "");
          branding.setBusinessType(profile.businessType || "sales");
          if (profile.logoUrl) portfolio.setLogoUrl(profile.logoUrl);
          if (profile.bannerUrl) portfolio.setBannerUrl(profile.bannerUrl);

          if (Array.isArray(profile.services)) services.setServices(profile.services);
          if (Array.isArray(profile.portfolio)) portfolio.setPortfolio(profile.portfolio);
          if (Array.isArray(profile.portfolioCategories)) {
            portfolio.setCategories(profile.portfolioCategories);
          }

          const initialChannels = Array.isArray(profile.socialChannels)
            ? [...profile.socialChannels]
            : [];
          if (rawWebsite) {
            const cleanHandle = sanitizeHandle(rawWebsite, "https://");
            const wIdx = initialChannels.findIndex(c => c.type === "website");
            if (wIdx >= 0) {
              initialChannels[wIdx] = {
                ...initialChannels[wIdx],
                handle: cleanHandle,
                url: normalizeWebsiteUrl(rawWebsite),
                connected: true,
              };
            } else {
              initialChannels.push({
                id: "ch-website",
                type: "website",
                label: "Website",
                handle: cleanHandle,
                url: normalizeWebsiteUrl(rawWebsite),
                connected: true,
              });
            }
          }
          contact.setChannels(initialChannels);

          if (profile.operatingHours) contact.setHours(profile.operatingHours);
          if (profile.timeFrom) contact.setTimeFrom(profile.timeFrom);
          if (profile.timeTo) contact.setTimeTo(profile.timeTo);
          if (profile.byAppointmentOnly !== undefined) {
            contact.setByAppointmentOnly(profile.byAppointmentOnly);
          }
          if (profile.whatsAppNumber) contact.setWhatsAppNumber(profile.whatsAppNumber);
          if (profile.emailAddress) contact.setEmailAddress(profile.emailAddress);
          if (profile.physicalAddress) contact.setPhysicalAddress(profile.physicalAddress);
          if (profile.googleReviewsLink) {
            contact.setGoogleReviewsLink(profile.googleReviewsLink);
          }
          if (profile.showServices !== undefined) contact.setShowServices(profile.showServices);
          if (profile.showPortfolio !== undefined) contact.setShowPortfolio(profile.showPortfolio);
          if (profile.showReviews !== undefined) contact.setShowReviews(profile.showReviews);
          if (profile.footerEyebrow) contact.setFooterEyebrow(profile.footerEyebrow);
          if (profile.footerTitle) contact.setFooterTitle(profile.footerTitle);
          if (profile.footerDescription) {
            contact.setFooterDescription(profile.footerDescription);
          }
          if (profile.showFooterCta !== undefined) {
            contact.setShowFooterCta(profile.showFooterCta);
          }

          if (profile.colors) appearance.setColors(profile.colors);
          if (profile.buttonRadius) {
            appearance.setRadius(normalizeButtonRadius(profile.buttonRadius));
          }
        })
        .catch(err => {
          logger.warn("Failed to load business profile on mount", err);
        });
    }
  }, []);

  // Save on the fly: add service then immediately persist to API
  const handleAddServiceAndSave = async () => {
    const newSvc = services.addService();
    if (!newSvc) return; // validation failed in addService
    // Pass the new service directly — React state hasn't flushed yet
    await handleSave({ silent: true, overrideServices: [...services.services, newSvc] });
  };

  // Save on the fly: add project then immediately persist to API
  const handleAddProjectAndSave = async (e: React.FormEvent) => {
    const newProj = portfolio.handleAddProject(e);
    if (!newProj) return; // validation failed in handleAddProject
    // Pass the new project directly — React state hasn't flushed yet
    await handleSave({ silent: true, overridePortfolio: [newProj, ...portfolio.portfolio] });
  };

  // Remove service then immediately persist to API
  const removeServiceAndSave = async (id: string) => {
    services.removeService(id);
    const remaining = services.services.filter(s => s.id !== id);
    await handleSave({ silent: true, overrideServices: remaining });
  };

  // Remove project then immediately persist to API
  const removeProjectAndSave = async (id: string) => {
    portfolio.removeProject(id);
    const remaining = portfolio.portfolio.filter(p => p.id !== id);
    await handleSave({ silent: true, overridePortfolio: remaining });
  };

  // Auto-save on logo upload
  const handleLogoUploadAndSave = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLogoUrl = await portfolio.handleLogoUpload(e);
    if (!newLogoUrl) return;
    await handleSave({ silent: true, overrideLogoUrl: newLogoUrl });
  };

  // Auto-save on logo delete
  const handleDeleteLogoAndSave = async () => {
    portfolio.handleDeleteLogo();
    await handleSave({ silent: true, overrideLogoUrl: "" });
    notify("Logo removed successfully");
  };

  // Auto-save on banner upload
  const handleBannerUploadAndSave = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBannerUrl = await portfolio.handleBannerUpload(e);
    if (!newBannerUrl) return;
    await handleSave({ silent: true, overrideBannerUrl: newBannerUrl });
  };

  // Auto-save on banner delete
  const handleDeleteBannerAndSave = async () => {
    portfolio.handleDeleteBanner();
    await handleSave({ silent: true, overrideBannerUrl: "" });
    notify("Store banner removed successfully");
  };

  const handleSave = async (options?: {
    silent?: boolean;
    overrideServices?: ServiceItem[];
    overridePortfolio?: PortfolioProject[];
    overrideLogoUrl?: string;
    overrideBannerUrl?: string;
  }): Promise<boolean> => {
    if (branding.slugStatus === "checking") {
      notify("Please wait while we check slug availability");
      return false;
    }
    if (branding.slugStatus === "taken") {
      notify("Studio slug is unavailable or already taken");
      return false;
    }
    if (branding.slug && branding.slug.trim().length < 3) {
      notify("Studio slug must be at least 3 characters");
      return false;
    }

    if (branding.website.trim() && !isValidUrl(branding.website)) {
      notify("Invalid website URL");
      return false;
    }

    // Validate WhatsApp number if configured
    const waChannel = contact.channels.find(c => c.type?.toLowerCase() === "whatsapp");
    const waHandle = waChannel?.handle?.trim();
    if (waHandle && !isValidPhone(waHandle)) {
      notify("Invalid WhatsApp phone number");
      return false;
    }

    const webChannel = contact.channels.find(c => c.type?.toLowerCase() === "website");
    const webHandle = webChannel?.handle?.trim();
    if (webHandle && !isValidUrl(webHandle)) {
      notify("Invalid website URL");
      return false;
    }

    setSaving(true);
    try {
      const normalizedWebsite = branding.website.trim()
        ? normalizeWebsiteUrl(branding.website)
        : "";

      // Ensure socialChannels has the latest website channel
      let updatedChannels = contact.channels.map(c => {
        if (c.type?.toLowerCase() === "website") {
          const cleanHandle = sanitizeHandle(normalizedWebsite, "https://");
          return {
            ...c,
            handle: cleanHandle,
            url: normalizedWebsite,
            connected: Boolean(cleanHandle),
          };
        }
        return c;
      });

      if (normalizedWebsite && !updatedChannels.some(c => c.type?.toLowerCase() === "website")) {
        const cleanHandle = sanitizeHandle(normalizedWebsite, "https://");
        updatedChannels = [
          ...updatedChannels,
          {
            id: "ch-website",
            type: "website",
            label: "Website",
            handle: cleanHandle,
            url: normalizedWebsite,
            connected: Boolean(cleanHandle),
          },
        ];
      }

      contact.setChannels(updatedChannels);

      const cleanedServices: ServiceItem[] = (options?.overrideServices ?? services.services ?? [])
        .map(s => ({
          id: s.id || `svc-${Date.now()}`,
          name: (s.name || "").trim(),
          category: (s.category || "").trim() || "General",
          description: (s.description || "").trim(),
          price: typeof s.price === "number" && !Number.isNaN(s.price) ? s.price : undefined,
          minPrice:
            typeof s.minPrice === "number" && !Number.isNaN(s.minPrice) ? s.minPrice : undefined,
          maxPrice:
            typeof s.maxPrice === "number" && !Number.isNaN(s.maxPrice) ? s.maxPrice : undefined,
          priceType: s.priceType,
          isFeatured: Boolean(s.isFeatured),
        }))
        .filter(s => s.name.length > 0);

      if (
        portfolio.isUploadingLogo ||
        portfolio.isUploadingBanner ||
        portfolio.isUploadingProjectImage ||
        portfolio.isUploadingGalleryImages
      ) {
        notify("Please wait for all media files to finish uploading before saving.");
        setSaving(false);
        return false;
      }

      const cleanedPortfolio: PortfolioProject[] = (
        options?.overridePortfolio ??
        portfolio.portfolio ??
        []
      )
        .map((p, idx) => ({
          id: p.id || `p-${Date.now()}-${idx}`,
          title: (p.title || "").trim(),
          category: (p.category || "").trim() || "General",
          location: (p.location || "").trim(),
          description: (p.description || "").trim(),
          image: p.image || "",
          order: typeof p.order === "number" ? p.order : idx,
          isCover: Boolean(p.isCover),
          gallery: Array.isArray(p.gallery) ? p.gallery : [],
          stats: p.stats || "",
          client: p.client || "",
          year: p.year || "",
        }))
        .filter(p => p.title.length > 0);

      const cleanWhatsNumber = contact.whatsAppNumber?.trim() || "";

      const updated = await updateBusinessProfile({
        businessName: branding.name,
        slug: branding.slug,
        tagline: branding.tagline,
        location: branding.location,
        website: normalizedWebsite,
        email: branding.email,
        currency: branding.currency,
        description: branding.about,
        logoUrl: options?.overrideLogoUrl ?? portfolio.logoUrl,
        bannerUrl: options?.overrideBannerUrl ?? portfolio.bannerUrl,
        services: cleanedServices,
        portfolio: cleanedPortfolio,
        portfolioCategories: portfolio.categories,
        socialChannels: updatedChannels,
        googleReviewsLink: contact.googleReviewsLink,
        operatingHours: contact.hours,
        timeFrom: contact.timeFrom,
        timeTo: contact.timeTo,
        byAppointmentOnly: contact.byAppointmentOnly,
        whatsAppNumber: cleanWhatsNumber ? cleanWhatsNumber : undefined,
        emailAddress: contact.emailAddress,
        physicalAddress: contact.physicalAddress,
        showServices: contact.showServices,
        showPortfolio: contact.showPortfolio,
        showReviews: contact.showReviews,
        footerEyebrow: contact.footerEyebrow,
        footerTitle: contact.footerTitle,
        footerDescription: contact.footerDescription,
        showFooterCta: contact.showFooterCta,
        businessType: branding.businessType,
        colors: appearance.colors,
        buttonRadius: appearance.radius,
      });

      if (updated) {
        if (updated.slug) {
          branding.setInitialSlug(updated.slug);
          branding.setSlug(updated.slug);
        }
        if (Array.isArray(updated.services)) {
          services.setServices(updated.services);
        }
        if (Array.isArray(updated.portfolio)) {
          portfolio.setPortfolio(updated.portfolio);
        }
        if (Array.isArray(updated.portfolioCategories)) {
          portfolio.setCategories(updated.portfolioCategories);
        }

        // Sync local & cookie session for Edge Middleware and client components
        const currentSession = getCurrentSession();
        if (currentSession) {
          createSession({
            ...currentSession,
            studioSlug: updated.slug || currentSession.studioSlug,
            studioName: updated.businessName || currentSession.studioName,
          });
        }
        queryClient.setQueryData(queryKeys.studios.me(), updated);
        queryClient.invalidateQueries({ queryKey: queryKeys.studios.all });
      }

      if (!options?.silent) {
        notify("Changes saved successfully");
      }
      return true;
    } catch (err: unknown) {
      logger.error("Failed to save studio changes", err);
      const errMsg =
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message: unknown }).message === "string"
          ? (err as { message: string }).message
          : "Failed to save changes";
      notify(errMsg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const success = await handleSave({ silent: true });
    if (!success) return;

    setSaving(true);
    try {
      await publishChanges();
      notify("Studio changes published live!");
    } catch (err) {
      logger.error("Failed to publish studio changes", err);
      notify("Failed to publish changes");
    } finally {
      setSaving(false);
    }
  };

  const onSave = async () => {
    await handleSave();
  };

  const handleSetShowServices = async (val: boolean) => {
    contact.setShowServices(val);
    try {
      await updateBusinessProfile({ showServices: val });
      queryClient.invalidateQueries({ queryKey: queryKeys.studios.me() });
      notify(
        val
          ? "Services section is now visible on your page"
          : "Services section hidden from your page"
      );
    } catch (err) {
      logger.error("Failed to update services visibility", err);
      contact.setShowServices(!val);
      notify("Failed to update services visibility");
    }
  };

  const handleSetShowPortfolio = async (val: boolean) => {
    contact.setShowPortfolio(val);
    try {
      await updateBusinessProfile({ showPortfolio: val });
      queryClient.invalidateQueries({ queryKey: queryKeys.studios.me() });
      notify(
        val
          ? "Portfolio section is now visible on your page"
          : "Portfolio section hidden from your page"
      );
    } catch (err) {
      logger.error("Failed to update portfolio visibility", err);
      contact.setShowPortfolio(!val);
      notify("Failed to update portfolio visibility");
    }
  };

  const handleSetShowReviews = async (val: boolean) => {
    contact.setShowReviews(val);
    try {
      await updateBusinessProfile({ showReviews: val });
      queryClient.invalidateQueries({ queryKey: queryKeys.studios.me() });
      notify(
        val
          ? "Reviews section is now visible on your page"
          : "Reviews section hidden from your page"
      );
    } catch (err) {
      logger.error("Failed to update reviews visibility", err);
      contact.setShowReviews(!val);
      notify("Failed to update reviews visibility");
    }
  };

  const handleSetShowFooterCta = async (val: boolean) => {
    contact.setShowFooterCta(val);
    try {
      await updateBusinessProfile({ showFooterCta: val });
      queryClient.invalidateQueries({ queryKey: queryKeys.studios.me() });
      notify(
        val ? "Closing banner is now visible on your page" : "Closing banner hidden from your page"
      );
    } catch (err) {
      logger.error("Failed to update closing banner visibility", err);
      contact.setShowFooterCta(!val);
      notify("Failed to update closing banner visibility");
    }
  };

  return {
    // Branding
    name: branding.name,
    setName: branding.setName,
    slug: branding.slug,
    setSlug: branding.setSlug,
    tagline: branding.tagline,
    setTagline: branding.setTagline,
    location: branding.location,
    setLocation: branding.setLocation,
    website: branding.website,
    setWebsite: handleWebsiteChange,
    email: branding.email,
    setEmail: branding.setEmail,
    currency: branding.currency,
    setCurrency: branding.setCurrency,
    about: branding.about,
    setAbout: branding.setAbout,
    businessType: branding.businessType,
    setBusinessType: branding.setBusinessType,
    slugStatus: branding.slugStatus,

    // Services
    services: services.services,
    showAddService: services.showAddService,
    setShowAddService: services.setShowAddService,
    newServiceInput: services.newServiceInput,
    setNewServiceInput: services.setNewServiceInput,
    newServiceCategory: services.newServiceCategory,
    setNewServiceCategory: services.setNewServiceCategory,
    newServiceDesc: services.newServiceDesc,
    setNewServiceDesc: services.setNewServiceDesc,
    newServicePriceType: services.newServicePriceType,
    setNewServicePriceType: services.setNewServicePriceType,
    newServicePrice: services.newServicePrice,
    setNewServicePrice: services.setNewServicePrice,
    newServiceMinPrice: services.newServiceMinPrice,
    setNewServiceMinPrice: services.setNewServiceMinPrice,
    newServiceMaxPrice: services.newServiceMaxPrice,
    setNewServiceMaxPrice: services.setNewServiceMaxPrice,
    editingServiceId: services.editingServiceId,
    setEditingServiceId: services.setEditingServiceId,
    addService: handleAddServiceAndSave,
    removeService: removeServiceAndSave,
    updateService: services.updateService,

    // Portfolio
    portfolio: portfolio.portfolio,
    categories: portfolio.categories,
    addPortfolioCategory: portfolio.addPortfolioCategory,
    removePortfolioCategory: portfolio.removePortfolioCategory,
    showAddProjectModal: portfolio.showAddProjectModal,
    setShowAddProjectModal: portfolio.setShowAddProjectModal,
    newProject: portfolio.newProject,
    setNewProject: portfolio.setNewProject,
    logoUrl: portfolio.logoUrl,
    setLogoUrl: portfolio.setLogoUrl,
    bannerUrl: portfolio.bannerUrl,
    setBannerUrl: portfolio.setBannerUrl,
    isUploadingLogo: portfolio.isUploadingLogo,
    isUploadingBanner: portfolio.isUploadingBanner,
    isUploadingProjectImage: portfolio.isUploadingProjectImage,
    isUploadingGalleryImages: portfolio.isUploadingGalleryImages,
    showManageGalleryModal: portfolio.showManageGalleryModal,
    setShowManageGalleryModal: portfolio.setShowManageGalleryModal,
    draggedProjectIndex: portfolio.draggedProjectIndex,
    dragOverProjectIndex: portfolio.dragOverProjectIndex,
    removeProject: removeProjectAndSave,
    handleAddProject: handleAddProjectAndSave,
    handleLogoUpload: handleLogoUploadAndSave,
    handleDeleteLogo: handleDeleteLogoAndSave,
    handleBannerUpload: handleBannerUploadAndSave,
    handleDeleteBanner: handleDeleteBannerAndSave,
    handleProjectImageUpload: portfolio.handleProjectImageUpload,
    handleGalleryImagesUpload: portfolio.handleGalleryImagesUpload,
    removeGalleryImageFromNewProject: portfolio.removeGalleryImageFromNewProject,
    moveProject: portfolio.moveProject,
    handleDragStart: portfolio.handleDragStart,
    handleDragEnter: portfolio.handleDragEnter,
    handleDragEnd: portfolio.handleDragEnd,

    // Contact & Social & Toggles
    hours: contact.hours,
    setHours: contact.setHours,
    timeFrom: contact.timeFrom,
    setTimeFrom: contact.setTimeFrom,
    timeTo: contact.timeTo,
    setTimeTo: contact.setTimeTo,
    byAppointmentOnly: contact.byAppointmentOnly,
    setByAppointmentOnly: contact.setByAppointmentOnly,
    whatsAppNumber: contact.whatsAppNumber,
    setWhatsAppNumber: contact.setWhatsAppNumber,
    emailAddress: contact.emailAddress,
    setEmailAddress: contact.setEmailAddress,
    physicalAddress: contact.physicalAddress,
    setPhysicalAddress: contact.setPhysicalAddress,
    channels: contact.channels,
    googleReviewsLink: contact.googleReviewsLink,
    setGoogleReviewsLink: contact.setGoogleReviewsLink,
    isSyncingReviews: contact.isSyncingReviews,
    showServices: contact.showServices,
    setShowServices: handleSetShowServices,
    showPortfolio: contact.showPortfolio,
    setShowPortfolio: handleSetShowPortfolio,
    showReviews: contact.showReviews,
    setShowReviews: handleSetShowReviews,
    footerEyebrow: contact.footerEyebrow,
    setFooterEyebrow: contact.setFooterEyebrow,
    footerTitle: contact.footerTitle,
    setFooterTitle: contact.setFooterTitle,
    footerDescription: contact.footerDescription,
    setFooterDescription: contact.setFooterDescription,
    showFooterCta: contact.showFooterCta,
    setShowFooterCta: handleSetShowFooterCta,
    toggleChannel: handleToggleChannel,
    updateChannelHandle: handleUpdateChannelHandle,
    handleSyncReviews: contact.handleSyncReviews,

    // Appearance
    colors: appearance.colors,
    setColors: appearance.setColors,
    radius: appearance.radius,
    setRadius: appearance.setRadius,

    // Actions & State
    saving,
    handleSave: onSave,
    handlePublish,
  };
}
