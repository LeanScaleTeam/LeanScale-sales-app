/**
 * Playbook Personalizer
 *
 * Given a playbook slug and diagnostic scores, computes personalization hints:
 * which competencies triggered the recommendation, which sections to highlight
 * or collapse, and priority ordering.
 */

import { V3_COMPETENCIES, expandDepartments } from './diagnostic-engine/v3/constants-v3';

/**
 * Compute personalization data for a playbook based on diagnostic scores.
 *
 * @param {string} playbookSlug - The playbook being viewed
 * @param {Array} gradedCompetencies - From diagnostic engine: [{ id, pillar, departments: { marketing: 4, ... } }]
 * @returns {{ relevantCompetencies, highlightSections, skipSections, priorityOrder, hasPersonalization }}
 */
export function personalizePlaybook(playbookSlug, gradedCompetencies) {
  if (!gradedCompetencies || !playbookSlug) {
    return { relevantCompetencies: [], highlightSections: [], skipSections: [], priorityOrder: [], hasPersonalization: false };
  }

  // Find which competencies reference this playbook via serviceIds
  const matchingComps = V3_COMPETENCIES.filter(c =>
    (c.serviceIds || []).includes(playbookSlug)
  );

  const relevantCompetencies = [];
  const highlightSections = [];
  const skipSections = [];

  for (const comp of matchingComps) {
    const graded = gradedCompetencies.find(g => g.id === comp.id);
    if (!graded) continue;

    const depts = expandDepartments(comp.departments);
    const deptScores = {};
    let hasLow = false;
    let allHigh = true;

    for (const dept of depts) {
      const score = graded.departments[dept];
      deptScores[dept] = score;
      if (score !== null && score <= 3) hasLow = true;
      if (score !== null && score < 4) allHigh = false;
    }

    if (hasLow) {
      relevantCompetencies.push({
        id: comp.id,
        name: comp.name,
        pillar: comp.pillar,
        deptScores,
      });
      highlightSections.push(comp.pillar);
    }

    if (allHigh) {
      skipSections.push(comp.id);
    }
  }

  // Priority: biggest gaps first
  relevantCompetencies.sort((a, b) => {
    const avgA = avgScore(a.deptScores);
    const avgB = avgScore(b.deptScores);
    return avgA - avgB; // lowest average first = biggest gap
  });

  return {
    relevantCompetencies,
    highlightSections: [...new Set(highlightSections)],
    skipSections,
    priorityOrder: relevantCompetencies.map(c => c.id),
    hasPersonalization: relevantCompetencies.length > 0,
  };
}

/**
 * Resolve a service ID through aliases to canonical slug.
 */
export function resolvePlaybookSlug(serviceId, aliases) {
  if (!serviceId) return null;
  if (aliases?.aliases?.[serviceId]) {
    return aliases.aliases[serviceId];
  }
  return serviceId;
}

function avgScore(deptScores) {
  const scores = Object.values(deptScores).filter(s => s !== null);
  if (scores.length === 0) return 5;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}
