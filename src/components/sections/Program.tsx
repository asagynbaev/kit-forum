import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { trackColor, type SessionSlot, type Track } from "@/data/program";
import { useProgramDays } from "@/lib/useSupabaseData";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { LiveBadge } from "../ui/LiveBadge";
import { useI18n } from "@/i18n/I18nProvider";

const trackOrder: Track[] = ["ai", "gov", "startup", "edu", "security"];

export function Program() {
  const { t, tr } = useI18n();
  const [dayIdx, setDayIdx] = useState(0);
  const [active, setActive] = useState<Track[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();
  const { programDays, loading } = useProgramDays();

  const day = programDays[dayIdx];

  const filtered = useMemo(() => {
    if (!day) return [];
    if (active.length === 0) return day.sessions;
    return day.sessions.map((s) => ({
      ...s,
      _muted: !active.includes(s.track) && s.type !== "break",
    }));
  }, [day, active]);

  const toggleTrack = (tk: Track) => {
    setActive((prev) =>
      prev.includes(tk) ? prev.filter((x) => x !== tk) : [...prev, tk],
    );
  };

  return (
    <section
      id="program"
      className="v-section relative bg-surface/70 border-y border-brand/20 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 blueprint-bg-faded pointer-events-none"
      />
      <div className="container-edge relative">
        <SectionHeader
          eyebrow={t("program.eyebrow")}
          title={
            <>
              {t("program.titleA")}<br /> {t("program.titleB")} <span className="text-brand">{t("program.titleC")}</span>{t("program.titleD")}
            </>
          }
          description={<>{t("program.lead")}</>}
          rightSlot={
            <div className="flex flex-col items-end gap-3 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
              <LiveBadge>{t("program.updatedBadge")}</LiveBadge>
              <span className="tabular tnums">{t("program.version")}</span>
            </div>
          }
        />

        <Reveal delay={0.1}>
          <div className="mt-12 md:mt-14 overflow-x-auto scrollbar-none">
            <div
              role="tablist"
              aria-label={t("program.tabsAria")}
              className="inline-flex border-b border-line min-w-max"
            >
              {loading && (
                <div className="flex gap-4 pb-3">
                  <div className="h-8 w-28 rounded bg-surface animate-pulse" />
                  <div className="h-8 w-28 rounded bg-surface animate-pulse" />
                </div>
              )}
              {programDays.map((d, i) => {
                const sel = dayIdx === i;
                return (
                  <button
                    key={d.date}
                    role="tab"
                    aria-selected={sel}
                    aria-controls={`day-panel-${i}`}
                    id={`day-tab-${i}`}
                    type="button"
                    onClick={() => {
                      setDayIdx(i);
                      setExpanded(null);
                    }}
                    className={`relative px-4 sm:px-6 py-3 sm:py-4 text-[13px] sm:text-[14px] font-medium transition-colors duration-300 whitespace-nowrap ${
                      sel ? "text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    <span className="relative inline-flex items-center gap-2 sm:gap-3">
                      <span className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-60">
                        0{i + 1}
                      </span>
                      {tr(d.label)}
                    </span>
                    {sel && (
                      <motion.span
                        layoutId="day-underline"
                        className="absolute -bottom-px left-0 right-0 h-[2px] bg-brand"
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 30,
                        }}
                        aria-hidden
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft mr-2">
              {t("program.tracksLabel")}
            </span>
            {trackOrder.map((tk) => {
              const sel = active.includes(tk);
              return (
                <button
                  key={tk}
                  type="button"
                  onClick={() => toggleTrack(tk)}
                  className={`inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-[12px] font-medium transition-all duration-300 ease-spring ${
                    sel
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-ink-soft hover:text-ink hover:border-ink/40"
                  }`}
                  aria-pressed={sel}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-sm"
                    style={{ backgroundColor: trackColor[tk] }}
                  />
                  {t(`program.track.${tk}`)}
                </button>
              );
            })}
            {active.length > 0 && (
              <button
                type="button"
                onClick={() => setActive([])}
                className="ml-1 text-[12px] underline-offset-4 hover:underline text-ink-soft hover:text-ink transition-colors duration-300"
              >
                {t("cta.reset")}
              </button>
            )}
          </div>
        </Reveal>

        <div
          id={`day-panel-${dayIdx}`}
          role="tabpanel"
          aria-labelledby={`day-tab-${dayIdx}`}
          className="mt-12"
        >
          {loading || !day ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-surface animate-pulse" />
              ))}
            </div>
          ) : null}
          <AnimatePresence mode="wait">
            {day && <motion.div
              key={day.date}
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-8 md:pl-0"
            >
              <div className="absolute left-2 top-2 bottom-2 w-px bg-line md:hidden" />
              <ol className="space-y-3">
                {filtered.map((session, idx) => (
                  <TimelineRow
                    key={session.id}
                    session={session as SessionSlot & { _muted?: boolean }}
                    expanded={expanded === session.id}
                    onToggle={() =>
                      setExpanded((e) => (e === session.id ? null : session.id))
                    }
                    index={idx}
                  />
                ))}
              </ol>
            </motion.div>}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function TimelineRow({
  session,
  expanded,
  onToggle,
  index,
}: {
  session: SessionSlot & { _muted?: boolean };
  expanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const { t, tr } = useI18n();
  const isBreak = session.type === "break";
  const isCeremony = session.type === "ceremony";
  const isOpening = isCeremony || session.type === "keynote";
  const tColor = trackColor[session.track];

  if (isBreak) {
    return (
      <li
        className={`grid grid-cols-[64px_1fr] sm:grid-cols-[80px_1fr] md:grid-cols-[140px_1fr] items-center gap-3 sm:gap-4 md:gap-8 rounded-xl border border-dashed border-line px-4 md:px-6 py-3.5 sm:py-4 text-ink-soft transition-opacity duration-300 ${
          session._muted ? "opacity-35" : ""
        }`}
      >
        <span className="font-mono text-[11px] sm:text-[12px] tabular tnums tracking-tight">
          {session.start}–{session.end}
        </span>
        <span className="text-[13px] sm:text-[14px] tracking-tight">
          {tr(session.title)}
        </span>
      </li>
    );
  }

  return (
    <li
      className={`relative transition-opacity duration-500 ${
        session._muted ? "opacity-30" : ""
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`session-${session.id}-detail`}
        className={`group block w-full text-left rounded-2xl border bg-white px-4 sm:px-5 md:px-8 py-5 sm:py-6 md:py-7 transition-all duration-500 ease-spring ${
          expanded
            ? "border-ink/40 shadow-lift"
            : "border-line shadow-soft hover:shadow-lift hover:-translate-y-0.5 hover:border-ink/20"
        }`}
      >
        <div className="grid grid-cols-[64px_1fr_36px] sm:grid-cols-[80px_1fr_40px] md:grid-cols-[148px_1fr_auto] items-start gap-3 sm:gap-4 md:gap-8">
          <div className="flex flex-col items-start">
            <span className="font-mono text-[11px] sm:text-[12px] md:text-[13px] tabular tnums tracking-tight text-ink">
              {session.start}
            </span>
            <span className="mt-1 font-mono text-[10px] tabular tnums tracking-[0.1em] text-ink-soft">
              — {session.end}
            </span>
            {session.hall && (
              <span className="mt-3 hidden md:inline-flex font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft">
                {tr(session.hall)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-sm px-2 sm:px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] uppercase"
                style={{
                  color: tColor,
                  backgroundColor: `${tColor}14`,
                }}
              >
                <span
                  aria-hidden
                  className="h-1 w-1 rounded-full"
                  style={{ backgroundColor: tColor }}
                />
                {t(`program.type.${session.type}`)}
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft">
                {t("program.trackPrefix")} · {t(`program.track.${session.track}`)}
              </span>
              {isOpening && (
                <span className="hidden sm:inline-flex font-mono text-[10px] tracking-[0.18em] uppercase text-brand">
                  {t("program.mainHall")}
                </span>
              )}
            </div>

            <h3 className="mt-3 font-display font-medium text-ink leading-tight tracking-tightest text-[clamp(1.05rem,1vw+0.85rem,1.5rem)] text-balance break-words">
              {tr(session.title)}
            </h3>

            {session.speakers && (
              <p className="mt-2.5 text-[13px] leading-snug text-ink-soft">
                {tr(session.speakers)}
              </p>
            )}
          </div>

          <span
            aria-hidden
            className={`mt-1 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border transition-all duration-500 ease-spring shrink-0 ${
              expanded
                ? "border-ink bg-ink text-white rotate-180"
                : "border-line text-ink-soft group-hover:border-ink/40 group-hover:text-ink"
            }`}
          >
            {expanded ? <Minus size={14} strokeWidth={1.5} /> : <Plus size={14} strokeWidth={1.5} />}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id={`session-${session.id}-detail`}
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-[64px_1fr] sm:grid-cols-[80px_1fr] md:grid-cols-[148px_1fr] gap-3 sm:gap-4 md:gap-8 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-line">
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft">
                  №{String(index + 1).padStart(2, "0")}
                </div>
                <div className="space-y-4 text-[14px] sm:text-[15px] leading-[1.7] text-ink-soft md:max-w-[640px]">
                  {session.description && <p>{tr(session.description)}</p>}
                  {session.hall && (
                    <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-ink">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      {tr(session.hall)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </li>
  );
}
