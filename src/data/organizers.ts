import type { Localized } from "@/i18n/I18nProvider";

export const organizers = [
  {
    id: "htp",
    label: {
      ru: "Парк высоких технологий КР",
      ky: "КР Жогорку технологиялар паркы",
      en: "High Technology Park of the KR",
    } as Localized,
    role: {
      ru: "Главный организатор",
      ky: "Башкы уюштуруучу",
      en: "Lead organiser",
    } as Localized,
  },
  {
    id: "minkultury",
    label: {
      ru: "Министерство культуры, информации, спорта и молодёжной политики КР",
      ky: "КРнын Маданият, маалымат, спорт жана жаштар саясаты министрлиги",
      en: "Ministry of Culture, Information, Sport and Youth Policy of the KR",
    } as Localized,
    role: {
      ru: "При поддержке",
      ky: "Колдоосу менен",
      en: "With support from",
    } as Localized,
  },
  {
    id: "mincifra",
    label: {
      ru: "Министерство цифрового развития и инновационных технологий КР",
      ky: "КРнын Санариптик өнүгүү жана инновациялык технологиялар министрлиги",
      en: "Ministry of Digital Development and Innovative Technology of the KR",
    } as Localized,
    role: {
      ru: "При поддержке",
      ky: "Колдоосу менен",
      en: "With support from",
    } as Localized,
  },
];

export const navLinks = [
  { id: "about", labelKey: "nav.about", href: "#about" },
  { id: "program", labelKey: "nav.program", href: "#program" },
  { id: "speakers", labelKey: "nav.speakers", href: "#speakers" },
  { id: "partners", labelKey: "nav.partners", href: "#partners" },
  { id: "contacts", labelKey: "nav.contacts", href: "#contacts" },
];

export const socialLinks = [
  { id: "telegram", label: "Telegram", href: "https://t.me/kitforum" },
  { id: "facebook", label: "Facebook", href: "https://facebook.com/kitforum" },
  { id: "instagram", label: "Instagram", href: "https://instagram.com/kitforum" },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/company/kitforum" },
  { id: "youtube", label: "YouTube", href: "https://youtube.com/@kitforum" },
];
