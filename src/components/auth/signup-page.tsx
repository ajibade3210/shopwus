"use client";

import { Check, ChevronDown, Globe, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { GoogleIcon } from "@/components/shared/icons";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { checkSlugAvailability, signUpWithGoogle, updateBusinessProfile } from "@/lib/api";

export function SignupPage() {
  const router = useRouter();
  const [claimSlug, setClaimSlug] = useState("");
  const [studioName, setStudioName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [authError, setAuthError] = useState("");

  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedCycle, setSelectedCycle] = useState("");
  const [businessType, setBusinessType] = useState<"service" | "sales" | "retail" | "ecommerce">(
    "sales"
  );

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const claim = params.get("claim") || "";
      const planParam = params.get("plan") || "";
      const cycleParam = params.get("cycle") || "";
      const typeParam = params.get("type") || params.get("businessType") || "";

      if (planParam) setSelectedPlan(planParam);
      if (cycleParam) setSelectedCycle(cycleParam);
      if (
        typeParam &&
        ["service", "sales", "retail", "ecommerce"].includes(typeParam.toLowerCase())
      ) {
        setBusinessType(typeParam.toLowerCase() as "service" | "sales" | "retail" | "ecommerce");
      }

      if (claim) {
        const clean = claim.toLowerCase().replace(/[^a-z0-9-]/g, "");
        setClaimSlug(clean);
        setSlug(clean);
        const formatted = clean
          .split("-")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        setStudioName(formatted);
      }
    }
  }, []);

  // Validate slug availability when changed
  useEffect(() => {
    if (!slug) return;
    setIsCheckingSlug(true);
    const timer = setTimeout(() => {
      checkSlugAvailability(slug).then(res => {
        setSlugAvailable(res.available);
        setIsCheckingSlug(false);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [slug]);

  const handleCredential = async (codeOrToken: string) => {
    if (!agreedToTerms) return;
    setIsSubmitting(true);
    setAuthError("");
    const effectiveSlug = slug || claimSlug || "my-storefront";
    const effectiveName = studioName || "My Storefront";

    try {
      const isJwt = codeOrToken.split(".").length === 3;
      await signUpWithGoogle({
        code: isJwt ? undefined : codeOrToken,
        idToken: isJwt ? codeOrToken : undefined,
        slug: effectiveSlug,
        studioName: effectiveName,
      });
      await updateBusinessProfile({
        businessName: effectiveName,
        slug: effectiveSlug,
        businessType,
      });
      router.push(`/vendor/settings?claimed=${encodeURIComponent(effectiveSlug)}`);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign-up failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const { trigger: triggerGoogle, loaded: googleLoaded } = useGoogleAuth(
    handleCredential,
    setAuthError
  );

  const handleGoogleSignup = () => {
    if (!agreedToTerms) return;
    setAuthError("");
    triggerGoogle();
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col lg:flex-row font-sans selection:bg-primary selection:text-white">
      {/* Left Panel: Signup Flow */}
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

        {/* Form Area */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Get Started
              </h1>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                {selectedPlan
                  ? `Start your ${selectedPlan === "trial" ? "14-day free trial" : `${selectedPlan} (${selectedCycle || "monthly"})`} to continue.`
                  : "Create your free Shopwus account with Google."}
              </p>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted shrink-0 mt-1">
              STEP 1 / 3
            </span>
          </div>

          {/* Optional Handle & Studio Setup */}
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-on-surface">
                  Claim your public URL{" "}
                  <span className="text-text-muted font-normal">(optional)</span>
                </label>
                {slug && (
                  <span className="text-[10px] text-text-muted">
                    {isCheckingSlug ? (
                      "Checking…"
                    ) : slugAvailable ? (
                      <span className="text-tertiary flex items-center gap-1 font-medium">
                        <Check size={10} /> Available
                      </span>
                    ) : (
                      <span className="text-error font-medium">Unavailable</span>
                    )}
                  </span>
                )}
              </div>
              <div className="signup-field flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                <span className="text-text-muted select-none shrink-0 text-xs mr-1 font-medium">
                  shopwus.com/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="your-brand"
                  className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Business / Brand Name{" "}
                <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <div className="signup-field flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                <input
                  type="text"
                  value={studioName}
                  onChange={e => setStudioName(e.target.value)}
                  placeholder="e.g. Élan Store"
                  className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none"
                />
              </div>
            </div>

            {/* Business Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-2">
                Business Type
              </label>
              <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Business Type">
                {[
                  { key: "service", label: "Service" },
                  { key: "sales", label: "Sales" },
                  { key: "retail", label: "Retail" },
                  { key: "ecommerce", label: "Ecommerce" },
                ].map(item => {
                  const isSelected = businessType === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setBusinessType(item.key as typeof businessType)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-2xs"
                          : "bg-surface-container-lowest text-on-surface-variant border-border-hairline hover:bg-surface-container-low"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Primary Google Auth Button */}
          <div className="space-y-4">
            <button
              type="button"
              disabled={isSubmitting || !agreedToTerms || !googleLoaded}
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Connecting with Google…</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center shrink-0">
                    <GoogleIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>{googleLoaded ? "Sign up with Google" : "Loading…"}</span>
                </>
              )}
            </button>

            {/* Auth error */}
            {authError && <p className="text-[11px] text-error text-center pt-1">{authError}</p>}

            {/* Terms Agreement Checkbox */}
            <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-border-subtle text-primary focus:ring-0 cursor-pointer shrink-0"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-primary underline hover:opacity-80">
                  Terms & Conditions
                </Link>{" "}
                and have read the{" "}
                <Link href="/privacy" className="text-primary underline hover:opacity-80">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          {/* Bottom Link */}
          <div className="pt-6 mt-6 border-t border-border-hairline flex items-center justify-between text-xs text-text-muted">
            <span>Already have an account?</span>
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in to Dashboard
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center lg:text-left text-[11px] text-text-muted">
          © {new Date().getFullYear()} Shopwus. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Testimonials Showcase */}
      <div className="w-full lg:w-[42%] bg-gradient-to-br from-[#012030] via-[#083045] to-[#012030] text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md mx-auto space-y-8 relative z-10">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to join Shopwus?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Over 2000+ online businesses, merchants, event planners, and creative studios use
              Shopwus to turn visitors into paying clients.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="space-y-4">
            {/* Card 1 */}
            <div className="bg-card text-on-surface rounded-2xl p-5 border border-white/10 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Élan Stores
                </strong>
                <span className="text-[10px] bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full font-medium">
                  Verified business
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                &ldquo;Through Shopwus&apos;s bespoke storefronts and invoicing, our team has
                seamless customer tracking, instant deposits, and complete financial clarity.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold font-sans">
                  EV
                </div>
                <div>
                  <strong className="text-xs font-bold text-on-surface block">Elena Vance</strong>
                  <span className="text-[11px] text-text-muted block">
                    Creative Director · Vance Retail
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-card text-on-surface rounded-2xl p-5 border border-white/10 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Maison Production
                </strong>
                <span className="text-[10px] bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full font-medium">
                  Flagship Brand
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                &ldquo;A reliable platform built for modern commerce that connects our inquiries,
                multi-currency invoicing, and real-time business valuation.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold font-sans">
                  LH
                </div>
                <div>
                  <strong className="text-xs font-bold text-on-surface block">Laurent Hayoz</strong>
                  <span className="text-[11px] text-text-muted block">
                    Head of Digital & Experiential
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
