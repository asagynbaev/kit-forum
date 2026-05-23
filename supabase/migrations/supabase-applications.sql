-- ─────────────────────────────────────────
--  KIT Forum — Applications & Registrations
-- ─────────────────────────────────────────
--  Run this in Supabase SQL editor AFTER `supabase-schema.sql`.
--  Tables:
--    · forum_registrations  — заявки с главной (Contacts form)
--    · award_applications   — заявки на KIT Awards
--
--  Both are publicly insertable, but only authenticated
--  admin users may read / update / delete (visible in /admin).

-- ─── Forum registrations ────────────────────
create table if not exists forum_registrations (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null,
  email           text not null,
  phone           text,
  organization    text,
  role            text,
  message         text,
  language        text not null default 'ru'
                    check (language in ('ru','ky','en')),
  status          text not null default 'new'
                    check (status in ('new','contacted','confirmed','rejected','archived')),
  source          text not null default 'contacts'
                    check (source in ('contacts','kit_award','hero','footer','other')),
  user_agent      text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_forum_registrations_created
  on forum_registrations (created_at desc);
create index if not exists idx_forum_registrations_status
  on forum_registrations (status);

-- ─── Award applications ─────────────────────
create table if not exists award_applications (
  id                  uuid primary key default gen_random_uuid(),
  full_name           text not null,
  email               text not null,
  phone               text not null,
  nomination          text not null,
  organization        text,
  project_name        text,
  project_description text,
  website             text,
  socials             text,
  language            text not null default 'ru'
                        check (language in ('ru','ky','en')),
  status              text not null default 'new'
                        check (status in ('new','reviewing','shortlisted','rejected','winner')),
  user_agent          text,
  created_at          timestamptz not null default now()
);

create index if not exists idx_award_applications_created
  on award_applications (created_at desc);
create index if not exists idx_award_applications_status
  on award_applications (status);
create index if not exists idx_award_applications_nomination
  on award_applications (nomination);

-- ─── Row Level Security ─────────────────────
alter table forum_registrations enable row level security;
alter table award_applications  enable row level security;

-- Anyone (anon) may submit a new application/registration
drop policy if exists "public insert forum_registrations" on forum_registrations;
create policy "public insert forum_registrations"
  on forum_registrations for insert
  with check (true);

drop policy if exists "public insert award_applications" on award_applications;
create policy "public insert award_applications"
  on award_applications for insert
  with check (true);

-- Authenticated admins may read / update / delete
drop policy if exists "auth read forum_registrations" on forum_registrations;
create policy "auth read forum_registrations"
  on forum_registrations for select
  using (auth.role() = 'authenticated');

drop policy if exists "auth update forum_registrations" on forum_registrations;
create policy "auth update forum_registrations"
  on forum_registrations for update
  using (auth.role() = 'authenticated');

drop policy if exists "auth delete forum_registrations" on forum_registrations;
create policy "auth delete forum_registrations"
  on forum_registrations for delete
  using (auth.role() = 'authenticated');

drop policy if exists "auth read award_applications" on award_applications;
create policy "auth read award_applications"
  on award_applications for select
  using (auth.role() = 'authenticated');

drop policy if exists "auth update award_applications" on award_applications;
create policy "auth update award_applications"
  on award_applications for update
  using (auth.role() = 'authenticated');

drop policy if exists "auth delete award_applications" on award_applications;
create policy "auth delete award_applications"
  on award_applications for delete
  using (auth.role() = 'authenticated');
