/**
 * v3 Score Computation
 *
 * Aggregates competency cell scores into department scores, pillar scores,
 * and an overall weighted score. Handles null (unscored) cells gracefully.
 */

import {
  PILLAR_WEIGHTS,
  DEPT_WEIGHTS,
  DEPARTMENTS,
  PILLAR_ORDER,
  V3_STATUS,
  expandDepartments,
  V3_COMPETENCIES,
  CONSULTANT_TIERS,
} from './constants-v3';

/**
 * Compute all aggregate scores from graded competency results.
 *
 * @param {Array} gradedCompetencies - Array of competency grade objects from graders
 *   Each: { id, pillar, departments: { marketing: 4, sales: null, ... }, ... }
 * @returns {{ scoreCard, pillarScores, departmentScores, overall, overallLabel }}
 */
export function computeScoresV3(gradedCompetencies) {
  // Build the score card: { [competencyId]: { [dept]: score|null } }
  const scoreCard = {};
  for (const comp of gradedCompetencies) {
    scoreCard[comp.id] = { ...comp.departments };
  }

  // Compute pillar scores: { [pillar]: { [dept]: avg, _avg: weightedAvg } }
  const pillarScores = {};
  for (const pillar of PILLAR_ORDER) {
    const pillarComps = gradedCompetencies.filter((c) => c.pillar === pillar);
    const deptAvgs = {};

    for (const dept of DEPARTMENTS) {
      const scores = pillarComps
        .map((c) => c.departments[dept])
        .filter((s) => s !== null && s !== undefined);

      deptAvgs[dept] = scores.length > 0 ? average(scores) : null;
    }

    // Pillar weighted average across departments
    const weightedScores = DEPARTMENTS
      .filter((d) => deptAvgs[d] !== null)
      .map((d) => ({ score: deptAvgs[d], weight: DEPT_WEIGHTS[d] }));

    const pillarAvg = weightedScores.length > 0
      ? weightedAverage(weightedScores)
      : null;

    pillarScores[pillar] = {
      ...deptAvgs,
      _avg: pillarAvg !== null ? round2(pillarAvg) : null,
    };
  }

  // Compute department scores: { [dept]: weightedAvg across pillars }
  const departmentScores = {};
  for (const dept of DEPARTMENTS) {
    const pillarDeptScores = PILLAR_ORDER
      .filter((p) => pillarScores[p][dept] !== null)
      .map((p) => ({ score: pillarScores[p][dept], weight: PILLAR_WEIGHTS[p] }));

    departmentScores[dept] = pillarDeptScores.length > 0
      ? round2(weightedAverage(pillarDeptScores))
      : null;
  }

  // Compute overall score: weighted average of pillar averages
  const overallPillarScores = PILLAR_ORDER
    .filter((p) => pillarScores[p]._avg !== null)
    .map((p) => ({ score: pillarScores[p]._avg, weight: PILLAR_WEIGHTS[p] }));

  const overall = overallPillarScores.length > 0
    ? round2(weightedAverage(overallPillarScores))
    : null;

  const overallLabel = overall !== null ? V3_STATUS[Math.round(overall)] || 'Unknown' : 'Insufficient Data';

  // Data coverage stats
  const dataCoverage = computeDataCoverage(gradedCompetencies);

  return {
    scoreCard,
    pillarScores,
    departmentScores,
    overall,
    overallLabel,
    dataCoverage,
  };
}

/**
 * Merge scores from multiple sources with weighting.
 * Used by graders to combine API, transcript, and consultant scores.
 *
 * @param {{ api?: number, transcript?: { score: number, confidence: number }, consultant?: number }} sources
 * @returns {number|null} Merged score (1-5) or null
 */
export function mergeSourceScores(sources) {
  // Consultant always wins
  if (sources.consultant !== null && sources.consultant !== undefined) {
    return sources.consultant;
  }

  // Transcript with high confidence overrides API
  if (sources.transcript && sources.transcript.score !== null) {
    if (!sources.api || sources.transcript.confidence >= 0.7) {
      return sources.transcript.score;
    }
    // Blend API and transcript for medium confidence
    if (sources.transcript.confidence >= 0.5) {
      return Math.round((sources.api * 0.4 + sources.transcript.score * 0.6));
    }
    // Low confidence transcript — prefer API
    return sources.api;
  }

  // API only
  if (sources.api !== null && sources.api !== undefined) {
    return sources.api;
  }

  return null;
}

/**
 * Compute data coverage percentages with tier-aware breakdowns.
 */
function computeDataCoverage(gradedCompetencies) {
  let totalCells = 0;
  let scoredCells = 0;
  const sourceCounts = { api: 0, transcript: 0, consultant: 0, unscoredCells: 0 };

  // Tier-specific counters
  const tierStats = {
    required: { total: 0, scored: 0 },
    review: { total: 0, scored: 0 },
    auto: { total: 0, scored: 0 },
  };

  // Build a lookup for tier by competency ID
  const tierLookup = {};
  for (const c of V3_COMPETENCIES) {
    tierLookup[c.id] = c.consultantTier;
  }

  for (const comp of gradedCompetencies) {
    const tier = tierLookup[comp.id] || 'auto';

    for (const dept of DEPARTMENTS) {
      if (comp.departments[dept] !== undefined) {
        totalCells++;
        if (tierStats[tier]) tierStats[tier].total++;

        if (comp.departments[dept] !== null) {
          scoredCells++;
          if (tierStats[tier]) tierStats[tier].scored++;

          // Attribute to source based on signals
          const hasApiSignal = comp.signals?.some((s) => s.source === 'api');
          const hasTranscript = comp.signals?.some((s) => s.source === 'transcript');
          const hasConsultant = comp.signals?.some((s) => s.source === 'consultant');
          if (hasConsultant) sourceCounts.consultant++;
          else if (hasTranscript) sourceCounts.transcript++;
          else if (hasApiSignal) sourceCounts.api++;
        } else {
          sourceCounts.unscoredCells++;
        }
      }
    }
  }

  // "Consultant needed" = Tier 1 (required) + Tier 2 (review)
  const consultantNeededTotal = tierStats.required.total + tierStats.review.total;
  const consultantNeededScored = tierStats.required.scored + tierStats.review.scored;

  return {
    totalCells,
    scoredCells,
    coveragePercent: totalCells > 0 ? round2((scoredCells / totalCells) * 100) : 0,
    apiPercent: totalCells > 0 ? round2((sourceCounts.api / totalCells) * 100) : 0,
    transcriptPercent: totalCells > 0 ? round2((sourceCounts.transcript / totalCells) * 100) : 0,
    consultantPercent: totalCells > 0 ? round2((sourceCounts.consultant / totalCells) * 100) : 0,

    // Tier-aware coverage
    tiers: {
      required: {
        total: tierStats.required.total,
        scored: tierStats.required.scored,
        percent: tierStats.required.total > 0 ? round2((tierStats.required.scored / tierStats.required.total) * 100) : 0,
      },
      review: {
        total: tierStats.review.total,
        scored: tierStats.review.scored,
        percent: tierStats.review.total > 0 ? round2((tierStats.review.scored / tierStats.review.total) * 100) : 0,
      },
      auto: {
        total: tierStats.auto.total,
        scored: tierStats.auto.scored,
        percent: tierStats.auto.total > 0 ? round2((tierStats.auto.scored / tierStats.auto.total) * 100) : 0,
      },
    },
    consultantNeeded: {
      total: consultantNeededTotal,
      scored: consultantNeededScored,
      percent: consultantNeededTotal > 0 ? round2((consultantNeededScored / consultantNeededTotal) * 100) : 0,
    },
  };
}

/**
 * Determine the status of a competency cell based on its tier and score.
 * Used by DataCoverage to determine what counts as "missing".
 */
export function getCellStatus(tier, score, hasApiScore) {
  if (score !== null) return 'complete';

  switch (tier) {
    case 'auto':
      return 'auto_covered';
    case 'review':
      return hasApiScore ? 'review_recommended' : 'missing';
    case 'required':
    default:
      return 'missing';
  }
}

// ── Helpers ──

function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}

function weightedAverage(items) {
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  if (totalWeight === 0) return 0;
  return items.reduce((sum, i) => sum + i.score * i.weight, 0) / totalWeight;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
