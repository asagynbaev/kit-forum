import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { LangSwitcher } from "../ui/LangSwitcher";
import { LiveBadge } from "../ui/LiveBadge";
import { useI18n } from "@/i18n/I18nProvider";

const columns = [
  {
    titleKey: "footer.col.forum.title",
    links: [
      { labelKey: "footer.col.forum.link.program", href: "#program" },
      { labelKey: "footer.col.forum.link.speakers", href: "/speakers" },
      { labelKey: "footer.col.forum.link.partners", href: "#partners" },
    ],
  },
  {
    titleKey: "footer.col.participate.title",
    links: [
      { labelKey: "footer.col.participate.link.register", href: "#contacts" },
      { labelKey: "footer.col.participate.link.media", href: "mailto:pr@htp.kg" },
      { labelKey: "footer.col.participate.link.partner", href: "#contacts" },
      { labelKey: "footer.col.participate.link.speaker", href: "mailto:a.osmonalieva@htp.kg" },
    ],
  },
  {
    titleKey: "footer.col.info.title",
    links: [
      { labelKey: "footer.col.info.link.venue", href: "#venue" },
      { labelKey: "footer.col.info.link.route", href: "#venue" },
      { labelKey: "footer.col.info.link.archive", href: "/archive" },
      { labelKey: "footer.col.info.link.press", href: "/press" },
    ],
  },
];

// Fourth column (Contacts) has email/phone/address — kept literal (proper data).
const contactsColumn = {
  titleKey: "footer.col.contacts.title",
  links: [
    { id: "email-1", label: "e.nechaeva@htp.kg", href: "mailto:e.nechaeva@htp.kg" },
    { id: "email-2", label: "pr@htp.kg", href: "mailto:pr@htp.kg" },
    { id: "phone", label: "+996 550 077 091", href: "tel:+996550077091" },
    {
      id: "address",
      label: { ru: "Бишкек, ул. Льва Толстого, 1/17Б", ky: "Бишкек, Лев Толстой к., 1/17Б", en: "Bishkek, 1/17B Lev Tolstoy St." },
      href: "#venue",
    },
  ],
};

function ColLink({ href, children }: Readonly<{ href: string; children: React.ReactNode }>) {
  const cls = "text-[14px] text-ink hover:text-brand transition-colors duration-300";
  if (href.startsWith("/")) {
    return <Link to={href} className={cls}>{children}</Link>;
  }
  return <a href={href} className={cls}>{children}</a>;
}

export function Footer() {
  const { t, locale } = useI18n();
  return (
    <footer className="relative bg-surface text-ink overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 blueprint-bg-faded pointer-events-none"
      />
      <div className="container-edge relative pt-16 sm:pt-20 pb-10">
        <div className="mb-10 sm:mb-14 flex flex-wrap items-center justify-between gap-3 border-y border-brand/20 py-3.5 sm:py-4">
          <LiveBadge>{t("footer.liveBadge")}</LiveBadge>
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-ink-soft tabular tnums">
            42.8669°N · 74.5724°E
          </span>
          <span className="hidden sm:inline-flex font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
            {t("footer.versionBadge")}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-y-8 md:gap-10">
          <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
            <Logo />
            <p className="text-[14px] leading-relaxed text-ink-soft max-w-[360px]">
              {t("footer.tagline")}
            </p>
            <div className="border-t border-brand/20 pt-4">
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand">
                {t("footer.organizerLabel")}
              </div>
              <div className="mt-2 font-display text-ink text-[15px] leading-snug tracking-tightest font-medium">
                {t("footer.organizerName")}
              </div>
              <div className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
                {t("footer.eventLine")}
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {columns.map((col) => (
              <div key={col.titleKey}>
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
                  {t(col.titleKey)}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.labelKey}>
                      <ColLink href={link.href}>{t(link.labelKey)}</ColLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
                {t(contactsColumn.titleKey)}
              </div>
              <ul className="mt-4 space-y-2.5">
                {contactsColumn.links.map((link) => {
                  const label =
                    typeof link.label === "string"
                      ? link.label
                      : link.label[locale] ?? link.label.ru;
                  return (
                    <li key={link.id}>
                      <ColLink href={link.href}>{label}</ColLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-8 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <p className="text-[12px] leading-relaxed text-ink-soft max-w-[640px]">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/privacy"
              className="text-[12px] text-ink-soft hover:text-ink transition-colors duration-300"
            >
              {t("footer.privacy")}
            </Link>
            <LangSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
