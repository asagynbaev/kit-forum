-- ─────────────────────────────────────────
--  KIT Forum — RBAC tightening
-- ─────────────────────────────────────────
--  Run this in Supabase SQL editor AFTER all other migrations
--  (schema, applications, contact-persons, storage).
--
--  Что делает:
--    1. Заводит таблицу admin_users — единственный источник истины
--       о том, кто админ. Любой `authenticated` пользователь, которого
--       нет в этой таблице, ничего лишнего сделать не сможет.
--    2. Объявляет stable security-definer функцию public.is_admin().
--    3. Удаляет все старые широкие политики (`auth.role()='authenticated'`)
--       и создаёт строгие через is_admin().
--    4. Бутстрапит первого админа по email из auth.users.
--
--  После прогона можно безопасно включать обратно email-signup —
--  новые юзеры не получат никаких прав без явного добавления в admin_users.

-- ─── 1. Admin registry ──────────────────────
create table if not exists admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;

-- ─── 2. is_admin() helper ───────────────────
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists(
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

-- (anon тоже может позвать — вернётся false, утечки нет)
grant execute on function public.is_admin() to anon, authenticated;

-- ─── 3. RLS on admin_users itself ───────────
drop policy if exists "admins read admin_users"   on admin_users;
drop policy if exists "admins write admin_users"  on admin_users;

create policy "admins read admin_users"
  on admin_users for select using (public.is_admin());

create policy "admins write admin_users"
  on admin_users for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─── 4. Tighten policies on content tables ──
-- speakers
drop policy if exists "auth write speakers" on speakers;
create policy "admin write speakers"
  on speakers for all
  using (public.is_admin())
  with check (public.is_admin());

-- program_sessions
drop policy if exists "auth write sessions" on program_sessions;
create policy "admin write sessions"
  on program_sessions for all
  using (public.is_admin())
  with check (public.is_admin());

-- session_speakers
drop policy if exists "auth write session_speakers" on session_speakers;
create policy "admin write session_speakers"
  on session_speakers for all
  using (public.is_admin())
  with check (public.is_admin());

-- social_links
drop policy if exists "auth write social_links" on social_links;
create policy "admin write social_links"
  on social_links for all
  using (public.is_admin())
  with check (public.is_admin());

-- contact_persons
drop policy if exists "auth write contact_persons" on contact_persons;
create policy "admin write contact_persons"
  on contact_persons for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─── 5. Applications & registrations ────────
-- Сохраняем публичный INSERT (форма заявки),
-- но SELECT/UPDATE/DELETE — только для админа.

-- forum_registrations
drop policy if exists "auth read forum_registrations"   on forum_registrations;
drop policy if exists "auth update forum_registrations" on forum_registrations;
drop policy if exists "auth delete forum_registrations" on forum_registrations;

create policy "admin read forum_registrations"
  on forum_registrations for select using (public.is_admin());

create policy "admin update forum_registrations"
  on forum_registrations for update
  using (public.is_admin()) with check (public.is_admin());

create policy "admin delete forum_registrations"
  on forum_registrations for delete using (public.is_admin());

-- award_applications
drop policy if exists "auth read award_applications"   on award_applications;
drop policy if exists "auth update award_applications" on award_applications;
drop policy if exists "auth delete award_applications" on award_applications;

create policy "admin read award_applications"
  on award_applications for select using (public.is_admin());

create policy "admin update award_applications"
  on award_applications for update
  using (public.is_admin()) with check (public.is_admin());

create policy "admin delete award_applications"
  on award_applications for delete using (public.is_admin());

-- ─── 6. Storage: speaker-photos bucket ──────
-- public SELECT остаётся (картинки публичные),
-- но загрузка/перезапись/удаление — только админ.

drop policy if exists "auth insert speaker-photos" on storage.objects;
drop policy if exists "auth update speaker-photos" on storage.objects;
drop policy if exists "auth delete speaker-photos" on storage.objects;

create policy "admin insert speaker-photos"
  on storage.objects for insert
  with check (
    bucket_id = 'speaker-photos'
    and public.is_admin()
  );

create policy "admin update speaker-photos"
  on storage.objects for update
  using (
    bucket_id = 'speaker-photos'
    and public.is_admin()
  );

create policy "admin delete speaker-photos"
  on storage.objects for delete
  using (
    bucket_id = 'speaker-photos'
    and public.is_admin()
  );

-- ─── 7. Bootstrap первого админа ────────────
-- Если у тебя несколько админских аккаунтов — добавь их сюда тоже.
insert into admin_users (user_id)
select id from auth.users where email = 'sagynbaev6@gmail.com'
on conflict (user_id) do nothing;

-- Проверка: должна вернуться хотя бы одна строка с твоим email.
-- select au.user_id, u.email
--   from admin_users au
--   join auth.users u on u.id = au.user_id;
