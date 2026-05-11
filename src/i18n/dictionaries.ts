export type Locale = "ru" | "ky" | "en";

export const LOCALES: readonly Locale[] = ["ru", "ky", "en"];

/**
 * RU is the only fully populated locale (default).
 * KY and EN inherit from RU at runtime — translation TODO.
 * Switching language is functional; copy will fall back to RU until KY/EN strings are written.
 */
export const dictionaries: Record<Locale, Record<string, string>> = {
  ru: {
    "nav.about": "О форуме",
    "nav.program": "Программа",
    "nav.speakers": "Спикеры",
    "nav.partners": "Партнёры",
    "nav.contacts": "Контакты",
    "cta.register": "Зарегистрироваться",
    "cta.program": "Программа форума",
    "cta.allSpeakers": "Все спикеры",
    "footer.rights": "Все права защищены",
    "footer.privacy": "Политика конфиденциальности",
  },
  ky: {
    // TODO: kyrgyz translation pending
  },
  en: {
    // TODO: english translation pending
  },
};
