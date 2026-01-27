---
displayed_sidebar: inDepthSidebar
title: "Growth Model Methodology"
sidebar_position: 2
---

# Growth Model Methodology

Discovery & Data Collection - Benchmark Analysis - Current State Baseline

## Part 1: Discovery & Data Collection

### Step 1: Conduct Kickoff and Align on Targets

**Step Overview:** Meet with executive sponsor (CRO/VP Sales) to validate top-down ARR targets and understand board-level expectations. End state: Documented quarterly ARR targets with segment breakdown and strategic context.

- Schedule 60-minute kickoff with CRO/VP Sales and RevOps lead
- Validate annual and quarterly ARR targets from board deck or exec planning docs
- Clarify how revenue is segmented (Enterprise, Mid-Market, SMB) and definitions for each
- Understand any planned pricing changes, product launches, or market expansions
- Document strategic priorities (e.g., "focus on enterprise" vs "scale SMB")
- Confirm project timeline and key milestones

---
displayed_sidebar: inDepthSidebar

**Kickoff Agenda Template (60 min):**

| Time | Topic | Output |
|------|-------|--------|
| 0-10 min | Introductions, project goals | Alignment on success criteria |
| 10-25 min | Review ARR targets and board context | Documented quarterly targets |
| 25-40 min | Segment definitions and priorities | Segment breakdown |
| 40-50 min | Strategic context (pricing, product, market) | Assumptions documented |
| 50-60 min | Timeline, milestones, next steps | Project plan confirmed |

**Key Questions:**
- What are your quarterly ARR targets for the next 4 quarters?
- How do you define Enterprise vs Mid-Market vs SMB?
- What percentage of new ARR should come from each segment?
- Are there any planned pricing changes or product launches?
- What's the board's primary concern: growth rate, efficiency, or both?

---
displayed_sidebar: inDepthSidebar

### Step 2: Extract Historical CRM Data

**Step Overview:** Pull 12-18 months of closed-won deal data and calculate historical conversion rates by segment and source. End state: Clean dataset of historical performance with conversion metrics ready for analysis.

- Request CRM admin access or coordinate data export with RevOps
- Pull closed-won deals for last 12-18 months with stage history, close dates, and ACV
- Segment deals by customer type (Enterprise, Mid-Market, SMB)
- Calculate historical conversion rates: MQL-to-SQL, SQL-to-Opp, Opp-to-CW by segment
- Extract average sales cycle length by segment
- Note data quality issues and gaps for discussion with stakeholder

---
displayed_sidebar: inDepthSidebar

**Required CRM Data Fields:**

| Field | Purpose |
|-------|---------|
| Opportunity Name | Identification |
| Close Date | Time-based analysis |
| Stage History | Conversion rate calculation |
| Amount / ACV | Revenue analysis |
| Segment (Custom Field) | Segment breakdown |
| Lead Source | Source analysis |
| Created Date | Cycle length calculation |
| Rep Owner | Productivity analysis |

**Conversion Rate Calculations:**

```
MQL → SQL Rate = SQLs / MQLs
SQL → Opp Rate = Opportunities Created / SQLs
Opp → CW Rate (Win Rate) = Closed-Won / Opportunities Created
Average Sales Cycle = Avg(Close Date - Opportunity Created Date)
```

---
displayed_sidebar: inDepthSidebar

### Step 3: Gather NRR and Benchmark Data

**Step Overview:** Collect retention metrics and industry benchmarks to establish current state vs target state. End state: Comparison table showing current metrics against relevant industry benchmarks.

- Calculate current NRR components: gross retention, expansion rate, contraction rate, churn rate
- Break out retention metrics by customer cohort if available
- Pull relevant industry benchmarks from KeyBanc, OpenView, or Bessemer for client's stage and ACV
- Identify which Power 10 metrics are most relevant for this client
- Create current vs benchmark comparison table
- Flag the 2-3 metrics with largest gap to benchmark

---
displayed_sidebar: inDepthSidebar

**NRR Component Calculations:**

| Metric | Formula |
|--------|---------|
| **Gross Revenue Retention** | (Starting ARR - Contraction - Churn) / Starting ARR |
| **Net Revenue Retention** | (Starting ARR + Expansion - Contraction - Churn) / Starting ARR |
| **Expansion Rate** | Expansion ARR / Starting ARR |
| **Contraction Rate** | Contraction ARR / Starting ARR |
| **Logo Churn** | Churned Customers / Starting Customers |
| **Revenue Churn** | Churned ARR / Starting ARR |

**Industry Benchmarks (2024-2025):**

| Metric | Median | Top Quartile |
|--------|--------|--------------|
| Win Rate | 20-25% | 30%+ |
| Sales Cycle (Mid-Market) | 60-90 days | 45-60 days |
| NRR (over $50k ACV) | 105% | 120%+ |
| Pipeline Coverage | 3x | 4x+ |
| Quota Attainment | 50-60% | 70%+ |

---
displayed_sidebar: inDepthSidebar

### Step 4: Document Current State Baseline

**Step Overview:** Synthesize discovery findings into a structured baseline document for model building. End state: Discovery summary deliverable ready for stakeholder review.

- Build current state metrics table with segment breakdown
- Create NRR waterfall showing expansion, contraction, and churn contributions
- Document data sources and any caveats on data quality
- Summarize key findings and preliminary gap observations
- Review baseline with stakeholder before moving to model build

---
displayed_sidebar: inDepthSidebar

**Current State Baseline Template:**

```markdown
## Current State Baseline

### ARR Overview
- Current ARR: $X
- Target ARR (EOY): $Y
- Required Growth: Z%

### Conversion Metrics by Segment

| Metric | Enterprise | Mid-Market | SMB | Blended |
|--------|------------|------------|-----|---------|
| MQL → SQL | | | | |
| SQL → Opp | | | | |
| Win Rate | | | | |
| Avg Cycle | | | | |
| ACV | | | | |

### NRR Waterfall
- Starting ARR: $X
- + Expansion: $Y
- - Contraction: $Z
- - Churn: $A
- = Ending ARR: $B
- NRR: X%

### Key Gaps Identified
1. [Gap 1 - metric, current vs benchmark]
2. [Gap 2 - metric, current vs benchmark]
3. [Gap 3 - metric, current vs benchmark]

### Data Quality Notes
- [Any caveats or gaps in the data]
```

---
displayed_sidebar: inDepthSidebar

## Discovery Output Summary

At the end of the Discovery & Methodology phase, you should have:

1. **Target Alignment**
   - Quarterly ARR targets documented
   - Segment breakdown and definitions
   - Strategic priorities understood
   - Board context captured

2. **Historical Performance Data**
   - 12-18 months of closed-won deals extracted
   - Conversion rates calculated by segment
   - Sales cycle lengths documented
   - Data quality issues noted

3. **Benchmark Comparison**
   - NRR components calculated
   - Industry benchmarks identified
   - Current vs benchmark gap analysis
   - Top 2-3 priority gaps flagged

4. **Current State Baseline**
   - Consolidated metrics document
   - NRR waterfall visualization
   - Stakeholder review completed
   - Ready for model build

**Key Decisions Made:**
- Which segments to model separately
- Which benchmarks are most relevant
- Which metrics have the biggest gaps
- What data quality issues need addressing
