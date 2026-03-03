# GTM Diagnostic — Advisory

## 1) Project Overview

### What is the name of this project?
GTM Diagnostic - Go-to-Market Inspection & Benchmarking

### What is the purpose of this project?
A one-week, bounded engagement that inspects a B2B SaaS company's entire Go-to-Market engine across systems, funnel processes, reporting, and performance. The diagnostic evaluates 80+ checkpoints benchmarked against the fastest-growing companies and delivers three execution-ready artifacts: a Power10 Scorecard, a color-coded Inspection Report, and a prioritized Roadmap.

**Core transformation:** From "we know something is broken but can't pinpoint what" to "we have a scored, benchmarked, and prioritized view of every GTM gap with a clear fix-it-first roadmap."

### What GTM Diagnostic Unlocks
After completing the GTM Diagnostic, leadership can:
- Pinpoint exact funnel stages where conversion rates fall below industry benchmarks
- Prioritize GTM investments based on scored impact and effort, not gut instinct
- Identify quick-win fixes (e.g., data hygiene, routing logic) that compound over time
- Benchmark 10 critical GTM metrics (Power10) against industry standards for their ARR stage
- Build a sequenced roadmap that accounts for dependencies between projects
- Align Sales, Marketing, and CS leadership around a shared view of current-state performance

| Aspect | Before | After |
|--------|--------|-------|
| Leadership alignment | Debates what's broken based on anecdotes | 80+ checkpoints scored red/yellow/green with data |
| Benchmarking | No external benchmark for metric performance | Power10 Scorecard with stage-appropriate benchmarks |
| Investment decisions | Driven by loudest voice | Prioritized roadmap ranked by impact and effort |
| Data visibility | Scattered across CRM, MAP, and spreadsheets | Consolidated analysis with cross-system reconciliation |
| Funnel definitions | Teams disagree on definitions (MQL, SQL, etc.) | Definition inconsistencies documented as findings |
| Data quality | Unknown issues silently eroding reporting | Data hygiene rated and flagged as roadmap priority |

### What business outcomes does this project drive?

**Primary Outcomes:**
- Complete visibility into GTM performance gaps across systems, process, data, and people
- Scored Power10 metrics (CAC, LTV:CAC, win rate, pipeline coverage, NRR, etc.) benchmarked against industry standards for the company's ARR stage
- Prioritized roadmap of recommended projects sequenced by impact, effort, and dependency order

**Secondary Outcomes:**
- Foundation for scoping follow-on engagement projects (the diagnostic feeds directly into SOWs)
- Cross-functional alignment between Sales, Marketing, and CS on what to fix first
- Data quality baseline that informs whether advanced reporting or automation projects are feasible yet

### Who in the Org can benefit from this project?
CEO/CRO, VP of Sales, VP of Marketing, RevOps Leader, Sales Ops Manager, Marketing Ops Manager, Head of Customer Success, CFO (for CAC/LTV metrics and investment prioritization)

### Pain Points this Project Solves

| Pain Point | What GTM Diagnostic Enables |
|------------|---------------------------|
| "We know something is broken but can't pinpoint what" | 80+ checkpoint inspection isolates specific gaps across systems, process, reporting, and performance |
| "Our CRM data is a mess and we don't trust our reports" | Data hygiene assessment rates field completeness, duplicate rates, and metric consistency across systems |
| "We have no idea if our metrics are good or bad for our stage" | Power10 Scorecard benchmarks 10 critical metrics against industry standards for the company's ARR range |
| "Leadership asks for numbers and every team gives different ones" | Metric definition audit documents inconsistencies (e.g., MQL definition in MAP vs. CRM) and recommends alignment |
| "We don't know where to invest our RevOps budget first" | Prioritized roadmap sequences projects by impact and effort with dependency mapping |
| "We have tools but aren't sure they're configured correctly" | Systems inspection evaluates CRM, MAP, and engagement tool configurations against best practices |

### The Data Behind the Problem

The GTM visibility gap is widespread and expensive:

- "Poor data quality costs U.S. businesses an estimated $3.1 trillion annually"
- "B2B databases decay at a rate of 2.1% per month, accumulating to approximately 22.5% annually. Email decay reached 3.6% per month in late 2024"
- "Only 6% of software and technology businesses have reached a scaling or systemized level of RevOps maturity"
- "Public companies with a dedicated RevOps function saw 71% higher stock performance compared to those without"
- "Organizations responding to leads within one hour achieve 53% conversion rates compared to 17% for responses after 24 hours"
- "Even a modest improvement in close rate (from 15% to 15.6%) can generate an additional $1 million in ARR"

### Key Metaphors or Frameworks

**The Annual Physical Metaphor:**

The GTM Diagnostic works like an annual physical for your revenue engine. You might feel fine, but without a comprehensive checkup with lab work (data) and benchmarks (age-appropriate norms), you won't catch silent killers early. The Power10 Scorecard is the blood panel. The Inspection Report is the full exam. The Roadmap is the treatment plan.

When to use it: When a prospect asks "why do I need a diagnostic?" or "we already know our problems." The metaphor reframes the diagnostic from redundant to essential: knowing you have high blood pressure is different from knowing your exact reading, how it compares to norms, and what to do about it.

When NOT to use it: With highly technical RevOps buyers who want specifics, not analogies. Lead with the 80+ checkpoints and Power10 framework instead.

### Target Motion

Designed for **Sales-Led Growth (SLG)** and **hybrid SLG/PLG** companies. The diagnostic evaluates the full funnel from lead capture through closed-won and post-sale retention. It applies to both inbound-led and outbound-led motions because it inspects the entire GTM engine, not just one channel.

_Not a fit for:_ Pure PLG companies with no sales team (the diagnostic assumes CRM-based pipeline and human-assisted sales stages). Pre-revenue startups without 90+ days of data. Companies without an active CRM.

---

## 2) Tools & Systems

### Primary Tools

**Salesforce or HubSpot (CRM)**
Read-only access to inspect object configurations, field completeness, picklist values, duplicate rates, lead routing rules, user adoption metrics, and opportunity stage history. The CRM is the primary data source for funnel and performance analysis.

**HubSpot, Marketo, or Pardot (Marketing Automation Platform)**
Read-only access to evaluate campaign performance, lead source tracking, scoring models, lifecycle stage definitions, and integration health with the CRM. Used to assess marketing-to-sales handoff accuracy.

**Outreach, Salesloft, or Gong (Sales Engagement)**
Read-only access to review activity capture configurations, sequence/cadence performance, and call recording metadata. Used to assess rep activity levels and engagement tool utilization.

**BI/Reporting Tools (Tableau, Looker, CRM Native Reports)**
Read-only access to inventory existing dashboards, verify metric definitions, and assess reporting coverage gaps.

**Data Providers (if applicable):**
Not directly required for the diagnostic, but the inspection notes which enrichment and intent data providers the client uses (ZoomInfo, Apollo, Bombora, 6sense) and whether they're integrated properly.

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**CEO or CRO (Executive Sponsor)**
- Required for: Results walkthrough session
- Responsibilities: Approves system access, receives final deliverables, makes go/no-go decision on roadmap projects

**VP of Sales (Input Provider)**
- Required for: Reverse demo session, results walkthrough
- Responsibilities: Walks through sales process, explains funnel stage definitions, validates findings accuracy

**VP of Marketing (Input Provider)**
- Required for: Reverse demo session, results walkthrough
- Responsibilities: Walks through marketing process, explains attribution model, provides campaign performance context

**RevOps Leader or Sales Ops Manager (Technical Owner)**
- Required for: System access provisioning, reverse demo session, results walkthrough
- Responsibilities: Grants read-only tool access, answers technical configuration questions, serves as primary contact during analysis week

### Technical Owners

**RevOps Leader / Sales Ops Manager**
- Provision and validate read-only system access for all GTM tools
- Answer configuration questions during analysis (e.g., "Is this routing rule active?")
- Troubleshoot access issues during the engagement week

**IT Administrator (If Separate)**
- When needed: In enterprise environments where RevOps does not control system access directly
- Handles: SSO provisioning, VPN access, security review of read-only permissions

**Enterprise Considerations:**
- Additional security review may be required for read-only access provisioning
- Data export may require IT approval in regulated industries
- Multiple business unit funnels may require separate stakeholder sessions per unit

---

## 4) Scoping

### Scoping Factors

**1. Number of GTM Systems**
- 3 or fewer tools (CRM + MAP + 1 engagement tool) → Standard diagnostic, lower end of hours estimate
- 4-6 tools (CRM + MAP + engagement + BI + enrichment + scheduling) → Standard diagnostic, upper end of hours estimate
- 7+ tools → Extended diagnostic, may require additional analysis days

**2. CRM Platform**
- HubSpot → Faster inspection due to unified platform (CRM + MAP in one)
- Salesforce + separate MAP (Marketo/Pardot) → Adds integration inspection layer and cross-system metric reconciliation time
- Salesforce + HubSpot (hybrid) → Additional complexity for data flow analysis between systems

**3. Data Quality**
- Clean data (>80% field completion, low duplicates) → Precise benchmarking possible
- Moderate quality (50-80% completion, some duplicates) → Directional analysis with data quality as a top roadmap finding
- Poor quality (<50% completion, high duplicates) → Data hygiene becomes the primary finding; benchmarks are estimates, not precise

**4. Number of Business Units / Funnels**
- Single funnel → Standard scope
- 2-3 funnels (e.g., SMB + Mid-Market segments) → Adds separate funnel analysis per segment
- 4+ funnels or distinct product lines → Requires scoping to determine which funnels to inspect in the one-week window

**5. ARR Stage**
- $5M-$25M → Simpler GTM stack, fewer integrations, faster analysis
- $25M-$50M → More mature stack, integration complexity increases
- $50M-$100M → Expect multiple tools per category, cross-functional data flows, and more stakeholders

**6. Stakeholder Availability**
- All stakeholders available during engagement week → On-time delivery
- Key stakeholders unavailable → May need to extend timeline or reduce reverse demo depth

### Multiple Approaches

**Approach 1: Standard GTM Diagnostic**
- Criteria: Single GTM motion, 3-5 tools, $5M-$50M ARR, stakeholders available during engagement week
- Execution: One reverse demo session, full 80+ checkpoint inspection, single Power10 Scorecard, one results walkthrough
- Hours: 20-30

**Approach 2: Extended GTM Diagnostic**
- Criteria: Multiple business units or GTM motions, 6+ tools, $50M-$100M ARR, or poor data quality requiring extra analysis
- Execution: May need separate reverse demos per business unit, extended data extraction, directional benchmarking where data quality is insufficient
- Hours: 30-40

**Approach 3: Focused GTM Diagnostic**
- Criteria: Client wants diagnostic scoped to one area (e.g., funnel only, or systems only) rather than full inspection
- Execution: Reduced checkpoint set, targeted Power10 metrics (5 instead of 10), faster turnaround
- Hours: 15-20

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Business Context**
- What is your current ARR and target growth rate for the next 12 months?
- How is your GTM team structured? (Sales, Marketing, CS headcount and reporting lines)
- What triggered the decision to run a diagnostic now? _(Identifies urgency and context -- funding round, new leader, growth stall)_
- Are there known gaps you expect the diagnostic to confirm, or is this exploratory?

**Current State**
- How do you currently define and track your funnel stages (MQL, SQL, SAL, Opportunity)?
- Are funnel definitions consistent across Sales, Marketing, and your CRM? _(Surfaces definition misalignment early)_
- What metrics does your leadership team review weekly/monthly, and where do they get those numbers?
- When was the last time someone did a full audit of your CRM data quality?

**Technical Environment**
- What CRM are you using? (Salesforce, HubSpot, other)
- What marketing automation platform is in place? Is it integrated with the CRM?
- What sales engagement tools are your reps using? (Outreach, Salesloft, Gong, etc.)
- Do you have a separate BI/reporting tool, or do you rely on CRM-native reports?
- How many integrations exist between your GTM tools? Are any known to be broken or out of sync?

**Expectations**
- Who will receive the final deliverables, and who needs to be in the results walkthrough?
- Is there internal alignment that the diagnostic may surface uncomfortable truths about data quality or process gaps?
- Are you evaluating follow-on engagement options, or is the diagnostic a standalone project?

### Information to Gather Before Implementation

**System Access:**
Read-only access to CRM (admin-level preferred for configuration visibility), marketing automation platform, sales engagement tools, and any BI/reporting tools. Access must be validated before the analysis week begins.

**Data Exports:**
Lead/contact records (with source, status, timestamps), opportunity data (with stage history, close dates, amounts), activity data (emails, calls, meetings), and marketing campaign performance (spend, leads, conversions). Minimum 90 days of history required.

**Context Documents:**
Current org chart for GTM teams, any existing funnel definitions or SLA documentation, list of active integrations between GTM tools, and any previous audit or diagnostic reports.

### Approach Decision Questions

| Question | Answer and Approach |
|----------|-------------------|
| How many distinct GTM motions or business units do you operate? | 1 = Standard Diagnostic, 2-3 = Extended Diagnostic, 4+ = Scope to priority units |
| How many GTM tools are in your stack? | 3-5 = Standard, 6+ = Extended |
| What is your ARR range? | $5M-$50M = Standard, $50M-$100M = Extended |
| Do you want a full inspection or focused on one area? | Full = Standard/Extended, Focused = Focused Diagnostic |
| How would you rate your CRM data quality? (1-10) | 7+ = Clean data, precise benchmarks; 4-6 = Moderate, directional analysis; 1-3 = Poor, data hygiene is finding #1 |

---

## 6) Overcoming Common Belief Barriers

#### "We already know what's broken -- we just need someone to fix it."

Most GTM leaders have a general sense of where friction exists: pipeline feels thin, conversion rates seem low, the CRM is messy. But "I know we have a pipeline problem" is a different statement from discovering through data analysis that "our MQL-to-SQL conversion is 11% against a 39% benchmark." The diagnostic converts directional awareness into scored, benchmarked findings that reveal which fixes generate the highest ROI. Without that specificity, teams often invest in the wrong project first -- fixing reporting when the real bottleneck is lead routing, or buying a new tool when the existing one is misconfigured.

**The reframe:** "You may know the symptoms. The diagnostic gives you the lab results -- with benchmarks -- so you fix what matters most, not just what's loudest."

#### "A one-week diagnostic can't tell us anything we don't already know."

Internal teams normalize their own inefficiencies. When your MQL-to-SQL conversion has been 11% for two years, it starts to feel normal. The diagnostic's value is the external benchmark: an objective third party scoring your GTM engine against 80+ checkpoints benchmarked to the fastest-growing B2B SaaS companies. Clients consistently report "aha moments" during the results walkthrough -- not because the findings are shocking, but because they didn't realize how far off benchmark they were. One common discovery: teams think their data quality is "fine" until the inspection reveals a 30%+ duplicate rate or critical fields missing on 40% of records.

**The reframe:** "The value isn't in telling you what you don't know. It's in showing you how your metrics compare to companies growing 2-3x faster than you."

#### "We can't afford to distract our team with another assessment."

The diagnostic is designed for minimal disruption. Total stakeholder time commitment: one 60-90 minute reverse demo session and one 60-minute results walkthrough. That's 2-3 hours total. All analysis is conducted externally using read-only system access. No one on the client team needs to pull reports, build dashboards, or do any prep beyond granting access and showing up for two meetings.

**The reframe:** "Two meetings, two hours, read-only access. You get three deliverables in a week. The ROI on your team's time is exceptional."

#### "Isn't this just a sales pitch for more consulting?"

The three deliverables (Power10 Scorecard, Inspection Report, Roadmap) are artifacts the client owns permanently. They include specific findings, benchmark comparisons, and prioritized recommendations with effort estimates. Many clients take the roadmap and execute internally. The diagnostic creates value whether or not the client engages further. That said, the roadmap does map recommended projects to LeanScale service offerings where applicable -- because the client asked for actionable next steps, and knowing who can execute them is part of being actionable.

**The reframe:** "The deliverables are yours regardless. The roadmap tells you what to fix and in what order. How you execute is your decision."

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

The GTM Diagnostic does not directly move metrics -- it identifies which metrics are underperforming and prescribes the projects that will move them. The diagnostic's impact is indirect: it accelerates time-to-fix by eliminating guesswork about where to invest.

| Power 10 Metric | Impact Direction | Expected Magnitude | Notes |
|-----------------|-----------------|-------------------|-------|
| CAC | Identifies path to ↓ | Varies by finding | Diagnostic calculates current CAC and benchmarks against stage-appropriate targets ($5M-$100M ARR: median 18-month payback) |
| LTV:CAC Ratio | Identifies path to ↑ | Varies by finding | Scored against 3:1 minimum target; median B2B SaaS is 3.2:1 |
| MQL-to-SQL Conversion | Identifies path to ↑ | Varies by finding | B2B SaaS benchmark: 39% for mid-market; many companies operate at 11-15% |
| Pipeline Coverage | Identifies path to ↑ | Varies by finding | Scored against 3-4x coverage target for the company's sales cycle |
| Win Rate | Identifies path to ↑ | Varies by finding | Benchmarked against stage and segment-appropriate norms |
| Net Revenue Retention | Identifies path to ↑ | Varies by finding | Scored against 110%+ target for expansion-capable B2B SaaS |

### Expected Outcomes

| Metric | Before | After | Source |
|--------|--------|-------|--------|
| Number of scored GTM checkpoints | 0 (no baseline) | 80+ checkpoints scored red/yellow/green | Inspection Report |
| Metrics benchmarked against industry standards | 0 (internal-only view) | 10 Power10 metrics benchmarked | Power10 Scorecard |
| Prioritized improvement projects | Ad hoc, based on gut feel | Sequenced roadmap with impact/effort scoring | Roadmap deliverable |
| Time to identify highest-ROI GTM improvement | Months of internal debate | 1 week | Diagnostic timeline |
| Cross-functional alignment on GTM priorities | Each team has its own priority list | Single prioritized roadmap shared across teams | Results walkthrough |

### How to Measure Success

**Leading Indicators (During and immediately after the diagnostic):**
- Client stakeholders express recognition and "aha moments" during the results walkthrough -- findings resonate with known pain and reveal new gaps
- Power10 Scorecard reveals at least 2-3 metrics significantly below benchmark, confirming the diagnostic was worth running
- Client requests follow-up discussion about roadmap projects within 48 hours of walkthrough

**Lagging Indicators (30-90 days post-diagnostic):**
- Client converts to paid engagement to execute 1+ roadmap projects within 30 days
- Recommended roadmap projects get prioritized and budgeted by client leadership
- Follow-on projects achieve measurable improvement in the specific Power10 metrics the diagnostic flagged as red
- Client references the diagnostic deliverables when scoping future GTM investments

---

## References

[1] ZoomInfo - The True Cost of Poor Data Quality
[2] Landbase - Data Decay Rate Statistics 2025
[3] Revenue Operations Alliance - State of Revenue Operations Report 2024
[4] Qwilr - Key Revenue Operations Statistics
[5] First Page Sage - B2B SaaS Funnel Conversion Benchmarks
[6] Union Square Consulting - The ROI of GTM Ops
[7] First Page Sage - SaaS CAC Payback Benchmarks 2025
