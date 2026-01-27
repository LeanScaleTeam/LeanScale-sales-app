# Speed-to-Lead - Project Details / Task List

**Tag:** `speed-to-lead`
**Total Hours:** 75h
**Structure:** Multi-Milestone (>50h)

---

## Milestone 1: Speed-to-Lead - 1. Discovery, SLA Design & Configuration
**Tag:** `speed-to-lead`
**Description:** Assess current lead flow, identify bottlenecks, design SLA framework, configure routing automation, and build dashboards
**Hours:** 53h

### Task List: (Speed-to-Lead) 1. Discovery & SLA Framework
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Map Current Lead Flow End-to-End | 3h | Document how leads currently flow from capture to first sales touch across all systems. End state: Visual process map showing every handoff point and system involved.<br /><br />• Identify all lead sources (web forms, chat, paid media, events, content syndication)<br />• Trace lead path through MAP, CRM, and any routing tools (Chili Piper, LeanData, etc.)<br />• Document each system handoff and data transformation point<br />• Note where manual intervention is required vs. automated<br />• Create swimlane diagram showing marketing, RevOps, and sales touchpoints |
| 2. Measure Current Lead Response Times | 2.5h | Establish baseline metrics for how long leads currently wait before first contact. End state: Quantified baseline showing actual response times by lead source and segment.<br /><br />• Pull lead response time data from CRM for last 90 days<br />• Segment by lead source (demo request vs. content download vs. event)<br />• Calculate average, median, and 90th percentile response times<br />• Identify which lead types have longest delays<br />• Document current SLAs (if any exist) and actual performance against them |
| 3. Identify Bottlenecks and Delay Sources | 3h | Pinpoint specific causes of delay in the lead management process. End state: Prioritized list of bottlenecks with estimated time impact of each.<br /><br />• Analyze where leads queue longest (system transitions, assignment, follow-up)<br />• Check for data quality issues causing routing failures or manual intervention<br />• Review enrichment processes for delays (batch vs. real-time)<br />• Interview 3-5 sales reps/BDRs on pain points and perceived delays<br />• Interview 1-2 marketing ops team members on lead handoff challenges |
| 4. Define Intent-Based Lead Segmentation | 2.5h | Create lead categories based on buying intent signals to enable differentiated response time targets. End state: Documented lead segmentation model with clear criteria for each tier.<br /><br />• Define high-intent indicators (demo requests, pricing page visits, competitor comparisons)<br />• Define medium-intent indicators (content downloads, webinar attendance)<br />• Define low-intent indicators (general newsletter, trade show booth scans)<br />• Map existing lead scoring to intent tiers (or design scoring if none exists)<br />• Document routing priority for each segment |
| 5. Establish Response Time SLAs by Segment | 2h | Set specific, measurable response time targets for each lead segment. End state: Documented SLA framework approved by sales and marketing leadership.<br /><br />• Set SLA for high-intent leads (recommend 5-10 minutes)<br />• Set SLA for medium-intent leads (recommend 1-4 hours)<br />• Set SLA for low-intent leads (recommend 24 hours)<br />• Define what constitutes "response" (call attempt, email, meeting scheduled)<br />• Get sign-off from VP Sales and VP Marketing on SLA targets |
| 6. Design Optimized Routing Logic | 3h | Architect the routing rules that will get the right lead to the right rep at the right time. End state: Documented routing logic ready for implementation.<br /><br />• Define routing criteria (territory, account ownership, round-robin, capacity-based)<br />• Design escalation paths when assigned rep doesn't respond within SLA<br />• Plan for edge cases (no territory match, existing account, named accounts)<br />• Map rep capacity and availability considerations (PTO, working hours)<br />• Document fallback routing for after-hours and overflow scenarios |

---

### Task List: (Speed-to-Lead) 2. Configuration & Dashboards
**Contains:** Parts 3-4

| Task | Est | Description |
|------|-----|-------------|
| 7. Configure Lead Routing Automation | 4h | Implement automated routing rules in the routing tool (Chili Piper, LeanData, or native CRM). End state: Leads automatically route to correct rep within seconds of creation.<br /><br />• Build routing rules based on approved logic document<br />• Configure assignment priorities and weighting<br />• Set up account matching to route to existing account owners<br />• Configure round-robin pools with availability/capacity settings<br />• Test routing with sample leads across all segments and territories |
| 8. Implement Real-Time Enrichment Pipeline | 3.5h | Ensure lead data is enriched before routing to enable accurate assignment and rep context. End state: Leads enriched with company/contact data in real-time before assignment.<br /><br />• Configure enrichment tool (ZoomInfo, Apollo, Clearbit) for real-time firing<br />• Map enrichment fields to CRM fields (company size, industry, tech stack)<br />• Set fallback values for leads that don't match enrichment databases<br />• Test enrichment latency to ensure it doesn't delay routing<br />• Verify enriched data flows correctly to rep views |
| 9. Build SLA Tracking Fields and Automation | 4h | Create the data infrastructure to measure and enforce SLAs. End state: CRM captures timestamps and calculates SLA status automatically.<br /><br />• Create timestamp fields: Lead Created, First Assigned, First Touch Attempt<br />• Build formula/workflow to calculate response time in minutes<br />• Create SLA Status field (Met, At Risk, Breached)<br />• Configure real-time alerts when leads approach SLA breach<br />• Set up automated escalation when SLA is breached (reassign or notify manager) |
| 10. Configure Rep Notification System | 3h | Ensure reps are immediately notified of new lead assignments through their preferred channels. End state: Multi-channel notifications that reps actually see and act on.<br /><br />• Configure email notifications for new lead assignments<br />• Set up Slack/Teams notifications for real-time alerts<br />• Configure mobile push notifications if available<br />• Include lead context in notifications (name, company, intent signal, SLA countdown)<br />• Test notification delivery speed and visibility with pilot reps |
| 11. Build Real-Time SLA Performance Dashboard | 4h | Create a live dashboard showing current SLA status across all leads and reps. End state: Leadership and reps can see real-time SLA performance at a glance.<br /><br />• Build lead queue view showing open leads by SLA status (green/yellow/red)<br />• Create rep-level SLA scorecard showing individual performance<br />• Add trend line showing average response time over rolling 7/30 days<br />• Include drill-down capability to see individual lead details<br />• Ensure dashboard auto-refreshes for real-time monitoring |
| 12. Build SLA Compliance Reporting | 3.5h | Create weekly/monthly reports for SLA performance review and accountability. End state: Automated reports delivered to leadership showing compliance trends.<br /><br />• Build SLA compliance report by rep (% of leads contacted within SLA)<br />• Build SLA compliance report by lead source/segment<br />• Create trend analysis showing improvement over time<br />• Include breakdown of breach reasons (after hours, rep overload, routing issue)<br />• Schedule automated report delivery to sales and marketing leadership |
| 13. Build Conversion Impact Analysis | 3.5h | Create reporting that ties response time to downstream conversion metrics. End state: Clear visibility into how speed-to-lead impacts pipeline and revenue.<br /><br />• Build report showing conversion rate by response time bucket<br />• Calculate pipeline value generated from SLA-compliant vs. breached leads<br />• Create comparison of before/after implementation metrics<br />• Track win rate correlation with response time<br />• Document ROI methodology for executive reporting |

---

## Milestone 2: Speed-to-Lead - 2. Rollout & Optimization
**Tag:** `speed-to-lead`
**Description:** Train teams, execute pilot and full rollout, optimize performance, and hand off to client
**Hours:** 22h

### Task List: (Speed-to-Lead) 3. Rollout & Optimization
**Contains:** Parts 5-6

| Task | Est | Description |
|------|-----|-------------|
| 14. Conduct Rep Training on New Process | 2h | Train sales reps and BDRs on the new lead notification, response expectations, and SLA tracking. End state: All reps understand the new process and their accountability.<br /><br />• Schedule 30-45 minute training session for sales team<br />• Cover: new notification system, SLA expectations, escalation process<br />• Demonstrate how to view their SLA dashboard and lead queue<br />• Walk through the "ideal response" workflow<br />• Address questions and concerns about accountability |
| 15. Create Process Documentation | 2h | Document the new speed-to-lead process for ongoing reference and new hire onboarding. End state: Complete process documentation accessible to all stakeholders.<br /><br />• Create quick-reference guide for reps (1-pager on response workflow)<br />• Document routing rules and logic for RevOps maintenance<br />• Create SLA definitions and measurement methodology doc<br />• Build FAQ for common scenarios and edge cases<br />• Store documentation in team wiki/knowledge base |
| 16. Execute Pilot Rollout | 4h | Launch with a pilot group before full rollout to identify issues. End state: Pilot complete with lessons learned documented.<br /><br />• Select pilot group (1-2 territories or specific rep team)<br />• Run pilot for 1-2 weeks with close monitoring<br />• Gather pilot rep feedback on notification effectiveness and workload<br />• Identify and fix any routing errors or system issues<br />• Document changes needed before full rollout |
| 17. Execute Full Rollout | 3h | Launch the new speed-to-lead process across the entire sales organization. End state: All reps live on new process with full SLA tracking active.<br /><br />• Communicate launch to full sales team<br />• Enable routing and notifications for all territories<br />• Monitor first 48 hours closely for issues<br />• Provide real-time support for rep questions<br />• Send day-1 and week-1 performance snapshots to leadership |
| 18. Conduct 2-Week Performance Review | 3.5h | Analyze initial performance data and make adjustments. End state: Performance baseline established with initial optimizations implemented.<br /><br />• Review SLA compliance rates across all segments<br />• Identify underperforming areas (specific reps, lead sources, time periods)<br />• Adjust routing rules based on actual capacity/performance<br />• Fine-tune notification cadence if reps report alert fatigue<br />• Implement quick wins identified during review |
| 19. Deliver Executive Summary | 2.5h | Present results and impact to leadership with recommendations for ongoing optimization. End state: Leadership aligned on results and next steps.<br /><br />• Compile before/after metrics comparison<br />• Calculate ROI based on conversion improvement<br />• Present findings to VP Sales and VP Marketing<br />• Provide recommendations for continued improvement<br />• Document any out-of-scope items for future phases |
| 20. Hand Off to Client RevOps | 3h | Transfer ownership and documentation to client team for ongoing management. End state: Client self-sufficient with admin access and maintenance runbooks.<br /><br />• Transfer admin credentials and access to client RevOps<br />• Walk through routing rule maintenance procedures<br />• Review SLA threshold adjustment process<br />• Deliver complete documentation package<br />• Schedule 30-day check-in call<br />• Close out project |

---

## Summary
- **Total Milestones:** 2 (53h + 22h)
- **Total Task Lists:** 3 (consolidated from 6 Parts)
- **Total Tasks:** 20 (one per Step)
- **Total Hours:** 75h
- **Generated from:** playbook_speed-to-lead.md
- **Generated on:** 2025-12-31
