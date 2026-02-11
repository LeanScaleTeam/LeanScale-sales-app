# LeanScale Sales App — Comprehensive Code Review & Architecture Analysis

**Date:** 2026-02-11
**Branch:** `feature/sales-diagnostic-sow-flow`
**Reviewer:** Automated analysis agent

---

## 1. Architecture Overview

### Tech Stack
- **Framework:** Next.js 14.0.4 (Pages Router)
- **Database:** Supabase (PostgreSQL + RLS)
- **PDF Generation:** @react-pdf/renderer
- **Charts:** Recharts 3.7
- **State Management:** React Context (CustomerContext, AuthContext)
- **Deployment:** Replit (per-customer instances planned)
- **Integrations:** Teamwork (project management), Slack (notifications), n8n (AI SOW generation)

### Directory Structure
```
├── components/
│   ├── diagnostic/       # DiagnosticResults, NoteDrawer, MarkdownImport, StatusLegend, SummaryCard
│   ├── sow/              # SowBuilder, SowPage, SowPdfDocument, SectionEditor, CatalogPicker, etc.
│   ├── charts/           # DonutChart, BarChart
│   ├── admin/            # ServiceCatalogTable, ServiceEditor
│   ├── Layout.js         # Global layout wrapper
│   └── Navigation.js     # Main nav with customer-aware routing
├── context/
│   ├── CustomerContext.js # Multi-tenant customer state
│   └── AuthContext.js     # Admin auth
├── data/
│   ├── diagnostic-data.js      # AUTO-GENERATED from diagnostic-config.md
│   ├── diagnostic-registry.js  # Maps diagnostic types → configs
│   ├── services-catalog.js     # 68 strategic projects + 60+ managed services
│   ├── customer-config.js      # Static customer config (legacy, mostly superseded by DB)
│   ├── clay-diagnostic-data.js # Clay-specific diagnostic data
│   └── cpq-diagnostic-data.js  # CPQ-specific diagnostic data
├── lib/
│   ├── supabase.js       # Dual client setup (anon + service_role)
│   ├── sow.js            # SOW CRUD
│   ├── sow-sections.js   # SOW sections CRUD
│   ├── sow-versions.js   # Version snapshots
│   ├── sow-export.js     # PDF generation wrapper
│   ├── diagnostics.js    # Diagnostic results + notes CRUD
│   ├── service-catalog.js # Service catalog CRUD
│   ├── teamwork.js       # Teamwork API client
│   └── slack.js          # Slack notification helpers
├── pages/
│   ├── try-leanscale/    # Diagnostic pages (diagnostic.js, start.js, engagement.js, etc.)
│   ├── sow/              # SOW pages (index, generate, [id]/build, [id]/index)
│   ├── buy-leanscale/    # Sales/pricing pages
│   ├── why-leanscale/    # Marketing/content pages
│   ├── admin/            # Admin panel
│   └── api/              # REST API routes
├── supabase/             # Schema files (schema.sql, sow-schema.sql, sow-redesign-schema.sql, etc.)
└── styles/globals.css    # Global CSS with CSS custom properties
```

### Multi-Tenant Architecture
The app supports multiple customer instances through a middleware-based routing system:

1. **Path-based routing:** `/c/customer-slug/page` → rewrites to `/page` with cookie
2. **Subdomain routing:** `customer.clients.leanscale.team` (planned)
3. **Query param:** `?customer=slug` (development)

The `CustomerContext` reads the customer slug from a cookie set by middleware, fetches config from `/api/customer`, and provides it throughout the component tree. This is clean but has a subtle race condition: cookie timing can cause the wrong customer to render briefly on initial load.

### Data Flow Architecture
```
Static data files (diagnostic-data.js)
         ↓ (fallback)
Supabase DB (diagnostic_results, sows, sow_sections)
         ↓ (API layer)
/api/* routes (pages/api/)
         ↓ (fetch)
React components (client-side state)
```

**Key pattern:** All data has static fallbacks. If Supabase isn't configured, the app degrades gracefully to demo mode using hardcoded data. This is well-implemented.

---

## 2. Current User Flow

### Why LeanScale → Try → Buy

The app maps to a 3-phase sales conversation:

**Phase 1: Why LeanScale** (`/why-leanscale/*`)
- About Us, Resources, References, Services Catalog, Glossary
- Pure content pages — no interactivity or data capture
- Serves as the "credibility" phase

**Phase 2: Try LeanScale** (`/try-leanscale/*`)
- **Start Diagnostic** (`/start`) — entry point explaining the diagnostic concept
- **GTM Diagnostic** (`/diagnostic`) — 63 process health assessments + 10 Power10 metrics + 17 tools
- **Clay Diagnostic** (`/clay-diagnostic`) — Clay-specific enrichment assessment
- **CPQ Diagnostic** (`/cpq-diagnostic`) — Quote-to-cash assessment
- **Engagement Overview** (`/engagement`) — Recommended projects based on diagnostic findings
- All three diagnostics use the shared `DiagnosticResults` component via the `diagnosticRegistry`

**Phase 3: Buy LeanScale** (`/buy-leanscale/*`)
- Availability calendar, pricing calculator, intake forms, team profiles
- Getting Started contract form
- One-time project cards ($45K each)

**SOW System** (`/sow/*`) — Separate section for building/managing SOWs
- SOW list → Create from diagnostic → Builder → Preview → PDF export → Push to Teamwork

### The Diagnostic → SOW Bridge
The critical conversion point is the **"Build SOW" button** on the diagnostic results page. When clicked:
1. Calls `POST /api/sow/from-diagnostic` with the diagnostic result ID
2. Creates a new SOW with `diagnostic_result_ids` linking to the diagnostic
3. Snapshots the diagnostic processes into `diagnostic_snapshot` on the SOW
4. Computes an `overall_rating` (critical/warning/moderate/healthy)
5. Redirects to `/sow/[id]/build` — the two-panel SOW builder

---

## 3. Diagnostic System Deep Dive

### Data Architecture

**Static data layer** (`data/diagnostic-data.js`):
- AUTO-GENERATED from `data/diagnostic-config.md` via `data/parse-diagnostic-config.js`
- Defines 63 processes, each with: `name`, `status`, `addToEngagement`, `function`, `outcome`, `metric`, `serviceId`, `serviceType`
- 5 GTM functions: Cross Functional, Marketing, Sales, Customer Success, Partnerships
- 6 GTM outcomes: Increase Pipeline, Improve Sales Efficiency, Reduce Churn, Improve Data Quality, Scale Operations, Optimize Reporting
- 10 Power10 metrics (ARR, Bookings, etc.)
- 17 GTM tools

**Registry pattern** (`data/diagnostic-registry.js`):
- Maps diagnostic types (`gtm`, `clay`, `cpq`) to their data configs
- Enables the unified `DiagnosticResults` component to render any diagnostic type
- Clean pattern — adding a new diagnostic type requires only: a data file + a registry entry + a page route

**Database layer** (`diagnostic_results` table):
- One row per customer per diagnostic type (UNIQUE constraint)
- `processes` JSONB column stores the same shape as static data
- `tools` JSONB for GTM-specific tool data
- `diagnostic_notes` table for per-process-item notes (linked by `process_name`)

### Scoring System
Status values: `healthy` | `careful` | `warning` | `unable`

There is **no numeric scoring**. The system uses categorical health statuses only. This is a significant limitation — there's no weighted scoring, no composite score, no benchmarking. The "overall rating" computed during SOW creation is a simple threshold:
- >50% warning+unable → "critical"
- >30% → "warning"  
- >10% → "moderate"
- else → "healthy"

### Edit Mode
The diagnostic page has an inline edit mode where a sales rep can:
- **Cycle status** by clicking the status badge (healthy → careful → warning → unable)
- **Toggle priority** (addToEngagement) with a click
- **Add notes** per process item via a drawer

Changes auto-save to the database with 800ms debounce. This is a good UX pattern for live editing during a sales call.

### Markdown Import
The `MarkdownImport` component allows importing diagnostic data from a markdown table format. This bridges the gap from the old Coda-based workflow where diagnostic data was in markdown format.

### Key Relationships
Each process item links to the services catalog via `serviceId`:
```
process.serviceId → strategicProjects[function][].id
process.serviceType → 'strategic' | 'managed'
```
This linkage is how diagnostic findings connect to recommended services and ultimately to SOW sections.

---

## 4. SOW System Deep Dive

### SOW Data Model

**`sows` table:**
- Core fields: `title`, `status` (draft/review/sent/accepted/declined), `sow_type` (clay/q2c/embedded/custom)
- Input fields: `intake_submission_id`, `transcript_text`, `diagnostic_snapshot` (JSONB)
- Output fields: `content` (JSONB), `total_hours`, `total_investment`, `start_date`, `end_date`
- Integration fields: `diagnostic_result_ids` (UUID[]), `teamwork_project_id`, `teamwork_project_url`
- Version tracking: `current_version` (integer)

**`sow_sections` table:**
- Linked to SOW via `sow_id` (CASCADE delete)
- Fields: `title`, `description`, `deliverables` (JSONB array), `hours`, `rate`, `start_date`, `end_date`
- `diagnostic_items` (JSONB array of process names) — links section to diagnostic findings
- `sort_order` for drag-and-drop reordering
- `teamwork_milestone_id` for Teamwork integration

**`sow_versions` table:**
- Snapshot on PDF export: `content_snapshot`, `sections_snapshot` (full JSONB copies)
- `version_number` (auto-incrementing per SOW)
- `pdf_url` (currently unused — PDFs are generated on-the-fly, not stored)

### SOW Builder (`SowBuilder.js`)

Two-panel layout:
- **Left panel:** `DiagnosticItemPicker` — shows all diagnostic processes, allows selection
- **Right panel:** `SectionEditor` list — organize selected items into named sections with hours/rates

Key features:
- Auto-selects warning/unable items when creating from diagnostic
- Items can be assigned to sections (tracked via `diagnostic_items` on each section)
- Sections can be added from the service catalog (`CatalogPicker`) which pre-fills hours, rate, deliverables
- Drag-and-drop section reordering
- Summary bar shows total hours, investment, and unassigned item count

### SOW Page (`SowPage.js`)

Rich display component with:
- Status management (draft → review → sent → accepted/declined)
- `DiagnosticScoreCard` — shows linked diagnostic health at a glance
- `DiagnosticSyncBanner` — alerts when diagnostic results have changed since SOW creation
- `InvestmentTable` — hours × rate breakdown per section
- `SowTimeline` — visual timeline of section dates
- `VersionHistory` — list of exported versions
- `TeamworkPreview` — preview Teamwork project structure before pushing
- Falls back to old `SowPreview` component for legacy SOWs that have `content` but no sections

### PDF Export (`SowPdfDocument.js`)

Uses `@react-pdf/renderer` to generate branded PDFs with:
- Header with SOW title, customer name, date, status
- Executive summary (from `sow.content.executive_summary`)
- Scope sections (from `sow_sections`)
- Each section shows: title, description, deliverables list, hours, rate, diagnostic item statuses
- Investment summary table
- Assumptions and acceptance criteria

### SOW Generation Flow

Two paths to create a SOW:

**Path 1: From Diagnostic** (primary flow)
1. User completes diagnostic → clicks "Build SOW"
2. `POST /api/sow/from-diagnostic` creates SOW with diagnostic link
3. Redirects to `/sow/[id]/build` for section-based editing
4. Save → Preview → Export PDF

**Path 2: Manual Generation** (`/sow/generate`)
1. User fills form with customer ID, SOW type, transcript text
2. `POST /api/sow/generate` optionally calls n8n webhook for AI content
3. Falls back to template content if n8n unavailable
4. Creates SOW and sends Slack notification

### Teamwork Integration

When a SOW is accepted, it can be pushed to Teamwork:
1. `POST /api/sow/[id]/push-to-teamwork` — generates a preview of the project structure
2. Shows preview with milestones (one per section), task lists, and tasks (from deliverables)
3. `POST /api/sow/[id]/push-to-teamwork/confirm` — creates the actual Teamwork project
4. Updates SOW with `teamwork_project_id` and `teamwork_project_url`

---

## 5. Database Schema Analysis

### Tables Overview

| Table | Purpose | Status |
|-------|---------|--------|
| `customers` | Multi-tenant customer configs | Active, well-used |
| `availability_dates` | Cohort availability calendar | Active |
| `form_submissions` | Form data (getting_started, intake) | Active |
| `diagnostic_results` | Per-customer diagnostic data | Active |
| `diagnostic_notes` | Notes on diagnostic items | Active |
| `diagnostic_snapshots` | Point-in-time diagnostic copies | **Partially used** — superseded by `diagnostic_results` + SOW snapshots |
| `sows` | Statement of Work records | Active |
| `sow_sections` | SOW scope sections | Active |
| `sow_versions` | Export version snapshots | Active but `pdf_url` never populated |
| `service_catalog` | Services with hours/rates | Active (seeded from static data) |

### Schema Issues

1. **`diagnostic_snapshots` vs `diagnostic_results`:** Two overlapping tables. `diagnostic_snapshots` was the original design; `diagnostic_results` replaced it with upsert semantics. The `diagnostic_snapshots` table is still referenced in code (`listDiagnosticSnapshots`, `createDiagnosticSnapshot` in `lib/sow.js`) but the primary flow uses `diagnostic_results`. Should consolidate.

2. **`sows.diagnostic_snapshot`** (JSONB) duplicates data from `diagnostic_results`. This is intentional for point-in-time snapshots, but the `DiagnosticSyncBanner` component compares current diagnostic data with the snapshot to detect drift. The dual-write pattern works but adds complexity.

3. **`sow_versions.pdf_url`** is always null — PDFs are generated on-the-fly via the export API and streamed to the client. No storage integration exists. This means version history shows exports but you can't re-download old PDFs.

4. **No foreign key from `diagnostic_results.customer_id` to `customers.id`** in the redesign schema — it uses `UUID NOT NULL` without `REFERENCES`. The original schema does have the FK. Both schema files define the same table, which is confusing.

5. **Multiple overlapping schema files:**
   - `schema.sql` — base tables (customers, availability, form_submissions)
   - `sow-schema.sql` — SOW + diagnostic_snapshots
   - `sow-redesign-schema.sql` — Re-creates everything with sow_sections + sow_versions
   - `diagnostic-results-schema.sql` — diagnostic_results + diagnostic_notes
   
   These should be consolidated into a single migration or numbered migration files. The current setup requires running them in a specific order and has duplicate CREATE TABLE statements.

6. **RLS is service_role-only for writes on all tables.** This is fine for a server-rendered app but means there's no real row-level security — it's effectively "API key auth." The anon key can read customers and availability but nothing else.

---

## 6. Component Quality Assessment

### Strengths

1. **DiagnosticResults is well-architected.** The registry pattern + unified component means all three diagnostic types share identical rendering logic. Adding a new diagnostic type is trivial.

2. **SowBuilder's two-panel design** is a solid UX pattern for mapping diagnostic items to SOW sections. The drag-and-drop reordering, catalog picker, and summary bar are well-implemented.

3. **Graceful degradation.** Every Supabase-dependent feature has a static fallback. The app works without a database configured.

4. **Auto-save with debounce** on the diagnostic page is good for live editing during sales calls.

5. **Clean API layer.** The `lib/` files provide a consistent pattern: null-safe Supabase client checks, try/catch wrapping, consistent error logging.

### Tech Debt & Issues

1. **Massive inline styles everywhere.** Components like `DiagnosticResults.js` (871 lines), `SowPage.js` (690 lines), and `SowBuilder.js` (509 lines) have hundreds of lines of inline `style={{}}` objects. This makes the code hard to read, impossible to theme, and prevents responsive design. Should migrate to CSS modules or a utility framework.

2. **No TypeScript.** The entire codebase is JavaScript with no type annotations. Given the complex data shapes (diagnostic processes, SOW sections, service catalog), TypeScript would prevent many bugs.

3. **The engagement page uses hardcoded hour estimates.** `engagement.js` computes `lowHours` and `highHours` with formulas like `20 + (idx * 8)` — these aren't connected to the service catalog's actual `hours_low`/`hours_high` values.

4. **`customer-config.js` is a dead file.** It's imported nowhere in the current codebase — everything comes from the database via `CustomerContext`. Should be removed.

5. **No loading states on the SOW list page.** The `SowIndex` page fetches SOWs client-side but shows nothing while loading. Should use skeleton screens or a loading indicator.

6. **No error boundaries.** If any component throws during render, the entire page crashes with no recovery. React error boundaries should wrap key sections.

7. **The `SowPreview` component** (`components/SowPreview.js`) is legacy — it renders SOWs from the old `content` JSONB structure. `SowPage` now handles section-based SOWs but falls back to `SowPreview` for old data. This dual rendering path should be unified.

8. **No tests for the diagnostic flow.** The `__tests__/` directory has tests for API routes and basic components but nothing for `DiagnosticResults`, `SowBuilder`, or the diagnostic → SOW conversion flow.

9. **The `data/diagnostic-data.js` auto-generation** from markdown is a build-time step (`node data/parse-diagnostic-config.js`). If someone forgets to run it, the data is stale. This should be a pre-build hook (it is in the `dev` and `build` scripts, which is correct, but the file is also checked into git, creating confusion about which is authoritative).

---

## 7. API Assessment

### Endpoint Inventory

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET/POST | `/api/sow` | List/create SOWs |
| GET/PUT/DELETE | `/api/sow/[id]` | Single SOW operations |
| POST | `/api/sow/generate` | AI-powered SOW generation (n8n) |
| POST | `/api/sow/from-diagnostic` | Create SOW from diagnostic results |
| GET/POST/PUT | `/api/sow/[id]/sections` | Section CRUD + reorder |
| PUT/DELETE | `/api/sow/[id]/sections/[sectionId]` | Single section operations |
| GET/POST | `/api/sow/[id]/versions` | Version list/create |
| GET | `/api/sow/[id]/versions/[versionId]` | Get version details |
| POST | `/api/sow/[id]/export` | PDF generation + version snapshot |
| POST | `/api/sow/[id]/push-to-teamwork` | Generate Teamwork preview |
| POST | `/api/sow/[id]/push-to-teamwork/confirm` | Execute Teamwork push |
| POST | `/api/sow/[id]/diagnostic-sync` | Check if diagnostic has changed |
| POST | `/api/sow/[id]/diagnostic-resync` | Re-snapshot diagnostic data |
| GET/PUT | `/api/diagnostics/[type]` | Get/update diagnostic results |
| POST/DELETE | `/api/diagnostics/notes` | Note CRUD |
| GET/POST | `/api/service-catalog` | Service catalog list/create |
| GET/PUT/DELETE | `/api/service-catalog/[id]` | Single service operations |
| POST | `/api/service-catalog/seed` | Seed catalog from static data |
| GET | `/api/customer` | Get customer config |
| POST | `/api/submit-form` | Form submission |
| GET/POST | `/api/diagnostic-snapshots` | Legacy snapshot endpoint |

### API Patterns

**Strengths:**
- Consistent `{ success: boolean, data?, error? }` response format
- All write operations use `supabaseAdmin` (service_role key)
- Read operations use `supabase` (anon key) where possible
- Error handling is consistent with try/catch + console.error

**Weaknesses:**
1. **No authentication middleware.** Any API endpoint is callable by anyone with the URL. The middleware handles customer routing but doesn't verify identity. Admin endpoints (`/api/admin/*`) should require auth.

2. **No input validation library.** Validation is manual `if (!field)` checks. Should use zod or joi for request body validation.

3. **No rate limiting.** The SOW generation endpoint calls external services (n8n, Slack) — could be abused.

4. **Mixed use of camelCase and snake_case.** API request bodies use camelCase (`customerId`), database columns use snake_case (`customer_id`), and the mapping happens in lib files and API routes inconsistently. Some routes map it, others don't.

5. **The `from-diagnostic` endpoint** does a create + update (two DB calls) because `createSow` doesn't support the new fields (`diagnostic_result_ids`, `overall_rating`). This should be a single insert.

---

## 8. Gaps and Issues

### Critical

1. **No authentication on diagnostic editing.** Anyone with the customer URL can enter edit mode and change diagnostic statuses. There's no role-based access control — a customer could modify their own diagnostic results.

2. **The engagement page is disconnected from the database.** It reads from static `diagnostic-data.js` imports, not from customer-specific diagnostic results. A customer's engagement overview always shows the demo data unless the static file was modified.

3. **PDF export may fail silently.** The `@react-pdf/renderer` `renderToBuffer` call can fail if any component renders invalid data (null values, missing fields). There's no validation before PDF generation.

### Major

4. **No way to edit the SOW's executive summary, assumptions, or acceptance criteria from the builder UI.** The `SowBuilder` only manages sections. The `content` JSONB fields (executive_summary, assumptions, etc.) are set at creation time and never updated through the UI.

5. **Service catalog hours are not linked to engagement page.** The engagement overview hardcodes hour estimates instead of pulling from the `service_catalog` table's `hours_low`/`hours_high`.

6. **Diagnostic sync is one-way.** The `DiagnosticSyncBanner` detects when diagnostic data has changed after SOW creation, but re-syncing replaces the entire snapshot. There's no merge or diff — if you've customized the SOW sections, re-sync doesn't update them.

7. **The n8n SOW generation flow is undocumented in-code.** The webhook URL, expected payload/response format, and failure modes are scattered across `pages/api/sow/generate.js` with minimal comments.

### Minor

8. **The admin panel** (`pages/admin/*`) has basic CRUD for customers and service catalog but no diagnostic management. Admins can't review or edit diagnostic results.

9. **The Playbooks-Site directory** is a full Docusaurus site embedded in the repo. It's 200+ files and has its own `node_modules`. It should be a separate repo or git submodule.

10. **The `data/all-playbooks.json` and `data/playbook-content.js`** files contain fetched playbook content from the Docusaurus site. The fetch scripts (`scripts/fetch-playbooks.js`) require the Docusaurus site to be running locally.

---

## 9. Key Insight: Diagnostic → SOW Data Flow

### Current Flow

```
1. User runs diagnostic → data stored in diagnostic_results (processes JSONB array)
   Each process: { name, status, addToEngagement, function, outcome, metric, serviceId, serviceType }

2. User clicks "Build SOW" → POST /api/sow/from-diagnostic
   - Creates SOW with diagnostic_result_ids UUID array
   - Snapshots processes into sow.diagnostic_snapshot JSONB
   - Computes overall_rating

3. SowBuilder loads → fetches SOW + diagnostic_results
   - DiagnosticItemPicker shows all processes from diagnostic_results
   - User selects items → assigns them to SOW sections
   - Sections store diagnostic_items[] = array of process names

4. SowPage renders → shows sections with linked diagnostic items
   - Each section can display the health status of its linked diagnostic items
   - DiagnosticScoreCard shows overall diagnostic health

5. PDF Export → sections rendered with diagnostic status dots
   - Each section includes a mini status summary for its diagnostic items
```

### What's Missing for Dynamic Rendering

1. **No dynamic section generation.** When creating a SOW from a diagnostic, sections are NOT auto-created. The user has to manually create sections and assign items. The `from-diagnostic` endpoint creates an empty SOW and the user builds from scratch. **Opportunity:** Auto-generate sections grouped by function or outcome, pre-populated with hours/rates from the service catalog.

2. **No link from diagnostic items to service catalog hours.** Each process has a `serviceId` that maps to `strategicProjects` in `services-catalog.js`, but those static objects don't have `hours_low`/`hours_high`. The database `service_catalog` table does, but the linkage isn't used during SOW section creation from diagnostic. **Opportunity:** When auto-generating sections, look up each `serviceId` in the service catalog DB to get default hours and rates.

3. **No scoring weights.** All diagnostic items are treated equally. A "warning" on "Growth Model" (foundational) has the same weight as "warning" on "Event Lead List Intake" (tactical). **Opportunity:** Add priority weights to the service catalog or diagnostic config.

4. **No recommended engagement tier.** The engagement page shows three hour tiers (50h/100h/225h) but doesn't map diagnostic results to a recommended tier. **Opportunity:** Sum estimated hours from priority items (via service catalog lookup) and recommend the appropriate tier.

5. **No diagnostic-to-timeline mapping.** SOW sections have `start_date` and `end_date` but these are manually set. The engagement page computes `startWeek` and `durationWeeks` but with hardcoded formulas. **Opportunity:** Use service catalog data to auto-suggest timelines based on project complexity.

6. **The diagnostic_snapshot on the SOW only stores `name`, `status`, and `addToEngagement`.** It doesn't store `function`, `outcome`, `metric`, or `serviceId`. This means the SOW page can't group or filter by these dimensions without fetching the full diagnostic result. **Opportunity:** Store the complete process objects in the snapshot.

### Architecture Recommendation

The key missing piece is a **"SOW auto-builder"** that:
1. Takes diagnostic results as input
2. Groups priority items by function/outcome
3. Looks up each item's service catalog entry for hours/rates/deliverables
4. Creates pre-populated SOW sections
5. Suggests a total investment and timeline
6. Lets the user refine from there

This would transform the current manual 15-minute SOW building process into a 2-minute review-and-adjust workflow.

---

## Appendix: File Size Summary

| File | Lines | Complexity |
|------|-------|------------|
| `data/diagnostic-data.js` | 1,016 | Auto-generated, 63 processes + tools + metrics |
| `data/services-catalog.js` | 243 | 68 strategic + 60+ managed services |
| `components/diagnostic/DiagnosticResults.js` | 871 | High — inline styles, multiple sub-components |
| `components/sow/SowPage.js` | 690 | High — status mgmt, Teamwork, versions |
| `components/sow/SowPdfDocument.js` | 518 | Medium — PDF layout with @react-pdf |
| `components/sow/SowBuilder.js` | 509 | High — two-panel CRUD with drag-drop |
| `pages/try-leanscale/engagement.js` | 469 | Medium — mostly static with hardcoded calcs |
| `lib/teamwork.js` | 376 | Medium — REST client wrapper |
| `lib/sow.js` | 245 | Low — clean CRUD |
| `lib/sow-sections.js` | 244 | Low — clean CRUD |
| `lib/diagnostics.js` | 220 | Low — clean CRUD |
| `lib/supabase.js` | 214 | Low — dual client + fallbacks |
| `styles/globals.css` | ~800 | Medium — comprehensive CSS custom properties |
