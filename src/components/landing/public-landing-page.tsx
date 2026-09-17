"use client";

import { ArrowRight } from "lucide-react";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FloatingChatWidget } from "@/components/landing/floating-chat-widget";
import { HeroRotatingCard } from "@/components/landing/hero-rotating-card";
import { PricingSection } from "@/components/landing/pricing-section";
import { ResourcesDropdown } from "@/components/landing/resources-dropdown";
import { SiteFooter } from "@/components/landing/site-footer";
import { TrustedBusinesses } from "@/components/landing/trusted-businesses";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useScroll } from "@/hooks";

export function PublicLandingPage() {
  const isScrolled = useScroll(20);

  return (
    <main className="public">
      <header className={`public-nav ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="public-nav-left">
          <nav>
            <a href="#features">Features</a>
            <a href="#workflow">How it works</a>
            <a href="#pricing">Pricing</a>
            <ResourcesDropdown />
            <a href="#faq">FAQ</a>
          </nav>
        </div>
        <BrandLogo className="public-logo" />
        <div className="nav-ctas">
          <a
            href="/signup"
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Sign up
          </a>
          <a
            className="dark-button bg-primary hover:bg-primary-hover border-primary hover:border-primary-hover rounded-md text-white shadow-xs"
            href="/login"
          >
            Enter Studio <ArrowRight size={15} />
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <h1 className="font-sans font-bold text-on-surface tracking-tight">
            An operational & financial
            <br />
            <span className="text-primary font-bold">
              intelligence engine for online businesses.
            </span>
          </h1>
          <p className="text-on-surface-variant text-base leading-relaxed">
            Unify your storefront, client pipelines, itemized multi-currency invoicing, expense
            bookkeeping, and live valuation analytics—all in one unified operating system.
          </p>
          <div className="hero-ctas">
            <a
              className="dark-button bg-primary hover:bg-primary-hover border-primary hover:border-primary-hover rounded-md text-white shadow-xs"
              href="/signup"
            >
              Start my free trial now <ArrowRight size={15} />
            </a>
          </div>
        </div>

        <HeroRotatingCard />
      </section>

      <TrustedBusinesses />
      <FeaturesSection />
      <WorkflowSection />
      <PricingSection />
      <FaqSection />
      <SiteFooter />
      <FloatingChatWidget />
    </main>
  );
}
