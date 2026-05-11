import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { LocalizedField, Field, Modal, Btn, Toast } from "./shared";

type Row = Database["public"]["Tables"]["speakers"]["Row"];
type LV = { ru: string; ky: string; en: string };

const empty = (): Omit<Row, "id" | "created_at"> => ({
  name: { ru: "", ky: "", en: "" },
  role: { ru: "", ky: "", en: "" },
  topic: { ru: "", ky: "", en: "" },
  country: { ru: "", ky: "", en: "" },
  country_flag: "",
  photo: "",
  order_index: 0,
});

export function SpeakersTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [modal, setModal] = useState<"add" | Row | null>(null);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const load = async () => {
    const { data } = await supabase.from("speakers").select("*").order("order_index");
    setRows(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => { setForm(empty()); setModal("add"); };
  const openEdit = (row: Row) => {
    setForm({
      name: row.name as LV,
      role: row.role as LV,
      topic: (row.topic ?? { ru: "", ky: "", en: "" }) as LV,
      country: row.country as LV,
      country_flag: row.country_flag,
      photo: row.photo ?? "",
      order_index: row.order_index,
    });
    setModal(row);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, topic: form.topic.ru ? form.topic : null };
    const isEdit = modal !== "add" && modal !== null;
    const { error } = isEdit
      ? await supabase.from("speakers").update(payload).eq("id", (modal as Row).id)
      : await supabase.from("speakers").insert(payload);
    setSaving(false);
    if (error) { showToast(error.message, false); return; }
    showToast(isEdit ? "Спикер обновлён" : "Спикер добавлен");
    setModal(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить спикера?")) return;
    const { error } = await supabase.from("speakers").delete().eq("id", id);
    if (error) { showToast(error.message, false); return; }
    showToast("Удалён");
    load();
  };

  const lv = (key: keyof typeof form) => form[key] as LV;
  const setLv = (key: keyof typeof form) => (v: LV) => setForm((f) => ({ ...f, [key]: v }));

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{rows.length} спикеров в базе</p>
        <Btn onClick={openAdd} variant="primary">
          <Plus size={14} /> Добавить
        </Btn>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3 w-12">Фото</th>
              <th className="px-4 py-3">Имя</th>
              <th className="px-4 py-3">Роль</th>
              <th className="px-4 py-3 w-16">Флаг</th>
              <th className="px-4 py-3 w-24">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.id} className="bg-white hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3 text-gray-400 tabular-nums">{row.order_index}</td>
                <td className="px-4 py-3">
                  {row.photo && (
                    <img src={row.photo} alt="" className="h-10 w-8 rounded object-cover" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {(row.name as LV).ru}
                </td>
                <td className="px-4 py-3 text-gray-500 max-w-[240px] truncate">
                  {(row.role as LV).ru}
                </td>
                <td className="px-4 py-3 text-xl">{row.country_flag}</td>
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
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <Modal
          title={modal === "add" ? "Добавить спикера" : "Редактировать спикера"}
          onClose={() => setModal(null)}
        >
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Фото URL" value={form.photo} onChange={(v) => setForm((f) => ({ ...f, photo: v }))} />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Флаг (эмодзи)" value={form.country_flag} onChange={(v) => setForm((f) => ({ ...f, country_flag: v }))} required />
                <Field label="Порядок" value={form.order_index} type="number" onChange={(v) => setForm((f) => ({ ...f, order_index: Number(v) }))} />
              </div>
            </div>
            <LocalizedField label="Имя *" value={lv("name")} onChange={setLv("name")} required />
            <LocalizedField label="Роль *" value={lv("role")} onChange={setLv("role")} required />
            <LocalizedField label="Тема доклада" value={lv("topic")} onChange={setLv("topic")} />
            <LocalizedField label="Страна *" value={lv("country")} onChange={setLv("country")} required />
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
