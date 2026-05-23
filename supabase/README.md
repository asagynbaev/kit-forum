# Supabase — развёртывание базы данных

## Порядок применения миграций

Файлы нужно выполнять **строго в указанном порядке** через SQL Editor в [Supabase Dashboard](https://supabase.com/dashboard).

| # | Файл | Что создаёт |
|---|------|-------------|
| 1 | `migrations/supabase-schema.sql` | Все основные таблицы: `speakers`, `program_sessions`, `session_speakers`, `forum_registrations`, `award_applications`, `social_links` |
| 2 | `migrations/supabase-rbac.sql` | RLS политики, роли, защита таблиц |
| 3 | `migrations/supabase-storage.sql` | Storage bucket для фото спикеров и партнёров |
| 4 | `migrations/supabase-contact-blocks.sql` | Таблица `contact_blocks` |
| 5 | `migrations/supabase-contact-persons.sql` | Таблица `contact_persons` |
| 6 | `migrations/supabase-partners.sql` | Таблица `partners` |
| 7 | `migrations/supabase-speakers-country.sql` | Добавляет поля страны к спикерам |
| 8 | `migrations/supabase-register-modal.sql` | Настройки модалки регистрации |
| 9 | `migrations/supabase-awards-questionnaire.sql` | Поля анкеты для КИТ Премии |
| 10 | `migrations/supabase-applications.sql` | Таблица `award_applications` |
| 11 | `migrations/supabase-seed.sql` | Начальные данные (опционально) |

## Быстрый старт — новый проект

1. Создать новый проект на [supabase.com](https://supabase.com)
2. Перейти в **SQL Editor** → **New query**
3. Выполнить файлы по порядку из таблицы выше
4. Скопировать **Project URL** и **anon key** из **Settings → API**
5. Записать в `.env`:
   ```
   VITE_SUPABASE_URL=https://<project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key>
   ```

## Экспорт актуальной схемы

Чтобы получить свежую схему из работающего проекта:

```
Supabase Dashboard → Settings → Database → Database backups
```

или через Supabase CLI:

```bash
npx supabase db dump --db-url "postgresql://postgres:<password>@db.<project-id>.supabase.co:5432/postgres"
```
