# LeanScale Sales App — User Flow Guide

**Last Updated:** 2026-02-11  
**Branch:** `feature/sales-diagnostic-sow-flow`  
**Audience:** Developers, Product Managers, Sales Operations

---

## Table of Contents

1. [Complete User Journey Map](#1-complete-user-journey-map)
2. [Navigation Architecture](#2-navigation-architecture)
3. [Why LeanScale Phase](#3-why-leanscale-phase)
4. [Try LeanScale Phase](#4-try-leanscale-phase)
5. [Engagement Overview](#5-engagement-overview)
6. [Buy LeanScale Phase](#6-buy-leanscale-phase)
7. [SOW Phase](#7-sow-phase)
8. [Cross-cutting Concerns](#8-cross-cutting-concerns)
9. [Recommended Flow Optimizations](#9-recommended-flow-optimizations)
10. [Metrics to Track](#10-metrics-to-track)

---

## 1. Complete User Journey Map

The app implements a **Why → Try → Buy** sales framework that mirrors a real B2B sales conversation. Each phase builds on the previous one to move a prospect toward engagement.

### Journey Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  WHY LEANSCALE  │───▶│  TRY LEANSCALE  │───▶│  BUY LEANSCALE  │───▶│    SOW SYSTEM   │
│   (Credibility) │    │  (Assessment)   │    │   (Proposal)    │    │  (Close & Exec) │
│                 │    │                 │    │                 │    │                 │
│ • Overview      │    │ • Start Diag    │    │ • Get Started   │    │ • SOW List      │
│ • About Us      │    │ • GTM Diag      │    │ • Calculator    │    │ • Generate      │
│ • Resources     │    │ • Clay Diag     │    │ • Availability  │    │ • Builder       │
│ • References    │    │ • CPQ Diag      │    │ • Clay x LS     │    │ • Preview       │
│ • Services      │    │ • Engagement    │    │ • One-Time Proj │    │ • PDF Export    │
│ • Glossary      │    │ • Power10       │    │ • Investor Perks│    │ • Teamwork Push │
│                 │    │ • Tool Health   │    │ • Intake Forms  │    │                 │
│                 │    │ • Process Health│    │ • Team / Sec    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Page Inventory

| # | Route | Phase | Purpose | Conversion Point |
|---|-------|-------|---------|-----------------|
| 1 | `/why-leanscale` | Why | Landing page — Capital Clock, GTM Ops overview, Pod Structure | CTA → Get Started, Start Diagnostic |
| 2 | `/why-leanscale/about` | Why | Mission, values, differentiators, team capabilities | Builds trust |
| 3 | `/why-leanscale/resources` | Why | Links to videos, articles, docs, playbooks | Content engagement |
| 4 | `/why-leanscale/references` | Why | 8 customer testimonials with names, roles, quotes | Social proof |
| 5 | `/why-leanscale/services` | Why | Full catalog: 68 strategic + 60+ managed services, filterable | Shows breadth |
| 6 | `/why-leanscale/glossary` | Why | 39 GTM/RevOps term definitions | Educational authority |
| 7 | `/try-leanscale` | Try | Overview of diagnostic concept with entry-point cards | CTA → Start Diagnostic, View Demo |
| 8 | `/try-leanscale/start` | Try | NDA signing (DocuSign embed) + GTM intake form (Fillout embed) | Data capture gate |
| 9 | `/try-leanscale/diagnostic` | Try | GTM Diagnostic — 63 processes, tabs for By Function/Outcome | **Primary value demo** |
| 10 | `/try-leanscale/clay-diagnostic` | Try | Clay-specific enrichment diagnostic | Vertical-specific assessment |
| 11 | `/try-leanscale/cpq-diagnostic` | Try | Quote-to-Cash diagnostic | Vertical-specific assessment |
| 12 | `/try-leanscale/power10` | Try | Redirect → `/diagnostic?tab=power10` | 10 key GTM metrics |
| 13 | `/try-leanscale/gtm-tool-health` | Try | Redirect → `/diagnostic?tab=tools` | 17 tool categories |
| 14 | `/try-leanscale/process-health` | Try | Redirect → `/diagnostic?tab=processes` | Process assessment |
| 15 | `/try-leanscale/engagement` | Try | Recommended projects based on diagnostic findings | **Bridge to Buy** |
| 16 | `/buy-leanscale` | Buy | Multi-step configurator: engagement type → hours → terms → form | **Primary purchase flow** |
| 17 | `/buy-leanscale/calculator` | Buy | Standalone pricing calculator (50h/100h/225h × terms) | Price transparency |
| 18 | `/buy-leanscale/availability` | Buy | Cohort calendar with real-time availability | Urgency/scarcity |
| 19 | `/buy-leanscale/clay` | Buy | Clay × LeanScale partnership page — 10 Claybooks, bundles, pricing | Clay-specific sales |
| 20 | `/buy-leanscale/one-time-projects` | Buy | Fixed-scope project cards ($45K each) with playbook content | Project-based sales |
| 21 | `/buy-leanscale/investor-perks` | Buy | VC/investor partnership page — free diagnostic + planning for portcos | Channel partner sales |
| 22 | `/buy-leanscale/start` | Buy | Getting Started contract form (name, billing, terms, start date) | **Form submission** |
| 23 | `/buy-leanscale/clay-intake` | Buy | Clay project intake form (IntakeForm component) | Scoping data capture |
| 24 | `/buy-leanscale/q2c-intake` | Buy | Q2C project intake form (IntakeForm component) | Scoping data capture |
| 25 | `/buy-leanscale/team` | Buy | Team member profiles with select/deselect for "Your Team" | Personalization |
| 26 | `/buy-leanscale/security` | Buy | Privacy policy, security measures, W9 | Compliance/trust |
| 27 | `/sow` | SOW | List all SOWs for customer, status badges, create new | SOW management hub |
| 28 | `/sow/generate` | SOW | 4-step wizard: type → transcript → intake → generate (n8n AI) | AI-powered SOW creation |
| 29 | `/sow/[id]` | SOW | SOW detail: status mgmt, sections, investment table, timeline, Teamwork | **SOW review & acceptance** |
| 30 | `/sow/[id]/build` | SOW | Two-panel builder: diagnostic items (left) → sections (right) | **SOW construction** |

### Critical Conversion Points

1. **Why → Try:** "Start GTM Diagnostic" CTA on Why overview page
2. **Try → Engagement:** "Build SOW" button on diagnostic results page
3. **Engagement → Buy:** Engagement overview links to pricing/calculator
4. **Buy → SOW:** Getting Started form submission triggers SOW creation flow
5. **Diagnostic → SOW:** "Build SOW" button calls `POST /api/sow/from-diagnostic`
6. **SOW → Teamwork:** "Push to Teamwork" on accepted SOW creates project

---

## 2. Navigation Architecture

### Current Structure

The navigation is **context-aware** — it renders differently for prospects vs. active customers.

**Prospect Navigation** (default):
```
[LeanScale Logo]  Why LeanScale ▾  |  Try LeanScale ▾  |  Buy LeanScale ▾  |  [Get Started]
```
Each is a dropdown with 6-9 sub-links. Full Why/Try/Buy hierarchy exposed.

**Active Customer Navigation** (when `customerType === 'active'`):
```
[LeanScale × Customer]  Diagnostic  |  Engagement  |  SOW  |  More ▾  |  [Dashboard]
```
Flat links for the core flow, with a "More" dropdown for secondary pages (Services Catalog, Your Team, Security).

**Key implementation details:**
- Navigation source: `components/Navigation.js`
- Customer context from `CustomerContext.js` determines which nav renders
- `customerPath()` helper prefixes all links with customer slug (`/c/customer-slug/...`)
- Diagnostic type (`gtm`, `clay`, `cpq`) from `customer.diagnosticType` determines which diagnostic link appears
- Mobile: hamburger menu toggle with `nav-links-open` class

### Navigation Gaps

| Gap | Impact | Recommendation |
|-----|--------|---------------|
| No breadcrumbs | Users lose context deep in the flow | Add breadcrumbs on all pages below top-level |
| No progress indicator | Prospects don't know where they are in Why→Try→Buy | Add a horizontal stepper showing current phase |
| SOW pages not in nav | SOW section only accessible from diagnostic CTA or direct URL | Add SOW to prospect nav after first SOW exists |
| Engagement buried in dropdown | Key bridge page is one of 9 items in Try dropdown | Promote to top-level in prospect nav |
| No "Back to Diagnostic" from SOW Builder | Builder has breadcrumb but no persistent nav hint | Add contextual back-link |
| Active customer nav hides Buy pages | Once a customer is "active," pricing/calculator pages are hidden | Keep calculator accessible for upsell conversations |

### Recommended Navigation Improvements

**For Prospects:**
```
[Logo]  Why ▾  |  Try ▾  |  Engagement  |  Buy ▾  |  [Start Diagnostic →]
```
- Promote Engagement to top-level (it's the key bridge page)
- Change CTA from "Get Started" to "Start Diagnostic →" (leads with value, not ask)

**For Active Customers:**
```
[Logo × Customer]  Diagnostic  |  Engagement  |  SOW  |  Buy ▾  |  [Dashboard]
```
- Keep Buy accessible for expansion/upsell
- Dynamically show SOW count badge when SOWs exist

---

## 3. Why LeanScale Phase

### Purpose
Establish credibility, educate the prospect on GTM operations, and create enough trust to enter the Try phase.

### Page-by-Page Analysis

#### `/why-leanscale` — Overview (376 lines)
**Content:** Capital Clock concept, What is GTM Ops, In-House vs Partner comparison, Pod Structure diagram, Working with LeanScale process.
**Visual:** Sections with anchor nav, image zoom components for diagrams, gradient CTAs.
**CTAs:** "Get Started" (→ Buy) and "Start GTM Diagnostic" (→ Try).

**What's effective:**
- Capital Clock framing creates urgency ("18-24 months to prove PMF")
- In-House vs Partner comparison directly addresses the build-vs-buy objection
- Pod Structure visualization shows a concrete team model

**What's missing:**
- No ROI calculator or TCO comparison (e.g., "hiring 3 RevOps people = $450K/yr vs. LeanScale = $300K/yr")
- No video content on this page (investor page has video; this should too)
- Statistics lack sources ("40% faster pipeline velocity" — where's this from?)

#### `/why-leanscale/about` — About Us (211 lines)
**Content:** Mission, values (4), differentiators (6), top talent attributes (6), deep capabilities (5).
**What's effective:** Differentiators section is strong — "Assigned Team Members" and "'Lean on Us' Mentality" address real buyer concerns.
**What's missing:** No team photos or bios (those are on `/buy-leanscale/team`), no company history/timeline.

#### `/why-leanscale/references` — Customer References (187 lines)
**Content:** 8 testimonials with name, role, company, segment, quote, and link.
**Segments covered:** VC/Portfolio (2), Mid-Market SaaS (4), SMB SaaS (1), Seed/Fintech (1).
**What's effective:** Real names and titles from recognizable companies.
**What's missing:**
- No case studies with metrics (before/after data)
- No logos displayed (testimonials use generated initials instead)
- No filtering by segment or use case
- No video testimonials

#### `/why-leanscale/resources` — Key Resources (136 lines)
**Content:** 11 links to external content (website, YouTube, articles, docs).
**What's effective:** Good breadth of content types (video, article, docs).
**What's missing:** No internal gating — all links go external with no data capture.

#### `/why-leanscale/services` — Services Catalog (305 lines)
**Content:** Full catalog with tabs (One-Time Projects / Managed Services), function filter, search.
**What's effective:** Comprehensive — 68 strategic + 60+ managed services searchable and filterable.
**What's missing:** No pricing on this page (pricing is separate on Buy pages), no "recommended for you" based on diagnostic results.

#### `/why-leanscale/glossary` — GTM Ops Glossary (70 lines)
**Content:** 39 term definitions in card grid layout.
**What's effective:** Positions LeanScale as educator. Good for SEO.
**What's missing:** No search/filter, no links to related services.

### Content Strategy Assessment

| Strength | Gap |
|----------|-----|
| Strong "why now" framing (Capital Clock) | No ROI calculator |
| Real testimonials with names | No case studies with metrics |
| Comprehensive services catalog | No video testimonials |
| Educational glossary | No competitive comparison |
| Clear differentiators | No "customer like you" matching |

---

## 4. Try LeanScale Phase

### Purpose
Deliver immediate value through a live health assessment, creating urgency and positioning LeanScale as the expert who can fix what's broken.

### Entry Points

```
                    ┌── /try-leanscale (Overview)
                    │      ├── "Start Diagnostic" card → /try-leanscale/start
                    │      └── "View Demo Results" card → /try-leanscale/diagnostic
                    │
Prospect arrives ───┼── /try-leanscale/start (NDA + Intake)
                    │      └── After completion → /try-leanscale/diagnostic
                    │
                    ├── /try-leanscale/diagnostic (GTM — direct access)
                    ├── /try-leanscale/clay-diagnostic (Clay — direct access)
                    └── /try-leanscale/cpq-diagnostic (CPQ — direct access)
```

### Diagnostic System

All three diagnostics (`gtm`, `clay`, `cpq`) use the shared `DiagnosticResults` component via the **diagnostic registry pattern**:

```
pages/try-leanscale/diagnostic.js      → <DiagnosticResults diagnosticType="gtm" />
pages/try-leanscale/clay-diagnostic.js → <DiagnosticResults diagnosticType="clay" />
pages/try-leanscale/cpq-diagnostic.js  → <DiagnosticResults diagnosticType="cpq" />
```

The registry (`data/diagnostic-registry.js`) maps each type to its data config (processes, tools, metrics). Adding a new diagnostic type requires only: a data file + registry entry + page route.

#### GTM Diagnostic — The Core Assessment
- **63 processes** across 5 functions (Cross Functional, Marketing, Sales, Customer Success, Partnerships)
- **10 Power10 metrics** (ARR, Bookings, etc.)
- **17 GTM tool categories**
- **Status system:** 🟢 Healthy → 🟡 Careful → 🔴 Warning → ⚫ Unable to Report
- **Tabs:** Processes | By Function | By Outcome | Power10 | Tools

#### Live Editing (for sales reps on calls)
- Click status badge to cycle through statuses
- Click priority toggle to mark items for engagement
- Add per-item notes via drawer
- Auto-save with 800ms debounce to Supabase
- Import from markdown (bridges legacy Coda workflow)

#### Guided vs. Self-Serve Paths

| Path | Entry | Experience | Duration |
|------|-------|------------|----------|
| **Guided** (sales-led) | Rep shares screen during call | Rep cycles statuses live, discusses each area | 30-45 min |
| **Self-serve** (prospect-led) | Prospect clicks "Start Diagnostic" | NDA → Intake form → View demo results | 15-20 min |
| **Quick scan** | ❌ Not yet built | Would show top 15-20 high-impact items only | 10-15 min |

### `/try-leanscale/start` — Diagnostic Start Page (81 lines)
**Step 1:** Embedded DocuSign PowerForm for mutual NDA signing (iframe).
**Step 2:** Embedded Fillout form for GTM tech stack intake (iframe).
Both URLs are configurable per customer via `customer.ndaLink` and `customer.intakeFormLink`.

**Gap:** No completion tracking — the page doesn't know when the NDA is signed or form submitted. No redirect to diagnostic after completion.

### Redirect Pages
Three convenience routes redirect to diagnostic tabs:
- `/try-leanscale/power10` → `/diagnostic?tab=power10`
- `/try-leanscale/gtm-tool-health` → `/diagnostic?tab=tools`
- `/try-leanscale/process-health` → `/diagnostic?tab=processes`

These exist for direct-linking in emails and nav but add no unique content.

### Results Sharing

**Current state:** No built-in sharing mechanism.
- No diagnostic PDF export
- No shareable link with read-only view
- Prospect must log into portal to see results
- Rep can screenshot or manually summarize

**Impact:** After a sales call, the prospect can't easily review diagnostic findings. This is a major friction point in the sales cycle.

---

## 5. Engagement Overview

### Purpose
Bridge the gap between "here's what's broken" (diagnostic) and "here's what it costs to fix" (buy). This page should translate diagnostic findings into recommended services, timelines, and investment levels.

### Current Implementation (`/try-leanscale/engagement` — 469 lines)

The engagement page renders a prioritized list of recommended projects based on items flagged with `addToEngagement: true` in the diagnostic data.

**What it shows:**
- Priority projects grouped by function with status colors
- Service details (description, icon) from the services catalog
- Hour estimates (low/high range)
- Timeline (start week, duration)
- Three engagement tiers: 50h ($15K/mo), 100h ($25K/mo), 225h ($50K/mo)
- Gantt-style timeline visualization

**Critical Problem:** The engagement page reads from **static data** (`data/diagnostic-data.js`), not from the customer's actual diagnostic results in the database. Every customer sees the same engagement overview regardless of their diagnostic findings.

**Hour estimates are hardcoded formulas:**
```js
lowHours: 20 + (idx * 8),    // Not from service catalog
highHours: 40 + (idx * 12),  // Not from service catalog
startWeek: idx + 1,          // Sequential, not strategic
```

### What This Page Should Be (Dynamic Version)

```
Customer's Diagnostic Results (from DB)
    ↓ filter by addToEngagement === true
    ↓ lookup serviceId → service_catalog (DB) for hours_low, hours_high, default_rate
    ↓ group by function or outcome
    ↓ compute total hours → recommend tier
    ↓ auto-suggest timeline based on dependency order
    ↓
Dynamic Engagement Overview
    ↓
"Build SOW from These Recommendations" CTA
```

### Gaps Between Diagnostic and Buy

| Gap | Description | Impact |
|-----|-------------|--------|
| Static data source | Engagement reads from hardcoded data, not customer diagnostic | Every customer sees the same recommendations |
| No tier recommendation | Doesn't map total hours to a suggested tier | Sales rep must manually determine tier |
| No service catalog linkage | Hour estimates are formulas, not from catalog | Estimates may not match actual project scoping |
| No "Build SOW" CTA | Page links to Buy pages but not directly to SOW builder | Extra manual steps to convert |
| No save/share | Can't export or share engagement overview | Prospect can't review after call |

---

## 6. Buy LeanScale Phase

### Purpose
Convert assessed prospects into paying customers through pricing transparency, configuration, and contract submission.

### `/buy-leanscale` — Get Started Hub (629 lines)

Multi-step configurator that walks the prospect through engagement setup:

| Step | Content | Data Captured |
|------|---------|---------------|
| 0 | Choose engagement type (Embedded Team vs. One-Time Project) | `engagementType` |
| 1 | Select monthly hours tier (50h/$15K, 100h/$25K, 225h/$50K) | `selectedHours` |
| 2 | Set cancellation & payment terms (monthly/quarterly/annual ±7%) | `cancellation`, `payment` |
| 3 | Contract details form (name, company, billing, signer info, start date) | `formData` |

**Diagnostic integration:** Checks `localStorage` for `diagnosticResults` and auto-recommends a tier:
- Score ≤ 40 → Scale (225h)
- Score ≤ 70 → Growth (100h)
- Score > 70 → Starter (50h)

**Gap:** This localStorage-based recommendation is fragile. The diagnostic doesn't currently write a `score` to localStorage. The integration is a placeholder.

### `/buy-leanscale/calculator` — Pricing Calculator (166 lines)

Standalone calculator with the same tier/term selectors as the Get Started page. Shows monthly total adjusted for cancellation and payment term modifiers (±7% each).

**Pricing Model:**
| Tier | Hours/mo | Base Price | Month-to-Month (+7%) | Annual (-7%) |
|------|----------|------------|---------------------|--------------|
| Starter | 50 | $15,000 | $16,050 | $13,950 |
| Growth | 100 | $25,000 | $26,750 | $23,250 |
| Scale | 225 | $50,000 | $53,500 | $46,500 |

**Gap:** Calculator is not connected to the SOW system. A prospect who configures pricing here has to re-enter everything in the Getting Started form or SOW.

### `/buy-leanscale/availability` — Cohort Availability (82 lines)

Renders `AvailabilityCalendar` component showing real-time cohort slots from the `availability_dates` Supabase table. New cohorts start every 2 weeks.

**Effective:** Creates urgency ("spots are limited") and shows operational maturity.

### `/buy-leanscale/clay` — Clay × LeanScale (453 lines)

Rich sales page for Clay-specific engagements:
- 10 Claybooks with pricing ($3,125–$45,000)
- 3 bundles with savings ($23K–$55K)
- Use case narratives (Market Map → Outbound → Inbound → Custom)
- "What Clay Is / What Clay Is Not" comparison
- Stats bar ($5.45B+ capital raised, 395K+ YouTube subscribers, 200+ projects)

**CTA:** Links to Clay intake form (`/buy-leanscale/clay-intake`)

### `/buy-leanscale/one-time-projects` — Project Cards (432 lines)

Fixed-scope projects at $45K each with playbook-driven content. Each card expands to show full playbook content (definition, ICP value prop, implementation phases, dependencies, pitfalls).

Projects: Market Map, Automated Inbound Enrichment, Automated Outbound, Custom Enrichment Signals, CRM Migration (and more).

### `/buy-leanscale/investor-perks` — Investor Page (271 lines)

Targeted at VCs — offers free GTM Diagnostic + Planning Package for portfolio companies. Includes Wistia video embed and booking link.

**Effective:** Strong channel partner strategy. Provides clear value before asking for commitment.

### Intake Forms

| Route | Form | Purpose |
|-------|------|---------|
| `/buy-leanscale/clay-intake` | Clay Project Intake | Scoping data for Clay implementations |
| `/buy-leanscale/q2c-intake` | Q2C Project Intake | Scoping data for Quote-to-Cash projects |
| `/buy-leanscale/start` | Getting Started | Contract details (name, billing, signer, terms) |

All forms submit via `POST /api/submit-form` → stored in `form_submissions` Supabase table.

### Buy → SOW Connection

Currently **there is no automated connection** between Buy forms and SOW creation. When a Getting Started form is submitted:
1. Data goes to `form_submissions` table
2. A Slack notification is sent
3. A sales rep manually creates a SOW

**Recommended:** Auto-create a draft SOW from Getting Started submission, pre-populated with the selected tier, terms, and start date.

---

## 7. SOW Phase

### Purpose
Formalize the engagement scope into a professional Statement of Work that can be reviewed, exported as PDF, and pushed to Teamwork for execution.

### SOW Lifecycle

```
                 ┌──────────────┐
                 │   CREATION   │
                 ├──────────────┤
                 │ From Diag    │──── POST /api/sow/from-diagnostic
                 │ Manual Gen   │──── POST /api/sow/generate (n8n AI)
                 │ Blank        │──── POST /api/sow
                 └──────┬───────┘
                        ▼
              ┌──────────────────┐
              │     BUILDING     │ ← /sow/[id]/build
              │  (Two-panel UI)  │
              │                  │
              │ Left: Diag items │
              │ Right: Sections  │
              └──────┬───────────┘
                     ▼
              ┌──────────────────┐
              │      REVIEW      │ ← /sow/[id]
              │                  │
              │ Status: draft    │
              │   → review       │
              │   → sent         │
              └──────┬───────────┘
                     ▼
              ┌──────────────────┐
              │     EXPORT       │
              │                  │
              │ PDF generation   │── POST /api/sow/[id]/export
              │ Version snapshot │   (creates version + streams PDF)
              └──────┬───────────┘
                     ▼
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────┐         ┌──────────────┐
│   ACCEPTED   │         │   DECLINED   │
│              │         │              │
│ Push to TW   │         │ Archive      │
│ Create proj  │         └──────────────┘
│ + milestones │
└──────────────┘
```

### `/sow` — SOW List (232 lines)

Dashboard showing all SOWs for the customer with:
- Status badges (draft/generated/review/approved/sent/accepted/declined)
- Title, type, creation date
- Links to detail view and builder
- "Generate New SOW" and "Create from Diagnostic" CTAs

### `/sow/generate` — SOW Generation Wizard (460 lines)

4-step wizard:
1. **Select SOW Type:** Clay / Q2C / Embedded / Custom
2. **Paste Transcript:** Optional sales call transcript for AI processing
3. **Link Intake:** Connect to an existing intake form submission
4. **Generate:** Calls `POST /api/sow/generate` → optionally sends to n8n webhook for AI content generation → falls back to template if n8n unavailable

### `/sow/[id]/build` — SOW Builder (168 lines page + 509 lines `SowBuilder.js`)

**Two-panel layout:**

| Left Panel: Diagnostic Items | Right Panel: SOW Sections |
|------------------------------|--------------------------|
| Shows all processes from linked diagnostic | List of sections with title, description, deliverables |
| Color-coded by status (🟢🟡🔴⚫) | Hours, rate, dates per section |
| Checkbox to select items | Drag-and-drop reordering |
| Auto-selects warning/unable items | "Add from Catalog" pre-fills from service catalog |
| Filter by function/outcome | Diagnostic items assigned to each section |
| | Summary bar: total hours, investment, unassigned count |

**Workflow:**
1. Review diagnostic items in left panel
2. Create sections (blank or from catalog via `CatalogPicker`)
3. Assign diagnostic items to sections
4. Set hours, rates, and dates
5. Save → redirects to SOW detail page

### `/sow/[id]` — SOW Detail / Review (180 lines page + 690 lines `SowPage.js`)

Rich display with:
- **Status management:** Draft → Review → Sent → Accepted/Declined (manual toggle)
- **DiagnosticScoreCard:** Shows linked diagnostic health at a glance
- **DiagnosticSyncBanner:** Alerts when diagnostic results changed since SOW creation
- **InvestmentTable:** Hours × rate breakdown per section
- **SowTimeline:** Visual timeline of section dates
- **VersionHistory:** List of exported versions (but PDFs not stored — regenerated each time)
- **TeamworkPreview:** Preview project structure before pushing

### PDF Export (`SowPdfDocument.js` — 518 lines)

Generated via `@react-pdf/renderer`:
- Header: SOW title, customer name, date, version
- Executive summary
- Scope sections with deliverables, hours, rates
- Diagnostic status dots per section
- Investment summary table
- Assumptions and acceptance criteria

**Known issues:**
- No LeanScale or customer logo in PDF
- No table of contents or page numbers
- Executive summary often blank (from-diagnostic path doesn't populate it)
- PDFs not stored — version history tracks exports but can't re-download
- No in-browser preview before export

### Teamwork Integration

When SOW is accepted:
1. `POST /api/sow/[id]/push-to-teamwork` → generates preview (milestones from sections, tasks from deliverables)
2. User reviews preview
3. `POST /api/sow/[id]/push-to-teamwork/confirm` → creates Teamwork project
4. SOW updated with `teamwork_project_id` and `teamwork_project_url`

---

## 8. Cross-cutting Concerns

### Customer Context & Multi-Tenant Routing

The app supports multiple customer instances through three routing mechanisms:

| Method | Format | Status |
|--------|--------|--------|
| Path-based | `/c/customer-slug/page` | ✅ Active — middleware rewrites to `/page` with cookie |
| Subdomain | `customer.clients.leanscale.team` | 🔲 Planned |
| Query param | `?customer=slug` | ✅ Development only |

**Flow:**
1. Middleware detects customer slug from path/subdomain/query
2. Sets `ls-customer` cookie
3. `CustomerContext` reads cookie → fetches config from `GET /api/customer`
4. All components access customer data via `useCustomer()` hook
5. `customerPath()` prefixes links with customer slug

**Race condition:** Cookie timing can cause brief wrong-customer flash on initial page load.

**Demo mode:** When no customer slug is set, app runs in demo mode with static fallback data. All Supabase-dependent features gracefully degrade.

### Authentication Gaps

| Area | Current State | Risk |
|------|--------------|------|
| Diagnostic editing | No auth — anyone with URL can toggle edit mode | Customer could modify their own results |
| SOW viewing | No auth — accessible by URL | Sensitive pricing visible to anyone |
| API endpoints | No auth middleware — callable by anyone | Data exposure and manipulation |
| Admin panel | Has `AuthContext` but basic | Needs role-based access |
| Customer portal | No read-only vs. edit distinction | Prospect sees same UI as sales rep |

**Recommendation:** Implement at minimum:
1. Magic-link auth for customer portal (read-only access)
2. Password/SSO auth for sales reps (edit access)
3. API key validation on all write endpoints
4. Separate customer-facing views (read-only) from rep views (edit)

### Data Architecture Concerns

1. **Overlapping schema files:** 4 SQL files (`schema.sql`, `sow-schema.sql`, `sow-redesign-schema.sql`, `diagnostic-results-schema.sql`) with duplicate CREATE TABLE statements. Should consolidate into numbered migrations.

2. **`diagnostic_snapshots` vs `diagnostic_results`:** Two overlapping tables. `diagnostic_snapshots` is legacy; `diagnostic_results` is current. Should consolidate.

3. **Static ↔ DB duality:** Static data files (`diagnostic-data.js`, `services-catalog.js`) coexist with DB tables. The engagement page uses static data while the diagnostic page uses DB data. Confusing and causes data drift.

4. **No foreign key** from `diagnostic_results.customer_id` to `customers.id` in the redesign schema.

---

## 9. Recommended Flow Optimizations

### High-Impact (Do First)

#### 9.1 Make Engagement Page Dynamic
**Current:** Reads static data. **Target:** Reads customer's actual diagnostic results.
- Fetch from `GET /api/diagnostics/[type]?customerId=X` instead of importing static data
- Look up `serviceId` → `service_catalog` table for real hours/rates
- Auto-recommend tier based on total estimated hours
- Add "Build SOW from These Recommendations" CTA

**Impact:** Converts the dead engagement page into the key conversion bridge.

#### 9.2 Auto-Generate SOW Sections from Diagnostic
**Current:** SOW builder starts empty; user manually creates sections.
**Target:** Auto-create sections grouped by function, pre-populated with catalog hours/rates/deliverables.

```
Priority diagnostic items
  → Group by function
  → For each group, create section from matching service_catalog entry
  → Pre-fill hours (avg of hours_low/hours_high), rate, deliverables
  → User refines
```

**Impact:** Reduces SOW building from 8-12 minutes to 2-3 minutes of review.

#### 9.3 Diagnostic PDF Export
Add one-click "Export PDF" to diagnostic results page. Rep can email results to prospect immediately after call.

**Impact:** Eliminates the #1 post-call friction point.

### Medium-Impact

#### 9.4 Read-Only Customer Views
Create separate `/customer/` routes (or role-based rendering) that show:
- Diagnostic results without edit mode
- SOW detail without status management
- Clean, polished presentation-mode rendering

#### 9.5 Quick Diagnostic Mode
Show only the top 15-20 highest-impact process items for a 15-minute call. Expandable to full 63-item assessment.

#### 9.6 Connect Calculator to SOW
When a prospect configures pricing in the calculator, persist the selection and pre-fill SOW fields when creating an engagement.

#### 9.7 Auto-Generate Executive Summary
When creating SOW from diagnostic, auto-generate: "Your GTM assessment revealed X warning areas across Y functions. We recommend Z hours/month focused on [top 3 priority areas]..."

### Lower-Impact (Polish)

#### 9.8 Status Dropdown Instead of Cycling
Replace click-to-cycle (3 clicks to reach "warning") with a popover showing all 4 options + "N/A."

#### 9.9 SOW Acceptance Workflow
Add customer-facing "Accept" button with e-signature integration (DocuSign, already used for NDA).

#### 9.10 Progress Tracking Post-SOW
After SOW acceptance and Teamwork push, show milestone progress in the customer portal.

#### 9.11 Consolidate Inline Styles
Migrate from inline `style={{}}` objects to CSS modules or utility classes. The largest components (`DiagnosticResults` at 871 lines, `SowPage` at 690 lines) are mostly styling.

---

## 10. Metrics to Track

### Phase 1: Awareness (Why)

| Event | Trigger | Purpose |
|-------|---------|---------|
| `why.page_view` | Any Why page load | Content engagement tracking |
| `why.cta_click` | Click "Start Diagnostic" or "Get Started" | Conversion from Why → Try/Buy |
| `why.resource_click` | Click any external resource link | Content value measurement |
| `why.services_search` | Search/filter in services catalog | Intent signal |
| `why.time_on_page` | Page time > 60s | Engagement depth |

### Phase 2: Assessment (Try)

| Event | Trigger | Purpose |
|-------|---------|---------|
| `try.diagnostic_start` | First status change on diagnostic page | Diagnostic initiated |
| `try.diagnostic_complete` | All 63 items assessed (no "unable") | Diagnostic completion rate |
| `try.nda_signed` | DocuSign completion callback | Trust gate cleared |
| `try.intake_submitted` | Fillout form submission | Data capture |
| `try.status_change` | Each status toggle in edit mode | Engagement depth per call |
| `try.note_added` | Note saved on diagnostic item | Rep investment signal |
| `try.engagement_view` | Engagement overview page load | Bridge page usage |
| `try.build_sow_click` | Click "Build SOW" on diagnostic | **Key conversion event** |

### Phase 3: Proposal (Buy)

| Event | Trigger | Purpose |
|-------|---------|---------|
| `buy.page_view` | Buy hub page load | Purchase intent |
| `buy.tier_selected` | Hour tier clicked in configurator | Pricing interest |
| `buy.terms_configured` | Cancellation/payment terms set | Deal structuring |
| `buy.calculator_used` | Any calculator interaction | Price sensitivity analysis |
| `buy.form_submitted` | Getting Started form submitted | **Lead conversion** |
| `buy.intake_submitted` | Clay or Q2C intake submitted | Project scoping initiated |
| `buy.availability_viewed` | Cohort calendar viewed | Urgency/timing signal |

### Phase 4: Close (SOW)

| Event | Trigger | Purpose |
|-------|---------|---------|
| `sow.created` | New SOW created (any path) | Pipeline creation |
| `sow.created_from_diagnostic` | SOW created via "Build SOW" | Diagnostic → SOW conversion |
| `sow.section_added` | Section added in builder | SOW build depth |
| `sow.section_from_catalog` | Section added from catalog picker | Catalog utilization |
| `sow.status_changed` | Status transition (draft→review, etc.) | Pipeline progression |
| `sow.pdf_exported` | PDF generated and downloaded | Proposal sent signal |
| `sow.teamwork_pushed` | Pushed to Teamwork confirmed | **Deal closed / execution started** |
| `sow.accepted` | Status set to "accepted" | **Win event** |
| `sow.declined` | Status set to "declined" | Loss event |

### Funnel Metrics (Computed)

| Metric | Formula | Target |
|--------|---------|--------|
| **Diagnostic Start Rate** | `try.diagnostic_start / why.cta_click` | > 60% |
| **Diagnostic Completion Rate** | `try.diagnostic_complete / try.diagnostic_start` | > 40% |
| **Diagnostic → SOW Rate** | `sow.created_from_diagnostic / try.diagnostic_complete` | > 30% |
| **SOW → Sent Rate** | `sow.pdf_exported / sow.created` | > 70% |
| **SOW Win Rate** | `sow.accepted / sow.pdf_exported` | > 50% |
| **End-to-End Conversion** | `sow.accepted / why.page_view` | > 5% |
| **Time to SOW** | Avg days from `diagnostic_start` to `sow.created` | < 7 days |
| **SOW Build Time** | Avg minutes from SOW creation to PDF export | < 15 min (target: < 5 min with auto-build) |

### Implementation Notes

- No analytics are currently implemented. Recommend adding [Segment](https://segment.com) or [PostHog](https://posthog.com) for event tracking.
- Events should fire on both client-side (page views, clicks) and server-side (API calls for SOW creation, status changes).
- All events should include `customerId`, `diagnosticType`, and `sessionId` properties.
- Build a simple admin dashboard showing funnel conversion rates before investing in a full BI tool.

---

## Appendix: File Reference

| File | Lines | Role |
|------|-------|------|
| `components/Navigation.js` | ~160 | Context-aware nav (prospect vs. customer) |
| `components/diagnostic/DiagnosticResults.js` | 871 | Unified diagnostic renderer |
| `components/sow/SowBuilder.js` | 509 | Two-panel SOW construction |
| `components/sow/SowPage.js` | 690 | SOW detail with status, timeline, Teamwork |
| `components/sow/SowPdfDocument.js` | 518 | PDF generation via @react-pdf |
| `data/diagnostic-data.js` | 1,016 | Auto-generated from markdown config |
| `data/diagnostic-registry.js` | ~50 | Maps diagnostic types → configs |
| `data/services-catalog.js` | 243 | 68 strategic + 60+ managed services |
| `context/CustomerContext.js` | ~200 | Multi-tenant customer state |
| `lib/sow.js` | 245 | SOW CRUD operations |
| `lib/diagnostics.js` | 220 | Diagnostic CRUD operations |
| `lib/teamwork.js` | 376 | Teamwork API client |
| `styles/globals.css` | 1,481 | Global styles with CSS custom properties |
