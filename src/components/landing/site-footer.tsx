"use client";

import { ChevronUp, Smartphone } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";

const QR_CODE_IMAGE_SRC =
  "https://cdn.accessa.ng/test/accessa/joe-fitness/qrcodes/images/7343ffeb0bfd056e77e8e8d52edf0722.png";

const FOOTER_NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#workflow" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Valuation Calculator", href: "/valuation-calculator" },
  { label: "FAQ", href: "/#faq" },
  { label: "Sign up", href: "/signup" },
  { label: "Enter Studio", href: "/login" },
] as const;

const FOOTER_CONNECT_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "Twitter / X", href: "https://x.com" },
] as const;

const FOOTER_LEGAL_LINKS = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
] as const;

export function SiteFooter() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-container">
        {/* Main Content Grid */}
        <div className="footer-main-grid">
          {/* Left Block: Brand, Mission & Companion App Card */}
          <div className="footer-brand-block">
            <BrandLogo size="md" />

            <p className="footer-mission-text">
              The operational and financial intelligence engine engineered for online businesses,
              growing merchants, and independent brands.
            </p>

            {/* Companion App Card */}
            <div className="footer-app-card">
              <div className="footer-app-qr">
                <img
                  src={QR_CODE_IMAGE_SRC}
                  alt="Shopwus companion iOS app QR code"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div className="footer-app-info">
                <div className="footer-app-badge">
                  <Smartphone size={12} />
                  <span>iOS & Mobile Companion</span>
                </div>
                <strong className="footer-app-title">Download Shopwus Mobile</strong>
                <span className="footer-app-desc">
                  Instant notifications, customer orders & lead management
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="footer-nav-column footer-center-column">
            <h3 className="footer-nav-title">Navigation</h3>
            <ul className="footer-nav-list">
              {FOOTER_NAV_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="footer-nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div className="footer-nav-column footer-connect-column">
            <h3 className="footer-nav-title">Connect</h3>
            <ul className="footer-nav-list">
              {FOOTER_CONNECT_LINKS.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="footer-nav-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: BORING */}
          <div className="footer-nav-column footer-boring-column">
            <h3 className="footer-nav-title">BORING</h3>
            <ul className="footer-nav-list">
              {FOOTER_LEGAL_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="footer-nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} Shopwus. All rights reserved.</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="footer-back-to-top"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ChevronUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
