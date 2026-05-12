# КИТ Форум 2026 — Официальный сайт

Single-page editorial site for KIT Forum 2026, Kyrgyz Republic's flagship
digital-sector event, organized by High Technologies Park together with the
Ministry of Digital Development and the Ministry of Culture, Information,
Sports & Youth Policy.

> Дизайн-философия: presidential-level event, не корпоративный SaaS.
> Белая палитра с электрическим синим, плотная типографика Inter Display,
> кинематографичная вступительная анимация, Liquid Glass панели, пружинные переходы.

---

## Stack

- Vite 5 + React 18 + TypeScript (strict)
- TailwindCSS 3 with custom design tokens (`tailwind.config.ts`)
- Framer Motion — reveal-анимации, parallax, пружинные переходы
- Lucide React — outline-иконки
- React Router — `/` и `/speakers`

> Leaflet удалён. Карта заменена секцией CityCTA с видеофоном и Google Maps.
> Bundle: ~666 KB gzip (было ~821 KB).

---

## Запуск

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production bundle in /dist
npm run preview      # serve dist on :4173
```

Для TypeScript-проверки как на Vercel:

```bash
npx tsc -b           # использует tsconfig.json с references — единственный корректный способ
```

> `tsc --noEmit` не работает: корневой `tsconfig.json` содержит `"files": []` и не проверяет src.

После `npm install` убедитесь, что `public/videos/3.mp4` существует — hero-видео (~24 МБ).

---

## Секции

| Секция | Файл | Описание |
| --- | --- | --- |
| PageLoader | `src/components/ui/PageLoader.tsx` | Брендированный splash: ждёт `canplaythrough` hero-видео или таймаут 5.5 с. Spinner-пилюля, пульсирующая точка, shimmer-прогресс-бар |
| Navigation | `src/components/sections/Navigation.tsx` | Sticky хедер, blur-backdrop, якорные ссылки, языковой переключатель |
| Hero | `src/components/sections/Hero.tsx` | Fullscreen тёмная секция, 16:9 MP4-видео (desktop + mobile), обратный отсчёт, stats + CTA завёрнуты в Liquid Glass карточку |
| Program | `src/components/sections/Program.tsx` | Двухдневная программа, tab-переключение |
| Speakers | `src/components/sections/Speakers.tsx` | Сетка карточек спикеров, страница `/speakers` |
| Partners | `src/components/sections/Partners.tsx` | Бесконечный marquee логотипов |
| Contacts | `src/components/sections/Contacts.tsx` | Форма регистрации + контакты |
| CityCTA | `src/components/sections/CityCTA.tsx` | Видеофон с параллаксом (bishkek-cyber.mp4), Liquid Glass панель с данными площадки, кнопка «Построить маршрут» → Google Maps |
| Footer | `src/components/sections/Footer.tsx` | Колонки ссылок, контакты, языковой переключатель, версия |

---

## Liquid Glass

Единый визуальный мотив для панелей на тёмных фонах (Hero, CityCTA):

```css
background: linear-gradient(160deg, rgba(255,255,255,0.08–0.10) …);
backdrop-filter: blur(20–22px) saturate(150–160%);
border: 1px solid rgba(255,255,255,0.10–0.14);
box-shadow: 0 24–30px 64–80px … /* внешняя тень */
            inset 0 1px 0 rgba(255,255,255,0.14–0.18); /* верхний бликовый шов */
```

Каждая панель дополнена двумя псевдослоями через `<div aria-hidden>`:
- Specular highlight — радиальный градиент `top-left`, имитирует мокрое стекло
- Brand-glow accent — радиальный градиент `bottom-right`, лёгкое голубое свечение `rgba(0,212,255,…)`

---

## Видеофоны

### Hero (`/videos/3.mp4`)
- Запускается только после закрытия PageLoader (`onLoaderDone`)
- Poster: `public/videos/poster.webp`
- Отдельный мобильный файл: `3-mobile.mp4 / 3-mobile.webm`
- При `prefers-reduced-motion` видео не играет

### CityCTA (`/videos/bishkek-cyber.mp4`, 8.7 MB)
- Кибер-пунк Бишкек с эффектами светящихся импульсов
- Параллакс: `useScroll` + `useTransform` Y от −6% до +6%, scale 1.06→1→1.06
- Трёхуровневый fallback: MP4 → статичное фото (`/images/bishkek-cyber.jpg`) → CSS-градиент `.city-cta-backdrop`
- При `prefers-reduced-motion` видео пропускается, используется только фото/CSS

---

## Where to swap placeholder content

| Что заменить | Файл |
| --- | --- |
| Список спикеров | `src/data/speakers.ts` |
| Программа двух дней | `src/data/program.ts` |
| Логотипы партнёров | `src/data/partners.ts` |
| Площадка, адрес, координаты | `src/data/venue.ts` |
| Контакты | `src/components/sections/Contacts.tsx`, `src/components/sections/Footer.tsx` |
| Hero-видео (desktop) | `public/videos/3.mp4` + `public/videos/3.webm` |
| Hero-видео (mobile) | `public/videos/3-mobile.mp4` + `public/videos/3-mobile.webm` |
| Hero poster | `public/videos/poster.webp` |
| CityCTA фоновое видео | `public/videos/bishkek-cyber.mp4` |
| CityCTA fallback фото | `public/images/bishkek-cyber.jpg` |
| OG-картинка | `public/og-image.png` 1200×630 |
| SEO meta | `index.html` |

---

## Локализация

`/src/i18n/` — провайдер и единый словарь. По умолчанию `ru` полностью заполнен.
При переключении на `ky` / `en` строки автоматически fallback'ятся на `ru`.

- Все переводы: `src/i18n/dictionaries.ts`
- `t("key")` — строка текущей локали
- `tr({ ru, ky, en })` — объект с разными строками (используется в `venue.ts`, `speakers.ts`)
- `<html lang>` обновляется автоматически

---

## Дизайн-система

Брендовая палитра, типографика, скругления, тени — `tailwind.config.ts`.  
Глобальные базовые стили — `src/styles/index.css`.

- Никогда не используется `#000000` — тёмный текст: `#0A1628` (`--ink`)
- Акцент: `#0066FF` (`--brand`), `#00D4FF` (`brand-glow`)
- Spring-кривая: `ease-spring` = `cubic-bezier(0.32, 0.72, 0, 1)`
- Reveal-анимация: `src/components/ui/Reveal.tsx` — `viewport { once: true }`
- Blueprint-сетки: `.blueprint-bg`, `.blueprint-bg-dark`, `.blueprint-bg-dark-fine`
- Полностью соблюдается `prefers-reduced-motion: reduce`

---

## Доступность

- Семантические landmarks: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`
- Все интерактивные элементы имеют видимый focus-ring
- Декоративные элементы — `aria-hidden`, видео без фокуса — `tabIndex={-1}`
- Программа — полноценный tablist (`role=tab/tabpanel/aria-selected`)
- Все формы — `<label>` + `aria-invalid` + `aria-describedby` для ошибок

---

## Контакт

`info@kitforum.kg` — заявки и общие вопросы.
