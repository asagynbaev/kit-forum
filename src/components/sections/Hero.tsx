import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, RotateCcw } from "lucide-react";
import { LiveBadge } from "../ui/LiveBadge";
import { useI18n } from "@/i18n/I18nProvider";
import { onLoaderDone } from "@/lib/loaderState";

const ease = [0.16, 1, 0.3, 1] as const;

const LQIP_DATA_URI =
  "data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAACQBQCdASogABIAPtFUokuoJKMhsAgBABoJbACdMoR9H5negAhvAjMzjaHI7U7XjlxpsxhcAAD+0Nz6pQShBICnu4JZp48zUIiAhhZ8sPASAex/k48R8Gol0f6nJJ+UxtT/TOaaYJIQ8d6N5VN0nV4/YtTffQFEBE/9YGb5XMxw3DxH9jol2NXQN2cGEqPq6Q/Ax+rpD8lJdsvZOuc+PK8+EFhqWQzi7pU9Y60x1dIAAA==";

// Forum opens 4 June 2026 09:00 Bishkek time (UTC+6)
const FORUM_DATE = new Date("2026-06-04T03:00:00Z");

function getTimeLeft() {
  const diff = FORUM_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function useCountdown() {
  const [left, setLeft] = useState(getTimeLeft);
  useEffect(() => {
    const id = setInterval(() => setLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const stats = [
  { value: "2 500+", labelKey: "hero.stat.participants" },
  { value: "16", labelKey: "hero.stat.years" },
  { value: "25+", labelKey: "hero.stat.countries" },
] as const;

export function Hero() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const prefersReduced = useReducedMotion();
  const countdown = useCountdown();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onReady = () => setVideoLoaded(true);
    const onEnded = () => {
      try { v.currentTime = Math.max(0, (v.duration || 0) - 0.05); } catch { /* noop */ }
      setVideoEnded(true);
    };

    if (v.readyState >= 2) onReady();
    v.addEventListener("canplay", onReady, { once: true });
    v.addEventListener("loadeddata", onReady, { once: true });
    v.addEventListener("ended", onEnded);

    let unsub: (() => void) | undefined;
    if (!prefersReduced) {
      unsub = onLoaderDone(() => { v.play().catch(() => {}); });
    }

    return () => {
      v.removeEventListener("canplay", onReady);
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("ended", onEnded);
      unsub?.();
    };
  }, [prefersReduced]);

  const replay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setVideoEnded(false);
    try { v.currentTime = 0; } catch { /* noop */ }
    v.play().catch(() => setVideoEnded(true));
  }, []);

  return (
    <section
      id="hero"
      aria-label={t("hero.aria")}
      className="relative bg-ink text-white overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      <div aria-hidden className="absolute inset-0 blueprint-bg-dark pointer-events-none" />
      <div aria-hidden className="absolute inset-0 blueprint-bg-dark-fine opacity-50 pointer-events-none" />

      <div className="container-edge relative flex min-h-[100dvh] flex-col pt-20 md:pt-28 pb-8 md:pb-12">

        {/* ── Eyebrow row ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="inline-flex items-center gap-3 min-w-0">
            <span aria-hidden className="h-px w-8 sm:w-12 bg-brand-glow/60 shrink-0" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-white/85 truncate">
              <span className="text-brand-glow mr-2">{t("hero.eyebrowIndex")}</span>
              {t("hero.eyebrowText")}
            </span>
          </div>
          <LiveBadge tone="dark">{t("hero.liveBadge")}</LiveBadge>
        </motion.div>

        {/* ── Video block — title lives inside ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.08 }}
          className="mt-4 md:mt-5 relative w-full overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          {/* ── Gradient overlays replacing the CSS mask ── */}
          {/* Vertical: ink at top (title bg) → clear middle → ink at bottom (merge into bg) */}
          <div
            aria-hidden
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,22,40,1) 0%, rgba(10,22,40,1) 8%, rgba(10,22,40,0.88) 22%, rgba(10,22,40,0.55) 36%, rgba(10,22,40,0.08) 52%, rgba(10,22,40,0.55) 76%, rgba(10,22,40,1) 100%)",
            }}
          />
          {/* Horizontal: sides fade to ink */}
          <div
            aria-hidden
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(10,22,40,0.72) 0%, transparent 18%, transparent 82%, rgba(10,22,40,0.72) 100%)",
            }}
          />

          {/* ── Media layers ── */}
          <img
            src={LQIP_DATA_URI}
            alt=""
            aria-hidden
            width={32}
            height={18}
            className={`absolute inset-0 h-full w-full object-cover scale-110 blur-xl transition-opacity duration-700 ${
              videoLoaded ? "opacity-0" : "opacity-100"
            }`}
          />
          <img
            src="/videos/poster.webp"
            alt=""
            aria-hidden
            width={1280}
            height={716}
            decoding="async"
            fetchPriority="high"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoLoaded ? "opacity-0" : "opacity-100"
            }`}
          />
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            poster="/videos/poster.webp"
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
              videoLoaded ? "opacity-100" : "opacity-0"
            } ${videoEnded ? "saturate-[1.05]" : ""}`}
          >
            <source media="(max-width: 768px)" src="/videos/3-mobile.mp4" type="video/mp4" />
            <source media="(max-width: 768px)" src="/videos/3-mobile.webm" type="video/webm" />
            <source src="/videos/3.mp4" type="video/mp4" />
            <source src="/videos/3.webm" type="video/webm" />
          </video>

          {/* ── Title overlaid in top gradient zone ── */}
          <div className="absolute inset-x-0 top-0 z-20 pt-5 sm:pt-7 md:pt-10 px-5 sm:px-7 md:px-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.18 }}
              className="font-display font-medium text-white leading-[0.92] tracking-tightest text-balance"
              style={{
                fontSize: "clamp(2.4rem, 9.5vw, 7rem)",
                textShadow: "0 4px 48px rgba(10,22,40,0.5)",
              }}
            >
              {t("hero.title").replace(" ", " ")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.3 }}
              className="mt-2.5 sm:mt-3 font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-white/50"
            >
              {t("hero.descriptor")}
            </motion.p>
          </div>

          {/* ── Replay button ── */}
          <AnimatePresence>
            {videoEnded && (
              <motion.button
                key="replay"
                type="button"
                onClick={replay}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.5, ease }}
                aria-label={t("cta.replayVideo")}
                className="group absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 inline-flex items-center gap-2.5 rounded-full bg-ink/80 px-4 sm:px-5 py-2.5 sm:py-3 text-[12px] sm:text-[13px] font-medium text-white ring-1 ring-white/15 backdrop-blur-md hover:bg-brand hover:ring-white/30 active:scale-[0.97] transition-all duration-300 ease-spring"
              >
                <span
                  aria-hidden
                  className="grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-full bg-white/15 transition-transform duration-700 ease-spring group-hover:-rotate-180"
                >
                  <RotateCcw size={13} strokeWidth={1.8} />
                </span>
                {t("cta.replayVideo")}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Stats strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.4 }}
          className="flex items-stretch divide-x divide-white/10 border-b border-white/10 pb-4 mt-1"
          aria-hidden
        >
          {stats.map((s) => (
            <div key={s.labelKey} className="flex flex-1 flex-col items-center gap-1 px-3 sm:px-5 pt-3.5">
              <span
                className="font-display font-medium text-white tabular-nums leading-none"
                style={{ fontSize: "clamp(1.2rem, 2.4vw, 1.75rem)" }}
              >
                {s.value}
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-white/40 text-center">
                {t(s.labelKey)}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Bottom row: lead + CTAs / countdown + meta ── */}
        <div className="mt-5 md:mt-6 grid grid-cols-12 gap-y-6 md:gap-6 items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.48 }}
            className="col-span-12 md:col-span-7 lg:col-span-6 min-w-0"
          >
            <p className="text-balance text-[15px] md:text-[17px] leading-[1.55] text-white/80 max-w-[40rem]">
              {t("hero.lead")}
            </p>
            <div className="mt-5 md:mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="#contacts"
                className="group inline-flex items-center justify-between sm:justify-start gap-3 rounded-xl bg-brand px-5 py-3.5 text-[14px] font-medium text-white shadow-glow hover:bg-brand-deep active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                {t("cta.register")}
                <span aria-hidden className="grid h-7 w-7 place-items-center rounded-md bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
                  <ArrowRight size={14} strokeWidth={1.6} />
                </span>
              </a>
              <a
                href="#program"
                className="group inline-flex items-center justify-between sm:justify-start gap-3 rounded-xl border border-white/25 px-5 py-3.5 text-[14px] font-medium text-white hover:border-white/45 hover:bg-white/[0.06] active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                {t("cta.program")}
                <span aria-hidden className="grid h-7 w-7 place-items-center rounded-md border border-white/25 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
                  <ArrowRight size={14} strokeWidth={1.6} />
                </span>
              </a>
            </div>
          </motion.div>

          {/* ── Countdown + venue meta ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.62 }}
            className="col-span-12 md:col-span-5 lg:col-span-6 md:text-right min-w-0"
          >
            <div className="flex flex-col gap-2 border-t border-white/15 pt-4 font-mono uppercase">
              <div className="flex md:justify-end items-baseline gap-2 flex-wrap">
                <span className="text-[9px] sm:text-[10px] tracking-[0.18em] text-white/40">
                  {t("hero.countdown.label")} ·
                </span>
                {countdown ? (
                  <span className="text-white tabular-nums tracking-[0.04em]"
                    style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.25rem)" }}>
                    <span style={{ fontSize: "clamp(1.1rem, 2.6vw, 1.5rem)" }}>
                      {pad(countdown.days)}
                    </span>
                    <span className="text-white/35 mx-0.5" style={{ fontSize: "0.65em" }}>
                      {t("hero.countdown.days")}
                    </span>
                    {" "}{pad(countdown.hours)}
                    <span className="text-white/30">:</span>
                    {pad(countdown.minutes)}
                    <span className="text-white/30">:</span>
                    {pad(countdown.seconds)}
                  </span>
                ) : (
                  <span className="text-brand-glow text-[11px] tracking-[0.16em]">
                    {t("hero.countdown.started")}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-[0.16em] sm:tracking-[0.2em] text-white/55">
                {t("hero.venueLine")}
              </span>
              <span className="text-[10px] tracking-[0.16em] sm:tracking-[0.2em] text-white">
                <span className="text-brand-glow mr-1.5">▸</span>
                {t("hero.organizerLine")}
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Scroll hint ── */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.9 }}
          aria-label={t("hero.scrollAria")}
          className="group mt-6 md:mt-8 inline-flex self-start items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors duration-300"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md border border-white/20 group-hover:border-white/50 transition-colors duration-300">
            <ChevronDown size={14} strokeWidth={1.5} className="animate-chevron-bob" />
          </span>
          {t("hero.scrollHint")}
        </motion.a>
      </div>
    </section>
  );
}
