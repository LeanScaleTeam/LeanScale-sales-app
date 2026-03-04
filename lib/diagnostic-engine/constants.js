/**
 * Diagnostic v2 Constants
 *
 * 22 diagnostic items across 4 layers (Foundation/Motions/Maturity/PlatformHealth).
 * Defines item metadata, grading thresholds, weights, and status values.
 */

export const STATUS_NUMERIC = {
  healthy: 3,
  careful: 2,
  warning: 1,
};

export const LAYER_WEIGHTS = {
  foundation: 0.40,
  motions: 0.35,
  maturity: 0.25,
};

export const SALESFORCE_LAYER_WEIGHTS = {
  foundation: 0.35,
  motions: 0.30,
  maturity: 0.20,
  platformHealth: 0.15,
};

/**
 * Source types determine where grading data comes from.
 */
export const SOURCE_TYPES = {
  API_ONLY: 'API_ONLY',       // Graded entirely from CRM metadata signals
  API_PLUS: 'API_PLUS',       // Graded from metadata + intake answers
  INTAKE_ONLY: 'INTAKE_ONLY', // Graded entirely from intake answers
};

/**
 * The 17 diagnostic items.
 */
export const DIAGNOSTIC_ITEMS = [
  // Foundation (F1-F6) — mostly API_ONLY
  {
    id: 'F1',
    name: 'CRM Data Model',
    layer: 'foundation',
    source: SOURCE_TYPES.API_ONLY,
    weight: 2,
    serviceIds: ['hubspot-impl', 'crm-deduplication'],
    description: 'Quality and completeness of CRM properties, custom objects, and data enrichment.',
    primaryFunction: 'Cross Functional',
    outcomes: ['Improve Data Quality', 'Scale Operations'],
    power10Metrics: ['Pipeline production'],
    impactTemplate: 'Incomplete data model means {repCount} reps manually track critical deal information outside CRM, reducing forecast accuracy and pipeline visibility.',
    outcomeStatement: 'Clean, enriched CRM data model with standardized properties driving accurate reporting across all GTM functions.',
  },
  {
    id: 'F2',
    name: 'Pipeline Design',
    layer: 'foundation',
    source: SOURCE_TYPES.API_ONLY,
    weight: 2,
    serviceIds: ['sales-lifecycle'],
    description: 'Deal and ticket pipeline structure, stages, probabilities, and hygiene.',
    primaryFunction: 'Sales',
    outcomes: ['Increase Pipeline', 'Improve Sales Efficiency'],
    power10Metrics: ['Pipeline production', 'Opportunity/Deal -> CW conversion rate'],
    impactTemplate: 'Poor pipeline structure makes forecasting unreliable and hides deal velocity issues — at {arrRange} ARR this directly impacts board-level reporting accuracy.',
    outcomeStatement: 'Well-structured pipeline with accurate stage probabilities enabling reliable forecasting and velocity tracking.',
  },
  {
    id: 'F3',
    name: 'Lifecycle & Lead Status',
    layer: 'foundation',
    source: SOURCE_TYPES.API_ONLY,
    weight: 2,
    serviceIds: ['gtm-lifecycle', 'lead-lifecycle'],
    description: 'Automation of lifecycle stage and lead status transitions across objects.',
    primaryFunction: 'Cross Functional',
    outcomes: ['Improve Data Quality', 'Scale Operations'],
    power10Metrics: ['MQL -> Opportunity conversion rate', 'Gross retention'],
    impactTemplate: 'Without automated lifecycle tracking, leads slip through the cracks and conversion metrics can\'t be trusted — companies your size typically lose 15-25% of qualified leads to poor handoff.',
    outcomeStatement: 'Automated lifecycle progression with real-time stage tracking across all objects.',
  },
  {
    id: 'F4',
    name: 'Automation Engine',
    layer: 'foundation',
    source: SOURCE_TYPES.API_ONLY,
    weight: 2,
    serviceIds: ['foundational-automations-and-reporting-logic'],
    description: 'Breadth and depth of workflow automation across GTM functions.',
    primaryFunction: 'Cross Functional',
    outcomes: ['Scale Operations', 'Improve Data Quality'],
    power10Metrics: ['Pipeline production'],
    impactTemplate: 'Manual processes consume ~{hours}hrs/week across your team — automation eliminates repetitive work and ensures data consistency.',
    outcomeStatement: 'Comprehensive automation covering task creation, notifications, lifecycle transitions, and data sync.',
  },
  {
    id: 'F5',
    name: 'Team & Ownership',
    layer: 'foundation',
    source: SOURCE_TYPES.API_ONLY,
    weight: 2,
    serviceIds: ['hubspot-impl'],
    description: 'Owner assignments, team structure, and functional coverage.',
    primaryFunction: 'Cross Functional',
    outcomes: ['Scale Operations', 'Improve Sales Efficiency'],
    power10Metrics: ['Pipeline production', 'Bookings'],
    impactTemplate: 'Unassigned or misrouted records mean lost revenue — with {repCount} reps, orphaned leads directly impact pipeline coverage.',
    outcomeStatement: 'Every record has a clear owner with team structure enabling accurate territory and performance reporting.',
  },
  {
    id: 'F6',
    name: 'Data Enrichment',
    layer: 'foundation',
    source: SOURCE_TYPES.API_ONLY,
    weight: 2,
    serviceIds: ['automated-inbound-data-enrichment', 'clay-impl'],
    description: 'Third-party data enrichment tools detected and field coverage.',
    primaryFunction: 'Marketing',
    outcomes: ['Improve Data Quality', 'Increase Pipeline'],
    power10Metrics: ['MQL production', 'Pipeline production'],
    impactTemplate: 'Without enrichment, reps spend 20-30% of their time researching prospects instead of selling — at {repCount} reps that\'s significant lost selling time.',
    outcomeStatement: 'Automated enrichment on inbound leads and accounts with complete firmographic and technographic coverage.',
  },

  // Motions (M1-M7) — API_PLUS
  {
    id: 'M1',
    name: 'Inbound Lead Flow',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['lead-routing', 'speed-to-lead', 'website-lead-capture-and-form-configuration', 'lead-scoring-model-sales-led'],
    description: 'Inbound lead capture, routing, response time, and qualification processes.',
    primaryFunction: 'Marketing',
    outcomes: ['Increase Pipeline', 'Improve Sales Efficiency'],
    power10Metrics: ['MQL -> Opportunity conversion rate', 'MQL production', 'Pipeline production'],
    impactTemplate: 'Without lead routing and scoring, reps cherry-pick or leads go cold — companies your size typically lose 20-30% of inbound leads to slow response.',
    outcomeStatement: 'Speed-to-lead under 5 minutes with automated routing, scoring, and qualification.',
  },
  {
    id: 'M2',
    name: 'Marketing Email & Nurture',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['email-operations-nurture-program', 'marketing-automation-platform-implementation', 'marketing-database-segmentation'],
    description: 'Email marketing programs, nurture sequences, and list segmentation.',
    primaryFunction: 'Marketing',
    outcomes: ['Increase Pipeline', 'Scale Operations'],
    power10Metrics: ['MQL production', 'Pipeline production'],
    impactTemplate: 'Without nurture programs, non-ready leads are lost — proper nurture typically recovers 10-15% of leads that would otherwise never convert.',
    outcomeStatement: 'Segmented nurture programs converting awareness into pipeline with measurable attribution.',
  },
  {
    id: 'M3',
    name: 'Sales Execution',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['activity-capture', 'sales-qualification-methodology', 'automated-outbound-process', 'sales-engagement-platform'],
    description: 'Sales process automation, qualification methodology, and activity capture.',
    primaryFunction: 'Sales',
    outcomes: ['Improve Sales Efficiency', 'Increase Pipeline'],
    power10Metrics: ['Opportunity/Deal -> CW conversion rate', 'Pipeline production', 'Bookings'],
    impactTemplate: 'Without a structured sales process, win rates suffer — a 5% improvement in qualification accuracy at {arrRange} ARR has significant impact on bookings.',
    outcomeStatement: 'Structured qualification methodology with automated activity capture and outbound sequences.',
  },
  {
    id: 'M4',
    name: 'Attribution & Source Tracking',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['lead-and-opportunity-attribution', 'marketing-reporting-pack'],
    description: 'Lead source tracking, attribution models, and campaign measurement.',
    primaryFunction: 'Marketing',
    outcomes: ['Optimize Reporting', 'Increase Pipeline'],
    power10Metrics: ['MQL -> Opportunity conversion rate', 'MQL production'],
    impactTemplate: 'Without attribution, marketing spend is unoptimized — you can\'t double down on what works or cut what doesn\'t.',
    outcomeStatement: 'Multi-touch attribution model showing marketing\'s true impact on pipeline and revenue.',
  },
  {
    id: 'M5',
    name: 'Deal-to-Close Process',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['cpq-implementation', 'e-signature-implementation', 'clm-implementation', 'quote-to-cash'],
    description: 'Proposal, contract, and closing processes including CPQ and e-signature.',
    primaryFunction: 'Sales',
    outcomes: ['Improve Sales Efficiency'],
    power10Metrics: ['Opportunity/Deal - CW cycle time', 'Opportunity/Deal -> CW conversion rate', 'Bookings'],
    impactTemplate: 'Manual quoting and contracting adds days to deal cycles — at {arrRange} ARR, reducing cycle time by even a week accelerates cash collection.',
    outcomeStatement: 'Streamlined quote-to-close process with CPQ, e-signature, and automated handoff.',
  },
  {
    id: 'M6',
    name: 'Customer Onboarding & Success',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['sales-to-cs-handoff-process-implementation', 'customer-success-platform-implementation', 'customer-health-model', 'nps-and-voice-of-customer-launch', 'renewal-management'],
    description: 'Post-sale handoff, onboarding, health scoring, and renewal processes.',
    primaryFunction: 'Customer Success',
    outcomes: ['Reduce Churn', 'Scale Operations'],
    power10Metrics: ['Gross churn', 'Gross retention', 'Net retention'],
    impactTemplate: 'Without proactive CS processes, churn is reactive — a 2% improvement in gross retention at {arrRange} ARR has a direct bottom-line impact.',
    outcomeStatement: 'Proactive customer success with health scoring, automated handoff, and renewal management.',
  },
  {
    id: 'M7',
    name: 'Partner & Channel Ops',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['partnership-success-platform-implementation'],
    description: 'Partner program operations, deal tracking, and referral processes.',
    primaryFunction: 'Partnerships',
    outcomes: ['Increase Pipeline', 'Scale Operations'],
    power10Metrics: ['Pipeline production'],
    impactTemplate: 'Without partner tracking, you can\'t measure channel ROI or optimize partner-sourced pipeline.',
    outcomeStatement: 'Structured partner program with deal registration, tracking, and performance reporting.',
  },

  // Maturity (R1-R4) — mostly INTAKE_ONLY
  {
    id: 'R1',
    name: 'Executive Reporting',
    layer: 'maturity',
    source: SOURCE_TYPES.INTAKE_ONLY,
    weight: 1,
    serviceIds: ['executive-reporting-suite', 'monthly-quarterly-gtm-reporting-pack'],
    description: 'Dashboard quality, trust level, and executive adoption of CRM reporting.',
    primaryFunction: 'Cross Functional',
    outcomes: ['Optimize Reporting'],
    power10Metrics: ['ARR', 'Bookings', 'Pipeline production'],
    impactTemplate: 'Without trusted dashboards, leadership decisions are based on gut feel — reporting gaps delay strategic pivots by weeks.',
    outcomeStatement: 'Board-ready dashboards with automated reporting cadence trusted by the executive team.',
  },
  {
    id: 'R2',
    name: 'Revenue Metrics (Power 10)',
    layer: 'maturity',
    source: SOURCE_TYPES.INTAKE_ONLY,
    weight: 1,
    serviceIds: ['arr-reporting', 'executive-reporting-suite'],
    description: 'Ability to report on 10 key revenue metrics from CRM data.',
    primaryFunction: 'Cross Functional',
    outcomes: ['Optimize Reporting'],
    power10Metrics: ['ARR', 'Bookings', 'Gross churn', 'Gross retention', 'MQL -> Opportunity conversion rate', 'MQL production', 'Net retention', 'Opportunity/Deal - CW cycle time', 'Opportunity/Deal -> CW conversion rate', 'Pipeline production'],
    impactTemplate: 'Without automated revenue metrics, critical pipeline and retention numbers remain unmeasured — blind spots that hide revenue leakage.',
    outcomeStatement: 'All 10 revenue metrics automated with trend analysis and benchmarking.',
  },
  {
    id: 'R3',
    name: 'Forecasting & Planning',
    layer: 'maturity',
    source: SOURCE_TYPES.INTAKE_ONLY,
    weight: 1,
    serviceIds: ['forecasting-process-implementation', 'growth-model', 'quotas-and-target-setting'],
    description: 'Sales forecasting methodology, quota setting, and growth planning.',
    primaryFunction: 'Sales',
    outcomes: ['Optimize Reporting', 'Improve Sales Efficiency'],
    power10Metrics: ['Bookings', 'Pipeline production', 'ARR'],
    impactTemplate: 'Without a forecasting process, the board gets surprises instead of predictions — this erodes confidence and delays funding decisions.',
    outcomeStatement: 'Structured forecasting with commit categories, quota-to-capacity alignment, and growth modeling.',
  },
  {
    id: 'R4',
    name: 'Win/Loss & Competitive Intel',
    layer: 'maturity',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1,
    serviceIds: ['sales-qualification-methodology', 'conversation-intelligence-platform-implementation'],
    description: 'Win/loss analysis processes and competitive intelligence tracking.',
    primaryFunction: 'Sales',
    outcomes: ['Improve Sales Efficiency', 'Optimize Reporting'],
    power10Metrics: ['Opportunity/Deal -> CW conversion rate', 'Bookings'],
    impactTemplate: 'Without win/loss analysis, you repeat losing patterns — structured competitive intel typically improves win rates 5-10%.',
    outcomeStatement: 'Regular win/loss reviews with competitive intelligence driving sales strategy and messaging.',
  },

  // Platform Health (P1-P5) — Salesforce-only, API_ONLY
  {
    id: 'P1',
    name: 'Apex Code Health',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Apex trigger count, class complexity, and code organization.',
    primaryFunction: 'Cross Functional',
    outcomes: ['Scale Operations'],
    power10Metrics: [],
    impactTemplate: 'Technical debt in Apex code increases deployment risk and slows feature development.',
    outcomeStatement: 'Clean, well-structured Apex code following one-trigger-per-object pattern.',
  },
  {
    id: 'P2',
    name: 'Validation & Data Quality',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Validation rule coverage across key objects and duplicate rules.',
    primaryFunction: 'Cross Functional',
    outcomes: ['Improve Data Quality'],
    power10Metrics: ['Pipeline production'],
    impactTemplate: 'Without validation rules, bad data enters the system at the source — cleanup costs 5-10x more than prevention.',
    outcomeStatement: 'Comprehensive validation rules and duplicate management ensuring data quality at entry.',
  },
  {
    id: 'P3',
    name: 'Security & Access Model',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Role hierarchy, profiles, permission sets, and sharing rules.',
    primaryFunction: 'Cross Functional',
    outcomes: ['Scale Operations'],
    power10Metrics: [],
    impactTemplate: 'Poorly designed security model creates friction for users and risk for the business — permission sprawl compounds over time.',
    outcomeStatement: 'Well-designed role hierarchy with permission sets enabling both security and productivity.',
  },
  {
    id: 'P4',
    name: 'Record Type & Layout Design',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Record type usage, page layout complexity, and design intent.',
    primaryFunction: 'Cross Functional',
    outcomes: ['Improve Sales Efficiency', 'Scale Operations'],
    power10Metrics: [],
    impactTemplate: 'Cluttered page layouts slow rep productivity — every unnecessary field is friction in the sales process.',
    outcomeStatement: 'Intentional record type design with streamlined layouts aligned to business processes.',
  },
  {
    id: 'P5',
    name: 'Integration Footprint',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Connected Apps, Named Credentials, and outbound integrations.',
    primaryFunction: 'Cross Functional',
    outcomes: ['Scale Operations', 'Improve Data Quality'],
    power10Metrics: [],
    impactTemplate: 'Unmanaged integrations create data sync issues and security risk — each unaudited connection is a potential failure point.',
    outcomeStatement: 'Well-documented integration footprint with Named Credentials and clear data flow mapping.',
  },
];

/**
 * Get item definition by ID.
 */
export function getItemById(id) {
  return DIAGNOSTIC_ITEMS.find((item) => item.id === id);
}

/**
 * Get all items for a layer.
 */
export function getItemsByLayer(layer) {
  return DIAGNOSTIC_ITEMS.filter((item) => item.layer === layer);
}
