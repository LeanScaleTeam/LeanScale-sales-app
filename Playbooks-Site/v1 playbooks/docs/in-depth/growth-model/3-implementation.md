---
displayed_sidebar: inDepthSidebar
title: "Growth Model Implementation"
sidebar_position: 3
---

# Growth Model Implementation

Build Financial Model - Bottoms-Up Targets - Capacity Planning - Scenario Modeling - Validation

## Part 2: Build Financial Model

### Step 1: Structure the Power 10 Metrics Framework

**Step Overview:** Build the core spreadsheet structure with current, target, and benchmark columns organized by the Power 10 metrics. End state: Model shell ready for bottoms-up calculations.

- Create spreadsheet with tabs for: Inputs, Model, Scenarios, Dashboard
- Set up Power 10 metrics framework with current values from discovery
- Add benchmark column with industry targets for each metric
- Configure segment breakdown (Enterprise, Mid-Market, SMB) in model structure
- Build input cells for assumptions that can be easily updated monthly
- Document each input source and assumption rationale in notes column

---
displayed_sidebar: inDepthSidebar

**Model Tab Structure:**

| Tab | Purpose | Contents |
|-----|---------|----------|
| **Inputs** | Assumptions and variables | Current metrics, targets, benchmarks, assumptions |
| **Model** | Core calculations | Bottoms-up math by segment and quarter |
| **ARR Momentum** | Monthly ARR tracking | New/Expansion/Contraction/Churn waterfall |
| **Capacity** | Rep planning | Headcount, productivity, hiring timeline |
| **Scenarios** | What-if analysis | Base, upside, conservative cases |
| **Dashboard** | Executive view | Key outputs, charts, gap analysis |

**Input Cell Design:**
- All assumptions in one tab for easy updates
- Color-code: Blue = input, Black = calculation, Green = target
- Add notes column explaining each assumption source
- Include "last updated" date field

---
displayed_sidebar: inDepthSidebar

### Step 2: Calculate Bottoms-Up Revenue Targets

**Step Overview:** Model the required conversion rates, pipeline coverage, and lead volumes to hit quarterly ARR targets. End state: Bottoms-up forecast showing what needs to be true to hit each quarter's target.

- Work backward from quarterly ARR targets to required closed-won deals by segment
- Calculate pipeline coverage needed (typically 3-4x for predictable forecasting)
- Determine required opportunity volume based on historical win rates
- Model lead volume requirements based on MQL-to-Opp conversion rates
- Factor in average sales cycle length for timing of pipeline generation
- Reconcile bottoms-up requirements against current capacity

---
displayed_sidebar: inDepthSidebar

**Bottoms-Up Calculation Flow:**

```
Quarterly ARR Target: $1,000,000 New ARR

Step 1: Required Closed-Won Deals
$1,000,000 / $50,000 ACV = 20 deals needed

Step 2: Required Opportunities (at 25% win rate)
20 deals / 0.25 = 80 opportunities needed

Step 3: Required Pipeline Coverage (at 3x)
$1,000,000 × 3 = $3,000,000 pipeline needed

Step 4: Required SQLs (at 40% SQL→Opp)
80 opps / 0.40 = 200 SQLs needed

Step 5: Required MQLs (at 30% MQL→SQL)
200 SQLs / 0.30 = 667 MQLs needed

Step 6: Timing Adjustment
If 60-day sales cycle, pipeline for Q2 must be created in Q1
```

---
displayed_sidebar: inDepthSidebar

### Step 3: Model Capacity Requirements

**Step Overview:** Determine rep count, ramp assumptions, and resource needs by quarter to support revenue targets. End state: Capacity plan showing hiring needs and productivity assumptions.

- Calculate quota capacity based on current fully-ramped rep count
- Model new hire requirements based on target attainment assumptions
- Factor in ramp time (typically 3-6 months to full productivity)
- Calculate implied rep productivity and compare to benchmarks
- Identify capacity gaps by quarter
- Document hiring timeline implications

---
displayed_sidebar: inDepthSidebar

**Capacity Model Components:**

| Input | How to Calculate | Benchmark |
|-------|------------------|-----------|
| Fully Ramped Reps | Count of reps past ramp period | - |
| Ramping Reps | Count × ramp % (month 1-3: 25%, 4-6: 75%) | 3-6 month ramp |
| Quota per Rep | Annual quota / rep | Varies by segment |
| Attainment Assumption | % of quota expected | 70-80% realistic |
| Capacity | Ramped Reps × Quota × Attainment | - |
| Gap | Target - Capacity | - |

**Rep Productivity Benchmarks:**

| Segment | ARR per Rep | Typical Quota |
|---------|-------------|---------------|
| Enterprise | $600k-$1M+ | $800k-$1.2M |
| Mid-Market | $400k-$600k | $500k-$700k |
| SMB | $200k-$400k | $300k-$500k |

---
displayed_sidebar: inDepthSidebar

### Step 4: Build ARR Momentum Table

**Step Overview:** Create monthly ARR tracking table that breaks out New, Expansion, Contraction, and Churned ARR. End state: ARR waterfall showing path from current to target ARR.

- Set up monthly columns for trailing 12 months plus forecast period
- Break out ARR components: Starting ARR, New ARR, Expansion, Contraction, Churn, Ending ARR
- Apply NRR assumptions to existing customer base
- Model expansion revenue based on historical upsell rates
- Calculate net new ARR required each month
- Validate ending ARR matches quarterly targets

---
displayed_sidebar: inDepthSidebar

**ARR Momentum Table Structure:**

| Row | Jan | Feb | Mar | Q1 Total |
|-----|-----|-----|-----|----------|
| Starting ARR | $5,000,000 | $5,150,000 | $5,300,000 | $5,000,000 |
| + New ARR | $100,000 | $100,000 | $100,000 | $300,000 |
| + Expansion | $75,000 | $75,000 | $75,000 | $225,000 |
| - Contraction | ($10,000) | ($10,000) | ($10,000) | ($30,000) |
| - Churn | ($15,000) | ($15,000) | ($15,000) | ($45,000) |
| = Ending ARR | $5,150,000 | $5,300,000 | $5,450,000 | $5,450,000 |
| Net New ARR | $150,000 | $150,000 | $150,000 | $450,000 |

---
displayed_sidebar: inDepthSidebar

### Step 5: Build Scenario Models

**Step Overview:** Create base, upside, and conservative scenarios with sensitivity analysis on key drivers. End state: Three scenario views showing range of outcomes based on different assumptions.

- Duplicate base model for upside and conservative scenarios
- Identify 3-4 key driver variables for sensitivity (win rate, cycle length, churn, ACV)
- Model upside case with optimistic but achievable assumptions
- Model conservative case with current-state assumptions plus headwinds
- Create sensitivity table showing ARR impact of +/- 10% on each key driver
- Build scenario comparison summary for leadership presentation

---
displayed_sidebar: inDepthSidebar

**Scenario Definitions:**

| Scenario | Win Rate | Sales Cycle | ACV | Churn | NRR |
|----------|----------|-------------|-----|-------|-----|
| **Upside** | +5% vs current | -10 days | +10% | -20% | +5% |
| **Base** | Current state | Current | Current | Current | Current |
| **Conservative** | -5% vs current | +10 days | -5% | +20% | -3% |

**Sensitivity Analysis Table:**

| Variable | Base Value | +10% Impact | -10% Impact |
|----------|------------|-------------|-------------|
| Win Rate | 25% | +$X ARR | -$X ARR |
| ACV | $50k | +$X ARR | -$X ARR |
| Sales Cycle | 60 days | -$X ARR | +$X ARR |
| Churn | 10% | -$X ARR | +$X ARR |

---
displayed_sidebar: inDepthSidebar

## Part 3: Validate and Stress-Test Model

### Step 1: Cross-Reference Against Current Pipeline

**Step Overview:** Validate model feasibility by comparing bottoms-up requirements against actual weighted pipeline. End state: Feasibility assessment confirming targets are achievable or identifying gaps.

- Pull current pipeline with stage, probability, and expected close date
- Calculate weighted pipeline value by quarter
- Compare weighted pipeline to model's required pipeline coverage
- Identify gap between current pipeline and model requirements
- Flag quarters where pipeline coverage is below 3x target
- Document pipeline health assessment for stakeholder discussion

---
displayed_sidebar: inDepthSidebar

### Step 2: Validate Assumptions with Stakeholders

**Step Overview:** Review model assumptions with sales and RevOps leaders to ensure they reflect operational reality. End state: Stakeholder-validated assumptions with documented rationale.

- Schedule assumption review session with VP Sales and RevOps
- Walk through conversion rate assumptions and get sign-off
- Validate hiring plan is realistic given recruiting capacity
- Confirm NRR assumptions align with CS team's view
- Adjust model based on stakeholder feedback
- Document final assumptions and who validated each

---
displayed_sidebar: inDepthSidebar

### Step 3: Quantify Gap Analysis

**Step Overview:** Identify the 2-3 metrics most out of line with benchmarks and translate gaps into dollar impact. End state: Prioritized list of improvement areas with quantified ARR impact.

- Calculate dollar impact of each metric gap (e.g., "improving win rate by 5% = $X ARR")
- Rank gaps by ease of improvement vs ARR impact
- Identify which gaps are addressable in current planning period
- Map gaps to potential initiatives or projects
- Create gap analysis summary for executive presentation

**Gap Prioritization Framework:**

| Metric | Current | Benchmark | Gap | ARR Impact | Effort | Priority |
|--------|---------|-----------|-----|------------|--------|----------|
| Win Rate | 20% | 25% | 5% | $500k | Medium | High |
| Sales Cycle | 90 days | 60 days | 30 days | $300k | High | Medium |
| NRR | 100% | 110% | 10% | $400k | Medium | High |

---
displayed_sidebar: inDepthSidebar

## Part 4: Handoff & Enablement

### Step 1: Present Findings to Leadership

**Step Overview:** Deliver executive presentation with prioritized recommendations and model walkthrough. End state: Leadership aligned on model outputs, key gaps, and recommended actions.

- Build presentation deck with: executive summary, methodology, key findings, gap analysis, recommendations
- Lead with the 2-3 metrics most out of line and what to do about them
- Present scenario comparison showing range of outcomes
- Include Rule of 40 and Magic Number context for board-readiness
- Facilitate discussion on resource allocation and prioritization
- Capture decisions and action items from meeting

---
displayed_sidebar: inDepthSidebar

### Step 2: Train Internal Team on Model Maintenance

**Step Overview:** Enable RevOps or Finance to update the model monthly without external support. End state: Client team confident in model mechanics and update process.

- Schedule 60-minute training session with model owner (RevOps or Finance)
- Walk through model structure, input cells, and formulas
- Demonstrate monthly update process step-by-step
- Create quick-reference guide for common update tasks
- Practice one update cycle together
- Confirm client can execute update in 2 hours or less

---
displayed_sidebar: inDepthSidebar

### Step 3: Deliver Documentation Package

**Step Overview:** Provide complete documentation covering model inputs, assumptions, and update cadence. End state: Self-sufficient client with all materials needed for ongoing model use.

- Create model documentation covering: input sources, key formulas, assumptions log
- Build executive summary view formatted for board reporting
- Document update SOP with monthly cadence and data sources
- Include troubleshooting guide for common issues
- Package all materials in shared folder with clear naming
- Confirm client has access to all documentation

---
displayed_sidebar: inDepthSidebar

## Implementation Output Summary

At the end of the Implementation phase, you should have:

1. **Financial Model**
   - Complete spreadsheet with Inputs, Model, Scenarios, Dashboard tabs
   - Power 10 metrics framework populated
   - Segment breakdown configured
   - Input cells documented with sources

2. **Bottoms-Up Targets**
   - Required deals, pipeline, leads by quarter
   - Pipeline coverage requirements
   - Timing adjustments for sales cycle

3. **Capacity Plan**
   - Current capacity calculated
   - Hiring needs by quarter
   - Ramp assumptions documented
   - Productivity benchmarks compared

4. **ARR Momentum Table**
   - Monthly tracking structure
   - NRR components modeled
   - Path to target visualized

5. **Scenario Analysis**
   - Base, upside, conservative cases
   - Sensitivity on key drivers
   - Range of outcomes documented

6. **Validation**
   - Pipeline coverage assessed
   - Stakeholder assumptions validated
   - Gap analysis quantified
