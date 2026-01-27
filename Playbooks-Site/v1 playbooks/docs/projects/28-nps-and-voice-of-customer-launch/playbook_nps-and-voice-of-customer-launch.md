# NPS and Voice of Customer Launch - Playbook

## 1. Definition

**What it is**: A structured implementation project that deploys a systematic NPS and CSAT survey program to capture customer sentiment at key lifecycle touchpoints, integrate feedback into the CRM, and establish closed-loop processes for acting on customer insights.

**What it is NOT**: Not a Customer Health Score implementation (that uses multiple data points beyond surveys). Not a Customer Success Platform implementation (that's broader than feedback collection). Not a one-time survey project (this establishes an ongoing cadence).

## 2. ICP Value Proposition

**Pain it solves**: Customer Success teams lack visibility into customer sentiment until it's too late. Without structured feedback collection, at-risk accounts go undetected, product issues surface only at renewal, and promoters aren't leveraged for referrals or advocacy.

**Outcome delivered**: A fully automated NPS/CSAT program with surveys triggered at strategic touchpoints, real-time alerts for detractors, CRM integration for account-level visibility, and closed-loop workflows that turn feedback into retention and expansion actions.

**Who owns it**: VP of Customer Success or Customer Success Operations Leader.

## 3. Implementation Procedure

### Part 1: Define Program Strategy & Objectives

#### Step 1: Clarify Program Goals and Success Metrics

**Step Overview:** Align stakeholders on what the NPS program should achieve and how success will be measured. End state: Documented program objectives with specific, measurable targets.

- Conduct kickoff meeting with CS leadership to define primary goals (loyalty measurement, at-risk identification, product feedback, executive reporting)
- Determine how NPS data will be used by each team (CS for health, Product for roadmap, Exec for board reporting)
- Set baseline metrics: target NPS score, response rate goals (aim for 12-40% for B2B), reduction in churn for detractors
- Define segmentation strategy (enterprise vs SMB, decision-makers vs end-users, lifecycle stage)
- Document program charter with goals, metrics, and stakeholder responsibilities

#### Step 2: Map Survey Touchpoints to Customer Journey

**Step Overview:** Identify the optimal moments to collect feedback based on customer lifecycle stages. End state: Documented survey cadence with trigger points and audience for each.

- Map current customer journey from onboarding through renewal
- Select trigger points: post-onboarding (30-60 days), post-support interaction, quarterly relationship check-ins, pre-renewal (90 days out)
- Determine survey frequency caps to prevent over-surveying (e.g., max one NPS survey per quarter per contact)
- Define audience for each touchpoint (which roles/personas to survey)
- Document survey cadence matrix showing touchpoint, timing, audience, and channel

---

### Part 2: Select & Configure NPS Tool

#### Step 1: Evaluate and Select NPS Platform

**Step Overview:** Compare NPS tool options against client's tech stack, CRM, and program requirements. End state: Tool selected with budget approved and procurement initiated.

- Document current tech stack: CRM (Salesforce/HubSpot), CS platform (Gainsight/ChurnZero), support tools
- Create evaluation criteria: CRM integration depth, in-app vs email capabilities, alerting features, reporting/analytics, cost per user
- Evaluate 2-3 tools from options: Delighted, Wootric/InMoment, AskNicely, Qualtrics, native CRM survey tools
- Schedule vendor demos with key stakeholders (CS Ops, IT/Admin)
- Present recommendation with pros/cons and total cost of ownership
- Secure budget approval and initiate procurement

#### Step 2: Set Up NPS Tool Account and CRM Connection

**Step Overview:** Create the NPS tool account and establish bidirectional connection with CRM. End state: Tool connected to CRM with proper API permissions and data flowing correctly.

- Create NPS tool account with appropriate subscription tier
- Connect to Salesforce/HubSpot via OAuth or API key
- Configure required permissions (read contacts/accounts, write survey responses)
- Map NPS tool fields to CRM objects (Account, Contact, custom NPS fields)
- Test connection by sending sample survey and verifying data appears in CRM
- Document admin credentials and access for client handoff

#### Step 3: Configure Survey Design and Branding

**Step Overview:** Customize survey appearance, questions, and follow-up logic to match client brand and objectives. End state: Branded survey templates ready for deployment.

- Customize NPS question wording if needed (standard: "How likely are you to recommend...")
- Add follow-up question for qualitative feedback ("What's the main reason for your score?")
- Configure conditional logic: different follow-ups for Promoters (9-10), Passives (7-8), Detractors (0-6)
- Apply client branding (logo, colors, fonts) to survey templates
- Keep survey short: 2-4 questions maximum for optimal response rates
- Test survey experience on desktop and mobile

---

### Part 3: Build CRM Integration & Workflows

#### Step 1: Create NPS Fields and Objects in CRM

**Step Overview:** Set up CRM data model to store and display NPS responses at account and contact level. End state: CRM configured with NPS fields, history tracking, and proper visibility.

- Create custom fields on Contact: NPS Score, NPS Category (Promoter/Passive/Detractor), NPS Survey Date, NPS Verbatim
- Create custom fields on Account: Latest NPS Score, NPS Trend, NPS Response Count, Last Survey Date
- Configure field-level security and visibility for appropriate roles
- Set up roll-up logic to calculate account-level NPS from contact responses
- Create list views or reports for quick access to recent responses

#### Step 2: Build Detractor Alert Workflow

**Step Overview:** Configure automated alerts to notify CSMs immediately when a detractor response is received. End state: Real-time detractor alerts flowing to CSMs with all context needed for follow-up.

- Define alert trigger: NPS score 0-6 (Detractors)
- Configure notification channel (email, Slack, in-app notification)
- Include in alert: respondent name, account, score, verbatim feedback, CSM owner, account health context
- Set SLA expectations (e.g., CSM follow-up within 48 hours)
- Create task/case automatically in CRM for tracking detractor follow-up
- Test alert workflow end-to-end with sample detractor response

#### Step 3: Build Promoter Identification Workflow

**Step Overview:** Configure workflows to flag promoters for advocacy and referral opportunities. End state: Promoters automatically identified and queued for CS/Marketing follow-up.

- Define promoter trigger: NPS score 9-10
- Create promoter flag or field on Contact/Account
- Configure notification to CSM or Marketing for advocacy follow-up
- Add promoters to potential reference/case study list
- Create task for CSM to thank promoter and explore referral opportunity
- Integrate with referral program if one exists

#### Step 4: Create NPS Reporting Dashboard

**Step Overview:** Build CRM dashboard showing NPS trends, response rates, and segment breakdowns. End state: Executive and operational dashboards live and accessible to stakeholders.

- Build executive dashboard: overall NPS score, trend over time, response rate, Promoter/Passive/Detractor distribution
- Build operational dashboard: NPS by segment (enterprise/SMB, lifecycle stage, CSM), recent responses, open detractor follow-ups
- Include qualitative feedback view for common themes
- Configure dashboard sharing and access permissions
- Schedule automated dashboard distribution to leadership (weekly/monthly)

---

### Part 4: Launch & Pilot Program

#### Step 1: Configure Survey Automation Rules

**Step Overview:** Set up automated survey triggers based on defined touchpoints and business rules. End state: Surveys automatically deploying at the right moments to the right contacts.

- Configure trigger-based sends for each touchpoint (post-onboarding, quarterly, pre-renewal)
- Set up contact exclusion rules (recently surveyed, churned, opted-out)
- Configure survey throttling to prevent over-surveying same contact
- Set up reminder logic (3-7 days after initial send)
- Test automation rules with sample contacts

#### Step 2: Run Pilot with Limited Segment

**Step Overview:** Launch surveys to a controlled pilot group before full rollout to validate configuration and gather initial feedback. End state: Pilot complete with lessons learned and adjustments made.

- Select pilot segment (e.g., one CSM's book of business, one customer segment)
- Announce pilot internally to participating CSMs
- Send initial batch of surveys (50-100 contacts)
- Monitor response rate and score distribution
- Verify CRM data sync and alert workflows firing correctly
- Gather feedback from CSMs on detractor alert experience
- Document issues and make configuration adjustments

#### Step 3: Full Program Launch

**Step Overview:** Roll out NPS program to all customer segments with internal communication and enablement. End state: NPS program fully live with all automation active.

- Announce launch to full CS team with program overview and expectations
- Enable all survey automation rules for remaining segments
- Communicate to customers if appropriate (transparency can increase participation)
- Monitor first week closely for technical issues or unexpected results
- Validate detractor SLA compliance and follow-up quality

---

### Part 5: Enablement & Handoff

#### Step 1: Train Customer Success Team

**Step Overview:** Enable CSMs on how to interpret NPS data, respond to detractors, and leverage promoters. End state: CS team trained and confident in using NPS program.

- Schedule training session (45-60 min) for CS team
- Cover: NPS methodology, how scores map to CRM, detractor follow-up playbook, promoter advocacy tactics
- Train on using dashboards and reports for account planning
- Role-play detractor follow-up conversations
- Create quick-reference guide for CSMs
- Record session for onboarding future team members

#### Step 2: Establish Closed-Loop Process

**Step Overview:** Formalize the cross-functional process for acting on NPS feedback beyond individual detractor follow-up. End state: Documented closed-loop process with clear ownership and cadence.

- Define weekly/monthly NPS review cadence with CS leadership
- Create process for escalating product-related feedback to Product team
- Establish quarterly themes analysis to identify systemic issues
- Document how NPS insights feed into QBRs and renewal planning
- Set up tracking for actions taken based on feedback

#### Step 3: Complete Client Handoff

**Step Overview:** Transfer ownership, documentation, and admin access to client team for ongoing program management. End state: Client self-sufficient with documentation and 30-day support plan.

- Transfer NPS tool admin credentials to client
- Deliver documentation package: configuration settings, automation rules, troubleshooting guide
- Provide runbook for common tasks (adding new survey triggers, modifying questions, pulling reports)
- Schedule 30-day check-in to review initial results and address questions
- Close out project with success metrics review

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) with clean contact data and account hierarchy
- Customer Success team with defined book of business assignments
- Customer lifecycle stages defined in CRM
- Budget approved for NPS tool (if not using native CRM surveys)

**What client must provide:**
- Access to CRM with admin permissions for custom field creation
- List of customer contacts with email addresses and account assignments
- Decisions on survey frequency and touchpoints
- Stakeholder availability for kickoff, demos, and training
- Brand assets (logo, colors) for survey customization

## 5. Common Pitfalls

- **Low response rates undermine data validity**: With only 10-15% response, data may be skewed toward extremes. -> **Mitigation**: Optimize survey timing, keep surveys to 2-4 questions, send reminders at 3-7 days, consider in-app delivery for better engagement.

- **Collecting feedback without acting on it**: Detractors go unfollowed-up, promoters unexploited, leading to customer perception that feedback doesn't matter. -> **Mitigation**: Enforce detractor SLA (48-hour follow-up), build automated alerts, track closed-loop metrics, report on actions taken.

- **Treating NPS as the only health indicator**: NPS only provides a 54% correlation with retention likelihood - it's a signal, not the full picture. -> **Mitigation**: Use NPS alongside product usage data, support ticket trends, and CSM sentiment for complete health scoring.

- **Surveying wrong contacts or roles**: End-user feedback differs from executive sponsor feedback; surveying only one group gives incomplete picture. -> **Mitigation**: Survey multiple stakeholders per account (users, influencers, decision-makers) and segment analysis by role.

## 6. Success Metrics

- **Leading Indicator**: Response rate above 20% within first 30 days; detractor follow-up SLA compliance above 90%
- **Lagging Indicator**: NPS score improvement of 10+ points within 6 months; measurable churn reduction among accounts with detractor-to-passive/promoter conversions

---

