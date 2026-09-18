"use client";

import { AlertCircle, CheckCircle2, ChevronDown, Pencil, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useBillingSummaryQuery,
  usePaystackBanksQuery,
  useResolveAccountMutation,
  useUpdatePayoutAccountMutation,
} from "@/hooks/queries";
import { updateBusinessProfile } from "@/lib/api";
import { logger } from "@/lib/logger";
import type { ProfileIdentityCardProps } from "@/types";
import { useAdminToast } from "../layout/admin-toast-provider";

export function ProfileIdentityCard({
  name,
  email,
  phone,
  avatar,
  studioName,
  onSave,
}: ProfileIdentityCardProps) {
  const { showToast } = useAdminToast();
  const { data: billingSummary } = useBillingSummaryQuery();
  const { data: banks = [] } = usePaystackBanksQuery();

  const resolveMutation = useResolveAccountMutation();
  const updatePayoutMutation = useUpdatePayoutAccountMutation();

  const billing = billingSummary?.billing;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editPhone, setEditPhone] = useState(phone);
  const [editStudioName, setEditStudioName] = useState(studioName || "");

  // Bank state
  const [editBankCode, setEditBankCode] = useState("");
  const [editAccountNumber, setEditAccountNumber] = useState("");
  const [resolvedAccountName, setResolvedAccountName] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Sync edits when not editing
  useEffect(() => {
    if (!isEditing) {
      setEditName(name);
      setEditPhone(phone);
      setEditStudioName(studioName || "");
      if (billing?.bankCode) setEditBankCode(billing.bankCode);
      if (billing?.accountNumber) setEditAccountNumber(billing.accountNumber);
      if (billing?.accountName) setResolvedAccountName(billing.accountName);
    }
  }, [name, phone, studioName, billing, isEditing]);

  const performAccountResolution = async (acc: string, bank: string) => {
    if (acc.length !== 10 || !bank) return;
    setIsResolving(true);
    setResolveError(null);

    try {
      const res = await resolveMutation.mutateAsync({
        accountNumber: acc,
        bankCode: bank,
      });
      setResolvedAccountName(res.account_name);
    } catch (err: unknown) {
      setResolvedAccountName(null);
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("timeout") || msg.toLowerCase().includes("network")) {
        setResolveError("Interbank network (NIBSS) is currently slow. Please click Retry below.");
      } else {
        setResolveError(msg || "Could not verify account name. Please check details.");
      }
    } finally {
      setIsResolving(false);
    }
  };

  const handleAccountNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setEditAccountNumber(cleaned);
    setResolveError(null);
    setResolvedAccountName(null);

    if (cleaned.length === 10 && editBankCode) {
      performAccountResolution(cleaned, editBankCode);
    }
  };

  const handleBankChange = (bankCode: string) => {
    setEditBankCode(bankCode);
    setResolveError(null);
    setResolvedAccountName(null);

    if (editAccountNumber.length === 10 && bankCode) {
      performAccountResolution(editAccountNumber, bankCode);
    }
  };

  const handleStartEdit = () => {
    setEditName(name);
    setEditPhone(phone);
    setEditStudioName(studioName || "");
    if (billing?.bankCode) setEditBankCode(billing.bankCode);
    if (billing?.accountNumber) setEditAccountNumber(billing.accountNumber);
    if (billing?.accountName) setResolvedAccountName(billing.accountName);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Save personal credentials
      await onSave({
        name: editName,
        email,
        phone: editPhone,
        studioName: editStudioName,
      });

      // 2. Save bank details if modified and valid
      const bankModified =
        editBankCode &&
        (editBankCode !== billing?.bankCode || editAccountNumber !== billing?.accountNumber);

      if (bankModified) {
        if (editAccountNumber.length !== 10) {
          showToast("Please enter a valid 10-digit NUBAN account number");
          return;
        }

        const selectedBank = banks.find(b => b.code === editBankCode);
        if (selectedBank) {
          await updatePayoutMutation.mutateAsync({
            bankCode: editBankCode,
            bankName: selectedBank.name,
            accountNumber: editAccountNumber,
          });

          try {
            await updateBusinessProfile({
              bankName: selectedBank.name,
              accountName: resolvedAccountName,
              accountNumber: editAccountNumber,
            });
          } catch (syncErr) {
            logger.warn("Failed to sync bank details to business profile for invoices", syncErr);
          }
        }
      }

      setIsEditing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save profile";
      showToast(msg);
    } finally {
      setSaving(false);
    }
  };

  const isImageUrl =
    avatar &&
    (avatar.startsWith("http://") || avatar.startsWith("https://") || avatar.startsWith("/"));

  const initials = name
    ? name
        .split(" ")
        .map(w => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AB";

  return (
    <div className="bg-card border border-border-hairline rounded-xl p-4 sm:p-6 lg:p-8 shadow-card space-y-6 font-sans">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Avatar and Leadership Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 lg:gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-primary text-white flex items-center justify-center font-sans text-base sm:text-lg lg:text-xl font-bold shadow-xs shrink-0 overflow-hidden border border-border-hairline">
            {isImageUrl && !imageFailed ? (
              <img
                src={avatar}
                alt={name}
                onError={() => setImageFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="min-w-0">
            <b className="text-[13px] sm:text-sm lg:text-base text-on-surface font-bold block leading-snug whitespace-nowrap">
              {name || "Studio Director"}
            </b>
            <span className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5 block leading-tight whitespace-nowrap">
              {studioName}
            </span>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleStartEdit}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-card hover:bg-surface-low text-on-surface border border-border-hairline hover:border-outline px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <Pencil size={13} />
            <span>Edit profile</span>
          </button>
        )}
      </div>

      {/* Dynamic Display / Edit Form */}
      {isEditing ? (
        <div className="space-y-6 pt-1 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-2">
                Full name
              </label>
              <div className="signup-field flex items-center bg-surface-low border border-border-hairline rounded-md px-4 py-3 text-xs transition-all focus-within:border-primary">
                <input
                  value={editName}
                  onChange={event => setEditName(event.target.value)}
                  placeholder="Elena Vance"
                  className="w-full text-xs text-on-surface placeholder:text-outline bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-2">
                Email Address
              </label>
              <div className="signup-field flex items-center bg-surface-low border border-border-hairline rounded-md px-4 py-3 text-xs transition-all opacity-80 cursor-not-allowed">
                <input
                  disabled
                  value={email}
                  placeholder="elena@atelierforma.design"
                  className="w-full text-xs text-on-surface placeholder:text-outline bg-transparent outline-none border-none focus:outline-none focus:ring-0 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-2">
                Phone Number
              </label>
              <div className="signup-field flex items-center bg-surface-low border border-border-hairline rounded-md px-4 py-3 text-xs transition-all focus-within:border-primary">
                <input
                  value={editPhone}
                  onChange={event => setEditPhone(event.target.value)}
                  placeholder="+234 800 ELAN VIP"
                  className="w-full text-xs text-on-surface placeholder:text-outline bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-2">
                Studio Name
              </label>
              <div className="signup-field flex items-center bg-surface-low border border-border-hairline rounded-md px-4 py-3 text-xs transition-all focus-within:border-primary">
                <input
                  value={editStudioName}
                  onChange={event => setEditStudioName(event.target.value)}
                  placeholder="Atelier Forma Couture"
                  className="w-full text-xs text-on-surface placeholder:text-outline bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Unified Settlement Bank Account Section */}
          <div className="pt-4 border-t border-border-hairline space-y-4">
            <div>
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Payout & Settlement Bank Account
              </h4>
              <p className="text-xs text-muted mt-0.5">
                Direct automated settlements powered by Paystack Split Payments. Storefront sales
                deposit directly into your commercial bank account.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Select Your Bank
                </label>
                <div className="relative">
                  <select
                    value={editBankCode}
                    onChange={e => handleBankChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 text-xs bg-surface-low border border-border-hairline rounded-md font-medium text-on-surface focus:border-primary focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">-- Choose Commercial Bank --</option>
                    {banks.map((bank, index) => (
                      <option key={`${bank.code}-${bank.id ?? index}`} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted">
                    <ChevronDown size={15} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  NUBAN Account Number (10 Digits)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="0123456789"
                    value={editAccountNumber}
                    onChange={e => handleAccountNumberChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-border-hairline rounded-md font-mono text-sm tracking-wider text-on-surface focus:border-primary focus:outline-none transition-all"
                  />
                  {isResolving && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-muted">
                      <div className="animate-spin w-3 h-3 border-2 border-primary border-t-transparent rounded-full" />
                      <span>Verifying...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {resolvedAccountName && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>
                  Account Verified: <b>{resolvedAccountName}</b>
                </span>
              </div>
            )}

            {resolveError && (
              <div className="flex items-center justify-between text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{resolveError}</span>
                </div>
                {editAccountNumber.length === 10 && editBankCode && (
                  <button
                    type="button"
                    onClick={() => performAccountResolution(editAccountNumber, editBankCode)}
                    className="font-bold underline hover:text-red-900 cursor-pointer shrink-0 text-[11px]"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-border-hairline">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-md text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
              disabled={saving || isResolving}
              onClick={handleSave}
            >
              <span>{saving ? "Saving…" : "Save profile changes"}</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 bg-card hover:bg-surface-low text-on-surface border border-border-hairline hover:border-outline px-4 py-2.5 rounded-md text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              onClick={() => setIsEditing(false)}
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-surface-low border border-border-hairline rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                Full name
              </span>
              <strong className="text-xs font-bold text-on-surface block mt-1">
                {name || "Elena Vance"}
              </strong>
            </div>

            <div className="p-4 bg-surface-low border border-border-hairline rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                Email address
              </span>
              <strong className="text-xs font-bold text-on-surface block mt-1 truncate">
                {email || "elena@atelierforma.design"}
              </strong>
            </div>

            <div className="p-4 bg-surface-low border border-border-hairline rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                Phone number
              </span>
              <strong className="text-xs font-bold text-on-surface block mt-1">
                {phone || "+234 800 ELAN VIP"}
              </strong>
            </div>
          </div>

          {/* Read-only Settlement Bank Badge */}
          <div className="p-4 bg-surface-low border border-border-hairline rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                Settlement Bank Account
              </span>
              {billing?.isVerified && (
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Sparkles size={11} /> Verified
                </span>
              )}
            </div>

            {billing?.isVerified ? (
              <div className="text-xs text-on-surface">
                <span className="font-bold">{billing.bankName}</span> •{" "}
                <span className="font-mono font-semibold">{billing.accountNumber}</span>{" "}
                <span className="text-muted">({billing.accountName})</span>
              </div>
            ) : (
              <div className="text-xs text-muted flex items-center justify-between">
                <span>No settlement bank account linked yet.</span>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  Link Bank Account →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
