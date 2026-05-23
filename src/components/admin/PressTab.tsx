import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { LocalizedField, Field, SelectField, Modal, Btn, Toast } from "./shared";

type Row = Database["public"]["Tables"]["press_releases"]["Row"];
type LV = { ru: string; ky: string; en: string };

type FormState = {
  date_label: string;
  tag: string;
  title: LV;
  lead: LV;
  order_index: number;
  is_visible: boolean;
};

const TAG_OPTIONS = [
  { value: "announcement", label: "Анонс" },
  { value: "speakers", label: "Спикеры" },
  { value: "partners", label: "Партнёры" },
  { value: "program", label: "Программа" },
  { value: "media", label: "СМИ" },
];

const TAG_LABEL: Record<string, string> = Object.fromEntries(
  TAG_OPTIONS.map((o) => [o.value, o.label]),
);

const TAG_PILL: Record<string, string> = {
  announcement: "bg-brand/10 text-brand",
  speakers: "bg-emerald-50 text-emerald-700",
  partners: "bg-violet-50 text-violet-700",
  program: "bg-amber-50 text-amber-700",
  media: "bg-sky-50 text-sky-700",
};

function todayLabel(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

const empty = (): FormState => ({
  date_label: todayLabel(),
  tag: "announcement",
  title: { ru: "", ky: "", en: "" },
  lead: { ru: "", ky: "", en: "" },
  order_index: 0,
  is_visible: true,
});

export function PressTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [modal, setModal] = useState<"add" | Row | null>(null);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("press_releases")
      .select("*")
      .order("order_index", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) { showToast(error.message, false); return; }
    setRows(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    const nextOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.order_index)) + 10 : 10;
    setForm({ ...empty(), order_index: nextOrder });
    setModal("add");
  };

  const openEdit = (row: Row) => {
    setForm({
      date_label: row.date_label,
      tag: row.tag,
      title: row.title as LV,
      lead: row.lead as LV,
      order_index: row.order_index,
      is_visible: row.is_visible,
    });
    setModal(row);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const isEdit = modal !== "add" && modal !== null;
    const { error } = isEdit
      ? await supabase.from("press_releases").update(form).eq("id", (modal as Row).id)
      : await supabase.from("press_releases").insert(form);
    setSaving(false);
    if (error) { showToast(error.message, false); return; }
    showToast(isEdit ? "Пресс-релиз обновлён" : "Пресс-релиз добавлен");
    setModal(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить пресс-релиз?")) return;
    const { error } = await supabase.from("press_releases").delete().eq("id", id);
    if (error) { showToast(error.message, false); return; }
    showToast("Удалён");
    load();
  };

  const toggleVisible = async (row: Row) => {
    const { error } = await supabase
      .from("press_releases")
      .update({ is_visible: !row.is_visible })
      .eq("id", row.id);
    if (error) { showToast(error.message, false); return; }
    load();
  };

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{rows.length} материалов в пресс-центре</p>
        <Btn onClick={openAdd} variant="primary">
          <Plus size={14} /> Добавить
        </Btn>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3 w-28">Дата</th>
              <th className="px-4 py-3 w-32">Категория</th>
              <th className="px-4 py-3">Заголовок</th>
              <th className="px-4 py-3 w-20 text-center">Показ</th>
              <th className="px-4 py-3 w-24">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`bg-white hover:bg-gray-50/60 transition-colors ${!row.is_visible ? "opacity-50" : ""}`}
              >
                <td className="px-4 py-3 text-gray-400 tabular-nums">{row.order_index}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{row.date_label}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      TAG_PILL[row.tag] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {TAG_LABEL[row.tag] ?? row.tag}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 max-w-[420px] truncate">
                  {(row.title as LV).ru}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => toggleVisible(row)}
                    className={`rounded p-1.5 transition-colors ${
                      row.is_visible
                        ? "text-emerald-500 hover:bg-emerald-50"
                        : "text-gray-300 hover:bg-gray-50 hover:text-gray-500"
                    }`}
                    title={row.is_visible ? "Скрыть" : "Показать"}
                  >
                    {row.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-brand transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(row.id)}
                      className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                  Пресс-релизы не добавлены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <Modal
          title={modal === "add" ? "Добавить пресс-релиз" : "Редактировать пресс-релиз"}
          onClose={() => setModal(null)}
          size="lg"
        >
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_120px] gap-4">
              <Field
                label="Дата *"
                value={form.date_label}
                onChange={(v) => setForm((f) => ({ ...f, date_label: v }))}
                required
                placeholder="ДД.ММ.ГГГГ"
              />
              <SelectField
                label="Категория"
                value={form.tag}
                onChange={(v) => setForm((f) => ({ ...f, tag: v }))}
                options={TAG_OPTIONS}
              />
              <Field
                label="Порядок"
                value={form.order_index}
                type="number"
                onChange={(v) => setForm((f) => ({ ...f, order_index: Number(v) }))}
              />
            </div>

            <LocalizedField
              label="Заголовок *"
              value={form.title}
              onChange={(v) => setForm((f) => ({ ...f, title: v }))}
              required
            />

            <LocalizedField
              label="Краткое описание *"
              value={form.lead}
              onChange={(v) => setForm((f) => ({ ...f, lead: v }))}
              multiline
              required
            />

            <div className="pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_visible}
                  onChange={(e) => setForm((f) => ({ ...f, is_visible: e.target.checked }))}
                  className="rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-sm font-medium text-gray-700">Показывать в пресс-центре</span>
              </label>
            </div>

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
