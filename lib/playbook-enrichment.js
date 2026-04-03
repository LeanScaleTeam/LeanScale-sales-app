/**
 * Playbook Enrichment — Serves pre-extracted structured content for finding cards.
 *
 * Fields are extracted from advisory markdown at build time by
 * scripts/extract-enrichment-data.js and stored in data/playbook-enrichment-data.js.
 * This keeps the 8.6MB advisory markdown out of the client bundle.
 */

import { playbookEnrichmentData } from '../data/playbook-enrichment-data';

const EMPTY = {
  description: null,
  impactTemplate: null,
  outcomeStatement: null,
  outcomes: [],
  power10Metrics: [],
};

/**
 * Given a list of serviceIds, return pre-extracted enrichment fields.
 * Data is generated at build time — no markdown parsing at runtime.
 *
 * Returns: { description, impactTemplate, outcomeStatement, outcomes, power10Metrics }
 */
export function enrichFromPlaybooks(serviceIds) {
  if (!serviceIds || serviceIds.length === 0) return EMPTY;
  for (const sid of serviceIds) {
    const enrichment = playbookEnrichmentData[sid];
    if (enrichment) return enrichment;
  }
  return EMPTY;
}
