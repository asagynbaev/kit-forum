import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Car, BadgeCheck, Accessibility } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { useI18n } from "@/i18n/I18nProvider";
import { venue } from "@/data/venue";

const ease = [0.16, 1, 0.3, 1] as const;

const CITY_VIDEO_SRC = "/videos/bishkek-cyber.mp4";

const CITY_IMAGE_CANDIDATES = [
  "/images/bishkek-cyber.webp",
  "/images/bishkek-cyber.jpg",
  "/images/bishkek-cyber.jpeg",
  "/images/bishkek-cyber.png",
];

const detailIcons = [Car, BadgeCheck, Accessibility];

const googleDirectionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.googleQuery)}`;

export function CityCTA() {
  const { t, tr } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const [srcIndex, setSrcIndex] = useState(0);
  const imgOk = srcIndex < CITY_IMAGE_CANDIDATES.length;
  const currentSrc = CITY_IMAGE_CANDIDATES[srcIndex];
  const [videoOk, setVideoOk] = useState(true);
  const posterSrc = imgOk ? currentSrc : undefined;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.06]);

  return (
    <section
      ref={ref}
      id="venue"
      aria-label={t("city.aria")}
      className="relative bg-ink text-white overflow-hidden isolate flex flex-col justify-end"
      style={{ minHeight: "min(78vh, 860px)" }}
    >
      {/* ── CSS-only fallback backdrop ── */}
      <div aria-hidden className="absolute inset-0 z-0 city-cta-backdrop" />

      {/* ── Animated background (video → static photo fallback) ── */}
      {videoOk && !prefersReduced ? (
        <motion.div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{ y: bgY, scale: bgScale }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={posterSrc}
            tabIndex={-1}
            onError={() => setVideoOk(false)}
            className="h-full w-full object-cover"
            style={{ filter: "saturate(1.12) contrast(1.05)" }}
          >
            <source src={CITY_VIDEO_SRC} type="video/mp4" />
          </video>
        </motion.div>
      ) : (
        imgOk && (
          <motion.div
            aria-hidden
            className="absolute inset-0 z-[1]"
            style={prefersReduced ? undefined : { y: bgY, scale: bgScale }}
          >
            <img
              key={currentSrc}
              src={currentSrc}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              onError={() => setSrcIndex((i) => i + 1)}
              className="h-full w-full object-cover"
              style={{ filter: "saturate(1.12) contrast(1.05)" }}
            />
          </motion.div>
        )
      )}

      {/* ── Subtle overall tint (keep some brand mood, image breathes) ── */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "rgba(10,22,40,0.14)" }}
      />

      {/* ── Top fade-in to blend with previous section ── */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{
          height: "14%",
          background:
            "linear-gradient(to bottom, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.3) 60%, rgba(10,22,40,0) 100%)",
        }}
      />

      {/* ── Edge vignette (soft) ── */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 60%, rgba(10,22,40,0.4) 100%)",
        }}
      />

      {/* ── Content (bottom-anchored) ── */}
      <div className="container-edge relative z-20 pb-8 sm:pb-12 md:pb-16 pt-16 sm:pt-20 md:pt-28">
        <div
          className="relative max-w-5xl rounded-[28px] sm:rounded-[32px] overflow-hidden p-6 sm:p-10 md:p-14"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 40%, rgba(10,22,40,0.18) 100%)",
            backdropFilter: "blur(22px) saturate(160%)",
            WebkitBackdropFilter: "blur(22px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow:
              "0 30px 80px -20px rgba(0,0,0,0.55), 0 8px 24px -8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* ── Specular highlight (top-left wet-glass sheen) ── */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none rounded-[28px] sm:rounded-[32px]"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 15% 0%, rgba(255,255,255,0.14) 0%, transparent 60%)",
            }}
          />
          {/* ── Faint brand-glow accent (bottom-right) ── */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none rounded-[28px] sm:rounded-[32px]"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 95% 100%, rgba(0,212,255,0.10) 0%, transparent 60%)",
            }}
          />

          <div className="relative">
          <Reveal>
            <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 mb-5 sm:mb-6 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase">
              <span aria-hidden className="h-px w-8 sm:w-10 bg-brand-glow/70" />
              <span className="text-brand-glow">{t("venue.eyebrow")}</span>
              <span aria-hidden className="text-white/30">·</span>
              <span className="text-white/65">{t("city.eyebrow")}</span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              className="font-display font-medium leading-[0.92] tracking-tightest text-balance text-white"
              style={{
                fontSize: "clamp(2rem, 6.2vw, 4.75rem)",
                textShadow: "0 2px 24px rgba(10,22,40,0.6)",
              }}
            >
              {t("city.titleA")}{" "}
              <span className="text-brand-glow">{t("city.titleB")}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p
              className="mt-5 sm:mt-6 max-w-[44rem] text-[14px] sm:text-[16px] leading-[1.6] text-white/90"
            >
              {t("city.lead")}
            </p>
          </Reveal>

          {/* ── Venue card: name + address + details ── */}
          <Reveal delay={0.18}>
            <div className="mt-10 sm:mt-12 grid grid-cols-12 gap-y-8 gap-x-10 border-t border-white/15 pt-8 sm:pt-10">
              <div className="col-span-12 md:col-span-5 min-w-0">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/55">
                  {t("venue.addressLabel")}
                </div>
                <div
                  className="mt-3 font-display font-medium leading-[1.1] tracking-tightest text-white"
                  style={{ fontSize: "clamp(1.15rem, 1.4vw + 0.7rem, 1.6rem)" }}
                >
                  {tr(venue.name)}
                </div>
                <address className="mt-3 not-italic text-[13px] sm:text-[14px] leading-relaxed text-white/70">
                  {venue.addressLines.map((line) => (
                    <div key={line.ru}>{tr(line)}</div>
                  ))}
                </address>
              </div>

              <div className="col-span-12 md:col-span-7 min-w-0">
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                  {venue.details.map((d, i) => {
                    const Icon = detailIcons[i] ?? Car;
                    return (
                      <li key={d.id} className="min-w-0">
                        <span className="grid h-9 w-9 place-items-center rounded-md bg-white/[0.07] ring-1 ring-white/15 text-brand-glow">
                          <Icon size={16} strokeWidth={1.6} />
                        </span>
                        <div className="mt-3 font-medium text-white text-[13px] sm:text-[14px]">
                          {tr(d.title)}
                        </div>
                        <p className="mt-1.5 text-[12.5px] sm:text-[13px] leading-relaxed text-white/65">
                          {tr(d.body)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="mt-9 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="#contacts"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-brand px-6 py-3.5 text-[14px] font-medium text-white shadow-glow hover:bg-brand-deep active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                {t("cta.register")}
                <span aria-hidden className="grid h-7 w-7 place-items-center rounded-md bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
                  <ArrowRight size={14} strokeWidth={1.6} />
                </span>
              </a>
              <a
                href={googleDirectionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 rounded-xl border border-white/30 bg-white/[0.04] backdrop-blur-sm px-6 py-3.5 text-[14px] font-medium text-white hover:border-white/55 hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                {t("cta.directions")}
                <span aria-hidden className="grid h-7 w-7 place-items-center rounded-md border border-white/25 transition-transform duration-500 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRight size={14} strokeWidth={1.6} />
                </span>
              </a>
            </div>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease, delay: 0.34 }}
            className="mt-10 sm:mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-white/55 tabular tnums"
          >
            <span>{t("city.metaCity")}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-white/30" />
            <span>
              {venue.coordinates.lat.toFixed(4)}°N · {venue.coordinates.lng.toFixed(4)}°E
            </span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-white/30" />
            <span>{t("city.metaDate")}</span>
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
