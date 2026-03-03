/**
 * Tests for v3 Enablement Pillar Grader (EN-1 through EN-5)
 *
 * Covers:
 * - lib/diagnostic-engine/v3/graders/grade-enablement.js
 * - API weak signal scoring (email counts, enablement platform, conversation intel, knowledge articles)
 * - Transcript score overlay
 * - Consultant score override behavior
 * - Department scoping (EN-1: mkt/sales/partners, EN-3: sales only, EN-2/4/5: all)
 * - Null scores when no data
 * - Signal collection from all sources
 */

const DEPARTMENTS = ['marketing', 'sales', 'cs', 'partners'];

describe('gradeEnablement - v3 Enablement Pillar', () => {
  let gradeEnablement;

  beforeAll(() => {
    ({ gradeEnablement } = require('../../lib/diagnostic-engine/v3/graders/grade-enablement'));
  });

  // ── Basic Structure ──

  test('returns an array of 5 competency grade objects', () => {
    const result = gradeEnablement({}, {}, {}, {});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);
  });

  test('each grade has the correct shape', () => {
    const result = gradeEnablement({}, {}, {}, {});
    for (const grade of result) {
      expect(grade).toHaveProperty('id');
      expect(grade).toHaveProperty('name');
      expect(grade).toHaveProperty('pillar', 'enablement');
      expect(grade).toHaveProperty('departments');
      expect(grade).toHaveProperty('source');
      expect(grade).toHaveProperty('signals');
      expect(grade).toHaveProperty('serviceIds');
      expect(typeof grade.departments).toBe('object');
      expect(Array.isArray(grade.signals)).toBe(true);
      expect(Array.isArray(grade.serviceIds)).toBe(true);
    }
  });

  test('returns competencies in order EN-1 through EN-5', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const ids = result.map((g) => g.id);
    expect(ids).toEqual(['EN-1', 'EN-2', 'EN-3', 'EN-4', 'EN-5']);
  });

  // ── Correct Names and Sources ──

  test('EN-1 has correct name and source type', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    expect(en1.name).toBe('ICP content coverage');
    expect(en1.source).toBe('TRANSCRIPT_CONSULTANT');
  });

  test('EN-2 has correct name and source type', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en2 = result.find((g) => g.id === 'EN-2');
    expect(en2.name).toBe('Content accessible in single system');
    expect(en2.source).toBe('API_PLUS');
  });

  test('EN-3 has correct name and source type', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en3 = result.find((g) => g.id === 'EN-3');
    expect(en3.name).toBe('Sales coaching program');
    expect(en3.source).toBe('TRANSCRIPT_CONSULTANT');
  });

  test('EN-4 has correct name and source type', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en4 = result.find((g) => g.id === 'EN-4');
    expect(en4.name).toBe('Training / certification');
    expect(en4.source).toBe('CONSULTANT_ONLY');
  });

  test('EN-5 has correct name and source type', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en5 = result.find((g) => g.id === 'EN-5');
    expect(en5.name).toBe('Playbook documentation');
    expect(en5.source).toBe('TRANSCRIPT_CONSULTANT');
  });

  // ── Service IDs ──

  test('EN-1 has correct serviceIds', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    expect(en1.serviceIds).toEqual(['sales-enablement-platform-implementation']);
  });

  test('EN-2 has correct serviceIds', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en2 = result.find((g) => g.id === 'EN-2');
    expect(en2.serviceIds).toEqual(['sales-enablement-platform-implementation']);
  });

  test('EN-3 has correct serviceIds', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en3 = result.find((g) => g.id === 'EN-3');
    expect(en3.serviceIds).toEqual(['conversation-intelligence-platform-implementation']);
  });

  test('EN-4 has correct serviceIds', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en4 = result.find((g) => g.id === 'EN-4');
    expect(en4.serviceIds).toEqual(['sales-enablement-platform-implementation']);
  });

  test('EN-5 has correct serviceIds', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en5 = result.find((g) => g.id === 'EN-5');
    expect(en5.serviceIds).toEqual(['sales-enablement-platform-implementation']);
  });

  // ── Department Scoping ──

  test('EN-1 only has marketing, sales, partners departments (not cs)', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    expect(en1.departments).toHaveProperty('marketing');
    expect(en1.departments).toHaveProperty('sales');
    expect(en1.departments).toHaveProperty('partners');
    expect(en1.departments).not.toHaveProperty('cs');
  });

  test('EN-2 has all 4 departments', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en2 = result.find((g) => g.id === 'EN-2');
    for (const dept of DEPARTMENTS) {
      expect(en2.departments).toHaveProperty(dept);
    }
  });

  test('EN-3 only has sales department', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en3 = result.find((g) => g.id === 'EN-3');
    expect(en3.departments).toHaveProperty('sales');
    expect(en3.departments).not.toHaveProperty('marketing');
    expect(en3.departments).not.toHaveProperty('cs');
    expect(en3.departments).not.toHaveProperty('partners');
  });

  test('EN-4 has all 4 departments', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en4 = result.find((g) => g.id === 'EN-4');
    for (const dept of DEPARTMENTS) {
      expect(en4.departments).toHaveProperty(dept);
    }
  });

  test('EN-5 has all 4 departments', () => {
    const result = gradeEnablement({}, {}, {}, {});
    const en5 = result.find((g) => g.id === 'EN-5');
    for (const dept of DEPARTMENTS) {
      expect(en5.departments).toHaveProperty(dept);
    }
  });

  // ── Null Scores When No Data ──

  test('all department scores are null when no signals, transcript, or consultant data', () => {
    const result = gradeEnablement({}, {}, {}, {});
    for (const grade of result) {
      for (const dept of Object.keys(grade.departments)) {
        expect(grade.departments[dept]).toBeNull();
      }
    }
  });

  // ── EN-1: API Weak Signal (email count) ──

  test('EN-1: marketing_email_count > 50 produces base score 3 for applicable departments', () => {
    const signals = { marketing_email_count: 75 };
    const result = gradeEnablement(signals, {}, {}, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    expect(en1.departments.marketing).toBe(3);
    expect(en1.departments.sales).toBe(3);
    expect(en1.departments.partners).toBe(3);
  });

  test('EN-1: marketing_email_count > 20 produces base score 2', () => {
    const signals = { marketing_email_count: 30 };
    const result = gradeEnablement(signals, {}, {}, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    expect(en1.departments.marketing).toBe(2);
    expect(en1.departments.sales).toBe(2);
    expect(en1.departments.partners).toBe(2);
  });

  test('EN-1: marketing_email_count <= 20 produces null (no weak signal)', () => {
    const signals = { marketing_email_count: 10 };
    const result = gradeEnablement(signals, {}, {}, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    expect(en1.departments.marketing).toBeNull();
  });

  test('EN-1: blog_post_count is also checked as weak signal', () => {
    const signals = { blog_post_count: 60 };
    const result = gradeEnablement(signals, {}, {}, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    // blog_post_count > 50 should also produce base score 3
    expect(en1.departments.marketing).toBe(3);
  });

  // ── EN-2: Enablement Platform Detection ──

  test('EN-2: has_enablement_platform true produces base score 4', () => {
    const signals = { has_enablement_platform: true };
    const result = gradeEnablement(signals, {}, {}, {});
    const en2 = result.find((g) => g.id === 'EN-2');
    for (const dept of DEPARTMENTS) {
      expect(en2.departments[dept]).toBe(4);
    }
  });

  test('EN-2: has_enablement_platform false with no other signals returns null', () => {
    const signals = { has_enablement_platform: false };
    const result = gradeEnablement(signals, {}, {}, {});
    const en2 = result.find((g) => g.id === 'EN-2');
    for (const dept of DEPARTMENTS) {
      expect(en2.departments[dept]).toBeNull();
    }
  });

  // ── EN-3: Conversation Intelligence Weak Signal ──

  test('EN-3: has_conversation_intelligence true produces base score 3 for sales', () => {
    const signals = { has_conversation_intelligence: true };
    const result = gradeEnablement(signals, {}, {}, {});
    const en3 = result.find((g) => g.id === 'EN-3');
    expect(en3.departments.sales).toBe(3);
  });

  test('EN-3: has_conversation_intelligence false returns null for sales', () => {
    const signals = { has_conversation_intelligence: false };
    const result = gradeEnablement(signals, {}, {}, {});
    const en3 = result.find((g) => g.id === 'EN-3');
    expect(en3.departments.sales).toBeNull();
  });

  // ── EN-4: Consultant Only ──

  test('EN-4: returns null for all departments without consultant input', () => {
    const signals = { some_signal: true };
    const result = gradeEnablement(signals, {}, {}, {});
    const en4 = result.find((g) => g.id === 'EN-4');
    for (const dept of DEPARTMENTS) {
      expect(en4.departments[dept]).toBeNull();
    }
  });

  test('EN-4: consultant scores are applied when provided', () => {
    const consultantScores = {
      'EN-4_marketing': { score: 3, notes: 'Some training program' },
      'EN-4_sales': { score: 4, notes: 'Good certification' },
    };
    const result = gradeEnablement({}, {}, {}, consultantScores);
    const en4 = result.find((g) => g.id === 'EN-4');
    expect(en4.departments.marketing).toBe(3);
    expect(en4.departments.sales).toBe(4);
    expect(en4.departments.cs).toBeNull();
    expect(en4.departments.partners).toBeNull();
  });

  // ── EN-5: Knowledge Article Count Weak Signal ──

  test('EN-5: knowledge_article_count > 10 produces base score 3', () => {
    const signals = { knowledge_article_count: 25 };
    const result = gradeEnablement(signals, {}, {}, {});
    const en5 = result.find((g) => g.id === 'EN-5');
    for (const dept of DEPARTMENTS) {
      expect(en5.departments[dept]).toBe(3);
    }
  });

  test('EN-5: knowledge_article_count > 0 but <= 10 produces base score 2', () => {
    const signals = { knowledge_article_count: 5 };
    const result = gradeEnablement(signals, {}, {}, {});
    const en5 = result.find((g) => g.id === 'EN-5');
    for (const dept of DEPARTMENTS) {
      expect(en5.departments[dept]).toBe(2);
    }
  });

  test('EN-5: knowledge_article_count 0 produces null', () => {
    const signals = { knowledge_article_count: 0 };
    const result = gradeEnablement(signals, {}, {}, {});
    const en5 = result.find((g) => g.id === 'EN-5');
    for (const dept of DEPARTMENTS) {
      expect(en5.departments[dept]).toBeNull();
    }
  });

  // ── Transcript Score Overlay ──

  test('transcript score overrides API weak signal', () => {
    const signals = { marketing_email_count: 75 }; // would give EN-1 base 3
    const transcriptScores = {
      'EN-1_marketing': { score: 4, confidence: 0.8, evidence: 'Strong content library' },
    };
    const result = gradeEnablement(signals, {}, transcriptScores, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    expect(en1.departments.marketing).toBe(4); // transcript overrides API base
    // Other departments still use API base
    expect(en1.departments.sales).toBe(3);
    expect(en1.departments.partners).toBe(3);
  });

  test('transcript scores populate for EN-3 sales', () => {
    const transcriptScores = {
      'EN-3_sales': { score: 4, confidence: 0.9, evidence: 'Active coaching with Gong' },
    };
    const result = gradeEnablement({}, {}, transcriptScores, {});
    const en3 = result.find((g) => g.id === 'EN-3');
    expect(en3.departments.sales).toBe(4);
  });

  test('transcript scores populate for EN-5 across departments', () => {
    const transcriptScores = {
      'EN-5_marketing': { score: 2, confidence: 0.6, evidence: 'Some playbooks' },
      'EN-5_sales': { score: 3, confidence: 0.7, evidence: 'Decent playbook set' },
    };
    const result = gradeEnablement({}, {}, transcriptScores, {});
    const en5 = result.find((g) => g.id === 'EN-5');
    expect(en5.departments.marketing).toBe(2);
    expect(en5.departments.sales).toBe(3);
    expect(en5.departments.cs).toBeNull();
    expect(en5.departments.partners).toBeNull();
  });

  // ── Consultant Score Override ──

  test('consultant score overrides both API signal and transcript', () => {
    const signals = { has_enablement_platform: true }; // EN-2 base 4
    const transcriptScores = {
      'EN-2_marketing': { score: 3, confidence: 0.7, evidence: 'Partial adoption' },
    };
    const consultantScores = {
      'EN-2_marketing': { score: 5, notes: 'Full Highspot deployment' },
    };
    const result = gradeEnablement(signals, {}, transcriptScores, consultantScores);
    const en2 = result.find((g) => g.id === 'EN-2');
    expect(en2.departments.marketing).toBe(5); // consultant wins
  });

  test('consultant score overrides API weak signal without transcript', () => {
    const signals = { knowledge_article_count: 25 }; // EN-5 base 3
    const consultantScores = {
      'EN-5_sales': { score: 5, notes: 'Comprehensive playbook library' },
    };
    const result = gradeEnablement(signals, {}, {}, consultantScores);
    const en5 = result.find((g) => g.id === 'EN-5');
    expect(en5.departments.sales).toBe(5); // consultant overrides API base
    expect(en5.departments.marketing).toBe(3); // API base stands
  });

  test('consultant scores work across all departments for EN-4', () => {
    const consultantScores = {
      'EN-4_marketing': { score: 5, notes: 'Excellent training' },
      'EN-4_sales': { score: 4, notes: 'Good training' },
      'EN-4_cs': { score: 3, notes: 'Basic training' },
      'EN-4_partners': { score: 2, notes: 'Minimal training' },
    };
    const result = gradeEnablement({}, {}, {}, consultantScores);
    const en4 = result.find((g) => g.id === 'EN-4');
    expect(en4.departments.marketing).toBe(5);
    expect(en4.departments.sales).toBe(4);
    expect(en4.departments.cs).toBe(3);
    expect(en4.departments.partners).toBe(2);
  });

  // ── Signal Collection ──

  test('API weak signals are recorded in signals array', () => {
    const signals = { marketing_email_count: 75 };
    const result = gradeEnablement(signals, {}, {}, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    expect(en1.signals.length).toBeGreaterThan(0);
    const apiSignal = en1.signals.find((s) => s.source === 'api');
    expect(apiSignal).toBeDefined();
    expect(apiSignal.name).toContain('email');
  });

  test('transcript evidence is recorded in signals array', () => {
    const transcriptScores = {
      'EN-1_marketing': { score: 3, confidence: 0.8, evidence: 'Content library covers key personas' },
    };
    const result = gradeEnablement({}, {}, transcriptScores, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    const signal = en1.signals.find((s) => s.source === 'transcript');
    expect(signal).toBeDefined();
    expect(signal.value).toContain('Content library covers key personas');
  });

  test('consultant notes are recorded in signals array', () => {
    const consultantScores = {
      'EN-4_sales': { score: 4, notes: 'Strong certification program' },
    };
    const result = gradeEnablement({}, {}, {}, consultantScores);
    const en4 = result.find((g) => g.id === 'EN-4');
    const signal = en4.signals.find((s) => s.source === 'consultant');
    expect(signal).toBeDefined();
    expect(signal.value).toContain('Strong certification program');
  });

  test('no signals when no data at all', () => {
    const result = gradeEnablement({}, {}, {}, {});
    for (const grade of result) {
      expect(grade.signals).toEqual([]);
    }
  });

  test('signals include department name', () => {
    const transcriptScores = {
      'EN-5_sales': { score: 4, confidence: 0.7, evidence: 'Good playbooks' },
    };
    const result = gradeEnablement({}, {}, transcriptScores, {});
    const en5 = result.find((g) => g.id === 'EN-5');
    const signal = en5.signals.find((s) => s.source === 'transcript');
    expect(signal).toBeDefined();
    expect(signal.name).toContain('sales');
  });

  // ── Impact Derivation ──

  test('signals have impact field based on score', () => {
    const transcriptScores = {
      'EN-1_marketing': { score: 1, confidence: 0.8, evidence: 'No content' },
      'EN-1_sales': { score: 3, confidence: 0.8, evidence: 'Average content' },
      'EN-1_partners': { score: 5, confidence: 0.8, evidence: 'Excellent coverage' },
    };
    const result = gradeEnablement({}, {}, transcriptScores, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    const mktSignal = en1.signals.find((s) => s.name.includes('marketing') && s.source === 'transcript');
    const salesSignal = en1.signals.find((s) => s.name.includes('sales') && s.source === 'transcript');
    const partnerSignal = en1.signals.find((s) => s.name.includes('partners') && s.source === 'transcript');
    expect(mktSignal.impact).toBe('negative');
    expect(salesSignal.impact).toBe('neutral');
    expect(partnerSignal.impact).toBe('positive');
  });

  // ── Mixed Signals + Transcript + Consultant across competencies ──

  test('handles mixed data sources across all competencies', () => {
    const signals = {
      marketing_email_count: 75,           // EN-1 base 3
      has_enablement_platform: true,        // EN-2 base 4
      has_conversation_intelligence: true,  // EN-3 base 3
      knowledge_article_count: 25,          // EN-5 base 3
    };
    const transcriptScores = {
      'EN-1_marketing': { score: 4, confidence: 0.8, evidence: 'Strong content' },
      'EN-3_sales': { score: 5, confidence: 0.9, evidence: 'Best-in-class coaching' },
      'EN-5_cs': { score: 2, confidence: 0.6, evidence: 'Minimal playbooks' },
    };
    const consultantScores = {
      'EN-1_marketing': { score: 5, notes: 'Outstanding content program' },
      'EN-2_sales': { score: 2, notes: 'Platform exists but poor adoption' },
      'EN-4_marketing': { score: 3, notes: 'Some training' },
      'EN-4_sales': { score: 4, notes: 'Good certifications' },
    };

    const result = gradeEnablement(signals, {}, transcriptScores, consultantScores);

    // EN-1: consultant overrides marketing, others get API base
    const en1 = result.find((g) => g.id === 'EN-1');
    expect(en1.departments.marketing).toBe(5); // consultant
    expect(en1.departments.sales).toBe(3);     // API base (no transcript/consultant)
    expect(en1.departments.partners).toBe(3);  // API base

    // EN-2: consultant overrides sales, others get API base 4
    const en2 = result.find((g) => g.id === 'EN-2');
    expect(en2.departments.marketing).toBe(4); // API base
    expect(en2.departments.sales).toBe(2);     // consultant
    expect(en2.departments.cs).toBe(4);        // API base
    expect(en2.departments.partners).toBe(4);  // API base

    // EN-3: transcript overrides sales from API base 3 to 5
    const en3 = result.find((g) => g.id === 'EN-3');
    expect(en3.departments.sales).toBe(5);     // transcript

    // EN-4: consultant only
    const en4 = result.find((g) => g.id === 'EN-4');
    expect(en4.departments.marketing).toBe(3);
    expect(en4.departments.sales).toBe(4);
    expect(en4.departments.cs).toBeNull();
    expect(en4.departments.partners).toBeNull();

    // EN-5: transcript overrides cs, others keep API base
    const en5 = result.find((g) => g.id === 'EN-5');
    expect(en5.departments.marketing).toBe(3); // API base
    expect(en5.departments.sales).toBe(3);     // API base
    expect(en5.departments.cs).toBe(2);        // transcript
    expect(en5.departments.partners).toBe(3);  // API base
  });

  // ── Edge cases ──

  test('EN-1: email count exactly at boundary 50 gets score 2 (not 3)', () => {
    const signals = { marketing_email_count: 50 };
    const result = gradeEnablement(signals, {}, {}, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    expect(en1.departments.marketing).toBe(2); // > 20 but not > 50
  });

  test('EN-1: email count exactly at boundary 20 gets null (not 2)', () => {
    const signals = { marketing_email_count: 20 };
    const result = gradeEnablement(signals, {}, {}, {});
    const en1 = result.find((g) => g.id === 'EN-1');
    expect(en1.departments.marketing).toBeNull();
  });

  test('EN-5: knowledge_article_count exactly at boundary 10 gets score 2 (not 3)', () => {
    const signals = { knowledge_article_count: 10 };
    const result = gradeEnablement(signals, {}, {}, {});
    const en5 = result.find((g) => g.id === 'EN-5');
    for (const dept of DEPARTMENTS) {
      expect(en5.departments[dept]).toBe(2); // > 0 but not > 10
    }
  });
});
