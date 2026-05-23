import {
  useState,
  useMemo,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { LangSwitcher } from "../components/ui/LangSwitcher";
import { LiveBadge } from "../components/ui/LiveBadge";
import { Reveal } from "../components/ui/Reveal";
import { useI18n } from "@/i18n/I18nProvider";

// ── Nominations ────────────────────────────────────────────────────────────

const NOMINATIONS = [
  { id: "ai",     icon: "AI" },
  { id: "cowork", icon: "▣"  },
  { id: "bank",   icon: "B"  },
  { id: "edu",    icon: "E"  },
] as const;

const QUESTIONS: Record<NominationId, Array<{ id: string; labelKey: string; ph: string }>> = {
  ai: [
    { id: "ai_tools",  labelKey: "award.q.ai.tools.label",     ph: "award.q.ai.tools.ph"     },
    { id: "results",   labelKey: "award.q.ai.results.label",   ph: "award.q.ai.results.ph"   },
    { id: "processes", labelKey: "award.q.ai.processes.label", ph: "award.q.ai.processes.ph" },
    { id: "metrics",   labelKey: "award.q.ai.metrics.label",   ph: "award.q.ai.metrics.ph"   },
  ],
  edu: [
    { id: "programs",     labelKey: "award.q.edu.programs.label",     ph: "award.q.edu.programs.ph"     },
    { id: "students",     labelKey: "award.q.edu.students.label",     ph: "award.q.edu.students.ph"     },
    { id: "graduates",    labelKey: "award.q.edu.graduates.label",    ph: "award.q.edu.graduates.ph"    },
    { id: "partnerships", labelKey: "award.q.edu.partnerships.label", ph: "award.q.edu.partnerships.ph" },
  ],
  cowork: [
    { id: "infra",        labelKey: "award.q.cowork.infra.label",        ph: "award.q.cowork.infra.ph"        },
    { id: "it_companies", labelKey: "award.q.cowork.it_companies.label", ph: "award.q.cowork.it_companies.ph" },
    { id: "events",       labelKey: "award.q.cowork.events.label",       ph: "award.q.cowork.events.ph"       },
    { id: "growth",       labelKey: "award.q.cowork.growth.label",       ph: "award.q.cowork.growth.ph"       },
  ],
  bank: [
    { id: "dp",   labelKey: "award.q.bank.dp.label",   ph: "award.q.bank.dp.ph"   },
    { id: "um",   labelKey: "award.q.bank.um.label",   ph: "award.q.bank.um.ph"   },
    { id: "pr",   labelKey: "award.q.bank.pr.label",   ph: "award.q.bank.pr.ph"   },
    { id: "tech", labelKey: "award.q.bank.tech.label", ph: "award.q.bank.tech.ph" },
  ],
};

type NominationId = (typeof NOMINATIONS)[number]["id"];

// ── Form types ─────────────────────────────────────────────────────────────

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  nomination: NominationId | "";
  projectName: string;
  description: string;
  questionnaire: Record<string, string>;
}

interface ErrorState {
  fullName?: string;
  email?: string;
  phone?: string;
  nomination?: string;
  projectName?: string;
  description?: string;
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STEPS = 2;
const ease = [0.16, 1, 0.3, 1] as const;

const emptyForm = (): FormState => ({
  fullName: "",
  email: "",
  phone: "",
  nomination: "",
  projectName: "",
  description: "",
  questionnaire: {},
});

// ── Page ───────────────────────────────────────────────────────────────────

export function KitAwardPage() {
  const { t, locale } = useI18n();
  const prefersReduced = useReducedMotion();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<ErrorState>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as keyof ErrorState]) {
      setErrors((er) => ({ ...er, [key]: undefined }));
    }
  };

  const validateStep = (s: 1 | 2): ErrorState => {
    const e: ErrorState = {};
    if (s === 1 && !form.nomination) {
      e.nomination = t("award.form.nomination.error");
    }
    if (s === 2) {
      if (form.projectName.trim().length < 2) e.projectName = t("award.form.project.error");
      if (form.description.trim().length < 30) e.description = t("award.form.desc.error");
      if (form.fullName.trim().length < 2) e.fullName = t("award.form.name.error");
      if (form.phone.trim().length < 4) e.phone = t("award.form.phone.error");
      if (!EMAIL_RX.test(form.email)) e.email = t("award.form.email.error");
    }
    return e;
  };

  const goNext = () => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (step < STEPS) setStep((s) => (s + 1) as 1 | 2);
  };

  const goBack = () => {
    setSubmitError(null);
    if (step > 1) setStep((s) => (s - 1) as 1 | 2);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validateStep(2);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name:           form.fullName.trim(),
          email:               form.email.trim(),
          phone:               form.phone.trim(),
          nomination:          form.nomination,
          project_name:        form.projectName.trim() || null,
          project_description: form.description.trim() || null,
          questionnaire:       Object.keys(form.questionnaire).length > 0
            ? Object.fromEntries(Object.entries(form.questionnaire).filter(([, v]) => v.trim()))
            : null,
          language:   locale,
          user_agent: navigator.userAgent,
        }),
      });
      if (!res.ok) {
        setSubmitError(t("award.form.submitError"));
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(t("award.form.submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setForm(emptyForm());
    setErrors({});
    setStep(1 as 1 | 2);
    setSubmitted(false);
    setSubmitError(null);
  };

  const stats = useMemo(
    () => [
      { value: "04", labelKey: "award.statsApplications" },
      { value: "04", labelKey: "award.statsCategories"   },
      { value: "16", labelKey: "award.statsYears"        },
    ],
    [],
  );

  return (
    <div className="relative min-h-[100dvh] bg-canvas text-ink overflow-x-clip">
      {/* ── Top header ── */}
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-xl">
        <div className="container-edge flex h-[72px] items-center justify-between gap-6">
          <Logo />
          <div className="flex items-center gap-3">
            <LangSwitcher surface="frosted" />
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 text-[12px] font-medium text-ink-soft hover:text-ink hover:border-ink/30 transition-all duration-300 ease-spring"
            >
              <ArrowLeft size={13} strokeWidth={1.7} />
              {t("award.back")}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        aria-label={t("award.aria")}
        className="relative bg-ink text-white overflow-hidden"
      >
        <div aria-hidden className="absolute inset-0 blueprint-bg-dark pointer-events-none" />
        <div aria-hidden className="absolute inset-0 blueprint-bg-dark-fine opacity-50 pointer-events-none" />
        {/* Glow blobs */}
        <div
          aria-hidden
          className="absolute -top-40 -left-32 h-[480px] w-[480px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.30) 0%, transparent 65%)" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -right-24 h-[520px] w-[520px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,102,255,0.30) 0%, transparent 65%)" }}
        />

        <div className="container-edge relative pt-16 sm:pt-20 md:pt-28 pb-16 sm:pb-20 md:pb-28">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="flex flex-wrap items-center justify-between gap-3"
          >
            <span className="inline-flex items-center gap-3">
              <span aria-hidden className="h-px w-8 sm:w-12 bg-brand-glow/60 shrink-0" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-white/85">
                <span className="text-brand-glow mr-2">01</span>
                {t("award.eyebrow")}
              </span>
            </span>
            <LiveBadge tone="dark">{t("award.heroDate")}</LiveBadge>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.18 }}
            className="mt-8 sm:mt-12 font-display font-medium leading-[0.92] tracking-tightest text-balance"
            style={{ fontSize: "clamp(2.6rem, 10vw, 7.5rem)" }}
          >
            <span className="block text-white">{t("award.titleA")}</span>
            <span className="block">
              <span className="text-brand-glow">{t("award.titleB")}</span>
              <span className="text-white/30 ml-3 font-mono align-top text-[0.35em] tracking-[0.06em]">
                {t("award.titleC")}
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.32 }}
            className="mt-7 max-w-[640px] text-[15px] sm:text-[17px] leading-[1.55] text-white/75 text-balance"
          >
            {t("award.lead")}
          </motion.p>

          {/* CTA + stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.44 }}
            className="mt-10 sm:mt-12 grid grid-cols-12 gap-y-8 md:gap-8 items-end"
          >
            <div className="col-span-12 md:col-span-7 flex flex-col sm:flex-row gap-3">
              <a
                href="#apply"
                className="group inline-flex items-center justify-between sm:justify-start gap-3 rounded-xl bg-brand px-5 py-3.5 text-[14px] font-medium text-white shadow-glow hover:bg-brand-deep active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                <span className="inline-flex items-center gap-2">
                  <Trophy size={15} strokeWidth={1.7} />
                  {t("award.form.submit")}
                </span>
                <span aria-hidden className="grid h-7 w-7 place-items-center rounded-md bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
                  <ArrowRight size={14} strokeWidth={1.6} />
                </span>
              </a>
              <a
                href="#nominations"
                className="group inline-flex items-center justify-between sm:justify-start gap-3 rounded-xl border border-white/25 px-5 py-3.5 text-[14px] font-medium text-white hover:border-white/45 hover:bg-white/[0.06] active:scale-[0.98] transition-all duration-300 ease-spring"
              >
                {t("award.nominations.title")}
                <span aria-hidden className="grid h-7 w-7 place-items-center rounded-md border border-white/25 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
                  <ArrowRight size={14} strokeWidth={1.6} />
                </span>
              </a>
            </div>

            <div className="col-span-12 md:col-span-5">
              <div className="flex divide-x divide-white/10 border-y border-white/10 py-3">
                {stats.map((s) => (
                  <div key={s.labelKey} className="flex flex-1 flex-col items-center gap-1 px-3">
                    <span
                      className="font-display font-medium text-white tabular-nums leading-none"
                      style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}
                    >
                      {s.value}
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-white/45 text-center">
                      {t(s.labelKey)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Timeline rail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.58 }}
            className="mt-10 sm:mt-14"
          >
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 mb-4">
              <span className="text-brand-glow mr-2">▸</span>
              {t("award.timelineLabel")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {[
                { l: "award.timeline1.label", v: "award.timeline1.value" },
                { l: "award.timeline2.label", v: "award.timeline2.value" },
                { l: "award.timeline3.label", v: "award.timeline3.value" },
              ].map((tl, i) => (
                <div
                  key={tl.l}
                  className="relative rounded-xl border border-white/12 bg-white/[0.04] px-5 py-4 backdrop-blur-md"
                >
                  <span
                    aria-hidden
                    className="absolute left-5 top-0 h-1 w-8 rounded-b-full bg-brand-glow/60"
                  />
                  <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/45">
                    0{i + 1} · {t(tl.l)}
                  </div>
                  <div className="mt-2 font-display text-white text-[18px] sm:text-[20px] tracking-tight font-medium">
                    {t(tl.v)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Steps · how it works ───────────────────────────────── */}
      <section className="relative bg-canvas border-t border-line v-section overflow-hidden">
        <div aria-hidden className="absolute inset-0 blueprint-bg-faded pointer-events-none" />
        <div className="container-edge relative">
          <div className="grid grid-cols-12 gap-y-10 lg:gap-16">
            <div className="col-span-12 lg:col-span-4">
              <Reveal>
                <span className="eyebrow">
                  <span className="h-px w-8 bg-brand/50" aria-hidden />
                  02 · {t("award.steps.title")}
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="h-section mt-5 text-balance">
                  {t("award.steps.title")}
                  <span className="text-brand">.</span>
                </h2>
              </Reveal>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <ol className="divide-y divide-line border-y border-line">
                {[1, 2, 3, 4].map((n, idx) => (
                  <Reveal key={n} delay={idx * 0.05}>
                    <li className="grid grid-cols-[56px_1fr] md:grid-cols-[88px_1fr] gap-x-6 py-7 md:py-8">
                      <span className="font-mono text-[12px] tracking-[0.22em] uppercase text-brand pt-1">
                        0{n}
                      </span>
                      <div>
                        <h3 className="font-display text-[22px] sm:text-[26px] md:text-[30px] leading-tight tracking-tight font-medium">
                          {t(`award.step${n}.title`)}
                        </h3>
                        <p className="mt-2 text-[14px] sm:text-[15px] leading-relaxed text-ink-soft max-w-[520px]">
                          {t(`award.step${n}.body`)}
                        </p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nominations grid ────────────────────────────────── */}
      <section
        id="nominations"
        className="relative bg-surface border-t border-line v-section overflow-hidden"
      >
        <div aria-hidden className="absolute inset-0 blueprint-bg-faded pointer-events-none" />
        <div className="container-edge relative">
          <div className="grid grid-cols-12 gap-y-10 lg:gap-16 items-end mb-12 md:mb-16">
            <div className="col-span-12 lg:col-span-7">
              <Reveal>
                <span className="eyebrow">
                  <span className="h-px w-8 bg-brand/50" aria-hidden />
                  03 · {t("award.nominations.title")}
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="h-section mt-5 text-balance">
                  {t("award.nominations.title")}
                  <span className="text-brand">.</span>
                </h2>
              </Reveal>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <Reveal delay={0.1}>
                <p className="lead text-balance">
                  {t("award.nominations.lead")}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line rounded-2xl overflow-hidden ring-1 ring-line">
            {NOMINATIONS.map((nom, i) => {
              const active = form.nomination === nom.id;
              return (
                <Reveal key={nom.id} delay={Math.min(i * 0.03, 0.18)}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      update("nomination", nom.id);
                      setStep(1);
                      setTimeout(() => {
                        document.getElementById("apply")?.scrollIntoView({
                          behavior: prefersReduced ? "auto" : "smooth",
                          block: "start",
                        });
                      }, 50);
                    }}
                    className={`group w-full text-left h-full transition-colors duration-300 ease-spring px-6 py-7 md:px-8 md:py-9 flex flex-col gap-4 ${
                      active
                        ? "bg-brand/[0.06] ring-2 ring-inset ring-brand"
                        : "bg-canvas hover:bg-tint/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        aria-hidden
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-md font-mono text-[14px] tracking-tight transition-colors duration-300 ${
                          active
                            ? "bg-brand text-white"
                            : "bg-ink text-white group-hover:bg-brand"
                        }`}
                      >
                        {nom.icon}
                      </span>
                      {active ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 font-mono text-[9px] tracking-[0.22em] uppercase text-white">
                          <Check size={10} strokeWidth={2.4} />
                          {t("award.form.selectedBadge")}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] tracking-[0.22em] text-ink-mute group-hover:text-brand transition-colors duration-300">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-[19px] md:text-[20px] leading-tight tracking-tight font-medium">
                      {t(`award.nom.${nom.id}.name`)}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] leading-relaxed text-ink-soft">
                      {t(`award.nom.${nom.id}.desc`)}
                    </p>
                    <span
                      className={`mt-auto inline-flex items-center gap-2 text-[12px] font-mono tracking-[0.16em] uppercase transition-colors duration-300 ${
                        active ? "text-brand" : "text-ink group-hover:text-brand"
                      }`}
                    >
                      <span aria-hidden className="h-px w-6 bg-current" />
                      {t("award.form.submit")}
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Apply form ─────────────────────────────────────── */}
      <section
        id="apply"
        className="relative bg-canvas border-t border-line v-section overflow-hidden scroll-mt-24"
      >
        <div aria-hidden className="absolute inset-0 blueprint-bg-faded pointer-events-none" />
        <div className="container-edge relative">
          <div className="grid grid-cols-12 gap-y-10 lg:gap-20">
            <div className="col-span-12 lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <Reveal>
                  <span className="eyebrow">
                    <span className="h-px w-8 bg-brand/50" aria-hidden />
                    {t("award.form.eyebrow")}
                  </span>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="h-section mt-5 text-balance">
                    {t("award.form.titleA")}<br />
                    {t("award.form.titleB")}
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="lead mt-6 text-balance max-w-[440px]">
                    {t("award.form.lead")}
                  </p>
                </Reveal>

                <Reveal delay={0.15}>
                  <div className="mt-10 hidden lg:flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
                    <Sparkles size={14} strokeWidth={1.6} className="text-brand" />
                    KIT Forum · 04–05.06.2026
                  </div>
                </Reveal>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-7">
              <Reveal delay={0.05}>
                <AnimatePresence mode="wait" initial={false}>
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease }}
                      className="rounded-2xl border border-line bg-white shadow-soft p-8 md:p-10"
                      role="status"
                      aria-live="polite"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-white">
                          <Check size={16} strokeWidth={1.8} />
                        </span>
                        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft">
                          {t("award.success.eyebrow")}
                        </span>
                      </div>
                      <div className="mt-6 font-display font-medium text-ink text-[28px] md:text-[32px] leading-tight tracking-tightest">
                        {t("award.success.title")}
                      </div>
                      <p className="mt-4 text-[15px] leading-relaxed text-ink-soft max-w-[480px]">
                        {t("award.success.bodyA")}
                        <span className="text-ink font-medium">{form.email}</span>
                        {t("award.success.bodyB")}
                      </p>
                      <div className="mt-8 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={resetAll}
                          className="inline-flex items-center gap-2 text-[14px] font-medium text-ink underline underline-offset-4 hover:text-brand transition-colors duration-300"
                        >
                          {t("award.success.reset")}
                        </button>
                        <Link
                          to="/"
                          className="inline-flex items-center gap-2 text-[14px] font-medium text-ink-soft hover:text-ink transition-colors duration-300"
                        >
                          <ArrowLeft size={14} strokeWidth={1.7} />
                          {t("award.back")}
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={onSubmit}
                      className="rounded-2xl border border-line bg-white shadow-soft overflow-hidden"
                      noValidate
                    >
                      {/* Stepper header */}
                      <div className="flex items-center justify-between gap-3 border-b border-line px-6 md:px-8 py-5">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft shrink-0">
                            {t("award.form.step")
                              .replace("{n}", String(step))
                              .replace("{total}", String(STEPS))}
                          </span>
                          {form.nomination && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 font-mono text-[9px] tracking-[0.22em] uppercase text-brand truncate">
                              <Check size={10} strokeWidth={2.4} className="shrink-0" />
                              <span className="truncate">
                                {t("award.form.selectedBadge")}: {t(`award.nom.${form.nomination}.name`)}
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {[1, 2].map((n) => (
                            <span
                              key={n}
                              aria-hidden
                              className={`h-[3px] rounded-full transition-all duration-500 ease-spring ${
                                n === step
                                  ? "w-8 bg-brand"
                                  : n < step
                                  ? "w-5 bg-ink"
                                  : "w-5 bg-line"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="px-6 md:px-8 py-7 md:py-9">
                        <AnimatePresence mode="wait">
                          {step === 1 && (
                            <StepWrap key="s1">
                              <StepHeader index={1} title={t("award.form.step2.title")} />
                              <p className="mt-3 text-[13px] font-mono tracking-[0.16em] uppercase text-ink-soft">
                                {t("award.form.nomination.label")}
                              </p>
                              <div className="mt-5 grid sm:grid-cols-2 gap-2">
                                {NOMINATIONS.map((nom) => {
                                  const active = form.nomination === nom.id;
                                  return (
                                    <button
                                      type="button"
                                      key={nom.id}
                                      onClick={() => update("nomination", nom.id)}
                                      className={`group relative text-left rounded-xl border px-4 py-3.5 transition-all duration-300 ease-spring ${
                                        active
                                          ? "border-brand bg-brand/[0.06] ring-1 ring-brand/30"
                                          : "border-line hover:border-ink/30 hover:bg-tint/40"
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <span
                                          aria-hidden
                                          className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md font-mono text-[12px] shrink-0 transition-colors duration-300 ${
                                            active
                                              ? "bg-brand text-white"
                                              : "bg-ink text-white group-hover:bg-brand"
                                          }`}
                                        >
                                          {nom.icon}
                                        </span>
                                        <div className="min-w-0">
                                          <div className="font-display text-[15px] font-medium tracking-tight">
                                            {t(`award.nom.${nom.id}.name`)}
                                          </div>
                                          <div className="mt-1 text-[12px] leading-snug text-ink-soft">
                                            {t(`award.nom.${nom.id}.desc`)}
                                          </div>
                                        </div>
                                        {active && (
                                          <span className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-brand text-white shrink-0">
                                            <Check size={11} strokeWidth={2.2} />
                                          </span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                              {errors.nomination && (
                                <p className="mt-3 text-[12px] text-red-600">
                                  {errors.nomination}
                                </p>
                              )}
                            </StepWrap>
                          )}

                          {step === 2 && (
                            <StepWrap key="s2">
                              <StepHeader index={2} title={t("award.form.step3.title")} />
                              <div className="mt-7 flex flex-col gap-6">
                                <FieldCard
                                  id="award-project"
                                  label={t("award.form.project.label")}
                                  value={form.projectName}
                                  onChange={(v) => update("projectName", v)}
                                  placeholder={t("award.form.project.placeholder")}
                                  error={errors.projectName}
                                  required
                                />
                                <FieldCardArea
                                  id="award-desc"
                                  label={t("award.form.desc.label")}
                                  value={form.description}
                                  onChange={(v) => update("description", v)}
                                  placeholder={t("award.form.desc.placeholder")}
                                  error={errors.description}
                                  required
                                />
                                <FieldCard
                                  id="award-name"
                                  label={t("award.form.name.label")}
                                  value={form.fullName}
                                  onChange={(v) => update("fullName", v)}
                                  placeholder={t("award.form.name.placeholder")}
                                  autoComplete="name"
                                  error={errors.fullName}
                                  required
                                />
                                <div className="grid sm:grid-cols-2 gap-6">
                                  <FieldCard
                                    id="award-phone"
                                    label={t("award.form.phone.label")}
                                    type="tel"
                                    value={form.phone}
                                    onChange={(v) => update("phone", v)}
                                    placeholder={t("award.form.phone.placeholder")}
                                    autoComplete="tel"
                                    error={errors.phone}
                                    required
                                  />
                                  <FieldCard
                                    id="award-email"
                                    label={t("award.form.email.label")}
                                    type="email"
                                    value={form.email}
                                    onChange={(v) => update("email", v)}
                                    placeholder={t("award.form.email.placeholder")}
                                    autoComplete="email"
                                    error={errors.email}
                                    required
                                  />
                                </div>
                                {form.nomination && QUESTIONS[form.nomination].map((q) => (
                                  <FieldCardArea
                                    key={q.id}
                                    id={`award-q-${q.id}`}
                                    label={t(q.labelKey)}
                                    value={form.questionnaire[q.id] ?? ""}
                                    onChange={(v) =>
                                      update("questionnaire", { ...form.questionnaire, [q.id]: v })
                                    }
                                    placeholder={t(q.ph)}
                                    required
                                  />
                                ))}
                              </div>
                            </StepWrap>
                          )}
                        </AnimatePresence>
                      </div>

                      {submitError && (
                        <p
                          role="alert"
                          className="mx-6 md:mx-8 mb-2 -mt-2 text-[13px] text-red-600"
                        >
                          {submitError}
                        </p>
                      )}

                      {/* Footer nav */}
                      <div className="flex items-center justify-between gap-3 border-t border-line px-6 md:px-8 py-5 bg-surface/60">
                        <button
                          type="button"
                          onClick={goBack}
                          disabled={step === 1}
                          className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-soft hover:text-ink transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ArrowLeft size={14} strokeWidth={1.7} />
                          {t("award.form.back")}
                        </button>

                        {step < STEPS ? (
                          <button
                            type="button"
                            onClick={goNext}
                            className="group inline-flex items-center gap-3 rounded-xl bg-ink px-5 py-3 text-[14px] font-medium text-white hover:bg-brand active:scale-[0.98] transition-all duration-300 ease-spring"
                          >
                            {t("award.form.next")}
                            <span aria-hidden className="grid h-6 w-6 place-items-center rounded-md bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
                              <ArrowRight size={13} strokeWidth={1.7} />
                            </span>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={submitting}
                            className="group inline-flex items-center gap-3 rounded-xl bg-brand px-5 py-3 text-[14px] font-medium text-white shadow-glow hover:bg-brand-deep active:scale-[0.98] transition-all duration-300 ease-spring disabled:opacity-70"
                          >
                            {submitting ? t("award.form.submitting") : t("award.form.submit")}
                            <span aria-hidden className="grid h-6 w-6 place-items-center rounded-md bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
                              <ArrowUpRight size={13} strokeWidth={1.7} />
                            </span>
                          </button>
                        )}
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer strip ────────────────────────────── */}
      <footer className="border-t border-line bg-canvas">
        <div className="container-edge py-6 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
            © 2026 · KIT Forum · KIT Awards
          </span>
          <Link
            to="/privacy"
            className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft hover:text-ink transition-colors duration-300"
          >
            {t("footer.privacy")}
          </Link>
        </div>
      </footer>
    </div>
  );
}

// ── Small subcomponents ──────────────────────────────────────────────────

interface StepWrapProps { children: ReactNode }

function StepWrap({ children }: StepWrapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease }}
    >
      {children}
    </motion.div>
  );
}

interface StepHeaderProps { index: number; title: string }

function StepHeader({ index, title }: StepHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-ink text-white font-mono text-[12px]">
        0{index}
      </span>
      <h3 className="font-display text-[20px] sm:text-[24px] tracking-tight font-medium">
        {title}
      </h3>
    </div>
  );
}

interface FieldCardProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  required?: boolean;
}

function FieldCard({
  id, label, value, onChange,
  placeholder, type = "text", autoComplete, error, required,
}: FieldCardProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-medium text-ink mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className={`rounded-lg border transition-colors duration-200 ${error ? "border-red-400" : "border-gray-200 focus-within:border-brand"}`}>
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className="w-full bg-transparent px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-soft/50 outline-none"
        />
      </div>
      {error && (
        <span className="mt-1.5 inline-block text-[12px] text-red-600">{error}</span>
      )}
    </div>
  );
}

interface FieldCardAreaProps extends Omit<FieldCardProps, "type" | "autoComplete"> {
  rows?: number;
  maxLength?: number;
}

function FieldCardArea({
  id, label, value, onChange, placeholder, error, required, rows = 6, maxLength = 2000,
}: FieldCardAreaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-medium text-ink mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className={`rounded-lg border transition-colors duration-200 ${error ? "border-red-400" : "border-gray-200 focus-within:border-brand"}`}>
        <textarea
          id={id}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          aria-invalid={!!error}
          className="w-full resize-none bg-transparent px-3.5 pt-3 pb-1 text-[15px] text-ink placeholder:text-ink-soft/50 outline-none leading-relaxed"
        />
        <div className="flex justify-end px-3.5 pb-2">
          <span className="text-[11px] text-gray-400 tabular-nums">{value.length}/{maxLength}</span>
        </div>
      </div>
      {error && (
        <span className="mt-1.5 inline-block text-[12px] text-red-600">{error}</span>
      )}
    </div>
  );
}
