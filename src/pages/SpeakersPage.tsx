import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Logo } from "../components/ui/Logo";
import { LangSwitcher } from "../components/ui/LangSwitcher";
import { Reveal } from "../components/ui/Reveal";
import { LiveBadge } from "../components/ui/LiveBadge";
import { useI18n } from "@/i18n/I18nProvider";
import { useSpeakers } from "@/lib/useSupabaseData";
import type { Speaker } from "@/data/speakers";

export function SpeakersPage() {
  const { t, tr } = useI18n();
  const { speakers, loading } = useSpeakers();
  const prefersReduced = useReducedMotion();

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="container-edge flex h-[72px] items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-[13px] font-medium text-ink-soft hover:border-ink/30 hover:text-ink transition-all duration-200"
            >
              <ArrowLeft size={13} strokeWidth={1.6} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              {t("speakersPage.back")}
            </Link>
            <span className="hidden sm:block h-4 w-px bg-line" />
            <Logo className="hidden sm:flex" />
          </div>
          <LangSwitcher />
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero band ── */}
        <section className="border-b border-line bg-surface">
          <div className="container-edge py-14 md:py-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-ink-soft/70">
                  <span aria-hidden className="h-px w-8 bg-ink-soft/40" />
                  {t("speakersPage.eyebrow")}
                </div>
                <h1
                  className="mt-5 font-display font-medium text-ink leading-[0.95] tracking-tightest"
                  style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}
                >
                  {t("speakersPage.titleA")}<br />
                  <span className="text-brand">{t("speakersPage.titleB")}</span>
                </h1>
                <p className="mt-5 max-w-[520px] text-[15px] leading-[1.6] text-ink-soft">
                  {t("speakersPage.lead")}
                </p>
              </div>
              <div className="shrink-0">
                <LiveBadge>
                  {loading
                    ? "..."
                    : `${speakers.length} ${t("speakers.confirmedBadge").replace("{count}", "").trim().split("·")[0].trim()}`}
                </LiveBadge>
              </div>
            </div>
          </div>
        </section>

        {/* ── Speakers grid ── */}
        <section className="container-edge py-14 md:py-20">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-2xl bg-surface" />
                  <div className="mt-5 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-surface" />
                    <div className="h-3 w-full rounded bg-surface" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {speakers.map((s, idx) => (
                <Reveal
                  key={s.id}
                  delay={prefersReduced ? 0 : (idx % 4) * 0.06 + Math.floor(idx / 4) * 0.04}
                  y={20}
                  className="group block"
                >
                  <SpeakerCard speaker={s} index={idx} />
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* ── Bottom CTA ── */}
        {!loading && (
          <section className="border-t border-line bg-surface">
            <div className="container-edge py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-[14px] text-ink-soft leading-relaxed max-w-[420px]">
                {t("speakers.viewAllLead")}
              </p>
              <a
                href="/#contacts"
                className="shrink-0 inline-flex items-center gap-3 rounded-xl border border-line bg-white px-5 py-3 text-[14px] font-medium text-ink hover:border-brand/50 hover:bg-tint active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                {t("speakersPage.contact")}
                <span className="grid h-7 w-7 place-items-center rounded-md border border-line text-ink-soft">
                  <ArrowUpRight size={14} strokeWidth={1.5} />
                </span>
              </a>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ── */}
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

function SpeakerCard({ speaker, index }: { speaker: Speaker; index: number }) {
  const { t, tr } = useI18n();

  return (
    <article className="group/card">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface ring-1 ring-brand/15">
        <img
          src={speaker.photo}
          alt={tr(speaker.name)}
          width={440}
          height={557}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-spring group-hover/card:scale-[1.04]"
        />
        <span aria-hidden className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/85 tabular tnums">
          SPK · {String(index + 1).padStart(2, "0")}
        </span>
        <span aria-hidden className="absolute top-3 right-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/85">
          {speaker.countryFlag}
        </span>
        <div
          aria-hidden
          className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-sm border border-brand/40 bg-white/90 px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase font-mono text-ink-soft backdrop-blur-md opacity-0 translate-y-1 transition-all duration-500 ease-spring group-hover/card:opacity-100 group-hover/card:translate-y-0"
        >
          <span>{tr(speaker.country)}</span>
          <span className="inline-flex items-center gap-1 text-brand">
            {t("speakers.cardCountryHint")}
            <ArrowUpRight size={12} strokeWidth={1.5} />
          </span>
        </div>
      </div>

      <div className="mt-5 pl-1">
        <div className="relative inline-block">
          <h3 className="font-display font-medium text-ink text-[17px] leading-snug tracking-tightest">
            {tr(speaker.name)}
          </h3>
          <span aria-hidden className="absolute -bottom-1.5 left-0 h-px w-0 bg-brand transition-all duration-700 ease-spring group-hover/card:w-full" />
        </div>
        <p className="mt-2 text-[13px] leading-snug text-ink-soft">{tr(speaker.role)}</p>
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-soft/85 line-clamp-2">{tr(speaker.topic)}</p>
      </div>
    </article>
  );
}
