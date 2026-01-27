# Website Lead Capture & Form Configuration - Playbook

## 1. Definition

**What it is**: A technical implementation project that optimizes how leads are captured through website forms, ensuring proper data collection, MAP/CRM integration, UTM attribution tracking, and automated follow-up workflows. The goal is to capture high-quality lead data with minimal friction while maintaining full visibility into lead sources.

**What it is NOT**: Not a website redesign project. Not a landing page creation initiative (that's a separate project). Not a lead scoring or lifecycle stage definition project (those are handled in Lead Lifecycle). Not a marketing automation strategy engagement - this is specifically the technical form configuration and integration work.

## 2. ICP Value Proposition

**Pain it solves**: Marketing teams are losing leads due to broken forms, missing attribution data, and poor MAP/CRM sync. They can't prove which channels are working because UTM tracking is incomplete or not connected. Sales complains about bad data quality, and leads slip through the cracks because there's no automated follow-up system in place.

**Outcome delivered**: A fully operational lead capture system with forms that convert, data that flows cleanly into the CRM, attribution that tells the real story of where leads come from, and automation that ensures no lead goes untouched. Marketing gets clear reporting, Sales gets clean data, and the business gets more MQLs entering the pipeline.

**Who owns it**: Marketing Operations or RevOps Manager (technical owner), with input from Demand Gen (form placement/strategy) and Sales (lead data requirements).

## 3. Implementation Procedure

### Part 1: Audit Current Forms & Define Requirements

#### Step 1: Inventory Existing Website Forms

**Step Overview:** Document all current website forms, their locations, field configurations, and submission volumes. End state: Complete form inventory spreadsheet with baseline performance metrics.

- Pull list of all forms from MAP (HubSpot/Marketo form library)
- Document each form's page location (landing pages, blog sidebars, pricing page, demo request, etc.)
- Record current field configurations for each form (name, email, company, phone, etc.)
- Note submission volumes and conversion rates for the past 90 days
- Flag any forms with unusually low conversion rates (&lt;2%) for priority optimization

#### Step 2: Map Data Flow from Form to CRM

**Step Overview:** Trace the data path from form submission through MAP to CRM, identifying sync failures or data loss points. End state: Data flow diagram with identified gap points documented.

- Submit test leads through each major form type
- Track data arrival in MAP, field mapping to CRM, and lead record creation
- Identify any fields that are not syncing or are mapping incorrectly
- Document sync frequency (real-time vs. batched) and any delays
- Note any data transformation or enrichment happening between systems

#### Step 3: Gather Stakeholder Requirements

**Step Overview:** Interview Marketing and Sales stakeholders to define required lead data fields and follow-up expectations. End state: Approved requirements document with field list and SLA expectations.

- Meet with Sales leadership to define what lead data they need for effective follow-up
- Meet with Demand Gen to understand form placement strategy and conversion goals
- Document lead routing rules (who gets assigned which leads by segment/territory)
- Confirm response time SLAs (target: under 5 minutes for demo requests)
- Get sign-off on final field requirements from both teams

#### Step 4: Assess UTM and Attribution Setup

**Step Overview:** Review current UTM parameter tracking and identify gaps in lead source attribution. End state: Gap analysis showing what attribution data is being captured vs. lost.

- Review UTM taxonomy or campaign naming conventions in use
- Test UTM parameter passing from ad platforms through form submissions
- Check if hidden fields are capturing UTM values (source, medium, campaign, content, term)
- Verify UTM data is persisting to CRM lead records
- Document which sources show as "unknown" or "direct" in current reporting

---

### Part 2: Configure Forms and Hidden Tracking Fields

#### Step 1: Design Form Field Strategy by Funnel Stage

**Step Overview:** Define field requirements for each form type based on funnel stage and conversion optimization principles. End state: Form field specifications document with progressive profiling plan.

- Define TOFU form fields (lead magnet downloads): 2-3 fields max (name, email) targeting 15-25% CVR
- Define MOFU form fields (demo requests): 4-5 fields (name, email, company, role) targeting 8-12% CVR
- Define BOFU form fields (pricing/trial): 5-7 fields (add phone, company size, use case) targeting 5-8% CVR
- Plan progressive profiling rules (what fields to ask on repeat visits)
- Document validation rules for each field (email format, phone format, required vs. optional)

#### Step 2: Build or Reconfigure MAP Forms

**Step Overview:** Create optimized forms in the MAP with proper field structure, mobile responsiveness, and UX best practices. End state: New/updated forms ready for deployment.

- Build forms in MAP using approved field specifications
- Configure field validation and error messaging (clear, not frustrating)
- Set up multi-step forms for demo requests to boost start rates
- Optimize button text (use action-oriented copy like "Get My Demo" vs. generic "Submit")
- Ensure mobile responsiveness (large touch-friendly buttons, minimal scrolling)
- Add social proof elements where appropriate (G2 rating, customer logos)

#### Step 3: Configure Hidden Fields for Attribution Tracking

**Step Overview:** Set up hidden fields to automatically capture UTM parameters, page URL, and referrer data. End state: All forms capturing full attribution data without user input required.

- Add hidden fields for UTM parameters: utm_source, utm_medium, utm_campaign, utm_content, utm_term
- Add hidden field for original page URL where form was submitted
- Configure hidden field for referrer URL
- Set up JavaScript or native MAP functionality to auto-populate hidden fields from URL
- Test hidden field population across different traffic sources (direct, organic, paid, email)

#### Step 4: Set Up MAP-to-CRM Field Mapping

**Step Overview:** Configure proper field mapping from MAP forms to CRM lead/contact records with correct data types. End state: Clean data sync with all fields mapping to correct CRM fields.

- Map each form field to corresponding CRM lead/contact field
- Verify data types match (text, picklist, date, number) to prevent sync errors
- Configure picklist value mappings where needed
- Set up default values for fields that may be empty
- Test end-to-end sync with sample submissions and verify data arrives correctly in CRM

---

### Part 3: Build Automation Workflows and Notifications

#### Step 1: Create Lead Assignment and Routing Rules

**Step Overview:** Configure automated lead assignment based on defined routing rules (territory, segment, round-robin). End state: Leads automatically routing to correct owner upon form submission.

- Build lead assignment rules based on stakeholder requirements (geography, company size, industry)
- Configure round-robin assignment for demo requests to distribute leads evenly
- Set up fallback assignment for leads that don't match any rule
- Test assignment logic with sample leads from different segments
- Document assignment rules for client reference

#### Step 2: Configure Submission Notifications for Speed-to-Lead

**Step Overview:** Set up instant notifications to Sales when high-intent forms are submitted to ensure 5-minute response. End state: Sales notified in real-time for demo and pricing requests.

- Configure email notifications to lead owners on demo/pricing form submissions
- Set up Slack or Teams notifications for sales team channel (if applicable)
- Include key lead data in notification (name, company, form submitted, UTM source)
- Test notification delivery timing (target: under 1 minute from submission)
- Configure escalation notification if lead not contacted within SLA

#### Step 3: Build Automated Follow-Up Email Workflows

**Step Overview:** Create automated confirmation emails and nurture sequences for form submitters. End state: Leads receiving immediate confirmation and follow-up content automatically.

- Build thank-you/confirmation email for each form type with relevant next steps
- Set up Day 0 confirmation with download link or meeting booking link as appropriate
- Configure nurture sequence: Day 2 (case study/social proof), Day 5 (demo invite if not converted)
- Personalize emails based on form data (company name, use case if captured)
- Set up exit conditions (remove from nurture if they convert or reply)

---

### Part 4: Test, Launch, and Hand Off

#### Step 1: Execute Cross-Device QA Testing

**Step Overview:** Test all forms across devices and browsers to verify functionality, mobile experience, and data capture. End state: QA checklist complete with all forms validated.

- Test each form on desktop (Chrome, Firefox, Safari)
- Test each form on mobile devices (iOS Safari, Android Chrome)
- Verify field validation works correctly and error messages display properly
- Confirm mobile UX (buttons tappable, fields easy to complete, no horizontal scroll)
- Document any issues found and fix before launch

#### Step 2: Perform End-to-End Submission Testing

**Step Overview:** Validate complete data flow from form submission through CRM with full attribution data. End state: Confirmed that all integrations, field mappings, and workflows are functioning.

- Submit test leads with UTM parameters through each form type
- Verify lead appears in MAP with all field data captured correctly
- Confirm lead syncs to CRM with correct field mapping and assignment
- Validate hidden field data (UTMs, page URL) is present on CRM record
- Test notification delivery and automated email triggers
- Confirm nurture workflow enrollment works as expected

#### Step 3: Build Form Performance Dashboard

**Step Overview:** Create reporting dashboard to track form submission rates, conversion rates, and lead source breakdown. End state: Live dashboard for ongoing form performance monitoring.

- Build dashboard in MAP or BI tool showing form submissions by form name
- Add conversion rate metrics (submissions / page views) for each form
- Include lead source breakdown from UTM data (paid, organic, email, social, direct)
- Set up weekly automated report delivery to Marketing Ops stakeholders
- Document where to access dashboard and how to interpret metrics

#### Step 4: Conduct Training and Complete Handoff

**Step Overview:** Train Marketing Ops team on form management, field updates, and troubleshooting common issues. End state: Client self-sufficient with documentation and admin access.

- Schedule 30-45 minute training session with Marketing Ops team
- Cover: how to edit forms, add/remove fields, update field mappings
- Review workflow logic and how to pause/update nurture sequences
- Walk through troubleshooting common issues (sync failures, missing data)
- Deliver documentation package (form configurations, field mappings, workflow logic)
- Schedule 30-day check-in to review performance and optimize based on data

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Website CMS access with ability to embed forms or edit tracking code
- MAP admin access (HubSpot, Marketo, or equivalent)
- CRM admin access for field mapping configuration
- Existing website pages where forms will be placed (or URLs for planned pages)
- Clear ownership of which team will manage forms post-implementation

**What client must provide:**
- List of required lead data fields approved by Sales and Marketing
- Current form inventory (if not already documented)
- Lead routing rules (who gets assigned which leads)
- Follow-up expectations (response time SLAs, confirmation email content)
- UTM taxonomy or campaign naming conventions in use

## 5. Common Pitfalls

- **Pitfall 1**: Asking for too many form fields upfront, killing conversion rates (each additional field drops conversion by ~4%; reducing from 4 to 3 fields can increase CVR by 50%) --> **Mitigation**: Use 3-5 fields max for top-of-funnel forms; leverage progressive profiling to gather additional data over subsequent visits

- **Pitfall 2**: Forms not optimized for mobile, causing significant lead leakage from smartphone traffic (over 50% of B2B research happens on mobile) --> **Mitigation**: Test all forms on mobile devices before launch; use large touch-friendly buttons, single-column layouts, and minimize field count on mobile

- **Pitfall 3**: UTM parameters not passing correctly through form submissions, resulting in broken attribution and "unknown source" leads --> **Mitigation**: Set up hidden fields that auto-populate from URL parameters; test UTM flow end-to-end with sample submissions from different channels before going live

- **Pitfall 4**: No automated follow-up after form submission, letting leads go cold (leads contacted within 5 minutes are 7x more likely to convert) --> **Mitigation**: Configure instant submission notifications to Sales and automated confirmation emails to leads as part of the build phase; set up escalation alerts for missed SLAs

- **Pitfall 5**: Sales and Marketing not aligned on lead definitions and routing, causing leads to pile up without action --> **Mitigation**: Get sign-off from both teams on field requirements and routing rules during discovery; document clear ownership and SLAs before launch

## 6. Success Metrics

- **Leading Indicator**: Form submission conversion rate improves (benchmark: 2-3% for B2B, top performers exceed 5%); all test submissions flow correctly to CRM with complete attribution data within 24 hours of launch; notifications deliver within 1 minute of submission

- **Lagging Indicator**: Increase in MQL production from website sources within 30-60 days; improved marketing attribution visibility with clear lead source reporting; reduction in "unknown source" leads in CRM; faster speed-to-lead response times

---

