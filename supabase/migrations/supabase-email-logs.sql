-- Email delivery log — records every transactional email we attempt to send,
-- together with its delivery status and (on failure) the error text.
-- Run in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.email_logs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  kind        text        NOT NULL,                 -- 'register' | 'award'
  recipient   text        NOT NULL,                 -- destination email
  subject     text        NOT NULL,
  status      text        NOT NULL DEFAULT 'sent',  -- 'sent' | 'failed'
  error       text,                                 -- error message when status = 'failed'
  related_id  uuid,                                 -- forum_registrations.id / award_applications.id
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_logs_created_idx ON public.email_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS email_logs_status_idx  ON public.email_logs (status);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read" ON public.email_logs;
DROP POLICY IF EXISTS "auth_all"  ON public.email_logs;

-- Only authenticated admins may read / manage the log.
-- Inserts from the API run with the service-role key, which bypasses RLS.
CREATE POLICY "auth_read" ON public.email_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_all"  ON public.email_logs FOR ALL    TO authenticated USING (true) WITH CHECK (true);
