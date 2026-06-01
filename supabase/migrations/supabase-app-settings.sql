-- App-wide feature flags / settings
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.app_settings (
  key        text        PRIMARY KEY,
  value      text        NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read" ON public.app_settings;
DROP POLICY IF EXISTS "auth_all"  ON public.app_settings;

-- Anon users can read settings (to check if registration is open)
CREATE POLICY "anon_read" ON public.app_settings FOR SELECT TO anon         USING (true);
-- Authenticated admins can modify settings
CREATE POLICY "auth_all"  ON public.app_settings FOR ALL    TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.app_settings (key, value) VALUES
  ('award_registration_open',  'true'),
  ('forum_registration_open',  'true')
ON CONFLICT DO NOTHING;
