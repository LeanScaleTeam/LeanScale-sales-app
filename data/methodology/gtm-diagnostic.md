# GTM Diagnostic — Methodology

## 1) Core Concepts

### The GTM Engine as an Inspectable System

**What is it?**

A B2B SaaS company's Go-to-Market engine is the interconnected set of systems, processes, data, and people that create, convert, and retain revenue. Like a physical engine, each component affects the others -- a misconfigured CRM degrades reporting accuracy, which degrades decision-making, which degrades pipeline quality. The GTM Diagnostic treats this engine as a system that can be inspected, scored, and compared against known-good benchmarks.

**Why does it matter?**

Most leadership teams know "something is broken" but cannot isolate whether the root cause is a systems problem (bad CRM configuration), a process problem (undefined handoffs), a data problem (unreliable metrics), or a people problem (low adoption). Without a structured inspection, teams fix symptoms instead of causes. According to Gartner, organizations that align their GTM functions around shared data and processes achieve 15-20% faster revenue growth than those with siloed operations [1].

**Key insight:**

> The diagnostic does not create strategy -- it creates clarity.

Telling a leadership team "your MQL-to-SQL conversion is 8% against a 13% benchmark" is more actionable than telling them "your funnel needs work."

**Examples:**

| Context | Example |
|---------|---------|
| Systems gap | CRM has no required fields on opportunity creation, so 40% of deals have no close date -- pipeline reporting is unreliable |
| Process gap | No documented handoff from Marketing to SDR -- leads sit untouched for 72+ hours on average |
| Data gap | MQL is defined differently in HubSpot (form fill + score > 50) and Salesforce (status = "MQL") -- funnel metrics conflict |
| People gap | Only 3 of 12 AEs log activities in Salesforce -- activity-based forecasting is impossible |

### The Four Inspection Domains

**What is it?**

The GTM Diagnostic evaluates a company's GTM engine across four interconnected domains. Each domain contains a subset of the 80+ inspection checkpoints, and each checkpoint receives a red/yellow/green rating.

**Why does it matter?**

Organizing findings into domains allows stakeholders to see where their biggest gaps cluster. A company might score well on Systems but poorly on Process -- that tells you the tech is in place but nobody uses it correctly. The domain structure also maps to natural ownership: Systems is owned by Ops, Process by Sales/Marketing leadership, Reporting by RevOps, and Performance by the executive team.

**The Framework:**

```
SYSTEMS               FUNNEL / PROCESS           REPORTING              PERFORMANCE
(Tech stack config)   (Handoffs, stages, SLAs)   (Dashboards, metrics)  (Outcomes, benchmarks)
     |                       |                        |                       |
  CRM hygiene          Stage definitions          Report inventory       CAC / LTV
  Integrations         Conversion rates           Metric consistency     Win rate
  Activity capture     Lead velocity              Data trustworthiness   Pipeline velocity
  User adoption        Handoff SLAs               Gap analysis           NRR / Churn
```

**Common misunderstandings:**

- **Misconception:** "If our Salesforce is configured well, our GTM is healthy." **Reality:** A well-configured CRM is necessary but not sufficient. If nobody follows the processes encoded in that CRM, the configuration is wasted. The Diagnostic scores both the system AND its adoption.

- **Misconception:** "We already have dashboards -- we don't need a reporting inspection." **Reality:** Dashboards can show the wrong numbers. If the MQL definition in your marketing automation platform does not match the MQL definition in your CRM, every funnel dashboard is wrong. The Diagnostic checks metric consistency across systems, not just whether dashboards exist.

### The Power10 Scorecard

**What is it?**

The Power10 is a curated set of 10 GTM metrics that, taken together, represent the health of a B2B SaaS company's revenue engine. Each metric is scored against stage-appropriate benchmarks (adjusted for ARR range, segment, and motion type) and assigned a red/yellow/green rating. The Power10 is the executive summary artifact -- it tells leadership "here are the 10 numbers that matter most, and here is how you compare."

**Why does it matter?**

Executives do not have time to review 80+ checkpoints. The Power10 distills the diagnostic into 10 numbers that drive board-level decisions. A red rating on CAC Payback Period communicates urgency in a way that a 40-page report cannot. Research from Benchmarkit's 2025 SaaS Performance Metrics report found that the median B2B SaaS company recovers customer acquisition costs in 8.6 months, but top performers achieve this in 5-7 months [2]. This kind of benchmark comparison is what makes the Power10 actionable.

**The 10 Metrics:**

| # | Metric | Domain | What It Measures |
|---|--------|--------|------------------|
| 1 | Customer Acquisition Cost (CAC) | Performance | Efficiency of new customer acquisition |
| 2 | CAC Payback Period | Performance | Months to recover acquisition investment |
| 3 | Lifetime Value (LTV) | Performance | Total revenue per customer over relationship |
| 4 | LTV:CAC Ratio | Performance | Unit economics sustainability |
| 5 | Win Rate | Funnel | Sales effectiveness at closing deals |
| 6 | Average Deal Size (ACV) | Funnel | Revenue efficiency per transaction |
| 7 | Pipeline Coverage | Funnel | Pipeline health relative to quota |
| 8 | Pipeline Velocity | Funnel | Speed of pipeline movement |
| 9 | Net Revenue Retention (NRR) | Performance | Expansion vs. contraction in existing base |
| 10 | Churn Rate | Performance | Customer or revenue loss rate |

**Common misunderstandings:**

- **Misconception:** "We should aim for green on all 10 metrics." **Reality:** Almost no company is green on all 10. The Power10 identifies the 2-3 metrics with the most impact on growth and sequences fixing them in priority order. A company at $10M ARR with a red LTV:CAC but green NRR should fix acquisition economics before worrying about retention.

- **Misconception:** "These benchmarks apply equally to all SaaS companies." **Reality:** Benchmarks shift by company stage, motion type (PLG vs. sales-led), and segment focus (SMB vs. enterprise). A 30-day sales cycle is green for SMB SaaS but would be red for enterprise -- it would suggest you are not selling to the right accounts. See the Benchmarks section for stage-adjusted thresholds.

### The Inspection Report (80+ Checkpoints)

**What is it?**

The Inspection Report is the comprehensive, line-item assessment behind the Power10 summary. It evaluates 80+ individual checkpoints across the four domains (Systems, Funnel, Reporting, Performance), each rated red (critical gap), yellow (improvement needed), or green (meets best practice). Think of it as the detailed mechanic's report versus the summary on the dashboard.

**Why does it matter?**

The Power10 tells you "your pipeline coverage is weak." The Inspection Report tells you why: "Lead routing rules send 30% of inbound MQLs to the wrong AE, your SDR-to-AE handoff has no SLA, and your pipeline stage definitions do not match between Salesforce reports and your Outreach sequences." This level of detail is what makes the Roadmap actionable -- you cannot fix a metric without understanding the underlying checkpoints driving it.

**Key insight:**

> A single red metric on the Power10 usually traces back to 5-10 related yellow/red checkpoints in the Inspection Report. The diagnostic's value is connecting those dots.

---

## 2) Decision Frameworks

### Approach Selection Matrix

_The GTM Diagnostic has a bounded scope (one week), but the depth of analysis varies based on client context. Use this matrix to determine emphasis._

| Situation | Recommended Emphasis | Why |
|-----------|----------------------|-----|
| Client has Salesforce + HubSpot + Outreach (full stack) | All four domains equally weighted | Full data availability enables comprehensive assessment |
| Client has only HubSpot (CRM + MAP combined) | Systems lighter, Funnel/Process heavier | Fewer integration points to inspect; focus on how well they use what they have |
| Client has data quality concerns (voiced in intake) | Systems and Reporting domains first | Validate data trustworthiness before calculating performance metrics |
| Client is pre-$10M ARR | Funnel and Performance domains heavier | At this stage, unit economics and conversion efficiency matter more than systems maturity |
| Client recently hired a CRO/VP Sales | All four domains + stakeholder alignment emphasis | New leader needs a baseline; position diagnostic as their "first 90 days" tool |
| Client has been through a recent CRM migration | Systems domain heavier, with data integrity focus | Migrations often introduce data quality regressions that are invisible until audited |

### Scoping Factors

**1. Tech Stack Complexity**

- Single-platform (HubSpot all-in-one) --> Fewer integration checkpoints, deeper process analysis
- Multi-platform (Salesforce + HubSpot + Outreach + Gong + ZoomInfo) --> More integration checkpoints, data consistency becomes a major finding area
- Custom/legacy systems --> May need to reduce checkpoint count; flag inaccessible systems early

**2. Company Stage (ARR)**

- $5M-$15M --> Benchmark against early-growth standards; expect more yellow/red on systems maturity; focus on whether foundations are in place
- $15M-$50M --> Benchmark against mid-market standards; expect functional systems but process gaps; focus on scalability
- $50M-$100M --> Benchmark against scale-up standards; expect mature systems but potential technical debt; focus on efficiency and optimization

**3. Data Availability**

- 90+ days of clean data --> Full benchmarking possible; Power10 calculations reliable
- 30-90 days of data --> Directional analysis only; flag data gaps as a finding; use shorter time windows for conversion rates
- Less than 30 days / data quality is very poor --> Cannot produce reliable Power10; shift to a qualitative assessment with systems and process focus; document data quality as the primary finding

**4. Stakeholder Availability**

- Full access (VP Sales, VP Marketing, RevOps, CS) --> Reverse demo captures all perspectives; findings can be validated cross-functionally
- Partial access (one champion only) --> Risk of single-perspective bias; document assumptions; recommend follow-up interviews in Roadmap

### Diagnostic-Only vs. Diagnostic-to-Engagement

**Best for diagnostic-only:**

- Client wants an independent second opinion
- Client has internal RevOps team to execute
- Budget is limited to diagnostic scope

**Best for diagnostic-to-engagement:**

- Client has no internal RevOps capacity
- Multiple red findings that require hands-on remediation
- Client explicitly asked "what would it take to fix these?"

**Key differences:**

| Aspect | Diagnostic-Only | Diagnostic-to-Engagement |
|--------|-----------------|--------------------------|
| Roadmap detail | High-level project clusters | Detailed SOWs with hours and timelines |
| Findings framing | "Here is what we found" | "Here is what we found and here is how we fix it" |
| Handoff | Artifacts delivered, access revoked | Artifacts delivered, engagement SOW presented |

### Prioritization Framework for Findings

When building the Roadmap, prioritize findings using this 2x2:

|  | High Impact (Revenue) | Low Impact (Hygiene) |
|---|----------------------|----------------------|
| **Low Effort** (< 8 hrs) | **Do First** -- Quick wins. Example: Fix lead routing rules | **Do Second** -- Easy maintenance. Example: Standardize picklist values |
| **High Effort** (> 40 hrs) | **Plan Next** -- Strategic projects. Example: Redesign lead lifecycle | **Defer** -- Nice to have. Example: Build custom attribution model |

Impact is measured by proximity to revenue: a broken handoff that loses leads directly costs pipeline, while a misnamed custom field is a hygiene issue.

---

## 3) Benchmarks & Standards

### How to Use Benchmarks

_Benchmarks are guidelines, not rules. Always:_

1. Start with the benchmark ranges below as baseline
2. Adjust for client-specific factors (segment, motion, stage)
3. Validate against the client's actual numbers when available
4. Document any deviations and the rationale for adjusting thresholds

### Power10 Metric Benchmarks

The following benchmarks are sourced from industry reports covering B2B SaaS companies in the $5M-$100M ARR range.

#### Acquisition Efficiency

| Metric | Red | Yellow | Green | Notes |
|--------|-----|--------|-------|-------|
| CAC | > $2.50 per $1 new ARR | $1.50 - $2.50 per $1 new ARR | < $1.50 per $1 new ARR | Median New CAC Ratio was $2.00 in 2024, up 14% YoY [2] |
| CAC Payback Period | > 18 months | 12-18 months | < 12 months | Median is 8.6 months; top performers hit 5-7 months [2] |
| LTV | < 2x CAC | 2-3x CAC | > 3x CAC | LTV should be calculated on a cohort basis, not individual |
| LTV:CAC Ratio | < 2:1 | 2:1 - 3:1 | > 3:1 | Target is 3:1; median across 612 companies is 3.2:1 [3] |

#### Funnel Health

| Metric | Red | Yellow | Green | Notes |
|--------|-----|--------|-------|-------|
| Win Rate | < 15% | 15-25% | > 25% | SaaS average is ~22%; varies heavily by deal size [4] |
| Average Deal Size (ACV) | Declining QoQ | Flat | Growing QoQ | Benchmark depends on segment; $12K-$15K typical for mid-market SaaS [4] |
| Pipeline Coverage | < 2x quota | 2-3x quota | 3-5x quota | Most B2B SaaS companies target 3-4x; higher for enterprise-length cycles [5] |
| Pipeline Velocity | Declining MoM | Flat | Increasing MoM | Velocity = (# Deals x ACV x Win Rate) / Cycle Length |

#### Retention & Expansion

| Metric | Red | Yellow | Green | Notes |
|--------|-----|--------|-------|-------|
| Net Revenue Retention (NRR) | < 100% | 100-110% | > 110% | Median NRR is 106%; enterprise targets 118%+ [6] |
| Churn Rate (Annual Revenue) | > 15% | 8-15% | < 8% | Top performers hold annual churn at 5% or below [6] |

### Funnel Conversion Benchmarks

These conversion benchmarks apply to B2B SaaS companies with defined funnel stages. The largest drop-off typically occurs at the MQL-to-SQL transition [7].

| Stage Transition | Low (Red) | Typical (Yellow) | High (Green) | Source |
|------------------|-----------|------------------|--------------|--------|
| Visitor to Lead | < 0.7% | 1-2% | > 2% | First Page Sage, 2024 [7] |
| Lead to MQL | < 20% | 30-40% | > 40% | First Page Sage, 2024 [7] |
| MQL to SQL | < 10% | 13-21% | > 25% | First Page Sage + Understory, 2024 [7][8] |
| SQL to Opportunity | < 25% | 30-42% | > 45% | First Page Sage, 2024 [7] |
| Opportunity to Close | < 15% | 22-30% | > 35% | First Page Sage, 2024 [7] |
| Overall Lead to Customer | < 1% | 2-5% | > 5% | Aggregate calculation |

### Sales Cycle Length Benchmarks

| Segment | Red (Too Long) | Typical | Green (Efficient) | Notes |
|---------|----------------|---------|-------------------|-------|
| SMB (< $15K ACV) | > 45 days | 14-30 days | < 14 days | Fast, high-volume motion |
| Mid-Market ($15K-$100K) | > 120 days | 30-90 days | < 30 days | Balanced motion |
| Enterprise (> $100K) | > 270 days | 90-180 days | < 90 days | Complex, multi-stakeholder |

Sales cycles have lengthened approximately 25% since 2019 and 22% since 2022 due to increased budget scrutiny and committee-based buying [4].

### Systems Health Benchmarks

| Checkpoint | Red | Yellow | Green |
|------------|-----|--------|-------|
| CRM Data Hygiene (required fields filled) | < 60% compliance | 60-85% compliance | > 85% compliance |
| Duplicate Rate (leads/contacts) | > 15% | 5-15% | < 5% |
| Activity Capture Rate | < 30% of interactions logged | 30-70% logged | > 70% logged |
| User Adoption (daily active CRM users / total users) | < 40% | 40-70% | > 70% |
| Integration Health (zero sync errors in 7 days) | > 10 errors/week | 1-10 errors/week | 0 errors/week |
| Lead Response Time (inbound) | > 24 hours | 1-24 hours | < 1 hour |

Organizations that respond to inbound leads within one hour achieve 53% conversion rates compared to 17% for responses after 24 hours [7].

### Quick Reference Thresholds

_For common "is this good?" questions during diagnostic delivery:_

| Question | Good | Warning | Red Flag |
|----------|------|---------|----------|
| Is our LTV:CAC healthy? | > 3:1 | 2:1 - 3:1 | < 2:1 |
| Is our pipeline covered? | 3-5x quota | 2-3x | < 2x |
| Is our NRR healthy? | > 110% | 100-110% | < 100% |
| Is our win rate strong? | > 25% | 15-25% | < 15% |
| Is our data clean? | > 85% field compliance | 60-85% | < 60% |
| Are reps using the CRM? | > 70% daily active | 40-70% | < 40% |
| Is our funnel leaking? | MQL-to-SQL > 20% | 13-20% | < 13% |
| Is our CAC payback fast enough? | < 12 months | 12-18 months | > 18 months |

---

## 4) Calculations & Scoring

### Formula Quick Reference

| Calculation | Formula | Example |
|-------------|---------|---------|
| CAC | `Total S&M Spend / New Customers Acquired` | $500K spend / 50 customers = $10K CAC |
| CAC Payback | `CAC / (Monthly ARPU x Gross Margin %)` | $10K / ($1K x 80%) = 12.5 months |
| LTV | `ARPU x Gross Margin % x (1 / Churn Rate)` | $12K x 80% x (1 / 0.10) = $96K |
| LTV:CAC | `LTV / CAC` | $96K / $10K = 9.6:1 |
| Win Rate | `Won Deals / (Won + Lost Deals)` | 22 / 100 = 22% |
| Pipeline Coverage | `Open Pipeline $ / Quota $` | $3M pipeline / $1M quota = 3x |
| Pipeline Velocity | `(# Qualified Opps x ACV x Win Rate) / Avg Cycle Days` | (50 x $15K x 22%) / 67 = $2,463/day |
| NRR | `(Beginning ARR + Expansion - Contraction - Churn) / Beginning ARR` | ($1M + $150K - $30K - $70K) / $1M = 105% |
| Churn Rate (Annual) | `Churned ARR / Beginning-of-Period ARR` | $100K / $1M = 10% |

### Customer Acquisition Cost (CAC)

**Formula:**

```
CAC = Total Sales & Marketing Spend (period) / New Customers Acquired (same period)
```

**Variables explained:**

- `Total S&M Spend` = All sales salaries + commissions + marketing spend + tools + events + content. Do NOT include CS or product costs.
- `New Customers Acquired` = Net new logos only. Exclude expansions, renewals, and reactivations.

**Worked Example:**

_Scenario: Mid-market SaaS company, Q4 analysis_

```
Given:
- Sales team fully-loaded cost (Q4): $300,000
- Marketing spend (Q4): $200,000
- New customers closed (Q4): 25

Calculate:
- Total S&M Spend = $300K + $200K = $500,000
- CAC = $500,000 / 25 = $20,000

Compare to benchmark:
- Their ACV = $30K
- CAC Ratio = $20K / $30K = $0.67 per $1 new ARR (GREEN -- below $1.50 threshold)
```

**Validation:**

- CAC should be positive (negative means you counted wrong)
- If CAC > ACV, investigate immediately -- you are spending more to acquire a customer than they pay in year 1
- Typical B2B SaaS CAC range: $5K-$50K depending on segment

### CAC Payback Period

**Formula:**

```
CAC Payback (months) = CAC / (Monthly ARPU x Gross Margin %)
```

**Variables explained:**

- `Monthly ARPU` = ACV / 12 (annual contract value divided by 12)
- `Gross Margin %` = (Revenue - COGS) / Revenue. For SaaS, typically 70-85%.

**Worked Example:**

_Scenario: Same company as above_

```
Given:
- CAC = $20,000
- ACV = $30,000 --> Monthly ARPU = $2,500
- Gross Margin = 78%

Calculate:
- Monthly gross profit per customer = $2,500 x 0.78 = $1,950
- CAC Payback = $20,000 / $1,950 = 10.3 months (GREEN -- under 12 months)
```

**Validation:**

- Should be between 3-24 months for healthy SaaS
- If > 24 months, the company is likely burning cash on acquisition with no near-term payback
- The 2024 median across B2B SaaS is 8.6 months; 76% of SaaS companies report payback under 12 months [2]

### LTV and LTV:CAC

**Formula:**

```
LTV = ARPU (annual) x Gross Margin % x (1 / Annual Churn Rate)
```

**Variables explained:**

- `1 / Annual Churn Rate` = Average customer lifespan in years. If annual churn is 10%, average lifespan is 10 years.
- Use revenue churn, not logo churn, for this calculation.

**Worked Example:**

_Scenario: Same company_

```
Given:
- ACV (ARPU annual) = $30,000
- Gross Margin = 78%
- Annual revenue churn = 12%

Calculate:
- Average lifespan = 1 / 0.12 = 8.3 years
- LTV = $30,000 x 0.78 x 8.3 = $194,220
- LTV:CAC = $194,220 / $20,000 = 9.7:1 (GREEN -- well above 3:1)
```

**Validation:**

- LTV:CAC below 1:1 is unsustainable -- you never recoup acquisition costs
- LTV:CAC above 5:1 may indicate underinvestment in growth (you could spend more on acquisition and still maintain healthy economics)
- The investor benchmark for healthy LTV:CAC is 3:1 to 5:1 [3]

### Pipeline Velocity

**Formula:**

```
Pipeline Velocity ($/day) = (Number of Qualified Opportunities x Average Deal Size x Win Rate) / Average Sales Cycle (days)
```

**Variables explained:**

- `Qualified Opportunities` = Deals past SQL stage, actively in pipeline
- `Average Sales Cycle` = Mean days from opportunity creation to close-won

**Worked Example:**

_Scenario: Monthly velocity calculation_

```
Given:
- Qualified opportunities: 45
- Average deal size: $25,000
- Win rate: 20%
- Average cycle: 75 days

Calculate:
- Pipeline Velocity = (45 x $25,000 x 0.20) / 75 = $3,000/day

Interpretation:
- At $3,000/day, this pipeline generates ~$90K/month in closed revenue
- To hit a $300K/month quota, they need to either triple pipeline, improve win rate, or shorten cycle time
```

### Net Revenue Retention (NRR)

**Formula:**

```
NRR = (Beginning ARR + Expansion ARR - Contraction ARR - Churned ARR) / Beginning ARR x 100
```

**Variables explained:**

- `Expansion ARR` = Upsells + cross-sells from existing customers in the period
- `Contraction ARR` = Downgrades from existing customers
- `Churned ARR` = Revenue from customers who canceled entirely

**Worked Example:**

_Scenario: Annual NRR calculation_

```
Given:
- Beginning ARR: $5,000,000
- Expansion: $800,000
- Contraction: $200,000
- Churn: $400,000

Calculate:
- NRR = ($5M + $800K - $200K - $400K) / $5M = 104% (YELLOW -- between 100-110%)
```

**Validation:**

- NRR above 100% means the existing customer base is growing without new logos
- NRR below 100% means the company is shrinking from within -- new sales must outpace erosion
- Median NRR across B2B SaaS is 106%; enterprise segment median is 118% [6]

### Red/Yellow/Green Scoring Rubric

Each of the 80+ inspection checkpoints uses the following scoring methodology:

**Checkpoint Scoring Criteria:**

| Rating | Criteria | Visual |
|--------|----------|--------|
| Green | Meets or exceeds best practice for company stage. No action needed. | High performance -- maintain and monitor |
| Yellow | Below best practice but functional. Improvement recommended but not urgent. | Moderate risk -- plan remediation within 90 days |
| Red | Critical gap. Directly impacting revenue, data reliability, or operational efficiency. | Immediate action -- include in 30-day quick wins or Phase 1 roadmap |

**Aggregation Rules:**

- Domain score = percentage of green checkpoints in that domain
- Overall score = weighted average across domains (Systems 20%, Funnel 30%, Reporting 20%, Performance 30%)
- Power10 score = count of green metrics out of 10

**Tier Classification:**

| Overall Score | Classification | Typical Roadmap |
|---------------|-----------------|-----------------|
| 75%+ green | **Optimized** -- GTM engine is strong. Focus on fine-tuning. | 1-2 projects, 30-60 day timeline |
| 50-74% green | **Functional** -- Core foundation exists but gaps limit growth. | 3-5 projects, 60-120 day timeline |
| 25-49% green | **Developing** -- Significant gaps across multiple domains. | 5-8 projects, 120-180 day timeline |
| < 25% green | **Foundational** -- Major rebuild required across GTM. | 8+ projects, 6-12 month timeline |

---

## 5) Edge Cases & Deep Dives

### Edge Case 1: Poor Data Quality Prevents Reliable Scoring

**Scenario:**

Client's CRM data is too inconsistent or incomplete to calculate Power10 metrics reliably. Duplicate rates exceed 20%, required fields are blank on more than 40% of records, and historical stage history is missing. This occurs in roughly 25-30% of diagnostics, particularly with companies under $10M ARR or those that recently changed CRM platforms. Poor data quality costs U.S. businesses an estimated $3.1 trillion annually [9], and B2B contact data decays between 22.5% and 70.3% per year [9].

**Challenge:**

You cannot produce a credible Power10 Scorecard with unreliable data. Publishing bad numbers undermines the diagnostic's value.

**Approach:**

1. Document data quality as Finding #1 in the Inspection Report. Assign red ratings to all affected checkpoints.
2. Shift Power10 from "exact scoring" to "directional analysis" -- use ranges instead of point estimates (e.g., "Win rate appears to be between 12-18% based on available data").
3. Focus diagnostic energy on Systems and Process domains, which are observable without clean data (you can inspect CRM configuration, integration health, and process design directly).
4. Include a "Data Quality Remediation" project as the first item in the Roadmap -- nothing else can be reliably measured until data quality improves.

**Fallback assumptions:**

| Missing Data | Use This Instead | Source |
|--------------|------------------|--------|
| No stage history on opportunities | Use close dates and creation dates only; calculate cycle length from those | CRM opportunity records |
| No marketing source attribution | Skip funnel metrics above SQL; calculate from SQL downward | Sales-sourced pipeline only |
| Conflicting numbers between systems | Use the CRM as source of truth; document discrepancies | CRM is the system of record |
| No financial data (COGS, S&M spend) | Cannot calculate CAC, LTV, or payback; mark as red with "Insufficient Data" notation | Request financials as follow-up |

**Key validation:**

If more than 3 of the Power10 metrics cannot be calculated, reframe the engagement output. The deliverable becomes a "GTM Readiness Assessment" focused on data and systems, with a recommendation to re-run the full diagnostic after data remediation.

### Edge Case 2: Multi-Segment Company (SMB + Enterprise)

**Scenario:**

Client sells to both SMB and Enterprise segments with different sales motions, cycle lengths, and team structures. A single set of benchmarks does not apply -- a 30-day cycle is excellent for enterprise but expected for SMB.

**Challenge:**

Blended metrics mask segment-specific problems. A "green" overall win rate of 22% might hide a 35% SMB win rate and a 10% enterprise win rate -- the enterprise motion is in trouble, but the blend looks fine.

**Approach:**

1. Segment all Power10 metrics by motion. Produce separate scorecard rows for each segment.
2. Use segment-appropriate benchmarks from the Benchmarks section (SMB thresholds differ from mid-market differ from enterprise).
3. In the Inspection Report, flag any checkpoints where the segments share a process that should be separate (e.g., same lead routing for SMB and enterprise leads).
4. In the Roadmap, sequence fixes by segment impact. If enterprise is 70% of ARR but has worse metrics, prioritize enterprise fixes.

**Key validation:**

After segmenting, verify that the segments have enough volume (minimum 20 closed-won deals per segment in the analysis period) to produce statistically meaningful conversion rates. If a segment is too small, note it as directional only.

### Edge Case 3: New Company or Recent Pivot (Limited Historical Data)

**Scenario:**

Client is under $5M ARR, founded within the last 18 months, or recently pivoted their ICP. They have less than 90 days of meaningful sales data and may not have consistent processes yet.

**Approach:**

1. Shift the diagnostic frame from "benchmark comparison" to "foundation readiness." Instead of "your win rate is 15% vs. a 22% benchmark," the question becomes "do you have the systems and processes in place to eventually measure and improve win rate?"
2. Use a modified checklist focused on "essential infrastructure": Are funnel stages defined? Are required fields enforced? Is activity being captured? Are basic reports in place?
3. Reduce the Power10 to the metrics that are calculable with limited data (usually win rate, average deal size, and cycle length -- the others require more history or financial data).
4. Frame the Roadmap as "build the measurement infrastructure" rather than "fix performance gaps."

**Key validation:**

The diagnostic output should include a "Measurement Readiness" score -- what percentage of the Power10 can this company reliably calculate today? Below 50% readiness means the first roadmap priority is building measurement infrastructure.

### Edge Case 4: Conflicting Definitions Across Teams

**Scenario:**

Marketing, Sales, and CS define key terms differently. Marketing considers a "qualified lead" to be anyone who fills out a gated content form. Sales considers it someone who has confirmed budget and timeline. The CRM stores both under the same "MQL" status field. Conversion metrics are meaningless because the numerator and denominator use different definitions.

**Approach:**

1. Document every definition discrepancy found during the reverse demo and data analysis. Create a "Definition Conflicts" table in the Inspection Report.
2. For the diagnostic calculations, choose one definition per term and document which you used. Typically, use the CRM's operational definition (what the system enforces) rather than what teams claim the definition should be.
3. Flag "definition alignment" as a foundational finding. It should appear in the Roadmap as a prerequisite to any process improvement project.
4. In the results walkthrough, use the definition conflicts as a conversation starter -- "Your marketing team and sales team have different definitions of MQL. This means your 31% MQL-to-SQL rate is unreliable. Aligning on a shared definition is the first step before any funnel optimization."

**Key validation:**

After documenting conflicts, recalculate at least one metric (usually MQL-to-SQL) under each definition to show how the number changes. This makes the impact of definition misalignment concrete for stakeholders.

### Edge Case 5: Client Has No Marketing Automation Platform

**Scenario:**

Client runs marketing out of the CRM only (no HubSpot, Marketo, or Pardot). Lead capture is manual or through basic web forms that write directly to Salesforce. There is no lead scoring, no nurture automation, and no campaign tracking.

**Approach:**

1. Score the absence of a MAP as a red finding in Systems. Document the operational limitations this creates.
2. Start the funnel analysis at the SQL stage (where CRM data begins). Note that top-of-funnel metrics are "not measurable" rather than "poor."
3. Assess whether the client needs a MAP or whether their volume justifies the investment. For companies with fewer than 100 inbound leads per month, a MAP may be premature -- the Roadmap should reflect this nuance.
4. Focus additional diagnostic energy on the sales process, which is fully observable in the CRM even without a MAP.

**Key validation:**

Check whether the client's volume warrants a MAP recommendation. If they generate fewer than 50 leads/month, the Roadmap should recommend basic CRM-based processes first, with MAP as a future phase when volume justifies it.

---

## References

[1] [Gartner - Revenue Operations Research](https://www.gartner.com/en/sales/topics/revenue-operations)
[2] [Benchmarkit - 2025 SaaS Performance Metrics](https://www.benchmarkit.ai/2025benchmarks)
[3] [Optifai - B2B SaaS LTV Benchmarks and LTV:CAC Ratio 2025](https://optef.ai/learn/questions/b2b-saas-ltv-benchmark/)
[4] [Martal Group - Top B2B Sales KPIs for 2025](https://martal.ca/sales-kpis-lb/)
[5] [Mosaic - Pipeline Coverage Ratio: Calculation and Best Practices](https://www.mosaic.tech/financial-metrics/pipeline-coverage-ratio)
[6] [Optifai - B2B SaaS NRR Benchmark: 97-118% by Segment](https://optef.ai/learn/questions/b2b-saas-net-revenue-retention-benchmark/)
[7] [First Page Sage - B2B SaaS Funnel Conversion Benchmarks](https://firstpagesage.com/seo-blog/b2b-saas-funnel-conversion-benchmarks-fc/)
[8] [Understory - MQL to SQL Conversion Rates: B2B SaaS Benchmarks](https://www.understoryagency.com/blog/mql-to-sql-conversion-rate-benchmarks)
[9] [Landbase - Data Decay Rate Statistics: 20 Critical Facts](https://www.landbase.com/blog/data-decay-rate-statistics)
