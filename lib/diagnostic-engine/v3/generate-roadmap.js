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

// ── Signal-based phase assignment ──

const SIGNAL_DEFAULT_PHASE = {
  explicit_mention: 'FOUNDATION', // They asked for it — prioritize
  pain_point: 'BUILD',
  tool_gap: 'FOUNDATION', // Infrastructure need
  aspiration: 'OPTIMIZE',
};

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
  const { threshold = 3, includeHealthy = false, projectSignals = [] } = options;

  // Collect all candidate projects from competency scores
  const allProjects = collectRoadmapProjects(gradedCompetencies, includeHealthy ? 5 : threshold);

  // Merge in transcript-detected project signals
  const mergedProjects = mergeSignalProjects(allProjects, projectSignals);

  // Score and assign phases
  const scoredProjects = mergedProjects.map((project) => {
    const priority = computePriority(project, gradedCompetencies);

    // Apply signal-based priority boost
    const signalBoost = project.transcriptSignal
      ? 1 + project.transcriptSignal.confidence * 0.5
      : 1;
    const boostedPriority = {
      ...priority,
      score: Math.round(priority.score * signalBoost * 100) / 100,
      components: { ...priority.components, signalBoost },
    };

    // Signal-only projects use signal-based phase assignment
    const phase = project._signalOnly
      ? assignSignalPhase(project.transcriptSignal)
      : assignPhase(project, boostedPriority);

    return {
      ...project,
      priority: boostedPriority,
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
 * Merge transcript-detected project signals into the competency-driven project list.
 *
 * - If a signal's serviceId already exists in competency projects, attach the signal
 *   (for priority boosting in the scoring step).
 * - If a signal's serviceId is NOT in competency projects and confidence >= 0.4,
 *   add it as a new project with synthetic data.
 * - Signals with confidence < 0.4 are skipped (consultant review only).
 *
 * @param {Array} competencyProjects - From collectRoadmapProjects
 * @param {Array} signals - From transcript_project_signals table
 * @returns {Array} Merged project list
 */
function mergeSignalProjects(competencyProjects, signals) {
  if (!signals || signals.length === 0) return competencyProjects;

  // Build map of existing projects by serviceId
  const projectMap = new Map();
  for (const project of competencyProjects) {
    projectMap.set(project.serviceId, project);
  }

  // Deduplicate signals: keep highest confidence per serviceId
  const bestSignals = new Map();
  for (const signal of signals) {
    if (signal.confidence < 0.2) continue;
    const existing = bestSignals.get(signal.service_id);
    if (!existing || signal.confidence > existing.confidence) {
      bestSignals.set(signal.service_id, signal);
    }
  }

  // Merge signals into projects
  for (const [serviceId, signal] of bestSignals) {
    const transcriptSignal = {
      type: signal.signal_type,
      confidence: signal.confidence,
      evidence: signal.evidence,
      reasoning: signal.reasoning,
      lowConfidence: signal.confidence < 0.4,
    };

    if (projectMap.has(serviceId)) {
      // Existing project — attach signal for priority boost
      projectMap.get(serviceId).transcriptSignal = transcriptSignal;
    } else {
      // New project — add with synthetic data
      const service = lookupServiceV3(serviceId);
      if (!service) continue;

      projectMap.set(serviceId, {
        serviceId,
        service,
        competencies: [],
        avgGap: signal.confidence >= 0.7 ? 3 : signal.confidence >= 0.4 ? 2 : 1, // Synthetic gap score
        competencyCount: 0,
        transcriptSignal,
        _signalOnly: true, // Flag for phase assignment
      });
    }
  }

  return Array.from(projectMap.values());
}

/**
 * Assign a phase for signal-only projects (not driven by competency scores).
 */
function assignSignalPhase(signal) {
  if (!signal) return 'BUILD';

  // High confidence explicit mentions go to Foundation
  if (signal.type === 'explicit_mention' && signal.confidence >= 0.8) {
    return 'FOUNDATION';
  }

  return SIGNAL_DEFAULT_PHASE[signal.type] || 'BUILD';
}

/**
 * Compute priority score for a project.
 * Formula: gap_score × pillar_weight × dept_importance × dependency_bonus
 */
function computePriority(project, gradedCompetencies) {
  const { competencies, avgGap } = project;

  // Signal-only projects with no competencies get a baseline priority
  if (!competencies || competencies.length === 0) {
    return {
      score: Math.round(avgGap * 0.15 * 100) / 100,
      components: { avgGap, pillarWeight: 0.15, maxDeptWeight: 1, dependencyBonus: 1 },
    };
  }

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
