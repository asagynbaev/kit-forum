import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { LocalizedField, Field, SelectField, Modal, Btn, Toast } from "./shared";

type Row = Database["public"]["Tables"]["program_sessions"]["Row"];
type LV = { ru: string; ky: string; en: string };

const BISHKEK = 6 * 60 * 60_000;
const utcToLocal = (utcStr: string) =>
  new Date(new Date(utcStr).getTime() + BISHKEK).toISOString().slice(0, 16);
const localToUTC = (localStr: string) =>
  new Date(new Date(localStr + ":00Z").getTime() - BISHKEK).toISOString();

const SESSION_TYPES = [
  { value: "keynote",   label: "Keynote"    },
  { value: "panel",     label: "Панель"     },
  { value: "workshop",  label: "Воркшоп"    },
  { value: "ceremony",  label: "Церемония"  },
  { value: "networking",label: "Нетворкинг" },
  { value: "break",     label: "Перерыв"    },
];

const TRACKS = [
  { value: "ai",       label: "AI"          },
  { value: "gov",      label: "GovTech"     },
  { value: "startup",  label: "Стартапы"    },
  { value: "edu",      label: "Образование" },
  { value: "security", label: "Кибербез"    },
  { value: "general",  label: "Общий"       },
];

const emptyLV = (): LV => ({ ru: "", ky: "", en: "" });

const emptyForm = () => ({
  title: emptyLV(),
  description: emptyLV(),
  speakers_label: emptyLV(),
  room: emptyLV(),
  session_type: "keynote" as Row["session_type"],
  track: "general",
  starts_at: "",
  duration_min: 60,
  order_index: 0,
});

export function ProgramTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [modal, setModal] = useState<"add" | Row | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("program_sessions")
      .select("*")
      .order("starts_at")
      .order("order_index");
    setRows(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => { setForm(emptyForm()); setModal("add"); };
  const openEdit = (row: Row) => {
    setForm({
      title: row.title as LV,
      description: (row.description ?? emptyLV()) as LV,
      speakers_label: (row.speakers_label ?? emptyLV()) as LV,
      room: (row.room ?? emptyLV()) as LV,
      session_type: row.session_type,
      track: row.track ?? "general",
      starts_at: row.starts_at ? utcToLocal(row.starts_at) : "",
      duration_min: row.duration_min ?? 60,
      order_index: row.order_index,
    });
    setModal(row);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description.ru ? form.description : null,
      speakers_label: form.speakers_label.ru ? form.speakers_label : null,
      room: form.room.ru ? form.room : null,
      session_type: form.session_type,
      track: form.track,
      starts_at: form.starts_at ? localToUTC(form.starts_at) : null,
      duration_min: form.duration_min,
      order_index: form.order_index,
    };
    const isEdit = modal !== "add" && modal !== null;
    const { error } = isEdit
      ? await supabase.from("program_sessions").update(payload).eq("id", (modal as Row).id)
      : await supabase.from("program_sessions").insert(payload);
    setSaving(false);
    if (error) { showToast(error.message, false); return; }
    showToast(isEdit ? "Сессия обновлена" : "Сессия добавлена");
    setModal(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить сессию?")) return;
    const { error } = await supabase.from("program_sessions").delete().eq("id", id);
    if (error) { showToast(error.message, false); return; }
    showToast("Удалена");
    load();
  };

  const lv = (key: keyof ReturnType<typeof emptyForm>) => form[key] as LV;
  const setLv = (key: keyof ReturnType<typeof emptyForm>) => (v: LV) =>
    setForm((f) => ({ ...f, [key]: v }));

  const day1 = rows.filter((r) => r.starts_at?.startsWith("2026-06-04") || (!r.starts_at && r.order_index < 10));
  const day2 = rows.filter((r) => r.starts_at?.startsWith("2026-06-05"));
  const other = rows.filter((r) => !day1.includes(r) && !day2.includes(r));

  const renderGroup = (label: string, group: Row[]) =>
    group.length > 0 && (
      <div key={label} className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-2.5">Время (Бишкек)</th>
                <th className="px-4 py-2.5">Название</th>
                <th className="px-4 py-2.5">Тип</th>
                <th className="px-4 py-2.5">Трек</th>
                <th className="px-4 py-2.5 w-24">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {group.map((row) => (
                <tr key={row.id} className="bg-white hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-500 whitespace-nowrap">
                    {row.starts_at ? utcToLocal(row.starts_at).slice(11, 16) : "—"}
                    {row.duration_min ? ` · ${row.duration_min}мин` : ""}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-gray-900 max-w-[260px] truncate">
                    {(row.title as LV).ru}
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{row.session_type}</td>
                  <td className="px-4 py-2.5 text-gray-500">{row.track}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => openEdit(row)} className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-brand transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button type="button" onClick={() => remove(row.id)} className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{rows.length} сессий в базе</p>
        <Btn onClick={openAdd} variant="primary"><Plus size={14} /> Добавить</Btn>
      </div>

      {renderGroup("День 1 — 4 июня", day1)}
      {renderGroup("День 2 — 5 июня", day2)}
      {renderGroup("Остальные", other)}

      {modal !== null && (
        <Modal
          title={modal === "add" ? "Добавить сессию" : "Редактировать сессию"}
          onClose={() => setModal(null)}
        >
          <form onSubmit={save} className="space-y-4">
            <LocalizedField label="Название *" value={lv("title")} onChange={setLv("title")} required />
            <LocalizedField label="Описание" value={lv("description")} onChange={setLv("description")} multiline />
            <LocalizedField label="Спикеры (текст)" value={lv("speakers_label")} onChange={setLv("speakers_label")} />
            <LocalizedField label="Зал" value={lv("room")} onChange={setLv("room")} />
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Тип" value={form.session_type} onChange={(v) => setForm((f) => ({ ...f, session_type: v as Row["session_type"] }))} options={SESSION_TYPES} />
              <SelectField label="Трек" value={form.track} onChange={(v) => setForm((f) => ({ ...f, track: v }))} options={TRACKS} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Field label="Начало (Бишкек)" value={form.starts_at} type="datetime-local" onChange={(v) => setForm((f) => ({ ...f, starts_at: v }))} />
              </div>
              <Field label="Длит. (мин)" value={form.duration_min} type="number" onChange={(v) => setForm((f) => ({ ...f, duration_min: Number(v) }))} />
            </div>
            <Field label="Порядок" value={form.order_index} type="number" onChange={(v) => setForm((f) => ({ ...f, order_index: Number(v) }))} />
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <Btn variant="secondary" onClick={() => setModal(null)}>Отмена</Btn>
              <Btn type="submit" variant="primary" disabled={saving}>
                {saving ? "Сохранение..." : "Сохранить"}
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
