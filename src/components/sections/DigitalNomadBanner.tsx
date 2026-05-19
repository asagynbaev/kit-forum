import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { useI18n } from "@/i18n/I18nProvider";

const WHATSAPP_PHONE = "996504100030";
const ease = [0.16, 1, 0.3, 1] as const;

export function DigitalNomadBanner() {
  const { t } = useI18n();

  const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    t("nomad.whatsappMsg"),
  )}`;

  return (
    <section
      aria-label={t("nomad.aria")}
      className="relative bg-ink text-white overflow-hidden isolate"
    >
      {/* ── Atmospheric backdrop (teal/cyan for Issyk-Kul summer feel) ── */}
      <div aria-hidden className="absolute inset-0 z-0 nomad-backdrop" />

      {/* ── Blueprint grid overlay ── */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] blueprint-bg-dark pointer-events-none opacity-40"
      />

      {/* ── Top + side vignette ── */}
      <div
        aria-hidden
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,22,40,0.65) 0%, rgba(10,22,40,0) 25%, rgba(10,22,40,0) 75%, rgba(10,22,40,0.65) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="container-edge relative z-10 py-14 sm:py-16 md:py-20">
        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease }}
          className="relative max-w-5xl rounded-[24px] sm:rounded-[32px] overflow-hidden p-4 sm:p-9 md:p-12"
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
          {/* Specular highlight */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none rounded-[28px] sm:rounded-[32px]"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 15% 0%, rgba(255,255,255,0.14) 0%, transparent 60%)",
            }}
          />
          {/* Teal accent bottom-right */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none rounded-[28px] sm:rounded-[32px]"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 95% 100%, rgba(0,212,255,0.12) 0%, transparent 60%)",
            }}
          />

          <div className="relative grid grid-cols-12 gap-y-8 gap-x-10 items-start">
            {/* ── Left: title block ── */}
            <div className="col-span-12 md:col-span-5">
              {/* Eyebrow */}
              <Reveal>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-5">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.07em] uppercase text-ink shrink-0"
                    style={{ background: "#CCFF00" }}
                  >
                    {t("nomad.tag")}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-white/55 min-w-0">
                    {t("nomad.eyebrow")}
                  </span>
                </div>
              </Reveal>

              {/* Organizer */}
              <Reveal delay={0.05}>
                <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-white/45 mb-5">
                  {t("nomad.organizer")}
                </p>
              </Reveal>

              {/* Title */}
              <Reveal delay={0.1}>
                <div
                  className="font-display font-bold leading-[0.88] tracking-tightest text-white"
                  style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)" }}
                >
                  <div>{t("nomad.titleA")}</div>
                  <div className="text-brand-glow">{t("nomad.titleB")}</div>
                  <div
                    className="font-display font-normal text-white"
                    style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.8rem)" }}
                  >
                    {t("nomad.titleC")}
                  </div>
                </div>
              </Reveal>

              {/* Venue pill */}
              <Reveal delay={0.16}>
                <div className="mt-6">
                  <span
                    className="inline-flex items-center rounded-full px-5 py-2.5 text-[13px] sm:text-[14px] font-semibold text-ink"
                    style={{ background: "#CCFF00" }}
                  >
                    {t("nomad.venue")}
                  </span>
                </div>
              </Reveal>

              {/* Address */}
              <Reveal delay={0.2}>
                <address className="mt-3 not-italic font-mono text-[10px] tracking-[0.1em] text-white/55">
                  {t("nomad.address")}
                </address>
              </Reveal>
            </div>

            {/* ── Right: lead + CTA ── */}
            <div className="col-span-12 md:col-span-7 flex flex-col justify-between gap-6 md:pt-2">
              <Reveal delay={0.12}>
                <p
                  className="text-white/85 leading-[1.6] max-w-[36rem]"
                  style={{ fontSize: "clamp(0.95rem, 1.2vw + 0.5rem, 1.15rem)" }}
                >
                  {t("nomad.lead")}
                </p>
              </Reveal>

              <Reveal delay={0.22}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-white/10 pt-6">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl bg-brand px-6 py-3.5 text-[14px] font-medium text-white shadow-glow hover:bg-brand-deep active:scale-[0.98] transition-all duration-300 ease-spring"
                  >
                    <MessageCircle
                      size={16}
                      strokeWidth={1.7}
                      className="shrink-0"
                    />
                    {t("nomad.cta")}
                  </a>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.1em] sm:tracking-[0.18em] uppercase text-white/40">
                    <span>ololoAkJol</span>
                    <span aria-hidden className="text-white/20">·</span>
                    <span>Issyk-Kul · KGZ</span>
                    <span aria-hidden className="text-white/20">·</span>
                    <span>{t("nomad.date")}</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
