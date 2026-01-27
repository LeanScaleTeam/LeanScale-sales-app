# Renewal, Churn, NRR/GRR Reporting - Playbook

## 1. Definition

**What it is**: A data infrastructure and reporting project that establishes the definitions, data models, dashboards, and processes to accurately track customer retention metrics including renewals, churn, Net Revenue Retention (NRR), and Gross Revenue Retention (GRR). Delivers a comprehensive view of customer health and revenue predictability.

**What it is NOT**: Not a Customer Success Platform implementation (that's the CS tool itself). Not a Customer Health Score project (that's predictive modeling). Not Renewal Management automation (that's workflow/process automation). Not ARR Reporting alone (that's broader financial metrics).

## 2. ICP Value Proposition

**Pain it solves**: Leadership lacks reliable visibility into retention metrics. Finance and CS report different churn numbers. NRR/GRR are calculated inconsistently or not at all. Renewal pipeline is reactive rather than proactive. Teams can't identify churn risk until it's too late.

**Outcome delivered**: Single source of truth for retention metrics with clear definitions. Real-time dashboards showing renewal pipeline, churn analysis, and NRR/GRR trends. Finance-reconciled metrics that match board reporting. Proactive visibility into at-risk renewals.

**Who owns it**: VP of Customer Success, RevOps Leader, or CFO. Typically a joint effort between CS Ops and Finance.

## 3. Implementation Procedure

### Part 1: Discovery & Metric Definition

#### Step 1: Audit Current Retention Tracking

**Step Overview:** Assess how renewals, churn, and retention metrics are currently tracked (if at all) across the organization. End state: Gap analysis documenting what exists, what's missing, and where data lives.

- Interview CS leadership on how they currently track renewals and churn
- Review existing dashboards and reports for retention metrics
- Identify all data sources: CRM (Salesforce/HubSpot), billing system, CS platform (Gainsight/ChurnZero/Vitally)
- Document current definitions being used (are they consistent across teams?)
- Assess data quality: subscription start/end dates, contract values, renewal dates
- Quantify the gap (e.g., "Finance says 92% GRR, CS says 88%")

#### Step 2: Establish Metric Definitions

**Step Overview:** Define clear, company-wide definitions for renewal, churn, NRR, and GRR that align with industry standards and finance requirements. End state: Documented metric definitions approved by CS, Finance, and leadership.

- Define GRR formula: (Starting MRR - Contraction - Churn) / Starting MRR
- Define NRR formula: (Starting MRR + Expansion - Contraction - Churn) / Starting MRR
- Define churn types: voluntary vs involuntary, customer churn vs revenue churn
- Establish measurement period (monthly, quarterly, annual cohorts)
- Determine treatment of edge cases: mid-contract downgrades, early renewals, multi-year contracts
- Get sign-off from Finance and CS leadership on definitions
- Document in a Retention Metrics Definition Guide

#### Step 3: Map Data Sources and Requirements

**Step Overview:** Create a data architecture map showing where each data element lives and how it flows into retention calculations. End state: Data requirements document specifying source systems, fields, and integration needs.

- Map subscription/contract data location (CRM opportunity records, billing system)
- Map expansion/contraction data (upsell opportunities, pricing changes)
- Map churn event data (cancellation records, non-renewal flags)
- Identify data gaps (missing renewal dates, incomplete contract values)
- Document required integrations between systems
- Define data refresh frequency requirements (real-time vs daily vs monthly)

---

### Part 2: Data Model & CRM Configuration

#### Step 1: Build Subscription Data Model

**Step Overview:** Create or enhance the data structures needed to track subscription lifecycle including start/end dates, renewals, expansions, and churn events. End state: Data model implemented in CRM with proper object relationships.

- Design subscription/contract object structure (if not using existing)
- Define required fields: contract start date, contract end date, contract value, renewal date, renewal owner
- Create fields for tracking: expansion ARR, contraction ARR, churn reason, churn date
- Establish relationships: Account → Contracts → Renewal Opportunities
- Configure record types or picklists for contract status (active, renewed, churned, downgraded)
- Set up auto-calculation fields for ARR and MRR if needed

#### Step 2: Configure Renewal Pipeline

**Step Overview:** Set up the renewal opportunity workflow in the CRM to track upcoming renewals as a pipeline. End state: Renewal opportunities automatically created and staged for each account approaching renewal.

- Create renewal opportunity record type or stage values
- Configure automation to create renewal opportunities 90-120 days before contract end
- Set up renewal amount calculation (prior contract value as baseline)
- Define renewal stages: Upcoming, In Progress, Committed, Closed Won, Closed Lost
- Configure probability percentages for each stage
- Set up renewal owner assignment rules (CSM or Account Manager)
- Test automation with sample records

#### Step 3: Implement Churn Tracking

**Step Overview:** Configure the system to capture and categorize churn events with proper reason coding. End state: Churn events captured with reason codes and linked to the correct account/contract.

- Create churn reason picklist (competitive loss, budget cut, poor fit, product gaps, etc.)
- Configure churn event capture (Closed Lost renewal, contract termination)
- Set up voluntary vs involuntary churn categorization
- Build automation to flag churned accounts and update account status
- Configure churn date capture (effective date vs decision date)
- Test churn recording workflow with sample scenarios

---

### Part 3: Reporting & Dashboards

#### Step 1: Build Core Retention Reports

**Step Overview:** Create the foundational reports that calculate GRR, NRR, and renewal rates using the defined formulas. End state: Core retention reports showing accurate metrics that match agreed-upon definitions.

- Build monthly GRR calculation report (cohort-based)
- Build monthly NRR calculation report including expansion
- Create renewal rate report (won renewals / total renewals due)
- Build churn analysis report by reason, segment, and time period
- Create ARR movement report (starting ARR, new, expansion, contraction, churn, ending ARR)
- Validate calculations with Finance using historical data

#### Step 2: Develop Executive Dashboard

**Step Overview:** Create a leadership dashboard providing at-a-glance visibility into retention health and trends. End state: Executive dashboard deployed showing key retention KPIs with trend lines.

- Design dashboard layout with key metrics prominently displayed
- Add NRR and GRR gauges with benchmark comparisons (target: NRR >100%, GRR >90%)
- Include renewal pipeline summary (by stage, by amount, by owner)
- Add churn trend chart (rolling 12-month view)
- Include segment breakdowns (by tier, industry, contract value)
- Add leading indicator widgets (at-risk accounts, overdue renewals)
- Set up automated dashboard delivery to leadership

#### Step 3: Build Operational Renewal Dashboard

**Step Overview:** Create a working dashboard for CS and Account teams to manage their renewal pipeline day-to-day. End state: Operational dashboard enabling teams to prioritize and act on renewal opportunities.

- Build renewal pipeline view by owner and stage
- Add time-based filters (renewals this month, this quarter)
- Include health indicators for each renewal (engagement, support tickets, NPS)
- Create at-risk renewal list with early warning signals
- Add expansion opportunity tracking alongside renewals
- Include forecast vs actual renewal comparison
- Enable drill-down to individual account details

---

### Part 4: Validation, Training & Handoff

#### Step 1: Validate Data Accuracy

**Step Overview:** Reconcile retention metrics with Finance and historical data to ensure accuracy before go-live. End state: Metrics validated and discrepancies resolved, signed off by Finance.

- Pull retention metrics for last 4-6 quarters from new system
- Compare to historical Finance/board reports
- Identify and investigate any discrepancies
- Adjust calculations or data as needed to resolve gaps
- Document any known limitations or data quality issues
- Get formal sign-off from Finance on metric accuracy
- Create data quality monitoring process for ongoing accuracy

#### Step 2: Train CS and Leadership Teams

**Step Overview:** Train stakeholders on how to interpret and act on retention metrics and dashboards. End state: Teams trained and using the system, with documentation for reference.

- Schedule training sessions for CS team (30-45 min)
- Cover: metric definitions, dashboard navigation, how to update renewals
- Train leadership on executive dashboard interpretation
- Create quick reference guide for common tasks
- Document churn reason coding guidelines
- Provide recording for async viewing
- Set up office hours for Q&A during first month

#### Step 3: Establish Ongoing Cadence and Handoff

**Step Overview:** Transfer ownership to client team with clear processes for maintaining data quality and reporting cadence. End state: Client self-sufficient with documented processes and admin access.

- Define monthly retention review cadence (when, who, what's reviewed)
- Document renewal pipeline review process
- Create playbook for handling churn event recording
- Transfer admin access and credentials to client RevOps
- Deliver documentation package (metric definitions, dashboard guide, troubleshooting)
- Schedule 30-day check-in for questions and optimization
- Close out project

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Active CRM (Salesforce or HubSpot) with account and opportunity data
- Historical contract/subscription data (at least 12 months preferred)
- Access to billing system or finance records for revenue validation
- CS Platform access if one exists (Gainsight, ChurnZero, Vitally, Totango)
- Defined customer segments or tiers (if segmented reporting needed)

**What client must provide:**
- CRM admin access and permissions to create fields/objects/automations
- Finance contact for metric definition sign-off and validation
- CS leadership availability for interviews and definition alignment
- Historical retention data for validation (prior board decks, finance reports)
- List of current renewal owners and account assignments

## 5. Common Pitfalls

- **Inconsistent definitions across teams**: Finance, CS, and Sales use different churn definitions leading to conflicting metrics. → **Mitigation**: Lock in definitions upfront with all stakeholders before building anything. Document in a shared Metric Definitions Guide.

- **Data quality issues in source systems**: Missing renewal dates, incomplete contract values, or duplicate records make calculations unreliable. → **Mitigation**: Conduct data audit in discovery phase. Build data quality reports and establish ongoing hygiene process.

- **Focusing only on lagging indicators**: Teams only see churn after it happens, missing early warning signs. → **Mitigation**: Include leading indicators (engagement drops, support spike, response lag) in dashboards alongside NRR/GRR.

- **Overcomplicating metric calculations**: Trying to account for every edge case creates formulas that can't be validated or explained. → **Mitigation**: Start with standard industry formulas. Document how edge cases are handled. Keep calculations auditable.

## 6. Success Metrics

- **Leading Indicator**: Renewal pipeline is being actively managed (renewals created 90+ days out, stage progression, CS engagement with dashboard)

- **Lagging Indicator**: NRR/GRR metrics match Finance reporting within 2% variance. Teams can answer retention questions without manual spreadsheet work. Churn reasons are consistently captured (>90% of churned accounts have reason codes).

---

