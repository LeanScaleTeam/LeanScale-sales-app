/**
 * Diagnostic v2 Constants
 *
 * 17 diagnostic items across 3 layers (Foundation/Motions/Maturity).
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
  },
  {
    id: 'F2',
    name: 'Pipeline Design',
    layer: 'foundation',
    source: SOURCE_TYPES.API_ONLY,
    weight: 2,
    serviceIds: ['sales-lifecycle'],
    description: 'Deal and ticket pipeline structure, stages, probabilities, and hygiene.',
  },
  {
    id: 'F3',
    name: 'Lifecycle & Lead Status',
    layer: 'foundation',
    source: SOURCE_TYPES.API_ONLY,
    weight: 2,
    serviceIds: ['gtm-lifecycle', 'lead-lifecycle'],
    description: 'Automation of lifecycle stage and lead status transitions across objects.',
  },
  {
    id: 'F4',
    name: 'Automation Engine',
    layer: 'foundation',
    source: SOURCE_TYPES.API_ONLY,
    weight: 2,
    serviceIds: ['foundational-automations-and-reporting-logic'],
    description: 'Breadth and depth of workflow automation across GTM functions.',
  },
  {
    id: 'F5',
    name: 'Team & Ownership',
    layer: 'foundation',
    source: SOURCE_TYPES.API_ONLY,
    weight: 2,
    serviceIds: ['hubspot-impl'],
    description: 'Owner assignments, team structure, and functional coverage.',
  },
  {
    id: 'F6',
    name: 'Data Enrichment',
    layer: 'foundation',
    source: SOURCE_TYPES.API_ONLY,
    weight: 2,
    serviceIds: ['automated-inbound-data-enrichment', 'clay-impl'],
    description: 'Third-party data enrichment tools detected and field coverage.',
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
  },
  {
    id: 'M2',
    name: 'Marketing Email & Nurture',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['email-operations-nurture-program', 'marketing-automation-platform-implementation', 'marketing-database-segmentation'],
    description: 'Email marketing programs, nurture sequences, and list segmentation.',
  },
  {
    id: 'M3',
    name: 'Sales Execution',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['activity-capture', 'sales-qualification-methodology', 'automated-outbound-process', 'sales-engagement-platform'],
    description: 'Sales process automation, qualification methodology, and activity capture.',
  },
  {
    id: 'M4',
    name: 'Attribution & Source Tracking',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['lead-and-opportunity-attribution', 'marketing-reporting-pack'],
    description: 'Lead source tracking, attribution models, and campaign measurement.',
  },
  {
    id: 'M5',
    name: 'Deal-to-Close Process',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['cpq-implementation', 'e-signature-implementation', 'clm-implementation', 'quote-to-cash'],
    description: 'Proposal, contract, and closing processes including CPQ and e-signature.',
  },
  {
    id: 'M6',
    name: 'Customer Onboarding & Success',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['sales-to-cs-handoff-process-implementation', 'customer-success-platform-implementation', 'customer-health-model', 'nps-and-voice-of-customer-launch', 'renewal-management'],
    description: 'Post-sale handoff, onboarding, health scoring, and renewal processes.',
  },
  {
    id: 'M7',
    name: 'Partner & Channel Ops',
    layer: 'motions',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1.5,
    serviceIds: ['partnership-success-platform-implementation'],
    description: 'Partner program operations, deal tracking, and referral processes.',
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
  },
  {
    id: 'R2',
    name: 'Revenue Metrics (Power 10)',
    layer: 'maturity',
    source: SOURCE_TYPES.INTAKE_ONLY,
    weight: 1,
    serviceIds: ['arr-reporting', 'executive-reporting-suite'],
    description: 'Ability to report on 10 key revenue metrics from CRM data.',
  },
  {
    id: 'R3',
    name: 'Forecasting & Planning',
    layer: 'maturity',
    source: SOURCE_TYPES.INTAKE_ONLY,
    weight: 1,
    serviceIds: ['forecasting-process-implementation', 'growth-model', 'quotas-and-target-setting'],
    description: 'Sales forecasting methodology, quota setting, and growth planning.',
  },
  {
    id: 'R4',
    name: 'Win/Loss & Competitive Intel',
    layer: 'maturity',
    source: SOURCE_TYPES.API_PLUS,
    weight: 1,
    serviceIds: ['sales-qualification-methodology', 'conversation-intelligence-platform-implementation'],
    description: 'Win/loss analysis processes and competitive intelligence tracking.',
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
  },
  {
    id: 'P2',
    name: 'Validation & Data Quality',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Validation rule coverage across key objects and duplicate rules.',
  },
  {
    id: 'P3',
    name: 'Security & Access Model',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Role hierarchy, profiles, permission sets, and sharing rules.',
  },
  {
    id: 'P4',
    name: 'Record Type & Layout Design',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Record type usage, page layout complexity, and design intent.',
  },
  {
    id: 'P5',
    name: 'Integration Footprint',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Connected Apps, Named Credentials, and outbound integrations.',
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
