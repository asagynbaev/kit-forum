import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { markLoaderDone } from "@/lib/loaderState";

/**
 * Branded splash that holds the first paint until either the hero video can
 * play through or a generous timeout elapses — whichever comes first.
 *
 * Minimum display time prevents a flash on fast connections; the timeout
 * cap prevents the splash from feeling stuck on slow ones.
 */
const MIN_DISPLAY_MS = 2500;
const MAX_DISPLAY_MS = 5500;

export function PageLoader() {
  const { t, locale } = useI18n();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const prefersReduced = useReducedMotion();
  const dismissedRef = useRef(false);

  useEffect(() => {
    const mountedAt = performance.now();
    let raf = 0;
    let timeoutId = 0;

    const dismiss = () => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      const elapsed = performance.now() - mountedAt;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      window.setTimeout(() => {
        setProgress(1);
        window.setTimeout(() => {
          markLoaderDone();
          setVisible(false);
        }, 120);
      }, wait);
    };

    const heroVideo = () =>
      document.querySelector<HTMLVideoElement>("#hero video");

    const v = heroVideo();
    if (v && v.readyState >= 3) {
      dismiss();
    } else {
      v?.addEventListener("canplaythrough", dismiss, { once: true });
      v?.addEventListener("loadeddata", dismiss, { once: true });
      timeoutId = window.setTimeout(dismiss, MAX_DISPLAY_MS);
    }

    const animate = () => {
      if (dismissedRef.current) return;
      const elapsed = performance.now() - mountedAt;
      const t = Math.min(1, elapsed / MAX_DISPLAY_MS);
      const eased = 1 - Math.pow(1 - t, 2.4);
      setProgress(eased * 0.96);
      if (!dismissedRef.current) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeoutId);
      v?.removeEventListener("canplaythrough", dismiss);
      v?.removeEventListener("loadeddata", dismiss);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          role="status"
          aria-live="polite"
          aria-label={t("loader.aria")}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-ink text-white"
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(900px 540px at 50% 10%, rgba(0,102,255,0.22), transparent 60%), radial-gradient(700px 420px at 80% 95%, rgba(0,212,255,0.18), transparent 60%)",
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

          <div className="relative flex min-h-[100dvh] flex-col px-8 sm:px-10 lg:px-16 py-10">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between gap-4"
            >
              <div className="inline-flex items-center gap-3 min-w-0">
                <img
                  src="/logo.png"
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-md"
                />
                <div className="flex flex-col leading-none min-w-0">
                  <span className="font-display font-medium text-[15px] tracking-[-0.01em] text-white truncate">
                    {locale === "en" ? "KIT Forum" : "КИТ Форум"}
                  </span>
                  <span className="mt-1 font-mono text-[10px] tracking-[0.2em] uppercase text-white/65 truncate">
                    {locale === "en" ? "2026 · Bishkek" : "2026 · Бишкек"}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 backdrop-blur-sm font-mono text-[10px] tracking-[0.22em] uppercase text-white tabular tnums">
                <Loader2
                  size={12}
                  strokeWidth={2}
                  className={prefersReduced ? "text-brand-glow" : "text-brand-glow animate-spin"}
                  aria-hidden
                />
                <span className="text-white/70">{t("loader.status")}</span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-brand-glow" />
                <span className="text-white">
                  {Math.floor(progress * 100)
                    .toString()
                    .padStart(3, "0")}
                  %
                </span>
              </span>
            </motion.div>

            <div className="flex-1 flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                className="w-full"
              >
                <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-brand-glow/80">
                  <span aria-hidden className="relative inline-flex h-2 w-2 shrink-0">
                    <span className="absolute inset-0 rounded-full bg-brand-glow opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-glow" />
                  </span>
                  <span>{t("loader.eyebrow")}</span>
                  <span aria-hidden className="h-px w-8 sm:w-12 bg-brand-glow/60" />
                </div>
                <h1
                  className="mt-5 font-display font-medium text-white leading-[0.92] tracking-tightest"
                  style={{
                    fontSize: "clamp(2.5rem, 11vw, 7rem)",
                    textShadow: "0 4px 40px rgba(10,22,40,0.45)",
                  }}
                >
                  {t("loader.title").replace(" ", " ")}
                </h1>
                <p className="mt-5 max-w-[34rem] text-[13px] sm:text-[15px] leading-[1.55] text-white/65">
                  {t("loader.subtitle")}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="mt-auto flex flex-col gap-4"
            >
              <div className="relative h-[4px] w-full overflow-hidden rounded-full bg-white/[0.08] ring-1 ring-white/10">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand via-brand-glow to-brand shadow-[0_0_18px_rgba(0,212,255,0.55)] transition-[width] duration-200 ease-out"
                  style={{ width: `${progress * 100}%` }}
                />
                {!prefersReduced && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "400%" }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
              </div>
              <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-white/45 tabular tnums">
                <span>{t("loader.metaCity")}</span>
                <span className="hidden sm:inline">{t("loader.metaCoords")}</span>
                <span>{t("loader.metaVersion")}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
