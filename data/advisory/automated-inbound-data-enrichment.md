# Automated Inbound — Advisory

## 1) Project Overview

### What is the name of this project?

Automated Inbound - Lead Enrichment & Routing with Clay

### What is the purpose of this project?

Enrich inbound leads in real-time using Clay, route them to the appropriate rep or automated sequence, and trigger the right follow-up action based on lead tier and timing. Creates infrastructure for speed-to-lead, automated response sequences, and intelligent routing.

**The core transformation:** Your inbound leads go from sitting in a queue waiting for manual triage to being instantly enriched, scored, routed, and actioned - whether that's a human follow-up, automated sequence, or Calendly booking.

### What Automated Inbound Unlocks

*   Instant lead enrichment on form fill (no manual research)
*   Credit-efficient enrichment — check if account already exists before spending credits (Market Map integration)
*   Tier-based routing (T1 accounts get priority treatment)
*   Automated follow-up sequences for off-hours leads
*   Speed-to-lead optimization (critical for high-intent signals)
*   Intelligent decision trees (human vs automated based on timing/tier)

| Aspect | Before | After |
|--------|--------|-------|
| Lead Management | Leads sit in queue until rep reviews | Instant enrichment + routing on form fill |
| Follow-up Approach | Same follow-up for all leads | Tier-based response (T1 gets white glove) |
| Off-hours Handling | Off-hours leads wait until morning | Automated response within minutes |
| Research | Manual research before outreach | Enrichment data already in CRM |
| Speed-to-lead | Aspirational metric | Measurable, automated speed-to-lead |

**Automated Inbound sits in the Clay Use Case Pyramid:**

Per LeanScale's Clay Use Case Pyramid, Automated Inbound builds on top of Market Map. When Market Map exists, the automated inbound flow can check if a lead is at a T1 account before spending credits on enrichment.

### What business outcomes does this project drive?

**Primary Outcomes:**

| Outcome | Quantified Impact |
|---------|-------------------|
| Faster speed-to-lead | Leads contacted within 5 minutes are 21x more likely to qualify vs 30-minute delay |
| Higher conversion on inbound | Companies using automated routing see 17-23% improvement in inbound conversion rates |
| Reduced manual triage | Sales reps currently spend only 28-30% of their time selling; automation reclaims admin hours |
| Consistent off-hours follow-up | Automated sequences fire regardless of time, capturing the 78% of buyers who go with first responder |
| Better lead routing | Tier-based routing prioritizes high-value leads; intelligent routing improves close rates by 20% |

**Secondary Outcomes:**

*   Foundation for MQL automation workflows
*   Data visibility on inbound lead quality
*   Clay credit efficiency (enrich only what matters)
*   Proof of data for reps (hyperlinked context for faster research)

### Who in the Org can benefit from this project?

| Stakeholder | Why They Care |
|-------------|---------------|
| VP Sales | Pipeline velocity, conversion rates, rep productivity |
| Head of RevOps | Operational efficiency, automation ROI, data quality |
| RevOps Manager | Day-to-day routing, workflow maintenance, system integration |
| SDR/BDR Leadership | Team productivity, lead quality, consistent follow-up |
| Sales Reps | Less admin, faster research, better context when calling |
| Marketing Ops | Lead handoff quality, MQL-to-SQL visibility, campaign attribution |

### Pain Points this Project Solves

| Pain Point | What Automated Inbound Enables | Industry Data |
|-----------|-------------------------------|----------------|
| Leads wait hours/days for follow-up | Instant enrichment + automated or routed response | Average B2B response time is 42-47 hours. 63% of companies never respond at all |
| Off-hours leads fall through cracks | Automated sequences fire regardless of time | Just 1% of B2B companies respond in under 5 minutes |
| Reps spend time on wrong leads | Tier-based routing prioritizes high-value leads | Sales reps spend only 28% of their week actually selling |
| No context when following up | Enrichment data + proof hyperlinks in notification | 87% of marketing databases are underutilized with missing firmographics |
| Inconsistent follow-up process | Systematic decision tree for all scenarios | Companies using multiple lead distribution systems boost conversion by 107% |
| MQL definition not operationalized | Automation triggers based on MQL criteria | Organizations using lead scoring see 77% increase in lead generation ROI |

### The Data Behind the Problem

The speed-to-lead problem is backed by extensive research:

**The 5-Minute Window:**

*   Businesses that respond in 5 minutes or less are **100x more likely** to connect and convert
*   Contacting a lead within 5 minutes makes you **21x more likely** to qualify them vs waiting 30 minutes
*   After 5 minutes, the chance of qualifying a lead **drops by 80%**
*   Responding within 60 seconds increases conversions by **391%**

**The Reality Gap:**

*   Average B2B response time: **42-47 hours**
*   **63% of B2B companies** don't respond to inbound leads at all
*   Only **1% of B2B companies** respond in under 5 minutes
*   Only **4.7% of companies** achieve the optimal 5-minute window

**First Responder Advantage:**

*   **78% of B2B customers** buy from the vendor who responds first
*   **35-50% of sales** go to the first responder
*   Companies responding within 1 hour are **7x more likely** to have meaningful conversations with decision-makers

**The Admin Tax:**

*   Sales reps spend **only 28-30%** of their time actually selling
*   **70% of rep time** goes to non-selling tasks like admin and meeting prep
*   **67% of sales reps** don't expect to meet quota; **84% missed it** last year

### Target Motion: SLG B2B with Inbound Flow

Automated Inbound is centered on B2B companies with an inbound motion - whether that's trial signups, demo requests, content downloads, or website engagement. Works best when combined with Market Map for tier-based prioritization.

**Ideal Profile:**

*   B2B SaaS company ($5M-$100M ARR)
*   Has inbound lead flow (demo requests, trial signups, contact forms)
*   At least 50+ inbound leads/month (to justify automation investment)
*   Using Clay or open to Clay for enrichment
*   CRM is Salesforce or HubSpot

### Common Belief Barriers

| Objection | Reality | Counter-Data |
|-----------|---------|--------------|
| "We just need a Calendly link" | Calendly solves booking, but what about leads who DON'T book? The branching path for "didn't book" is where automated inbound lives. | Only 17% of companies respond instantly. The 83% who don't book need systematic follow-up |
| "Our reps can just follow up" | They can, but timing matters. Lead comes in at 9pm - won't get touched until tomorrow. Lead from a Fortune 500 at 1am - might warrant human follow-up despite timing. | After just 5 minutes, conversion rates drop by 8x. 57% of first call attempts occur after more than a week |
| "We don't have Market Map yet" | You can still do automated inbound standalone, it just takes more hours to build the enrichment/tiering foundation first. | Standalone adds 5-10 hours. Worth it if inbound volume justifies automation (200+ leads/month = strong ROI case) |
| "Automation feels impersonal" | Done right, automation enables more personalization, not less. Enrichment data allows reps to personalize when they do engage. | Companies using enriched data for personalization report 20% increase in sales opportunities |
| "We tried this before and it didn't work" | Often fails due to incomplete setup. Routing without enrichment, or automation without clear MQL definition. | 95% matching accuracy possible with proper fuzzy matching setup. The system matters. |

---

## 2) Tools & Systems

### Primary Tools

**Clay**

Primary enrichment platform - used for lead enrichment, account matching, tier scoring, webhook triggers for real-time processing.

| Feature | What It Does |
|---------|-------------|
| Waterfall Enrichment | Queries 75+ data providers in sequence until match found, achieving >90% match rates |
| Webhook Receiver Tables | Accepts real-time triggers from CRM on form fill for instant enrichment |
| CRM Integration | Pushes enriched data back to Salesforce/HubSpot |
| Account Matching | Matches contacts to accounts using fuzzy logic to prevent duplicates |

**CRM (Salesforce or HubSpot)**

Where leads land and routing rules execute. Source of webhook triggers.

| CRM | Key Capabilities for Automated Inbound |
|-----|----------------------------------------|
| Salesforce | Custom objects, Flow Builder, Process Builder, native API |
| HubSpot | Workflows, Operations Hub for webhooks, contact properties |

**Integration Layer (one of the following):**

| Option | Best For |
|--------|----------|
| HubSpot Operations Hub | Native webhook triggers, simplest if already on HubSpot |
| n8n (self-hosted or cloud) | Flexible, cost-effective webhook pass-through |
| Zapier | Quick setup, but can get expensive at volume |

**Sequencing Tool (for automated follow-up):**

| Tool | Strengths for Automated Inbound |
|------|--------------------------------|
| HubSpot sequences | Native CRM integration, good for HubSpot shops |
| Outreach | Enterprise-grade, advanced analytics, A/B testing |
| Salesloft | Strong cadence management, conversation intelligence |
| Ample Market | AI-driven sequencing, emerging option |

**Routing Tools (optional but recommended for complex routing):**

| Tool | Key Capability |
|------|----------------|
| Chili Piper | 2-click booking, real-time enrichment, operates outside Salesforce so routing never competes with other SF operations |
| LeanData | 95% account matching accuracy, deep Salesforce integration, complex routing rules |
| Calendly | Good for simple use cases, not enterprise-grade |

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

| Role | Involvement Level | Key Responsibilities |
|------|-------------------|----------------------|
| **VP Sales / CRO** | Sponsor | Approves project, defines success metrics, owns outcome |
| **Head of RevOps** | Decision Maker | Signs off on routing logic, approves tool decisions, resource allocation |
| **RevOps Manager** | Technical Owner | Provides CRM access, implements routing rules, validates webhook flows, owns ongoing maintenance |
| **SDR/BDR Leadership** | Input Provider | Defines routing preferences, validates follow-up sequences, tests automation flows |
| **Marketing Ops** | Collaborator | Aligns on MQL definition, validates form configurations, owns upstream funnel |
| **IT/Security** | Gatekeeper | Approves API connections, reviews data flow, ensures compliance |

**RACI for Key Decisions:**

| Decision | R (Responsible) | A (Accountable) | C (Consulted) | I (Informed) |
|----------|-----------------|-----------------|---------------|--------------|
| Routing logic design | RevOps Manager | Head of RevOps | SDR Leadership | VP Sales |
| MQL criteria | Marketing Ops | Head of RevOps | SDR Leadership | VP Sales |
| Tool selection | RevOps Manager | Head of RevOps | IT | VP Sales |
| Sequence messaging | SDR Leadership | VP Sales | Marketing | RevOps |
| Go-live approval | RevOps Manager | Head of RevOps | SDR Leadership | VP Sales |

---

## 4) Scoping

### Scoping Factors

**1. Post-Market Map vs Standalone**

*   Post-Market Map: ~15 hours (duplicate Clay table, spin up, much simpler)
*   Standalone: ~20-25 hours (need to build ICP/tiering first)

**2. Inbound Volume**

| Volume | Recommendation |
|--------|-----------------|
| <50 leads/month | May not justify automation investment |
| 50-200 leads/month | Good candidate, clear ROI path |
| 200+ leads/month | Strong ROI case, automation essential |

**3. Lead Type & Intent Level**

| Lead Type | Intent Level | Required Response |
|-----------|--------------|-------------------|
| Demo request | High | Immediate routing to human, <5 min target |
| Trial signup | High | Instant follow-up, human or automated |
| "Talk to sales" | High | Priority routing, real-time notification |
| Pricing page view | Medium | Automated nurture, human for T1 accounts |
| Content download | Low-Medium | Automated sequence, slower cadence |
| Newsletter signup | Low | Long-term nurture, not urgent |

**4. Scheduling Workflow Considerations**

*   Do they want leads to book directly via Calendly/Chili Piper?
*   If yes: automated thank you + context sharing
*   If no: look at availability, speed to lead, routing logic

**5. Timing & Coverage**

| Scenario | Recommended Action |
|----------|-------------------|
| Business hours lead | Route to human, personalized touch |
| Off-hours lead | Automated response within minutes |
| T1 account off-hours | Consider human follow-up despite timing |
| Weekend lead | Automated sequence, human review Monday AM |

**6. Human vs Tool vs Hybrid**

| Model | Description | Best For |
|-------|-------------|----------|
| Fully automated | No human ever follows up | High volume, lower deal size |
| Human follow-ups | Route to rep, they take action | Enterprise deals, consultative sales |
| Hybrid | Automated first, human escalation for high-value | Most B2B SaaS companies |

**7. MQL Definition Clarity**

*   MQLs well-defined: can trigger automation cleanly
*   MQLs fuzzy: need to define criteria first
*   No MQL definition: may need lead lifecycle work first

**8. Existing Lead Lifecycle Health**

*   If lead lifecycle is broken in CRM: fix that first
*   Entry criteria must be clear before automation can work

### Multiple Approaches

**Approach 1: Post-Market Map (Ideal Scenario)**

*   Criteria: Market Map already exists with tiering and enrichment
*   Execution: Duplicate Clay table, configure webhook, add lookup step (check if account exists before enriching), set up routing, connect to sequences
*   Timeline: ~15 hours
*   Deliverables: Webhook receiver, lookup logic, enrichment flow, routing rules, sequence triggers
*   Why faster: Most accounts already enriched, so the lookup step skips account-level enrichment — you're mainly filling contact-level gaps

**Approach 2: Standalone (No Market Map)**

*   Criteria: No existing Market Map, need to build enrichment/tiering foundation
*   Execution: Build basic ICP criteria, create enrichment table, configure webhook, routing, sequences
*   Timeline: ~20-25 hours
*   Deliverables: ICP definition, enrichment table, webhook receiver, routing rules, sequences

**Approach 3: Calendly-First (Minimal)**

*   Criteria: Just want basic "didn't book" follow-up
*   Execution: Calendly, branching for no-book, automated message
*   Timeline: ~5-10 hours
*   Deliverables: Calendly configuration, no-book workflow, follow-up sequence

**Approach 4: Hybrid Human/Automated**

*   Criteria: Want humans for business hours, automation for off-hours
*   Execution: Build decision tree based on timing + tier, route accordingly
*   Timeline: ~20-25 hours
*   Deliverables: Business hours detection, tier-based routing, dual workflow paths

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Inbound Motion:**

*   What are your primary inbound channels? (demo form, trial signup, content downloads, website chat)
*   What's your current inbound volume? (leads/month)
*   What happens today when a lead comes in? (manual triage, auto-routing, nothing)
*   What's your current average response time? (if known)

**Follow-up Preferences:**

*   Do you want leads to book directly via a scheduling tool?
*   What should happen if they don't book?
*   What's your vision: fully automated, human follow-ups, or hybrid?
*   How many touchpoints should non-responders get?

**Timing & Coverage:**

*   What hours do you have sales coverage?
*   What should happen to leads that come in off-hours?
*   Are there high-value exceptions that should always route to humans? (e.g., Fortune 500)
*   Do you have global coverage or single timezone?

**Sequencing:**

*   If someone comes in and doesn't respond, do you want one message or a full sequence?
*   Who should follow-up messages come from? (individual rep inbox vs marketing platform)
*   What's your current sequence cadence? (daily, every 2 days, weekly)

**Tool Stack:**

*   What CRM are you using?
*   Do you have HubSpot Operations Hub?
*   What sequencing tool do you use? (Outreach, Ample Market, HubSpot sequences)
*   Do you have n8n or Zapier?
*   Are you using or open to Chili Piper/LeanData for routing?

**Existing State:**

*   Do you have Market Map already? (tiering, enrichment data)
*   Is your lead lifecycle defined in CRM?
*   Are MQLs clearly defined?
*   What data do you currently capture on form fill?

### Approach Decision Questions

| Question | Answer |
|----------|--------|
| Do you have Market Map? | Yes = Post-Market Map (~15 hrs), No = Standalone (~20-25 hrs) |
| What's the primary goal? | "Didn't book" follow-up = Calendly-First, Full automation = Full build |
| Human or automated? | Fully automated = simpler, Hybrid = more complex routing |
| Is lead lifecycle healthy? | Healthy = proceed, Broken = fix first |
| Are MQLs defined? | Defined = proceed, Undefined = define first |
| Inbound volume? | <50/month = reconsider ROI, 50+ = proceed |

---

## 6) Objections & Edge Cases

### Copywriting Scope

This project inherently involves copywriting decisions:

*   How many steps in the sequence?
*   What messaging should each step have?
*   What tone? What CTA?

**The boundary:**

*   Structure work: how many steps, what methods, what triggers
*   Client writes their own copy
*   Advisory on framework (e.g., "step 1 should be value-oriented, step 2 should include social proof")

### The Ecosystem Challenge

Automated inbound can't be fully segmented as standalone project. Everything interconnected:

*   Market Map + ICP + all GTM elements correlated
*   Lead routing touches lead lifecycle
*   Speed to lead touches MQL definition

### MQL Edge Cases

| Lead Type | Urgency | Recommended Response |
|-----------|---------|----------------------|
| Newsletter signup | Low | Nurture sequence, longer timeline |
| White paper download | Low-Medium | Educational sequence |
| Pricing page view | Medium | Worth attention if combined with other signals |
| Pricing + multiple sessions | High | Aggregate signals = buying intent |
| Trial signup | High | Immediate follow-up |
| Demo request | Highest | Sub-5-minute response target |

### Proof of Data (High-Ceiling Add-On)

More useful on outbound but applicable to inbound:

*   Clay doesn't just notify — it hyperlinks context for clean research
*   Even if not personalizing to prospect, include in notification for context
*   Accelerates understanding and arms reps with the right information

### High-Value After-Hours Exception

| Scenario | Detection | Action |
|----------|-----------|--------|
| Fortune 500 lead at 1am | Tier = T1 + off-hours | Notify on-call rep, consider immediate response |
| Named account off-hours | Account on target list | Human review, potentially immediate |
| Standard lead off-hours | Tier = T2/T3 | Automated sequence, human follow-up next day |

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Power 10 Metric | Impact Direction | Expected Magnitude | Source & Notes |
|-----------------|------------------|-------------------|-----------------|
| MQL to Opp Conversion | Increase | 2-3x | Companies following up within 1 hour see 53% conversion vs 17% after 24 hours |
| Opp to CW Cycle Time | Decrease | 15-30% | Companies using lead enrichment report 15% decrease in sales cycle length. AI-driven enrichment enables 30% faster deal closure through improved qualification |

### Expected Outcomes

| Metric | Before | After | Source |
|--------|--------|-------|--------|
| Average response time | 42-47 hours | <5 minutes | Industry research |
| Lead qualification rate | Baseline | +21x improvement | Industry data |
| Inbound conversion rate | Baseline | +17-23% | Industry research |
| Rep time on admin | 70% of week | Reduced by 30-50% | Sales force data |
| Off-hours lead capture | Delayed to next day | Instant | Automation benefit |

### How to Measure Success

**Leading Indicators (Week 1-4):**

*   Webhook firing correctly (100% of form fills)
*   Enrichment match rate (target: >85%)
*   Routing accuracy (leads going to right rep)
*   Sequence enrollment rate

**Lagging Indicators (Month 2-6):**

*   Average speed-to-lead (target: <5 min for T1)
*   Lead-to-meeting conversion rate
*   MQL-to-SQL conversion rate
*   Rep satisfaction scores

---

## References

[1] HBR - The Short Life of Online Sales Leads
[2] InsideSales Lead Response Management Study
[3] RevenueHero B2B Lead Response Times Study
[4] Default Lead Routing Software
[5] Salesforce State of Sales 2024
[6] Cirrus Insight Lead Routing Best Practices
[7] Forbes - The Importance of Speed to Lead
[8] Chili Piper Speed to Lead Statistics
[9] CloudTalk Lead Distribution
[10] Vendasta Speed to Lead
[11] Ricochet360 Lead Response Study
[12] LeanData
[13] G2 Clay Reviews
[14] G2 Chili Piper vs LeanData Comparison
[15] Data-Mania Lead Response Research
[16] Salesmate
[17] MarketsandMarkets
