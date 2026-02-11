/**
 * Engagement Recommendation Engine
 *
 * Pure function that takes diagnostic results + service catalog as input
 * and returns a structured EngagementRecommendation object.
 * No DB calls — fully testable.
 */

export const STATUS_WEIGHTS = {
  unable: 4,
  warning: 3,
  careful: 2,
  healthy: 1,
};

export const FUNCTION_ORDER = [
  'Cross Functional',
  'Sales',
  'Marketing',
  'Customer Success',
  'Partnerships',
];

export const TIERS = [
  { id: 'starter', hours: 50, price: 15000, label: 'Starter' },
  { id: 'growth', hours: 100, price: 25000, label: 'Growth' },
  { id: 'scale', hours: 225, price: 50000, label: 'Scale' },
];

/**
 * Filter items flagged for engagement
 */
export function filterPriorityItems(processes) {
  return (processes || []).filter(p => p.addToEngagement);
}

/**
 * Enrich each process with service catalog hours/rates
 */
export function enrichWithCatalog(priorityProcesses, serviceCatalog) {
  return priorityProcesses.map(process => {
    const catalogEntry = (serviceCatalog || []).find(
      s => s.name?.toLowerCase().replace(/\s+/g, '-') === process.serviceId
        || s.id === process.serviceId
    );

    return {
      ...process,
      hoursLow: catalogEntry?.hours_low ?? 30,
      hoursHigh: catalogEntry?.hours_high ?? 60,
      rate: catalogEntry?.default_rate ?? 250,
      deliverables: catalogEntry?.key_steps ?? [],
      catalogId: catalogEntry?.id ?? null,
      description: catalogEntry?.description ?? '',
      primaryFunction: catalogEntry?.primary_function ?? process.function,
    };
  });
}

/**
 * Score and label priority for each item
 */
export function scorePriority(enrichedItem) {
  return {
    ...enrichedItem,
    priorityScore: STATUS_WEIGHTS[enrichedItem.status] ?? 1,
    priorityLabel: enrichedItem.status === 'unable' || enrichedItem.status === 'warning'
      ? 'High' : 'Medium',
  };
}

/**
 * Group by function and build an ordered sequence with timeline
 */
export function groupAndSequence(scoredItems) {
  const groups = {};

  for (const func of FUNCTION_ORDER) {
    const items = scoredItems
      .filter(item => item.function === func)
      .sort((a, b) => b.priorityScore - a.priorityScore);

    if (items.length > 0) {
      groups[func] = items;
    }
  }

  // Flatten into ordered sequence for timeline
  const sequence = [];
  let weekCursor = 1;

  for (const func of FUNCTION_ORDER) {
    if (!groups[func]) continue;
    for (const item of groups[func]) {
      const avgHours = (item.hoursLow + item.hoursHigh) / 2;
      const durationWeeks = Math.max(2, Math.ceil(avgHours / 20));
      sequence.push({
        ...item,
        startWeek: weekCursor,
        durationWeeks,
      });
      // Overlap projects within the same function by 1 week
      weekCursor += Math.max(1, durationWeeks - 1);
    }
  }

  return { groups, sequence };
}

/**
 * Extract managed services from diagnostic processes
 */
function extractManagedServices(processes) {
  return (processes || []).filter(p => p.serviceType === 'managed');
}

/**
 * Main recommendation engine entry point
 */
export function computeRecommendation(diagnosticResult, serviceCatalog, managedServices) {
  const priorityProcesses = filterPriorityItems(
    (diagnosticResult.processes || []).filter(p => p.serviceType !== 'managed')
  );
  const enriched = enrichWithCatalog(priorityProcesses, serviceCatalog);
  const scored = enriched.map(scorePriority);
  const { groups, sequence } = groupAndSequence(scored);

  // Compute totals
  const totalHoursLow = scored.reduce((sum, p) => sum + p.hoursLow, 0);
  const totalHoursHigh = scored.reduce((sum, p) => sum + p.hoursHigh, 0);
  const avgHours = Math.round((totalHoursLow + totalHoursHigh) / 2);

  // Managed services hours
  const priorityManaged = (managedServices || []).filter(m => m.addToEngagement);
  const managedHoursPerMonth = priorityManaged.reduce(
    (sum, m) => sum + (m.hoursPerMonth || 8), 0
  );

  // Recommend tier: pick the smallest tier that completes projects within 6 months
  const recommendedTier = TIERS.find(tier => {
    const availablePerMonth = tier.hours - managedHoursPerMonth;
    if (availablePerMonth <= 0) return false;
    const monthsNeeded = avgHours / availablePerMonth;
    return monthsNeeded <= 6;
  }) || TIERS[TIERS.length - 1];

  const estimatedInvestment = recommendedTier.price * 6;
  const availableHours = recommendedTier.hours - managedHoursPerMonth;
  const estimatedDurationMonths = availableHours > 0
    ? Math.ceil(avgHours / availableHours)
    : 12;

  return {
    customerId: diagnosticResult.customer_id || 'demo',
    diagnosticResultId: diagnosticResult.id || 'demo',
    diagnosticType: diagnosticResult.diagnostic_type || 'gtm',
    generatedAt: new Date().toISOString(),

    summary: {
      recommendedTier,
      totalHoursLow,
      totalHoursHigh,
      avgProjectHours: avgHours,
      managedHoursPerMonth,
      estimatedDurationMonths,
      estimatedInvestment,
      projectCount: scored.length,
      managedServiceCount: priorityManaged.length,
      highPriorityCount: scored.filter(s => s.priorityLabel === 'High').length,
    },

    functionGroups: groups,
    projectSequence: sequence,
    managedServices: priorityManaged,
    tiers: TIERS.map(tier => ({
      ...tier,
      estimatedMonths: availableHours > 0
        ? Math.ceil(avgHours / Math.max(1, tier.hours - managedHoursPerMonth))
        : 12,
      isRecommended: tier.id === recommendedTier.id,
    })),
  };
}
