import { mergeSignals } from '../../lib/diagnostic-engine/signal-merger';
import { runDiagnostic } from '../../lib/diagnostic-engine';

describe('Dual-system diagnostic', () => {
  const sfSignals = {
    pipeline_stage_count: 7,
    total_users: 25,
    total_automation_count: 12,
    has_lead_routing: true,
    report_count: 45,
    dashboard_count: 8,
    apex_trigger_count: 3,
  };

  const hsSignals = {
    form_count: 18,
    active_workflow_count: 15,
    total_automation_count: 8,
    published_email_count: 120,
    has_lead_scoring: true,
    sequence_count: 5,
  };

  it('merges signals with correct domain authority', () => {
    const merged = mergeSignals(sfSignals, hsSignals);
    expect(merged._source).toBe('dual');
    expect(merged.total_automation_count).toBe(20); // 12 + 8 summed
    expect(merged.pipeline_stage_count).toBe(7);    // SF authoritative
    expect(merged.form_count).toBe(18);              // HS authoritative
    expect(merged.has_lead_scoring).toBe(true);      // OR'd boolean
    expect(merged._sf_signal_count).toBeGreaterThan(0);
    expect(merged._hs_signal_count).toBeGreaterThan(0);
  });

  it('produces a valid diagnostic result from merged signals', () => {
    const merged = mergeSignals(sfSignals, hsSignals);

    const intakeAnswers = {
      A1: 'Both',
      A2: '11-25',
      A3: '$5M-$20M',
      A4: 'Product-led + sales-assisted',
    };

    // Pass 'salesforce' as effectiveCrmType (dual uses SF for platform health)
    const result = runDiagnostic(intakeAnswers, merged, 'salesforce');
    expect(result.version).toBe(2);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.scores).toBeDefined();
    expect(result.metadata.apiDataAvailable).toBe(true);
    expect(result.metadata.signalCount).toBeGreaterThan(0);
  });

  it('handles single-system fallback gracefully', () => {
    // SF only
    const sfOnly = mergeSignals(sfSignals, {});
    expect(sfOnly._source).toBe('salesforce_only');
    const sfResult = runDiagnostic({ A1: 'Salesforce' }, sfOnly, 'salesforce');
    expect(sfResult.version).toBe(2);

    // HS only
    const hsOnly = mergeSignals({}, hsSignals);
    expect(hsOnly._source).toBe('hubspot_only');
    const hsResult = runDiagnostic({ A1: 'HubSpot' }, hsOnly, 'hubspot');
    expect(hsResult.version).toBe(2);
  });
});
