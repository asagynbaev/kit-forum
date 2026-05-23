-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.press_releases (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  date_label   text        NOT NULL,
  tag          text        NOT NULL DEFAULT 'announcement',
  title        jsonb       NOT NULL,
  lead         jsonb       NOT NULL,
  body         jsonb,
  order_index  int         NOT NULL DEFAULT 0,
  is_visible   boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS press_releases_order_idx
  ON public.press_releases (order_index DESC, created_at DESC);

ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read" ON public.press_releases;
DROP POLICY IF EXISTS "auth_read" ON public.press_releases;
DROP POLICY IF EXISTS "auth_all"  ON public.press_releases;

CREATE POLICY "anon_read" ON public.press_releases FOR SELECT TO anon         USING (is_visible = true);
CREATE POLICY "auth_read" ON public.press_releases FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_all"  ON public.press_releases FOR ALL    TO authenticated USING (true) WITH CHECK (true);

-- If a previous version of this migration was applied, drop the accreditation
-- entry — there is no media accreditation for KIT Forum 2026.
DELETE FROM public.press_releases
WHERE title->>'ru' = 'Открыта аккредитация СМИ на КИТ Форум 2026';

-- Seed with the existing static releases
INSERT INTO public.press_releases (date_label, tag, title, lead, order_index) VALUES
  (
    '10.03.2026',
    'partners',
    '{"ru":"Стратегические партнёры КИТ Форума 2026 подтверждены","ky":"КИТ Форум 2026нын стратегиялык өнөктөштөрү ырасталды","en":"Strategic partners of KIT Forum 2026 confirmed"}'::jsonb,
    '{"ru":"Оргкомитет КИТ Форума 2026 объявляет о подтверждении ключевых партнёров мероприятия. В числе генеральных партнёров — ведущие технологические компании региона, национальные институты развития и международные финансовые организации. Полный список партнёров и детали взаимодействия будут раскрыты на открытии форума 4 июня 2026 года.","ky":"КИТ Форум 2026нын уюштуруу комитети чарадынын негизги өнөктөштөрүнүн ырасталгандыгын жарыялайт. Башкы өнөктөштөрдүн арасында — региондун алдыңкы технологиялык компаниялары, улуттук өнүктүрүү институттары жана эл аралык каржы уюмдары. Өнөктөштөрдүн толук тизмеси жана өз ара аракеттешүүнүн чоо-жайы 2026-жылдын 4-июнунда форумдун ачылышында жарыяланат.","en":"The organising committee of KIT Forum 2026 announces the confirmation of the event''s key partners. General partners include leading technology companies of the region, national development institutions, and international financial organisations. The full partner list and partnership details will be disclosed at the forum opening on 4 June 2026."}'::jsonb,
    40
  ),
  (
    '20.02.2026',
    'program',
    '{"ru":"Программа КИТ Форума 2026: фокус на ИИ, суверенитете данных и кибербезопасности","ky":"КИТ Форум 2026нын программасы: ЖИ, маалыматтардын эгемендиги жана киберкоопсуздукка басым","en":"KIT Forum 2026 programme: focus on AI, data sovereignty, and cybersecurity"}'::jsonb,
    '{"ru":"Оргкомитет представил концептуальную структуру программы форума. Два дня работы будут организованы вокруг пяти тематических треков: искусственный интеллект и автоматизация, цифровое государство, стартапы и венчурный рынок, цифровое образование, а также кибербезопасность критической инфраструктуры. Пленарную сессию первого дня откроет официальное обращение Правительства Кыргызской Республики.","ky":"Уюштуруу комитети форумдун программасынын концептуалдык структурасын тааныштырды. Эки күндүк иш беш тематикалык багыттын айланасында уюштурулат: жасалма интеллект жана автоматташтыруу, санариптик мамлекет, стартаптар жана венчур рыногу, санариптик билим берүү, ошондой эле критикалык инфраструктуранын киберкоопсуздугу. Биринчи күндүн пленардык сессиясын Кыргыз Республикасынын Өкмөтүнүн расмий кайрылуусу ачат.","en":"The organising committee has presented the conceptual structure of the forum programme. Two days of sessions will be organised around five thematic tracks: artificial intelligence and automation, the digital state, startups and venture market, digital education, and cybersecurity of critical infrastructure. The plenary session of the first day will be opened by an official address from the Government of the Kyrgyz Republic."}'::jsonb,
    30
  ),
  (
    '01.02.2026',
    'speakers',
    '{"ru":"Первые подтверждённые спикеры КИТ Форума 2026 объявлены","ky":"КИТ Форум 2026нын биринчи ырасталган спикерлери жарыяланды","en":"First confirmed speakers of KIT Forum 2026 announced"}'::jsonb,
    '{"ru":"Парк высоких технологий КР объявляет о первых подтверждённых участниках деловой программы. В состав спикеров вошли руководители ключевых министерств и ведомств Кыргызской Республики, главы крупнейших ИТ-компаний Центральной Азии, представители ЕБРР, ВБ и ЮНКТАД, а также признанные эксперты в области ИИ и цифровых финансов. Полный список формируется и обновляется еженедельно.","ky":"КР Жогорку технологиялар паркы иш программасынын биринчи ырасталган катышуучуларын жарыялайт. Спикерлердин арасында Кыргыз Республикасынын негизги министрликтери менен ведомстволорунун жетекчилери, Борбордук Азиянын эң ири ИТ компанияларынын башчылары, ЭБРР, ДБ жана ЮНКТАДдын өкүлдөрү, ошондой эле ЖИ жана санариптик финансы чөйрөсүндөгү таанылган эксперттер кирет. Толук тизме жасалып, апта сайын жаңыртылуудa.","en":"The High Technology Park of the KR announces the first confirmed participants of the business programme. The speaker line-up includes heads of key ministries and agencies of the Kyrgyz Republic, chiefs of the largest IT companies in Central Asia, representatives of the EBRD, World Bank, and UNCTAD, as well as recognised experts in AI and digital finance. The full list is being compiled and updated weekly."}'::jsonb,
    20
  ),
  (
    '15.01.2026',
    'announcement',
    '{"ru":"КИТ Форум 2026 объявлен: 4–5 июня, МУК, Бишкек","ky":"КИТ Форум 2026 жарыяланды: 4–5-июнь, КЭУ, Бишкек","en":"KIT Forum 2026 announced: 4–5 June, IUK, Bishkek"}'::jsonb,
    '{"ru":"Парк высоких технологий Кыргызской Республики объявляет о проведении ежегодного КИТ Форума. В 2026 году флагманское событие цифровой отрасли страны пройдёт 4–5 июня на базе Международного Университета Кыргызстана. Ожидается более 2 500 участников из 25 стран — представителей государственных органов, технологического бизнеса, академической среды и международных организаций.","ky":"Кыргыз Республикасынын Жогорку технологиялар паркы жыл сайын өткөрүлгөн КИТ Форумунун өтөрүн жарыялайт. 2026-жылы өлкөнүн санариптик тармагынын флагмандык окуясы 4–5-июнда Кыргызстан Эл аралык университетинде өтөт. 25 өлкөдөн 2 500дөн ашуун катышуучу — мамлекеттик органдардын, технологиялык бизнестин, академиялык чөйрөнүн жана эл аралык уюмдардын өкүлдөрү — күтүлүүдө.","en":"The High Technology Park of the Kyrgyz Republic announces the upcoming annual KIT Forum. In 2026, the country''s flagship digital-industry event will take place on 4–5 June at the International University of Kyrgyzstan. More than 2,500 participants from 25 countries are expected — representatives of government bodies, the technology sector, academia, and international organisations."}'::jsonb,
    10
  )
ON CONFLICT DO NOTHING;
