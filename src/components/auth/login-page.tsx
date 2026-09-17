"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  Globe,
  HelpCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { GoogleIcon } from "@/components/shared/icons";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { signInWithGoogle } from "@/lib/api";

export function LoginPage() {
  const [claimParam, setClaimParam] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

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

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col lg:flex-row font-sans selection:bg-primary selection:text-white">
      {/* Left Panel: Google Sign-in */}
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
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Login</h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Sign in with your verified Google account to access your business dashboard.
            </p>
          </div>

          {/* Primary Google Auth Button */}
          <div className="space-y-4">
            <button
              type="button"
              disabled={isSubmitting || !googleLoaded}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Signing in with Google…</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center shrink-0">
                    <GoogleIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>{googleLoaded ? "Sign in with Google" : "Loading…"}</span>
                </>
              )}
            </button>

            {/* Auth error */}
            {authError && (
              <div className="p-3.5 bg-error-container border border-error/20 rounded-xl text-center space-y-2">
                <p className="text-xs text-error font-medium leading-relaxed">{authError}</p>
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
          </div>

          {/* Bottom Links */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-border-hairline text-xs text-text-muted">
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
    </div>
  );
}
