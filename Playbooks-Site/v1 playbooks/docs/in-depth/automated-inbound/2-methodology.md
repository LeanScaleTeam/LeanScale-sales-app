---
displayed_sidebar: inDepthSidebar
title: "Automated Inbound Methodology"
sidebar_position: 2
---

# Automated Inbound Methodology

Scoping & Discovery - Target Profile - Stakeholders - Approach Selection

## 2. Scoping & Discovery

### Target Motion & Ideal Profile

Automated Inbound is centered on B2B companies with an inbound motion—whether that's trial signups, demo requests, content downloads, or website engagement. Works best when combined with Market Map for tier-based prioritization.

**Ideal Profile:**
- B2B SaaS company ($5M-$100M ARR)
- Has inbound lead flow (demo requests, trial signups, contact forms)
- At least 50+ inbound leads/month (to justify automation investment)
- Using Clay or open to Clay for enrichment
- CRM is Salesforce or HubSpot

**Growth Signals That Indicate Readiness:**
- Inbound volume exceeding what reps can manually process
- Adding SDRs/BDRs and need systematic onboarding
- Off-hours leads consistently getting delayed response
- Marketing launching campaigns that will spike volume
- Moving upmarket where speed-to-lead matters more

---
displayed_sidebar: inDepthSidebar

### Stakeholders & Roles

| Role | Involvement Level | Key Responsibilities |
|------|-------------------|---------------------|
| **VP Sales / CRO** | Sponsor | Approves project, defines success metrics, owns outcome |
| **Head of RevOps** | Decision Maker | Signs off on routing logic, approves tool decisions, resource allocation |
| **RevOps Manager** | Technical Owner | Provides CRM access, implements routing rules, validates webhook flows, owns ongoing maintenance |
| **SDR/BDR Leadership** | Input Provider | Defines routing preferences, validates follow-up sequences, tests automation flows |
| **Marketing Ops** | Collaborator | Aligns on MQL definition, validates form configurations, owns upstream funnel |
| **IT/Security** | Gatekeeper | Approves API connections, reviews data flow, ensures compliance |

---
displayed_sidebar: inDepthSidebar

**RACI for Key Decisions:**

| Decision | R (Responsible) | A (Accountable) | C (Consulted) | I (Informed) |
|----------|-----------------|-----------------|---------------|--------------|
| Routing logic design | RevOps Manager | Head of RevOps | SDR Leadership | VP Sales |
| MQL criteria | Marketing Ops | Head of RevOps | SDR Leadership | VP Sales |
| Tool selection | RevOps Manager | Head of RevOps | IT | VP Sales |
| Sequence messaging | SDR Leadership | VP Sales | Marketing | RevOps |
| Go-live approval | RevOps Manager | Head of RevOps | SDR Leadership | VP Sales |

---
displayed_sidebar: inDepthSidebar

### Tools & Systems

#### Primary Tools

**Clay** — Primary enrichment platform used for lead enrichment, account matching, tier scoring, webhook triggers for real-time processing.

| Feature | What It Does | Why It Matters |
|---------|--------------|----------------|
| Waterfall Enrichment | Queries 75+ data providers in sequence until match found | Achieves >90% match rates vs 30-40% with single-source tools |
| Webhook Receiver Tables | Accepts real-time triggers from CRM on form fill | Enables instant enrichment (sub-minute processing) |
| CRM Integration | Pushes enriched data back to Salesforce/HubSpot | Keeps CRM as source of truth while adding context |
| Account Matching | Matches contacts to accounts using fuzzy logic | Prevents duplicate accounts, maintains data quality |

**CRM (Salesforce or HubSpot)** — Where leads land and routing rules execute. Source of webhook triggers.

---
displayed_sidebar: inDepthSidebar

**Integration Layer:**

| Option | Cost | Best For |
|--------|------|----------|
| HubSpot Operations Hub | $800+/month | Native webhook triggers, simplest if already on HubSpot |
| n8n (self-hosted or cloud) | $0-50/month | Flexible, cost-effective webhook pass-through |
| Zapier | $20-100+/month | Quick setup, but can get expensive at volume |

**Sequencing Tools:**

| Tool | Strengths for Automated Inbound |
|------|--------------------------------|
| HubSpot sequences | Native CRM integration, good for HubSpot shops |
| Outreach | Enterprise-grade, advanced analytics, A/B testing |
| Salesloft | Strong cadence management, conversation intelligence |
| Amplemarket | AI-driven sequencing, emerging option |

**Routing Tools (optional but recommended for complex routing):**

| Tool | Speed-to-Lead Feature | Key Capability |
|------|----------------------|----------------|
| Chili Piper | 2-click booking, real-time enrichment | Operates outside Salesforce so routing never competes with other SF operations |
| LeanData | 95% account matching accuracy | Deep Salesforce integration, complex routing rules |
| Calendly | Basic routing forms | Good for simple use cases, not enterprise-grade |

---
displayed_sidebar: inDepthSidebar

### Scoping Factors

#### 1. Post-Market Map vs Standalone

- **Post-Market Map:** Faster implementation (duplicate Clay table, configure webhook, much simpler)
- **Standalone:** Longer implementation (need to build ICP/tiering first)

#### 2. Inbound Volume

| Volume | Recommendation |
|--------|----------------|
| Under 50 leads/month | May not justify automation investment |
| 50-200 leads/month | Good candidate, clear ROI path |
| 200+ leads/month | Strong ROI case, automation essential |

#### 3. Lead Type & Intent Level

| Lead Type | Intent Level | Required Response |
|-----------|--------------|-------------------|
| Demo request | High | Immediate routing to human, under 5 min target |
| Trial signup | High | Instant follow-up, human or automated |
| "Talk to sales" | High | Priority routing, real-time notification |
| Pricing page view | Medium | Automated nurture, human for T1 accounts |
| Content download | Low-Medium | Automated sequence, slower cadence |
| Newsletter signup | Low | Long-term nurture, not urgent |

---
displayed_sidebar: inDepthSidebar

#### 4. Scheduling Workflow Considerations

- Do they want leads to book directly via Calendly/Chili Piper?
- If yes: automated thank you + context sharing
- If no: look at availability, speed to lead, routing logic

#### 5. Timing & Coverage

| Scenario | Recommended Action |
|----------|-------------------|
| Business hours lead | Route to human, personalized touch |
| Off-hours lead | Automated response within minutes |
| T1 account off-hours | Consider human follow-up despite timing |
| Weekend lead | Automated sequence, human review Monday AM |

#### 6. Human vs Tool vs Hybrid

| Model | Description | Best For |
|-------|-------------|----------|
| Fully automated | No human ever follows up | High volume, lower deal size |
| Human follow-ups | Route to rep, they take action | Enterprise deals, consultative sales |
| Hybrid | Automated first, human escalation for high-value | Most B2B SaaS companies |

---
displayed_sidebar: inDepthSidebar

#### 7. MQL Definition Clarity

- **MQLs well-defined:** Can trigger automation cleanly
- **MQLs fuzzy:** Need to define criteria first
- **No MQL definition:** May need lead lifecycle work first

#### 8. Existing Lead Lifecycle Health

- If lead lifecycle is broken in CRM: fix that first
- Entry criteria must be clear before automation can work
- "Are they MQL?" is the big funnel entry decision

---
displayed_sidebar: inDepthSidebar

### Multiple Approaches

**Approach 1: Post-Market Map (Ideal Scenario)**
- **Criteria:** Market Map already exists with tiering and enrichment
- **Execution:** Duplicate Clay table → configure webhook → add lookup step (check if account exists before enriching) → set up routing → connect to sequences
- **Why faster:** Most accounts already enriched, so the lookup step skips account-level enrichment—you're mainly filling contact-level gaps

**Approach 2: Standalone (No Market Map)**
- **Criteria:** No existing Market Map, need to build enrichment/tiering foundation
- **Execution:** Build basic ICP criteria → create enrichment table → configure webhook → routing → sequences

**Approach 3: Calendly-First (Minimal)**
- **Criteria:** Just want basic "didn't book" follow-up
- **Execution:** Calendly → branching for no-book → automated message

**Approach 4: Hybrid Human/Automated**
- **Criteria:** Want humans for business hours, automation for off-hours
- **Execution:** Build decision tree based on timing + tier → route accordingly

---
displayed_sidebar: inDepthSidebar

### Discovery Questions

#### Inbound Motion

- What are your primary inbound channels? (demo form, trial signup, content downloads, website chat)
- What's your current inbound volume? (leads/month)
- What happens today when a lead comes in? (manual triage, auto-routing, nothing)
- What's your current average response time? (if known)

#### Follow-up Preferences

- Do you want leads to book directly via Calendly/scheduler?
- What should happen if they don't book?
- What's your vision: fully automated, human follow-ups, or hybrid?
- How many touchpoints should non-responders get?

#### Timing & Coverage

- What hours do you have sales coverage?
- What should happen to leads that come in off-hours?
- Are there high-value exceptions that should always route to humans? (e.g., Fortune 500)
- Do you have global coverage or single timezone?

---
displayed_sidebar: inDepthSidebar

#### Tool Stack

- What CRM are you using?
- Do you have HubSpot Operations Hub?
- What sequencing tool do you use? (Outreach, Amplemarket, HubSpot sequences)
- Do you have n8n or Zapier?
- Are you using or open to Chili Piper/LeanData for routing?

#### Existing State

- Do you have Market Map already? (tiering, enrichment data)
- Is your lead lifecycle defined in CRM?
- Are MQLs clearly defined?
- What data do you currently capture on form fill?

#### Approach Decision Matrix

| Question | Answer → Approach |
|----------|-------------------|
| Do you have Market Map? | Yes = Post-Market Map (faster), No = Standalone (longer) |
| What's the primary goal? | "Didn't book" follow-up = Calendly-First, Full automation = Full build |
| Human or automated? | Fully automated = simpler, Hybrid = more complex routing |
| Is lead lifecycle healthy? | Healthy = proceed, Broken = fix first |
| Are MQLs defined? | Defined = proceed, Undefined = define first |
| Inbound volume? | Under 50/month = reconsider ROI, 50+ = proceed |
