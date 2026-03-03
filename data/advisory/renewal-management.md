# Renewal Management — Advisory

## Project Overview

**Project Name:** Renewal Management - Proactive Retention Infrastructure for Recurring Revenue

**Purpose:** This initiative establishes workflows, automation, health scoring, and reporting infrastructure to manage customer renewals proactively, reduce churn, and maximize recurring revenue retention (GRR/NRR). The outcome is a renewal engine delivering 90-day forward visibility, automated health-based alerts, standardized CSM playbooks, and real-time dashboards.

**Core Transformation:** Shifts from reactive firefighting—where renewals surface at invoice time—to a predictable, data-driven retention machine with full pipeline visibility and proactive intervention workflows.

### Capabilities Unlocked

After project completion, CS organizations can:

- View every upcoming renewal 90 days out with owner, value, and health status
- Receive automated alerts at 90/60/30-day intervals with specific CSM actions
- Score account health using product usage, support signals, and engagement data
- Run standardized renewal conversations with playbooks and talk tracks
- Intervene proactively on at-risk accounts before renewal windows open
- Report on renewal pipeline value, risk distribution, and CSM workload in real time
- Identify expansion opportunities during renewals

### Business Outcomes

**Primary:**

- Improve Gross Revenue Retention by 3-5 percentage points within two renewal cycles
- Achieve near-zero surprise churn
- Attain 100% renewal ownership coverage with 90-day alert accuracy
- Reduce time-to-action on at-risk accounts from weeks to hours

**Secondary:**

- Foundation for expansion revenue motions
- Data-driven CS capacity planning and territory design inputs
- Accurate renewal forecasting for finance and board reporting
- Baseline GRR/NRR metrics for future improvement measurement

### Key Stakeholders

- VP of Customer Success (Executive Sponsor)
- CS Operations Manager (Technical Owner)
- CSM Team Leads (Input Providers)
- RevOps Manager (Input Provider)
- Finance Lead (Input Provider)

### Pain Points Addressed

| Challenge | Solution |
|-----------|----------|
| Renewals discovered at invoice time | 90-day forward visibility with staged alerts |
| Health signals scattered across tools | Composite health score combining multiple signals |
| No standardized renewal process | Documented playbook with templates and escalation paths |
| No clear ownership; things fall through cracks | Required renewal owner assignment with accountability |
| Reactive churn firefighting | Proactive workflows triggered by health score thresholds |
| Unknown renewal outcomes until quarter-end | Real-time dashboard showing pipeline and forecast |

### The Data Behind the Problem

- Retaining customers costs 5-25x less than acquiring new ones; 5% retention improvement increases profits by 25-95%
- Median B2B SaaS Gross Revenue Retention is 90%; top-quartile companies exceed 95%
- Average annual B2B SaaS churn is 4.9%; a $10M ARR company loses ~$490K annually
- Involuntary churn represents 20-40% of total churn and is entirely preventable
- AI-enhanced health scores predict churn 3-6 months in advance with 85%+ accuracy
- 84% of B2B software buyers cite excellent customer support as key renewal factor

### Key Framework: The Weather Forecast Metaphor

Renewal management without health scoring resembles running a city without weather forecasts. You only know about storms after they arrive. Health scores function as forecasts—providing lead time to prepare, escalate, or intervene. The 90/60/30-day cadence mirrors forecast windows: 90 days shows system formation, 60 days tracks the path, 30 days executes response plans.

### Target Motion

Designed for Sales-Led Growth (SLG) and hybrid SLG/PLG B2B SaaS companies with recurring revenue models. Most applicable to organizations with 50+ customers and dedicated CS functions.

**Not a fit for:** Pure PLG companies with self-serve churn/renewal or companies with fewer than 20 customers.

---

## Tools & Systems

### Primary Tools

**Salesforce**
CRM platform where renewal tracking objects, health score fields, automated alert workflows, and dashboards are built. Functions as system of record for renewal dates, contract values, owners, and health status.

**HubSpot**
Alternative CRM for clients not using Salesforce. Uses custom Deal properties for renewal tracking, calculated properties for health scoring, and Workflows for automated alerts.

**Gainsight**
Dedicated Customer Success Platform sitting atop Salesforce. Provides native health scoring with machine learning, renewal center, playbook automation, and advanced reporting. Recommended for organizations with 200+ accounts.

**ChurnZero**
Alternative CS platform with strong in-app engagement tracking. Offers customizable health scores, renewal forecasting, and automated playbook triggers.

**Data Sources:**
- Product usage: Pendo, Mixpanel, Amplitude, native product analytics
- Support data: Zendesk, Intercom, Freshdesk, Salesforce Service Cloud
- Survey data: Delighted, SurveyMonkey, Salesforce Surveys
- Communication tracking: Gong, Outreach/Salesloft

---

## Scoping Factors

**Customer Base Size**
- Under 50 accounts: Simple CRM views may suffice
- 50-200 accounts: Standard project scope with CRM-native health scoring
- 200+ accounts: Dedicated CS platform recommended; adds 20-30 hours

**CRM Platform**
- Salesforce: Full flexibility with custom objects and Flow Builder
- HubSpot: Requires Professional/Enterprise tier
- Other CRM: May require workarounds; adds 10-20 hours

**Health Signal Data Sources**
- CRM-only signals: Lower complexity; 2-3 integrations
- Product usage via API: Moderate complexity; requires integration build
- Manual product usage exports: Higher complexity until integration built
- No product usage data: Limited to engagement and support signals

**Contract Complexity**
- Standard annual contracts: Straightforward tracking
- Multi-year with co-term dates: Requires contract hierarchy logic
- Usage-based/consumption pricing: Renewal value is variable
- Mixed contract types: Requires segmented workflows

**Existing CS Tooling**
- CRM only: Full project scope
- CS platform deployed: Reduce scope by 20-30%
- Platform being evaluated: Adds 10-15 hours for selection advisory

**CS Team Maturity**
- New function (under 1 year): Heavy emphasis on process design
- Established with ad hoc processes: Focus on standardization
- Mature organization: Focus on optimization

### Multiple Approaches

**Approach 1: CRM-Native Build**
- Criteria: Under 200 accounts, no CS platform budget, Salesforce/HubSpot Enterprise
- Execution: Build renewal tracking, health scoring, alerts, and dashboards within CRM
- Trade-off: Lower tool cost but more manual maintenance

**Approach 2: CS Platform Implementation**
- Criteria: 200+ accounts, budget for Gainsight/ChurnZero/Totango
- Execution: Deploy CS platform atop CRM; configure native health scoring and modules
- Trade-off: Higher tool cost but more scalable and lower maintenance

**Approach 3: Hybrid (CRM + Lightweight Automation)**
- Criteria: 50-200 accounts with moderate budget
- Execution: Build core tracking in CRM; add lightweight health scoring; use Slack/email integrations
- Trade-off: Balance of cost and capability

---

## Discovery Questions

### Project Kickoff

**Business Context**
- Current GRR/NRR? If unknown, what data exists to calculate?
- How many active customers; distribution by segment?
- What percentage of revenue from renewals vs. new logos?
- Recent churn spikes; root causes?

**Current State**
- How are renewals currently tracked? (CRM field, spreadsheet, reminders, nothing)
- Who owns renewals today? (CSM, account owner, unassigned)
- What happens at 90/30-day marks?
- When was a renewal last missed or discovered late?
- Existing customer health tracking? What signals?

**Technical Environment**
- CRM platform and tier/edition?
- Where does product usage data live; accessible via API?
- Support platform; can ticket data integrate to CRM?
- CS platform deployed or under evaluation?
- Existing automations that might conflict?

**Expectations**
- What does success look like 90 days post-launch?
- Which segments are highest priority?
- Weekly CSM time available for the new process?
- Executive sponsorship for enforcing new renewal process?

### Pre-Implementation Information

- Complete active customer list with contract end dates, ARR, contract type, auto-renewal clauses
- Last 12 months of churned accounts with churn date, reason, ARR, segment
- CRM admin credentials, support platform access, product analytics access, CS platform admin access
- CS leadership availability (2-3 hours); 2-3 CSM interviews (30 minutes each); CS Ops/RevOps (4-6 hours/week)

### Approach Decision Matrix

| Question | Answer | Approach |
|----------|--------|----------|
| Active customers? | Under 200 = CRM-Native; 200+ = CS Platform; 50-200 constrained = Hybrid |
| CS platform deployed or budgeted? | Yes = CS Platform; No = CRM-Native or Hybrid |
| Product usage data via API? | Yes = Full health scoring; No = Engagement + support signals only |
| CRM tier? | SF Enterprise+ or HubSpot Enterprise = Full build; HubSpot Pro = Limited |
| Contract complexity? | Standard annual = Simple; Mixed/usage-based = Add 15-20 hours |

---

## Overcoming Belief Barriers

### "We already track renewals in a spreadsheet – this is overkill."

Spreadsheets work for 20-30 accounts. At scale, spreadsheets lack automated alerts, automatic updates, and health signal surfacing. A CS leader managing 100+ renewals spends 3-5 hours weekly on manual entry. Spreadsheets also create single-point-of-failure risk.

**Reframe:** The spreadsheet got you here. The question is sustainability through growth.

### "Our CSMs know their accounts – they don't need a system to tell them who's at risk."

CSM intuition is valuable as a health score input. However, intuition does not scale across 30 accounts tracking login frequency, ticket patterns, and engagement simultaneously. Research shows data-driven health scores identify at-risk accounts that CSMs rate as healthy 15-20% of the time, because declining usage patterns occur gradually and remain invisible without trend data.

**Reframe:** CSMs are experts. This gives them X-ray vision—data behind the gut feeling.

### "We should focus on growth, not retention."

Acquiring customers costs 5-25x more than retention; 5% retention improvement increases profits by 25-95%. For a $10M ARR company improving from 90% to 95% GRR, the impact equals closing $500K in new-logo revenue—without the sales cycle, onboarding cost, or time-to-value delays.

**Reframe:** Growth and retention aren't either/or. Retention makes growth investments compound instead of leak.

### "We tried this before and it didn't work."

Past failures typically stem from: (1) alerts without context, (2) no ownership model, or (3) systems built without CSM input. This project addresses all three through co-designed playbooks, health-context in alerts, and enforced renewal ownership.

**Reframe:** The last attempt taught lessons. This project is designed around those insights.

---

## Metrics & Success Measurement

### Power 10 Metrics Impacted

| Metric | Direction | Expected Magnitude | Notes |
|--------|-----------|-------------------|-------|
| Gross Revenue Retention (GRR) | Increase | +3-5 percentage points | Fewer missed renewals; proactive churn intervention |
| Net Revenue Retention (NRR) | Increase | +5-10 percentage points | Renewal conversations surface expansion opportunities |
| Customer Lifetime Value (LTV) | Increase | +15-25% | Higher retention compounds over multiple cycles |
| CAC Payback Period | Decrease | Shorter 1-3 months | Retained revenue reaches payback faster |

### Expected Outcomes

| Metric | Before | After | Source |
|--------|--------|-------|--------|
| Renewal visibility window | 0-30 days (reactive) | 90 days (proactive) | Project design |
| Renewal ownership coverage | 60-70% unassigned | 100% required field | Project design |
| Surprise churn rate | 30-50% of churned accounts | Under 5% | Health score accuracy |
| CSM time on renewal admin | 3-5 hours/week | Under 1 hour/week | Automation ROI |
| GRR | Median 90% for B2B SaaS | Target 93-95% | Benchmarkit 2024 |
| At-risk identification lead time | Days; after-the-fact | 3-6 months | Health score research |

### Success Measurement

**Leading Indicators (Weeks 1-4):**
- 100% of active customers have renewal date, owner, and health score populated
- 90/60/30-day alerts firing accurately (validated against test cohort)
- CSMs completing alert-triggered tasks within SLA (48 hours for 90-day tasks)
- Weekly renewal pipeline review meetings occurring with documented actions

**Lagging Indicators (Months 2-6):**
- GRR improves 3-5 percentage points vs. baseline
- Surprise churn drops to near zero
- Renewal forecast accuracy within 5%
- Health score accuracy validated: 80%+ of "at-risk" accounts churn or require intervention
- CSM adoption rate above 90% (task completion and playbook usage)

---

## References

- [1] HBR - The Value of Keeping the Right Customers
- [2] Benchmarkit - 2024 SaaS Performance Metrics
- [3] Vitally - B2B SaaS Churn Rate Benchmarks 2025
- [4] ChurnBuster - Full Guide to B2B SaaS Churn Rate Management
- [5] Gainsight - Customer Health Scores Explained
