# Lead Scoring Model (Sales-Led) — Advisory

## 1) Project Overview

### What is the name of this project?

Lead Scoring Model (Sales-Led) - Automated Lead Prioritization & Qualification System

### What is the purpose of this project?

This project designs, builds, and deploys a systematic lead scoring model in the client's CRM and marketing automation platform. The model combines fit scoring (firmographic and demographic attributes) with engagement scoring (behavioral signals) to automatically rank every lead by conversion potential. Sales reps receive prioritized lead lists instead of an undifferentiated queue, and MQL thresholds trigger automated handoff workflows.

**Core transformation:** From "every lead looks the same and reps guess who to call first" to "every lead has a calculated score that tells reps exactly where to spend their time."

### What Lead Scoring Model (Sales-Led) Unlocks

- Sales reps focus on leads most likely to convert, instead of manually triaging inbound volume
- Marketing gets a shared, data-backed definition of "qualified" that both teams agree on
- MQL-to-SQL handoff becomes automated and auditable, removing subjective judgment calls
- Leadership gains visibility into lead quality trends over time through score distribution dashboards
- The organization builds the data foundation for future predictive scoring or AI/ML models

| Before | After |
|--------|-------|
| All leads look equal; reps manually qualify each one | Every lead has a fit + engagement score visible in CRM |
| Marketing passes leads without context on intent | MQL threshold triggers automated, data-backed handoff |
| Reps waste time on low-quality leads | Reps prioritize high-score leads; low scores go to nurture |
| No shared definition of "qualified" | Sales and marketing align on scoring criteria and MQL threshold |
| No visibility into lead quality trends | Score distribution dashboards track model health weekly |

### What business outcomes does this project drive?

**Primary Outcomes:**

- MQL-to-SQL conversion rate increases 20-40% as reps focus on higher-quality leads
- Sales productivity improves: reps spend less time qualifying and more time selling (sales reps currently spend only 28-30% of their week on actual selling activities)
- Marketing-to-sales handoff friction decreases through a shared, objective qualification standard

**Secondary Outcomes:**

- Foundation for predictive lead scoring or AI/ML models once historical scored data accumulates
- Improved marketing attribution: score data reveals which campaigns generate high-fit, high-engagement leads
- Faster sales cycle for scored leads as reps engage prospects at peak intent moments

### Who in the Org can benefit from this project?

VP of Marketing, VP of Sales, Marketing Ops Manager, RevOps Leader, SDR/BDR Team Leads, Individual Sales Reps, Demand Gen Managers

### Pain Points this Project Solves

| Pain Point | What Lead Scoring Model (Sales-Led) Enables |
|-----------|---------------------------------------------|
| "Our reps waste hours calling leads that never convert" | Automated scoring surfaces high-potential leads first; low-score leads route to nurture instead of clogging the sales queue |
| "Marketing says the leads are good, sales says they're garbage" | A shared, data-backed MQL definition that both teams helped design and both teams trust |
| "We have no idea which campaigns actually drive pipeline" | Score data shows which channels and campaigns produce high-fit, high-engagement leads vs. vanity volume |
| "High-intent prospects go cold because reps don't get to them fast enough" | MQL threshold automation triggers instant notifications and assignment so reps act while intent is hot |
| "We can't tell the difference between a newsletter reader and a buyer" | Dual-axis scoring separates behavioral engagement from demographic fit, preventing false positives on either axis |

### The Data Behind the Problem

The cost of treating all leads equally is well-documented:

- Only 44% of B2B organizations use lead scoring to categorize leads, meaning the majority still rely on subjective qualification
- Sales reps spend just 28% of their time on revenue-generating selling activities; the rest goes to administrative tasks, manual research, and qualification
- B2B SaaS companies using behavioral scoring achieve 39-40% MQL-to-SQL conversion rates compared to the 13% industry average without scoring
- Organizations that implement lead scoring generate 138% ROI on lead generation activities vs. 78% for companies without scoring
- Companies that follow up with qualified leads within the first hour report a 53% conversion rate vs. 17% for follow-ups after 24 hours

### Key Metaphors or Frameworks

**The "Two-Axis Grid" metaphor:** Lead scoring works like plotting every lead on a grid with Fit (x-axis) and Engagement (y-axis). High-fit, high-engagement leads are in the top-right quadrant: those go to sales immediately. High-fit, low-engagement leads need nurturing. Low-fit, high-engagement leads (like students researching your product) get disqualified. This visual helps stakeholders quickly grasp why both axes matter and why over-weighting either one creates false positives.

Use this in kickoff meetings to align sales and marketing on the model logic. Do not use it to imply the model is a simple 2x2 -- the actual scoring uses weighted point values across dozens of attributes, not four quadrants.

### Target Motion

This project is designed for **Sales-Led Growth (SLG)** and **inbound-led sales** motions where marketing generates leads that sales qualifies and closes. The model assumes a handoff point (MQL to SDR/AE) and a sales team that actively works inbound leads.

Specifically fits: SLG companies with dedicated SDR/BDR teams, inbound-heavy motions with marketing automation in place, hybrid motions where inbound feeds a sales-led close.

_Not a fit for:_ Pure product-led growth (PLG) motions where scoring should weight product usage signals over marketing engagement (see the Product-Led lead scoring playbook instead). Also not a fit for organizations without a marketing automation platform connected to CRM, or companies with fewer than 6 months of historical lead data.

### Common Belief Barriers

**"Our reps already know which leads are good -- they don't need a score."** -- Rep intuition is valuable, but it does not scale. When inbound volume grows past what a rep can manually review, subjective judgment creates inconsistency across the team. Scoring captures the same signals reps use (title, company size, engagement recency) and applies them systematically to every lead. The model should encode rep knowledge, not replace it.

**"We tried lead scoring before and it didn't work."** -- Most failed scoring models share one of two root causes: (1) the model only scored on one axis (fit or engagement, not both) creating false positives, or (2) the model was never validated against actual conversion data. This project includes historical backtesting and a pilot period specifically to prevent these failures. See Methodology for the validation framework.

**"Lead scoring is too complex for our stage -- we need to walk before we run."** -- A basic scoring model with 8-10 fit criteria and 5-7 behavioral signals can be built in 40 hours. It does not require machine learning or predictive analytics. The model starts simple and gets refined quarterly. The alternative -- no scoring at all -- means reps spend 70% of their time on non-selling activities, including manually qualifying every lead.

**"We don't have enough data to score leads."** -- If you have 6 months of closed-won and closed-lost deals in CRM, you have enough data to build and validate a scoring model. The historical deal data reveals which attributes and behaviors correlate with conversion. Data gaps get flagged during the audit step and addressed through enrichment providers.

---

## 2) Tools & Systems

### Primary Tools

**Salesforce (Sales Cloud)**

Primary CRM where lead records, scores, and lifecycle stages live. Custom score fields (Fit Score, Engagement Score, Total Score) are created on the Lead and Contact objects. Reports and dashboards display score distributions and conversion tracking. Lead assignment rules and alert workflows trigger on score thresholds.

**HubSpot (Marketing Hub Professional or Enterprise)**

Alternative CRM/marketing automation platform. HubSpot's Lead Scoring tool (updated August 2025) allows creation of engagement scores, fit scores, and combined scores with customizable min/max ranges from -100 to 10,000. Score properties integrate directly with workflows, segments, and reports.

**Salesforce Marketing Cloud Account Engagement (Pardot)**

Marketing automation layer for Salesforce-based clients. Provides both Scoring (behavioral engagement tracking) and Grading (fit assessment against ICP criteria). Supports score decay rules to reduce scores for inactive leads. Einstein Behavior Score adds AI-driven pattern recognition on top of rules-based scoring.

**Marketo Engage**

Enterprise marketing automation platform with native lead scoring capabilities. Supports complex multi-model scoring architectures for organizations with multiple products or segments. Provides built-in score degradation and recalculation on relevant events.

**Data Providers (if applicable):**

- Firmographic enrichment: ZoomInfo, Apollo, Clearbit -- fill missing company size, industry, revenue, and tech stack data needed for fit scoring
- Contact enrichment: ZoomInfo, Apollo, Lusha -- fill missing title, seniority, department data
- Intent data (advanced): Bombora, G2 Intent -- supplement engagement scoring with third-party buyer intent signals
- Enrichment orchestration: Clay -- waterfall enrichment across multiple providers to maximize data completeness before scoring

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**VP of Marketing (Executive Sponsor)**

- Required for: Kickoff, ICP validation, MQL threshold sign-off, final model approval
- Responsibilities: Provides marketing strategy context, approves MQL definition, ensures marketing team adopts score-based workflows

**VP of Sales (Executive Sponsor)**

- Required for: Kickoff, ICP validation, MQL threshold sign-off, pilot feedback review
- Responsibilities: Validates scoring criteria reflect actual buyer signals, ensures sales team trusts and uses the model, provides sales process context

**Marketing Ops Manager / RevOps Leader (Technical Owner)**

- Required for: All phases -- discovery, build, testing, rollout
- Responsibilities: Provides CRM/MAP admin access, owns ongoing model maintenance post-handoff, manages quarterly scoring reviews

**SDR/BDR Team Lead (Input Provider)**

- Required for: Discovery interviews, pilot testing, training
- Responsibilities: Shares frontline rep perspective on lead quality signals, validates that score outputs match real-world lead value, ensures reps adopt scoring in daily workflow

### Technical Owners

**Marketing Ops Manager / RevOps Leader**

- Owns the scoring model configuration post-handoff
- Manages quarterly scoring reviews and threshold adjustments
- Maintains automation workflows (MQL triggers, notifications, assignment rules)
- Monitors dashboards for scoring anomalies (inflation, drift, threshold misalignment)

**Salesforce/HubSpot Admin (If Separate from Marketing Ops)**

- When this role is needed: Organizations where CRM admin and marketing automation admin are different people
- Handles custom field creation, permission sets, and CRM-side automation
- Manages integration between CRM and marketing automation platform

**IT/Security (Enterprise Considerations)**

- Required for enterprise orgs with change management processes or sandbox environments
- Handles Salesforce sandbox deployment, permission set assignments, and data access controls
- May need to approve new integrations (e.g., enrichment provider API connections)

---

## 4) Scoping

### Scoping Factors

**1. CRM Platform**

- HubSpot (native scoring) -- Faster setup, scoring tool built in, simpler automation. Reduces build hours by 10-15%.
- Salesforce + Pardot -- Dual-system scoring (Pardot score + grade, Salesforce custom fields). Adds complexity for sync and field mapping.
- Salesforce + Marketo -- Enterprise configuration, supports multi-model architectures. Highest complexity, longest build.
- Salesforce without marketing automation -- Score must be calculated via Flow/Process Builder using CRM data only. Limited behavioral scoring capability.

**2. Data Quality**

- Clean data (80%+ field completeness on key ICP attributes) -- Model build proceeds directly after audit. Standard timeline.
- Moderate gaps (50-79% completeness) -- Requires enrichment step using ZoomInfo/Apollo/Clay before scoring is viable. Adds 8-16 hours.
- Poor data (below 50% completeness) -- Enrichment becomes a sub-project. Consider phasing: data cleanup first, scoring second. Adds 20-40 hours.

**3. ICP Definition Maturity**

- ICP documented and validated -- Scoring criteria can be derived directly from existing ICP. Saves 8-10 hours.
- ICP loosely defined -- Requires closed-won analysis to identify patterns and formalize criteria. Standard timeline.
- No ICP defined -- Full ICP definition project needed before scoring. Adds 15-25 hours. May recommend splitting into two phases.

**4. Number of Products / Segments**

- Single product, single ICP -- One scoring model. Standard scope.
- Multiple products or segments -- Each segment may need its own scoring model or weighted variations. Multiplies build and testing hours per model.

**5. Existing Lead Lifecycle Stages**

- Defined lifecycle stages (Lead, MQL, SQL, Opportunity) -- Scoring thresholds map directly to existing stages. Standard scope.
- No lifecycle stages -- Lead lifecycle must be defined before scoring thresholds make sense. See Lead Lifecycle playbook. Adds 10-15 hours.

**6. Historical Data Volume**

- 12+ months of closed-won/lost data with 200+ deals -- Strong validation dataset. High-confidence backtesting.
- 6-12 months with 100-200 deals -- Adequate for basic validation. Medium confidence.
- Below 6 months or fewer than 100 deals -- Insufficient for reliable validation. Consider launching model with lower confidence and iterating after 90 days of live data.

### Multiple Approaches

**Approach 1: Standard Build (Most Common)**

- Criteria: Single CRM platform, existing ICP, clean data, one product line, defined lifecycle stages
- Execution: Full project in 40-55 hours. Discovery (8-10 hrs) > Model Design (10-12 hrs) > CRM Build (10-15 hrs) > Validation & Pilot (8-10 hrs) > Training & Handoff (5-8 hrs)

**Approach 2: Data-First Build**

- Criteria: Significant data quality gaps or no ICP definition. Need enrichment and/or ICP analysis before scoring is viable.
- Execution: Phased approach, 60-80+ hours. Phase 1: Data audit, enrichment, ICP definition. Phase 2: Scoring model design and build. Phase 3: Validation, pilot, rollout.

**Approach 3: Multi-Segment Build**

- Criteria: Multiple products or buyer personas requiring different scoring criteria per segment.
- Execution: Design a scoring architecture with shared behavioral signals but segment-specific fit criteria. Build and validate each model separately. 70-100 hours depending on number of segments.

**Approach 4: Quick-Start (Minimum Viable Score)**

- Criteria: Client needs something fast -- maybe preparing for a campaign launch or SDR team expansion. Willing to iterate.
- Execution: Build a simplified model with 5-8 fit criteria and 3-5 behavioral signals. Skip extensive validation (use 90-day live data instead). 25-35 hours. Plan a scoring review at 90 days.

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Business Context**

- What GTM motion does your sales team run today? (inbound-led, outbound, hybrid, ABM overlay?)
- How many inbound leads does marketing generate per month? _(Determines volume pressure on reps)_
- What is your average sales cycle length from first touch to closed-won?
- Do you sell one product or multiple products to different buyer personas?

**Current State**

- Do you have any lead scoring in place today? If so, what platform, and what is your current MQL definition?
- How do reps currently decide which leads to work first?
- What is your current MQL-to-SQL acceptance rate? _(If unknown, that itself is a pain signal)_
- Where does the handoff between marketing and sales happen, and what does it look like?
- How would sales rate the quality of leads marketing passes over today? _(1-10 scale, with context)_

**Data & Systems**

- Which CRM and marketing automation platform are you using?
- Is website tracking installed and capturing page-level visitor behavior?
- What data fields do you currently capture on lead records? (Title, company size, industry, revenue?)
- How complete is your lead data? Approximately what percentage of leads have complete firmographic fields?
- Do you use any enrichment tools today (ZoomInfo, Apollo, Clearbit, Clay)?

**ICP & Buyer Profile**

- Do you have a documented ICP? If so, where does it live and when was it last updated?
- What are the top 3 attributes of your best customers? (Industry, size, revenue, geography, etc.)
- Are there disqualifying attributes? (Company size too small, wrong industry, competitor, student?)
- What job titles or seniority levels are your primary buyers? Secondary influencers?

**Expectations & Goals**

- What does success look like for this project at 30 days? 90 days?
- Who on your team will own the scoring model after handoff?
- Have you tried lead scoring before? If so, what worked and what failed?
- What is the timeline driver -- campaign launch, SDR hiring, board reporting, general improvement?

### Information to Gather Before Implementation

**CRM Access:**

Admin-level access to Salesforce or HubSpot. If Salesforce: include marketing automation platform (Pardot/Marketo) admin access. Sandbox environment preferred for enterprise clients.

**Historical Data Export:**

Export of all leads created in the past 12 months with: lifecycle stage, conversion dates (lead > MQL > SQL > opportunity > closed-won/lost), firmographic fields (title, company, size, industry, revenue), and source/campaign data. Minimum 200 records with known outcomes (won or lost).

**ICP Documentation:**

Any existing ICP definition, target account list, or ideal buyer profile documentation. If none exists, prepare for closed-won deal analysis in discovery.

**Current Scoring Configuration (if any):**

Screenshot or export of current scoring rules, MQL threshold definition, and automation workflows. Include any previous scoring models that were built and abandoned.

**Sales Team Input:**

Schedule 2-3 brief (30-min) interviews with SDR/BDR reps during discovery. Prep them to discuss: what makes a "good" lead, what signals they use to prioritize, and where current MQL handoff breaks down.

### Approach Decision Questions

| Question | Answer -- Approach |
|----------|-------------------|
| How complete is your lead data? | 80%+ = Standard Build, 50-79% = Data-First Build, <50% = Data-First Build |
| Do you have a documented ICP? | Yes = Standard Build, No = Data-First Build (ICP definition phase first) |
| How many products/segments need scoring? | 1 = Standard or Quick-Start, 2+ = Multi-Segment Build |
| What is the timeline? | 4+ weeks = Standard Build, <4 weeks = Quick-Start |
| Do you have 6+ months of historical deal data? | Yes = Standard Build (validation included), No = Quick-Start (iterate with live data) |

---

## 6) Overcoming Common Belief Barriers

#### "Our reps already know which leads are good."

Individual reps develop strong intuition over time. The problem is not that any one rep lacks judgment -- it is that judgment does not scale across the team. When you hire new reps, they start from zero. When inbound volume doubles, even experienced reps cannot manually assess every lead before intent decays. Only 36% of B2B organizations report that sales and marketing agree on lead scoring rules, which means two-thirds of companies lack even a shared definition of "good."

A scoring model captures the criteria your best reps already use -- company size, title seniority, pricing page visits, demo requests -- and applies those criteria consistently to every lead, 24/7. The model does not replace rep judgment; it encodes it into a system that works even when the rep is not looking.

**The reframe:** "Your best reps' instincts are exactly what we want to capture -- so the system works like them, at scale, for every rep."

#### "We tried lead scoring before and it didn't work."

Most scoring failures trace back to one of three root causes: (1) the model scored on a single axis -- either fit or engagement, but not both -- creating false positives where newsletter readers scored as high as actual buyers; (2) the model was never validated against real conversion data, so point values were arbitrary; or (3) the model was set and forgotten, degrading as the market and buyer behavior shifted.

This project addresses all three. The dual-axis model requires minimum thresholds on both fit and engagement before qualifying a lead as MQL. Historical backtesting validates the model against 200+ real leads before launch. Quarterly review is built into the handoff documentation. See Methodology for the detailed validation framework.

**The reframe:** "The model probably failed because it measured one thing instead of two. Let's build one that requires both fit AND engagement to qualify."

#### "This sounds like it will take forever and be really complicated."

A basic scoring model with 8-10 fit criteria and 5-7 behavioral signals can be built and deployed in 40-50 hours. The project does not require machine learning, custom data science work, or new tools. If the client already has HubSpot Professional or Salesforce with Pardot, the scoring infrastructure exists in the platform -- it just needs to be configured with the right criteria and thresholds.

The Quick-Start approach (see Scoping) delivers a working model in 25-35 hours that covers the highest-impact scoring criteria and iterates based on 90 days of live data.

**The reframe:** "We can have a working model in a few weeks using the tools you already have. We start simple and improve quarterly."

#### "We don't have clean enough data for this."

Perfect data is not required to start scoring. The audit step identifies which fields are complete, which have gaps, and which gaps matter most for scoring accuracy. Enrichment providers like ZoomInfo or Clay can fill firmographic gaps (company size, industry, revenue) in a single batch run. The model only needs 6-8 reliable firmographic fields and 4-5 behavioral signals to be useful.

If data quality is genuinely poor (below 50% completeness on key fields), the project is phased: enrichment first, scoring second. The important thing is to not let data imperfection prevent progress -- even a partially-informed score is better than no score at all, where every lead looks identical.

**The reframe:** "We audit what you have, fill critical gaps with enrichment, and build a model that improves as your data improves."

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Power 10 Metric | Impact Direction | Expected Magnitude | Notes |
|-----------------|------------------|--------------------|-------|
| MQL Production | -- (Neutral/Refined) | Volume may decrease as threshold filters out low-fit leads | Fewer but higher-quality MQLs; volume decrease is intentional |
| MQL-to-Opp Conversion | Increase | +20-40% | Primary impact: scored leads convert at higher rates because reps receive higher-quality leads |
| Pipeline Production | Increase | +15-25% | More MQLs convert to opportunities; higher-intent leads enter pipeline |
| Opp-to-CW Conversion | Increase | +5-15% | Secondary effect: leads that enter pipeline via scoring are better qualified and more likely to close |
| Cycle Time | Decrease | -10-20% | Reps engage leads at peak intent; less time spent on leads that were never going to buy |

### Expected Outcomes

| Metric | Before (No Scoring) | After (Scoring Deployed) | Source |
|--------|-------------------|------------------------|--------|
| MQL-to-SQL Conversion Rate | 13% (B2B average) | 25-40% | Landbase, Understory |
| Sales Rep Time on Qualification | 70%+ of time on non-selling | Automated pre-qualification reduces manual triage by 40% | Salesforce |
| Lead Response Time (for high-score leads) | 47 hours average | Under 1 hour for MQL-threshold leads | HBR |
| MQL Volume Accuracy | High false-positive rate | Scores validated against conversion data; false positives flagged in quarterly review | Project deliverable |
| Sales-Marketing Alignment | 36% agreement on lead quality | Shared scoring criteria approved by both teams | DemandScience |

### How to Measure Success

**Leading Indicators (Early signals, Week 1-4):**

- MQL-to-SQL acceptance rate (sales accepting or rejecting MQLs) -- target: 60%+ acceptance within first 30 days
- Sales rep feedback on scored lead quality via weekly survey (1-10 scale, target: 7+)
- Score distribution health: scores follow a normal-ish distribution, not all clustered at high or low end
- MQL notification-to-first-action time decreases (reps act on high-score leads faster)

**Lagging Indicators (Proof of success, Month 2-6):**

- MQL-to-Opportunity conversion rate improves 25%+ vs. pre-scoring baseline
- Time-to-close for scored leads vs. pre-implementation baseline decreases by 10%+
- Revenue per MQL increases as lead quality improves
- Quarterly scoring model review confirms score-to-conversion correlation holds (scores predict outcomes)
- Sales-marketing alignment survey shows improved trust in lead quality

---

## References

[1] Landbase - 30 Lead Scoring Statistics: Data-Driven Insights for B2B Sales Success in 2025

[2] Salesforce - New Research Reveals Sales Reps Need a Productivity Overhaul

[3] Data-Mania - MQL to SQL Conversion Rate Benchmarks 2026

[4] HubSpot Knowledge Base - Understand the Lead Scoring Tool

[5] Salesforce Ben - The Complete Guide to Pardot Score

[6] DemandScience - Lead Scoring Conflict: Sales & Marketing

[7] Understory - MQL to SQL Conversion Rates: B2B SaaS Benchmarks

[8] HBR - The Short Life of Online Sales Leads
