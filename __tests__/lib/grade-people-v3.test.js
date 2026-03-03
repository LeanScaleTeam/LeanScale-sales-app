/**
 * Tests for v3 People Pillar Grader (PE-1 through PE-6)
 *
 * Covers:
 * - lib/diagnostic-engine/v3/graders/grade-people.js
 * - Consultant-only scoring (PE-1, PE-2, PE-5)
 * - Transcript scoring (PE-3)
 * - Transcript + consultant scoring (PE-4)
 * - API_PLUS scoring with overlay (PE-6)
 * - Department expansion (PE-1/2/3/5/6 = all 4, PE-4 = sales/cs/partners only)
 * - Consultant always overrides
 * - Signal collection from all source types
 */

const ALL_DEPARTMENTS = ['marketing', 'sales', 'cs', 'partners'];
const PE4_DEPARTMENTS = ['sales', 'cs', 'partners'];

describe('gradePeople - v3 People Pillar', () => {
  let gradePeople;

  beforeAll(() => {
    ({ gradePeople } = require('../../lib/diagnostic-engine/v3/graders/grade-people'));
  });

  // ── Basic Structure ──

  test('returns an array of 6 competency grade objects', () => {
    const result = gradePeople({}, {}, {}, {});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(6);
  });

  test('each grade has the correct shape', () => {
    const result = gradePeople({}, {}, {}, {});
    for (const grade of result) {
      expect(grade).toHaveProperty('id');
      expect(grade).toHaveProperty('name');
      expect(grade).toHaveProperty('pillar', 'people');
      expect(grade).toHaveProperty('departments');
      expect(grade).toHaveProperty('source');
      expect(grade).toHaveProperty('signals');
      expect(grade).toHaveProperty('serviceIds');
      expect(typeof grade.departments).toBe('object');
      expect(Array.isArray(grade.signals)).toBe(true);
      expect(Array.isArray(grade.serviceIds)).toBe(true);
    }
  });

  test('returns competencies in order PE-1 through PE-6', () => {
    const result = gradePeople({}, {}, {}, {});
    const ids = result.map((g) => g.id);
    expect(ids).toEqual(['PE-1', 'PE-2', 'PE-3', 'PE-4', 'PE-5', 'PE-6']);
  });

  // ── Department Expansion ──

  test('PE-1/2/3/5/6 have all 4 departments', () => {
    const result = gradePeople({}, {}, {}, {});
    for (const id of ['PE-1', 'PE-2', 'PE-3', 'PE-5', 'PE-6']) {
      const grade = result.find((g) => g.id === id);
      for (const dept of ALL_DEPARTMENTS) {
        expect(grade.departments).toHaveProperty(dept);
      }
    }
  });

  test('PE-4 has only sales, cs, partners departments', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe4 = result.find((g) => g.id === 'PE-4');
    expect(pe4.departments).toHaveProperty('sales');
    expect(pe4.departments).toHaveProperty('cs');
    expect(pe4.departments).toHaveProperty('partners');
    expect(pe4.departments).not.toHaveProperty('marketing');
  });

  // ── Correct Names and Sources ──

  test('PE-1 has correct name and source type', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe1 = result.find((g) => g.id === 'PE-1');
    expect(pe1.name).toBe('Documented job descriptions');
    expect(pe1.source).toBe('CONSULTANT_ONLY');
  });

  test('PE-2 has correct name and source type', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe2 = result.find((g) => g.id === 'PE-2');
    expect(pe2.name).toBe('Structured interview process');
    expect(pe2.source).toBe('CONSULTANT_ONLY');
  });

  test('PE-3 has correct name and source type', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe3 = result.find((g) => g.id === 'PE-3');
    expect(pe3.name).toBe('Onboarding plan (30/60/90)');
    expect(pe3.source).toBe('TRANSCRIPT');
  });

  test('PE-4 has correct name and source type', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe4 = result.find((g) => g.id === 'PE-4');
    expect(pe4.name).toBe('Comp plan / commission structure');
    expect(pe4.source).toBe('TRANSCRIPT_CONSULTANT');
  });

  test('PE-5 has correct name and source type', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe5 = result.find((g) => g.id === 'PE-5');
    expect(pe5.name).toBe('Performance review cadence');
    expect(pe5.source).toBe('CONSULTANT_ONLY');
  });

  test('PE-6 has correct name and source type', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe6 = result.find((g) => g.id === 'PE-6');
    expect(pe6.name).toBe('Org structure clarity');
    expect(pe6.source).toBe('API_PLUS');
  });

  // ── Service IDs ──

  test('PE-1 has correct serviceIds', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe1 = result.find((g) => g.id === 'PE-1');
    expect(pe1.serviceIds).toEqual(['gtm-org-chart-roles-and-hiring-plan']);
  });

  test('PE-2 has correct serviceIds', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe2 = result.find((g) => g.id === 'PE-2');
    expect(pe2.serviceIds).toEqual(['gtm-org-chart-roles-and-hiring-plan']);
  });

  test('PE-3 has correct serviceIds', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe3 = result.find((g) => g.id === 'PE-3');
    expect(pe3.serviceIds).toEqual(['gtm-org-chart-roles-and-hiring-plan']);
  });

  test('PE-4 has correct serviceIds', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe4 = result.find((g) => g.id === 'PE-4');
    expect(pe4.serviceIds).toEqual(['commission-plan-design-and-implementation']);
  });

  test('PE-5 has correct serviceIds', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe5 = result.find((g) => g.id === 'PE-5');
    expect(pe5.serviceIds).toEqual(['gtm-org-chart-roles-and-hiring-plan']);
  });

  test('PE-6 has correct serviceIds', () => {
    const result = gradePeople({}, {}, {}, {});
    const pe6 = result.find((g) => g.id === 'PE-6');
    expect(pe6.serviceIds).toEqual(['gtm-org-chart-roles-and-hiring-plan']);
  });

  // ── Null Scores When No Data ──

  test('all department scores are null when no transcript, consultant, or API data', () => {
    const result = gradePeople({}, {}, {}, {});
    for (const grade of result) {
      for (const dept of Object.keys(grade.departments)) {
        expect(grade.departments[dept]).toBeNull();
      }
    }
  });

  test('no signals when no data', () => {
    const result = gradePeople({}, {}, {}, {});
    for (const grade of result) {
      expect(grade.signals).toEqual([]);
    }
  });

  // ── Consultant Score Lookup (PE-1, PE-2, PE-5) ──

  test('PE-1 picks up consultant scores for each department', () => {
    const consultantScores = {
      'PE-1_marketing': { score: 3, notes: 'Some descriptions exist' },
      'PE-1_sales': { score: 4, notes: 'Good job descriptions' },
    };
    const result = gradePeople({}, {}, {}, consultantScores);
    const pe1 = result.find((g) => g.id === 'PE-1');
    expect(pe1.departments.marketing).toBe(3);
    expect(pe1.departments.sales).toBe(4);
    expect(pe1.departments.cs).toBeNull();
    expect(pe1.departments.partners).toBeNull();
  });

  test('PE-5 picks up consultant scores across all departments', () => {
    const consultantScores = {
      'PE-5_marketing': { score: 5, notes: 'Excellent cadence' },
      'PE-5_sales': { score: 4, notes: 'Good cadence' },
      'PE-5_cs': { score: 3, notes: 'Semi-annual' },
      'PE-5_partners': { score: 2, notes: 'Annual only' },
    };
    const result = gradePeople({}, {}, {}, consultantScores);
    const pe5 = result.find((g) => g.id === 'PE-5');
    expect(pe5.departments.marketing).toBe(5);
    expect(pe5.departments.sales).toBe(4);
    expect(pe5.departments.cs).toBe(3);
    expect(pe5.departments.partners).toBe(2);
  });

  // ── Transcript Score Lookup (PE-3) ──

  test('PE-3 picks up transcript scores for each department', () => {
    const transcriptScores = {
      'PE-3_marketing': { score: 3, confidence: 0.7, evidence: 'Basic onboarding checklist' },
      'PE-3_sales': { score: 4, confidence: 0.8, evidence: '30/60/90 with milestones' },
    };
    const result = gradePeople({}, {}, transcriptScores, {});
    const pe3 = result.find((g) => g.id === 'PE-3');
    expect(pe3.departments.marketing).toBe(3);
    expect(pe3.departments.sales).toBe(4);
    expect(pe3.departments.cs).toBeNull();
    expect(pe3.departments.partners).toBeNull();
  });

  // ── Transcript + Consultant (PE-4): Consultant Overrides ──

  test('PE-4 consultant score overrides transcript score', () => {
    const transcriptScores = {
      'PE-4_sales': { score: 2, confidence: 0.8, evidence: 'Basic commission' },
    };
    const consultantScores = {
      'PE-4_sales': { score: 4, notes: 'Actually has structured comp plan' },
    };
    const result = gradePeople({}, {}, transcriptScores, consultantScores);
    const pe4 = result.find((g) => g.id === 'PE-4');
    expect(pe4.departments.sales).toBe(4);
  });

  test('PE-4 uses transcript when no consultant score', () => {
    const transcriptScores = {
      'PE-4_cs': { score: 3, confidence: 0.7, evidence: 'CS has basic comp plan' },
    };
    const result = gradePeople({}, {}, transcriptScores, {});
    const pe4 = result.find((g) => g.id === 'PE-4');
    expect(pe4.departments.cs).toBe(3);
  });

  test('PE-4 does not score marketing (not in its departments)', () => {
    const transcriptScores = {
      'PE-4_marketing': { score: 5, confidence: 0.9, evidence: 'Marketing comp' },
    };
    const result = gradePeople({}, {}, transcriptScores, {});
    const pe4 = result.find((g) => g.id === 'PE-4');
    expect(pe4.departments).not.toHaveProperty('marketing');
  });

  // ── PE-6 API_PLUS: Base Score from Signals ──

  describe('PE-6 API signal scoring', () => {
    test('score 5 when team_count >= 3 and owner_to_team_coverage >= 90', () => {
      const signals = { team_count: 4, owner_to_team_coverage: 95, total_owners: 10 };
      const result = gradePeople(signals, {}, {}, {});
      const pe6 = result.find((g) => g.id === 'PE-6');
      for (const dept of ALL_DEPARTMENTS) {
        expect(pe6.departments[dept]).toBe(5);
      }
    });

    test('score 4 when team_count >= 3 and owner_to_team_coverage >= 50 but < 90', () => {
      const signals = { team_count: 3, owner_to_team_coverage: 60, total_owners: 8 };
      const result = gradePeople(signals, {}, {}, {});
      const pe6 = result.find((g) => g.id === 'PE-6');
      for (const dept of ALL_DEPARTMENTS) {
        expect(pe6.departments[dept]).toBe(4);
      }
    });

    test('score 3 when team_count >= 1 but < 3', () => {
      const signals = { team_count: 2, owner_to_team_coverage: 30, total_owners: 5 };
      const result = gradePeople(signals, {}, {}, {});
      const pe6 = result.find((g) => g.id === 'PE-6');
      for (const dept of ALL_DEPARTMENTS) {
        expect(pe6.departments[dept]).toBe(3);
      }
    });

    test('score 3 when team_count >= 3 but coverage < 50', () => {
      const signals = { team_count: 3, owner_to_team_coverage: 40, total_owners: 5 };
      const result = gradePeople(signals, {}, {}, {});
      const pe6 = result.find((g) => g.id === 'PE-6');
      for (const dept of ALL_DEPARTMENTS) {
        expect(pe6.departments[dept]).toBe(3);
      }
    });

    test('score 2 when total_owners > 0 but no teams', () => {
      const signals = { team_count: 0, owner_to_team_coverage: 0, total_owners: 3 };
      const result = gradePeople(signals, {}, {}, {});
      const pe6 = result.find((g) => g.id === 'PE-6');
      for (const dept of ALL_DEPARTMENTS) {
        expect(pe6.departments[dept]).toBe(2);
      }
    });

    test('score 1 when no signals at all', () => {
      const signals = { team_count: 0, owner_to_team_coverage: 0, total_owners: 0 };
      const result = gradePeople(signals, {}, {}, {});
      const pe6 = result.find((g) => g.id === 'PE-6');
      for (const dept of ALL_DEPARTMENTS) {
        expect(pe6.departments[dept]).toBe(1);
      }
    });

    test('score 1 when signals object is empty', () => {
      const result = gradePeople({}, {}, {}, {});
      const pe6 = result.find((g) => g.id === 'PE-6');
      // With empty signals, all departments should be null (no API data)
      for (const dept of ALL_DEPARTMENTS) {
        expect(pe6.departments[dept]).toBeNull();
      }
    });

    test('API base score at exact boundary: team_count=3, coverage=90 gives 5', () => {
      const signals = { team_count: 3, owner_to_team_coverage: 90, total_owners: 10 };
      const result = gradePeople(signals, {}, {}, {});
      const pe6 = result.find((g) => g.id === 'PE-6');
      for (const dept of ALL_DEPARTMENTS) {
        expect(pe6.departments[dept]).toBe(5);
      }
    });

    test('API base score at exact boundary: team_count=3, coverage=50 gives 4', () => {
      const signals = { team_count: 3, owner_to_team_coverage: 50, total_owners: 10 };
      const result = gradePeople(signals, {}, {}, {});
      const pe6 = result.find((g) => g.id === 'PE-6');
      for (const dept of ALL_DEPARTMENTS) {
        expect(pe6.departments[dept]).toBe(4);
      }
    });

    test('API base score at exact boundary: team_count=1 gives 3', () => {
      const signals = { team_count: 1, owner_to_team_coverage: 0, total_owners: 1 };
      const result = gradePeople(signals, {}, {}, {});
      const pe6 = result.find((g) => g.id === 'PE-6');
      for (const dept of ALL_DEPARTMENTS) {
        expect(pe6.departments[dept]).toBe(3);
      }
    });
  });

  // ── PE-6 Overlay: Transcript/Consultant over API base ──

  describe('PE-6 overlay behavior', () => {
    test('transcript score overrides API base for specific department', () => {
      const signals = { team_count: 2, owner_to_team_coverage: 30, total_owners: 5 };
      const transcriptScores = {
        'PE-6_sales': { score: 5, confidence: 0.9, evidence: 'Excellent org structure' },
      };
      const result = gradePeople(signals, {}, transcriptScores, {});
      const pe6 = result.find((g) => g.id === 'PE-6');
      expect(pe6.departments.sales).toBe(5);     // transcript override
      expect(pe6.departments.marketing).toBe(3);  // API base
      expect(pe6.departments.cs).toBe(3);          // API base
      expect(pe6.departments.partners).toBe(3);    // API base
    });

    test('consultant score overrides both API base and transcript', () => {
      const signals = { team_count: 4, owner_to_team_coverage: 95, total_owners: 10 };
      const transcriptScores = {
        'PE-6_marketing': { score: 2, confidence: 0.8, evidence: 'Unclear structure' },
      };
      const consultantScores = {
        'PE-6_marketing': { score: 4, notes: 'Good structure actually' },
      };
      const result = gradePeople(signals, {}, transcriptScores, consultantScores);
      const pe6 = result.find((g) => g.id === 'PE-6');
      expect(pe6.departments.marketing).toBe(4);  // consultant wins
      expect(pe6.departments.sales).toBe(5);       // API base (no override)
    });

    test('consultant overrides API base without transcript present', () => {
      const signals = { team_count: 1, owner_to_team_coverage: 10, total_owners: 2 };
      const consultantScores = {
        'PE-6_cs': { score: 5, notes: 'Excellent org clarity' },
      };
      const result = gradePeople(signals, {}, {}, consultantScores);
      const pe6 = result.find((g) => g.id === 'PE-6');
      expect(pe6.departments.cs).toBe(5);          // consultant override
      expect(pe6.departments.marketing).toBe(3);   // API base
    });
  });

  // ── PE-6 API Signal Collection ──

  test('PE-6 includes API signals when API data present', () => {
    const signals = { team_count: 3, owner_to_team_coverage: 75, total_owners: 10 };
    const result = gradePeople(signals, {}, {}, {});
    const pe6 = result.find((g) => g.id === 'PE-6');
    expect(pe6.signals.length).toBeGreaterThan(0);
    const apiSignal = pe6.signals.find((s) => s.source === 'api');
    expect(apiSignal).toBeDefined();
  });

  // ── Signal Collection ──

  test('collects transcript evidence as signals', () => {
    const transcriptScores = {
      'PE-3_marketing': { score: 3, confidence: 0.7, evidence: '30-day checklist exists' },
    };
    const result = gradePeople({}, {}, transcriptScores, {});
    const pe3 = result.find((g) => g.id === 'PE-3');
    expect(pe3.signals.length).toBeGreaterThan(0);
    const signal = pe3.signals.find((s) => s.source === 'transcript');
    expect(signal).toBeDefined();
    expect(signal.value).toContain('30-day checklist exists');
  });

  test('signals include department name', () => {
    const transcriptScores = {
      'PE-3_sales': { score: 4, confidence: 0.8, evidence: 'Full 30/60/90 plan' },
    };
    const result = gradePeople({}, {}, transcriptScores, {});
    const pe3 = result.find((g) => g.id === 'PE-3');
    const signal = pe3.signals.find((s) => s.source === 'transcript');
    expect(signal).toBeDefined();
    expect(signal.name).toContain('sales');
  });

  test('consultant overrides produce consultant-sourced signals', () => {
    const consultantScores = {
      'PE-1_marketing': { score: 4, notes: 'Documented with KPIs' },
    };
    const result = gradePeople({}, {}, {}, consultantScores);
    const pe1 = result.find((g) => g.id === 'PE-1');
    const signal = pe1.signals.find((s) => s.source === 'consultant');
    expect(signal).toBeDefined();
    expect(signal.value).toContain('Documented with KPIs');
  });

  // ── Impact Derivation ──

  test('signals have impact field based on score', () => {
    const consultantScores = {
      'PE-1_marketing': { score: 1, notes: 'No descriptions' },
      'PE-1_sales': { score: 3, notes: 'Average descriptions' },
      'PE-1_cs': { score: 5, notes: 'Best practice descriptions' },
    };
    const result = gradePeople({}, {}, {}, consultantScores);
    const pe1 = result.find((g) => g.id === 'PE-1');
    const mktSignal = pe1.signals.find((s) => s.name.includes('marketing'));
    const salesSignal = pe1.signals.find((s) => s.name.includes('sales'));
    const csSignal = pe1.signals.find((s) => s.name.includes('cs'));
    expect(mktSignal.impact).toBe('negative');
    expect(salesSignal.impact).toBe('neutral');
    expect(csSignal.impact).toBe('positive');
  });

  test('score 2 maps to negative impact', () => {
    const consultantScores = {
      'PE-2_marketing': { score: 2, notes: 'Basic hiring' },
    };
    const result = gradePeople({}, {}, {}, consultantScores);
    const pe2 = result.find((g) => g.id === 'PE-2');
    const signal = pe2.signals.find((s) => s.name.includes('marketing'));
    expect(signal.impact).toBe('negative');
  });

  test('score 4 maps to positive impact', () => {
    const consultantScores = {
      'PE-2_sales': { score: 4, notes: 'Good interview process' },
    };
    const result = gradePeople({}, {}, {}, consultantScores);
    const pe2 = result.find((g) => g.id === 'PE-2');
    const signal = pe2.signals.find((s) => s.name.includes('sales'));
    expect(signal.impact).toBe('positive');
  });

  // ── Mixed Data across Competencies ──

  test('handles mixed transcript and consultant data across competencies', () => {
    const transcriptScores = {
      'PE-3_marketing': { score: 2, confidence: 0.7, evidence: 'Informal onboarding' },
      'PE-3_sales': { score: 4, confidence: 0.8, evidence: 'Good 30/60/90' },
      'PE-4_sales': { score: 3, confidence: 0.6, evidence: 'Basic comp plan' },
      'PE-6_cs': { score: 4, confidence: 0.7, evidence: 'Clear CS structure' },
    };
    const consultantScores = {
      'PE-1_marketing': { score: 3, notes: 'Some JDs exist' },
      'PE-1_sales': { score: 4, notes: 'Good JDs' },
      'PE-3_marketing': { score: 3, notes: 'Better than transcript suggests' },
      'PE-4_sales': { score: 5, notes: 'Excellent comp plan' },
      'PE-5_cs': { score: 3, notes: 'Semi-annual reviews' },
    };

    const signals = { team_count: 2, owner_to_team_coverage: 30, total_owners: 5 };
    const result = gradePeople(signals, {}, transcriptScores, consultantScores);

    // PE-1: consultant only
    const pe1 = result.find((g) => g.id === 'PE-1');
    expect(pe1.departments.marketing).toBe(3);
    expect(pe1.departments.sales).toBe(4);
    expect(pe1.departments.cs).toBeNull();
    expect(pe1.departments.partners).toBeNull();

    // PE-3: consultant overrides transcript for marketing, transcript for sales
    const pe3 = result.find((g) => g.id === 'PE-3');
    expect(pe3.departments.marketing).toBe(3);  // consultant override
    expect(pe3.departments.sales).toBe(4);       // transcript
    expect(pe3.departments.cs).toBeNull();
    expect(pe3.departments.partners).toBeNull();

    // PE-4: consultant overrides transcript for sales
    const pe4 = result.find((g) => g.id === 'PE-4');
    expect(pe4.departments.sales).toBe(5);       // consultant override

    // PE-5: consultant on cs only
    const pe5 = result.find((g) => g.id === 'PE-5');
    expect(pe5.departments.cs).toBe(3);
    expect(pe5.departments.marketing).toBeNull();

    // PE-6: API base = 3, transcript override on cs
    const pe6 = result.find((g) => g.id === 'PE-6');
    expect(pe6.departments.cs).toBe(4);          // transcript override
    expect(pe6.departments.marketing).toBe(3);   // API base
    expect(pe6.departments.sales).toBe(3);        // API base
    expect(pe6.departments.partners).toBe(3);     // API base
  });

  // ── Scores Are Integers Between 1-5 or Null ──

  test('scores are integers between 1 and 5 or null', () => {
    const consultantScores = {
      'PE-1_marketing': { score: 1, notes: 'No JDs' },
      'PE-1_sales': { score: 5, notes: 'Best practice' },
      'PE-1_cs': { score: 3, notes: 'Average' },
    };
    const result = gradePeople({}, {}, {}, consultantScores);
    const pe1 = result.find((g) => g.id === 'PE-1');
    expect(pe1.departments.marketing).toBe(1);
    expect(pe1.departments.sales).toBe(5);
    expect(pe1.departments.cs).toBe(3);
    expect(pe1.departments.partners).toBeNull();
  });
});
