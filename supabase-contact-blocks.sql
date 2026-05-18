-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.contact_blocks (
  id           text PRIMARY KEY,  -- 'organizer' | 'venue'
  label        jsonb NOT NULL,    -- { ru, ky, en } — ярлык строки (ОРГАНИЗАТОР / ПЛОЩАДКА)
  title        jsonb NOT NULL,    -- { ru, ky, en } — жирный заголовок
  lines        jsonb NOT NULL DEFAULT '[]', -- [{ ru, ky, en }, ...] — подстроки
  order_index  int  NOT NULL DEFAULT 0
);

INSERT INTO public.contact_blocks (id, label, title, lines, order_index) VALUES
(
  'organizer',
  '{"ru":"Организатор","ky":"Уюштуруучу","en":"Organiser"}',
  '{"ru":"Парк высоких технологий Кыргызской Республики","ky":"Кыргыз Республикасынын Жогорку технологиялар паркы","en":"High Technology Park of the Kyrgyz Republic"}',
  '[{"ru":"Главный организатор КИТ Форума 2026","ky":"КИТ Форум 2026нын башкы уюштуруучусу","en":"Lead organiser of KIT Forum 2026"},{"ru":"htp.kg · г. Бишкек, Кыргызская Республика","ky":"htp.kg · Бишкек ш., Кыргыз Республикасы","en":"htp.kg · Bishkek, Kyrgyz Republic"},{"ru":"Орган управления — Кабинет Министров КР","ky":"Башкаруу органы — КРнын Министрлер Кабинети","en":"Governing body — Cabinet of Ministers of the KR"}]',
  0
),
(
  'venue',
  '{"ru":"Площадка","ky":"Аянтча","en":"Venue"}',
  '{"ru":"Международный Университет Кыргызстана","ky":"Кыргызстан Эл аралык университети","en":"International University of Kyrgyzstan"}',
  '[{"ru":"Центральный кампус МУК","ky":"КЭУнун Борбордук кампусу","en":"IUK Central Campus"},{"ru":"Бишкек, ул. Льва Толстого, 1 (17Б)","ky":"Бишкек, Лев Толстой көчөсү, 1 (17Б)","en":"Bishkek, 1 (17B) Lev Tolstoy Street"}]',
  1
)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.contact_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read"  ON public.contact_blocks FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_all"   ON public.contact_blocks FOR ALL   TO authenticated USING (true) WITH CHECK (true);
