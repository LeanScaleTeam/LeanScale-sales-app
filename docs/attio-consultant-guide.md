# Attio Diagnostic — Consultant Guide

A practical guide for running the GTM diagnostic on Attio customers. Use it
during intake calls, while reviewing the customer's workspace, and when
filling in the supplemental intake questions that the API can't answer.

---

## TL;DR: What's different about Attio?

The diagnostic engine reads HubSpot/Salesforce metadata almost entirely from
APIs. **Attio is different** — its public REST API exposes the data model,
records, lists, members, tasks, and webhooks, but **Workflows, Sequences,
Forms, and Marketing emails are not yet API-exposed**.

To compensate, the Attio diagnostic uses a five-signal automation pillar:

1. **Webhooks** — count, target platforms, event types, filter usage, health
2. **Actor share** — % of recent record/task writes by API tokens vs humans
3. **AI Attributes** — count of attributes with AI Autofill configured
4. **Token scopes** — what permissions the customer's apps were granted
5. **Intake supplement** — 5 questions the consultant fills with the customer

Your job as the consultant is to (a) verify the API-derived signals make sense
during the call and (b) answer the 5 supplemental questions accurately.

---

## Part 1 — What to look at in Attio during discovery

Walk through these screens with the customer screen-sharing. Each section
ties directly to a diagnostic pillar.

### A. Data Model (Foundation F1)

**Where to look:** Settings → Data → Objects

**What you're checking:**
- How many standard objects in use? (People, Companies, Deals)
- Any custom objects? What do they represent? (Common: Accounts vs Companies,
  Subscriptions, Opportunities, Renewals, Projects)
- For each object, scroll through Attributes — note count of custom fields.
- Look for **AI Attributes** (purple AI icon next to attribute name). These
  are auto-populated by Claude/GPT — strong AI maturity signal.

**Red flags:**
- Default Attio data model untouched (no custom attributes on deals)
- Custom objects defined but unused
- Heavy duplication between People and Companies attributes

**Green flags:**
- Clear separation of static (CRM) vs dynamic (research) data on AI attributes
- Custom objects model the customer's *actual* business (e.g., subscriptions
  for SaaS, projects for services)

### B. Pipelines & Stages (Foundation F2)

**Where to look:**
- Settings → Objects → Deals → "Stage" attribute (or whatever they called it)
- AND: Lists view → check for stage-bearing lists (Attio's main pipeline pattern)

Attio models pipelines two ways:

1. A **status attribute on the Deals object** (similar to HubSpot dealstage)
2. **Lists with a status column** (Attio's preferred pattern — supports
   multiple parallel pipelines: "Outbound", "Inbound", "Renewals", "Partner")

**What you're checking:**
- Stage count per pipeline (5-7 is healthy; <4 is shallow, >10 is bloated)
- Closed-won + closed-lost terminal stages exist
- Are stage names *meaningful actions* ("Demo Booked") or just labels
  ("Stage 2")?
- Any "Stalled" or "On Hold" stages?
- Multiple pipelines for distinct GTM motions?

### C. Lists (Maturity M2 — segmentation)

**Where to look:** Left sidebar → Lists

**What you're checking:**
- How many lists total? Are they organized in folders?
- Spot-check a few — are they static (manual adds) or based on filters?
- Is anyone actively *using* lists (recent updates, ownership clear)?

This is **Attio's segmentation superpower** — it's structurally better than
HubSpot's static/dynamic split. Strong customers use lists as the operational
spine of their GTM motion.

### D. Workflows & Automations (Foundation F4 — automation maturity)

> ⚠️ **The API doesn't read workflows directly.** This is where the consultant
> matters most. The 5 intake questions in Section B feed the automation pillar.

**Where to look:** Settings → Workflows

**What you're checking — visual scan, then ask:**
1. **Count** — how many active workflows are listed? (Active toggle on/off?)
2. **Triggers in use** — Record created, List entry status changed,
   Scheduled, Webhook-in. Variety = maturity.
3. **Blocks in use** — click into 2-3 workflows and look at the blocks:
   - **Send HTTP Request** → integration depth
   - **Slack** → team communication automation
   - **Send email** → outbound nurture in-CRM
   - **AI blocks** (Research / Classify / Summarize / Prompt) → AI maturity
   - **Update attribute / Create record** → basic CRM hygiene
   - **Branch / filter** → workflow sophistication
4. **Stale workflows** — anything not run in 60+ days that should have? Anything
   paused with `last error` shown?

**Translate to intake questions:**

| What you see | Intake answer |
|---|---|
| 0 workflows | `A_attio_workflow_count: 0` |
| 1-3 simple workflows | `A_attio_workflow_count: 1-3` |
| 4-10 with variety | `A_attio_workflow_count: 4-10` |
| 10+ used heavily | `A_attio_workflow_count: 10+` |
| Block types observed | Check each in `A_attio_workflow_blocks` |

### E. Sequences (Maturity M2 — outbound)

**Where to look:** Sequences tab in left sidebar (if enabled)

**What you're checking:**
- Are any sequences live?
- Approx. count and approx. enrolled contacts?
- Multi-step (cold + follow-ups) or just one-touch?

**Translate to intake:** `A_attio_sequences` — 4 options based on observed
maturity. "Tried, abandoned" is a real and common signal — capture it
honestly.

### F. Webhooks (read by API, but worth visually verifying)

**Where to look:** Settings → Developers → Webhooks

**What you're checking:**
- Confirm the API count matches what you see
- Note target URLs — are they pointing to Slack, Zapier, Make, n8n, custom?
- Any webhooks in `degraded` or `paused` state?

This is one of the strongest objective signals. The automation grader
heavily weights webhook breadth + filter sophistication.

### G. Workspace Members (Foundation F5)

**Where to look:** Settings → Workspace → Members

**What you're checking:**
- Total member count vs how many are *actual sales/CS reps*
- Are roles assigned cleanly (Admin / Member / Limited)?
- Anyone with full Admin who shouldn't be?
- Any API tokens / integration users visible?

**Note:** Attio has no native Teams concept like HubSpot. The diagnostic
won't be able to grade team structure from the API — the existing C/T section
intake questions cover this.

### H. AI Attributes & Built-in Enrichment (Foundation F6)

**Where to look:**
- Per-object attribute list, filter to "AI" type
- Companies → look for `Domain`, `Description`, `Industry`, `Employees` fields
  that are auto-enriched (Attio enriches public-domain data for free)

**What you're checking:**
- How many AI attributes? What do they enrich? (Common: company description,
  competitor list, news summary, headcount, ICP fit score)
- Are AI prompts thoughtful or boilerplate?
- Any third-party enrichment connected (Clay, Clearbit, Apollo via Zapier)?

### I. Tasks & Notes (Maturity — activity)

**Where to look:** Click a few high-value Companies/Deals; scan the activity
feed.

**What you're checking:**
- Are tasks actually created and completed, or is the workspace a graveyard?
- Are notes consistent in format (templated) or freeform chaos?
- Who creates most activity — humans, or `system` / API tokens?

The diagnostic samples 200 records per object to compute "automation write
share." If it comes back low (<10%) but the customer claims heavy automation,
ask follow-up questions — they may be running automation *outside* Attio
(reverse ETL into Snowflake instead of back into Attio).

---

## Part 2 — Filling out the 5 supplemental intake questions

These appear in **Section B** of the intake form when CRM = Attio.

### Q1. `A_attio_workflow_count` — How many active Attio Workflows?

Pull this directly from Settings → Workflows.
- **0** — They built nothing yet
- **1-3** — Hobby / experiment level
- **4-10** — Real operational use
- **10+** — Mature automation practice

### Q2. `A_attio_workflow_blocks` — Which blocks are in use? (multi-select)

Open 3-5 representative workflows and check off every block type you see.
Don't just check things based on what they *could* use — only what you see.

Block hierarchy (rough sophistication ladder):
1. Update attribute, Create task — *table stakes*
2. Slack, Send email — *team communication*
3. Send HTTP Request — *integration depth*
4. AI (Research/Classify/Summarize) — *AI-native maturity*
5. Multi-block chains with branches/filters — *workflow engineering*

### Q3. `A_attio_sequences` — Outbound sequences

If the Sequences tab doesn't exist or is empty: "No / not yet."
If you see 1-2: "Yes, one or two."
If you see 3+ active: "Yes, several active."
If you see paused/abandoned: "Tried, abandoned."

### Q4. `A_attio_external_automation` — External tools pushing in (multi-select)

Cross-reference with the webhook list — if you see Zapier in webhooks, check
that box. Also ask: "Are you running any Zapier/Make/n8n flows that *push*
data into Attio?" Custom Python/Node scripts hitting the API count as
"Custom code / webhook."

### Q5. `A_attio_automation_owner` — Who maintains it

This is a governance question. Ask directly:
- "Is there one person responsible for keeping workflows working?"
- If yes → **Dedicated RevOps person**
- If shared → **Shared across team**
- If "we built it once and don't touch it" → **No clear owner**

The last answer correlates strongly with workflow decay and is worth a
recommendation in the engagement plan.

---

## Part 3 — Common patterns by customer profile

### Pattern A: "Attio because we left HubSpot/Salesforce"

These customers:
- Have ambition but haven't rebuilt their workflow stack
- Often have webhooks → Zapier as a Band-Aid bridge to old tools
- Score low on automation, decent on data model

**Engagement angle:** Help them rebuild lost automation in Attio Workflows
+ AI Attributes (often 30-50% faster than the HubSpot version was).

### Pattern B: "Attio from day one (PLG / AI-first startup)"

These customers:
- Use AI Attributes heavily
- Few but sophisticated workflows
- Sequences often replace traditional outbound tools

**Engagement angle:** Focus on pipeline design + reporting maturity, since
the foundation is usually clean.

### Pattern C: "Attio for one team only (e.g., partnerships)"

These customers:
- Run Attio alongside SF/HS
- Data model is narrow but deep
- Limited automation because integration with the primary CRM is the hard part

**Engagement angle:** Cross-CRM sync hygiene + a clear handoff model.

---

## Part 4 — What the diagnostic *can't* see (and how to compensate)

| Blind spot | How to compensate |
|---|---|
| Workflow inventory | 5 Section B questions (covered above) |
| Sequences usage | Question Q3; visually scan during call |
| Forms | Ask during intake: "How do leads enter Attio?" |
| Marketing emails | Out of scope for Attio diagnostic — flag if relevant |
| Calls / meetings | Note manually; Attio doesn't surface these as first-class data |
| Teams structure | Section C team questions still apply |
| Connected OAuth apps | Ask: "What other tools authenticate into Attio?" |

---

## Part 5 — Talking points for the customer

When the customer asks "why is automation only graded at X%?"

> "Attio's Workflows API isn't public yet, so we score automation maturity
> from four signals we *can* read — webhooks, write provenance, AI
> attribute adoption, and what you've told us during intake. As Attio
> opens up their Workflows API, this score will become more precise.
> Today the grade reflects the breadth and quality of how automation
> *shows up in your data*, which is a strong proxy."

When they ask "should we use Sequences or our existing tool (Outreach/etc.)?"

> Two factors matter: (1) Where does your team already live? Sequences are
> killer if reps live in Attio anyway; pointless if they live in Outreach.
> (2) Volume — Attio Sequences are best for small-to-mid AE-led outbound,
> not 1k+ activity/day SDR motions.

---

## Appendix: Required Attio scopes & setup

When connecting a customer's workspace via OAuth, request these scopes:

- `object_configuration:read`
- `record_permission:read`
- `user_management:read`
- `task:read`
- `note:read`
- `webhook:read`
- `list_configuration:read`
- `list_entry:read`
- `comment:read`

The customer needs Workspace Admin to authorize. The OAuth flow takes ~30
seconds. Metadata download (15-30s) runs in the callback handler. If a
workspace has 10k+ deals, deal aggregates may take longer — flag this to
the customer up front so they don't bounce.
