import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Car, BadgeCheck, Accessibility } from "lucide-react";
import { venue } from "@/data/venue";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { useI18n } from "@/i18n/I18nProvider";

const detailIcons = [Car, BadgeCheck, Accessibility];

export function MapVenue() {
  const { t, tr } = useI18n();
  const mapDiv = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapDiv.current || mapInstance.current) return;

    const map = L.map(mapDiv.current, {
      center: [venue.coordinates.lat, venue.coordinates.lng],
      zoom: venue.zoom,
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &middot; CartoDB',
        subdomains: "abcd",
        maxZoom: 19,
      },
    ).addTo(map);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 19,
        pane: "shadowPane",
      },
    ).addTo(map);

    const marker = L.divIcon({
      className: "kit-marker",
      html: `
        <span style="position: relative; display: inline-flex;">
          <span style="
            position: absolute; inset: -16px; border-radius: 999px;
            background: rgba(0, 102, 255, 0.18); animation: kitPulse 2.4s ease-out infinite;
          "></span>
          <span style="
            position: relative;
            display: inline-grid; place-items: center;
            width: 36px; height: 36px;
            border-radius: 999px;
            background: #0066FF;
            color: #fff;
            font-family: 'Inter Display', Inter, sans-serif;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 10px 25px -10px rgba(0, 102, 255, 0.65), inset 0 0 0 3px rgba(255,255,255,0.95);
          ">KF</span>
        </span>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    L.marker([venue.coordinates.lat, venue.coordinates.lng], { icon: marker })
      .addTo(map)
      .bindTooltip(tr(venue.shortName), {
        permanent: false,
        direction: "top",
        offset: [0, -18],
        className: "kit-tooltip",
      });

    L.control
      .zoom({ position: "bottomright" })
      .addTo(map);

    mapInstance.current = map;

    // Inject keyframes for marker pulse once
    if (!document.getElementById("kit-map-style")) {
      const style = document.createElement("style");
      style.id = "kit-map-style";
      style.textContent = `
        @keyframes kitPulse {
          0% { transform: scale(0.6); opacity: 0.8; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .kit-tooltip {
          background: #0A1628 !important;
          color: #fff !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 6px 10px !important;
          font-family: inherit !important;
          font-size: 11px !important;
          letter-spacing: 0.04em !important;
          box-shadow: 0 8px 24px -10px rgba(10,22,40,0.45) !important;
        }
        .kit-tooltip:before { display: none !important; }
        .leaflet-control-zoom a {
          border: 1px solid rgba(10,22,40,0.08) !important;
          background: #fff !important;
          color: #0A1628 !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [tr]);

  return (
    <section id="venue" className="v-section relative z-0 isolate bg-canvas">
      <div className="container-edge">
        <SectionHeader
          eyebrow={t("venue.eyebrow")}
          title={
            <>
              {t("venue.titleA")}<br />
              <span className="text-brand">{t("venue.titleB")}</span> {t("venue.titleC")}
            </>
          }
          description={<>{t("venue.lead")}</>}
        />

        <div className="mt-14 grid grid-cols-12 gap-y-8 lg:gap-10">
          <Reveal className="col-span-12 lg:col-span-6" delay={0.05}>
            <div className="rounded-2xl border border-line bg-white p-6 sm:p-7 md:p-9 shadow-soft h-full">
              <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft">
                {t("venue.addressLabel")}
              </div>
              <div className="mt-4 font-display font-medium text-ink leading-tight tracking-tightest text-[clamp(1.5rem,2vw+0.8rem,2rem)]">
                {tr(venue.name)}
              </div>
              <address className="mt-4 not-italic text-[15px] leading-relaxed text-ink-soft">
                {venue.addressLines.map((line, i) => (
                  <div key={`addr-${i}`}>{tr(line)}</div>
                ))}
              </address>

              <div className="mt-8 border-t border-line pt-6 space-y-5">
                {venue.details.map((d, i) => {
                  const Icon = detailIcons[i] ?? Car;
                  return (
                    <div key={d.id} className="flex items-start gap-4">
                      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tint text-brand">
                        <Icon size={18} strokeWidth={1.5} />
                      </span>
                      <div>
                        <div className="font-medium text-ink text-[14px]">
                          {tr(d.title)}
                        </div>
                        <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
                          {tr(d.body)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.googleQuery)}&destination_place_id=`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-between sm:justify-start gap-3 rounded-xl bg-ink px-5 py-3 text-[13px] font-medium text-white hover:bg-brand active:scale-[0.98] transition-all duration-300 ease-spring"
                >
                  {t("cta.directions")}
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
                    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M3 9 L9 3 M9 3 H4 M9 3 V8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
                <a
                  href={`https://2gis.kg/bishkek/search/${encodeURIComponent(
                    "Международный Университет Кыргызстана Льва Толстого",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center sm:justify-start gap-2 rounded-xl border border-line bg-white px-4 py-3 text-[13px] font-medium text-ink hover:border-brand/40 hover:text-brand active:scale-[0.98] transition-all duration-300 ease-spring"
                >
                  {t("cta.open2gis")}
                </a>
                <span className="mt-2 sm:mt-0 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-ink-soft">
                  {venue.coordinates.lat.toFixed(4)}° N ·{" "}
                  {venue.coordinates.lng.toFixed(4)}° E
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-6 relative z-0 isolate" delay={0.1}>
            <div
              ref={mapDiv}
              role="img"
              aria-label={t("venue.mapAria")}
              className="relative h-[360px] sm:h-[420px] lg:h-full min-h-[440px] w-full overflow-hidden rounded-2xl border border-line shadow-soft isolate"
              style={{ zIndex: 0 }}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
