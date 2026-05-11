import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { LangSwitcher } from "../components/ui/LangSwitcher";
import { useI18n } from "@/i18n/I18nProvider";

export function SpeakersPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-[100dvh] bg-canvas text-ink flex flex-col">
      <header className="border-b border-line">
        <div className="container-edge flex h-[72px] items-center justify-between">
          <Logo />
          <LangSwitcher />
        </div>
      </header>

      <main className="flex-1 grid place-items-center px-6 py-24">
        <div className="text-center max-w-[640px]">
          <span className="eyebrow justify-center inline-flex">
            <span className="h-px w-8 bg-ink-soft/40" aria-hidden />
            {t("speakersPage.eyebrow")}
          </span>
          <h1 className="mt-6 font-display font-medium text-ink leading-[1.02] tracking-tightest text-[clamp(2.5rem,4vw+1rem,4.5rem)] text-balance">
            {t("speakersPage.titleA")}<br />{t("speakersPage.titleB")}
          </h1>
          <p className="mt-7 lead text-balance mx-auto max-w-[520px]">
            {t("speakersPage.lead")}
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-ink px-6 py-3.5 text-[14px] font-medium text-white hover:bg-brand active:scale-[0.98] transition-all duration-300 ease-spring"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-spring group-hover:-translate-x-0.5">
                <ArrowLeft size={14} strokeWidth={1.6} />
              </span>
              {t("speakersPage.back")}
            </Link>
            <a
              href="/#contacts"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-[14px] font-medium text-ink hover:border-ink/40 hover:bg-surface active:scale-[0.98] transition-all duration-300 ease-spring"
            >
              {t("speakersPage.contact")}
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="container-edge py-6 text-[12px] text-ink-soft flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <span>{t("speakersPage.footerCopyright")}</span>
          <span className="font-mono tracking-[0.18em] uppercase">
            {t("speakersPage.footerStatus")}
          </span>
        </div>
      </footer>
    </div>
  );
}
