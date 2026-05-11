import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { LiveBadge } from "../ui/LiveBadge";

/**
 * Editorial hero — 16:9 video that plays once and dissolves into the hero
 * background via a feathered radial mask. No hard frame: the video reads as
 * an organic part of the dark hero block, not a contained panel.
 *
 * Plays once; pauses on its final frame (intentional pause-on-end behavior
 * to keep the closing image visible without re-loop fatigue).
 *
 * iOS Safari: `muted + playsInline` are required for autoplay without a
 * user gesture.
 */

const ease = [0.16, 1, 0.3, 1] as const;

// 32px-wide blurred preview of the hero video's closing frame (~200 bytes).
// Paints instantly with the HTML, before any network request resolves —
// avoids the dark void on slow connections while poster.webp loads.
const LQIP_DATA_URI =
  "data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAACQBQCdASogABIAPtFUokuoJKMhsAgBABoJbACdMoR9H5negAhvAjMzjaHI7U7XjlxpsxhcAAD+0Nz6pQShBICnu4JZp48zUIiAhhZ8sPASAex/k48R8Gol0f6nJJ+UxtT/TOaaYJIQ8d6N5VN0nV4/YtTffQFEBE/9YGb5XMxw3DxH9jol2NXQN2cGEqPq6Q/Ax+rpD8lJdsvZOuc+PK8+EFhqWQzi7pU9Y60x1dIAAA==";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onReady = () => setVideoLoaded(true);
    const onEnded = () => {
      // Keep last frame visible — `pause` is implicit at end without loop,
      // but force currentTime to just before duration so iOS doesn't snap back.
      try {
        v.currentTime = Math.max(0, (v.duration || 0) - 0.05);
      } catch {
        /* noop */
      }
      setVideoEnded(true);
    };

    if (v.readyState >= 2) onReady();
    v.addEventListener("canplay", onReady, { once: true });
    v.addEventListener("loadeddata", onReady, { once: true });
    v.addEventListener("ended", onEnded);

    if (prefersReduced) {
      v.pause();
    } else {
      v.play().catch(() => {
        /* some browsers refuse silently; the poster fallback covers it */
      });
    }

    return () => {
      v.removeEventListener("canplay", onReady);
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("ended", onEnded);
    };
  }, [prefersReduced]);

  return (
    <section
      id="hero"
      aria-label="КИТ Форум 2026"
      className="relative bg-ink text-white overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 540px at 50% 10%, rgba(0,102,255,0.18), transparent 60%), radial-gradient(700px 420px at 80% 95%, rgba(0,212,255,0.16), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 blueprint-bg-dark pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 blueprint-bg-dark-fine opacity-50 pointer-events-none"
      />

      <div className="container-edge relative flex min-h-[100dvh] flex-col pt-20 md:pt-28 pb-8 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="inline-flex items-center gap-3 min-w-0">
            <span aria-hidden className="h-px w-8 sm:w-12 bg-brand-glow/60 shrink-0" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-white/85 truncate">
              <span className="text-brand-glow mr-2">01</span>
              Кыргызская Республика · 2026
            </span>
          </div>
          <LiveBadge tone="dark">Live · 04.06.2026</LiveBadge>
        </motion.div>

        <div className="mt-6 md:mt-6 flex-1 flex flex-col justify-center min-h-0">
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
            className="font-display font-medium text-white leading-[0.92] tracking-tightest text-balance"
            style={{
              fontSize: "clamp(2.25rem, 9vw, 6.5rem)",
              textShadow: "0 4px 40px rgba(10,22,40,0.45)",
            }}
          >
            КИТ&nbsp;ФОРУМ
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.2 }}
            className="mt-5 md:mt-7 mx-auto w-full max-w-[1280px]"
          >
            <div
              className="relative aspect-video w-full"
              style={{
                maskImage:
                  "radial-gradient(ellipse 90% 80% at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 90% 80% at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0) 100%)",
              }}
            >
              {/* Instant blurred LQIP (~200 bytes inline) — paints before any network */}
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

              {/* Crisp WebP poster — small (~90KB) and shown before video frames arrive */}
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
                autoPlay
                playsInline
                preload="auto"
                poster="/videos/poster.webp"
                aria-hidden
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
                  videoLoaded ? "opacity-100" : "opacity-0"
                } ${videoEnded ? "saturate-[1.05]" : ""}`}
              >
                {/* Mobile / narrow viewports: ~650KB mp4 and ~990KB webm */}
                <source
                  media="(max-width: 768px)"
                  src="/videos/3-mobile.mp4"
                  type="video/mp4"
                />
                <source
                  media="(max-width: 768px)"
                  src="/videos/3-mobile.webm"
                  type="video/webm"
                />
                {/* Desktop / wide: prefer mp4 first (smaller H.264 here than VP9) */}
                <source src="/videos/3.mp4" type="video/mp4" />
                <source src="/videos/3.webm" type="video/webm" />
              </video>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 md:mt-8 grid grid-cols-12 gap-y-6 md:gap-6 items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.45 }}
            className="col-span-12 md:col-span-7 lg:col-span-6 min-w-0"
          >
            <p className="text-balance text-[15px] md:text-[17px] leading-[1.55] text-white/80 max-w-[40rem]">
              Крупнейшее событие в сфере цифровых технологий и инноваций
              Центральной Азии. С 2010 года формирует повестку отрасли на
              государственном уровне.
            </p>

            <div className="mt-5 md:mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="#contacts"
                className="group inline-flex items-center justify-between sm:justify-start gap-3 rounded-xl bg-brand px-5 py-3.5 text-[14px] font-medium text-white shadow-glow hover:bg-brand-deep active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                Зарегистрироваться
                <span
                  aria-hidden
                  className="grid h-7 w-7 place-items-center rounded-md bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5"
                >
                  <ArrowRight size={14} strokeWidth={1.6} />
                </span>
              </a>
              <a
                href="#program"
                className="group inline-flex items-center justify-between sm:justify-start gap-3 rounded-xl border border-white/25 px-5 py-3.5 text-[14px] font-medium text-white hover:border-white/45 hover:bg-white/[0.06] active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                Программа форума
                <span
                  aria-hidden
                  className="grid h-7 w-7 place-items-center rounded-md border border-white/25 transition-transform duration-500 ease-spring group-hover:translate-x-0.5"
                >
                  <ArrowRight size={14} strokeWidth={1.6} />
                </span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
            className="col-span-12 md:col-span-5 lg:col-span-6 md:text-right min-w-0"
          >
            <div className="flex flex-col gap-2 border-t border-white/15 pt-4 font-mono text-[10px] tracking-[0.16em] sm:tracking-[0.2em] uppercase text-white/80">
              <span>4–5 июня 2026 · Бишкек</span>
              <span>МУК · ул. Льва Толстого, 1 (17Б)</span>
              <span className="text-white">
                <span className="text-brand-glow mr-1.5">▸</span>
                Организатор · ПВТ КР
              </span>
            </div>
          </motion.div>
        </div>

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.9 }}
          aria-label="Прокрутить вниз"
          className="group mt-6 md:mt-8 inline-flex self-start items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors duration-300"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md border border-white/20 group-hover:border-white/50 transition-colors duration-300">
            <ChevronDown
              size={14}
              strokeWidth={1.5}
              className="animate-chevron-bob"
            />
          </span>
          Скрольте чтобы продолжить
        </motion.a>
      </div>
    </section>
  );
}
