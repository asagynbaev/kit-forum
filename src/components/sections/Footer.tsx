import { Logo } from "../ui/Logo";
import { LangSwitcher } from "../ui/LangSwitcher";
import { LiveBadge } from "../ui/LiveBadge";

const columns = [
  {
    title: "Форум",
    links: [
      { label: "О форуме", href: "#about" },
      { label: "Программа", href: "#program" },
      { label: "Спикеры", href: "#speakers" },
      { label: "Партнёры", href: "#partners" },
    ],
  },
  {
    title: "Участие",
    links: [
      { label: "Регистрация", href: "#contacts" },
      { label: "Аккредитация СМИ", href: "mailto:pr@htp.kg" },
      { label: "Партнёрский пакет", href: "#contacts" },
      { label: "Стать спикером", href: "mailto:a.osmonalieva@htp.kg" },
    ],
  },
  {
    title: "Информация",
    links: [
      { label: "Площадка", href: "#venue" },
      { label: "Маршрут", href: "#venue" },
      { label: "Архив форумов", href: "#" },
      { label: "Пресс-релизы", href: "#" },
    ],
  },
  {
    title: "Контакты",
    links: [
      { label: "e.nechaeva@htp.kg", href: "mailto:e.nechaeva@htp.kg" },
      { label: "pr@htp.kg", href: "mailto:pr@htp.kg" },
      { label: "+996 550 077 091", href: "tel:+996550077091" },
      { label: "Бишкек, ул. Льва Толстого, 1/17Б", href: "#venue" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-surface text-ink overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 blueprint-bg-faded pointer-events-none"
      />
      <div className="container-edge relative pt-16 sm:pt-20 pb-10">
        <div className="mb-10 sm:mb-14 flex flex-wrap items-center justify-between gap-3 border-y border-brand/20 py-3.5 sm:py-4">
          <LiveBadge>Online · KGZ · GMT+6</LiveBadge>
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-ink-soft tabular tnums">
            42.8424°N · 74.6047°E
          </span>
          <span className="hidden sm:inline-flex font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
            v.2026.06 · РУС
          </span>
        </div>

        <div className="grid grid-cols-12 gap-8 md:gap-10">
          <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
            <Logo />
            <p className="text-[14px] leading-relaxed text-ink-soft max-w-[360px]">
              Ежегодное флагманское событие цифровой отрасли Кыргызской
              Республики. С 2010 года.
            </p>
            <div className="border-t border-brand/20 pt-4">
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand">
                Организатор
              </div>
              <div className="mt-2 font-display text-ink text-[15px] leading-snug tracking-tightest font-medium">
                Парк высоких технологий КР
              </div>
              <div className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
                4–5 июня 2026 · Бишкек
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
                  {col.title}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[14px] text-ink hover:text-brand transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-8 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <p className="text-[12px] leading-relaxed text-ink-soft max-w-[640px]">
            © 2026 КИТ Форум · Парк высоких технологий Кыргызской Республики ·
            Все права защищены.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-[12px] text-ink-soft hover:text-ink transition-colors duration-300"
            >
              Политика конфиденциальности
            </a>
            <LangSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
