<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# MANDATORY: Check When Done — NEVER SKIP THIS
AFTER EVERY CODE CHANGE, WITHOUT EXCEPTION, YOU MUST:
1. No Magic Strings Allowed — define named constants, enums, or configuration maps.
2. DO not save interface in components section move them to type section (`src/types/`).
3. Scan related functions, export counterparts, shared schemas, and sibling services for anything missing, broken, or inconsistent with the change.
4. Briefly explain the problem, the fix applied, and any important considerations.
5. End with a one-line statement confirming whether anything important is missing (e.g. "Nothing important appears to be missing.").
6. Run formatting and lint checks (`pnpm check`), type checking (`pnpm type-check`), and unit tests (`pnpm test`).
7. If everything is fine, say so explicitly: "Nothing important appears to be missing."

---

# CORE RULES

- **STANDALONE & INDEPENDENT DEPLOYMENT:**
  `shopwus-web` is a 100% standalone, independently deployed project. It MUST NOT depend on `shopwus-api` or any shared root monorepo packages. All types, DTOs, schemas, and API client interfaces must remain completely self-contained within this repository. No workspace symlinks, shared packages, or cross-project dependencies are permitted.

- **DESIGN SYSTEM COMPLIANCE & CONSISTENCY (`DESIGN.md`):** Whatever we design must fit and strictly stick to our design system (tokens, components, typography, button variants, and spacing) documented in `DESIGN.md`. All visual and component decisions must treat `DESIGN.md` as the ground truth. If any requested change or new element deviates from our design system, you MUST warn the user before implementing.
- **STRICT TAILWIND UTILITY FIRST (NO AD-HOC GLOBAL CSS):**
  All UI styling across the application must strictly use **Tailwind CSS utility classes** and semantic design tokens defined in `@theme` in `src/app/globals.css`.
  - **NEVER** write new global classes or arbitrary selectors in `admin.css` or separate stylesheets.
  - All tables, sidebars, navigation headers, metric grids, modals, and buttons must use Tailwind utilities or standardized UI primitives (`<StatusBadge>`, `<TableCard>`, `<Metric>`, `<PageTitle>`).
  - **NEVER** write non-standard arbitrary media query classes like `[max-width:750px]:*`. Always use official Tailwind breakpoint prefixes: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px), or `max-lg:` / `max-sm:`.
- **COMPONENT INTERFACES IN TYPE SECTION:** Check for components with interface declarations and move the interface to the type section (`src/types/{domain}.ts`). No component prop interfaces or hook options should be declared inline in component files.
- **STRICT ARCHITECTURAL PLACEMENT:** Moving forward, EVERYTHING in the codebase MUST be defined strictly in its appropriate designated section without exception:
  - Types & Models $\rightarrow$ `src/types/{domain}.ts` (exported via `src/types/index.ts`)
  - Validation Schemas $\rightarrow$ `src/lib/schemas/{domain}.schema.ts`
  - Services & Business Logic $\rightarrow$ `src/services/api/{domain}.service.ts`
  - Custom Hooks $\rightarrow$ `src/hooks/{domain-hook}.ts`
  - Constants & Static Config $\rightarrow$ `src/constants/{domain}.ts`
  - Decomposed UI Components $\rightarrow$ `src/components/{domain}/`
  - Pure Stateless Utilities $\rightarrow$ `src/utils/{utility}.ts`
  Never mix concerns, declare shared domain interfaces inline, or place code in arbitrary folders.
- **STRICT SCOPE ENFORCEMENT:** NEVER introduce, create, or add any unrequested features, elements, icons, components, sections, or UI decorations unless the user explicitly asked for them. Limit all implementation strictly to the exact user directive without making assumptions or adding unsolicited extras.
- **DOMAIN-SEGMENTED TYPES (`src/types/`):** All domain entities, DTOs, request payloads, and shared models MUST be defined in their designated domain file under `src/types/` (e.g. `customer.ts`, `invoice.ts`, `lead.ts`, `analytics.ts`, `broadcast.ts`, `profile.ts`, `auth.ts`, `common.ts`, `landing.ts`) and exported via `src/types/index.ts`. Never dump arbitrary types into monolithic files or declare shared domain interfaces inline in UI components.
- **ZERO `any` POLICY (Strict TypeScript):** `any` is strictly prohibited anywhere in the codebase. Always use explicit types from `@/types` or local component prop interfaces. For unknown payloads, use `unknown` with explicit narrowing. All function signatures, props, callbacks, and state must have complete, explicit types.
- **SERVICE/REPOSITORY ABSTRACTION:** Architect all state and data flows behind an abstraction layer under `src/services/api/` (e.g. `invoice.service.ts`, `leads.service.ts`, `customer.service.ts`) so mock data can be swapped for real API calls later with zero UI refactoring.
- **RESPONSIVE DESIGN:** Design layouts to be responsive across Mobile (320px+), Tablet (768px+), and Desktop (1024px+) breakpoints using Tailwind utilities (`sm:`, `md:`, `lg:`).
- **KEEP DESIGNS SIMPLE:** Avoid over-engineering or adding unrequested features.
- **NO ASSUMPTIONS:** Never assume or hallucinate requirements; ask clarifying questions when something isn't clear.
- **NEVER SKIP CHECKS:** Do NOT wait to be asked. Do NOT skip because the change "looks small".
- **PRACTICAL REVIEWS:** Keep the review practical. Do not over-engineer, suggest unnecessary improvements, or nitpick.
- **BREAKING-CHANGE RISK:** Breaking-change risk must be called out immediately and clearly. If a change could impact existing API contracts, payload shapes, database schema, background jobs, integrations, or expected behavior, say so up front and treat it as a high-priority warning.
- **COMPLETION CONFIRMATION:** If everything is fine, say so explicitly: "Nothing important appears to be missing."
- Remove all unnecessary comments or redundant comments. Keep code clean, lean, and self-documenting without redundant inline explanations or unnecessary JSDoc blocks.

---

# CODEBASE CONVENTIONS & SECTION PLACEMENT

Everything in the codebase must live strictly in its appropriate architectural section:

### 1. File & Directory Organization
- **Types (`src/types/`):** Domain interfaces, DTOs, and union types grouped by domain (`customer.ts`, `invoice.ts`, `lead.ts`, etc.) and re-exported from `src/types/index.ts`.
- **Validation Schemas (`src/lib/schemas/`):** Zod parsing and validation schemas organized by domain (`customer.schema.ts`, `invoice.schema.ts`, `lead.schema.ts`).
- **Services & Data Layer (`src/services/api/`):** Business logic, CRUD operations, telemetry, and external API integrations (`customer.service.ts`, `invoice.service.ts`, etc.).
- **State & Custom Hooks (`src/hooks/`):** Component event orchestration and reusable state hooks (`useInvoiceForm.ts`, `useLeads.ts`, `useCustomerForm.ts`).
- **Constants & Configuration (`src/constants/`):** App configurations, navigation definitions, and immutable constants.
- **Components (`src/components/`):** Decomposed UI organized by domain subfolders (`admin/`, `landing/`, `studio/`, `shared/`, `ui/`). Keep components focused (~200–250 lines max).
- **Utilities (`src/utils/`):** Pure, stateless helper functions (`currency.ts`, `helpers.ts`).

### 2. Service Layer Standards
- UI components must never perform direct mock data mutations or local storage updates inline; always delegate through service methods.
- Methods should return clean resolved promises and maintain state synchronization.

---

# SPECIAL USE CASES & REPOSITORY PATTERNS

### 1. Interactive 3D Stationery Card (`stationery-card.tsx`)
- Uses pure CSS 3D transforms defined in `src/app/globals.css`:
  - `.card-flip-container`: Perspective wrapper with `perspective: 1000px`, matching height (`min-h-[560px]`, `max-w-[480px]`).
  - `.card-flip-inner`: `transform-style: preserve-3d`, toggled with `.is-flipped` (rotates 180deg).
  - `.card-face`, `.card-front`, `.card-back`: `position: absolute; inset: 0; backface-visibility: hidden;`.
- **Front Face:** Displays only the centered business logo, business name, and physical address/location, with an absolute top-right *"Flip Card"* button.

### 2. Verified Social Channels System
- Configured in Admin Settings (`socialChannels: SocialChannel[]` with `.connected` toggle).
- Rendered in public studio views (`social-section.tsx`) using `getSocialChannelStyle(channel.type)` from `social-badge.tsx` for verified brand SVGs, background colors, borders, and direct external URLs.
### 3. Currency & Financial Formatting
- Always use `formatCurrency(amount, currencyCode)` from `src/utils/currency.ts` to ensure uniform currency formatting across invoices, analytics, and leads.

### 4. Landing Page Core Architecture (`src/components/landing/`)
- **Features Capabilities (`features-section.tsx`):** 6-pillar luxury capability grid showcasing Digital Atelier 3D Cards, CRM Lead Orchestration, Executive Invoicing, Live Run-of-Show Companion, VIP Client Portals, and Revenue Analytics with responsive 3/2/1-column breakpoints.
- **Pricing & Membership Engine (`pricing-section.tsx`):** Interactive Monthly / Annual billing toggle (with 20% annual savings calculation) and 3 tailored studio tiers: *Studio Atelier* ($49/$39), *Maison Flagship* ($129/$99, featured/popular), and *Haute Production* ($299/$239).
- **Public Navigation & Anchor Routing:** Synchronized section anchors (`#features`, `#workflow`, `#pricing`, `/${slug}`) in `public-landing-page.tsx`.

### 5. Bulk Customer Broadcast System (`src/services/api/broadcast.service.ts`, `customer-broadcast-modal.tsx`)
- **Active Customer Scope:** "Select All Active" filters exclusively for active customers (`isActive === true`), automatically omitting inactive accounts from mass broadcasts.
- **Channel Character Capping:** Enforces strict anti-spam limits (500 chars for WhatsApp & Both, 2,000 chars for Email) with real-time countdown meters and optional media/image URL attachments.
- **Multi-Channel Dispatch Engine:** Supports WhatsApp Forwarding Intent (`https://api.whatsapp.com/send?text=...`), individual 1-click WhatsApp dispatches (`https://wa.me/...`), discreet Email BCC (`mailto:?bcc=...`), and mock backend async service logging.

### 6. Input Focus Reset (Design System Rule)
**NEVER add focus rings, shadows, or colored borders to any input, textarea, or select — anywhere in the app.**

This is enforced globally in `src/styles/base.css` via `@layer base`:
```css
input, textarea, select { outline: none; box-shadow: none; -webkit-box-shadow: none; }
```

**Banned classes on inputs and their wrapper divs:**
- `focus:ring-*`, `focus:border-[#...]`, `focus:shadow-*`
- `focus-within:ring-*`, `focus-within:border-[#...]`, `focus-within:bg-white`

**Exempt:** Checkboxes (`focus:ring-*` for accent colour) and the shadcn `<Button>` (`focus-visible:ring-*`).
See `DESIGN.md §8` for the full rule.

### 7. Verification Workflow Before Responding
1. `pnpm check` (Biome linting & formatting).
2. `pnpm type-check` (`tsc --noEmit` with 0 type errors and zero `any`).
3. `pnpm test` (Vitest unit test suite).



