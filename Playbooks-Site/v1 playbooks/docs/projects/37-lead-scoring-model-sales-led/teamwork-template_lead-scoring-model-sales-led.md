# Lead Scoring Model (Sales-Led) - Project Details / Task List

**Tag:** `lead-scoring`
**Total Hours:** 40h
**Structure:** Single Milestone (&lt;=50h)

---

## Milestone: Lead Scoring Model (Sales-Led)
**Description:** A strategic and technical implementation project that designs, builds, and deploys a systematic lead scoring model in the CRM/marketing automation platform to prioritize leads based on fit and engagement for a sales-led GTM motion.

---

### Task List: (Lead Scoring) 1. Discovery & Model Build
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Audit Current Lead Data and Processes | 2.5h | Assess the current state of lead data quality, existing scoring (if any), and the lead handoff process between marketing and sales. End state: Gap analysis document showing what data exists, what's missing, and current pain points.<br /><br />• Pull sample of 50-100 recent leads from CRM to assess data completeness<br />• Inventory available data fields: demographic (title, company size, industry), firmographic (revenue, employee count), and behavioral (page views, email engagement, form fills)<br />• Interview 2-3 sales reps on current lead quality issues and what signals they use to prioritize<br />• Document current MQL definition and handoff process (if any exists)<br />• Identify data gaps that will need enrichment or new tracking |
| 2. Define Ideal Customer Profile (ICP) Criteria | 3h | Establish the firmographic and demographic attributes that define an ideal customer for scoring purposes. End state: Documented ICP criteria with weighted importance for each attribute.<br /><br />• Analyze closed-won deals from past 12 months to identify common attributes<br />• Define primary ICP attributes: industry, company size, revenue range, geography<br />• Define secondary attributes: tech stack, growth signals, funding stage<br />• Create tiered scoring for each attribute (e.g., exact match = 20 pts, adjacent = 10 pts, poor fit = 0 pts)<br />• Validate ICP criteria with sales leadership to ensure alignment |
| 3. Map Behavioral Engagement Signals | 3h | Identify and weight the behavioral actions that indicate buying intent. End state: Documented list of engagement signals with point values assigned.<br /><br />• Catalog all trackable behaviors: website visits, specific page views (pricing, demo, case studies), email opens/clicks, form submissions, content downloads<br />• Classify behaviors by intent level: high-intent (demo request, pricing page), medium-intent (case study download, webinar attendance), low-intent (blog visit, email open)<br />• Assign point values based on intent correlation (e.g., demo request = 50 pts, pricing page = 30 pts, blog visit = 5 pts)<br />• Define negative scoring triggers: competitor company, student email, unsubscribe, bounced emails<br />• Establish time decay rules (e.g., subtract 10 pts for every 30 days of no engagement) |
| 4. Design Scoring Model Architecture | 3.5h | Create the complete scoring model framework combining fit and engagement scores with defined thresholds. End state: Documented scoring model with all criteria, point values, and threshold definitions.<br /><br />• Create combined scoring model: Fit Score (0-100) + Engagement Score (0-100) = Total Score<br />• Define MQL threshold (e.g., Fit Score >= 50 AND Engagement Score >= 25)<br />• Define SQL threshold (e.g., Total Score >= 75 with recent high-intent action)<br />• Document score calculation logic for all attributes and behaviors<br />• Build scoring matrix showing how different lead profiles would score |
| 5. Configure Lead Scoring in CRM/Marketing Automation | 4.5h | Implement the scoring model in HubSpot, Marketo, or Salesforce with all criteria and automation rules. End state: Working scoring system calculating scores for all leads in real-time.<br /><br />• Create custom score fields in CRM (Fit Score, Engagement Score, Total Score, Score Date)<br />• Build scoring rules for demographic/firmographic criteria in marketing automation platform<br />• Configure behavioral scoring triggers for website, email, and form engagement<br />• Set up negative scoring automation (competitor domains, disqualifying titles, time decay)<br />• Create automation to recalculate scores on relevant events |
| 6. Build MQL Threshold Automation and Notifications | 3.5h | Configure automated workflows that trigger when leads cross MQL threshold. End state: Leads automatically flagged as MQL and routed to sales with appropriate notifications.<br /><br />• Build workflow to update lead status to MQL when threshold is met<br />• Configure sales notification (email/Slack) when new MQLs are created<br />• Create lead assignment rules or integration with routing system<br />• Set up re-MQL logic for leads that drop below and return above threshold<br />• Document automation logic for ongoing maintenance |

---

### Task List: (Lead Scoring) 2. Validation & Enablement
**Contains:** Parts 3-4

| Task | Est | Description |
|------|-----|-------------|
| 7. Validate Scoring Model with Historical Data | 3h | Test the scoring model against historical lead and opportunity data to validate predictive accuracy. End state: Validation report showing correlation between scores and conversion outcomes.<br /><br />• Score a sample of 200+ historical leads (mix of won, lost, and disqualified)<br />• Analyze score distribution: Do won deals cluster at higher scores?<br />• Calculate conversion rates by score band (0-25, 26-50, 51-75, 76-100)<br />• Identify any criteria that are over-weighted or under-weighted<br />• Adjust point values based on analysis findings |
| 8. Conduct Pilot Test with Sales Team | 3.5h | Run a 2-week pilot with a subset of the sales team using the new scoring model. End state: Pilot feedback collected and model adjustments identified.<br /><br />• Select 3-5 reps for pilot program<br />• Brief pilot reps on scoring methodology and how to interpret scores<br />• Have reps work scored leads for 2 weeks and track outcomes<br />• Collect feedback via survey and 1:1 interviews on score accuracy<br />• Document model adjustments needed based on pilot learnings |
| 9. Refine Model Based on Feedback | 2.5h | Make final adjustments to scoring criteria and thresholds based on validation and pilot feedback. End state: Production-ready scoring model with stakeholder approval.<br /><br />• Adjust point values for criteria that pilot identified as over/under-valued<br />• Fine-tune MQL/SQL thresholds if conversion rates are too high or low<br />• Update time decay rules if needed based on actual sales cycle length<br />• Get sign-off from sales and marketing leadership on final model<br />• Document final scoring model configuration for ongoing reference |
| 10. Train Sales Team on Lead Scoring System | 2.5h | Enable the full sales team to understand and effectively use the new lead scoring system. End state: Sales team trained with documentation and able to leverage scores in daily workflow.<br /><br />• Schedule training session (45-60 min) for full sales team<br />• Explain scoring methodology: what fit and engagement scores mean<br />• Demonstrate how to view and filter leads by score in CRM<br />• Provide quick-reference guide showing score interpretation and recommended actions<br />• Address questions and common scenarios (e.g., high fit / low engagement leads) |
| 11. Create Monitoring Dashboards and Reports | 4h | Build dashboards to monitor scoring model performance and lead quality metrics. End state: Live dashboards showing scoring distribution, MQL volume, and conversion rates by score band.<br /><br />• Create lead score distribution dashboard (histogram of current scores)<br />• Build MQL-to-SQL conversion tracking by score band<br />• Set up weekly/monthly report on scoring model health metrics<br />• Configure alerts for anomalies (sudden score inflation, MQL volume spikes)<br />• Document dashboard locations and metrics definitions |
| 12. Document and Hand Off to Client | 4h | Transfer ownership and complete documentation to client RevOps/Marketing Ops team. End state: Client team self-sufficient with admin access, runbooks, and optimization playbook.<br /><br />• Create scoring model documentation: all criteria, point values, thresholds<br />• Document automation workflows and where they live in the platform<br />• Build troubleshooting guide for common issues (score not updating, wrong MQL status)<br />• Provide optimization playbook: how to review and adjust scores quarterly<br />• Transfer admin access and schedule 30-day check-in call |

---

## Summary
- **Total Task Lists:** 2 (consolidated from 4 Parts)
- **Total Tasks:** 12 (one per Step)
- **Total Hours:** 40h
- **Generated from:** playbook_lead-scoring-model-sales-led.md
- **Generated on:** 2025-12-31
