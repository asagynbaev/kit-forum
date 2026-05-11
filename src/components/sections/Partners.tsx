import { partners, type Partner } from "@/data/partners";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { LiveBadge } from "../ui/LiveBadge";

const mid = Math.ceil(partners.length / 2);
const rowA = partners.slice(0, mid);
const rowB = partners.slice(mid);

export function Partners() {
  return (
    <section
      id="partners"
      className="v-section relative bg-canvas overflow-hidden"
    >
      <div className="container-edge">
        <SectionHeader
          eyebrow="Партнёры · 04"
          title={
            <>
              Партнёры и поддерживающие<br />
              <span className="text-brand">организации</span> форума.
            </>
          }
          description={
            <>
              Государственные институты, банки развития, ведущие
              технологические компании и университеты — все, кто формирует
              цифровое будущее региона.
            </>
          }
          rightSlot={<LiveBadge>{partners.length} организаций</LiveBadge>}
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
  items: Partner[];
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

function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <div
      title={partner.name}
      className="grid h-20 w-40 sm:h-24 sm:w-48 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-line transition-all duration-500 ease-spring grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:ring-brand/30 hover:-translate-y-0.5 hover:shadow-soft px-4"
    >
      <img
        src={partner.src}
        alt={partner.name}
        loading="lazy"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}
