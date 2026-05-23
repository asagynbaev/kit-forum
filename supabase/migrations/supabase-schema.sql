-- ─────────────────────────────────────────
--  KIT Forum — Supabase schema
-- ─────────────────────────────────────────

-- Speakers
create table if not exists speakers (
  id           uuid primary key default gen_random_uuid(),
  name         jsonb not null,   -- { ru, ky, en }
  role         jsonb not null,
  topic        jsonb,
  country      jsonb not null,
  country_flag text not null default '',
  photo        text,             -- URL or /speakers/filename.webp
  order_index  int  not null default 0,
  created_at   timestamptz default now()
);

-- Program sessions
create table if not exists program_sessions (
  id            uuid primary key default gen_random_uuid(),
  title         jsonb not null,
  description   jsonb,
  session_type  text not null default 'talk'
                  check (session_type in ('talk','panel','workshop','break','opening','closing')),
  track         text,
  starts_at     timestamptz,
  duration_min  int,
  room          jsonb,
  order_index   int not null default 0,
  created_at    timestamptz default now()
);

-- Many-to-many: sessions ↔ speakers
create table if not exists session_speakers (
  session_id  uuid references program_sessions(id) on delete cascade,
  speaker_id  uuid references speakers(id)         on delete cascade,
  primary key (session_id, speaker_id)
);

-- Social links
create table if not exists social_links (
  id          uuid primary key default gen_random_uuid(),
  platform    text not null,   -- 'telegram', 'instagram', etc.
  label       text not null,
  url         text not null,
  icon        text,            -- lucide icon name or svg string
  order_index int  not null default 0,
  created_at  timestamptz default now()
);

-- Seed default social links
insert into social_links (platform, label, url, order_index) values
  ('telegram',  'Telegram',  'https://t.me/kitforum',                    0),
  ('facebook',  'Facebook',  'https://facebook.com/kitforum',            1),
  ('instagram', 'Instagram', 'https://instagram.com/kitforum',           2),
  ('linkedin',  'LinkedIn',  'https://linkedin.com/company/kitforum',    3),
  ('youtube',   'YouTube',   'https://youtube.com/@kitforum',            4);

-- ─── Row Level Security ───────────────────
alter table speakers          enable row level security;
alter table program_sessions  enable row level security;
alter table session_speakers  enable row level security;
alter table social_links      enable row level security;

-- Public read (for the site)
create policy "public read speakers"
  on speakers for select using (true);

create policy "public read sessions"
  on program_sessions for select using (true);

create policy "public read session_speakers"
  on session_speakers for select using (true);

create policy "public read social_links"
  on social_links for select using (true);

-- Authenticated write (admin panel)
create policy "auth write speakers"
  on speakers for all using (auth.role() = 'authenticated');

create policy "auth write sessions"
  on program_sessions for all using (auth.role() = 'authenticated');

create policy "auth write session_speakers"
  on session_speakers for all using (auth.role() = 'authenticated');

create policy "auth write social_links"
  on social_links for all using (auth.role() = 'authenticated');
