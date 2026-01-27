# Quotas and Target Setting - Playbook

## 1. Definition

**What it is**: A strategic planning project that establishes data-driven sales quotas and performance targets for individual sellers and teams by blending top-down revenue goals with bottom-up capacity analysis, territory potential, and historical performance data. The output is a defensible quota allocation model integrated into CRM for real-time tracking.

**What it is NOT**: Not a Growth Model project (that defines company-level ARR targets and efficiency metrics—quotas operationalize those targets at the rep level). Not a Sales Territory Design project (territories must exist before quotas can be allocated). Not a compensation plan design (quotas inform comp, but OTE structures are separate). Not a one-time exercise—requires ongoing calibration.

## 2. ICP Value Proposition

**Pain it solves**: Sales leaders struggle with quota attainment—up to 70% of B2B sales reps miss their annual quotas. Common root causes include quotas set by "gut feel" or arbitrary percentage increases, territory imbalances that create unfair workloads, and lack of visibility into quota progress in real-time. Reps become demoralized when targets feel unattainable, while leadership lacks confidence in revenue predictability.

**Outcome delivered**: A transparent, data-backed quota model where 70-80% of reps can realistically attain quota. Clear documentation of the methodology so reps understand the "why" behind their numbers. CRM integration providing real-time quota attainment dashboards. Regular review cadence to adjust quotas based on market conditions.

**Who owns it**: VP of Sales or CRO (executive sponsor), with RevOps as the operational owner responsible for quota calculations, CRM integration, and ongoing monitoring.

## 3. Implementation Procedure

### Part 1: Assess Current State & Gather Data Inputs

#### Step 1: Pull and Analyze Historical Sales Data

**Step Overview:** Extract 12-24 months of CRM sales data to establish baseline performance metrics and identify patterns. End state: Comprehensive data set ready for quota modeling with documented performance trends by rep and territory.

- Export closed-won deals from CRM for past 12-24 months including deal size, close date, and rep assignment
- Calculate key metrics by rep: win rate, average deal size, sales cycle length, and total bookings
- Segment data by territory to identify regional performance variations
- Document conversion rates at each pipeline stage (opportunity-to-close rates)
- Flag any data quality issues (missing rep assignments, incomplete territory tags) for cleanup

#### Step 2: Document Top-Down Revenue Targets and Constraints

**Step Overview:** Interview executive stakeholders to capture approved revenue targets and any known constraints for the quota period. End state: Clear documentation of company-level ARR goals and strategic priorities that quotas must support.

- Schedule kickoff meeting with VP of Sales and CRO to capture annual/quarterly revenue targets
- Document growth expectations (percentage increase vs. prior period)
- Identify any planned territory or market changes that affect quota allocation
- Confirm approved headcount plan including new hire start dates
- Capture any executive constraints (e.g., minimum quota floors, maximum territory sizes)

#### Step 3: Audit Current Quota Methodology

**Step Overview:** Evaluate the existing quota-setting process to identify gaps and improvement opportunities. End state: Gap analysis documenting what works, what doesn't, and recommended methodology changes.

- Review current quota documentation and historical quota files
- Identify how quotas were previously set (top-down only, bottom-up, or blended)
- Assess whether territory weighting was applied and if methodology was transparent
- Interview 2-3 reps on pain points with current quotas (fairness, attainability, clarity)
- Document gaps: arbitrary increases, missing ramp schedules, territory imbalances

---

### Part 2: Build the Quota Allocation Model

#### Step 1: Calculate Territory Weighting Factors

**Step Overview:** Develop weighting factors that ensure equivalent opportunity across territories regardless of market size or maturity. End state: Territory scoring model with documented weights based on account density, market potential, and historical performance.

- Define weighting criteria: account density, market maturity, competitive intensity, historical win rates
- Score each territory on a 1-5 scale for each criterion
- Calculate composite territory weight (e.g., Manhattan territory = 1.3x, rural territory = 0.7x)
- Validate weights with sales leadership to ensure they reflect reality on the ground
- Document the methodology for transparency during rollout

#### Step 2: Build the Blended Quota Model

**Step Overview:** Create the core quota allocation spreadsheet combining top-down targets with bottom-up capacity analysis. End state: Working quota model showing individual rep quotas with supporting calculations.

- Start with top-down revenue target and work down to rep-level allocation
- Apply territory weighting factors to adjust for market potential differences
- Build bottom-up validation using historical performance and capacity (pipeline coverage × win rate)
- Reconcile top-down and bottom-up to create blended quota per rep
- Include quota breakdown by revenue type if needed (new business, expansion, renewal)

#### Step 3: Create Role and Segment Variations

**Step Overview:** Segment quotas appropriately for different sales roles, motions, and market segments. End state: Quota model reflects role-specific targets (AE vs SDR vs AM) and segment-specific realities (SMB vs Enterprise).

- Define quota approach for each role type: AE (bookings), SDR (pipeline/meetings), AM (expansion/renewal)
- Adjust quotas for segment differences (SMB shorter cycles and smaller deals vs. Enterprise)
- Apply product-based weighting if reps carry multiple products (e.g., 60% core, 25% add-ons, 15% services)
- Validate that quota-to-OTE ratio falls within target range (typically 4-6x for B2B SaaS field sales)
- Document any exceptions and the rationale behind them

#### Step 4: Build Ramp Schedules for New Hires

**Step Overview:** Create explicit ramp schedules showing quota expectations for new hires at 30/60/90 days. End state: Ramp schedule table included in quota model with prorated quotas for all planned new hires.

- Define ramp timeline based on average time-to-productivity (typically 3-6 months for B2B SaaS)
- Create milestone expectations: Month 1 (25% quota), Month 2 (50%), Month 3 (75%), Month 4+ (100%)
- Apply ramp schedules to each planned new hire based on start date
- Calculate impact on team quota coverage (ramping reps contribute partial quota)
- Document how mid-period hires will be handled for quota adjustments

---

### Part 3: Validate and Stress-Test the Model

#### Step 1: Back-Test Against Historical Data

**Step Overview:** Validate the proposed quota model by testing it against historical performance to confirm achievability. End state: Back-test analysis showing what percentage of reps would have hit quota under the new methodology.

- Apply proposed quotas to prior period actual results (12-24 months)
- Calculate attainment rate: target is 70-80% of reps hitting quota
- Identify any reps who would have been significantly over or under quota
- Adjust model if back-test shows unrealistic attainment (too high = sandbagging, too low = demotivating)
- Document back-test results as evidence for methodology defensibility

#### Step 2: Conduct Scenario Analysis

**Step Overview:** Stress-test the model against different business scenarios to ensure robustness. End state: Scenario analysis showing quota implications under best-case, expected, and worst-case conditions.

- Model best-case scenario: 20% upside on pipeline coverage
- Model worst-case scenario: 20% downside on win rates or deal sizes
- Assess impact on company revenue if attainment rates vary by +/- 10%
- Identify high-risk territories or reps where quota may be most sensitive
- Prepare talking points for leadership review meeting

#### Step 3: Obtain Stakeholder Approval

**Step Overview:** Present the quota model to sales leadership for review, feedback, and final approval. End state: Approved quota allocation with sign-off from VP of Sales/CRO.

- Schedule quota review meeting with VP of Sales and RevOps leadership
- Walk through methodology: data sources, weighting factors, ramp schedules
- Present back-test results and scenario analysis as validation
- Capture feedback and iterate on specific rep/territory allocations if needed
- Obtain formal sign-off before proceeding to CRM configuration

---

### Part 4: Configure CRM and Launch

#### Step 1: Configure CRM Quota Tracking

**Step Overview:** Set up quota data in CRM and build real-time attainment dashboards. End state: CRM reflects individual quotas with live attainment tracking visible to reps and managers.

- Create custom quota fields in CRM (Salesforce or HubSpot) for annual and period quotas
- Load approved quota values for each rep/territory
- Build quota attainment dashboard showing: current bookings, quota, attainment %, gap to quota
- Configure visual indicators (red/yellow/green) for at-risk, on-track, and exceeding reps
- Test dashboard with sample data to ensure calculations are correct

#### Step 2: Conduct Quota Rollout Meeting

**Step Overview:** Present quotas to sales leadership and managers before broader communication to reps. End state: Leadership aligned and prepared to communicate quotas to their teams.

- Schedule rollout meeting with sales managers and VP of Sales
- Walk through the methodology, data sources, and individual allocations
- Explain territory weighting logic and ramp schedules for new hires
- Provide managers with talking points for rep-level conversations
- Address questions and document any concerns for follow-up

#### Step 3: Communicate Quotas to Sales Team

**Step Overview:** Roll out quotas to individual reps with clear explanation of methodology and expectations. End state: Every rep understands their quota, how it was calculated, and where to track progress.

- Create quota communication package explaining methodology and rationale
- Distribute individual quota letters or emails with rep-specific targets
- Host Q&A session (live or async) to address rep questions
- Provide access to CRM dashboard for self-service attainment tracking
- Document FAQs for ongoing reference

#### Step 4: Establish Review Cadence and Hand Off

**Step Overview:** Set up quarterly review process and transfer ownership to client RevOps. End state: Client self-sufficient with scheduled reviews and documentation for future quota cycles.

- Schedule quarterly quota review meetings (RevOps + Sales Leadership)
- Define triggers for mid-period quota adjustments (territory changes, market shifts)
- Deliver documentation package: quota model spreadsheet, methodology runbook, CRM config notes
- Transfer admin access and ownership to client RevOps
- Schedule 30-day check-in to assess early attainment patterns

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Completed Growth Model defining ARR targets and efficiency metrics (quotas operationalize these)
- Defined sales territories with clear account assignments per rep
- Minimum 12 months of CRM sales data (closed-won, conversion rates, pipeline)
- Approved headcount plan for the quota period

**What client must provide:**
- CRM admin access for historical data pulls and dashboard configuration
- Top-down revenue targets and growth expectations from leadership
- Territory definitions and any planned changes for the upcoming period
- New hire start dates and ramp expectations
- Comp plan framework including target OTE and quota-to-OTE ratio guidelines

## 5. Common Pitfalls

- **Pitfall 1**: Setting quotas based on arbitrary percentage increases ("add 10% to last year") without data validation --> **Mitigation**: Always back-test the proposed quotas against historical data to confirm 70-80% attainment is realistic; use territory weighting to account for structural differences

- **Pitfall 2**: Creating territory imbalances where identical quotas are assigned regardless of market potential (e.g., Manhattan vs. rural territory) --> **Mitigation**: Calculate territory weighting factors based on account density, market maturity, and historical win rates; aim for equivalent opportunity, not identical numbers

- **Pitfall 3**: Failing to communicate the methodology behind quotas, leading to rep distrust and demotivation --> **Mitigation**: Share the data and logic during rollout including ASP, win rates, pipeline assumptions, and how targets connect to company goals; transparency builds buy-in

- **Pitfall 4**: Setting quotas without proper ramp schedules for new hires, causing inflated team targets --> **Mitigation**: Build explicit ramp schedules (30/60/90 day milestones) and exclude ramping reps from full quota calculations until they reach expected productivity

- **Pitfall 5**: Using one-size-fits-all quotas across different segments and regions without adjusting for local conditions --> **Mitigation**: Model segment-specific quotas (SMB vs Enterprise) and regional variations (mature vs. growth markets) to reflect different sales cycles, deal sizes, and market realities

## 6. Success Metrics

- **Leading Indicator**: 70-80% of fully ramped reps are on track to meet quota at the end of Q1 (vs. industry average of 43-47%)
- **Lagging Indicator**: Year-end quota attainment rate of 70%+ across the sales organization, with improved revenue predictability and reduced rep turnover due to unattainable targets

---

