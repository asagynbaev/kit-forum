import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, CheckCircle, Lock } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { useRegistrationModal } from "@/context/RegistrationModalContext";
import { supabase } from "@/lib/supabase";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ease = [0.25, 0.1, 0.25, 1] as const;

interface FormState {
  name: string;
  email: string;
  phone: string;
  org: string;
}

interface ErrorState {
  name?: string;
  email?: string;
  phone?: string;
  org?: string;
}

export function RegistrationModal() {
  const { open, closeModal } = useRegistrationModal();
  const { t, locale } = useI18n();

  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", org: "" });
  const [errors, setErrors] = useState<ErrorState>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [regOpen, setRegOpen] = useState<boolean | null>(null);

  useEffect(() => {
    supabase
      .from("app_settings")
      .select("value")
      .eq("key", "forum_registration_open")
      .single()
      .then(({ data }) => setRegOpen(data?.value !== "false"));
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (open) {
      setForm({ name: "", email: "", phone: "", org: "" });
      setErrors({});
      setSubmitError(null);
      setSubmitted(false);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeModal]);

  function validate(data: FormState) {
    const e: ErrorState = {};
    if (data.name.trim().length < 2) e.name = t("contacts.field.name.error");
    if (!EMAIL_RX.test(data.email)) e.email = t("contacts.field.email.error");
    if (!data.phone.trim()) e.phone = t("regModal.field.phone.error");
    if (!data.org.trim()) e.org = t("regModal.field.org.error");
    return e;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          organization: form.org.trim(),
          language: locale,
          source: "other",
          user_agent: navigator.userAgent,
        }),
      });

      if (res.status === 409) {
        setErrors({ email: t("regModal.field.email.errorDuplicate") });
        return;
      }
      if (!res.ok) {
        setSubmitError(t("contacts.submitError"));
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError(t("contacts.submitError"));
    } finally {
      setSubmitting(false);
    }
  }

  const field = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-[14px] text-ink placeholder:text-ink/35 outline-none focus:ring-2 transition-all duration-200 ${
      hasError
        ? "border-red-400 bg-red-50/40 focus:border-red-400 focus:ring-red-100"
        : "border-line bg-white focus:border-brand/60 focus:ring-brand/15"
    }`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 bg-ink/55 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden
          />

          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            aria-label={t("regModal.title")}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.28, ease }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md bg-canvas rounded-2xl shadow-2xl border border-line overflow-hidden pointer-events-auto">
              <button
                type="button"
                onClick={closeModal}
                aria-label={t("regModal.close")}
                className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-lg text-ink/40 hover:text-ink hover:bg-line/60 transition-all duration-200"
              >
                <X size={16} strokeWidth={1.8} />
              </button>

              <div className="p-7 sm:p-8">
                {submitted && <SuccessView onClose={closeModal} t={t} />}
                {!submitted && regOpen === false && <ClosedView onClose={closeModal} t={t} />}
                {!submitted && regOpen !== false && (
                  <>
                    <div className="mb-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand mb-1.5">
                        {t("regModal.lead")}
                      </p>
                      <h2 className="text-[22px] font-bold text-ink leading-tight">
                        {t("regModal.title")}
                      </h2>
                    </div>

                    <form onSubmit={onSubmit} noValidate className="space-y-4">
                      {/* name */}
                      <div>
                        <label className="block text-[12px] font-medium text-ink/70 mb-1.5">
                          {t("contacts.field.name.label")} <span className="text-brand">*</span>
                        </label>
                        <input
                          type="text"
                          autoComplete="name"
                          autoFocus
                          placeholder={t("contacts.field.name.placeholder")}
                          value={form.name}
                          onChange={(e) => {
                            setForm((f) => ({ ...f, name: e.target.value }));
                            if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
                          }}
                          className={field(!!errors.name)}
                        />
                        {errors.name && <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>}
                      </div>

                      {/* email */}
                      <div>
                        <label className="block text-[12px] font-medium text-ink/70 mb-1.5">
                          {t("contacts.field.email.label")} <span className="text-brand">*</span>
                        </label>
                        <input
                          type="email"
                          autoComplete="email"
                          placeholder={t("contacts.field.email.placeholder")}
                          value={form.email}
                          onChange={(e) => {
                            setForm((f) => ({ ...f, email: e.target.value }));
                            if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
                          }}
                          className={field(!!errors.email)}
                        />
                        {errors.email && <p className="mt-1 text-[12px] text-red-500">{errors.email}</p>}
                      </div>

                      {/* phone */}
                      <div>
                        <label className="block text-[12px] font-medium text-ink/70 mb-1.5">
                          {t("regModal.field.phone.label")} <span className="text-brand">*</span>
                        </label>
                        <input
                          type="tel"
                          autoComplete="tel"
                          placeholder={t("regModal.field.phone.placeholder")}
                          value={form.phone}
                          onChange={(e) => {
                            setForm((f) => ({ ...f, phone: e.target.value }));
                            if (errors.phone) setErrors((er) => ({ ...er, phone: undefined }));
                          }}
                          className={field(!!errors.phone)}
                        />
                        {errors.phone && <p className="mt-1 text-[12px] text-red-500">{errors.phone}</p>}
                      </div>

                      {/* org */}
                      <div>
                        <label className="block text-[12px] font-medium text-ink/70 mb-1.5">
                          {t("regModal.field.org.label")} <span className="text-brand">*</span>
                        </label>
                        <input
                          type="text"
                          autoComplete="organization"
                          placeholder={t("regModal.field.org.placeholder")}
                          value={form.org}
                          onChange={(e) => {
                            setForm((f) => ({ ...f, org: e.target.value }));
                            if (errors.org) setErrors((er) => ({ ...er, org: undefined }));
                          }}
                          className={field(!!errors.org)}
                        />
                        {errors.org && <p className="mt-1 text-[12px] text-red-500">{errors.org}</p>}
                      </div>

                      {submitError && (
                        <p className="text-[13px] text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                          {submitError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="group w-full inline-flex items-center justify-between rounded-xl bg-brand px-5 py-3.5 text-[14px] font-medium text-white shadow-glow hover:bg-brand-deep active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 ease-spring"
                      >
                        <span>{submitting ? t("cta.submitting") : t("cta.register")}</span>
                        {!submitting && (
                          <span className="grid h-7 w-7 place-items-center rounded-md bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
                            <ArrowRight size={14} strokeWidth={1.6} />
                          </span>
                        )}
                      </button>

                      <p className="text-[11px] text-ink/45 text-center leading-relaxed">
                        {t("contacts.agreePrefix")}
                        <a href="/privacy" className="underline underline-offset-2 hover:text-brand transition-colors">
                          {t("contacts.agreeLink")}
                        </a>
                        {t("contacts.agreeSuffix")}
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SuccessView({ onClose, t }: Readonly<{ onClose: () => void; t: (k: string) => string }>) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-brand">
        <CheckCircle size={36} strokeWidth={1.4} />
      </div>
      <h2 className="text-[22px] font-bold text-ink mb-2">{t("regModal.success.title")}</h2>
      <p className="text-[14px] text-ink/60 leading-relaxed mb-7">{t("regModal.success.body")}</p>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-[14px] font-medium text-white hover:bg-brand active:scale-[0.98] transition-all duration-300 ease-spring"
      >
        {t("regModal.success.close")}
      </button>
    </div>
  );
}

function ClosedView({ onClose, t }: Readonly<{ onClose: () => void; t: (k: string) => string }>) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15">
        <Lock size={32} strokeWidth={1.4} />
      </div>
      <h2 className="text-[22px] font-bold text-ink mb-2">{t("regModal.closed.title")}</h2>
      <p className="text-[14px] text-ink/60 leading-relaxed mb-7 max-w-[300px]">{t("regModal.closed.body")}</p>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-[14px] font-medium text-white hover:bg-brand active:scale-[0.98] transition-all duration-300 ease-spring"
      >
        {t("regModal.closed.btn")}
      </button>
    </div>
  );
}
