/**
 * v3 Roadmap Generator
 *
 * Takes scored competencies and generates a prioritized project roadmap
 * in 4 phases: Foundation → Build → Optimize → Scale.
 *
 * Priority algorithm: gap_score × pillar_weight × dept_importance × dependency_bonus
 */

import {
  PILLAR_WEIGHTS,
  DEPT_WEIGHTS,
  ROADMAP_PHASES,
  PILLAR_DEFAULT_PHASE,
  V3_COMPETENCIES,
  expandDepartments,
  DEPT_LABELS,
  PILLAR_LABELS,
} from './constants-v3';
import { collectRoadmapProjects, lookupServiceV3 } from './service-mapping-v3';

/**
 * Generate a prioritized roadmap from graded competencies.
 *
 * @param {Array} gradedCompetencies - From graders (with department scores)
 * @param {object} options
 * @param {number} options.threshold - Score threshold for action (default 3)
 * @param {boolean} options.includeHealthy - Include healthy items (default false)
 * @returns {{ phases: Array, totalProjects: number, summary: object }}
 */
export function generateRoadmap(gradedCompetencies, options = {}) {
  const { threshold = 3, includeHealthy = false } = options;

  // Collect all candidate projects
  const allProjects = collectRoadmapProjects(gradedCompetencies, includeHealthy ? 5 : threshold);

  // Score and assign phases
  const scoredProjects = allProjects.map((project) => {
    const priority = computePriority(project, gradedCompetencies);
    const phase = assignPhase(project, priority);

    return {
      ...project,
      priority,
      phase,
      projectedImpact: computeProjectedImpact(project),
    };
  });

  // Group into phases
  const phases = Object.entries(ROADMAP_PHASES).map(([phaseKey, phaseMeta]) => {
    const phaseProjects = scoredProjects
      .filter((p) => p.phase === phaseKey)
      .sort((a, b) => b.priority.score - a.priority.score);

    return {
      key: phaseKey,
      ...phaseMeta,
      projects: phaseProjects,
      projectCount: phaseProjects.length,
    };
  });

  // Summary stats
  const summary = {
    totalProjects: scoredProjects.length,
    byPhase: Object.fromEntries(phases.map((p) => [p.key, p.projectCount])),
    topPriorities: scoredProjects
      .sort((a, b) => b.priority.score - a.priority.score)
      .slice(0, 3)
      .map((p) => ({
        serviceId: p.serviceId,
        name: p.service.name,
        score: p.priority.score,
        phase: p.phase,
      })),
    estimatedCoverage: computeCoverageImpact(scoredProjects, gradedCompetencies),
  };

  return { phases, totalProjects: scoredProjects.length, summary };
}

/**
 * Compute priority score for a project.
 * Formula: gap_score × pillar_weight × dept_importance × dependency_bonus
 */
function computePriority(project, gradedCompetencies) {
  const { competencies, avgGap } = project;

  // Pillar weight component: weighted average of pillar weights for triggering competencies
  const pillarWeightSum = competencies.reduce((sum, c) => {
    return sum + (PILLAR_WEIGHTS[c.pillar] || 0.15);
  }, 0);
  const pillarWeight = pillarWeightSum / competencies.length;

  // Department importance: max department weight across triggers
  let maxDeptWeight = 0;
  for (const comp of competencies) {
    for (const dept of comp.departments) {
      maxDeptWeight = Math.max(maxDeptWeight, DEPT_WEIGHTS[dept.name] || 0.5);
    }
  }

  // Dependency bonus: projects that address multiple competencies get a boost
  const dependencyBonus = 1 + Math.min(competencies.length - 1, 3) * 0.1;

  // Final score
  const score = avgGap * pillarWeight * maxDeptWeight * dependencyBonus;

  return {
    score: Math.round(score * 100) / 100,
    components: {
      avgGap,
      pillarWeight: Math.round(pillarWeight * 100) / 100,
      maxDeptWeight,
      dependencyBonus,
    },
  };
}

/**
 * Assign a phase based on project characteristics and priority.
 */
function assignPhase(project, priority) {
  const { competencies } = project;

  // Get the primary pillar (most competencies from)
  const pillarCounts = {};
  for (const comp of competencies) {
    pillarCounts[comp.pillar] = (pillarCounts[comp.pillar] || 0) + 1;
  }
  const primaryPillar = Object.entries(pillarCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'process';

  // Default phase from pillar
  let phase = PILLAR_DEFAULT_PHASE[primaryPillar] || 'BUILD';

  // Override: very high gap scores go to Foundation regardless
  if (priority.components.avgGap >= 3.5) {
    phase = 'FOUNDATION';
  }

  // Override: low gap scores with optimization pillars go to Scale
  if (priority.components.avgGap <= 1.5 && (primaryPillar === 'reporting' || primaryPillar === 'enablement')) {
    phase = 'SCALE';
  }

  return phase;
}

/**
 * Compute projected score improvement if project is implemented.
 */
function computeProjectedImpact(project) {
  const impacts = [];
  for (const comp of project.competencies) {
    for (const dept of comp.departments) {
      const currentScore = dept.currentScore;
      // Conservative: project implementation typically improves by 1-2 points
      const projectedScore = Math.min(5, currentScore + 2);
      impacts.push({
        competencyId: comp.id,
        competencyName: comp.name,
        department: dept.name,
        departmentLabel: dept.label,
        currentScore,
        projectedScore,
        improvement: projectedScore - currentScore,
      });
    }
  }
  return impacts;
}

/**
 * Estimate how many unscored cells would be addressed by the roadmap projects.
 */
function computeCoverageImpact(projects, gradedCompetencies) {
  const addressedCompetencies = new Set();
  for (const project of projects) {
    for (const comp of project.competencies) {
      addressedCompetencies.add(comp.id);
    }
  }

  let totalLowScoring = 0;
  let addressed = 0;
  for (const comp of gradedCompetencies) {
    for (const [dept, score] of Object.entries(comp.departments)) {
      if (score !== null && score <= 3) {
        totalLowScoring++;
        if (addressedCompetencies.has(comp.id)) {
          addressed++;
        }
      }
    }
  }

  return {
    totalLowScoring,
    addressed,
    coveragePercent: totalLowScoring > 0
      ? Math.round((addressed / totalLowScoring) * 100)
      : 100,
  };
}
