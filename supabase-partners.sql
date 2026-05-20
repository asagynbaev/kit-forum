-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.partners (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  logo_url    text        NOT NULL,
  order_index int         NOT NULL DEFAULT 0,
  is_visible  boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Migrate existing static partners
INSERT INTO public.partners (name, logo_url, order_index) VALUES
  ('Международный Университет Кыргызстана',      '/partners/p1.png',  1),
  ('High Technology Park of the Kyrgyz Republic', '/partners/p2.png',  2),
  ('THE TECH',                                    '/partners/p3.png',  3),
  ('Партнёр форума',                              '/partners/p4.png',  4),
  ('Партнёр форума',                              '/partners/p5.png',  5),
  ('Партнёр форума',                              '/partners/p6.png',  6),
  ('Партнёр форума',                              '/partners/p8.png',  7),
  ('Партнёр форума',                              '/partners/p9.png',  8),
  ('Партнёр форума',                              '/partners/p10.png', 9),
  ('Партнёр форума',                              '/partners/p11.png', 10),
  ('Партнёр форума',                              '/partners/p12.png', 11),
  ('Партнёр форума',                              '/partners/p13.png', 12),
  ('Партнёр форума',                              '/partners/p14.png', 13),
  ('Партнёр форума',                              '/partners/p15.png', 14),
  ('Партнёр форума',                              '/partners/p16.png', 15)
ON CONFLICT DO NOTHING;

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read" ON public.partners FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_all"  ON public.partners FOR ALL   TO authenticated USING (true) WITH CHECK (true);
