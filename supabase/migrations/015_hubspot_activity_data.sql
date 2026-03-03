-- Add expanded HubSpot activity, schema, campaign, and goal data columns
ALTER TABLE hubspot_metadata
  ADD COLUMN IF NOT EXISTS tasks JSONB,
  ADD COLUMN IF NOT EXISTS meetings JSONB,
  ADD COLUMN IF NOT EXISTS calls JSONB,
  ADD COLUMN IF NOT EXISTS custom_object_schemas JSONB,
  ADD COLUMN IF NOT EXISTS campaigns JSONB,
  ADD COLUMN IF NOT EXISTS goals JSONB;
