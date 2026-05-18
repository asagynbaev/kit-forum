-- Migration: nomination-specific questionnaire for award_applications
-- Run in Supabase SQL Editor
-- If you already ran the previous version, the DROP IF EXISTS handles cleanup.

ALTER TABLE public.award_applications
  DROP COLUMN IF EXISTS ai_tools,
  DROP COLUMN IF EXISTS results_achieved,
  DROP COLUMN IF EXISTS processes_automated,
  DROP COLUMN IF EXISTS business_metrics,
  ADD COLUMN IF NOT EXISTS questionnaire jsonb DEFAULT '{}'::jsonb;
