/**
 * Apply user-defined roadmap overrides to a base roadmap.
 *
 * Overrides shape:
 * {
 *   removedProjects: string[],                    // serviceIds to hide
 *   phaseOverrides: { [serviceId]: phaseKey },     // move to different phase
 *   orderOverrides: { [phaseKey]: serviceId[] },   // custom ordering
 *   customProjects: [{ id, name, description, phase, hours }]
 * }
 */

export function applyRoadmapOverrides(baseRoadmap, overrides) {
  if (!overrides || !baseRoadmap?.phases) return baseRoadmap;

  const phases = structuredClone(baseRoadmap.phases);
  const removed = new Set(overrides.removedProjects || []);

  // 1. Remove projects
  for (const phase of phases) {
    phase.projects = phase.projects.filter((p) => !removed.has(p.serviceId));
  }

  // 2. Phase reassignment — move projects between phases
  if (overrides.phaseOverrides) {
    for (const [serviceId, targetPhase] of Object.entries(overrides.phaseOverrides)) {
      // Find and remove from current phase
      let movedProject = null;
      for (const phase of phases) {
        const idx = phase.projects.findIndex((p) => p.serviceId === serviceId);
        if (idx !== -1) {
          movedProject = phase.projects.splice(idx, 1)[0];
          break;
        }
      }
      // Add to target phase
      if (movedProject) {
        const target = phases.find((p) => p.key === targetPhase);
        if (target) {
          movedProject.phase = targetPhase;
          target.projects.push(movedProject);
        }
      }
    }
  }

  // 3. Add custom projects
  if (overrides.customProjects?.length) {
    for (const custom of overrides.customProjects) {
      const target = phases.find((p) => p.key === custom.phase);
      if (target) {
        target.projects.push({
          serviceId: custom.id,
          service: { name: custom.name, description: custom.description, icon: '', type: 'custom' },
          competencies: [],
          avgGap: 0,
          competencyCount: 0,
          priority: { score: 0, components: {} },
          phase: custom.phase,
          projectedImpact: [],
          isCustom: true,
          hours: custom.hours || null,
        });
      }
    }
  }

  // 4. Reorder within phases
  if (overrides.orderOverrides) {
    for (const [phaseKey, orderedIds] of Object.entries(overrides.orderOverrides)) {
      const phase = phases.find((p) => p.key === phaseKey);
      if (!phase) continue;

      const idOrder = new Map(orderedIds.map((id, i) => [id, i]));
      phase.projects.sort((a, b) => {
        const aIdx = idOrder.has(a.serviceId) ? idOrder.get(a.serviceId) : Infinity;
        const bIdx = idOrder.has(b.serviceId) ? idOrder.get(b.serviceId) : Infinity;
        return aIdx - bIdx;
      });
    }
  }

  // Recount
  for (const phase of phases) {
    phase.projectCount = phase.projects.length;
  }

  const totalProjects = phases.reduce((s, p) => s + p.projectCount, 0);

  // Rebuild summary
  const summary = {
    ...baseRoadmap.summary,
    totalProjects,
    byPhase: Object.fromEntries(phases.map((p) => [p.key, p.projectCount])),
  };

  return { ...baseRoadmap, phases, totalProjects, summary };
}
