"use client";

import { Check, Eye, EyeOff, KeyRound, Loader2, Lock, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { GoogleIcon } from "@/components/shared/icons";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { changePassword, signInWithGoogle } from "@/lib/api";
import type { ProfileSecurityCardProps } from "@/types";

export function ProfileSecurityCard({
  email,
  isGoogleConnected = false,
  hasPassword = false,
  onRefresh,
  onToast,
}: ProfileSecurityCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // Google Linking State
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);

  const handleGoogleCredential = async (codeOrToken: string) => {
    setIsLinkingGoogle(true);
    try {
      const isJwt = codeOrToken.split(".").length === 3;
      await signInWithGoogle({
        code: isJwt ? undefined : codeOrToken,
        idToken: isJwt ? codeOrToken : undefined,
      });
      onToast?.("Google account linked successfully!");
      if (onRefresh) await onRefresh();
    } catch (err) {
      onToast?.(err instanceof Error ? err.message : "Failed to link Google account.");
    } finally {
      setIsLinkingGoogle(false);
    }
  };

  const { trigger: triggerGoogle, loaded: googleLoaded } = useGoogleAuth(
    handleGoogleCredential,
    err => onToast?.(err)
  );

  const handleOpenPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setModalError("");
    setModalOpen(true);
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (hasPassword && !currentPassword) {
      setModalError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setModalError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await changePassword({
        currentPassword: hasPassword ? currentPassword : undefined,
        newPassword,
      });

      onToast?.(res.message || "Password updated successfully!");
      setModalOpen(false);
      if (onRefresh) await onRefresh();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border-hairline rounded-xl p-4 sm:p-6 lg:p-8 shadow-card space-y-5">
      <div>
        <h3 className="text-sm sm:text-base font-bold text-on-surface tracking-tight">
          Authentication &amp; Security
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          Manage your sign-in methods, credentials, and account protection.
        </p>
      </div>

      <div className="space-y-3.5">
        {/* Row 1: Google Authentication Status */}
        <div className="border border-border-hairline bg-surface-low rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-card border border-border-hairline flex items-center justify-center shrink-0 shadow-2xs">
              <GoogleIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-xs text-on-surface font-semibold">Google Account</strong>
                {isGoogleConnected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-[#ebf8f2] text-[#2d8a74] border border-[#81efd2]/40 px-2 py-0.5 rounded-full font-medium">
                    <Check size={10} /> Connected &amp; Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] bg-surface-container text-text-muted border border-border-hairline px-2 py-0.5 rounded-full font-medium">
                    Not Linked
                  </span>
                )}
              </div>
              <span className="text-xs text-on-surface-variant font-mono mt-0.5 block">
                {isGoogleConnected ? email : "No Google account linked"}
              </span>
            </div>
          </div>

          {!isGoogleConnected && (
            <button
              type="button"
              disabled={isLinkingGoogle || !googleLoaded}
              onClick={() => triggerGoogle()}
              className="py-2 px-3.5 rounded-lg bg-card border border-border-hairline hover:bg-surface-container-low text-xs font-semibold text-on-surface shadow-2xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isLinkingGoogle && <Loader2 size={13} className="animate-spin text-primary" />}
              <span>Link Google Account</span>
            </button>
          )}
        </div>

        {/* Row 2: Password Authentication Status */}
        <div className="border border-border-hairline bg-surface-low rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-card border border-border-hairline flex items-center justify-center shrink-0 shadow-2xs text-primary">
              <KeyRound size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-xs text-on-surface font-semibold">
                  Password Authentication
                </strong>
                {hasPassword ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-[#ebf8f2] text-[#2d8a74] border border-[#81efd2]/40 px-2 py-0.5 rounded-full font-medium">
                    <Check size={10} /> Configured
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium">
                    Google Sign-In Only
                  </span>
                )}
              </div>
              <span className="text-xs text-on-surface-variant mt-0.5 block">
                {hasPassword
                  ? "Standard email and password login enabled"
                  : "Create a password to allow logging in with email & password"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenPasswordModal}
            className="py-2 px-3.5 rounded-lg bg-card border border-border-hairline hover:bg-surface-container-low text-xs font-semibold text-on-surface shadow-2xs transition-all cursor-pointer"
          >
            {hasPassword ? "Change Password" : "Set Password"}
          </button>
        </div>
      </div>

      {/* Change / Set Password Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card border border-border-hairline rounded-2xl shadow-modal max-w-sm w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck size={16} />
                </div>
                <h3 className="text-sm font-bold text-on-surface">
                  {hasPassword ? "Change Password" : "Set Account Password"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-text-muted hover:text-on-surface p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <p className="text-xs text-text-muted leading-relaxed">
                {hasPassword
                  ? "Enter your current password and choose a new secure password."
                  : "Choose a password to enable email & password sign-in as a secondary login method."}
              </p>

              {hasPassword && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Current Password
                  </label>
                  <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                    <Lock size={14} className="text-text-muted mr-2 shrink-0" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="text-text-muted hover:text-on-surface p-0.5 ml-1"
                    >
                      {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  New Password
                </label>
                <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                  <Lock size={14} className="text-text-muted mr-2 shrink-0" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-text-muted hover:text-on-surface p-0.5 ml-1"
                  >
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  Confirm New Password
                </label>
                <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                  <Lock size={14} className="text-text-muted mr-2 shrink-0" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                  />
                </div>
              </div>

              {modalError && <p className="text-xs text-error font-medium">{modalError}</p>}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/3 py-2.5 px-3 rounded-xl border border-border-hairline text-xs font-medium hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
