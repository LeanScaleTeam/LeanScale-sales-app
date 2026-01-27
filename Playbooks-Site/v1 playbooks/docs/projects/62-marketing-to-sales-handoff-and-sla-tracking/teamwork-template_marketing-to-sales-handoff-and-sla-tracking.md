# Marketing-to-Sales Handoff & SLA Tracking - Project Details / Task List

**Tag:** `mkt-sales-handoff`
**Total Hours:** 37.5h
**Structure:** Single Milestone (&lt;=50h)

---

## Milestone: Marketing-to-Sales Handoff & SLA Tracking
**Description:** A cross-functional implementation project that establishes clear lead qualification criteria, automated handoff workflows, and measurable SLAs between Marketing and Sales teams to ensure every qualified lead receives timely, consistent follow-up.

---

### Task List: (Mkt-Sales Handoff) 1. Discovery & Configuration
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Audit Current Handoff Process | 2.5h | Document how leads currently flow from Marketing to Sales, including where breakdowns occur. End state: Gap analysis showing current handoff points, SLA gaps, and conversion bottlenecks.<br /><br />• Interview Marketing Ops, Sales Ops, and 2-3 SDRs/AEs on current lead flow<br />• Pull MQL-to-SQL conversion rates from CRM for last 90 days<br />• Document current lead stages and status values in CRM/MAP<br />• Identify where leads are getting stuck or falling through cracks<br />• Measure current average response time to new MQLs<br />• Quantify lead leakage (leads passed but never worked) |
| 2. Align on Definitions and Goals | 2h | Get Marketing and Sales leadership to agree on shared definitions for MQL, SAL (Sales Accepted Lead), and SQL. End state: Documented qualification criteria and success metrics approved by both teams.<br /><br />• Facilitate alignment meeting with Marketing, Sales, and RevOps leadership<br />• Define MQL criteria using firmographics (industry, company size, title) and behavioral signals (demo requests, content engagement, webinar attendance)<br />• Define SQL criteria using frameworks like BANT (Budget, Authority, Need, Timeline)<br />• Agree on SAL stage for Sales acceptance before full qualification<br />• Document shared KPIs: MQL-to-SQL conversion rate, average response time, SLA compliance rate<br />• Get sign-off from VP Marketing and VP Sales on definitions |
| 3. Define SLA Requirements | 2h | Establish specific response time commitments, follow-up cadences, and escalation rules. End state: SLA framework document with timelines, touch requirements, and recycling rules.<br /><br />• Set response time SLA by lead type (e.g., demo requests within 5 minutes, content leads within 4 hours)<br />• Define required follow-up cadence (number of calls, emails, touches)<br />• Establish rules for lead recycling (when unresponsive leads return to Marketing)<br />• Define escalation paths for SLA breaches (manager notification, reassignment)<br />• Document lead rejection criteria and required feedback fields<br />• Get stakeholder approval on SLA commitments |
| 4. Configure Lead Status and Stage Fields | 3h | Set up the CRM and MAP fields needed to track handoff stages and SLA compliance. End state: Lead status picklist and date/time stamp fields configured and documented.<br /><br />• Create or update Lead Status picklist values (New, MQL, SAL, SQL, Recycled, Disqualified)<br />• Add date/time stamp fields for MQL Date, SAL Date, SQL Date<br />• Create First Response Date field to track time-to-first-touch<br />• Add SLA Breach checkbox or formula field<br />• Configure Lead Rejection Reason picklist for Sales feedback<br />• Document field definitions in data dictionary |
| 5. Build Handoff Automation Rules | 3.5h | Configure automation to move leads through handoff stages and trigger notifications. End state: Working automation that routes MQLs to Sales and tracks stage transitions.<br /><br />• Build MQL qualification automation based on scoring threshold or trigger criteria<br />• Configure lead assignment rules (round-robin, territory, account-based)<br />• Set up auto-assignment to SDR queues or specific reps<br />• Create workflow to stamp MQL Date when lead qualifies<br />• Build SAL/SQL stage transition rules based on Sales actions<br />• Test automation with sample leads through full handoff flow |
| 6. Configure SLA Timer and Notifications | 3h | Implement SLA tracking with automated alerts for approaching and breached SLAs. End state: SLA timers active with notifications firing to reps and managers.<br /><br />• Set up SLA timer starting from MQL Date (or assignment time)<br />• Configure tiered notifications: 50% of SLA elapsed, 80% elapsed, SLA breached<br />• Route notifications via email and Slack/Teams integration<br />• Build escalation to manager for SLA breaches<br />• Configure pause/stop conditions for SLA timer (e.g., paused if lead responds)<br />• Set up SLA timer for SAL-to-SQL conversion if applicable |

---

### Task List: (Mkt-Sales Handoff) 2. Reporting, Enablement & Optimization
**Contains:** Parts 3-5

| Task | Est | Description |
|------|-----|-------------|
| 7. Build SLA Compliance Dashboard | 3.5h | Create a dashboard showing real-time SLA performance by rep, team, and lead source. End state: Live dashboard accessible to Sales and Marketing leadership.<br /><br />• Build report showing response time distribution (under SLA, approaching, breached)<br />• Create SLA compliance rate by SDR/AE and by team<br />• Add trending view of SLA performance over time<br />• Include drill-down capability to individual lead records<br />• Configure dashboard filters by date range, lead source, and owner<br />• Share dashboard with Sales leadership, Marketing Ops, and RevOps |
| 8. Build Handoff Conversion Reporting | 3h | Create reports tracking conversion rates through each handoff stage. End state: Funnel reporting showing MQL-to-SAL, SAL-to-SQL, and SQL-to-Opportunity conversion rates.<br /><br />• Build funnel report: MQL > SAL > SQL > Opportunity<br />• Calculate conversion rates at each stage<br />• Add average cycle time between stages<br />• Create report showing rejection reasons and volumes<br />• Build lead source performance by conversion rate<br />• Set up scheduled report delivery to stakeholders |
| 9. Create Feedback Loop Reporting | 2.5h | Build reporting that captures Sales feedback on lead quality to improve Marketing targeting. End state: Lead quality feedback visible to Marketing with actionable insights.<br /><br />• Build report on Lead Rejection Reasons by volume and trend<br />• Create lead quality score based on SAL acceptance rate by source/campaign<br />• Build report showing which Marketing campaigns produce highest SQL conversion<br />• Set up weekly digest of rejection feedback to Marketing Ops<br />• Document process for Marketing to act on feedback data |
| 10. Create Process Documentation | 2h | Document the handoff process, SLAs, and system instructions in SOPs and quick-reference guides. End state: Published documentation accessible to all stakeholders.<br /><br />• Write SLA playbook with response time requirements and escalation paths<br />• Create SDR/AE quick-reference guide for lead handling<br />• Document CRM field definitions and status transition rules<br />• Build FAQ document addressing common questions<br />• Create process flow diagram showing handoff stages<br />• Publish documentation in team wiki or knowledge base |
| 11. Conduct Team Training | 2h | Train Sales and Marketing teams on the new handoff process, SLAs, and reporting. End state: Teams trained and equipped to follow the new process.<br /><br />• Schedule training session for SDR/AE team (30-45 minutes)<br />• Cover: lead status definitions, SLA requirements, CRM actions required<br />• Demo the SLA notifications and what to do when alerts fire<br />• Walk through dashboards and how to check personal SLA performance<br />• Train Marketing Ops on feedback loop reporting<br />• Send recording and documentation to all attendees |
| 12. Launch and Validate | 2h | Go live with the new process and validate that automation, notifications, and reporting are working correctly. End state: Process live with confirmed functionality.<br /><br />• Activate all automation and SLA timers<br />• Monitor first 24-48 hours for any automation errors<br />• Verify notifications are reaching correct recipients<br />• Test dashboard data accuracy with sample lead records<br />• Confirm SLA timers are calculating correctly<br />• Address any issues identified during validation |
| 13. Conduct 30-Day Review | 2.5h | Review SLA performance and process adoption at 30 days post-launch. End state: Performance baseline established with initial optimization recommendations.<br /><br />• Pull SLA compliance metrics for first 30 days<br />• Calculate MQL-to-SQL conversion rate vs. baseline<br />• Review rejection reasons and lead quality feedback<br />• Gather qualitative feedback from SDRs and Marketing<br />• Identify any automation or notification issues<br />• Document optimization recommendations |
| 14. Iterate and Refine | 2h | Implement improvements based on 30-day review findings and establish ongoing governance. End state: Optimized process with regular review cadence established.<br /><br />• Adjust SLA timers if response time targets need refinement<br />• Update MQL qualification criteria based on Sales feedback<br />• Refine notification timing or escalation rules as needed<br />• Schedule monthly Sales-Marketing alignment meeting<br />• Set up quarterly SLA review cadence<br />• Hand off ongoing monitoring to RevOps owner |

---

## Summary
- **Total Task Lists:** 2 (consolidated from 5 Parts)
- **Total Tasks:** 14 (one per Step)
- **Total Hours:** 37.5h
- **Generated from:** playbook_marketing-to-sales-handoff-and-sla-tracking.md
- **Generated on:** 2025-12-31
