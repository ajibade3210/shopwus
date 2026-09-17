"use client";

import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProfileIdentityCardProps } from "@/types";

export function ProfileIdentityCard({
  name,
  email,
  phone,
  avatar,
  studioName,
  bankName,
  accountName,
  accountNumber,
  onSave,
}: ProfileIdentityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editPhone, setEditPhone] = useState(phone);
  const [editStudioName, setEditStudioName] = useState(studioName || "");
  const [editBankName, setEditBankName] = useState(bankName || "");
  const [editAccountName, setEditAccountName] = useState(accountName || "");
  const [editAccountNumber, setEditAccountNumber] = useState(accountNumber || "");
  const [saving, setSaving] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Sync edits if parent state changes
  useEffect(() => {
    if (!isEditing) {
      setEditName(name);
      setEditPhone(phone);
      setEditStudioName(studioName || "");
      setEditBankName(bankName || "");
      setEditAccountName(accountName || "");
      setEditAccountNumber(accountNumber || "");
    }
  }, [name, phone, studioName, bankName, accountName, accountNumber, isEditing]);

  const handleStartEdit = () => {
    setEditName(name);
    setEditPhone(phone);
    setEditStudioName(studioName || "");
    setEditBankName(bankName || "");
    setEditAccountName(accountName || "");
    setEditAccountNumber(accountNumber || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        name: editName,
        email,
        phone: editPhone,
        bankName: editBankName,
        accountName: editAccountName,
        accountNumber: editAccountNumber,
      });
      setIsEditing(false);
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
    <div className="bg-card border border-border-hairline rounded-xl p-4 sm:p-6 lg:p-8 shadow-card space-y-6">
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
        <div className="space-y-5 pt-1 animate-in fade-in duration-200">
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

          {/* Bank details accordion / expandable sub-group */}
          <div className="pt-2 border-t border-border-hairline space-y-4">
            <div>
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Payout & Remittance Bank Details
              </h4>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Bank account for automated settlements and disbursements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Bank Name
                </label>
                <div className="signup-field flex items-center bg-surface-low border border-border-hairline rounded-md px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                  <input
                    value={editBankName}
                    onChange={event => setEditBankName(event.target.value)}
                    placeholder="e.g. Providus Bank"
                    className="w-full text-xs text-on-surface placeholder:text-outline bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Account Name
                </label>
                <div className="signup-field flex items-center bg-surface-low border border-border-hairline rounded-md px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                  <input
                    value={editAccountName}
                    onChange={event => setEditAccountName(event.target.value)}
                    placeholder="e.g. Atelier Forma Ent"
                    className="w-full text-xs text-on-surface placeholder:text-outline bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Account Number
                </label>
                <div className="signup-field flex items-center bg-surface-low border border-border-hairline rounded-md px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                  <input
                    value={editAccountNumber}
                    onChange={event => setEditAccountNumber(event.target.value)}
                    placeholder="e.g. 0039281745"
                    className="w-full text-xs text-on-surface font-mono placeholder:text-outline bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Localized Action Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-border-hairline">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-md text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
              disabled={saving}
              onClick={handleSave}
            >
              <span>{saving ? "Saving…" : "Save"}</span>
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
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

          <div className="p-4 bg-surface-low border border-border-hairline rounded-xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
              Remittance Banking Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-on-surface">
              <div>
                <span className="text-[10px] text-outline block">Bank Name</span>
                <span className="font-semibold block mt-0.5">{bankName || "---"}</span>
              </div>
              <div>
                <span className="text-[10px] text-outline block">Account Name</span>
                <span className="font-semibold block mt-0.5">{accountName || "---"}</span>
              </div>
              <div>
                <span className="text-[10px] text-outline block">Account Number</span>
                <span className="font-mono font-semibold block mt-0.5">
                  {accountNumber || "---"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
