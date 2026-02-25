/**
 * Tests for v3 Planning Pillar Grader (PL-1 through PL-5)
 *
 * Covers:
 * - lib/diagnostic-engine/v3/graders/grade-planning.js
 * - Transcript score lookup
 * - Consultant score override behavior
 * - Department expansion ('all' -> marketing, sales, cs, partners)
 * - Null scores when no data
 * - Signal collection from transcript evidence
 */

const DEPARTMENTS = ['marketing', 'sales', 'cs', 'partners'];

describe('gradePlanning – v3 Planning Pillar', () => {
  let gradePlanning;

  beforeAll(() => {
    ({ gradePlanning } = require('../../lib/diagnostic-engine/v3/graders/grade-planning'));
  });

  // ── Basic Structure ──

  test('returns an array of 5 competency grade objects', () => {
    const result = gradePlanning({}, {}, {}, {});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);
  });

  test('each grade has the correct shape', () => {
    const result = gradePlanning({}, {}, {}, {});
    for (const grade of result) {
      expect(grade).toHaveProperty('id');
      expect(grade).toHaveProperty('name');
      expect(grade).toHaveProperty('pillar', 'planning');
      expect(grade).toHaveProperty('departments');
      expect(grade).toHaveProperty('source');
      expect(grade).toHaveProperty('signals');
      expect(grade).toHaveProperty('serviceIds');
      expect(typeof grade.departments).toBe('object');
      expect(Array.isArray(grade.signals)).toBe(true);
      expect(Array.isArray(grade.serviceIds)).toBe(true);
    }
  });

  test('returns competencies in order PL-1 through PL-5', () => {
    const result = gradePlanning({}, {}, {}, {});
    const ids = result.map((g) => g.id);
    expect(ids).toEqual(['PL-1', 'PL-2', 'PL-3', 'PL-4', 'PL-5']);
  });

  test('each grade has departments object with all 4 departments', () => {
    const result = gradePlanning({}, {}, {}, {});
    for (const grade of result) {
      for (const dept of DEPARTMENTS) {
        expect(grade.departments).toHaveProperty(dept);
      }
    }
  });

  // ── Correct Names and Sources ──

  test('PL-1 has correct name and source type', () => {
    const result = gradePlanning({}, {}, {}, {});
    const pl1 = result.find((g) => g.id === 'PL-1');
    expect(pl1.name).toBe('Operating plan with quarterly goals');
    expect(pl1.source).toBe('TRANSCRIPT');
  });

  test('PL-2 has correct name and source type', () => {
    const result = gradePlanning({}, {}, {}, {});
    const pl2 = result.find((g) => g.id === 'PL-2');
    expect(pl2.name).toBe('Capacity plan / headcount model');
    expect(pl2.source).toBe('TRANSCRIPT_CONSULTANT');
  });

  test('PL-3 has correct name and source type', () => {
    const result = gradePlanning({}, {}, {}, {});
    const pl3 = result.find((g) => g.id === 'PL-3');
    expect(pl3.name).toBe('Budget allocation process');
    expect(pl3.source).toBe('CONSULTANT_ONLY');
  });

  test('PL-4 has correct name and source type', () => {
    const result = gradePlanning({}, {}, {}, {});
    const pl4 = result.find((g) => g.id === 'PL-4');
    expect(pl4.name).toBe('OKR / KPI setting');
    expect(pl4.source).toBe('TRANSCRIPT');
  });

  test('PL-5 has correct name and source type', () => {
    const result = gradePlanning({}, {}, {}, {});
    const pl5 = result.find((g) => g.id === 'PL-5');
    expect(pl5.name).toBe('Review cadence (QBR, WBR)');
    expect(pl5.source).toBe('TRANSCRIPT');
  });

  // ── Service IDs ──

  test('PL-1 has correct serviceIds', () => {
    const result = gradePlanning({}, {}, {}, {});
    const pl1 = result.find((g) => g.id === 'PL-1');
    expect(pl1.serviceIds).toEqual(['growth-model', 'monthly-quarterly-gtm-reporting-pack']);
  });

  test('PL-2 has correct serviceIds', () => {
    const result = gradePlanning({}, {}, {}, {});
    const pl2 = result.find((g) => g.id === 'PL-2');
    expect(pl2.serviceIds).toEqual(['quotas-and-target-setting', 'gtm-org-chart-roles-and-hiring-plan']);
  });

  test('PL-3 has correct serviceIds', () => {
    const result = gradePlanning({}, {}, {}, {});
    const pl3 = result.find((g) => g.id === 'PL-3');
    expect(pl3.serviceIds).toEqual(['growth-model']);
  });

  test('PL-4 has correct serviceIds', () => {
    const result = gradePlanning({}, {}, {}, {});
    const pl4 = result.find((g) => g.id === 'PL-4');
    expect(pl4.serviceIds).toEqual(['executive-reporting-suite']);
  });

  test('PL-5 has correct serviceIds', () => {
    const result = gradePlanning({}, {}, {}, {});
    const pl5 = result.find((g) => g.id === 'PL-5');
    expect(pl5.serviceIds).toEqual(['monthly-quarterly-gtm-reporting-pack']);
  });

  // ── Null Scores When No Data ──

  test('all department scores are null when no transcript or consultant data', () => {
    const result = gradePlanning({}, {}, {}, {});
    for (const grade of result) {
      for (const dept of DEPARTMENTS) {
        expect(grade.departments[dept]).toBeNull();
      }
    }
  });

  // ── Transcript Score Lookup ──

  test('picks up transcript scores for each department', () => {
    const transcriptScores = {
      'PL-1_marketing': { score: 3, confidence: 0.8, evidence: 'Has quarterly plan' },
      'PL-1_sales': { score: 4, confidence: 0.9, evidence: 'Strong sales planning' },
    };
    const result = gradePlanning({}, {}, transcriptScores, {});
    const pl1 = result.find((g) => g.id === 'PL-1');
    expect(pl1.departments.marketing).toBe(3);
    expect(pl1.departments.sales).toBe(4);
    expect(pl1.departments.cs).toBeNull();
    expect(pl1.departments.partners).toBeNull();
  });

  test('transcript scores populate across multiple competencies', () => {
    const transcriptScores = {
      'PL-4_marketing': { score: 2, confidence: 0.6, evidence: 'Some KPIs tracked' },
      'PL-5_cs': { score: 5, confidence: 0.9, evidence: 'Full D/W/M/Q cadence' },
    };
    const result = gradePlanning({}, {}, transcriptScores, {});
    const pl4 = result.find((g) => g.id === 'PL-4');
    expect(pl4.departments.marketing).toBe(2);
    const pl5 = result.find((g) => g.id === 'PL-5');
    expect(pl5.departments.cs).toBe(5);
  });

  // ── Consultant Score Override ──

  test('consultant score overrides transcript score', () => {
    const transcriptScores = {
      'PL-1_marketing': { score: 2, confidence: 0.8, evidence: 'Weak plan' },
    };
    const consultantScores = {
      'PL-1_marketing': { score: 4, notes: 'Actually has a solid plan' },
    };
    const result = gradePlanning({}, {}, transcriptScores, consultantScores);
    const pl1 = result.find((g) => g.id === 'PL-1');
    expect(pl1.departments.marketing).toBe(4);
  });

  test('consultant score used when no transcript score exists', () => {
    const consultantScores = {
      'PL-3_sales': { score: 3, notes: 'Average budget process' },
    };
    const result = gradePlanning({}, {}, {}, consultantScores);
    const pl3 = result.find((g) => g.id === 'PL-3');
    expect(pl3.departments.sales).toBe(3);
  });

  test('consultant scores work across all departments', () => {
    const consultantScores = {
      'PL-2_marketing': { score: 5, notes: 'Excellent capacity planning' },
      'PL-2_sales': { score: 4, notes: 'Good model' },
      'PL-2_cs': { score: 3, notes: 'Basic plan' },
      'PL-2_partners': { score: 2, notes: 'Minimal planning' },
    };
    const result = gradePlanning({}, {}, {}, consultantScores);
    const pl2 = result.find((g) => g.id === 'PL-2');
    expect(pl2.departments.marketing).toBe(5);
    expect(pl2.departments.sales).toBe(4);
    expect(pl2.departments.cs).toBe(3);
    expect(pl2.departments.partners).toBe(2);
  });

  // ── Signal Collection ──

  test('collects transcript evidence as signals', () => {
    const transcriptScores = {
      'PL-1_marketing': { score: 3, confidence: 0.8, evidence: 'Has quarterly plan document' },
    };
    const result = gradePlanning({}, {}, transcriptScores, {});
    const pl1 = result.find((g) => g.id === 'PL-1');
    expect(pl1.signals.length).toBeGreaterThan(0);
    const signal = pl1.signals.find((s) => s.source === 'transcript');
    expect(signal).toBeDefined();
    expect(signal.value).toContain('Has quarterly plan document');
  });

  test('signals include department name', () => {
    const transcriptScores = {
      'PL-4_sales': { score: 4, confidence: 0.7, evidence: 'Strong OKR framework' },
    };
    const result = gradePlanning({}, {}, transcriptScores, {});
    const pl4 = result.find((g) => g.id === 'PL-4');
    const signal = pl4.signals.find((s) => s.source === 'transcript');
    expect(signal).toBeDefined();
    expect(signal.name).toContain('sales');
  });

  test('consultant overrides produce consultant-sourced signals', () => {
    const consultantScores = {
      'PL-3_marketing': { score: 4, notes: 'Has formal budget review' },
    };
    const result = gradePlanning({}, {}, {}, consultantScores);
    const pl3 = result.find((g) => g.id === 'PL-3');
    const signal = pl3.signals.find((s) => s.source === 'consultant');
    expect(signal).toBeDefined();
    expect(signal.value).toContain('Has formal budget review');
  });

  test('no signals when no data', () => {
    const result = gradePlanning({}, {}, {}, {});
    for (const grade of result) {
      expect(grade.signals).toEqual([]);
    }
  });

  // ── Score Clamping ──

  test('scores are integers between 1 and 5 or null', () => {
    const transcriptScores = {
      'PL-1_marketing': { score: 1, confidence: 0.5, evidence: 'No plan' },
      'PL-1_sales': { score: 5, confidence: 0.9, evidence: 'Best practice' },
      'PL-1_cs': { score: 3, confidence: 0.7, evidence: 'Average' },
    };
    const result = gradePlanning({}, {}, transcriptScores, {});
    const pl1 = result.find((g) => g.id === 'PL-1');
    expect(pl1.departments.marketing).toBe(1);
    expect(pl1.departments.sales).toBe(5);
    expect(pl1.departments.cs).toBe(3);
    expect(pl1.departments.partners).toBeNull();
  });

  // ── Impact Derivation ──

  test('signals have impact field based on score', () => {
    const transcriptScores = {
      'PL-1_marketing': { score: 1, confidence: 0.8, evidence: 'No plan exists' },
      'PL-1_sales': { score: 3, confidence: 0.8, evidence: 'Average plan' },
      'PL-1_cs': { score: 5, confidence: 0.8, evidence: 'Best practice planning' },
    };
    const result = gradePlanning({}, {}, transcriptScores, {});
    const pl1 = result.find((g) => g.id === 'PL-1');
    const mktSignal = pl1.signals.find((s) => s.name.includes('marketing'));
    const salesSignal = pl1.signals.find((s) => s.name.includes('sales'));
    const csSignal = pl1.signals.find((s) => s.name.includes('cs'));
    expect(mktSignal.impact).toBe('negative');
    expect(salesSignal.impact).toBe('neutral');
    expect(csSignal.impact).toBe('positive');
  });

  // ── Mixed Transcript + Consultant across competencies ──

  test('handles mixed transcript and consultant data across competencies', () => {
    const transcriptScores = {
      'PL-1_marketing': { score: 2, confidence: 0.7, evidence: 'Informal plan' },
      'PL-1_sales': { score: 3, confidence: 0.8, evidence: 'Written plan' },
      'PL-4_cs': { score: 4, confidence: 0.6, evidence: 'OKRs defined' },
      'PL-5_partners': { score: 1, confidence: 0.5, evidence: 'No reviews' },
    };
    const consultantScores = {
      'PL-1_marketing': { score: 3, notes: 'Better than it seemed' },
      'PL-2_sales': { score: 4, notes: 'Good capacity model' },
      'PL-3_marketing': { score: 2, notes: 'Weak budget process' },
      'PL-3_cs': { score: 3, notes: 'Moderate' },
    };

    const result = gradePlanning({}, {}, transcriptScores, consultantScores);

    // PL-1: consultant override on marketing, transcript on sales
    const pl1 = result.find((g) => g.id === 'PL-1');
    expect(pl1.departments.marketing).toBe(3); // consultant override
    expect(pl1.departments.sales).toBe(3); // transcript
    expect(pl1.departments.cs).toBeNull();
    expect(pl1.departments.partners).toBeNull();

    // PL-2: consultant only on sales
    const pl2 = result.find((g) => g.id === 'PL-2');
    expect(pl2.departments.sales).toBe(4);
    expect(pl2.departments.marketing).toBeNull();

    // PL-3: consultant only (it's CONSULTANT_ONLY source)
    const pl3 = result.find((g) => g.id === 'PL-3');
    expect(pl3.departments.marketing).toBe(2);
    expect(pl3.departments.cs).toBe(3);

    // PL-4: transcript on cs
    const pl4 = result.find((g) => g.id === 'PL-4');
    expect(pl4.departments.cs).toBe(4);

    // PL-5: transcript on partners
    const pl5 = result.find((g) => g.id === 'PL-5');
    expect(pl5.departments.partners).toBe(1);
  });
});
