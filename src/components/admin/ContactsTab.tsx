import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database, Json } from "@/lib/database.types";
import { Field, LocalizedField, Modal, Btn, Toast } from "./shared";

type Row = Database["public"]["Tables"]["contact_persons"]["Row"];
type LocVal = { ru: string; ky: string; en: string };

interface FormState {
  label: LocVal;
  name: LocVal;
  phone: string;
  phone_href: string;
  emails: string;
  order_index: number;
}

const emptyLoc = (): LocVal => ({ ru: "", ky: "", en: "" });

const emptyForm = (): FormState => ({
  label: emptyLoc(),
  name: emptyLoc(),
  phone: "",
  phone_href: "",
  emails: "",
  order_index: 0,
});

function asLoc(v: Json): LocVal {
  const o = (v ?? {}) as Partial<LocVal>;
  return { ru: o.ru ?? "", ky: o.ky ?? "", en: o.en ?? "" };
}

function autoPhoneHref(phone: string) {
  const digits = phone.replace(/[^+\d]/g, "");
  return digits ? `tel:${digits}` : "";
}

export function ContactsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [modal, setModal] = useState<"add" | Row | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("contact_persons")
      .select("*")
      .order("order_index");
    if (error) { showToast(error.message, false); return; }
    setRows(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const openAdd = () => {
    setForm({ ...emptyForm(), order_index: rows.length });
    setModal("add");
  };

  const openEdit = (row: Row) => {
    setForm({
      label: asLoc(row.label),
      name: asLoc(row.name),
      phone: row.phone,
      phone_href: row.phone_href,
      emails: row.emails,
      order_index: row.order_index,
    });
    setModal(row);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      label: form.label as Json,
      name: form.name as Json,
      phone: form.phone.trim(),
      phone_href: form.phone_href.trim() || autoPhoneHref(form.phone),
      emails: form.emails.trim(),
      order_index: form.order_index,
    };
    const isEdit = modal !== "add" && modal !== null;
    const { error } = isEdit
      ? await supabase
          .from("contact_persons")
          .update(payload)
          .eq("id", (modal as Row).id)
      : await supabase.from("contact_persons").insert(payload);
    setSaving(false);
    if (error) { showToast(error.message, false); return; }
    showToast(isEdit ? "Контакт обновлён" : "Контакт добавлен");
    setModal(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить контакт?")) return;
    const { error } = await supabase.from("contact_persons").delete().eq("id", id);
    if (error) { showToast(error.message, false); return; }
    showToast("Удалён");
    load();
  };

  return (
    <div>
      {toast && <Toast {...toast} />}

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {rows.length} контактов в оргкомитете
        </p>
        <Btn onClick={openAdd} variant="primary">
          <Plus size={14} /> Добавить
        </Btn>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 w-10" />
              <th className="px-4 py-3">Секция</th>
              <th className="px-4 py-3">Имя</th>
              <th className="px-4 py-3">Телефон</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 w-24">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  Контактов нет. Запусти миграцию <code className="font-mono">supabase-contact-persons.sql</code> или добавь вручную.
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const label = asLoc(row.label);
              const name = asLoc(row.name);
              return (
                <tr key={row.id} className="bg-white hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 text-gray-300 tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      <GripVertical size={12} />
                      {row.order_index}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{label.ru}</div>
                    <div className="text-xs text-gray-400">{label.en}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{name.ru}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{row.phone}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[260px] truncate">
                    {row.emails}
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
              );
            })}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <Modal
          title={modal === "add" ? "Добавить контакт" : "Редактировать контакт"}
          onClose={() => setModal(null)}
        >
          <form onSubmit={save} className="space-y-5">
            <LocalizedField
              label="Секция · ярлык *"
              value={form.label}
              onChange={(v) => setForm((f) => ({ ...f, label: v }))}
              required
            />
            <LocalizedField
              label="Имя / команда *"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Телефон *"
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                required
                placeholder="+996 555 ..."
              />
              <Field
                label="phone_href (можно оставить пустым)"
                value={form.phone_href}
                onChange={(v) => setForm((f) => ({ ...f, phone_href: v }))}
                placeholder="tel:+996555..."
              />
            </div>
            <Field
              label='Email (несколько — через " · ")'
              value={form.emails}
              onChange={(v) => setForm((f) => ({ ...f, emails: v }))}
              placeholder="a@htp.kg · b@htp.kg"
            />
            <Field
              label="Порядок"
              value={form.order_index}
              type="number"
              onChange={(v) => setForm((f) => ({ ...f, order_index: Number(v) }))}
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
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
