/**
 * SOW Preview Engine — lightweight client-side SOW calculator
 *
 * Pure function, no Supabase dependency. Takes processes + static catalog data
 * and returns a preview of what the auto-generated SOW would look like.
 *
 * PRICING MODEL: Retainer-based tiers (not rate × hours)
 * Total hours → tier → monthly price → duration.
 * See docs/specs/pricing-model.md for details.
 */

import { strategicProjects, functionLabels } from '../data/services-catalog';
import { TIERS, filterPriorityItems, enrichWithCatalog, recommendTier } from './engagement-engine';
import { selectPriorityItems, groupItems, shouldUseItemSections } from './sow-auto-builder';

/**
 * Build a flat array of catalog-like entries from the static services-catalog data
 * so enrichWithCatalog can match against them.
 */
function buildStaticCatalog() {
  const catalog = [];
  for (const [funcKey, services] of Object.entries(strategicProjects)) {
    const funcLabel = functionLabels[funcKey] || funcKey;
    for (const svc of services) {
      catalog.push({
        id: svc.id,
        name: svc.name,
        slug: svc.id,
        description: svc.description,
        primary_function: funcLabel,
        hours_low: 30,
        hours_high: 60,
        key_steps: [],
      });
    }
  }
  return catalog;
}

const STATIC_CATALOG = buildStaticCatalog();

/**
 * Compute a SOW preview from current diagnostic processes
 *
 * @param {Array} processes - current diagnostic processes array
 * @param {Array} [serviceCatalog] - optional DB catalog entries; falls back to static
 * @returns {Object} preview result
 */
export function computeSowPreview(processes, serviceCatalog) {
  const catalog = serviceCatalog && serviceCatalog.length > 0
    ? serviceCatalog
    : STATIC_CATALOG;

  // 1. Select priority items (warning/unable OR addToEngagement)
  const priorityItems = selectPriorityItems(processes || []);

  if (priorityItems.length === 0) {
    return {
      sections: [],
      totalHoursLow: 0,
      totalHoursHigh: 0,
      totalHours: 0,
      recommendedTier: TIERS[0],
      monthlyInvestment: TIERS[0].price,
      estimatedDurationMonths: 0,
      totalEngagementValue: 0,
      itemCount: 0,
      sectionCount: 0,
    };
  }

  // 2. Enrich with catalog data for hours (no rates)
  const enriched = enrichWithCatalog(priorityItems, catalog);

  // 3. Compute totals
  const totalHoursLow = enriched.reduce((sum, p) => sum + (p.hoursLow || 30), 0);
  const totalHoursHigh = enriched.reduce((sum, p) => sum + (p.hoursHigh || 60), 0);
  const totalHours = Math.round((totalHoursLow + totalHoursHigh) / 2);

  // 4. Determine sections — mirror auto-builder logic
  let sections;
  if (shouldUseItemSections(priorityItems)) {
    sections = priorityItems.map(item => ({
      title: item.name,
      itemCount: 1,
      function: item.function || 'Other',
    }));
  } else {
    const grouped = groupItems(priorityItems, 'function');
    sections = Object.entries(grouped).map(([fn, items]) => ({
      title: `${fn} — GTM Operations`,
      itemCount: items.length,
      function: fn,
    }));
  }

  // 5. Recommend tier based on total hours
  const recommended = recommendTier(totalHours);
  const estimatedDurationMonths = Math.ceil(totalHours / recommended.hours);
  const totalEngagementValue = recommended.price * estimatedDurationMonths;

  return {
    sections,
    totalHoursLow,
    totalHoursHigh,
    totalHours,
    recommendedTier: recommended,
    monthlyInvestment: recommended.price,
    estimatedDurationMonths,
    totalEngagementValue,
    itemCount: priorityItems.length,
    sectionCount: sections.length,
  };
}
