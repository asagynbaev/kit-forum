import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { LangSwitcher } from "../ui/LangSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { navLinks } from "@/data/organizers";
import { useScrolled, useLockBody } from "@/lib/hooks";

export function Navigation() {
  const { t } = useI18n();
  const scrolled = useScrolled(20);
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  useLockBody(open);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <header
      id="top"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-spring ${
        scrolled
          ? "bg-white/75 backdrop-blur-xl border-b border-line shadow-soft"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-edge flex h-[72px] items-center justify-between gap-6">
        <Logo variant={scrolled ? "dark" : "light"} />

        <nav
          aria-label="Основная навигация"
          className="hidden lg:flex items-center gap-1 rounded-md bg-white/55 px-1.5 py-1.5 backdrop-blur-md ring-1 ring-line shadow-soft"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="px-4 py-2 text-[14px] font-medium text-ink/85 hover:text-ink rounded-md hover:bg-tint transition-all duration-300 ease-spring"
            >
              {t(link.labelKey)}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LangSwitcher surface="frosted" />
          <a
            href="#contacts"
            className="group inline-flex items-center gap-2.5 rounded-md bg-ink px-4 py-2.5 text-[13px] font-medium text-white hover:bg-brand active:scale-[0.98] transition-all duration-300 ease-spring"
          >
            {t("cta.register")}
            <span
              aria-hidden
              className="grid h-6 w-6 place-items-center rounded-sm bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 6 H9 M9 6 L6 3 M9 6 L6 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mobile-overlay"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden grid h-11 w-11 place-items-center rounded-md bg-white/70 ring-1 ring-line backdrop-blur-md text-ink active:scale-[0.96] transition-all duration-300 ease-spring"
        >
          {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="lg:hidden fixed inset-0 top-[72px] bg-white/95 backdrop-blur-2xl overflow-y-auto"
          >
            <div className="container-edge py-10 sm:py-12 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.08 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-baseline justify-between border-b border-line py-4 sm:py-5 text-ink hover:text-brand transition-colors duration-300"
                >
                  <span className="font-display text-[26px] sm:text-[32px] tracking-tightest font-medium">
                    {t(link.labelKey)}
                  </span>
                  <span className="font-mono text-[12px] tracking-[0.18em] text-ink-soft">
                    0{i + 1}
                  </span>
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-col gap-5"
              >
                <a
                  href="#contacts"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-between rounded-2xl bg-ink px-6 py-5 text-white"
                >
                  <span className="font-medium">{t("cta.register")}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M3 6 H9 M9 6 L6 3 M9 6 L6 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
                <div className="self-start">
                  <LangSwitcher surface="frosted" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
