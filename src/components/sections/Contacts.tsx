import { useState, type FormEvent, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { LiveBadge } from "../ui/LiveBadge";
import { socialLinks } from "@/data/organizers";
import { useI18n } from "@/i18n/I18nProvider";
import { supabase } from "@/lib/supabase";

const socialIcons: Record<string, JSX.Element> = {
  telegram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21.5 4.5 2.5 12l5 1.5 2 6 3-3.5 5 4 4-15.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
  facebook: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 8h2V5h-2c-2 0-3 1.4-3 3v2H9v3h2v8h3v-8h2.5l.5-3H14V8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
  instagram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" />
    </svg>
  ),
  linkedin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 10.5v6 M8 7.6v.1 M11.8 16.5v-3.4c0-1.6 1.2-2.6 2.4-2.6 1.4 0 2.3 1 2.3 2.6v3.4 M11.8 10.6v5.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  youtube: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M10.5 9.5 14.5 12l-4 2.5v-5z" fill="currentColor" />
    </svg>
  ),
};

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface ErrorState {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contacts() {
  const { t, locale } = useI18n();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (data: FormState) => {
    const e: ErrorState = {};
    if (data.name.trim().length < 2) e.name = t("contacts.field.name.error");
    if (!EMAIL_RX.test(data.email)) e.email = t("contacts.field.email.error");
    if (data.message.trim().length < 8)
      e.message = t("contacts.field.message.error");
    return e;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    const { error } = await supabase.from("forum_registrations").insert({
      full_name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      language: locale,
      source: "contacts",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError(t("contacts.submitError"));
      return;
    }
    setSubmitted(true);
  };

  const reset = () => {
    setForm({ name: "", email: "", message: "" });
    setSubmitted(false);
    setErrors({});
    setSubmitError(null);
  };

  const onChange = (key: keyof FormState) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  return (
    <section
      id="contacts"
      className="v-section relative bg-canvas border-t border-brand/20 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 blueprint-bg-faded pointer-events-none"
      />
      <div className="container-edge relative">
        <div className="grid grid-cols-12 gap-y-12 lg:gap-20">
          <div className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="eyebrow">
                    <span className="h-px w-8 bg-brand/50" aria-hidden />
                    {t("contacts.eyebrow")}
                  </span>
                  <LiveBadge>{t("contacts.liveBadge")}</LiveBadge>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="h-section mt-5 text-balance">
                  {t("contacts.titleA")}<br />
                  {t("contacts.titleB")} <span className="text-brand">{t("contacts.titleC")}</span><br />
                  {t("contacts.titleD")}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="lead mt-7 text-balance max-w-[420px]">
                  {t("contacts.lead")}
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="mt-12 hidden lg:block">
                  <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft mb-4">
                    {t("contacts.hoursLabel")}
                  </div>
                  <div className="font-display text-ink text-[28px] leading-tight tracking-tightest font-medium">
                    {t("contacts.hoursValueA")}<br />{t("contacts.hoursValueB")}
                  </div>
                  <div className="mt-3 font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft">
                    {t("contacts.hoursMeta")}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <dl className="divide-y divide-brand/20 border-y border-brand/20">
                <ContactRow
                  label={t("contacts.row.organizer.label")}
                  primary={t("contacts.row.organizer.primary")}
                  secondary={
                    <>
                      {t("contacts.row.organizer.l1")}<br />
                      {t("contacts.row.organizer.l2")}<br />
                      {t("contacts.row.organizer.l3")}
                    </>
                  }
                />
                <ContactRow
                  label={t("contacts.row.venue.label")}
                  primary={t("contacts.row.venue.primary")}
                  secondary={
                    <>
                      {t("contacts.row.venue.l1")}<br />
                      {t("contacts.row.venue.l2")}
                    </>
                  }
                />
                <ContactPerson
                  label={t("contacts.row.coord.label")}
                  name="Елена Нечаева"
                  phone="+996 550 077 091"
                  phoneHref="tel:+996550077091"
                  email="e.nechaeva@htp.kg"
                />
                <ContactPerson
                  label={t("contacts.row.program.label")}
                  name="Айжана Османалиева"
                  phone="+996 708 686 766"
                  phoneHref="tel:+996708686766"
                  email="a.osmonalieva@htp.kg"
                />
                <ContactPerson
                  label={t("contacts.row.expo.label")}
                  name="Чубак Темиров · Адилет Дюшембиев"
                  phone="+996 555 221 146"
                  phoneHref="tel:+996555221146"
                  email="c.temirov@htp.kg · a.diushembiev@htp.kg"
                />
                <ContactPerson
                  label={t("contacts.row.pr.label")}
                  name="Айпери"
                  phone="+996 778 444 208"
                  phoneHref="tel:+996778444208"
                  email="pr@htp.kg"
                />
                <ContactPerson
                  label={t("contacts.row.startup.label")}
                  name="Нурзат"
                  phone="+996 777 092 838"
                  phoneHref="tel:+996777092838"
                  email="future.ecosystem@htp.kg"
                />
                <ContactRow
                  label={t("contacts.row.social.label")}
                  primary={
                    <div className="flex flex-wrap items-center gap-2">
                      {socialLinks.map((s) => (
                        <a
                          key={s.id}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className="group grid h-10 w-10 place-items-center rounded-md border border-line text-ink-soft hover:text-white hover:border-ink hover:bg-ink active:scale-[0.95] transition-all duration-300 ease-spring"
                        >
                          {socialIcons[s.id]}
                        </a>
                      ))}
                    </div>
                  }
                  secondary={t("contacts.row.social.secondary")}
                />
              </dl>
            </Reveal>
          </div>
        </div>

        <div className="mt-28 md:mt-36">
          <div className="grid grid-cols-12 gap-y-12 lg:gap-20">
            <div className="col-span-12 lg:col-span-5">
              <Reveal>
                <span className="eyebrow">
                  <span className="h-px w-8 bg-ink-soft/40" aria-hidden />
                  {t("contacts.formEyebrow")}
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="h-section mt-5 text-balance">
                  {t("contacts.formTitleA")}<br />
                  {t("contacts.formTitleB")}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="lead mt-6 text-balance max-w-[420px]">
                  {t("contacts.formLead")}
                </p>
              </Reveal>
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
                      transition={{
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="border-y border-line py-10"
                      role="status"
                      aria-live="polite"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-white">
                          <Check size={16} strokeWidth={1.8} />
                        </span>
                        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft">
                          {t("contacts.success.eyebrow")}
                        </span>
                      </div>
                      <div className="mt-6 font-display font-medium text-ink text-[28px] leading-tight tracking-tightest">
                        {t("contacts.success.title")}
                      </div>
                      <p className="mt-4 text-[15px] leading-relaxed text-ink-soft max-w-[460px]">
                        {t("contacts.success.bodyA")}
                        <span className="text-ink font-medium">
                          {form.email}
                        </span>
                        {t("contacts.success.bodyB")}
                      </p>
                      <button
                        type="button"
                        onClick={reset}
                        className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-ink underline underline-offset-4 hover:text-brand transition-colors duration-300"
                      >
                        {t("contacts.success.reset")}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={onSubmit}
                      className="border-y border-line divide-y divide-line"
                      noValidate
                    >
                      <FieldText
                        id="contact-name"
                        label={t("contacts.field.name.label")}
                        value={form.name}
                        onChange={onChange("name")}
                        error={errors.name}
                        autoComplete="name"
                        placeholder={t("contacts.field.name.placeholder")}
                      />
                      <FieldText
                        id="contact-email"
                        label={t("contacts.field.email.label")}
                        value={form.email}
                        onChange={onChange("email")}
                        error={errors.email}
                        type="email"
                        autoComplete="email"
                        placeholder={t("contacts.field.email.placeholder")}
                      />
                      <FieldTextarea
                        id="contact-message"
                        label={t("contacts.field.message.label")}
                        value={form.message}
                        onChange={onChange("message")}
                        error={errors.message}
                        placeholder={t("contacts.field.message.placeholder")}
                      />

                      {submitError && (
                        <p
                          role="alert"
                          className="py-4 text-[13px] text-red-600 leading-snug"
                        >
                          {submitError}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 py-7">
                        <p className="text-[12px] leading-relaxed text-ink-soft sm:max-w-[420px]">
                          {t("contacts.agreePrefix")}
                          <Link
                            to="/privacy"
                            className="text-ink underline underline-offset-4 hover:text-brand transition-colors duration-300"
                          >
                            {t("contacts.agreeLink")}
                          </Link>
                          {t("contacts.agreeSuffix")}
                        </p>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="group inline-flex w-full sm:w-auto items-center justify-between gap-3 rounded-xl bg-ink px-5 sm:px-6 py-3.5 sm:py-4 text-[14px] font-medium text-white hover:bg-brand active:scale-[0.98] transition-all duration-300 ease-spring disabled:opacity-70"
                        >
                          {submitting ? t("cta.submitting") : t("cta.submit")}
                          <span className="grid h-7 w-7 place-items-center rounded-md bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5 shrink-0">
                            <ArrowUpRight size={14} strokeWidth={1.6} />
                          </span>
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ContactRowProps {
  label: string;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
}

function ContactRow({ label, primary, secondary }: ContactRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-y-3 md:gap-x-10 py-6 md:py-8">
      <dt className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft pt-1">
        <span className="text-brand mr-2">▎</span>
        {label}
      </dt>
      <dd className="min-w-0">
        <div className="font-display text-ink text-[15px] sm:text-[19px] md:text-[22px] leading-snug tracking-tight font-medium break-words">
          {primary}
        </div>
        {secondary && (
          <div className="mt-2 text-[13px] sm:text-[14px] leading-relaxed text-ink-soft max-w-[520px] break-words">
            {secondary}
          </div>
        )}
      </dd>
    </div>
  );
}

interface ContactPersonProps {
  label: string;
  name: string;
  phone: string;
  phoneHref: string;
  email: string;
}

function ContactPerson({
  label,
  name,
  phone,
  phoneHref,
  email,
}: ContactPersonProps) {
  const mails = email.split(" · ");
  return (
    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-y-3 md:gap-x-10 py-6 md:py-8">
      <dt className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft pt-1 break-words">
        <span className="text-brand mr-2">▎</span>
        {label}
      </dt>
      <dd className="min-w-0">
        <div className="font-display text-ink text-[16px] sm:text-[19px] md:text-[20px] leading-snug tracking-tight font-medium break-words">
          {name}
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          <a
            href={phoneHref}
            className="inline-flex items-center gap-2 font-mono text-[13px] sm:text-[14px] tabular tnums text-ink hover:text-brand transition-colors duration-300 w-fit"
          >
            <span className="text-brand-glow">▸</span>
            {phone}
          </a>
          {mails.map((m) => (
            <a
              key={m}
              href={`mailto:${m}`}
              className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] text-ink hover:text-brand transition-colors duration-300 w-fit break-all"
            >
              <span className="text-brand-glow shrink-0">▸</span>
              <span className="break-all">{m}</span>
            </a>
          ))}
        </div>
      </dd>
    </div>
  );
}

interface BaseFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}

function FieldText({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  autoComplete,
}: BaseFieldProps & {
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-y-2 md:gap-x-10 py-6">
      <label
        htmlFor={id}
        className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft pt-3"
      >
        {label}
      </label>
      <div>
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full bg-transparent border-0 border-b py-2 text-[18px] md:text-[20px] text-ink placeholder:text-ink-soft/50 outline-none transition-colors duration-300 ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-line focus:border-ink"
          }`}
        />
        {error && (
          <span
            id={`${id}-error`}
            className="mt-2 inline-block text-[12px] text-red-600 leading-snug"
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

function FieldTextarea({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
}: BaseFieldProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-y-2 md:gap-x-10 py-6">
      <label
        htmlFor={id}
        className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft pt-3"
      >
        {label}
      </label>
      <div>
        <textarea
          id={id}
          value={value}
          rows={4}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full resize-none bg-transparent border-0 border-b py-2 text-[16px] md:text-[18px] text-ink placeholder:text-ink-soft/50 outline-none transition-colors duration-300 leading-relaxed ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-line focus:border-ink"
          }`}
        />
        {error && (
          <span
            id={`${id}-error`}
            className="mt-2 inline-block text-[12px] text-red-600 leading-snug"
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
