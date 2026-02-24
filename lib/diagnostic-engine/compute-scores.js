/**
 * Composite Scoring
 *
 * Computes weighted averages per layer and overall health score.
 */

import { STATUS_NUMERIC, LAYER_WEIGHTS } from './constants';

/**
 * Compute composite scores from graded items.
 * @param {Array} items - DiagnosticItem[] with status per item
 * @returns {{ foundation: number, motions: number, maturity: number, overall: number, overallStatus: string }}
 */
export function computeScores(items) {
  const layers = { foundation: [], motions: [], maturity: [] };

  for (const item of items) {
    if (item.status !== 'unable' && STATUS_NUMERIC[item.status] !== undefined) {
      layers[item.layer].push(STATUS_NUMERIC[item.status]);
    }
  }

  const foundation = average(layers.foundation);
  const motions = average(layers.motions);
  const maturity = average(layers.maturity);

  const overall =
    foundation * LAYER_WEIGHTS.foundation +
    motions * LAYER_WEIGHTS.motions +
    maturity * LAYER_WEIGHTS.maturity;

  return {
    foundation: round2(foundation),
    motions: round2(motions),
    maturity: round2(maturity),
    overall: round2(overall),
    overallStatus: overall >= 2.5 ? 'healthy' : overall >= 1.5 ? 'careful' : 'warning',
  };
}

function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
