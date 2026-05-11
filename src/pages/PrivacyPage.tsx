import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { LangSwitcher } from "../components/ui/LangSwitcher";
import { useI18n } from "@/i18n/I18nProvider";

const sections = [
  { titleKey: "privacyPage.s1.title", bodyKey: "privacyPage.s1.body" },
  { titleKey: "privacyPage.s2.title", bodyKey: "privacyPage.s2.body" },
  { titleKey: "privacyPage.s3.title", bodyKey: "privacyPage.s3.body" },
  { titleKey: "privacyPage.s4.title", bodyKey: "privacyPage.s4.body" },
  { titleKey: "privacyPage.s5.title", bodyKey: "privacyPage.s5.body" },
  { titleKey: "privacyPage.s6.title", bodyKey: "privacyPage.s6.body" },
  { titleKey: "privacyPage.s7.title", bodyKey: "privacyPage.s7.body" },
];

export function PrivacyPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink flex flex-col">
      <header className="border-b border-line bg-canvas sticky top-0 z-40">
        <div className="container-edge flex h-[72px] items-center justify-between">
          <Logo />
          <LangSwitcher />
        </div>
      </header>

      <main className="flex-1 py-12 md:py-16">
        <div className="container-edge">
          <div className="max-w-[720px]">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 mb-8">
              <span aria-hidden className="h-px w-8 bg-brand/50 shrink-0" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-ink-soft">
                {t("privacyPage.eyebrow")}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-display font-medium text-ink leading-[0.95] tracking-tightest"
              style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}
            >
              {t("privacyPage.title")}
            </h1>

            <p className="mt-3 font-mono text-[11px] tracking-[0.16em] uppercase text-ink-soft">
              {t("privacyPage.updated")}
            </p>

            {/* Intro */}
            <p className="mt-8 text-[15px] leading-[1.65] text-ink border-l-2 border-brand/30 pl-4">
              {t("privacyPage.intro")}
            </p>

            {/* Sections */}
            <div className="mt-10 flex flex-col gap-8">
              {sections.map((s) => (
                <section key={s.titleKey}>
                  <h2 className="font-display font-medium text-[16px] md:text-[18px] tracking-tight text-ink mb-3">
                    {t(s.titleKey)}
                  </h2>
                  <p className="text-[14px] md:text-[15px] leading-[1.7] text-ink-soft">
                    {t(s.bodyKey)}
                  </p>
                </section>
              ))}
            </div>

            {/* Back link */}
            <div className="mt-12 pt-8 border-t border-line">
              <Link
                to="/"
                className="group inline-flex items-center gap-2.5 rounded-xl border border-line px-4 py-2.5 text-[13px] font-medium text-ink hover:border-brand/40 hover:bg-surface active:scale-[0.98] transition-all duration-300"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-ink/8 transition-transform duration-300 group-hover:-translate-x-0.5">
                  <ArrowLeft size={11} strokeWidth={1.8} />
                </span>
                {t("privacyPage.back")}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="container-edge py-6 text-[12px] text-ink-soft flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <span>{t("privacyPage.footerCopyright")}</span>
          <span className="font-mono tracking-[0.18em] uppercase">
            {t("privacyPage.footerStatus")}
          </span>
        </div>
      </footer>
    </div>
  );
}
