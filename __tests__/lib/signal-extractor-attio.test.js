/**
 * Smoke tests for the Attio signal extractor.
 *
 * Verifies the extractor handles missing fields gracefully and produces the
 * expected shape with realistic Attio API payloads.
 */

import { extractAttioSignals } from '../../lib/diagnostic-engine/signal-extractor-attio';
import { gradeAutomationAttio } from '../../lib/diagnostic-engine/graders/automation-attio';

describe('extractAttioSignals', () => {
  test('returns expected shape on empty input', () => {
    const s = extractAttioSignals({});
    expect(s).toHaveProperty('contact_total_properties', 0);
    expect(s).toHaveProperty('deal_pipeline_count', 0);
    expect(s).toHaveProperty('attio_webhook_total', 0);
    expect(s).toHaveProperty('attio_automation_write_share_pct', 0);
    expect(s).toHaveProperty('ai_attribute_count', 0);
    expect(s).toHaveProperty('custom_object_count', 0);
  });

  test('counts attributes per object', () => {
    const s = extractAttioSignals({
      objects: [
        { api_slug: 'people' },
        { api_slug: 'companies' },
        { api_slug: 'deals' },
      ],
      attributes: {
        people: [
          { api_slug: 'name', is_system: true },
          { api_slug: 'clearbit_employees', is_system: false, title: 'Clearbit Employees' },
        ],
        companies: [
          { api_slug: 'name', is_system: true },
          { api_slug: 'description', is_ai_attribute: true },
        ],
        deals: [
          { api_slug: 'stage', type: 'status' },
          { api_slug: 'value', is_system: false },
          { api_slug: 'closed_lost_reason', is_system: false, title: 'Closed Lost Reason' },
        ],
      },
      statuses: {
        'deals.stage': [
          { title: 'Discovery' },
          { title: 'Demo' },
          { title: 'Closed Won' },
          { title: 'Closed Lost' },
        ],
      },
    });

    expect(s.contact_total_properties).toBe(2);
    expect(s.company_total_properties).toBe(2);
    expect(s.deal_total_properties).toBe(3);
    expect(s.ai_attribute_count).toBe(1);
    expect(s.enrichment_tool_detected).toBe('Clearbit');
    expect(s.deal_pipeline_count).toBe(1);
    expect(s.deal_pipeline_stages[0].hasClosedLost).toBe(true);
    expect(s.deal_pipeline_stages[0].hasClosedWon).toBe(true);
    expect(s.has_close_reason_property).toBe(true);
  });

  test('classifies webhook platforms', () => {
    const s = extractAttioSignals({
      webhooks: [
        {
          target_url: 'https://hooks.slack.com/services/X/Y/Z',
          status: 'active',
          subscriptions: [{ event_type: 'record.created' }],
        },
        {
          target_url: 'https://hooks.zapier.com/abc',
          status: 'active',
          subscriptions: [
            { event_type: 'list-entry.updated', filter: { $and: [{ slug: 'stage' }] } },
            { event_type: 'task.created' },
          ],
        },
      ],
    });

    expect(s.attio_webhook_total).toBe(2);
    expect(s.attio_webhook_active).toBe(2);
    expect(s.attio_webhook_platforms).toEqual(expect.arrayContaining(['Slack', 'Zapier']));
    expect(s.attio_webhook_event_types).toEqual(
      expect.arrayContaining(['record.created', 'list-entry.updated', 'task.created'])
    );
    expect(s.attio_webhook_health_pct).toBe(100);
    expect(s.attio_webhook_with_filter_pct).toBeGreaterThan(0);
  });

  test('computes actor share from record samples', () => {
    const s = extractAttioSignals({
      workspace_members: [
        { id: { workspace_member_id: 'member-1' } },
        { id: { workspace_member_id: 'member-2' } },
      ],
      record_samples: {
        deals: [
          { created_by_actor: { type: 'workspace-member', id: 'member-1' } },
          { created_by_actor: { type: 'workspace-member', id: 'member-2' } },
          { created_by_actor: { type: 'api-token', id: 'token-1' } },
          { created_by_actor: { type: 'system' } },
        ],
      },
    });

    expect(s.attio_automation_write_share_pct).toBe(50);
    expect(s.attio_api_token_actors).toBe(2);
  });
});

describe('gradeAutomationAttio', () => {
  test('low automation produces warning', () => {
    const item = gradeAutomationAttio(
      {
        attio_webhook_total: 0,
        attio_webhook_event_type_count: 0,
        attio_webhook_platforms: [],
        attio_automation_write_share_pct: 5,
        ai_attribute_count: 0,
      },
      { A_attio_workflow_count: '0' }
    );
    expect(item.id).toBe('F4');
    expect(item.layer).toBe('foundation');
    expect(item.status).toBe('warning');
  });

  test('mature automation produces healthy', () => {
    const item = gradeAutomationAttio(
      {
        attio_webhook_total: 8,
        attio_webhook_active: 8,
        attio_webhook_event_type_count: 6,
        attio_webhook_platforms: ['Slack', 'Zapier', 'n8n'],
        attio_webhook_with_filter_pct: 75,
        attio_webhook_health_pct: 100,
        attio_automation_write_share_pct: 45,
        ai_attribute_count: 5,
      },
      { A_attio_workflow_count: '10+' }
    );
    expect(item.status).toBe('healthy');
    expect(item.score).toBeGreaterThan(2.3);
  });
});
