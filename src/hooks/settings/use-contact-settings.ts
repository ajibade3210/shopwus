"use client";

import { useState } from "react";
import {
  DEFAULT_FOOTER_DESCRIPTION,
  DEFAULT_FOOTER_EYEBROW,
  DEFAULT_FOOTER_TITLE,
} from "@/constants";
import type { SocialChannel, UseContactSettingsOptions } from "@/types";

export function useContactSettings({ notify }: UseContactSettingsOptions) {
  // Operating details
  const [hours, setHours] = useState("Mon–Fri");
  const [timeFrom, setTimeFrom] = useState("09:00 AM");
  const [timeTo, setTimeTo] = useState("06:00 PM");
  const [byAppointmentOnly, setByAppointmentOnly] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");

  // Social & Reviews
  const [channels, setChannels] = useState<SocialChannel[]>([]);
  const [googleReviewsLink, setGoogleReviewsLink] = useState("");
  const [isSyncingReviews, setIsSyncingReviews] = useState(false);

  // Section Visibility Toggles
  const [showServices, setShowServices] = useState<boolean>(true);
  const [showPortfolio, setShowPortfolio] = useState<boolean>(true);
  const [showReviews, setShowReviews] = useState<boolean>(true);

  // Footer CTA Banner
  const [footerEyebrow, setFooterEyebrow] = useState(DEFAULT_FOOTER_EYEBROW);
  const [footerTitle, setFooterTitle] = useState(DEFAULT_FOOTER_TITLE);
  const [footerDescription, setFooterDescription] = useState(DEFAULT_FOOTER_DESCRIPTION);
  const [showFooterCta, setShowFooterCta] = useState(true);

  const toggleChannel = (id: string) => {
    setChannels(prev => prev.map(c => (c.id === id ? { ...c, connected: !c.connected } : c)));
    notify("Channel status toggled");
  };

  const updateChannelHandle = (id: string, handle: string) => {
    setChannels(prev => prev.map(c => (c.id === id ? { ...c, handle } : c)));
  };

  const handleSyncReviews = async () => {
    setIsSyncingReviews(true);
    notify("Syncing Google reviews...");
    setTimeout(() => {
      setIsSyncingReviews(false);
      notify("Google reviews synced successfully");
    }, 1200);
  };

  return {
    hours,
    setHours,
    timeFrom,
    setTimeFrom,
    timeTo,
    setTimeTo,
    byAppointmentOnly,
    setByAppointmentOnly,
    whatsAppNumber,
    setWhatsAppNumber,
    emailAddress,
    setEmailAddress,
    physicalAddress,
    setPhysicalAddress,
    channels,
    setChannels,
    googleReviewsLink,
    setGoogleReviewsLink,
    isSyncingReviews,
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
    toggleChannel,
    updateChannelHandle,
    handleSyncReviews,
  };
}
