-- ============================================
-- Transcript Filename Migration
-- Adds diagnostic_transcripts.file_name TEXT so the upload UI can display
-- the original document name (e.g. "GTM Engineer Project List.pdf") instead
-- of an opaque "Transcript 1 / 2 / 3" label.
-- ============================================

ALTER TABLE diagnostic_transcripts
  ADD COLUMN IF NOT EXISTS file_name TEXT;

-- No backfill required; pre-existing rows just stay NULL and the UI falls
-- back to the generic "Transcript N" label for them.
