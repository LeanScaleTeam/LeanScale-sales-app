-- Add expanded HubSpot data columns for A3 (ARR) and A4 (GTM motion) inference
ALTER TABLE hubspot_metadata
  ADD COLUMN IF NOT EXISTS deal_aggregates JSONB,
  ADD COLUMN IF NOT EXISTS contact_sources JSONB;
