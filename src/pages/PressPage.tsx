import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
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
  body: Localized<string> | null;
};

const tagKey = (tag: string) => `pressPage.tag.${tag}`;

const tagColors: Record<string, string> = {
  announcement: "bg-brand/10 text-brand",
  speakers: "bg-emerald-50 text-emerald-700",
  partners: "bg-violet-50 text-violet-700",
  program: "bg-amber-50 text-amber-700",
  media: "bg-sky-50 text-sky-700",
  insight: "bg-rose-50 text-rose-700",
  recap: "bg-teal-50 text-teal-700",
};

function hasBody(body: Localized<string> | null): boolean {
  if (!body) return false;
  return Boolean(body.ru?.trim() || body.ky?.trim() || body.en?.trim());
}

export function PressPage() {
  const { t, tr } = useI18n();
  const [releases, setReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase
      .from("press_releases")
      .select("id, date_label, tag, title, lead, body, order_index")
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
              body: r.body as Localized<string> | null,
            })),
          );
        }
        setLoading(false);
      });
  }, []);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
          </div>
        </div>
      </div>

      {/* Press releases */}
      <main className="flex-1 py-10 md:py-14">
        <div className="container-edge">
          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-brand" />
            </div>
          )}
          {!loading && releases.length === 0 && (
            <p className="text-center text-ink-soft text-sm py-16">
              {t("pressPage.empty")}
            </p>
          )}
          {!loading && releases.length > 0 && (
            <div className="flex flex-col gap-6 max-w-[800px]">
              {releases.map((pr) => {
                const isOpen = expanded.has(pr.id);
                const showBody = hasBody(pr.body);
                return (
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

                      <p
                        className={`mt-3 text-[14px] leading-[1.6] text-ink-soft ${
                          isOpen ? "" : "line-clamp-3"
                        }`}
                      >
                        {tr(pr.lead)}
                      </p>

                      {showBody && isOpen && pr.body && (
                        <div className="mt-4 text-[14px] leading-[1.7] text-ink space-y-3 whitespace-pre-line">
                          {tr(pr.body)}
                        </div>
                      )}

                      {showBody && (
                        <div className="mt-5 pt-4 border-t border-line">
                          <button
                            type="button"
                            onClick={() => toggle(pr.id)}
                            className="inline-flex items-center gap-2 text-[13px] font-medium text-brand hover:text-brand-deep transition-colors duration-200"
                            aria-expanded={isOpen}
                          >
                            {isOpen ? t("pressPage.collapse") : t("pressPage.readMore")}
                            <ChevronDown
                              size={14}
                              strokeWidth={1.6}
                              className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
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
