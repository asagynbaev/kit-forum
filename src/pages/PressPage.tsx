import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { LangSwitcher } from "../components/ui/LangSwitcher";
import { useI18n, type Localized } from "@/i18n/I18nProvider";

type PressRelease = {
  id: string;
  date: string;
  tagKey: string;
  title: Localized<string>;
  lead: Localized<string>;
};

const releases: PressRelease[] = [
  {
    id: "pr-05",
    date: "01.04.2026",
    tagKey: "pressPage.tag.media",
    title: {
      ru: "Открыта аккредитация СМИ на КИТ Форум 2026",
      ky: "КИТ Форум 2026га ЖМК аккредитациясы ачылды",
      en: "Media accreditation for KIT Forum 2026 now open",
    },
    lead: {
      ru: "Парк высоких технологий КР объявляет об открытии аккредитации для представителей средств массовой информации. Заявки принимаются по адресу pr@htp.kg до 25 мая 2026 года. Аккредитованным СМИ будет обеспечен доступ ко всем открытым пленарным сессиям, пресс-конференциям и эксклюзивным брифингам оргкомитета.",
      ky: "КР Жогорку технологиялар паркы жалпы коммуникация каражаттарынын өкүлдөрүн аккредитациялоону баштаганын жарыялайт. Арыздар 2026-жылдын 25-майына чейин pr@htp.kg дарегине кабыл алынат. Аккредитацияланган ЖМК бардык ачык пленардык сессияларга, маалымат жыйындарына жана уюштуруу комитетинин өзгөчө брифингдерине кире алат.",
      en: "The High Technology Park of the KR announces the opening of accreditation for media representatives. Applications are accepted at pr@htp.kg until 25 May 2026. Accredited media will have access to all open plenary sessions, press conferences, and exclusive organising committee briefings.",
    },
  },
  {
    id: "pr-04",
    date: "10.03.2026",
    tagKey: "pressPage.tag.partners",
    title: {
      ru: "Стратегические партнёры КИТ Форума 2026 подтверждены",
      ky: "КИТ Форум 2026нын стратегиялык өнөктөштөрү ырасталды",
      en: "Strategic partners of KIT Forum 2026 confirmed",
    },
    lead: {
      ru: "Оргкомитет КИТ Форума 2026 объявляет о подтверждении ключевых партнёров мероприятия. В числе генеральных партнёров — ведущие технологические компании региона, национальные институты развития и международные финансовые организации. Полный список партнёров и детали взаимодействия будут раскрыты на открытии форума 4 июня 2026 года.",
      ky: "КИТ Форум 2026нын уюштуруу комитети чарадынын негизги өнөктөштөрүнүн ырасталгандыгын жарыялайт. Башкы өнөктөштөрдүн арасында — региондун алдыңкы технологиялык компаниялары, улуттук өнүктүрүү институттары жана эл аралык каржы уюмдары. Өнөктөштөрдүн толук тизмеси жана өз ара аракеттешүүнүн чоо-жайы 2026-жылдын 4-июнунда форумдун ачылышында жарыяланат.",
      en: "The organising committee of KIT Forum 2026 announces the confirmation of the event's key partners. General partners include leading technology companies of the region, national development institutions, and international financial organisations. The full partner list and partnership details will be disclosed at the forum opening on 4 June 2026.",
    },
  },
  {
    id: "pr-03",
    date: "20.02.2026",
    tagKey: "pressPage.tag.program",
    title: {
      ru: "Программа КИТ Форума 2026: фокус на ИИ, суверенитете данных и кибербезопасности",
      ky: "КИТ Форум 2026нын программасы: ЖИ, маалыматтардын эгемендиги жана киберкоопсуздукка басым",
      en: "KIT Forum 2026 programme: focus on AI, data sovereignty, and cybersecurity",
    },
    lead: {
      ru: "Оргкомитет представил концептуальную структуру программы форума. Два дня работы будут организованы вокруг пяти тематических треков: искусственный интеллект и автоматизация, цифровое государство, стартапы и венчурный рынок, цифровое образование, а также кибербезопасность критической инфраструктуры. Пленарную сессию первого дня откроет официальное обращение Правительства Кыргызской Республики.",
      ky: "Уюштуруу комитети форумдун программасынын концептуалдык структурасын тааныштырды. Эки күндүк иш беш тематикалык багыттын айланасында уюштурулат: жасалма интеллект жана автоматташтыруу, санариптик мамлекет, стартаптар жана венчур рыногу, санариптик билим берүү, ошондой эле критикалык инфраструктуранын киберкоопсуздугу. Биринчи күндүн пленардык сессиясын Кыргыз Республикасынын Өкмөтүнүн расмий кайрылуусу ачат.",
      en: "The organising committee has presented the conceptual structure of the forum programme. Two days of sessions will be organised around five thematic tracks: artificial intelligence and automation, the digital state, startups and venture market, digital education, and cybersecurity of critical infrastructure. The plenary session of the first day will be opened by an official address from the Government of the Kyrgyz Republic.",
    },
  },
  {
    id: "pr-02",
    date: "01.02.2026",
    tagKey: "pressPage.tag.speakers",
    title: {
      ru: "Первые подтверждённые спикеры КИТ Форума 2026 объявлены",
      ky: "КИТ Форум 2026нын биринчи ырасталган спикерлери жарыяланды",
      en: "First confirmed speakers of KIT Forum 2026 announced",
    },
    lead: {
      ru: "Парк высоких технологий КР объявляет о первых подтверждённых участниках деловой программы. В состав спикеров вошли руководители ключевых министерств и ведомств Кыргызской Республики, главы крупнейших ИТ-компаний Центральной Азии, представители ЕБРР, ВБ и ЮНКТАД, а также признанные эксперты в области ИИ и цифровых финансов. Полный список формируется и обновляется еженедельно.",
      ky: "КР Жогорку технологиялар паркы иш программасынын биринчи ырасталган катышуучуларын жарыялайт. Спикерлердин арасында Кыргыз Республикасынын негизги министрликтери менен ведомстволорунун жетекчилери, Борбордук Азиянын эң ири ИТ компанияларынын башчылары, ЭБРР, ДБ жана ЮНКТАДдын өкүлдөрү, ошондой эле ЖИ жана санариптик финансы чөйрөсүндөгү таанылган эксперттер кирет. Толук тизме жасалып, апта сайын жаңыртылуудa.",
      en: "The High Technology Park of the KR announces the first confirmed participants of the business programme. The speaker line-up includes heads of key ministries and agencies of the Kyrgyz Republic, chiefs of the largest IT companies in Central Asia, representatives of the EBRD, World Bank, and UNCTAD, as well as recognised experts in AI and digital finance. The full list is being compiled and updated weekly.",
    },
  },
  {
    id: "pr-01",
    date: "15.01.2026",
    tagKey: "pressPage.tag.announcement",
    title: {
      ru: "КИТ Форум 2026 объявлен: 4–5 июня, МУК, Бишкек",
      ky: "КИТ Форум 2026 жарыяланды: 4–5-июнь, КЭУ, Бишкек",
      en: "KIT Forum 2026 announced: 4–5 June, IUK, Bishkek",
    },
    lead: {
      ru: "Парк высоких технологий Кыргызской Республики объявляет о проведении ежегодного КИТ Форума. В 2026 году флагманское событие цифровой отрасли страны пройдёт 4–5 июня на базе Международного Университета Кыргызстана. Ожидается более 2 500 участников из 25 стран — представителей государственных органов, технологического бизнеса, академической среды и международных организаций.",
      ky: "Кыргыз Республикасынын Жогорку технологиялар паркы жыл сайын өткөрүлгөн КИТ Форумунун өтөрүн жарыялайт. 2026-жылы өлкөнүн санариптик тармагынын флагмандык окуясы 4–5-июнда Кыргызстан Эл аралык университетинде өтөт. 25 өлкөдөн 2 500дөн ашуун катышуучу — мамлекеттик органдардын, технологиялык бизнестин, академиялык чөйрөнүн жана эл аралык уюмдардын өкүлдөрү — күтүлүүдө.",
      en: "The High Technology Park of the Kyrgyz Republic announces the upcoming annual KIT Forum. In 2026, the country's flagship digital-industry event will take place on 4–5 June at the International University of Kyrgyzstan. More than 2,500 participants from 25 countries are expected — representatives of government bodies, the technology sector, academia, and international organisations.",
    },
  },
];

const tagColors: Record<string, string> = {
  "pressPage.tag.announcement": "bg-brand/10 text-brand",
  "pressPage.tag.speakers": "bg-emerald-50 text-emerald-700",
  "pressPage.tag.partners": "bg-violet-50 text-violet-700",
  "pressPage.tag.program": "bg-amber-50 text-amber-700",
  "pressPage.tag.media": "bg-sky-50 text-sky-700",
};

export function PressPage() {
  const { t, tr } = useI18n();

  return (
    <div className="min-h-[100dvh] bg-canvas text-ink flex flex-col">
      <header className="border-b border-line bg-canvas sticky top-0 z-40">
        <div className="container-edge flex h-[72px] items-center justify-between">
          <Logo />
          <LangSwitcher />
        </div>
      </header>

      {/* Page header */}
      <div className="border-b border-line bg-surface">
        <div className="container-edge py-12 md:py-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span aria-hidden className="h-px w-8 bg-brand/50 shrink-0" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-ink-soft">
              {t("pressPage.eyebrow")}
            </span>
          </div>

          <h1
            className="font-display font-medium text-ink leading-[0.95] tracking-tightest text-balance"
            style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
          >
            {t("pressPage.titleA")}
            <br />
            {t("pressPage.titleB")}
          </h1>

          <p className="mt-5 max-w-[42rem] text-[15px] md:text-[16px] leading-[1.55] text-ink-soft">
            {t("pressPage.lead")}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5 rounded-xl border border-line bg-canvas px-4 py-2.5 text-[13px] font-medium text-ink hover:border-ink/30 active:scale-[0.98] transition-all duration-300"
            >
              <ArrowLeft size={13} strokeWidth={1.6} />
              {t("pressPage.back")}
            </Link>
            <a
              href="mailto:pr@htp.kg"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-brand px-4 py-2.5 text-[13px] font-medium text-white hover:bg-brand-deep active:scale-[0.98] transition-all duration-300"
            >
              <Mail size={13} strokeWidth={1.6} />
              {t("pressPage.contact")}
            </a>
          </div>
        </div>
      </div>

      {/* Press releases */}
      <main className="flex-1 py-10 md:py-14">
        <div className="container-edge">
          <div className="flex flex-col gap-6 max-w-[800px]">
            {releases.map((pr) => (
              <article
                key={pr.id}
                className="group rounded-2xl border border-line bg-surface hover:border-brand/25 hover:shadow-sm transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-[0.14em] uppercase font-medium ${
                        tagColors[pr.tagKey] ?? "bg-surface text-ink-soft"
                      }`}
                    >
                      {t(pr.tagKey)}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.14em] text-ink-soft">
                      {pr.date}
                    </span>
                  </div>

                  <h2 className="font-display font-medium text-[18px] md:text-[20px] leading-snug tracking-tight text-ink text-balance">
                    {tr(pr.title)}
                  </h2>

                  <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft line-clamp-3">
                    {tr(pr.lead)}
                  </p>

                  <div className="mt-5 pt-4 border-t border-line">
                    <a
                      href="/#contacts"
                      className="group/btn inline-flex items-center gap-2 text-[13px] font-medium text-brand hover:text-brand-deep transition-colors duration-200"
                    >
                      {t("pressPage.readMore")}
                      <ArrowRight
                        size={13}
                        strokeWidth={1.6}
                        className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                      />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="container-edge py-6 text-[12px] text-ink-soft flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <span>{t("pressPage.footerCopyright")}</span>
          <span className="font-mono tracking-[0.18em] uppercase">
            {t("pressPage.footerStatus")}
          </span>
        </div>
      </footer>
    </div>
  );
}
