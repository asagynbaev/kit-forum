import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Trash2, Mail, Phone, Loader2, RefreshCw, Download, Upload, Lock, Unlock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type {
  Database,
  ForumRegistrationStatus,
} from "@/lib/database.types";
import { Btn, Toast } from "./shared";

type Row = Database["public"]["Tables"]["forum_registrations"]["Row"];

type ParsedRecord = {
  full_name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  role: string | null;
  message: string | null;
  source: "other";
  status: "new";
  language: "ru";
};

type DuplicateEntry = {
  incoming: ParsedRecord;
  existingName: string;
  existingEmail: string;
  reason: "email" | "name";
};

type ImportPreview = {
  toInsert: ParsedRecord[];
  duplicates: DuplicateEntry[];
  inFileDups: ParsedRecord[];
};

const STATUS_LABEL: Record<ForumRegistrationStatus, string> = {
  new:       "Новая",
  contacted: "Связались",
  confirmed: "Подтверждена",
  rejected:  "Отклонена",
  archived:  "Архив",
};

const STATUS_TONE: Record<ForumRegistrationStatus, string> = {
  new:       "bg-blue-50 text-blue-700 ring-blue-200",
  contacted: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected:  "bg-red-50 text-red-700 ring-red-200",
  archived:  "bg-gray-100 text-gray-600 ring-gray-200",
};

const SOURCE_LABEL: Record<string, string> = {
  contacts:  "Вопрос · Контакты",
  kit_award: "KIT Awards",
  hero:      "Регистрация · Hero",
  footer:    "Регистрация · Footer",
  other:     "Регистрация · Модалка",
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
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function RegistrationsTab() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ForumRegistrationStatus | "all">("all");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selected, setSelected] = useState<Row | null>(null);
  const [importing, setImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [regOpen, setRegOpen] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setRows(null);
    const { data, error } = await supabase
      .from("forum_registrations")
      .select("*")
      .or("source.neq.contacts,source.is.null")
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
      .eq("key", "forum_registration_open")
      .single();
    setRegOpen(data?.value !== "false");
  };

  const toggleReg = async () => {
    const next = !regOpen;
    const { error } = await supabase
      .from("app_settings")
      .update({ value: String(next), updated_at: new Date().toISOString() })
      .eq("key", "forum_registration_open");
    if (error) { showToast(error.message, false); return; }
    setRegOpen(next);
    showToast(next ? "Регистрация открыта" : "Регистрация закрыта", next);
  };

  useEffect(() => { load(); loadRegStatus(); }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const updateStatus = async (id: string, status: ForumRegistrationStatus) => {
    const { error } = await supabase
      .from("forum_registrations")
      .update({ status })
      .eq("id", id);
    if (error) { showToast(error.message, false); return; }
    showToast("Статус обновлён");
    setRows((rs) => rs?.map((r) => (r.id === id ? { ...r, status } : r)) ?? rs);
    if (selected?.id === id) setSelected((s) => (s ? { ...s, status } : s));
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить запись безвозвратно?")) return;
    const { error } = await supabase.from("forum_registrations").delete().eq("id", id);
    if (error) { showToast(error.message, false); return; }
    showToast("Удалена");
    setRows((rs) => rs?.filter((r) => r.id !== id) ?? rs);
    if (selected?.id === id) setSelected(null);
  };

  const importFile = async (file: File) => {
    setImporting(true);
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });

      const records: ParsedRecord[] = raw
        .map((r) => ({
          full_name: String(r.full_name ?? r["ФИО"] ?? "").trim(),
          email: String(r.email ?? r["Email"] ?? "").trim().toLowerCase(),
          phone: String(r.number ?? r["Телефон"] ?? r.phone ?? "").trim() || null,
          organization: String(r.place_of_work ?? r["Организация"] ?? "").trim() || null,
          role: String(r.activity_scope ?? r["Должность"] ?? "").trim() || null,
          message: String(r.participation_purpose ?? r["Сообщение"] ?? "").trim() || null,
          source: "other" as const,
          status: "new" as const,
          language: "ru" as const,
        }))
        .filter((r) => r.full_name && r.email);

      if (records.length === 0) {
        showToast("Нет подходящих строк (нужны full_name и email)", false);
        return;
      }

      const { data: existing } = await supabase
        .from("forum_registrations")
        .select("email, full_name")
        .or("source.neq.contacts,source.is.null");

      const existingMap = new Map(
        (existing ?? []).map((e) => [e.email.toLowerCase(), e.full_name])
      );
      const existingNames = new Map(
        (existing ?? []).map((e) => [e.full_name.toLowerCase().trim(), e.email])
      );

      const toInsert: ParsedRecord[] = [];
      const duplicates: DuplicateEntry[] = [];
      const inFileDups: ParsedRecord[] = [];
      const seenEmails = new Set<string>();
      const seenNames = new Set<string>();

      for (const r of records) {
        const email = r.email.toLowerCase();
        const name = r.full_name.toLowerCase().trim();

        if (seenEmails.has(email) || seenNames.has(name)) {
          inFileDups.push(r);
          continue;
        }
        seenEmails.add(email);
        seenNames.add(name);

        if (existingMap.has(email)) {
          duplicates.push({
            incoming: r,
            existingName: existingMap.get(email)!,
            existingEmail: email,
            reason: "email",
          });
        } else if (existingNames.has(name)) {
          duplicates.push({
            incoming: r,
            existingName: r.full_name,
            existingEmail: existingNames.get(name)!,
            reason: "name",
          });
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

  const doInsert = async (records: ParsedRecord[]) => {
    if (records.length === 0) { showToast("Нечего импортировать"); return; }
    const { error } = await supabase.from("forum_registrations").insert(records);
    if (error) { showToast(error.message, false); return; }
    showToast(`Импортировано ${records.length} записей`);
    load();
  };

  const confirmImport = async (merge: boolean) => {
    const preview = importPreview;
    setImportPreview(null);
    if (!preview) return;

    const { toInsert, duplicates } = preview;

    if (merge) {
      // Update email-duplicates, insert name-only duplicates as new
      const updates = duplicates.filter((d) => d.reason === "email");
      const nameOnlyInserts = duplicates
        .filter((d) => d.reason === "name")
        .map((d) => d.incoming);

      await Promise.all(
        updates.map((d) =>
          supabase
            .from("forum_registrations")
            .update({
              full_name: d.incoming.full_name,
              phone: d.incoming.phone,
              organization: d.incoming.organization,
              role: d.incoming.role,
              message: d.incoming.message,
            })
            .eq("email", d.existingEmail)
            .or("source.neq.contacts,source.is.null")
        )
      );

      const allToInsert = [...toInsert, ...nameOnlyInserts];
      if (allToInsert.length > 0) {
        await supabase.from("forum_registrations").insert(allToInsert);
      }

      showToast(
        `Импортировано ${toInsert.length + nameOnlyInserts.length}, обновлено ${updates.length}`
      );
    } else {
      await doInsert(toInsert);
    }
    load();
  };

  const deleteAll = async () => {
    if (!confirm(`Удалить все ${rows?.length ?? 0} записей безвозвратно?`)) return;
    const { error } = await supabase
      .from("forum_registrations")
      .delete()
      .or("source.neq.contacts,source.is.null");
    if (error) { showToast(error.message, false); return; }
    showToast("Все записи удалены");
    setRows([]);
    setSelected(null);
  };

  const exportXlsx = async () => {
    if (!rows) return;
    const headers = ["ФИО", "Email", "Телефон", "Организация", "Роль", "Статус", "Источник", "Дата"];
    const data = rows.map((r) => [
      r.full_name,
      r.email,
      r.phone ?? "",
      r.organization ?? "",
      r.role ?? "",
      STATUS_LABEL[r.status],
      SOURCE_LABEL[r.source] ?? r.source,
      formatDate(r.created_at),
    ]);
    await downloadXlsx(headers, data, `registrations-${new Date().toISOString().slice(0, 10)}.xlsx`, [30, 30, 16, 30, 20, 14, 22, 18]);
  };

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.organization ?? "").toLowerCase().includes(q) ||
        (r.message ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<ForumRegistrationStatus | "all", number> = {
      all: 0, new: 0, contacted: 0, confirmed: 0, rejected: 0, archived: 0,
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
        <ImportDupesModal
          preview={importPreview}
          onMerge={() => confirmImport(true)}
          onSkip={() => confirmImport(false)}
          onCancel={() => setImportPreview(null)}
        />
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "new", "contacted", "confirmed", "rejected", "archived"] as const).map((s) => (
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
          <RegToggleBtn regOpen={regOpen} onClick={toggleReg} />
          <span className="h-5 w-px bg-gray-200" />
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по имени, email, организации…"
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand w-[260px] max-w-full"
            />
          </div>
          <Btn variant="secondary" onClick={load}>
            <RefreshCw size={13} /> Обновить
          </Btn>
          <Btn variant="secondary" onClick={exportXlsx} disabled={!rows || rows.length === 0}>
            <Download size={13} /> Excel
          </Btn>
          <Btn variant="danger" onClick={deleteAll} disabled={!rows || rows.length === 0}>
            <Trash2 size={13} /> Удалить все
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
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        {rows === null && (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            <Loader2 size={16} className="animate-spin mr-2" /> Загружаем…
          </div>
        )}
        {rows !== null && filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">
            Пока нет записей
          </div>
        )}
        {rows !== null && filtered.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Контакты</th>
                <th className="px-4 py-3">Источник</th>
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
                  <td className="px-4 py-3 font-medium text-gray-900">{row.full_name}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[260px] truncate">
                    <span className="block truncate">{row.email}</span>
                    {row.phone && (
                      <span className="block truncate text-xs text-gray-400">{row.phone}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono uppercase tracking-wider">
                    {SOURCE_LABEL[row.source] ?? row.source}
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

      {/* Detail drawer */}
      {selected && (
        <Drawer onClose={() => setSelected(null)} title={selected.full_name}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <DetailRow label="Email">
                <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 text-brand hover:underline">
                  <Mail size={12} /> {selected.email}
                </a>
              </DetailRow>
              {selected.phone && (
                <DetailRow label="Телефон">
                  <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1.5 text-brand hover:underline">
                    <Phone size={12} /> {selected.phone}
                  </a>
                </DetailRow>
              )}
              {selected.organization && (
                <DetailRow label="Организация">{selected.organization}</DetailRow>
              )}
              {selected.role && (
                <DetailRow label="Должность">{selected.role}</DetailRow>
              )}
              <DetailRow label="Источник">{SOURCE_LABEL[selected.source] ?? selected.source}</DetailRow>
              <DetailRow label="Язык">{selected.language.toUpperCase()}</DetailRow>
              <DetailRow label="Дата">{formatDate(selected.created_at)}</DetailRow>
            </div>
            {selected.message && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1.5">Сообщение</p>
                <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 border border-gray-100">
                  {selected.message}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Статус</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUS_LABEL) as ForumRegistrationStatus[]).map((s) => (
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

interface DrawerProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Drawer({ title, onClose, children }: DrawerProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h3 className="font-display text-[17px] font-medium tracking-tight truncate">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
          >
            Закрыть
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

interface DetailRowProps { label: string; children: React.ReactNode }

export function DetailRow({ label, children }: DetailRowProps) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <div className="text-sm text-gray-800 break-words">{children}</div>
    </div>
  );
}

interface ImportDupesModalProps {
  preview: ImportPreview;
  onMerge: () => void;
  onSkip: () => void;
  onCancel: () => void;
}

function ImportDupesModal({ preview, onMerge, onSkip, onCancel }: ImportDupesModalProps) {
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
                    <th className="pb-2">Телефон</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {inFileDups.map((r, i) => (
                    <tr key={i} className="align-top">
                      <td className="py-2 pr-4 font-medium text-gray-900">{r.full_name}</td>
                      <td className="py-2 pr-4 text-gray-500">{r.email}</td>
                      <td className="py-2 text-gray-400">{r.phone ?? "—"}</td>
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

function RegToggleBtn({ regOpen, onClick }: { regOpen: boolean | null; onClick: () => void }) {
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
