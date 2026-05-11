/**
 * End-to-end Attio diagnostic test — verifies runDiagnostic() routes Attio
 * correctly and produces a valid result.
 */

import { runDiagnostic } from '../../lib/diagnostic-engine';
import { extractAttioSignals } from '../../lib/diagnostic-engine/signal-extractor-attio';

describe('runDiagnostic with Attio CRM', () => {
  test('routes Attio through Attio automation grader', () => {
    const signals = extractAttioSignals({
      objects: [{ api_slug: 'people' }, { api_slug: 'companies' }, { api_slug: 'deals' }],
      attributes: {
        deals: [
          { api_slug: 'stage', type: 'status' },
          { api_slug: 'value' },
          { api_slug: 'closed_lost_reason' },
        ],
      },
      statuses: {
        'deals.stage': [
          { title: 'Demo' },
          { title: 'Closed Won' },
          { title: 'Closed Lost' },
        ],
      },
      webhooks: [
        {
          target_url: 'https://hooks.slack.com/x',
          status: 'active',
          subscriptions: [{ event_type: 'record.created' }],
        },
      ],
    });

    const result = runDiagnostic(
      { A1: 'Attio', A_attio_workflow_count: '4-10' },
      signals,
      'attio'
    );

    expect(result.crmType).toBe('attio');

    const f4 = result.items.find((i) => i.id === 'F4');
    expect(f4).toBeDefined();
    expect(f4.name).toMatch(/Attio/i);
    expect(f4.layer).toBe('foundation');
    expect(['healthy', 'careful', 'warning']).toContain(f4.status);

    expect(result.scores).toHaveProperty('overall');
    expect(result.scores).toHaveProperty('foundation');
    expect(result.scores).not.toHaveProperty('platformHealth'); // Attio gets 3-layer scoring
  });

  test('HubSpot path still works unchanged', () => {
    const result = runDiagnostic({ A1: 'HubSpot' }, {}, 'hubspot');
    expect(result.crmType).toBe('hubspot');
    const f4 = result.items.find((i) => i.id === 'F4');
    expect(f4).toBeDefined();
    expect(f4.name).not.toMatch(/Attio/i);
  });
});
