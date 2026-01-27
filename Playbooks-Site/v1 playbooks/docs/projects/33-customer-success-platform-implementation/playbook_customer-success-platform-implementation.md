# Customer Success Platform Implementation - Playbook

## 1. Definition

**What it is**: A strategic and technical project that deploys a dedicated customer success platform (Gainsight, ChurnZero, Vitally, Totango, Planhat, or Catalyst) to provide CSMs with a centralized hub for customer health visibility, automated engagement workflows, and proactive churn prevention capabilities.

**What it is NOT**: Not a CRM implementation (Salesforce/HubSpot are prerequisites, not the deliverable). Not Customer Support Ticketing (Zendesk, Intercom). Not Product Analytics implementation (Amplitude, Pendo). Not NPS/Survey tool deployment alone. Not Customer Data Platform (CDP) implementation.

## 2. ICP Value Proposition

**Pain it solves**: CS teams are flying blind with customer data scattered across CRM, support tickets, product usage, and billing systems. CSMs manually track renewals in spreadsheets, react to churn signals too late, and lack visibility into customer health. No automated playbooks means inconsistent customer experience and missed expansion opportunities.

**Outcome delivered**: Single source of truth for customer health with automated health scoring, proactive churn alerts, and triggered playbooks for key customer lifecycle moments. CSMs spend time on high-value activities instead of data hunting. Leadership gains visibility into portfolio risk and expansion pipeline.

**Who owns it**: VP of Customer Success, Chief Customer Officer, or Head of CS Operations. RevOps often sponsors the technical implementation.

## 3. Implementation Procedure

### Part 1: Discovery & Platform Selection

#### Step 1: Assess Current CS Operations State

**Step Overview:** Evaluate how CS currently operates including tools, processes, and data sources to establish baseline and identify gaps. End state: Documented current state with clear gap analysis showing what the CSP needs to solve.

- Interview CS leadership and 2-3 CSMs on current workflows and pain points
- Inventory existing tools: CRM, support ticketing, product analytics, billing system
- Document where customer data currently lives and how it flows between systems
- Assess current health scoring approach (if any) and renewal tracking process
- Quantify the gap: time spent on manual data aggregation, renewal surprises, churn rate
- Identify integration requirements (what systems must connect to CSP)

#### Step 2: Define Success Criteria and Platform Requirements

**Step Overview:** Establish clear objectives for the CSP implementation and translate into platform requirements. End state: Documented requirements matrix with weighted priorities agreed by stakeholders.

- Define 3-5 primary objectives (reduce churn, improve NRR, scale CS operations, etc.)
- Identify must-have features vs nice-to-have based on CS maturity level
- Document integration requirements (Salesforce/HubSpot, Zendesk, product analytics)
- Determine user count and licensing needs across CS team
- Set budget parameters with finance/leadership approval
- Create weighted scoring criteria for platform evaluation

#### Step 3: Evaluate and Select Platform

**Step Overview:** Compare shortlisted platforms against requirements and select the best fit for the organization. End state: Platform selected with budget approved and procurement initiated.

- Create shortlist of 2-3 platforms based on requirements (Gainsight, ChurnZero, Vitally, etc.)
- Schedule demos with each vendor focusing on specific use cases
- Evaluate platforms on: integration depth, implementation complexity, admin requirements
- Assess fit to maturity level: ChurnZero for mid-market speed, Gainsight for enterprise complexity
- Check references from similar-sized companies in similar industries
- Present recommendation to stakeholders with pros/cons and TCO analysis
- Initiate procurement and contracting process

---

### Part 2: Data Architecture & Integration Setup

#### Step 1: Map Customer Data Model

**Step Overview:** Design how customer data will flow into and be structured within the CSP, including account hierarchy and key data objects. End state: Documented data model with field mappings from source systems to CSP.

- Define account hierarchy structure (parent/child relationships, segments)
- Map required fields from CRM: account, contact, opportunity, ARR/MRR data
- Identify product usage data points needed from analytics platform
- Document support ticket data to import (volume, categories, CSAT scores)
- Map billing/subscription data: contract dates, renewal dates, expansion history
- Create field mapping document showing source system → CSP field mappings

#### Step 2: Configure CRM Integration

**Step Overview:** Establish the primary bidirectional integration between CRM (Salesforce/HubSpot) and the CSP. End state: CRM connected with account, contact, and opportunity data syncing correctly.

- Install CSP managed package or app in Salesforce/HubSpot
- Configure OAuth connection with appropriate API permissions
- Set up account sync with correct hierarchy and segmentation fields
- Configure contact sync with role/persona fields for stakeholder mapping
- Enable opportunity/deal sync for expansion revenue visibility
- Set sync frequency (real-time vs scheduled) based on requirements
- Verify data sync in CSP dashboard with sample accounts

#### Step 3: Connect Additional Data Sources

**Step Overview:** Integrate product usage, support, and billing systems to create comprehensive customer view. End state: All required data sources connected and syncing to CSP.

- Configure product analytics integration (Amplitude, Pendo, Mixpanel)
- Set up support ticketing integration (Zendesk, Intercom, Freshdesk)
- Connect billing/subscription system (Stripe, Chargebee, Zuora)
- Configure any custom integrations via API or middleware (Workato, Tray.io)
- Set up data refresh schedules for each integration
- Validate data quality across all connected sources
- Document integration architecture and troubleshooting guide

---

### Part 3: Health Scoring & Automation Configuration

#### Step 1: Design Customer Health Score Model

**Step Overview:** Build a multi-factor health scoring model that predicts churn risk and identifies expansion opportunities. End state: Health score formula configured and calculating across customer base.

- Define health score components: product usage, engagement, support sentiment, payment history
- Weight each component based on correlation with retention/churn
- Set thresholds for healthy (green), at-risk (yellow), and critical (red) scores
- Configure scoring rules for each component (e.g., login frequency, feature adoption)
- Build trend indicators to show health trajectory over time
- Test scoring model against known churned accounts to validate accuracy
- Document scoring methodology for CS team understanding

#### Step 2: Configure Customer Segments and Lifecycle Stages

**Step Overview:** Set up customer segmentation by tier, lifecycle stage, and other relevant dimensions. End state: Customers automatically segmented with appropriate service levels and lifecycle stages assigned.

- Define customer segments by ARR tier, industry, or use case
- Create lifecycle stage definitions: Onboarding, Adoption, Growth, Renewal, At-Risk
- Configure automatic lifecycle stage progression rules
- Set up segment-specific views and dashboards for CSMs
- Assign CSM territories/portfolios within the platform
- Configure workload balancing visibility across CS team

#### Step 3: Build Automated Playbooks and CTAs

**Step Overview:** Create automated workflows (playbooks) that trigger based on customer signals and lifecycle events. End state: Core playbooks active and generating CTAs for CSMs.

- Design onboarding playbook with milestone-based tasks and touchpoints
- Build at-risk intervention playbook triggered by health score drops
- Create renewal playbook starting 90-120 days before contract end
- Configure expansion opportunity playbook based on usage signals
- Set up automated email sequences for low-touch digital CS motions
- Define CTA (Call to Action) types and priority levels
- Test playbook triggers with sample scenarios before going live

---

### Part 4: Dashboards, Reporting & Views

#### Step 1: Build CSM Operational Dashboards

**Step Overview:** Create dashboards that give CSMs visibility into their portfolio health and daily priorities. End state: CSM-level dashboards deployed showing portfolio overview and task prioritization.

- Design portfolio health overview dashboard (accounts by health status)
- Build daily priority view: upcoming renewals, at-risk accounts, overdue CTAs
- Create account 360 view with unified timeline of all touchpoints
- Configure customer journey visualization for lifecycle tracking
- Set up CTA/task management views with filtering and sorting
- Enable CSM-specific filters to show only their assigned accounts

#### Step 2: Configure Leadership and Executive Reporting

**Step Overview:** Build executive dashboards showing aggregate CS metrics and team performance. End state: Leadership dashboards providing visibility into churn risk, NRR, and CS team productivity.

- Design executive summary dashboard: portfolio health distribution, ARR at risk
- Build renewal forecast report showing expected vs actual renewal rates
- Create NRR tracking dashboard with expansion and contraction visibility
- Configure CSM productivity metrics: accounts per CSM, CTA completion rates
- Set up cohort analysis for retention trends over time
- Enable scheduled report delivery to leadership stakeholders

---

### Part 5: Pilot & Validation

#### Step 1: Conduct Pilot with Selected CSMs

**Step Overview:** Run a controlled pilot with a subset of CSMs to validate configuration and gather feedback before full rollout. End state: Pilot complete with documented learnings and configuration adjustments made.

- Select 2-4 CSMs for pilot group representing different segments/tiers
- Provide focused training on core workflows: health monitoring, CTAs, account views
- Run pilot for 2-3 weeks with regular check-ins
- Collect feedback on usability, data accuracy, and workflow fit
- Identify configuration issues: incorrect health scores, missing data, broken automations
- Document required adjustments and prioritize fixes
- Refine playbooks and scoring based on pilot learnings

#### Step 2: Validate Data Quality and Integrations

**Step Overview:** Perform systematic data quality validation across all integrated systems and health score calculations. End state: Data quality issues resolved, integrations stable, health scores validated.

- Audit sample accounts for data completeness across all sources
- Validate health scores against known customer status (churned, renewed, expanded)
- Test CTA triggers and automation rules with controlled scenarios
- Verify sync timing and data freshness across integrations
- Document and resolve any data discrepancies or integration gaps
- Sign off on data quality with CS leadership before full rollout

---

### Part 6: Rollout & Enablement

#### Step 1: Conduct Full Team Training

**Step Overview:** Train the entire CS team on the platform with role-specific focus on daily workflows and processes. End state: All CSMs trained and confident using the platform for daily work.

- Schedule comprehensive training sessions (2-3 hours across multiple sessions)
- Cover core workflows: navigating accounts, managing CTAs, using playbooks
- Train on health score interpretation and when to take action
- Demonstrate dashboard usage and report generation
- Provide hands-on exercises with real accounts
- Create quick-reference guides and video recordings for ongoing reference
- Set up office hours or support channel for post-training questions

#### Step 2: Launch Full Team Rollout

**Step Overview:** Go live with the full CS team with monitoring and rapid response to issues. End state: Platform live in production with all CSMs actively using it.

- Communicate go-live date and expectations to full CS team
- Disable or archive legacy tracking systems (spreadsheets, manual processes)
- Monitor platform usage and adoption metrics during first 2 weeks
- Hold daily standups during first week to address issues quickly
- Track and resolve any bugs or data issues immediately
- Celebrate quick wins and share success stories to drive adoption

#### Step 3: Conduct Admin and Operations Handoff

**Step Overview:** Transfer platform ownership and administration responsibilities to client CS Operations team. End state: Client self-sufficient with admin capabilities and documented runbooks.

- Transfer admin credentials and access to client CS Ops team
- Deliver documentation package: configuration settings, integration architecture, troubleshooting guide
- Train CS Ops admin on: user management, reporting updates, playbook modifications
- Document common maintenance tasks and how to perform them
- Provide escalation path for vendor support issues
- Schedule 30-day and 60-day check-in calls for post-launch support

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Active CRM (Salesforce or HubSpot) with clean account and contact data
- Customer segmentation strategy defined (tiers, lifecycle stages)
- Product analytics tool with usage data being captured (Amplitude, Pendo, Mixpanel)
- Clear understanding of customer journey and key lifecycle milestones
- Budget approval for platform licensing (typically $15K-$100K+ annually)
- Executive sponsor committed to driving CS team adoption

**What client must provide:**
- CRM admin access for integration setup
- Product analytics admin access for usage data integration
- Support ticketing system admin access (Zendesk, Intercom)
- Billing/subscription system admin access
- List of CSMs and their account assignments/territories
- Historical customer data: renewal dates, churn history, expansion history
- Decision on health score components and initial weighting

## 5. Common Pitfalls

- **Pitfall 1: Choosing features over outcomes** - Selecting platform based on feature checklist rather than fit to CS maturity and actual use cases. → **Mitigation**: Define 3-5 concrete objectives first, then evaluate platforms on ability to achieve those specific outcomes. Reference check with similar-sized companies.

- **Pitfall 2: Underestimating implementation complexity** - Assuming platform will be "plug and play" when enterprise platforms like Gainsight require significant configuration and often dedicated admin post-implementation. → **Mitigation**: Assess internal technical resources honestly. If no dedicated CS Ops person, prioritize platforms with faster implementation (ChurnZero, Vitally) or budget for implementation consultants.

- **Pitfall 3: Launching with inaccurate health scores** - Going live before validating that health scores correlate with actual customer outcomes, leading to CSM distrust of the system. → **Mitigation**: Test scoring model against historical churned/renewed accounts during pilot. Iterate on weights and thresholds before full rollout. Start with simpler model and refine over time.

- **Pitfall 4: Integration gaps discovered late** - Finding out during implementation that integrations don't work as described in sales demos, especially for custom or less common tools. → **Mitigation**: Validate integration capabilities during evaluation with actual technical tests, not just vendor claims. Document integration requirements in contract with SLAs.

## 6. Success Metrics

- **Leading Indicator**: CSM daily active usage rate above 80% within 30 days of rollout; health scores correlating with known at-risk accounts; CTAs being completed on time
- **Lagging Indicator**: Reduction in gross churn rate by 10-20% within 6 months; improvement in Net Revenue Retention (NRR); reduction in renewal surprises (renewals flagged at-risk 90+ days before expiration)

---

