# Lead Scoring Model Design & Implementation (Sales-Led) - Playbook

## 1. Definition

**What it is**: A strategic and technical implementation project that designs, builds, and deploys a systematic lead scoring model in the CRM/marketing automation platform to prioritize leads based on fit (demographic/firmographic) and engagement (behavioral signals) for a sales-led GTM motion. The deliverable is a working, automated scoring system that surfaces the highest-potential leads to sales reps.

**What it is NOT**: Not a Marketing Automation Platform implementation (that's broader workflow automation). Not a Lead Routing/Assignment project (that's distribution after scoring). Not a Predictive Analytics or AI/ML project (though the model may inform future AI adoption). Not a Lead Lifecycle/Funnel Stage project (that's stage definitions, not scoring).

## 2. ICP Value Proposition

**Pain it solves**: Sales reps waste time chasing low-quality leads while high-potential prospects go cold. Without scoring, all leads look equal, forcing reps to manually qualify each one. Marketing passes leads without context on fit or intent, creating friction and low MQL-to-SQL conversion rates.

**Outcome delivered**: A working lead scoring model that automatically ranks every lead by fit and engagement. Sales reps receive prioritized lists of leads most likely to convert. MQL-to-SQL conversion rates typically increase 20-40%, and sales productivity improves as reps focus on high-value opportunities.

**Who owns it**: VP of Marketing or Marketing Ops Leader, with close collaboration from VP of Sales and RevOps.

## 3. Implementation Procedure

### Part 1: Discovery & Scoring Strategy Design

#### Step 1: Audit Current Lead Data and Processes

**Step Overview:** Assess the current state of lead data quality, existing scoring (if any), and the lead handoff process between marketing and sales. End state: Gap analysis document showing what data exists, what's missing, and current pain points.

- Pull sample of 50-100 recent leads from CRM to assess data completeness
- Inventory available data fields: demographic (title, company size, industry), firmographic (revenue, employee count), and behavioral (page views, email engagement, form fills)
- Interview 2-3 sales reps on current lead quality issues and what signals they use to prioritize
- Document current MQL definition and handoff process (if any exists)
- Identify data gaps that will need enrichment or new tracking

#### Step 2: Define Ideal Customer Profile (ICP) Criteria

**Step Overview:** Establish the firmographic and demographic attributes that define an ideal customer for scoring purposes. End state: Documented ICP criteria with weighted importance for each attribute.

- Analyze closed-won deals from past 12 months to identify common attributes
- Define primary ICP attributes: industry, company size, revenue range, geography
- Define secondary attributes: tech stack, growth signals, funding stage
- Create tiered scoring for each attribute (e.g., exact match = 20 pts, adjacent = 10 pts, poor fit = 0 pts)
- Validate ICP criteria with sales leadership to ensure alignment

#### Step 3: Map Behavioral Engagement Signals

**Step Overview:** Identify and weight the behavioral actions that indicate buying intent. End state: Documented list of engagement signals with point values assigned.

- Catalog all trackable behaviors: website visits, specific page views (pricing, demo, case studies), email opens/clicks, form submissions, content downloads
- Classify behaviors by intent level: high-intent (demo request, pricing page), medium-intent (case study download, webinar attendance), low-intent (blog visit, email open)
- Assign point values based on intent correlation (e.g., demo request = 50 pts, pricing page = 30 pts, blog visit = 5 pts)
- Define negative scoring triggers: competitor company, student email, unsubscribe, bounced emails
- Establish time decay rules (e.g., subtract 10 pts for every 30 days of no engagement)

---

### Part 2: Scoring Model Build & CRM Configuration

#### Step 1: Design Scoring Model Architecture

**Step Overview:** Create the complete scoring model framework combining fit and engagement scores with defined thresholds. End state: Documented scoring model with all criteria, point values, and threshold definitions.

- Create combined scoring model: Fit Score (0-100) + Engagement Score (0-100) = Total Score
- Define MQL threshold (e.g., Fit Score >= 50 AND Engagement Score >= 25)
- Define SQL threshold (e.g., Total Score >= 75 with recent high-intent action)
- Document score calculation logic for all attributes and behaviors
- Build scoring matrix showing how different lead profiles would score

#### Step 2: Configure Lead Scoring in CRM/Marketing Automation

**Step Overview:** Implement the scoring model in HubSpot, Marketo, or Salesforce with all criteria and automation rules. End state: Working scoring system calculating scores for all leads in real-time.

- Create custom score fields in CRM (Fit Score, Engagement Score, Total Score, Score Date)
- Build scoring rules for demographic/firmographic criteria in marketing automation platform
- Configure behavioral scoring triggers for website, email, and form engagement
- Set up negative scoring automation (competitor domains, disqualifying titles, time decay)
- Create automation to recalculate scores on relevant events

#### Step 3: Build MQL Threshold Automation and Notifications

**Step Overview:** Configure automated workflows that trigger when leads cross MQL threshold. End state: Leads automatically flagged as MQL and routed to sales with appropriate notifications.

- Build workflow to update lead status to MQL when threshold is met
- Configure sales notification (email/Slack) when new MQLs are created
- Create lead assignment rules or integration with routing system
- Set up re-MQL logic for leads that drop below and return above threshold
- Document automation logic for ongoing maintenance

---

### Part 3: Testing, Validation & Refinement

#### Step 1: Validate Scoring Model with Historical Data

**Step Overview:** Test the scoring model against historical lead and opportunity data to validate predictive accuracy. End state: Validation report showing correlation between scores and conversion outcomes.

- Score a sample of 200+ historical leads (mix of won, lost, and disqualified)
- Analyze score distribution: Do won deals cluster at higher scores?
- Calculate conversion rates by score band (0-25, 26-50, 51-75, 76-100)
- Identify any criteria that are over-weighted or under-weighted
- Adjust point values based on analysis findings

#### Step 2: Conduct Pilot Test with Sales Team

**Step Overview:** Run a 2-week pilot with a subset of the sales team using the new scoring model. End state: Pilot feedback collected and model adjustments identified.

- Select 3-5 reps for pilot program
- Brief pilot reps on scoring methodology and how to interpret scores
- Have reps work scored leads for 2 weeks and track outcomes
- Collect feedback via survey and 1:1 interviews on score accuracy
- Document model adjustments needed based on pilot learnings

#### Step 3: Refine Model Based on Feedback

**Step Overview:** Make final adjustments to scoring criteria and thresholds based on validation and pilot feedback. End state: Production-ready scoring model with stakeholder approval.

- Adjust point values for criteria that pilot identified as over/under-valued
- Fine-tune MQL/SQL thresholds if conversion rates are too high or low
- Update time decay rules if needed based on actual sales cycle length
- Get sign-off from sales and marketing leadership on final model
- Document final scoring model configuration for ongoing reference

---

### Part 4: Rollout, Training & Handoff

#### Step 1: Train Sales Team on Lead Scoring System

**Step Overview:** Enable the full sales team to understand and effectively use the new lead scoring system. End state: Sales team trained with documentation and able to leverage scores in daily workflow.

- Schedule training session (45-60 min) for full sales team
- Explain scoring methodology: what fit and engagement scores mean
- Demonstrate how to view and filter leads by score in CRM
- Provide quick-reference guide showing score interpretation and recommended actions
- Address questions and common scenarios (e.g., high fit / low engagement leads)

#### Step 2: Create Monitoring Dashboards and Reports

**Step Overview:** Build dashboards to monitor scoring model performance and lead quality metrics. End state: Live dashboards showing scoring distribution, MQL volume, and conversion rates by score band.

- Create lead score distribution dashboard (histogram of current scores)
- Build MQL-to-SQL conversion tracking by score band
- Set up weekly/monthly report on scoring model health metrics
- Configure alerts for anomalies (sudden score inflation, MQL volume spikes)
- Document dashboard locations and metrics definitions

#### Step 3: Document and Hand Off to Client

**Step Overview:** Transfer ownership and complete documentation to client RevOps/Marketing Ops team. End state: Client team self-sufficient with admin access, runbooks, and optimization playbook.

- Create scoring model documentation: all criteria, point values, thresholds
- Document automation workflows and where they live in the platform
- Build troubleshooting guide for common issues (score not updating, wrong MQL status)
- Provide optimization playbook: how to review and adjust scores quarterly
- Transfer admin access and schedule 30-day check-in call

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) with lead/contact records
- Marketing automation platform connected to CRM (HubSpot, Marketo, Pardot)
- Website tracking implemented (for behavioral signals)
- 6+ months of historical lead and opportunity data for validation
- Defined lead lifecycle stages (at minimum: Lead, MQL, SQL)

**What client must provide:**
- Admin access to CRM and marketing automation platform
- Access to sales leadership for ICP validation interviews
- Access to 2-3 sales reps for requirements and pilot testing
- Historical closed-won deal data for ICP analysis
- Existing documentation on ICP or target market (if available)

## 5. Common Pitfalls

- **Over-scoring behaviors leading to score inflation**: Awarding too many points for low-value actions (email opens, blog visits) inflates scores and reduces differentiation between leads. → **Mitigation**: Reserve high point values (20+) for high-intent actions only; use 5-10 point max for awareness-stage behaviors.

- **Static model that goes stale**: Lead scoring models lose accuracy over time as markets, products, and buyer behaviors change. → **Mitigation**: Build quarterly review into client handoff; create dashboard to monitor score-to-conversion correlation.

- **Imbalance between fit and engagement scoring**: Over-weighting fit (all enterprise leads score high) or engagement (newsletter readers score high) creates false positives. → **Mitigation**: Require minimum thresholds for BOTH fit and engagement to qualify as MQL.

- **Marketing-Sales misalignment on MQL definition**: Marketing declares leads MQL that sales rejects, creating friction and distrust in the system. → **Mitigation**: Include sales leadership in scoring model design; establish feedback loop for sales to flag scoring issues.

## 6. Success Metrics

- **Leading Indicator**: MQL-to-SQL acceptance rate increases within first 30 days (target: 20%+ improvement); sales reps report improved lead quality in feedback surveys
- **Lagging Indicator**: MQL-to-Opportunity conversion rate improves by 25%+ within 90 days; time-to-close decreases for scored leads vs. pre-implementation baseline

---

