import { X } from "lucide-react";
import type { ReactNode } from "react";

// ── Localized field ────────────────────────────────────────────────────────
type LocalizedVal = { ru: string; ky: string; en: string };

export function LocalizedField({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
}: {
  label: string;
  value: LocalizedVal;
  onChange: (v: LocalizedVal) => void;
  multiline?: boolean;
  required?: boolean;
}) {
  const cls =
    "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand resize-none";
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-gray-700">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {(["ru", "ky", "en"] as const).map((lang) => (
          <div key={lang}>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">{lang}</p>
            {multiline ? (
              <textarea
                rows={3}
                className={cls}
                value={value[lang]}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
                required={required && lang === "ru"}
              />
            ) : (
              <input
                type="text"
                className={cls}
                value={value[lang]}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
                required={required && lang === "ru"}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Text field ─────────────────────────────────────────────────────────────
export function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

// ── Select field ───────────────────────────────────────────────────────────
export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <select
        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-12 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-display text-[18px] font-medium text-gray-900 tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Buttons ────────────────────────────────────────────────────────────────
export function Btn({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls = {
    primary: "bg-brand text-white hover:bg-brand/90",
    secondary: "border border-gray-200 text-gray-700 hover:bg-gray-50",
    danger: "text-red-600 hover:bg-red-50",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${cls}`}
    >
      {children}
    </button>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────
export function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
        ok ? "bg-emerald-600" : "bg-red-600"
      }`}
    >
      {msg}
    </div>
  );
}
