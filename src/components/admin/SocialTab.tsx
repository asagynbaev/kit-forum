import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { Field, Modal, Btn, Toast } from "./shared";

type Row = Database["public"]["Tables"]["social_links"]["Row"];

const emptyForm = (): Omit<Row, "id" | "created_at"> => ({
  platform: "",
  label: "",
  url: "",
  icon: "",
  order_index: 0,
});

export function SocialTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [modal, setModal] = useState<"add" | Row | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const load = async () => {
    const { data } = await supabase.from("social_links").select("*").order("order_index");
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
      platform: row.platform,
      label: row.label,
      url: row.url,
      icon: row.icon ?? "",
      order_index: row.order_index,
    });
    setModal(row);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, icon: form.icon || null };
    const isEdit = modal !== "add" && modal !== null;
    const { error } = isEdit
      ? await supabase.from("social_links").update(payload).eq("id", (modal as Row).id)
      : await supabase.from("social_links").insert(payload);
    setSaving(false);
    if (error) { showToast(error.message, false); return; }
    showToast(isEdit ? "Ссылка обновлена" : "Ссылка добавлена");
    setModal(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить ссылку?")) return;
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) { showToast(error.message, false); return; }
    showToast("Удалена");
    load();
  };

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{rows.length} ссылок в базе</p>
        <Btn onClick={openAdd} variant="primary"><Plus size={14} /> Добавить</Btn>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3">Платформа</th>
              <th className="px-4 py-3">Лейбл</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3 w-24">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.id} className="bg-white hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3 text-gray-400 tabular-nums">{row.order_index}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{row.platform}</td>
                <td className="px-4 py-3 text-gray-600">{row.label}</td>
                <td className="px-4 py-3 text-gray-400 max-w-[240px] truncate text-xs font-mono">
                  {row.url}
                </td>
                <td className="px-4 py-3">
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

      {modal !== null && (
        <Modal
          title={modal === "add" ? "Добавить ссылку" : "Редактировать ссылку"}
          onClose={() => setModal(null)}
        >
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Платформа *" value={form.platform} onChange={(v) => setForm((f) => ({ ...f, platform: v }))} required placeholder="telegram" />
              <Field label="Лейбл *" value={form.label} onChange={(v) => setForm((f) => ({ ...f, label: v }))} required placeholder="Telegram" />
            </div>
            <Field label="URL *" value={form.url} onChange={(v) => setForm((f) => ({ ...f, url: v }))} required placeholder="https://t.me/kitforum" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Иконка (lucide name)" value={form.icon ?? ""} onChange={(v) => setForm((f) => ({ ...f, icon: v }))} placeholder="send" />
              <Field label="Порядок" value={form.order_index} type="number" onChange={(v) => setForm((f) => ({ ...f, order_index: Number(v) }))} />
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
