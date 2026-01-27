# Activity Capture - Playbook

## 1. Definition

**What it is**: A technical implementation project that deploys automated tools and integrations to capture all sales activities (emails, calls, meetings, calendar events) directly into the CRM without manual rep input. This eliminates data entry burden, improves data accuracy, and creates complete visibility into sales engagement patterns.

**What it is NOT**: Not a Sales Engagement Platform implementation (that's sequencing/cadences like Outreach or Salesloft). Not a Conversation Intelligence deployment (that captures call recordings/transcripts via Gong or Chorus). Not a CRM customization or field cleanup project. Not manual logging process documentation.

## 2. ICP Value Proposition

**Pain it solves**: Sales leaders cannot see what reps are actually doing because manual activity logging captures only 10-15% of actual activities. Reps resist logging because there's no reward for transparency, and manual entry takes valuable selling time (research shows reps spend 20% of their time on data entry). Leadership makes decisions based on incomplete data.

**Outcome delivered**: Full automated capture of all email, calendar, and call activities linked to the correct accounts, contacts, and opportunities. Reps save 5+ hours per week previously spent on manual data entry. Leadership gains accurate visibility into sales engagement for coaching and forecasting.

**Who owns it**: VP of Sales Operations or RevOps Leader (technical implementation), with sponsorship from VP Sales or CRO (adoption accountability).

## 3. Implementation Procedure

### Part 1: Assess Current State & Select Tool

#### Step 1: Audit Current Activity Logging Completeness

**Step Overview:** Assess how much activity data is currently being captured in the CRM vs actual communication volume. End state: Gap analysis document showing what percentage of activities are being missed and which channels are not captured.

- Pull activity reports from CRM for last 90 days (emails logged, meetings logged, calls logged)
- Request email/calendar volume data from IT or email admin (total emails sent, meetings held)
- Compare CRM activity counts to actual communication volume to quantify the gap (e.g., "Only 15% of emails are logged")
- Interview 2-3 sales reps to understand current manual logging pain points and time spent on data entry
- Document which communication channels are NOT being captured (calls, texts, LinkedIn messages, personal email)
- Identify any existing partial activity capture tools in place (e.g., Outreach logging only sequenced emails)

#### Step 2: Document Tech Stack Requirements

**Step Overview:** Map the client's email, calendar, and phone systems to determine tool compatibility requirements. End state: Technical requirements document listing all systems the activity capture tool must integrate with.

- Confirm email system (Google Workspace vs Microsoft 365) and admin access availability
- Document calendar platform and any shared calendar configurations
- Identify phone/dialer tools in use (RingCentral, Dialpad, native CRM dialer, mobile)
- List all CRM edition details (Salesforce edition/version, HubSpot tier) to verify API access
- Note any security/compliance requirements that may restrict OAuth connections or data sharing
- Document user count and license requirements for tool selection

#### Step 3: Evaluate and Select Activity Capture Tool

**Step Overview:** Compare activity capture tool options against client's tech stack, requirements, and budget. End state: Tool selected with budget approved and procurement initiated.

- Research and shortlist tool options: Einstein Activity Capture (Salesforce native), Clari Capture, Revenue Grid, Affinity, Ebsta
- Evaluate each tool on: CRM compatibility, email/calendar platform support, data retention limits, cost per user
- Assess data storage model (Einstein stores in separate cloud vs tools that write to standard CRM objects)
- Compare reporting capabilities (can activities be used in reports/dashboards or are they display-only?)
- Present recommendation with pros/cons to client stakeholders
- Get budget approval and begin procurement/trial process

---

### Part 2: Configure Activity Capture Tool

#### Step 1: Set Up Tool Account and CRM Connection

**Step Overview:** Create the activity capture tool account and establish the connection to the CRM with proper API permissions. End state: Tool connected to CRM and ready for configuration.

- Create activity capture tool account with client as account owner
- Connect to Salesforce/HubSpot via OAuth with appropriate admin credentials
- Grant required API permissions (read/write activities, contacts, accounts, opportunities)
- Verify connection status in tool dashboard and confirm bi-directional communication
- Document admin credentials and access details for client handoff
- Add LeanScale team as temporary admins for configuration period

#### Step 2: Configure Email Sync Settings

**Step Overview:** Configure email synchronization between activity capture tool and CRM with appropriate visibility and filtering rules. End state: Email sync active with correct visibility levels and domain restrictions.

- Set sync direction (one-way from email to CRM recommended for most use cases)
- Define visibility levels (private to rep only vs shared with team/managers) based on client policy
- Configure email domain restrictions to exclude personal domains (gmail.com, yahoo.com, hotmail.com)
- Set up internal domain exclusions to prevent logging of internal company emails
- Configure organizational defaults and lock settings to prevent rep-level overrides
- Test with 3-5 sample emails across different scenarios (new lead, existing customer, internal) and verify they appear correctly in CRM

#### Step 3: Configure Calendar Sync Settings

**Step Overview:** Set up calendar event synchronization to capture meetings automatically. End state: Calendar events syncing to CRM with correct meeting type classification and attendee linking.

- Connect calendar (Google Calendar or Outlook) with appropriate permissions
- Define which meeting types to capture (external meetings only vs all meetings)
- Configure handling rules for internal vs external meetings based on attendee domains
- Set up meeting type classification rules (Demo, Discovery Call, Follow-up, etc.) if tool supports
- Configure attendee matching to link meetings to correct Contact/Lead records
- Test with sample calendar events and verify they appear on correct CRM records

#### Step 4: Configure Call Activity Capture (if applicable)

**Step Overview:** Set up call activity capture for phone/dialer systems if client uses supported tools. End state: Call activities logging to CRM with duration and outcome tracking.

- Identify if client's dialer/phone system supports activity capture integration
- Configure call logging connection (native CRM dialer, RingCentral, Dialpad integration)
- Set up call outcome picklist values to standardize call disposition tracking
- Configure call duration capture and any call recording linkage (separate from Conversation Intelligence)
- Test call logging with sample calls and verify data appears on correct records
- Document any manual call logging still required for unsupported channels (mobile, desk phones)

---

### Part 3: Configure CRM Integration & Reporting

#### Step 1: Map Activity Fields to CRM Objects

**Step Overview:** Configure how captured activities link to CRM records (Contacts, Accounts, Leads, Opportunities). End state: Activities correctly associating to all relevant CRM records based on email addresses and domains.

- Configure contact matching logic (email address to Contact/Lead match)
- Set up domain-to-account mapping for linking activities to Account records
- Configure Opportunity association rules (activities on Contacts linked to open Opportunities)
- Test edge cases: new leads without existing accounts, contacts at multiple companies, shared email domains
- Set up duplicate handling rules to prevent duplicate activity records
- Verify activities appear on related lists for Contact, Account, Lead, and Opportunity records

#### Step 2: Define Activity Type Categorization Schema

**Step Overview:** Establish standardized activity types and categorization for consistent reporting. End state: Activity type picklist configured with LeanScale standard or client-approved categories.

- Define activity type categories (Email - Outbound, Email - Inbound, Meeting - Demo, Meeting - Discovery, Call - Outbound, etc.)
- Configure activity type auto-classification rules where tool supports
- Create any required custom fields for activity metadata (meeting outcome, call disposition)
- Set up activity subject line standardization or parsing rules
- Document the activity categorization schema for training materials
- Test categorization with sample activities across all channels

#### Step 3: Build Activity Monitoring Dashboard

**Step Overview:** Create dashboards to monitor activity capture rates and identify sync gaps. End state: Dashboard showing activity capture health metrics for ongoing monitoring.

- Build activity volume dashboard showing activities captured by type, user, and time period
- Create capture rate comparison report (CRM activities vs expected volume based on user count)
- Set up sync error monitoring to identify failed or missing activity syncs
- Build user adoption dashboard showing which reps have activity capture enabled/active
- Create activity linkage quality report (% of activities linked to accounts, % orphaned)
- Configure dashboard sharing with client RevOps team and key stakeholders

---

### Part 4: Rollout & Enablement

#### Step 1: Conduct Pilot Test with Select Users

**Step Overview:** Test activity capture with 3-5 pilot users before full rollout to validate configuration and catch issues. End state: Pilot group validated with any configuration issues resolved.

- Select 3-5 pilot users representing different roles (SDR, AE, manager) and email patterns
- Enable activity capture for pilot group only
- Monitor for 3-5 business days to collect sufficient sample data
- Review captured activities for accuracy (correct record linking, no duplicates, no missing activities)
- Gather pilot user feedback on any concerns or issues
- Address any configuration issues discovered before full rollout

#### Step 2: Conduct Sales Team Training

**Step Overview:** Train sales team on what is automatically captured, visibility settings, and how to leverage activity data. End state: Team trained and confident in using the system.

- Schedule training session (30-45 minutes) with full sales team
- Cover: what activities are auto-captured, which channels still require manual logging, visibility settings
- Demonstrate how to view activity data on records and in reports
- Address common concerns (privacy, "Big Brother" perception) with clear policy explanations
- Create quick-reference documentation for reps (one-pager on what's captured vs manual)
- Record training session and distribute to team and future new hires

#### Step 3: Execute Full User Rollout

**Step Overview:** Roll out activity capture to all users in controlled phases. End state: All target users enabled with activity capture functioning.

- Create rollout schedule by team (SDRs first, then AEs, then leadership)
- Enable activity capture in phases allowing 2-3 days between each phase
- Monitor dashboards for sync errors or issues after each phase
- Address any user-specific issues (OAuth failures, permission problems)
- Verify all users are capturing activities within expected ranges
- Communicate rollout completion to stakeholders

#### Step 4: Hand Off to Client

**Step Overview:** Transfer ownership, documentation, and ongoing monitoring responsibility to client team. End state: Client self-sufficient with admin access, runbooks, and support process.

- Transfer admin credentials and account ownership to client RevOps team
- Deliver documentation package (configuration settings, troubleshooting guide, escalation contacts)
- Walk through monitoring dashboard and explain key metrics to watch
- Document any known limitations or manual processes still required
- Schedule 30-day check-in to review activity capture rates and address questions
- Close out project in project management system

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM admin access (Salesforce System Admin or HubSpot Super Admin)
- Confirmed email system (Google Workspace or Microsoft 365) with admin permissions for OAuth connections
- Budget approval for activity capture tool licensing if not using native CRM solution
- Executive sponsor committed to communicating expectations and enforcing adoption
- IT/Security approval for OAuth connections and data sharing between systems

**What client must provide:**
- List of all email domains used by sales team (including aliases)
- List of users to enable for activity capture (with email addresses and roles)
- Desired activity type categorization or approval to adopt LeanScale standard schema
- Calendar access permissions from IT/Security team
- Decision on data visibility settings (who can see whose activities)
- Point of contact for IT/Security questions during implementation

## 5. Common Pitfalls

- **Pitfall 1**: Selecting Einstein Activity Capture without understanding data limitations (activities stored in separate cloud, not available for reports/APIs/automation) → **Mitigation**: During tool selection, explicitly evaluate data storage model and confirm activities will be available in standard Salesforce reporting if that's a requirement

- **Pitfall 2**: Activities sync but don't link to correct CRM records due to missing email-to-account matching rules → **Mitigation**: Configure contact matching logic AND domain-to-account mapping before go-live; test extensively with edge cases (new leads without accounts, contacts at multiple companies, shared domains)

- **Pitfall 3**: Data retention limitations create gaps in historical analysis (Einstein Activity Capture limits to 24 months, some tools shorter) → **Mitigation**: Document retention limits upfront; if long-term analysis is critical, evaluate tools with unlimited retention (Affinity) or implement data export/archival process

- **Pitfall 4**: Reps disable sync or mark activities as private, defeating visibility goals → **Mitigation**: Set organizational policies on visibility defaults; configure admin controls to prevent user-level overrides; address concerns proactively in training; get executive sponsor to communicate expectations

- **Pitfall 5**: Poor integration between multiple tools creates duplicate activities or data conflicts → **Mitigation**: Map all existing activity sources during discovery; disable competing integrations; test for duplicates during pilot before full rollout

## 6. Success Metrics

- **Leading Indicator**: Activity capture rate exceeds 90% within first 2 weeks (measured by comparing CRM activity counts to email/calendar volume from IT reports)
- **Lagging Indicator**: Rep time saved on data entry (target: 5+ hours/week based on survey); improvement in activity-based forecasting accuracy; increase in manager coaching conversations driven by activity insights; data quality score improvement in CRM health audits

---

