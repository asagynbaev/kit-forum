import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { partners as staticPartners } from "@/data/partners";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { LiveBadge } from "../ui/LiveBadge";
import { useI18n } from "@/i18n/I18nProvider";

type PartnerRow = { id: string; name: string; logo_url: string };

function usePartners() {
  const [partners, setPartners] = useState<PartnerRow[]>([]);

  useEffect(() => {
    supabase
      .from("partners")
      .select("id, name, logo_url, order_index")
      .eq("is_visible", true)
      .order("order_index")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPartners(data.map((r) => ({ id: r.id, name: r.name, logo_url: r.logo_url })));
        }
      });
  }, []);

  return partners;
}

export function Partners() {
  const { t } = useI18n();
  const dbPartners = usePartners();

  const partners: PartnerRow[] =
    dbPartners.length > 0
      ? dbPartners
      : staticPartners.map((p) => ({ id: p.id, name: p.name, logo_url: p.src }));

  const mid = Math.ceil(partners.length / 2);
  const rowA = partners.slice(0, mid);
  const rowB = partners.slice(mid);

  return (
    <section
      id="partners"
      className="v-section relative bg-canvas overflow-hidden"
    >
      <div className="container-edge">
        <SectionHeader
          eyebrow={t("partners.eyebrow")}
          title={
            <>
              {t("partners.titleA")}<br />
              <span className="text-brand">{t("partners.titleB")}</span> {t("partners.titleC")}
            </>
          }
          description={<>{t("partners.lead")}</>}
          rightSlot={
            <LiveBadge>
              {t("partners.countBadge").replace("{count}", String(partners.length))}
            </LiveBadge>
          }
        />
      </div>

      <Reveal delay={0.1}>
        <div className="mt-16 space-y-4">
          <MarqueeRow items={rowA} direction="left" />
          <MarqueeRow items={rowB} direction="right" />
        </div>
      </Reveal>
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: PartnerRow[];
  direction: "left" | "right";
}) {
  const loop = [...items, ...items];

  return (
    <div
      className="group/marquee relative w-full overflow-hidden"
      role="group"
      aria-label={
        direction === "left" ? "Партнёры — ряд 1" : "Партнёры — ряд 2"
      }
    >
      <div
        className={`marquee-track ${
          direction === "left" ? "animate-marquee" : "animate-marquee-rev"
        } group-hover/marquee:[animation-play-state:paused]`}
      >
        {loop.map((p, i) => (
          <PartnerTile key={`${p.id}-${i}`} partner={p} />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-canvas to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-canvas to-transparent"
      />
    </div>
  );
}

function PartnerTile({ partner }: { partner: PartnerRow }) {
  const src = partner.logo_url;
  const webpSrc = src.endsWith(".png") ? src.replace(/\.png$/, ".webp") : null;

  return (
    <div
      title={partner.name}
      className="grid h-20 w-40 sm:h-24 sm:w-48 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-line transition-all duration-500 ease-spring grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:ring-brand/30 hover:-translate-y-0.5 hover:shadow-soft px-4"
    >
      <picture>
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <img
          src={src}
          alt={partner.name}
          width={240}
          height={120}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain"
        />
      </picture>
    </div>
  );
}
