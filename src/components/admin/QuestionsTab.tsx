import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Mail, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database, ForumRegistrationStatus } from "@/lib/database.types";
import { Drawer, DetailRow } from "./RegistrationsTab";
import { Btn, Toast } from "./shared";

type Row = Database["public"]["Tables"]["forum_registrations"]["Row"];

const STATUS_LABEL: Record<ForumRegistrationStatus, string> = {
  new:       "Новый",
  contacted: "Ответили",
  confirmed: "Закрыт",
  rejected:  "Отклонён",
  archived:  "Архив",
};

const STATUS_TONE: Record<ForumRegistrationStatus, string> = {
  new:       "bg-blue-50 text-blue-700 ring-blue-200",
  contacted: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected:  "bg-red-50 text-red-700 ring-red-200",
  archived:  "bg-gray-100 text-gray-600 ring-gray-200",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

export function QuestionsTab() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ForumRegistrationStatus | "all">("all");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selected, setSelected] = useState<Row | null>(null);

  const load = async () => {
    setRows(null);
    const { data, error } = await supabase
      .from("forum_registrations")
      .select("*")
      .eq("source", "contacts")
      .order("created_at", { ascending: false });
    if (error) { setToast({ msg: error.message, ok: false }); setRows([]); return; }
    setRows(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const updateStatus = async (id: string, status: ForumRegistrationStatus) => {
    const { error } = await supabase.from("forum_registrations").update({ status }).eq("id", id);
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

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.message ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<ForumRegistrationStatus | "all", number> = {
      all: 0, new: 0, contacted: 0, confirmed: 0, rejected: 0, archived: 0,
    };
    if (rows) { c.all = rows.length; rows.forEach((r) => { c[r.status]++; }); }
    return c;
  }, [rows]);

  return (
    <div>
      {toast && <Toast {...toast} />}

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
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по имени, email, вопросу…"
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand w-[260px] max-w-full"
            />
          </div>
          <Btn variant="secondary" onClick={load}>
            <RefreshCw size={13} /> Обновить
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
            Вопросов пока нет
          </div>
        )}
        {rows !== null && filtered.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Вопрос</th>
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
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{row.full_name}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{row.email}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[280px] truncate">
                    {row.message ?? <span className="text-gray-300 italic">—</span>}
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
            <div className="grid grid-cols-2 gap-3 text-sm">
              <DetailRow label="Email">
                <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 text-brand hover:underline">
                  <Mail size={12} /> {selected.email}
                </a>
              </DetailRow>
              <DetailRow label="Язык">{selected.language.toUpperCase()}</DetailRow>
              <DetailRow label="Дата">{formatDate(selected.created_at)}</DetailRow>
            </div>

            {selected.message && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1.5">Вопрос</p>
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
