-- ─────────────────────────────────────────
--  KIT Forum — Seed data
--  Run AFTER supabase-schema.sql
-- ─────────────────────────────────────────

-- Fix session_type constraint to match app types
ALTER TABLE program_sessions
  DROP CONSTRAINT IF EXISTS program_sessions_session_type_check;
ALTER TABLE program_sessions
  ADD CONSTRAINT program_sessions_session_type_check
  CHECK (session_type IN ('keynote','panel','workshop','break','networking','ceremony'));

-- Add speakers display text column
ALTER TABLE program_sessions
  ADD COLUMN IF NOT EXISTS speakers_label jsonb;

-- ── SPEAKERS ──────────────────────────────
INSERT INTO speakers (name, role, topic, country, country_flag, photo, order_index) VALUES
(
  $j${"ru":"Тилек Мамутов","ky":"Тилек Мамутов","en":"Tilek Mamutov"}$j$::jsonb,
  $j${"ru":"Первый кыргызстанец в Google · Основатель Outtalent","ky":"Google'дагы биринчи кыргызстандык · Outtalent компаниясынын негиздөөчүсү","en":"The first Kyrgyz citizen at Google · Founder of Outtalent"}$j$::jsonb,
  $j${"ru":"Глобальный талант из Центральной Азии: как пробиться в Bigtech","ky":"Борбордук Азиядан глобалдык талант: Big Tech компанияларына кантип жетүү керек","en":"Global talent from Central Asia: breaking into Big Tech"}$j$::jsonb,
  $j${"ru":"Кыргызстан","ky":"Кыргызстан","en":"Kyrgyzstan"}$j$::jsonb,
  '🇰🇬', '/speakers/tilek-mamutov.webp', 0
),
(
  $j${"ru":"Максим Прохоров","ky":"Максим Прохоров","en":"Maksim Prokhorov"}$j$::jsonb,
  $j${"ru":"Сооснователь и CEO PLATMA","ky":"PLATMAнын тең негиздөөчүсү жана башкы директору","en":"Co-founder and CEO of PLATMA"}$j$::jsonb,
  $j${"ru":"Платформы как операционная среда нового поколения бизнеса","ky":"Платформалар — жаңы муундагы бизнестин операциялык чөйрөсү","en":"Platforms as the operating environment of the next-generation business"}$j$::jsonb,
  $j${"ru":"Кыргызстан","ky":"Кыргызстан","en":"Kyrgyzstan"}$j$::jsonb,
  '🇰🇬', '/speakers/maksim-prokhorov.webp', 1
),
(
  $j${"ru":"Такэру Кавашима","ky":"Такэру Кавашима","en":"Takeru Kawashima"}$j$::jsonb,
  $j${"ru":"Исполнительный директор · 01Booster Inc.","ky":"Аткаруучу директор · 01Booster Inc.","en":"Executive Director · 01Booster Inc."}$j$::jsonb,
  $j${"ru":"Корпоративные инновации: японская модель работы со стартапами","ky":"Корпоративдик инновациялар: стартаптар менен иштөөнүн жапон модели","en":"Corporate innovation: the Japanese model of working with start-ups"}$j$::jsonb,
  $j${"ru":"Япония","ky":"Япония","en":"Japan"}$j$::jsonb,
  '🇯🇵', '/speakers/takeru-kawashima.webp', 2
),
(
  $j${"ru":"Авигайль Менаше","ky":"Авигайль Менаше","en":"Avigayil Menashe"}$j$::jsonb,
  $j${"ru":"Основатель STEM Consulting","ky":"STEM Consultingтин негиздөөчүсү","en":"Founder of STEM Consulting"}$j$::jsonb,
  $j${"ru":"Технологические экосистемы Центральной Азии и международное сотрудничество","ky":"Борбордук Азиянын технологиялык экосистемалары жана эл аралык кызматташуу","en":"Central Asia's technology ecosystems and international cooperation"}$j$::jsonb,
  $j${"ru":"Израиль","ky":"Израиль","en":"Israel"}$j$::jsonb,
  '🇮🇱', '/speakers/avigayil-menashe.webp', 3
),
(
  $j${"ru":"Улан Абдуразаков","ky":"Улан Абдуразаков","en":"Ulan Abdurazakov"}$j$::jsonb,
  $j${"ru":"CEO Nineninesixai.ai","ky":"Nineninesixai.aiнин башкы директору","en":"CEO of Nineninesixai.ai"}$j$::jsonb,
  $j${"ru":"Самый быстрый голосовой realtime AI: архитектура и применения","ky":"Эң тез үн менен иштеген realtime AI: архитектурасы жана колдонулушу","en":"The fastest voice realtime AI: architecture and applications"}$j$::jsonb,
  $j${"ru":"Кыргызстан","ky":"Кыргызстан","en":"Kyrgyzstan"}$j$::jsonb,
  '🇰🇬', '/speakers/ulan-abdurazakov.webp', 4
),
(
  $j${"ru":"Кенни Джонсон","ky":"Кенни Джонсон","en":"Kenny Johnson"}$j$::jsonb,
  $j${"ru":"Основатель DreamLine Holdings · Инвестор","ky":"DreamLine Holdingsтин негиздөөчүсү · Инвестор","en":"Founder of DreamLine Holdings · Investor"}$j$::jsonb,
  $j${"ru":"Венчурный взгляд на эмерджентные рынки СНГ и Центральной Азии","ky":"КМШ жана Борбордук Азиянын өсүп жаткан рынокторуна венчурдук көз караш","en":"A venture view on the emerging markets of the CIS and Central Asia"}$j$::jsonb,
  $j${"ru":"США","ky":"АКШ","en":"USA"}$j$::jsonb,
  '🇺🇸', '/speakers/kenny-johnson.webp', 5
),
(
  $j${"ru":"Такуя Номура","ky":"Такуя Номура","en":"Takuya Nomura"}$j$::jsonb,
  $j${"ru":"Генеральный продюсер Knowledge Capital Association · VS. Joint Partnership","ky":"Knowledge Capital Associationдын башкы продюсери · VS. Joint Partnership","en":"General Producer at Knowledge Capital Association · VS. Joint Partnership"}$j$::jsonb,
  $j${"ru":"Города знаний: как переустроить общественные пространства под науку","ky":"Билим шаарлары: коомдук мейкиндиктерди илим үчүн кантип кайра түзүш керек","en":"Cities of knowledge: rebuilding public spaces around science"}$j$::jsonb,
  $j${"ru":"Япония","ky":"Япония","en":"Japan"}$j$::jsonb,
  '🇯🇵', '/speakers/takuya-nomura.webp', 6
),
(
  $j${"ru":"Кайнар Камалов","ky":"Кайнар Камалов","en":"Kainar Kamalov"}$j$::jsonb,
  $j${"ru":"Руководитель отдела продуктов · CloudX","ky":"Продуктулар бөлүмүнүн жетекчиси · CloudX","en":"Head of Product · CloudX"}$j$::jsonb,
  $j${"ru":"Облачные инфраструктуры для государственных задач Центральной Азии","ky":"Борбордук Азиянын мамлекеттик милдеттери үчүн булут инфраструктуралары","en":"Cloud infrastructure for Central Asia's public-sector workloads"}$j$::jsonb,
  $j${"ru":"Кыргызстан","ky":"Кыргызстан","en":"Kyrgyzstan"}$j$::jsonb,
  '🇰🇬', '/speakers/kainar-kamalov.webp', 7
),
(
  $j${"ru":"Азамат Буржуев","ky":"Азамат Буржуев","en":"Azamat Burzhuev"}$j$::jsonb,
  $j${"ru":"Эксперт в сфере GovTech · Цифровая трансформация","ky":"GovTech жаатындагы эксперт · Санариптик трансформация","en":"GovTech expert · Digital transformation"}$j$::jsonb,
  $j${"ru":"Цифровизация государственных услуг Кыргызстана: следующие 100 сервисов","ky":"Кыргызстандын мамлекеттик кызматтарын санариптештирүү: кийинки 100 кызмат","en":"Digitalising Kyrgyzstan's public services: the next 100 services"}$j$::jsonb,
  $j${"ru":"Кыргызстан","ky":"Кыргызстан","en":"Kyrgyzstan"}$j$::jsonb,
  '🇰🇬', '/speakers/azamat-burzhuev.webp', 8
),
(
  $j${"ru":"Эми Пэк","ky":"Эми Пэк","en":"Amy Peck"}$j$::jsonb,
  $j${"ru":"Основатель и генеральный директор EndeavorXR","ky":"EndeavorXRдын негиздөөчүсү жана башкы директору","en":"Founder and CEO of EndeavorXR"}$j$::jsonb,
  $j${"ru":"XR и иммерсивные технологии для государственного и образовательного секторов","ky":"Мамлекеттик жана билим берүү сектору үчүн XR жана иммерсивдик технологиялар","en":"XR and immersive technology for the public and education sectors"}$j$::jsonb,
  $j${"ru":"США","ky":"АКШ","en":"USA"}$j$::jsonb,
  '🇺🇸', '/speakers/amy-peck.webp', 9
),
(
  $j${"ru":"Айжан Алишерова-Дуймаз","ky":"Айжан Алишерова-Дуймаз","en":"Aizhan Alisherova-Duymaz"}$j$::jsonb,
  $j${"ru":"Сооснователь Startup Lab 119 · Директор WeFund","ky":"Startup Lab 119дун тең негиздөөчүсү · WeFundдун директору","en":"Co-founder of Startup Lab 119 · Director of WeFund"}$j$::jsonb,
  $j${"ru":"Женское предпринимательство и фонды Кыргызстана: следующий цикл","ky":"Аялдардын ишкердиги жана Кыргызстандын фонддору: кийинки цикл","en":"Women's entrepreneurship and Kyrgyzstan's funds: the next cycle"}$j$::jsonb,
  $j${"ru":"Кыргызстан","ky":"Кыргызстан","en":"Kyrgyzstan"}$j$::jsonb,
  '🇰🇬', '/speakers/aizhan-alisherova.webp', 10
),
(
  $j${"ru":"Таалай Джумабаев","ky":"Таалай Жумабаев","en":"Taalay Djumabaev"}$j$::jsonb,
  $j${"ru":"Основатель и генеральный директор Growthhungry","ky":"Growthhungryнин негиздөөчүсү жана башкы директору","en":"Founder and CEO of Growthhungry"}$j$::jsonb,
  $j${"ru":"Образовательный путь предпринимателя: как строится Growthhungry","ky":"Ишкердин билим алуу жолу: Growthhungry кантип курулууда","en":"The entrepreneur's learning path: how Growthhungry is being built"}$j$::jsonb,
  $j${"ru":"Кыргызстан","ky":"Кыргызстан","en":"Kyrgyzstan"}$j$::jsonb,
  '🇰🇬', '/speakers/taalay-djumabaev.webp', 11
);

-- ── PROGRAM SESSIONS ──────────────────────
-- Bishkek is UTC+6, all starts_at stored in UTC
-- DAY 1 — 2026-06-04

INSERT INTO program_sessions (title, description, speakers_label, session_type, track, starts_at, duration_min, room, order_index) VALUES
(
  $j${"ru":"Церемония открытия","ky":"Ачылыш аземи","en":"Opening ceremony"}$j$::jsonb,
  $j${"ru":"Открывающее слово от руководства Парка высоких технологий, министерств КР и приглашённых делегаций. Демонстрация ключевых цифровых инициатив 2026 года.","ky":"Жогорку технологиялар паркынын жетекчилигинин, КРнын министрликтеринин жана чакырылган делегациялардын ачылыш сөзү. 2026-жылдын негизги санариптик демилгелеринин көрсөтүлүшү.","en":"Opening remarks from the leadership of the High Technology Park, ministries of the Kyrgyz Republic, and invited delegations. A showcase of the key digital initiatives of 2026."}$j$::jsonb,
  $j${"ru":"Алтынбек Эшеналиев · Саруу Сариева","ky":"Алтынбек Эшеналиев · Саруу Сариева","en":"Altynbek Eshenaliev · Saruu Sarieva"}$j$::jsonb,
  'ceremony', 'general', '2026-06-04T03:30:00Z', 45,
  $j${"ru":"Главный зал","ky":"Башкы зал","en":"Main Hall"}$j$::jsonb,
  0
),
(
  $j${"ru":"Цифровая трансформация Кыргызстана: горизонт 2030","ky":"Кыргызстандын санариптик трансформациясы: 2030-горизонт","en":"Kyrgyzstan's digital transformation: the 2030 horizon"}$j$::jsonb,
  $j${"ru":"Видение национальной цифровой стратегии — приоритеты, ключевые проекты, целевые показатели. Каким будет цифровое государство через пять лет.","ky":"Улуттук санариптик стратегиянын көрүнүшү — артыкчылыктар, негизги долбоорлор, максаттуу көрсөткүчтөр. Беш жылдан кийинки санариптик мамлекет.","en":"A vision for the national digital strategy — priorities, flagship projects, and targets. What the digital state will look like in five years."}$j$::jsonb,
  $j${"ru":"Саруу Сариева, Министр цифрового развития КР","ky":"Саруу Сариева, КРнын Санариптик өнүгүү министри","en":"Saruu Sarieva, Minister of Digital Development of the KR"}$j$::jsonb,
  'keynote', 'gov', '2026-06-04T04:15:00Z', 45,
  $j${"ru":"Главный зал","ky":"Башкы зал","en":"Main Hall"}$j$::jsonb,
  1
),
(
  $j${"ru":"Искусственный интеллект в государственном управлении","ky":"Жасалма интеллект мамлекеттик башкарууда","en":"Artificial intelligence in public administration"}$j$::jsonb,
  $j${"ru":"Реальные кейсы внедрения ИИ в госсервисы региона. Этика, регулирование, кадры. Где ИИ уже работает, а где — пока эксперимент.","ky":"Региондогу мамлекеттик кызматтарга ИИди киргизүүнүн чыныгы кейстери. Этика, жөнгө салуу, кадрлар.","en":"Real-world cases of deploying AI in the region's public services. Ethics, regulation, talent. Where AI already works, and where it is still an experiment."}$j$::jsonb,
  $j${"ru":"Amélie Laurent · OECD · Kenji Tanaka · NTT Data · Азамат Сыдыков · Akıl AI","ky":"Amélie Laurent · ЭкӨУ · Kenji Tanaka · NTT Data · Азамат Сыдыков · Akıl AI","en":"Amélie Laurent · OECD · Kenji Tanaka · NTT Data · Azamat Sydykov · Akıl AI"}$j$::jsonb,
  'panel', 'ai', '2026-06-04T05:15:00Z', 75,
  $j${"ru":"Главный зал","ky":"Башкы зал","en":"Main Hall"}$j$::jsonb,
  2
),
(
  $j${"ru":"Кофе-брейк","ky":"Кофе-тыныгуу","en":"Coffee break"}$j$::jsonb,
  null, null,
  'break', 'general', '2026-06-04T06:30:00Z', 30, null, 3
),
(
  $j${"ru":"Стартап-экосистема Центральной Азии: новый цикл","ky":"Борбордук Азиянын стартап-экосистемасы: жаңы цикл","en":"Central Asia's start-up ecosystem: a new cycle"}$j$::jsonb,
  $j${"ru":"Венчурный капитал, господдержка, региональные хабы. Что мешает региональным стартапам выходить на глобальный рынок и как это меняется.","ky":"Венчурдук капитал, мамлекеттик колдоо, регионалдык хабдар. Региондук стартаптарга глобалдык рынокко чыгууга эмнелер тоскоолдук кылат жана бул кантип өзгөрүп жатат.","en":"Venture capital, state support, regional hubs. What holds regional start-ups back from the global market — and what is shifting."}$j$::jsonb,
  $j${"ru":"Раиса Токторбаева · Bishkek Ventures · Даурен Кабиев · Astana Hub · Рустам Азизов · IT Park Tashkent","ky":"Раиса Токторбаева · Bishkek Ventures · Даурен Кабиев · Astana Hub · Рустам Азизов · IT Park Tashkent","en":"Raisa Toktorbaeva · Bishkek Ventures · Dauren Kabiev · Astana Hub · Rustam Azizov · IT Park Tashkent"}$j$::jsonb,
  'panel', 'startup', '2026-06-04T07:00:00Z', 75,
  $j${"ru":"Главный зал","ky":"Башкы зал","en":"Main Hall"}$j$::jsonb,
  4
),
(
  $j${"ru":"Обед · нетворкинг","ky":"Түшкү тамак · нетворкинг","en":"Lunch · networking"}$j$::jsonb,
  null, null,
  'break', 'general', '2026-06-04T08:15:00Z', 75, null, 5
),
(
  $j${"ru":"Workshop A · Внедрение LLM в продуктовые команды","ky":"Workshop A · LLMди продуктулук командаларга киргизүү","en":"Workshop A · Bringing LLMs into product teams"}$j$::jsonb,
  $j${"ru":"Практическая сессия: архитектура, выбор моделей, оценка качества, безопасность. Для технических лидеров и продактов.","ky":"Практикалык сессия: архитектура, моделдерди тандоо, сапатты баалоо, коопсуздук. Техникалык лидерлер жана продакт-менеджерлер үчүн.","en":"A hands-on session: architecture, model selection, quality evaluation, and safety. For tech leads and product managers."}$j$::jsonb,
  $j${"ru":"Елена Русакова · Yandex Cloud","ky":"Елена Русакова · Yandex Cloud","en":"Elena Rusakova · Yandex Cloud"}$j$::jsonb,
  'workshop', 'ai', '2026-06-04T09:30:00Z', 90,
  $j${"ru":"Зал A","ky":"А залы","en":"Hall A"}$j$::jsonb,
  6
),
(
  $j${"ru":"Workshop B · Запуск цифрового госсервиса за 12 недель","ky":"Workshop B · Санариптик мамлекеттик кызматты 12 жумада ишке киргизүү","en":"Workshop B · Launching a digital public service in 12 weeks"}$j$::jsonb,
  $j${"ru":"Методология MVP для государственных продуктов: исследование, прототип, пилот, масштабирование.","ky":"Мамлекеттик продуктулар үчүн MVP методологиясы: изилдөө, прототип, пилот, масштабдоо.","en":"An MVP methodology for public-sector products: research, prototype, pilot, scale-up."}$j$::jsonb,
  $j${"ru":"Саруу Сариева · Минцифра КР","ky":"Саруу Сариева · КРнын Санариптик министрлиги","en":"Saruu Sarieva · Ministry of Digital Development of the KR"}$j$::jsonb,
  'workshop', 'gov', '2026-06-04T09:30:00Z', 90,
  $j${"ru":"Зал B","ky":"Б залы","en":"Hall B"}$j$::jsonb,
  7
),
(
  $j${"ru":"Workshop C · Привлечение seed-инвестиций","ky":"Workshop C · Seed-инвестицияларды тартуу","en":"Workshop C · Raising seed investment"}$j$::jsonb,
  $j${"ru":"Питч-механика, юнит-экономика, term sheet для основателей из Центральной Азии. Разбор реальных раундов.","ky":"Питч-механика, юнит-экономика, Борбордук Азиядан негиздөөчүлөр үчүн term sheet. Чыныгы раунддардын талдоосу.","en":"Pitch mechanics, unit economics, term sheets for Central Asian founders. A walk-through of real rounds."}$j$::jsonb,
  $j${"ru":"Раиса Токторбаева · Bishkek Ventures","ky":"Раиса Токторбаева · Bishkek Ventures","en":"Raisa Toktorbaeva · Bishkek Ventures"}$j$::jsonb,
  'workshop', 'startup', '2026-06-04T09:30:00Z', 90,
  $j${"ru":"Зал C","ky":"В залы","en":"Hall C"}$j$::jsonb,
  8
),
(
  $j${"ru":"Вечерний приём и нетворкинг","ky":"Кечки кабыл алуу жана нетворкинг","en":"Evening reception and networking"}$j$::jsonb,
  $j${"ru":"Закрытый приём для участников, спикеров и делегаций. Камерные встречи, B2G и B2B договорённости.","ky":"Катышуучулар, спикерлер жана делегациялар үчүн жабык кабыл алуу. Жакыныраак жолугушуулар, B2G жана B2B макулдашуулар.","en":"A closed reception for participants, speakers, and delegations. Intimate meetings, B2G and B2B agreements."}$j$::jsonb,
  null,
  'networking', 'general', '2026-06-04T11:15:00Z', 135,
  $j${"ru":"Атриум","ky":"Атриум","en":"Atrium"}$j$::jsonb,
  9
),

-- DAY 2 — 2026-06-05
(
  $j${"ru":"Технологические показы · Tech Showcase","ky":"Технологиялык көргөзмөлөр · Tech Showcase","en":"Technology showcase · Tech Showcase"}$j$::jsonb,
  $j${"ru":"Ведущие технологические компании региона и приглашённые гости демонстрируют флагманские разработки 2026 года.","ky":"Региондун алдыңкы технологиялык компаниялары жана чакырылган коноктор 2026-жылдын флагмандык иштеп чыгууларын көрсөтөт.","en":"Leading technology companies of the region and invited guests showcase their 2026 flagship work."}$j$::jsonb,
  null,
  'keynote', 'general', '2026-06-05T03:30:00Z', 75,
  $j${"ru":"Главный зал","ky":"Башкы зал","en":"Main Hall"}$j$::jsonb,
  0
),
(
  $j${"ru":"Инвестиционный форум · Capital Day","ky":"Инвестициялык форум · Capital Day","en":"Investment forum · Capital Day"}$j$::jsonb,
  $j${"ru":"Закрытые сессии с фондами, частными инвесторами и институтами развития. Презентации отобранных стартапов перед инвесторами.","ky":"Фонддор, жеке инвесторлор жана өнүгүү институттары менен жабык сессиялар. Тандалган стартаптардын инвесторлордун алдындагы презентациялары.","en":"Closed sessions with funds, private investors, and development institutions. Presentations of selected start-ups to investors."}$j$::jsonb,
  $j${"ru":"Priya Chandra · ADB · Раиса Токторбаева","ky":"Priya Chandra · Азия Өнүгүү Банкы · Раиса Токторбаева","en":"Priya Chandra · ADB · Raisa Toktorbaeva"}$j$::jsonb,
  'panel', 'startup', '2026-06-05T05:00:00Z', 90,
  $j${"ru":"Главный зал","ky":"Башкы зал","en":"Main Hall"}$j$::jsonb,
  1
),
(
  $j${"ru":"Кибербезопасность критической инфраструктуры","ky":"Критикалык инфраструктуранын киберкоопсуздугу","en":"Cybersecurity of critical infrastructure"}$j$::jsonb,
  $j${"ru":"Угрозы 2026, регуляторные требования, опыт государств-членов ОЭСР и Центральной Азии. Что нужно делать руководителям сегодня.","ky":"2026-жылдын коркунучтары, жөнгө салуучу талаптар, ЭкӨУга мүчө мамлекеттердин жана Борбордук Азиянын тажрыйбасы.","en":"The 2026 threat landscape, regulatory requirements, lessons from OECD member states and Central Asia. What executives need to do today."}$j$::jsonb,
  $j${"ru":"Dr. Marcus Weber · Fraunhofer · Алмаз Кадыров · ГКНБ КР","ky":"Dr. Marcus Weber · Fraunhofer · Алмаз Кадыров · КР УУКМК","en":"Dr. Marcus Weber · Fraunhofer · Almaz Kadyrov · State Committee for National Security of the KR"}$j$::jsonb,
  'panel', 'security', '2026-06-05T06:30:00Z', 75,
  $j${"ru":"Главный зал","ky":"Башкы зал","en":"Main Hall"}$j$::jsonb,
  2
),
(
  $j${"ru":"Кофе-брейк","ky":"Кофе-тыныгуу","en":"Coffee break"}$j$::jsonb,
  null, null,
  'break', 'general', '2026-06-05T07:45:00Z', 30, null, 3
),
(
  $j${"ru":"Образование и таланты: программа на 10 лет","ky":"Билим берүү жана таланттар: 10 жылдык программа","en":"Education and talent: a ten-year programme"}$j$::jsonb,
  $j${"ru":"Как готовить инженеров и продакт-менеджеров в стране и удерживать их. Партнёрства университетов с бизнесом и государством.","ky":"Инженерлерди жана продакт-менеджерлерди өлкөдө кантип даярдоо жана аларды кантип кармап туруу керек. Университеттердин бизнес жана мамлекет менен өнөктөштүгү.","en":"How to train engineers and product managers domestically — and retain them. University partnerships with business and government."}$j$::jsonb,
  $j${"ru":"Наргиза Асанова · АУЦА · Бекжан Усенов · Минобр КР","ky":"Наргиза Асанова · АБУУ · Бекжан Усенов · КРнын Билим берүү министрлиги","en":"Nargiza Asanova · AUCA · Bekzhan Usenov · Ministry of Education of the KR"}$j$::jsonb,
  'panel', 'edu', '2026-06-05T08:15:00Z', 75,
  $j${"ru":"Главный зал","ky":"Башкы зал","en":"Main Hall"}$j$::jsonb,
  4
),
(
  $j${"ru":"Цифровизация государственных услуг: следующие 100 сервисов","ky":"Мамлекеттик кызматтарды санариптештирүү: кийинки 100 кызмат","en":"Digitalising public services: the next 100 services"}$j$::jsonb,
  $j${"ru":"Дорожная карта переноса оставшихся государственных услуг в цифру. Принципы, инфраструктура, операционные команды.","ky":"Калган мамлекеттик кызматтарды санариптик чөйрөгө өткөрүүнүн жол картасы. Принциптер, инфраструктура, операциялык командалар.","en":"The roadmap for moving the remaining public services into digital. Principles, infrastructure, operating teams."}$j$::jsonb,
  $j${"ru":"Саруу Сариева · Минцифра КР","ky":"Саруу Сариева · КРнын Санариптик министрлиги","en":"Saruu Sarieva · Ministry of Digital Development of the KR"}$j$::jsonb,
  'panel', 'gov', '2026-06-05T09:45:00Z', 75,
  $j${"ru":"Главный зал","ky":"Башкы зал","en":"Main Hall"}$j$::jsonb,
  5
),
(
  $j${"ru":"Закрывающий keynote","ky":"Жабылыш keynote","en":"Closing keynote"}$j$::jsonb,
  $j${"ru":"Подведение итогов форума, ключевые соглашения, заявление о приоритетах на 2027 год.","ky":"Форумдун жыйынтыктары, негизги макулдашуулар, 2027-жылга артыкчылыктар жөнүндө билдирүү.","en":"Forum take-aways, the key agreements signed, and a statement of priorities for 2027."}$j$::jsonb,
  $j${"ru":"Алтынбек Эшеналиев · ПВТ КР","ky":"Алтынбек Эшеналиев · КР ЖТП","en":"Altynbek Eshenaliev · HTP KR"}$j$::jsonb,
  'keynote', 'general', '2026-06-05T11:15:00Z', 45,
  $j${"ru":"Главный зал","ky":"Башкы зал","en":"Main Hall"}$j$::jsonb,
  6
),
(
  $j${"ru":"Церемония вручения наград","ky":"Сыйлыктарды тапшыруу аземи","en":"Awards ceremony"}$j$::jsonb,
  $j${"ru":"Награждение в номинациях: Лучший государственный цифровой сервис, Стартап года, Технологический лидер, Образовательная инициатива.","ky":"Номинациялар боюнча сыйлоо: Эң мыкты мамлекеттик санариптик кызмат, Жылдын стартабы, Технологиялык лидер, Билим берүү демилгеси.","en":"Awards in the categories: Best Public Digital Service, Start-up of the Year, Technology Leader, Education Initiative."}$j$::jsonb,
  null,
  'ceremony', 'general', '2026-06-05T12:15:00Z', 105,
  $j${"ru":"Атриум","ky":"Атриум","en":"Atrium"}$j$::jsonb,
  7
);
