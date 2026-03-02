/**
 * Tests for Consultant Competencies V2
 *
 * Validates the consolidated assessment model:
 * - 14 V2 competencies with correct structure
 * - Merge map: V2 IDs → V1 IDs
 * - Helper functions: getV2Competencies, expandV2Departments, countV2Cells, etc.
 * - Signal mapping functions produce { score, confidence, evidence } or null
 * - fanOutAssessment correctly fans org-scoped and dept-scoped scores
 */

import {
  COMPETENCY_MERGE_MAP,
  V2_COMPETENCIES,
  getV2Competencies,
  getV2CompetencyById,
  getMergeTargets,
  expandV2Departments,
  countV2Cells,
  computeAllSuggestedScores,
  fanOutAssessment,
} from '../../lib/diagnostic-engine/v3/consultant-competencies';

// ── Structure Tests ──

describe('V2_COMPETENCIES structure', () => {
  test('has exactly 14 competencies', () => {
    expect(V2_COMPETENCIES).toHaveLength(14);
  });

  test('all competencies have required fields', () => {
    const requiredFields = [
      'id', 'name', 'pillar', 'scope', 'departments',
      'mergesFrom', 'rubric', 'crmChecks', 'discoveryQuestions', 'signalMapping',
    ];
    for (const comp of V2_COMPETENCIES) {
      for (const field of requiredFields) {
        expect(comp).toHaveProperty(field);
      }
    }
  });

  test('all IDs are unique', () => {
    const ids = V2_COMPETENCIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('scope is either "org" or "dept"', () => {
    for (const comp of V2_COMPETENCIES) {
      expect(['org', 'dept']).toContain(comp.scope);
    }
  });

  test('rubric has keys 1, 3, 5', () => {
    for (const comp of V2_COMPETENCIES) {
      expect(comp.rubric).toHaveProperty('1');
      expect(comp.rubric).toHaveProperty('3');
      expect(comp.rubric).toHaveProperty('5');
    }
  });

  test('crmChecks has salesforce and hubspot arrays', () => {
    for (const comp of V2_COMPETENCIES) {
      expect(Array.isArray(comp.crmChecks.salesforce)).toBe(true);
      expect(Array.isArray(comp.crmChecks.hubspot)).toBe(true);
      expect(comp.crmChecks.salesforce.length).toBeGreaterThan(0);
      expect(comp.crmChecks.hubspot.length).toBeGreaterThan(0);
    }
  });

  test('discoveryQuestions is non-empty array', () => {
    for (const comp of V2_COMPETENCIES) {
      expect(Array.isArray(comp.discoveryQuestions)).toBe(true);
      expect(comp.discoveryQuestions.length).toBeGreaterThan(0);
    }
  });

  test('signalMapping is a function', () => {
    for (const comp of V2_COMPETENCIES) {
      expect(typeof comp.signalMapping).toBe('function');
    }
  });

  test('covers all five pillars', () => {
    const pillars = new Set(V2_COMPETENCIES.map((c) => c.pillar));
    expect(pillars).toEqual(new Set(['planning', 'people', 'process', 'reporting', 'enablement']));
  });
});

// ── Merge Map Tests ──

describe('COMPETENCY_MERGE_MAP', () => {
  test('has entries for all 14 V2 IDs', () => {
    const v2Ids = V2_COMPETENCIES.map((c) => c.id);
    for (const id of v2Ids) {
      expect(COMPETENCY_MERGE_MAP).toHaveProperty(id);
    }
  });

  test('maps PL-A to PL-1 and PL-4', () => {
    expect(COMPETENCY_MERGE_MAP['PL-A']).toEqual(['PL-1', 'PL-4']);
  });

  test('maps PE-A to PE-1 and PE-2', () => {
    expect(COMPETENCY_MERGE_MAP['PE-A']).toEqual(['PE-1', 'PE-2']);
  });

  test('maps RP-A to RP-2 and RP-3', () => {
    expect(COMPETENCY_MERGE_MAP['RP-A']).toEqual(['RP-2', 'RP-3']);
  });

  test('maps EN-A to EN-1, EN-2, EN-5', () => {
    expect(COMPETENCY_MERGE_MAP['EN-A']).toEqual(['EN-1', 'EN-2', 'EN-5']);
  });

  test('maps EN-B to EN-3, EN-4', () => {
    expect(COMPETENCY_MERGE_MAP['EN-B']).toEqual(['EN-3', 'EN-4']);
  });

  test('1:1 maps have single-element arrays', () => {
    expect(COMPETENCY_MERGE_MAP['PL-B']).toEqual(['PL-2']);
    expect(COMPETENCY_MERGE_MAP['PL-C']).toEqual(['PL-3']);
    expect(COMPETENCY_MERGE_MAP['PL-D']).toEqual(['PL-5']);
    expect(COMPETENCY_MERGE_MAP['PE-B']).toEqual(['PE-3']);
    expect(COMPETENCY_MERGE_MAP['PE-C']).toEqual(['PE-4']);
    expect(COMPETENCY_MERGE_MAP['PE-D']).toEqual(['PE-5']);
    expect(COMPETENCY_MERGE_MAP['PR-A']).toEqual(['PR-4']);
    expect(COMPETENCY_MERGE_MAP['PR-B']).toEqual(['PR-8']);
    expect(COMPETENCY_MERGE_MAP['RP-B']).toEqual(['RP-4']);
  });

  test('mergesFrom on each competency matches the merge map', () => {
    for (const comp of V2_COMPETENCIES) {
      expect(comp.mergesFrom).toEqual(COMPETENCY_MERGE_MAP[comp.id]);
    }
  });
});

// ── Helper Function Tests ──

describe('getV2Competencies', () => {
  test('returns all 14 competencies', () => {
    expect(getV2Competencies()).toHaveLength(14);
  });
});

describe('getV2CompetencyById', () => {
  test('returns competency for valid ID', () => {
    const comp = getV2CompetencyById('PL-A');
    expect(comp).toBeDefined();
    expect(comp.name).toBe('Strategic planning & goals');
  });

  test('returns undefined for invalid ID', () => {
    expect(getV2CompetencyById('XX-9')).toBeUndefined();
  });
});

describe('getMergeTargets', () => {
  test('returns V1 IDs for valid V2 ID', () => {
    expect(getMergeTargets('EN-A')).toEqual(['EN-1', 'EN-2', 'EN-5']);
  });

  test('returns empty array for unknown ID', () => {
    expect(getMergeTargets('UNKNOWN')).toEqual([]);
  });
});

describe('expandV2Departments', () => {
  test('org-scoped returns ["org"]', () => {
    const comp = getV2CompetencyById('PL-A'); // scope: org
    expect(expandV2Departments(comp)).toEqual(['org']);
  });

  test('dept-scoped with specific departments returns them', () => {
    const comp = getV2CompetencyById('PE-C'); // scope: dept, departments: ['sales', 'cs', 'partners']
    expect(expandV2Departments(comp)).toEqual(['sales', 'cs', 'partners']);
  });

  test('dept-scoped with "all" returns all 4', () => {
    // No V2 competency currently has scope:dept + departments:'all', but test the logic
    expect(expandV2Departments({ scope: 'dept', departments: 'all' }))
      .toEqual(['marketing', 'sales', 'cs', 'partners']);
  });
});

describe('countV2Cells', () => {
  test('returns expected total (20 cells)', () => {
    const total = countV2Cells();
    // 8 org-scoped (1 cell each): PL-A, PL-B, PL-C, PL-D, PE-A, PE-B, PE-D, RP-B = 8
    // 6 dept-scoped: PE-C(3) + PR-A(1) + PR-B(2) + RP-A(3) + EN-A(1→org) + EN-B(2) = 12
    // EN-A is org-scoped = 1, so: 8 + 3 + 1 + 2 + 3 + 1 + 2 = 20
    expect(total).toBe(20);
  });
});

// ── Signal Mapping Tests ──

describe('signal mapping functions', () => {
  test('PL-A returns null with empty metadata', () => {
    const comp = getV2CompetencyById('PL-A');
    const result = comp.signalMapping({}, {}, {});
    expect(result).toBeNull();
  });

  test('PL-A returns evidence with scheduled reports', () => {
    const comp = getV2CompetencyById('PL-A');
    const result = comp.signalMapping({}, {}, {
      reportSchedules: [{ id: 1 }, { id: 2 }, { id: 3 }],
      dashboards: [
        { FolderName: 'Executive Dashboard' },
        { FolderName: 'Leadership Goals' },
        { FolderName: 'OKR Tracking' },
      ],
    });
    expect(result).not.toBeNull();
    expect(result.score).toBe(4);
    expect(result.confidence).toBe('medium');
    expect(result.evidence.length).toBeGreaterThan(0);
  });

  test('PE-C detects comp tools in installed packages', () => {
    const comp = getV2CompetencyById('PE-C');
    const result = comp.signalMapping({}, {}, {
      installedPackages: [
        { SubscriberPackage: { Name: 'CaptivateIQ' } },
      ],
    });
    expect(result).not.toBeNull();
    expect(result.score).toBe(4);
    expect(result.evidence).toEqual(
      expect.arrayContaining([expect.stringContaining('CaptivateIQ')])
    );
  });

  test('PR-A detects partner roles from enhanced signals', () => {
    const comp = getV2CompetencyById('PR-A');
    const result = comp.signalMapping({}, { partnerRoles: [{ id: 1 }] }, {});
    expect(result).not.toBeNull();
    expect(result.score).toBe(3);
    expect(result.evidence).toContain('PartnerRole object active');
  });

  test('EN-B detects Gong in installed packages', () => {
    const comp = getV2CompetencyById('EN-B');
    const result = comp.signalMapping({}, {}, {
      installedPackages: [{ SubscriberPackage: { Name: 'Gong' } }],
      dashboards: [{ FolderName: 'Coaching Reviews' }],
    });
    expect(result).not.toBeNull();
    expect(result.score).toBe(4);
    expect(result.evidence).toEqual(
      expect.arrayContaining([expect.stringContaining('Gong')])
    );
  });

  test('RP-A computes dashboard-to-user ratio', () => {
    const comp = getV2CompetencyById('RP-A');
    const result = comp.signalMapping({}, {}, {
      dashboards: Array(50).fill({ FolderName: 'Sales' }),
      users: Array(10).fill({ Id: 'x' }),
    });
    expect(result).not.toBeNull();
    expect(result.evidence).toEqual(
      expect.arrayContaining([expect.stringContaining('dashboards per user')])
    );
  });

  test('all signal mappings handle null/undefined gracefully', () => {
    for (const comp of V2_COMPETENCIES) {
      expect(() => comp.signalMapping(null, null, null)).not.toThrow();
      expect(() => comp.signalMapping(undefined, undefined, undefined)).not.toThrow();
    }
  });
});

describe('computeAllSuggestedScores', () => {
  test('returns object with all 14 V2 IDs', () => {
    const scores = computeAllSuggestedScores({}, {}, {});
    expect(Object.keys(scores)).toHaveLength(14);
    for (const comp of V2_COMPETENCIES) {
      expect(scores).toHaveProperty(comp.id);
    }
  });

  test('handles null inputs without throwing', () => {
    expect(() => computeAllSuggestedScores(null, null, null)).not.toThrow();
  });
});

// ── Fan Out Tests ──

describe('fanOutAssessment', () => {
  test('org-scoped competency fans out to all 4 departments for each V1 ID', () => {
    // PL-A is org-scoped, maps to PL-1 and PL-4
    const results = fanOutAssessment('PL-A', 'org', 4, 'Strong planning');
    // 2 V1 IDs × 4 departments = 8 rows
    expect(results).toHaveLength(8);
    expect(results[0]).toEqual({
      competencyId: 'PL-1',
      department: 'marketing',
      score: 4,
      notes: 'Strong planning',
    });
    // Check all departments covered for each V1 ID
    const plaDepts = results.filter((r) => r.competencyId === 'PL-1').map((r) => r.department);
    expect(plaDepts).toEqual(['marketing', 'sales', 'cs', 'partners']);
  });

  test('dept-scoped competency fans out to single department per V1 ID', () => {
    // PE-C is dept-scoped, maps to PE-4
    const results = fanOutAssessment('PE-C', 'sales', 3, null);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      competencyId: 'PE-4',
      department: 'sales',
      score: 3,
      notes: null,
    });
  });

  test('multi-merge org-scoped fans out correctly', () => {
    // EN-A maps to EN-1, EN-2, EN-5 (3 V1 IDs) × 4 departments = 12 rows
    const results = fanOutAssessment('EN-A', 'org', 5, 'Excellent enablement');
    expect(results).toHaveLength(12);
    const v1Ids = [...new Set(results.map((r) => r.competencyId))];
    expect(v1Ids).toEqual(['EN-1', 'EN-2', 'EN-5']);
    expect(results.every((r) => r.score === 5)).toBe(true);
  });

  test('returns empty array for unknown V2 ID', () => {
    expect(fanOutAssessment('UNKNOWN', 'org', 3, '')).toEqual([]);
  });

  test('dept-scoped multi-department competency PR-B fans out per dept', () => {
    // PR-B maps to PR-8, dept-scoped for marketing
    const results = fanOutAssessment('PR-B', 'marketing', 2, 'Basic ABM');
    expect(results).toHaveLength(1);
    expect(results[0].competencyId).toBe('PR-8');
    expect(results[0].department).toBe('marketing');
  });
});
