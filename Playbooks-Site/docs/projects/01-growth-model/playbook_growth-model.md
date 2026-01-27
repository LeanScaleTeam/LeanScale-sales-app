# Growth Model - Playbook

## 1. Definition

**What it is**: A financial modeling project that integrates top-down ARR targets with bottom-up GTM efficiency metrics (the Power 10) to create achievable quarterly revenue goals. The output identifies specific gaps--which conversion rates, volume metrics, or efficiency metrics need improvement to hit targets. The model breaks ARR into its core components: New ARR, Expansion ARR, Contraction ARR, and Churned ARR to show which motion drives results.

**What it is NOT**: Not a quota-setting exercise (that's a downstream project). Not a CRM implementation or data cleanup. Not a sales process redesign. Not a comp plan design. Not a one-time deliverable--the model must be maintainable and updated monthly by the client.

## 2. ICP Value Proposition

**Pain it solves**: Leadership has a board-mandated ARR target but no clear line of sight into what operational metrics need to change to hit it. They're flying blind--targets feel arbitrary, gaps are unclear, and resource allocation is based on gut feel. In 2025's environment, VCs and boards demand proof of efficient growth (not growth at any cost), and clients lack the framework to demonstrate monetization and retention alongside growth.

**Outcome delivered**: A quarterly roadmap showing exactly which metrics are off-benchmark, where capacity gaps exist, and what investment (reps, pipeline, leads) is needed to hit targets. Leadership can now prioritize with confidence and validate their plan against external benchmarks (KeyBanc, OpenView). The model enables scenario planning (base case, upside, conservative) and feeds into monthly ARR momentum tracking.

**Who owns it**: Typically the CRO, VP Sales, or Head of RevOps on the client side. Finance/FP&A as secondary stakeholder.

## 3. Implementation Procedure

### Part 1: Discovery & Data Collection

#### Step 1: Conduct Kickoff and Align on Targets

**Step Overview:** Meet with executive sponsor (CRO/VP Sales) to validate top-down ARR targets and understand board-level expectations. End state: Documented quarterly ARR targets with segment breakdown and strategic context.

- Schedule 60-minute kickoff with CRO/VP Sales and RevOps lead
- Validate annual and quarterly ARR targets from board deck or exec planning docs
- Clarify how revenue is segmented (Enterprise, Mid-Market, SMB) and definitions for each
- Understand any planned pricing changes, product launches, or market expansions
- Document strategic priorities (e.g., "focus on enterprise" vs "scale SMB")
- Confirm project timeline and key milestones

#### Step 2: Extract Historical CRM Data

**Step Overview:** Pull 12-18 months of closed-won deal data and calculate historical conversion rates by segment and source. End state: Clean dataset of historical performance with conversion metrics ready for analysis.

- Request CRM admin access or coordinate data export with RevOps
- Pull closed-won deals for last 12-18 months with stage history, close dates, and ACV
- Segment deals by customer type (Enterprise, Mid-Market, SMB)
- Calculate historical conversion rates: MQL-to-SQL, SQL-to-Opp, Opp-to-CW by segment
- Extract average sales cycle length by segment
- Note data quality issues and gaps for discussion with stakeholder

#### Step 3: Gather NRR and Benchmark Data

**Step Overview:** Collect retention metrics and industry benchmarks to establish current state vs target state. End state: Comparison table showing current metrics against relevant industry benchmarks.

- Calculate current NRR components: gross retention, expansion rate, contraction rate, churn rate
- Break out retention metrics by customer cohort if available
- Pull relevant industry benchmarks from KeyBanc, OpenView, or Bessemer for client's stage and ACV
- Identify which Power 10 metrics are most relevant for this client
- Create current vs benchmark comparison table
- Flag the 2-3 metrics with largest gap to benchmark

#### Step 4: Document Current State Baseline

**Step Overview:** Synthesize discovery findings into a structured baseline document for model building. End state: Discovery summary deliverable ready for stakeholder review.

- Build current state metrics table with segment breakdown
- Create NRR waterfall showing expansion, contraction, and churn contributions
- Document data sources and any caveats on data quality
- Summarize key findings and preliminary gap observations
- Review baseline with stakeholder before moving to model build

---

### Part 2: Build Financial Model

#### Step 1: Structure the Power 10 Metrics Framework

**Step Overview:** Build the core spreadsheet structure with current, target, and benchmark columns organized by the Power 10 metrics. End state: Model shell ready for bottoms-up calculations.

- Create spreadsheet with tabs for: Inputs, Model, Scenarios, Dashboard
- Set up Power 10 metrics framework with current values from discovery
- Add benchmark column with industry targets for each metric
- Configure segment breakdown (Enterprise, Mid-Market, SMB) in model structure
- Build input cells for assumptions that can be easily updated monthly
- Document each input source and assumption rationale in notes column

#### Step 2: Calculate Bottoms-Up Revenue Targets

**Step Overview:** Model the required conversion rates, pipeline coverage, and lead volumes to hit quarterly ARR targets. End state: Bottoms-up forecast showing what needs to be true to hit each quarter's target.

- Work backward from quarterly ARR targets to required closed-won deals by segment
- Calculate pipeline coverage needed (typically 3-4x for predictable forecasting)
- Determine required opportunity volume based on historical win rates
- Model lead volume requirements based on MQL-to-Opp conversion rates
- Factor in average sales cycle length for timing of pipeline generation
- Reconcile bottoms-up requirements against current capacity

#### Step 3: Model Capacity Requirements

**Step Overview:** Determine rep count, ramp assumptions, and resource needs by quarter to support revenue targets. End state: Capacity plan showing hiring needs and productivity assumptions.

- Calculate quota capacity based on current fully-ramped rep count
- Model new hire requirements based on target attainment assumptions
- Factor in ramp time (typically 3-6 months to full productivity)
- Calculate implied rep productivity and compare to benchmarks
- Identify capacity gaps by quarter
- Document hiring timeline implications

#### Step 4: Build ARR Momentum Table

**Step Overview:** Create monthly ARR tracking table that breaks out New, Expansion, Contraction, and Churned ARR. End state: ARR waterfall showing path from current to target ARR.

- Set up monthly columns for trailing 12 months plus forecast period
- Break out ARR components: Starting ARR, New ARR, Expansion, Contraction, Churn, Ending ARR
- Apply NRR assumptions to existing customer base
- Model expansion revenue based on historical upsell rates
- Calculate net new ARR required each month
- Validate ending ARR matches quarterly targets

#### Step 5: Build Scenario Models

**Step Overview:** Create base, upside, and conservative scenarios with sensitivity analysis on key drivers. End state: Three scenario views showing range of outcomes based on different assumptions.

- Duplicate base model for upside and conservative scenarios
- Identify 3-4 key driver variables for sensitivity (win rate, cycle length, churn, ACV)
- Model upside case with optimistic but achievable assumptions
- Model conservative case with current-state assumptions plus headwinds
- Create sensitivity table showing ARR impact of +/- 10% on each key driver
- Build scenario comparison summary for leadership presentation

---

### Part 3: Validate and Stress-Test Model

#### Step 1: Cross-Reference Against Current Pipeline

**Step Overview:** Validate model feasibility by comparing bottoms-up requirements against actual weighted pipeline. End state: Feasibility assessment confirming targets are achievable or identifying gaps.

- Pull current pipeline with stage, probability, and expected close date
- Calculate weighted pipeline value by quarter
- Compare weighted pipeline to model's required pipeline coverage
- Identify gap between current pipeline and model requirements
- Flag quarters where pipeline coverage is below 3x target
- Document pipeline health assessment for stakeholder discussion

#### Step 2: Validate Assumptions with Stakeholders

**Step Overview:** Review model assumptions with sales and RevOps leaders to ensure they reflect operational reality. End state: Stakeholder-validated assumptions with documented rationale.

- Schedule assumption review session with VP Sales and RevOps
- Walk through conversion rate assumptions and get sign-off
- Validate hiring plan is realistic given recruiting capacity
- Confirm NRR assumptions align with CS team's view
- Adjust model based on stakeholder feedback
- Document final assumptions and who validated each

#### Step 3: Quantify Gap Analysis

**Step Overview:** Identify the 2-3 metrics most out of line with benchmarks and translate gaps into dollar impact. End state: Prioritized list of improvement areas with quantified ARR impact.

- Calculate dollar impact of each metric gap (e.g., "improving win rate by 5% = $X ARR")
- Rank gaps by ease of improvement vs ARR impact
- Identify which gaps are addressable in current planning period
- Map gaps to potential LeanScale projects or initiatives
- Create gap analysis summary for executive presentation

---

### Part 4: Handoff & Enablement

#### Step 1: Present Findings to Leadership

**Step Overview:** Deliver executive presentation with prioritized recommendations and model walkthrough. End state: Leadership aligned on model outputs, key gaps, and recommended actions.

- Build presentation deck with: executive summary, methodology, key findings, gap analysis, recommendations
- Lead with the 2-3 metrics most out of line and what to do about them
- Present scenario comparison showing range of outcomes
- Include Rule of 40 and Magic Number context for board-readiness
- Facilitate discussion on resource allocation and prioritization
- Capture decisions and action items from meeting

#### Step 2: Train Internal Team on Model Maintenance

**Step Overview:** Enable RevOps or Finance to update the model monthly without external support. End state: Client team confident in model mechanics and update process.

- Schedule 60-minute training session with model owner (RevOps or Finance)
- Walk through model structure, input cells, and formulas
- Demonstrate monthly update process step-by-step
- Create quick-reference guide for common update tasks
- Practice one update cycle together
- Confirm client can execute update in 2 hours or less

#### Step 3: Deliver Documentation Package

**Step Overview:** Provide complete documentation covering model inputs, assumptions, and update cadence. End state: Self-sufficient client with all materials needed for ongoing model use.

- Create model documentation covering: input sources, key formulas, assumptions log
- Build executive summary view formatted for board reporting
- Document update SOP with monthly cadence and data sources
- Include troubleshooting guide for common issues
- Package all materials in shared folder with clear naming
- Confirm client has access to all documentation

#### Step 4: Schedule Refinement Check-In

**Step Overview:** Set up 30-day follow-up to validate actuals vs model and refine assumptions. End state: Check-in scheduled with clear agenda for model refinement.

- Schedule 30-day check-in meeting before project close
- Define success criteria for check-in (actuals vs forecast comparison)
- Set expectation that model may need assumption tuning after first month
- Provide contact information for questions before check-in
- Document handoff completion and project close

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM access with at least 12 months of closed-won deal data (ideally 18-24 months for trend analysis)
- Clear top-down ARR targets (board-level or exec-level) with quarterly breakdown
- Access to key stakeholder (CRO, VP Sales, or RevOps lead) for validation
- Understanding of current pricing/ACV structure and any planned pricing changes
- Customer data to calculate NRR (expansion, contraction, churn by cohort)

**What client must provide:**
- CRM admin access or exported deal data with stage history
- Board deck or exec targets for ARR goals
- 30-60 min kickoff call with revenue leader
- Clarity on segments (enterprise vs SMB vs mid-market) and how they're defined
- Historical NRR data or access to billing/subscription system to calculate it

**What LeanScale brings:**
- Industry benchmark data (KeyBanc, OpenView, Bessemer)
- Power 10 framework and model templates
- GTM expertise to identify gaps and prioritize based on ROI of improvement
- Scenario modeling methodology

## 5. Common Pitfalls

- **Pitfall 1**: Applying a single growth rate across all segments without segment-specific analysis --> **Mitigation**: Break out model by segment (Enterprise, Mid-Market, SMB) since conversion rates, sales cycles, and ACVs differ significantly. Model capacity needs per segment.

- **Pitfall 2**: Ignoring churn and contraction in the bottoms-up model, overstating net ARR growth --> **Mitigation**: Explicitly model Net Revenue Retention with separate lines for expansion, contraction, and churn. Treat retention and expansion as part of pipeline forecasts, not afterthoughts.

- **Pitfall 3**: Building a model too complex to maintain monthly, leading to abandonment --> **Mitigation**: Focus on the 7-10 key drivers that create 80% of impact (the Power 10 framework). Client RevOps must be able to update it in 2 hours or less per month.

- **Pitfall 4**: Validating assumptions only against historical trends without pipeline reality check --> **Mitigation**: Cross-reference bottoms-up forecast against current weighted pipeline to ensure targets are feasible, not aspirational. Adjust if pipeline coverage is below 3x.

- **Pitfall 5**: Over-relying on automated forecasting without human judgment overlay --> **Mitigation**: Use predictive analytics to inform decisions, but balance with sales leader intuition and market knowledge. Regular review sessions where leaders can adjust AI-generated insights.

## 6. Success Metrics

- **Leading Indicator**: Client can articulate the 2-3 specific metrics most out of line with benchmarks and has a documented plan to address them (validated in handoff meeting). Model has been walked through with RevOps/Finance owner who can update it independently.

- **Lagging Indicator**: Quarterly actuals track within 10% of model projections, OR model is being actively used in board meetings and resource allocation decisions. Model is updated monthly within 30 days post-implementation.

---

