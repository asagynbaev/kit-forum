import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Speaker } from "@/data/speakers";
import type { ProgramDay, SessionSlot, Track, SessionType } from "@/data/program";
import type { Localized } from "@/i18n/I18nProvider";

// ── SPEAKERS ──────────────────────────────

export function useSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("speakers")
      .select("*")
      .order("order_index")
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message);
        } else if (data) {
          setSpeakers(
            data.map((row) => ({
              id: row.id,
              name: row.name as Localized,
              role: row.role as Localized,
              topic: (row.topic ?? { ru: "", ky: "", en: "" }) as Localized,
              country: row.country as Localized,
              countryFlag: row.country_flag,
              photo: row.photo ?? "",
            }))
          );
        }
        setLoading(false);
      });
  }, []);

  return { speakers, loading, error };
}

// ── PROGRAM ───────────────────────────────

const BISHKEK_OFFSET_MS = 6 * 60 * 60_000;

function toBishkekDate(utcStr: string): string {
  return new Date(new Date(utcStr).getTime() + BISHKEK_OFFSET_MS)
    .toISOString()
    .slice(0, 10);
}

function toBishkekTime(utcStr: string): string {
  return new Date(new Date(utcStr).getTime() + BISHKEK_OFFSET_MS)
    .toISOString()
    .slice(11, 16);
}

function addMinutesToUTC(utcStr: string, minutes: number): string {
  return new Date(new Date(utcStr).getTime() + minutes * 60_000).toISOString();
}

const WEEKDAYS: Record<number, Localized> = {
  0: { ru: "Воскресенье", ky: "Жекшемби",  en: "Sunday"    },
  1: { ru: "Понедельник", ky: "Дүйшөмбү",  en: "Monday"    },
  2: { ru: "Вторник",     ky: "Шейшемби",   en: "Tuesday"   },
  3: { ru: "Среда",       ky: "Шаршемби",   en: "Wednesday" },
  4: { ru: "Четверг",     ky: "Бейшемби",   en: "Thursday"  },
  5: { ru: "Пятница",     ky: "Жума",       en: "Friday"    },
  6: { ru: "Суббота",     ky: "Ишемби",     en: "Saturday"  },
};

const MONTHS_RU  = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const MONTHS_KY  = ["январда","февралда","мартта","апрелде","майда","июнда","июлда","августта","сентябрда","октябрда","ноябрда","декабрда"];
const MONTHS_EN  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function makeDayLabel(dateStr: string, dayNum: number): Localized {
  const d = new Date(dateStr + "T00:00:00Z");
  const day   = d.getUTCDate();
  const month = d.getUTCMonth();
  return {
    ru: `День ${dayNum} · ${day} ${MONTHS_RU[month]}`,
    ky: `${dayNum}-күн · ${day}-${MONTHS_KY[month]}`,
    en: `Day ${dayNum} · ${day} ${MONTHS_EN[month]}`,
  };
}

export function useProgramDays() {
  const [programDays, setProgramDays] = useState<ProgramDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("program_sessions")
      .select("*")
      .order("starts_at")
      .order("order_index")
      .then(({ data, error: err }) => {
        if (err) { setError(err.message); setLoading(false); return; }
        if (!data) { setLoading(false); return; }

        const dayMap = new Map<string, typeof data>();
        for (const row of data) {
          const key = row.starts_at ? toBishkekDate(row.starts_at) : "unknown";
          if (!dayMap.has(key)) dayMap.set(key, []);
          dayMap.get(key)!.push(row);
        }

        const days: ProgramDay[] = Array.from(dayMap.keys())
          .sort()
          .map((dateStr, i) => {
            const rows = dayMap.get(dateStr)!;
            const weekdayIdx = new Date(dateStr + "T00:00:00Z").getUTCDay();

            const sessions: SessionSlot[] = rows.map((row) => ({
              id: row.id,
              start: row.starts_at ? toBishkekTime(row.starts_at) : "--:--",
              end:
                row.starts_at && row.duration_min
                  ? toBishkekTime(addMinutesToUTC(row.starts_at, row.duration_min))
                  : "--:--",
              title:       row.title as Localized,
              description: row.description as Localized | undefined,
              speakers:    row.speakers_label as Localized | undefined,
              type:        row.session_type as SessionType,
              track:       (row.track ?? "general") as Track,
              hall:        row.room as Localized | undefined,
            }));

            return {
              date:    dateStr,
              weekday: WEEKDAYS[weekdayIdx] ?? WEEKDAYS[4],
              label:   makeDayLabel(dateStr, i + 1),
              sessions,
            };
          });

        setProgramDays(days);
        setLoading(false);
      });
  }, []);

  return { programDays, loading, error };
}

// ── SOCIAL LINKS ──────────────────────────

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string | null;
  order_index: number;
}

// ── CONTACT PERSONS ────────────────────────

export interface ContactPerson {
  id: string;
  label: Localized;
  name: Localized;
  phone: string;
  phoneHref: string;
  emails: string[];
  order_index: number;
}

export function useContactPersons() {
  const [persons, setPersons] = useState<ContactPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("contact_persons")
      .select("*")
      .order("order_index")
      .then(({ data }) => {
        if (data) {
          setPersons(
            data.map((row) => ({
              id: row.id,
              label: row.label as Localized,
              name: row.name as Localized,
              phone: row.phone,
              phoneHref: row.phone_href || `tel:${row.phone.replace(/[^+\d]/g, "")}`,
              emails: row.emails
                ? row.emails.split("·").map((s) => s.trim()).filter(Boolean)
                : [],
              order_index: row.order_index,
            })),
          );
        }
        setLoading(false);
      });
  }, []);

  return { persons, loading };
}

// ── CONTACT BLOCKS (Организатор / Площадка) ────────────────────────────────

export interface ContactBlock {
  id: string;
  label: Localized;
  title: Localized;
  lines: Localized[];
  order_index: number;
}

export function useContactBlocks() {
  const [blocks, setBlocks] = useState<ContactBlock[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    supabase
      .from("contact_blocks")
      .select("*")
      .order("order_index")
      .then(({ data }) => {
        if (data) {
          setBlocks(
            data.map((r) => ({
              id: r.id,
              label: r.label as Localized,
              title: r.title as Localized,
              lines: (r.lines as Localized[]) ?? [],
              order_index: r.order_index,
            })),
          );
        }
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  return { blocks, loading, reload: load };
}

export function useSocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("social_links")
      .select("*")
      .order("order_index")
      .then(({ data }) => {
        if (data) setLinks(data);
        setLoading(false);
      });
  }, []);

  return { links, loading };
}
