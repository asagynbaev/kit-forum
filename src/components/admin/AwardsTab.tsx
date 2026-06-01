import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Trash2,
  Mail,
  Phone,
  Loader2,
  RefreshCw,
  ExternalLink,
  Download,
  Upload,
  Lock,
  Unlock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type {
  Database,
  AwardApplicationStatus,
} from "@/lib/database.types";
import { Btn, Toast } from "./shared";
import { Drawer } from "./RegistrationsTab";

type Row = Database["public"]["Tables"]["award_applications"]["Row"];

const NOMINATION_FROM_LABEL: Record<string, string> = {
  "ai adoption":                  "ai",
  "best coworking space":         "cowork",
  "best digital bank":            "bank",
  "best it education project":    "edu",
  "ai":     "ai",
  "cowork": "cowork",
  "bank":   "bank",
  "edu":    "edu",
};

type ParsedAward = {
  full_name: string;
  email: string;
  phone: string;
  nomination: string;
  project_name: string | null;
  project_description: string | null;
  questionnaire: Record<string, string> | null;
  status: "new";
  language: "ru";
};

type AwardDupEntry = {
  incoming: ParsedAward;
  existingName: string;
  existingEmail: string;
  reason: "email" | "name";
};

type AwardImportPreview = {
  toInsert: ParsedAward[];
  duplicates: AwardDupEntry[];
  inFileDups: ParsedAward[];
};

const STATUS_LABEL: Record<AwardApplicationStatus, string> = {
  new:         "Новая",
  reviewing:   "На рассмотрении",
  shortlisted: "Шорт-лист",
  rejected:    "Отклонена",
  winner:      "Победитель",
};

const STATUS_TONE: Record<AwardApplicationStatus, string> = {
  new:         "bg-blue-50 text-blue-700 ring-blue-200",
  reviewing:   "bg-amber-50 text-amber-700 ring-amber-200",
  shortlisted: "bg-violet-50 text-violet-700 ring-violet-200",
  rejected:    "bg-red-50 text-red-700 ring-red-200",
  winner:      "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const NOMINATION_LABEL: Record<string, string> = {
  ai:     "AI Adoption",
  cowork: "Best Coworking Space",
  bank:   "Best Digital Bank",
  edu:    "Best IT Education Project",
};

const QUESTION_LABEL: Record<string, string> = {
  // AI Adoption
  ai_tools:  "Какие AI-инструменты или технологии вы внедрили?",
  results:   "Какие конкретные результаты достигнуты (снижение затрат, рост эффективности)?",
  processes: "Какие внутренние процессы были автоматизированы с помощью AI?",
  metrics:   "Как изменились бизнес-показатели после внедрения AI?",
  // Best IT Education Project
  programs:     "Какие программы или курсы вы предлагаете?",
  students:     "Сколько студентов или участников прошло обучение?",
  graduates:    "Какие результаты показывают выпускники (трудоустройство, проекты)?",
  partnerships: "Есть ли партнёрства с IT-компаниями?",
  // Best Coworking Space
  infra:        "Какие услуги и инфраструктуру вы предоставляете резидентам?",
  it_companies: "Какие IT-компании, стартапы или проекты базируются у вас?",
  events:       "Какие мероприятия или инициативы вы проводите для сообщества?",
  growth:       "Какие показатели загрузки и роста вы можете подтвердить?",
  // Best Digital Bank
  dp:   "Какие цифровые продукты и сервисы вы внедрили за последний год?",
  um:   "Какие ключевые пользовательские метрики (MAU, DAU, retention, NPS) вы достигли?",
  pr:   "Какие бизнес-процессы были оптимизированы за счёт цифровизации?",
  tech: "Какие инновационные технологии (AI, автоматизация, open banking и др.) используются?",
};

async function downloadXlsx(headers: string[], rows: unknown[][], filename: string, colWidths?: number[]) {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  if (colWidths) ws["!cols"] = colWidths.map((wch) => ({ wch }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("ru-RU", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

export function AwardsTab() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AwardApplicationStatus | "all">("all");
  const [nomFilter, setNomFilter] = useState<string>("all");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selected, setSelected] = useState<Row | null>(null);
  const [importing, setImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<AwardImportPreview | null>(null);
  const [regOpen, setRegOpen] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setRows(null);
    const { data, error } = await supabase
      .from("award_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10000);
    if (error) {
      setToast({ msg: error.message, ok: false });
      setRows([]);
      return;
    }
    setRows(data ?? []);
  };

  const loadRegStatus = async () => {
    const { data } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "award_registration_open")
      .single();
    setRegOpen(data?.value !== "false");
  };

  const toggleReg = async () => {
    const next = !regOpen;
    const { error } = await supabase
      .from("app_settings")
      .update({ value: String(next), updated_at: new Date().toISOString() })
      .eq("key", "award_registration_open");
    if (error) { showToast(error.message, false); return; }
    setRegOpen(next);
    showToast(next ? "Регистрация открыта" : "Регистрация закрыта", next);
  };

  useEffect(() => { load(); loadRegStatus(); }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const updateStatus = async (id: string, status: AwardApplicationStatus) => {
    const { error } = await supabase
      .from("award_applications")
      .update({ status })
      .eq("id", id);
    if (error) { showToast(error.message, false); return; }
    showToast("Статус обновлён");
    setRows((rs) => rs?.map((r) => (r.id === id ? { ...r, status } : r)) ?? rs);
    if (selected?.id === id) setSelected((s) => (s ? { ...s, status } : s));
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить заявку безвозвратно?")) return;
    const { error } = await supabase.from("award_applications").delete().eq("id", id);
    if (error) { showToast(error.message, false); return; }
    showToast("Удалена");
    setRows((rs) => rs?.filter((r) => r.id !== id) ?? rs);
    if (selected?.id === id) setSelected(null);
  };

  const deleteAll = async () => {
    if (!confirm(`Удалить все ${rows?.length ?? 0} заявок безвозвратно?`)) return;
    const { error } = await supabase.from("award_applications").delete().not("id", "is", null);
    if (error) { showToast(error.message, false); return; }
    showToast("Все заявки удалены");
    setRows([]);
    setSelected(null);
  };

  const importFile = async (file: File) => {
    setImporting(true);
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });

      const pick = (r: Record<string, unknown>, ...keys: string[]): string => {
        for (const k of keys) {
          const v = r[k];
          if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
        }
        return "";
      };

      // Reverse map: human-readable label → question id
      const LABEL_TO_ID = Object.fromEntries(
        Object.entries(QUESTION_LABEL).map(([id, label]) => [label, id])
      );

      // Labels that anchor a new section in the merged "Ответы" column.
      // Anything between two anchors (or after the last one) is value continuation.
      const PROJECT_NAME_LABEL = "Название вашего проекта/стартапа";
      const PROJECT_DESC_LABEL = "Описание программы (до 300 слов)";
      const SKIP_LABELS = new Set([
        "ФИО", "ФИО/Аты-жөнү",
        "Контактный номер телефона",
        "Электронная почта",
      ]);
      const ANCHOR_LABELS = new Set<string>([
        PROJECT_NAME_LABEL,
        PROJECT_DESC_LABEL,
        ...SKIP_LABELS,
        ...Object.values(QUESTION_LABEL),
      ]);

      // Recognise a line as "<known label>: <value start>".
      // Tolerant to extra text appended to the label after the trailing "?"
      // (e.g. accidental prompt residue from the source survey).
      const matchAnchor = (line: string): { label: string; rest: string } | null => {
        const colon = line.indexOf(":");
        if (colon <= 0) return null;
        const raw = line.slice(0, colon).trim();
        const rest = line.slice(colon + 1).replace(/^\s/, "");
        if (ANCHOR_LABELS.has(raw)) return { label: raw, rest };
        const q = raw.indexOf("?");
        if (q > 0) {
          const trimmed = raw.slice(0, q + 1);
          if (ANCHOR_LABELS.has(trimmed)) return { label: trimmed, rest };
        }
        return null;
      };

      const parseAnswers = (raw: string) => {
        const sections: Record<string, string[]> = {};
        let currentLabel: string | null = null;
        let currentBuf: string[] = [];
        const flush = () => {
          if (currentLabel) sections[currentLabel] = currentBuf;
          currentLabel = null;
          currentBuf = [];
        };
        for (const rawLine of raw.split("\n")) {
          const trimmed = rawLine.trim();
          const m = trimmed ? matchAnchor(trimmed) : null;
          if (m) {
            flush();
            currentLabel = m.label;
            currentBuf = m.rest ? [m.rest] : [];
          } else if (currentLabel) {
            currentBuf.push(rawLine);
          }
        }
        flush();

        const clean = (lines: string[] | undefined): string =>
          (lines ?? []).join("\n").replace(/^\s+|\s+$/g, "");

        const questionnaire: Record<string, string> = {};
        for (const [label, lines] of Object.entries(sections)) {
          const id = LABEL_TO_ID[label];
          if (!id) continue;
          const value = clean(lines);
          if (value) questionnaire[id] = value;
        }
        return {
          project_name: clean(sections[PROJECT_NAME_LABEL]) || null,
          project_description: clean(sections[PROJECT_DESC_LABEL]) || null,
          questionnaire: Object.keys(questionnaire).length > 0 ? questionnaire : null,
        };
      };

      const records: ParsedAward[] = raw
        .map((r) => {
          const nomRaw = pick(r,
            "nomination__title", "nomination_title", "nomination", "Номинация",
            "Номинация/Номинация", "nomination title", "Номинация (nomination)", "Категория",
          ).toLowerCase();
          const nomination = NOMINATION_FROM_LABEL[nomRaw] ?? nomRaw;
          const answersRaw = pick(r, "Ответы", "answers");
          const parsed = answersRaw ? parseAnswers(answersRaw) : { project_name: null, project_description: null, questionnaire: null };
          return {
            full_name: pick(r, "full_name", "ФИО", "ФИО/Аты-жөнү", "Имя", "Имя и фамилия", "name", "Name"),
            email: pick(r, "email", "Email", "Электронная почта", "E-mail", "почта").toLowerCase(),
            phone: pick(r, "number", "phone", "Телефон", "Контактный номер телефона", "Номер телефона", "tel", "Tel"),
            nomination,
            project_name: pick(r, "project_name", "Проект", "Название проекта", "Название вашего проекта/стартапа", "project") || parsed.project_name || null,
            project_description: parsed.project_description,
            questionnaire: parsed.questionnaire,
            status: "new" as const,
            language: "ru" as const,
          };
        })
        .filter((r) => r.full_name && r.email && r.nomination);

      if (records.length === 0) {
        const sampleKeys = raw.length > 0 ? Object.keys(raw[0]).join(", ") : "нет строк";
        showToast(`Нет подходящих строк. Колонки в файле: ${sampleKeys}`, false);
        return;
      }

      const { data: existing } = await supabase
        .from("award_applications")
        .select("email, full_name, nomination");

      // key = email::nomination (same person can apply for different nominations)
      const existingMap = new Map(
        (existing ?? []).map((e) => [`${e.email.toLowerCase()}::${e.nomination}`, e.full_name])
      );
      const existingNames = new Map(
        (existing ?? []).map((e) => [`${e.full_name.toLowerCase().trim()}::${e.nomination}`, e.email])
      );

      const toInsert: ParsedAward[] = [];
      const duplicates: AwardDupEntry[] = [];
      const inFileDups: ParsedAward[] = [];
      const seenKeys = new Set<string>();

      for (const r of records) {
        const email = r.email.toLowerCase();
        const name = r.full_name.toLowerCase().trim();
        const nom = r.nomination;
        const emailKey = `${email}::${nom}`;
        const nameKey = `${name}::${nom}`;

        if (seenKeys.has(emailKey) || seenKeys.has(nameKey)) {
          inFileDups.push(r);
          continue;
        }
        seenKeys.add(emailKey);
        seenKeys.add(nameKey);

        if (existingMap.has(emailKey)) {
          duplicates.push({ incoming: r, existingName: existingMap.get(emailKey)!, existingEmail: email, reason: "email" });
        } else if (existingNames.has(nameKey)) {
          duplicates.push({ incoming: r, existingName: r.full_name, existingEmail: existingNames.get(nameKey)!, reason: "name" });
        } else {
          toInsert.push(r);
        }
      }

      if (duplicates.length === 0 && inFileDups.length === 0) {
        await doInsert(toInsert);
      } else {
        setImportPreview({ toInsert, duplicates, inFileDups });
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Ошибка при импорте", false);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const doInsert = async (records: ParsedAward[]) => {
    if (records.length === 0) { showToast("Нечего импортировать"); return; }
    const { error } = await supabase.from("award_applications").insert(records);
    if (error) { showToast(error.message, false); return; }
    showToast(`Импортировано ${records.length} заявок`);
    load();
  };

  const confirmImport = async (merge: boolean) => {
    const preview = importPreview;
    setImportPreview(null);
    if (!preview) return;
    const { toInsert, duplicates } = preview;
    if (merge) {
      const updates = duplicates.filter((d) => d.reason === "email");
      const nameOnlyInserts = duplicates.filter((d) => d.reason === "name").map((d) => d.incoming);
      await Promise.all(
        updates.map((d) =>
          supabase.from("award_applications")
            .update({ full_name: d.incoming.full_name, phone: d.incoming.phone, nomination: d.incoming.nomination })
            .eq("email", d.existingEmail)
        )
      );
      const allToInsert = [...toInsert, ...nameOnlyInserts];
      if (allToInsert.length > 0) await supabase.from("award_applications").insert(allToInsert);
      showToast(`Импортировано ${toInsert.length + nameOnlyInserts.length}, обновлено ${updates.length}`);
    } else {
      await doInsert(toInsert);
    }
    load();
  };

  const exportXlsx = async () => {
    if (!rows) return;
    const headers = ["ФИО", "Email", "Телефон", "Номинация", "Проект", "Статус", "Дата", "Ответы на вопросы"];
    const data = rows.map((r) => {
      const qs = r.questionnaire as Record<string, string> | null;
      const answers = qs
        ? Object.entries(qs)
            .filter(([, v]) => v)
            .map(([k, v]) => `${QUESTION_LABEL[k] ?? k}:\n${v}`)
            .join("\n\n")
        : "";
      return [
        r.full_name,
        r.email,
        r.phone ?? "",
        NOMINATION_LABEL[r.nomination] ?? r.nomination,
        r.project_name ?? "",
        STATUS_LABEL[r.status],
        formatDate(r.created_at),
        answers,
      ];
    });
    await downloadXlsx(headers, data, `awards-${new Date().toISOString().slice(0, 10)}.xlsx`, [30, 30, 16, 25, 25, 14, 18, 60]);
  };

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (nomFilter !== "all" && r.nomination !== nomFilter) return false;
      if (!q) return true;
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.organization ?? "").toLowerCase().includes(q) ||
        (r.project_name ?? "").toLowerCase().includes(q) ||
        (r.project_description ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter, nomFilter]);

  const counts = useMemo(() => {
    const c: Record<AwardApplicationStatus | "all", number> = {
      all: 0, new: 0, reviewing: 0, shortlisted: 0, rejected: 0, winner: 0,
    };
    if (rows) {
      c.all = rows.length;
      rows.forEach((r) => { c[r.status]++; });
    }
    return c;
  }, [rows]);

  return (
    <div>
      {toast && <Toast {...toast} />}
      {importPreview && (
        <ImportAwardDupesModal
          preview={importPreview}
          onMerge={() => confirmImport(true)}
          onSkip={() => confirmImport(false)}
          onCancel={() => setImportPreview(null)}
        />
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "new", "reviewing", "shortlisted", "rejected", "winner"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s === "all" ? "Все" : STATUS_LABEL[s]}
              <span className="rounded bg-white px-1.5 text-[10px] text-gray-500 tabular-nums">
                {counts[s]}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <AwardRegToggleBtn regOpen={regOpen} onClick={toggleReg} />
          <span className="h-5 w-px bg-gray-200" />
          <select
            value={nomFilter}
            onChange={(e) => setNomFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
          >
            <option value="all">Все номинации</option>
            {Object.entries(NOMINATION_LABEL).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по имени, проекту…"
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand w-[240px] max-w-full"
            />
          </div>
          <Btn variant="secondary" onClick={load}>
            <RefreshCw size={13} /> Обновить
          </Btn>
          <Btn variant="secondary" onClick={exportXlsx} disabled={!rows || rows.length === 0}>
            <Download size={13} /> Excel
          </Btn>
          <Btn variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={importing}>
            {importing ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            Загрузить
          </Btn>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); }}
          />
          <Btn variant="danger" onClick={deleteAll} disabled={!rows || rows.length === 0}>
            <Trash2 size={13} /> Удалить все
          </Btn>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        {rows === null && (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            <Loader2 size={16} className="animate-spin mr-2" /> Загружаем…
          </div>
        )}
        {rows !== null && filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">
            Пока ни одной заявки
          </div>
        )}
        {rows !== null && filtered.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Заявитель</th>
                <th className="px-4 py-3">Проект</th>
                <th className="px-4 py-3">Номинация</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white hover:bg-gray-50/60 cursor-pointer transition-colors"
                  onClick={() => setSelected(row)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{row.full_name}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{row.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[220px] truncate">
                    <span className="block truncate font-medium">
                      {row.project_name ?? <em className="text-gray-300">—</em>}
                    </span>
                    {row.organization && (
                      <span className="block truncate text-xs text-gray-400">{row.organization}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-gray-700 font-medium">
                      {NOMINATION_LABEL[row.nomination] ?? row.nomination}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_TONE[row.status]}`}>
                      {STATUS_LABEL[row.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 tabular-nums whitespace-nowrap">
                    {formatDate(row.created_at)}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => remove(row.id)}
                      className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <Drawer onClose={() => setSelected(null)} title={selected.full_name}>
          <div className="space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Номинация</p>
              <p className="text-sm font-medium text-brand">
                {NOMINATION_LABEL[selected.nomination] ?? selected.nomination}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Cell label="Email">
                <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 text-brand hover:underline">
                  <Mail size={12} /> {selected.email}
                </a>
              </Cell>
              <Cell label="Телефон">
                <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1.5 text-brand hover:underline">
                  <Phone size={12} /> {selected.phone}
                </a>
              </Cell>
              {selected.organization && (
                <Cell label="Организация">{selected.organization}</Cell>
              )}
              {selected.project_name && (
                <Cell label="Проект">{selected.project_name}</Cell>
              )}
              {selected.website && (
                <Cell label="Сайт">
                  <a
                    href={selected.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand hover:underline break-all"
                  >
                    {selected.website} <ExternalLink size={11} />
                  </a>
                </Cell>
              )}
              {selected.socials && (
                <Cell label="Соц. сети">
                  <span className="break-all text-xs">{selected.socials}</span>
                </Cell>
              )}
              <Cell label="Язык">{selected.language.toUpperCase()}</Cell>
              <Cell label="Дата">{formatDate(selected.created_at)}</Cell>
            </div>

            {selected.project_description && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                  Описание проекта
                </p>
                <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 border border-gray-100">
                  {selected.project_description}
                </p>
              </div>
            )}

            {selected.questionnaire &&
              Object.entries(selected.questionnaire as Record<string, string>).map(([qid, answer]) =>
                answer ? (
                  <QuestionBlock
                    key={qid}
                    label={QUESTION_LABEL[qid] ?? qid}
                    text={answer}
                  />
                ) : null,
              )}

            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Статус</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUS_LABEL) as AwardApplicationStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateStatus(selected.id, s)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition ${
                      selected.status === s
                        ? STATUS_TONE[s]
                        : "bg-white text-gray-500 ring-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}

interface CellProps { label: string; children: React.ReactNode }

function Cell({ label, children }: CellProps) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <div className="text-sm text-gray-800 break-words">{children}</div>
    </div>
  );
}

function QuestionBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">{label}</p>
      <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 border border-gray-100">
        {text}
      </p>
    </div>
  );
}

interface ImportAwardDupesModalProps {
  preview: AwardImportPreview;
  onMerge: () => void;
  onSkip: () => void;
  onCancel: () => void;
}

function ImportAwardDupesModal({ preview, onMerge, onSkip, onCancel }: ImportAwardDupesModalProps) {
  const { toInsert, duplicates, inFileDups } = preview;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="font-display text-[17px] font-medium tracking-tight">Перед импортом</h3>
          <p className="mt-1 text-sm text-gray-500">
            Новых: <span className="font-medium text-gray-800">{toInsert.length}</span>
            {duplicates.length > 0 && (<>{" · "}Совпадают с базой: <span className="font-medium text-amber-600">{duplicates.length}</span></>)}
            {inFileDups.length > 0 && (<>{" · "}Повторяются в файле: <span className="font-medium text-orange-500">{inFileDups.length}</span></>)}
          </p>
        </div>

        <div className="overflow-y-auto max-h-[55vh] px-6 py-4 space-y-5">
          {duplicates.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-2">
                Совпадают с базой данных — {duplicates.length}
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    <th className="pb-2 pr-4">Из файла</th>
                    <th className="pb-2 pr-4">Совпадает с</th>
                    <th className="pb-2">Причина</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {duplicates.map((d, i) => (
                    <tr key={i} className="align-top">
                      <td className="py-2.5 pr-4">
                        <div className="font-medium text-gray-900">{d.incoming.full_name}</div>
                        <div className="text-xs text-gray-400">{d.incoming.email}</div>
                      </td>
                      <td className="py-2.5 pr-4">
                        <div className="font-medium text-gray-900">{d.existingName}</div>
                        <div className="text-xs text-gray-400">{d.existingEmail}</div>
                      </td>
                      <td className="py-2.5">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          d.reason === "email"
                            ? "bg-amber-50 text-amber-700 ring-amber-200"
                            : "bg-blue-50 text-blue-700 ring-blue-200"
                        }`}>
                          {d.reason === "email" ? "По email" : "По имени"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {inFileDups.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-500 mb-2">
                Повторяются в файле — {inFileDups.length} (будут пропущены)
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    <th className="pb-2 pr-4">ФИО</th>
                    <th className="pb-2 pr-4">Email</th>
                    <th className="pb-2">Номинация</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {inFileDups.map((r, i) => (
                    <tr key={i} className="align-top">
                      <td className="py-2 pr-4 font-medium text-gray-900">{r.full_name}</td>
                      <td className="py-2 pr-4 text-gray-500">{r.email}</td>
                      <td className="py-2 text-gray-400">{r.nomination}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-400 max-w-xs">
            {duplicates.length > 0 && <><b>Объединить</b> — обновит совпадения по email, добавит остальных. </>}
            Записи, повторяющиеся в файле, всегда пропускаются.
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onCancel}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              Отмена
            </button>
            <button type="button" onClick={onSkip}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              Пропустить дубли
            </button>
            {duplicates.length > 0 && (
              <button type="button" onClick={onMerge}
                className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-deep transition-colors">
                Объединить
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AwardRegToggleBtn({ regOpen, onClick }: { regOpen: boolean | null; onClick: () => void }) {
  if (regOpen === null) {
    return (
      <button type="button" disabled className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium opacity-50">
        <Loader2 size={13} className="animate-spin" /> Загрузка…
      </button>
    );
  }
  if (regOpen) {
    return (
      <button type="button" onClick={onClick} title="Нажмите, чтобы закрыть регистрацию"
        className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100">
        <Unlock size={13} /> Регистрация открыта
      </button>
    );
  }
  return (
    <button type="button" onClick={onClick} title="Нажмите, чтобы открыть регистрацию"
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100">
      <Lock size={13} /> Регистрация закрыта
    </button>
  );
}
