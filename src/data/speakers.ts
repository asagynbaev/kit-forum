export interface SpeakerCrop {
  /** Which screenshot sheet to source the portrait from */
  source: "row1" | "row2";
  /** Column 0–2 in the 3×2 sheet */
  col: 0 | 1 | 2;
  /** Row 0–1 in the 3×2 sheet */
  row: 0 | 1;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  topic: string;
  country: string;
  countryFlag: string;
  crop: SpeakerCrop;
}

/**
 * 12 анонсированных спикеров KIT 2026.
 * Портреты вырезаются из public/speakers/row1.png + row2.png через CSS
 * background-position. См. Speakers.tsx.
 */
export const speakers: Speaker[] = [
  {
    id: "tilek-mamutov",
    name: "Тилек Мамутов",
    role: "Первый кыргызстанец в Google · Основатель Outtalent",
    topic: "Глобальный талант из Центральной Азии: как пробиться в Bigtech",
    country: "Кыргызстан",
    countryFlag: "🇰🇬",
    crop: { source: "row1", col: 0, row: 0 },
  },
  {
    id: "maksim-prokhorov",
    name: "Максим Прохоров",
    role: "Сооснователь и CEO PLATMA",
    topic: "Платформы как операционная среда нового поколения бизнеса",
    country: "Кыргызстан",
    countryFlag: "🇰🇬",
    crop: { source: "row1", col: 1, row: 0 },
  },
  {
    id: "takeru-kawashima",
    name: "Такэру Кавашима",
    role: "Исполнительный директор · 01Booster Inc.",
    topic: "Корпоративные инновации: японская модель работы со стартапами",
    country: "Япония",
    countryFlag: "🇯🇵",
    crop: { source: "row1", col: 2, row: 0 },
  },
  {
    id: "avigayil-menashe",
    name: "Авигайль Менаше",
    role: "Основатель STEM Consulting",
    topic:
      "Технологические экосистемы Центральной Азии и международное сотрудничество",
    country: "Израиль",
    countryFlag: "🇮🇱",
    crop: { source: "row1", col: 0, row: 1 },
  },
  {
    id: "ulan-abdurazakov",
    name: "Улан Абдуразаков",
    role: "CEO Nineninesixai.ai",
    topic: "Самый быстрый голосовой realtime AI: архитектура и применения",
    country: "Кыргызстан",
    countryFlag: "🇰🇬",
    crop: { source: "row1", col: 1, row: 1 },
  },
  {
    id: "kenny-johnson",
    name: "Кенни Джонсон",
    role: "Основатель DreamLine Holdings · Инвестор",
    topic: "Венчурный взгляд на эмерджентные рынки СНГ и Центральной Азии",
    country: "США",
    countryFlag: "🇺🇸",
    crop: { source: "row1", col: 2, row: 1 },
  },
  {
    id: "takuya-nomura",
    name: "Такуя Номура",
    role:
      "Генеральный продюсер Knowledge Capital Association · VS. Joint Partnership",
    topic: "Города знаний: как переустроить общественные пространства под науку",
    country: "Япония",
    countryFlag: "🇯🇵",
    crop: { source: "row2", col: 0, row: 0 },
  },
  {
    id: "kainar-kamalov",
    name: "Кайнар Камалов",
    role: "Руководитель отдела продуктов · CloudX",
    topic: "Облачные инфраструктуры для государственных задач Центральной Азии",
    country: "Кыргызстан",
    countryFlag: "🇰🇬",
    crop: { source: "row2", col: 1, row: 0 },
  },
  {
    id: "azamat-burzhuev",
    name: "Азамат Буржуев",
    role: "Эксперт в сфере GovTech · Цифровая трансформация",
    topic: "Цифровизация государственных услуг Кыргызстана: следующие 100 сервисов",
    country: "Кыргызстан",
    countryFlag: "🇰🇬",
    crop: { source: "row2", col: 2, row: 0 },
  },
  {
    id: "amy-peck",
    name: "Эми Пэк",
    role: "Основатель и генеральный директор EndeavorXR",
    topic: "XR и иммерсивные технологии для государственного и образовательного секторов",
    country: "США",
    countryFlag: "🇺🇸",
    crop: { source: "row2", col: 0, row: 1 },
  },
  {
    id: "aizhan-alisherova",
    name: "Айжан Алишерова-Дуймаз",
    role: "Сооснователь Startup Lab 119 · Директор WeFund",
    topic: "Женское предпринимательство и фонды Кыргызстана: следующий цикл",
    country: "Кыргызстан",
    countryFlag: "🇰🇬",
    crop: { source: "row2", col: 1, row: 1 },
  },
  {
    id: "taalay-djumabaev",
    name: "Таалай Джумабаев",
    role: "Основатель и генеральный директор Growthhungry",
    topic: "Образовательный путь предпринимателя: как строится Growthhungry",
    country: "Кыргызстан",
    countryFlag: "🇰🇬",
    crop: { source: "row2", col: 2, row: 1 },
  },
];
