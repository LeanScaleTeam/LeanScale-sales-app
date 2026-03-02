# Customer Health Model — Advisory

## 1) Project Overview

**Project Name:** Customer Health Model - Multi-Dimensional Scoring System for Proactive Churn Prevention

**Purpose:** Creates a data-driven customer health scoring system combining product usage signals, CSM sentiment, support interactions, and engagement metrics into a unified score with Red/Yellow/Green thresholds.

**Core Transformation:** Shifts from reactive churn surprises driven by inconsistent CSM intuition to proactive, signal-based intervention that catches at-risk accounts 60-90 days before they churn.

### What Customer Health Model Unlocks

- Objective, data-driven account prioritization across every CSM's book of business
- Automated alerts when accounts cross health thresholds
- Drill-down visibility into which specific metrics are driving low scores
- Standardized intervention playbooks triggered by health score categories
- Foundation for predictive churn modeling and expansion opportunity identification
- Executive-level visibility into overall customer base health and trend direction

### Business Outcomes

**Primary:**
- Reduced surprise churn: accounts that churned without Red flags 60+ days prior drop by 40-50% within 6 months
- Increased CSM efficiency through objective prioritization
- Faster intervention: average time from risk signal to CSM action drops from weeks to days

**Secondary:**
- Foundation for renewal forecasting models
- Data-driven QBR conversations
- Expansion pipeline identification from consistently Green accounts
- Companies using health scoring see NRR lift of 6-12 points, particularly in mid-market SaaS

### Who Benefits

VP Customer Success, Head of Customer Operations, Customer Success Managers, CS Operations/RevOps, VP Sales, Product team, Executive team

### Pain Points Solved

| Pain Point | Solution |
|-----------|----------|
| Blindsided by churn with no warning | Automated Red-flag alerts 60-90 days prior |
| Inconsistent CSM assessments | Uniform weighted scoring model |
| Cannot prioritize book of business | Clear Red/Yellow/Green categorization |
| Leadership asks for guesses, not data | Real-time dashboards with trend visibility |
| Only react after customer complains | Proactive outreach based on declining signals |
| Data scattered across five systems | Unified health score from multiple sources |

### Data Behind the Problem

- Average B2B SaaS company experiences 3.5% annual gross churn; 1% improvement translates to $200K preserved revenue for $20M ARR company
- Companies using predictive analytics for retention experience 15-20% churn reduction
- Proactive support (outreach before escalation) reduces churn by 27% among customers experiencing problems
- Firms with dedicated CSMs see up to 25% higher NRR than those without
- B2B SaaS companies report 74% average annual retention; top performers push NRR past 120%
- "Proactive problem resolution before customer contact achieves 89% retention rates"

### Key Framework: Dashboard vs. Warning Lights Metaphor

A car dashboard monitors multiple signals continuously and lights warnings before engine failure. Customer health scoring works similarly: monitors product usage, engagement, support load, and financial signals continuously, providing warning signals (Red status) before churn occurs.

### Target Motion

Designed for SLG and hybrid SLG/PLG companies with dedicated Customer Success function. Works for both high-touch enterprise and mid-market pooled CS models.

**Not a fit for:**
- Pure self-serve PLG companies with no named CSMs
- Companies with fewer than 50 customers

### Common Belief Barriers

**"Our CSMs already know which accounts are at risk."**

CSM intuition is valuable but inconsistent and doesn't scale. Companies building health scores with research showing "no one on the team trusted it" discovered the solution wasn't skipping scoring—it involved building simple, explainable models augmenting CSM judgment alongside objective data.

**"We don't have enough data to build a meaningful health score."**

You can structure a health score with as few as 4 metrics. Start with login frequency, support tickets, renewal date proximity, and CSM sentiment. Waiting for perfect data means waiting forever while accounts churn.

**"We tried a health score before and nobody used it."**

Failed health scores typically result from two issues: too many metrics making scores uninterpretable, or no defined action based on scores. This project includes intervention playbooks and dashboard training ensuring CSMs know exactly how to act.

**"A single number can't capture customer relationship complexity."**

Correct—which is why this isn't a single number. It's a weighted composite across 5-7 dimensions with drill-down visibility into which specific metrics drive the score.

---

## 2) Tools & Systems

### Primary Tools

**Customer Success Platform** (Gainsight, ChurnZero, Vitally, Totango, Catalyst, Planhart)

- Primary execution layer where health score is built, calculated, and displayed
- Gainsight: Market leader, Leader in Gartner Magic Quadrant and Forrester Wave
- ChurnZero: Highest in health score customization with fully customizable "churn scores"
- Vitally: Fast implementation (2-3 weeks), modern UI, strong automation

**CRM** (Salesforce or HubSpot)

Source of customer account data, renewal dates, contract values, expansion history, and CSM assignments.

**Product Analytics Platform** (Segment, Amplitude, Mixpanel, Pendo, Heap)

Source of product usage signals: login frequency, feature adoption, active user counts, session duration, and license utilization.

**Support System** (Zendesk, Intercom, Freshdesk, Salesforce Service Cloud)

Source of support interaction data: ticket volume, escalation frequency, time-to-resolution, and CSAT scores.

**Data Providers (Optional)**

- Standard analytics integration: Segment
- Enterprise product analytics: Amplitude, Mixpanel
- In-app engagement: Pendo, Gainsight PX
- BI layer: Looker, Tableau, Power BI

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**VP Customer Success (Executive Sponsor)**
- Required for: Discovery, metric validation, threshold approval, final sign-off
- Responsibilities: Approves health score model, defines intervention SLAs, champions adoption

**Head of CS Operations or RevOps Manager (Technical Owner)**
- Required for: All phases
- Responsibilities: Validates data availability, owns CS platform configuration post-handoff, manages ongoing model calibration

**CS Managers (Input Providers)**
- Required for: Discovery, pilot validation, training
- Responsibilities: Share historical churn insights, validate scores, provide feedback during pilot

**Data/Analytics Engineer (Technical Support)**
- Required for: Integration phase
- Responsibilities: Provides product analytics access, configures API connections, validates data freshness

### Technical Owners

**Head of CS Operations / RevOps Manager**
- Owns CS platform health score configuration post-handoff
- Manages quarterly health score calibration reviews
- Handles metric weight or threshold adjustments

**Product Analytics Lead (If Separate)**
- When needed: When product usage data requires custom API integrations or transformations
- Handles: Event tracking implementation, data pipeline maintenance for usage signals

**Enterprise Considerations**
- IT/Security approval may be needed for new data integrations
- Data governance review may be required if health score incorporates PII or usage data subject to customer agreements

---

## 4) Scoping

### Scoping Factors

**1. Number of Customer Segments**
- Single segment: Simpler model, faster build, 40-50 hours
- 2-3 segments (Enterprise, Mid-Market, SMB): Segment-specific weights/thresholds, 50-65 hours
- 4+ segments: Significant complexity, multiple health score models, 65-80 hours

**2. CS Platform Maturity**
- Platform in production with data flowing: Focus on model design/configuration, saves 10-15 hours
- Recently implemented but not fully configured: Need to set up integrations first
- No CS platform yet: This project depends on platform implementation completing first

**3. Data Source Availability**
- All sources accessible via native integrations: Straightforward data setup
- Some sources require custom API work or CSV imports: Add 10-20 hours
- Key data sources missing: Must scope data instrumentation phase or proceed with available dimensions

**4. Historical Data Depth**
- 12+ months with churn records: Full model validation possible, highest confidence
- 6-12 months: Sufficient for initial model, plan for 6-month recalibration
- Less than 6 months: Can build directional model, flag as higher risk

**5. Number of Health Score Metrics**
- 3-5 metrics: Simple, explainable, fast to build
- 6-8 metrics: Standard complexity, good balance
- 9+ metrics: Risk of overcomplication; recommend consolidating to 7 or fewer

**6. Intervention Playbook Scope**
- Basic (Red/Yellow/Green actions): Standard inclusion, 5-8 hours
- Advanced (automated triggers, multi-step playbooks, escalation workflows): 15-20 additional hours

### Multiple Approaches

**Approach 1: Quick-Start Health Score**

Criteria: CS platform in production, product analytics available, single segment, fewer than 200 accounts

Execution: 5-7 metrics, single weight/threshold set, manual CSM sentiment input, basic dashboard. 3-4 week timeline.

**Approach 2: Standard Multi-Dimension Model**

Criteria: 2-3 segments, multiple data sources, 200-2,000 accounts, 5-15 CSM team

Execution: Full discovery with churn analysis, segment-specific weights, automated data collection, drill-down dashboards, intervention playbooks. 6-8 week timeline.

**Approach 3: Enterprise Health Score Program**

Criteria: 4+ segments/product lines, 2,000+ accounts, complex data architecture, multiple CS teams/geos

Execution: Phased rollout starting with one segment, custom API integrations, advanced dashboard suite with executive views, automated intervention workflows, formal pilot and validation. 10-14 week timeline.

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Business Context**

- What does your churn profile look like today? (Establishes baseline and reveals concentrated segments or reasons)
- How many customers churned in the past 12 months and what were primary reasons? (Identifies which health dimensions matter most)
- Do you have a renewal process today and how far in advance do you start? (Reveals whether health scoring feeds into existing workflow)
- What's your current NRR/GRR and what's the board target? (Quantifies business case and urgency)

**Current State**

- How do CSMs currently assess account health? (Reveals gap between gut-feel and data-driven approaches)
- Do you have any existing health score or risk assessment? If so, what's working and what isn't? (Avoids rebuilding, focuses on gaps)
- How are at-risk accounts identified and escalated today? (Maps current intervention workflow)
- What data sources do you currently use to understand customer behavior? (Scoping for integration work)

**Technical Environment**

- Which CS platform are you using and what tier/plan? (Determines health score module availability)
- Where does product usage data live? (Scopes data integration complexity)
- What's your support system and is ticket data accessible via API? (Confirms support dimension feasibility)
- How is billing data managed? (Determines financial dimension data path)

**Expectations**

- What does success look like 90 days after launch? (Aligns on measurable outcomes)
- Who will own the health score model after handoff? (Identifies handoff recipient and training needs)
- Are there specific accounts you'd want to test the model against? (Lines up pilot validation candidates)

### Information to Gather Before Implementation

**Data Access:**
- Admin access to CS platform
- CRM reporting permissions
- Product analytics platform read access
- Support system reporting access
- Billing system data export or API access

**Historical Data:**
- Churn list for past 12-24 months with reason codes
- Customer account list with segment/tier classifications
- Product usage data for at least 6 months
- Support ticket history by account

**Organizational:**
- CSM-to-account assignments and book sizes
- Current QBR or touchpoint cadence by segment
- Existing intervention workflows or escalation paths
- 2-3 CSMs available for pilot testing

### Approach Decision Questions

| Question | Answer → Approach |
|----------|-------------------|
| How many customer segments need distinct scoring? | 1 = Quick-Start; 2-3 = Standard; 4+ = Enterprise |
| CS platform already in production with data flowing? | Yes = Standard/Quick-Start; No = Prerequisite first |
| Have product analytics tracking in place? | Yes = Standard; No = Quick-Start with limited dimensions |
| How many total accounts need scoring? | <200 = Quick-Start; 200-2,000 = Standard; 2,000+ = Enterprise |
| Executive pressure for quick win or thorough rollout? | Quick win = Quick-Start; Thorough = Standard/Enterprise |

---

## 6) Overcoming Common Belief Barriers

### "Our CSMs already know which accounts are at risk -- we don't need a score."

CSM intuition is valuable, which is why the health model includes CSM sentiment as one dimension. But intuition alone doesn't scale and isn't consistent. Companies using "predictive analytics for retention see a 15-20% reduction in churn rates" not because data replaces CSMs, but because it surfaces signals they would otherwise miss.

**The reframe:** "We're not replacing CSM judgment -- we're giving them a co-pilot that watches all signals they can't track manually across every account, every day."

### "We don't have enough data to build a meaningful health score."

This is the most common reason companies delay. The reality is you can start with 4 metrics—login frequency, support tickets, renewal date proximity, and CSM sentiment. "A 4-metric health score that's 70% accurate is infinitely more useful than a perfect score that never gets built."

**The reframe:** "Start with what you have. An imperfect score that gets refined quarterly is far better than having no score while accounts silently churn."

### "We tried a health score before and nobody used it."

Failed health scores fail for two reasons: overcomplexity (teams build 20-30 variable models no CSM can trust) or no defined action. This project keeps models to 5-7 high-impact metrics and builds intervention playbooks ensuring CSMs know exactly what to do when a number changes.

**The reframe:** "The score failed last time because it was too complex with no action plan. We build simple scores with clear playbooks."

### "A single number can't capture the complexity of a customer relationship."

This objection is technically correct and practically irrelevant. The health score is a weighted composite with multiple dimensions that can be drilled into. The aggregate score answers "which accounts need attention now?" The dimension breakdown answers "what's specifically wrong?"

**The reframe:** "The composite score tells you WHERE to look. The dimension breakdown tells you WHAT to fix. You need both."

| Objection Pattern | Root Cause | Counter-Evidence |
|------------------|-----------|------------------|
| "We already know" | Overconfidence in intuition | Proactive analytics reduces churn 15-20% |
| "Not enough data" | Perfectionism/analysis paralysis | 4 metrics is enough to start |
| "Tried it, didn't work" | Past failure from overcomplexity | Simple models with action plans drive adoption |
| "Too simplistic" | Misunderstanding composite scoring | Multi-dimension drill-down provides complexity |

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Metric | Impact | Expected Magnitude | Notes |
|--------|--------|-------------------|-------|
| Gross Retention Rate (GRR) | Increase | +3-8% within 12 months | Proactive intervention prevents churn; companies using health scoring see 6-12 point NRR lift |
| Net Revenue Retention (NRR) | Increase | +5-12 points within 12 months | Combines churn reduction with expansion from Green accounts; top performers push NRR past 120% |
| Customer Acquisition Cost (CAC) | Indirect decrease | Indirect | Higher retention means less reliance on new logos to replace churned revenue |

### Expected Outcomes

| Metric | Before | After | Source |
|--------|--------|-------|--------|
| Surprise churn rate | 40-60% of churn events are "surprises" | <20% of churn events unflagged | Health score alert system + intervention playbooks |
| CSM intervention response time | Days to weeks (reactive) | 24-48 hours (proactive) | Automated alerts in CS platform |
| Account health visibility | Anecdotal, CSM-dependent | Real-time dashboard with Red/Yellow/Green distribution | CS platform health score dashboard |
| Health score model accuracy | N/A (no score exists) | 70%+ accuracy against historical churn within 6 months | Retrospective validation against known churn |
| QBR preparation time | 2-4 hours per account | 30-60 minutes per account | Dashboard + dimension detail views |

### How to Measure Success

**Leading Indicators (Week 1-4):**
- CSMs logging into health score dashboard daily (target: 80%+ daily active CSM usage within 2 weeks)
- Intervention actions taken within 48 hours of Red score alerts
- CSMs provide feedback that health scores match intuition for known accounts during pilot

**Lagging Indicators (Month 2-6):**
- Reduction in surprise churn (accounts that churned without Red flags 60+ days prior) by 50% within 6 months
- Gross retention rate improves by 3-5 percentage points within 12 months
- Health score model accuracy exceeds 70% when validated against renewal/churn outcomes at 6-month mark
- NRR improvement of 5-12 points from proactive intervention combined with expansion identification

---

## References

[1] Vitally - B2B SaaS Churn Rate Benchmarks 2025

[2] ChurnFree - B2B SaaS Benchmarks: A Complete Guide 2026

[3] Gartner - Customer Retention Strategies

[4] Marketing LTB - Customer Retention Statistics 2025

[5] Velaris - Essential B2B SaaS Benchmarks Every CSM Should Track

[6] Gainsight - Customer Health Scoring: Misunderstandings, Myths & Truths

[7] Vitally - How to Create a Customer Health Score with 4 Metrics

[8] The CS Cafe - Best Customer Success Platforms 2025 Comparison
