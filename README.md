# КИТ Форум 2026 — Официальный сайт

Single-page editorial site for KIT Forum 2026, Kyrgyz Republic's flagship
digital-sector event, organized by High Technologies Park together with the
Ministry of Digital Development and the Ministry of Culture, Information,
Sports & Youth Policy.

> Дизайн-философия: presidential-level event, не корпоративный SaaS.
> Белая палитра с электрическим синим, плотная типографика Inter Display,
> кинематографичная вступительная анимация, пружинные переходы.

---

## Stack

- Vite 5 + React 18 + TypeScript (strict)
- TailwindCSS 3 with custom design tokens (`tailwind.config.ts`)
- Framer Motion — все reveal-анимации и пружинные переходы
- Lucide React — outline-иконки
- Leaflet + CartoDB light tiles — карта площадки
- React Router — `/` и `/speakers`

---

## Запуск

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production bundle in /dist
npm run preview      # serve dist on :4173
npm run lint         # tsc --noEmit
```

После `npm install` проверьте, что `public/videos/3.mp4` существует — это
hero-видео. Файл должен быть размером ~24 МБ. Если его нет, скопируйте
исходный mp4 в `public/videos/3.mp4`.

---

## Where to swap placeholder content

Все плейсхолдеры собраны в `/src/data/` и помечены `placeholder: true`
там, где требуется свопнуть на боевые материалы.

| Что заменить | Файл |
| --- | --- |
| Список спикеров (12 карточек) | `src/data/speakers.ts` |
| Программа двух дней | `src/data/program.ts` |
| Логотипы партнёров (16 SVG-монограмм) | `src/data/partners.ts` |
| Площадка, адрес, координаты | `src/data/venue.ts` |
| Контакты в навигации и футере | `src/data/organizers.ts`, `src/components/sections/Contacts.tsx`, `src/components/sections/Footer.tsx` |
| Hero-видео | `public/videos/3.mp4` (poster — `public/videos/poster.svg`) |
| OG-картинка | `public/og-image.svg` → конвертировать в `og-image.png` 1200×630 |
| SEO meta (title / description / og:url) | `index.html` |

Карточки спикеров и партнёры используют `data-placeholder="true"`. После
подстановки реальных данных переключите этот флаг в данных, а в
карточках можно убрать визуальные индикаторы плейсхолдера, если они
будут добавлены.

---

## Локализация

`/src/i18n/` содержит провайдер и словарь. По умолчанию `ru` — единственная
полностью заполненная локаль. Языковой переключатель функционален: при
переключении на `ky` или `en` сайт работает, но строки fallback'ятся на `ru`,
пока не заполнены файлы:

- `src/i18n/dictionaries.ts` → блоки `ky: { ... }` и `en: { ... }`

Атрибут `<html lang>` обновляется автоматически при смене языка.

---

## Дизайн-система

Брендовая палитра, типографика, скругления, тени описаны в `tailwind.config.ts`.
Глобальные базовые стили — `src/styles/index.css`.

- Никогда не используется `#000000` — текст: `#0A1628`
- Тени мягкие, на тон фона: `shadow-soft`, `shadow-lift`
- Все скругления через токены: `rounded-lg` = 16px, `rounded-md` = 12px
- Spring-кривая по умолчанию: `ease-spring` = `cubic-bezier(0.32, 0.72, 0, 1)`
- Полностью соблюдается `prefers-reduced-motion: reduce`

---

## Доступность

- Семантические landmark'и: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`
- Все интерактивные элементы имеют видимый focus-ring
- Все иконки декоративны и помечены `aria-hidden`, либо имеют `aria-label`
- Программа имеет полноценный tablist (role=tab/tabpanel/aria-selected)
- Карта имеет `aria-label`
- Все формы — `<label>` + `aria-invalid` + `aria-describedby` для ошибок

---

## Качество кода и расширение

`src/components/sections/` — секции одной страницы. `src/components/ui/`
переиспользуемые примитивы (Reveal, SectionHeader, Buttons, CountUp,
LangSwitcher, Logo, SpeakerPortrait).

Чтобы добавить новый блок:
1. Создайте файл в `src/components/sections/NewSection.tsx`.
2. Импортируйте `SectionHeader`, `Reveal` для согласованности.
3. Подключите в `src/App.tsx` в нужном порядке.

---

## Контакт

`info@kitforum.kg` — заявки и общие вопросы.
