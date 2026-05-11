import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/dictionaries";

interface Props {
  variant?: "inline" | "stack";
  surface?: "light" | "frosted";
}

const LABEL: Record<Locale, string> = { ru: "RU", ky: "KY", en: "EN" };

export function LangSwitcher({ variant = "inline", surface = "light" }: Props) {
  const { locale, setLocale, locales } = useI18n();

  const base =
    variant === "stack"
      ? "flex gap-1 rounded-md p-1"
      : "inline-flex items-center gap-px rounded-md p-0.5";

  const bgClass =
    surface === "frosted"
      ? "bg-white/60 backdrop-blur-md ring-1 ring-line"
      : "bg-surface ring-1 ring-line";

  return (
    <div
      className={`${base} ${bgClass}`}
      role="group"
      aria-label="Language switcher"
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={active}
            className={`px-2.5 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase font-mono rounded-sm transition-all duration-300 ease-out ${
              active
                ? "bg-ink text-white shadow-soft"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {LABEL[l]}
          </button>
        );
      })}
    </div>
  );
}
