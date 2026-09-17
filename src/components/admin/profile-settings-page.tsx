"use client";

import { useEffect, useState } from "react";
import {
  calculateBusinessValuation,
  getBusinessProfile,
  getCurrentSession,
  getCurrentUser,
  updateBusinessProfile,
  updateUserProfile,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import type { BusinessProfile, BusinessValuation, ProfileSettingsPageProps } from "@/types";
import { useAdminToast } from "./admin-layout";
import { ValuationCard } from "./analytics/valuation-card";
import { ProfileHeaderCard } from "./profile/profile-header-card";
import { ProfileIdentityCard } from "./profile/profile-identity-card";
import { ProfileSecurityCard } from "./profile/profile-security-card";

export function ProfileSettingsPage({ onToast }: ProfileSettingsPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [studioName, setStudioName] = useState(getCurrentSession()?.studioName || "");
  const [businessProfile, setBusinessProfile] = useState<Partial<BusinessProfile> | null>(null);
  const [valuation, setValuation] = useState<BusinessValuation | null>(null);

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
    bankName?: string | null;
    accountName?: string | null;
    accountNumber?: string | null;
  }) => {
    try {
      const [, updatedBusiness] = await Promise.all([
        updateUserProfile({
          name: updates.name,
          phone: updates.phone,
        }),
        updateBusinessProfile({
          phone: updates.phone,
          bankName: updates.bankName,
          accountName: updates.accountName,
          accountNumber: updates.accountNumber,
        }),
      ]);
      setName(updates.name);
      setPhone(updates.phone);
      if (updatedBusiness) {
        setBusinessProfile(prev => ({
          ...prev,
          ...updatedBusiness,
          bankName: updates.bankName,
          accountName: updates.accountName,
          accountNumber: updates.accountNumber,
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
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-sans font-bold text-on-surface tracking-tight">
          Admin Overview
        </h1>
      </div>

      {/* Studio Equity & Business Valuation Estimator */}
      <ValuationCard valuation={valuation} onRefresh={handleRefreshValuation} onToast={notify} />

      {/* Director Identity Panel */}
      <ProfileIdentityCard
        name={name}
        email={email}
        phone={phone}
        avatar={avatar}
        studioName={studioName}
        bankName={businessProfile?.bankName}
        accountName={businessProfile?.accountName}
        accountNumber={businessProfile?.accountNumber}
        onSave={handleSaveProfile}
      />

      {/* Email & Document Header Banner Panel */}
      <ProfileHeaderCard
        business={businessProfile}
        onUpdateHeader={handleUpdateHeader}
        onToast={notify}
      />

      {/* Authentication & Security Panel */}
      <ProfileSecurityCard email={email} />
    </section>
  );
}
