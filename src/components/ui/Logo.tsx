import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  className?: string;
  variant?: "light" | "dark";
  hideText?: boolean;
}

export function Logo({ className, variant = "dark", hideText }: Props) {
  const { t, locale } = useI18n();
  // Brand wordmark stays in Russian (proper noun "КИТ Форум")
  // across all locales except English where we use the Latin variant.
  const brand = locale === "en" ? "KIT Forum" : "КИТ Форум";
  const subtitle = locale === "en" ? "2026 · Bishkek" : "2026 · Бишкек";
  return (
    <a
      href="#top"
      className={`group inline-flex items-center gap-3 ${className ?? ""}`}
      aria-label={t("nav.homeAria")}
    >
      <img
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 rounded-md transition-transform duration-500 ease-spring group-hover:rotate-[2deg]"
      />
      {!hideText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-display font-medium text-[15px] tracking-[-0.01em] ${
              variant === "light" ? "text-white" : "text-ink"
            }`}
          >
            {brand}
          </span>
          <span
            className={`mt-1 font-mono text-[10px] tracking-[0.2em] uppercase ${
              variant === "light" ? "text-white/70" : "text-ink-soft"
            }`}
          >
            {subtitle}
          </span>
        </div>
      )}
    </a>
  );
}
