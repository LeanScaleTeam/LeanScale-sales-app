/**
 * Engagement Tiers
 *
 * Three embedded retainer tiers for LeanScale engagements.
 * Used by the Engagement Pitch walkthrough to map diagnostic findings
 * to a recommended tier and show the roadmap at different speeds.
 */

export const ENGAGEMENT_TIERS = [
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 15000,
    monthlyHours: 50,
    timeToGreen: '12-18 months',
    roadmapPacing: {
      stabilize: 'Q1-Q2',
      activate: 'Q3-Q4',
      optimize: 'Year 2',
      scale: 'Year 2',
    },
    summary: 'We fix the critical stuff first, then build methodically.',
  },
  {
    id: 'scale',
    name: 'Scale',
    monthlyPrice: 25000,
    monthlyHours: 100,
    timeToGreen: '6-9 months',
    roadmapPacing: {
      stabilize: 'Q1',
      activate: 'Q2',
      optimize: 'Q3',
      scale: 'Q4',
    },
    summary: 'Full roadmap in 12 months — our sweet spot for your stage.',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 50000,
    monthlyHours: 225,
    timeToGreen: '4-6 months',
    roadmapPacing: {
      stabilize: 'Q1',
      activate: 'Q1',
      optimize: 'Q2',
      scale: 'Q3-Q4',
    },
    summary: 'Aggressive timeline, multiple workstreams running simultaneously.',
  },
];

/**
 * Recommend a tier based on intake answers and diagnostic severity.
 *
 * @param {object} params
 * @param {string} params.arrRange - A3 answer: '<$1M', '$1-5M', '$5-20M', '$20-50M', '$50M+'
 * @param {string} params.repCount - A2 answer: '1-5', '6-15', '16-50', '50+'
 * @param {number} params.warningCount - Number of warning-status findings
 * @param {number} params.power10RedCount - Number of Power 10 metrics at warning/unable
 * @returns {string} Tier ID: 'growth' | 'scale' | 'enterprise'
 */
export function recommendTier({ arrRange, repCount, warningCount = 0, power10RedCount = 0 }) {
  let score = 0;

  // ARR range signals
  if (arrRange === '$20-50M' || arrRange === '$50M+') score += 2;
  else if (arrRange === '$5-20M') score += 1;

  // Rep count signals
  if (repCount === '50+') score += 2;
  else if (repCount === '16-50') score += 1;

  // Severity signals
  if (warningCount > 10) score += 1;
  if (power10RedCount > 7) score += 1;

  if (score >= 4) return 'enterprise';
  if (score >= 2) return 'scale';
  return 'growth';
}

export function getTierById(tierId) {
  return ENGAGEMENT_TIERS.find(t => t.id === tierId);
}
