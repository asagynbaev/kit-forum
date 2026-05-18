import { X, Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { COUNTRIES, COUNTRY_BY_FLAG, type Country } from "@/lib/countries";

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

// ── Country combobox ───────────────────────────────────────────────────────
export function CountryCombobox({
  value,
  onChange,
  required = false,
}: {
  value: { flag: string; name: { ru: string; ky: string; en: string } };
  onChange: (v: { flag: string; name: { ru: string; ky: string; en: string } }) => void;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const selected: Country | undefined = COUNTRY_BY_FLAG[value.flag];
  const display = selected
    ? `${selected.flag} ${selected.name.ru}`
    : value.flag
      ? `${value.flag} ${value.name.ru || ""}`.trim()
      : "";

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = !q
    ? COUNTRIES
    : COUNTRIES.filter(
        (c) =>
          c.code.includes(q) ||
          c.flag.includes(q) ||
          c.name.ru.toLowerCase().includes(q) ||
          c.name.ky.toLowerCase().includes(q) ||
          c.name.en.toLowerCase().includes(q),
      );

  const pick = (c: Country) => {
    onChange({ flag: c.flag, name: c.name });
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        Страна {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`flex items-center border rounded-lg bg-white transition-colors ${
          open ? "border-brand ring-2 ring-brand/40" : "border-gray-200"
        }`}
      >
        <input
          type="text"
          className="flex-1 px-2.5 py-1.5 text-sm bg-transparent focus:outline-none"
          placeholder={display || "Поиск страны…"}
          value={open ? query : display}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          required={required && !value.flag}
        />
        {value.flag && !open && (
          <button
            type="button"
            onClick={() => onChange({ flag: "", name: { ru: "", ky: "", en: "" } })}
            className="px-2 text-gray-400 hover:text-red-500"
            aria-label="Очистить"
          >
            <X size={14} />
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="px-2 text-gray-400 hover:text-gray-700"
          aria-label="Открыть список"
        >
          <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">Ничего не найдено</div>
          ) : (
            filtered.map((c) => {
              const isSelected = c.flag === value.flag;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => pick(c)}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-gray-50 ${
                    isSelected ? "bg-brand/5" : ""
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1 text-gray-900">{c.name.ru}</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">
                    {c.code}
                  </span>
                  {isSelected && <Check size={14} className="text-brand" />}
                </button>
              );
            })
          )}
        </div>
      )}
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
