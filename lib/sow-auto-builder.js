/**
 * Auto SOW Builder — generates SOW sections from diagnostic results + service catalog
 *
 * Core engine that:
 * - Filters priority items (warning/unable + addToEngagement)
 * - Groups by function or outcome
 * - Looks up service catalog entries by serviceId (slug)
 * - Generates section objects ready for bulkCreateSections()
 * - Generates executive summary from diagnostic stats
 * - Computes timeline suggestions
 */

import { supabaseAdmin } from './supabase';

// ============================================
// ITEM SELECTION
// ============================================

const STATUS_PRIORITY = { unable: 0, warning: 1, careful: 2, healthy: 3 };

/**
 * Filter diagnostic processes to those needing SOW sections
 */
export function selectPriorityItems(processes) {
  return (processes || []).filter(p =>
    p.status === 'warning' ||
    p.status === 'unable' ||
    p.addToEngagement === true
  );
}

// ============================================
// GROUPING
// ============================================

/**
 * Group items by a given key (function or outcome)
 */
export function groupItems(items, groupBy = 'function') {
  const groups = {};
  items.forEach(item => {
    const key = item[groupBy] || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  // Sort within each group by severity
  Object.values(groups).forEach(group => {
    group.sort((a, b) => (STATUS_PRIORITY[a.status] ?? 9) - (STATUS_PRIORITY[b.status] ?? 9));
  });

  return groups;
}

// ============================================
// SERVICE CATALOG LOOKUP
// ============================================

/**
 * Batch fetch catalog entries by slug, returning a slug → entry map
 */
export async function lookupCatalogEntries(items) {
  const serviceIds = [...new Set(items.map(i => i.serviceId).filter(Boolean))];
  if (serviceIds.length === 0) return {};

  if (!supabaseAdmin) return {};

  const { data } = await supabaseAdmin
    .from('service_catalog')
    .select('*')
    .in('slug', serviceIds)
    .eq('active', true);

  const catalog = {};
  (data || []).forEach(entry => {
    catalog[entry.slug] = entry;
  });

  // Fallback: try name-based matching for unmatched serviceIds
  const unmatchedIds = serviceIds.filter(id => !catalog[id]);
  if (unmatchedIds.length > 0 && data) {
    // Fetch all active entries for name-based fallback
    const { data: allData } = await supabaseAdmin
      .from('service_catalog')
      .select('*')
      .eq('active', true);

    if (allData) {
      unmatchedIds.forEach(serviceId => {
        const normalized = serviceId.replace(/-/g, '').toLowerCase();
        const match = allData.find(c =>
          c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized
        );
        if (match) catalog[serviceId] = match;
      });
    }
  }

  return catalog;
}

// ============================================
// SECTION GENERATION
// ============================================

const FUNCTION_ORDER = [
  'Cross Functional',
  'Marketing',
  'Sales',
  'Customer Success',
  'Partnerships',
];

function addWeeks(date, weeks) {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

function deduplicateDeliverables(deliverables) {
  const seen = new Set();
  return deliverables.filter(d => {
    const key = (typeof d === 'string' ? d : d.name || d.title || '').toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Decide whether to use per-item sections (≤8 items) or grouped sections
 */
export function shouldUseItemSections(items) {
  return items.length <= 8;
}

/**
 * Generate one section per diagnostic item
 */
export function generateItemSections(items, catalogMap, options = {}) {
  const { defaultRate = 200, sowStartDate = null } = options;
  let cumulativeWeeks = 0;

  return items.map((item, idx) => {
    const catalog = catalogMap[item.serviceId];
    const hours = catalog
      ? Math.round((catalog.hours_low + catalog.hours_high) / 2)
      : null;
    const rate = catalog?.default_rate ? parseFloat(catalog.default_rate) : defaultRate;

    const deliverables = catalog?.key_steps
      ? (Array.isArray(catalog.key_steps) ? catalog.key_steps : []).map(s =>
          typeof s === 'string' ? s : s.name || s.title || String(s)
        )
      : [];

    // Timeline
    const estimatedWeeks = hours ? Math.max(2, Math.ceil(hours / 20)) : 4;
    const startDate = sowStartDate
      ? addWeeks(new Date(sowStartDate), cumulativeWeeks)
      : null;
    const endDate = startDate ? addWeeks(startDate, estimatedWeeks) : null;
    cumulativeWeeks += estimatedWeeks + 1; // +1 week buffer

    return {
      title: item.name,
      description: catalog?.description || `Strategic project addressing ${item.name} based on diagnostic findings.`,
      hours,
      rate,
      deliverables,
      diagnosticItems: [item.name],
      sortOrder: idx,
      serviceCatalogId: catalog?.id || null,
      startDate: startDate ? startDate.toISOString().split('T')[0] : null,
      endDate: endDate ? endDate.toISOString().split('T')[0] : null,
    };
  });
}

/**
 * Generate grouped sections (one per function)
 */
export function generateGroupedSections(groupedItems, catalogMap, options = {}) {
  const { defaultRate = 200, sowStartDate = null } = options;
  const sections = [];
  let sortOrder = 0;
  let cumulativeWeeks = 0;

  // Use defined order, then any remaining keys alphabetically
  const allKeys = Object.keys(groupedItems);
  const orderedKeys = [
    ...FUNCTION_ORDER.filter(fn => groupedItems[fn]),
    ...allKeys.filter(k => !FUNCTION_ORDER.includes(k)).sort(),
  ];

  for (const fn of orderedKeys) {
    const items = groupedItems[fn];
    if (!items || items.length === 0) continue;

    let totalHoursLow = 0;
    let totalHoursHigh = 0;
    let rateSum = 0;
    let rateCount = 0;
    const allDeliverables = [];
    const descriptions = [];

    items.forEach(item => {
      const catalog = catalogMap[item.serviceId];
      if (catalog) {
        totalHoursLow += catalog.hours_low || 0;
        totalHoursHigh += catalog.hours_high || 0;
        if (catalog.default_rate) {
          rateSum += parseFloat(catalog.default_rate);
          rateCount++;
        }
        if (catalog.key_steps && Array.isArray(catalog.key_steps)) {
          allDeliverables.push(...catalog.key_steps.map(s =>
            typeof s === 'string' ? s : s.name || s.title || String(s)
          ));
        }
        if (catalog.description) {
          descriptions.push(`**${catalog.name}:** ${catalog.description}`);
        }
      }
    });

    const hours = totalHoursLow && totalHoursHigh
      ? Math.round((totalHoursLow + totalHoursHigh) / 2)
      : totalHoursLow || totalHoursHigh || null;

    const rate = rateCount > 0
      ? Math.round(rateSum / rateCount)
      : defaultRate;

    // Cap deliverables at 15 for large groups
    const dedupedDeliverables = deduplicateDeliverables(allDeliverables);
    const cappedDeliverables = dedupedDeliverables.slice(0, 15);

    // Timeline
    const estimatedWeeks = hours ? Math.max(2, Math.ceil(hours / 20)) : 4;
    const startDate = sowStartDate
      ? addWeeks(new Date(sowStartDate), cumulativeWeeks)
      : null;
    const endDate = startDate ? addWeeks(startDate, estimatedWeeks) : null;
    cumulativeWeeks += estimatedWeeks + 1;

    sections.push({
      title: `${fn} — GTM Operations`,
      description: descriptions.join('\n\n') || `Strategic projects addressing ${fn.toLowerCase()} diagnostic findings.`,
      hours,
      rate,
      deliverables: cappedDeliverables,
      diagnosticItems: items.map(i => i.name),
      sortOrder: sortOrder++,
      startDate: startDate ? startDate.toISOString().split('T')[0] : null,
      endDate: endDate ? endDate.toISOString().split('T')[0] : null,
    });
  }

  return sections;
}

// ============================================
// EXECUTIVE SUMMARY
// ============================================

/**
 * Generate executive summary from diagnostic statistics
 */
export function generateExecutiveSummary(processes, customerName, diagnosticType, statusCounts) {
  const total = processes.length;
  if (total === 0) {
    return 'The diagnostic assessment indicates a healthy operational state. This SOW addresses select optimization opportunities identified during the assessment.';
  }

  const warningCount = statusCounts?.warning || 0;
  const unableCount = statusCounts?.unable || 0;
  const criticalCount = warningCount + unableCount;
  const criticalPct = Math.round((criticalCount / total) * 100);

  const priorityItems = selectPriorityItems(processes);
  const functions = [...new Set(priorityItems.map(p => p.function).filter(Boolean))];

  const diagnosticLabel = {
    gtm: 'GTM Operations',
    clay: 'Clay Enrichment',
    cpq: 'Quote-to-Cash',
  }[diagnosticType] || 'Operations';

  const companyRef = customerName || 'your organization';

  let severityDesc;
  if (criticalPct > 50) severityDesc = 'significant operational gaps requiring immediate attention';
  else if (criticalPct > 30) severityDesc = 'several areas requiring strategic improvement';
  else if (criticalPct > 10) severityDesc = 'targeted opportunities for optimization';
  else severityDesc = 'a strong foundation with select enhancement opportunities';

  const summary = [
    `Following a comprehensive ${diagnosticLabel} diagnostic assessment of ${companyRef}, ` +
    `LeanScale identified ${severityDesc}. ` +
    `Of the ${total} processes evaluated, ${criticalCount} (${criticalPct}%) ` +
    `require attention — ${warningCount} flagged as warning and ${unableCount} unable to report.`,
    '',
    priorityItems.length > 0
      ? `This Statement of Work addresses ${priorityItems.length} priority items` +
        (functions.length > 0 ? ` spanning ${functions.join(', ')}` : '') + '. ' +
        `The recommended engagement focuses on establishing operational foundations, ` +
        `implementing key process improvements, and enabling data-driven decision making ` +
        `across ${companyRef}'s go-to-market organization.`
      : `No priority items were identified. This SOW addresses select optimization opportunities.`,
  ].join('\n');

  return summary;
}

// ============================================
// MAIN AUTO-BUILD FUNCTION
// ============================================

/**
 * Main entry point: given diagnostic processes, generate SOW sections
 *
 * @param {Object} options
 * @param {Array} options.processes - diagnostic result processes array
 * @param {string} options.groupBy - 'function' or 'outcome'
 * @param {number} options.defaultRate - fallback hourly rate
 * @param {string} options.sowStartDate - ISO date string for timeline start
 * @param {string} options.customerName - for executive summary
 * @param {string} options.diagnosticType - 'gtm', 'clay', 'cpq'
 * @returns {Object} { sections, executiveSummary, priorityItems, statusCounts }
 */
export async function autoGenerateSow({
  processes,
  groupBy = 'function',
  defaultRate = 200,
  sowStartDate = null,
  customerName = null,
  diagnosticType = 'gtm',
}) {
  // 1. Select priority items
  const priorityItems = selectPriorityItems(processes);

  // 2. Compute status counts
  const statusCounts = { warning: 0, unable: 0, careful: 0, healthy: 0 };
  processes.forEach(p => {
    if (statusCounts[p.status] !== undefined) statusCounts[p.status]++;
  });

  // 3. Generate executive summary
  const executiveSummary = generateExecutiveSummary(processes, customerName, diagnosticType, statusCounts);

  if (priorityItems.length === 0) {
    return { sections: [], executiveSummary, priorityItems, statusCounts };
  }

  // 4. Lookup catalog entries
  const catalogMap = await lookupCatalogEntries(priorityItems);

  // 5. Generate sections
  let sections;
  if (shouldUseItemSections(priorityItems)) {
    sections = generateItemSections(priorityItems, catalogMap, { defaultRate, sowStartDate });
  } else {
    const grouped = groupItems(priorityItems, groupBy);
    sections = generateGroupedSections(grouped, catalogMap, { defaultRate, sowStartDate });
  }

  return { sections, executiveSummary, priorityItems, statusCounts };
}
