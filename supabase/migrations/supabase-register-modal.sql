-- Migration: registration modal email uniqueness check
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- If you previously ran the old version, drop the full unique constraint first:
-- ALTER TABLE public.forum_registrations DROP CONSTRAINT IF EXISTS forum_registrations_email_unique;

-- 1. Partial unique index — only registrations (source != 'contacts') must be unique by email.
--    Questions (source = 'contacts') can be submitted multiple times from the same email.
CREATE UNIQUE INDEX IF NOT EXISTS forum_registrations_email_reg_unique
  ON public.forum_registrations(email)
  WHERE source <> 'contacts';

-- 2. SECURITY DEFINER function — checks uniqueness only among registrations.
CREATE OR REPLACE FUNCTION public.is_email_registered(p_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.forum_registrations
    WHERE email = lower(trim(p_email))
      AND source <> 'contacts'
  );
END;
$$;

-- Allow anon (unauthenticated) to call the function
GRANT EXECUTE ON FUNCTION public.is_email_registered(text) TO anon;
