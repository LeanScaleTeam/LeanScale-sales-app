# Lead Scoring Model (Product-Led) — Advisory

## 1) Project Overview

### What is the name of this project?

Lead Scoring Model Product Led - Product-Led Lead Scoring & PQL Design

### What is the purpose of this project?

This project builds a rules-based scoring model that evaluates and prioritizes leads using product usage signals, behavioral data, and firmographic fit for product-led go-to-market motions. The deliverable is an automated lead scoring system integrated into the CRM/MAP that surfaces Product-Qualified Leads (PQLs) for sales prioritization.

**Core transformation:** From sales teams manually guessing which free trial or freemium users are worth pursuing, to an automated system that surfaces users who have demonstrated real product value and buying intent -- converting PQLs at 25-30% compared to 5-10% for traditional MQLs.

### What Lead Scoring Model Product Led Unlocks

After this project is complete, the client can:

* **Surface PQLs automatically** -- users who completed key product milestones and match the ICP get flagged for sales without manual review
* **Prioritize by product behavior** -- sales reps see which trial users invited teammates, used core features 3+ times, or hit activation milestones
* **Apply score decay** -- inactive leads automatically deprioritize so reps always work the freshest, highest-intent prospects
* **Measure scoring accuracy** -- conversion rates by score bucket provide continuous feedback on model quality
* **Align Sales and Product teams** -- a shared, data-backed definition of "sales-ready" replaces gut feel

| Aspect | Before | After |
|--------|--------|-------|
| Lead Prioritization | Sales chases all trial users equally | Sales focuses on users who hit activation milestones |
| Product Visibility | No visibility into product usage from CRM | Product engagement data flows into CRM fields in near-real-time |
| Scoring Approach | MQL scoring based on content downloads and email opens | PQL scoring weighted 3-5x toward product behavior signals |
| Pipeline Health | Stale leads accumulate high scores from old activity | Score decay keeps pipeline fresh and reflects current intent |
| Team Alignment | Sales and Marketing disagree on what "qualified" means | Shared PQL threshold validated against actual conversion data |

### What business outcomes does this project drive?

**Primary Outcomes:**

* Higher trial-to-paid conversion rates -- PQLs convert at 25-30% vs. 5-10% for traditional MQLs
* Reduced sales time wasted on unqualified leads -- only 27% of leads passed to sales are actually qualified without scoring
* Faster sales cycles on PQL-sourced deals due to higher buyer intent at first contact
* Unified PQL definition that both Sales and Product agree on

**Secondary Outcomes:**

* Foundation for predictive scoring with ML models once enough PQL conversion data accumulates
* Data infrastructure (product events flowing to CRM) that enables other product-led sales plays
* Quantified understanding of which product behaviors predict conversion, informing Product roadmap priorities

### Who in the Org can benefit from this project?

VP of Marketing, VP of RevOps, Growth/PLG Lead, Sales Reps, SDRs, Product Managers, Marketing Ops Manager

### Pain Points this Project Solves

| Pain Point | What Lead Scoring Model Product Led Enables |
|-----------|----------------------------------------------|
| "Sales wastes hours chasing low-intent trial users" | Automated PQL surfacing so reps only contact users who demonstrated product value |
| "We can't tell which trial users are actually engaged" | Product usage signals (feature adoption, login frequency, milestones) visible in CRM |
| "Our MQL scoring doesn't reflect real buying intent" | Behavioral scoring weighted toward product actions instead of content downloads |
| "High-value prospects slip through because we treat all trials the same" | Fit + behavioral scoring identifies ICP-matching users who hit activation milestones |
| "Old leads clutter the pipeline with inflated scores" | Time-based decay automatically deprioritizes inactive leads |
| "Sales and Marketing can't agree on what a qualified lead looks like" | Shared PQL threshold backed by conversion data, validated in pilot |

### The Data Behind the Problem

Product-led companies face a specific version of the lead qualification challenge: high volume, low signal. The data supports the urgency of building a product-based scoring model:

* **Only 27% of leads sent to sales are actually qualified** -- 61% of B2B marketers send all leads directly to sales without qualification
* **67% of lost sales are tied to inadequate lead qualification**, meaning reps spend cycles on deals that were never winnable
* **Sales reps spend just 33% of their time actively selling** -- the rest goes to administrative tasks and chasing unqualified prospects
* **PQLs convert at 5x the rate of overall leads** in product-led motions because they measure actual product engagement, not just marketing touchpoints
* **Organizations using lead scoring see a 77% lift in lead generation ROI** compared to those that do not
* **PLG companies acquire customers at 1/10th the cost** of sales-led approaches ($100-$500 CAC vs. $5K-$50K) when they can correctly identify which users are ready for sales engagement

### Key Metaphors or Frameworks

**The Activation Signal Funnel:** Think of product usage as a funnel within a funnel. Marketing gets users into the product (top of funnel), but only a subset will hit activation milestones that predict conversion. The scoring model acts as a filter that separates "tourists" (users who signed up but never found value) from "residents" (users who completed onboarding, used core features, and invited teammates). Sales should only engage residents.

Use this when explaining why MQL scoring is insufficient for PLG. Do not use this when the client has a purely sales-led motion with no self-serve component -- that calls for a traditional lead scoring model. See Methodology for the complete scoring framework and signal weighting rationale.

### Target Motion

**Product-Led Growth (PLG) or PLG-hybrid.** This project is designed for companies with a free trial, freemium, or self-serve product experience where users interact with the product before engaging sales. It works for both pure PLG and hybrid motions where a self-serve path exists alongside a sales-assisted path.

Not a fit for: Purely sales-led companies with no free trial or self-serve product access. Companies without product analytics tracking user behavior. Companies looking for predictive ML-based scoring (this project is rules-based; ML scoring is a separate, downstream project).

### Common Belief Barriers

**"Our sales team can tell who's ready to buy -- we don't need a scoring model."** -- Individual rep instincts do not scale. With hundreds or thousands of trial users per month, manual triage means high-value prospects get missed while reps pursue whoever they notice first. A scoring model ensures systematic coverage.

**"We already have lead scoring in our MAP -- this is just tweaking weights."** -- Traditional MAP scoring weights email opens, content downloads, and webinar attendance. In a PLG motion, those signals are 3-5x less predictive than product usage behaviors like feature adoption, team invites, and activation milestone completion. This is a fundamentally different model, not a weight adjustment.

**"Product data is too messy to score on."** -- Product analytics platforms like Segment and Amplitude already normalize event data. The scoring model does not need every event -- it needs 5-10 key activation signals that correlate with conversion. See Methodology for how to identify the right signals.

**"We should just build a predictive ML model instead."** -- ML scoring requires a large volume of labeled conversion data (typically 1,000+ converted users) and ongoing model maintenance. A rules-based scoring model can launch in weeks, start generating PQLs immediately, and produce the labeled data that eventually feeds an ML model. Rules-based is the prerequisite, not the compromise.

See Section 4 for full reframes and talk tracks.

---

## 2) Tools & Systems

### Primary Tools

**Salesforce or HubSpot (CRM/MAP)**

Stores lead/contact records, hosts the scoring fields (fit score, behavioral score, combined score), triggers PQL workflows, and sends sales notifications. HubSpot has native scoring properties; Salesforce requires custom fields plus Process Builder or Flow for PQL automation.

**Segment (Customer Data Platform)**

Routes product usage events from the application to the CRM/MAP. Acts as the data pipeline that makes product behavior visible for scoring. Segment's identify calls automatically update CRM records when connected as a destination.

**Amplitude or Mixpanel (Product Analytics)**

Provides the behavioral data that powers scoring: feature usage, session frequency, activation milestones, and cohort analysis to identify which behaviors correlate with conversion. Used during scoring design to determine signal weights.

**Data Providers:**

* Firmographic enrichment: Clay (waterfall enrichment), Clearbit, ZoomInfo
* Contact enrichment: Apollo, ZoomInfo
* Industry-specific: depends on client vertical (e.g., BuiltWith for tech stack signals)

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**VP of Marketing or VP of RevOps (Executive Sponsor)**

* Required for: Kickoff, scoring strategy sign-off, PQL threshold approval, launch decision
* Responsibilities: Final approval on scoring criteria, budget for tooling, cross-team alignment

**Growth/PLG Lead (Project Owner)**

* Required for: All phases -- this person bridges Product and Go-to-Market
* Responsibilities: Define activation milestones, validate product signals, coordinate with Product team for data access

**Sales Leader - VP Sales or Head of Sales (Input Provider + Adopter)**

* Required for: Kickoff, fit criteria validation, PQL threshold review, pilot feedback
* Responsibilities: Define what "sales-ready" means from rep perspective, allocate pilot reps, enforce PQL follow-up process

**Product Manager (Input Provider)**

* Required for: Discovery (Part 1), data infrastructure assessment (Part 2)
* Responsibilities: Identify key product events, confirm analytics instrumentation, provide cohort data on converted vs. churned users

### Technical Owners

**Marketing Ops Manager or RevOps Manager**

* Owns CRM/MAP configuration for scoring rules and workflows
* Manages ongoing scoring model tuning and threshold adjustments
* Monitors score distribution health and PQL alert delivery

**Product Analytics Lead or Data Engineer (If Separate)**

* When needed: When product events must flow to CRM via custom integration rather than native connector
* Handles: Segment configuration, event schema validation, sync frequency tuning, data transformation logic

**Enterprise Considerations:**

* Security review may be required for product-to-CRM data pipeline
* Data governance team approval for PII flowing between product analytics and sales systems
* IT approval for API connections and sync frequency requirements

---

## 4) Scoping

### Scoping Factors

**1. Data Infrastructure Maturity**

* Product events already flowing to CRM via Segment/CDP -- standard scope, focus on scoring design
* Product analytics exist but no CRM integration -- add 20-30 hours for data pipeline setup
* Product analytics are sparse or inconsistent -- prerequisite work needed before scoring can begin

**2. Number of Product Events to Score**

* 5-10 key activation signals -- standard complexity
* 10-20 signals with multiple feature categories -- increased configuration and testing
* 20+ signals or events across multiple products -- significant scoping, consider phased rollout

**3. CRM Platform**

* HubSpot Professional/Enterprise -- native scoring properties, faster configuration
* Salesforce -- custom fields and automation via Flow/Process Builder, more configuration effort
* Marketo + Salesforce -- additional MAP layer adds integration complexity

**4. Trial/Freemium Model Type**

* Time-limited free trial (14-30 days) -- urgency-based decay is critical, velocity scoring important
* Freemium with usage limits -- activation milestones focus on upgrade-trigger behaviors
* Open-ended free trial -- longer observation windows, decay calibration more nuanced

**5. Sales Team Size and Process Maturity**

* 2-5 reps, early-stage process -- lighter enablement, faster pilot
* 10-25 reps with established process -- more stakeholder alignment, territory-based routing needed
* 25+ reps across segments -- multiple scoring models by segment may be required

**6. Historical Data Availability**

* 12+ months of closed-won/lost with product usage data -- full validation possible
* 6-12 months of data -- partial validation, wider confidence intervals on thresholds
* Less than 6 months -- threshold setting is best-guess, requires aggressive pilot-and-adjust cycle

### Multiple Approaches

**Approach 1: Standard PQL Scoring (Most Common)**

* Criteria: Product analytics in place, CRM integration feasible via existing CDP, single product, 5-10 key activation signals
* Execution: Design fit + behavioral scoring, configure in CRM/MAP, connect product data pipeline, validate against historical data, pilot, and launch
* Timeline: 60-80 hours over 6-8 weeks

**Approach 2: Multi-Product or Multi-Segment Scoring**

* Criteria: Multiple products or distinct user segments with different activation journeys
* Execution: Design separate scoring models per product/segment, configure segment-specific thresholds, build routing logic that accounts for which product the user engaged with
* Timeline: 80-120 hours over 8-12 weeks

**Approach 3: Infrastructure-First Scoring**

* Criteria: Product analytics exist but no CRM integration; need to build the data pipeline before scoring can begin
* Execution: Phase 1 builds the event pipeline (Segment to CRM), Phase 2 designs and implements scoring on top of it
* Timeline: 100-140 hours over 10-14 weeks

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Business Context:**

* What is your current trial-to-paid conversion rate? _(Establishes the baseline we are trying to improve)_
* How do you currently decide which trial users to contact? _(Reveals whether any scoring exists today)_
* What does your PLG funnel look like -- free trial, freemium, reverse trial, or hybrid? _(Determines decay and velocity logic)_
* What is your average deal size for self-serve vs. sales-assisted conversions? _(Informs PQL threshold priorities)_

**Product Usage & Data:**

* What product analytics platform do you use (Segment, Amplitude, Mixpanel, Heap, custom)? _(Determines data infrastructure scope)_
* Which product events do you currently track? _(Identifies gaps in instrumentation)_
* What are the key activation milestones you believe predict conversion? _(Tests whether Product team has hypotheses)_
* How does product usage data currently get to your CRM -- does it at all? _(Scoping factor 1: data maturity)_
* Do you have at least 6 months of historical conversion data with associated product usage? _(Determines validation approach)_

**Sales Process:**

* How many trial users does your sales team currently receive per month? _(Capacity context)_
* What is your current definition of "sales-ready" -- is there one? _(Alignment starting point)_
* How are leads currently assigned to reps? _(Downstream routing consideration)_
* What CRM and MAP do you use? What tier? _(Technical platform scoping)_

**Expectations & Success:**

* What conversion rate improvement would make this project successful? _(Sets targets)_
* How quickly do you need to see results -- are you willing to run a 2-week pilot? _(Timeline expectations)_
* Who needs to approve the PQL threshold before launch? _(Identifies decision-makers)_

### Information to Gather Before Implementation

**Product Data:**

Cohort analysis comparing product behavior of converted users vs. churned trials (last 6-12 months). List of all tracked product events with event names, properties, and volume. Identification of 5-10 candidate activation milestones.

**CRM/MAP Access:**

Admin credentials for scoring rule configuration. Current lead/contact field inventory (what firmographic data exists). Existing scoring model documentation (if any legacy scoring is in place).

**Enrichment Data:**

Current enrichment provider and coverage rates for key firmographic fields (company size, industry, tech stack). Data fill rates for job title, seniority, and department.

### Approach Decision Questions

| Question | Answer Indicates Approach |
|----------|---------------------------|
| Is product event data already flowing to your CRM? | Yes = Standard PQL Scoring, No = Infrastructure-First Scoring |
| Do you have one product or multiple? | One = Standard, Multiple = Multi-Product Scoring |
| Do you have distinct user segments with different activation paths? | Yes = Multi-Segment Scoring, No = Standard |
| How much historical conversion data do you have? | 12+ months = Full validation, 6-12 = Partial validation, <6 = Pilot-heavy |
| What CRM tier are you on? | HubSpot Pro+ or SF = Standard, HubSpot Free/Starter = Upgrade prerequisite |

---

## 6) Overcoming Common Belief Barriers

### "Our sales team can tell who's ready to buy -- we don't need a scoring model."

Individual rep instincts work when you have 20 trial users a month. At 200 or 2,000, reps default to recency bias (whoever signed up most recently) or cherry-picking (whoever has the most recognizable company name). Neither approach is systematic.

The data is clear: 67% of lost sales trace back to inadequate lead qualification. A scoring model does not replace rep judgment -- it gives reps a pre-filtered, ranked list so their judgment applies to the right prospects. Reps who work PQLs spend their time on users who already demonstrated product value, not on tourists who signed up and never logged in again.

**The reframe:** "Your best reps already do this instinctively -- the scoring model makes every rep perform like your best rep, and it works 24/7 at scale."

### "We already have lead scoring in our MAP -- this is just tweaking weights."

Traditional MAP scoring was designed for sales-led motions: email opens, content downloads, webinar attendance, form fills. These signals measure marketing engagement, not product engagement. In a PLG motion, a user who logged in 8 times, completed onboarding, and invited 3 teammates is dramatically more likely to convert than one who downloaded 5 whitepapers.

| Signal Type | Traditional MQL Scoring | Product-Led PQL Scoring |
|-------------|------------------------|------------------------|
| Primary data source | Marketing engagement | Product usage behavior |
| Highest-weight signals | Demo request, pricing page | Activation milestones, feature depth |
| Typical conversion rate | 5-10% MQL-to-opp | 25-30% PQL-to-opp |
| Decay emphasis | Email engagement recency | Product login recency, feature velocity |

**The reframe:** "Your current scoring measures who's interested. PQL scoring measures who's already experiencing value. Those are fundamentally different buyer stages."

### "Product data is too messy to score on."

This objection usually comes from teams that have tried to use raw product event streams and been overwhelmed. The scoring model does not need every event. It needs 5-10 key signals that correlate with conversion -- signals like "completed onboarding," "used core feature 3+ times," "invited a teammate," or "exported data."

Product analytics platforms like Segment, Amplitude, and Mixpanel already normalize and structure this data. The discovery phase (see Implementation for details) identifies which specific events matter, validates them against historical conversion data, and maps only those events into CRM fields.

**The reframe:** "We don't score on all your product data -- we score on the 5-10 signals that actually predict conversion. That is a focused, manageable data set."

### "We should just build a predictive ML model instead."

ML scoring models require three things most PLG companies at this stage do not have: a large labeled dataset (typically 1,000+ converted accounts), data engineering resources for ongoing model training and maintenance, and a feedback loop to detect model drift.

A rules-based scoring model launches in weeks, costs a fraction of an ML implementation, and starts generating labeled PQL data immediately. After 6-12 months of PQL data accumulation, you have the training data to build an ML model on top of it. Rules-based scoring is not the compromise -- it is the prerequisite.

**The reframe:** "Rules-based scoring gives you results in weeks and generates the training data you need for ML later. Building ML first means waiting 6+ months with no scoring at all."

### "Our trial is only 14 days -- there's not enough time to score."

Short trials actually make scoring more valuable, not less. With limited time, you need to identify high-intent users fast so sales can engage before the trial expires. Velocity scoring (how quickly a user hits milestones) becomes the primary signal. A user who completes onboarding on day 1 and uses 3 core features by day 3 is a fundamentally different prospect than one who logged in once and never came back.

**The reframe:** "Short trials mean you have less room for error -- scoring ensures sales reaches the right users before the window closes."

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Power 10 Metric | Impact Direction | Expected Magnitude | Notes |
|-----------------|------------------|-------------------|-------|
| MQL-to-Opp Conversion | Replaced by PQL-to-Opp | +150-200% vs MQL baseline | PQLs convert at 25-30% vs. 5-10% for MQLs |
| Pipeline Production | Increase | +20-35% | Higher conversion rate from same trial volume produces more pipeline |
| Opp-to-CW Conversion | Increase | +10-20% | PQL-sourced deals have higher buyer intent at entry |
| Sales Cycle Length | Decrease | -15-25% | Users who experienced product value require less education |
| Revenue per Rep | Increase | +15-30% | Reps focus on high-intent PQLs instead of manual triage |
| CAC | Decrease | -20-40% | PLG + PQL scoring acquires customers at fraction of sales-led cost |

### Expected Outcomes

| Metric | Before | After | Source |
|--------|--------|-------|--------|
| Trial-to-paid conversion rate | 2-5% (industry average) | 5-10% (with PQL prioritization) | ProductLed benchmarks |
| PQL-to-opportunity conversion | N/A (no PQL definition) | 25-30% | Gainsight PQL benchmarks |
| Sales time on qualified vs. unqualified leads | 33% selling, 67% admin | 50%+ selling time on PQLs | Salesforce State of Sales |
| Lead scoring ROI | No scoring in place | 77% lift in lead gen ROI | Martal / Eloqua research |
| Average sales cycle (PQL deals) | 30-45 days (unscored trials) | 20-35 days | Internal benchmarks |

### How to Measure Success

**Leading Indicators (Early signals, Week 1-4):**

* PQL volume: number of leads crossing the PQL threshold per week (target: 10-20% of total trial signups)
* Sales rep engagement with PQL alerts: open rate and follow-up rate on PQL notifications
* Score distribution health: bell-curve shape across score buckets (no clustering at 0 or 100)
* Sales feedback: qualitative rep assessment of PQL lead quality vs. pre-scoring pipeline

**Lagging Indicators (Proof of success, Month 2-6):**

* PQL-to-opportunity conversion rate (target: 2-3x higher than non-PQL trial conversion)
* Overall trial-to-paid conversion rate increase (target: 15-25% improvement within 90 days)
* Reduction in average sales cycle length for PQL-sourced deals
* Revenue per sales rep increase due to better prioritization
* Scoring model accuracy: conversion rate differential between top-quartile and bottom-quartile scored leads

---

## References

[1] ProductLed - Product-Led Growth Benchmarks
[2] Gainsight - Benchmark: PQL Conversion Rates
[3] Landbase - 35 Lead Qualification Statistics
[4] Entrepreneur - The Hidden Cost of Chasing Unqualified Leads
[5] Salesforce - State of Sales Report
[6] OpenView - 5 Pillars for PLG Using PQLs
[7] Martal - B2B Lead Scoring: Top Practices Driving Results
[8] Segment - Setting Up Lead Scoring to Improve Sales Efficiency
