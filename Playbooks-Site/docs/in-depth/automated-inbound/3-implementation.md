---
displayed_sidebar: inDepthSidebar
title: "Automated Inbound Implementation"
sidebar_position: 3
---

# Automated Inbound Implementation

Map Channels - Build Clay Enrichment - Configure Routing - Create Sequences - QA & Deploy

## Important Note on Approaches

The 5-part process applies across all approaches. Differences are scope and starting point:

- **Approach 1 (Post-Market Map):** Start at Part 2—Clay table already exists from Market Map, configure webhook. Step 3 (lookup) is fast since most accounts already have data—you're mainly enriching contact-level gaps.
- **Approach 2 (Standalone):** Start at Part 1—need to build basic ICP/tiering before enrichment
- **Approach 3 (Calendly-First):** Minimal scope—only Part 3 (routing) and Part 4 (messaging/sequencing)
- **Approach 4 (Hybrid Human/Automated):** Full 5 parts with more complex routing logic in Part 3

---
displayed_sidebar: inDepthSidebar

## Part 1: Map Channels & Define Triggers

*Part Overview: In this part, we identify all the ways leads enter your system and establish the rules for what qualifies as an MQL. This creates the foundation for knowing WHICH leads to enrich and HOW urgently to respond.*

### Step 1: Identify All Inbound Channels

**Step Overview:** Create a map of all funnels and channels where leads enter your system. Each channel may have different intent levels and require different automation treatment.

**Common Inbound Channels:**
- Demo request form
- "Talk to Sales" / "Contact Us" form
- Trial signup (PLG motion)
- Pricing page with follow-up capture
- Content downloads (white papers, ebooks)
- Newsletter signup
- Webinar registration
- Website chat (Qualified, Drift, Intercom)
- Partner referrals
- LinkedIn lead gen forms

**For Each Channel, Document:**
1. Where does the lead data land first? (HubSpot, Salesforce, other)
2. What fields are captured? (name, email, company, use case, etc.)
3. What is the intent level? (high = demo request, medium = content, low = newsletter)
4. Current follow-up process (manual, automated, nothing)

---
displayed_sidebar: inDepthSidebar

### Step 2: Define MQL Criteria

**Step Overview:** Automated inbound triggers need clear MQL definitions. "Are they MQL?" is the big funnel entry decision.

**Important:** If MQLs not defined, can't do this project effectively. Would need to fix lead lifecycle first.

**MQL Definition Considerations:**
- What firmographic criteria? (company size, industry, geography)
- What behavioral criteria? (page views, content downloads, form fills)
- What combination of triggers = MQL?

**MQL Framework Reference:**

An MQL requires two conditions:
1. **ICP Fit** — firmographic match (company size, industry, geography)
2. **Demonstrated Intent** — behavioral signals (form fills, page views, content engagement)

| Lead Source | ICP Strictness | Intent Threshold |
|-------------|----------------|------------------|
| Inbound (demo request) | Looser acceptable | High implicit intent |
| Inbound (content download) | Moderate | Medium—need more signals |
| Outbound | Strict ICP required | Any response = high intent |

---
displayed_sidebar: inDepthSidebar

### Step 3: Define Intent Tiers

**Step Overview:** Not all inbound leads are equal. High-intent signals need immediate action; low-intent can wait.

| Intent Level | Examples | Response Time | Response Type |
|--------------|----------|---------------|---------------|
| High | Trial signup, "Talk to Sales", Demo request | Immediate (under 5 min) | Human or fast automated |
| Medium | Pricing page + engaged, Multiple content downloads | Same business day | Automated sequence |
| Low | Single white paper, Newsletter signup | 24-48 hours | Nurture sequence |

**Why These Timings Matter:**
- 78% of customers buy from the business that responds first
- Responding in first minute boosts conversions by 391%
- Qualification odds drop 80% after first five minutes

---
displayed_sidebar: inDepthSidebar

## Part 2: Build Clay Enrichment Table

*Part Overview: In this part, we set up the Clay infrastructure that receives inbound leads in real-time, checks what data already exists, enriches only what's missing, and pushes enriched data back to CRM.*

### Step 1: Set Up Inbound Lead Table in Clay

**Table Structure:**
- Lead/Contact fields (name, email, company, domain)
- Enrichment output fields (firmographics, technographics)
- Tier assignment field (based on enrichment)
- Routing decision field (human vs automated)
- Timestamp fields (for speed-to-lead tracking)

**Post-Market Map Shortcut:** If Market Map exists, duplicate the account table structure. The tiering logic is already built.

---
displayed_sidebar: inDepthSidebar

### Step 2: Configure Webhook Receiver

**Step Overview:** Set up the trigger that sends new leads from CRM to Clay in real-time.

**Technical Note:** Clay webhooks are limited to 50,000 submissions per table. This limit persists even after deleting rows. When limit reached, create a new webhook.

**HubSpot Integration Options:**

| Option | Requirements | Pros | Cons |
|--------|--------------|------|------|
| HubSpot Operations Hub | $800+/month | Native webhook capability, seamless | Cost |
| Middleware (n8n/Zapier) | n8n or Zapier subscription | Works without Ops Hub | Additional tool in stack |

**Middleware Flow:** HubSpot workflow → n8n/Zapier webhook → Clay table

---
displayed_sidebar: inDepthSidebar

### Step 3: Look Up Existing Data

**Step Overview:** Before running enrichment, check if the account already exists in your CRM with Market Map data. This saves credits and speeds up processing.

**The Core Logic:**

When a lead comes in, the first question is: "Do we already know this account?"

| Scenario | What You Already Have | What to Enrich |
|----------|----------------------|----------------|
| Account exists (Market Map done) | Tier, valuation, ICP score, firmographics | Contact-level data only |
| Account doesn't exist | Nothing | Full account + contact enrichment |

**Why This Matters:**
1. **Credit savings** — A T3 lead doesn't need full enrichment. A lead at an existing T1 account can skip account-level enrichment entirely.
2. **Speed advantage** — If T1 accounts are already enriched, speed-to-lead becomes near instant.
3. **Routing can start immediately** — With tier data already present, routing logic can fire based on what you already know.

---
displayed_sidebar: inDepthSidebar

### Step 4: Configure Enrichment Waterfall

**How Waterfall Enrichment Works:**

Clay checks multiple data providers in sequence. If the first returns no data, it queries the next provider until data is found or all sources exhausted. Properly configured waterfalls achieve 80%+ match rates.

**Enrichment Priority (Account Level):**
1. Company domain → firmographics (size, industry, revenue)
2. Technographic data (tools they use)
3. Tier assignment (T1/T2/T3 based on ICP criteria)
4. Account valuation (if applicable)

**Enrichment Priority (Contact Level):**
1. Email → full name, title, LinkedIn
2. Seniority/role classification
3. Persona tier (if personas defined)

**Data Provider Selection:**

| Use Case | Primary Providers |
|----------|-------------------|
| Standard B2B | Apollo, ZoomInfo, Clearbit/Breeze |
| Nonprofits | Cause IQ |
| Financial Services | iBanknet |
| Healthcare | Definitive Healthcare |

---
displayed_sidebar: inDepthSidebar

### Step 5: Push Enrichment Back to CRM

**Data Flow:**
1. Lead comes into HubSpot
2. n8n/Zapier sends to Clay via webhook → Clay dedicated table
3. Clay enriches the lead
4. Clay sends update back to HubSpot

**CRM Field Requirements:**
- Lead Tier (T1/T2/T3)
- Lead Score / Fit Score
- Enriched firmographic fields
- Routing assignment field

**Speed Targets:**

| Stage | Target |
|-------|--------|
| Enrichment complete | Under 60 seconds |
| Enrichment to routing | Under 30 seconds |
| Total time to first response | Under 5 minutes |

---
displayed_sidebar: inDepthSidebar

## Part 3: Build Routing Logic

*Part Overview: In this part, we build the decision tree that determines what happens after enrichment: which leads go to humans, which go to automation, and how timing affects the path.*

### Step 1: Define Routing Decision Tree

**Core Decision Questions:**
1. Is this lead T1 (high value)?
2. Is it business hours (coverage available)?
3. Did they try to book a meeting already?
4. What's their intent level?

**Routing Decision Tree:**

```
Lead comes in
    │
    ├── Did they book Calendly?
    │   ├── YES → Send automated thank you + context
    │   └── NO → Continue to routing
    │
    ├── Is it T1 account?
    │   ├── YES → Check timing
    │   │   ├── Business hours → Route to human
    │   │   └── Off-hours → Automated response + queue for morning
    │   └── NO (T2/T3) → Automated sequence
    │
    └── Edge case: High-value exception?
        (e.g., Fortune 500 at 1am → might warrant human)
```

---
displayed_sidebar: inDepthSidebar

### Step 2: Configure CRM Routing Rules

**Routing Method Selection:**

| Method | When to Use | Pros | Cons |
|--------|-------------|------|------|
| Round Robin | No defined territories | Simple, fair | May mismatch expertise |
| Territory-Based | Geographic sales org | Local expertise | Slower if rep unavailable |
| Customized Round Robin | Hybrid needs | Best of both | More complex |

**HubSpot Workflow Logic:**
- IF tier = T1 AND business_hours = true → assign to [rep/round robin]
- IF tier = T1 AND business_hours = false → enroll in [automated sequence] + create task for AM
- IF tier = T2/T3 → enroll in [marketing nurture]

**Rerouting Unworked Leads:** Configure reassignment if lead not contacted within threshold (e.g., 30 minutes).

---
displayed_sidebar: inDepthSidebar

### Step 3: Handle Timing Logic

**Timing Decision Matrix:**

| Timing | T1 Lead | T2/T3 Lead |
|--------|---------|------------|
| Business hours | Route to human | Automated sequence |
| Off-hours | Automated response + queue for morning | Automated sequence |
| High-value exception | Build alarm system | Automated sequence |

---
displayed_sidebar: inDepthSidebar

## Part 4: Build Messaging & Sequences

*Part Overview: In this part, we configure the automated follow-up sequences that fire based on routing decisions.*

### Step 1: Define Sequence Structure

**Key Questions:**
- One message or multiple if no reply?
- How many steps in the sequence?
- What methods? (email, LinkedIn, phone)
- What's the cadence? (Day 0, Day 2, Day 5, etc.)

**The Copywriting Boundary (CRITICAL):**

| Implementation Scope | Client Responsibility |
|---------------------|----------------------|
| Structure: how many steps, what methods, what triggers | Actual copy/messaging |
| Framework guidance: "step 1 = value, step 2 = social proof" | Brand voice and tone |
| Template suggestions | Specific CTAs |

---
displayed_sidebar: inDepthSidebar

### Step 2: Configure Sequencing Tool

**Source Decision — Where Should Follow-up Come From?**

| Source | Format | Best For | Deliverability |
|--------|--------|----------|----------------|
| Marketing Platform (HubSpot) | Graphics, branding | Nurture sequences | Lower (~40-47%) |
| Rep Inbox (Outreach, Amplemarket) | Plain text, personal | High-intent follow-up | Better, feels 1:1 |

### Step 3: Build Branching Sequences

**Example: "Didn't Book" Flow**
1. Person comes to website
2. Clicks "talk to sales, request demo"
3. Gets Calendly popup
4. **Doesn't book anything**
5. Follow-up: "saw you were on site, wanted to talk, didn't book meeting"

---
displayed_sidebar: inDepthSidebar

## Part 5: QA & Deployment

### Step 1: Test Full Flow

**Test Checklist:**
- [ ] Submit test form on each inbound channel
- [ ] Verify webhook fires to Clay
- [ ] Verify Clay enrichment completes (check fields populated)
- [ ] Verify enrichment pushed back to CRM
- [ ] Verify routing logic assigns correctly
- [ ] Verify sequence enrolls correctly
- [ ] Test timing logic (business hours vs off-hours)
- [ ] Test high-value exception routing

### Step 2: Edge Case Testing

- Lead with no company domain (personal email)
- Lead from existing customer
- Lead from existing opportunity
- Duplicate lead (same person, second form fill)
- High-value exception (does alarm fire?)

### Step 3: Deploy & Monitor

**Deployment Steps:**
1. Activate webhook trigger
2. Activate routing workflows
3. Activate sequences
4. Monitor first 10-20 leads manually

### Step 4: Refinement Cycle

**Timeline:**
- Week 1: Monitor for errors, fix bugs
- Week 2-4: Gather response data
- Week 4+: Refine sequences based on performance
