"use client";

import type { BlogGraphicCardProps } from "@/types";

export function RetentionFlywheelGraphic({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-border-hairline bg-surface-container-low p-6 sm:p-8 flex flex-col items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 800 420"
        className="w-full h-auto max-h-[380px] drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Grid Pattern */}
        <defs>
          <pattern id="grid-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#e8dfd2" />
          </pattern>
          <linearGradient id="leaky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fee2e2" />
            <stop offset="100%" stopColor="#fecaca" />
          </linearGradient>
          <linearGradient id="flywheel-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ecfdf5" />
            <stop offset="100%" stopColor="#d1fae5" />
          </linearGradient>
          <linearGradient id="coin-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        <rect width="800" height="420" fill="url(#grid-dots)" opacity="0.6" />

        {/* LEFT SIDE: The Leaky Bucket (Cartoon) */}
        <g transform="translate(60, 40)">
          {/* Label Card */}
          <rect
            x="0"
            y="0"
            width="300"
            height="340"
            rx="16"
            fill="white"
            stroke="#fca5a5"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <rect x="20" y="16" width="130" height="24" rx="12" fill="#fee2e2" />
          <text
            x="85"
            y="32"
            fill="#dc2626"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            ❌ The Leaky Bucket
          </text>
          <text
            x="150"
            y="60"
            fill="#8c827a"
            fontSize="11"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            Acquiring leads & losing them forever
          </text>

          {/* Ad Spend Pouring In */}
          <path d="M150 75 L150 120" stroke="#f87171" strokeWidth="3" strokeDasharray="5 3" />
          <polygon points="150,126 144,116 156,116" fill="#f87171" />
          <rect x="95" y="80" width="110" height="22" rx="6" fill="#fef2f2" stroke="#fca5a5" />
          <text
            x="150"
            y="95"
            fill="#b91c1c"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            💸 Expensive Ads & DMs
          </text>

          {/* Bucket Shape */}
          <path
            d="M90 130 L210 130 L195 240 L105 240 Z"
            fill="url(#leaky-grad)"
            stroke="#dc2626"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <ellipse
            cx="150"
            cy="130"
            rx="60"
            ry="10"
            fill="#fca5a5"
            stroke="#dc2626"
            strokeWidth="2"
          />

          {/* Holes with water drops leaking */}
          <circle cx="120" cy="210" r="4" fill="#991b1b" />
          <circle cx="170" cy="195" r="4" fill="#991b1b" />
          <circle cx="150" cy="235" r="4" fill="#991b1b" />

          {/* Leaking Drops & Coins */}
          <path
            d="M120 215 C115 230 110 245 110 260"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <text x="95" y="275" fill="#dc2626" fontSize="12">
            💧 Lost Clients
          </text>

          <path
            d="M170 200 C175 220 185 240 185 260"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <text x="175" y="295" fill="#dc2626" fontSize="12">
            💸 0% Repeat Sales
          </text>

          {/* Valuation Impact Banner */}
          <rect x="25" y="290" width="250" height="34" rx="8" fill="#fef2f2" stroke="#fecaca" />
          <text
            x="150"
            y="312"
            fill="#991b1b"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            Low Valuation Multiple: 1.5x SDE
          </text>
        </g>

        {/* CENTER ARROW */}
        <g transform="translate(385, 190)">
          <circle cx="15" cy="15" r="22" fill="#1f1d1a" />
          <text
            x="15"
            y="20"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            VS
          </text>
        </g>

        {/* RIGHT SIDE: The Retention Flywheel (Cartoon) */}
        <g transform="translate(440, 40)">
          {/* Label Card */}
          <rect
            x="0"
            y="0"
            width="300"
            height="340"
            rx="16"
            fill="white"
            stroke="#86efac"
            strokeWidth="2"
          />
          <rect x="20" y="16" width="160" height="24" rx="12" fill="#dcfce7" />
          <text
            x="100"
            y="32"
            fill="#15803d"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            ✨ The Shopwus Flywheel
          </text>
          <text
            x="150"
            y="60"
            fill="#8c827a"
            fontSize="11"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            1-Click WhatsApp Broadcasts & CRM
          </text>

          {/* Rotating Flywheel Circle */}
          <circle
            cx="150"
            cy="175"
            r="70"
            fill="url(#flywheel-grad)"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />

          {/* Center Hub */}
          <circle cx="150" cy="175" r="32" fill="#1f1d1a" stroke="#9e633d" strokeWidth="2" />
          <text
            x="150"
            y="172"
            fill="#c59a78"
            fontSize="9"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            SHOPWUS
          </text>
          <text
            x="150"
            y="184"
            fill="white"
            fontSize="9"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            CRM
          </text>

          {/* 4 Orbiting Golden Coins / Satellites */}
          {/* Top: Broadcast */}
          <circle
            cx="150"
            cy="105"
            r="16"
            fill="url(#coin-gold)"
            stroke="#b45309"
            strokeWidth="1.5"
          />
          <text
            x="150"
            y="109"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            📢
          </text>

          {/* Right: Repeat Orders */}
          <circle
            cx="220"
            cy="175"
            r="16"
            fill="url(#coin-gold)"
            stroke="#b45309"
            strokeWidth="1.5"
          />
          <text
            x="220"
            y="179"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            🔁
          </text>

          {/* Bottom: Invoices */}
          <circle
            cx="150"
            cy="245"
            r="16"
            fill="url(#coin-gold)"
            stroke="#b45309"
            strokeWidth="1.5"
          />
          <text
            x="150"
            y="249"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            🧾
          </text>

          {/* Left: 3D Card */}
          <circle
            cx="80"
            cy="175"
            r="16"
            fill="url(#coin-gold)"
            stroke="#b45309"
            strokeWidth="1.5"
          />
          <text
            x="80"
            y="179"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            💳
          </text>

          {/* Flywheel Arrows */}
          <path
            d="M120 115 A 60 60 0 0 1 180 115"
            stroke="#059669"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <path d="M215 145 A 60 60 0 0 1 215 205" stroke="#059669" strokeWidth="2" />
          <path d="M180 235 A 60 60 0 0 1 120 235" stroke="#059669" strokeWidth="2" />
          <path d="M85 205 A 60 60 0 0 1 85 145" stroke="#059669" strokeWidth="2" />

          {/* Valuation Impact Banner */}
          <rect x="25" y="290" width="250" height="34" rx="8" fill="#ecfdf5" stroke="#a7f3d0" />
          <text
            x="150"
            y="312"
            fill="#047857"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            🚀 High Valuation Multiple: 4.8x - 7.0x SDE
          </text>
        </g>
      </svg>
    </div>
  );
}

export function WhatsAppVsAtelierGraphic({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-border-hairline bg-surface-container-low p-6 sm:p-8 flex flex-col items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 800 420"
        className="w-full h-auto max-h-[380px] drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid-dots-2"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="#e8dfd2" />
          </pattern>
        </defs>
        <rect width="800" height="420" fill="url(#grid-dots-2)" opacity="0.6" />

        {/* LEFT: Chaotic 2:00 AM WhatsApp DMs */}
        <g transform="translate(60, 40)">
          <rect
            x="0"
            y="0"
            width="300"
            height="340"
            rx="16"
            fill="white"
            stroke="#fca5a5"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <rect x="20" y="16" width="160" height="24" rx="12" fill="#fee2e2" />
          <text
            x="100"
            y="32"
            fill="#dc2626"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            ❌ 2:00 AM WhatsApp DMs
          </text>

          {/* Smartphone Mockup */}
          <rect
            x="65"
            y="55"
            width="170"
            height="225"
            rx="14"
            fill="#1f2937"
            stroke="#111827"
            strokeWidth="2"
          />
          <rect x="73" y="65" width="154" height="205" rx="8" fill="#e5ddd5" />

          {/* Chat bubbles */}
          {/* Inbound msg 1 */}
          <rect x="80" y="75" width="100" height="24" rx="6" fill="white" />
          <text x="85" y="88" fill="#1f2937" fontSize="8" fontFamily="sans-serif">
            "How much for decor?"
          </text>
          <text x="85" y="96" fill="#9ca3af" fontSize="6" fontFamily="sans-serif">
            1:47 AM
          </text>

          {/* Response 1 */}
          <rect x="120" y="105" width="100" height="28" rx="6" fill="#dcf8c6" />
          <text x="125" y="117" fill="#1f2937" fontSize="8" fontFamily="sans-serif">
            "DM me pictures first"
          </text>
          <text x="125" y="128" fill="#6b7280" fontSize="6" fontFamily="sans-serif">
            Sent screenshot 📷
          </text>

          {/* Inbound msg 2 */}
          <rect x="80" y="140" width="120" height="24" rx="6" fill="white" />
          <text x="85" y="152" fill="#1f2937" fontSize="8" fontFamily="sans-serif">
            "Can you give 50% off?"
          </text>
          <text x="85" y="160" fill="#9ca3af" fontSize="6" fontFamily="sans-serif">
            2:12 AM
          </text>

          {/* Lost inquiry */}
          <rect x="90" y="175" width="120" height="24" rx="6" fill="#fee2e2" stroke="#f87171" />
          <text
            x="95"
            y="188"
            fill="#991b1b"
            fontSize="8"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            👻 Client ghosted
          </text>

          {/* Result Tag */}
          <rect x="25" y="290" width="250" height="34" rx="8" fill="#fef2f2" stroke="#fecaca" />
          <text
            x="150"
            y="312"
            fill="#991b1b"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            Unsellable & Founder Dependent
          </text>
        </g>

        {/* CENTER ARROW */}
        <g transform="translate(385, 190)">
          <circle cx="15" cy="15" r="22" fill="#1f1d1a" />
          <text
            x="15"
            y="20"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            VS
          </text>
        </g>

        {/* RIGHT: The 3D Digital Atelier Storefront */}
        <g transform="translate(440, 40)">
          <rect
            x="0"
            y="0"
            width="300"
            height="340"
            rx="16"
            fill="white"
            stroke="#86efac"
            strokeWidth="2"
          />
          <rect x="20" y="16" width="170" height="24" rx="12" fill="#dcfce7" />
          <text
            x="105"
            y="32"
            fill="#15803d"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            ✨ Bespoke 3D Digital Atelier
          </text>

          {/* 3D Isometric Card Illusion */}
          <g transform="translate(60, 65)">
            {/* Shadow */}
            <rect x="10" y="25" width="160" height="180" rx="12" fill="#000000" opacity="0.08" />

            {/* Front Card Face */}
            <rect
              x="0"
              y="15"
              width="160"
              height="180"
              rx="12"
              fill="#faf8f5"
              stroke="#ded5c8"
              strokeWidth="1.5"
            />
            <circle cx="80" cy="55" r="20" fill="#1f1d1a" />
            <text
              x="80"
              y="60"
              fill="#c59a78"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="serif"
            >
              É
            </text>
            <text
              x="80"
              y="90"
              fill="#1f1d1a"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="serif"
            >
              Élan Atelier
            </text>
            <text
              x="80"
              y="104"
              fill="#9e633d"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              HAUTE COUTURE & DECOR
            </text>

            {/* Badges */}
            <rect x="20" y="120" width="120" height="18" rx="9" fill="#ecfdf5" stroke="#a7f3d0" />
            <text
              x="80"
              y="132"
              fill="#059669"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              ✓ Verified Studio Storefront
            </text>

            <rect x="30" y="145" width="100" height="22" rx="11" fill="#191c1d" />
            <text
              x="80"
              y="159"
              fill="white"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              Book Consultation →
            </text>
          </g>

          {/* Result Tag */}
          <rect x="25" y="290" width="250" height="34" rx="8" fill="#ecfdf5" stroke="#a7f3d0" />
          <text
            x="150"
            y="312"
            fill="#047857"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            3x Higher Retainers & Portable Brand
          </text>
        </g>
      </svg>
    </div>
  );
}

export function ShoeboxVsDashboardGraphic({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-border-hairline bg-surface-container-low p-6 sm:p-8 flex flex-col items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 800 420"
        className="w-full h-auto max-h-[380px] drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid-dots-3"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="#e8dfd2" />
          </pattern>
        </defs>
        <rect width="800" height="420" fill="url(#grid-dots-3)" opacity="0.6" />

        {/* LEFT: Crinkled Shoebox of Paper Receipts */}
        <g transform="translate(60, 40)">
          <rect
            x="0"
            y="0"
            width="300"
            height="340"
            rx="16"
            fill="white"
            stroke="#fca5a5"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <rect x="20" y="16" width="160" height="24" rx="12" fill="#fee2e2" />
          <text
            x="100"
            y="32"
            fill="#dc2626"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            ❌ Shoebox of Paper Receipts
          </text>

          {/* Cardboard Box Graphic */}
          <g transform="translate(50, 70)">
            <polygon
              points="30,80 170,80 200,160 0,160"
              fill="#d2b48c"
              stroke="#8b5a2b"
              strokeWidth="2"
            />
            <polygon
              points="0,160 200,160 185,200 15,200"
              fill="#b8860b"
              stroke="#8b5a2b"
              strokeWidth="2"
            />

            {/* Flying messy receipts */}
            <rect
              x="40"
              y="30"
              width="50"
              height="60"
              rx="3"
              fill="#fef2f2"
              stroke="#dc2626"
              strokeWidth="1"
              transform="rotate(-15 40 30)"
            />
            <text x="45" y="55" fill="#dc2626" fontSize="7">
              Receipt ?
            </text>

            <rect
              x="90"
              y="20"
              width="60"
              height="70"
              rx="3"
              fill="#fffbeb"
              stroke="#d97706"
              strokeWidth="1"
              transform="rotate(12 90 20)"
            />
            <text x="95" y="45" fill="#d97706" fontSize="7">
              Bank Alert ₦?
            </text>

            <rect
              x="130"
              y="45"
              width="45"
              height="55"
              rx="3"
              fill="#fef2f2"
              stroke="#dc2626"
              strokeWidth="1"
              transform="rotate(30 130 45)"
            />
            <text x="135" y="70" fill="#dc2626" fontSize="7">
              Tax Alert !
            </text>
          </g>

          {/* Result Tag */}
          <rect x="25" y="290" width="250" height="34" rx="8" fill="#fef2f2" stroke="#fecaca" />
          <text
            x="150"
            y="312"
            fill="#991b1b"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            Failed Due Diligence & 40% Discount
          </text>
        </g>

        {/* CENTER ARROW */}
        <g transform="translate(385, 190)">
          <circle cx="15" cy="15" r="22" fill="#1f1d1a" />
          <text
            x="15"
            y="20"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            VS
          </text>
        </g>

        {/* RIGHT: The Executive Audit Dashboard */}
        <g transform="translate(440, 40)">
          <rect
            x="0"
            y="0"
            width="300"
            height="340"
            rx="16"
            fill="white"
            stroke="#86efac"
            strokeWidth="2"
          />
          <rect x="20" y="16" width="180" height="24" rx="12" fill="#dcfce7" />
          <text
            x="110"
            y="32"
            fill="#15803d"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            ✨ Executive Telemetry & P&L
          </text>

          {/* Tablet Dashboard Graphic */}
          <g transform="translate(40, 60)">
            <rect
              x="0"
              y="0"
              width="220"
              height="200"
              rx="12"
              fill="#faf7f2"
              stroke="#ded5c8"
              strokeWidth="2"
            />

            {/* Top row mini metric pills */}
            <rect x="15" y="15" width="90" height="40" rx="8" fill="white" stroke="#eee7dc" />
            <text x="25" y="30" fill="#8c827a" fontSize="8" fontFamily="sans-serif">
              Gross Revenue
            </text>
            <text
              x="25"
              y="46"
              fill="#1f1d1a"
              fontSize="12"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              ₦4.2M
            </text>

            <rect x="115" y="15" width="90" height="40" rx="8" fill="white" stroke="#eee7dc" />
            <text x="125" y="30" fill="#059669" fontSize="8" fontFamily="sans-serif">
              Real Net Profit
            </text>
            <text
              x="125"
              y="46"
              fill="#059669"
              fontSize="12"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              ₦2.4M (57%)
            </text>

            {/* Invoices List item */}
            <rect x="15" y="65" width="190" height="30" rx="6" fill="white" stroke="#eee7dc" />
            <text
              x="25"
              y="83"
              fill="#1f1d1a"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              INV-2026-08 • Client Retainer
            </text>
            <rect x="155" y="72" width="40" height="16" rx="8" fill="#ecfdf5" />
            <text
              x="175"
              y="83"
              fill="#059669"
              fontSize="7"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              PAID
            </text>

            {/* Expenses breakdown */}
            <rect x="15" y="105" width="190" height="30" rx="6" fill="white" stroke="#eee7dc" />
            <text
              x="25"
              y="123"
              fill="#1f1d1a"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              EXP-902 • Raw Materials
            </text>
            <rect x="155" y="112" width="40" height="16" rx="8" fill="#fef3c7" />
            <text
              x="175"
              y="123"
              fill="#d97706"
              fontSize="7"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              LOGGED
            </text>

            {/* Live Valuation Bar */}
            <rect x="15" y="145" width="190" height="40" rx="8" fill="#1f1d1a" />
            <text
              x="25"
              y="162"
              fill="#c59a78"
              fontSize="8"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              AUTOMATED VALUATION
            </text>
            <text
              x="25"
              y="177"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              ₦18,500,000 (4.5x SDE)
            </text>
          </g>

          {/* Result Tag */}
          <rect x="25" y="290" width="250" height="34" rx="8" fill="#ecfdf5" stroke="#a7f3d0" />
          <text
            x="150"
            y="312"
            fill="#047857"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            Audit-Ready in 60s & 2x Selling Price
          </text>
        </g>
      </svg>
    </div>
  );
}

export function BlogGraphicCard({ type, className = "" }: BlogGraphicCardProps) {
  switch (type) {
    case "retention_flywheel":
      return <RetentionFlywheelGraphic className={className} />;
    case "whatsapp_vs_atelier":
      return <WhatsAppVsAtelierGraphic className={className} />;
    case "shoebox_vs_dashboard":
      return <ShoeboxVsDashboardGraphic className={className} />;
    default:
      return null;
  }
}
