"use client";

import { Check, Send, Sparkles } from "lucide-react";
import { useState } from "react";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail("");
    }, 4000);
  };

  return (
    <div className="footer-hero-band">
      <div className="footer-hero-copy">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ece1] border border-[#e5d8c5] text-xs font-semibold tracking-wide text-[#785933] mb-3">
          <Sparkles size={13} className="text-[#a87d46]" />
          <span>The Merchant Dispatch</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#191c1d]">
          Curated intelligence for modern vendors and merchants.
        </h2>
        <p className="text-sm sm:text-base text-[#5c5f60] max-w-xl mt-2 leading-relaxed">
          Join over 4,200+ online vendors and founders receiving our weekly dispatch on customer
          acquisition, storefront growth, and financial operations.
        </p>
      </div>

      <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
        <div className="footer-input-wrapper">
          <input
            aria-label="Business email address"
            type="email"
            placeholder="founder@yourbrand.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={submitted}
            className="footer-email-input"
          />
          <button type="submit" disabled={submitted} className="footer-submit-btn">
            {submitted ? (
              <span className="flex items-center gap-1.5 text-[#2e7d32]">
                <Check size={16} /> Subscribed
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Subscribe <Send size={13} />
              </span>
            )}
          </button>
        </div>
        {submitted && (
          <p className="text-xs text-[#2e7d32] mt-2 font-medium animate-fadeIn">
            ✓ Welcome to The Merchant Dispatch. Your first edition arrives this Monday.
          </p>
        )}
      </form>
    </div>
  );
}
