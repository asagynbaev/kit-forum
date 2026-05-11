import type { Localized } from "@/i18n/I18nProvider";

export type Track = "ai" | "gov" | "startup" | "edu" | "security" | "general";

export type SessionType =
  | "keynote"
  | "panel"
  | "workshop"
  | "networking"
  | "break"
  | "ceremony";

export interface SessionSlot {
  id: string;
  start: string; // HH:MM
  end: string; // HH:MM
  title: Localized;
  description?: Localized;
  /** Joined credit line: "Name · Affiliation · Name · Affiliation" */
  speakers?: Localized;
  type: SessionType;
  track: Track;
  hall?: Localized;
}

export interface ProgramDay {
  date: string;
  weekday: Localized;
  label: Localized;
  sessions: SessionSlot[];
}

/** Track colours only — labels live in dictionaries (`program.track.*`). */
export const trackColor: Record<Track, string> = {
  ai: "#0066FF",
  gov: "#003D99",
  startup: "#0099CC",
  edu: "#4A5C7A",
  security: "#0A1628",
  general: "#8A98B0",
};

// ── Hall labels reused across multiple sessions
const MAIN_HALL: Localized = {
  ru: "Главный зал",
  ky: "Башкы зал",
  en: "Main Hall",
};
const HALL_A: Localized = { ru: "Зал A", ky: "А залы", en: "Hall A" };
const HALL_B: Localized = { ru: "Зал B", ky: "Б залы", en: "Hall B" };
const HALL_C: Localized = { ru: "Зал C", ky: "В залы", en: "Hall C" };
const ATRIUM: Localized = { ru: "Атриум", ky: "Атриум", en: "Atrium" };

export const programDays: ProgramDay[] = [
  {
    date: "2026-06-04",
    weekday: {
      ru: "Четверг",
      ky: "Бейшемби",
      en: "Thursday",
    },
    label: {
      ru: "День 1 · 4 июня",
      ky: "1-күн · 4-июнь",
      en: "Day 1 · 4 June",
    },
    sessions: [
      {
        id: "d1-opening",
        start: "09:30",
        end: "10:15",
        title: {
          ru: "Церемония открытия",
          ky: "Ачылыш аземи",
          en: "Opening ceremony",
        },
        description: {
          ru: "Открывающее слово от руководства Парка высоких технологий, министерств КР и приглашённых делегаций. Демонстрация ключевых цифровых инициатив 2026 года.",
          ky: "Жогорку технологиялар паркынын жетекчилигинин, КРнын министрликтеринин жана чакырылган делегациялардын ачылыш сөзү. 2026-жылдын негизги санариптик демилгелеринин көрсөтүлүшү.",
          en: "Opening remarks from the leadership of the High Technology Park, ministries of the Kyrgyz Republic, and invited delegations. A showcase of the key digital initiatives of 2026.",
        },
        speakers: {
          ru: "Алтынбек Эшеналиев · Саруу Сариева",
          ky: "Алтынбек Эшеналиев · Саруу Сариева",
          en: "Altynbek Eshenaliev · Saruu Sarieva",
        },
        type: "ceremony",
        track: "general",
        hall: MAIN_HALL,
      },
      {
        id: "d1-keynote-1",
        start: "10:15",
        end: "11:00",
        title: {
          ru: "Цифровая трансформация Кыргызстана: горизонт 2030",
          ky: "Кыргызстандын санариптик трансформациясы: 2030-горизонт",
          en: "Kyrgyzstan's digital transformation: the 2030 horizon",
        },
        description: {
          ru: "Видение национальной цифровой стратегии — приоритеты, ключевые проекты, целевые показатели. Каким будет цифровое государство через пять лет.",
          ky: "Улуттук санариптик стратегиянын көрүнүшү — артыкчылыктар, негизги долбоорлор, максаттуу көрсөткүчтөр. Беш жылдан кийинки санариптик мамлекет.",
          en: "A vision for the national digital strategy — priorities, flagship projects, and targets. What the digital state will look like in five years.",
        },
        speakers: {
          ru: "Саруу Сариева, Министр цифрового развития КР",
          ky: "Саруу Сариева, КРнын Санариптик өнүгүү министри",
          en: "Saruu Sarieva, Minister of Digital Development of the KR",
        },
        type: "keynote",
        track: "gov",
        hall: MAIN_HALL,
      },
      {
        id: "d1-panel-ai-gov",
        start: "11:15",
        end: "12:30",
        title: {
          ru: "Искусственный интеллект в государственном управлении",
          ky: "Жасалма интеллект мамлекеттик башкарууда",
          en: "Artificial intelligence in public administration",
        },
        description: {
          ru: "Реальные кейсы внедрения ИИ в госсервисы региона. Этика, регулирование, кадры. Где ИИ уже работает, а где — пока эксперимент.",
          ky: "Региондогу мамлекеттик кызматтарга ИИди киргизүүнүн чыныгы кейстери. Этика, жөнгө салуу, кадрлар. ИИ кайда буга чейин иштеп жатат, а кайда — эксперимент.",
          en: "Real-world cases of deploying AI in the region's public services. Ethics, regulation, talent. Where AI already works, and where it is still an experiment.",
        },
        speakers: {
          ru: "Amélie Laurent · OECD · Kenji Tanaka · NTT Data · Азамат Сыдыков · Akıl AI",
          ky: "Amélie Laurent · ЭкӨУ · Kenji Tanaka · NTT Data · Азамат Сыдыков · Akıl AI",
          en: "Amélie Laurent · OECD · Kenji Tanaka · NTT Data · Azamat Sydykov · Akıl AI",
        },
        type: "panel",
        track: "ai",
        hall: MAIN_HALL,
      },
      {
        id: "d1-coffee-1",
        start: "12:30",
        end: "13:00",
        title: {
          ru: "Кофе-брейк",
          ky: "Кофе-тыныгуу",
          en: "Coffee break",
        },
        type: "break",
        track: "general",
      },
      {
        id: "d1-panel-startup",
        start: "13:00",
        end: "14:15",
        title: {
          ru: "Стартап-экосистема Центральной Азии: новый цикл",
          ky: "Борбордук Азиянын стартап-экосистемасы: жаңы цикл",
          en: "Central Asia's start-up ecosystem: a new cycle",
        },
        description: {
          ru: "Венчурный капитал, господдержка, региональные хабы. Что мешает региональным стартапам выходить на глобальный рынок и как это меняется.",
          ky: "Венчурдук капитал, мамлекеттик колдоо, регионалдык хабдар. Региондук стартаптарга глобалдык рынокко чыгууга эмнелер тоскоолдук кылат жана бул кантип өзгөрүп жатат.",
          en: "Venture capital, state support, regional hubs. What holds regional start-ups back from the global market — and what is shifting.",
        },
        speakers: {
          ru: "Раиса Токторбаева · Bishkek Ventures · Даурен Кабиев · Astana Hub · Рустам Азизов · IT Park Tashkent",
          ky: "Раиса Токторбаева · Bishkek Ventures · Даурен Кабиев · Astana Hub · Рустам Азизов · IT Park Tashkent",
          en: "Raisa Toktorbaeva · Bishkek Ventures · Dauren Kabiev · Astana Hub · Rustam Azizov · IT Park Tashkent",
        },
        type: "panel",
        track: "startup",
        hall: MAIN_HALL,
      },
      {
        id: "d1-lunch",
        start: "14:15",
        end: "15:30",
        title: {
          ru: "Обед · нетворкинг",
          ky: "Түшкү тамак · нетворкинг",
          en: "Lunch · networking",
        },
        type: "break",
        track: "general",
      },
      {
        id: "d1-workshop-a",
        start: "15:30",
        end: "17:00",
        title: {
          ru: "Workshop A · Внедрение LLM в продуктовые команды",
          ky: "Workshop A · LLMди продуктулук командаларга киргизүү",
          en: "Workshop A · Bringing LLMs into product teams",
        },
        description: {
          ru: "Практическая сессия: архитектура, выбор моделей, оценка качества, безопасность. Для технических лидеров и продактов.",
          ky: "Практикалык сессия: архитектура, моделдерди тандоо, сапатты баалоо, коопсуздук. Техникалык лидерлер жана продакт-менеджерлер үчүн.",
          en: "A hands-on session: architecture, model selection, quality evaluation, and safety. For tech leads and product managers.",
        },
        speakers: {
          ru: "Елена Русакова · Yandex Cloud",
          ky: "Елена Русакова · Yandex Cloud",
          en: "Elena Rusakova · Yandex Cloud",
        },
        type: "workshop",
        track: "ai",
        hall: HALL_A,
      },
      {
        id: "d1-workshop-b",
        start: "15:30",
        end: "17:00",
        title: {
          ru: "Workshop B · Запуск цифрового госсервиса за 12 недель",
          ky: "Workshop B · Санариптик мамлекеттик кызматты 12 жумада ишке киргизүү",
          en: "Workshop B · Launching a digital public service in 12 weeks",
        },
        description: {
          ru: "Методология MVP для государственных продуктов: исследование, прототип, пилот, масштабирование.",
          ky: "Мамлекеттик продуктулар үчүн MVP методологиясы: изилдөө, прототип, пилот, масштабдоо.",
          en: "An MVP methodology for public-sector products: research, prototype, pilot, scale-up.",
        },
        speakers: {
          ru: "Саруу Сариева · Минцифра КР",
          ky: "Саруу Сариева · КРнын Санариптик министрлиги",
          en: "Saruu Sarieva · Ministry of Digital Development of the KR",
        },
        type: "workshop",
        track: "gov",
        hall: HALL_B,
      },
      {
        id: "d1-workshop-c",
        start: "15:30",
        end: "17:00",
        title: {
          ru: "Workshop C · Привлечение seed-инвестиций",
          ky: "Workshop C · Seed-инвестицияларды тартуу",
          en: "Workshop C · Raising seed investment",
        },
        description: {
          ru: "Питч-механика, юнит-экономика, term sheet для основателей из Центральной Азии. Разбор реальных раундов.",
          ky: "Питч-механика, юнит-экономика, Борбордук Азиядан негиздөөчүлөр үчүн term sheet. Чыныгы раунддардын талдоосу.",
          en: "Pitch mechanics, unit economics, term sheets for Central Asian founders. A walk-through of real rounds.",
        },
        speakers: {
          ru: "Раиса Токторбаева · Bishkek Ventures",
          ky: "Раиса Токторбаева · Bishkek Ventures",
          en: "Raisa Toktorbaeva · Bishkek Ventures",
        },
        type: "workshop",
        track: "startup",
        hall: HALL_C,
      },
      {
        id: "d1-networking",
        start: "17:15",
        end: "19:30",
        title: {
          ru: "Вечерний приём и нетворкинг",
          ky: "Кечки кабыл алуу жана нетворкинг",
          en: "Evening reception and networking",
        },
        description: {
          ru: "Закрытый приём для участников, спикеров и делегаций. Камерные встречи, B2G и B2B договорённости.",
          ky: "Катышуучулар, спикерлер жана делегациялар үчүн жабык кабыл алуу. Жакыныраак жолугушуулар, B2G жана B2B макулдашуулар.",
          en: "A closed reception for participants, speakers, and delegations. Intimate meetings, B2G and B2B agreements.",
        },
        type: "networking",
        track: "general",
        hall: ATRIUM,
      },
    ],
  },
  {
    date: "2026-06-05",
    weekday: {
      ru: "Пятница",
      ky: "Жума",
      en: "Friday",
    },
    label: {
      ru: "День 2 · 5 июня",
      ky: "2-күн · 5-июнь",
      en: "Day 2 · 5 June",
    },
    sessions: [
      {
        id: "d2-showcase",
        start: "09:30",
        end: "10:45",
        title: {
          ru: "Технологические показы · Tech Showcase",
          ky: "Технологиялык көргөзмөлөр · Tech Showcase",
          en: "Technology showcase · Tech Showcase",
        },
        description: {
          ru: "Ведущие технологические компании региона и приглашённые гости демонстрируют флагманские разработки 2026 года.",
          ky: "Региондун алдыңкы технологиялык компаниялары жана чакырылган коноктор 2026-жылдын флагмандык иштеп чыгууларын көрсөтөт.",
          en: "Leading technology companies of the region and invited guests showcase their 2026 flagship work.",
        },
        type: "keynote",
        track: "general",
        hall: MAIN_HALL,
      },
      {
        id: "d2-investment",
        start: "11:00",
        end: "12:30",
        title: {
          ru: "Инвестиционный форум · Capital Day",
          ky: "Инвестициялык форум · Capital Day",
          en: "Investment forum · Capital Day",
        },
        description: {
          ru: "Закрытые сессии с фондами, частными инвесторами и институтами развития. Презентации отобранных стартапов перед инвесторами.",
          ky: "Фонддор, жеке инвесторлор жана өнүгүү институттары менен жабык сессиялар. Тандалган стартаптардын инвесторлордун алдындагы презентациялары.",
          en: "Closed sessions with funds, private investors, and development institutions. Presentations of selected start-ups to investors.",
        },
        speakers: {
          ru: "Priya Chandra · ADB · Раиса Токторбаева",
          ky: "Priya Chandra · Азия Өнүгүү Банкы · Раиса Токторбаева",
          en: "Priya Chandra · ADB · Raisa Toktorbaeva",
        },
        type: "panel",
        track: "startup",
        hall: MAIN_HALL,
      },
      {
        id: "d2-security",
        start: "12:30",
        end: "13:45",
        title: {
          ru: "Кибербезопасность критической инфраструктуры",
          ky: "Критикалык инфраструктуранын киберкоопсуздугу",
          en: "Cybersecurity of critical infrastructure",
        },
        description: {
          ru: "Угрозы 2026, регуляторные требования, опыт государств-членов ОЭСР и Центральной Азии. Что нужно делать руководителям сегодня.",
          ky: "2026-жылдын коркунучтары, жөнгө салуучу талаптар, ЭкӨУга мүчө мамлекеттердин жана Борбордук Азиянын тажрыйбасы. Жетекчилер бүгүн эмне кылышы керек.",
          en: "The 2026 threat landscape, regulatory requirements, lessons from OECD member states and Central Asia. What executives need to do today.",
        },
        speakers: {
          ru: "Dr. Marcus Weber · Fraunhofer · Алмаз Кадыров · ГКНБ КР",
          ky: "Dr. Marcus Weber · Fraunhofer · Алмаз Кадыров · КР УУКМК",
          en: "Dr. Marcus Weber · Fraunhofer · Almaz Kadyrov · State Committee for National Security of the KR",
        },
        type: "panel",
        track: "security",
        hall: MAIN_HALL,
      },
      {
        id: "d2-coffee",
        start: "13:45",
        end: "14:15",
        title: {
          ru: "Кофе-брейк",
          ky: "Кофе-тыныгуу",
          en: "Coffee break",
        },
        type: "break",
        track: "general",
      },
      {
        id: "d2-education",
        start: "14:15",
        end: "15:30",
        title: {
          ru: "Образование и таланты: программа на 10 лет",
          ky: "Билим берүү жана таланттар: 10 жылдык программа",
          en: "Education and talent: a ten-year programme",
        },
        description: {
          ru: "Как готовить инженеров и продакт-менеджеров в стране и удерживать их. Партнёрства университетов с бизнесом и государством.",
          ky: "Инженерлерди жана продакт-менеджерлерди өлкөдө кантип даярдоо жана аларды кантип кармап туруу керек. Университеттердин бизнес жана мамлекет менен өнөктөштүгү.",
          en: "How to train engineers and product managers domestically — and retain them. University partnerships with business and government.",
        },
        speakers: {
          ru: "Наргиза Асанова · АУЦА · Бекжан Усенов · Минобр КР",
          ky: "Наргиза Асанова · АБУУ · Бекжан Усенов · КРнын Билим берүү министрлиги",
          en: "Nargiza Asanova · AUCA · Bekzhan Usenov · Ministry of Education of the KR",
        },
        type: "panel",
        track: "edu",
        hall: MAIN_HALL,
      },
      {
        id: "d2-gov-services",
        start: "15:45",
        end: "17:00",
        title: {
          ru: "Цифровизация государственных услуг: следующие 100 сервисов",
          ky: "Мамлекеттик кызматтарды санариптештирүү: кийинки 100 кызмат",
          en: "Digitalising public services: the next 100 services",
        },
        description: {
          ru: "Дорожная карта переноса оставшихся государственных услуг в цифру. Принципы, инфраструктура, операционные команды.",
          ky: "Калган мамлекеттик кызматтарды санариптик чөйрөгө өткөрүүнүн жол картасы. Принциптер, инфраструктура, операциялык командалар.",
          en: "The roadmap for moving the remaining public services into digital. Principles, infrastructure, operating teams.",
        },
        speakers: {
          ru: "Саруу Сариева · Минцифра КР",
          ky: "Саруу Сариева · КРнын Санариптик министрлиги",
          en: "Saruu Sarieva · Ministry of Digital Development of the KR",
        },
        type: "panel",
        track: "gov",
        hall: MAIN_HALL,
      },
      {
        id: "d2-closing",
        start: "17:15",
        end: "18:00",
        title: {
          ru: "Закрывающий keynote",
          ky: "Жабылыш keynote",
          en: "Closing keynote",
        },
        description: {
          ru: "Подведение итогов форума, ключевые соглашения, заявление о приоритетах на 2027 год.",
          ky: "Форумдун жыйынтыктары, негизги макулдашуулар, 2027-жылга артыкчылыктар жөнүндө билдирүү.",
          en: "Forum take-aways, the key agreements signed, and a statement of priorities for 2027.",
        },
        speakers: {
          ru: "Алтынбек Эшеналиев · ПВТ КР",
          ky: "Алтынбек Эшеналиев · КР ЖТП",
          en: "Altynbek Eshenaliev · HTP KR",
        },
        type: "keynote",
        track: "general",
        hall: MAIN_HALL,
      },
      {
        id: "d2-awards",
        start: "18:15",
        end: "20:00",
        title: {
          ru: "Церемония вручения наград",
          ky: "Сыйлыктарды тапшыруу аземи",
          en: "Awards ceremony",
        },
        description: {
          ru: "Награждение в номинациях: Лучший государственный цифровой сервис, Стартап года, Технологический лидер, Образовательная инициатива.",
          ky: "Номинациялар боюнча сыйлоо: Эң мыкты мамлекеттик санариптик кызмат, Жылдын стартабы, Технологиялык лидер, Билим берүү демилгеси.",
          en: "Awards in the categories: Best Public Digital Service, Start-up of the Year, Technology Leader, Education Initiative.",
        },
        type: "ceremony",
        track: "general",
        hall: ATRIUM,
      },
    ],
  },
];
