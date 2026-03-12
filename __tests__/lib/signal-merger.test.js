// __tests__/lib/signal-merger.test.js
import { mergeSignals } from '../../lib/diagnostic-engine/signal-merger';

describe('mergeSignals', () => {
  it('returns SF signals when HS is empty', () => {
    const sf = { pipeline_stage_count: 5, total_users: 10 };
    const result = mergeSignals(sf, {});
    expect(result.pipeline_stage_count).toBe(5);
    expect(result.total_users).toBe(10);
    expect(result._source).toBe('salesforce_only');
  });

  it('returns HS signals when SF is empty', () => {
    const hs = { form_count: 12, active_workflow_count: 8 };
    const result = mergeSignals({}, hs);
    expect(result.form_count).toBe(12);
    expect(result._source).toBe('hubspot_only');
  });

  it('merges both with SF authoritative for CRM keys', () => {
    const sf = { pipeline_stage_count: 7, total_users: 15, total_automation_count: 3 };
    const hs = { form_count: 20, active_workflow_count: 10, total_automation_count: 5 };
    const result = mergeSignals(sf, hs);
    expect(result.pipeline_stage_count).toBe(7);  // SF authoritative
    expect(result.form_count).toBe(20);            // HS authoritative
    expect(result.total_automation_count).toBe(8); // summed
    expect(result._source).toBe('dual');
    expect(result._sf_signal_count).toBeGreaterThan(0);
    expect(result._hs_signal_count).toBeGreaterThan(0);
  });

  it('HS marketing signals override SF nulls', () => {
    const sf = { form_count: 0, published_email_count: 0 };
    const hs = { form_count: 15, published_email_count: 42 };
    const result = mergeSignals(sf, hs);
    expect(result.form_count).toBe(15);
    expect(result.published_email_count).toBe(42);
  });
});
