# LeanScale Sales App — User Experience Review

**Date:** 2026-02-11
**Branch:** `feature/sales-diagnostic-sow-flow`

---

## 1. Sales Process Alignment

### How the App Maps to a Real Sales Conversation

The app follows a three-phase sales framework:

| Sales Phase | App Section | Alignment |
|-------------|-------------|-----------|
| Discovery / Credibility | Why LeanScale | ✅ Good — content pages establish expertise |
| Assessment / Value Demo | Try LeanScale (Diagnostic) | ✅ Strong — interactive health check creates urgency |
| Proposal / Close | Buy LeanScale + SOW | ⚠️ Partial — gap between diagnostic and SOW |

**The diagnostic is the app's killer feature.** Running a live health assessment during a sales call creates immediate value and positions LeanScale as an expert. The traffic-light status system (🟢🟡🔴⚫) is instantly understandable and creates urgency when a prospect sees clusters of red.

### Flow Gaps

1. **Engagement Overview is disconnected.** After completing a diagnostic, the natural next step is "here's what we recommend." The engagement page exists but reads from static data, not the customer's actual diagnostic results. A sales rep would have to manually explain the connection.

2. **No "Save and Share" for diagnostics.** After running a live diagnostic on a call, there's no one-click way to share results with the prospect. The prospect has to log into the portal to see their results. A PDF export of diagnostic results would be valuable.

3. **SOW builder requires too many manual steps.** Going from diagnostic to SOW requires: click "Build SOW" → manually create sections → manually assign diagnostic items → manually set hours/rates → save. This should be 90% automated.

4. **No pricing calculator integration with SOW.** The "Engagement Calculator" page (`/buy-leanscale/calculator`) computes monthly pricing (50h/$15K, 100h/$25K, 225h/$50K) but this doesn't connect to the SOW system. The calculator and SOW should share data.

---

## 2. Diagnostic UX

### Can a Sales Rep Use This Live on a Call?

**Yes, with caveats.** The current UX is functional but not optimized for live use.

**What works well:**
- **Edit mode** with click-to-cycle status is fast — one click per item
- **Auto-save** means the rep doesn't have to remember to save
- **Color coding** makes health patterns immediately visible
- **Tab navigation** (Processes / By Function / By Outcome) lets the rep pivot the conversation
- **Priority toggle** lets the rep flag items for follow-up in real-time

**What needs improvement:**

1. **Too many items on screen at once.** The GTM diagnostic shows all 63 processes in a single scrollable table. During a call, the rep needs to quickly find the relevant items. **Need:** Search/filter within the table, or a guided wizard that presents items by function one at a time.

2. **No "quick assessment" mode.** A full diagnostic takes 30-45 minutes. Many sales calls are 30 minutes total. **Need:** A "quick scan" mode that shows just the top 15-20 most impactful items, with an option to expand to the full assessment.

3. **Status cycling order is unintuitive.** Clicking cycles: healthy → careful → warning → unable → healthy. If a rep wants to set something to "warning" from "healthy," they have to click three times. **Need:** A dropdown or popover with all four options.

4. **No way to skip items.** If a process isn't relevant to the prospect, the rep can set it to "unable to report" but that looks negative. **Need:** A "not applicable" or "skip" status.

5. **The Power10 metrics tab shows static data.** The metrics (ARR, Bookings, etc.) have `ableToReport` and `statusAgainstPlan` fields but these aren't editable in the current UI. The rep can only edit processes and tools.

6. **No mobile optimization.** The diagnostic table requires horizontal scrolling on tablets. A rep using an iPad during a client meeting would struggle.

---

## 3. Results Editing

### Can results be modified after initial diagnostic?

**Yes.** Results are fully editable at any time:

1. Navigate to the diagnostic page
2. Click "Edit Mode"
3. Click status badges to cycle, click priority to toggle
4. Changes auto-save with 800ms debounce

### Limitations

- **No edit history.** There's no audit trail of who changed what and when. If a rep accidentally changes a status, there's no undo or change log.

- **No permissions.** Anyone with access to the customer portal can enter edit mode and change results. There's no distinction between "sales rep editing" and "prospect viewing."

- **Notes can be added but not bulk-edited.** Notes are per-item and added one at a time via a small drawer. There's no "edit all notes" or "export notes" feature.

- **Re-importing overwrites everything.** The "Import Markdown" feature replaces all existing diagnostic data. There's no merge — if you've manually edited 20 items and then import, those edits are lost.

- **Editing doesn't propagate to existing SOWs.** If a diagnostic result changes after a SOW was created, the SOW retains the old snapshot. The `DiagnosticSyncBanner` alerts about drift but re-syncing only updates the snapshot, not the sections.

---

## 4. SOW Generation

### How Easy Is It to Go from Diagnostic to SOW?

**Current flow: 8-12 minutes of manual work.**

| Step | Action | Time |
|------|--------|------|
| 1 | Click "Build SOW" on diagnostic page | 2 sec |
| 2 | SOW created, redirected to builder | 3 sec |
| 3 | Review diagnostic items in left panel | 1 min |
| 4 | Create sections (blank or from catalog) | 2-3 min |
| 5 | Assign diagnostic items to sections | 2-3 min |
| 6 | Set hours, rates, dates per section | 3-4 min |
| 7 | Save and review on SOW page | 1 min |
| 8 | Export PDF | 30 sec |

### Manual Steps That Should Be Automated

1. **Section creation.** The builder starts empty. It should auto-generate sections based on priority items, grouped by function, with catalog defaults.

2. **Hour/rate population.** Each section starts with null hours and rate. The service catalog has `hours_low`, `hours_high`, and `default_rate` — these should auto-fill.

3. **Executive summary.** The SOW's executive summary field is blank unless the SOW was generated via n8n. The from-diagnostic path creates an empty summary. **Need:** Auto-generate a summary from the diagnostic findings ("Your GTM assessment revealed X warning areas across Y functions...").

4. **Timeline.** Section dates are blank. **Need:** Auto-suggest start/end dates based on section count, dependency order, and available start dates from the availability calendar.

5. **Deliverables.** Sections from the catalog include deliverables (from `key_steps`), but blank sections have no deliverables. The service catalog data should be richer here.

### The "From Catalog" Flow Is Good

Adding a section from the service catalog (`CatalogPicker`) is the smoothest part of the builder:
1. Click "+ From Catalog"
2. Search/browse services
3. Click to add — section is created with title, description, hours (average of low/high), rate, and deliverables pre-filled

This pattern should be the default for all sections, not an optional add-on.

---

## 5. PDF Export

### Current State

The PDF export uses `@react-pdf/renderer` to generate a branded document with:
- Header: SOW title, customer name, date, version number
- Executive summary
- Scope sections with deliverables, hours, rates
- Diagnostic status dots per section
- Investment summary table
- Assumptions and acceptance criteria

### Limitations

1. **No LeanScale logo in the PDF.** The brand guidelines specify a dark purple header with the logo, but the PDF just has text. Image embedding with `@react-pdf/renderer` requires the image to be bundled or fetched at render time.

2. **No table of contents.** For SOWs with 5+ sections, navigation is difficult.

3. **No page numbers.** Multi-page PDFs don't indicate total pages.

4. **Executive summary is often blank.** The from-diagnostic flow doesn't populate it, and there's no UI to edit it in the builder. The only way to get a populated summary is via the n8n AI generation flow.

5. **No customer logo.** The SOW should include the customer's logo for a co-branded feel.

6. **PDFs are not stored.** Each export regenerates the PDF from current data. If you export, then edit the SOW, then try to get the old version — you can't. The version history records that an export happened but doesn't store the actual file.

7. **No preview before export.** The user has to export to PDF to see what it looks like. An in-browser preview (using the same component) would save time.

8. **Formatting issues with long deliverable lists.** `@react-pdf/renderer` doesn't handle page breaks well within complex nested structures. Long sections can get cut off at page boundaries.

---

## 6. Missing Features

### For Sales Reps (Highest Priority)

1. **Diagnostic PDF/summary export.** Sales reps need to send diagnostic results after a call without requiring the prospect to log in. A one-click "Export Diagnostic PDF" would be essential.

2. **Auto-populated SOW from diagnostic.** The single biggest friction point. The SOW builder should auto-generate sections from priority diagnostic items with catalog defaults.

3. **Engagement recommendation engine.** Based on diagnostic results, automatically recommend: which tier (50h/100h/225h), which projects, in what order, with what timeline.

4. **Quick diagnostic mode.** A 15-item "quick scan" for 30-minute calls, expandable to the full 63-item assessment.

5. **Call notes integration.** A place to capture freeform notes during a call that attach to the customer record and feed into SOW generation.

### For Customer Experience

6. **Read-only diagnostic view.** Customers currently see the same edit-capable page as reps. Need a clean read-only view that looks polished and professional.

7. **SOW acceptance workflow.** Customers can't accept/decline a SOW through the portal. The status is updated manually by the rep. Need a customer-facing "Accept" button with e-signature.

8. **Progress tracking.** After SOW acceptance, customers should see project progress (connected to Teamwork milestones).

### For Operations

9. **Admin dashboard.** Overview of all active diagnostics, SOWs by status, pipeline value, conversion metrics.

10. **SFDC integration.** The `docs/SFDC-AUTOMATION-SPEC.md` exists but isn't implemented. Diagnostic results and SOW data should sync to Salesforce.

11. **Template management.** The service catalog serves as a template library, but there's no way to manage SOW templates (e.g., "Clay Standard Engagement" vs "GTM Full Assessment" vs "Quick Win Package").

12. **Multi-diagnostic SOWs.** A SOW can only link to one diagnostic type. A customer might need both GTM and Clay diagnostics feeding into a single SOW.

---

## Summary

The LeanScale Sales App has a solid foundation with a well-designed diagnostic system and a functional SOW builder. The biggest UX gap is the **manual bridge between diagnostic and SOW** — this is where 80% of the improvement opportunity lies. Auto-generating SOW sections from diagnostic results with catalog-populated hours/rates/deliverables would transform the sales workflow from a 15-minute manual process into a 2-minute review.

The secondary gap is **the engagement page** not connecting to customer-specific diagnostic data. This page should dynamically render based on the customer's actual assessment, not static demo data.

The app is well-suited for the internal LeanScale team but needs polish for customer-facing use: read-only views, PDF exports, acceptance workflows, and mobile optimization.
