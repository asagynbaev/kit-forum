import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { LangSwitcher } from "../components/ui/LangSwitcher";
import { useI18n, type Localized } from "@/i18n/I18nProvider";

type Edition = {
  year: number;
  theme: Localized<string>;
  participants: number;
  countries: number;
  sessions: number;
  highlight: Localized<string>;
};

const editions: Edition[] = [
  {
    year: 2025,
    theme: { ru: "Цифровой суверенитет", ky: "Санариптик эгемендик", en: "Digital Sovereignty" },
    participants: 2800,
    countries: 28,
    sessions: 42,
    highlight: {
      ru: "Подписана декларация об ответственном применении ИИ в государственном управлении КР",
      ky: "КРда ЖИни мамлекеттик башкарууда жооптуу колдонуу жөнүндө декларация кол коюлду",
      en: "Declaration on responsible AI use in public governance of the KR signed",
    },
  },
  {
    year: 2024,
    theme: { ru: "ИИ и человек", ky: "ЖИ жана адам", en: "AI and the Human" },
    participants: 2600,
    countries: 25,
    sessions: 38,
    highlight: {
      ru: "Запущена национальная программа подготовки ИИ-специалистов совместно с ведущими вузами",
      ky: "Алдыңкы жогорку окуу жайлар менен биргеликте ЖИ боюнча адистерди даярдоонун улуттук программасы ишке берилди",
      en: "National AI talent development programme launched jointly with leading universities",
    },
  },
  {
    year: 2023,
    theme: { ru: "Цифровые экосистемы", ky: "Санариптик экосистемалар", en: "Digital Ecosystems" },
    participants: 2350,
    countries: 23,
    sessions: 35,
    highlight: {
      ru: "Создан Центральноазиатский цифровой альянс — соглашение подписали 5 государств региона",
      ky: "Борбордук Азиялык санариптик альянс түзүлдү — макулдашууга региондун 5 мамлекети кол коюшту",
      en: "Central Asian Digital Alliance established — agreement signed by 5 regional states",
    },
  },
  {
    year: 2022,
    theme: { ru: "Восстановление и рост", ky: "Калыбына келтирүү жана өсүш", en: "Recovery and Growth" },
    participants: 2100,
    countries: 22,
    sessions: 32,
    highlight: {
      ru: "Принят план цифровой трансформации экономики КР на 2023–2026 годы",
      ky: "2023–2026-жылдарга КРнын экономикасын санариптик трансформациялоо планы кабыл алынды",
      en: "KR economic digitalisation plan for 2023–2026 adopted",
    },
  },
  {
    year: 2021,
    theme: { ru: "Цифровая устойчивость", ky: "Санариптик туруктуулук", en: "Digital Resilience" },
    participants: 4200,
    countries: 35,
    sessions: 28,
    highlight: {
      ru: "Первый гибридный формат форума: 1 800 очных и 2 400 онлайн-участников из 35 стран",
      ky: "Форумдун биринчи гибриддик форматы: 35 өлкөдөн 1 800 катышуучу жана 2 400 онлайн катышуучу",
      en: "First hybrid format: 1,800 in-person and 2,400 online participants from 35 countries",
    },
  },
  {
    year: 2020,
    theme: { ru: "Цифровое будущее", ky: "Санариптик келечек", en: "Digital Future" },
    participants: 6000,
    countries: 50,
    sessions: 20,
    highlight: {
      ru: "Форум полностью перешёл в онлайн-формат; достигнут рекордный охват аудитории",
      ky: "Форум толугу менен онлайн форматка өттү; аудиториянын рекорддук жетишилүүсүнө жетишилди",
      en: "Forum moved entirely online; record audience reach achieved",
    },
  },
  {
    year: 2019,
    theme: { ru: "Умный регион", ky: "Акылдуу регион", en: "Smart Region" },
    participants: 2000,
    countries: 20,
    sessions: 30,
    highlight: {
      ru: "Запущена совместная программа «Умный город Бишкек» при поддержке ЕБРР",
      ky: "ЭБРР колдоосунда «Акылдуу Бишкек шаары» биргелешкен программасы ишке берилди",
      en: "Joint 'Smart City Bishkek' programme launched with EBRD support",
    },
  },
  {
    year: 2018,
    theme: { ru: "Цифровая трансформация государства", ky: "Мамлекеттин санариптик трансформациясы", en: "Digital State Transformation" },
    participants: 1800,
    countries: 18,
    sessions: 26,
    highlight: {
      ru: "Введена в эксплуатацию единая платформа государственных услуг «Тундук»",
      ky: "«Тундук» мамлекеттик кызматтардын бирдиктүү платформасы иштетилди",
      en: "Unified public services platform 'Tunduk' launched",
    },
  },
  {
    year: 2017,
    theme: { ru: "Экономика знаний", ky: "Билим экономикасы", en: "Knowledge Economy" },
    participants: 1600,
    countries: 16,
    sessions: 22,
    highlight: {
      ru: "Кыргызстан вошёл в десятку стран СНГ по индексу развития ИКТ — рост на 18 позиций за год",
      ky: "Кыргызстан ИКТ өнүктүрүү индекси боюнча ТМА өлкөлөрүнүн он ичине кирди — жылда 18 орунга өстү",
      en: "Kyrgyzstan entered the top 10 CIS countries in ICT Development Index — up 18 places in a year",
    },
  },
  {
    year: 2016,
    theme: { ru: "Электронная коммерция и е-государство", ky: "Электрондук соода жана е-мамлекет", en: "E-Commerce and E-Government" },
    participants: 1400,
    countries: 15,
    sessions: 20,
    highlight: {
      ru: "Принят закон об электронной цифровой подписи; сформирована правовая база е-коммерции",
      ky: "Электрондук санариптик кол тамга жөнүндөгү мыйзам кабыл алынды; е-соода боюнча укуктук база түзүлдү",
      en: "Electronic digital signature law adopted; legal framework for e-commerce established",
    },
  },
  {
    year: 2015,
    theme: { ru: "Стартап-экосистема", ky: "Стартап экосистема", en: "Startup Ecosystem" },
    participants: 1200,
    countries: 14,
    sessions: 18,
    highlight: {
      ru: "Открыт первый государственный технопарк ПВТ КР — фундамент для роста ИТ-экспорта страны",
      ky: "КР ЖТПнын биринчи мамлекеттик технопаркы ачылды — өлкөнүн ИТ экспортунун өсүшүнүн негизи",
      en: "First state-owned HTP KR technopark opened — foundation for the country's IT export growth",
    },
  },
  {
    year: 2014,
    theme: { ru: "Цифровой Кыргызстан", ky: "Санариптик Кыргызстан", en: "Digital Kyrgyzstan" },
    participants: 950,
    countries: 12,
    sessions: 15,
    highlight: {
      ru: "Утверждена Концепция информационного общества КР до 2025 года",
      ky: "2025-жылга чейин КРнын маалыматтык коому концепциясы бекитилди",
      en: "KR Information Society Concept to 2025 approved",
    },
  },
  {
    year: 2013,
    theme: { ru: "Электронное правительство 2.0", ky: "Электрондук өкмөт 2.0", en: "E-Government 2.0" },
    participants: 750,
    countries: 10,
    sessions: 12,
    highlight: {
      ru: "Запущен портал государственных услуг; 120 000 граждан прошли регистрацию в первый год",
      ky: "Мамлекеттик кызматтардын порталы ачылды; биринчи жылы 120 000 жаран каттоодон өттү",
      en: "Public services portal launched; 120,000 citizens registered in the first year",
    },
  },
  {
    year: 2012,
    theme: { ru: "ИКТ и развитие", ky: "АКТ жана өнүгүү", en: "ICT and Development" },
    participants: 550,
    countries: 8,
    sessions: 10,
    highlight: {
      ru: "Подписано соглашение с ЮНКТАД о развитии ИКТ-потенциала Кыргызской Республики",
      ky: "Кыргыз Республикасынын АКТ потенциалын өнүктүрүү боюнча ЮНКТАД менен макулдашуу кол коюлду",
      en: "Agreement with UNCTAD on developing the ICT capacity of the Kyrgyz Republic signed",
    },
  },
  {
    year: 2011,
    theme: { ru: "Перспективы ИКТ", ky: "АКТтын келечеги", en: "ICT Horizons" },
    participants: 380,
    countries: 6,
    sessions: 8,
    highlight: {
      ru: "Образован Парк высоких технологий КР — первый специализированный институт развития ИТ-отрасли",
      ky: "КРнын Жогорку технологиялар паркы түзүлдү — ИТ тармагын өнүктүрүүнүн биринчи адистештирилген институту",
      en: "High Technology Park of the KR established — the first dedicated IT industry development institution",
    },
  },
  {
    year: 2010,
    theme: { ru: "Первый КИТ Форум", ky: "Биринчи КИТ Форум", en: "First KIT Forum" },
    participants: 220,
    countries: 5,
    sessions: 6,
    highlight: {
      ru: "Состоялся первый КИТ Форум — отправная точка формирования цифровой повестки Кыргызстана",
      ky: "Биринчи КИТ Форум өттү — Кыргызстандын санариптик күн тартибин түзүүнүн башталышы",
      en: "First KIT Forum held — the starting point for shaping Kyrgyzstan's digital agenda",
    },
  },
];

export function ArchivePage() {
  const { t, tr } = useI18n();

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink flex flex-col">
      <header className="border-b border-line bg-canvas sticky top-0 z-40">
        <div className="container-edge flex h-[72px] items-center justify-between">
          <Logo />
          <LangSwitcher />
        </div>
      </header>

      {/* Dark editorial hero */}
      <div className="relative bg-ink text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(800px 480px at 60% 20%, rgba(0,102,255,0.16), transparent 60%), radial-gradient(600px 360px at 10% 90%, rgba(0,212,255,0.12), transparent 60%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 blueprint-bg-dark pointer-events-none" />

        <div className="container-edge relative py-16 md:py-24">
          <div className="inline-flex items-center gap-3 mb-8">
            <span aria-hidden className="h-px w-8 bg-brand-glow/60 shrink-0" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-white/75">
              {t("archivePage.eyebrow")}
            </span>
          </div>

          <h1
            className="font-display font-medium text-white leading-[0.92] tracking-tightest text-balance"
            style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)" }}
          >
            {t("archivePage.titleA")}
            <br />
            <span className="text-brand-glow">{t("archivePage.titleB")}</span>
          </h1>

          <p className="mt-6 max-w-[42rem] text-[15px] md:text-[17px] leading-[1.55] text-white/75">
            {t("archivePage.lead")}
          </p>

          <div className="mt-8">
            <Link
              to="/"
              className="group inline-flex items-center gap-3 rounded-xl border border-white/25 px-5 py-3 text-[14px] font-medium text-white hover:border-white/50 hover:bg-white/[0.06] active:scale-[0.98] transition-all duration-300 ease-spring"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-spring group-hover:-translate-x-0.5">
                <ArrowLeft size={13} strokeWidth={1.6} />
              </span>
              {t("archivePage.back")}
            </Link>
          </div>
        </div>
      </div>

      {/* Editions grid */}
      <main className="flex-1 bg-canvas py-12 md:py-16">
        <div className="container-edge">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {editions.map((ed) => (
              <div
                key={ed.year}
                className="group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 hover:border-brand/30 hover:shadow-sm transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[2.5rem] font-medium leading-none tracking-tight text-ink/20 group-hover:text-brand/25 transition-colors duration-300">
                    {ed.year}
                  </span>
                  <span className="mt-1 font-mono text-[9px] tracking-[0.2em] uppercase text-ink-soft/70 shrink-0">
                    KIT
                  </span>
                </div>

                <div>
                  <p className="font-display font-medium text-[17px] leading-snug tracking-tight text-ink text-balance">
                    {tr(ed.theme)}
                  </p>
                </div>

                <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.12em] text-ink-soft border-t border-line pt-4">
                  <span>
                    <span className="text-ink font-medium tabular-nums">
                      {ed.participants.toLocaleString()}
                    </span>{" "}
                    {t("archivePage.statsParticipants")}
                  </span>
                  <span className="text-line">·</span>
                  <span>
                    <span className="text-ink font-medium tabular-nums">{ed.countries}</span>{" "}
                    {t("archivePage.statsCountries")}
                  </span>
                  <span className="text-line">·</span>
                  <span>
                    <span className="text-ink font-medium tabular-nums">{ed.sessions}</span>{" "}
                    {t("archivePage.statsSessions")}
                  </span>
                </div>

                <p className="text-[13px] leading-[1.5] text-ink-soft border-l-2 border-brand/30 pl-3">
                  {tr(ed.highlight)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="container-edge py-6 text-[12px] text-ink-soft flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <span>{t("archivePage.footerCopyright")}</span>
          <span className="font-mono tracking-[0.18em] uppercase">
            {t("archivePage.footerStatus")}
          </span>
        </div>
      </footer>
    </div>
  );
}
