/**
 * Tests for the N-source signal merger.
 */

import { mergeMultiSourceSignals } from '../../lib/diagnostic-engine/signal-merger';

describe('mergeMultiSourceSignals', () => {
  test('returns _source: none when no sources present', () => {
    expect(mergeMultiSourceSignals({})._source).toBe('none');
    expect(mergeMultiSourceSignals({ salesforce: {}, hubspot: {}, attio: {} })._source).toBe('none');
  });

  test('single source short-circuit (salesforce only)', () => {
    const result = mergeMultiSourceSignals({
      salesforce: { pipeline_stage_count: 7, total_users: 50 },
    });
    expect(result._source).toBe('salesforce_only');
    expect(result.pipeline_stage_count).toBe(7);
  });

  test('single source short-circuit (attio only)', () => {
    const result = mergeMultiSourceSignals({
      attio: { attio_webhook_total: 5, ai_attribute_count: 3 },
    });
    expect(result._source).toBe('attio_only');
    expect(result.attio_webhook_total).toBe(5);
  });

  test('Attio + HubSpot MAP — Attio wins CRM authority, HubSpot wins marketing', () => {
    const result = mergeMultiSourceSignals({
      attio: {
        contact_total_properties: 25,
        deal_pipeline_count: 2,
        attio_webhook_total: 3,
        ai_attribute_count: 4,
      },
      hubspot: {
        form_count: 15,
        marketing_email_count: 30,
        published_email_count: 12,
      },
    });
    expect(result._source).toBe('multi');
    // Attio CRM signals preserved
    expect(result.contact_total_properties).toBe(25);
    expect(result.deal_pipeline_count).toBe(2);
    // Attio F4 signals preserved
    expect(result.attio_webhook_total).toBe(3);
    expect(result.ai_attribute_count).toBe(4);
    // HubSpot marketing signals layered on
    expect(result.form_count).toBe(15);
    expect(result.marketing_email_count).toBe(30);
  });

  test('SF + HubSpot keeps existing dual-mode behavior (SF wins CRM-authoritative)', () => {
    const result = mergeMultiSourceSignals({
      salesforce: {
        pipeline_stage_count: 9,
        total_users: 100,
      },
      hubspot: {
        pipeline_stage_count: 5, // ignored — SF authoritative
        form_count: 20,
      },
    });
    expect(result.pipeline_stage_count).toBe(9); // SF wins
    expect(result.form_count).toBe(20);
  });

  test('three-source merge: SF + HubSpot MAP + Attio', () => {
    const result = mergeMultiSourceSignals({
      salesforce: { pipeline_stage_count: 8, has_lead_scoring: true },
      hubspot: { form_count: 12, marketing_email_count: 25 },
      attio: { attio_webhook_total: 4, ai_attribute_count: 2 },
    });
    expect(result._source).toBe('multi');
    expect(result.pipeline_stage_count).toBe(8); // SF authoritative
    expect(result.form_count).toBe(12); // HS authoritative
    expect(result.attio_webhook_total).toBe(4); // Attio-specific preserved
    expect(result.ai_attribute_count).toBe(2);
  });

  test('boolean OR keys merge across sources', () => {
    const result = mergeMultiSourceSignals({
      salesforce: { has_enrichment: false },
      hubspot: { has_enrichment: true },
    });
    expect(result.has_enrichment).toBe(true);
  });

  test('summed keys add up across sources', () => {
    const result = mergeMultiSourceSignals({
      salesforce: { total_automation_count: 12 },
      hubspot: { total_automation_count: 8 },
    });
    expect(result.total_automation_count).toBe(20);
  });
});
