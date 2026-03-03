# Foundational Automations and Reporting Logic — Methodology

## 1) Core Concepts

The mental models, frameworks, and key distinctions that someone needs to understand before executing this project.

### The Automation Layer vs. The Reporting Layer

**What is it?**

Foundational Automations and Reporting Logic consists of two interdependent layers: the **automation layer** (workflows that capture, route, assign, stamp, and notify) and the **reporting layer** (dashboards, metrics, and calculated fields that make the automation data visible). The automation layer generates the data. The reporting layer surfaces it. Neither works without the other.

**Why does it matter?**

Building reports without working automations produces dashboards that show incomplete or stale data. Building automations without reports means the data exists but nobody can see or act on it. Both layers must be designed and built in sequence -- automations first, then reports that depend on the fields those automations populate.

**Key insight:**

> "Automations are the factory floor. Reports are the control room. If the factory floor is broken, the control room shows garbage. If the control room doesn't exist, the factory runs blind."

**Examples:**

| Context | Example |
|---------|---------|
| Lifecycle stage automation without reporting | Stage date stamps populate on Lead records, but no dashboard shows average time-in-stage or conversion rates -- leadership cannot identify bottlenecks |
| Reporting without automation | A pipeline dashboard exists but Opportunity stage dates are entered manually -- half are missing, so the report shows artificially short sales cycles |
| Both layers working together | Lead assignment Flow routes leads, stamps assignment date; a dashboard shows median lead response time by rep, enabling SLA enforcement |

### System of Record Ownership

**What is it?**

A System of Record (SOR) is the authoritative, primary data source for a specific data domain. When multiple systems hold overlapping data (e.g., Salesforce and HubSpot both contain Contact records), the ownership model defines which system "wins" for each field -- where the truth lives and which direction data flows.

This is distinct from a Source of Truth (SOT), which aggregates data from multiple SORs into a unified view. In most client environments, the CRM (Salesforce or HubSpot) serves as the SOR for customer data, while a BI tool or executive dashboard serves as the SOT for cross-functional reporting.

**Why does it matter?**

Without a defined ownership model, two systems write to the same field simultaneously, causing overwrites, sync loops, and conflicting data. Sales sees one number in Salesforce; Marketing sees a different number in HubSpot. Leadership loses trust in reporting. Every automation built on unowned data becomes unreliable.

**The Framework:**

For each data field, answer three questions:
1. WHERE does this data originate? (Source system)
2. WHICH system is authoritative? (Owner system)
3. WHAT direction does it sync? (One-way or two-way with conflict rules)

| Data Domain | Typical Owner | Sync Direction | Notes |
|-------------|---------------|----------------|-------|
| Lead/Contact demographic data | HubSpot (if MAP) or Salesforce | HubSpot --> Salesforce | Marketing captures via forms |
| Opportunity/Deal data | Salesforce | Salesforce --> HubSpot (read-only) | Sales creates and manages deals in CRM |
| Activity data (emails, calls) | Varies by tool | Bidirectional with dedup | Sync from SEP to CRM |
| Lifecycle stage | Salesforce | Salesforce --> HubSpot | CRM is authoritative for stage |
| Campaign membership | HubSpot | HubSpot --> Salesforce | Marketing manages campaigns |

**Common misunderstandings:**

- **Misconception:** "We'll just sync everything both ways and it'll be fine." **Reality:** Bidirectional sync without field-level ownership rules creates overwrite loops. A Contact's phone number updated in HubSpot syncs to Salesforce, which triggers a sync back to HubSpot, ad infinitum. Define ownership per field, not per object.

- **Misconception:** "Salesforce is our system of record for everything." **Reality:** Salesforce is typically the SOR for sales-managed data (Opportunities, Accounts). But if Marketing runs HubSpot, form submissions, email engagement, and campaign data originate there. The SOR is wherever the data is created and maintained.

### Lifecycle Stage Design

**What is it?**

Lifecycle stages define the progression path a record (Lead, Contact, Account, Opportunity) follows from creation to outcome. Each stage represents a distinct state with specific entry criteria and exit criteria. Date stamps on each stage transition capture when the transition occurred, enabling duration analysis.

**Why does it matter?**

Without defined lifecycle stages and date stamps, you cannot measure conversion rates between stages, identify bottlenecks, calculate velocity, or build accurate funnel reports. Lifecycle stages are the backbone of every pipeline report and SLA measurement. Sales reps spend approximately 28-29% of their week on actual selling activities, with the rest consumed by administrative tasks. Proper lifecycle automation reduces that administrative burden by auto-advancing records and stamping dates without manual input.

**Key insight:**

> "Lifecycle stages should be exhaustive (every record lives in exactly one stage at all times) and mutually exclusive (a record cannot be in two stages simultaneously). If you find records with no stage or ambiguous stages, the lifecycle model has gaps."

**Examples:**

| Object | Common Stages | Key Date Stamps |
|--------|---------------|-----------------|
| Lead | New, Contacted, Working, Qualified (MQL/SQL), Converted, Disqualified | Lead_Created_Date, MQL_Date, SQL_Date, Converted_Date |
| Contact | Subscriber, Lead, MQL, SQL, Opportunity, Customer, Evangelist | Lifecycle_Stage_Date for each stage |
| Account | Prospect, Active Opportunity, Customer, Former Customer, Partner | Customer_Since_Date, Churned_Date |
| Opportunity | Discovery, Qualification, Proposal, Negotiation, Closed Won/Lost | Stage hit dates for each stage (e.g., Stage_Proposal_Date__c) |

**Common misunderstandings:**

- **Misconception:** "We can just use the standard Salesforce Opportunity Stage History." **Reality:** Stage History records exist but are difficult to report on natively. Custom date stamp fields on the Opportunity record (one per stage) are far easier to use in reports and dashboards. Build a Flow that stamps the date when the stage changes.

- **Misconception:** "Lifecycle stages only matter for Leads." **Reality:** Stage tracking across Leads, Contacts, Accounts, and Opportunities creates a complete funnel view. Missing stages on any object creates reporting blind spots.

### The Automation Format Hierarchy

**What is it?**

Salesforce offers multiple automation formats: Workflow Rules (legacy), Process Builder (deprecated), and Flow Builder (current standard). HubSpot uses Workflows. Each format has different capabilities, performance characteristics, and support timelines. Salesforce has announced end-of-support for Workflow Rules and Process Builder on December 31, 2025.

**Why does it matter?**

Clients with legacy automations (Process Builders, Workflow Rules) face a forced migration. New automations should only be built in Flow Builder (Salesforce) or Workflows (HubSpot). Mixing formats creates maintenance complexity -- a single record save can trigger a Workflow Rule, then a Process Builder, then a Flow, causing execution order conflicts and unexpected behavior.

**The Framework:**

| Format | Status | Capabilities | Performance |
|--------|--------|--------------|-------------|
| Workflow Rules (SF) | End-of-support Dec 2025 | Field updates, email alerts, outbound messages, tasks | Limited -- after-save only |
| Process Builder (SF) | End-of-support Dec 2025 | Visual branching, record updates, related records, invocable actions | Poor -- heavier DML, no before-save |
| Flow Builder (SF) | Current standard | Full logic (loops, decisions, variables, subflows, screen flows), before-save and after-save, scheduled, platform events | Optimized -- fewer DML operations, governor-limit friendly |
| HubSpot Workflows | Current standard | Branching, delays, enrollment triggers, property updates, task creation, notifications | Good -- event-driven, no governor limits |

**Common misunderstandings:**

- **Misconception:** "We can just keep our Process Builders running -- they still work." **Reality:** They work today, but Salesforce will stop fixing bugs and providing support after December 2025. More importantly, Process Builders run after-save and consume more DML operations. One Process Builder per object is a known anti-pattern that causes governor limit errors at scale.

- **Misconception:** "The Migrate to Flow tool handles everything automatically." **Reality:** Salesforce's built-in migration tool creates one Flow per Process Builder, which results in multiple Flows per object. Best practice is to consolidate to a maximum of three Flows per object (Before Save, After Save, Before Delete). Automated migration without manual consolidation creates technical debt.

---

## 2) Decision Frameworks

Decision matrices and "when to use what" guidance for approach selection.

### Approach Selection Matrix

| Situation | Recommended Approach | Why |
|-----------|----------------------|-----|
| Single CRM (Salesforce only) | Build all automations in Flow Builder, reports in native Salesforce | No sync complexity; full control in one system |
| Single CRM (HubSpot only) | Build automations in HubSpot Workflows, reports in HubSpot | Native integration between automation and reporting |
| Dual CRM (Salesforce + HubSpot) | Define ownership model first; build automations in owning system; sync via native connector or middleware | Prevents sync conflicts; each system owns its domain |
| Legacy automations present (Process Builders, Workflow Rules) | Audit and migrate to Flow before building new automations | Prevents execution order conflicts; removes end-of-life risk |
| No existing automations | Greenfield build in Flow/Workflows following consolidated pattern | Clean architecture; no migration debt |

### Scoping Factors

The variables that affect which approach to use and how the project is sized.

**1. Number of CRM Systems**

- Single CRM -- Standard automation build, no sync logic needed
- Dual CRM -- Requires ownership model, field mapping, sync configuration, conflict resolution (adds 30-50% to project scope)

**2. Volume of Existing Automations**

- 0-10 automations -- Quick audit, minimal migration
- 10-50 automations -- Significant audit, prioritized migration, likely 2-3 sprint cycles
- 50+ automations -- Dedicated migration workstream, phased approach required

**3. Automation Format Mix**

- All in Flow/Workflows -- No migration needed, focus on optimization and consolidation
- Mix of Workflow Rules + Process Builders + Flows -- Full migration required before new build
- Only Workflow Rules/Process Builders -- Complete migration needed; use as opportunity to redesign

**4. Reporting Maturity**

- No reports exist -- Full greenfield build; requires metric definition with stakeholders
- Some reports exist but are inaccurate -- Audit, fix data sources, rebuild as needed
- Reports exist but are disorganized -- Reorganize, fill gaps, add missing metrics (CAC, CLV, churn)

**5. Data Quality**

- Clean data, consistent field population -- Proceed directly to automation and reporting build
- Moderate data issues (some missing fields, inconsistent picklists) -- Data cleanup sprint before or parallel with automation build
- Severe data issues (duplicates, missing records, broken syncs) -- Separate data quality project as prerequisite

### Lead Routing Strategy Selection

Choosing the right lead assignment approach based on team size, territory structure, and specialization.

| Factor | Round Robin | Territory-Based | Hybrid (Territory + Round Robin) |
|--------|-------------|-----------------|--------------------------------|
| Team size | 2-5 reps, similar capabilities | 5+ reps, geographic or vertical coverage | 5+ reps with territory overlaps |
| Specialization | Low -- all reps handle all leads | High -- reps own specific regions or verticals | Medium -- territory ownership with shared pools |
| Fairness | High -- equal distribution | Variable -- depends on territory lead volume | Balanced -- territory gets priority, remainder round-robined |
| Speed to implement | Fast -- simple rotation logic | Medium -- requires territory definition and mapping | Slower -- needs both territory rules and fallback logic |
| Best for | Early-stage companies, SDR teams | Established field sales, geographic coverage | Scaling companies with emerging territories |

**Key decision:** If the client has defined territories, start with territory-based routing and add round robin within each territory. If no territories exist, start with round robin and add territory logic later as the team grows.

**Not recommended:** Manual assignment as a "temporary" solution. Manual assignment introduces delay (average B2B lead response time is 47 hours without automation) and inconsistency. Even a basic round robin is better than no automation.

### Report Type Selection

Mapping each metric to the right report type, data requirement, and dashboard placement.

| Metric | Report Type | Data Requirement | Dashboard Placement |
|--------|-------------|------------------|---------------------|
| Pipeline by stage | Standard Opportunity report with stage grouping | Opportunity records with accurate stage field | Sales Pipeline Dashboard |
| Stage conversion rates | Custom report using stage hit date stamps | Stage date fields populated by automation | Sales Pipeline Dashboard |
| Lead response time | Formula field (Assignment Date - Created Date) or Flow calculation | Lead assignment date stamp, lead created date | SDR Performance Dashboard |
| CAC | Custom report pulling spend and new customer count | Marketing spend data (often external), Closed Won Opportunity count | Executive Dashboard |
| CLV | Custom report with revenue and lifespan data | Contract value, average customer lifespan | Executive Dashboard |
| Churn rate | Custom report tracking lost customers over period | Churned Account flag or stage with date | CS Dashboard |
| Campaign ROI | Campaign report with cost and revenue attribution | Campaign cost, influenced revenue | Marketing Dashboard |

---

## 3) Benchmarks & Standards

### How to Use Benchmarks

Benchmarks are guidelines, not rules. Always:

1. Start with benchmark as baseline
2. Adjust based on client-specific data (segment, ACV, sales motion)
3. Validate against their actual numbers when available
4. Document deviations and rationale

### CRM Automation ROI Benchmarks

| Metric | Low | Typical | High | Notes |
|--------|-----|---------|------|-------|
| CRM ROI per $1 invested | $3-4 | $8.71 | $12+ | Median has increased from $5.60 to $8.71 since 2011 |
| Sales revenue increase post-CRM automation | 15% | 29% | 40%+ | Average across implementations |
| Sales productivity boost | 15% | 34% | 50%+ | Measured by quota attainment and activity volume |
| Time to initial automation ROI | 6 months | 3 months | 30 days | Initial benefits (data organization, automated workflows) appear within 90 days |

**Source:** CRM.org, Nutshell, and Cirrus Insight CRM Statistics compilations (2024-2025)

**Interpretation:**

- **Below low:** Implementation likely has adoption issues or automations not covering critical workflows
- **Above high:** Strong adoption, well-designed automations, and leadership actively using dashboards

### B2B SaaS Financial Metrics Benchmarks

| Metric | SMB ($1K-$10K ACV) | Mid-Market ($10K-$100K ACV) | Enterprise ($100K+ ACV) | Notes |
|--------|-------------------|----------------------------|------------------------|-------|
| CAC | $500-$2,000 | $5,000-$15,000 | $50,000-$200,000+ | Varies by sales motion |
| CLV:CAC Ratio | 2:1 - 3:1 | 3:1 - 5:1 | 4:1 - 8:1 | Median is 3.6:1 per Benchmarkit 2024 |
| Monthly churn rate | 3-7% | 1-3% | 0.5-1% | Higher volatility at SMB |
| Annual churn rate | 30-60% | 10-30% | 5-10% | Derived from monthly churn |
| NRR | 85-95% | 95-110% | 110-130% | Below 100% means net contraction |
| CAC Payback Period | 6-12 months | 12-18 months | 18-24 months | Target under 18 months for healthy unit economics |

**Source:** Benchmarkit 2024 B2B SaaS Performance Metrics, Vitally Churn Benchmarks, HubiFi B2B SaaS Benchmarks

**Interpretation:**

- **CLV:CAC below 3:1:** Customer acquisition is too expensive relative to value delivered; investigate channel efficiency or retention issues
- **Monthly churn above 5%:** Urgent retention problem; check onboarding, product-market fit, and customer success coverage
- **NRR below 100%:** Revenue from existing customers is shrinking; expansion motions (upsell/cross-sell) are underperforming

### Pipeline and Sales Velocity Benchmarks

| Metric | Low | Typical | High | Notes |
|--------|-----|---------|------|-------|
| Average sales cycle (B2B SaaS) | 30 days | 60-90 days | 120+ days | Varies heavily by ACV; enterprise can exceed 180 days |
| Lead response time (target) | Same day | Under 1 hour | Under 5 minutes | 35-50% of sales go to the first responder |
| Win rate (Opportunity to Close) | 15% | 20-25% | 35%+ | Depends on qualification rigor and pipeline quality |
| Stage-to-stage conversion | 30% | 50-60% | 75%+ | Measured between each consecutive stage |
| Pipeline coverage ratio | 2x | 3-4x | 5x+ | Pipeline value vs. quota target |

**Source:** HBR, InsideSales, Salesforce State of Sales

### Quick Reference Thresholds

For common "is this good?" questions:

| Question | Good | Warning | Red Flag |
|----------|------|---------|----------|
| Lead response time | Under 1 hour | 1-24 hours | Over 24 hours |
| Automation error rate | Under 1% of executions | 1-5% | Over 5% |
| Report data completeness | Over 95% field population | 80-95% | Under 80% |
| CLV:CAC ratio | Over 3:1 | 2:1 - 3:1 | Under 2:1 |
| Monthly churn (mid-market) | Under 2% | 2-5% | Over 5% |
| Dashboard weekly active users | Over 80% of leadership | 50-80% | Under 50% |

---

## 4) Calculations & Scoring

### Formula Quick Reference

| Calculation | Formula | Example |
|-------------|---------|---------|
| Customer Acquisition Cost (CAC) | Total Sales & Marketing Spend / New Customers Acquired | $500K spend / 100 customers = $5,000 CAC |
| Customer Lifetime Value (CLV) | Average Revenue Per Account x Gross Margin % x Average Customer Lifespan | $20K ARPA x 75% margin x 3 years = $45,000 CLV |
| CLV:CAC Ratio | CLV / CAC | $45,000 / $5,000 = 9:1 |
| Monthly Churn Rate | Customers Lost in Month / Customers at Start of Month | 5 lost / 200 start = 2.5% |
| Annual Churn Rate | 1 - (1 - Monthly Churn Rate)^12 | 1 - (1 - 0.025)^12 = 26.1% |
| CAC Payback Period | CAC / (ARPA x Gross Margin % / 12) | $5,000 / ($20K x 75% / 12) = 4 months |
| Stage Duration | Next Stage Date - Current Stage Date | SQL_Date - MQL_Date = days in MQL stage |
| Pipeline Velocity | (Opportunities x Win Rate x Avg Deal Size) / Sales Cycle Length | (50 x 25% x $30K) / 60 days = $6,250/day |

### Customer Acquisition Cost (CAC)

**Formula:**

```
CAC = (Total Sales Spend + Total Marketing Spend) / New Customers Acquired in Period
```

**Variables explained:**

- `Total Sales Spend` = Salaries, commissions, tools, travel for sales team in the period
- `Total Marketing Spend` = Advertising, content, events, tools, salaries for marketing team in the period
- `New Customers Acquired` = Count of new Closed Won Opportunities (unique Accounts) in the same period

**Worked Example:**

Scenario: Mid-market B2B SaaS company, Q1 calculation

```
Given:
- Sales spend (Q1) = $300,000 (3 AEs + 2 SDRs + tools)
- Marketing spend (Q1) = $200,000 (ads, content, 1 event, tools)
- New customers (Q1) = 25

Calculate:
- Total spend = $300,000 + $200,000 = $500,000
- CAC = $500,000 / 25 = $20,000
```

**Validation:**

- For mid-market SaaS ($10K-$100K ACV), CAC of $5,000-$15,000 is typical
- If CAC exceeds 1/3 of first-year ACV, investigate channel efficiency

### Customer Lifetime Value (CLV)

**Formula:**

```
CLV = ARPA x Gross Margin % x Average Customer Lifespan (years)
```

**Variables explained:**

- `ARPA` = Average Revenue Per Account per year (total ARR / total customers)
- `Gross Margin %` = Revenue minus cost of goods sold, as a percentage
- `Average Customer Lifespan` = 1 / Annual Churn Rate (in years)

**Worked Example:**

Scenario: SaaS company with $50K average ACV

```
Given:
- ARPA = $50,000/year
- Gross Margin = 80%
- Annual churn rate = 15%
- Average customer lifespan = 1 / 0.15 = 6.67 years

Calculate:
- CLV = $50,000 x 0.80 x 6.67 = $266,800
- CLV:CAC ratio = $266,800 / $20,000 = 13.3:1
```

**Validation:**

- CLV:CAC above 3:1 is the minimum healthy threshold
- Above 5:1 suggests either strong retention or underinvestment in growth
- Below 3:1 means the company spends too much acquiring customers relative to their value

### Monthly and Annual Churn Rate

**Formula:**

```
Monthly Churn Rate = Customers Lost in Month / Total Customers at Start of Month
Annual Churn Rate = 1 - (1 - Monthly Churn)^12
```

**Variables explained:**

- `Customers Lost` = Accounts that cancelled, did not renew, or downgraded to $0 in the period
- `Total Customers at Start` = Active paying customers on day 1 of the period

**Worked Example:**

Scenario: 500-customer SaaS company tracking Q1 churn

```
Given:
- January: 500 customers, 10 churned = 2.0% monthly
- February: 490 customers, 8 churned = 1.6% monthly
- March: 482 customers, 12 churned = 2.5% monthly
- Average monthly churn = (2.0 + 1.6 + 2.5) / 3 = 2.03%

Annualized:
- Annual churn = 1 - (1 - 0.0203)^12 = 21.7%
- Average customer lifespan = 1 / 0.217 = 4.6 years
```

**Validation:**

- For mid-market B2B SaaS, 1-3% monthly churn is typical
- If monthly churn exceeds 5%, escalate to CS leadership immediately
- Separate voluntary churn (cancellations: avg 2.6%) from involuntary churn (payment failures: avg 0.8%)

### Stage Duration Calculation

**Formula:**

```
Stage Duration = Next_Stage_Date__c - Current_Stage_Date__c
Average Stage Duration = SUM(all durations for stage) / COUNT(records that passed through stage)
```

**Variables explained:**

- `Next_Stage_Date__c` = Custom date field stamped when Opportunity advances to the next stage
- `Current_Stage_Date__c` = Custom date field stamped when Opportunity entered this stage

**Worked Example:**

Scenario: Measuring average time in "Proposal" stage

```
Given:
- Opp A: Proposal_Date = Jan 5, Negotiation_Date = Jan 15 --> 10 days
- Opp B: Proposal_Date = Jan 8, Negotiation_Date = Jan 22 --> 14 days
- Opp C: Proposal_Date = Jan 12, Negotiation_Date = Jan 19 --> 7 days

Calculate:
- Average time in Proposal = (10 + 14 + 7) / 3 = 10.3 days
```

**Validation:**

- If average stage duration doubles month-over-month, investigate deal stagnation
- Deals sitting in any single stage for more than 2x the average duration should be flagged for review

---

## 5) Edge Cases & Deep Dives

The tricky scenarios that require special handling -- institutional knowledge for Foundational Automations and Reporting Logic projects.

### Edge Case 1: Dual-CRM Environment with Conflicting Automations

**Scenario:**

Client runs both Salesforce (Sales team) and HubSpot (Marketing team). Both systems have automations that update the same fields on Contact records. A HubSpot Workflow sets Lifecycle Stage to MQL when a lead scores above threshold. A Salesforce Process Builder also sets a lifecycle stage field when certain criteria are met. The sync connector passes data both ways, creating a loop where each system overwrites the other's update.

**Challenge:**

Field-level sync conflicts are invisible until data is wrong. Reports show inconsistent lifecycle data. Sales and Marketing blame each other's system.

**Approach:**

1. Map every field that exists in both systems to a single owner (see System of Record Ownership concept above)
2. For lifecycle stage specifically: designate one system as authoritative (typically Salesforce for sales-managed stages, HubSpot for marketing-managed stages)
3. Configure sync to be one-directional for owned fields: HubSpot writes MQL_Date, syncs to Salesforce read-only; Salesforce writes SQL_Date, syncs to HubSpot read-only
4. Deactivate any automation in the non-owning system that writes to owned fields
5. Test sync cycle with a single record end-to-end, verifying no overwrite loop occurs

**Key validation:**

Update a Contact's phone number in HubSpot. Verify it syncs to Salesforce. Update the same Contact's phone number in Salesforce. Verify HubSpot does NOT overwrite the Salesforce value (if Salesforce owns phone). If overwrite occurs, ownership rules are not configured correctly.

### Edge Case 2: Migrating from Process Builders with Execution Order Dependencies

**Scenario:**

Client has 15 Process Builders on the Opportunity object, some of which depend on execution order (Process Builder A sets a field, Process Builder B reads that field). Salesforce's automated Migrate to Flow tool creates 15 separate Flows. Running all 15 simultaneously creates unpredictable execution order and governor limit failures.

**Challenge:**

Process Builder execution order is not guaranteed by Salesforce, but in practice they often fire in a consistent (though undocumented) order. Clients may have unknowingly built dependencies on this order. Migrating to 15 separate Flows breaks these implicit dependencies.

**Approach:**

1. Document every Process Builder's trigger, conditions, and actions in a spreadsheet
2. Identify field dependencies: which Process Builders read fields set by other Process Builders?
3. Group dependent Process Builders into a single consolidated Flow with ordered Decision elements
4. Target no more than 3 Flows per object: Before Save (for field updates), After Save (for related record updates, notifications, tasks), and Scheduled (for time-based actions)
5. Build the consolidated Flow in a sandbox
6. Run parallel testing: activate the new Flow alongside the old Process Builders (in sandbox) and compare outcomes on 20+ test records
7. Deactivate old Process Builders only after validation passes

**Key validation:**

Create 5 Opportunities that exercise every branch of every Process Builder. Record field values at each stage. After migration, create identical Opportunities and verify field values match exactly.

### Edge Case 3: Reports Showing Incorrect Data Due to Missing Automation Coverage

**Scenario:**

Client builds a pipeline dashboard showing stage conversion rates. The dashboard shows 0% conversion from "Qualification" to "Proposal" because the stage date stamp automation only fires on stage changes made through the UI, not on bulk updates, API imports, or changes made by other automations.

**Challenge:**

Flows triggered by record changes only fire when the triggering context matches the Flow's configuration. Before-save record-triggered Flows fire on all DML (UI, API, bulk), but after-save Flows may not fire in all bulk contexts. Date stamps that depend on Flow execution will have gaps.

**Approach:**

1. Use Before Save Record-Triggered Flows for all date stamp logic -- these fire on every DML operation, including bulk and API
2. Add a scheduled Flow that runs nightly to catch any records that slipped through (belt-and-suspenders approach -- only stamp if field is blank)
3. For historical records that were never stamped, run a one-time backfill using the Opportunity Stage History object (if available) or Data Loader
4. Validate report accuracy by spot-checking 20 records against actual stage change dates

**Key validation:**

Run a report showing all Opportunities where any stage date stamp is null but the stage is past that point. Count should be zero after remediation. Rerun weekly for the first month to catch new gaps.

### Edge Case 4: Client Has No Marketing Spend Data for CAC Calculation

**Scenario:**

Client wants a CAC report but does not track marketing spend in any system. Costs are spread across invoices, credit card statements, and agency retainers. There is no single source for "total marketing spend in Q1."

**Challenge:**

CAC calculation requires total acquisition spend. Without a centralized cost tracking mechanism, the report either omits marketing costs (making CAC artificially low) or requires manual data entry each period (fragile and often abandoned).

**Approach:**

1. Start with a simplified CAC using only data available in the CRM: count of new customers from Closed Won Opportunities
2. Create a manual input mechanism: a Google Sheet or custom object where Marketing Ops enters monthly spend by channel
3. Build the report to pull customer count from CRM and join with spend data from the manual source
4. Over time, push toward automated cost tracking (e.g., HubSpot Ads integration, Salesforce Campaign cost fields)
5. Label the CAC report as "Blended CAC - Partial Data" until full cost coverage is achieved

**Key validation:**

Compare calculated CAC against industry benchmarks for the client's segment. If CAC appears unrealistically low (e.g., under $500 for a $50K ACV product), investigate whether major cost categories are missing from the calculation.

### Edge Case 5: Renewal Reminders Firing Incorrectly Due to Date Field Issues

**Scenario:**

Client sets up a renewal reminder Flow that triggers 90/60/30 days before the Contract End Date field. But some Accounts have Contract End Date set to 12/31/9999 (the "no end date" default), others have dates in the past, and some have the field blank. The Flow sends erroneous reminders or fails silently.

**Challenge:**

Date-based automations are only as reliable as the date data they depend on. Bad dates (nulls, placeholder values, past dates) cause false positives, false negatives, or Flow errors.

**Approach:**

1. Before building the renewal Flow, run a data quality report on the Contract End Date field: count of nulls, count of dates before today, count of placeholder dates (12/31/9999 or 01/01/2000)
2. Clean the data: work with CS team to populate correct end dates; set placeholder dates to null
3. Add guard clauses in the Flow: skip records where Contract End Date is null, in the past, or more than 5 years in the future
4. Build a weekly exception report showing Accounts with missing or suspicious end dates
5. Configure the three-tier reminder structure: 90 days (CS evaluates account health), 60 days (negotiation begins), 30 days (final decision escalation)

**Key validation:**

Run the renewal reminder Flow in preview mode for all Accounts. Verify that only Accounts with valid future end dates receive reminders. Confirm reminder count matches expected renewals for the period.

---

## References

[1] IBM - System of Record vs Source of Truth

[2] Kohezion - System of Record vs Source of Truth: What is the Difference?

[3] Operatus - Time Stamps For Staging? Everything You Need to Know

[4] Salesforce - New Research Reveals Sales Reps Spend Less than 30% of Time Selling

[5] Salesforce Ben - Migrate Salesforce Workflow Rules & Process Builder to Flow

[6] Salesforce - Planning Your Switch to Flow Builder

[7] LeanData - Round Robin Lead Distribution Best Practices

[8] Default - Lead Routing: What it is, Best Practices, Strategy and How to Automate it

[9] CRM.org - 45 CRM Statistics You Need to Know in 2025

[10] Nutshell - CRM Statistics That Prove CRM Helps Increase Revenue

[11] HubiFi - B2B SaaS Benchmarks: Churn, CAC, LTV, and Growth Rates

[12] Benchmarkit - 2024 B2B SaaS Performance Metrics

[13] Vitally - B2B SaaS Churn Rate Benchmarks

[14] HBR - The Short Life of Online Sales Leads

[15] Saffron Edge - B2B SaaS Renewal Strategy & Marketing Automation Guide
