# Customer Health Model - Playbook

## 1. Definition

**What it is**: A technical and strategic implementation project that creates a multi-dimensional scoring system to measure customer health by combining product usage signals, CSM sentiment, support interactions, and engagement metrics into a unified health score that enables proactive churn prevention.

**What it is NOT**: Not a Customer Success Platform implementation (that's the tool setup). Not Customer Segmentation (that's account tiering). Not a Renewal Forecasting model (that's revenue prediction). Not NPS/CSAT survey setup (that's one input to health scoring).

## 2. ICP Value Proposition

**Pain it solves**: Customer Success teams lack visibility into which accounts are truly at-risk versus healthy. CSM "gut feel" is inconsistent and doesn't scale. Churn surprises happen because warning signs weren't systematically tracked. Without a data-driven health score, intervention happens too late.

**Outcome delivered**: A functioning customer health scoring system with clear thresholds (Red/Yellow/Green), automated data collection from product and CRM, dashboards for visibility, and defined playbooks for at-risk intervention. CSMs can prioritize their book of business based on objective signals rather than intuition.

**Who owns it**: VP of Customer Success or Head of Customer Operations.

## 3. Implementation Procedure

### Part 1: Discovery & Requirements Definition

#### Step 1: Analyze Historical Churn Data

**Step Overview:** Review past churn events to identify patterns and signals that preceded customer departures. End state: Documented list of leading indicators correlated with churn in your specific business.

- Pull list of all churned customers from past 12-24 months
- Categorize churn reasons (product fit, support issues, champion left, budget, competitor)
- Identify common behaviors before churn (usage decline, support ticket spikes, missed QBRs)
- Interview 2-3 CSMs on what they noticed before accounts churned
- Document 5-10 potential health score signals based on churn analysis

#### Step 2: Define Health Score Dimensions and Metrics

**Step Overview:** Identify the specific metrics that will comprise the health score across multiple dimensions. End state: Finalized list of 5-10 metrics organized by dimension with clear definitions.

- Define Product dimension metrics (login frequency, feature adoption, license utilization, active user trend)
- Define Engagement dimension metrics (QBR attendance, email response rate, executive sponsor engagement)
- Define Support dimension metrics (ticket volume, escalation frequency, time to resolution)
- Define Financial dimension metrics (payment timeliness, expansion history, renewal timing)
- Include CSM sentiment as a qualitative override dimension
- Document data source for each metric (CRM, product analytics, support system)

#### Step 3: Validate Metrics with Stakeholders

**Step Overview:** Review proposed metrics with CS leadership and cross-functional partners to ensure buy-in. End state: Approved metric list with stakeholder alignment on what signals matter.

- Schedule review meeting with VP Customer Success and CS managers
- Present proposed metrics with rationale from churn analysis
- Gather feedback on missing signals or irrelevant metrics
- Validate data availability with RevOps/Data team
- Finalize approved metric list with documented rationale

---

### Part 2: Scoring Model Design

#### Step 1: Establish Metric Weights

**Step Overview:** Assign relative importance weights to each metric based on correlation with retention outcomes. End state: Weighted scoring model with percentages assigned to each metric.

- Analyze historical correlation between each metric and renewal/churn outcomes
- Assign weights totaling 100% across all metrics (e.g., product usage 40%, engagement 25%, support 20%, financial 15%)
- Consider segment-specific weights (enterprise vs SMB may weight differently)
- Document rationale for each weight assignment
- Create scoring formula combining weighted metrics

#### Step 2: Define Scoring Thresholds and Categories

**Step Overview:** Establish the score ranges that define Red (at-risk), Yellow (needs attention), and Green (healthy) accounts. End state: Clear threshold definitions with category descriptions.

- Set numeric thresholds for each category (e.g., 0-40 Red, 41-70 Yellow, 71-100 Green)
- Define what each category means operationally (Red = immediate intervention required)
- Document edge cases and override rules (e.g., CSM can override if major event occurred)
- Consider adding "Black" category for accounts with insufficient data
- Test thresholds against historical churned accounts to validate accuracy

#### Step 3: Design Segment-Specific Scoring Rules

**Step Overview:** Customize scoring criteria for different customer segments to ensure fair comparison. End state: Segment-specific scoring rules that account for usage patterns by account size.

- Define customer segments (Enterprise, Mid-Market, SMB, or by product tier)
- Adjust usage expectations by segment (50% login rate may be healthy for Enterprise, concerning for SMB)
- Set different metric weights per segment if needed
- Document lookup windows for each metric (e.g., trailing 30 days vs 90 days)
- Create segment mapping rules for automated categorization

---

### Part 3: Technical Implementation

#### Step 1: Configure Data Integrations

**Step Overview:** Set up data flows from source systems into the customer success platform. End state: All required data sources connected and syncing reliably.

- Connect CRM (Salesforce/HubSpot) to CS platform via native integration
- Set up product analytics integration (Segment, Amplitude, Mixpanel, or direct API)
- Configure support system integration (Zendesk, Intercom, Freshdesk)
- Establish billing/financial data sync from payment system
- Verify data freshness and sync frequency for each source
- Document any data transformation or field mapping required

#### Step 2: Build Health Score in CS Platform

**Step Overview:** Configure the health score calculation in Gainsight, ChurnZero, Vitally, or similar platform. End state: Automated health score calculating correctly for all accounts.

- Create health score measures for each defined metric
- Configure metric calculations with correct lookback windows
- Apply weights to each measure per approved model
- Set up segment-based scoring variations if applicable
- Configure score refresh frequency (daily recommended)
- Set up CSM sentiment input field for manual override

#### Step 3: Create Health Score Dashboard

**Step Overview:** Build reporting dashboards for health score visibility across the CS organization. End state: Dashboard showing account health distribution with drill-down capability.

- Create executive summary view (health distribution pie chart, trend over time)
- Build CSM-level view filtered by book of business
- Include health score trend charts for individual accounts
- Add drill-down to see which metrics are driving low scores
- Configure alerts for accounts crossing threshold boundaries
- Set up scheduled dashboard delivery to CS leadership

---

### Part 4: Validation & Testing

#### Step 1: Test Score Accuracy Against Historical Data

**Step Overview:** Validate the health score model by checking if it correctly identifies known churned accounts. End state: Validated model with documented accuracy metrics.

- Run health scores retrospectively against accounts that churned 6+ months ago
- Calculate false positive rate (Green accounts that churned)
- Calculate false negative rate (Red accounts that renewed/expanded)
- Adjust thresholds or weights if accuracy is below 70%
- Document model accuracy baseline for future comparison
- Identify any segments where model performs poorly

#### Step 2: Conduct Pilot with CSM Team

**Step Overview:** Run pilot period with subset of CSMs to validate score usefulness and gather feedback. End state: Pilot complete with documented feedback and refinements.

- Select 2-3 CSMs for pilot program (mix of tenure and segment coverage)
- Review their top 10 accounts by health score (high and low)
- Validate scores match CSM intuition and known account situations
- Gather feedback on missing signals or incorrect assessments
- Refine model based on pilot learnings
- Document changes made and rationale

---

### Part 5: Rollout & Enablement

#### Step 1: Develop Intervention Playbooks

**Step Overview:** Create standardized response playbooks for each health score category. End state: Documented playbooks defining actions for Red, Yellow, and Green accounts.

- Define Red account intervention steps (executive escalation, QBR scheduling, product review)
- Define Yellow account monitoring cadence and proactive touchpoints
- Define Green account expansion opportunity identification
- Create escalation path for accounts declining into Red status
- Document SLA for CSM response to score changes
- Build playbook templates in CS platform if supported

#### Step 2: Train Customer Success Team

**Step Overview:** Enable the CS team on health score interpretation and usage. End state: Team trained and confident using health scores in daily workflow.

- Schedule training session (45-60 minutes) with full CS team
- Explain each metric, weight, and threshold rationale
- Demonstrate dashboard navigation and account drill-down
- Review intervention playbooks and expected actions
- Practice with sample accounts (what would you do for this Red account?)
- Create quick-reference guide for ongoing use

#### Step 3: Hand Off to Client

**Step Overview:** Transfer ownership and establish ongoing governance process. End state: Client self-sufficient with admin access and quarterly review process defined.

- Transfer admin access to CS Operations or RevOps owner
- Deliver configuration documentation (metrics, weights, thresholds, data sources)
- Establish quarterly health score review cadence to assess accuracy
- Define process for requesting metric or threshold changes
- Schedule 30-day check-in to review adoption and address questions
- Close out project with success metrics documentation

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Customer Success Platform in place (Gainsight, ChurnZero, Vitally, Catalyst, Totango, Planhat)
- CRM with customer account data (Salesforce or HubSpot)
- At least 6-12 months of customer data (for churn analysis and validation)
- Product analytics tracking in place (or ability to implement)
- Defined customer segments or tiers

**What client must provide:**
- Access to CS platform with admin permissions
- Access to CRM with reporting permissions
- Historical churn data with reason codes if available
- Product usage data or analytics platform access
- 2-3 hours of stakeholder time for requirements and validation sessions
- CSM team availability for training (45-60 minutes)

## 5. Common Pitfalls

- **Overcomplicating the model with too many metrics**: Starting with 20+ metrics makes the score confusing and hard to trust. Teams won't use what they can't explain. **Mitigation**: Start with 5-7 high-impact metrics. Add complexity only after proving the base model works.

- **Using the same thresholds for all customer segments**: A 50% product usage rate might be healthy for Enterprise (heavy users log in weekly) but concerning for SMB (should be daily). **Mitigation**: Benchmark usage against customer size/segment and set segment-specific thresholds.

- **Relying too heavily on CSM sentiment or a single metric**: Manual sentiment alone is inconsistent across CSMs and doesn't scale. Single-metric scores miss important signals. **Mitigation**: Balance quantitative data (usage, support) with qualitative input (sentiment) and require multiple signals to trigger Red status.

- **Setting and forgetting the health score model**: Customer behavior and product features change. A model built in Q1 may be inaccurate by Q4. **Mitigation**: Schedule quarterly health score reviews to analyze false positives/negatives and adjust weights or thresholds accordingly.

## 6. Success Metrics

- **Leading Indicator**: CSMs are actively using health scores in weekly workflow (measured by dashboard views and score-based actions taken within 14 days of launch)
- **Lagging Indicator**: Reduction in "surprise" churn (accounts that churned without being flagged Red 60+ days prior) by 50% within first 6 months

---

