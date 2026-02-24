/**
 * Service Mapping
 *
 * Maps diagnostic items to LeanScale service catalog IDs.
 * The service catalog lives in data/services-catalog.js with kebab-case IDs
 * like 'lead-routing', 'activity-capture', etc.
 *
 * This module validates that serviceIds on items are real catalog entries
 * and provides lookup helpers.
 */

import { strategicProjects, managedServices } from '../../data/services-catalog';

// Build a flat set of all known service IDs
const ALL_SERVICE_IDS = new Set();

for (const category of Object.values(strategicProjects)) {
  for (const service of category) {
    ALL_SERVICE_IDS.add(service.id);
  }
}
for (const category of Object.values(managedServices)) {
  for (const service of category) {
    ALL_SERVICE_IDS.add(service.id);
  }
}

/**
 * Validate that all serviceIds on items exist in the catalog.
 * Returns any unknown IDs for debugging.
 * @param {Array} items - DiagnosticItem[]
 * @returns {string[]} Unknown service IDs (should be empty in production)
 */
export function validateServiceIds(items) {
  const unknown = [];
  for (const item of items) {
    for (const sid of item.serviceIds || []) {
      if (!ALL_SERVICE_IDS.has(sid)) {
        unknown.push(`${item.id}: ${sid}`);
      }
    }
  }
  return unknown;
}

/**
 * Collect all unique serviceIds from actionable items (warning/careful + addToEngagement).
 * @param {Array} items - DiagnosticItem[]
 * @returns {string[]} Unique service IDs
 */
export function collectActionableServiceIds(items) {
  const ids = new Set();
  for (const item of items) {
    if (item.status === 'warning' || item.status === 'careful') {
      for (const sid of item.serviceIds || []) {
        ids.add(sid);
      }
    }
  }
  return [...ids];
}

/**
 * Look up a service in the catalog by ID.
 * @param {string} serviceId - Kebab-case service ID
 * @returns {object|null} Service object with id, name, icon, description
 */
export function lookupService(serviceId) {
  for (const category of Object.values(strategicProjects)) {
    const found = category.find((s) => s.id === serviceId);
    if (found) return { ...found, type: 'strategic' };
  }
  for (const category of Object.values(managedServices)) {
    const found = category.find((s) => s.id === serviceId);
    if (found) return { ...found, type: 'managed' };
  }
  return null;
}
