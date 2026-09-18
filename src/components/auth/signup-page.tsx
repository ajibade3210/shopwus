"use client";

import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  HelpCircle,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { GoogleIcon } from "@/components/shared/icons";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import {
  checkSlugAvailability,
  resendVerificationCode,
  signUpWithEmail,
  signUpWithGoogle,
  updateBusinessProfile,
  verifyEmail,
} from "@/lib/api";

export function SignupPage() {
  const router = useRouter();

  // Studio setup state
  const [claimSlug, setClaimSlug] = useState("");
  const [studioName, setStudioName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [businessType, setBusinessType] = useState<"service" | "sales" | "retail" | "ecommerce">(
    "sales"
  );
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedCycle, setSelectedCycle] = useState("");

  // Account credentials state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  // OTP Verification state
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpSlots, setOtpSlots] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState("");
  const slotRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const claim = params.get("claim") || "";
      const planParam = params.get("plan") || "";
      const cycleParam = params.get("cycle") || "";
      const typeParam = params.get("type") || params.get("businessType") || "";
      const verifyEmailParam = params.get("verifyEmail");

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

      if (verifyEmailParam) {
        setEmail(verifyEmailParam);
        setIsOtpStep(true);
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

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Google Auth Handlers
  const handleGoogleCredential = async (codeOrToken: string) => {
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
    handleGoogleCredential,
    setAuthError
  );

  const handleGoogleSignup = () => {
    if (!agreedToTerms) return;
    setAuthError("");
    triggerGoogle();
  };

  // Email Signup Handler
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;

    if (!fullName.trim()) {
      setAuthError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setAuthError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    setAuthError("");

    const effectiveSlug = slug || claimSlug || "my-storefront";
    const effectiveName = studioName || "My Storefront";

    try {
      const res = await signUpWithEmail({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        studioName: effectiveName,
        slug: effectiveSlug,
        businessType,
      });

      if (res.requiresVerification) {
        setIsOtpStep(true);
        setResendCooldown(45);
        setTimeout(() => {
          slotRefs.current[0]?.focus();
        }, 150);
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign-up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP Slot Input Changes
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const updated = [...otpSlots];
    updated[index] = digit;
    setOtpSlots(updated);
    setOtpError("");

    if (digit && index < 5) {
      slotRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpSlots[index] && index > 0) {
      slotRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const updated = [...otpSlots];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || "";
    }
    setOtpSlots(updated);

    const nextFocus = Math.min(pasted.length, 5);
    slotRefs.current[nextFocus]?.focus();
  };

  // Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpSlots.join("");
    if (fullCode.length !== 6) {
      setOtpError("Please enter all 6 digits of your verification code.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      const session = await verifyEmail(email.trim(), fullCode);
      const destinationSlug = session.studioSlug || slug || claimSlug || "";

      // If studioName was provided in the current session, sync optionally
      if (studioName && slug) {
        try {
          await updateBusinessProfile({
            businessName: studioName,
            slug,
            businessType,
          });
        } catch {
          // Business was already created during signup; non-fatal if duplicate slug
        }
      }

      window.location.href = destinationSlug
        ? `/vendor/settings?claimed=${encodeURIComponent(destinationSlug)}`
        : "/vendor/overview";
    } catch (err) {
      setOtpError(
        err instanceof Error ? err.message : "Verification failed. Please check your code."
      );
      setIsVerifyingOtp(false);
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setResendSuccess("");
    setOtpError("");

    try {
      const res = await resendVerificationCode(email.trim());
      setResendSuccess(res.message || "A fresh code has been sent to your email.");
      setResendCooldown(45);
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Failed to resend code.");
    }
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

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          {!isOtpStep ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                    Get Started
                  </h1>
                  <p className="text-xs sm:text-sm text-text-muted mt-1">
                    {selectedPlan
                      ? `Start your ${selectedPlan === "trial" ? "14-day free trial" : `${selectedPlan} (${selectedCycle || "monthly"})`} to continue.`
                      : "Create your free Shopwus account and launch your digital storefront."}
                  </p>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted shrink-0 mt-1">
                  STEP 1 / 3
                </span>
              </div>

              {/* 1-Click Google Signup */}
              <div className="mb-6">
                <button
                  type="button"
                  disabled={isSubmitting || !agreedToTerms || !googleLoaded}
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low border border-border-hairline text-on-surface text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
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
                      <span>{googleLoaded ? "Sign up with Google" : "Loading Google…"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-hairline" />
                </div>
                <span className="relative bg-surface px-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">
                  or sign up with email
                </span>
              </div>

              {/* Credentials & Storefront Form */}
              <form onSubmit={handleEmailSignup} className="space-y-5">
                {/* Section 1: Account Credentials */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    1. Account Credentials
                  </span>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Full Name
                    </label>
                    <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                      <UserIcon size={14} className="text-text-muted mr-2 shrink-0" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Elena Vance"
                        className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                      <Mail size={14} className="text-text-muted mr-2 shrink-0" />
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
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Password
                    </label>
                    <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                      <Lock size={14} className="text-text-muted mr-2 shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-text-muted hover:text-on-surface p-0.5 ml-1"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 2: Storefront Identity */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    2. Storefront Identity
                  </span>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-on-surface">
                        Claim public URL{" "}
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
                    <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                      <span className="text-text-muted select-none shrink-0 text-xs mr-1 font-medium">
                        shopwus.com/
                      </span>
                      <input
                        type="text"
                        value={slug}
                        onChange={e =>
                          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                        }
                        placeholder="your-brand"
                        className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Business / Brand Name{" "}
                      <span className="text-text-muted font-normal">(optional)</span>
                    </label>
                    <div className="flex items-center bg-surface-container-lowest border border-border-hairline rounded-xl px-3.5 py-2.5 text-xs transition-all focus-within:border-primary">
                      <input
                        type="text"
                        value={studioName}
                        onChange={e => setStudioName(e.target.value)}
                        placeholder="e.g. Élan Atelier"
                        className="w-full text-xs text-on-surface placeholder:text-text-placeholder outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">
                      Business Type
                    </label>
                    <div className="grid grid-cols-4 gap-2">
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
                            className={`py-2 px-1.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
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

                {/* Terms Agreement */}
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
                    and{" "}
                    <Link href="/privacy" className="text-primary underline hover:opacity-80">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {/* Auth Error */}
                {authError && (
                  <p className="text-xs text-error font-medium text-center">{authError}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !agreedToTerms}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white" />
                      <span>Creating Account…</span>
                    </>
                  ) : (
                    <span>Create Account & Continue</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Step 2: OTP Verification Screen */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                    Check your inbox
                  </h1>
                  <p className="text-xs sm:text-sm text-text-muted mt-1.5 leading-relaxed">
                    We sent a 6-digit verification code to{" "}
                    <strong className="text-on-surface font-semibold">{email}</strong>. Enter it
                    below to activate your storefront.
                  </p>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted shrink-0 mt-1">
                  STEP 2 / 3
                </span>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6-Slot OTP Input */}
                <div
                  className="flex items-center justify-between gap-2 sm:gap-3 on-paste"
                  onPaste={handleOtpPaste}
                >
                  {otpSlots.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => {
                        slotRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center font-mono text-xl font-bold rounded-xl bg-surface-container-lowest border border-border-hairline text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-xs text-error font-medium text-center">{otpError}</p>
                )}

                {resendSuccess && (
                  <p className="text-xs text-tertiary font-medium text-center flex items-center justify-center gap-1.5">
                    <Check size={13} />
                    <span>{resendSuccess}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isVerifyingOtp || otpSlots.join("").length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white" />
                      <span>Verifying Code…</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Launch Storefront</span>
                      <Sparkles size={14} />
                    </>
                  )}
                </button>

                {/* Resend & Deliverability Helper */}
                <div className="text-center space-y-2 pt-2">
                  <p className="text-xs text-text-muted">
                    Didn&apos;t receive the code? Check your spam/promotions folder or{" "}
                    <button
                      type="button"
                      disabled={resendCooldown > 0}
                      onClick={handleResendOtp}
                      className="text-primary font-semibold hover:underline disabled:opacity-50"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                    </button>
                  </p>

                  <div className="pt-4 border-t border-border-hairline">
                    <button
                      type="button"
                      onClick={() => setIsOtpStep(false)}
                      className="text-xs text-text-muted hover:text-on-surface font-medium"
                    >
                      &larr; Change email address
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

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

          <div className="space-y-4">
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
