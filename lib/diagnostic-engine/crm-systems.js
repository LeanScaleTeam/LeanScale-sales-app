/**
 * CRM Systems — single source of truth for multi-CRM identifiers.
 *
 * Stable keys used in:
 *   - customers.crm_systems TEXT[] (DB column)
 *   - A1 intake answer (now an array)
 *   - skip-logic rules
 *   - signal-merger routing
 *   - run.js diagnostic API routing
 *
 * Each system has a "role" — what pillar it's the best source for in the merged
 * signal output:
 *   - crm  : data model, pipelines, owners, deals (F1, F2, F5, M3-M7)
 *   - map  : forms, marketing email, nurture (M1, M2)
 *   - both : the system can serve either role (e.g. HubSpot used as primary CRM)
 */

export const SYSTEM_KEYS = {
  SALESFORCE: 'salesforce',
  HUBSPOT_CRM: 'hubspot_crm',
  HUBSPOT_MAP: 'hubspot_map',
  ATTIO: 'attio',
  OTHER: 'other',
};

export const SYSTEM_LIST = [
  SYSTEM_KEYS.SALESFORCE,
  SYSTEM_KEYS.HUBSPOT_CRM,
  SYSTEM_KEYS.HUBSPOT_MAP,
  SYSTEM_KEYS.ATTIO,
  SYSTEM_KEYS.OTHER,
];

export const SYSTEM_LABELS = {
  [SYSTEM_KEYS.SALESFORCE]: 'Salesforce',
  [SYSTEM_KEYS.HUBSPOT_CRM]: 'HubSpot (CRM)',
  [SYSTEM_KEYS.HUBSPOT_MAP]: 'HubSpot (Marketing Automation)',
  [SYSTEM_KEYS.ATTIO]: 'Attio',
  [SYSTEM_KEYS.OTHER]: 'Other',
};

/**
 * Role assignment by system. Used by the signal merger to decide which system
 * "wins" each pillar when multiple systems are connected.
 */
export const SYSTEM_ROLES = {
  [SYSTEM_KEYS.SALESFORCE]: 'crm',
  [SYSTEM_KEYS.HUBSPOT_CRM]: 'crm',
  [SYSTEM_KEYS.HUBSPOT_MAP]: 'map',
  [SYSTEM_KEYS.ATTIO]: 'crm',
  [SYSTEM_KEYS.OTHER]: null,
};

/**
 * Which systems require API connection (OAuth + metadata download)?
 */
export const CONNECTABLE_SYSTEMS = new Set([
  SYSTEM_KEYS.SALESFORCE,
  SYSTEM_KEYS.HUBSPOT_CRM,
  SYSTEM_KEYS.HUBSPOT_MAP,
  SYSTEM_KEYS.ATTIO,
]);

/**
 * HubSpot CRM and HubSpot MAP share one OAuth connection (one portal grants both).
 * This map deduplicates: returns the connection key for any system.
 */
export const SYSTEM_TO_CONNECTION = {
  [SYSTEM_KEYS.SALESFORCE]: 'salesforce',
  [SYSTEM_KEYS.HUBSPOT_CRM]: 'hubspot',
  [SYSTEM_KEYS.HUBSPOT_MAP]: 'hubspot',
  [SYSTEM_KEYS.ATTIO]: 'attio',
};

/**
 * Coerce a stored value to the canonical crm_systems array. Handles:
 *   - new shape: ['attio', 'hubspot_map']
 *   - legacy A1 string: 'HubSpot' → ['hubspot_crm']
 *   - legacy A1 'Both': → ['salesforce', 'hubspot_map']
 *   - undefined/null: → []
 */
export function normalizeCrmSystems(value) {
  if (Array.isArray(value)) {
    return value.filter((v) => SYSTEM_LIST.includes(v));
  }
  if (typeof value !== 'string' || !value) return [];

  const v = value.toLowerCase().trim();
  if (v === 'hubspot') return [SYSTEM_KEYS.HUBSPOT_CRM];
  if (v === 'salesforce') return [SYSTEM_KEYS.SALESFORCE];
  if (v === 'attio') return [SYSTEM_KEYS.ATTIO];
  if (v === 'both' || v === 'dual') return [SYSTEM_KEYS.SALESFORCE, SYSTEM_KEYS.HUBSPOT_MAP];
  if (v === 'other') return [SYSTEM_KEYS.OTHER];

  // Already a canonical key
  if (SYSTEM_LIST.includes(v)) return [v];

  return [];
}

/**
 * Pick the best system for each role from a crm_systems array.
 * Priority: explicit role match > first system with that role.
 * Returns: { crm: <key|null>, map: <key|null> }
 */
export function selectRoleSystems(crmSystems = []) {
  const systems = normalizeCrmSystems(crmSystems);
  const crmCandidates = systems.filter((s) => SYSTEM_ROLES[s] === 'crm');
  const mapCandidates = systems.filter((s) => SYSTEM_ROLES[s] === 'map');

  // CRM role preference: Salesforce > Attio > HubSpot CRM (richest data model first)
  const crmPriority = [SYSTEM_KEYS.SALESFORCE, SYSTEM_KEYS.ATTIO, SYSTEM_KEYS.HUBSPOT_CRM];
  const crm = crmPriority.find((p) => crmCandidates.includes(p)) || crmCandidates[0] || null;

  // MAP role preference: HubSpot MAP wins (it's the only MAP option for now)
  const map = mapCandidates[0] || null;

  return { crm, map };
}

/**
 * Derive a legacy `crm_type` string from a crm_systems array.
 * Used for back-compat with code/queries that still read crm_type.
 */
export function deriveLegacyCrmType(crmSystems = []) {
  const systems = normalizeCrmSystems(crmSystems);
  if (systems.length === 0) return 'unknown';
  if (systems.length === 1) {
    const s = systems[0];
    if (s === SYSTEM_KEYS.HUBSPOT_CRM || s === SYSTEM_KEYS.HUBSPOT_MAP) return 'hubspot';
    if (s === SYSTEM_KEYS.SALESFORCE) return 'salesforce';
    if (s === SYSTEM_KEYS.ATTIO) return 'attio';
    if (s === SYSTEM_KEYS.OTHER) return 'other';
  }
  // Multiple systems
  const hasSf = systems.includes(SYSTEM_KEYS.SALESFORCE);
  const hasHs = systems.includes(SYSTEM_KEYS.HUBSPOT_CRM) || systems.includes(SYSTEM_KEYS.HUBSPOT_MAP);
  const hasAttio = systems.includes(SYSTEM_KEYS.ATTIO);
  if (hasSf && hasHs && !hasAttio) return 'dual'; // existing SF+HS pattern
  // Any other multi-system combination — use 'multi' as a new legacy bucket
  return 'multi';
}
