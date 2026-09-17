"use client";

import {
  CheckCircle2,
  FileCheck,
  Globe,
  Layers,
  Share2,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { AnimatedWorkflowConnectorProps, MobileVerticalConnectorProps } from "@/types";

/**
 * Reusable Animated Connector SVG
 * Draws a dashed baseline circuit path connecting 3 pillar nodes with a smooth traveling pulse highlight.
 */
export function AnimatedWorkflowConnector({ className = "" }: AnimatedWorkflowConnectorProps) {
  return (
    <div className={`workflow-connector-container ${className}`} aria-hidden="true">
      {/* Desktop Horizontal Connector SVG */}
      <svg
        className="workflow-connector-svg"
        viewBox="0 0 1080 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="circuitPulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#13678A" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#13678A" stopOpacity="1" />
            <stop offset="100%" stopColor="#45B69C" stopOpacity="0.95" />
          </linearGradient>
          <filter id="circuitGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Dotted Circuit Path */}
        <path
          d="M 168 8 L 168 32 A 16 16 0 0 0 184 48 L 524 48 A 16 16 0 0 0 540 32 L 540 8 L 540 32 A 16 16 0 0 0 556 48 L 896 48 A 16 16 0 0 0 912 32 L 912 8"
          stroke="#d7dade"
          strokeWidth="2"
          strokeDasharray="4 6"
          strokeLinecap="round"
        />

        {/* Animated Traveling Pulse Beam */}
        <path
          d="M 168 8 L 168 32 A 16 16 0 0 0 184 48 L 524 48 A 16 16 0 0 0 540 32 L 540 8 L 540 32 A 16 16 0 0 0 556 48 L 896 48 A 16 16 0 0 0 912 32 L 912 8"
          stroke="url(#circuitPulseGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          className="connector-pulse-beam"
          filter="url(#circuitGlow)"
        />

        {/* Connection Node 1 (Left / Create) */}
        <g className="node-group node-1">
          <circle cx="168" cy="8" r="6" fill="#ffffff" stroke="#13678A" strokeWidth="2.5" />
          <circle cx="168" cy="8" r="2.5" fill="#13678A" className="node-center-dot dot-1" />
        </g>

        {/* Connection Node 2 (Center / Curate) */}
        <g className="node-group node-2">
          <circle cx="540" cy="8" r="6" fill="#ffffff" stroke="#13678A" strokeWidth="2.5" />
          <circle cx="540" cy="8" r="2.5" fill="#13678A" className="node-center-dot dot-2" />
        </g>

        {/* Connection Node 3 (Right / Convert) */}
        <g className="node-group node-3">
          <circle cx="912" cy="8" r="6" fill="#ffffff" stroke="#13678A" strokeWidth="2.5" />
          <circle cx="912" cy="8" r="2.5" fill="#13678A" className="node-center-dot dot-3" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Mobile Vertical Connector for Stacked Cards
 */
function MobileVerticalConnector({ stepNumber }: MobileVerticalConnectorProps) {
  return (
    <div className="mobile-connector-wrapper md:hidden" aria-hidden="true">
      <svg
        className="mobile-connector-svg"
        viewBox="0 0 24 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 12 0 L 12 56"
          stroke="#d7dade"
          strokeWidth="2"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
        <path
          d="M 12 0 L 12 56"
          stroke="#13678A"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={`mobile-pulse-beam mobile-beam-${stepNumber}`}
        />
        <circle cx="12" cy="4" r="4.5" fill="#ffffff" stroke="#13678A" strokeWidth="2" />
        <circle cx="12" cy="52" r="4.5" fill="#ffffff" stroke="#13678A" strokeWidth="2" />
      </svg>
    </div>
  );
}

/**
 * 01 Create Preview Card (Studio Profile & Builder)
 */
function CreatePreviewCard() {
  return (
    <div className="workflow-preview-card create-card">
      <div className="card-browser-bar">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#e57373]" />
          <span className="w-2 h-2 rounded-full bg-[#ffb74d]" />
          <span className="w-2 h-2 rounded-full bg-[#81c784]" />
        </div>
        <div className="card-domain-pill">
          <Globe size={11} className="text-primary" />
          <span>elanevents.com/studio</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-tertiary font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
          <span>Live</span>
        </div>
      </div>

      <div className="card-body-content">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-secondary flex items-center justify-center shadow-xs shrink-0">
            <img
              src="https://cdn.accessa.ng/test/accessa/louis-dike-ayskyj/images/c95e52aa48bf676ed0d53f36bb957b81.png"
              alt="Store logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold text-on-surface">Élan Stores</h4>
              <Shield size={12} className="text-primary" />
            </div>
            <p className="text-[11px] text-on-surface-variant">Events & Decor Vendor</p>
          </div>
        </div>

        <div className="card-banner-mini mt-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-on-surface">Bespoke Experiences</span>
            <span className="text-[10px] font-mono text-primary bg-primary-container px-2 py-0.5 rounded">
              Lagos · London
            </span>
          </div>
          <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-1">
            Editorial weddings & private celebrations worldwide.
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border-hairline text-[11px]">
          <span className="text-on-surface-variant">Studio Theme</span>
          <span className="font-medium text-on-surface flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Noir & Champagne
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 02 Curate Preview Card (Multi-Channel Content & Services Sync)
 */
function CuratePreviewCard() {
  return (
    <div className="workflow-preview-card curate-card">
      <div className="card-browser-bar">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-on-surface">
          <Layers size={13} className="text-primary" />
          <span>Unified Channels</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-primary bg-primary-container px-2 py-0.5 rounded-full font-medium">
          <Share2 size={10} />
          <span>10 Platforms</span>
        </div>
      </div>

      <div className="card-body-content">
        {/* Media Thumbnail Mini-Grid */}
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          <div className="aspect-[4/3] rounded-lg bg-surface-container-high relative overflow-hidden flex items-end p-1">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=160&auto=format&fit=crop&q=80"
              alt="Gala"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="relative z-10 text-[8px] font-bold text-white bg-black/60 px-1 rounded backdrop-blur-xs">
              Gala
            </span>
          </div>
          <div className="aspect-[4/3] rounded-lg bg-surface-container-high relative overflow-hidden flex items-end p-1">
            <img
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=160&auto=format&fit=crop&q=80"
              alt="Wedding"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="relative z-10 text-[8px] font-bold text-white bg-black/60 px-1 rounded backdrop-blur-xs">
              Wedding
            </span>
          </div>
          <div className="aspect-[4/3] rounded-lg bg-surface-container-high relative overflow-hidden flex items-end p-1">
            <img
              src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=160&auto=format&fit=crop&q=80"
              alt="Dining"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="relative z-10 text-[8px] font-bold text-white bg-black/60 px-1 rounded backdrop-blur-xs">
              Dining
            </span>
          </div>
        </div>

        {/* Sync Status Pill Row */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] bg-surface-container-low p-1.5 rounded-md border border-border-hairline">
            <span className="font-medium text-on-surface flex items-center gap-1.5">
              <svg
                className="w-3 h-3 text-[#e1306c]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              @elanevents.live
            </span>
            <span className="text-[9px] text-tertiary font-semibold flex items-center gap-0.5">
              <CheckCircle2 size={10} /> Auto-Sync
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] bg-surface-container-low p-1.5 rounded-md border border-border-hairline">
            <span className="font-medium text-on-surface flex items-center gap-1.5">
              <Sparkles size={12} className="text-primary" />3 Curated Packages
            </span>
            <span className="text-[9px] text-on-surface-variant font-mono">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 03 Convert Preview Card (VIP Consultation & High-Value Deals)
 */
function ConvertPreviewCard() {
  return (
    <div className="workflow-preview-card convert-card">
      <div className="card-browser-bar">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface">
          <TrendingUp size={13} className="text-tertiary" />
          <span>VIP Inquiry Pipeline</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-on-tertiary-container bg-tertiary-container px-2 py-0.5 rounded-full font-bold">
          <span>High Intent</span>
        </div>
      </div>

      <div className="card-body-content">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-container border border-primary/20 text-primary flex items-center justify-center font-bold text-xs">
              VS
            </div>
            <div>
              <h5 className="text-xs font-semibold text-on-surface">Lady Victoria S.</h5>
              <p className="text-[10px] text-on-surface-variant">Lake Como 3-Day Gala</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold font-mono text-on-surface block">₦65,000</span>
            <span className="text-[9px] text-primary font-semibold">Tier 1 Bespoke</span>
          </div>
        </div>

        <div className="mt-3 bg-surface-container-low p-2 rounded-lg border border-border-hairline">
          <div className="flex items-center justify-between text-[10px] text-on-surface-variant mb-1">
            <span className="flex items-center gap-1">
              <FileCheck size={11} className="text-tertiary" /> Order Made
            </span>
            <span className="font-semibold text-tertiary">Paid & Delivered</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-tertiary h-full w-full rounded-full" />
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-border-hairline flex items-center justify-between text-[11px]">
          <span className="text-on-surface-variant">Deposit Retained</span>
          <span className="font-bold text-on-surface flex items-center gap-1">
            <CheckCircle2 size={12} className="text-tertiary" />
            ₦32,500 Paid
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Workflow Section Component ("Everything in its right place")
 */
export function WorkflowSection() {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const pillars = [
    {
      step: "01",
      title: "Create Storefront",
      description:
        "Build a custom 3D digital storefront and interactive stationery card in under 60 seconds.",
      PreviewComponent: CreatePreviewCard,
    },
    {
      step: "02",
      title: "Curate & Showcase",
      description:
        "Feature signature projects, connect verified social channels, and capture high-intent inquiries.",
      PreviewComponent: CuratePreviewCard,
    },
    {
      step: "03",
      title: "Convert & Scale",
      description:
        "Issue itemized invoices, broadcast drops to past clients, and watch your business valuation grow.",
      PreviewComponent: ConvertPreviewCard,
    },
  ];

  return (
    <section className="workflow" id="workflow">
      <div className="section-intro">
        <h2 id="workflow-title">
          Everything in its <span className="text-primary font-bold">right place.</span>
        </h2>
      </div>

      {/* Interactive Workflow Layout */}
      <div className="workflow-showcase-container">
        {/* Row of 3 Product Preview Cards */}
        <div className="workflow-cards-row">
          {pillars.map((pillar, index) => {
            const { PreviewComponent } = pillar;
            return (
              <div
                key={pillar.step}
                className={`workflow-card-column ${activeTab === index ? "is-hovered" : ""}`}
                onMouseEnter={() => setActiveTab(index)}
                onMouseLeave={() => setActiveTab(null)}
              >
                <PreviewComponent />
                {index < pillars.length - 1 && <MobileVerticalConnector stepNumber={index + 1} />}
              </div>
            );
          })}
        </div>

        {/* Animated Connector Visual Circuit (Desktop) */}
        <AnimatedWorkflowConnector />

        {/* 01 / 02 / 03 Text Blocks Below Visual */}
        <div className="workflow-grid">
          {pillars.map(pillar => (
            <div key={pillar.step} className="workflow-pillar-item">
              <span className="step">{pillar.step}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
