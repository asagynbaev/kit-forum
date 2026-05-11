import type { Localized } from "@/i18n/I18nProvider";

export const venue = {
  name: {
    ru: "Международный Университет Кыргызстана",
    ky: "Кыргызстан Эл аралык университети",
    en: "International University of Kyrgyzstan",
  } as Localized,
  shortName: {
    ru: "МУК · Центральный кампус",
    ky: "КЭУ · Борбордук кампус",
    en: "IUK · Central Campus",
  } as Localized,
  addressLines: [
    {
      ru: "Кыргызская Республика, Бишкек",
      ky: "Кыргыз Республикасы, Бишкек",
      en: "Kyrgyz Republic, Bishkek",
    } as Localized,
    {
      ru: "ул. Льва Толстого, 1 (17Б)",
      ky: "Лев Толстой көчөсү, 1 (17Б)",
      en: "1 (17B) Lev Tolstoy Street",
    } as Localized,
    {
      ru: "Центральный кампус МУК",
      ky: "КЭУнун Борбордук кампусу",
      en: "IUK Central Campus",
    } as Localized,
  ],
  city: {
    ru: "Бишкек",
    ky: "Бишкек",
    en: "Bishkek",
  } as Localized,
  country: {
    ru: "Кыргызстан",
    ky: "Кыргызстан",
    en: "Kyrgyzstan",
  } as Localized,
  /** МУК, ул. Льва Толстого — 2GIS verified */
  coordinates: { lat: 42.866903, lng: 74.572381 } as { lat: number; lng: number },
  zoom: 16,
  /** Searchable destination string — used for Google Maps directions */
  googleQuery:
    "Международный+Университет+Кыргызстана+Бишкек+Льва+Толстого+17",
  details: [
    {
      id: "parking",
      title: {
        ru: "Парковка",
        ky: "Унаа токтотуучу жай",
        en: "Parking",
      } as Localized,
      body: {
        ru: "Парковка на территории кампуса и вдоль улицы Льва Толстого.",
        ky: "Кампустун аймагында жана Лев Толстой көчөсүнүн боюнда токтотуу мүмкүн.",
        en: "Parking is available on campus and along Lev Tolstoy Street.",
      } as Localized,
    },
    {
      id: "accreditation",
      title: {
        ru: "Аккредитация",
        ky: "Аккредитация",
        en: "Accreditation",
      } as Localized,
      body: {
        ru: "Открыта с 08:30 у главного входа. Бейдж получите по QR-приглашению.",
        ky: "08:30дан баштап башкы кириш жакта ачылат. Бейджти QR-чакыруу боюнча аласыз.",
        en: "Opens at 08:30 by the main entrance. Pick up your badge with the QR invitation.",
      } as Localized,
    },
    {
      id: "access",
      title: {
        ru: "Доступная среда",
        ky: "Жеткиликтүү чөйрө",
        en: "Accessibility",
      } as Localized,
      body: {
        ru: "Пандусы, лифты, аудио-петля в главном зале, перевод РУС / KY / EN.",
        ky: "Пандустар, лифттер, башкы залда аудио-петля, КЫР / РУС / ENG которуу.",
        en: "Ramps, lifts, induction loop in the main hall, RU / KY / EN interpretation.",
      } as Localized,
    },
  ],
};
