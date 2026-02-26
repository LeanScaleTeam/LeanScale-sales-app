-- ============================================
-- Salesforce v3 Signal Expansion
-- Adds columns for new API data sources used by v3 diagnostic engine
-- ============================================

ALTER TABLE salesforce_metadata
  ADD COLUMN IF NOT EXISTS campaigns JSONB,
  ADD COLUMN IF NOT EXISTS installed_packages JSONB,
  ADD COLUMN IF NOT EXISTS territories JSONB,
  ADD COLUMN IF NOT EXISTS forecasting_types JSONB,
  ADD COLUMN IF NOT EXISTS duplicate_rules JSONB,
  ADD COLUMN IF NOT EXISTS report_schedules JSONB,
  ADD COLUMN IF NOT EXISTS email_templates JSONB,
  ADD COLUMN IF NOT EXISTS task_aggregates JSONB,
  ADD COLUMN IF NOT EXISTS event_patterns JSONB,
  ADD COLUMN IF NOT EXISTS content_versions JSONB,
  ADD COLUMN IF NOT EXISTS knowledge_articles JSONB,
  ADD COLUMN IF NOT EXISTS campaign_members_count JSONB,
  ADD COLUMN IF NOT EXISTS list_views JSONB;
