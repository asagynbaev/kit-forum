import type { Localized } from "@/i18n/I18nProvider";

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
  name: Localized;
  role: Localized;
  topic: Localized;
  country: Localized;
  countryFlag: string;
  crop: SpeakerCrop;
}

/**
 * 12 announced KIT 2026 speakers. Portraits come from public/speakers/
 * row1.png + row2.png via CSS background-position — see Speakers.tsx.
 *
 * Localised fields carry the source RU plus professionally translated
 * KY (Kyrgyz) and EN copy. Names of people are kept as-is in their
 * native form; country names follow each locale's convention.
 */
export const speakers: Speaker[] = [
  {
    id: "tilek-mamutov",
    name: {
      ru: "Тилек Мамутов",
      ky: "Тилек Мамутов",
      en: "Tilek Mamutov",
    },
    role: {
      ru: "Первый кыргызстанец в Google · Основатель Outtalent",
      ky: "Google'дагы биринчи кыргызстандык · Outtalent компаниясынын негиздөөчүсү",
      en: "The first Kyrgyz citizen at Google · Founder of Outtalent",
    },
    topic: {
      ru: "Глобальный талант из Центральной Азии: как пробиться в Bigtech",
      ky: "Борбордук Азиядан глобалдык талант: Big Tech компанияларына кантип жетүү керек",
      en: "Global talent from Central Asia: breaking into Big Tech",
    },
    country: { ru: "Кыргызстан", ky: "Кыргызстан", en: "Kyrgyzstan" },
    countryFlag: "🇰🇬",
    crop: { source: "row1", col: 0, row: 0 },
  },
  {
    id: "maksim-prokhorov",
    name: {
      ru: "Максим Прохоров",
      ky: "Максим Прохоров",
      en: "Maksim Prokhorov",
    },
    role: {
      ru: "Сооснователь и CEO PLATMA",
      ky: "PLATMAнын тең негиздөөчүсү жана башкы директору",
      en: "Co-founder and CEO of PLATMA",
    },
    topic: {
      ru: "Платформы как операционная среда нового поколения бизнеса",
      ky: "Платформалар — жаңы муундагы бизнестин операциялык чөйрөсү",
      en: "Platforms as the operating environment of the next-generation business",
    },
    country: { ru: "Кыргызстан", ky: "Кыргызстан", en: "Kyrgyzstan" },
    countryFlag: "🇰🇬",
    crop: { source: "row1", col: 1, row: 0 },
  },
  {
    id: "takeru-kawashima",
    name: {
      ru: "Такэру Кавашима",
      ky: "Такэру Кавашима",
      en: "Takeru Kawashima",
    },
    role: {
      ru: "Исполнительный директор · 01Booster Inc.",
      ky: "Аткаруучу директор · 01Booster Inc.",
      en: "Executive Director · 01Booster Inc.",
    },
    topic: {
      ru: "Корпоративные инновации: японская модель работы со стартапами",
      ky: "Корпоративдик инновациялар: стартаптар менен иштөөнүн жапон модели",
      en: "Corporate innovation: the Japanese model of working with start-ups",
    },
    country: { ru: "Япония", ky: "Япония", en: "Japan" },
    countryFlag: "🇯🇵",
    crop: { source: "row1", col: 2, row: 0 },
  },
  {
    id: "avigayil-menashe",
    name: {
      ru: "Авигайль Менаше",
      ky: "Авигайль Менаше",
      en: "Avigayil Menashe",
    },
    role: {
      ru: "Основатель STEM Consulting",
      ky: "STEM Consultingтин негиздөөчүсү",
      en: "Founder of STEM Consulting",
    },
    topic: {
      ru: "Технологические экосистемы Центральной Азии и международное сотрудничество",
      ky: "Борбордук Азиянын технологиялык экосистемалары жана эл аралык кызматташуу",
      en: "Central Asia's technology ecosystems and international cooperation",
    },
    country: { ru: "Израиль", ky: "Израиль", en: "Israel" },
    countryFlag: "🇮🇱",
    crop: { source: "row1", col: 0, row: 1 },
  },
  {
    id: "ulan-abdurazakov",
    name: {
      ru: "Улан Абдуразаков",
      ky: "Улан Абдуразаков",
      en: "Ulan Abdurazakov",
    },
    role: {
      ru: "CEO Nineninesixai.ai",
      ky: "Nineninesixai.aiнин башкы директору",
      en: "CEO of Nineninesixai.ai",
    },
    topic: {
      ru: "Самый быстрый голосовой realtime AI: архитектура и применения",
      ky: "Эң тез үн менен иштеген realtime AI: архитектурасы жана колдонулушу",
      en: "The fastest voice realtime AI: architecture and applications",
    },
    country: { ru: "Кыргызстан", ky: "Кыргызстан", en: "Kyrgyzstan" },
    countryFlag: "🇰🇬",
    crop: { source: "row1", col: 1, row: 1 },
  },
  {
    id: "kenny-johnson",
    name: {
      ru: "Кенни Джонсон",
      ky: "Кенни Джонсон",
      en: "Kenny Johnson",
    },
    role: {
      ru: "Основатель DreamLine Holdings · Инвестор",
      ky: "DreamLine Holdingsтин негиздөөчүсү · Инвестор",
      en: "Founder of DreamLine Holdings · Investor",
    },
    topic: {
      ru: "Венчурный взгляд на эмерджентные рынки СНГ и Центральной Азии",
      ky: "КМШ жана Борбордук Азиянын өсүп жаткан рынокторуна венчурдук көз караш",
      en: "A venture view on the emerging markets of the CIS and Central Asia",
    },
    country: { ru: "США", ky: "АКШ", en: "USA" },
    countryFlag: "🇺🇸",
    crop: { source: "row1", col: 2, row: 1 },
  },
  {
    id: "takuya-nomura",
    name: {
      ru: "Такуя Номура",
      ky: "Такуя Номура",
      en: "Takuya Nomura",
    },
    role: {
      ru: "Генеральный продюсер Knowledge Capital Association · VS. Joint Partnership",
      ky: "Knowledge Capital Associationдын башкы продюсери · VS. Joint Partnership",
      en: "General Producer at Knowledge Capital Association · VS. Joint Partnership",
    },
    topic: {
      ru: "Города знаний: как переустроить общественные пространства под науку",
      ky: "Билим шаарлары: коомдук мейкиндиктерди илим үчүн кантип кайра түзүш керек",
      en: "Cities of knowledge: rebuilding public spaces around science",
    },
    country: { ru: "Япония", ky: "Япония", en: "Japan" },
    countryFlag: "🇯🇵",
    crop: { source: "row2", col: 0, row: 0 },
  },
  {
    id: "kainar-kamalov",
    name: {
      ru: "Кайнар Камалов",
      ky: "Кайнар Камалов",
      en: "Kainar Kamalov",
    },
    role: {
      ru: "Руководитель отдела продуктов · CloudX",
      ky: "Продуктулар бөлүмүнүн жетекчиси · CloudX",
      en: "Head of Product · CloudX",
    },
    topic: {
      ru: "Облачные инфраструктуры для государственных задач Центральной Азии",
      ky: "Борбордук Азиянын мамлекеттик милдеттери үчүн булут инфраструктуралары",
      en: "Cloud infrastructure for Central Asia's public-sector workloads",
    },
    country: { ru: "Кыргызстан", ky: "Кыргызстан", en: "Kyrgyzstan" },
    countryFlag: "🇰🇬",
    crop: { source: "row2", col: 1, row: 0 },
  },
  {
    id: "azamat-burzhuev",
    name: {
      ru: "Азамат Буржуев",
      ky: "Азамат Буржуев",
      en: "Azamat Burzhuev",
    },
    role: {
      ru: "Эксперт в сфере GovTech · Цифровая трансформация",
      ky: "GovTech жаатындагы эксперт · Санариптик трансформация",
      en: "GovTech expert · Digital transformation",
    },
    topic: {
      ru: "Цифровизация государственных услуг Кыргызстана: следующие 100 сервисов",
      ky: "Кыргызстандын мамлекеттик кызматтарын санариптештирүү: кийинки 100 кызмат",
      en: "Digitalising Kyrgyzstan's public services: the next 100 services",
    },
    country: { ru: "Кыргызстан", ky: "Кыргызстан", en: "Kyrgyzstan" },
    countryFlag: "🇰🇬",
    crop: { source: "row2", col: 2, row: 0 },
  },
  {
    id: "amy-peck",
    name: {
      ru: "Эми Пэк",
      ky: "Эми Пэк",
      en: "Amy Peck",
    },
    role: {
      ru: "Основатель и генеральный директор EndeavorXR",
      ky: "EndeavorXRдын негиздөөчүсү жана башкы директору",
      en: "Founder and CEO of EndeavorXR",
    },
    topic: {
      ru: "XR и иммерсивные технологии для государственного и образовательного секторов",
      ky: "Мамлекеттик жана билим берүү сектору үчүн XR жана иммерсивдик технологиялар",
      en: "XR and immersive technology for the public and education sectors",
    },
    country: { ru: "США", ky: "АКШ", en: "USA" },
    countryFlag: "🇺🇸",
    crop: { source: "row2", col: 0, row: 1 },
  },
  {
    id: "aizhan-alisherova",
    name: {
      ru: "Айжан Алишерова-Дуймаз",
      ky: "Айжан Алишерова-Дуймаз",
      en: "Aizhan Alisherova-Duymaz",
    },
    role: {
      ru: "Сооснователь Startup Lab 119 · Директор WeFund",
      ky: "Startup Lab 119дун тең негиздөөчүсү · WeFundдун директору",
      en: "Co-founder of Startup Lab 119 · Director of WeFund",
    },
    topic: {
      ru: "Женское предпринимательство и фонды Кыргызстана: следующий цикл",
      ky: "Аялдардын ишкердиги жана Кыргызстандын фонддору: кийинки цикл",
      en: "Women's entrepreneurship and Kyrgyzstan's funds: the next cycle",
    },
    country: { ru: "Кыргызстан", ky: "Кыргызстан", en: "Kyrgyzstan" },
    countryFlag: "🇰🇬",
    crop: { source: "row2", col: 1, row: 1 },
  },
  {
    id: "taalay-djumabaev",
    name: {
      ru: "Таалай Джумабаев",
      ky: "Таалай Жумабаев",
      en: "Taalay Djumabaev",
    },
    role: {
      ru: "Основатель и генеральный директор Growthhungry",
      ky: "Growthhungryнин негиздөөчүсү жана башкы директору",
      en: "Founder and CEO of Growthhungry",
    },
    topic: {
      ru: "Образовательный путь предпринимателя: как строится Growthhungry",
      ky: "Ишкердин билим алуу жолу: Growthhungry кантип курулууда",
      en: "The entrepreneur's learning path: how Growthhungry is being built",
    },
    country: { ru: "Кыргызстан", ky: "Кыргызстан", en: "Kyrgyzstan" },
    countryFlag: "🇰🇬",
    crop: { source: "row2", col: 2, row: 1 },
  },
];
