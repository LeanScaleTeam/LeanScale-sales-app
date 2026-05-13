/**
 * Tests for the multi-CRM helper module.
 */

import {
  SYSTEM_KEYS,
  normalizeCrmSystems,
  selectRoleSystems,
  deriveLegacyCrmType,
} from '../../lib/diagnostic-engine/crm-systems';

describe('normalizeCrmSystems', () => {
  test('passes through a clean array', () => {
    expect(normalizeCrmSystems(['attio', 'hubspot_map'])).toEqual(['attio', 'hubspot_map']);
  });

  test('drops unknown values from an array', () => {
    expect(normalizeCrmSystems(['attio', 'foo', 'hubspot_map'])).toEqual(['attio', 'hubspot_map']);
  });

  test('coerces legacy string A1 values', () => {
    expect(normalizeCrmSystems('HubSpot')).toEqual(['hubspot_crm']);
    expect(normalizeCrmSystems('Salesforce')).toEqual(['salesforce']);
    expect(normalizeCrmSystems('Attio')).toEqual(['attio']);
  });

  test('coerces legacy "Both" to SF + HubSpot MAP', () => {
    expect(normalizeCrmSystems('Both')).toEqual(['salesforce', 'hubspot_map']);
  });

  test('handles legacy crm_type = "dual"', () => {
    expect(normalizeCrmSystems('dual')).toEqual(['salesforce', 'hubspot_map']);
  });

  test('returns empty for null/undefined/empty', () => {
    expect(normalizeCrmSystems(null)).toEqual([]);
    expect(normalizeCrmSystems(undefined)).toEqual([]);
    expect(normalizeCrmSystems('')).toEqual([]);
    expect(normalizeCrmSystems([])).toEqual([]);
  });
});

describe('selectRoleSystems', () => {
  test('Salesforce wins CRM role', () => {
    expect(selectRoleSystems(['salesforce', 'hubspot_map'])).toEqual({
      crm: 'salesforce',
      map: 'hubspot_map',
    });
  });

  test('Attio takes CRM role when no Salesforce', () => {
    expect(selectRoleSystems(['attio', 'hubspot_map'])).toEqual({
      crm: 'attio',
      map: 'hubspot_map',
    });
  });

  test('HubSpot CRM takes CRM role when alone', () => {
    expect(selectRoleSystems(['hubspot_crm'])).toEqual({
      crm: 'hubspot_crm',
      map: null,
    });
  });

  test('Salesforce beats Attio for CRM role even when both present', () => {
    expect(selectRoleSystems(['attio', 'salesforce'])).toEqual({
      crm: 'salesforce',
      map: null,
    });
  });
});

describe('deriveLegacyCrmType', () => {
  test('single system maps to legacy key', () => {
    expect(deriveLegacyCrmType(['hubspot_crm'])).toBe('hubspot');
    expect(deriveLegacyCrmType(['hubspot_map'])).toBe('hubspot');
    expect(deriveLegacyCrmType(['salesforce'])).toBe('salesforce');
    expect(deriveLegacyCrmType(['attio'])).toBe('attio');
  });

  test('SF + HubSpot maps to dual', () => {
    expect(deriveLegacyCrmType(['salesforce', 'hubspot_map'])).toBe('dual');
  });

  test('Attio + HubSpot maps to multi', () => {
    expect(deriveLegacyCrmType(['attio', 'hubspot_map'])).toBe('multi');
  });

  test('empty maps to unknown', () => {
    expect(deriveLegacyCrmType([])).toBe('unknown');
  });
});
