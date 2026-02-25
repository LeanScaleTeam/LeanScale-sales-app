# LeanScale GTM Diagnostic — User Guide

This guide covers the full diagnostic workflow from admin setup through results delivery. It covers both HubSpot and Salesforce CRM integrations.

---

## Table of Contents

1. [Admin Setup](#1-admin-setup)
2. [Running a Diagnostic — Overview](#2-running-a-diagnostic)
3. [HubSpot Diagnostic](#3-hubspot-diagnostic)
4. [Salesforce Diagnostic](#4-salesforce-diagnostic)
5. [Intake Form](#5-intake-form)
6. [Diagnostic Results](#6-diagnostic-results)
7. [Building a SOW](#7-building-a-sow)
8. [Engagement Overview](#8-engagement-overview)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Admin Setup

### Creating a Customer

Navigate to `/admin/customers` (requires Supabase auth login). Click **Add Customer**.

| Field | Required | Notes |
|-------|----------|-------|
| Name | Yes | Display name shown throughout the portal |
| Slug | Yes | URL identifier — lowercase, alphanumeric + hyphens. **Cannot be changed after creation.** |
| Password | Yes | Customer uses this to access their portal |
| Diagnostic Type | Yes | `gtm` (default), `clay`, or `cpq` |
| Customer Type | No | `prospect` (default), `active`, or `churned` — `active` unlocks the full dashboard |
| Logo URL | No | Customer's company logo |
| Assigned Team | No | Comma-separated LeanScale team member names |
| Is Demo | No | Demo accounts skip data persistence in the intake form |

After creation, the customer portal is available at:
- **Path-based:** `https://clients.leanscale.team/c/{slug}`
- **Subdomain:** `https://{slug}.clients.leanscale.team`

### Environment Variables

The following environment variables must be set in Netlify for CRM integrations to work:

**HubSpot:**
```
HUBSPOT_CLIENT_ID=<from HubSpot Developer Portal>
HUBSPOT_CLIENT_SECRET=<from HubSpot Developer Portal>
HUBSPOT_REDIRECT_URI=https://clients.leanscale.team/api/hubspot/callback
```

**Salesforce:**
```
SALESFORCE_CLIENT_ID=<Consumer Key from Connected App>
SALESFORCE_CLIENT_SECRET=<Consumer Secret from Connected App>
SALESFORCE_REDIRECT_URI=https://clients.leanscale.team/api/salesforce/callback
```

All CRM credentials are server-only (never exposed to the browser). See the [Salesforce Deployment Guide](salesforce-diagnostic-deployment-guide.md) for Connected App setup instructions.

---

## 2. Running a Diagnostic

### The Two Paths

The diagnostic flow differs based on which CRM the customer uses:

**HubSpot Path:**
```
Complete intake form (all sections) → Connect HubSpot at Review step → Run Diagnostic → Results
```

**Salesforce Path (CRM-first):**
```
Answer 4 profile questions → Connect Salesforce → Form auto-fills from CRM data → Review remaining questions → Run Diagnostic → Results
```

The Salesforce path is faster because it pre-fills answers from CRM metadata, reducing manual input from ~30 questions to ~12-15.

### What the Diagnostic Assesses

The v2 diagnostic engine scores 17 items across 3 layers (HubSpot) or 22 items across 4 layers (Salesforce):

| Layer | Items | Weight (HubSpot) | Weight (Salesforce) |
|-------|-------|-------------------|---------------------|
| Foundation | F1-F5: Data model, pipeline, lifecycle, enrichment, dedup | 40% | 35% |
| Motions | M1-M7: Lead routing, nurture, outbound, forms, marketing, BDR, handoff | 35% | 30% |
| Maturity | R1-R5: Reporting, dashboards, attribution, data quality, forecasting | 25% | 20% |
| Platform Health | P1-P5: Apex, validation, security, record types, integrations | — | 15% |

Each item is scored 1-3: **Healthy** (3), **Careful** (2), **Warning** (1).

### Who Runs It

The diagnostic is consultant-led. The typical flow:

1. **Consultant** creates the customer in the admin panel
2. **Consultant** opens the intake form at `/c/{slug}/diagnostic/intake`
3. **Consultant** fills out the form based on customer conversations
4. **Consultant** connects the customer's CRM (with customer-provided credentials)
5. **Engine** runs automatically and produces results
6. **Consultant** reviews and adjusts results in Edit Mode
7. **Consultant** builds a SOW from the results

---

## 3. HubSpot Diagnostic

### Prerequisites

- Customer created in admin panel with `diagnosticType = 'gtm'`
- HubSpot environment variables configured
- Customer or consultant has HubSpot admin credentials for the customer's portal

### Step-by-Step Flow

#### 1. Start the Intake Form

Navigate to `/c/{slug}/diagnostic/intake`. The form has 4 sections plus a review step.

#### 2. Complete All Sections

Fill out all 4 sections in order:
- **Section A** — Company Profile (CRM, rep count, ARR, GTM motion, partner program)
- **Section B** — GTM Tools (checklist of 8 categories with adoption levels)
- **Section C** — Processes (12-15 questions about lead management, sales process, CS)
- **Section D** — Reporting & Metrics (dashboard usage, forecasting, Power 10 metrics)

Progress saves automatically after each section. You can leave and return — answers persist.

#### 3. Review & Connect HubSpot

On the Review step, you'll see a summary of all answers plus an orange **Connect HubSpot** banner.

Click **Connect HubSpot**:
1. Your form answers are saved automatically
2. Browser redirects to HubSpot's OAuth consent screen
3. Log in with the customer's HubSpot credentials and approve access
4. HubSpot redirects back to the intake form
5. Metadata downloads automatically (15-30 seconds)
6. A green **"HubSpot Connected — CRM data downloaded"** banner appears

#### 4. Run the Diagnostic

Click **Run Diagnostic**. The engine combines your intake answers with CRM metadata to produce scored results. You're redirected to the results page.

### What HubSpot Data Is Downloaded

| Data | API Endpoint |
|------|-------------|
| Properties (contacts, companies, deals, tickets, products, line items) | `/crm/v3/properties/{type}` |
| Deal and ticket pipelines | `/crm/v3/pipelines/{type}` |
| Workflows / automations | `/automation/v4/flows` |
| Forms | `/marketing/v3/forms` |
| Contact lists | `/contacts/v1/lists` |
| Owners | `/crm/v3/owners` |
| Marketing emails | `/marketing/v3/emails` |
| Sequences | `/automation/v4/actions/sequences` |

No contact records, deal amounts, or email content is accessed — only metadata and configuration.

### Without HubSpot Connected

If you submit the intake form without connecting HubSpot:
- The intake saves with status `awaiting_crm_data`
- You stay on the review page
- When you connect HubSpot later, the diagnostic auto-runs
- No need to re-submit the form

---

## 4. Salesforce Diagnostic

### Prerequisites

- Customer created in admin panel with `diagnosticType = 'gtm'`
- Salesforce Connected App configured (see [Deployment Guide](salesforce-diagnostic-deployment-guide.md))
- Salesforce environment variables configured
- Consultant has Salesforce admin credentials for the customer's org

### Step-by-Step Flow (CRM-First)

The Salesforce flow is different from HubSpot — you connect the CRM early and the form pre-fills.

#### 1. Start the Intake Form

Navigate to `/c/{slug}/diagnostic/intake`.

#### 2. Answer Profile Questions

In **Section A**, select **Salesforce** as the CRM. The form shows only 4 questions (A2 — rep count — is hidden because it will be inferred from Salesforce data):

- A1: Primary CRM → Salesforce
- A3: ARR range
- A4: Primary GTM motion
- A5: Partner/channel program

Click **Continue**.

#### 3. Connect Salesforce

The **Connect Salesforce** step appears with two options:

**Option A: OAuth (recommended)**
1. Click **Connect via OAuth**
2. Toggle the **Sandbox** checkbox if connecting to a sandbox org
3. Browser redirects to Salesforce login
4. Log in with admin credentials and approve access
5. Salesforce redirects back to the intake form

**Option B: Metadata Upload (fallback)**

If OAuth isn't available (IP restrictions, no admin access), export metadata via CLI:

```bash
sf org login web --alias customer-org
sf project retrieve start \
  --metadata CustomObject,CustomField,Flow,WorkflowRule,ValidationRule \
  --metadata ApexTrigger,ApexClass,Profile,PermissionSet \
  --metadata Role,DuplicateRule,ConnectedApp,NamedCredential \
  --metadata Layout,RecordType,Report,Dashboard \
  --target-org customer-org
```

Drag and drop the resulting ZIP file into the upload area.

#### 4. Analyzing Screen

After connecting, you'll see an animated progress screen:

```
✓ Connecting to Salesforce
✓ Downloading org metadata
● Analyzing your configuration...
```

This takes 3-8 seconds. The system downloads metadata from 16 API endpoints in parallel, then runs the inference engine.

#### 5. Review Pre-filled Form

The form advances to Section B with many answers already filled in. The inference engine analyzes the downloaded metadata and pre-fills questions it can confidently answer.

**What gets pre-filled:**

| Question | How It's Inferred | Confidence |
|----------|-------------------|------------|
| A2: Rep count | Counts users with sales-related profiles (AE, SDR, BDR, etc.) | High |
| B1: GTM tools | Matches ConnectedApp names against known tool patterns (Outreach, Gong, ZoomInfo, etc.) | Medium |
| C1: Inbound lead capture | Checks for lead-creation Flows and Web-to-Lead fields | Medium |
| C3: MQL definition | Checks Lead fields for score/MQL/qualified patterns | Medium |
| C4: Qualification methodology | Checks Opportunity fields for MEDDIC/BANT/SPICED patterns | Medium |
| C5: Deal stage required fields | Counts active ValidationRules on Opportunity | High |
| C6: Closed-lost reason tracking | Finds Opportunity field matching closed-lost reason patterns | High |
| C8: Renewal tracking | Checks RecordTypes for "renewal" pattern | Medium |
| C10: Dedup process | Finds Flows with dedup/duplicate/merge labels | High |
| C11: Email nurture | Checks ConnectedApps for Pardot/Marketing Cloud/Marketo | Medium |
| D1: Dashboard count | Counts Dashboard records in the org | High |

**How pre-filled answers appear:**

- **Section B (tools):** A blue **"Auto-detected"** pill badge appears next to each pre-filled checkbox. The badge disappears when you toggle the checkbox.
- **Sections C and D:** A blue hint appears below the selected answer showing the evidence (e.g., "Auto-detected: 12 dashboards found in Salesforce"). The hint disappears when you click any answer option for that question.

**Modifying pre-filled answers:** Simply click a different answer. There's no special "edit" button — selecting any option overrides the pre-fill and hides the badge. Even clicking the same pre-filled option counts as a manual confirmation and removes the badge.

#### 6. Complete Remaining Questions

Review Sections B through D. Answer any questions the engine couldn't infer. Pre-filled answers are already selected but you can change them.

#### 7. Run the Diagnostic

On the Review step, click **Run Diagnostic**. The engine combines your answers (manual + pre-filled) with the full CRM metadata to produce scored results. You're redirected to the results page.

### What Salesforce Data Is Downloaded

The system downloads from 16 API endpoints in parallel (API v59.0):

| Data | Source |
|------|--------|
| Object schemas (Lead, Contact, Account, Opportunity, Case, Campaign) | REST Describe API |
| Opportunity stages, Lead statuses | SOQL queries |
| Active users and roles | SOQL queries |
| Reports and Dashboards (up to 200 each) | SOQL queries |
| Record types | SOQL query |
| Active Flows, Workflow Rules, Validation Rules | Tooling API |
| Apex Triggers and Classes | Tooling API |
| Profiles and Permission Sets | Tooling API |
| Connected Applications and Named Credentials | Tooling API |

No contact records, deal amounts, email content, or PII is accessed — only metadata and configuration.

### Without Salesforce Connected

If you skip the CRM connection step and complete the form manually, it works identically to the HubSpot path — all sections must be filled out by hand. The Salesforce-specific Platform Health layer (P1-P5) will not be scored.

---

## 5. Intake Form Reference

This section covers intake form details shared across both CRM paths.

### Form Sections

| Section | Title | Questions | Topics |
|---------|-------|-----------|--------|
| A | Company Profile | 5 | CRM platform, rep count, ARR, GTM motion, partner program |
| B | GTM Tools | 8 categories | Tool adoption checklist with usage levels |
| C | Processes | 12-15 | Lead management, sales process, customer success, data hygiene |
| D | Reporting & Metrics | 6-8 | Dashboards, forecasting, Power 10 metrics |
| Review | Summary | — | Read-only summary of all answers + CRM connection |

### Auto-Save Behavior

- Progress saves automatically when you complete each section and click Continue
- You can close the browser and return later — answers persist
- The URL stays at `/c/{slug}/diagnostic/intake` throughout
- Demo accounts (`is_demo = true`) skip data persistence

### Section Navigation

- Use **Continue** to advance to the next section
- Use **Back** to return to the previous section
- The progress bar at the top shows which section you're on
- You cannot skip sections — they must be completed in order

---

## 6. Diagnostic Results

**URL:** `/c/{slug}/try-leanscale/diagnostic`

### Health Score Hero

At the top of the Priority view, an animated circular gauge displays the overall health score (0-100):

| Score | Rating | Color |
|-------|--------|-------|
| 75-100 | Healthy | Green |
| 50-74 | Moderate | Blue |
| 25-49 | Warning | Amber |
| 0-24 | Critical | Red |

Below the ring: a summary line showing processes analyzed, items needing attention, and items flagged as priorities. A horizontal stacked bar shows the distribution across all status levels.

### View Modes

Use the segmented toggle in the sticky navigation bar to switch views. Available views depend on the diagnostic type and version:

| View | Description | Available When |
|------|-------------|----------------|
| **Priority** | Items grouped by severity — Critical, Warning, Moderate, Healthy. Critical and Warning sections start expanded. | Default for v1 GTM/Clay |
| **By Category** | Items grouped by business function. Each group header shows mini status dots. All groups start collapsed. | v1 with categories defined |
| **By Outcome** | Items grouped by business outcome they affect. | v1 with outcomes defined |
| **Table** | Flat sortable table with columns: Name, Function, Status, Priority. Click column headers to sort. | Always available |
| **Metrics** | Power 10 Metrics gauges, GTM Tools health, and Process Health donut charts. | v1 with metrics data |
| **Layers** | Items grouped by Foundation / Motions / Maturity / Platform Health. Warning layers auto-expand. | Default for v2 diagnostics |
| **Lifecycle** | Horizontal pipeline with 6 stages (Quote → Price → Contract → Billing → Revenue → Integrate). Click a stage card to expand details. | CPQ diagnostics only |

The active view syncs to the URL via `?view=` query parameter — you can bookmark or share a specific view.

### Edit Mode

Click the **Edit** toggle in the navigation bar to enter edit mode. (Not available in demo mode.)

**Changing statuses:** Click the status indicator on any card to cycle through: Healthy → Careful → Warning → Unable → Healthy. A dashed border appears around clickable status controls.

**Flagging priorities:** A "Set Priority" button appears on each item. Click to flag — the button turns green with "Priority" label. Flagged items are included when building a SOW and appear on the Engagement page.

**Adding notes:** Click the speech bubble icon on a card to open the notes drawer. Type your note and press Enter to save. Use Shift+Enter for line breaks. Notes save immediately (no debounce). Click the trash icon on a note to delete it.

**Item detail modal:** In edit mode, clicking any card opens a detail modal with: status cycle button, priority toggle, function tag, outcome tag, linked service info, and a notes section.

### Auto-Save

Changes auto-save with an 800ms debounce. A "Saving..." indicator appears in the nav bar while the request is in-flight. After saving, if linked SOWs exist, a toast notification slides up from the bottom-right corner showing links to each SOW that may need updating.

### Import from Markdown

Click the **Import** button in the nav bar to paste or upload diagnostic data from a markdown document.

1. Paste markdown into the text area, or click **Upload .md File** to upload a file
2. Click **Show Template** to see the expected format for your diagnostic type
3. Click **Parse & Preview** — a preview table appears showing parsed processes, tools, and metrics
4. Click **Import** to confirm — this replaces the current diagnostic data

The parser looks for `## Processes`, `## Tools`, and `## Power10 Metrics` section headers. It auto-corrects invalid statuses and shows warnings for any parsing issues.

### Build SOW

Click **Build SOW** in the nav bar. This:

1. Takes all items flagged as engagement priorities
2. Groups them by function
3. Looks up matching services from the catalog
4. Generates an executive summary
5. Creates a Statement of Work with pre-populated scope sections, hours, and rates
6. Navigates you to the new SOW

---

## 7. Building a SOW

**URL:** `/c/{slug}/sow/{id}`

The SOW is a live, editable proposal document. Everything you see can be edited inline.

### SOW Header

- **Title** — Click to edit
- **Status** — Click any pill to change: Draft, Review, Sent, Accepted, Declined. Status saves immediately.
- **Metadata** — Created date, SOW type, created by, total hours, total investment
- **Actions** — Export PDF, Push to Teamwork (when status is Review/Sent/Accepted and no project exists yet), View in Teamwork (after a project is pushed)

### Executive Summary

Click the summary text to edit. The text area auto-expands as you type. Changes are tracked as "dirty" and saved in bulk when you click Recalculate & Save.

### Scope Sections

Each section has a purple accent bar on the left. Every field is editable:

| Field | How to Edit |
|-------|-------------|
| **Title** | Click the title text |
| **Description** | Click the description — auto-expanding textarea |
| **Hours** | Click the hours value — number input |
| **Rate** | Click the rate value — currency input |
| **Start / End dates** | Click to open date pickers |
| **Deliverables** | Click a deliverable to edit. Press Enter to add. Click X to remove. |
| **Subtotal** | Auto-calculated (hours x rate) |

**Reorder sections** using the arrow buttons. **Delete a section** with the trash icon (shows a confirmation overlay).

**Diagnostic item chips** appear at the bottom of each section, showing which diagnostic findings drove this scope. Each chip has a colored status dot and the process name. Click a chip to jump to that item in the diagnostic — it scrolls into view with a purple highlight for 3 seconds.

### Recalculate Bar

When you edit any field, a sticky bar slides up from the bottom showing:

- Number of fields changed (purple badge)
- Projected new total based on your edits
- **Recalculate & Save** — batch-saves all changes and recalculates totals
- **Discard** — reverts all unsaved changes

The bar disappears once you save or discard.

### Investment Table

A summary table at the bottom shows all scope sections with hours, rate, and subtotal columns. Every cell is editable — changes trigger the recalculate bar. The footer row shows totals.

### PDF Export

Click **Export PDF** in the header. This generates and downloads a formatted PDF, increments the version number, and adds an entry to the version history.

### Version History

View past exported versions with timestamps, version numbers, and who exported them. Each version has a "Download PDF" link.

### Push to Teamwork

Click **Push to Teamwork** to create a project in Teamwork:

1. A preview panel opens showing the proposed project structure — milestones, task lists, and tasks
2. Review the breakdown and click **Create in Teamwork**
3. On success, a confirmation appears with a link to the Teamwork project
4. The header button changes to **View in Teamwork**

### Diagnostic ↔ SOW Sync

When the linked diagnostic changes after the SOW was created, a **yellow sync banner** appears:

- Shows counts of status changes, new priority items, and removed items
- Expand for per-item details with Dismiss buttons
- **Update SOW** re-syncs the diagnostic snapshot
- **Dismiss All** hides individual change notifications

From the diagnostic side, after each save a **toast notification** appears with links to linked SOWs that may need updating.

---

## 8. Engagement Overview

**URL:** `/c/{slug}/try-leanscale/engagement`

Available for GTM diagnostics. Shows the recommended engagement plan based on diagnostic results.

### Stat Cards

Four summary cards at the top:

| Card | Shows |
|------|-------|
| Strategic Projects | Count of projects identified |
| Managed Services | Count of ongoing services |
| Project Hours | Estimated hour range (low-high) |
| Managed Svc Hours/Mo | Monthly hours for managed services |

### Strategic Projects Table

Lists all diagnostic items flagged as priorities. Each row shows: include/exclude checkbox, project name, function tag, status badge, priority badge, hours range, outcome, and a playbook link.

### Managed Services Grid

Cards for each ongoing service with: checkbox, icon, name, status badge, description, and monthly hours estimate.

### Timeline Calculator

Three selectable tier cards:

| Tier | Hours/Mo | Price/Mo |
|------|----------|----------|
| Starter | 50 | $15,000 |
| Growth | 100 | $25,000 |
| Scale | 225 | $50,000 |

Selecting a tier calculates the engagement duration:
```
Available hours = Tier hours - Managed service hours
Duration = Project hours / Available hours
```

### Project Timeline (Gantt)

A 26-week Gantt chart starting from the next Monday. Strategic projects are shown as colored bars by function. Managed services appear as full-width gradient stripes. A color legend identifies each function.

### CTA Card

A purple gradient card at the bottom with links to: View Statement of Work, Check Cohort Availability, and Start Engagement.

---

## 9. Troubleshooting

### CRM Connection Issues

**HubSpot OAuth fails or redirects to an error page:**
- Verify `HUBSPOT_CLIENT_ID`, `HUBSPOT_CLIENT_SECRET`, and `HUBSPOT_REDIRECT_URI` are set correctly in Netlify
- Confirm the redirect URI in the HubSpot Developer Portal matches exactly: `https://clients.leanscale.team/api/hubspot/callback`
- The HubSpot user must have admin access to the portal

**Salesforce OAuth fails:**
- Verify `SALESFORCE_CLIENT_ID`, `SALESFORCE_CLIENT_SECRET`, and `SALESFORCE_REDIRECT_URI` in Netlify
- Confirm the Connected App's callback URL matches: `https://clients.leanscale.team/api/salesforce/callback`
- Check that the Connected App has the correct OAuth scopes (see [Deployment Guide](salesforce-diagnostic-deployment-guide.md))
- For sandboxes, make sure the **Sandbox** checkbox is toggled before connecting
- IP restrictions on the Salesforce org may block OAuth — use the metadata upload fallback

**Salesforce metadata upload fails:**
- Ensure the ZIP file was created using `sf project retrieve start` (not a manual ZIP)
- The ZIP must contain the standard Salesforce metadata package structure
- Check that the retrieved metadata includes the types listed in the CLI command above

### Diagnostic Issues

**Diagnostic results look incomplete:**
- Ensure CRM data was downloaded before running (check for the green "Connected" banner)
- For Salesforce, the Platform Health layer (P1-P5) requires CRM connection — it won't score from manual intake alone
- Try re-running the diagnostic from the intake form Review step

**Pre-filled answers seem wrong (Salesforce):**
- Pre-fills are based on metadata patterns (field names, flow labels, connected apps). Unusual naming conventions may cause mismatches.
- Override any incorrect pre-fill by clicking the correct answer — this hides the "Auto-detected" badge

**Import from markdown shows warnings:**
- Check that your markdown uses the template format (click "Show Template" in the importer)
- Invalid statuses are auto-corrected to "unable" — review the preview before confirming

### SOW Issues

**Recalculate bar won't go away:**
- You have unsaved changes. Click **Recalculate & Save** to save, or **Discard** to revert.

**Sync banner keeps appearing:**
- The linked diagnostic has changed since the SOW was created. Click **Update SOW** to acknowledge the changes, or **Dismiss All** to hide individual items.

**PDF export fails:**
- Check that the SOW has at least one scope section with data
- Try refreshing the page and exporting again

### General

**Customer can't access their portal:**
- Verify the slug is correct in the URL
- Confirm the customer's password in the admin panel
- Check that the customer record exists and is not marked as `churned`

**Changes aren't saving:**
- Ensure you're not in demo mode (demo accounts skip persistence)
- Check the browser console for API errors
- Verify the Supabase connection is working (admin panel should load)