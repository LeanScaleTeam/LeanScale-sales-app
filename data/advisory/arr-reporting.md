# ARR Reporting — Advisory

## 1) Project Overview

### What is the name of this project?

ARR Reporting - Revenue Metric Foundation & Executive Dashboarding

### What is the purpose of this project?

This project establishes Annual Recurring Revenue (ARR) as a single source of truth inside the CRM by defining calculation rules, modeling the data fields, integrating billing systems, and building executive dashboards. The client ends up with an automated ARR reporting system that reflects live customer contracts, supports board-level metrics (net revenue retention, growth rate, forecasting), and enables cohort analysis by segment, product, region, and rep.

**Core transformation:** From "three teams calculating ARR in three spreadsheets, none of which match" to "one automated number in the CRM that Finance, Sales, and CS all trust and investors can validate."

### What ARR Reporting Unlocks

After this project is complete, the organization can:

- Report a board-ready ARR number without manual spreadsheet reconciliation
- Track ARR movement components (new, expansion, contraction, churn) in real time
- Run cohort analysis by segment, product line, region, or rep assignment
- Forecast future ARR from pipeline with automated calculations
- Reconcile CRM ARR to billing system data within minutes instead of days
- Support investor due diligence with clean, auditable ARR data

| Aspect | Before | After |
|--------|--------|-------|
| ARR Location | Lives in spreadsheets maintained by one person | Auto-calculates from live contract data in the CRM |
| Cross-functional Alignment | Finance, Sales, and CS each report different ARR | One shared ARR definition with a signed-off policy doc |
| ARR Components | No visibility into ARR components or movement | ARR bridge report shows new, expansion, churn, contraction |
| Board Reporting | Takes days of manual data pulls | Executive dashboard refreshes automatically |
| Historical Tracking | No historical tracking of ARR changes | Full change history with point-in-time snapshots |
| Billing Sync | Billing system changes go unnoticed | Automated sync with error alerting on failed syncs |

### What business outcomes does this project drive?

**Primary Outcomes:**

- Single ARR number trusted by Finance, Sales, and Customer Success -- eliminating monthly reconciliation debates
- Automated ARR calculation that recalculates on contract changes (renewal, upgrade, churn) without manual intervention
- Executive-ready dashboards showing total ARR, net ARR growth, and component breakdown accessible within 24 hours of billing system updates

**Secondary Outcomes:**

- Foundation for net revenue retention (NRR) and gross revenue retention (GRR) reporting -- "SaaS companies with high NRR grow 2.5x faster than low-NRR peers"
- Investor-ready metrics infrastructure that supports board packages and due diligence -- investors expect ARR, MRR, CAC, and LTV from Series A onward
- Data backbone for forecasting, territory planning, and compensation modeling that depends on accurate ARR data

### Who in the Org can benefit from this project?

VP of Finance, CFO, RevOps Leader, Sales Ops Manager, VP Sales, VP Customer Success, Board of Directors / Investors

### Pain Points this Project Solves

| Pain Point | What ARR Reporting Enables |
|------------|---------------------------|
| "We spend days each month pulling ARR numbers into spreadsheets" | Automated ARR calculation from live CRM data, eliminating manual pulls |
| "Finance says ARR is $5M, Sales says $4.7M, and the board deck has a third number" | One signed-off ARR definition and single source of truth in the CRM |
| "We can't break down ARR by new vs. expansion vs. churn" | Component-level tracking (new, expansion, contraction, churn) with automated classification |
| "Billing system cancellations don't show up in our CRM for weeks" | Billing-to-CRM sync with error alerting so cancellations, renewals, and expansions reflect within 24 hours |
| "We can't answer investor questions about ARR by cohort or segment" | Cohort dashboards by segment, product, region, and rep -- ready for board packs and due diligence |
| "Our monthly close takes over a week because of revenue reconciliation" | Automated reconciliation that reduces CRM-to-billing variance to under 2% |

### The Data Behind the Problem

The ARR reporting problem is widespread and costly:

- "39% of SaaS companies still use spreadsheets for revenue recognition" despite error and delay risks. Manual reconciliation generates error rates reaching 45% from miskeyed figures, omissions, and duplicated entries.
- Finance teams spend roughly 30% of their time on manual reconciliation, and 50% of finance teams still require over a week to close books due to data bottlenecks.
- ARR definition misalignment is a top-5 reporting issue. A CFO might report $3M ARR while a PM thinks it is $2.5M because one team includes training fees and the other excludes them. Without a shared definition, cross-functional planning sessions produce conflicting conclusions.
- "Failed subscription syncs cause up to 40% of involuntary churn" to go undetected, creating significant revenue leakage between the billing system and CRM.

### Key Metaphors or Frameworks

**The "Three Spreadsheets" Problem:** Every growing SaaS company eventually hits the moment where Finance, Sales, and CS each maintain their own ARR spreadsheet. All three are slightly wrong in different ways. This project replaces three spreadsheets with one automated system. Use this metaphor in early sales conversations when the client does not yet recognize the problem -- ask "How many spreadsheets does your team maintain for ARR?" and the answer is always more than one.

**CARR vs. LARR Distinction:** Contracted ARR (CARR) counts revenue at booking; Live ARR (LARR) counts revenue at go-live. Mixing these up inflates reported ARR and creates investor trust issues. Use this framework when scoping to surface which definition the client actually needs.

### Target Motion

This project is designed for **SLG (sales-led growth) and hybrid GTM motions** where revenue comes primarily from subscription contracts with defined terms. It works for both annual and monthly billing cycles.

**Strong fit for:** Companies with $3M+ ARR, subscription or recurring billing, and a need for board-level revenue reporting. Especially relevant for companies preparing for a funding round or PE acquisition where ARR data must withstand due diligence scrutiny.

**Not a fit for:** Pure usage-based pricing models without any committed recurring component (these need a different revenue recognition approach). Also not a fit for companies below $1M ARR where the ARR number can be tracked in a single spreadsheet without significant reconciliation risk.

### Common Belief Barriers

**"We already track ARR in our spreadsheet -- this project is just moving it to the CRM."** -- Moving the number is the easy part. The hard part is getting Finance, Sales, and CS to agree on one definition, automating the calculation so it stays accurate, and building the change-tracking and reconciliation infrastructure so the number stays trusted over time. A spreadsheet cannot do automated recalculation on contract events.

**"Our billing system already has this data -- we don't need it in the CRM."** -- The billing system knows what was billed. It does not know what was sold, what pipeline looks like, or how to attribute ARR to a rep, segment, or product line. Board reporting and GTM analysis require ARR data connected to the sales and customer context that only lives in the CRM.

**"We'll just build a report in our BI tool and skip the CRM work."** -- BI tools can visualize data, but they cannot enforce data quality, trigger alerts on sync failures, or provide the operational layer where reps and CSMs interact with ARR data daily. The CRM is where data hygiene happens; the BI tool is where it gets displayed.

---

## 2) Tools & Systems

### Primary Tools

**Salesforce (or HubSpot)**

System of record for ARR. Custom fields store ARR, MRR, ARR components (new, expansion, churn, contraction), and date fields on the Contract or Opportunity object. Formula fields auto-calculate ARR from contract amount and term. Validation rules enforce required field population.

**Billing/Subscription Platform (Stripe Billing, Chargebee, Zuora, or NetSuite)**

Source of truth for what was actually billed. Integration syncs subscription data (new subscriptions, renewals, cancellations, expansions) into the CRM. The billing system provides the contract-level data that feeds ARR calculations.

**Integration Middleware (Workato, Zapier, or native connectors)**

Bridges billing system to CRM. Handles field mapping, sync frequency (near-real-time vs. batch), error handling, and alerting for failed syncs. For Stripe-to-Salesforce specifically, native connectors exist but often require customization for ARR-specific fields.

**Reporting/BI Layer (Salesforce Reports & Dashboards, CRM Analytics, Looker, or Tableau)**

Visualization layer for executive dashboards. Displays total ARR, ARR bridge (period-over-period movement), cohort views, and forecasting projections. Must support drill-down capability and scheduled refresh.

**Data Providers (if applicable):**

- Standard billing data: Stripe, Chargebee, Zuora, or NetSuite
- Multi-entity / multi-currency: NetSuite or Zuora (native multi-currency support)
- Usage-based components: Metronome, Orb, or vendor-specific metering APIs

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**VP Finance / CFO (Executive Sponsor)**

- Required for: Kickoff, ARR definition sign-off, dashboard review, final handoff
- Responsibilities: Approves ARR policy document, validates ARR totals against financial records, signs off on board reporting format

**RevOps Leader / Sales Ops Manager (Technical Owner)**

- Required for: All phases -- kickoff through handoff
- Responsibilities: Provides CRM admin access, reviews data model, manages ongoing data hygiene, owns the ARR reporting process post-handoff

**VP Sales (Input Provider)**

- Required for: ARR definition alignment, dashboard review
- Responsibilities: Validates that ARR attribution to reps, segments, and products meets sales reporting needs

**VP Customer Success (Input Provider)**

- Required for: ARR definition alignment, renewal/churn classification review
- Responsibilities: Confirms churn and contraction definitions, reviews renewal tracking logic

### Technical Owners

**RevOps Lead / Salesforce Admin**

- Owns CRM configuration, field creation, and page layout updates
- Manages field-level security and sharing rules
- Runs quarterly ARR audit process post-handoff

**Finance Analyst (If Separate from VP Finance)**

- Required when Finance needs to validate ARR against recognized revenue (GAAP bridge)
- Handles monthly reconciliation between CRM ARR and billing system

**Enterprise Considerations (If Applicable)**

- Multi-entity organizations may require a Finance Controller per entity for ARR sign-off
- Companies with Sarbanes-Oxley (SOX) compliance needs may require IT Security review of field-level access and audit trail configuration

---

## 4) Scoping

### Scoping Factors

**1. Billing System Complexity**

- Single billing system (Stripe or Chargebee) with standard subscription model --> Straightforward integration, 60-80 hours
- Multiple billing systems or custom invoicing --> Complex integration, additional 20-40 hours for field mapping and sync logic
- No formal billing system (manual invoices / spreadsheet tracking) --> Requires data cleanup and manual import before automation, add 15-25 hours

**2. Revenue Model Type**

- Pure subscription (annual or monthly contracts) --> Standard ARR formula applies directly
- Hybrid (subscription + usage-based components) --> Requires separate handling for committed minimums vs. variable usage; adds complexity to both definition and calculation
- Multi-year contracts --> Requires annualization logic (total value / term) and handling of mid-term changes

**3. CRM Platform**

- Salesforce with existing Contract or Opportunity object --> Build ARR fields on existing objects
- HubSpot --> May require custom objects (HubSpot Enterprise) or workaround with deal properties
- Other CRM --> Requires custom evaluation of data model capabilities

**4. Multi-Currency**

- Single currency --> Standard formula fields
- Multi-currency with Salesforce multi-currency enabled --> Use dated exchange rates, add 10-20 hours
- Multi-currency without CRM support --> Requires custom exchange rate logic, add 20-30 hours

**5. Number of Products / Revenue Streams**

- 1-3 products --> Standard ARR component fields sufficient
- 4+ products or distinct revenue streams --> Requires product-level ARR breakdown, additional reporting layers, add 15-25 hours

**6. Board Reporting Requirements**

- Internal management reporting only --> Standard dashboard package
- Investor / board reporting with due diligence expectations --> Requires ARR bridge format, cohort analysis, and reconciliation documentation; add 10-20 hours

### Multiple Approaches

**Approach 1: CRM-Native Build**

- Criteria: Single billing system, Salesforce as CRM, standard subscription model, under 5 products
- Execution: Build all ARR logic using Salesforce formula fields, flows, and native reports. No external BI tool required. Integration via native connector or simple middleware.

**Approach 2: CRM + BI Hybrid**

- Criteria: Multiple revenue streams, complex cohort analysis needs, or existing BI investment (Looker, Tableau)
- Execution: CRM holds the ARR data model and automated calculations; BI tool handles advanced visualization, cohort analysis, and board-ready reporting. Requires data pipeline from CRM to BI.

**Approach 3: Full-Stack Integration**

- Criteria: Multiple billing systems, multi-currency, usage-based components, or enterprise-scale complexity
- Execution: Middleware orchestrates sync between billing systems and CRM. Custom objects may be required (e.g., Subscription object). BI layer on top for advanced analysis. Includes reconciliation automation and error alerting.

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Business Context**

- How do you currently calculate and report ARR? _(Reveals whether it is spreadsheet-based, which tool, and who owns it)_
- How many teams or people produce an ARR number today, and do those numbers match? _(Surfaces the "three spreadsheets" problem)_
- Who consumes the ARR number? Internal leadership only, or board / investors as well? _(Determines reporting depth required)_
- Are you preparing for a funding round or board transition in the next 6-12 months? _(Raises urgency and quality bar)_

**Current State**

- What is your current ARR definition? What counts and what does not? _(Surfaces definition alignment gaps early)_
- Do you distinguish between CARR (contracted) and LARR (live)? _(Determines which ARR type to model)_
- How do you handle multi-year contracts in your ARR calculation today? _(Tests for annualization logic needs)_
- Do you have usage-based, metered, or hybrid pricing components? _(Scoping factor for complexity)_

**Technical Environment**

- What CRM are you on and what edition? _(Salesforce Enterprise vs. Professional matters for custom objects)_
- What billing/subscription system do you use? _(Determines integration path)_
- Is there an existing integration between billing and CRM? _(Reveals current data flow)_
- Do you operate in multiple currencies? _(Scoping factor for complexity)_
- Who has admin access to both the CRM and billing system? _(Identifies technical owner)_

**Expectations**

- What does the ideal ARR dashboard look like for your board meeting? _(Defines reporting deliverable)_
- How quickly do you need ARR to update after a contract change? _(Real-time vs. batch sync decision)_
- What is the reconciliation cadence you want? Monthly? Quarterly? _(Defines governance process)_
- Who should own the ARR number going forward after this project? _(Identifies post-handoff owner)_

### Information to Gather Before Implementation

**Financial Data:**

Current ARR spreadsheet or calculation (even if inaccurate) -- needed to establish a baseline and validate the new system against known data. Include at least 3-6 months of historical data if available.

**CRM Access:**

Admin credentials for Salesforce or HubSpot. List of existing custom objects and fields related to contracts, subscriptions, or revenue. Current page layouts for relevant objects.

**Billing System Access:**

API documentation or export specifications. Sample data export showing subscription lifecycle events (new, renewal, cancellation, upgrade, downgrade). Current webhook or integration configuration if any exists.

**Contracts / Subscription Data:**

Sample of 10-20 representative contracts covering different scenarios: new, renewal, multi-year, expansion, downgrade, churn. Include any edge cases (discounts, usage-based components, partial-month starts).

**Stakeholder Alignment:**

List of all teams that produce or consume an ARR number today. Identify the executive sponsor who will sign off on the ARR definition document.

### Approach Decision Questions

| Question | Answer --> Approach |
|----------|---------------------|
| How many billing systems feed into your revenue? | 1 system = CRM-Native, 2+ systems = Full-Stack Integration |
| Do you need advanced cohort analysis or ARR bridge? | Basic = CRM-Native, Advanced = CRM + BI Hybrid |
| Do you have usage-based pricing components? | No = CRM-Native, Yes = Full-Stack Integration |
| What CRM are you on? | Salesforce Enterprise+ = CRM-Native viable, HubSpot / other = evaluate |
| Do you operate in multiple currencies? | Single = CRM-Native, Multi = Full-Stack Integration |
| Is this for internal reporting or board / investors? | Internal = CRM-Native, Board / investors = CRM + BI Hybrid or Full-Stack |

---

## 6) Overcoming Common Belief Barriers

#### "We already track ARR in a spreadsheet -- it works fine."

39% of SaaS companies still use spreadsheets for revenue recognition, and the ones that do face error rates as high as 45% from manual data entry. Spreadsheet-based ARR works until the company has more than one product line, more than one billing cycle, or more than one person updating the number. At that point, the spreadsheet becomes a liability -- it does not recalculate on contract events, it does not alert on sync failures, and it cannot support drill-down analysis by cohort.

**The reframe:** "Your spreadsheet captures a snapshot. What you need is a system that recalculates automatically when contracts change and tells you when something breaks."

#### "Our billing system already has all the revenue data."

The billing system knows what was invoiced and collected. It does not know which rep closed the deal, which product line the contract belongs to, which customer segment the account falls into, or what the pipeline forecast looks like. Board reporting requires ARR connected to the full GTM context -- sales attribution, customer segmentation, and pipeline forecasting -- which only the CRM provides.

**The reframe:** "Billing tells you what happened financially. The CRM tells you why it happened and what will happen next. Board reporting needs both."

#### "We just need a dashboard -- we don't need to change our CRM."

A dashboard visualizes whatever data you feed it. If the underlying data is inconsistent (different ARR definitions, manual updates, unsynchronized billing data), the dashboard will display incorrect numbers with confidence. This project starts with the data model and calculation logic -- getting the foundation right -- so that whatever dashboard sits on top actually reflects reality.

**The reframe:** "A dashboard on bad data is worse than no dashboard, because it creates false confidence. We fix the data first, then build the visualization."

| Belief | Reality |
|--------|---------|
| "Spreadsheet is accurate enough" | Manual reconciliation error rates reach 45%; automation cuts this to near-zero |
| "Billing system = source of truth" | Billing lacks sales context (rep, segment, product line, pipeline) |
| "Just need a dashboard" | Dashboard on bad data creates false confidence; fix the model first |
| "This is a finance-only project" | Requires alignment across Finance, Sales, CS, and RevOps |

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Power 10 Metric | Impact Direction | Expected Magnitude | Notes |
|-----------------|------------------|-------------------|-------|
| Net Revenue Retention | Measurable | Enables tracking | Cannot calculate NRR without component-level ARR tracking (expansion, contraction, churn). Median B2B SaaS NRR is 106%; top performers exceed 120%. |
| Gross Revenue Retention | Measurable | Enables tracking | Requires churn and contraction ARR components. Median GRR is 90%; enterprise companies reach 94%. |
| Pipeline Production | Indirect | +10-20% accuracy | ARR-based forecasting improves pipeline-to-close projections by connecting forecast to actual contract values. |
| Annual Contract Value | Direct | Enables tracking | ACV reporting becomes possible once ARR data model captures contract-level detail. |

### Expected Outcomes

| Metric | Before | After | Source |
|--------|--------|-------|--------|
| Time to produce monthly ARR report | 2-5 days of manual spreadsheet work | Automated, available within 24 hours | LeanScale experience |
| ARR number agreement across teams | 2-3 different numbers from Finance, Sales, CS | 1 number, one definition, one system | Project deliverable |
| CRM-to-billing ARR variance | 5-15% (unknown until reconciled) | Under 2% with automated reconciliation | Raw file target |
| Month-end close time (revenue component) | 5-10 business days | 1-3 business days | Industry benchmark |
| Board reporting preparation time | 1-2 weeks manual assembly | Hours (dashboard refresh + narrative) | LeanScale experience |
| ARR component visibility (new, expansion, churn) | Not tracked or manually estimated | Automated classification on every contract | Project deliverable |

### How to Measure Success

**Leading Indicators (Early signals, Week 1-4):**

- ARR definition document signed off by Finance, Sales, and CS within Week 2
- All CRM fields created and visible on page layouts by Week 3
- Billing system integration passing sample data accurately (tested against 20 known contracts)
- ARR dashboard showing data within 24 hours of last billing system update

**Lagging Indicators (Proof of success, Month 2-6):**

- Monthly ARR reconciliation between CRM and billing system shows under 2% variance for 3 consecutive months
- Finance uses CRM ARR for board reporting without manual adjustments
- All stakeholders (Finance, Sales, CS) reference the same ARR number in cross-functional meetings
- Zero undetected billing sync failures (alerting catches 100% of sync errors within 4 hours)
- Quarterly ARR audit spot-check of 20 contracts shows consistent treatment across all edge cases

---

## References

[1] High Alpha - Net Revenue Retention: Why It's Crucial for SaaS Growth in 2025

[2] The SaaS CFO - Essential SaaS Metrics for a Series A Fundraise

[3] Maxio - Why Revenue Recognition in Spreadsheets is a Terrible Idea

[4] ResolvePay - 17 Statistics That Prove Automated Reconciliation Slashes Month-End Close

[5] ResolvePay - 16 Statistics That Expose Reconciliation Bottlenecks in Multi-Entity Orgs

[6] Gilion - What is ARR? Definition, Formula & SaaS Examples

[7] Kaplan Group - Subscription Facts: 55 SaaS and B2B Payment Statistics for 2025

[8] Stripe - Integrate Stripe Billing with Salesforce

[9] Optifai - B2B SaaS NRR Benchmark: 97-118% by Segment
