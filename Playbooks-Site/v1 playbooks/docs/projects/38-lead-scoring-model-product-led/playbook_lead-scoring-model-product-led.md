# Lead Scoring Model Design & Implementation (Product-Led) - Playbook

## 1. Definition

**What it is**: A strategic and technical implementation project that develops a systematic scoring model to evaluate and prioritize leads based on product usage signals, behavioral data, and firmographic fit for product-led go-to-market motions. The deliverable is a working, automated lead scoring system integrated into the CRM/MAP that surfaces Product-Qualified Leads (PQLs) for sales prioritization.

**What it is NOT**: Not a traditional MQL-based lead scoring model (this focuses on product usage signals, not just marketing engagement). Not a lead routing implementation (that's downstream from scoring). Not a full PLG infrastructure build (assumes product analytics already exist). Not predictive scoring with ML models (this is rules-based scoring with manual criteria).

## 2. ICP Value Proposition

**Pain it solves**: Product-led companies generate high volumes of free trial and freemium users, but sales teams waste time chasing low-intent users while high-value prospects slip through. Traditional MQL scoring based on content downloads fails to identify users who have actually experienced product value and are ready to buy.

**Outcome delivered**: A working lead scoring model that combines product usage signals (feature adoption, usage frequency, milestone completion) with firmographic fit to surface Product-Qualified Leads (PQLs) that convert at 2-3x higher rates than standard MQLs. Sales focuses on users who have demonstrated real buying intent through product behavior.

**Who owns it**: VP of Marketing, VP of RevOps, or Growth/PLG Lead. Often co-owned between Marketing Ops and Product teams.

## 3. Implementation Procedure

### Part 1: Discovery & Scoring Strategy Design

#### Step 1: Define Scoring Objectives and Success Criteria

**Step Overview:** Align stakeholders on what the lead scoring model needs to achieve and how success will be measured. End state: Documented objectives with specific conversion targets and agreement on what constitutes a "sales-ready" PQL.

- Conduct stakeholder interviews with Sales, Marketing, and Product to understand current lead prioritization pain points
- Document specific goals (e.g., increase trial-to-paid conversion by 25%, reduce time spent on unqualified leads by 40%)
- Define the threshold score that triggers sales engagement (e.g., score of 80+ = PQL for outreach)
- Establish baseline metrics for current trial conversion rates, sales cycle length, and lead-to-opportunity ratios
- Get executive sign-off on scoring objectives and success criteria

#### Step 2: Map Ideal Customer Profile to Scoring Criteria

**Step Overview:** Translate the ICP into specific firmographic and demographic attributes that can be scored. End state: Documented list of fit criteria with relative weightings agreed upon by Sales and Marketing.

- Review closed-won deals from past 12 months to identify common firmographic patterns (company size, industry, tech stack)
- Document negative fit indicators (company too small, wrong industry, competitor employee)
- Assign point values to fit attributes based on correlation with conversion (e.g., ICP industry = +20 points, wrong industry = -15 points)
- Validate scoring weights with Sales leadership to ensure alignment with their qualification criteria
- Create fit scoring matrix showing all attributes and their point values

#### Step 3: Identify Product Usage Signals for Behavioral Scoring

**Step Overview:** Determine which product engagement behaviors correlate with buying intent and conversion. End state: Prioritized list of product usage signals with point values based on predictive value.

- Analyze product analytics data to identify usage patterns of converted users vs. churned trials
- Identify key activation milestones that correlate with conversion (e.g., first integration, invited teammates, used core feature 3+ times)
- Document engagement frequency thresholds (e.g., logged in 5+ times in first week = high intent)
- Map feature usage to buying signals (e.g., used enterprise-only features during trial = expansion opportunity)
- Weight product signals 3-5x higher than demographic data based on PLG best practices

---

### Part 2: Data Infrastructure Assessment

#### Step 1: Audit Current Data Sources and Quality

**Step Overview:** Assess available data sources and identify gaps in the data needed for scoring. End state: Data audit report showing what data exists, where it lives, and what's missing.

- Inventory all data sources: CRM (Salesforce/HubSpot), product analytics (Segment, Amplitude, Mixpanel), enrichment tools (Clay, Clearbit, ZoomInfo)
- Assess data quality and completeness for key scoring fields (job title fill rate, company size accuracy)
- Identify product usage events currently tracked vs. needed for scoring
- Document data flow between systems (how product data gets to CRM)
- Flag gaps that need to be addressed before scoring implementation

#### Step 2: Design Data Integration Architecture

**Step Overview:** Plan how product usage data will flow into the CRM/MAP to power scoring. End state: Architecture diagram showing data sources, integration methods, and destination fields.

- Map product events that need to sync to CRM/MAP (via Segment, native integration, or custom API)
- Define custom fields needed in CRM to store product usage data (last login date, feature usage flags, activation status)
- Determine sync frequency requirements (real-time vs. daily batch for different signals)
- Document any data transformation logic needed (e.g., aggregating events into scores)
- Create technical specification for engineering team if custom integration work is required

---

### Part 3: Scoring Model Build & Configuration

#### Step 1: Build Fit Scoring Rules in CRM/MAP

**Step Overview:** Configure demographic and firmographic scoring rules in the marketing automation platform or CRM. End state: Fit scoring rules live and automatically scoring new leads on firmographic criteria.

- Create scoring property/field in HubSpot, Marketo, or Salesforce to store fit score
- Build positive scoring rules for ICP fit attributes (industry match, company size range, job title/seniority)
- Build negative scoring rules for disqualifying attributes (competitor, student, wrong geography)
- Configure scoring rules to fire on lead creation and when enrichment data updates
- Test with sample records to verify fit scoring calculates correctly

#### Step 2: Build Behavioral Scoring Rules for Product Usage

**Step Overview:** Configure product engagement scoring rules that assign points based on usage signals. End state: Behavioral scoring rules live and automatically scoring leads based on product activity.

- Create behavioral score property/field separate from fit score
- Build scoring rules for activation milestones (completed onboarding, first key action, invited users)
- Configure engagement frequency scoring (login frequency, session count, feature breadth)
- Build scoring rules for high-intent actions (viewed pricing, started upgrade flow, used premium features)
- Implement negative scoring for inactivity (subtract points after 14+ days of no login)

#### Step 3: Configure Score Decay and Recency Logic

**Step Overview:** Implement time-based decay rules to ensure scores reflect current intent, not stale engagement. End state: Decay rules automatically reduce scores for inactive leads, keeping the pipeline fresh.

- Configure decay rules to subtract points after defined inactivity periods (e.g., -10 points per 30 days of no engagement)
- Weight recent actions higher than older actions (demo request this week > demo request 30 days ago)
- Build engagement velocity bonuses (e.g., +25 points if 5+ key actions in 48 hours)
- Set floor scores to prevent decay from pushing scores negative
- Test decay logic with historical leads to verify it properly surfaces active prospects

#### Step 4: Create Combined Lead Score and PQL Threshold

**Step Overview:** Combine fit and behavioral scores into a single actionable lead score with defined PQL thresholds. End state: Combined lead score field that triggers PQL status at defined threshold.

- Create combined lead score formula (e.g., Fit Score + Behavioral Score = Total Lead Score)
- Define PQL threshold based on historical conversion data (score at which leads convert at target rate)
- Build PQL flag/status that triggers when threshold is reached
- Configure notifications to sales when leads reach PQL status
- Document scoring model logic in a reference sheet for stakeholder visibility

---

### Part 4: Integration & Automation Setup

#### Step 1: Connect Product Analytics to CRM/MAP

**Step Overview:** Implement the data pipeline to flow product usage events into the scoring system. End state: Product usage data syncing to CRM in near-real-time, populating the fields that drive behavioral scoring.

- Configure Segment/CDP to send key events to CRM/MAP destination
- Alternatively, set up native product analytics integration (e.g., HubSpot product tracking, Salesforce Engage)
- Verify events are populating correct fields in CRM
- Test event latency to ensure acceptable delay between product action and score update
- Document the event mapping for ongoing maintenance

#### Step 2: Build Sales Alert and Assignment Workflows

**Step Overview:** Create automation that notifies sales reps when leads become PQLs and assigns them appropriately. End state: Sales reps receive real-time alerts for new PQLs with context on why the lead qualified.

- Build workflow triggered when lead reaches PQL threshold
- Configure lead assignment logic (round-robin, territory-based, or account-based)
- Create email/Slack notification to assigned rep with key context (score, top behaviors, fit details)
- Build CRM task creation for PQL follow-up with suggested messaging
- Test end-to-end flow from product action to sales notification

---

### Part 5: Testing & Validation

#### Step 1: Validate Scoring Model Against Historical Data

**Step Overview:** Test the scoring model against historical closed-won and closed-lost deals to verify predictive accuracy. End state: Validation report showing correlation between lead scores and actual conversion outcomes.

- Apply scoring model retroactively to leads from past 6-12 months
- Compare score distribution of converted vs. non-converted leads
- Calculate conversion rate by score bucket (0-25, 26-50, 51-75, 76-100)
- Verify PQL threshold produces acceptable precision (not too many false positives)
- Adjust scoring weights if validation reveals weak correlation

#### Step 2: Conduct Pilot Test with Sales Team

**Step Overview:** Run a limited pilot with subset of sales team to validate scoring effectiveness in real sales workflows. End state: Pilot feedback incorporated and scoring model refined based on frontline input.

- Select 2-3 reps for 2-week pilot test
- Brief pilot reps on scoring methodology and how to interpret scores
- Collect daily feedback on lead quality at different score ranges
- Track pilot reps' conversion rates on PQLs vs. non-PQLs
- Document refinements needed based on pilot learnings

---

### Part 6: Rollout & Enablement

#### Step 1: Train Sales and Marketing Teams

**Step Overview:** Enable all teams to understand the scoring model and how to use lead scores effectively. End state: Teams trained on interpreting scores, with documentation for ongoing reference.

- Develop training deck explaining fit vs. behavioral scoring, PQL definition, and score interpretation
- Conduct live training session (45-60 min) for Sales, Marketing, and RevOps
- Walk through example PQL profiles and recommended outreach approaches
- Create one-page quick reference guide for sales reps
- Record training for onboarding new team members

#### Step 2: Launch Scoring Model to Full Team

**Step Overview:** Go live with the scoring model across all leads and full sales team. End state: Scoring model live in production, all new leads being scored, sales using scores for prioritization.

- Activate scoring for all leads (new and existing)
- Backfill scores for active leads in pipeline
- Enable PQL notifications and workflows for full sales team
- Communicate launch to all stakeholders with links to documentation
- Set up monitoring dashboards to track scoring health

#### Step 3: Document and Hand Off to Client

**Step Overview:** Transfer ownership of the scoring system to client team with complete documentation. End state: Client self-sufficient with admin playbook, tuning guidance, and support contacts.

- Deliver scoring model documentation (all rules, thresholds, decay logic, field mappings)
- Create admin playbook for making scoring adjustments
- Document troubleshooting guide for common issues
- Transfer access credentials and ownership to client RevOps
- Schedule 30-day and 90-day check-in calls for optimization review

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Product analytics tracking user actions in the product (Segment, Amplitude, Mixpanel, or native)
- CRM system in place (Salesforce or HubSpot) with clean lead/contact data
- Defined Ideal Customer Profile (ICP) with documented fit criteria
- Historical conversion data (at least 6 months of closed-won/lost deals for validation)
- API access or integration capability between product analytics and CRM/MAP

**What client must provide:**
- Admin access to CRM/MAP for configuration
- Access to product analytics platform
- List of key product events/milestones that indicate activation
- Sales team input on what makes a lead "sales-ready"
- Decision-maker availability for threshold and criteria approvals

## 5. Common Pitfalls

- **Overweighting demographics vs. product behavior**: Relying too heavily on job title and company size while underweighting actual product usage signals. Product signals are 3-5x more predictive in PLG motions. **Mitigation**: Weight behavioral/product scores at least 2x higher than fit scores; validate against conversion data.

- **Static scoring model without decay**: Letting scores accumulate without time-based decay leads to inflated scores for inactive leads. A whitepaper download from 6 months ago shouldn't equal a product login yesterday. **Mitigation**: Implement 30-day decay rules and recency bonuses; review score distribution monthly.

- **Sales and Marketing misalignment on PQL definition**: If Sales thinks the PQL threshold is too low and they're getting junk leads, they'll stop trusting the system. **Mitigation**: Involve Sales in threshold definition, run pilot with feedback loop, adjust threshold based on actual conversion data.

- **Ignoring negative scoring signals**: Only scoring positive behaviors while ignoring disqualifying signals (careers page visits, competitor domains, unsubscribes) leads to false positives. **Mitigation**: Build negative scoring rules for bad-fit indicators and engagement decline.

## 6. Success Metrics

- **Leading Indicator**: PQL-to-opportunity conversion rate within first 30 days post-launch (target: 2-3x higher than non-PQL conversion rate); sales rep feedback on lead quality improvement

- **Lagging Indicator**: Overall trial-to-paid conversion rate increase (target: 15-25% improvement within 90 days); reduction in average sales cycle length for PQL-sourced deals; increase in revenue per sales rep due to better prioritization

---

