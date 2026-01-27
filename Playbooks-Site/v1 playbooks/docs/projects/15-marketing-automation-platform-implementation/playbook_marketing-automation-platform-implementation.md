# Marketing Automation Platform Implementation/Migration - Playbook

## 1. Definition

**What it is**: A technical implementation project that deploys and configures a marketing automation platform (HubSpot, Marketo, Pardot) from scratch, or migrates an existing platform to a new one while preserving data integrity, workflows, and integrations. The project delivers a fully operational marketing automation system integrated with the CRM and ready for campaign execution.

**What it is NOT**: Not a marketing strategy project (campaign planning, content creation). Not CRM implementation (that's a separate project). Not email template design (though templates are configured as part of the platform setup). Not ongoing campaign management or marketing operations.

## 2. ICP Value Proposition

**Pain it solves**: Marketing teams are running campaigns manually or using a platform that doesn't integrate with their CRM, resulting in leads falling through the cracks, no visibility into campaign performance, and sales receiving unqualified leads without context. Migrations often fail due to data loss, broken workflows, and months of disruption.

**Outcome delivered**: A fully configured marketing automation platform integrated with CRM, with lead scoring models, nurture workflows, and reporting dashboards operational. Marketing can execute campaigns at scale with full visibility into lead behavior and attribution. Sales receives qualified leads with engagement context.

**Who owns it**: VP of Marketing or Marketing Operations Manager, with RevOps providing technical oversight.

## 3. Implementation Procedure

### Part 1: Discovery & Requirements Gathering

#### Step 1: Conduct Stakeholder Discovery Sessions

**Step Overview:** Meet with marketing, sales, and RevOps stakeholders to understand current state, pain points, and requirements for the new platform. End state: Documented requirements from all key stakeholders.

- Schedule and facilitate discovery sessions with VP Marketing, Marketing Ops, Sales Ops, and demand gen leads
- Document current marketing processes (lead capture, nurturing, scoring, handoff to sales)
- Identify must-have integrations (CRM, webinar platform, advertising, analytics)
- Capture reporting requirements and KPIs that must be tracked
- Understand team skill levels and training requirements
- Document pain points with current platform (if migration)

#### Step 2: Audit Current State (Migration Only)

**Step Overview:** Conduct comprehensive audit of existing platform to understand what needs to be migrated and what should be deprecated. End state: Complete inventory of assets, workflows, and data to migrate.

- Export list of all active campaigns, workflows, and automations
- Document all custom fields and their mapping to CRM fields
- Inventory email templates, landing pages, and forms
- Identify active nurture programs and their logic
- Pull lead scoring model configuration and rules
- Document all integrations and API connections
- Assess data quality—identify duplicates, incomplete records, and outdated data

#### Step 3: Define Success Criteria and Project Scope

**Step Overview:** Establish clear success criteria and boundaries for the project. End state: Signed-off scope document with success metrics.

- Define what "done" looks like for this implementation
- Establish go-live criteria and acceptance tests
- Document what is in-scope vs. out-of-scope
- Set timeline milestones and dependencies
- Identify risks and mitigation strategies
- Get stakeholder sign-off on scope document

---

### Part 2: Platform Selection & Planning (New Implementation)

#### Step 1: Evaluate Platform Options

**Step Overview:** Compare marketing automation platforms against client requirements and tech stack compatibility. End state: Platform recommendation with clear rationale.

- Map requirements against platform capabilities (HubSpot, Marketo, Pardot, Eloqua)
- Evaluate CRM integration depth (native vs. connector)
- Assess pricing models (per contact vs. feature-based)
- Review ease of use and team skill requirements
- Compare reporting and attribution capabilities
- Document integration options with existing tech stack
- Create recommendation matrix with pros/cons

#### Step 2: Build Implementation Roadmap

**Step Overview:** Create detailed implementation plan with phases, milestones, and resource requirements. End state: Approved project plan with timeline and responsibilities.

- Break project into phases with clear milestones
- Identify resource requirements (client team, LeanScale team, vendor support)
- Map dependencies between workstreams
- Establish communication cadence and status reporting
- Create risk register with contingency plans
- Build training timeline integrated with implementation
- Get stakeholder approval on roadmap

---

### Part 3: Data Migration & Cleanup

#### Step 1: Design Data Migration Strategy

**Step Overview:** Create mapping document for how data will transfer from legacy system to new platform. End state: Approved data mapping document and migration plan.

- Map all custom fields from legacy system to new platform
- Identify fields that need transformation or consolidation
- Design approach for historical engagement data (what migrates, what doesn't)
- Plan for lead scoring history preservation
- Document how subscription and consent data will transfer
- Create data validation checkpoints
- Define rollback plan if migration fails

#### Step 2: Clean and Prepare Data

**Step Overview:** Clean legacy data before migration to ensure new platform starts with high-quality data. End state: Clean data set ready for migration.

- Remove duplicate records using deduplication rules
- Clean up incomplete records (missing required fields)
- Standardize field values (country names, job titles, etc.)
- Archive or delete outdated records (no engagement in 24+ months)
- Verify email validity using email verification tool
- Document records removed and cleanup decisions made
- Export clean data set for migration

#### Step 3: Execute Data Migration

**Step Overview:** Migrate cleaned data to new platform with validation at each step. End state: All data successfully migrated and verified.

- Import contact/lead records in batches (start with test batch of 1,000)
- Validate field mapping on test batch before full import
- Migrate account/company records
- Import historical activity data where applicable
- Preserve lead scoring history and lifecycle stages
- Run data validation scripts to verify record counts and field population
- Document any records that failed migration for manual review

---

### Part 4: Platform Configuration

#### Step 1: Configure Core Platform Settings

**Step Overview:** Set up foundational platform settings including domain, authentication, and permissions. End state: Platform core settings configured and ready for building.

- Configure email sending domain with SPF, DKIM, and DMARC
- Set up tracking domain for link tracking
- Configure user roles and permissions
- Set up teams and business units if applicable
- Configure default timezone and locale settings
- Enable GDPR/privacy compliance settings
- Set up IP warming schedule if new sending domain

#### Step 2: Build Lead Scoring Model

**Step Overview:** Implement lead scoring model based on client's qualification criteria and buying signals. End state: Lead scoring model active and scoring leads.

- Define demographic/firmographic scoring criteria (title, company size, industry)
- Map behavioral scoring actions (email opens, form fills, page visits, content downloads)
- Implement negative scoring for disqualifying factors (competitor, student, invalid email)
- Configure score thresholds for MQL and sales readiness
- Set up score degradation for aging leads
- Build scoring dashboard for visibility
- Test scoring with sample records to validate logic

#### Step 3: Configure Lead Lifecycle Stages

**Step Overview:** Set up lifecycle stages that track lead progression from first touch to customer. End state: Lifecycle stages configured and syncing with CRM.

- Define lifecycle stages (Subscriber, Lead, MQL, SQL, Opportunity, Customer)
- Configure stage transition rules (manual vs. automated)
- Map lifecycle stages to CRM fields and sync settings
- Set up lifecycle stage reporting
- Configure SLA alerts for stage transitions (e.g., MQL not contacted in 24 hours)
- Test stage progressions with sample records

#### Step 4: Set Up CRM Integration

**Step Overview:** Configure bidirectional sync between marketing automation platform and CRM. End state: Real-time data sync operational between platforms.

- Enable CRM integration (Salesforce, HubSpot CRM, etc.)
- Map fields between platforms (lead fields, account fields, opportunity fields)
- Configure sync direction for each field (MA→CRM, CRM→MA, bidirectional)
- Set up selective sync rules (which records sync, which don't)
- Configure campaign/list sync for attribution
- Test sync with sample records both directions
- Document field mapping and sync rules

---

### Part 5: Build Marketing Assets & Automation

#### Step 1: Create Email Templates

**Step Overview:** Build brand-compliant email templates for campaigns, nurtures, and transactional sends. End state: Template library ready for campaign use.

- Build master template with brand styling (header, footer, colors, fonts)
- Create nurture email template with dynamic content blocks
- Build promotional/campaign template
- Create transactional template (confirmations, notifications)
- Configure personalization tokens and fallback values
- Test templates across email clients (Gmail, Outlook, Apple Mail, mobile)
- Document template usage guidelines for marketing team

#### Step 2: Build Landing Pages and Forms

**Step Overview:** Create landing page templates and forms for lead capture. End state: Form and landing page library ready for campaigns.

- Build landing page template with brand styling
- Create forms for key conversion points (demo request, content download, newsletter)
- Configure progressive profiling to gather data over time
- Set up form prefill settings for known visitors
- Implement hidden fields for UTM capture and attribution
- Configure thank-you pages and redirect logic
- Test form submissions end-to-end including CRM sync

#### Step 3: Build Core Nurture Programs

**Step Overview:** Recreate or build new nurture workflows based on client's buyer journey. End state: Key nurture programs active and enrolling leads.

- Map client's buyer journey stages to nurture tracks
- Build awareness-stage nurture (educational content)
- Build consideration-stage nurture (product/solution focused)
- Configure enrollment triggers and exit criteria
- Set up branch logic for personalized paths
- Implement goal-based exits (demo booked, opportunity created)
- Test nurture flows with sample records through all branches

#### Step 4: Configure Lead Routing & Handoff

**Step Overview:** Set up automated lead routing to sales based on territory, round-robin, or account ownership. End state: Leads routing correctly to sales with notifications.

- Configure lead assignment rules (territory, round-robin, named accounts)
- Set up MQL notification workflow to alert sales
- Configure lead handoff SLA monitoring
- Build lead-to-account matching logic
- Set up alerts for high-intent behaviors (pricing page, demo request)
- Integrate with sales engagement platform if applicable (Outreach, Salesloft)
- Test routing scenarios end-to-end

---

### Part 6: Reporting & Analytics Setup

#### Step 1: Build Core Dashboards

**Step Overview:** Create dashboards for marketing and sales visibility into funnel performance. End state: Dashboards live with key metrics visible.

- Build marketing performance dashboard (leads, MQLs, conversion rates)
- Create campaign attribution dashboard
- Build email performance dashboard (opens, clicks, unsubscribes)
- Create lead funnel dashboard (volume by stage, conversion rates)
- Set up SLA monitoring dashboard (response times, aging leads)
- Configure dashboard access and sharing settings

#### Step 2: Configure Attribution Reporting

**Step Overview:** Set up multi-touch attribution to track marketing's impact on pipeline and revenue. End state: Attribution reporting operational.

- Select attribution model (first-touch, last-touch, multi-touch, W-shaped)
- Configure campaign tracking and UTM parameter capture
- Set up attribution reports by channel, campaign, and content
- Integrate with CRM opportunity data for pipeline attribution
- Build revenue attribution dashboard
- Document attribution methodology for stakeholder alignment

---

### Part 7: Testing & Quality Assurance

#### Step 1: Conduct System Testing

**Step Overview:** Test all platform components individually to verify functionality. End state: All components validated and working correctly.

- Test email deliverability using seed list
- Validate form submissions create leads correctly
- Test lead scoring calculations with sample scenarios
- Verify lifecycle stage progressions
- Test CRM sync in both directions
- Validate nurture enrollment and email sends
- Test lead routing to correct owners
- Document any issues found and track to resolution

#### Step 2: Conduct End-to-End Testing

**Step Overview:** Test complete lead journey from first touch through MQL handoff to sales. End state: Full lead journey validated.

- Create test leads that simulate real buyer behavior
- Track leads through nurture programs
- Verify scoring accumulates correctly
- Test MQL threshold and sales notification
- Validate lead appears correctly in CRM with all data
- Test sales follow-up workflow triggers
- Get sign-off from marketing and sales stakeholders

#### Step 3: User Acceptance Testing (UAT)

**Step Overview:** Have marketing team test the platform and validate it meets their requirements. End state: Marketing team sign-off on platform readiness.

- Create UAT test script covering key use cases
- Have marketing team execute test scenarios
- Document feedback and required changes
- Implement fixes for critical issues
- Conduct regression testing on changes
- Get formal sign-off from marketing stakeholder

---

### Part 8: Training & Enablement

#### Step 1: Create Training Materials

**Step Overview:** Develop training documentation and resources for marketing team. End state: Complete training package ready for delivery.

- Create platform overview guide (navigation, key features)
- Document SOPs for common tasks (create email, build list, send campaign)
- Build video walkthroughs for complex workflows
- Create quick-reference cards for daily use
- Document troubleshooting guide for common issues
- Prepare hands-on exercises for training sessions

#### Step 2: Conduct Marketing Team Training

**Step Overview:** Train marketing team on platform usage and best practices. End state: Marketing team confident in using the platform.

- Schedule training sessions (recommend 2-3 sessions, 90 min each)
- Cover platform navigation and core features
- Walk through campaign creation workflow
- Train on reporting and dashboard usage
- Practice hands-on exercises with real scenarios
- Address questions and document for FAQ
- Record sessions for future reference

#### Step 3: Train Sales on Lead Handling

**Step Overview:** Train sales team on how leads appear in CRM and how to action them. End state: Sales team understands lead context and follow-up process.

- Schedule sales training session (30-45 min)
- Explain what information is captured on leads
- Demonstrate how to see lead engagement history
- Train on SLA expectations for MQL follow-up
- Show how to provide feedback on lead quality
- Document sales playbook for lead handling

---

### Part 9: Go-Live & Hypercare

#### Step 1: Execute Go-Live Checklist

**Step Overview:** Complete final pre-launch checks and activate the platform for production use. End state: Platform live in production.

- Run final data validation checks
- Verify all integrations are active
- Confirm email deliverability is healthy
- Activate lead scoring and routing
- Turn on live nurture programs
- Enable tracking and analytics
- Communicate go-live to stakeholders
- Document go-live timestamp and state

#### Step 2: Provide Hypercare Support

**Step Overview:** Provide intensive support during first 2 weeks post-launch to catch and resolve issues quickly. End state: Platform stable with issues resolved.

- Monitor email deliverability daily
- Check lead flow and routing daily
- Review error logs and failed syncs
- Address user questions within 4 hours
- Hold daily standup for first week
- Document issues and resolutions
- Escalate critical issues immediately

#### Step 3: Handoff to Client

**Step Overview:** Transfer ownership of platform operations to client team with full documentation. End state: Client team self-sufficient.

- Deliver complete documentation package
- Transfer admin credentials and access
- Provide vendor support contact information
- Schedule 30-day check-in call
- Document open items and future recommendations
- Get formal project sign-off
- Close out project

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM system in place and stable (Salesforce or HubSpot)
- Marketing team with bandwidth for requirements gathering and testing
- Budget approved for platform licensing (if new implementation)
- Executive sponsor with authority to make decisions
- Access to legacy platform for audit and migration (if migrating)

**What client must provide:**
- Access to legacy marketing automation platform (admin credentials)
- CRM admin access for integration configuration
- Brand assets (logos, colors, fonts) for templates
- List of integrations required (webinar, advertising, analytics)
- Content for nurture programs (if not recreating existing)
- Availability of key stakeholders for discovery and UAT
- List of users who need platform access and their roles
- DNS access for domain configuration

## 5. Common Pitfalls

- **Underestimating data migration complexity**: Field mapping between platforms (especially Marketo→HubSpot) is not 1:1. Custom fields, smart campaigns, and segmentation logic must be manually recreated. → **Mitigation**: Build detailed field mapping document and validate with test migration before full data move.

- **Skipping data cleanup before migration**: Migrating dirty data pollutes the new platform from day one. → **Mitigation**: Deduplicate, clean, and archive old records before migration. Use migration as opportunity to start fresh.

- **Trying to recreate everything 1:1**: Old workflows may have accumulated complexity that isn't needed. → **Mitigation**: Use migration as opportunity to simplify. Ask "do we still need this?" for every workflow before rebuilding.

- **Insufficient training time**: Teams often go live without proper training and struggle to use the platform. → **Mitigation**: Build training into the timeline, not as an afterthought. Require hands-on practice before go-live.

- **No hypercare period**: Issues always emerge post-launch; without dedicated support, they fester. → **Mitigation**: Plan for 2 weeks of intensive support post-launch with daily check-ins.

## 6. Success Metrics

- **Leading Indicator**: All core workflows (nurture, scoring, routing) tested and approved by marketing team before go-live. Zero critical bugs in UAT.

- **Lagging Indicator**: Within 60 days post-launch: 100% of marketing campaigns running through new platform, lead-to-MQL conversion rate maintained or improved, sales team reporting accurate lead context from marketing automation data.

---

