-- Migration: registration modal email uniqueness check
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- 1. Unique constraint on email so duplicates are rejected at DB level
ALTER TABLE public.forum_registrations
  ADD CONSTRAINT forum_registrations_email_unique UNIQUE (email);

-- 2. SECURITY DEFINER function so anon can check email existence without
--    needing SELECT on the table (RLS still blocks direct reads).
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
  );
END;
$$;

-- Allow anon (unauthenticated) to call the function
GRANT EXECUTE ON FUNCTION public.is_email_registered(text) TO anon;
