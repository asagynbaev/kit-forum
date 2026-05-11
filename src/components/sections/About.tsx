import { useMemo } from "react";
import { Reveal } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";
import { LiveBadge } from "../ui/LiveBadge";

const EVENT_DATE = new Date("2026-06-04T00:00:00+06:00").getTime();

export function About() {
  const daysUntil = useMemo(() => {
    const diff = EVENT_DATE - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  return (
    <section id="about" className="v-section relative bg-canvas">
      <div
        aria-hidden
        className="absolute inset-0 blueprint-bg-faded pointer-events-none"
      />
      <div className="container-edge relative">
        <div className="grid grid-cols-12 gap-y-10 lg:gap-16">
          <div className="col-span-12 lg:col-span-5 min-w-0">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="eyebrow">
                    <span className="h-px w-8 bg-brand/50" aria-hidden />
                    <span className="text-brand">01</span> · О форуме
                  </span>
                  <LiveBadge>До форума · {daysUntil} дней</LiveBadge>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="h-section mt-5 text-balance">
                  Главная площадка<br />
                  цифрового сектора<br />
                  <span className="text-brand">Кыргызской Республики.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="lead mt-7 lg:max-w-[420px]">
                  С 2010 года — пространство, где формируется повестка цифровой
                  трансформации Центральной Азии. Государство, бизнес,
                  международные институты и научное сообщество за одним столом.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-brand/20 pt-6 lg:max-w-[420px] font-mono text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.18em] uppercase">
                  <div>
                    <dt className="text-ink-soft">Локация</dt>
                    <dd className="mt-1 text-ink tabular tnums">Бишкек · KGZ</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Координаты</dt>
                    <dd className="mt-1 text-ink tabular tnums">42.84°N · 74.60°E</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Дата</dt>
                    <dd className="mt-1 text-ink tabular tnums">04—05.06.2026</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Часовой пояс</dt>
                    <dd className="mt-1 text-ink tabular tnums">GMT+6</dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 min-w-0">
            <Reveal delay={0.05}>
              <div className="border-y border-brand/25 bg-tint/40 backdrop-blur-[1px]">
                <div className="grid grid-cols-12 items-end gap-y-10 py-10 md:py-14 px-5 sm:px-7 md:px-9">
                  <div className="col-span-12 sm:col-span-7">
                    <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft">
                      <span className="text-brand">▎</span> Главная цифра
                    </div>
                    <div className="mt-4 font-display font-medium leading-[0.9] text-ink tracking-tightest text-[clamp(3rem,8vw,6rem)]">
                      <CountUp value={2500} suffix="+" />
                    </div>
                    <div className="mt-4 font-mono text-[11px] tracking-[0.22em] uppercase text-brand">
                      участников · 2026
                    </div>
                    <p className="mt-5 text-[14px] sm:text-[15px] leading-relaxed text-ink-soft max-w-[360px]">
                      Лидеры бизнеса, государства, международных институтов,
                      экспертного и студенческого сообществ.
                    </p>
                  </div>

                  <div className="col-span-12 sm:col-span-5 grid grid-cols-2 sm:grid-cols-1 gap-8 sm:gap-10 sm:border-l sm:border-brand/25 sm:pl-8 md:pl-10">
                    <SmallStat
                      index="02"
                      value={15}
                      label="лет истории"
                      hint="С 2010 года — ежегодно, без перерывов."
                    />
                    <SmallStat
                      index="03"
                      value={50}
                      suffix="+"
                      label="стран-участников"
                      hint="Центральная Азия, СНГ, ЕС, АТР, MENA."
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="mt-12 md:mt-16 space-y-6 text-ink-soft text-[14px] sm:text-[15px] md:text-[16px] leading-[1.7] md:leading-[1.75] md:max-w-[640px]">
              <Reveal>
                <p>
                  КИТ Форум — ежегодное флагманское событие цифровой отрасли
                  Кыргызстана, объединяющее свыше двух с половиной тысяч
                  участников: государственных деятелей, предпринимателей,
                  лидеров технологических компаний, академическое и студенческое
                  сообщество, а также международные делегации.
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <p>
                  Программа 2026 года формируется вокруг национальной стратегии
                  цифровизации до 2030 года, развития искусственного интеллекта
                  на государственном уровне, кибербезопасности критической
                  инфраструктуры, экспорта цифровых услуг и подготовки кадров
                  нового поколения.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>
                  Форум остаётся местом, где принимаются решения национального
                  и регионального уровня — от двусторонних меморандумов между
                  государствами до запуска совместных программ с
                  международными финансовыми институтами.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <div className="mt-12 md:mt-16 border-t border-brand/25 pt-6 md:pt-8 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-8 gap-y-4 items-baseline md:max-w-[640px]">
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand">
                  Организатор
                </span>
                <div>
                  <div className="font-display font-medium text-ink text-[20px] sm:text-[22px] leading-tight tracking-tightest">
                    Парк высоких технологий
                    <br />
                    Кыргызской Республики
                  </div>
                  <div className="mt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
                    htp.kg · с 2011 · Кабинет Министров КР
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function SmallStat({
  index,
  value,
  suffix,
  label,
  hint,
}: {
  index: string;
  value: number;
  suffix?: string;
  label: string;
  hint: string;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-brand tabular tnums">
        {index}
      </div>
      <div className="mt-3 font-display font-medium leading-none text-ink tracking-tightest text-[clamp(2.25rem,4.5vw,3.25rem)]">
        <CountUp value={value} suffix={suffix} />
      </div>
      <div className="mt-2 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft">
        {label}
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-ink-soft max-w-[200px]">
        {hint}
      </p>
    </div>
  );
}
