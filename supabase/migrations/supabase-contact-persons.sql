-- ─────────────────────────────────────────
--  KIT Forum — Contact persons (org committee)
-- ─────────────────────────────────────────
--  Run AFTER supabase-schema.sql. Populates the
--  "Связаться с оргкомитетом" rows shown on the
--  Contacts section. Editable from /admin.

create table if not exists contact_persons (
  id           uuid primary key default gen_random_uuid(),
  label        jsonb not null,            -- { ru, ky, en } — section label
  name         jsonb not null,            -- { ru, ky, en } — person / team
  phone        text  not null default '',
  phone_href   text  not null default '',
  emails       text  not null default '', -- single or " · " separated list
  order_index  int   not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists idx_contact_persons_order
  on contact_persons (order_index);

-- ─── Row Level Security ─────────────────────
alter table contact_persons enable row level security;

drop policy if exists "public read contact_persons" on contact_persons;
create policy "public read contact_persons"
  on contact_persons for select using (true);

drop policy if exists "auth write contact_persons" on contact_persons;
create policy "auth write contact_persons"
  on contact_persons for all using (auth.role() = 'authenticated');

-- ─── Seed (current org committee — June 2026) ───
insert into contact_persons (label, name, phone, phone_href, emails, order_index) values
  (
    jsonb_build_object(
      'ru', 'Общая координация',
      'ky', 'Жалпы координация',
      'en', 'General coordination'
    ),
    jsonb_build_object(
      'ru', 'Елена Нечаева',
      'ky', 'Елена Нечаева',
      'en', 'Elena Nechaeva'
    ),
    '+996 550 077 091', 'tel:+996550077091', 'e.nechaeva@htp.kg', 0
  ),
  (
    jsonb_build_object(
      'ru', 'Программа · Спикеры',
      'ky', 'Программа · Спикерлер',
      'en', 'Programme · Speakers'
    ),
    jsonb_build_object(
      'ru', 'Айжана Османалиева',
      'ky', 'Айжана Османалиева',
      'en', 'Aizhana Osmonalieva'
    ),
    '+996 708 686 766', 'tel:+996708686766', 'a.osmonalieva@htp.kg', 1
  ),
  (
    jsonb_build_object(
      'ru', 'EXPO',
      'ky', 'EXPO',
      'en', 'EXPO'
    ),
    jsonb_build_object(
      'ru', 'Чубак Темиров · Адилет Дюшембиев',
      'ky', 'Чубак Темиров · Адилет Дюшембиев',
      'en', 'Chubak Temirov · Adilet Diushembiev'
    ),
    '+996 555 221 146', 'tel:+996555221146',
    'c.temirov@htp.kg · a.diushembiev@htp.kg', 2
  ),
  (
    jsonb_build_object(
      'ru', 'PR · СМИ',
      'ky', 'PR · ЖМК',
      'en', 'PR · Media'
    ),
    jsonb_build_object(
      'ru', 'Айпери',
      'ky', 'Айпери',
      'en', 'Aiperi'
    ),
    '+996 778 444 208', 'tel:+996778444208', 'pr@htp.kg', 3
  ),
  (
    jsonb_build_object(
      'ru', 'Стартапы · Венчур · Университеты',
      'ky', 'Стартаптар · Венчур · Университеттер',
      'en', 'Startups · Venture · Universities'
    ),
    jsonb_build_object(
      'ru', 'Нурзат',
      'ky', 'Нурзат',
      'en', 'Nurzat'
    ),
    '+996 777 092 838', 'tel:+996777092838', 'future.ecosystem@htp.kg', 4
  )
on conflict do nothing;
