import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, Loader2 } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { LangSwitcher } from "../components/ui/LangSwitcher";
import { useI18n, type Localized } from "@/i18n/I18nProvider";
import { supabase } from "@/lib/supabase";

type PressRelease = {
  id: string;
  date: string;
  tag: string;
  title: Localized<string>;
  lead: Localized<string>;
};

const tagKey = (tag: string) => `pressPage.tag.${tag}`;

const tagColors: Record<string, string> = {
  announcement: "bg-brand/10 text-brand",
  speakers: "bg-emerald-50 text-emerald-700",
  partners: "bg-violet-50 text-violet-700",
  program: "bg-amber-50 text-amber-700",
  media: "bg-sky-50 text-sky-700",
};

export function PressPage() {
  const { t, tr } = useI18n();
  const [releases, setReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("press_releases")
      .select("id, date_label, tag, title, lead, order_index")
      .eq("is_visible", true)
      .order("order_index", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setReleases(
            data.map((r) => ({
              id: r.id,
              date: r.date_label,
              tag: r.tag,
              title: r.title as Localized<string>,
              lead: r.lead as Localized<string>,
            })),
          );
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink flex flex-col">
      <header className="border-b border-line bg-canvas sticky top-0 z-40">
        <div className="container-edge flex h-[72px] items-center justify-between">
          <Logo />
          <LangSwitcher />
        </div>
      </header>

      {/* Page header */}
      <div className="border-b border-line bg-surface">
        <div className="container-edge py-12 md:py-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span aria-hidden className="h-px w-8 bg-brand/50 shrink-0" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-ink-soft">
              {t("pressPage.eyebrow")}
            </span>
          </div>

          <h1
            className="font-display font-medium text-ink leading-[0.95] tracking-tightest text-balance"
            style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
          >
            {t("pressPage.titleA")}
            <br />
            {t("pressPage.titleB")}
          </h1>

          <p className="mt-5 max-w-[42rem] text-[15px] md:text-[16px] leading-[1.55] text-ink-soft">
            {t("pressPage.lead")}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5 rounded-xl border border-line bg-canvas px-4 py-2.5 text-[13px] font-medium text-ink hover:border-ink/30 active:scale-[0.98] transition-all duration-300"
            >
              <ArrowLeft size={13} strokeWidth={1.6} />
              {t("pressPage.back")}
            </Link>
            <a
              href="mailto:pr@htp.kg"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-brand px-4 py-2.5 text-[13px] font-medium text-white hover:bg-brand-deep active:scale-[0.98] transition-all duration-300"
            >
              <Mail size={13} strokeWidth={1.6} />
              {t("pressPage.contact")}
            </a>
          </div>
        </div>
      </div>

      {/* Press releases */}
      <main className="flex-1 py-10 md:py-14">
        <div className="container-edge">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-brand" />
            </div>
          ) : releases.length === 0 ? (
            <p className="text-center text-ink-soft text-sm py-16">
              {t("pressPage.empty")}
            </p>
          ) : (
            <div className="flex flex-col gap-6 max-w-[800px]">
              {releases.map((pr) => (
                <article
                  key={pr.id}
                  className="group rounded-2xl border border-line bg-surface hover:border-brand/25 hover:shadow-sm transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-[0.14em] uppercase font-medium ${
                          tagColors[pr.tag] ?? "bg-surface text-ink-soft"
                        }`}
                      >
                        {t(tagKey(pr.tag))}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.14em] text-ink-soft">
                        {pr.date}
                      </span>
                    </div>

                    <h2 className="font-display font-medium text-[18px] md:text-[20px] leading-snug tracking-tight text-ink text-balance">
                      {tr(pr.title)}
                    </h2>

                    <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft line-clamp-3">
                      {tr(pr.lead)}
                    </p>

                    <div className="mt-5 pt-4 border-t border-line">
                      <a
                        href="/#contacts"
                        className="group/btn inline-flex items-center gap-2 text-[13px] font-medium text-brand hover:text-brand-deep transition-colors duration-200"
                      >
                        {t("pressPage.readMore")}
                        <ArrowRight
                          size={13}
                          strokeWidth={1.6}
                          className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                        />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="container-edge py-6 text-[12px] text-ink-soft flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <span>{t("pressPage.footerCopyright")}</span>
          <span className="font-mono tracking-[0.18em] uppercase">
            {t("pressPage.footerStatus")}
          </span>
        </div>
      </footer>
    </div>
  );
}
