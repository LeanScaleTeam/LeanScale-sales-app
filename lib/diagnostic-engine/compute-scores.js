/**
 * Composite Scoring
 *
 * Computes weighted averages per layer and overall health score.
 */

import { STATUS_NUMERIC, LAYER_WEIGHTS, SALESFORCE_LAYER_WEIGHTS } from './constants';

/**
 * Compute composite scores from graded items.
 * @param {Array} items - DiagnosticItem[] with status per item
 * @param {string} crmType - 'salesforce' or 'hubspot' (default)
 * @returns {{ foundation: number, motions: number, maturity: number, overall: number, overallStatus: string, platformHealth?: number }}
 */
export function computeScores(items, crmType = 'hubspot') {
  const layers = { foundation: [], motions: [], maturity: [] };

  // Add platformHealth layer if Salesforce
  const isSalesforce = crmType === 'salesforce';
  if (isSalesforce) {
    layers.platformHealth = [];
  }

  for (const item of items) {
    if (item.status !== 'unable' && STATUS_NUMERIC[item.status] !== undefined) {
      if (layers[item.layer]) {
        layers[item.layer].push(STATUS_NUMERIC[item.status]);
      }
    }
  }

  const foundation = average(layers.foundation);
  const motions = average(layers.motions);
  const maturity = average(layers.maturity);

  const weights = isSalesforce ? SALESFORCE_LAYER_WEIGHTS : LAYER_WEIGHTS;

  let overall = foundation * weights.foundation +
    motions * weights.motions +
    maturity * weights.maturity;

  const result = {
    foundation: round2(foundation),
    motions: round2(motions),
    maturity: round2(maturity),
    overall: 0,
    overallStatus: 'warning',
  };

  if (isSalesforce) {
    const platformHealth = average(layers.platformHealth);
    overall += platformHealth * weights.platformHealth;
    result.platformHealth = round2(platformHealth);
  }

  result.overall = round2(overall);
  result.overallStatus = overall >= 2.5 ? 'healthy' : overall >= 1.5 ? 'careful' : 'warning';

  return result;
}

function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
