# PLG GTM Design - Playbook

## 1. Definition

**What it is**: A strategic and technical implementation project that designs and builds a complete Product-Led Growth go-to-market motion, including customer journey mapping, system architecture, pricing/billing integration, and cross-functional alignment to enable self-serve acquisition that feeds into sales-led expansion.

**What it is NOT**: Not a product development project (building features). Not a simple free trial setup (that's a feature, not a GTM motion). Not a CRM implementation alone (PLG requires end-to-end system integration). Not a marketing automation project (though marketing alignment is a component).

## 2. ICP Value Proposition

**Pain it solves**: Company wants to add a PLG motion but has no architecture for how product users become leads, how usage data flows to sales, how billing handles both self-serve and enterprise, or how CS/Support scales across customer tiers. Current systems are designed for sales-led only and cannot support a hybrid motion.

**Outcome delivered**: Complete PLG GTM design with mapped customer journeys, system architecture, pricing/billing integration plan, and cross-functional alignment across Marketing, Sales, CS, Product, Engineering, and Finance. Clear handoff triggers from self-serve to sales-assisted. Unified data model connecting product usage to CRM records.

**Who owns it**: VP of Revenue Operations or Chief Revenue Officer, with heavy involvement from VP Product and VP Finance.

## 3. Implementation Procedure

### Part 1: Discovery & Growth Model Alignment

#### Step 1: Conduct Stakeholder Discovery Sessions

**Step Overview:** Meet with key stakeholders across GTM functions to understand current state, pain points, and PLG objectives. End state: Documented stakeholder requirements and success criteria for PLG motion.

- Schedule 1:1 discovery calls with VP Sales, VP Marketing, VP Product, VP CS, and Finance lead
- Document current GTM motion (fully sales-led vs. any existing self-serve elements)
- Capture specific pain points each function faces with current motion
- Identify existing tools and systems in play across all functions
- Align on PLG objectives: is this additive (new segment) or transformational (shift primary motion)?
- Document constraints (budget, timeline, engineering capacity)

#### Step 2: Analyze Market and TAM for PLG Fit

**Step Overview:** Validate that PLG is appropriate for target market segments and identify which customer profiles are best suited for self-serve. End state: PLG market map identifying target segments and expected behavior patterns.

- Review ICP documentation and segment by company size/complexity
- Identify which segments have low-touch buying behavior (SMB vs. enterprise)
- Research competitor PLG motions in the space for benchmarking
- Map expected user personas who would enter via PLG (end users vs. buyers)
- Document segment-specific requirements (e.g., SMB self-serve, Mid-market hybrid, Enterprise sales-led)

#### Step 3: Finalize Growth Model PLG Targets

**Step Overview:** Establish specific KPIs and targets for the PLG motion aligned to overall company growth model. End state: Documented PLG targets integrated into growth model with clear metrics definitions.

- Review existing growth model and EOY bookings targets
- Define PLG-specific metrics: sign-up volume, activation rate, free-to-paid conversion, PQL volume
- Set targets for each metric based on market sizing and benchmarks (3-5% free-to-paid is best-in-class)
- Align Product team on what "activation" means (specific feature usage thresholds)
- Define Net Revenue Retention (NRR) targets for PLG cohorts (aim for 120%+)
- Document how PLG metrics roll up to overall bookings targets

---

### Part 2: Pricing Strategy & Freemium Design

#### Step 1: Define Pricing Model Structure

**Step Overview:** Design the pricing architecture including free tier, paid tiers, and enterprise pricing relationship. End state: Documented pricing model with clear tier definitions and upgrade paths.

- Evaluate freemium vs. free trial vs. hybrid approach based on product complexity
- Define free tier value proposition (enough to hook, not enough to fully satisfy)
- Design paid tier structure (1-3 self-serve tiers is optimal)
- Document feature gates between tiers (what triggers upgrade consideration)
- Define relationship between PLG pricing and enterprise agreement pricing
- Identify any cannibalization risks between PLG and existing sales-led deals

#### Step 2: Map Upgrade Triggers and Expansion Paths

**Step Overview:** Define specific usage patterns and behaviors that indicate upgrade readiness. End state: Documented PQL criteria and expansion trigger definitions ready for implementation.

- Define Product Qualified Lead (PQL) criteria based on usage thresholds
- Map user behaviors that correlate with upgrade intent (seats added, features tried, usage frequency)
- Design expansion triggers for sales outreach (e.g., team size > X, feature limit hit)
- Define hand-off timing from self-serve to sales-assisted
- Document upsell paths (same user upgrading) vs. expansion paths (new users in same account)
- Align Sales on when to engage vs. when to let self-serve continue

#### Step 3: Finalize Pricing Implementation Requirements

**Step Overview:** Document technical and operational requirements for pricing implementation. End state: Requirements document ready for billing system implementation.

- Document pricing display requirements (public pricing page, in-app pricing)
- Define billing frequency options (monthly, annual, usage-based components)
- Identify discount and promotion capabilities needed
- Document enterprise agreement exceptions and override requirements
- Define revenue recognition requirements with Finance
- Identify ERP integration requirements for revenue reporting

---

### Part 3: Customer Journey Mapping

#### Step 1: Map Pre-Acquisition Journey

**Step Overview:** Document all touchpoints and paths a user takes before signing up for the product. End state: Pre-acquisition journey map with channel attribution points.

- Identify all acquisition channels (organic, paid, referral, product viral loops)
- Map website conversion paths to sign-up
- Document trial/freemium sign-up flow and required information
- Define attribution tracking requirements for each channel
- Map content touchpoints that support awareness and consideration
- Document competitive evaluation stage if applicable

#### Step 2: Map Onboarding and Activation Journey

**Step Overview:** Design the complete onboarding experience from sign-up to activation milestone. End state: Onboarding journey with activation gates and drop-off intervention points.

- Define the critical "aha moment" that indicates activation
- Map steps from sign-up to activation (aim for minutes/hours, not days)
- Identify onboarding friction points and required improvements
- Design intervention triggers for users who stall (emails, in-app prompts)
- Document onboarding variations by user persona if needed
- Define success criteria for onboarding complete

#### Step 3: Map Conversion and Expansion Journey

**Step Overview:** Document the journey from free user to paying customer and subsequent expansion. End state: Conversion and expansion journey with clear handoff points to sales.

- Map free-to-paid conversion triggers and prompts
- Design upgrade flow (in-app, checkout, sales-assisted options)
- Document expansion journey (adding seats, upgrading tiers)
- Define when sales involvement begins (PQL threshold, deal size, enterprise signals)
- Map hand-off process from product to sales
- Document post-conversion journey including renewal touchpoints

#### Step 4: Map Decision Trees and Outcomes

**Step Overview:** Document all possible user decisions and outcomes throughout the journey. End state: Comprehensive decision tree covering all user paths.

- Map all decision points where users choose a path (upgrade, stay free, churn)
- Document outcomes for each decision (what happens next in system)
- Identify churned user re-engagement paths
- Define dormant user reactivation triggers
- Map failed payment and recovery flows
- Document account deletion/downgrade processes

---

### Part 4: System & Data Architecture Design

#### Step 1: Audit Current System Landscape

**Step Overview:** Document all existing systems and their capabilities relevant to PLG motion. End state: Current state system map with identified gaps.

- Inventory all current GTM systems (CRM, marketing automation, CS platform)
- Document current data flows between systems
- Identify gaps in current stack for PLG requirements (product analytics, usage tracking)
- Assess CRM readiness for PLG records (can it handle high-volume, low-touch leads?)
- Evaluate billing system capabilities for self-serve transactions
- Document integration limitations and technical debt

#### Step 2: Design Target System Architecture

**Step Overview:** Create the target state architecture for PLG motion with all required systems and integrations. End state: System architecture diagram with integration requirements.

- Define product analytics/usage tracking solution (Amplitude, Mixpanel, Heap)
- Design usage data pipeline from product to CRM/data warehouse
- Map PQL scoring model and where it lives (CRM, separate tool)
- Define reverse ETL requirements for syncing enriched data to tools
- Design self-serve billing integration (Stripe, Chargebee, Recurly)
- Document required CRM customizations for PLG records and workflows

#### Step 3: Map Data Model and Object Relationships

**Step Overview:** Define how PLG data objects relate to existing CRM data model. End state: Data model documentation showing object relationships.

- Define PLG-specific objects (Product Users, Usage Events, PQLs)
- Map relationship between Product Users and CRM Contacts/Leads
- Design account hierarchy for PLG (self-serve accounts vs. enterprise accounts)
- Define data matching and deduplication rules
- Document field mappings from product to CRM
- Design unified person/account model across systems

#### Step 4: Define Data Governance and Definitions

**Step Overview:** Establish standardized definitions for all PLG metrics and data elements. End state: Data dictionary with agreed definitions across all teams.

- Define MQL, SQL, PQL criteria and document formally
- Create activation definition with specific thresholds
- Define conversion event and timestamp
- Document expansion and churn definitions
- Align all teams on metric calculations
- Create data dictionary and distribute to teams

---

### Part 5: CS, Support & Billing Operations Design

#### Step 1: Design Tiered Support Model

**Step Overview:** Create support structure that scales across free users, self-serve paid, and enterprise. End state: Tiered support model with SLAs and staffing requirements.

- Define support tiers by customer type (free, self-serve paid, enterprise)
- Set SLA expectations for each tier (response time, resolution time)
- Design self-serve support resources (knowledge base, chatbot, community)
- Define escalation paths from self-serve to human support
- Identify staffing requirements for anticipated volume
- Document support tooling requirements (Zendesk, Intercom, Front)

#### Step 2: Design CS Engagement Model

**Step Overview:** Create customer success model for PLG customers with clear engagement triggers. End state: CS engagement model with automation and human touchpoints defined.

- Define CS-touch vs. tech-touch segments based on customer value
- Design automated success plays (onboarding emails, usage prompts)
- Define human CS engagement triggers (high-value accounts, churn risk)
- Map hand-off points from CS to Sales for expansion opportunities
- Design health scoring model for PLG customers
- Document CS tooling requirements (Gainsight, ChurnZero, Vitally)

#### Step 3: Design Billing Operations Model

**Step Overview:** Create billing operations structure to handle both self-serve and enterprise billing. End state: Billing operations model with processes and system requirements.

- Define billing operations ownership (Finance vs. RevOps vs. shared)
- Design self-serve billing flows (upgrades, downgrades, cancellations)
- Map enterprise billing exceptions and manual processes
- Define dunning and failed payment recovery processes
- Document revenue recognition requirements and processes
- Design billing data sync to ERP and financial systems
- Identify audit and compliance requirements

---

### Part 6: Cross-Functional Alignment & Feedback

#### Step 1: Conduct Marketing Alignment Workshop

**Step Overview:** Align Marketing team on PLG motion requirements including attribution, reporting, and campaign integration. End state: Documented Marketing alignment on PLG motion.

- Present PLG customer journey and Marketing touchpoints
- Align on attribution model for PLG acquisitions
- Define Marketing's role in PQL nurturing vs. sales handoff
- Design cross-sell/upsell campaign integration with product usage data
- Agree on reporting and dashboards Marketing needs
- Document Marketing system integration requirements

#### Step 2: Conduct Sales Alignment Workshop

**Step Overview:** Align Sales team on PLG motion including lead handoff, territory, and compensation implications. End state: Documented Sales alignment on PLG motion.

- Present PLG customer journey and Sales engagement points
- Define PQL handoff criteria and process
- Address territory and account assignment for PLG accounts
- Discuss compensation implications for PLG-sourced deals
- Align on sales tools and data access requirements
- Document concerns and required process changes

#### Step 3: Conduct Product/Engineering Alignment Workshop

**Step Overview:** Align Product and Engineering on technical requirements and data integration. End state: Documented technical requirements and engineering commitments.

- Present system architecture and integration requirements
- Review data pipeline requirements from product to GTM systems
- Align on product instrumentation needs (event tracking, usage data)
- Discuss billing integration technical requirements
- Define Engineering capacity allocation for GTM integrations
- Document technical dependencies and timeline

#### Step 4: Conduct Finance Alignment Workshop

**Step Overview:** Align Finance on pricing, billing, and revenue recognition requirements. End state: Documented Finance alignment and compliance requirements.

- Present pricing model and billing operations design
- Review revenue recognition requirements for self-serve vs. enterprise
- Align on ERP integration requirements
- Discuss audit and compliance considerations
- Define Finance reporting requirements
- Document Finance approval requirements for pricing changes

#### Step 5: Synthesize Feedback and Finalize Design

**Step Overview:** Incorporate feedback from all stakeholder workshops into final design. End state: Finalized PLG GTM design document with all stakeholder sign-off.

- Compile feedback from all alignment workshops
- Identify conflicts and propose resolutions
- Update customer journey maps based on feedback
- Update system architecture based on technical feedback
- Update pricing model based on Finance feedback
- Obtain final sign-off from all stakeholders

---

### Part 7: Implementation Execution

#### Step 1: Implement Customer Journey Systems

**Step Overview:** Build and configure systems to support the designed customer journey. End state: Customer-facing journey systems live and tested.

- Configure marketing automation for PLG nurture flows
- Set up product analytics and event tracking
- Implement onboarding automation sequences
- Configure PQL scoring and routing in CRM
- Build expansion trigger automations
- Test end-to-end journey flows with test accounts

#### Step 2: Implement System and Data Integrations

**Step Overview:** Build data pipelines and integrations between product, CRM, and GTM systems. End state: Data flowing between systems with quality validated.

- Configure usage data sync from product to data warehouse
- Set up reverse ETL to CRM and marketing tools
- Implement identity resolution and data matching
- Build PQL scoring model and deploy
- Configure CRM fields, objects, and workflows
- Validate data quality and sync reliability

#### Step 3: Implement Pricing and Billing Systems

**Step Overview:** Configure billing systems for self-serve and enterprise hybrid model. End state: Billing system live and processing test transactions.

- Configure billing platform (Stripe, Chargebee) with pricing tiers
- Implement upgrade/downgrade flows in product
- Set up billing data sync to CRM
- Configure ERP integration for revenue recognition
- Implement dunning and payment recovery flows
- Test end-to-end billing scenarios

#### Step 4: Implement Reporting and Dashboards

**Step Overview:** Build reporting infrastructure for PLG metrics and visibility. End state: Dashboards live for all stakeholder teams.

- Build PLG funnel dashboard (sign-ups, activation, conversion, expansion)
- Create PQL pipeline reporting for Sales
- Build usage and health dashboards for CS
- Configure attribution reporting for Marketing
- Create executive dashboard with key PLG metrics
- Set up automated reporting cadence

---

### Part 8: Training, Enablement & Optimization

#### Step 1: Create Training Documentation

**Step Overview:** Develop comprehensive documentation for all teams on new PLG processes and systems. End state: Complete documentation package ready for training delivery.

- Document PLG customer journey for all teams
- Create CRM and system user guides
- Build process runbooks for each function
- Document escalation paths and edge cases
- Create FAQ document based on stakeholder questions
- Develop quick-reference guides for daily use

#### Step 2: Conduct Team Training Sessions

**Step Overview:** Train each GTM function on their role in the PLG motion with hands-on workshops. End state: All teams trained and confident in new processes.

- Schedule dedicated training sessions for each team
- Deliver Marketing training: attribution, PQL nurturing, campaign integration
- Deliver Sales training: PQL handoff, account engagement, compensation
- Deliver CS training: health scoring, engagement triggers, expansion handoffs
- Deliver RevOps/Ops training: system administration, reporting, troubleshooting
- Record sessions for future onboarding

#### Step 3: Launch and Monitor

**Step Overview:** Execute go-live and monitor for issues during initial launch period. End state: PLG motion live with active monitoring and rapid issue resolution.

- Define go-live checklist and success criteria
- Execute phased rollout (internal testing, limited pilot, full launch)
- Set up monitoring for system health and data quality
- Establish war room for first 2 weeks post-launch
- Track early metrics against targets
- Document and resolve issues in real-time

#### Step 4: Iterate and Optimize

**Step Overview:** Analyze initial results and continuously optimize the PLG motion. End state: Optimization roadmap with prioritized improvements.

- Review metrics after 30, 60, 90 days
- Identify conversion funnel drop-off points
- Gather user feedback on onboarding and upgrade experience
- Analyze PQL-to-close conversion and refine scoring model
- Identify system or process bottlenecks
- Prioritize optimization initiatives based on impact
- Establish ongoing optimization cadence

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Company has a product with potential for self-serve usage (not purely enterprise/complex)
- Executive commitment to PLG as a strategic motion (not just an experiment)
- Existing CRM (Salesforce or HubSpot) with stable data foundation
- Product team capacity for analytics instrumentation and billing integration
- Engineering capacity for data pipeline and integration work

**What client must provide:**
- Access to all GTM system admins and documentation
- Product analytics access or ability to instrument
- Finance and legal review capacity for pricing and billing decisions
- Stakeholder availability for discovery and alignment workshops
- Decision-making authority to approve cross-functional changes
- Budget for new tooling if gaps exist (billing, product analytics, etc.)

## 5. Common Pitfalls

- **Pitfall 1**: Treating PLG as a marketing project rather than a cross-functional GTM transformation. --> **Mitigation**: Involve Product, Engineering, Finance, and Sales from Day 1, not just Marketing and RevOps.

- **Pitfall 2**: Unclear handoff between self-serve and sales-assisted creates friction and lost deals. --> **Mitigation**: Define explicit PQL criteria and handoff triggers with Sales buy-in before implementation.

- **Pitfall 3**: Billing system cannot handle hybrid self-serve + enterprise model, causing revenue recognition issues. --> **Mitigation**: Conduct billing system assessment early and involve Finance in pricing design from the start.

- **Pitfall 4**: Product usage data doesn't flow reliably to CRM, leaving Sales blind to engagement signals. --> **Mitigation**: Validate data pipeline architecture and quality before building downstream automations.

- **Pitfall 5**: Teams operate on different metric definitions (MQL vs. PQL vs. SQL), creating confusion and misaligned incentives. --> **Mitigation**: Establish formal data dictionary with all teams before implementation and enforce through RevOps governance.

## 6. Success Metrics

- **Leading Indicator**: PQL volume and activation rate within first 30 days of launch (are users signing up and reaching activation milestone?)
- **Lagging Indicator**: Free-to-paid conversion rate and PLG-sourced bookings at 90 days (is the motion generating revenue?)

---

