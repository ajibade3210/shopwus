"use client";

import { ArrowRight, Check, Eye, EyeOff, KeyRound, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { confirmPasswordReset } from "@/lib/api";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const codeParam = searchParams.get("code");
    if (emailParam) setEmail(emailParam);
    if (codeParam) setResetCode(codeParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await confirmPasswordReset({
        email: email.trim(),
        resetCode: resetCode.trim(),
        newPassword,
      });

      setStatusMessage(res.message || "Password updated successfully. Redirecting to login…");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to reset password. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-between p-6 sm:p-10 font-sans selection:bg-primary selection:text-white">
      {/* Header */}
      <div className="flex items-center justify-between max-w-md w-full mx-auto">
        <BrandLogo size="md" href="/" />
        <Link href="/login" className="text-xs font-semibold text-primary hover:underline">
          Back to Login
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-card border border-border-hairline rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-3 border-b border-border-hairline pb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <KeyRound size={20} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight">
                Reset Your Password
              </h1>
              <p className="text-xs text-text-muted mt-0.5">
                Set a secure new password for your Shopwus account.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Account Email
              </label>
              <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                <Mail size={15} className="text-text-muted mr-2.5 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="director@elanatelier.com"
                  className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                6-Digit Reset Code
              </label>
              <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={resetCode}
                  onChange={e => setResetCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full text-center tracking-widest font-mono text-sm text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                New Password
              </label>
              <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                <Lock size={15} className="text-text-muted mr-2.5 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted hover:text-on-surface p-0.5 ml-1"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Confirm New Password
              </label>
              <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                <Lock size={15} className="text-text-muted mr-2.5 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-error-container border border-error/20 rounded-xl text-center">
                <p className="text-xs text-error font-medium">{errorMessage}</p>
              </div>
            )}

            {statusMessage && (
              <div className="p-3 bg-tertiary-container text-on-tertiary-container border border-tertiary/20 rounded-xl text-center flex items-center justify-center gap-2">
                <Check size={14} />
                <span className="text-xs font-medium">{statusMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin text-white" />
                  <span>Updating Password…</span>
                </>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-text-muted">
        © {new Date().getFullYear()} Shopwus. All rights reserved.
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-text-muted">
          Loading…
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
