/**
 * Engagement Roadmap Generator
 *
 * Takes diagnostic results + tier selection and produces a phased roadmap
 * showing what the embedded LeanScale team focuses on each quarter.
 *
 * Works with v2 diagnostic items and v1 process data.
 */

import { ENGAGEMENT_PHASES, LAYER_TO_DEFAULT_PHASE } from '../data/engagement-phases';
import { ENGAGEMENT_TIERS } from '../data/engagement-tiers';
import { lookupService } from './diagnostic-engine/service-mapping';

const STATUS_PRIORITY = { warning: 3, careful: 2, healthy: 1, unable: 0 };

/**
 * Build an engagement roadmap from v2 diagnostic items.
 *
 * @param {Array} items - v2 diagnostic items with status, serviceIds, layer, etc.
 * @param {string} tierId - 'growth' | 'scale' | 'enterprise'
 * @param {object} [options]
 * @param {Array} [options.processes] - v1 process data (has function, outcome, metric, serviceId)
 * @param {Array} [options.managedServices] - managed services health data
 * @returns {object} Roadmap with phases, each containing projects and managed services
 */
export function buildEngagementRoadmap(items, tierId, options = {}) {
  const { processes = [], managedServices = [] } = options;
  const tier = ENGAGEMENT_TIERS.find(t => t.id === tierId) || ENGAGEMENT_TIERS[1];

  // Collect actionable items (warning or careful)
  const actionableItems = items.filter(it => it.status === 'warning' || it.status === 'careful');

  // Build project list from actionable items' serviceIds
  const projectMap = new Map();
  for (const item of actionableItems) {
    for (const sid of item.serviceIds || []) {
      if (projectMap.has(sid)) continue;
      const service = lookupService(sid);
      if (!service) continue;

      // Find matching v1 process for richer metadata
      const process = processes.find(p => p.serviceId === sid);

      projectMap.set(sid, {
        serviceId: sid,
        name: service.name,
        description: service.description,
        icon: service.icon,
        type: service.type,
        // Phase assignment: use item layer as default, bump up if warning
        defaultPhase: LAYER_TO_DEFAULT_PHASE[item.layer] || 'activate',
        severity: STATUS_PRIORITY[item.status] || 0,
        diagnosticItemId: item.id,
        diagnosticItemName: item.name,
        hasPlaybook: service.hasPlaybook || false,
        // From v1 process if available
        primaryFunction: process?.function || item.primaryFunction || 'Cross Functional',
        outcome: process?.outcome || (item.outcomes && item.outcomes[0]) || null,
        metric: process?.metric || (item.power10Metrics && item.power10Metrics[0]) || null,
      });
    }
  }

  // Assign projects to phases
  const phaseProjects = {
    stabilize: [],
    activate: [],
    optimize: [],
    scale: [],
  };

  for (const project of projectMap.values()) {
    let phase = project.defaultPhase;

    // Warning items get pulled into earlier phase
    if (project.severity >= 3 && phase !== 'stabilize') {
      const phaseOrder = ['stabilize', 'activate', 'optimize', 'scale'];
      const idx = phaseOrder.indexOf(phase);
      if (idx > 0) phase = phaseOrder[idx - 1];
    }

    phaseProjects[phase].push(project);
  }

  // Sort within each phase: warnings first, then by function
  for (const phase of Object.values(phaseProjects)) {
    phase.sort((a, b) => b.severity - a.severity || a.name.localeCompare(b.name));
  }

  // Collect actionable managed services
  const actionableManaged = managedServices.filter(
    ms => ms.status === 'warning' || ms.status === 'careful'
  );

  // Build phase objects
  const phases = ENGAGEMENT_PHASES.map(phaseDef => ({
    ...phaseDef,
    timing: tier.roadmapPacing[phaseDef.id],
    projects: phaseProjects[phaseDef.id] || [],
    managedServices: phaseDef.id === 'stabilize'
      ? actionableManaged
      : phaseDef.id === 'activate'
        ? actionableManaged.filter(ms => ms.status === 'warning')
        : [],
  }));

  // Calculate Power 10 progress per phase (cumulative)
  const power10Progress = calculatePower10Progress(phases, items);

  return {
    tierId: tier.id,
    tierName: tier.name,
    monthlyPrice: tier.monthlyPrice,
    monthlyHours: tier.monthlyHours,
    timeToGreen: tier.timeToGreen,
    summary: tier.summary,
    phases: phases.map((phase, idx) => ({
      ...phase,
      power10Progress: power10Progress[idx],
    })),
    totalProjects: projectMap.size,
    totalManagedServices: actionableManaged.length,
  };
}

/**
 * Calculate cumulative Power 10 improvement per phase.
 * Returns array of { reportable, onTrack } objects for each phase.
 */
function calculatePower10Progress(phases, items) {
  // Map diagnostic items to their power10 metrics
  const metricsUnlocked = new Set();
  const progress = [];

  // Baseline: count healthy items' metrics
  for (const item of items) {
    if (item.status === 'healthy' && item.power10Metrics) {
      for (const m of item.power10Metrics) metricsUnlocked.add(m);
    }
  }

  const baseReportable = metricsUnlocked.size;

  for (const phase of phases) {
    // Each project's parent diagnostic item adds its metrics
    for (const proj of phase.projects) {
      const parentItem = items.find(it => it.id === proj.diagnosticItemId);
      if (parentItem?.power10Metrics) {
        for (const m of parentItem.power10Metrics) metricsUnlocked.add(m);
      }
    }
    progress.push({
      reportable: metricsUnlocked.size,
      total: 10,
      label: `${metricsUnlocked.size} of 10`,
    });
  }

  return progress;
}

/**
 * Build roadmap from v1 process data (simpler path).
 */
export function buildEngagementRoadmapV1(processes, tierId, managedServices = []) {
  const tier = ENGAGEMENT_TIERS.find(t => t.id === tierId) || ENGAGEMENT_TIERS[1];

  const actionable = processes.filter(p =>
    p.status === 'warning' || p.status === 'careful' || p.status === 'unable'
  );

  // Assign to phases based on severity + function
  const phaseProjects = { stabilize: [], activate: [], optimize: [], scale: [] };

  for (const proc of actionable) {
    const service = lookupService(proc.serviceId);
    const project = {
      serviceId: proc.serviceId,
      name: proc.name,
      description: service?.description || '',
      icon: service?.icon || '',
      type: proc.serviceType || 'strategic',
      hasPlaybook: service?.hasPlaybook || false,
      primaryFunction: proc.function,
      outcome: proc.outcome,
      metric: proc.metric,
      severity: STATUS_PRIORITY[proc.status] || 0,
    };

    // Phase assignment logic
    if (proc.status === 'warning' || proc.status === 'unable') {
      // High severity: stabilize or activate
      if (proc.function === 'Cross Functional' || proc.outcome === 'Improve Data Quality') {
        phaseProjects.stabilize.push(project);
      } else {
        phaseProjects.activate.push(project);
      }
    } else {
      // Careful: optimize or scale
      if (proc.outcome === 'Optimize Reporting' || proc.outcome === 'Scale Operations') {
        phaseProjects.scale.push(project);
      } else {
        phaseProjects.optimize.push(project);
      }
    }
  }

  // Sort within phases
  for (const phase of Object.values(phaseProjects)) {
    phase.sort((a, b) => b.severity - a.severity || a.name.localeCompare(b.name));
  }

  const actionableManaged = managedServices.filter(
    ms => ms.status === 'warning' || ms.status === 'careful'
  );

  const phases = ENGAGEMENT_PHASES.map(phaseDef => ({
    ...phaseDef,
    timing: tier.roadmapPacing[phaseDef.id],
    projects: phaseProjects[phaseDef.id] || [],
    managedServices: phaseDef.id === 'stabilize' ? actionableManaged : [],
  }));

  return {
    tierId: tier.id,
    tierName: tier.name,
    monthlyPrice: tier.monthlyPrice,
    monthlyHours: tier.monthlyHours,
    timeToGreen: tier.timeToGreen,
    summary: tier.summary,
    phases,
    totalProjects: actionable.length,
    totalManagedServices: actionableManaged.length,
  };
}
