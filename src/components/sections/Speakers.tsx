import { useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { type Speaker } from "@/data/speakers";
import { useSpeakers } from "@/lib/useSupabaseData";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { LiveBadge } from "../ui/LiveBadge";
import { useI18n } from "@/i18n/I18nProvider";

export function Speakers() {
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();
  const { speakers, loading } = useSpeakers();

  return (
    <section id="speakers" className="v-section relative bg-canvas">
      <div className="container-edge">
        <SectionHeader
          eyebrow={t("speakers.eyebrow")}
          title={
            <>
              {t("speakers.titleA")}<br />
              {t("speakers.titleB")} <span className="text-brand">{t("speakers.titleC")}</span>{t("speakers.titleD")}
            </>
          }
          description={<>{t("speakers.lead")}</>}
          rightSlot={
            <LiveBadge>
              {t("speakers.confirmedBadge").replace("{count}", String(speakers.length))}
            </LiveBadge>
          }
        />

        {loading ? (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
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
          <>
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
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

            <Reveal delay={0.15}>
              <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-brand/20 pt-10">
                <p className="max-w-[480px] text-[14px] text-ink-soft leading-relaxed">
                  {t("speakers.viewAllLead")}
                </p>
                <Link
                  to="/speakers"
                  className="group inline-flex items-center gap-3 rounded-xl border border-line bg-white px-5 py-3 text-[14px] font-medium text-ink hover:border-brand/50 hover:bg-tint active:scale-[0.98] transition-all duration-300 ease-spring"
                >
                  {t("cta.allSpeakers")}
                  <span className="grid h-7 w-7 place-items-center rounded-md border border-line text-ink-soft transition-all duration-500 ease-spring group-hover:border-brand/50 group-hover:text-brand group-hover:translate-x-0.5">
                    <ArrowUpRight size={14} strokeWidth={1.5} />
                  </span>
                </Link>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </section>
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
