import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Car, BadgeCheck, Accessibility } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { useI18n } from "@/i18n/I18nProvider";
import { venue } from "@/data/venue";
import { useRegistrationModal } from "@/context/RegistrationModalContext";

const ease = [0.16, 1, 0.3, 1] as const;

const detailIcons = [Car, BadgeCheck, Accessibility];

const twoGisHref = `https://2gis.kg/bishkek/directions/points/%2F${venue.coordinates.lng}%2C${venue.coordinates.lat}`;

export function CityCTA() {
  const { t, tr } = useI18n();
  const { openModal } = useRegistrationModal();

  return (
    <section
      id="venue"
      aria-label={t("city.aria")}
      className="v-section relative bg-canvas overflow-hidden"
    >
      <div aria-hidden className="absolute inset-0 blueprint-bg-faded pointer-events-none" />

      <div className="container-edge relative">
        {/* ── Eyebrow ── */}
        <Reveal>
          <span className="eyebrow">
            <span aria-hidden className="h-px w-8 bg-brand/50" />
            <span className="text-brand">{t("venue.eyebrow")}</span>
            <span aria-hidden className="text-ink-mute">·</span>
            {t("city.eyebrow")}
          </span>
        </Reveal>

        {/* ── Title + lead ── */}
        <div className="mt-5 grid grid-cols-12 gap-y-6 lg:gap-16 items-end">
          <Reveal delay={0.05} className="col-span-12 lg:col-span-6">
            <h2 className="h-section text-balance">
              {t("city.titleA")}{" "}
              <span className="text-brand">{t("city.titleB")}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="col-span-12 lg:col-span-6">
            <p className="lead">{t("city.lead")}</p>
          </Reveal>
        </div>

        {/* ── Venue block ── */}
        <Reveal delay={0.14}>
          <div className="mt-14 sm:mt-16 border-t border-brand/20 pt-10 sm:pt-12 grid grid-cols-12 gap-y-10 md:gap-x-10">
            {/* Address */}
            <div className="col-span-12 md:col-span-4 min-w-0">
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft mb-4">
                {t("venue.addressLabel")}
              </div>
              <div
                className="font-display font-medium leading-[1.15] tracking-tightest text-ink break-words"
                style={{ fontSize: "clamp(1rem, 1.4vw + 0.55rem, 1.5rem)" }}
              >
                {tr(venue.name)}
              </div>
              <address className="mt-3 not-italic text-[13px] sm:text-[14px] leading-relaxed text-ink-soft break-words">
                {venue.addressLines.map((line) => (
                  <div key={line.ru}>{tr(line)}</div>
                ))}
              </address>
            </div>

            {/* Details */}
            <div className="col-span-12 md:col-span-8 min-w-0">
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:border-l md:border-brand/20 md:pl-10 min-w-0">
                {venue.details.map((d, i) => {
                  const Icon = detailIcons[i] ?? Car;
                  return (
                    <li key={d.id} className="min-w-0">
                      <span className="grid h-9 w-9 place-items-center rounded-md bg-brand/[0.07] ring-1 ring-brand/15 text-brand">
                        <Icon size={16} strokeWidth={1.6} />
                      </span>
                      <div className="mt-3 font-medium text-ink text-[13px] sm:text-[14px]">
                        {tr(d.title)}
                      </div>
                      <p className="mt-1.5 text-[12.5px] sm:text-[13px] leading-relaxed text-ink-soft">
                        {tr(d.body)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* ── CTAs + meta ── */}
        <Reveal delay={0.2}>
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:items-center gap-6 border-t border-line pt-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={openModal}
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-brand px-6 py-3.5 text-[14px] font-medium text-white shadow-glow hover:bg-brand-deep active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                {t("cta.register")}
                <span aria-hidden className="grid h-7 w-7 place-items-center rounded-md bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
                  <ArrowRight size={14} strokeWidth={1.6} />
                </span>
              </button>
              <a
                href={twoGisHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 rounded-xl border border-ink/15 px-6 py-3.5 text-[14px] font-medium text-ink hover:border-ink/30 hover:bg-ink/[0.03] active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                {t("cta.directions")}
                <span aria-hidden className="grid h-7 w-7 place-items-center rounded-md border border-ink/15 transition-transform duration-500 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRight size={14} strokeWidth={1.6} />
                </span>
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.3 }}
              className="sm:ml-auto flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.1em] sm:tracking-[0.2em] uppercase text-ink-mute tabular tnums"
            >
              <span>{t("city.metaCity")}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-ink/20" />
              <span>
                {venue.coordinates.lat.toFixed(4)}°N · {venue.coordinates.lng.toFixed(4)}°E
              </span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-ink/20" />
              <span>{t("city.metaDate")}</span>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
