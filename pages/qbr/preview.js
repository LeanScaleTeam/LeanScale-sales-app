/**
 * /qbr/preview — Live preview of a fully-populated QBR
 * No auth, no DB — just sample data so you can see what it looks like.
 * Visit at: /c/demo/qbr/preview  OR  /qbr/preview
 */

import QBRQuarterPage from './[quarter]';

const SAMPLE_CUSTOMER = {
  id: 'preview',
  slug: 'acme',
  customerName: 'Acme Corp',
  customerLogo: null,
  customerType: 'active',
};

const SAMPLE_BASELINE = {
  id: 'baseline',
  quarter: 'Q0-2025',
  quarter_label: 'Q0 2025 Kickoff Baseline',
  is_baseline: true,
  status: 'published',
  wins: [],
  projects_completed: [],
  power10_snapshot: [
    { name: 'ARR',                                   shortName: 'ARR',         ableToReport: 'warning',  statusAgainstPlan: 'warning'  },
    { name: 'Bookings',                              shortName: 'Bookings',    ableToReport: 'careful',  statusAgainstPlan: 'careful'  },
    { name: 'Gross churn',                           shortName: 'Gross Churn', ableToReport: 'unable',   statusAgainstPlan: 'unable'   },
    { name: 'Gross retention',                       shortName: 'GRR',         ableToReport: 'unable',   statusAgainstPlan: 'unable'   },
    { name: 'MQL -> Opportunity conversion rate',    shortName: 'MQL → Opp %', ableToReport: 'careful',  statusAgainstPlan: 'warning'  },
    { name: 'MQL production',                        shortName: 'MQL Volume',  ableToReport: 'warning',  statusAgainstPlan: 'warning'  },
    { name: 'Net retention',                         shortName: 'NRR',         ableToReport: 'unable',   statusAgainstPlan: 'unable'   },
    { name: 'Opportunity/Deal - CW cycle time',      shortName: 'Cycle Time',  ableToReport: 'unable',   statusAgainstPlan: 'unable'   },
    { name: 'Opportunity/Deal -> CW conversion rate',shortName: 'Win Rate',    ableToReport: 'careful',  statusAgainstPlan: 'warning'  },
    { name: 'Pipeline production',                   shortName: 'Pipeline',    ableToReport: 'careful',  statusAgainstPlan: 'careful'  },
  ],
};

const SAMPLE_PREV = {
  id: 'prev',
  quarter: 'Q1-2025',
  quarter_label: 'Q1 2025 Business Review',
  is_baseline: false,
  status: 'published',
  wins: [{ title: 'CRM cleanup' }, { title: 'Lead routing v1' }, { title: 'Pipeline visibility' }],
  projects_completed: [{ name: 'p1' }, { name: 'p2' }, { name: 'p3' }, { name: 'p4' }],
  power10_snapshot: [
    { name: 'ARR',                                   shortName: 'ARR',         ableToReport: 'careful',  statusAgainstPlan: 'careful'  },
    { name: 'Bookings',                              shortName: 'Bookings',    ableToReport: 'careful',  statusAgainstPlan: 'healthy'  },
    { name: 'Gross churn',                           shortName: 'Gross Churn', ableToReport: 'careful',  statusAgainstPlan: 'warning'  },
    { name: 'Gross retention',                       shortName: 'GRR',         ableToReport: 'warning',  statusAgainstPlan: 'unable'   },
    { name: 'MQL -> Opportunity conversion rate',    shortName: 'MQL → Opp %', ableToReport: 'healthy',  statusAgainstPlan: 'careful'  },
    { name: 'MQL production',                        shortName: 'MQL Volume',  ableToReport: 'careful',  statusAgainstPlan: 'careful'  },
    { name: 'Net retention',                         shortName: 'NRR',         ableToReport: 'careful',  statusAgainstPlan: 'warning'  },
    { name: 'Opportunity/Deal - CW cycle time',      shortName: 'Cycle Time',  ableToReport: 'careful',  statusAgainstPlan: 'unable'   },
    { name: 'Opportunity/Deal -> CW conversion rate',shortName: 'Win Rate',    ableToReport: 'healthy',  statusAgainstPlan: 'careful'  },
    { name: 'Pipeline production',                   shortName: 'Pipeline',    ableToReport: 'healthy',  statusAgainstPlan: 'healthy'  },
  ],
};

const SAMPLE_QBR = {
  id: 'preview-q2',
  quarter: 'Q2-2025',
  quarter_label: 'Q2 2025 Business Review',
  period_start: '2025-04-01',
  period_end: '2025-06-30',
  status: 'published',
  is_baseline: false,

  executive_summary: `This quarter marked a major turning point for Acme Corp's go-to-market infrastructure. We completed the CRM data model redesign that had been blocking reliable pipeline reporting, deployed lead routing across all three sales regions, and launched the first automated MQL handoff workflow — cutting average lead response time from 4.2 hours to 22 minutes.

The team is now able to report on 7 of 10 Power metrics cleanly, up from 4 at kickoff. Pipeline is healthy and the funnel is visible end-to-end for the first time. Q3 is positioned to focus entirely on performance and execution now that the infrastructure is solid.`,

  wins: [
    {
      emoji: '🏗️',
      title: 'CRM Data Model Redesign',
      description: 'Rebuilt Salesforce opportunity stages to match the actual sales process. Eliminated 4,200 duplicate records, standardized stage criteria, and created a clean historical baseline.',
      impact_statement: 'Reporting latency cut from 3 days → same day',
    },
    {
      emoji: '⚡',
      title: 'Lead Routing Engine Live',
      description: 'Deployed round-robin routing rules across all 3 sales regions. Integrated with Salesforce assignment rules and added fallback logic for OOO reps.',
      impact_statement: 'Lead response time: 4.2 hrs → 22 min',
    },
    {
      emoji: '📊',
      title: 'Pipeline Dashboard in Salesforce',
      description: 'Built exec-facing pipeline dashboard showing stage velocity, source attribution, and rep-level metrics. Now used in the weekly sales review.',
      impact_statement: '+2 hrs/week saved across leadership',
    },
    {
      emoji: '🔗',
      title: 'HubSpot ↔ Salesforce Sync Stabilized',
      description: 'Resolved the 6-month-old sync issue causing duplicate contacts and missed MQL handoffs. Set up monitoring alerts for future drift.',
      impact_statement: '312 contacts reconciled, 0 sync errors since',
    },
    {
      emoji: '📬',
      title: 'MQL Handoff Workflow',
      description: 'Automated the MQL → SDR assignment workflow with Slack notifications, task creation, and SLA tracking. First workflow to run fully without manual intervention.',
      impact_statement: '100% MQL coverage, up from ~60%',
    },
  ],

  power10_snapshot: [
    { name: 'ARR',                                   shortName: 'ARR',         ableToReport: 'healthy',  statusAgainstPlan: 'careful'  },
    { name: 'Bookings',                              shortName: 'Bookings',    ableToReport: 'healthy',  statusAgainstPlan: 'healthy'  },
    { name: 'Gross churn',                           shortName: 'Gross Churn', ableToReport: 'careful',  statusAgainstPlan: 'careful'  },
    { name: 'Gross retention',                       shortName: 'GRR',         ableToReport: 'careful',  statusAgainstPlan: 'warning'  },
    { name: 'MQL -> Opportunity conversion rate',    shortName: 'MQL → Opp %', ableToReport: 'healthy',  statusAgainstPlan: 'healthy'  },
    { name: 'MQL production',                        shortName: 'MQL Volume',  ableToReport: 'healthy',  statusAgainstPlan: 'careful'  },
    { name: 'Net retention',                         shortName: 'NRR',         ableToReport: 'careful',  statusAgainstPlan: 'careful'  },
    { name: 'Opportunity/Deal - CW cycle time',      shortName: 'Cycle Time',  ableToReport: 'careful',  statusAgainstPlan: 'unable'   },
    { name: 'Opportunity/Deal -> CW conversion rate',shortName: 'Win Rate',    ableToReport: 'healthy',  statusAgainstPlan: 'healthy'  },
    { name: 'Pipeline production',                   shortName: 'Pipeline',    ableToReport: 'healthy',  statusAgainstPlan: 'healthy'  },
  ],

  projects_completed: [
    { phase: 'Phase 1', name: 'CRM Deduplication',          description: 'Cleaned 4,200 duplicate records from Salesforce using custom merge rules.', hours: 14 },
    { phase: 'Phase 1', name: 'Lead Routing Implementation', description: 'Built round-robin routing for 3 sales regions with OOO fallback logic.',    hours: 11 },
    { phase: 'Phase 1', name: 'Pipeline Dashboard',          description: 'Built exec-facing pipeline dashboard with stage velocity and source attribution.', hours: 8 },
    { phase: 'Phase 2', name: 'HubSpot-SFDC Sync Fix',       description: 'Resolved sync drift causing duplicate contacts. Added monitoring and alerting.', hours: 9 },
    { phase: 'Phase 2', name: 'MQL Handoff Workflow',         description: 'Automated MQL → SDR handoff with Slack alerts, task creation, and SLA tracking.', hours: 7 },
    { phase: 'Phase 2', name: 'Sales Stage Criteria Docs',    description: 'Documented entry/exit criteria for all 7 pipeline stages. Shared with entire sales org.', hours: 4 },
  ],

  projects_in_progress: [
    { phase: 'Phase 2', name: 'Forecasting Model Setup',      description: 'Building rep-level and team-level forecast views in Salesforce.', pct_complete: 65 },
    { phase: 'Phase 3', name: 'Outreach Sequence Audit',      description: 'Reviewing all active sequences for performance. Will kill low performers and rebuild top 3.', pct_complete: 30 },
    { phase: 'Phase 3', name: 'Clari Integration',            description: 'Evaluating Clari for AI-assisted forecasting. POC underway with 2 reps.', pct_complete: 20 },
  ],

  accomplishments_markdown: `# Q2 2025 Accomplishments

## Infrastructure
- Rebuilt Salesforce data model from scratch — stages now match actual sales motion
- Eliminated 4,200+ duplicate contact and account records
- Stabilized HubSpot → Salesforce sync (0 errors in 6 weeks)
- Deployed automated field mapping for 14 custom objects

## Process
- Documented entry/exit criteria for all 7 pipeline stages
- Created weekly pipeline review template used by VP Sales
- Defined MQL SLA: 2-hour response required, 22-min average actual

## Reporting
- 7 of 10 Power 10 metrics now reportable (up from 4 at kickoff)
- Real-time pipeline dashboard live in Salesforce
- Weekly automated report sent to exec team every Monday 7am`,

  next_quarter_focus: [
    { priority: 'high',   title: 'Forecasting Model Go-Live',   description: 'Complete the rep-level and team-level forecast rollout in Salesforce. Train all AEs by end of July.' },
    { priority: 'high',   title: 'Clari Integration Decision',  description: 'Complete POC, present ROI analysis, make build vs. buy call on AI forecasting by August.' },
    { priority: 'medium', title: 'Outreach Sequence Rebuild',   description: 'Kill bottom 60% of sequences. Rebuild top 3 with new messaging and A/B test framework.' },
    { priority: 'medium', title: 'NRR Dashboard',               description: 'Build net retention visibility into Salesforce — expansion, contraction, and churn by cohort.' },
    { priority: 'low',    title: 'SDR Onboarding Playbook',     description: 'Document the full SDR stack and process so new hires are productive in week 1, not week 6.' },
  ],

  architect_notes: `Q2 was a grind but the team is in a completely different place than Q0. The CRM work took longer than scoped because the historical data was messier than the client initially disclosed — 4,200 dupes vs the ~400 they estimated. We absorbed that without blowing the budget but it's worth noting for Q3 scoping.\n\nBrian flagged that the VP Sales is now very engaged and wants to expand scope. Watch for scope creep in Q3 — need to keep focus on forecasting before adding new initiatives.\n\nClient satisfaction is high. QBR meeting went well. They mentioned potentially expanding the engagement to cover CS ops in Q4.`,

  hours_used: 53,
  hours_budgeted: 60,
};

export default function QBRPreview() {
  return (
    <QBRQuarterPage
      customer={SAMPLE_CUSTOMER}
      qbr={SAMPLE_QBR}
      baselineQBR={SAMPLE_BASELINE}
      prevQBR={SAMPLE_PREV}
      isAdmin={true}
      slug="acme"
    />
  );
}
