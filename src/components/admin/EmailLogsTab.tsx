import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, RefreshCw, Download, Mail, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database, EmailLogStatus } from "@/lib/database.types";
import { Btn, Toast } from "./shared";
import { Drawer, DetailRow } from "./RegistrationsTab";

type Row = Database["public"]["Tables"]["email_logs"]["Row"];

const STATUS_LABEL: Record<EmailLogStatus, string> = {
  sent:   "Доставлено",
  failed: "Ошибка",
};

const STATUS_TONE: Record<EmailLogStatus, string> = {
  sent:   "bg-emerald-50 text-emerald-700 ring-emerald-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
};

const KIND_LABEL: Record<string, string> = {
  register: "Регистрация",
  award:    "KIT Awards",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
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

async function downloadXlsx(headers: string[], rows: unknown[][], filename: string, colWidths?: number[]) {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  if (colWidths) ws["!cols"] = colWidths.map((wch) => ({ wch }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
}

export function EmailLogsTab() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmailLogStatus | "all">("all");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selected, setSelected] = useState<Row | null>(null);

  const load = async () => {
    setRows(null);
    const { data, error } = await supabase
      .from("email_logs")
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

  useEffect(() => { load(); }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить запись из журнала?")) return;
    const { error } = await supabase.from("email_logs").delete().eq("id", id);
    if (error) { showToast(error.message, false); return; }
    showToast("Удалена");
    setRows((rs) => rs?.filter((r) => r.id !== id) ?? rs);
    if (selected?.id === id) setSelected(null);
  };

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.recipient.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        (r.error ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<EmailLogStatus | "all", number> = { all: 0, sent: 0, failed: 0 };
    if (rows) {
      c.all = rows.length;
      rows.forEach((r) => { c[r.status]++; });
    }
    return c;
  }, [rows]);

  const exportXlsx = async () => {
    if (!rows) return;
    const headers = ["Получатель", "Тема", "Тип", "Статус", "Ошибка", "Дата"];
    const data = rows.map((r) => [
      r.recipient,
      r.subject,
      KIND_LABEL[r.kind] ?? r.kind,
      STATUS_LABEL[r.status],
      r.error ?? "",
      formatDate(r.created_at),
    ]);
    await downloadXlsx(headers, data, `email-logs-${new Date().toISOString().slice(0, 10)}.xlsx`, [30, 36, 16, 14, 50, 18]);
  };

  return (
    <div>
      {toast && <Toast {...toast} />}

      {/* Failed-delivery banner */}
      {counts.failed > 0 && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={16} className="shrink-0" />
          <span>
            <b className="tabular-nums">{counts.failed}</b>{" "}
            {counts.failed === 1 ? "письмо не доставлено" : "писем не доставлено"} — проверьте журнал ниже.
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "sent", "failed"] as const).map((s) => (
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
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по email, теме, ошибке…"
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand w-[260px] max-w-full"
            />
          </div>
          <Btn variant="secondary" onClick={load}>
            <RefreshCw size={13} /> Обновить
          </Btn>
          <Btn variant="secondary" onClick={exportXlsx} disabled={!rows || rows.length === 0}>
            <Download size={13} /> Excel
          </Btn>
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
            Пока нет отправленных писем
          </div>
        )}
        {rows !== null && filtered.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Получатель</th>
                <th className="px-4 py-3">Тип</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Ошибка</th>
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
                  <td className="px-4 py-3 text-gray-700 max-w-[260px]">
                    <span className="block truncate font-medium text-gray-900">{row.recipient}</span>
                    <span className="block truncate text-xs text-gray-400">{row.subject}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono uppercase tracking-wider whitespace-nowrap">
                    {KIND_LABEL[row.kind] ?? row.kind}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_TONE[row.status]}`}>
                      {row.status === "sent"
                        ? <CheckCircle2 size={11} />
                        : <AlertTriangle size={11} />}
                      {STATUS_LABEL[row.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-red-500 max-w-[280px] truncate">
                    {row.error ?? <span className="text-gray-300">—</span>}
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
        <Drawer onClose={() => setSelected(null)} title={selected.recipient}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <DetailRow label="Получатель">
                <a href={`mailto:${selected.recipient}`} className="inline-flex items-center gap-1.5 text-brand hover:underline break-all">
                  <Mail size={12} /> {selected.recipient}
                </a>
              </DetailRow>
              <DetailRow label="Статус">
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_TONE[selected.status]}`}>
                  {selected.status === "sent"
                    ? <CheckCircle2 size={11} />
                    : <AlertTriangle size={11} />}
                  {STATUS_LABEL[selected.status]}
                </span>
              </DetailRow>
              <DetailRow label="Тип">{KIND_LABEL[selected.kind] ?? selected.kind}</DetailRow>
              <DetailRow label="Дата">{formatDate(selected.created_at)}</DetailRow>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1.5">Тема</p>
              <p className="text-sm leading-relaxed text-gray-800 rounded-lg bg-gray-50 p-3 border border-gray-100">
                {selected.subject}
              </p>
            </div>

            {selected.error && (
              <div>
                <p className="text-xs uppercase tracking-widest text-red-400 mb-1.5">Текст ошибки</p>
                <p className="text-sm leading-relaxed text-red-700 whitespace-pre-wrap rounded-lg bg-red-50 p-3 border border-red-100 break-words">
                  {selected.error}
                </p>
              </div>
            )}
          </div>
        </Drawer>
      )}
    </div>
  );
}
