# Commission Plan Design & Implementation - Playbook

## 1. Definition

**What it is**: A strategic and technical project that designs a clear, motivating, and measurable sales compensation framework aligned with company goals, then implements tracking systems (CRM, commission software, or structured spreadsheets) to ensure transparency, accuracy, and real-time visibility into performance and payouts.

**What it is NOT**: Not a payroll system implementation (that's HR/Finance). Not a quota-setting exercise only (quotas are one component). Not a sales performance management platform deployment (SPM is broader). Not a CRM implementation project (commission tracking may use CRM but this is compensation-focused).

## 2. ICP Value Proposition

**Pain it solves**: Sales leaders struggle with comp plans that don't motivate the right behaviors, create disputes over deal crediting, and rely on manual spreadsheets that cause payout errors and delays. Only 24% of reps can easily calculate their own commissions, leading to distrust and disengagement.

**Outcome delivered**: A documented, transparent commission plan with clear rates, thresholds, accelerators, and rules of engagement. Tracking is automated with real-time visibility so reps and managers know exactly what's been earned. Disputes drop dramatically because crediting logic is clear and consistently applied.

**Who owns it**: VP of Sales Operations, RevOps Leader, or VP of Finance (often co-owned between Sales and Finance).

## 3. Implementation Procedure

### Part 1: Current State Assessment & Discovery

#### Step 1: Audit Existing Commission Plans and Payout Structure

**Step Overview:** Review all current commission plans, payout documentation, and historical data to understand what exists today. End state: Complete inventory of existing plans with gap analysis documented.

- Collect all existing commission plan documents, spreadsheets, and policy memos
- Interview Finance/RevOps on current payout calculation process and timeline
- Pull 6-12 months of historical payout data to identify patterns and anomalies
- Document current commission rates, thresholds, accelerators, and caps by role
- Identify which roles are covered (AE, SDR, AM, CS, Sales Engineers) and gaps
- Note any informal or undocumented "exceptions" that have been granted

#### Step 2: Assess Current Tracking and Calculation Process

**Step Overview:** Evaluate how commissions are currently calculated, tracked, and communicated to reps. End state: Process map showing current workflow and pain points identified.

- Map the end-to-end commission calculation workflow (data source to payout)
- Identify all tools currently used (CRM, spreadsheets, commission software)
- Document manual steps, handoffs, and approval processes
- Interview 2-3 sales reps on their experience with commission visibility and disputes
- Quantify time spent on commission administration (RevOps/Finance hours per month)
- List top complaints and dispute types from past 6 months

#### Step 3: Review Business Goals and Benchmark Against Industry

**Step Overview:** Align commission plan objectives with company revenue goals and compare against B2B SaaS benchmarks. End state: Documented goals for new plan and benchmark comparison complete.

- Meet with leadership to understand revenue priorities (new business vs. expansion vs. retention)
- Document target pay mix (base vs. variable) by role - benchmark is 50/50 for AEs
- Review quota-to-OTE ratios - benchmark is 4-6x OTE for annual quota
- Research industry commission rates for similar company stage/size (typically 8-15% on ACV)
- Identify behaviors the company wants to incentivize or discourage
- Document any budget constraints or finance requirements for new plan

---

### Part 2: Commission Plan Design

#### Step 1: Define Plan Structure and Commission Rates

**Step Overview:** Design the core commission structure including base rates, tiers, and calculation methodology. End state: Draft commission rate structure documented for each covered role.

- Determine commission basis (ACV, TCV, MRR, bookings) and timing (closed-won, collected, etc.)
- Set base commission rates by role (AE, SDR, AM) aligned with benchmarks
- Design tiered structure if applicable (e.g., 10% to quota, 15% above quota)
- Define accelerators for overperformance - 82% of SaaS companies use these
- Determine if decelerators apply for underperformance (below threshold)
- Document whether commissions are capped or uncapped (fewer than 15% of SaaS companies cap)

#### Step 2: Design Quota Framework and Thresholds

**Step Overview:** Establish quota methodology, thresholds, and attainment calculations that are achievable yet ambitious. End state: Quota framework documented with threshold and ramp policies.

- Define quota-setting methodology (top-down, bottom-up, or hybrid)
- Set quota attainment threshold to unlock commissions (typically 50-70%)
- Design ramp quotas for new hires (common: 25%/50%/75%/100% over first 4 months)
- Establish quota adjustment policies for territory changes or leave
- Define measurement period (monthly, quarterly, annual) and how attainment rolls up
- Document draw policies if applicable (recoverable vs. non-recoverable)

#### Step 3: Create Multi-Year and Special Incentive Structures

**Step Overview:** Design incentives for strategic behaviors like multi-year deals, specific products, or milestone achievements. End state: Special incentive structures documented and aligned with business priorities.

- Design multi-year contract incentives (e.g., 1-year at 10%, 2-year at 12%, 3-year at 15%)
- Create SPIFFs or bonuses for strategic priorities (new product, new market, etc.)
- Define milestone-based payout splits if applicable (e.g., 70% at close, 30% at go-live)
- Establish clawback policies for churned deals (over half of SaaS companies use clawbacks)
- Design team or overlay commission structures if multiple roles touch deals
- Document any kickers or bonuses for full-year performance

---

### Part 3: Rules of Engagement & Crediting Logic

#### Step 1: Define Deal Ownership and Crediting Rules

**Step Overview:** Establish clear rules for who gets credit on deals to prevent disputes and confusion. End state: Crediting rules documented covering all common scenarios.

- Define primary ownership rules (territory-based, account-based, opportunity-based)
- Establish rules for inbound vs. outbound sourced deals
- Document split credit scenarios and percentages (AE/SDR, AE/AE, overlay roles)
- Define handoff rules for deals that cross territories or segments
- Establish time-based crediting rules (e.g., credit follows account for 90 days after transfer)
- Document "house account" or unassigned deal handling

#### Step 2: Establish Dispute Resolution Process

**Step Overview:** Create a clear, fair process for resolving commission disputes quickly. End state: Dispute resolution process documented with escalation path and SLAs.

- Define dispute submission process (form, email, system)
- Establish review timeline SLA (e.g., initial response in 48 hours, resolution in 5 business days)
- Identify dispute resolution committee or decision maker
- Document appeal process for contested decisions
- Create FAQ document for common scenarios to reduce dispute volume
- Set up dispute tracking to identify patterns requiring policy updates

#### Step 3: Document Exception Handling Policies

**Step Overview:** Define how edge cases and exceptions will be handled to prevent ad-hoc decisions. End state: Exception policies documented with approval authority defined.

- Document deal types that require special handling (channel, strategic, professional services)
- Define approval authority levels for exceptions (manager, VP, C-level)
- Establish policy for deals closed during transition periods (plan changes, territory changes)
- Create guidelines for commission adjustments due to data errors
- Document how discounting impacts commission (if at all)
- Establish annual review process for exception patterns

---

### Part 4: Tracking System Implementation

#### Step 1: Select and Configure Tracking Solution

**Step Overview:** Choose the appropriate tracking method (CRM, commission software, or spreadsheet) and configure it. End state: Tracking system selected, configured, and connected to data sources.

- Evaluate tracking options based on budget and complexity (Salesforce reports, CaptivateIQ, QuotaPath, Everstage, spreadsheet)
- Connect tracking system to CRM opportunity data (closed-won deals, amounts, dates)
- Configure role-based views (rep sees own commissions, manager sees team)
- Set up commission rate tables and quota assignments in system
- Configure calculation logic matching designed plan (rates, tiers, accelerators)
- Test calculations against historical data to validate accuracy

#### Step 2: Build Real-Time Dashboards and Reporting

**Step Overview:** Create dashboards that give reps and managers visibility into performance and projected earnings. End state: Dashboards live with real-time or near-real-time data.

- Build rep-facing dashboard showing: quota attainment, commissions earned, projected payout
- Create manager dashboard showing: team attainment, payout forecast, individual performance
- Set up Finance/RevOps admin views for payout processing and auditing
- Configure alerts for key events (deal closed, quota achieved, accelerator triggered)
- Build month-end and quarter-end commission summary reports
- Document data refresh frequency and any lag between CRM and commission system

#### Step 3: Establish Payout Processing Workflow

**Step Overview:** Define the end-to-end process from commission calculation to actual payout. End state: Payout workflow documented with timeline, approvals, and integration to payroll.

- Define commission calculation cutoff dates and payout schedule
- Establish approval workflow (RevOps calculates, Finance approves, Payroll processes)
- Configure exports or integrations to payroll system
- Create reconciliation checklist for each payout cycle
- Document error handling and correction process for payout mistakes
- Set up audit trail for all commission calculations and adjustments

---

### Part 5: Testing and Validation

#### Step 1: Validate Plan with Historical Scenarios

**Step Overview:** Test the new commission plan against historical deals to validate it produces expected results. End state: Plan validated with no unexpected outcomes or edge cases unaddressed.

- Run 20-30 historical deals through new plan calculations
- Compare new plan payouts to what would have been paid under old plan
- Identify any reps who would be significantly impacted (positive or negative)
- Test edge cases: splits, multi-year deals, clawbacks, ramp reps
- Validate accelerator and tier calculations at different attainment levels
- Document any plan refinements based on testing results

#### Step 2: Conduct User Acceptance Testing with Stakeholders

**Step Overview:** Have Finance, RevOps, and select sales leaders review and approve the plan and tracking system. End state: Sign-off from all stakeholders on plan design and tracking implementation.

- Walk Finance through calculation methodology and payout workflow
- Review plan documents with Sales Leadership for clarity and fairness
- Have 2-3 sales reps test dashboard and verify they can understand their commissions
- Address feedback and make final adjustments
- Obtain formal sign-off on commission plan document
- Document any approved exceptions or special cases

---

### Part 6: Rollout and Enablement

#### Step 1: Create Commission Plan Documentation Package

**Step Overview:** Develop comprehensive documentation for reps, managers, and administrators. End state: Complete documentation package ready for distribution.

- Write sales rep-facing commission plan summary (2-3 pages, plain language)
- Create visual one-pager showing rates, thresholds, and examples
- Develop FAQ document addressing top 20 anticipated questions
- Build example scenarios showing commission calculations at different attainment levels
- Create manager guide for explaining plan to team and handling questions
- Develop admin runbook for RevOps/Finance on payout processing

#### Step 2: Conduct Sales Team Enablement Sessions

**Step Overview:** Train all reps and managers on the new commission plan and tracking system. End state: All covered roles trained and able to access their commission data.

- Schedule training sessions by team or segment (45-60 minutes each)
- Cover: plan structure, rates, quotas, crediting rules, how to check earnings
- Walk through real examples and calculations
- Demonstrate dashboard and how to access commission information
- Address questions and document any requiring policy clarification
- Record session for onboarding future hires and absent attendees

#### Step 3: Launch Plan and Monitor Adoption

**Step Overview:** Go live with the new plan and actively monitor for issues in the first 30-60 days. End state: Plan live with smooth adoption and minimal disputes.

- Announce plan launch with communication from Sales Leadership
- Distribute documentation package to all covered roles
- Monitor dispute volume and types in first 30 days
- Track dashboard adoption (who's logging in, how often)
- Hold office hours for questions in first two weeks
- Schedule 30-day check-in with Sales Leadership to review adoption and issues

---

### Part 7: Handoff and Ongoing Operations

#### Step 1: Transfer Ownership to Client Team

**Step Overview:** Hand off all documentation, credentials, and processes to client RevOps/Finance. End state: Client self-sufficient to administer commission plan ongoing.

- Transfer admin access to commission tracking system
- Deliver complete documentation package (plan doc, runbooks, FAQ)
- Train client admin on monthly payout process and troubleshooting
- Document process for annual plan updates and quota setting
- Provide templates for onboarding new reps to commission plan
- Schedule 60-day follow-up call to address any questions

#### Step 2: Establish Ongoing Review Cadence

**Step Overview:** Set up the governance structure for ongoing plan management and optimization. End state: Review cadence established with clear ownership and KPIs defined.

- Define quarterly commission plan review meeting (attendees, agenda)
- Establish KPIs to monitor: quota attainment distribution, payout accuracy, dispute rate
- Create annual commission plan refresh process and timeline
- Document change management process for mid-year plan adjustments
- Set up feedback channel for reps to submit plan improvement suggestions
- Close out project with final summary and lessons learned

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM with accurate opportunity data (amounts, close dates, owners)
- Current commission plan documentation (even if informal)
- Access to historical payout data (6-12 months)
- Defined sales roles and territory/account assignments
- Budget parameters from Finance for total commission expense

**What client must provide:**
- Executive sponsor with authority to approve commission plan changes
- Finance stakeholder for payout process and budget alignment
- RevOps/Sales Ops resource for implementation and ongoing administration
- Sales leadership participation for design input and enablement
- Access to CRM admin for any required configuration
- Historical sales data and current rep roster with quotas

## 5. Common Pitfalls

- **Overcomplicating the plan**: Complex plans with too many metrics confuse reps and erode trust. Only 24% of reps can easily calculate their earnings. **Mitigation**: Limit to 2-3 metrics per role and ensure a rep can estimate their commission on a deal in under 60 seconds.

- **Misalignment with business goals**: 39% of revenue leaders admit their plans don't align with business goals (e.g., rewarding new logos when expansion is the priority). **Mitigation**: Start design by documenting the 2-3 behaviors you want to drive, then ensure every plan element incentivizes those behaviors.

- **Manual tracking and spreadsheet dependency**: Manual processes lead to payout errors, delays, and drain RevOps resources. **Mitigation**: Implement automated tracking from day one, even if it's structured spreadsheets with formulas rather than dedicated software.

- **Inadequate rules of engagement**: Lack of clear crediting rules leads to constant disputes and rep frustration. **Mitigation**: Document rules of engagement before going live and review common scenarios with sales leadership for edge cases.

- **Poor communication and enablement**: Even well-designed plans fail if reps don't understand them. **Mitigation**: Invest in enablement with examples, visuals, and Q&A time. Create self-service resources so reps can find answers.

## 6. Success Metrics

- **Leading Indicator**: Rep dashboard adoption rate (target: 80%+ of reps accessing commission dashboard within first 30 days) and dispute volume reduction (target: 50% fewer disputes than prior period)

- **Lagging Indicator**: Quota attainment distribution (target: 60-80% of reps hitting quota indicates well-calibrated plan) and commission expense as % of revenue within budget (target: within 5% of planned commission expense)

---

