# Growth Model — Methodology

## How This File Works

This document covers the core concepts, frameworks, and calculations behind Growth Model. It provides the methodological foundation — the "how it works" behind the execution steps.

---

## What IS Growth Model Methodology

A Growth Model reverse-engineers your revenue funnel to meet a future growth goal. You work backwards from an exit ARR target to determine the bookings needed, pipeline required, SQLs and MQLs to create, and resources needed to fund that growth plan.

**Core Transformation:** From disconnected planning across sales, marketing, and CS operating in silos → to a single integrated model where every function's targets, hiring timelines, and budgets are mathematically tied to the company's revenue goals.

---

## Core Concepts

_The mental models you need before working with the formulas._

### CSM Capacity Model

**What is it?** The method you use to determine how many Customer Success Managers you need. There are two primary approaches.

**Why it matters:** Using the wrong model leads to either overworked CSMs (churn risk) or overstaffed teams (cost inefficiency).

| Model Type | When to Use | Typical Ratio |
|---|---|---|
| Revenue-based ($ per CSM) | Revenue correlates with workload | $2M ARR per CSM |
| Logo-based (accounts per CSM) | Account count is primary driver | 20-30 logos per CSM |
| Hybrid | Uncertain which applies | Use both to triangulate |

### Sales Cycle Length

**What is it?** The time from SQL creation to closed-won deal. This is the single most important timing variable in growth modeling.

**Why it matters:** Determines when pipeline must be built to feed future bookings. Get this wrong and you'll be scrambling for pipeline that should have been built months ago.

| Cycle Type | Duration | Typical Segment | Pipeline Lead Time |
|---|---|---|---|
| Same-quarter | 30-60 days | SMB | Same quarter |
| One-quarter | 60-90 days | Mid-market | 1 quarter before |
| Multi-quarter | 120+ days | Enterprise | 2+ quarters before |

### Sales Ramp Time

**What is it?** The time from hire date to full productivity. Includes training AND time to build pipeline and close first deals.

**Why it matters:** A rep hired in January doesn't produce quota in January. Ramp time determines the actual contribution you get from new hires.

**Key insight:** Ramp time cannot be shorter than sales cycle length. If deals take 6 months to close, a rep cannot be fully productive in less than 6 months.

| Motion | Ramp Time | Typical ACV |
|---|---|---|
| SMB | 60-90 days | <$10K |
| Mid-market | 3-6 months | $20K-$80K |
| Enterprise | 6+ months | $80K+ |

### Quarterly Weighting

**What is it?** The distribution of annual bookings across quarters. Almost no business books evenly (25/25/25/25).

**Why it matters:** Affects hiring timing and budget allocation. If Q4 is 40% of bookings, you need ramped capacity ready for Q4 pipeline generation (which means Q3 or earlier hiring).

| Pattern | Distribution | When to Use |
|---|---|---|
| Even | 25/25/25/25 | Minimal seasonality |
| Back-half weighted | 15/20/25/40 | Q4 budget flush dynamics |
| Custom | Based on history | Clear seasonal patterns |

### Pipeline Time-Shift

**What is it?** The offset between when pipeline must be created and when bookings close. This is the most commonly missed calculation in growth modeling.

**Why it matters:** If you're building Q4 pipeline in Q4, you're already behind. Pipeline feeds FUTURE bookings, not same-period bookings.

> **Rule:** Q[n] pipeline feeds Q[n + sales_cycle] bookings

**Example (Enterprise, 3-quarter cycle):**

* Q4 bookings target: $1.9M
* Pipeline needed: Q1 (3 quarters earlier)
* At 25% win rate: Q1 pipeline required = $7.6M

---

## Decision Frameworks

_How to choose the right approach for your growth model._

### Approach Selection Matrix

| Situation | Recommended Approach |
|---|---|
| Board has set firm growth targets for IPO/acquisition | Top-Down |
| Limited time, need plan in <2 weeks | Top-Down |
| Strong historical data, need realistic plan | Bottom-Up |
| Team buy-in is critical for execution | Bottom-Up or W Method |
| New market/product with limited historical data | Top-Down with assumptions |
| Have 4+ weeks and need strategic + operational alignment | W Method |
| First comprehensive growth model for company | W Method |
| Annual planning cycle with full executive involvement | W Method |

### Approach 1: Top-Down Planning

**Best for:**

* Board or executive leadership has set non-negotiable revenue targets tied to strategic initiatives (acquisition, IPO, fundraising)
* When company strategy is fixed
* When targets are driven by external milestones (board commitment, investor expectations)
* When time is limited for iterative cycles

**Execution:** High-level targets flow down to functional teams who create operating plans to hit those targets; strategy dictates the numbers.

**Strengths:** Strategic alignment, faster to execute, clear accountability to fixed targets.

**Weaknesses:** May miss operational realities; targets may be unrealistic without bottom-up validation; can create misalignment if functional teams don't buy in.

### Approach 2: Bottom-Up Planning

**Best for:**

* Strong historical data available
* Functional teams have detailed knowledge of what's achievable
* Want to identify ground-level opportunities and constraints
* When team buy-in and accountability are critical

**Execution:** Teams analyze historical data from previous periods, identify growth opportunities and efficiency improvements, then deliver comprehensive plan to leadership.

**Strengths:** More accurate near-term forecasts; team ownership and accountability; surfaces opportunities and risks from frontline knowledge; practical constraints factored in.

**Weaknesses:** May lack market context; can be conservative; time-intensive; may not align with strategic aspirations.

### Approach 3: The W Method (Integrated Approach)

**Best for:**

* Need benefits of both approaches
* Alignment between executive and functional leadership is critical
* Have time for iterative planning cycles
* Comprehensive growth model builds

**When NOT to use:** Quick planning cycles where time doesn't permit iteration; when one direction (top-down mandates or bottom-up constraints) is already locked.

**The 5-Step Process:**

1. **Top-Down Guidance (First Down Stroke):** Executive team provides strategic initiatives, growth goals, key metrics. Communicate what targets are needed for strategic success. Set efficiency parameters and constraints.

2. **Bottom-Up Plan (First Up Stroke):** Functional teams create comprehensive plan: capacity model, CS carry model, marketing budget, GTM budget. Identify opportunities and risks. Surface operational constraints and possibilities.

3. **Executive Review (Second Down Stroke):** Leadership reviews bottom-up plan. Allow bottom-up insights to influence strategic decisions. Refine assumptions based on operational data. Provide updated guidance if needed.

4. **Final Bottom-Up Plan (Second Up Stroke):** Functional teams create updated plan aligned with refined guidance. Incorporate changed assumptions. Finalize comprehensive operating plan.

5. **Final Approval:** Executive leadership reviews and approves. Deploy to functional teams for execution.

**Key insight:** "Companies with strong cross-functional alignment grow 19% faster. The W Method reduces friction by 52%."

---

## 1. Revenue Model (Top-Down)

### Core Formula

The fundamental equation for calculating required bookings:

```
Required New Bookings = Exit ARR - (Starting ARR × Net Retention Rate)
```

**Example:**

| Input | Value |
|---|---|
| Starting ARR | $50M |
| Exit ARR Target | $100M |
| Net Retention Rate | 100% |
| **Required New Bookings** | **$50M** |

### Quarterly Allocation

Bookings rarely distribute evenly across quarters. Use a weighting pattern:

| Pattern | Q1 | Q2 | Q3 | Q4 |
|---|---|---|---|---|
| Even | 25% | 25% | 25% | 25% |
| Back-weighted | 20% | 20% | 30% | 30% |
| Q4-heavy | 15% | 20% | 25% | 40% |

### Pipeline Time-Shift (CRITICAL)

**This is the most commonly missed calculation in growth modeling.**

> **Rule:** Q[n] pipeline feeds Q[n + sales_cycle] bookings

Pipeline must be produced ONE SALES CYCLE BEFORE the target bookings period.

| Sales Cycle | Pipeline Quarter → Bookings Quarter |
|---|---|
| 0 (velocity) | Same quarter |
| 1 quarter | Next quarter |
| 2 quarters | 2 quarters ahead |
| 3 quarters | 3 quarters ahead (Enterprise typical) |

**Enterprise Example (3-quarter sales cycle):**

* Q1 pipeline planning → Feeds Q4 bookings
* Q4 bookings target: $1.9M
* SQL to CW: 25%
* Q1 pipeline required: $1.9M / 0.25 = **$7.6M**

**Validation:** Pipeline should be roughly 4x bookings (at 25% win rate).

### Funnel Math (Bookings to SQLs)

Work backwards from bookings:

```
Pipeline Required = Bookings Target / Conversion Rate
SQLs Required = Pipeline Required / Average ACV
Meetings Required = SQLs / Meeting-to-SQL Rate
MQLs Required = Meetings / MQL-to-Meeting Rate
```

---

## 2. Sales Capacity

### Ramp Schedules by Segment

A rep cannot produce at full capacity from day one. Ramp time includes:

1. Product/service training
2. Building pipeline (prospecting, qualifying)
3. Closing pipeline (first deals through full cycle)

| Segment | Ramp Months | Month 1 | Month 2 | Month 3 | Month 4 | Month 5 | Month 6 |
|---|---|---|---|---|---|---|---|
| Enterprise | 6 | 0% | 10% | 25% | 50% | 75% | 100% |
| Mid-Market | 5 | 0% | 25% | 50% | 75% | 100% | — |
| SMB | 4 | 0% | 50% | 75% | 100% | — | — |

**Industry Data:** "SaaS/Technology sales ramp averages 5.7 months (up 32% from 4.3 months in 2020)."

### Expected Bookings

**Expected Performance = Capacity × Attainment Factor**

Industry data shows average B2B SaaS quota attainment is 43-47% at the organizational level. Fully ramped reps typically achieve 50-60%. Use 85% as a planning assumption.

### Capacity Gap Analysis

```
Capacity Gap = Booking Target - Expected Bookings
```

| Interpretation | Meaning |
|---|---|
| Gap > 0 | Need more capacity (hire more, or reduce target) |
| Gap < 0 | Over-capacity (good problem, but watch costs) |
| Gap > 20% of target | Critical gap, flag immediately |

### Attrition Buffer

Industry data shows 35% annual turnover in sales, nearly 3x the cross-industry average.

| Metric | Industry Average |
|---|---|
| Annual sales turnover | 35% |
| B2B organizations >30% turnover | 45% |
| Voluntary turnover | 20% |
| Involuntary turnover | 12% |
| Average rep tenure | 18 months |

**Recommendation:** Add 1 buffer hire for every 3-4 planned new hires.

---

## 3. Marketing Plan

### Pipeline Offset Calculation

Pipeline must be produced ONE SALES CYCLE before the target bookings period.

```
When Pipeline Needed = Bookings Period - Sales Cycle Length
```

### SQL Targets by Channel

Standard channel allocation:

| Channel | Description | Typical % Allocation |
|---|---|---|
| Paid Advertising | Google Ads, LinkedIn Ads, Meta | 15-30% |
| Events | Trade shows, conferences, field events | 10-20% |
| Website/Inbound | Organic, content marketing, SEO | 15-25% |
| SDR/Outbound | Sales-sourced through outbound motion | 20-35% |
| CS Referrals | Customer referrals via CS team | 5-15% |
| Partners | Channel partners, resellers | 5-15% |

### Budget-to-Pipeline Ratios by Channel

| Channel | Ratio | $1 Invested Produces |
|---|---|---|
| SDR | 1:20 | $20 pipeline |
| Content/SEO | 1:40 | $40 pipeline |
| Paid Advertising | 1:20 | $20 pipeline |
| Events | 1:20 | $20 pipeline |
| Partnerships | 1:40 | $40 pipeline |

### Channel Scalability

| Channel Type | Scalability | Notes |
|---|---|---|
| SDRs | Linear | More SDRs = proportional pipeline |
| Paid Ads | Linear | More spend = proportional pipeline (within limits) |
| Content/SEO | Non-linear | Takes time, compounds over time |
| Events | Semi-linear | Can add events, but quality varies |
| Partnerships | Non-linear | Relationship dependent |

### Ramp Times by Channel

| Channel | Ramp to Full Production | Notes |
|---|---|---|
| Paid Search (Google) | 2-4 weeks | Algorithm learning period |
| LinkedIn Ads | 4-8 weeks | Audience building + optimization |
| SEO/Content | 6-12 months | Compound over time |
| Events | Lead time + event date | Plan 3-6 months ahead |
| SDR Outbound | 1-3 months | List building + rep ramp |
| Partner Channel | 6-12 months | Relationship building |

---

## 4. CS Capacity

### Three Constraints Model

CSM capacity is limited by whichever constraint binds first:

| Constraint | Formula | Enterprise | Mid-Market | SMB |
|---|---|---|---|---|
| ARR | total_ARR / max_ARR_per_CSM | $4M | $3M | $2M |
| Logos | customers / max_accounts_per_CSM | 40 | 60 | 100 |
| Activations | new_customers_month / max_per_CSM | 5 | 10 | 20 |

**Binding Constraint = max(arr_csms, logo_csms, activation_csms)**

### CSM Carry Ratio Benchmarks

| Segment | ARR per CSM | Logos per CSM | Touch Model |
|---|---|---|---|
| Enterprise | $2M - $5M | 10-50 | High-touch |
| Mid-Market | $2M - $5M | 40-100 | Mid-touch |
| SMB | $1M - $2M | 100-250 | Low-touch / Scaled |
| Early Stage (<$10M ARR) | $1M | Varies | Invest in retention |

**Note:** The "$2M per CSM" rule is common at scale, but for fast-growing companies, investing at $1M per CSM early provides stronger retention.

### Hiring Timeline Calculation

```
Hire Date = Quarter When Capacity Needed - Ramp Time
```

Ramp times:

* SMB CSM: 1-3 months (1 quarter)
* Mid-Market CSM: 3-4 months (1 quarter)
* Enterprise CSM: 4-6 months (1-2 quarters)

### When Activation Becomes the Constraint

If 80% of bookings close in the last month of Q2, you may have 48 customers to onboard in 4-6 weeks - this creates an onboarding bottleneck even if annual capacity is sufficient.

---

## 5. Plan Assumptions

### What Are Assumptions?

Assumptions are elements of your growth plan where you don't have historical data to support future predictions.

| Type | Definition | Example |
|---|---|---|
| **Data-backed input** | Historical evidence supports the value | "Our SQL-to-close rate is 20% based on 300 opps last year" |
| **Assumption** | No historical precedent to validate | "Our new enterprise segment will convert at 25%" |

### Four Categories of Assumptions

**1. Product-Related Assumptions**

* Product launch timing
* Feature completion dates tied to sales initiatives
* New product adoption rates
* Pricing model effectiveness

**2. GTM/Sales-Related Assumptions**

* Sales rep ramp time to full productivity
* New enablement initiative effectiveness
* Quota attainment expectations for new hires
* New sales methodology adoption timeline

**3. Channel/Market Expansion Assumptions**

* New geographic market conversion rates
* New channel partner pipeline contribution
* New segment performance metrics
* International expansion timelines

**4. External Factor Assumptions**

* Market conditions (up or down economy)
* Channel partnership success
* Partner dependencies
* Competitive landscape changes

### Monitoring Cadence

| Time Frame | Action | Purpose |
|---|---|---|
| Weekly | Quick pulse check on high-risk assumptions | Catch early warning signs |
| Monthly | Compare actual vs assumed metrics | Validate assumption accuracy |
| Quarterly | Full assumption register review | Refresh status, close validated |
| As triggers hit | Immediate review if threshold breached | Trigger plan adjustment |

### Variance Triggers

| Variance Level | Action |
|---|---|
| Within 10% | Continue monitoring |
| 10-25% variance | Flag assumption "At Risk" |
| 25-50% variance | Initiate plan adjustment discussion |
| >50% variance | Mark assumption "Invalid", require plan revision |

---

## 6. W-Method (Cross-functional Alignment)

### Why It Exists

Traditional planning approaches fail for predictable reasons:

| Approach | Problem | Consequence |
|---|---|---|
| Top-Down Only | Finance dictates growth target without pressure-testing | Functional teams don't believe in the plan |
| Bottom-Up Only | Teams optimize for what's comfortable, not strategic goals | Miss strategic opportunities |
| Siloed Planning | Sales, marketing, CS make independent plans | Product and GTM misalignment |

Research shows companies with strong cross-functional alignment grow 19% faster, and implementing alignment architecture can reduce cross-functional friction by 52%.

### The 5-Step Process

**Step 1: Establish Top-Down Guidance**

* Executive kickoff session
* Board/investor context
* Target setting: ARR target, growth rate, efficiency parameters
* Constraint identification

**Step 2: Create Initial Bottom-Up Plan**

* Functional team workshops
* Historical data review
* Capacity analysis
* Gap and risk identification

**Step 3: Executive Review**

* Functional plan presentations
* Gap analysis discussion
* Trade-off decisions
* Revised guidance

**Step 4: Create Final Bottom-Up Plan**

* Incorporate executive feedback
* Finalize quarterly targets
* Complete hiring/budget timeline
* Assumption documentation

**Step 5: Final Approval and Implementation**

* Final plan walk-through
* Alignment confirmation
* Governance setup
* Formal approval

---

## Common Misunderstandings

_What people get wrong about growth modeling — and the reality._

### "We need perfect data before we can build a growth model"

**Misconception:** You need complete, accurate historical data before modeling is worthwhile.

**Reality:** Growth modeling is not about getting it completely right — it's about getting one step closer to the truth. Every company entering new markets, launching new products, or trying new channels will have assumptions without historical data.

**Why it matters:** The value comes from:

1. **Documenting what you assume** (product launch timing, new channel performance)
2. **Monitoring those assumptions** as the plan executes
3. **Adjusting the model** as reality reveals itself

**The reframe:** "You don't need perfect data — you need documented assumptions and monitoring discipline."

### "We already do capacity planning"

**Misconception:** Having a sales headcount spreadsheet means you're doing growth planning.

**Reality:** Capacity planning is one of six components. A growth model integrates:

* Sales capacity (quotas, ramp, headcount)
* Marketing plan (SQL targets by channel)
* CS carry plan (ARR/logo capacity)
* Pipeline production (channel efficiency, timing offsets)
* Budget alignment (GTM costs tied to hiring)
* Definitions repository (single source of truth)

| What They Think | What's Actually True |
|---|---|
| "10 reps × $1M = $10M" | Without ramp (7mo), attrition (30%), you'll have ~50% of planned capacity |
| "Sales ops owns this" | Requires alignment between sales, marketing, CS, finance, and product |

**The reframe:** "Capacity planning shows headcount needs. Growth modeling links staffing, pipeline generation, costs, and revenue."

### "We just need one more rep to hit our target"

**Misconception:** Simple headcount math: 4 reps × $1M = $4M, need $5M, hire 1 more.

**Reality:**

| Assumption | Reality |
|---|---|
| New rep produces $1M in year 1 | Q1: $0 (training), Q2: ~$100K (ramping), Q3-Q4: Accelerating. **Year 1: ~$600K** |
| Everyone you hire works out | 30% average attrition |
| Timing doesn't matter | Q1 hire vs Q3 hire = dramatically different contribution |

**The math:** Target $5M, current capacity $4M, gap $1M. One Q1 hire = ~$600K (not $1M). With attrition buffer, you need **3 new hires** to safely hit $5M.

**The reframe:** "That's headcount math. Factor in ramp time and attrition to understand actual capacity."

### "We'll figure out the pipeline as we go"

**Misconception:** Pipeline can be generated when needed.

**Reality:** Pipeline must be produced one sales cycle BEFORE the target bookings period.

| If Your Goal Is... | And Sales Cycle Is... | Pipeline Needed In... |
|---|---|---|
| $1M bookings in Q2 | 1 quarter | Q1 |
| $1M bookings in Q2 | 2 quarters | Q4 (prior year) |
| $1M bookings in Q2 | Same quarter | Q2 (high risk) |

**Why it matters:** Companies that "figure it out as they go" discover in Q2 they don't have Q3 pipeline — but by then it's too late.

**The reframe:** "Q4 bookings targets determine Q3 pipeline timing, which determines Q2 marketing spend."

### "The board sets the target, we just execute"

**Misconception:** Top-down targets should be accepted without validation.

**Reality:** Top-down targets without bottom-up validation create plans nobody believes in. When leadership sets 50% growth but capacity analysis shows 30%, you have two choices:

1. Accept unrealistic targets, miss them, lose credibility
2. Use the W Method to align ambition with reality

**Why it matters:** This isn't about lowering ambition — it's about identifying what needs to change (more investment, earlier hiring, different channels) to achieve aggressive targets.

**The reframe:** "Executive guidance sets direction. Bottom-up planning reveals what's required to achieve targets."

---

## 7. Edge Cases

### New Company (No Historical Data)

**Detection:** Starting ARR < $1M, implied customers < 10, company age < 2 years.

**Approach:** Collect what they know, benchmark everything else. Flag benchmarked inputs in output and recommend tracking priority metrics: win rate, average deal size, time to close.

### Single Segment Business

**Detection:** Only sells to Enterprise, Mid-Market, OR SMB. Pricing only makes sense for one segment.

**Approach:** Collect inputs for active segment only. Skip segment comparison. Single-column outputs.

### Partial Data Available

**Detection:** Mix of actual data and gaps across different metric types.

**Approach:** Tag every input as `client` (customer provided), `benchmark` (industry default), or `derived` (calculated from other inputs). Show data sources in output.

### Conflicting Inputs

**Common Conflicts:**

1. **ARR / ACV / Customer Count Mismatch** - Ask: Is ACV for new deals or average across all customers?
2. **Win Rate Too High (>65%)** - Usually a definition issue (opp-to-close not SQL-to-close)
3. **Growth Target vs Capacity Gap** - Add hiring plan or acknowledge gap
4. **NRR > 130%** - Verify calculation methodology; land-and-expand can hit 140%+

### Extreme Values

| Scenario | Handling |
|---|---|
| Very High Growth (>200% YoY) | Confirm intentional; flag as aggressive; show conservative scenario |
| Micro ACV (<$5,000) | Volume business; higher CSM ratios (500+); consider PLG |
| Mega Deals (>$500,000) | Longer sales cycles (6+ quarters); lower volume, higher touch |
| Negative Retention (NRR <90%) | Acknowledge churn impact; calculate difficulty increase; recommend retention initiatives |

---

## 8. Variant Models

### PLG (Product-Led Growth)

**When to Use:**

* Self-serve signup flow
* Revenue from free trial or freemium conversion
* Product usage signals drive conversion (not sales outreach)

**Funnel Replacement:**

```
Standard:  MQL → Meeting → SQL → Closed Won
PLG:       Visitor → Signup → Activated → PQL → Paid
```

**Key Metrics:**

| Metric | Freemium | Free Trial | Top Performer |
|---|---|---|---|
| Visitor to Signup | 6% | 3% | 18% |
| Signup to Activation | 20-40% | 20-40% | 50% |
| Activation to PQL | 30% | 30% | — |
| PQL to Paid | 25% | 25% | 39% |
| Free to Paid (direct) | 4% | 12-48% | — |

### Hybrid (PLG + SLG)

**When to Use:**

* Self-serve signup flow AND enterprise sales team
* PLG generates PQLs that sales then closes
* "65% of buyers prefer both product-led AND sales-led experiences"

**Typical Splits:**

| Stage | Self-Serve | Sales-Assisted |
|---|---|---|
| Early | 70% | 30% |
| Growth | 50% | 50% |
| Scale | 40% | 60% |

**Two Funnels:**

* Self-Serve: Visitor → Signup → Activated → Paid (no sales touch)
* Sales-Assisted: Visitor → Signup → Activated → PQL → SAL → Opp → Close

**Economics Advantage:** Hybrid CAC ratio is $1.10 per $1 ARR vs $2.00 for pure SLG (45% savings).

### Usage-Based Pricing

**When to Use:**

* Revenue tied to consumption (API calls, compute, storage)
* Committed minimums with variable overage
* Credit/prepaid models

**Key Differences:**

```
Standard SaaS: ARR = MRR × 12, recognized ratably
Usage-Based:   Revenue recognized as consumption occurs
```

**NDR Benchmarks (Higher than Subscription):**

| Company | NDR | Model |
|---|---|---|
| Snowflake | 128-170% | Credit-based |
| Twilio | 140% | API call-based |
| Datadog | 130% | Hybrid |
| Avg Subscription | 115% | Ratable |

---

## 9. Benchmark Tables (Quick Reference)

### Conversion Rates by Segment

| Rate | Enterprise | Mid-Market | SMB |
|---|---|---|---|
| SQL to CW | 25% | 40% | 40% |
| Meeting to SQL | 20% | 25% | 25% |
| MQL to Meeting | 15% | 15% | 15% |
| NRR | 105% | 105% | 105% |

### Unit Economics by Segment

| Metric | Enterprise | Mid-Market | SMB |
|---|---|---|---|
| Avg ACV | $150K | $100K | $40K |
| Cost per SQL | $5K | $1K | $1K |
| LTV | $500K | $200K | $60K |
| Sales Cycle (Q) | 3 | 1 | 1 |
| Quota | $1M | $800K | $500K |

### Capacity by Segment

| Metric | Enterprise | Mid-Market | SMB |
|---|---|---|---|
| CSM ARR Capacity | $4M | $3M | $2M |
| CSM Logo Capacity | 40 | 60 | 100 |
| CSM Activations/mo | 5 | 10 | 20 |
| Ramp Months | 6 | 5 | 4 |
| AE OTE | $250K | $200K | $150K |
| CSM OTE | $140K | $120K | $100K |

### SDR Benchmarks

| Metric | Outbound | Inbound |
|---|---|---|
| SQL Quota | 15/mo | 25/mo |
| Pipeline Quota | $750K/mo | $1.25M/mo |
| Dials/day | 80 | — |
| Emails/day | 100 | — |
| LinkedIn/day | 25 | — |

---

## 10. Formula Quick Reference

### Top Down

```
bookings_needed = exit_arr - (starting_arr × nrr)
q_pipeline = future_q_bookings / sql_to_cw  # TIME-SHIFTED!
sqls = pipeline / avg_acv
meetings = sqls / meeting_to_sql
mqls = meetings / mql_to_meeting
```

### Sales Capacity

```
monthly_capacity = annual_quota × ramp_pct / 12
expected_bookings = total_capacity × 0.85
```

### CS Capacity

```
arr_csms = total_arr / max_arr_per_csm
logo_csms = customers / max_accounts_per_csm
activation_csms = new_customers / max_activations
binding = max(arr_csms, logo_csms, activation_csms)
```

### Marketing

```
cac = budget / sqls / win_ratio
ltv_ratio = ltv / cac
blended_cost = total_budget / total_sqls
```
