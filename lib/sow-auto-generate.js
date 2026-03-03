/**
 * SOW Auto-Generation from Diagnostic Data
 *
 * Generates SOW sections from diagnostic processes + service catalog.
 * Groups priority items by function, looks up hours/rates from catalog.
 */

import { autoPopulateDates } from './date-utils';

/**
 * Generate SOW sections from diagnostic processes.
 *
 * @param {Array} processes - Diagnostic process objects
 * @param {Map<string, object>} catalogMap - Map of serviceId slug → service catalog entry
 * @returns {Array} Section objects ready for bulkCreateSections()
 */
export function generateSectionsFromDiagnostic(processes, catalogMap = new Map()) {
  // Only include items flagged as priority for the engagement
  const actionable = processes.filter(p => p.addToEngagement);

  if (actionable.length === 0) return [];

  // Group by function (e.g., "Marketing", "Sales", "Cross Functional")
  const groups = {};
  for (const p of actionable) {
    const fn = p.function || 'General';
    if (!groups[fn]) groups[fn] = [];
    groups[fn].push(p);
  }

  const sections = [];
  let sortOrder = 0;

  for (const [functionName, items] of Object.entries(groups)) {
    let totalHoursLow = 0;
    let totalHoursHigh = 0;
    let rateSum = 0;
    let rateCount = 0;
    const allDeliverables = [];

    for (const item of items) {
      const service = item.serviceId ? catalogMap.get(item.serviceId) : null;
      if (service) {
        if (service.hours_low) totalHoursLow += service.hours_low;
        if (service.hours_high) totalHoursHigh += service.hours_high;
        if (service.default_rate) {
          rateSum += Number(service.default_rate);
          rateCount++;
        }
        // Collect deliverables from key_steps
        if (Array.isArray(service.key_steps)) {
          for (const step of service.key_steps) {
            if (typeof step === 'string' && !allDeliverables.includes(step)) {
              allDeliverables.push(step);
            }
          }
        }
      }
    }

    const avgRate = rateCount > 0 ? Math.round(rateSum / rateCount) : null;
    const estimatedHours = totalHoursLow > 0
      ? Math.round((totalHoursLow + totalHoursHigh) / 2)
      : null;

    const statusSummary = summarizeStatuses(items);

    sections.push({
      title: functionName,
      description: `${functionName} improvements: ${statusSummary}. Covers ${items.length} diagnostic item${items.length === 1 ? '' : 's'}.`,
      deliverables: allDeliverables.length > 0 ? allDeliverables : items.map(i => i.name),
      hours: estimatedHours,
      rate: avgRate,
      diagnosticItems: items.map(i => i.name),
      sortOrder: sortOrder++,
    });
  }

  // Auto-populate dates based on 100 hrs/month (Growth tier)
  const withDates = autoPopulateDates(sections, new Date(), 100);
  return withDates.map(s => ({
    ...s,
    startDate: s.startDate || null,
    endDate: s.endDate || null,
  }));
}

/**
 * Generate an executive summary from diagnostic data.
 */
export function generateExecutiveSummary(processes, customerName, diagnosticType, overallRating) {
  const total = processes.length;
  const warning = processes.filter(p => p.status === 'warning').length;
  const unable = processes.filter(p => p.status === 'unable').length;
  const careful = processes.filter(p => p.status === 'careful').length;
  const healthy = processes.filter(p => p.status === 'healthy').length;
  const priority = processes.filter(p => p.addToEngagement).length;

  const typeLabel = {
    gtm: 'GTM Operations',
    clay: 'Clay Enrichment & Automation',
    cpq: 'Quote-to-Cash',
  }[diagnosticType] || 'Operations';

  const ratingLabel = {
    critical: 'critical attention',
    warning: 'significant improvement',
    moderate: 'targeted optimization',
    healthy: 'fine-tuning',
  }[overallRating] || 'review';

  return `Based on a comprehensive ${typeLabel} diagnostic assessment of ${total} processes, ${customerName || 'the organization'} requires ${ratingLabel}. The assessment identified ${warning + unable} critical items (${warning} warning, ${unable} unable), ${careful} areas requiring caution, and ${healthy} healthy processes. ${priority} items have been flagged as priorities for the engagement scope.`;
}

function summarizeStatuses(items) {
  const counts = { warning: 0, unable: 0, careful: 0, healthy: 0 };
  items.forEach(i => { if (counts[i.status] !== undefined) counts[i.status]++; });

  const parts = [];
  if (counts.warning) parts.push(`${counts.warning} warning`);
  if (counts.unable) parts.push(`${counts.unable} unable`);
  if (counts.careful) parts.push(`${counts.careful} careful`);
  if (counts.healthy) parts.push(`${counts.healthy} healthy`);
  return parts.join(', ');
}

// --------------- v2 adapters ---------------

const LAYER_LABELS = {
  foundation: 'Foundation',
  motions: 'Motions',
  maturity: 'Maturity',
};

/**
 * Generate SOW sections from v2 diagnostic items.
 *
 * v2 items have: id, name, layer, status, serviceIds[], signals[], recommendations[]
 * Groups by layer instead of function.
 */
export function generateSectionsFromDiagnosticV2(items, catalogMap = new Map()) {
  const actionable = items.filter(it => it.status === 'warning' || it.status === 'careful');
  if (actionable.length === 0) return [];

  const groups = {};
  for (const it of actionable) {
    const layer = it.layer || 'general';
    if (!groups[layer]) groups[layer] = [];
    groups[layer].push(it);
  }

  const sections = [];
  let sortOrder = 0;

  for (const [layer, layerItems] of Object.entries(groups)) {
    let totalHoursLow = 0;
    let totalHoursHigh = 0;
    let rateSum = 0;
    let rateCount = 0;
    const allDeliverables = [];

    for (const item of layerItems) {
      const sids = item.serviceIds || [];
      for (const sid of sids) {
        const service = catalogMap.get(sid);
        if (service) {
          if (service.hours_low) totalHoursLow += service.hours_low;
          if (service.hours_high) totalHoursHigh += service.hours_high;
          if (service.default_rate) {
            rateSum += Number(service.default_rate);
            rateCount++;
          }
          if (Array.isArray(service.key_steps)) {
            for (const step of service.key_steps) {
              if (typeof step === 'string' && !allDeliverables.includes(step)) {
                allDeliverables.push(step);
              }
            }
          }
        }
      }
    }

    const avgRate = rateCount > 0 ? Math.round(rateSum / rateCount) : null;
    const estimatedHours = totalHoursLow > 0 ? Math.round((totalHoursLow + totalHoursHigh) / 2) : null;
    const statusSummary = summarizeStatuses(layerItems);
    const layerLabel = LAYER_LABELS[layer] || layer;

    sections.push({
      title: `${layerLabel} Improvements`,
      description: `${layerLabel} layer: ${statusSummary}. Covers ${layerItems.length} diagnostic item${layerItems.length === 1 ? '' : 's'}.`,
      deliverables: allDeliverables.length > 0 ? allDeliverables : layerItems.map(i => `${i.id}: ${i.name}`),
      hours: estimatedHours,
      rate: avgRate,
      diagnosticItems: layerItems.map(i => i.id),
      sortOrder: sortOrder++,
    });
  }

  return sections;
}

/**
 * Generate an executive summary from v2 diagnostic data.
 */
export function generateExecutiveSummaryV2(items, scores, customerName) {
  const total = items.length;
  const warning = items.filter(it => it.status === 'warning').length;
  const careful = items.filter(it => it.status === 'careful').length;
  const healthy = items.filter(it => it.status === 'healthy').length;

  const overallScore = scores?.overall ?? 0;
  const ratingLabel = overallScore >= 2.5 ? 'healthy' : overallScore >= 1.5 ? 'needs attention' : 'critical';

  return `Based on a comprehensive GTM diagnostic assessment (v2) of ${total} items across Foundation, Motions, and Maturity layers, ${customerName || 'the organization'} is rated as ${ratingLabel} with an overall score of ${overallScore.toFixed(1)}/3.0. The assessment identified ${warning} critical items, ${careful} areas needing attention, and ${healthy} healthy items. Foundation scored ${(scores?.foundation ?? 0).toFixed(1)}/3.0, Motions scored ${(scores?.motions ?? 0).toFixed(1)}/3.0, and Maturity scored ${(scores?.maturity ?? 0).toFixed(1)}/3.0.`;
}

// --------------- v3 adapters ---------------

const PHASE_LABELS = {
  FOUNDATION: 'Phase 1: Foundation',
  BUILD: 'Phase 2: Build',
  OPTIMIZE: 'Phase 3: Optimize',
  SCALE: 'Phase 4: Scale',
};

const PILLAR_LABELS_SOW = {
  systems: 'Systems & Data',
  process: 'Process & Workflow',
  planning: 'Planning & Strategy',
  people: 'People & Enablement',
  reporting: 'Reporting & Analytics',
  enablement: 'Enablement & Training',
};

/**
 * Generate SOW sections from v3 roadmap.
 *
 * v3 roadmap has: phases[] with projects. Each project has serviceId, service, competencies[].
 * Groups by phase — one SOW section per roadmap phase.
 */
export function generateSectionsFromDiagnosticV3(roadmap, catalogMap = new Map()) {
  if (!roadmap?.phases) return [];

  const sections = [];
  let sortOrder = 0;

  for (const phase of roadmap.phases) {
    if (phase.projects.length === 0) continue;

    let totalHoursLow = 0;
    let totalHoursHigh = 0;
    let rateSum = 0;
    let rateCount = 0;
    const allDeliverables = [];
    const diagnosticItems = [];

    for (const project of phase.projects) {
      // Custom projects use user-provided hours
      if (project.isCustom) {
        if (project.hours) {
          totalHoursLow += project.hours;
          totalHoursHigh += project.hours;
        }
        allDeliverables.push(project.service?.name || project.serviceId);
        continue;
      }

      const service = catalogMap.get(project.serviceId);
      if (service) {
        if (service.hours_low) totalHoursLow += service.hours_low;
        if (service.hours_high) totalHoursHigh += service.hours_high;
        if (service.default_rate) {
          rateSum += Number(service.default_rate);
          rateCount++;
        }
        if (Array.isArray(service.key_steps)) {
          for (const step of service.key_steps) {
            if (typeof step === 'string' && !allDeliverables.includes(step)) {
              allDeliverables.push(step);
            }
          }
        }
      }

      // Collect competency IDs for diagnostic reference
      for (const comp of project.competencies || []) {
        if (!diagnosticItems.includes(comp.id)) {
          diagnosticItems.push(comp.id);
        }
      }
    }

    const avgRate = rateCount > 0 ? Math.round(rateSum / rateCount) : null;
    const estimatedHours = totalHoursLow > 0
      ? Math.round((totalHoursLow + totalHoursHigh) / 2)
      : null;

    const phaseLabel = PHASE_LABELS[phase.key] || phase.name;
    const projectNames = phase.projects.map(p => p.service?.name || p.serviceId);

    sections.push({
      title: phaseLabel,
      description: `${phaseLabel}: ${phase.projects.length} project${phase.projects.length !== 1 ? 's' : ''} — ${projectNames.join(', ')}.`,
      deliverables: allDeliverables.length > 0 ? allDeliverables : projectNames,
      hours: estimatedHours,
      rate: avgRate,
      diagnosticItems,
      sortOrder: sortOrder++,
    });
  }

  // Auto-populate dates
  const withDates = autoPopulateDates(sections, new Date(), 100);
  return withDates.map(s => ({
    ...s,
    startDate: s.startDate || null,
    endDate: s.endDate || null,
  }));
}

/**
 * Generate an executive summary from v3 diagnostic data.
 */
export function generateExecutiveSummaryV3(roadmap, pillarScores, customerName) {
  const overallScore = pillarScores
    ? Object.values(pillarScores).reduce((s, v) => s + (v || 0), 0) / Math.max(1, Object.values(pillarScores).length)
    : 0;
  const ratingLabel = overallScore >= 3.5 ? 'healthy'
    : overallScore >= 2.5 ? 'needs targeted optimization'
    : 'requires significant attention';

  const totalProjects = roadmap?.totalProjects || 0;
  const phaseBreakdown = roadmap?.phases
    ?.filter(p => p.projectCount > 0)
    ?.map(p => `${p.name} (${p.projectCount})`)
    ?.join(', ') || 'none';

  const pillarSummary = pillarScores
    ? Object.entries(pillarScores)
        .map(([key, score]) => `${PILLAR_LABELS_SOW[key] || key}: ${(score || 0).toFixed(1)}/5.0`)
        .join(', ')
    : '';

  return `Based on a comprehensive 6-pillar RevOps assessment, ${customerName || 'the organization'} ${ratingLabel} with an average score of ${overallScore.toFixed(1)}/5.0. ${pillarSummary ? `Pillar scores: ${pillarSummary}.` : ''} The recommended roadmap includes ${totalProjects} project${totalProjects !== 1 ? 's' : ''} across phases: ${phaseBreakdown}.`;
}
