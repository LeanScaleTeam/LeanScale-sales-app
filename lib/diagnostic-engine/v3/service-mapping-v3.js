/**
 * v3 Service Mapping
 *
 * Maps competency scores to service catalog recommendations.
 * Extends the v2 service-mapping pattern for v3's per-department,
 * per-competency structure.
 */

import { strategicProjects, managedServices } from '../../../data/services-catalog';
import { V3_COMPETENCIES, expandDepartments, DEPT_LABELS } from './constants-v3';

// Build flat lookup of all services
const ALL_SERVICES = new Map();

for (const category of Object.values(strategicProjects)) {
  for (const service of category) {
    ALL_SERVICES.set(service.id, { ...service, type: 'strategic' });
  }
}
for (const category of Object.values(managedServices)) {
  for (const service of category) {
    ALL_SERVICES.set(service.id, { ...service, type: 'managed' });
  }
}

/**
 * Look up a service by ID.
 * @param {string} serviceId
 * @returns {object|null}
 */
export function lookupServiceV3(serviceId) {
  return ALL_SERVICES.get(serviceId) || null;
}

/**
 * Validate that all competency serviceIds exist in the catalog.
 * @returns {string[]} Unknown service IDs
 */
export function validateV3ServiceIds() {
  const unknown = [];
  for (const comp of V3_COMPETENCIES) {
    for (const sid of comp.serviceIds || []) {
      if (!ALL_SERVICES.has(sid)) {
        unknown.push(`${comp.id}: ${sid}`);
      }
    }
  }
  return unknown;
}

/**
 * Collect all service recommendations from scored competencies.
 *
 * Returns unique service IDs where at least one department scored <= threshold (default 3).
 * Each recommendation includes the triggering competencies and departments.
 *
 * @param {Array} gradedCompetencies - From graders
 * @param {number} threshold - Score at or below which a service is recommended (default 3)
 * @returns {Array<{ serviceId, service, competencies: [{ id, name, departments, scores }] }>}
 */
export function collectRoadmapProjects(gradedCompetencies, threshold = 3) {
  // Map: serviceId → Set of triggering competency info
  const serviceMap = new Map();

  for (const comp of gradedCompetencies) {
    const depts = expandDepartments(
      V3_COMPETENCIES.find((c) => c.id === comp.id)?.departments || 'all'
    );

    // Check if any department score is at or below threshold
    const triggeringDepts = [];
    for (const dept of depts) {
      const score = comp.departments[dept];
      if (score !== null && score !== undefined && score <= threshold) {
        triggeringDepts.push({ dept, score });
      }
    }

    if (triggeringDepts.length === 0) continue;

    // Add each service ID from this competency
    for (const serviceId of comp.serviceIds || []) {
      if (!serviceMap.has(serviceId)) {
        serviceMap.set(serviceId, []);
      }
      serviceMap.get(serviceId).push({
        id: comp.id,
        name: comp.name,
        pillar: comp.pillar,
        departments: triggeringDepts.map((d) => ({
          name: d.dept,
          label: DEPT_LABELS[d.dept],
          currentScore: d.score,
        })),
      });
    }
  }

  // Build result array
  const projects = [];
  for (const [serviceId, competencies] of serviceMap) {
    const service = lookupServiceV3(serviceId);
    if (!service) continue;

    // Calculate gap score: average of how far below threshold each triggering score is
    let totalGap = 0;
    let gapCount = 0;
    for (const comp of competencies) {
      for (const dept of comp.departments) {
        totalGap += (threshold + 1) - dept.currentScore; // gap from score to "Good"
        gapCount++;
      }
    }
    const avgGap = gapCount > 0 ? totalGap / gapCount : 0;

    projects.push({
      serviceId,
      service,
      competencies,
      avgGap,
      competencyCount: competencies.length,
    });
  }

  // Sort by average gap (biggest gaps first), then by competency count
  projects.sort((a, b) => b.avgGap - a.avgGap || b.competencyCount - a.competencyCount);

  return projects;
}

/**
 * Collect unique actionable service IDs (for backward compatibility with v2 patterns).
 * @param {Array} gradedCompetencies
 * @param {number} threshold
 * @returns {string[]}
 */
export function collectActionableServiceIdsV3(gradedCompetencies, threshold = 3) {
  return collectRoadmapProjects(gradedCompetencies, threshold).map((p) => p.serviceId);
}
