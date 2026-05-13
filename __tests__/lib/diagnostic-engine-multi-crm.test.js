/**
 * End-to-end tests for the diagnostic engine with multi-CRM crm_systems input.
 */

import { runDiagnostic } from '../../lib/diagnostic-engine';

describe('runDiagnostic with crm_systems array', () => {
  test('accepts a crm_systems array (Attio + HubSpot MAP)', () => {
    const result = runDiagnostic(
      { A1: ['attio', 'hubspot_map'] },
      { /* empty signals */ },
      ['attio', 'hubspot_map']
    );

    expect(result.crmType).toBe('multi');
    expect(result.crmSystems).toEqual(['attio', 'hubspot_map']);
    expect(result.company_profile.crmSystems).toEqual(['attio', 'hubspot_map']);

    // Attio + HubSpot — F4 should be the Attio variant (since Attio is in the systems)
    const f4 = result.items.find((i) => i.id === 'F4');
    expect(f4.name).toMatch(/Attio/i);
  });

  test('legacy string still works', () => {
    const result = runDiagnostic({ A1: 'HubSpot' }, {}, 'hubspot');
    expect(result.crmType).toBe('hubspot');
    expect(result.crmSystems).toEqual(['hubspot_crm']);
  });

  test('falls back to intake.A1 when crmTypeOrSystems is null', () => {
    const result = runDiagnostic({ A1: ['salesforce'] }, {}, null);
    expect(result.crmType).toBe('salesforce');
    expect(result.crmSystems).toEqual(['salesforce']);
  });

  test('Salesforce + Attio: Platform Health layer included AND F4 is Attio variant', () => {
    const result = runDiagnostic(
      { A1: ['salesforce', 'attio'] },
      {},
      ['salesforce', 'attio']
    );

    expect(result.crmType).toBe('multi');
    // Platform Health items should be present (SF in the mix)
    const phItems = result.items.filter((i) => i.layer === 'platformHealth');
    expect(phItems.length).toBeGreaterThan(0);

    // F4 should still be the Attio variant
    const f4 = result.items.find((i) => i.id === 'F4');
    expect(f4.name).toMatch(/Attio/i);
  });

  test('HubSpot CRM only (no Attio): F4 is the HubSpot workflow grader', () => {
    const result = runDiagnostic({ A1: ['hubspot_crm'] }, {}, ['hubspot_crm']);
    const f4 = result.items.find((i) => i.id === 'F4');
    expect(f4.name).not.toMatch(/Attio/i);
  });
});
