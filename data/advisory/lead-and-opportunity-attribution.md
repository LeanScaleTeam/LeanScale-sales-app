# Attribution — Advisory

## 1) Project Overview

### What is the name of this project?

**Lead & Opportunity Attribution** - Marketing Performance Measurement Infrastructure

### What is the purpose of this project?

Build technical systems and data structures to accurately and robustly measure how leads, opportunities, and revenue are being sourced. The project creates a data foundation that enables marketing and sales leadership to make informed decisions about channel performance, budget allocation, and campaign optimization.

**Core Transformation:** From making marketing decisions based on intuition and loose correlation to making data-informed strategic decisions about where to invest budget and which channels drive the best results.

### What Lead & Opportunity Attribution Unlocks

* Compare channel and campaign performance against each other with reliable data
* Determine where to invest more or less marketing budget based on actual ROI
* Report on lead quality and conversion rates by source
* Calculate CAC and LTV at the channel level
* Answer executive questions about marketing spend value with data

### Before and After

| Before | After |
|--------|-------|
| Marketing decisions based on gut feel and overall lead volume | Every strategic decision informed by channel-specific data |
| No visibility into which channels generate best leads | First-touch, MQL-touch, and latest-touch data available |
| Unable to answer "what's the ROI of paid search?" | CAC and conversion data by channel, subchannel, and campaign |
| Guessing which campaigns to cut or expand | Data-driven budget reallocation decisions |
| Marketing and sales finger-pointing on pipeline | Clear inbound vs outbound opportunity attribution |

### What business outcomes does this project drive?

**Primary Outcomes:**

* Accurate measurement of lead sourcing at channel and campaign level
* Channel and campaign performance visibility for marketing leadership
* ROI analysis by channel enabling budget optimization
* CAC analysis by channel for efficiency reporting

**Secondary Outcomes:**

* Foundation for executive reporting on marketing spend
* Data for quarterly and annual planning
* Framework for testing new channels with measurable results
* Finance-ready metrics for board reporting

### Who in the Org can benefit from this project?

| Role | Benefit |
|------|---------|
| Marketing Leadership | Channel performance visibility, budget allocation data |
| Demand Gen Leader | Campaign performance measurement, optimization insights |
| Sales Leadership | Lead quality by source, opportunity attribution data |
| Finance | CAC and LTV analysis, efficiency metrics for board reporting |
| Marketing Ops | Owns technical implementation, data quality monitoring |
| RevOps | Cross-functional visibility, unified reporting |

### Pain Points this Project Solves

| Pain Point | What Attribution Enables | Supporting Data |
|------------|--------------------------|-----------------|
| Not knowing where leads come from and which sources generate the best quality leads | Clear lead source tracking at multiple levels (Lead Source, Detail, Channel, Subchannel) | 76% of marketers struggle to determine which channels deserve credit for conversions |
| Not knowing the ROI of a particular channel or campaign | Channel and campaign level ROI analysis with first-touch and MQL-touch data | Only 36% of marketers can accurately measure marketing ROI |
| Inability to make data-driven decisions about marketing budget | Data foundation for strategic marketing decisions | Companies without proper attribution models commonly misallocate up to 30% of marketing budget |
| Executive questions about marketing spend value with no good answers | Reportable metrics on channel performance, CAC by source | 64% of CMOs say attribution directly influences budgeting decisions |
| Marketing and sales disagreement on pipeline credit | Clear inbound vs outbound opportunity attribution methodology | Removes finger-pointing through agreed methodology and data |

### The Data Behind the Problem

**Attribution Capability Gap:**

* 76% of marketers struggle to determine which channels deserve credit for conversions
* Only 31% of marketing professionals are extremely confident in the accuracy of their marketing attributions
* 42% of marketers report attribution manually using spreadsheets
* Only 39% of companies are carrying out attribution on all or most of their marketing activities

**The Cost of Poor Attribution:**

* Companies without proper attribution models commonly misallocate up to 30% of marketing budget
* 78% of B2B marketers struggle with cross-channel data integration, directly undermining attribution accuracy
* Average B2B response time is 47 hours, but 35-50% of sales go to the first responder - without attribution, you cannot optimize for this

**The B2B Complexity:**

* The average B2B SaaS deal requires 266 touchpoints and 2,879 impressions
* Typical B2B buying group involves 6-10 decision-makers
* 91% of marketers focus only on the primary decision-maker, ignoring 5-9 other influencers

**The ROI of Proper Attribution:**

* Multi-touch attribution increases attributed revenue by 23% compared to last-click models
* Companies using sophisticated attribution see 15-20% improvement in ROI
* Attribution increases budget accuracy by an average of 19%

### Key Metaphors or Frameworks

**The Flashlight Metaphor:**

Without attribution, you're poking around in the dark - you can see overall lead and pipeline performance, but you cannot drill into specific channels and campaigns. Attribution is the flashlight that lets you see where the light (and investment) should actually go.

_When to use:_ Early conversations about why attribution matters

_When NOT to use:_ Technical discussions about implementation

### Target Motion

**SLG vs PLG:** Attribution is largely agnostic to selling motion. The only requirement is that lead and opportunity stages are accurately tracked in the CRM and MAP, whether using SLG terminology (MQL, SQL) or PLG terminology (PQL, activation).

**Not a fit for:** Companies without clear lead lifecycle stage definitions. If they cannot define what constitutes an MQL or track lead stages in their systems, lead lifecycle is a prerequisite project before attribution.

### Common Belief Barriers

**"We need multi-touch attribution for optimization"**

Multi-touch attribution provides approximately 5% of the value companies seek from attribution. The other 95% comes from solid first and last touch attribution. MTA is useful for quarterly and annual planning, but not for the daily, weekly, and monthly optimization that 95% of marketing teams need. MTA requires massive data infrastructure investment, often delivers the same insights as simpler models, and is undermined by the same privacy restrictions affecting all tracking.

**"Third-party attribution tools will solve our problems"**

Third-party attribution tools range from $12,000-$130,000+ annually. Even with these tools, you still need to do most of the work outlined in this project (define taxonomy, set up UTM standards, create workflows for offline channels). The tools are beholden to the same third-party cookie restrictions as native MAP tracking. A first-party custom-built system has a higher ceiling of accuracy that third-party tools cannot reach.

**"Attribution is a set-it-and-forget-it project"**

Attribution requires 5-10 hours per month of maintenance to keep data quality at an acceptable standard. Data quality lists need monitoring at least weekly, ideally daily. Anytime new channels are introduced or new campaigns are launched, attribution tracking needs updating. First-year maintenance is particularly high.

---

## 2) Tools & Systems

### Primary Tools

**Marketing Automation Platform (HubSpot preferred)**

Where most of the attribution logic is built:

* Workflows for lead source stamping
* Forms with hidden fields for UTM capture
* Channel translator workflow
* All attribution fields created here first

**CRM (Salesforce)**

Where reporting and opportunity attribution live:

* All attribution fields replicated from HubSpot
* Primary reporting platform
* Opportunity attribution logic (inbound vs outbound)
* Field mapping with HubSpot

### Data Providers

Not typically required for attribution projects. Attribution tracks actions the lead takes, not enrichment data.

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**Marketing Leader (Executive Sponsor)**

* Required for: Taxonomy workshop, methodology alignment, final approval
* Responsibilities: Approve lead source taxonomy, sign off on inbound/outbound methodology, champion adoption

**Demand Gen Leader (Input Provider)**

* Required for: Taxonomy workshop, UTM alignment
* Responsibilities: Provide channel and campaign input, validate UTM mapping, ensure agency alignment

**Marketing Ops Leader (Technical Owner)**

* Required for: Technical collaboration throughout, ongoing maintenance
* Responsibilities: Support HubSpot build, own data quality monitoring post-launch

**Sales Leader (Input Provider)**

* Required for: Opportunity attribution methodology workshop
* Responsibilities: Agree on inbound vs outbound definitions, validate opportunity attribution approach

> **Stakeholder Reality:** This is a highly technical, complex project. Even for ops people, attribution is hard to wrap their minds around. Outside of taxonomy decisions, clients rarely have strong opinions on technical setup. Be very prescriptive and take the lead on best practices.

### Technical Owners

**Digital Advertising Manager or Agency (Critical)**

* Must align on UTM parameter standards
* Provide list of UTM values currently in use
* Commit to maintaining UTM consistency
* Cannot change UTM values without updating the system

**Web Development Team (Optional)**

* Only if implementing first-party cookie tracking
* Creates custom cookie tracking on website
* Gets legal approval for essential cookie classification

---

## 4) Scoping

### Scoping Factors

**1. Company Size/Maturity**

* Series A/B = Phased approach, cut optional features (grouping fields, first-party cookies)
* Series C+ = Full build-out with all options, advanced inbound/outbound methodology

**2. Marketing Spend Level**

* Higher spend = Higher priority for attribution (more value from optimization)
* Lower spend = Still important but less urgent

**3. Channel Diversity**

* Many channels and ad platforms = Larger project, more workflow branches
* Offline channels (events, trade shows) = Requires non-evergreen workflow templates
* Few channels = Faster project, simpler channel translator

**4. Tech Stack**

* HubSpot + Salesforce = Standard approach
* Non-HubSpot MAP = Requires adjustment (Marketo possible, discouraged without MAP)
* No MAP = Would need to build in CRM only (possible but harder)

**5. SLG vs PLG**

* Minimal impact on approach
* Main requirement: Clear lead/opportunity stage tracking with defined MQL equivalent

**6. Number of Agencies**

* Multiple agencies = Higher UTM alignment complexity
* Single internal team = Simpler alignment

### Multiple Approaches

**Approach 1: Full Build (Series C+)**

* Criteria: Series C+ maturity, significant marketing spend, diverse channels
* Execution: All fields including grouping, first-party cookie tracking, advanced inbound/outbound methodology
* Timeline: 70+ hours

**Approach 2: Core Build (Series A/B)**

* Criteria: Series A/B maturity, limited budget, focused channels
* Execution: Core attribution fields only, skip grouping and form URL tracking, use HubSpot out-of-box tracking, simple inbound/outbound methodology
* Timeline: 50-60 hours

**Approach 3: Build vs Buy Decision**

* Always recommend building over buying (10/10 times)
* Third-party tools cost $12,000-$130,000+ annually
* Still need to do most of this project even with third-party tools
* First-party custom-built system has higher accuracy ceiling

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Prerequisites & Current State**

* Are your lead lifecycle stages clearly defined? Can they be accurately reported on in your CRM or MAP?

  _(If not, lead lifecycle is a prerequisite project. You cannot measure where leads come from if you cannot measure leads.)_

* Are you able to report on lead, opportunity, and revenue volume by channel/source today? If so, can you share links to those reports?

* Do you have any existing documentation around your lead source/channel taxonomy?

* Do you have any standardization around how you are using UTM parameters?

* Do any custom automations or custom fields that store attribution data exist today?

**Stakeholder & Agency**

* Who manages your digital advertising platforms? (internal team or agency)
* Are you working with multiple agencies? Do they use different UTM conventions?
* Who manages the development of your company's marketing website?

**Prioritization & Scope**

* What is the level of spend allocated to marketing from advertising and programs perspective?
* How many channels are you currently using?
* How many ad platforms?
* Are you using offline channels like events, trade shows, or webinars?

### Information to Gather Before Implementation

**Lead Lifecycle:**

Lead stage definitions (what constitutes a lead, MQL, SQL, Opportunity) with clear criteria

**Channels:**

All channels and subchannels currently being used (Paid Search, Paid Social, Organic, Events, etc.)

**Lead Sources:**

All lead sources/actions a lead can possibly take today (Demo Request, Contact Us, Content Download, Webinar Registration, etc.)

**UTM Standards:**

Current UTM values being used by internal team and agencies (if any exist)

### Approach Decision Questions

| Question | Answer / Approach |
|----------|-------------------|
| Company maturity level | Early stage (A/B) = Simplified approach; Series C+ = Comprehensive approach |
| Marketing program budget | $10k/month = Attribution less urgent; $100k/month = Attribution highly important |
| Channel diversity | Wide variety online AND offline = Medium to heavy lift; Few online channels = Lighter lift |
| Lead lifecycle tracking in place? | No = Lead lifecycle prerequisite first; Yes = Proceed with attribution |

---

## 6) Overcoming Common Belief Barriers

### "We need multi-touch attribution for optimization"

Multi-touch attribution gives you 5% of the value you're looking for. The other 95% comes from solid first and last touch attribution. MTA is useful for quarterly and annual planning - understanding that a lead saw a webinar before requesting a demo adds context to planning cycles. But for daily, weekly, and monthly optimization, which is what 95% of marketing teams need, MTA does not help.

MTA also requires massive data infrastructure investment. A brand that invested heavily in building an MTA system found their model showed only 10% of conversions involved multiple touchpoints - effectively delivering the same results as last-click attribution.

**The reframe:** "MTA sounds sophisticated, but it solves the wrong problem. You need to optimize weekly, not quarterly. First and last touch gives you that. Let's build the foundation that actually helps you make decisions."

### "Third-party attribution tools will solve our problems"

Third-party attribution tools range from $500/month at the low end to $90,000-$133,000/year at the enterprise level. Even with these tools, you still need to:

* Define your lead source and channel taxonomy
* Set up UTM standards and enforce them
* Create workflows for offline channels
* Build inbound vs outbound methodology

The tools are also beholden to the same third-party cookie restrictions as native HubSpot tracking. With Apple's opt-out rates for third-party cookies starting at 95% (now stabilized at 25-46%), third-party tools face the same tracking limitations.

A first-party custom-built system can classify cookies as "essential" with legal approval, bypassing opt-out restrictions entirely. This creates a higher ceiling of accuracy that third-party tools cannot reach.

**The reframe:** "Even with a $100k tool, you'd still need to do 80% of this project. Let's build it in-house for a fraction of the cost with better accuracy."

### "Attribution is a set-it-and-forget-it project"

Fair to assume 5-10 hours per month should be spent purely on maintenance to keep data quality at an acceptable standard. Data quality lists need monitoring at least weekly, ideally daily. First-year maintenance is particularly high as you:

* Fix issues that arise
* Align all stakeholders on processes
* Add new channels and campaigns
* Respond to UTM changes from agencies

Anytime new channels are introduced or new campaigns are launched, someone who deeply understands the data and systems needs to update the attribution tracking.

**The reframe:** "This is infrastructure, not a one-time project. Would you expect your Salesforce instance to never need maintenance? Attribution is the same. The good news: maintenance decreases over time as everyone learns the system."

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Power 10 Metric | Impact Direction | Expected Magnitude | Notes |
|-----------------|------------------|--------------------|-------|
| Marketing Spend Efficiency | Increase | +15-20% ROI improvement | Better budget allocation through channel performance data |
| Pipeline Production | Increase | Indirect | Data-driven investment in higher-performing channels |
| MQL to Opp Conversion | Measurable | Visibility only | Attribution enables tracking, not direct improvement |
| CAC | Decrease | Up to -19% budget misallocation | Reduces spend on underperforming channels |

### Expected Outcomes

| Metric | Before | After | Source |
|--------|--------|-------|--------|
| Source budget allocation accuracy | Based on intuition | Based on channel performance data | Proper attribution reduces wasted ad spend by 27% |
| Ability to answer "where do leads come from" | Guessing or incomplete | First-touch, MQL-touch, latest-touch data available | Internal measurement |
| Marketing leadership confidence in data | Low (only 31% confident in attribution accuracy) | High (data-backed decisions) | Internal measurement |
| Time to produce channel reports | Hours of manual work | Dashboard available | Internal measurement |

### How to Measure Success

**Leading Indicators (Week 1-4):**

* All forms have hidden UTM fields
* Channel translator workflow routing correctly
* First-touch fields populating on new leads
* Data quality lists showing zero or near-zero members

**Lagging Indicators (Month 2-6):**

* Marketing leadership using dashboards for decisions
* Budget reallocation conversations referencing attribution data
* Data quality lists staying at low member counts
* Ability to report on CAC and ROI by channel

---

## References

[1] McKinsey 2024 Digital Marketing Survey - 76% of marketers struggle to determine which channels deserve credit for conversions

[2] Ruler Analytics - Marketing Attribution Statistics 2025 - Only 36% of marketers can accurately measure ROI; 42% report attribution manually using spreadsheets

[3] Digital Marketing Institute - Companies without proper attribution models commonly misallocate up to 30% of marketing budget

[4] Marketing LTB - Marketing Attribution Statistics 2025 - Attribution increases budget accuracy by 19%; 64% of CMOs say attribution directly influences budgeting decisions

[5] RevSure - State of Marketing Attribution 2024 - Only 31% of marketing professionals are extremely confident in attribution accuracy

[6] 6sense - 2024 B2B Marketing Attribution Benchmark - 78% of B2B marketers struggle with cross-channel data integration

[7] HBR - The Short Life of Online Sales Leads - Average B2B response time; 35-50% go to first responder

[8] HockeyStack - 2024 B2B Customer Journey Report - Average B2B SaaS deal requires 266 touchpoints and 2,879 impressions

[9] Gartner - Typical B2B buying group involves 6-10 decision-makers

[10] RevSure - State of B2B Marketing Attribution 2025 - 91% of marketers focus only on primary decision-maker

[11] Channel99 - Pros and Cons of Multi-Touch Attribution - MTA often delivers same results as last-click attribution

[12] Ruler Analytics - Marketing Attribution Software Pricing - Attribution tool pricing ranges from $199/month to $133,000/year
