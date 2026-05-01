-- Allow 'vasco' as a customers.crm_type value.
--
-- A Vasco-only customer has a Vasco snapshot (vasco_snapshots) but no
-- Salesforce or HubSpot OAuth connection. The diagnostic engine reads signals
-- from the snapshot via the lib/vasco/signals-adapter, so the customer can
-- complete the diagnostic without connecting a CRM.
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_crm_type_check;
ALTER TABLE customers ADD CONSTRAINT customers_crm_type_check
  CHECK (crm_type IN ('hubspot', 'salesforce', 'dual', 'vasco', 'other', 'unknown'));
