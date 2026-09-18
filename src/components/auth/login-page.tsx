"use client";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Globe,
  HelpCircle,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { GoogleIcon } from "@/components/shared/icons";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { confirmPasswordReset, requestPasswordReset, signIn, signInWithGoogle } from "@/lib/api";

export function LoginPage() {
  const [claimParam, setClaimParam] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  // Email/Password State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const claim = params.get("claim");
      if (claim) setClaimParam(claim);
    }
  }, []);

  const handleCredential = async (codeOrToken: string) => {
    setIsSubmitting(true);
    setAuthError("");
    setUnverifiedEmail(null);
    try {
      const isJwt = codeOrToken.split(".").length === 3;

      await signInWithGoogle({
        code: isJwt ? undefined : codeOrToken,
        idToken: isJwt ? codeOrToken : undefined,
        claimSlug: claimParam,
      });
      window.location.href = claimParam
        ? `/vendor/settings?claim=${encodeURIComponent(claimParam)}`
        : "/vendor/overview";
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const { trigger: triggerGoogle, loaded: googleLoaded } = useGoogleAuth(
    handleCredential,
    setAuthError
  );

  const handleGoogleSignIn = () => {
    setAuthError("");
    triggerGoogle();
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsEmailSubmitting(true);
    setAuthError("");
    setUnverifiedEmail(null);

    try {
      await signIn(email.trim(), password);
      window.location.href = claimParam
        ? `/vendor/settings?claim=${encodeURIComponent(claimParam)}`
        : "/vendor/overview";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign-in failed. Please try again.";

      // Check if error is due to unverified email
      if (
        message.toLowerCase().includes("not verified") ||
        message.toLowerCase().includes("verification code")
      ) {
        setUnverifiedEmail(email.trim());
      }

      setAuthError(message);
      setIsEmailSubmitting(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const res = await requestPasswordReset(forgotEmail.trim());
      setForgotMessage(res.message || "Reset code sent to your email.");
      setForgotStep(2);
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : "Failed to send reset code.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotCode || !forgotNewPassword) return;

    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const res = await confirmPasswordReset({
        email: forgotEmail.trim(),
        resetCode: forgotCode.trim(),
        newPassword: forgotNewPassword,
      });
      setForgotMessage(res.message || "Password reset successfully. You can now log in.");
      setTimeout(() => {
        setForgotModalOpen(false);
        setForgotStep(1);
        setEmail(forgotEmail.trim());
        setPassword(forgotNewPassword);
      }, 1500);
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col lg:flex-row font-sans selection:bg-primary selection:text-white">
      {/* Left Panel: Auth Form */}
      <div className="w-full lg:w-[58%] min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <BrandLogo size="md" href="/" />

          <div className="flex items-center gap-5 text-xs text-text-muted">
            <a
              href="mailto:support@shopwus.com"
              className="text-primary hover:underline font-medium flex items-center gap-1"
            >
              <HelpCircle size={14} />
              <span>Need help?</span>
            </a>
            <div className="h-3.5 w-px bg-border-hairline hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 text-on-surface font-medium cursor-pointer">
              <Globe size={14} className="text-text-muted" />
              <span>English</span>
              <ChevronDown size={13} className="text-outline" />
            </div>
          </div>
        </div>

        {/* Action Container */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Sign In
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Welcome back. Access your storefront dashboard and vendor tools.
            </p>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Email Address
              </label>
              <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-3 text-xs transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                <Mail size={15} className="text-text-muted mr-2.5 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-on-surface">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotStep(1);
                    setForgotError("");
                    setForgotMessage("");
                    setForgotModalOpen(true);
                  }}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-3 text-xs transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                <Lock size={15} className="text-text-muted mr-2.5 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted hover:text-on-surface focus:outline-none p-0.5 ml-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-border-subtle text-primary focus:ring-0 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isEmailSubmitting || isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              {isEmailSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Signing in…</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-hairline" />
            </div>
            <span className="relative bg-surface px-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">
              or continue with
            </span>
          </div>

          {/* Secondary Google Auth Button */}
          <div>
            <button
              type="button"
              disabled={isSubmitting || !googleLoaded}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low border border-border-hairline text-on-surface text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span>Connecting with Google…</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-md bg-white border border-border-hairline flex items-center justify-center shrink-0 shadow-2xs">
                    <GoogleIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>{googleLoaded ? "Sign in with Google" : "Loading…"}</span>
                </>
              )}
            </button>
          </div>

          {/* Auth Errors & Recovery */}
          {authError && (
            <div className="mt-4 p-3.5 bg-error-container border border-error/20 rounded-xl text-center space-y-2">
              <p className="text-xs text-error font-medium leading-relaxed">{authError}</p>

              {/* Abandoned OTP recovery link */}
              {unverifiedEmail && (
                <div>
                  <Link
                    href={`/signup?verifyEmail=${encodeURIComponent(unverifiedEmail)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-2"
                  >
                    <span>Click here to enter your verification code</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              )}

              {authError.toLowerCase().includes("no account found") && (
                <div>
                  <Link
                    href={
                      claimParam ? `/signup?claim=${encodeURIComponent(claimParam)}` : "/signup"
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-2"
                  >
                    <span>Please sign up first to create your storefront</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Bottom Links */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-hairline text-xs text-text-muted">
            <span>Don&apos;t have an account yet?</span>
            <Link
              href="/signup"
              className="text-primary font-semibold underline underline-offset-2 hover:opacity-85"
            >
              Get started
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center lg:text-left text-[11px] text-text-muted">
          © {new Date().getFullYear()} Shopwus. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Feature Preview */}
      <div className="w-full lg:w-[42%] bg-gradient-to-br from-[#012030] via-[#083045] to-[#012030] text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md mx-auto space-y-8 relative z-10">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Manage your entire business right from your Shopwus Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Supercharge your lead intake, customer CRM, multi-currency invoicing, and real-time
              business valuation in one cohesive workspace.
            </p>
            <div>
              <Link
                href="/#features"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white underline underline-offset-4 hover:text-slate-200"
              >
                <span>Learn More</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Interactive Mockup Preview Card */}
          <div className="bg-card text-on-surface rounded-2xl p-6 shadow-xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-secondary text-white flex items-center justify-center font-sans text-[10px] font-bold">
                  É
                </div>
                <strong className="text-xs font-bold text-on-surface">Élan Stores</strong>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full font-medium">
                <CheckCircle2 size={11} /> Invoice Paid
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-on-surface-variant">
              <div className="p-3 bg-surface-container-low rounded-xl space-y-1 text-[11px]">
                <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider">
                  Client Note
                </span>
                <p>
                  &ldquo;Here is the itemized invoice for the March Grand Gala. Deposit has been
                  received!&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <CreditCard size={14} className="text-primary" />
                <span className="font-semibold text-on-surface">₦2,500,000</span>
              </div>

              <div className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer shadow-2xs">
                <Download size={12} />
                <span>Download Receipt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card border border-border-hairline rounded-2xl shadow-modal max-w-sm w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <KeyRound size={16} />
                </div>
                <h3 className="text-sm font-bold text-on-surface">
                  {forgotStep === 1 ? "Reset Password" : "Set New Password"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-text-muted hover:text-on-surface p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <p className="text-xs text-text-muted leading-relaxed">
                  Enter your registered account email and we&apos;ll send you a 6-digit verification
                  code to reset your password.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Account Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="director@elanatelier.com"
                    className="w-full text-xs text-on-surface bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 outline-none focus:border-primary"
                  />
                </div>

                {forgotError && <p className="text-xs text-error font-medium">{forgotError}</p>}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {forgotLoading && <Loader2 size={14} className="animate-spin" />}
                  <span>Send Reset Code</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-4">
                <p className="text-xs text-text-muted leading-relaxed">
                  Enter the 6-digit code sent to{" "}
                  <strong className="text-on-surface">{forgotEmail}</strong> along with your new
                  password.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotCode}
                    onChange={e => setForgotCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full text-center tracking-widest font-mono text-sm text-on-surface bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={forgotNewPassword}
                    onChange={e => setForgotNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full text-xs text-on-surface bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 outline-none focus:border-primary"
                  />
                </div>

                {forgotError && <p className="text-xs text-error font-medium">{forgotError}</p>}
                {forgotMessage && (
                  <p className="text-xs text-tertiary font-medium flex items-center gap-1.5">
                    <Check size={13} />
                    <span>{forgotMessage}</span>
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="w-1/3 py-2.5 px-3 rounded-xl border border-border-hairline text-xs font-medium hover:bg-surface-container-low"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-2/3 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {forgotLoading && <Loader2 size={14} className="animate-spin" />}
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
