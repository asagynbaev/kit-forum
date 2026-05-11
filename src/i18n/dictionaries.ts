export type Locale = "ru" | "ky" | "en";

export const LOCALES: readonly Locale[] = ["ru", "ky", "en"];

export const localeMeta: Record<Locale, { label: string; native: string }> = {
  ru: { label: "Русский", native: "РУС" },
  ky: { label: "Кыргызча", native: "КЫР" },
  en: { label: "English", native: "ENG" },
};

/**
 * Three fully populated locales. Russian is the source of truth; Kyrgyz and
 * English are professional, semantic translations (not machine output),
 * tuned for a state-level conference register.
 *
 * Speaker/session/venue copy lives next to the data in /src/data — pass
 * those `Localized<string>` objects through `tr()` from I18nProvider.
 */
export const dictionaries: Record<Locale, Record<string, string>> = {
  ru: {
    // ─── Navigation
    "nav.about": "О форуме",
    "nav.program": "Программа",
    "nav.speakers": "Спикеры",
    "nav.partners": "Партнёры",
    "nav.contacts": "Контакты",
    "nav.openMenu": "Открыть меню",
    "nav.closeMenu": "Закрыть меню",
    "nav.menuAria": "Меню",
    "nav.mainAria": "Основная навигация",
    "nav.homeAria": "КИТ Форум — на главную",

    // ─── CTAs
    "cta.register": "Зарегистрироваться",
    "cta.program": "Программа форума",
    "cta.allSpeakers": "Все спикеры",
    "cta.submit": "Отправить заявку",
    "cta.submitting": "Отправляем…",
    "cta.directions": "Построить маршрут",
    "cta.open2gis": "Открыть в 2ГИС",
    "cta.viewDetails": "Подробнее",
    "cta.reset": "Сбросить",
    "cta.replayVideo": "Проиграть ещё раз",

    // ─── Loader
    "loader.aria": "Загрузка",
    "loader.eyebrow": "Подготовка опыта · 04.06.2026",
    "loader.title": "КИТ ФОРУМ",
    "loader.subtitle":
      "Загружаем главное событие цифровой отрасли Центральной Азии.",
    "loader.metaVersion": "v.2026.06",
    "loader.metaCity": "Bishkek · KGZ",
    "loader.metaCoords": "42.84°N · 74.60°E",

    // ─── Hero
    "hero.aria": "КИТ Форум 2026",
    "hero.eyebrowIndex": "01",
    "hero.eyebrowText": "Кыргызская Республика · 2026",
    "hero.liveBadge": "Live · 04.06.2026",
    "hero.title": "КИТ ФОРУМ",
    "hero.lead":
      "Крупнейшее событие в сфере цифровых технологий и инноваций Центральной Азии. С 2010 года формирует повестку отрасли на государственном уровне.",
    "hero.dateLine": "4–5 июня 2026 · Бишкек",
    "hero.venueLine": "МУК · ул. Льва Толстого, 1 (17Б)",
    "hero.organizerLine": "Организатор · ПВТ КР",
    "hero.scrollHint": "Скрольте чтобы продолжить",
    "hero.scrollAria": "Прокрутить вниз",

    // ─── About
    "about.eyebrowIndex": "01",
    "about.eyebrowText": "О форуме",
    "about.daysUntilLabel": "До форума",
    "about.daysUnit": "дней",
    "about.titleA": "Главная площадка",
    "about.titleB": "цифрового сектора",
    "about.titleC": "Кыргызской Республики.",
    "about.lead":
      "С 2010 года — пространство, где формируется повестка цифровой трансформации Центральной Азии. Государство, бизнес, международные институты и научное сообщество за одним столом.",
    "about.metaLocation": "Локация",
    "about.metaLocationValue": "Бишкек · KGZ",
    "about.metaCoordinates": "Координаты",
    "about.metaCoordinatesValue": "42.84°N · 74.60°E",
    "about.metaDate": "Дата",
    "about.metaDateValue": "04—05.06.2026",
    "about.metaTimezone": "Часовой пояс",
    "about.metaTimezoneValue": "GMT+6",
    "about.mainStatLabel": "Главная цифра",
    "about.mainStatSubtitle": "участников · 2026",
    "about.mainStatHint":
      "Лидеры бизнеса, государства, международных институтов, экспертного и студенческого сообществ.",
    "about.stat02Label": "лет истории",
    "about.stat02Hint": "С 2010 года — ежегодно, без перерывов.",
    "about.stat03Label": "стран-участников",
    "about.stat03Hint": "Центральная Азия, СНГ, ЕС, АТР, MENA.",
    "about.body1":
      "КИТ Форум — ежегодное флагманское событие цифровой отрасли Кыргызстана, объединяющее свыше двух с половиной тысяч участников: государственных деятелей, предпринимателей, лидеров технологических компаний, академическое и студенческое сообщество, а также международные делегации.",
    "about.body2":
      "Программа 2026 года формируется вокруг национальной стратегии цифровизации до 2030 года, развития искусственного интеллекта на государственном уровне, кибербезопасности критической инфраструктуры, экспорта цифровых услуг и подготовки кадров нового поколения.",
    "about.body3":
      "Форум остаётся местом, где принимаются решения национального и регионального уровня — от двусторонних меморандумов между государствами до запуска совместных программ с международными финансовыми институтами.",
    "about.organizerLabel": "Организатор",
    "about.organizerNameA": "Парк высоких технологий",
    "about.organizerNameB": "Кыргызской Республики",
    "about.organizerMeta": "htp.kg · с 2011 · Кабинет Министров КР",

    // ─── Program
    "program.eyebrow": "Программа · 02",
    "program.titleA": "Два дня плотной",
    "program.titleB": "повестки и",
    "program.titleC": "решений",
    "program.titleD": ".",
    "program.lead":
      "Пленарные сессии, прикладные мастерские, инвестиционные встречи и неформальные диалоги. Состав сессий обновляется по мере подтверждения спикеров.",
    "program.updatedBadge": "Обновлено · сегодня",
    "program.version": "Версия 2026.06.01 · РУС",
    "program.tabsAria": "Дни программы",
    "program.tracksLabel": "Треки",
    "program.trackPrefix": "Трек",
    "program.mainHall": "Главный зал",
    "program.track.ai": "AI",
    "program.track.gov": "Gov",
    "program.track.startup": "Startup",
    "program.track.edu": "Edu",
    "program.track.security": "Security",
    "program.track.general": "Общая",
    "program.type.keynote": "Keynote",
    "program.type.panel": "Panel",
    "program.type.workshop": "Workshop",
    "program.type.networking": "Networking",
    "program.type.break": "Break",
    "program.type.ceremony": "Ceremony",

    // ─── Speakers
    "speakers.eyebrow": "Спикеры · 03",
    "speakers.titleA": "Голоса, которые",
    "speakers.titleB": "определяют",
    "speakers.titleC": "отрасль",
    "speakers.titleD": ".",
    "speakers.lead":
      "Принимающие решения из правительства, лидеры технологических компаний региона, исследователи и представители международных институтов. Состав 2026 года формируется и обновляется еженедельно.",
    "speakers.confirmedBadge": "Подтверждено · {count} спикеров",
    "speakers.viewAllLead":
      "Состав спикеров расширяется. Полный список с биографиями и сессиями доступен на отдельной странице.",
    "speakers.cardCountryHint": "Подробнее",

    // ─── Speakers page
    "speakersPage.eyebrow": "Все спикеры · /speakers",
    "speakersPage.titleA": "Страница готовится.",
    "speakersPage.titleB": "Скоро здесь.",
    "speakersPage.lead":
      "Подробные карточки спикеров, биографии, темы выступлений и записи прошлых сессий появятся ближе к началу форума. Подпишитесь, чтобы узнать первыми.",
    "speakersPage.back": "Вернуться на главную",
    "speakersPage.contact": "Связаться с оргкомитетом",
    "speakersPage.footerCopyright":
      "© 2026 КИТ Форум · Парк высоких технологий КР",
    "speakersPage.footerStatus": "Страница в разработке",

    // ─── Partners
    "partners.eyebrow": "Партнёры · 04",
    "partners.titleA": "Партнёры и поддерживающие",
    "partners.titleB": "организации",
    "partners.titleC": "форума.",
    "partners.lead":
      "Государственные институты, банки развития, ведущие технологические компании и университеты — все, кто формирует цифровое будущее региона.",
    "partners.countBadge": "{count} организаций",

    // ─── Venue
    "venue.eyebrow": "Площадка · 05",
    "venue.titleA": "Международный Университет",
    "venue.titleB": "Кыргызстана",
    "venue.titleC": "· Центральный кампус.",
    "venue.lead":
      "Принимающая площадка КИТ Форума 2026 — главное здание МУК на улице Льва Толстого. Конференц-залы, экспо-пространство, образовательные блоки, открытый кампусный двор.",
    "venue.addressLabel": "Адрес",
    "venue.mapAria": "Карта расположения площадки форума в Бишкеке",

    // ─── Contacts
    "contacts.eyebrow": "Контакты · 06",
    "contacts.titleA": "Связаться",
    "contacts.titleB": "с",
    "contacts.titleC": "оргкомитетом",
    "contacts.titleD": "форума.",
    "contacts.lead":
      "Запросы на участие, аккредитация СМИ, партнёрские предложения, приглашения делегаций. Ответим в течение одного рабочего дня.",
    "contacts.liveBadge": "Online · GMT+6",
    "contacts.hoursLabel": "Часы работы",
    "contacts.hoursValueA": "Пн—Пт",
    "contacts.hoursValueB": "09:00–18:00",
    "contacts.hoursMeta": "GMT+6 · Бишкек",
    "contacts.row.organizer.label": "Организатор",
    "contacts.row.organizer.primary":
      "Парк высоких технологий Кыргызской Республики",
    "contacts.row.organizer.l1": "Главный организатор КИТ Форума 2026",
    "contacts.row.organizer.l2": "htp.kg · г. Бишкек, Кыргызская Республика",
    "contacts.row.organizer.l3": "Орган управления — Кабинет Министров КР",
    "contacts.row.venue.label": "Площадка",
    "contacts.row.venue.primary": "Международный Университет Кыргызстана",
    "contacts.row.venue.l1": "Центральный кампус МУК",
    "contacts.row.venue.l2": "Бишкек, ул. Льва Толстого, 1 (17Б)",
    "contacts.row.coord.label": "Общая координация",
    "contacts.row.program.label": "Программа · Спикеры",
    "contacts.row.expo.label": "EXPO",
    "contacts.row.pr.label": "PR · СМИ",
    "contacts.row.startup.label": "Стартапы · Венчур · Университеты",
    "contacts.row.social.label": "Социальные сети",
    "contacts.row.social.secondary":
      "Прямые трансляции ключевых сессий — на YouTube-канале форума",
    "contacts.formEyebrow": "Заявка · 07",
    "contacts.formTitleA": "Оставить заявку",
    "contacts.formTitleB": "на участие.",
    "contacts.formLead":
      "Заполните форму — оргкомитет свяжется с вами для уточнения деталей участия, аккредитации и логистики.",
    "contacts.field.name.label": "Имя и фамилия",
    "contacts.field.name.placeholder": "Айбек Айдаров",
    "contacts.field.name.error": "Укажите имя — минимум 2 символа",
    "contacts.field.email.label": "Email",
    "contacts.field.email.placeholder": "name@company.kg",
    "contacts.field.email.error": "Введите корректный email-адрес",
    "contacts.field.message.label": "Сообщение",
    "contacts.field.message.placeholder":
      "Расскажите о цели запроса — участие, аккредитация СМИ, партнёрство…",
    "contacts.field.message.error":
      "Сообщение слишком короткое — минимум 8 символов",
    "contacts.agreePrefix": "Отправляя форму, вы соглашаетесь с ",
    "contacts.agreeLink": "политикой обработки персональных данных",
    "contacts.agreeSuffix": ".",
    "contacts.success.eyebrow": "Принято",
    "contacts.success.title": "Заявка отправлена.",
    "contacts.success.bodyA": "Подтверждение отправили на ",
    "contacts.success.bodyB":
      ". Оргкомитет свяжется в течение одного рабочего дня.",
    "contacts.success.reset": "Отправить ещё одну заявку",

    // ─── Footer
    "footer.col.forum.title": "Форум",
    "footer.col.forum.link.about": "О форуме",
    "footer.col.forum.link.program": "Программа",
    "footer.col.forum.link.speakers": "Спикеры",
    "footer.col.forum.link.partners": "Партнёры",
    "footer.col.participate.title": "Участие",
    "footer.col.participate.link.register": "Регистрация",
    "footer.col.participate.link.media": "Аккредитация СМИ",
    "footer.col.participate.link.partner": "Партнёрский пакет",
    "footer.col.participate.link.speaker": "Стать спикером",
    "footer.col.info.title": "Информация",
    "footer.col.info.link.venue": "Площадка",
    "footer.col.info.link.route": "Маршрут",
    "footer.col.info.link.archive": "Архив форумов",
    "footer.col.info.link.press": "Пресс-релизы",
    "footer.col.contacts.title": "Контакты",
    "footer.tagline":
      "Ежегодное флагманское событие цифровой отрасли Кыргызской Республики. С 2010 года.",
    "footer.organizerLabel": "Организатор",
    "footer.organizerName": "Парк высоких технологий КР",
    "footer.eventLine": "4–5 июня 2026 · Бишкек",
    "footer.liveBadge": "Online · KGZ · GMT+6",
    "footer.versionBadge": "v.2026.06 · РУС",
    "footer.copyright":
      "© 2026 КИТ Форум · Парк высоких технологий Кыргызской Республики · Все права защищены.",
    "footer.privacy": "Политика конфиденциальности",
  },

  ky: {
    // ─── Навигация
    "nav.about": "Форум жөнүндө",
    "nav.program": "Программа",
    "nav.speakers": "Спикерлер",
    "nav.partners": "Өнөктөштөр",
    "nav.contacts": "Байланыш",
    "nav.openMenu": "Менюну ачуу",
    "nav.closeMenu": "Менюну жабуу",
    "nav.menuAria": "Меню",
    "nav.mainAria": "Негизги навигация",
    "nav.homeAria": "КИТ Форум — башкы бетке",

    // ─── Аракеттер
    "cta.register": "Катталуу",
    "cta.program": "Форумдун программасы",
    "cta.allSpeakers": "Бардык спикерлер",
    "cta.submit": "Арызды жөнөтүү",
    "cta.submitting": "Жөнөтүлүүдө…",
    "cta.directions": "Маршрут түзүү",
    "cta.open2gis": "2ГИСте ачуу",
    "cta.viewDetails": "Толугураак",
    "cta.reset": "Тазалоо",
    "cta.replayVideo": "Кайра ойнотуу",

    // ─── Жүктөгүч
    "loader.aria": "Жүктөлүүдө",
    "loader.eyebrow": "Тажрыйбага даярдоо · 04.06.2026",
    "loader.title": "КИТ ФОРУМ",
    "loader.subtitle":
      "Борбордук Азиянын санариптик тармагынын башкы окуясын жүктөп жатабыз.",
    "loader.metaVersion": "v.2026.06",
    "loader.metaCity": "Бишкек · KGZ",
    "loader.metaCoords": "42.84°N · 74.60°E",

    // ─── Hero
    "hero.aria": "КИТ Форум 2026",
    "hero.eyebrowIndex": "01",
    "hero.eyebrowText": "Кыргыз Республикасы · 2026",
    "hero.liveBadge": "Live · 04.06.2026",
    "hero.title": "КИТ ФОРУМ",
    "hero.lead":
      "Борбордук Азиядагы санариптик технологиялар жана инновациялар жаатындагы эң ири окуя. 2010-жылдан бери мамлекеттик деңгээлде тармактын күн тартибин түзүп келет.",
    "hero.dateLine": "4–5-июнь, 2026 · Бишкек",
    "hero.venueLine": "КЭУ · Лев Толстой көчөсү, 1 (17Б)",
    "hero.organizerLine": "Уюштуруучу · КР ЖТП",
    "hero.scrollHint": "Уланта берүү үчүн ылдый сыдырыңыз",
    "hero.scrollAria": "Ылдый сыдыруу",

    // ─── Форум жөнүндө
    "about.eyebrowIndex": "01",
    "about.eyebrowText": "Форум жөнүндө",
    "about.daysUntilLabel": "Форумга чейин",
    "about.daysUnit": "күн",
    "about.titleA": "Кыргыз Республикасынын",
    "about.titleB": "санариптик секторунун",
    "about.titleC": "башкы аянтчасы.",
    "about.lead":
      "2010-жылдан бери — Борбордук Азиянын санариптик трансформациясынын күн тартиби түзүлгөн мейкиндик. Мамлекет, бизнес, эл аралык институттар жана илимий коомчулук бир дасторкондо.",
    "about.metaLocation": "Жайгашкан жери",
    "about.metaLocationValue": "Бишкек · KGZ",
    "about.metaCoordinates": "Координаттар",
    "about.metaCoordinatesValue": "42.84°N · 74.60°E",
    "about.metaDate": "Күнү",
    "about.metaDateValue": "04—05.06.2026",
    "about.metaTimezone": "Убакыт алкагы",
    "about.metaTimezoneValue": "GMT+6",
    "about.mainStatLabel": "Башкы сан",
    "about.mainStatSubtitle": "катышуучу · 2026",
    "about.mainStatHint":
      "Бизнестин, мамлекеттин, эл аралык институттардын, эксперттик жана студенттик коомчулуктардын лидерлери.",
    "about.stat02Label": "жылдык тарых",
    "about.stat02Hint": "2010-жылдан бери — жыл сайын, тыныгуусуз.",
    "about.stat03Label": "катышуучу өлкө",
    "about.stat03Hint": "Борбордук Азия, КМШ, ЕС, АТА, MENA.",
    "about.body1":
      "КИТ Форум — Кыргызстандын санариптик тармагынын жыл сайын өткөрүлгөн флагмандык окуясы. Эки жарым миңден ашуун катышуучуну: мамлекеттик ишмерлерди, ишкерлерди, технологиялык компаниялардын лидерлерин, академиялык жана студенттик коомчулукту, ошондой эле эл аралык делегацияларды бириктирет.",
    "about.body2":
      "2026-жылдын программасы 2030-жылга чейинки санариптештирүү боюнча улуттук стратегиянын, мамлекеттик деңгээлдеги жасалма интеллекттин өнүгүшүнүн, критикалык инфраструктуранын киберкоопсуздугунун, санариптик кызматтардын экспортунун жана жаңы муундагы кадрларды даярдоонун айланасында түзүлүүдө.",
    "about.body3":
      "Форум улуттук жана аймактык деңгээлдеги чечимдер кабыл алынган мейкиндик бойдон калууда — мамлекеттер ортосундагы эки тараптуу меморандумдардан тартып, эл аралык каржы институттары менен биргелешкен программаларды иштетүүгө чейин.",
    "about.organizerLabel": "Уюштуруучу",
    "about.organizerNameA": "Кыргыз Республикасынын",
    "about.organizerNameB": "Жогорку технологиялар паркы",
    "about.organizerMeta": "htp.kg · 2011-жылдан бери · КР Министрлер Кабинети",

    // ─── Программа
    "program.eyebrow": "Программа · 02",
    "program.titleA": "Эки күн жыйнактуу",
    "program.titleB": "күн тартиби жана",
    "program.titleC": "чечимдер",
    "program.titleD": ".",
    "program.lead":
      "Пленардык сессиялар, прикладдык мастер-класстар, инвестициялык жолугушуулар жана расмий эмес талкуулар. Сессиялардын курамы спикерлер ырасталган сайын жаңыланат.",
    "program.updatedBadge": "Жаңыртылды · бүгүн",
    "program.version": "Версия 2026.06.01 · КЫР",
    "program.tabsAria": "Программанын күндөрү",
    "program.tracksLabel": "Багыттар",
    "program.trackPrefix": "Багыт",
    "program.mainHall": "Башкы зал",
    "program.track.ai": "AI",
    "program.track.gov": "Мамлекет",
    "program.track.startup": "Стартап",
    "program.track.edu": "Билим",
    "program.track.security": "Коопсуздук",
    "program.track.general": "Жалпы",
    "program.type.keynote": "Keynote",
    "program.type.panel": "Панель",
    "program.type.workshop": "Воркшоп",
    "program.type.networking": "Нетворкинг",
    "program.type.break": "Тыныгуу",
    "program.type.ceremony": "Аземи",

    // ─── Спикерлер
    "speakers.eyebrow": "Спикерлер · 03",
    "speakers.titleA": "Тармакты",
    "speakers.titleB": "аныктаган",
    "speakers.titleC": "үндөр",
    "speakers.titleD": ".",
    "speakers.lead":
      "Өкмөттөн чечим кабыл алуучулар, региондук технологиялык компаниялардын лидерлери, изилдөөчүлөр жана эл аралык институттардын өкүлдөрү. 2026-жылдын курамы апта сайын жаңыртылууда.",
    "speakers.confirmedBadge": "Ырасталды · {count} спикер",
    "speakers.viewAllLead":
      "Спикерлердин курамы кеңейүүдө. Биографиялары жана сессиялары менен толук тизме өзүнчө барактан жеткиликтүү.",
    "speakers.cardCountryHint": "Толугураак",

    // ─── Спикерлер бети
    "speakersPage.eyebrow": "Бардык спикерлер · /speakers",
    "speakersPage.titleA": "Барак даярдалууда.",
    "speakersPage.titleB": "Жакында бул жерде.",
    "speakersPage.lead":
      "Спикерлердин толук карточкалары, биографиялары, сүйлөө темалары жана өткөн сессиялардын жазуулары форум башталганга жакын пайда болот. Биринчилерден болуп билиш үчүн жазылыңыз.",
    "speakersPage.back": "Башкы бетке кайтуу",
    "speakersPage.contact": "Уюштуруу комитети менен байланышуу",
    "speakersPage.footerCopyright":
      "© 2026 КИТ Форум · КР Жогорку технологиялар паркы",
    "speakersPage.footerStatus": "Барак иштелип жатат",

    // ─── Өнөктөштөр
    "partners.eyebrow": "Өнөктөштөр · 04",
    "partners.titleA": "Форумдун өнөктөштөрү",
    "partners.titleB": "жана колдоочу",
    "partners.titleC": "уюмдары.",
    "partners.lead":
      "Мамлекеттик институттар, өнүгүү банктары, алдыңкы технологиялык компаниялар жана университеттер — региондун санариптик келечегин түзгөн бардыгы.",
    "partners.countBadge": "{count} уюм",

    // ─── Аянтча
    "venue.eyebrow": "Аянтча · 05",
    "venue.titleA": "Кыргызстан",
    "venue.titleB": "Эл аралык университети",
    "venue.titleC": "· Борбордук кампус.",
    "venue.lead":
      "КИТ Форум 2026нын кабыл алуучу аянтчасы — Лев Толстой көчөсүндөгү КЭУнун башкы имараты. Конференц-залдар, экспо-мейкиндик, билим берүү блоктору, ачык кампус короосу.",
    "venue.addressLabel": "Дареги",
    "venue.mapAria": "Бишкектеги форумдун аянтчасынын картасы",

    // ─── Байланыш
    "contacts.eyebrow": "Байланыш · 06",
    "contacts.titleA": "Форумдун",
    "contacts.titleB": "",
    "contacts.titleC": "уюштуруу комитети",
    "contacts.titleD": "менен байланыш.",
    "contacts.lead":
      "Катышуу боюнча суроо-талаптар, ЖМК аккредитациясы, өнөктөштүк сунуштар, делегацияларды чакыруу. Бир жумушчу күндүн ичинде жооп беребиз.",
    "contacts.liveBadge": "Online · GMT+6",
    "contacts.hoursLabel": "Иштөө сааттары",
    "contacts.hoursValueA": "Дш—Жм",
    "contacts.hoursValueB": "09:00–18:00",
    "contacts.hoursMeta": "GMT+6 · Бишкек",
    "contacts.row.organizer.label": "Уюштуруучу",
    "contacts.row.organizer.primary":
      "Кыргыз Республикасынын Жогорку технологиялар паркы",
    "contacts.row.organizer.l1": "КИТ Форум 2026нын башкы уюштуруучусу",
    "contacts.row.organizer.l2":
      "htp.kg · Бишкек ш., Кыргыз Республикасы",
    "contacts.row.organizer.l3":
      "Башкаруу органы — КР Министрлер Кабинети",
    "contacts.row.venue.label": "Аянтча",
    "contacts.row.venue.primary": "Кыргызстан Эл аралык университети",
    "contacts.row.venue.l1": "КЭУнун Борбордук кампусу",
    "contacts.row.venue.l2": "Бишкек, Лев Толстой көчөсү, 1 (17Б)",
    "contacts.row.coord.label": "Жалпы координация",
    "contacts.row.program.label": "Программа · Спикерлер",
    "contacts.row.expo.label": "EXPO",
    "contacts.row.pr.label": "PR · ЖМК",
    "contacts.row.startup.label": "Стартаптар · Венчур · Университеттер",
    "contacts.row.social.label": "Социалдык тармактар",
    "contacts.row.social.secondary":
      "Негизги сессиялардын түз эфирлери — форумдун YouTube каналында",
    "contacts.formEyebrow": "Арыз · 07",
    "contacts.formTitleA": "Катышууга арыз",
    "contacts.formTitleB": "берүү.",
    "contacts.formLead":
      "Форманы толтуруңуз — уюштуруу комитети катышуунун, аккредитациянын жана логистиканын чоо-жайын такташ үчүн сиз менен байланышат.",
    "contacts.field.name.label": "Аты-жөнү",
    "contacts.field.name.placeholder": "Айбек Айдаров",
    "contacts.field.name.error": "Атыңызды көрсөтүңүз — кеминде 2 белги",
    "contacts.field.email.label": "Email",
    "contacts.field.email.placeholder": "name@company.kg",
    "contacts.field.email.error": "Туура email дарегин жазыңыз",
    "contacts.field.message.label": "Билдирүү",
    "contacts.field.message.placeholder":
      "Кайрылуунун максатын жазыңыз — катышуу, ЖМК аккредитациясы, өнөктөштүк…",
    "contacts.field.message.error":
      "Билдирүү өтө кыска — кеминде 8 белги",
    "contacts.agreePrefix": "Форманы жөнөтүү менен сиз ",
    "contacts.agreeLink": "жеке маалыматтарды иштетүү саясатына",
    "contacts.agreeSuffix": " макул болосуз.",
    "contacts.success.eyebrow": "Кабыл алынды",
    "contacts.success.title": "Арыз жөнөтүлдү.",
    "contacts.success.bodyA": "Ырастоо ",
    "contacts.success.bodyB":
      " дарегине жөнөтүлдү. Уюштуруу комитети бир жумушчу күндүн ичинде сиз менен байланышат.",
    "contacts.success.reset": "Дагы бир арыз жөнөтүү",

    // ─── Подвал
    "footer.col.forum.title": "Форум",
    "footer.col.forum.link.about": "Форум жөнүндө",
    "footer.col.forum.link.program": "Программа",
    "footer.col.forum.link.speakers": "Спикерлер",
    "footer.col.forum.link.partners": "Өнөктөштөр",
    "footer.col.participate.title": "Катышуу",
    "footer.col.participate.link.register": "Каттоо",
    "footer.col.participate.link.media": "ЖМК аккредитациясы",
    "footer.col.participate.link.partner": "Өнөктөштүк пакети",
    "footer.col.participate.link.speaker": "Спикер болуу",
    "footer.col.info.title": "Маалымат",
    "footer.col.info.link.venue": "Аянтча",
    "footer.col.info.link.route": "Маршрут",
    "footer.col.info.link.archive": "Форумдардын архиви",
    "footer.col.info.link.press": "Пресс-релиздер",
    "footer.col.contacts.title": "Байланыш",
    "footer.tagline":
      "Кыргыз Республикасынын санариптик тармагынын жыл сайын өткөрүлгөн флагмандык окуясы. 2010-жылдан бери.",
    "footer.organizerLabel": "Уюштуруучу",
    "footer.organizerName": "КР Жогорку технологиялар паркы",
    "footer.eventLine": "4–5-июнь, 2026 · Бишкек",
    "footer.liveBadge": "Online · KGZ · GMT+6",
    "footer.versionBadge": "v.2026.06 · КЫР",
    "footer.copyright":
      "© 2026 КИТ Форум · Кыргыз Республикасынын Жогорку технологиялар паркы · Бардык укуктар корголгон.",
    "footer.privacy": "Купуялык саясаты",
  },

  en: {
    // ─── Navigation
    "nav.about": "About",
    "nav.program": "Programme",
    "nav.speakers": "Speakers",
    "nav.partners": "Partners",
    "nav.contacts": "Contacts",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",
    "nav.menuAria": "Menu",
    "nav.mainAria": "Main navigation",
    "nav.homeAria": "KIT Forum — back to home",

    // ─── CTAs
    "cta.register": "Register",
    "cta.program": "View programme",
    "cta.allSpeakers": "All speakers",
    "cta.submit": "Submit request",
    "cta.submitting": "Sending…",
    "cta.directions": "Get directions",
    "cta.open2gis": "Open in 2GIS",
    "cta.viewDetails": "Read more",
    "cta.reset": "Reset",
    "cta.replayVideo": "Play again",

    // ─── Loader
    "loader.aria": "Loading",
    "loader.eyebrow": "Preparing the experience · 04.06.2026",
    "loader.title": "KIT FORUM",
    "loader.subtitle":
      "Loading Central Asia's flagship digital-industry event.",
    "loader.metaVersion": "v.2026.06",
    "loader.metaCity": "Bishkek · KGZ",
    "loader.metaCoords": "42.84°N · 74.60°E",

    // ─── Hero
    "hero.aria": "KIT Forum 2026",
    "hero.eyebrowIndex": "01",
    "hero.eyebrowText": "Kyrgyz Republic · 2026",
    "hero.liveBadge": "Live · 04.06.2026",
    "hero.title": "KIT FORUM",
    "hero.lead":
      "Central Asia's largest event in digital technology and innovation. Setting the industry agenda at the state level since 2010.",
    "hero.dateLine": "4–5 June 2026 · Bishkek",
    "hero.venueLine": "IUK · 1 (17B) Lev Tolstoy Street",
    "hero.organizerLine": "Organiser · HTP KR",
    "hero.scrollHint": "Scroll to continue",
    "hero.scrollAria": "Scroll down",

    // ─── About
    "about.eyebrowIndex": "01",
    "about.eyebrowText": "About",
    "about.daysUntilLabel": "Until the forum",
    "about.daysUnit": "days",
    "about.titleA": "The flagship venue",
    "about.titleB": "for the digital sector",
    "about.titleC": "of the Kyrgyz Republic.",
    "about.lead":
      "Since 2010 — the space where Central Asia's digital-transformation agenda is shaped. Government, business, international institutions and academia at one table.",
    "about.metaLocation": "Location",
    "about.metaLocationValue": "Bishkek · KGZ",
    "about.metaCoordinates": "Coordinates",
    "about.metaCoordinatesValue": "42.84°N · 74.60°E",
    "about.metaDate": "Date",
    "about.metaDateValue": "04—05.06.2026",
    "about.metaTimezone": "Time zone",
    "about.metaTimezoneValue": "GMT+6",
    "about.mainStatLabel": "Headline figure",
    "about.mainStatSubtitle": "participants · 2026",
    "about.mainStatHint":
      "Leaders from business, government, international institutions, and the expert and student communities.",
    "about.stat02Label": "years of history",
    "about.stat02Hint": "Annually since 2010 — without interruption.",
    "about.stat03Label": "participating countries",
    "about.stat03Hint": "Central Asia, CIS, EU, Asia-Pacific, MENA.",
    "about.body1":
      "KIT Forum is the annual flagship event of Kyrgyzstan's digital industry, bringing together more than two and a half thousand participants: government officials, entrepreneurs, leaders of technology companies, the academic and student community, and international delegations.",
    "about.body2":
      "The 2026 programme is built around Kyrgyzstan's national digitalisation strategy to 2030, the development of artificial intelligence at the state level, cybersecurity of critical infrastructure, the export of digital services, and the training of the next generation of talent.",
    "about.body3":
      "The forum remains the venue where decisions of national and regional significance are taken — from bilateral memoranda between states to the launch of joint programmes with international financial institutions.",
    "about.organizerLabel": "Organiser",
    "about.organizerNameA": "High Technology Park",
    "about.organizerNameB": "of the Kyrgyz Republic",
    "about.organizerMeta":
      "htp.kg · since 2011 · Cabinet of Ministers of the KR",

    // ─── Programme
    "program.eyebrow": "Programme · 02",
    "program.titleA": "Two days of dense",
    "program.titleB": "agenda and",
    "program.titleC": "decisions",
    "program.titleD": ".",
    "program.lead":
      "Plenary sessions, hands-on workshops, investment meetings, and informal dialogue. The line-up is refreshed as speakers are confirmed.",
    "program.updatedBadge": "Updated · today",
    "program.version": "Version 2026.06.01 · ENG",
    "program.tabsAria": "Programme days",
    "program.tracksLabel": "Tracks",
    "program.trackPrefix": "Track",
    "program.mainHall": "Main Hall",
    "program.track.ai": "AI",
    "program.track.gov": "Gov",
    "program.track.startup": "Startup",
    "program.track.edu": "Edu",
    "program.track.security": "Security",
    "program.track.general": "General",
    "program.type.keynote": "Keynote",
    "program.type.panel": "Panel",
    "program.type.workshop": "Workshop",
    "program.type.networking": "Networking",
    "program.type.break": "Break",
    "program.type.ceremony": "Ceremony",

    // ─── Speakers
    "speakers.eyebrow": "Speakers · 03",
    "speakers.titleA": "The voices",
    "speakers.titleB": "shaping",
    "speakers.titleC": "the industry",
    "speakers.titleD": ".",
    "speakers.lead":
      "Government decision-makers, leaders of the region's technology companies, researchers, and representatives of international institutions. The 2026 line-up is being assembled and updated weekly.",
    "speakers.confirmedBadge": "Confirmed · {count} speakers",
    "speakers.viewAllLead":
      "The speaker line-up keeps growing. The full list — with biographies and sessions — is on a dedicated page.",
    "speakers.cardCountryHint": "Read more",

    // ─── Speakers page
    "speakersPage.eyebrow": "All speakers · /speakers",
    "speakersPage.titleA": "Page in preparation.",
    "speakersPage.titleB": "Coming soon.",
    "speakersPage.lead":
      "Detailed speaker cards, biographies, talk topics, and recordings of past sessions will appear closer to the start of the forum. Subscribe to be the first to know.",
    "speakersPage.back": "Back to home",
    "speakersPage.contact": "Contact the organising committee",
    "speakersPage.footerCopyright":
      "© 2026 KIT Forum · High Technology Park of the KR",
    "speakersPage.footerStatus": "Page under development",

    // ─── Partners
    "partners.eyebrow": "Partners · 04",
    "partners.titleA": "Partners and supporting",
    "partners.titleB": "organisations",
    "partners.titleC": "of the forum.",
    "partners.lead":
      "State institutions, development banks, leading technology companies, and universities — those who are shaping the region's digital future.",
    "partners.countBadge": "{count} organisations",

    // ─── Venue
    "venue.eyebrow": "Venue · 05",
    "venue.titleA": "International University",
    "venue.titleB": "of Kyrgyzstan",
    "venue.titleC": "· Central Campus.",
    "venue.lead":
      "The host venue of KIT Forum 2026 is the IUK main building on Lev Tolstoy Street — conference halls, expo space, education blocks, and an open campus courtyard.",
    "venue.addressLabel": "Address",
    "venue.mapAria": "Map showing the forum venue in Bishkek",

    // ─── Contacts
    "contacts.eyebrow": "Contacts · 06",
    "contacts.titleA": "Get in touch",
    "contacts.titleB": "with the",
    "contacts.titleC": "organising committee",
    "contacts.titleD": ".",
    "contacts.lead":
      "Participation requests, media accreditation, partnership proposals, delegation invitations. We respond within one business day.",
    "contacts.liveBadge": "Online · GMT+6",
    "contacts.hoursLabel": "Working hours",
    "contacts.hoursValueA": "Mon—Fri",
    "contacts.hoursValueB": "09:00–18:00",
    "contacts.hoursMeta": "GMT+6 · Bishkek",
    "contacts.row.organizer.label": "Organiser",
    "contacts.row.organizer.primary":
      "High Technology Park of the Kyrgyz Republic",
    "contacts.row.organizer.l1": "Lead organiser of KIT Forum 2026",
    "contacts.row.organizer.l2": "htp.kg · Bishkek, Kyrgyz Republic",
    "contacts.row.organizer.l3":
      "Governing body — Cabinet of Ministers of the KR",
    "contacts.row.venue.label": "Venue",
    "contacts.row.venue.primary": "International University of Kyrgyzstan",
    "contacts.row.venue.l1": "IUK Central Campus",
    "contacts.row.venue.l2": "Bishkek, 1 (17B) Lev Tolstoy Street",
    "contacts.row.coord.label": "General coordination",
    "contacts.row.program.label": "Programme · Speakers",
    "contacts.row.expo.label": "EXPO",
    "contacts.row.pr.label": "PR · Media",
    "contacts.row.startup.label": "Startups · Venture · Universities",
    "contacts.row.social.label": "Social media",
    "contacts.row.social.secondary":
      "Live streams of key sessions on the forum's YouTube channel",
    "contacts.formEyebrow": "Request · 07",
    "contacts.formTitleA": "Request",
    "contacts.formTitleB": "to participate.",
    "contacts.formLead":
      "Fill in the form — the organising committee will contact you to confirm participation details, accreditation, and logistics.",
    "contacts.field.name.label": "Full name",
    "contacts.field.name.placeholder": "Aibek Aidarov",
    "contacts.field.name.error": "Please enter a name — at least 2 characters",
    "contacts.field.email.label": "Email",
    "contacts.field.email.placeholder": "name@company.kg",
    "contacts.field.email.error": "Please enter a valid email address",
    "contacts.field.message.label": "Message",
    "contacts.field.message.placeholder":
      "Tell us about your request — participation, media accreditation, partnership…",
    "contacts.field.message.error":
      "Message is too short — at least 8 characters",
    "contacts.agreePrefix": "By submitting this form, you agree to the ",
    "contacts.agreeLink": "personal data processing policy",
    "contacts.agreeSuffix": ".",
    "contacts.success.eyebrow": "Received",
    "contacts.success.title": "Request submitted.",
    "contacts.success.bodyA": "Confirmation has been sent to ",
    "contacts.success.bodyB":
      ". The organising committee will be in touch within one business day.",
    "contacts.success.reset": "Submit another request",

    // ─── Footer
    "footer.col.forum.title": "Forum",
    "footer.col.forum.link.about": "About",
    "footer.col.forum.link.program": "Programme",
    "footer.col.forum.link.speakers": "Speakers",
    "footer.col.forum.link.partners": "Partners",
    "footer.col.participate.title": "Participate",
    "footer.col.participate.link.register": "Registration",
    "footer.col.participate.link.media": "Media accreditation",
    "footer.col.participate.link.partner": "Partnership package",
    "footer.col.participate.link.speaker": "Become a speaker",
    "footer.col.info.title": "Information",
    "footer.col.info.link.venue": "Venue",
    "footer.col.info.link.route": "Directions",
    "footer.col.info.link.archive": "Forum archive",
    "footer.col.info.link.press": "Press releases",
    "footer.col.contacts.title": "Contacts",
    "footer.tagline":
      "The annual flagship event of the Kyrgyz Republic's digital industry. Since 2010.",
    "footer.organizerLabel": "Organiser",
    "footer.organizerName": "High Technology Park of the KR",
    "footer.eventLine": "4–5 June 2026 · Bishkek",
    "footer.liveBadge": "Online · KGZ · GMT+6",
    "footer.versionBadge": "v.2026.06 · ENG",
    "footer.copyright":
      "© 2026 KIT Forum · High Technology Park of the Kyrgyz Republic · All rights reserved.",
    "footer.privacy": "Privacy policy",
  },
};
