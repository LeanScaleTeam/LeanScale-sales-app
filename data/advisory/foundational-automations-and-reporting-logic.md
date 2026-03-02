# Foundational Automations & Reporting Logic — Advisory

## 1) Project Overview

### What is the name of this project?

Foundational Automations and Reporting Logic - Core CRM Automation and Reporting Infrastructure

### What is the purpose of this project?

This project establishes the automation backbone and reporting infrastructure inside an existing CRM (Salesforce or HubSpot) so that GTM teams can operate on reliable data instead of manual processes and ad-hoc spreadsheets. It covers lead capture flows, lifecycle stage management with date/time stamps, task assignment automation, renewal reminders, and a full suite of operational dashboards (pipeline analysis, CAC, CLV, churn, campaign performance).

**Core transformation:** From a CRM that is a glorified Rolodex with broken automations and no trustworthy reporting, to a CRM that actively drives GTM execution with automated workflows and executive-ready dashboards.

### What Foundational Automations and Reporting Logic Unlocks

After this project, the organization can:

- Track every lead from first touch through closed-won with automated lifecycle date stamps, enabling pipeline velocity analysis
- Route leads to the right rep in seconds instead of hours via automated assignment rules
- Receive proactive renewal alerts 90/60/30 days before contract end, preventing silent churn
- Pull CAC, CLV, and churn metrics from a dashboard instead of building spreadsheets every quarter
- Identify pipeline bottlenecks by stage duration instead of guessing where deals stall
- Run campaign performance reports with conversion funnels and ROI calculations on demand

| Aspect | Before | After |
|--------|--------|-------|
| Lead assignment | Manual, takes hours; leads sit unworked | Automated routing assigns leads within a minute |
| Lifecycle stages | Change without date stamps; no velocity data | Every transition recorded with timestamps for analysis |
| Renewal tracking | Spreadsheets; missed renewals cause churn | Automated 90/60/30-day reminders with task creation |
| CAC and CLV | Require 2+ hours monthly manual spreadsheet work | Dashboard-ready metrics refreshed automatically |
| Legacy automations | Deprecated Process Builders cause silent errors | Modern Flows with error handling and documentation |
| Reports | Scattered across dozens of unorganized folders | Structured hierarchy with consistent naming conventions |

### What business outcomes does this project drive?

**Primary Outcomes:**

- Reduced manual data entry time for sales reps. Sales representatives spend approximately 70% of their time on administrative tasks rather than selling.
- Reliable, real-time pipeline visibility. Companies implementing CRM for sales reporting see improvements in reporting accuracy.
- Automated lifecycle tracking with date/time stamps enabling stage-duration and conversion-rate analysis across the funnel.
- Renewal coverage with automated reminders that prevent contracts from lapsing undetected.

**Secondary Outcomes:**

- Foundation for lead scoring (separate project) because lifecycle stage timestamps and engagement data are now clean and available.
- Foundation for attribution modeling because UTM parameters and campaign membership are captured consistently.
- Data readiness for executive reporting suite because CAC, CLV, churn, and pipeline metrics are calculated and dashboarded.
- Reduced CRM technical debt by migrating deprecated Process Builders and Workflow Rules to modern Flows.

### Who in the Org can benefit from this project?

VP Sales, VP Marketing, CS Leadership, RevOps Manager/Director, Sales Ops Manager, Marketing Ops Manager, SDR/BDR Managers, Account Executives, Customer Success Managers, Finance (for CAC/CLV data)

### Pain Points this Project Solves

| Pain Point | What Foundational Automations and Reporting Logic Enables |
|-----------|----------------------------------------------------------|
| "Our reps spend more time on data entry than selling" | Automated lead capture, task assignment, and lifecycle stage transitions reduce manual CRM work |
| "We can't tell how long deals sit in each stage" | Opportunity stage hit date fields with automated timestamps enable stage-duration analysis and bottleneck identification |
| "Renewals slip through the cracks and we find out too late" | Automated 90/60/30-day renewal reminder system with task creation and notifications to Account Owners and CS Managers |
| "Our executives ask for CAC and we have to build a spreadsheet every time" | Dashboard-ready CAC and CLV reporting with channel breakdowns and trend analysis, refreshed automatically |
| "We have old Process Builders that nobody understands and nobody wants to touch" | Full automation audit, deactivation of deprecated formats, and rebuild in modern Flows with documentation. Salesforce ended support for Process Builder and Workflow Rules as of December 31, 2025 |
| "Our Salesforce and HubSpot data conflicts -- we don't know which system to trust" | Documented system ownership model with clear source-of-truth definitions, sync direction rules, and stakeholder sign-off |
| "Campaign performance data is unreliable or missing entirely" | Campaign member tracking, conversion funnel reports, ROI calculations, and channel comparison dashboards |

### The Data Behind the Problem

The operational cost of running GTM without foundational automations and reporting is well-documented:

- **Selling time lost to admin:** Sales representatives occupy only 28-30% of their time in actual selling activities, with the remaining time consumed by administrative work, data entry, and meetings. Roughly one-third of sales professionals spend an hour or more each day on data entry alone.

- **CRM automation ROI:** Businesses using CRM report an average return on investment of approximately $8.71 for every dollar invested, with initial benefits appearing within 90 days. CRM systems save 5-10 hours of employee workload per week by automating repetitive tasks.

- **Reporting accuracy:** Sales reporting accuracy improves substantially with proper CRM implementation. The majority of companies use CRM for process automation and sales reporting, yet analytics dashboards are integrated by only 35% of CRM users.

- **Churn cost of missed renewals:** Average B2B SaaS annual churn is around 3.5%, with automated payment retry recovering 70% of otherwise-lost revenue. Companies using health scoring see net revenue retention improvements of 6-12 points.

- **Deprecated automation risk:** Salesforce officially ended support for Workflow Rules and Process Builder on December 31, 2025. Organizations that have not migrated face unsupported automation logic with no bug fixes.

### Key Metaphors or Frameworks

**"The Plumbing Metaphor":** Automations and reports are the plumbing of your GTM operation. Nobody notices plumbing when it works, but when it breaks (or was never installed), nothing else in the house functions. You can buy the best furniture (sales engagement tools, ABM platforms, analytics suites), but without working plumbing, everything backs up.

_When to use:_ When a client wants to skip foundational work and jump to advanced tooling. The counter-argument is: lifecycle data quality underpins lead scoring models. Attribution requires consistent UTM capture. Executive dashboards depend on reliable underlying reports.

_When NOT to use:_ When the client already has solid CRM foundations and genuinely needs a different project. Do not force a foundational project on an organization that has already done the work.

### Target Motion

This project is designed for **Sales-Led Growth (SLG)** and **hybrid SLG/PLG** companies where the CRM is the central system of record for GTM execution. It applies to inbound-led, outbound-led, and blended motions because the automation and reporting infrastructure is motion-agnostic.

_Not a fit for:_ Early-stage startups without an existing CRM (they need CRM implementation first, a different project). Pure PLG companies where the product database is the primary system of record and CRM is secondary. Companies with fewer than 5 GTM team members where manual processes are still manageable.

### Common Belief Barriers

**"We already have automations -- we just need better reports."**

In most cases, the reports are unreliable because the automations are broken, incomplete, or use deprecated formats. A report showing pipeline by stage is useless if stage transitions are not being tracked with timestamps. Reports and automations must be built together.

**"This is just admin work -- our internal team can handle it."**

If the internal team could handle it, it would be done. The backlog exists because this work requires dedicated focus, CRM architecture expertise, and cross-functional alignment. A 3-month internal project turns into a 12-month initiative when it competes with daily firefighting.

**"We should wait until we migrate CRMs."**

Waiting creates compounding data debt. The automation logic and reporting requirements transfer across CRMs. Designing them now means the migration has a clear target state instead of migrating chaos to a new platform.

**"We don't need lifecycle date stamps -- we can just look at the stage."**

Without date stamps, you cannot measure time-in-stage, conversion velocity, or identify bottlenecks. The stage field tells you where a record is. The date stamp tells you how long it took to get there and when it moved. Pipeline analytics requires both.

---

## 2) Tools & Systems

### Primary Tools

**Salesforce**

Primary CRM for most mid-market and enterprise clients. Used for Flow Builder automation, report/dashboard creation, lifecycle stage management, and opportunity tracking. Process Builder and Workflow Rules are deprecated as of end-of-2025 and must be migrated to Flows.

**HubSpot**

Secondary CRM or marketing automation platform. Used for Workflow automation, form-to-CRM lead capture, email nurture triggers, and marketing reporting. Often paired with Salesforce where HubSpot handles marketing and Salesforce handles sales.

**Salesforce-HubSpot Integration (Native or Third-Party)**

When both systems are in play, the native HubSpot-Salesforce connector or a middleware tool (Workato, Tray.io) manages data sync. System ownership model must be defined before any automation work begins.

**Data Providers (if applicable):**

- Standard CRM enrichment: ZoomInfo, Apollo, Clearbit (for lead data completeness that feeds automation triggers)
- Marketing analytics: Google Analytics, UTM parameter tracking (for campaign attribution reporting)
- Financial data: Client's accounting/ERP system (for CAC cost inputs)

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**VP Sales (Executive Sponsor)**

- Required for: Kickoff, requirements review, dashboard sign-off
- Responsibilities: Define pipeline reporting needs, approve lifecycle stage definitions, champion adoption with sales team

**VP Marketing (Executive Sponsor)**

- Required for: Kickoff, campaign reporting requirements, UTM strategy alignment
- Responsibilities: Define campaign tracking needs, provide marketing spend data for CAC, approve marketing dashboards

**CS Leadership (Input Provider)**

- Required for: Renewal automation requirements, churn reporting definition
- Responsibilities: Define renewal reminder timing and recipients, specify churn criteria, review CS dashboards

**RevOps Manager/Director (Technical Owner)**

- Required for: All phases -- primary day-to-day contact
- Responsibilities: Provide CRM admin access, define business rules for automations, validate report accuracy, own ongoing maintenance post-handoff

**CRM Administrator (Technical Owner)**

- Required for: Build phase, QA, handoff
- Responsibilities: Execute configurations alongside the engineering team (or provide admin credentials), manage permissions, own documentation post-handoff

### Technical Owners

**RevOps Manager/Director**

- Primary technical owner for automation logic and reporting requirements
- Defines business rules that drive automation behavior
- Validates that reports reflect actual business definitions (e.g., what counts as "churn")

**CRM Administrator (If Separate from RevOps)**

- When this role is needed: When the RevOps leader is strategic-only and a dedicated admin handles CRM configuration
- What they handle: Hands-on Flow/Workflow building, field creation, permission management, ongoing maintenance

**Enterprise Considerations (If Applicable)**

- IT Security team may need to approve integration credentials and data sync rules
- Change management board approval may be required for automation changes in regulated industries
- Multiple CRM admins across business units may need coordination for shared objects

---

## 4) Scoping

### Scoping Factors

**1. Number of CRM Systems**

- Single CRM (Salesforce or HubSpot only) -- Standard scope; no sync logic needed
- Dual CRM (Salesforce + HubSpot) -- Adds system ownership model, sync rules, conflict resolution. Increases scope by 30-50%.

**2. Volume of Existing Automations**

- < 20 automations -- Audit is straightforward; 4-8 hours
- 20-50 automations -- Significant audit; 8-16 hours with potential conflicts
- 50+ automations -- Major audit requiring dedicated sprint; 16-30 hours. Likely includes deprecated Process Builders and Workflow Rules needing migration.

**3. Number of Objects Requiring Lifecycle Automation**

- Lead only -- Minimal lifecycle scope
- Lead + Contact + Account -- Standard scope
- Lead + Contact + Account + Opportunity + Custom Objects -- Extended scope; each object adds 8-12 hours for stage definitions, date stamp fields, and automation Flows.

**4. Reporting Complexity**

- Pipeline dashboards only -- ~20 hours for reporting phase
- Pipeline + CAC/CLV -- Adds financial metric calculations and data source integration; +15-20 hours
- Pipeline + CAC/CLV + Churn + Campaign Performance -- Full reporting suite; 40-50 hours

**5. Data Quality Baseline**

- Clean data (< 5% duplicates, consistent picklists) -- Standard automation build
- Moderate data issues (5-15% duplicates, some picklist mismatches) -- Requires cleanup sprint before automation; adds 10-20 hours
- Poor data quality (> 15% duplicates, inconsistent fields) -- Recommend separate Data Hygiene project first. Automations on dirty data produce unreliable results.

**6. Renewal/Customer Automation Scope**

- Basic renewal reminders only -- ~10 hours
- Renewal reminders + upsell detection + customer lifecycle -- ~25 hours

### Multiple Approaches

**Approach 1: Full Foundation Build**

- Criteria: Greenfield or near-greenfield CRM with few existing automations, all 6 parts of the implementation procedure in scope
- Execution: Linear build through Parts 1-6. Typically 80-120 hours. Best for companies that have never invested in CRM automation and reporting infrastructure.

**Approach 2: Audit and Modernize**

- Criteria: CRM has 20+ existing automations (many deprecated), reports exist but are unorganized/inaccurate
- Execution: Heavy emphasis on Part 1 (audit). Deactivate deprecated automations, rebuild in modern Flows, reorganize reports. Typically 60-90 hours. Common for companies that implemented CRM 3-5 years ago and have accumulated technical debt.

**Approach 3: Reporting-First**

- Criteria: Automations are mostly functional but reporting is nonexistent or unreliable. Executives are the primary stakeholders requesting the project.
- Execution: Light audit in Part 1, skip to Parts 5-6 (reporting infrastructure and organization). Add lifecycle date stamp fields if missing. Typically 40-60 hours.

**Approach 4: Phased Rollout**

- Criteria: Large scope (dual CRM, 50+ automations, full reporting suite) but limited budget or change management capacity
- Execution: Split into 2-3 phases. Phase A: Audit + lead automation + pipeline reporting. Phase B: Lifecycle automation + CAC/CLV/churn. Phase C: Renewal automation + campaign reporting + handoff. Total 100-140 hours spread across 3-6 months.

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Business Context**

- What is the most urgent reporting gap? (Pipeline visibility? CAC? Churn?) _This determines build priority._
- Who are the primary consumers of GTM reports today? (VP Sales? Board? RevOps?)
- How are you currently calculating CAC and CLV? (Manual spreadsheet? Not at all?)
- What triggered this project now? (New RevOps hire? Board pressure? Failed implementation recovery?)

**Current State**

- Which CRM(s) are in use? (Salesforce, HubSpot, both?) What editions/tiers?
- How many existing automations are active? Roughly how many are in Process Builder or Workflow Rule format vs. Flow?
- Are lifecycle stages defined for Lead, Contact, Account, and Opportunity objects? Are date stamp fields in place?
- Do you have an existing report and dashboard structure, or are reports ad-hoc?
- Is there a system ownership model documented for Salesforce vs. HubSpot data?

**Technical Environment**

- Who has CRM admin access today? How many admins?
- Are there existing integrations between Salesforce and HubSpot? What connector? (Native, Workato, Tray.io, custom?)
- Are there any sandbox or staging environments available for testing?
- Are there API limits or governor limit concerns? (Relevant for high-volume automation)

**Expectations**

- What does "done" look like for this project? (Working automations? Executive dashboards? Both?)
- Who needs to be trained on the new automations and dashboards?
- What is the target timeline? (Compressed 4-week sprint vs. phased over 3 months?)
- Is there a downstream project planned that depends on this foundation? (Lead scoring? Attribution? Executive reporting suite?)

### Information to Gather Before Implementation

**CRM Access and Environment:**

Admin login credentials or a named admin user who will pair on configurations. Confirmation of CRM edition/tier (determines available features). Sandbox access for testing automations before production deployment.

**Business Rules Documentation:**

Lead assignment rules (territory definitions, round-robin rules, fallback logic). Lifecycle stage definitions for each object (Lead, Contact, Account, Opportunity). Renewal/contract date field locations and formats. Churn definition (what constitutes a churned customer vs. downgrade vs. pause).

**Financial Data for Reporting:**

Marketing spend data by channel/campaign for CAC calculations. Revenue data source for CLV calculations (CRM opportunity data or external billing system). Budget period definitions (monthly, quarterly, annual).

**Stakeholder Availability:**

Minimum 2 hours/week from RevOps lead for requirements and reviews. VP Sales and VP Marketing available for kickoff (1 hour) and dashboard review (1 hour each). CRM admin available for paired configuration sessions during build phase.

### Approach Decision Questions

| Question | Answer -- Approach |
|----------|-------------------|
| How many CRM systems are in use? | 1 system = Standard scope, 2 systems = Add system ownership sprint |
| How many existing automations? | < 20 = Full Foundation Build, 20-50 = Audit and Modernize, 50+ = Phased Rollout |
| Are lifecycle date stamps in place? | Yes = Skip lifecycle phase, No = Include lifecycle automation |
| Is the primary need reports or automations? | Reports = Reporting-First approach, Both = Full Foundation Build |
| What is the available budget/timeline? | < 60 hours = Reporting-First, 60-100 hours = Audit and Modernize, 100+ hours = Full Foundation Build or Phased |
| Are deprecated automations present (Process Builder/Workflow Rules)? | Yes = Must include migration sprint, No = Can skip audit depth |

---

## 6) Overcoming Common Belief Barriers

### "We already have automations -- we just need better reports."

Reports are downstream outputs of the data that automations create. When automations are broken, incomplete, or use deprecated logic, the data feeding reports is unreliable. A pipeline report is only as accurate as the stage change automations and date stamp fields that populate it. In one common scenario, a client's "Pipeline by Stage" dashboard showed incorrect conversion rates because legacy Process Builder automations were silently failing, skipping stage transitions without logging errors.

**The reframe:** "Reports and automations are two sides of the same coin. We audit and fix automations first so that the reports you build on top of them are trustworthy."

### "This is just admin work -- our internal team can handle it."

If the internal team had the capacity and expertise, the work would already be done. CRM automation architecture requires understanding object relationships, governor limits, sync conflicts, and build-order dependencies. A RevOps manager who spends 80% of their time on daily firefighting cannot also architect a 60-100 hour infrastructure project. Additionally, an external team brings cross-client pattern recognition: "We have built this for 20+ companies and know which automation patterns break at scale."

**The reframe:** "Your team knows the business rules. We bring the CRM architecture expertise and dedicated focus to build it right the first time, so your team can maintain it going forward."

### "We should wait until we migrate CRMs."

Waiting creates compounding data debt. Every month without lifecycle date stamps is a month of pipeline velocity data lost forever. Every quarter without automated CAC reporting is another quarter of manual spreadsheet work. The automation logic and reporting requirements are CRM-agnostic -- they transfer to any platform. Designing them now gives the migration project a clear target state.

**The reframe:** "Build the blueprint now. When you migrate, you'll know exactly what needs to exist in the new system instead of migrating chaos to a new platform."

| Approach | Data Lost Per Month | Recovery Possible? |
|----------|-------------------|-------------------|
| Wait for migration (12+ months) | All stage duration data, conversion velocity trends | No -- historical timestamps cannot be backfilled |
| Build now, migrate later | None -- data captured from day 1 | Yes -- automation logic transfers |

### "We don't need lifecycle date stamps -- we can just look at the stage."

The current stage field tells you where a record is _right now_. It cannot tell you how long the record spent in each previous stage, which stages were skipped, or what the average velocity through the funnel looks like. Without date stamps, questions like "What is our average time from MQL to SQL?" and "Where do deals stall the longest?" are unanswerable from CRM data.

**The reframe:** "Stages tell you the 'where.' Date stamps tell you the 'when' and 'how long.' Pipeline analytics needs both to find bottlenecks and forecast accurately."

### "Automation will make our process feel impersonal."

Automation handles data movement and administrative tasks -- stage updates, task creation, reminder notifications, report generation. It does not replace human conversations, relationship building, or strategic decision-making. In fact, CRM automation saves 5-10 hours per week per user, freeing reps to spend more time on the high-value activities that drive deals.

**The reframe:** "Automation handles the busywork so your people can focus on the work that actually requires a human -- building relationships and closing deals."

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Power 10 Metric | Impact Direction | Expected Magnitude | Notes |
|-----------------|------------------|-------------------|-------|
| Pipeline Production | Up | +15-25% visibility improvement | Accurate pipeline reporting surfaces hidden opportunities and identifies gaps earlier |
| MQL to Opp Conversion | Up | +10-20% | Automated lead routing and lifecycle tracking reduce lead leakage and response time |
| Opp to CW Conversion | Up | +5-15% | Stage duration analysis identifies bottlenecks; stale opportunity alerts prevent deals from dying quietly |
| Sales Cycle Time | Down | -10-20% reduction | Automated task assignment and lifecycle tracking accelerate handoffs between stages |
| Gross Retention | Up | +3-8% | Automated renewal reminders prevent missed renewals; churn monitoring enables proactive intervention |
| Net Retention | Up | +2-5% | Upsell detection automation surfaces expansion opportunities to account owners |
| CAC | Down | -5-15% reduction | Campaign performance reporting identifies high-cost/low-return channels for reallocation |

### Expected Outcomes

| Metric | Before | After | Source |
|--------|--------|-------|--------|
| Time spent on manual data entry per rep per day | 1+ hours | < 15 minutes for automated processes | Salesforce State of Sales |
| Pipeline report generation time | 2-4 hours (manual spreadsheet) | < 5 minutes (dashboard refresh) | CRM.org CRM Statistics |
| Lifecycle stage timestamp coverage | 0% (no date stamp fields) | 100% of tracked objects | Project deliverable |
| CAC/CLV reporting frequency | Quarterly (manual) | Real-time (dashboard) | Project deliverable |
| Renewal coverage (reminders sent before expiry) | Ad-hoc / missed | 100% at 90/60/30 days | Project deliverable |
| Deprecated automation count | 20-50+ Process Builders/Workflow Rules | 0 (migrated to Flows) | Salesforce end-of-support |
| Report organization | Scattered across unstructured folders | Function-based folder hierarchy with naming conventions | Project deliverable |

### How to Measure Success

**Leading Indicators (Early signals, Week 1-4):**

- All automations running without errors for 7+ consecutive days
- Stage hit date fields populating correctly on 100% of new records
- Lead assignment automation routing leads within SLA (< 5 minutes)
- Renewal reminders firing on schedule for test contract dates
- All reports pulling data without manual intervention

**Lagging Indicators (Proof of success, Month 2-6):**

- 50%+ reduction in manual data entry time reported by reps
- Executive dashboards accessed weekly by leadership (track via Salesforce login reports or HubSpot dashboard views)
- CAC, CLV, and churn metrics available without manual calculation for 2+ consecutive quarters
- Zero automation errors related to deprecated Process Builder or Workflow Rule logic
- Client team self-sufficient on automation troubleshooting and report customization (measured by support ticket volume declining after handoff)

---

## References

[1] Salesforce - New Research Reveals Sales Reps Spend Less Than 30% of Time Selling

[2] B2B Reviews - CRM Statistics 2025

[3] Everstage - Sales Productivity Statistics

[4] Salesforce Ben - End of Support for Workflow Rules & Process Builder

[5] Saleslion - 32% of Sales Reps Spend an Hour or More on Data Entry Every Day

[6] CRM.org - 45 CRM Statistics You Need to Know

[7] Vitally - B2B SaaS Churn Rate Benchmarks 2025
