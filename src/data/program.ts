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
  title: string;
  description?: string;
  speakers?: string[];
  type: SessionType;
  track: Track;
  hall?: string;
}

export interface ProgramDay {
  date: string;
  weekday: string;
  label: string;
  sessions: SessionSlot[];
}

export const trackMeta: Record<Track, { label: string; color: string }> = {
  ai: { label: "AI", color: "#0066FF" },
  gov: { label: "Gov", color: "#003D99" },
  startup: { label: "Startup", color: "#0099CC" },
  edu: { label: "Edu", color: "#4A5C7A" },
  security: { label: "Security", color: "#0A1628" },
  general: { label: "Общая", color: "#8A98B0" },
};

export const sessionTypeLabel: Record<SessionType, string> = {
  keynote: "Keynote",
  panel: "Panel",
  workshop: "Workshop",
  networking: "Networking",
  break: "Break",
  ceremony: "Ceremony",
};

export const programDays: ProgramDay[] = [
  {
    date: "2026-06-04",
    weekday: "Четверг",
    label: "День 1 · 4 июня",
    sessions: [
      {
        id: "d1-opening",
        start: "09:30",
        end: "10:15",
        title: "Церемония открытия",
        description:
          "Открывающее слово от руководства Парка высоких технологий, министерств КР и приглашённых делегаций. Демонстрация ключевых цифровых инициатив 2026 года.",
        speakers: ["Алтынбек Эшеналиев", "Саруу Сариева"],
        type: "ceremony",
        track: "general",
        hall: "Главный зал",
      },
      {
        id: "d1-keynote-1",
        start: "10:15",
        end: "11:00",
        title: "Цифровая трансформация Кыргызстана: горизонт 2030",
        description:
          "Видение национальной цифровой стратегии — приоритеты, ключевые проекты, целевые показатели. Каким будет цифровое государство через пять лет.",
        speakers: ["Саруу Сариева, Министр цифрового развития КР"],
        type: "keynote",
        track: "gov",
        hall: "Главный зал",
      },
      {
        id: "d1-panel-ai-gov",
        start: "11:15",
        end: "12:30",
        title: "Искусственный интеллект в государственном управлении",
        description:
          "Реальные кейсы внедрения ИИ в госсервисы региона. Этика, регулирование, кадры. Где ИИ уже работает, а где — пока эксперимент.",
        speakers: [
          "Amélie Laurent · OECD",
          "Kenji Tanaka · NTT Data",
          "Азамат Сыдыков · Akıl AI",
        ],
        type: "panel",
        track: "ai",
        hall: "Главный зал",
      },
      {
        id: "d1-coffee-1",
        start: "12:30",
        end: "13:00",
        title: "Кофе-брейк",
        type: "break",
        track: "general",
      },
      {
        id: "d1-panel-startup",
        start: "13:00",
        end: "14:15",
        title: "Стартап-экосистема Центральной Азии: новый цикл",
        description:
          "Венчурный капитал, господдержка, региональные хабы. Что мешает региональным стартапам выходить на глобальный рынок и как это меняется.",
        speakers: [
          "Раиса Токторбаева · Bishkek Ventures",
          "Даурен Кабиев · Astana Hub",
          "Рустам Азизов · IT Park Tashkent",
        ],
        type: "panel",
        track: "startup",
        hall: "Главный зал",
      },
      {
        id: "d1-lunch",
        start: "14:15",
        end: "15:30",
        title: "Обед · нетворкинг",
        type: "break",
        track: "general",
      },
      {
        id: "d1-workshop-a",
        start: "15:30",
        end: "17:00",
        title: "Workshop A · Внедрение LLM в продуктовые команды",
        description:
          "Практическая сессия: архитектура, выбор моделей, оценка качества, безопасность. Для технических лидеров и продактов.",
        speakers: ["Елена Русакова · Yandex Cloud"],
        type: "workshop",
        track: "ai",
        hall: "Зал A",
      },
      {
        id: "d1-workshop-b",
        start: "15:30",
        end: "17:00",
        title: "Workshop B · Запуск цифрового госсервиса за 12 недель",
        description:
          "Методология MVP для государственных продуктов: исследование, прототип, пилот, масштабирование.",
        speakers: ["Саруу Сариева · Минцифра КР"],
        type: "workshop",
        track: "gov",
        hall: "Зал B",
      },
      {
        id: "d1-workshop-c",
        start: "15:30",
        end: "17:00",
        title: "Workshop C · Привлечение seed-инвестиций",
        description:
          "Питч-механика, юнит-экономика, term sheet для основателей из Центральной Азии. Разбор реальных раундов.",
        speakers: ["Раиса Токторбаева · Bishkek Ventures"],
        type: "workshop",
        track: "startup",
        hall: "Зал C",
      },
      {
        id: "d1-networking",
        start: "17:15",
        end: "19:30",
        title: "Вечерний приём и нетворкинг",
        description:
          "Закрытый приём для участников, спикеров и делегаций. Камерные встречи, B2G и B2B договорённости.",
        type: "networking",
        track: "general",
        hall: "Атриум",
      },
    ],
  },
  {
    date: "2026-06-05",
    weekday: "Пятница",
    label: "День 2 · 5 июня",
    sessions: [
      {
        id: "d2-showcase",
        start: "09:30",
        end: "10:45",
        title: "Технологические показы · Tech Showcase",
        description:
          "Ведущие технологические компании региона и приглашённые гости демонстрируют флагманские разработки 2026 года.",
        type: "keynote",
        track: "general",
        hall: "Главный зал",
      },
      {
        id: "d2-investment",
        start: "11:00",
        end: "12:30",
        title: "Инвестиционный форум · Capital Day",
        description:
          "Закрытые сессии с фондами, частными инвесторами и институтами развития. Презентации отобранных стартапов перед инвесторами.",
        speakers: ["Priya Chandra · ADB", "Раиса Токторбаева"],
        type: "panel",
        track: "startup",
        hall: "Главный зал",
      },
      {
        id: "d2-security",
        start: "12:30",
        end: "13:45",
        title: "Кибербезопасность критической инфраструктуры",
        description:
          "Угрозы 2026, регуляторные требования, опыт государств-членов ОЭСР и Центральной Азии. Что нужно делать руководителям сегодня.",
        speakers: [
          "Dr. Marcus Weber · Fraunhofer",
          "Алмаз Кадыров · ГКНБ КР",
        ],
        type: "panel",
        track: "security",
        hall: "Главный зал",
      },
      {
        id: "d2-coffee",
        start: "13:45",
        end: "14:15",
        title: "Кофе-брейк",
        type: "break",
        track: "general",
      },
      {
        id: "d2-education",
        start: "14:15",
        end: "15:30",
        title: "Образование и таланты: программа на 10 лет",
        description:
          "Как готовить инженеров и продакт-менеджеров в стране и удерживать их. Партнёрства университетов с бизнесом и государством.",
        speakers: [
          "Наргиза Асанова · АУЦА",
          "Бекжан Усенов · Минобр КР",
        ],
        type: "panel",
        track: "edu",
        hall: "Главный зал",
      },
      {
        id: "d2-gov-services",
        start: "15:45",
        end: "17:00",
        title: "Цифровизация государственных услуг: следующие 100 сервисов",
        description:
          "Дорожная карта переноса оставшихся государственных услуг в цифру. Принципы, инфраструктура, операционные команды.",
        speakers: ["Саруу Сариева · Минцифра КР"],
        type: "panel",
        track: "gov",
        hall: "Главный зал",
      },
      {
        id: "d2-closing",
        start: "17:15",
        end: "18:00",
        title: "Закрывающий keynote",
        description:
          "Подведение итогов форума, ключевые соглашения, заявление о приоритетах на 2027 год.",
        speakers: ["Алтынбек Эшеналиев · ПВТ КР"],
        type: "keynote",
        track: "general",
        hall: "Главный зал",
      },
      {
        id: "d2-awards",
        start: "18:15",
        end: "20:00",
        title: "Церемония вручения наград",
        description:
          "Награждение в номинациях: Лучший государственный цифровой сервис, Стартап года, Технологический лидер, Образовательная инициатива.",
        type: "ceremony",
        track: "general",
        hall: "Атриум",
      },
    ],
  },
];
