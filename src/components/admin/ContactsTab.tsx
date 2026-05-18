import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database, Json } from "@/lib/database.types";
import { Field, LocalizedField, Modal, Btn, Toast } from "./shared";
import { useContactBlocks, type ContactBlock } from "@/lib/useSupabaseData";

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

interface BlockFormState {
  title: LocVal;
  lines_ru: string;
  lines_ky: string;
  lines_en: string;
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

const emptyBlockForm = (): BlockFormState => ({
  title: emptyLoc(),
  lines_ru: "",
  lines_ky: "",
  lines_en: "",
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

  const { blocks, reload: reloadBlocks } = useContactBlocks();
  const [blockModal, setBlockModal] = useState<ContactBlock | null>(null);
  const [blockForm, setBlockForm] = useState<BlockFormState>(emptyBlockForm());
  const [blockSaving, setBlockSaving] = useState(false);

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

  const openBlockEdit = (block: ContactBlock) => {
    setBlockForm({
      title: { ru: block.title.ru ?? "", ky: block.title.ky ?? "", en: block.title.en ?? "" },
      lines_ru: block.lines.map((l) => l.ru ?? "").join("\n"),
      lines_ky: block.lines.map((l) => l.ky ?? "").join("\n"),
      lines_en: block.lines.map((l) => l.en ?? "").join("\n"),
    });
    setBlockModal(block);
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

  const saveBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockModal) return;
    setBlockSaving(true);

    const ruArr = blockForm.lines_ru.split("\n");
    const kyArr = blockForm.lines_ky.split("\n");
    const enArr = blockForm.lines_en.split("\n");
    const len = Math.max(ruArr.length, kyArr.length, enArr.length);
    const lines = Array.from({ length: len }, (_, i) => ({
      ru: ruArr[i]?.trim() ?? "",
      ky: kyArr[i]?.trim() ?? "",
      en: enArr[i]?.trim() ?? "",
    })).filter((l) => l.ru || l.ky || l.en);

    const { error } = await supabase
      .from("contact_blocks")
      .update({ title: blockForm.title as Json, lines: lines as Json })
      .eq("id", blockModal.id);

    setBlockSaving(false);
    if (error) { showToast(error.message, false); return; }
    showToast("Блок обновлён");
    setBlockModal(null);
    reloadBlocks();
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

      {/* ── Organizer / Venue blocks ─────────────────────────────────────── */}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Организатор и площадка</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Ярлык</th>
                <th className="px-4 py-3">Название</th>
                <th className="px-4 py-3">Строки</th>
                <th className="px-4 py-3 w-20">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {blocks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                    Нет данных. Запусти миграцию <code className="font-mono">supabase-contact-blocks.sql</code>.
                  </td>
                </tr>
              )}
              {blocks.map((block) => (
                <tr key={block.id} className="bg-white hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{block.label.ru}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{block.title.ru}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 space-y-0.5">
                    {block.lines.map((l, i) => (
                      <div key={l.ru || i}>{l.ru}</div>
                    ))}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openBlockEdit(block)}
                      className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-brand transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Contact persons ──────────────────────────────────────────────── */}
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

      {/* ── Contact person modal ─────────────────────────────────────────── */}
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

      {/* ── Block edit modal ─────────────────────────────────────────────── */}
      {blockModal !== null && (
        <Modal
          title={`Редактировать: ${blockModal.label.ru}`}
          onClose={() => setBlockModal(null)}
          size="lg"
        >
          <form onSubmit={saveBlock} className="space-y-5">
            <LocalizedField
              label="Название *"
              value={blockForm.title}
              onChange={(v) => setBlockForm((f) => ({ ...f, title: v }))}
              required
            />
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Строки контента{" "}
                <span className="text-xs font-normal text-gray-400">(каждая новая строка — отдельный элемент)</span>
              </p>
              <div className="space-y-3">
                {(["ru", "ky", "en"] as const).map((lang) => (
                  <div key={lang} className="flex gap-2">
                    <span className="mt-2 w-7 shrink-0 text-[10px] uppercase tracking-widest text-gray-400 font-mono">
                      {lang}
                    </span>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand resize-y"
                      value={blockForm[`lines_${lang}`]}
                      onChange={(e) =>
                        setBlockForm((f) => ({ ...f, [`lines_${lang}`]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <Btn variant="secondary" onClick={() => setBlockModal(null)}>Отмена</Btn>
              <Btn type="submit" variant="primary" disabled={blockSaving}>
                {blockSaving ? "Сохранение..." : "Сохранить"}
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
