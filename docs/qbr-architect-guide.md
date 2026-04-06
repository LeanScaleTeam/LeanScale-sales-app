# QBR System — Architect Guide

The QBR system replaces the manual Rufus/Netlify workflow. Every quarterly business review now lives in the app — editable by architects, shareable with customers, and connected to the diagnostic data over time.

---

## The idea in one sentence

The diagnostic is your working document. Each QBR is a frozen snapshot of where things stood at the end of a quarter — with a comparison table showing progress since kickoff.

---

## Workflow at a glance

```
Prospect signs → convert to "active" in admin
                       ↓
          Create Q0 (Kickoff Baseline) QBR
          "Pre-fill from diagnostic" ✓  ← snapshots current Power 10 state
                       ↓
          Quarter 1 begins — you work with the customer
          Update the diagnostic as metrics improve
                       ↓
          End of Q1 → Create Q1 QBR
          "Pre-fill from diagnostic" ✓  ← snapshots new state
          Fill in wins, projects, roadmap
          Hit Publish → share URL with customer
                       ↓
          Repeat each quarter
```

---

## Step-by-step: Creating a QBR

### 1. Make sure the customer is "active"

QBRs only show for `customer_type = active`. Go to `/admin/customers`, edit the customer, set their type. Prospects get redirected to the diagnostic — they don't see QBRs.

### 2. Go to the customer's QBR hub

Navigate to their portal: `https://clients.leanscale.team/c/{slug}/qbr`

Or click the "N QBRs" badge in `/admin/customers` — it goes directly to their hub.

You'll see a timeline of all their quarters. For a brand-new active customer, it's empty with a "Create Q0 Baseline" button.

### 3. Create the QBR

Click **+ New QBR**. Fill in:

| Field | What to enter |
|---|---|
| Quarter | Q0 for kickoff, Q1/Q2/Q3/Q4 for regular quarters |
| Year | Current year |
| Period Start / End | The date range this QBR covers (e.g. Apr 1 – Jun 30) |
| Hours Budgeted | The engagement hours allocated for this quarter |
| Pre-fill from diagnostic | Leave ON — this snapshots the current diagnostic |

Hit **Create QBR**. You'll land in the QBR view in edit mode.

### 4. Fill out the QBR

The page has these sections. All are optional — only sections with content appear in the customer view.

**Executive Summary**
2–4 sentences. What happened, the trajectory, and what it sets up. Think: what would you tell the CEO in 30 seconds.

**Key Wins**
The high moments. Each win has:
- An emoji (pick something relevant — 🏗️ for infra, ⚡ for speed, 📊 for reporting)
- A short title (5–7 words max)
- A description (1–2 sentences — what you built/fixed/shipped)
- An impact statement (quantified if possible — "+$X ARR", "saved 4 hrs/week", "0 sync errors since")

Aim for 3–6 wins. Don't overload it — each should feel meaningful.

**Power 10: Progress Report**
This is auto-populated from the snapshot. If you pre-filled from the diagnostic, the table shows the current state of all 10 metrics, compared against:
- Q0 baseline (always shown if it exists)
- The previous quarter (shown if there's one between Q0 and this one)

You'll see ↑ Improved / ↓ Declined / → Same arrows for each metric. This is the most compelling section for customers — it shows the trajectory clearly.

You don't edit this section directly. To update the Power 10 data, create the QBR with a fresh diagnostic snapshot.

**Projects Completed**
Every deliverable from the quarter. Format: Phase badge + name + hours + 1-line description.

Be thorough here. Even small things (documentation, data cleanup, a 30-min process fix) should be listed — this is what justifies the hours.

**In Progress**
Work that started this quarter and carries into next. Add a % complete estimate so the customer can see momentum.

**Accomplishments**
A free-form markdown block. Use this for:
- Importing a doc you already wrote elsewhere (click "Import .md")
- A detailed breakdown that doesn't fit the structured sections above
- Technical accomplishments that need more nuance than a project item

Supports `# headers`, `**bold**`, `*italic*`, and `- lists`.

**Next Quarter Roadmap**
Your plan for Q+1. Tag each item HIGH / MEDIUM / LOW. Be specific — "Forecasting model go-live" is better than "More CRM work". This is what the customer is excited about heading into the next quarter.

**Hours Summary**
The system shows a progress bar once you set Hours Used and Hours Budgeted. You can fill this in manually, or import directly from Teamwork.

**Importing from Teamwork (recommended):**
In edit mode, click **↓ Import from Teamwork** in the Hours Summary section. You'll need:

| Field | What to enter |
|---|---|
| API Token | Teamwork → Profile → API & Webhooks → Personal API token |
| Teamwork Site | Your site URL, e.g. `leanscale3.teamwork.com` |
| Project IDs | Comma-separated IDs for all projects to include (find them in the Teamwork URL: `/projects/{id}`) |
| From / To | The quarter date range — auto-fills from the QBR period if you set it |

Hit **Fetch Hours** to pull from Teamwork. You'll see a preview:
- **Total hours** logged across all projects
- **By month** — horizontal bars showing how work was distributed through the quarter
- **By project** — breakdown of hours per Teamwork project

Hit **Apply to QBR** to push the data in. This sets Hours Used and populates the detailed breakdown charts visible to the customer. Save as usual to persist.

If you're over budget, the progress bar turns red — worth discussing in the QBR meeting.

**Architect Notes** *(admin-only, never shown to customer)*
Internal context, flags, things to watch. Write anything here you'd want a future architect to know — scope issues, client dynamics, technical decisions that aren't obvious from the deliverables. This is fully hidden from the customer view.

### 5. Save

Hit **Save** in the top bar (only visible in edit mode). The QBR is saved to the database. You can leave and come back — it persists.

### 6. Publish

When the QBR is ready to share with the customer, hit **Publish**. This flips the status from `draft` to `published`. Customers can only see published QBRs.

Hit **Share ↗** to copy the URL to your clipboard. Send it to the customer.

To pull a QBR back (if you need to make changes before or after the customer sees it), hit **Unpublish**.

---

## What the customer sees vs what you see

| Section | Customer | Architect |
|---|---|---|
| Executive Summary | ✓ | ✓ + editable |
| Key Wins | ✓ | ✓ + editable |
| Power 10 Table | ✓ | ✓ |
| Projects Completed | ✓ | ✓ + editable |
| In Progress | ✓ | ✓ + editable |
| Accomplishments | ✓ | ✓ + editable |
| Next Quarter Roadmap | ✓ | ✓ + editable |
| Hours Summary (bar + month/project breakdown) | ✓ | ✓ + editable + Teamwork import |
| Architect Notes | ✗ hidden | ✓ + editable |
| Edit / Publish / Share controls | ✗ hidden | ✓ |

---

## The diagnostic relationship

The diagnostic and QBRs are separate but connected:

- **The diagnostic** is always live. Architects update metric statuses as the customer improves throughout the engagement.
- **Each QBR** snapshots the diagnostic at the moment of creation — it's frozen from that point forward.
- **The comparison table** in each QBR automatically shows movement from the Q0 baseline (and the previous quarter if one exists).

**Important:** Updating the diagnostic after a QBR is created does NOT update that QBR's Power 10 table. The snapshot is intentionally frozen — it's a historical record of where things stood at the end of that quarter. If you need to correct a QBR's Power 10 data after the fact, reach out to the team.

The trend chart on the hub page (`/c/{slug}/qbr`) shows the Power 10 Reportable metric across all quarters — this is the most visible "north star" for the engagement.

---

## URLs

| Route | What it is |
|---|---|
| `/c/{slug}/qbr` | QBR Hub — all quarters, trend chart |
| `/c/{slug}/qbr/Q0-2025` | Individual QBR view |
| `/c/{slug}/qbr/Q1-2025` | Individual QBR view |
| `/qbr/preview` | Full sample QBR with fake data (dev only) |

The `{slug}` is the customer's slug from the admin panel (e.g. `acme`, `formance`, `eqs`).

---

## Common questions

**Q: Can I reorder wins or roadmap items?**
Not yet — they appear in the order you added them. Add them in the order you want them to appear.

**Q: The customer asked to see a draft. Can I share it without publishing?**
Not directly — the URL is public once you share it, and non-admins only see published QBRs. If you need to share a draft, you can publish it, share the link, then unpublish to keep editing. The customer would see a 404 if they visit it while it's unpublished.

**Q: Can I create multiple QBRs for the same quarter?**
No — the database enforces a unique constraint on `(customer_id, quarter)`. Each quarter label like `Q1-2025` can only appear once per customer.

**Q: What if a customer has multiple engagements?**
The QBR system is per-customer (by their `customer_id`). If you're running two separate engagements for the same entity, they'd need separate customer records.

**Q: Where do I track hours logged?**
You can either enter Hours Used manually, or import directly from Teamwork using the **↓ Import from Teamwork** button in the Hours Summary section (admin edit mode). The Teamwork import also pulls a month-by-month and project-by-project breakdown that appears in the customer view.

**Q: Do I need to re-enter the Teamwork credentials every time?**
Yes — API tokens are not stored. You enter them per-session in the import modal. Each import is a fresh pull from Teamwork.

**Q: What if my Teamwork project IDs span multiple workspaces?**
The import only hits one site URL per request. If your projects live across multiple sites, run the import twice and manually adjust the Hours Used total.

**Q: The Teamwork import showed the wrong hours.**
Check that your project IDs are correct (they appear in the Teamwork URL: `/projects/{id}`) and that the date range covers the full quarter. The import uses `time_entries` — it only counts entries logged against those specific projects in that window.
