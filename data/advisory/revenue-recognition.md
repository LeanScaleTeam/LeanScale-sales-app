# Revenue Recognition (Quote to Cash)

## 1) Project Overview

### What is the name of this project?

RevRec - Quote-to-Cash Revenue Reporting Architecture

### What is the purpose of this project?

RevRec creates six calculated fields with workflow logic in Salesforce that allow a company to accurately report on revenue across every deal scenario: new business, expansion, contraction, renewal, and churn. The project bridges the gap between how a business operates (contracts, quotas, commissions) and how finance needs to recognize and report revenue.

The pre-work -- defining the golden number, mapping the operating plan, aligning quotas and commissions -- is the hard part. The technical build is straightforward once alignment is achieved.

**Core transformation:** From "we don't know what our revenue number actually means" to every team in the org pulling from the same six fields that match the company's operating plan, commission structure, and financial reporting needs.

### What RevRec Unlocks

- Ability to see revenue metrics (net retention, forecasting numbers) that Salesforce cannot show natively
- Accurate commission calculations that do not break when contractions occur
- Clean separation of "net new ARR" vs. "net ARR" for sales vs. CS/AM teams
- Contract ARR tracking across multiple expansions for accurate renewal calculations
- Foundation for quota and commission infrastructure -- most GTM teams need RevRec fields before they can calculate quotas and commissions
- Revenue movement tracking across all deal types regardless of timing (upsell, contraction, churn, new business)

### What business outcomes does this project drive?

**Primary Outcomes:**

- Accurate revenue reporting across all deal types (new, expansion, contraction, renewal, churn)
- Clean commission calculations that separate sales-owned vs. CS-owned metrics
- Correct renewal amounts based on contract ARR (sum of all active contracts)
- Normalized ACV/TCV reporting for multi-year deals
- Quota and commission calculation infrastructure -- RevRec fields are the foundation

**Secondary Outcomes:**

- Foundation for accurate forecasting and pipeline analysis
- Net retention calculation capability (median NRR for B2B SaaS is 106%; RevRec fields are required to measure it)
- Alignment between finance, sales, and CS on revenue definitions
- Onboarding documentation (bookings policy) for new hires in finance, sales, and RevOps
- Audit readiness -- revenue recognition issues accounted for 12% of all financial restatements from 2005-2024; proper RevRec reduces restatement risk
- Sets the stage for executive-level metrics and board reporting

### Who in the Org can benefit from this project?

**Finance Team / Controller** -- Owns the golden number and operating plan. Defines how revenue is recognized. Primary consumer of RevRec outputs. Required from day one.

**CEO** -- Runs the operating plan process. Needs RevRec for board reporting and fundraising materials.

**VP Sales / Sales Managers** -- Need net new ARR for forecasting and commissions. Must understand what reps do and do not get penalized for.

**CS / Account Managers** -- Own churn and net ARR. Need clear rules on expansion and renewal handling.

**RevOps / Sales Ops** -- Implementation partner. Builds and maintains the system. Uses fields for reporting and automation.

**Marketing (Operating Plan Participants)** -- Involved in operating plan discussions around pipeline and revenue targets.

### Pain Points this Project Solves

RevRec is foundational infrastructure that enables multiple downstream capabilities. The specific pain it solves depends on what the company is trying to unlock.

| Pain Point | What RevRec Enables |
|---|---|
| **"50 million what?"** -- Teams can't articulate what their revenue number actually means. Most teams don't know. When they do, it's often not obvious. It's custom to the way they view the business. | Golden number alignment: clear definition of what metric the business is tracking, with shared terminology across all teams |
| **Commission forecasting breaks when contractions happen** -- Net ARR goes negative for sales, distorting their forecasts and commission calculations | Net new ARR field only takes positive values; negatives go to the CS/AM side via net ARR. Two separate views, one for each team. |
| **Can't figure out the correct renewal amount** after multiple expansions -- which deal do you use as the master? | Contract ARR tracks the total sum of all active contracts to build accurate renewal amounts |
| **Staggered renewal dates** from multiple contracts with different end dates -- renewal tracking becomes a nightmare | Co-terming best practice aligns all expansion end dates to the original contract date. Bookings policy codifies the rule. |
| **Reps create their own rules** for expansions, renewals, and contract management because no bookings policy exists | Bookings policy document defines clear rules for what reps can and cannot do. Serves as onboarding reference for new hires. |
| **Finance cannot recognize revenue** until services are delivered/installed, and no tracking exists to notify them | RevRec builds the tracking infrastructure connecting service delivery to financial recognition (hardware installation, hours delivered, usage metering) |
| **Churn ownership is politically loaded** -- no one agrees on who gets penalized | Net ARR vs. Net New ARR breakouts separate churn impact from new business performance by default |

### The Data Behind the Problem

Revenue recognition errors and misalignment are not edge cases -- they are pervasive across B2B SaaS:

- **Revenue leakage:** SaaS companies lose an average of 4-10% of revenue to leakage annually. For enterprise companies (1,000+ employees), that number rises to 20%.
- **Financial restatements:** Revenue recognition issues accounted for 12% of all Big R financial restatements from 2005 to 2024. Big R restatements occur at a rate of approximately 3% per year across public companies.
- **Manual process errors:** 55% of finance professionals report inaccuracies from manual revenue recognition processes. 39% of SaaS companies still use spreadsheets for revenue recognition.
- **Metric misalignment:** Bookings is not a GAAP-defined term and its definition varies by company. ARR is not a GAAP-recognized metric, so its calculation varies across the SaaS and VC communities. Without standardized definitions, marketing, sales, CS, and finance all operate from different numbers.
- **Churn ownership ambiguity:** In a ChurnZero industry poll, 63% of respondents said Customer Success should own renewals while only 13% said sales should. This split creates friction in companies that have not explicitly defined ownership, which directly impacts how RevRec fields must be configured.
- **Fundraising dependency:** Investors require operating plans with clear revenue models during due diligence. They evaluate MRR, ARR, and retention rates as core metrics. Companies that cannot produce clean revenue data face longer diligence periods.

### Key Metaphors or Frameworks

**"The Golden Number"** -- The single most important framing device in RevRec. It positions the entire project as starting from one question: "You say you want to hit $50M this year. $50M _what_?"

The golden number forces definition alignment before any technical work begins. Use it in the first meeting to anchor the conversation. It works because it is non-threatening (who doesn't want to define their target?) while exposing the alignment gap that justifies the project.

**When to use it:** In every kickoff and discovery conversation. It sets the tone that RevRec is a business alignment project, not just a CRM configuration.

**When NOT to use it:** If the client has already documented a clear bookings policy and revenue definitions (rare, but possible). In that case, move directly to the operating plan review.

### Target Motion

Most relevant for companies with **sales-led or hybrid (SLG + PLG)** motions, especially those with enterprise deals or high average contract values.

- **Enterprise SLG:** RevRec complexity increases with multi-year contracts, multi-product catalogs, and co-terming requirements. This is where the full six-field model is critical.
- **Hybrid (SLG + PLG):** Companies with both sales-led committed revenue and product-led self-serve revenue need to distinguish "bookings" (signed deals) from total revenue. RevRec fields must account for both.
- **PLG-only at scale:** Even product-led companies need RevRec once they add enterprise contracts, custom pricing, or usage-based billing. The trigger is typically a recognition event that finance needs tracked (hardware installation, hours delivered, usage metering).

**Not a fit for:** Pure PLG companies under $5M ARR with simple monthly subscription billing and no enterprise contracts. At that scale, standard billing platform reporting (Stripe, Chargebee) is sufficient.

## 2) Tools & Systems

### Primary Tools

**Salesforce (SFDC)** -- Primary CRM where RevRec fields, workflows, and opportunity types are built. The six RevRec fields with workflow logic are the core deliverable. Uses Opportunity Record Types and Opportunity Types to establish the logic behind revenue movement calculations.

**Excel / Google Sheets** -- Where operating plans typically live (finance-built). Used for RevRec mapping before implementation. The mapping spreadsheet shows how each field behaves across every deal scenario.

**Salesforce Contracts** -- Critical for RevRec. Contract ARR must be built from contract objects, not just opportunities.

**CPQ (Configure, Price, Quote)** -- RevRec installation should be configured alongside CPQ. Product catalog and territory structure must be built to support regional and product-type revenue reporting. RevRec accompanies CPQ 60-70% of the time.

**Runway** -- Platform for operationalizing operating plans. Handles scenario planning, hiring, and expenses. Relevant for discovery when clients need more than a spreadsheet for their operating plan.

**Metronome (conditional)** -- Usage-based metering tool. Only relevant if the client has usage-based pricing that requires metering before revenue can be recognized. Not needed for standard subscription models.

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**Finance Team / Controller (Executive Sponsor / Input Provider)**

- Required for: Phase 1 pre-work and alignment, ongoing review
- Responsibilities: Defines the golden number, provides the operating plan, approves revenue recognition definitions. Must be involved from day one.

**CEO (Executive Sponsor)**

- Required for: Operating plan walkthrough, strategic sign-off
- Responsibilities: Runs the operating plan process. Brings in ops, accounting, and marketing as needed. Final authority on revenue targets.

**VP Sales / Sales Leader (Input Provider)**

- Required for: Quotas and commissions alignment
- Responsibilities: Provides quota structure, defines what reps should and should not be penalized for, validates net new ARR logic for forecasting and commissions.

**CS / Account Management Leader (Input Provider)**

- Required for: Churn ownership definition, renewal and expansion rules
- Responsibilities: Defines who owns churn. Validates net ARR logic. Provides input on co-terming policy and expansion handling rules.

**RevOps / Sales Ops (Technical Owner)**

- Required for: All phases -- discovery through maintenance
- Responsibilities: Primary implementation partner. Maintains the system post-launch. Owns the bookings policy document ongoing.

### Technical Owners

**RevOps Manager / Salesforce Admin**

- Owns the Salesforce configuration (fields, workflows, opportunity types, record types)
- Maintains RevRec fields and bookings policy after project completion
- First point of contact for edge cases and field logic questions

**Finance Analyst (If Separate from Controller)**

- Needed when the finance team is large enough to have a dedicated analyst
- Handles the operating plan detail and ongoing reconciliation between RevRec outputs and financial reporting

## 4) Scoping

### Scoping Factors

**1. Standalone vs. CPQ accompaniment**

- RevRec standalone: focused scope
- RevRec with CPQ: full quarter of work. Six to seven out of ten times it is accompanied by CPQ.
- Decision driver: Is the client implementing CPQ? If yes, RevRec becomes a component of the larger project.

**2. Team size and organizational complexity**

- Small team: Simple field creation, minimal stakeholder alignment.
- Larger team: More circulating of docs, more meetings to get alignment, more opportunity types and record types to map.

**3. Revenue model complexity**

- Single product, single region: Straightforward mapping, fewer edge cases.
- Multi-product, multi-region, multi-currency: Significantly more complex. Taxes, currency conversion, and regional breakouts all must be accounted for in the RevRec fields and operating plan mapping.

**4. Contract structure**

- Co-termed contracts: Best practice, simpler renewal tracking, cleaner Contract ARR.
- Multiple contract end dates (staggered): Creates renewal tracking problems. May require a policy change as part of the project.
- No contracts in Salesforce (opportunities only): Blocker. Contract objects must be set up before RevRec can be built properly.

**5. Enterprise motion and multi-year deals**

- Short-term deals (annual): Simpler ACV/TCV. ACV often equals recurring amount.
- Multi-year / large enterprise deals (e.g., 5-year, $100M): TCV/ACV distinction is critical. ACV = TCV / term length.

**6. Who owns churn**

- CS owns churn (most common): Net new ARR only takes positives for sales; net ARR captures negatives for CS/AM.
- Sales owns churn: Different field logic and commission implications.
- No one owns churn (undefined): Must define before building. This is a pre-work blocker.

**7. Revenue recognition trigger type**

- Subscription-based (standard): Recognition at contract signing or activation.
- Hardware installation: Cannot recognize until hardware is physically installed.
- Hours/services delivered: Recognition as hours are logged.
- Usage-based metering: Requires metering infrastructure (Metronome or similar).

### Multiple Approaches

**Approach 1: RevRec Standalone - Simple**

- Criteria: Small team, single product, single region, clear revenue definitions already exist
- Execution: Focused pre-work, build 6 fields with logic

**Approach 2: RevRec Standalone - Standard**

- Criteria: Client only needs revenue reporting fields; not doing CPQ; moderate complexity (multiple products or regions, churn ownership unclear, no bookings policy)
- Execution: Full pre-work sequence (golden number, operating plan, quotas/commissions, bookings policy), build 6 fields with logic

**Approach 3: RevRec with CPQ**

- Criteria: Client is implementing CPQ and needs RevRec as part of the project
- Execution: RevRec becomes a component of the larger CPQ implementation. Product catalog and territories must be built to support RevRec reporting.

## 5) Discovery Questions

### Questions for Project Kickoff

**Golden Number (Revenue Definition)**

- "You say you want to hit $[X]M this year. $[X]M _what_?" -- What is the exact number you're trying to hit and how is it defined? (Revenue, bookings, ARR, MRR, ACV, TCV?)
- How does your finance team define this number?
- Is this number annualized or total contract value?
- Monthly? Quarterly? Per product? Per region? Per segment?
- How is commission calculated/reported? Is this based on the golden number?

**Operating Plan**

- Can you walk us through your operating plan? _(Ask for a reverse demo/walkthrough FIRST -- have the client present their current state before presenting anything)_
- What are the key components of the revenue portion of your model?
- What regions are you breaking out? (US, international, specific markets?)
- How are you splitting revenue by product type?
- Are there currency considerations?
- Many teams only track 'SQLs' and 'bookings' vs. the full funnel -- what does your tracking look like currently?

**Quotas & Commissions**

- Ask for a reverse demo/walkthrough of quotas and commission plans
- How are quotas and commissions built?
- Who owns churn? (CS, Account Managers, or Sales?) _(This is always a loaded topic -- approach carefully)_
- If a customer downgrades, does the salesperson get hit?
- What are the expansion/renewal rules for reps?

**Contract Management**

- Are you using contracts in Salesforce or just opportunities? _(Contracts are required for RevRec)_
- Do you co-term expansions or create new contracts?
- What opportunity types and record types are you using?

**Bookings Policy**

- Do you have a defined bookings policy?
- If there are three months left on a contract and the customer wants to add users, do you prorate or renew all licenses?
- Are POCs counted as ARR?
- What are the rules for sales-led committed vs. pay-as-you-go revenue?

**Revenue Recognition Trigger**

- Do you have everything set up to track the services that are delivered or rendered so finance can recognize the revenue?
- What triggers revenue recognition in your business? (Contract signing, hardware installation, hours delivered, usage metered?)
- Do you sell hardware and software together? (Compound recognition scenarios)
- Is any of your pricing usage-based? (May require metering infrastructure)

### Information to Gather Before Implementation

**The Golden Number:** The exact revenue metric the company is tracking and how it's calculated. Almost every customer struggles to provide this on the first ask. Do not skip this step.

**Operating Plan Access:** Request the actual operating plan document/spreadsheet. Get a walkthrough meeting (reverse demo). Look for: revenue breakouts by product, region, and team.

**Quota and Commission Structure:** How quotas are built and who gets credit or penalized for what. The critical question: who owns churn? This determines the net new ARR vs. net ARR field logic.

**Bookings Policy:** If one exists, get it. If not, it must be created as part of the project. Cover: co-terming rules, expansion handling, POC treatment, what counts as ARR.

**Salesforce Configuration:** Current opportunity types, record types, and whether contract objects are in use. If no contracts exist, that is a blocker.

## 6) Overcoming Common Belief Barriers

**"We can skip the pre-work and just start mapping the fields."**

Most teams want to jump directly to the technical mapping and field creation. But the pre-work -- getting the golden number, understanding the operating plan, aligning quota and commission structure -- is what determines whether the RevRec build actually maps to how the business thinks about revenue. Without it, you build fields that don't match the company's operating reality. Every dollar of RevRec value comes from alignment, not from the field logic itself.

**The reframe:** "The mapping is the easy part. The hard part is making sure we're all talking about the same number. Let me walk you through what we need first."

**"We should extend the contract term on expansions instead of co-terming."**

Some teams think creating a new full-term contract for each expansion guarantees longer revenue commitments. In practice, it creates staggered renewal dates (e.g., 3 licenses renewing in 6 months, 2 more in 12 months) that create a nightmare for both the customer experience and internal renewal management. Co-terming -- matching all expansion end dates to the original contract -- is established best practice across B2B SaaS.

**The reframe:** "Co-terming is easier for the customer and for your renewal management. Let's define clear rules in a bookings policy so reps know exactly what to do."

**"Everyone on our team already knows what our revenue target means."**

They almost certainly do not. Revenue, Bookings, ARR, MRR, ACV, TCV are common terms, but each depends on how the finance team specifically defines them. Different teams within the same company routinely use different definitions without realizing it. Unless you have a written document that defines these terms and every team has signed off on it, there is a definition gap.

**The reframe:** "Let's do a quick exercise -- I'll ask your head of finance, VP of sales, and CS lead to each define your target number independently, and we'll compare. You'll be surprised."

**"We don't need a bookings policy -- it's obvious how to handle expansions."**

It is not obvious. Without documented rules, reps create their own interpretation of how to handle expansions, co-terming, POCs, and renewals. Every rep doing it differently means inconsistent data, which means RevRec fields produce inaccurate outputs. The bookings policy is not bureaucracy -- it is the operating manual that makes RevRec work.

**The reframe:** "Think of the bookings policy as the instruction manual for your reps. Without it, every rep is writing their own manual, and your data reflects that."

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Power 10 Metric | Impact Direction | Expected Magnitude | Notes |
|---|---|---|---|
| Net Retention | Measurable for first time | N/A (enables measurement) | RevRec fields are a prerequisite for calculating net retention. Median B2B SaaS NRR is 106%; enterprise segment targets 115-125%. |
| Gross Retention | Measurable for first time | N/A (enables measurement) | Requires clean churn and contraction tracking from net ARR field |
| Forecasting Accuracy | Improve | Directional | Separating net new ARR from net ARR prevents negative values from distorting sales forecasts |

### Expected Outcomes

| Metric | Before | After | Source |
|---|---|---|---|
| Revenue reporting accuracy | Manual spreadsheets, inconsistent definitions across teams | Six fields with workflow logic, single source of truth in Salesforce | Industry standard |
| Commission calculation | Breaks when contractions occur; sales gets penalized for churn they don't own | Net new ARR separates sales metrics from CS metrics; commissions calculate cleanly | Industry standard |
| Renewal amount accuracy | Unknown -- based on original deal, not total contract value | Contract ARR tracks sum of all active contracts; renewals based on actual total | Industry standard |
| Time to close books (monthly) | Finance manually reconciling spreadsheets; 55% of finance teams report inaccuracies from manual processes | Automated field calculations reduce manual work and errors | External research |
| Revenue leakage risk | SaaS companies lose 4-10% to revenue leakage annually | Clean tracking reduces missed revenue, incorrect recognition, and billing errors | External research |
| Audit readiness | Revenue recognition issues = 12% of all restatements | Documented RevRec logic, bookings policy, and field-level tracking create audit trail | External research |

### How to Measure Success

**Leading Indicators (Week 1-4):**

- Golden number defined and agreed upon by finance, sales, and CS
- Operating plan reviewed and revenue breakouts documented
- Churn ownership defined and documented
- Bookings policy created or validated
- RevRec mapping document completed and approved by all stakeholders

**Lagging Indicators (Month 2-6):**

- All six RevRec fields producing accurate calculations across every deal scenario (new, expansion, contraction, renewal, churn)
- Commission calculations running from RevRec fields without manual adjustments
- Renewal amounts matching contract ARR (no manual correction needed)
- Net retention and gross retention reportable from Salesforce natively
- Finance team no longer maintaining separate spreadsheet for revenue tracking
- Zero escalations from reps about unclear expansion/renewal handling (bookings policy adopted)

## References

[1] Benchmarkit - 2025 SaaS Performance Metrics
[2] Intuit - Automated Revenue Recognition
[3] Vayu - B2B SaaS Revenue Leakage Prevention: A CFO's Guide
[4] PCAOB - Data Points: Financial Restatements and Auditor Turnover
[5] Cohen & Co - 3 Revenue Recognition Challenges for Software and SaaS Companies in 2025
[6] Maxio - Why Revenue Recognition in Spreadsheets is a Terrible Idea
[7] Stripe - Bookings vs. ARR Explained
[8] Kruze Consulting - Bookings vs Revenue vs ARR
[9] ChurnZero - The SaaS Debate: Who Owns the Renewal and Upsell?
[10] Mosaic - Due Diligence Checklist for SaaS in 2024
[11] RevOps.io - Co-Term
