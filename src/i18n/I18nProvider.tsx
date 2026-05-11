import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, LOCALES, type Locale } from "./dictionaries";

export type Localized<T = string> = { ru: T; ky?: T; en?: T };

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  tr: <T>(v: Localized<T>) => T;
  locales: readonly Locale[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "kit-forum-locale";

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return "ru";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && LOCALES.includes(stored)) return stored;
  return "ru";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, locale);
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const t = useCallback(
    (key: string) => {
      const current = dictionaries[locale];
      if (current && current[key]) return current[key];
      return dictionaries.ru[key] ?? key;
    },
    [locale],
  );

  const tr = useCallback(
    <T,>(v: Localized<T>): T => v[locale] ?? v.ru,
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, tr, locales: LOCALES }),
    [locale, setLocale, t, tr],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
