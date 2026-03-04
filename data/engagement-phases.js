/**
 * Engagement Phases
 *
 * Four phases of an embedded LeanScale engagement.
 * Projects are dynamically assigned to phases based on diagnostic priority scoring.
 */

export const ENGAGEMENT_PHASES = [
  {
    id: 'stabilize',
    name: 'Stabilize',
    tagline: 'Fix the foundation',
    description: 'CRM cleanup, lifecycle design, pipeline redesign, basic automations and reporting.',
    layers: ['foundation'],
    priorityThreshold: 0.75, // items scoring above this go here
  },
  {
    id: 'activate',
    name: 'Activate',
    tagline: 'Turn on growth motions',
    description: 'Lead routing, scoring, enrichment, CS handoff, sales processes.',
    layers: ['motions'],
    priorityThreshold: 0.50,
  },
  {
    id: 'optimize',
    name: 'Optimize',
    tagline: 'Tune for performance',
    description: 'Attribution, forecasting, territory design, dashboards, integrations.',
    layers: ['motions', 'maturity'],
    priorityThreshold: 0.25,
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'Full operating rhythm',
    description: 'Executive reporting, growth model, competitive intel, continuous improvement.',
    layers: ['maturity'],
    priorityThreshold: 0,
  },
];

/**
 * Default phase assignment based on v2 diagnostic layer.
 * Foundation items → Stabilize, Motions → Activate/Optimize, Maturity → Scale.
 * Items with worse scores get pulled into earlier phases.
 */
export const LAYER_TO_DEFAULT_PHASE = {
  foundation: 'stabilize',
  motions: 'activate',
  maturity: 'scale',
  platformHealth: 'stabilize',
};

export function getPhaseById(phaseId) {
  return ENGAGEMENT_PHASES.find(p => p.id === phaseId);
}
