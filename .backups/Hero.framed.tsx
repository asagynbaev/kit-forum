import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { LiveBadge } from "../ui/LiveBadge";
import { RegistrationMarks } from "../ui/RegistrationMarks";

/**
 * Editorial hero — 16:9 cinema-frame video on autoplay loop.
 *
 * Title above the frame, reveal stack below. No scroll scrubbing — just a
 * muted, looping clip. Mount animations stagger in over ~1.4s for a calm,
 * presidential reveal.
 *
 * iOS Safari: `muted + playsInline` are required for autoplay without a
 * user gesture.
 */

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onReady = () => setVideoLoaded(true);

    if (v.readyState >= 2) onReady();
    v.addEventListener("canplay", onReady, { once: true });
    v.addEventListener("loadeddata", onReady, { once: true });

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
            transition={{ duration: 1, ease, delay: 0.2 }}
            className="mt-5 md:mt-7 mx-auto w-full max-w-[1200px]"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink ring-1 ring-brand-glow/20 shadow-[0_30px_80px_-40px_rgba(0,212,255,0.35)]">
              <video
                ref={videoRef}
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
                poster="/videos/poster.svg"
                aria-hidden
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                  videoLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                <source src="/videos/3.mp4" type="video/mp4" />
              </video>

              {!videoLoaded && (
                <img
                  src="/videos/poster.svg"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,22,40,0) 0%, rgba(10,22,40,0.45) 100%)",
                }}
              />

              <RegistrationMarks tone="dark" inset={14} size={16} />
            </div>
          </motion.div>
        </div>

        <div className="mt-6 md:mt-8 grid grid-cols-12 gap-6 items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.45 }}
            className="col-span-12 md:col-span-7 lg:col-span-6"
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
            className="col-span-12 md:col-span-5 lg:col-span-6 md:text-right"
          >
            <div className="inline-flex flex-col gap-2 border-t border-white/15 pt-4 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-white/80">
              <span>4–5 июня 2026</span>
              <span>Бишкек · ул. Льва Толстого, 1/17Б</span>
              <span>2500+ участников · 50+ стран</span>
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
