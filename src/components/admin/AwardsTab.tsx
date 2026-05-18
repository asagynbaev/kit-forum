import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Mail,
  Phone,
  Loader2,
  RefreshCw,
  ExternalLink,
  Download,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type {
  Database,
  AwardApplicationStatus,
} from "@/lib/database.types";
import { Btn, Toast } from "./shared";
import { Drawer } from "./RegistrationsTab";

type Row = Database["public"]["Tables"]["award_applications"]["Row"];

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
  ai_tools:  "AI-инструменты и технологии",
  results:   "Конкретные результаты",
  processes: "Автоматизированные процессы",
  metrics:   "Изменение бизнес-показателей",
  programs:  "Программы и курсы",
  students:  "Количество студентов / участников",
  graduates: "Результаты выпускников",
  concept:   "Концепция коворкинга",
  capacity:  "Вместимость и резиденты",
  services:  "Услуги и события",
  products:  "Цифровые продукты",
  users:     "Активные пользователи",
  digital:   "Цифровые технологии",
};

function escapeCsv(v: unknown): string {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

function downloadCsv(headers: string[], rows: string[][], filename: string) {
  const bom = "﻿";
  const content = [headers, ...rows].map((r) => r.map(escapeCsv).join(",")).join("\r\n");
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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

  const load = async () => {
    setRows(null);
    const { data, error } = await supabase
      .from("award_applications")
      .select("*")
      .order("created_at", { ascending: false });
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

  const exportCsv = () => {
    if (!rows) return;
    const headers = [
      "ФИО", "Email", "Телефон", "Организация", "Номинация",
      "Проект", "Описание проекта", "Ответы",
      "Сайт", "Соц. сети", "Статус", "Дата",
    ];
    const data = rows.map((r) => {
      const answers = r.questionnaire
        ? Object.entries(r.questionnaire as Record<string, string>)
            .filter(([, v]) => v)
            .map(([k, v]) => `${QUESTION_LABEL[k] ?? k}: ${v}`)
            .join("\n")
        : "";
      return [
        r.full_name, r.email, r.phone,
        r.organization ?? "",
        NOMINATION_LABEL[r.nomination] ?? r.nomination,
        r.project_name ?? "", r.project_description ?? "",
        answers,
        r.website ?? "", r.socials ?? "",
        STATUS_LABEL[r.status], formatDate(r.created_at),
      ];
    });
    downloadCsv(headers, data, `awards-${new Date().toISOString().slice(0, 10)}.csv`);
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
          <Btn variant="secondary" onClick={exportCsv} disabled={!rows || rows.length === 0}>
            <Download size={13} /> Excel
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
