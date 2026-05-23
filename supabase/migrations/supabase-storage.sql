-- ─────────────────────────────────────────
--  KIT Forum — Storage buckets & policies
-- ─────────────────────────────────────────
--  Run this in Supabase SQL editor.
--  Buckets:
--    · speaker-photos — фото спикеров (admin panel загружает,
--                        сайт читает публично)

-- ─── Bucket: speaker-photos ─────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'speaker-photos',
  'speaker-photos',
  true,
  8388608, -- 8 MB
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ─── Policies for speaker-photos ────────────
-- Public read (so <img src=…> works on the live site)
drop policy if exists "public read speaker-photos" on storage.objects;
create policy "public read speaker-photos"
  on storage.objects for select
  using (bucket_id = 'speaker-photos');

-- Authenticated admins may upload, overwrite, delete
drop policy if exists "auth insert speaker-photos" on storage.objects;
create policy "auth insert speaker-photos"
  on storage.objects for insert
  with check (
    bucket_id = 'speaker-photos'
    and auth.role() = 'authenticated'
  );

drop policy if exists "auth update speaker-photos" on storage.objects;
create policy "auth update speaker-photos"
  on storage.objects for update
  using (
    bucket_id = 'speaker-photos'
    and auth.role() = 'authenticated'
  );

drop policy if exists "auth delete speaker-photos" on storage.objects;
create policy "auth delete speaker-photos"
  on storage.objects for delete
  using (
    bucket_id = 'speaker-photos'
    and auth.role() = 'authenticated'
  );
