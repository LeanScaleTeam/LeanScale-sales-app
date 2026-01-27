# Revenue Intelligence Process - Project Details / Task List

**Tag:** `revenue-intelligence`
**Total Hours:** 60h
**Structure:** Multi-Milestone (>50h)

---

## Milestone 1: Revenue Intelligence Process - 1. Assessment, Platform Setup & Analytics
**Tag:** `revenue-intelligence`
**Description:** Discovery, platform configuration, CRM integration, deal scoring, and coaching deployment for revenue intelligence system.
**Hours:** 44h

### Task List: (Revenue Intelligence) 1. Assessment & Platform Setup
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Audit Current Conversation Capture Coverage | 2.5h | Assess how much conversation data is currently being captured across all sales channels. End state: Gap analysis document showing capture rate by channel and identifying blind spots.<br /><br />• Pull call recording stats from existing dialer system (if any) for last 90 days<br />• Audit Zoom/Teams/Meet recording settings and adoption rates across sales team<br />• Interview 2-3 sales managers on current deal review process and visibility gaps<br />• Document which channels are NOT being captured (in-person meetings, mobile calls, LinkedIn messages)<br />• Quantify the gap (e.g., "Only 40% of customer conversations are recorded") |
| 2. Establish Baseline Forecast Accuracy Metrics | 2.5h | Document current forecast accuracy and deal velocity metrics to enable ROI measurement post-implementation. End state: Baseline metrics document with 4 quarters of historical data.<br /><br />• Pull historical forecast vs. actual reports from CRM for last 4 quarters<br />• Calculate forecast accuracy percentage by rep, team, and segment<br />• Document current win rates by stage, deal size, and sales cycle length<br />• Interview Sales Leadership (CRO, VP Sales) on forecasting pain points and current processes<br />• Record average deal slippage rate (deals that push from one quarter to next) |
| 3. Map Tech Stack and Define Integration Requirements | 2.5h | Document all systems that must integrate with the revenue intelligence platform and identify compatibility requirements. End state: Integration map with API/authentication requirements for each system.<br /><br />• Inventory current tech stack: CRM, dialer, video conferencing, email, calendar<br />• Document authentication methods available (OAuth, API keys, native integrations)<br />• Identify data fields that need to flow between systems (opportunity stages, contact roles, activity types)<br />• Note any compliance requirements (call recording consent, data residency, GDPR)<br />• Assess CRM data quality - flag critical hygiene issues that could impact deal scoring |
| 4. Define Success Criteria and Select Platform | 3h | Establish measurable success criteria and evaluate platform options against client requirements. End state: Platform selected with documented success criteria and stakeholder alignment.<br /><br />• Define 3-5 success criteria with measurable targets (e.g., forecast accuracy from 65% to 85%)<br />• Evaluate platform options: Gong, Clari, Chorus, Revenue Grid, Avoma<br />• Compare on: CRM compatibility, pricing model, implementation complexity, feature fit<br />• Present recommendation with pros/cons to executive sponsor<br />• Get budget approval and procurement initiated |
| 5. Set Up Platform Account and Admin Access | 2.5h | Create the revenue intelligence platform account and establish administrative access structure. End state: Platform provisioned with admin accounts and role hierarchy configured.<br /><br />• Create platform account with enterprise license<br />• Configure SSO integration if applicable (Okta, Azure AD, Google)<br />• Set up admin accounts for RevOps team with full configuration access<br />• Define user role hierarchy (Admin, Manager, Rep, Read-Only)<br />• Document admin credentials and access procedures for client handoff |
| 6. Configure CRM Sync and Field Mapping | 3.5h | Establish bidirectional sync between revenue intelligence platform and CRM with proper field mapping. End state: CRM connected with all required fields syncing correctly.<br /><br />• Connect to Salesforce/HubSpot via OAuth with read/write permissions<br />• Map standard objects: Opportunities, Accounts, Contacts, Activities<br />• Configure custom field sync for deal-specific data (MEDDIC fields, custom stages)<br />• Set sync frequency (real-time vs. scheduled) based on data volume<br />• Verify connection and run initial data sync - validate sample records |
| 7. Configure Call Recording Integrations | 3.5h | Set up recording integrations for all conversation channels used by sales team. End state: All customer conversation channels connected and recording automatically.<br /><br />• Configure Zoom integration with automatic recording for external meetings<br />• Set up Microsoft Teams or Google Meet integration (based on client stack)<br />• Connect dialer system (Outreach, Salesloft, Aircall, RingCentral) for phone recording<br />• Configure recording consent settings based on legal requirements (one-party vs. two-party)<br />• Test recording on each channel type and verify transcription accuracy |

---

### Task List: (Revenue Intelligence) 2. Analytics & Coaching
**Contains:** Parts 3-4

| Task | Est | Description |
|------|-----|-------------|
| 8. Configure Deal Risk Scoring Rules | 4h | Build automated deal risk scoring based on conversation signals and CRM data patterns. End state: Deal risk scores appearing on all active opportunities with clear risk indicators.<br /><br />• Define risk signals from conversations (competitor mentions, stakeholder drop-off, timeline shifts)<br />• Configure CRM-based risk rules (stalled deals, missing next steps, no recent activity)<br />• Set up engagement scoring (single-threaded vs. multi-threaded, champion engagement)<br />• Calibrate scoring weights based on client's historical win/loss patterns<br />• Test scoring on sample deals and validate with sales leadership feedback |
| 9. Build Pipeline Analytics Dashboards | 4h | Create pipeline visibility dashboards with forecast roll-up views for different stakeholders. End state: Dashboard suite deployed with rep, manager, and executive views.<br /><br />• Build rep-level dashboard: personal pipeline, deal health, activity metrics<br />• Build manager-level dashboard: team pipeline, forecast vs. quota, rep performance<br />• Build executive dashboard: company forecast roll-up, quarter projection, risk summary<br />• Configure drill-down paths from summary views to deal details<br />• Set up scheduled dashboard email delivery to stakeholders |
| 10. Create Forecast Submission Workflow | 3.5h | Configure forecast submission process with commit categories and roll-up logic. End state: Weekly forecast submission workflow active with proper approval chain.<br /><br />• Define forecast categories (Commit, Best Case, Pipeline, Omitted)<br />• Configure submission workflow with rep input and manager override capability<br />• Set up forecast snapshot schedule (weekly, monthly, quarterly)<br />• Build forecast accuracy tracking to compare submissions vs. actuals over time<br />• Configure automated reminders for forecast submission deadlines |
| 11. Configure Coaching Scorecards | 4h | Build coaching scorecards with talk ratio, question frequency, and topic coverage metrics. End state: Coaching scorecards active with benchmarks set from top performer data.<br /><br />• Define coaching metrics: talk-to-listen ratio, question frequency, monologue length<br />• Configure topic detection for key conversation elements (discovery, demo, negotiation)<br />• Set up competitor mention alerts and tracking<br />• Establish benchmark values from top performer analysis<br />• Build manager view for comparing rep performance to benchmarks |
| 12. Set Up Automated Deal Alerts | 3.5h | Configure automated alerts for at-risk deals and important conversation signals. End state: Alert system active with notifications going to appropriate stakeholders.<br /><br />• Define alert triggers: ghosting risk, competitor mention, champion departure, timeline change<br />• Configure notification channels (email, Slack, in-platform)<br />• Set up escalation rules (rep notified first, manager notified if no action)<br />• Build weekly deal health digest for managers<br />• Test alert triggers with sample scenarios |
| 13. Create Call Library and Best Practice Repository | 5h | Set up searchable call library with tagging for training and onboarding use cases. End state: Call library organized with playlists for common coaching scenarios.<br /><br />• Configure call tagging taxonomy (discovery, demo, objection handling, negotiation)<br />• Build playlists for new rep onboarding (best discovery calls, winning demos)<br />• Set up snippet creation workflow for managers to capture coaching moments<br />• Create competitive intelligence library (calls with competitor mentions)<br />• Document process for reps and managers to contribute to library |

---

## Milestone 2: Revenue Intelligence Process - 2. Enablement & Handoff
**Tag:** `revenue-intelligence`
**Description:** Training, enablement, cadence establishment, and project handoff.
**Hours:** 16h

### Task List: (Revenue Intelligence) 3. Enablement & Handoff
**Contains:** Parts 5-6

| Task | Est | Description |
|------|-----|-------------|
| 14. Conduct Sales Manager Training | 2h | Train sales managers on deal inspection workflows, coaching scorecards, and forecast submission. End state: Managers trained and able to run data-driven deal reviews.<br /><br />• Schedule 60-minute training session for all sales managers<br />• Cover: deal inspection workflow, dashboard navigation, coaching scorecards<br />• Walk through sample deal review using live data<br />• Provide quick-reference guide for weekly deal review process<br />• Record session for managers who cannot attend live |
| 15. Conduct Sales Rep Training | 1.5h | Train sales reps on what's being captured and how to use insights for self-coaching. End state: Reps understand recording settings and can access their own metrics.<br /><br />• Schedule 30-minute training session for sales reps<br />• Cover: what's auto-recorded, privacy settings, how to review own calls<br />• Show how to use call insights for self-improvement<br />• Address common concerns about monitoring and data usage<br />• Distribute FAQ document addressing rep privacy questions |
| 16. Train RevOps Admin on Platform Administration | 2.5h | Transfer platform administration knowledge to client RevOps team. End state: Client admin self-sufficient for user management, reporting, and troubleshooting.<br /><br />• Conduct hands-on admin training session (60-90 minutes)<br />• Cover: user provisioning, permission management, integration monitoring<br />• Walk through common troubleshooting scenarios (sync issues, recording failures)<br />• Document admin runbook with step-by-step procedures<br />• Transfer admin credentials and confirm client access |
| 17. Document Weekly Deal Review Process | 2.5h | Create standardized deal review process with agenda template and required dashboards. End state: Deal review playbook ready for managers to adopt.<br /><br />• Create deal review meeting agenda template (30-45 minute format)<br />• Define required pre-work for reps before deal review<br />• Document which dashboards/reports to use in each section<br />• Build deal inspection checklist for managers<br />• Distribute playbook to all managers with example meeting recording |
| 18. Establish Forecast Review Cadence | 2.5h | Set up recurring forecast review meetings at rep, team, and company levels. End state: Forecast cadence calendar published with meeting invites sent.<br /><br />• Define forecast cadence: weekly pipeline review, monthly forecast call, quarterly business review<br />• Create meeting invite templates with pre-read requirements<br />• Build forecast review deck template with required data views<br />• Document escalation process for deals that need executive attention<br />• Send calendar invites and publish cadence to sales team |
| 19. Conduct Handoff and Schedule Follow-Up | 5h | Complete formal handoff to client with documentation package and schedule adoption check-in. End state: Project closed with 30-day and 90-day follow-up scheduled.<br /><br />• Compile documentation package: config settings, admin runbook, training materials<br />• Conduct handoff meeting with RevOps owner and executive sponsor<br />• Review success criteria and establish adoption tracking metrics<br />• Schedule 30-day adoption check-in to review usage and address friction<br />• Schedule 90-day ROI review to measure against baseline metrics |

---

## Summary
- **Total Milestones:** 2 (44h + 16h)
- **Total Task Lists:** 3 (consolidated from 6 Parts)
- **Total Tasks:** 19 (one per Step)
- **Total Hours:** 60h
- **Generated from:** playbook_revenue-intelligence-process.md
- **Generated on:** 2025-12-31
