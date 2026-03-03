# HubSpot to Salesforce Migration — Advisory

## 1) Project Overview

### What is the name of this project?
HubSpot to Salesforce Migration - CRM Platform Migration & Transformation

### What is the purpose of this project?
A HubSpot to Salesforce migration transitions an organization's CRM between platforms, involving process transformation, data architecture redesign, and workflow updates. The initiative encompasses scoping across five key object categories (accounts, opportunities, contacts/leads, technology, and data structure), workback planning, field mapping, Salesforce automation builds, data migration, third-party tool reconnection, and launch with enablement.

### What HubSpot to Salesforce Migration Unlocks

- Access to a CRM supporting greater operational scale and reporting depth
- Opportunity to eliminate technical debt and capture process improvements during transition
- Proper architecture of leads, contacts, accounts, and opportunities for reporting
- Standardized data with reduced duplicates and obsolete records
- Foundation for Salesforce ecosystem tools (CPQ, advanced reporting, AppExchange)
- Documented decisions mapped across object categories with dependencies

**Before (HubSpot) → After (Salesforce)**

| Aspect | Before | After |
|--------|--------|-------|
| Contact Architecture | Single Contact object for all lifecycle stages | Separate Lead and Contact objects with defined progression |
| Quoting | Native with limited CPQ capabilities | Full CPQ ecosystem options (DealHub, Subskribe) |
| Reporting | Limited pipeline velocity and attribution insights | Built-in timestamps, stage timing, ACV/TCV calculations |
| Contact Management | Free-floating contacts without account requirements | Contacts attached to Accounts with hierarchy |
| Automation | HubSpot workflow format | Salesforce flows with foundational automations |
| Data Quality | Accumulated quality issues over time | Audited fields, duplicates and junk data removed |

### What business outcomes does this project drive?

**Primary Outcomes:**
- Transition to a platform better supporting organizational operational needs
- Proper architecture enabling downstream reporting and operations
- Standardized data with reduced duplicates and obsolete records
- Clean field mapping with unused and redundant fields eliminated

**Secondary Outcomes:**
- Foundation for advanced revenue operations (attribution, CPQ, territory management)
- Enhanced data visibility for executive reporting and pipeline forecasting
- Process improvements captured during migration
- Access to Salesforce AppExchange ecosystem

### Who in the Org can benefit from this project?

- **Sales teams** - New operational CRM with improved workflows
- **Marketing teams** - Enhanced lead lifecycle tracking and attribution
- **Revenue Operations** - Cleaner data architecture, better reporting, proper object structure
- **Executive leadership** - Accurate pipeline and revenue reporting
- **Customer Success** - Structured account data for renewals and expansion tracking

### Pain Points this Project Solves

| Pain Point | Migration Enablement |
|-----------|----------------------|
| Limited CRM insights | Properly structured data with clean fields and executive dashboards |
| HubSpot workflow limitations | Salesforce workflows and layouts designed around actual team processes |
| Duplicate and junk records | Field audit identifying and removing bad data before migration |
| Broken, unexplained workflows | Documented automations with foundational build standards |
| Outgrown platform capabilities | Access to CPQ, advanced analytics, and AppExchange integrations |

Data visibility and end user adoption are overwhelmingly the primary reasons organizations pursue this initiative.

### The Data Behind the Problem

- **Over 80% of data migration projects exceed timelines or budgets**, with cost overruns averaging 30% and time delays reaching 41%
- **Poor data quality costs organizations approximately $12.9 million annually** (Gartner). Most organizations (59%) do not measure their data quality
- **B2B data decays at roughly 30% annually** (Gartner), meaning unmaintained systems may contain more bad records than good ones after 2-3 years
- **20-70% of CRM projects fail**, with poor user adoption as the leading cause, followed by lack of tool integration (17%) and use complexity (7%)
- **72% of migrations break at least one critical integration**, including email sync, calendar, and accounting software
- **Sales teams spend approximately 546 hours annually on data quality issues** (Dun & Bradstreet study) - time diverted from selling activities

The combination of data decay, integration fragility, and adoption challenges demonstrates why structured migration—not simple transfers—produces significantly different outcomes.

### Key Metaphors or Frameworks

**ETL vs ELT (Extract, Transform, Load vs Extract, Load, Transform)**

The migration approach decision that sets project tone. ETL transforms data before Salesforce loading (cleaner outcome, more upfront effort). ELT loads data unchanged and transforms afterward (faster start, downstream complication risk).

- **Use when:** Initial scoping conversations—this is the first major decision point
- **Avoid when:** Discussing with non-technical stakeholders needing outcomes, not process language

**The Big Five**

Five object categories requiring scoping in every migration: Accounts, Opportunities, Contacts/Leads, Technology, and Data Structure. This frames scoping as a finite decision set rather than open-ended exploration.

- **Use when:** Framing the scoping phase and setting decision volume expectations
- **Avoid when:** Deep technical discussions about specific object architectures

### Target Motion

Applicable to Sales-Led Growth (SLG), Product-Led Growth (PLG), and Ecosystem-Led Growth (ELG). The motion type impacts how the end system is designed—particularly contacts-to-leads architecture and lead lifecycle.

- **SLG companies:** Standard lead-based architecture with complete lead lifecycle (most common, ~14 of 15 migrations)
- **PLG companies:** May require contact-only architecture for high-volume user signups (rare, ~1 of 15)
- **Hybrid/ELG:** Lead-based architecture with partner object considerations

*Not applicable for:* Organizations moving FROM Salesforce TO HubSpot (different project type). Also not suitable for organizations only needing HubSpot-Salesforce sync/integration rather than full migration.

---

## 2) Tools & Systems

### Primary Tools

**HubSpot** — Source CRM system. Supports data extraction, field inventory assessment, workflow documentation, and current-state architecture analysis during scoping.

**Salesforce** — Destination CRM system. Used for automation builds, page layout design, data import, and all post-migration operations.

**Excel / Google Sheets** — Used for field audit spreadsheets, data mapping documents, and workback plan creation. Core working document for field-by-field analysis decisions (retain, transform, or eliminate).

**Lucidchart** — Used for architecture diagrams, particularly contacts-to-leads architecture decisions and data flow mapping.

**Third-Party Tools (Client-Specific):** Varies by client. Common tools requiring migration strategy include Gong, Salesloft, Outreach, ChurnZero, and CPQ tools (DealHub, Subskribe).

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**Executive Sponsor (VP Sales, VP RevOps, or CRO)**

- **Required for:** Scoping workshops, go/no-go decisions, migration approach approval
- **Responsibilities:** Budget approval, timeline alignment, internal adoption championing

**Operations Lead (RevOps Manager, Sales Ops Manager)**

- **Required for:** All scoping sessions, field audit reviews, workflow documentation
- **Responsibilities:** Providing business process context, making field-level decisions, coordinating internal team input

**Day-to-Day Point of Contact (Operations Analyst or Admin)**

- **Required for:** Ongoing build sessions, QA testing, integration coordination
- **Responsibilities:** Testing workflows, validating data accuracy, coordinating vendor contacts

### Technical Owners

**Client-Side CRM Admin or RevOps Lead**

- Provides admin access to both HubSpot and Salesforce
- Owns ongoing system maintenance post-migration
- Participates in enablement training on new architecture

---

## 4) Scoping

### Scoping Factors

**1. Go-to-Market Motion**

- PLG (Product-Led Growth) → Impacts contacts-to-leads architecture; may require contact-only approach for high-volume user signups
- SLG (Sales-Led Growth) → Standard lead-based architecture (most common)
- ELG (Ecosystem-Led Growth) → May require partner object considerations

**2. Appetite for Change (ETL vs ELT)**

- High transformation appetite → ETL approach (extract, transform, then load). Cleaner result, more upfront hours.
- Low appetite / tight timeline → ELT approach (extract, load, then transform). Faster start, downstream complication risk.

**3. Timeline**

- Standard timeline (~3-4 months) → Full ETL with field audits and transformation
- Compressed timeline (<2 months) → May necessitate ELT approach; increases risk

**4. Existing Infrastructure & Tech Debt**

- Many third-party integrations → More cutover coordination, additional hours
- HubSpot-native features in use (e.g., quoting) → Need Salesforce equivalents (CPQ evaluation)
- Accumulated junk data and duplicates → More transformation work during audit

**5. Data Structure**

- Standard objects only → Simpler migration
- Custom objects in HubSpot → Need Salesforce custom object equivalents
- Transformational changes needed (e.g., consolidating renewal opportunities) → Additional scoping and build hours

**6. Data Volume**

- Low record counts (<50K across objects) → Simpler data migration
- High record counts (100K+) → More testing, potential performance issues during import

**7. Contacts-to-Leads Architecture**

- Lead-based (recommended, ~14 of 15 cases) → HubSpot contacts split into Salesforce Leads and Contacts based on lifecycle stage. Requires lead lifecycle design.
- Contact-only (rare, ~1 of 15 cases) → All records go to Contacts. Challenge: Gmail/personal email signups lack account attachment options in Salesforce. May need "orphanage" accounts as workaround.

**8. Third-Party Tool Ecosystem**

- Few integrations (<5) → Standard migration
- Many integrations (10+) → Significant cutover coordination; some tools have tight just-in-time cutover windows (e.g., Salesloft)

**9. Merger vs. Single-Instance Migration**

- Single instance → Standard scoping
- Merger (two instances into one Salesforce org) → Must scope BOTH instances and design unified vision. Non-linear complexity increase.

### Multiple Approaches

**Approach 1: ETL (Recommended)**

- **Criteria:** Cleanup is necessary, budget allows, timeline is not severely constrained
- **Execution:** Extract data from HubSpot, transform (clean, deduplicate, restructure) before Salesforce loading. Field audit determines what gets retained, transformed, or deleted. Produces a cleaner end state.

**Approach 2: ELT**

- **Criteria:** Very tight timeline or constrained budget; client accepts post-load cleanup risk
- **Execution:** Extract from HubSpot, load into Salesforce unchanged, transform afterward. Faster initial setup but can cause downstream complications.

**Approach 3: Lead-Based Architecture (Recommended)**

- **Criteria:** Most migration scenarios (~14 of 15 cases)
- **Execution:** Anything earlier than an opportunity in the lifecycle goes to Salesforce Leads. Requires lead lifecycle design including statuses, conversion triggers, and creation flows.

**Approach 4: Contact-Only Architecture**

- **Criteria:** Very rare. Only viable with tight control over data universe (no open signups, no Gmail/personal email contacts).
- **Execution:** All records go to Contacts attached to Accounts. Challenge: Gmail signups lack attachment options because no Google Account exists to attach them to in Salesforce. May need "orphanage" accounts as workaround.

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Overall Approach & Goals**

- What is driving the move from HubSpot to Salesforce? *(Distinguishes comfort-driven vs. capability-driven migration)*
- Do you want to clean up and transform data during migration, or port over unchanged and iterate in the new instance? *(ETL vs ELT decision)*
- What is your target go-live date? *(Determines timeline pressure and approach viability)*

**Data Quality & Structure**

- Are there duplicates or junk data in the system today? *(Scopes transformation work)*
- How many custom objects exist in HubSpot? *(Identifies custom object migration needs)*
- What is the approximate record count across contacts, companies, and deals? *(Data volume scoping)*

**Contacts & Leads**

- How do you want to manage contacts versus leads in Salesforce? *(Architecture decision)*
- If a record is earlier than an opportunity in the lifecycle, should it be treated as a lead? *(Lead-based vs. contact-only)*
- Do you have signups from Gmail or personal email domains? *(Contact-only architecture blocker)*

**Technology & Integrations**

- What third-party tools are connected to HubSpot that need to be migrated? *(Integration inventory)*
- Are there any HubSpot-only tools or features that need Salesforce alternatives? *(Gap analysis)*
- Do you need CPQ / quoting functionality? HubSpot has native quoting; Salesforce does not. *(CPQ evaluation trigger)*

**Team & Adoption**

- Who on your team has Salesforce experience? *(Training scope)*
- Who will be the day-to-day admin maintaining Salesforce post-migration? *(Technical owner identification)*
- How many users will need access to the new system? *(License planning)*

### Information to Gather Before Implementation

**System Inventory:**

Complete inventory of HubSpot fields per object (contacts, companies, deals)—exported from HubSpot settings, including field types and fill rates

**Workflow Documentation:**

List of all active workflows and automations in HubSpot, including trigger conditions and actions

**Integration Map:**

List of all connected third-party tools with connection type (native integration, API, Zapier/middleware)

**Lead Lifecycle:**

Understanding of current lead lifecycle and statuses—how leads are created, qualified, and converted today

**Data Quality Sample:**

Sample assessment of data quality: duplicate rate, field fill rates across key objects, presence of junk records

**Opportunity Structure:**

Current opportunity/deal structure—single opportunity per customer vs. multiple (renewals, expansions), stage definitions

### Approach Decision Questions

| Question | Answer → Approach |
|----------|------------------|
| How clean is your current data? | If messy → ETL preferred (transform before loading) |
| How tight is your timeline? | If very tight → ELT may be necessary (load first, transform later) |
| How much budget is available for cleanup? | More budget = more transformation possible during migration |
| Do you have Gmail/personal email signups? | If yes → Lead-based architecture required (contact-only won't work) |
| Is this a single-instance migration or a merger? | Merger → Significantly more hours, scope both instances |

---

## 6) Overcoming Common Belief Barriers

#### "We can just export and import - it's a data move, not a project."

HubSpot and Salesforce have fundamentally different data architectures. HubSpot uses a single Contact object for both leads and customers. Salesforce separates these into Lead and Contact objects with different fields, behaviors, and lifecycle rules. Every contact in HubSpot requires a routing decision: does it become a Lead or a Contact in Salesforce? Then there are field transformations, workflow recreation, third-party tool reconnection, layout design, and enablement. Industry data shows over 80% of data migration projects treated as simple transfers exceed timelines or budgets.

**The reframe:** A HubSpot to Salesforce migration is a system redesign with a data move embedded, not the reverse.

#### "Let's move everything over and clean it up in Salesforce later."

This is the ELT approach, and it has a documented failure mode. The migration itself is the single best window for transformational cleanup because disruption is already happening. Deferring cleanup means your new Salesforce instance starts with the same data problems your HubSpot had—and B2B data decays at 30% annually, so problems compound. If no transformation occurs, it becomes just field mapping and data migration, which is how zero migrations complete successfully.

**The reframe:** The migration is the cheapest opportunity to address data problems because every record is already being touched. Post-implementation cleanup means paying twice.

#### "This will shut down our sales team for weeks."

The first ~30 days of the project involve scoping and architecture work. No one touches the live HubSpot system. The Salesforce instance is built, tested, and QA'd in parallel while the sales team continues normal operations. The actual cutover is coordinated, and the hyper-care period (2-4 weeks post-launch) exists specifically to catch and fix edge cases quickly.

**The reframe:** Your sales team keeps working in HubSpot until the new Salesforce instance is built, tested, and ready. The cutover is a coordinated switch, not a shutdown.

#### "We don't need a field audit - just move the fields we're using."

The field audit is where 30-50% of migration value is captured. It routinely reveals that a significant portion of fields have low fill rates, are duplicates, or are no longer used by any workflow. Moving unused fields into Salesforce creates a cluttered, hard-to-maintain system from day one. Organizations with 500 fields in HubSpot should not expect to lift and replace all of them—the audit analyzes which fields actually provide value.

**The reframe:** The field audit does not slow the project—it prevents you from building a new system that inherits all the problems of the old one.

#### "Our team knows Salesforce, so we don't need much training."

Individual Salesforce familiarity does not translate to adoption of a new instance with new architecture, new workflows, and new data structures. Average CRM adoption rates across sectors sit at just 26%, and 25% of organizations cite training and adoption as their biggest implementation challenge. The hyper-care period exists because every migration surfaces edge cases that only appear with real user data at scale.

**The reframe:** Knowing Salesforce and knowing YOUR Salesforce are two distinct things. Enablement covers the specific architecture decisions made for your business.

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Metric | Impact Direction | Expected Magnitude | Notes |
|--------|-----------------|-------------------|-------|
| Pipeline Accuracy | ↑ Increase | Significant improvement | Clean data structure + proper opportunity architecture = accurate reporting |
| MQL → Opp Conversion | ↑ Increase | Indirect | Proper lead lifecycle design and conversion flows improve handoff tracking |
| Opp → CW Conversion | -- Neutral initially | Stabilizes post-migration | Migration itself does not change win rates, but accurate data enables diagnosis |
| Cycle Time | -- Neutral to ↑ | Measurement improvement | Timestamps and stage timing automations enable measurement that may not have existed before |

*Note: This migration is primarily an infrastructure project. Its metrics impact involves enabling accurate measurement and reporting rather than directly moving specific conversion rates. The downstream projects it enables (lead lifecycle redesign, attribution, deduplication) are where conversion rate improvements materialize.*

### Expected Outcomes

| Metric | Before | After | Source |
|--------|--------|-------|--------|
| CRM data accuracy | Accumulated duplicates, junk records, low fill-rate fields | Audited fields, deduplicated records, junk data removed | Field audit process |
| Reporting reliability | Limited visibility into pipeline velocity and attribution | Timestamps, stage timing, ACV/TCV calculations built in via foundational automations | Foundational automations |
| Integration health | HubSpot-specific tool connections | Salesforce-native integrations with documented cutover strategy per tool | Third-party tool strategy |
| User adoption | N/A (new system) | Target: 80%+ daily active usage within 60 days of launch | Industry benchmark: average CRM adoption is 26%; structured enablement targets significantly higher |

### How to Measure Success

**Leading Indicators (Week 1-4 post-launch):**

- Daily active users logging into Salesforce (target: 80%+ of licensed users)
- Number of support tickets / issues reported during hyper-care (expect high initially, declining weekly)
- All critical integrations flowing data correctly (zero broken integrations)
- Record count validation: Salesforce record counts match expected migration totals

**Lagging Indicators (Month 2-6 post-launch):**

- Reduction in duplicate record creation rate vs. pre-migration baseline
- Executive reporting dashboards populated and actively used (measured by dashboard view frequency)
- Sales team self-reported satisfaction with new system (survey at 60 and 90 days)
- Time-to-first-report: How quickly new reports can be built vs. old system limitations
- Zero reversion to HubSpot or shadow systems (spreadsheets, notes apps) for CRM data

---

## References

[1] Zero-Downtime CRM Migration - Revenue Velocity Lab / Optif.ai

[2] Gartner - Data Quality: Why It Matters and How to Achieve It

[3] ZoomInfo - The True Cost of Poor Data Quality

[4] CRM.org - 45 CRM Statistics You Need to Know in 2025

[5] BeyondCRM - Avoid These CRM Migration Pitfalls

[6] VisualSP - CRM Adoption: How to Increase End-User Adoption Rates
