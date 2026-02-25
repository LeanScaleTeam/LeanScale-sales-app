/**
 * Tests for Salesforce support in the diagnostic engine.
 *
 * Covers:
 * - lib/diagnostic-engine/index.js (runDiagnostic with crmType)
 * - lib/diagnostic-engine/compute-scores.js (platformHealth layer + weights)
 * - lib/diagnostic-engine/generate-recommendations.js (P1-P5 recommendations)
 */

describe('runDiagnostic – Salesforce support', () => {
  let runDiagnostic;

  beforeAll(() => {
    ({ runDiagnostic } = require('../../lib/diagnostic-engine'));
  });

  test('accepts crmType as third parameter and includes it in result', () => {
    const result = runDiagnostic({}, {}, 'salesforce');
    expect(result.crmType).toBe('salesforce');
  });

  test('defaults crmType to unknown when not provided and no A1 answer', () => {
    const result = runDiagnostic({}, {});
    expect(result.crmType).toBe('unknown');
  });

  test('detects crmType from intakeAnswers.A1 when crmType param is null', () => {
    const result = runDiagnostic({ A1: 'Salesforce' }, {}, null);
    expect(result.crmType).toBe('salesforce');
  });

  test('includes platformHealth items when crmType is salesforce', () => {
    const result = runDiagnostic({}, {}, 'salesforce');
    const phItems = result.items.filter((i) => i.layer === 'platformHealth');
    expect(phItems.length).toBe(5);
    expect(phItems.map((i) => i.id)).toEqual(['P1', 'P2', 'P3', 'P4', 'P5']);
  });

  test('does NOT include platformHealth items when crmType is hubspot', () => {
    const result = runDiagnostic({}, {}, 'hubspot');
    const phItems = result.items.filter((i) => i.layer === 'platformHealth');
    expect(phItems.length).toBe(0);
  });

  test('has 22 items for salesforce (17 shared + 5 platform health)', () => {
    const result = runDiagnostic({}, {}, 'salesforce');
    expect(result.items.length).toBe(22);
  });

  test('has 17 items for hubspot', () => {
    const result = runDiagnostic({}, {}, 'hubspot');
    expect(result.items.length).toBe(17);
  });
});

describe('computeScores – Salesforce support', () => {
  let computeScores;

  beforeAll(() => {
    ({ computeScores } = require('../../lib/diagnostic-engine/compute-scores'));
  });

  const makeItems = (layers) => {
    const items = [];
    for (const [layer, statuses] of Object.entries(layers)) {
      for (const status of statuses) {
        items.push({ layer, status });
      }
    }
    return items;
  };

  test('returns platformHealth score when crmType is salesforce', () => {
    const items = makeItems({
      foundation: ['healthy', 'healthy'],
      motions: ['careful', 'careful'],
      maturity: ['warning'],
      platformHealth: ['healthy', 'careful'],
    });
    const scores = computeScores(items, 'salesforce');
    expect(scores).toHaveProperty('platformHealth');
    expect(typeof scores.platformHealth).toBe('number');
  });

  test('does NOT return platformHealth when crmType is hubspot', () => {
    const items = makeItems({
      foundation: ['healthy'],
      motions: ['careful'],
      maturity: ['warning'],
    });
    const scores = computeScores(items, 'hubspot');
    expect(scores).not.toHaveProperty('platformHealth');
  });

  test('uses SALESFORCE_LAYER_WEIGHTS when salesforce', () => {
    // All healthy items = score 3.0 per layer
    const items = makeItems({
      foundation: ['healthy'],
      motions: ['healthy'],
      maturity: ['healthy'],
      platformHealth: ['healthy'],
    });
    const scores = computeScores(items, 'salesforce');
    // SF weights: 0.35 + 0.30 + 0.20 + 0.15 = 1.0
    // overall = 3*0.35 + 3*0.30 + 3*0.20 + 3*0.15 = 3.0
    expect(scores.overall).toBe(3);
  });

  test('uses LAYER_WEIGHTS when hubspot', () => {
    const items = makeItems({
      foundation: ['healthy'],
      motions: ['healthy'],
      maturity: ['healthy'],
    });
    const scores = computeScores(items, 'hubspot');
    // HS weights: 0.40 + 0.35 + 0.25 = 1.0
    // overall = 3*0.40 + 3*0.35 + 3*0.25 = 3.0
    expect(scores.overall).toBe(3);
  });

  test('defaults crmType to hubspot when omitted', () => {
    const items = makeItems({
      foundation: ['healthy'],
      motions: ['healthy'],
      maturity: ['healthy'],
    });
    const scores = computeScores(items);
    expect(scores).not.toHaveProperty('platformHealth');
  });

  test('ignores platformHealth items when crmType is hubspot', () => {
    // Even if platformHealth items sneak in, they should be ignored
    const items = makeItems({
      foundation: ['healthy'],
      motions: ['healthy'],
      maturity: ['healthy'],
      platformHealth: ['warning'],
    });
    const scores = computeScores(items, 'hubspot');
    expect(scores).not.toHaveProperty('platformHealth');
    // Overall should still be 3.0 (hubspot weights, ignoring PH)
    expect(scores.overall).toBe(3);
  });
});

describe('generate-recommendations – P1-P5', () => {
  let getRecommendations, attachRecommendations;

  beforeAll(() => {
    ({ getRecommendations, attachRecommendations } = require('../../lib/diagnostic-engine/generate-recommendations'));
  });

  const P_IDS = ['P1', 'P2', 'P3', 'P4', 'P5'];
  const STATUSES = ['warning', 'careful', 'healthy'];

  test.each(P_IDS)('%s has recommendations for all statuses', (id) => {
    for (const status of STATUSES) {
      const recs = getRecommendations(id, status);
      expect(Array.isArray(recs)).toBe(true);
      expect(recs.length).toBeGreaterThan(0);
    }
  });

  test('P1 warning includes Apex-related recommendations', () => {
    const recs = getRecommendations('P1', 'warning');
    const hasApex = recs.some((r) => r.toLowerCase().includes('apex'));
    expect(hasApex).toBe(true);
  });

  test('P2 warning includes validation rules recommendations', () => {
    const recs = getRecommendations('P2', 'warning');
    const hasValidation = recs.some((r) => r.toLowerCase().includes('validation'));
    expect(hasValidation).toBe(true);
  });

  test('P3 warning includes security/roles recommendations', () => {
    const recs = getRecommendations('P3', 'warning');
    const hasSecurity = recs.some(
      (r) => r.toLowerCase().includes('role') || r.toLowerCase().includes('permission') || r.toLowerCase().includes('profile')
    );
    expect(hasSecurity).toBe(true);
  });

  test('P4 warning includes record type recommendations', () => {
    const recs = getRecommendations('P4', 'warning');
    const hasRecordType = recs.some((r) => r.toLowerCase().includes('record type'));
    expect(hasRecordType).toBe(true);
  });

  test('P5 warning includes integration recommendations', () => {
    const recs = getRecommendations('P5', 'warning');
    const hasIntegration = recs.some(
      (r) => r.toLowerCase().includes('integration') || r.toLowerCase().includes('connected app') || r.toLowerCase().includes('credential')
    );
    expect(hasIntegration).toBe(true);
  });

  test('attachRecommendations populates P items', () => {
    const items = P_IDS.map((id) => ({ id, status: 'warning', layer: 'platformHealth' }));
    attachRecommendations(items);
    for (const item of items) {
      expect(item.recommendations).toBeDefined();
      expect(item.recommendations.length).toBeGreaterThan(0);
    }
  });

  test('unable status returns empty recommendations for P items', () => {
    for (const id of P_IDS) {
      const recs = getRecommendations(id, 'unable');
      expect(recs).toEqual([]);
    }
  });

  // Existing R4 items should still work
  test('R4 recommendations still work after P1-P5 additions', () => {
    const recs = getRecommendations('R4', 'warning');
    expect(recs.length).toBeGreaterThan(0);
  });
});
