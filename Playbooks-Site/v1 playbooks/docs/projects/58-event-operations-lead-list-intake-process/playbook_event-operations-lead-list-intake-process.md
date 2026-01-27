# Event Operations: Lead List Intake Process - Playbook

## 1. Definition

**What it is**: A process optimization project that standardizes how event-generated leads (from trade shows, webinars, conferences, networking sessions) are captured, validated, deduplicated, and routed into the CRM and marketing automation platform for timely follow-up and nurturing.

**What it is NOT**: Not a lead scoring implementation (that defines MQL/SQL criteria). Not a lead routing rules project (that's assignment logic). Not an event marketing strategy project (that's campaign planning). Not a marketing automation platform implementation (assumes MAP already exists).

## 2. ICP Value Proposition

**Pain it solves**: Event leads get lost, duplicated, or sit untouched for days/weeks because there's no standardized intake process. Manual list uploads create data quality issues. Marketing and sales fight over which leads came from events and who should follow up.

**Outcome delivered**: A repeatable, automated process where event leads flow into the CRM within 24 hours of capture, properly tagged with source/campaign, deduplicated against existing records, and assigned to the right rep or nurture track. Event ROI becomes measurable.

**Who owns it**: Marketing Operations or RevOps Leader, with input from Event Marketing and Sales Operations.

## 3. Implementation Procedure

### Part 1: Discovery & Requirements Gathering

#### Step 1: Audit Current Event Lead Intake Process

**Step Overview:** Document how event leads currently flow from capture to CRM, identifying manual steps, bottlenecks, and data quality gaps. End state: Current state process map with pain points identified.

- Interview event marketing team on current list collection methods (badge scans, manual forms, third-party apps)
- Review last 3-5 event list imports to identify common data issues (missing fields, duplicates, formatting)
- Map current workflow from lead capture to CRM entry to sales assignment
- Document average time from event to lead availability in CRM (typical pain point: 3-7+ days)
- Identify which systems touch event leads (event platforms, spreadsheets, MAP, CRM)

#### Step 2: Define Event Lead Data Requirements

**Step Overview:** Establish the required and optional data fields for event leads, aligned with CRM/MAP data model. End state: Documented field mapping template for all event lead sources.

- Define required fields: First Name, Last Name, Email, Company, Lead Source, Event Name, Campaign ID
- Define optional enrichment fields: Title, Phone, Industry, Company Size, Booth Interaction Notes
- Create field mapping document that translates event platform fields to CRM/MAP fields
- Establish data validation rules (email format, required fields, picklist values)
- Confirm compliance requirements for GDPR/CCPA consent capture at events

#### Step 3: Define Lead Source Categories and Campaign Hierarchy

**Step Overview:** Create standardized lead source values and campaign structure for event leads to enable accurate attribution. End state: Lead source taxonomy and campaign naming convention documented.

- Define lead source picklist values (Trade Show, Webinar, Conference, Roadshow, Virtual Event)
- Create sub-source categories (Booth Visit, Session Attendance, Demo Request, Badge Scan)
- Establish campaign naming convention (e.g., EVT-2024-Dreamforce-Booth)
- Map event types to existing campaign hierarchy in MAP/CRM
- Document how event leads connect to parent campaigns for rollup reporting

---

### Part 2: Integration & Automation Configuration

#### Step 1: Configure List Import Templates and Validation

**Step Overview:** Build standardized import templates with built-in validation to ensure data quality before records enter the system. End state: Reusable import templates with validation rules active.

- Create CSV/Excel import templates with required columns and formatting guidelines
- Build data validation rules in MAP (email format, required fields, duplicate checking)
- Configure field mapping for common event platforms (Eventbrite, Cvent, Splash, ON24)
- Set up pre-import deduplication logic (match on email, then company+name)
- Test import template with sample data to verify field mapping accuracy

#### Step 2: Build Automated Lead Processing Workflows

**Step Overview:** Create automation workflows that process incoming event leads through standardization, enrichment, and routing. End state: Automated workflows triggered on event lead creation.

- Build lead processing workflow triggered by Lead Source = Event types
- Configure data standardization steps (company name normalization, title standardization)
- Set up automated field population (region based on country, segment based on company size)
- Create duplicate handling rules (update existing vs. create new with merge flag)
- Configure lead status assignment based on data completeness and engagement signals

#### Step 3: Configure Lead Assignment Rules for Event Leads

**Step Overview:** Set up routing rules that assign event leads to appropriate sales reps or nurture tracks based on qualification criteria. End state: Event leads automatically routed within 24 hours of import.

- Define assignment criteria (territory, company size, existing account ownership)
- Configure round-robin assignment for unowned/new accounts
- Set up hot lead alerts for high-priority event interactions (demo requests, pricing discussions)
- Build fallback assignment rules for edge cases (no territory match, existing customer)
- Test assignment logic with sample leads across all scenarios

---

### Part 3: Tracking & Reporting Setup

#### Step 1: Build Event Lead Tracking Mechanisms

**Step Overview:** Implement tracking to monitor lead flow from event capture through sales follow-up. End state: Lead lifecycle tracking active with stage timestamps.

- Configure lead status fields to track intake stages (New, Processing, Assigned, Contacted, Qualified)
- Set up timestamp fields for key milestones (Import Date, Assignment Date, First Touch Date)
- Create activity tracking for sales follow-up (calls, emails, meetings) linked to event source
- Configure sync between MAP engagement data and CRM for unified view
- Test tracking across full lead lifecycle with sample event leads

#### Step 2: Create Event Lead Performance Reports and Dashboards

**Step Overview:** Build reports and dashboards showing event lead intake performance, conversion metrics, and ROI indicators. End state: Executive dashboard and operational reports published.

- Build lead intake report: volume by event, source breakdown, import SLA compliance
- Create conversion funnel report: Event Lead to MQL to SQL to Opportunity by event
- Build speed-to-lead report: time from import to first sales touch by event/rep
- Create data quality scorecard: duplicate rate, field completeness, invalid records
- Assemble executive dashboard with event ROI summary and trend analysis

---

### Part 4: Testing & Quality Assurance

#### Step 1: Conduct End-to-End Process Testing

**Step Overview:** Test the complete intake process with sample data to validate all automations, integrations, and routing work correctly. End state: Process validated with documented test results.

- Create test lead list mimicking real event data (various sources, data quality levels)
- Execute full import process and verify field mapping accuracy
- Validate deduplication logic handles existing records correctly
- Confirm assignment rules route leads to correct owners
- Verify all tracking fields populate with accurate timestamps

#### Step 2: Perform User Acceptance Testing with Stakeholders

**Step Overview:** Have event marketing and sales stakeholders validate the process meets their needs before launch. End state: Sign-off from Event Marketing and Sales on process readiness.

- Walk event marketing team through import template and process
- Have sales team validate lead assignment and alert notifications
- Review reports with marketing ops to confirm attribution accuracy
- Document any issues or change requests from UAT
- Get formal approval to proceed with production launch

---

### Part 5: Training & Enablement

#### Step 1: Train Event Marketing Team on Intake Process

**Step Overview:** Enable event marketing team to properly capture and submit event leads using the new standardized process. End state: Event team trained and confident executing the process.

- Create step-by-step documentation for event lead submission (templates, naming, timing)
- Conduct live training session (30-45 min) covering the full intake workflow
- Walk through common scenarios: trade show booth, webinar, third-party event
- Provide FAQ document addressing common questions and edge cases
- Record training session and share with team for future reference

#### Step 2: Enable Sales Team on Event Lead Handling

**Step Overview:** Train sales reps on how event leads will appear in CRM, SLA expectations, and follow-up best practices. End state: Sales team understands event lead workflow and follow-up expectations.

- Brief sales team on event lead identification (source fields, campaign tags)
- Communicate follow-up SLA (24-48 hour first touch expectation)
- Train on using event context (booth notes, session attended) in outreach
- Show where to find event lead reports and their pipeline
- Provide email/call templates tailored for event lead follow-up

---

### Part 6: Launch & Handoff

#### Step 1: Execute Production Launch with Live Event

**Step Overview:** Launch the new intake process with a real upcoming event to validate in production environment. End state: First live event leads processed successfully through new workflow.

- Coordinate with event marketing on upcoming event timeline
- Execute first production import using new templates and process
- Monitor lead flow through automation and assignment in real-time
- Address any issues that arise during first live execution
- Capture lessons learned for process refinement

#### Step 2: Hand Off Process Ownership to Client

**Step Overview:** Transfer ownership of the intake process to client marketing ops team with all documentation and admin access. End state: Client self-sufficient to execute and maintain the process.

- Deliver complete documentation package (process guide, templates, troubleshooting)
- Transfer admin access and credentials for all configured systems
- Conduct final walkthrough of reporting and monitoring dashboards
- Schedule 30-day check-in to review process performance
- Close out project and transition to support mode

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) with standard lead/contact objects configured
- Marketing automation platform (HubSpot, Marketo, Pardot) integrated with CRM
- Existing campaign structure or willingness to create event campaign hierarchy
- At least one upcoming event (within 4-6 weeks) to use for live testing

**What client must provide:**
- Access to CRM and MAP with admin or near-admin permissions
- Sample event lead lists from past 2-3 events for testing
- Event marketing team availability for requirements and UAT sessions
- Sales leadership input on assignment rules and follow-up expectations
- List of planned events for next quarter to prioritize launch timing

## 5. Common Pitfalls

- **Pitfall 1**: Delayed follow-up kills conversion - leads captured at events go cold within 48-72 hours if not contacted. **Mitigation**: Build automated alerts for hot leads and establish 24-hour SLA for first touch.

- **Pitfall 2**: Data schema mismatch between event platforms and CRM - event tools use different field structures than CRM/MAP, causing import failures or lost data. **Mitigation**: Create field mapping templates for each event platform before events occur.

- **Pitfall 3**: Duplicate records overwhelm sales - same person appears multiple times from badge scans, form fills, and manual entry. **Mitigation**: Implement pre-import deduplication and configure CRM duplicate rules to catch remaining matches.

- **Pitfall 4**: No attribution connection to campaigns - event leads imported without proper campaign membership break marketing attribution and ROI reporting. **Mitigation**: Require campaign ID on all imports and build validation to reject records without campaign association.

## 6. Success Metrics

- **Leading Indicator**: Time from event close to leads available in CRM drops from 5+ days to under 24 hours; duplicate rate on imports drops below 5%.

- **Lagging Indicator**: Event lead to SQL conversion rate increases by 15%+ within 90 days; sales reports higher confidence in event lead quality and follow-up clarity.

---

