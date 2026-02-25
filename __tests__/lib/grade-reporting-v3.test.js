/**
 * Tests for v3 Reporting Pillar Grader (RP-1 through RP-6)
 *
 * Covers:
 * - lib/diagnostic-engine/v3/graders/grade-reporting.js
 * - API signal scoring (dashboard_count, report_count, report_schedule_count)
 * - Intake answer scoring (Power 10, forecasting methodology, dashboard trust)
 * - Transcript score overlay
 * - Consultant score override behavior
 * - Department scoping per competency
 * - Signal collection with source attribution
 * - Null fallback when no data available
 */

const ALL_DEPARTMENTS = ['marketing', 'sales', 'cs', 'partners'];
const MKT_SALES_CS = ['marketing', 'sales', 'cs'];

describe('gradeReporting - v3 Reporting Pillar', () => {
  let gradeReporting;

  beforeAll(() => {
    ({ gradeReporting } = require('../../lib/diagnostic-engine/v3/graders/grade-reporting'));
  });

  // ══════════════════════════════════════════════
  // Basic Structure
  // ══════════════════════════════════════════════

  test('returns an array of 6 competency grade objects', () => {
    const result = gradeReporting({}, {}, {}, {});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(6);
  });

  test('each grade has the correct shape', () => {
    const result = gradeReporting({}, {}, {}, {});
    for (const grade of result) {
      expect(grade).toHaveProperty('id');
      expect(grade).toHaveProperty('name');
      expect(grade).toHaveProperty('pillar', 'reporting');
      expect(grade).toHaveProperty('departments');
      expect(grade).toHaveProperty('source');
      expect(grade).toHaveProperty('signals');
      expect(grade).toHaveProperty('serviceIds');
      expect(typeof grade.departments).toBe('object');
      expect(Array.isArray(grade.signals)).toBe(true);
      expect(Array.isArray(grade.serviceIds)).toBe(true);
    }
  });

  test('returns competencies in order RP-1 through RP-6', () => {
    const result = gradeReporting({}, {}, {}, {});
    const ids = result.map((g) => g.id);
    expect(ids).toEqual(['RP-1', 'RP-2', 'RP-3', 'RP-4', 'RP-5', 'RP-6']);
  });

  // ══════════════════════════════════════════════
  // Correct Names, Sources, and ServiceIds
  // ══════════════════════════════════════════════

  test('RP-1 has correct name, source, and serviceIds', () => {
    const result = gradeReporting({}, {}, {}, {});
    const rp1 = result.find((g) => g.id === 'RP-1');
    expect(rp1.name).toBe('Executive dashboards');
    expect(rp1.source).toBe('API_PLUS');
    expect(rp1.serviceIds).toEqual(['executive-reporting-suite']);
  });

  test('RP-2 has correct name, source, and serviceIds', () => {
    const result = gradeReporting({}, {}, {}, {});
    const rp2 = result.find((g) => g.id === 'RP-2');
    expect(rp2.name).toBe('Manager dashboards');
    expect(rp2.source).toBe('TRANSCRIPT_CONSULTANT');
    expect(rp2.serviceIds).toEqual(['monthly-quarterly-gtm-reporting-pack']);
  });

  test('RP-3 has correct name, source, and serviceIds', () => {
    const result = gradeReporting({}, {}, {}, {});
    const rp3 = result.find((g) => g.id === 'RP-3');
    expect(rp3.name).toBe('IC dashboards (daily use)');
    expect(rp3.source).toBe('TRANSCRIPT_CONSULTANT');
    expect(rp3.serviceIds).toEqual(['monthly-quarterly-gtm-reporting-pack']);
  });

  test('RP-4 has correct name, source, and serviceIds', () => {
    const result = gradeReporting({}, {}, {}, {});
    const rp4 = result.find((g) => g.id === 'RP-4');
    expect(rp4.name).toBe('Cadence reporting (D/W/M/Q/A)');
    expect(rp4.source).toBe('TRANSCRIPT');
    expect(rp4.serviceIds).toEqual(['monthly-quarterly-gtm-reporting-pack']);
  });

  test('RP-5 has correct name, source, and serviceIds', () => {
    const result = gradeReporting({}, {}, {}, {});
    const rp5 = result.find((g) => g.id === 'RP-5');
    expect(rp5.name).toBe('Revenue metrics (Power 10)');
    expect(rp5.source).toBe('INTAKE');
    expect(rp5.serviceIds).toEqual(['arr-reporting', 'executive-reporting-suite']);
  });

  test('RP-6 has correct name, source, and serviceIds', () => {
    const result = gradeReporting({}, {}, {}, {});
    const rp6 = result.find((g) => g.id === 'RP-6');
    expect(rp6.name).toBe('Forecasting methodology');
    expect(rp6.source).toBe('INTAKE');
    expect(rp6.serviceIds).toEqual(['forecasting-process-implementation', 'growth-model']);
  });

  // ══════════════════════════════════════════════
  // Department Scoping
  // ══════════════════════════════════════════════

  test('RP-1 has all 4 departments', () => {
    const result = gradeReporting({}, {}, {}, {});
    const rp1 = result.find((g) => g.id === 'RP-1');
    for (const dept of ALL_DEPARTMENTS) {
      expect(rp1.departments).toHaveProperty(dept);
    }
  });

  test('RP-2 has all 4 departments', () => {
    const result = gradeReporting({}, {}, {}, {});
    const rp2 = result.find((g) => g.id === 'RP-2');
    for (const dept of ALL_DEPARTMENTS) {
      expect(rp2.departments).toHaveProperty(dept);
    }
  });

  test('RP-3 has marketing, sales, cs only (no partners)', () => {
    const result = gradeReporting({}, {}, {}, {});
    const rp3 = result.find((g) => g.id === 'RP-3');
    for (const dept of MKT_SALES_CS) {
      expect(rp3.departments).toHaveProperty(dept);
    }
    expect(rp3.departments).not.toHaveProperty('partners');
  });

  test('RP-4 has all 4 departments', () => {
    const result = gradeReporting({}, {}, {}, {});
    const rp4 = result.find((g) => g.id === 'RP-4');
    for (const dept of ALL_DEPARTMENTS) {
      expect(rp4.departments).toHaveProperty(dept);
    }
  });

  test('RP-5 has sales only', () => {
    const result = gradeReporting({}, {}, {}, {});
    const rp5 = result.find((g) => g.id === 'RP-5');
    expect(rp5.departments).toHaveProperty('sales');
    expect(rp5.departments).not.toHaveProperty('marketing');
    expect(rp5.departments).not.toHaveProperty('cs');
    expect(rp5.departments).not.toHaveProperty('partners');
  });

  test('RP-6 has sales only', () => {
    const result = gradeReporting({}, {}, {}, {});
    const rp6 = result.find((g) => g.id === 'RP-6');
    expect(rp6.departments).toHaveProperty('sales');
    expect(rp6.departments).not.toHaveProperty('marketing');
    expect(rp6.departments).not.toHaveProperty('cs');
    expect(rp6.departments).not.toHaveProperty('partners');
  });

  // ══════════════════════════════════════════════
  // Null Scores When No Data
  // ══════════════════════════════════════════════

  test('all department scores are null when no data is provided', () => {
    const result = gradeReporting({}, {}, {}, {});
    for (const grade of result) {
      for (const dept of Object.keys(grade.departments)) {
        expect(grade.departments[dept]).toBeNull();
      }
    }
  });

  test('no signals when no data', () => {
    const result = gradeReporting({}, {}, {}, {});
    for (const grade of result) {
      expect(grade.signals).toEqual([]);
    }
  });

  // ══════════════════════════════════════════════
  // RP-1: Executive dashboards (API + INTAKE)
  // ══════════════════════════════════════════════

  describe('RP-1 - Executive dashboards', () => {
    test('dashboard_count > 20 scores 5 for all departments', () => {
      const signals = { dashboard_count: 25 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp1.departments[dept]).toBe(5);
      }
    });

    test('dashboard_count of 15 scores 4', () => {
      const signals = { dashboard_count: 15 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp1.departments[dept]).toBe(4);
      }
    });

    test('dashboard_count of 5 scores 3', () => {
      const signals = { dashboard_count: 5 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp1.departments[dept]).toBe(3);
      }
    });

    test('dashboard_count of 1 scores 2', () => {
      const signals = { dashboard_count: 1 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp1.departments[dept]).toBe(2);
      }
    });

    test('dashboard_count of 0 scores 1', () => {
      const signals = { dashboard_count: 0 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp1.departments[dept]).toBe(1);
      }
    });

    test('falls back to report_count when dashboard_count is absent', () => {
      const signals = { report_count: 12 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp1.departments[dept]).toBe(4);
      }
    });

    test('boundary: dashboard_count exactly 20 scores 4', () => {
      const signals = { dashboard_count: 20 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp1.departments[dept]).toBe(4);
      }
    });

    test('boundary: dashboard_count exactly 10 scores 3', () => {
      const signals = { dashboard_count: 10 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp1.departments[dept]).toBe(3);
      }
    });

    test('boundary: dashboard_count exactly 3 scores 2', () => {
      const signals = { dashboard_count: 3 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp1.departments[dept]).toBe(2);
      }
    });

    test('produces API signal when dashboard_count present', () => {
      const signals = { dashboard_count: 15 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      const apiSignal = rp1.signals.find((s) => s.source === 'api');
      expect(apiSignal).toBeDefined();
      expect(apiSignal.name).toContain('dashboard_count');
    });

    test('intake dashboard_trust can adjust score', () => {
      const signals = { dashboard_count: 5 }; // base score = 3
      const intakeAnswers = { dashboard_trust: 'low' };
      const result = gradeReporting(signals, intakeAnswers, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      // low trust should reduce score by 1
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp1.departments[dept]).toBe(2);
      }
    });

    test('intake dashboard_trust high can boost score', () => {
      const signals = { dashboard_count: 5 }; // base score = 3
      const intakeAnswers = { dashboard_trust: 'high' };
      const result = gradeReporting(signals, intakeAnswers, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp1.departments[dept]).toBe(4);
      }
    });

    test('transcript score overlays API score per department', () => {
      const signals = { dashboard_count: 5 }; // base = 3
      const transcriptScores = {
        'RP-1_marketing': { score: 5, confidence: 0.9, evidence: 'Best-in-class dashboards' },
      };
      const result = gradeReporting(signals, {}, transcriptScores, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      // transcript should override for marketing
      expect(rp1.departments.marketing).toBe(5);
      // other departments keep API score
      expect(rp1.departments.sales).toBe(3);
    });

    test('consultant score overrides everything for RP-1', () => {
      const signals = { dashboard_count: 25 }; // API = 5
      const transcriptScores = {
        'RP-1_sales': { score: 4, confidence: 0.9, evidence: 'Good dashboards' },
      };
      const consultantScores = {
        'RP-1_sales': { score: 2, notes: 'Dashboards are stale and unused' },
      };
      const result = gradeReporting(signals, {}, transcriptScores, consultantScores);
      const rp1 = result.find((g) => g.id === 'RP-1');
      expect(rp1.departments.sales).toBe(2);
    });
  });

  // ══════════════════════════════════════════════
  // RP-2: Manager dashboards (TRANSCRIPT_CONSULTANT)
  // ══════════════════════════════════════════════

  describe('RP-2 - Manager dashboards', () => {
    test('defaults to null for all departments with no data', () => {
      const result = gradeReporting({}, {}, {}, {});
      const rp2 = result.find((g) => g.id === 'RP-2');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp2.departments[dept]).toBeNull();
      }
    });

    test('uses transcript scores', () => {
      const transcriptScores = {
        'RP-2_marketing': { score: 3, confidence: 0.7, evidence: 'Basic manager dashboards' },
        'RP-2_sales': { score: 4, confidence: 0.8, evidence: 'Good dashboards' },
      };
      const result = gradeReporting({}, {}, transcriptScores, {});
      const rp2 = result.find((g) => g.id === 'RP-2');
      expect(rp2.departments.marketing).toBe(3);
      expect(rp2.departments.sales).toBe(4);
      expect(rp2.departments.cs).toBeNull();
    });

    test('consultant overrides transcript', () => {
      const transcriptScores = {
        'RP-2_cs': { score: 2, confidence: 0.6, evidence: 'Weak dashboards' },
      };
      const consultantScores = {
        'RP-2_cs': { score: 4, notes: 'Actually quite good' },
      };
      const result = gradeReporting({}, {}, transcriptScores, consultantScores);
      const rp2 = result.find((g) => g.id === 'RP-2');
      expect(rp2.departments.cs).toBe(4);
    });
  });

  // ══════════════════════════════════════════════
  // RP-3: IC dashboards (TRANSCRIPT_CONSULTANT)
  // ══════════════════════════════════════════════

  describe('RP-3 - IC dashboards', () => {
    test('defaults to null for applicable departments with no data', () => {
      const result = gradeReporting({}, {}, {}, {});
      const rp3 = result.find((g) => g.id === 'RP-3');
      for (const dept of MKT_SALES_CS) {
        expect(rp3.departments[dept]).toBeNull();
      }
    });

    test('uses transcript scores for applicable departments only', () => {
      const transcriptScores = {
        'RP-3_marketing': { score: 3, confidence: 0.7, evidence: 'Some IC views' },
        'RP-3_sales': { score: 4, confidence: 0.8, evidence: 'Good IC dashboards' },
        'RP-3_cs': { score: 2, confidence: 0.6, evidence: 'Default views only' },
      };
      const result = gradeReporting({}, {}, transcriptScores, {});
      const rp3 = result.find((g) => g.id === 'RP-3');
      expect(rp3.departments.marketing).toBe(3);
      expect(rp3.departments.sales).toBe(4);
      expect(rp3.departments.cs).toBe(2);
    });

    test('consultant overrides transcript for RP-3', () => {
      const transcriptScores = {
        'RP-3_sales': { score: 2, confidence: 0.7, evidence: 'Poor IC views' },
      };
      const consultantScores = {
        'RP-3_sales': { score: 5, notes: 'Optimized IC experience' },
      };
      const result = gradeReporting({}, {}, transcriptScores, consultantScores);
      const rp3 = result.find((g) => g.id === 'RP-3');
      expect(rp3.departments.sales).toBe(5);
    });
  });

  // ══════════════════════════════════════════════
  // RP-4: Cadence reporting (TRANSCRIPT)
  // ══════════════════════════════════════════════

  describe('RP-4 - Cadence reporting', () => {
    test('defaults to null with no data', () => {
      const result = gradeReporting({}, {}, {}, {});
      const rp4 = result.find((g) => g.id === 'RP-4');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp4.departments[dept]).toBeNull();
      }
    });

    test('report_schedule_count > 10 scores 4 for all departments', () => {
      const signals = { report_schedule_count: 15 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp4 = result.find((g) => g.id === 'RP-4');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp4.departments[dept]).toBe(4);
      }
    });

    test('report_schedule_count of 5 scores 3', () => {
      const signals = { report_schedule_count: 5 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp4 = result.find((g) => g.id === 'RP-4');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp4.departments[dept]).toBe(3);
      }
    });

    test('report_schedule_count of 2 scores 2', () => {
      const signals = { report_schedule_count: 2 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp4 = result.find((g) => g.id === 'RP-4');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp4.departments[dept]).toBe(2);
      }
    });

    test('report_schedule_count of 0 results in null (rely on transcript)', () => {
      const signals = { report_schedule_count: 0 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp4 = result.find((g) => g.id === 'RP-4');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp4.departments[dept]).toBeNull();
      }
    });

    test('boundary: report_schedule_count exactly 10 scores 3', () => {
      const signals = { report_schedule_count: 10 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp4 = result.find((g) => g.id === 'RP-4');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp4.departments[dept]).toBe(3);
      }
    });

    test('boundary: report_schedule_count exactly 3 scores 2', () => {
      const signals = { report_schedule_count: 3 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp4 = result.find((g) => g.id === 'RP-4');
      for (const dept of ALL_DEPARTMENTS) {
        expect(rp4.departments[dept]).toBe(2);
      }
    });

    test('transcript score overlays API score per department', () => {
      const signals = { report_schedule_count: 5 }; // base = 3
      const transcriptScores = {
        'RP-4_marketing': { score: 5, confidence: 0.9, evidence: 'Full D/W/M/Q/A cadence' },
      };
      const result = gradeReporting(signals, {}, transcriptScores, {});
      const rp4 = result.find((g) => g.id === 'RP-4');
      expect(rp4.departments.marketing).toBe(5);
      expect(rp4.departments.sales).toBe(3); // keeps API score
    });

    test('consultant overrides everything for RP-4', () => {
      const signals = { report_schedule_count: 15 }; // API = 4
      const transcriptScores = {
        'RP-4_sales': { score: 5, confidence: 0.9, evidence: 'Best practice' },
      };
      const consultantScores = {
        'RP-4_sales': { score: 1, notes: 'No cadence at all' },
      };
      const result = gradeReporting(signals, {}, transcriptScores, consultantScores);
      const rp4 = result.find((g) => g.id === 'RP-4');
      expect(rp4.departments.sales).toBe(1);
    });
  });

  // ══════════════════════════════════════════════
  // RP-5: Revenue metrics / Power 10 (INTAKE)
  // ══════════════════════════════════════════════

  describe('RP-5 - Revenue metrics (Power 10)', () => {
    test('defaults to null with no intake data', () => {
      const result = gradeReporting({}, {}, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBeNull();
    });

    test('10 metrics reported scores 5', () => {
      const intakeAnswers = { power10_metrics_count: 10 };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(5);
    });

    test('8 metrics reported scores 4', () => {
      const intakeAnswers = { power10_metrics_count: 8 };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(4);
    });

    test('7 metrics reported scores 4', () => {
      const intakeAnswers = { power10_metrics_count: 7 };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(4);
    });

    test('5 metrics reported scores 3', () => {
      const intakeAnswers = { power10_metrics_count: 5 };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(3);
    });

    test('4 metrics reported scores 3', () => {
      const intakeAnswers = { power10_metrics_count: 4 };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(3);
    });

    test('2 metrics reported scores 2', () => {
      const intakeAnswers = { power10_metrics_count: 2 };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(2);
    });

    test('0 metrics reported scores 1', () => {
      const intakeAnswers = { power10_metrics_count: 0 };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(1);
    });

    test('boundary: exactly 9 metrics scores 4', () => {
      const intakeAnswers = { power10_metrics_count: 9 };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(4);
    });

    test('boundary: exactly 6 metrics scores 3', () => {
      const intakeAnswers = { power10_metrics_count: 6 };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(3);
    });

    test('boundary: exactly 3 metrics scores 2', () => {
      const intakeAnswers = { power10_metrics_count: 3 };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(2);
    });

    test('boundary: exactly 1 metric scores 2', () => {
      const intakeAnswers = { power10_metrics_count: 1 };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(2);
    });

    test('produces intake signal when power10 data present', () => {
      const intakeAnswers = { power10_metrics_count: 8 };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      const intakeSignal = rp5.signals.find((s) => s.source === 'intake');
      expect(intakeSignal).toBeDefined();
    });

    test('transcript score overlays intake for RP-5', () => {
      const intakeAnswers = { power10_metrics_count: 5 }; // intake = 3
      const transcriptScores = {
        'RP-5_sales': { score: 5, confidence: 0.9, evidence: 'All 10 metrics tracked' },
      };
      const result = gradeReporting({}, intakeAnswers, transcriptScores, {});
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(5);
    });

    test('consultant overrides everything for RP-5', () => {
      const intakeAnswers = { power10_metrics_count: 10 }; // intake = 5
      const transcriptScores = {
        'RP-5_sales': { score: 5, confidence: 0.9, evidence: 'All metrics' },
      };
      const consultantScores = {
        'RP-5_sales': { score: 2, notes: 'Metrics are unreliable' },
      };
      const result = gradeReporting({}, intakeAnswers, transcriptScores, consultantScores);
      const rp5 = result.find((g) => g.id === 'RP-5');
      expect(rp5.departments.sales).toBe(2);
    });
  });

  // ══════════════════════════════════════════════
  // RP-6: Forecasting methodology (INTAKE)
  // ══════════════════════════════════════════════

  describe('RP-6 - Forecasting methodology', () => {
    test('defaults to null with no intake data', () => {
      const result = gradeReporting({}, {}, {}, {});
      const rp6 = result.find((g) => g.id === 'RP-6');
      expect(rp6.departments.sales).toBeNull();
    });

    test('structured + tool forecasting scores 5', () => {
      const intakeAnswers = { forecasting_methodology: 'structured_tool' };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp6 = result.find((g) => g.id === 'RP-6');
      expect(rp6.departments.sales).toBe(5);
    });

    test('structured forecasting scores 4', () => {
      const intakeAnswers = { forecasting_methodology: 'structured' };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp6 = result.find((g) => g.id === 'RP-6');
      expect(rp6.departments.sales).toBe(4);
    });

    test('basic forecasting scores 3', () => {
      const intakeAnswers = { forecasting_methodology: 'basic' };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp6 = result.find((g) => g.id === 'RP-6');
      expect(rp6.departments.sales).toBe(3);
    });

    test('gut-feel forecasting scores 2', () => {
      const intakeAnswers = { forecasting_methodology: 'gut_feel' };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp6 = result.find((g) => g.id === 'RP-6');
      expect(rp6.departments.sales).toBe(2);
    });

    test('no forecasting (none) scores 1', () => {
      const intakeAnswers = { forecasting_methodology: 'none' };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp6 = result.find((g) => g.id === 'RP-6');
      expect(rp6.departments.sales).toBe(1);
    });

    test('has_forecasting_config signal boosts score', () => {
      const signals = { has_forecasting_config: true };
      const intakeAnswers = { forecasting_methodology: 'basic' }; // base = 3
      const result = gradeReporting(signals, intakeAnswers, {}, {});
      const rp6 = result.find((g) => g.id === 'RP-6');
      expect(rp6.departments.sales).toBe(4); // boosted by +1
    });

    test('has_forecasting_config does not boost beyond 5', () => {
      const signals = { has_forecasting_config: true };
      const intakeAnswers = { forecasting_methodology: 'structured_tool' }; // base = 5
      const result = gradeReporting(signals, intakeAnswers, {}, {});
      const rp6 = result.find((g) => g.id === 'RP-6');
      expect(rp6.departments.sales).toBe(5); // capped at 5
    });

    test('produces intake signal when forecasting data present', () => {
      const intakeAnswers = { forecasting_methodology: 'structured' };
      const result = gradeReporting({}, intakeAnswers, {}, {});
      const rp6 = result.find((g) => g.id === 'RP-6');
      const intakeSignal = rp6.signals.find((s) => s.source === 'intake');
      expect(intakeSignal).toBeDefined();
    });

    test('transcript score overlays intake for RP-6', () => {
      const intakeAnswers = { forecasting_methodology: 'basic' }; // intake = 3
      const transcriptScores = {
        'RP-6_sales': { score: 5, confidence: 0.9, evidence: 'Multi-method forecasting' },
      };
      const result = gradeReporting({}, intakeAnswers, transcriptScores, {});
      const rp6 = result.find((g) => g.id === 'RP-6');
      expect(rp6.departments.sales).toBe(5);
    });

    test('consultant overrides everything for RP-6', () => {
      const intakeAnswers = { forecasting_methodology: 'structured_tool' }; // intake = 5
      const consultantScores = {
        'RP-6_sales': { score: 1, notes: 'No actual forecasting' },
      };
      const result = gradeReporting({}, intakeAnswers, {}, consultantScores);
      const rp6 = result.find((g) => g.id === 'RP-6');
      expect(rp6.departments.sales).toBe(1);
    });
  });

  // ══════════════════════════════════════════════
  // Signal Collection
  // ══════════════════════════════════════════════

  describe('Signal collection', () => {
    test('API signals have correct structure', () => {
      const signals = { dashboard_count: 15 };
      const result = gradeReporting(signals, {}, {}, {});
      const rp1 = result.find((g) => g.id === 'RP-1');
      const apiSignal = rp1.signals.find((s) => s.source === 'api');
      expect(apiSignal).toHaveProperty('name');
      expect(apiSignal).toHaveProperty('value');
      expect(apiSignal).toHaveProperty('impact');
      expect(apiSignal).toHaveProperty('source', 'api');
    });

    test('transcript signals include evidence', () => {
      const transcriptScores = {
        'RP-2_marketing': { score: 3, confidence: 0.7, evidence: 'Has basic manager dashboards' },
      };
      const result = gradeReporting({}, {}, transcriptScores, {});
      const rp2 = result.find((g) => g.id === 'RP-2');
      const tSignal = rp2.signals.find((s) => s.source === 'transcript');
      expect(tSignal).toBeDefined();
      expect(tSignal.value).toContain('Has basic manager dashboards');
    });

    test('consultant signals include notes', () => {
      const consultantScores = {
        'RP-4_cs': { score: 4, notes: 'Good reporting cadence for CS team' },
      };
      const result = gradeReporting({}, {}, {}, consultantScores);
      const rp4 = result.find((g) => g.id === 'RP-4');
      const cSignal = rp4.signals.find((s) => s.source === 'consultant');
      expect(cSignal).toBeDefined();
      expect(cSignal.value).toContain('Good reporting cadence for CS team');
    });

    test('impact derived correctly: score 1-2 negative, 3 neutral, 4-5 positive', () => {
      const transcriptScores = {
        'RP-4_marketing': { score: 1, confidence: 0.8, evidence: 'No cadence' },
        'RP-4_sales': { score: 3, confidence: 0.8, evidence: 'Monthly reporting' },
        'RP-4_cs': { score: 5, confidence: 0.8, evidence: 'Full cadence' },
      };
      const result = gradeReporting({}, {}, transcriptScores, {});
      const rp4 = result.find((g) => g.id === 'RP-4');
      const mktSignal = rp4.signals.find((s) => s.name.includes('marketing'));
      const salesSignal = rp4.signals.find((s) => s.name.includes('sales'));
      const csSignal = rp4.signals.find((s) => s.name.includes('cs'));
      expect(mktSignal.impact).toBe('negative');
      expect(salesSignal.impact).toBe('neutral');
      expect(csSignal.impact).toBe('positive');
    });
  });

  // ══════════════════════════════════════════════
  // Mixed Data Integration Test
  // ══════════════════════════════════════════════

  test('handles mixed API, intake, transcript, and consultant data across all competencies', () => {
    const signals = {
      dashboard_count: 12, // RP-1 base = 4
      report_schedule_count: 5, // RP-4 base = 3
      has_forecasting_config: true, // RP-6 boost
    };
    const intakeAnswers = {
      dashboard_trust: 'low', // RP-1 adjustment
      power10_metrics_count: 8, // RP-5 = 4
      forecasting_methodology: 'basic', // RP-6 base = 3, boosted to 4
    };
    const transcriptScores = {
      'RP-1_cs': { score: 5, confidence: 0.9, evidence: 'Excellent CS dashboards' },
      'RP-2_marketing': { score: 3, confidence: 0.7, evidence: 'Basic manager views' },
      'RP-3_sales': { score: 4, confidence: 0.8, evidence: 'Good IC dashboards' },
      'RP-4_partners': { score: 2, confidence: 0.6, evidence: 'Minimal reporting' },
    };
    const consultantScores = {
      'RP-1_marketing': { score: 5, notes: 'World-class dashboards' },
      'RP-2_sales': { score: 4, notes: 'Strong manager reporting' },
      'RP-6_sales': { score: 5, notes: 'Best practice forecasting' },
    };

    const result = gradeReporting(signals, intakeAnswers, transcriptScores, consultantScores);

    // RP-1: API=4, trust=low -> 3; but consultant overrides marketing=5, transcript overrides cs=5
    const rp1 = result.find((g) => g.id === 'RP-1');
    expect(rp1.departments.marketing).toBe(5); // consultant override
    expect(rp1.departments.cs).toBe(5); // transcript override
    expect(rp1.departments.sales).toBe(3); // API adjusted by low trust
    expect(rp1.departments.partners).toBe(3); // API adjusted by low trust

    // RP-2: transcript on marketing=3, consultant on sales=4
    const rp2 = result.find((g) => g.id === 'RP-2');
    expect(rp2.departments.marketing).toBe(3);
    expect(rp2.departments.sales).toBe(4); // consultant override
    expect(rp2.departments.cs).toBeNull();

    // RP-3: transcript on sales=4
    const rp3 = result.find((g) => g.id === 'RP-3');
    expect(rp3.departments.sales).toBe(4);

    // RP-4: API=3, transcript overrides partners=2
    const rp4 = result.find((g) => g.id === 'RP-4');
    expect(rp4.departments.partners).toBe(2); // transcript override
    expect(rp4.departments.marketing).toBe(3); // API base

    // RP-5: intake=4 (8 metrics)
    const rp5 = result.find((g) => g.id === 'RP-5');
    expect(rp5.departments.sales).toBe(4);

    // RP-6: consultant overrides to 5
    const rp6 = result.find((g) => g.id === 'RP-6');
    expect(rp6.departments.sales).toBe(5); // consultant override
  });

  // ══════════════════════════════════════════════
  // Score Clamping
  // ══════════════════════════════════════════════

  test('scores are always clamped between 1 and 5', () => {
    // Low trust with dashboard_count=1 (score=2, trust adjustment=-1 -> 1, not 0)
    const signals = { dashboard_count: 1 };
    const intakeAnswers = { dashboard_trust: 'low' };
    const result = gradeReporting(signals, intakeAnswers, {}, {});
    const rp1 = result.find((g) => g.id === 'RP-1');
    for (const dept of ALL_DEPARTMENTS) {
      expect(rp1.departments[dept]).toBeGreaterThanOrEqual(1);
      expect(rp1.departments[dept]).toBeLessThanOrEqual(5);
    }
  });
});
