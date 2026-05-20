import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, Plus, Upload, X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { compressToWebp } from "@/lib/imageCompress";
import type { Database } from "@/lib/database.types";
import { Field, Modal, Btn, Toast } from "./shared";

const TARGET_LOGO_BYTES = 80_000;

type Row = Database["public"]["Tables"]["partners"]["Row"];

type FormState = {
  name: string;
  logo_url: string;
  order_index: number;
  is_visible: boolean;
};

async function uploadLogo(file: File): Promise<{ url: string } | { error: string }> {
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const { error } = await supabase.storage
    .from("partner-logos")
    .upload(name, file, { upsert: true, contentType: "image/webp" });
  if (error) return { error: error.message };
  const { data } = supabase.storage.from("partner-logos").getPublicUrl(name);
  return { url: data.publicUrl };
}

function LogoField({
  value,
  onChange,
  onError,
}: {
  value: string;
  onChange: (url: string) => void;
  onError: (msg: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handle = async (file: File) => {
    if (!file.type.startsWith("image/")) { onError("Только изображения"); return; }
    if (file.size > 8 * 1024 * 1024) { onError("Максимум 8 МБ"); return; }
    setUploading(true);
    try {
      const compressed = await compressToWebp(file, TARGET_LOGO_BYTES);
      const res = await uploadLogo(compressed);
      if ("error" in res) { onError(`Ошибка загрузки: ${res.error}`); return; }
      onChange(res.url);
    } catch (e) {
      onError(`Не удалось обработать: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-gray-700">Логотип</p>
      <div className="flex gap-3 items-start">
        {value && (
          <div className="relative shrink-0">
            <img
              src={value}
              alt=""
              className="h-16 w-32 rounded-lg object-contain border border-gray-200 bg-gray-50 p-2"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <X size={10} />
            </button>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = ""; }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-1.5 h-20 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 hover:border-brand/50 hover:bg-brand/5 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {uploading ? (
              <span className="text-xs text-brand font-medium">Загружаем…</span>
            ) : (
              <>
                <Upload size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">Нажмите для загрузки</span>
                <span className="text-[10px] text-gray-400">PNG, JPG, WebP · до 8 МБ</span>
              </>
            )}
          </button>
          <input
            type="text"
            className="mt-2 w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand/30 focus:border-brand placeholder:text-gray-300"
            placeholder="или вставьте URL вручную"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

const empty = (): FormState => ({
  name: "",
  logo_url: "",
  order_index: 0,
  is_visible: true,
});

export function PartnersTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [modal, setModal] = useState<"add" | Row | null>(null);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const load = async () => {
    const { data, error } = await supabase.from("partners").select("*").order("order_index");
    if (error) { showToast(error.message, false); return; }
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
      name: row.name,
      logo_url: row.logo_url,
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
      ? await supabase.from("partners").update(form).eq("id", (modal as Row).id)
      : await supabase.from("partners").insert(form);
    setSaving(false);
    if (error) { showToast(error.message, false); return; }
    showToast(isEdit ? "Партнёр обновлён" : "Партнёр добавлен");
    setModal(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить партнёра?")) return;
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (error) { showToast(error.message, false); return; }
    showToast("Удалён");
    load();
  };

  const toggleVisible = async (row: Row) => {
    const { error } = await supabase
      .from("partners")
      .update({ is_visible: !row.is_visible })
      .eq("id", row.id);
    if (error) { showToast(error.message, false); return; }
    load();
  };

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{rows.length} партнёров в базе</p>
        <Btn onClick={openAdd} variant="primary">
          <Plus size={14} /> Добавить
        </Btn>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3 w-28">Логотип</th>
              <th className="px-4 py-3">Название</th>
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
                <td className="px-4 py-3">
                  {row.logo_url && (
                    <img
                      src={row.logo_url}
                      alt={row.name}
                      className="h-10 w-20 object-contain"
                    />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
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
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                  Партнёры не добавлены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <Modal
          title={modal === "add" ? "Добавить партнёра" : "Редактировать партнёра"}
          onClose={() => setModal(null)}
        >
          <form onSubmit={save} className="space-y-4">
            <LogoField
              value={form.logo_url}
              onChange={(url) => setForm((f) => ({ ...f, logo_url: url }))}
              onError={(msg) => showToast(msg, false)}
            />
            <Field
              label="Название *"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              required
              placeholder="Название организации"
            />
            <div className="grid grid-cols-2 gap-4 items-end">
              <Field
                label="Порядок"
                value={form.order_index}
                type="number"
                onChange={(v) => setForm((f) => ({ ...f, order_index: Number(v) }))}
              />
              <div className="pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_visible}
                    onChange={(e) => setForm((f) => ({ ...f, is_visible: e.target.checked }))}
                    className="rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <span className="text-sm font-medium text-gray-700">Показывать на сайте</span>
                </label>
              </div>
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
