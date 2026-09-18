"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  calculateBusinessValuation,
  getBusinessProfile,
  getCurrentSession,
  getCurrentUser,
  updateBusinessProfile,
  updateUserProfile,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import type {
  BusinessProfile,
  BusinessValuation,
  ProfileSettingsPageProps,
  ProfileTab,
} from "@/types";
import { useAdminToast } from "./admin-layout";
import { ValuationCard } from "./analytics/valuation-card";
import { LocationSection } from "./profile/location-section";
import { ProfileHeaderCard } from "./profile/profile-header-card";
import { ProfileIdentityCard } from "./profile/profile-identity-card";
import { ProfileSecurityCard } from "./profile/profile-security-card";

function ProfileSettingsInner({ onToast }: ProfileSettingsPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active tab state synced with URL query (?tab=profile|delivery)
  const initialTab = (searchParams.get("tab") as ProfileTab) || "profile";
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    initialTab === "delivery" ? "delivery" : "profile"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [studioName, setStudioName] = useState(getCurrentSession()?.studioName || "");
  const [businessProfile, setBusinessProfile] = useState<Partial<BusinessProfile> | null>(null);
  const [valuation, setValuation] = useState<BusinessValuation | null>(null);

  // Sync tab from URL if changed externally
  useEffect(() => {
    const tabParam = searchParams.get("tab") as ProfileTab | null;
    if (tabParam && (tabParam === "profile" || tabParam === "delivery")) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (newTab: ProfileTab) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`/vendor/profile?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone || "+234 800 ELAN VIP");
        setAvatar(user.avatar || "AB");
      })
      .catch(err => {
        logger.warn("Failed to load user profile on mount", err);
      });

    getBusinessProfile()
      .then(profile => {
        if (profile) {
          setBusinessProfile(profile);
          if (profile.businessName) {
            setStudioName(profile.businessName);
          }
        }
      })
      .catch(err => {
        logger.warn("Failed to load business profile on mount", err);
      });

    calculateBusinessValuation()
      .then(val => {
        setValuation(val);
      })
      .catch(err => {
        logger.warn("Failed to load business valuation on mount", err);
      });
  }, []);

  const handleSaveProfile = async (updates: {
    name: string;
    email: string;
    phone: string;
    studioName?: string;
  }) => {
    try {
      const [, updatedBusiness] = await Promise.all([
        updateUserProfile({
          name: updates.name,
          phone: updates.phone,
        }),
        updateBusinessProfile({
          phone: updates.phone,
          ...(updates.studioName
            ? { businessName: updates.studioName, name: updates.studioName }
            : {}),
        }),
      ]);
      setName(updates.name);
      setPhone(updates.phone);
      if (updates.studioName) {
        setStudioName(updates.studioName);
      }
      if (updatedBusiness) {
        setBusinessProfile(prev => ({
          ...prev,
          ...updatedBusiness,
        }));
      }
      notify("Profile credentials updated successfully");
    } catch (err) {
      logger.error("Failed to update profile credentials", err);
      notify("Failed to update profile credentials");
    }
  };

  const handleRefreshValuation = async () => {
    const updated = await calculateBusinessValuation();
    setValuation(updated);
  };

  const handleUpdateHeader = async (
    headerUrl: string,
    headerType: "AUTO" | "CUSTOM",
    includeHeaderInInvoice: boolean,
    includeHeaderInEmail: boolean
  ) => {
    try {
      const updated = await updateBusinessProfile({
        emailHeaderUrl: headerUrl,
        headerType,
        includeHeaderInInvoice,
        includeHeaderInEmail,
      });
      setBusinessProfile(prev => ({
        ...prev,
        ...updated,
        emailHeaderUrl: headerUrl,
        headerType,
        includeHeaderInInvoice,
        includeHeaderInEmail,
      }));
    } catch (err) {
      logger.error("Failed to update email header", err);
      throw err;
    }
  };

  return (
    <section className="content profile-content max-w-5xl mx-auto space-y-6 sm:space-y-7 pb-16">
      {/* Top Navigation Bar: Strictly 2 tabs (Profile & Location) */}
      <div className="border-b border-border-hairline">
        <nav
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
          aria-label="Profile Sections"
        >
          <button
            type="button"
            onClick={() => handleTabChange("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-card text-on-surface shadow-2xs border border-border-hairline"
                : "text-muted hover:text-on-surface hover:bg-surface-low border border-transparent"
            }`}
          >
            Profile
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("delivery")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "delivery"
                ? "bg-card text-on-surface shadow-2xs border border-border-hairline"
                : "text-muted hover:text-on-surface hover:bg-surface-low border border-transparent"
            }`}
          >
            Location
          </button>
        </nav>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === "profile" && (
        <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-150">
          {/* 1. Business Valuation comes FIRST */}
          <ValuationCard
            valuation={valuation}
            onRefresh={handleRefreshValuation}
            onToast={notify}
          />

          {/* 2. Profile Identity & Bank Settlement Card */}
          <ProfileIdentityCard
            name={name}
            email={email}
            phone={phone}
            avatar={avatar}
            studioName={studioName}
            onSave={handleSaveProfile}
          />

          {/* 3. Email & Document Header Banner Panel */}
          <ProfileHeaderCard
            business={businessProfile}
            onUpdateHeader={handleUpdateHeader}
            onToast={notify}
          />

          {/* 4. Authentication & Security Panel */}
          <ProfileSecurityCard email={email} />
        </div>
      )}

      {/* Tab 2: Location */}
      {activeTab === "delivery" && (
        <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-150">
          <LocationSection />
        </div>
      )}
    </section>
  );
}

export function ProfileSettingsPage(props: ProfileSettingsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto p-8 text-center text-xs text-muted">
          Loading settings...
        </div>
      }
    >
      <ProfileSettingsInner {...props} />
    </Suspense>
  );
}
