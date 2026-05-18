import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LogOut, Users, Calendar, Share2, Loader2, Inbox, Trophy, AtSign, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SpeakersTab } from "@/components/admin/SpeakersTab";
import { ProgramTab } from "@/components/admin/ProgramTab";
import { SocialTab } from "@/components/admin/SocialTab";
import { RegistrationsTab } from "@/components/admin/RegistrationsTab";
import { QuestionsTab } from "@/components/admin/QuestionsTab";
import { AwardsTab } from "@/components/admin/AwardsTab";
import { ContactsTab } from "@/components/admin/ContactsTab";

type Tab =
  | "registrations"
  | "questions"
  | "awards"
  | "speakers"
  | "program"
  | "contacts"
  | "social";

// ── Login form ─────────────────────────────────────────────────────────────
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError(err.message);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-soft border border-line p-8">
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 mb-3">
            <span className="font-display font-bold text-brand text-lg">A</span>
          </div>
          <h1 className="font-display text-xl font-medium text-gray-900 tracking-tight">
            КИТ Форум · Админ
          </h1>
          <p className="mt-1 text-sm text-gray-500">Войдите для управления контентом</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-60 transition-colors"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Admin dashboard ────────────────────────────────────────────────────────
function Dashboard({ session }: { session: Session }) {
  const [tab, setTab] = useState<Tab>("speakers");

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "registrations", label: "Регистрации", icon: Inbox         },
    { id: "questions",     label: "Вопросы",     icon: MessageSquare },
    { id: "awards",        label: "KIT Awards",  icon: Trophy        },
    { id: "speakers",      label: "Спикеры",     icon: Users    },
    { id: "program",       label: "Программа",   icon: Calendar },
    { id: "contacts",      label: "Контакты",    icon: AtSign   },
    { id: "social",        label: "Соц. сети",   icon: Share2   },
  ];

  const signOut = () => supabase.auth.signOut();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-brand text-lg tracking-tight">КИТ</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-medium text-gray-700">Панель управления</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-gray-400">{session.user.email}</span>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut size={14} />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Tab navigation */}
        <div className="mb-6 flex gap-1 border-b border-gray-200">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === id
                  ? "text-brand"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon size={15} />
              {label}
              {tab === id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "registrations" && <RegistrationsTab />}
        {tab === "questions"     && <QuestionsTab />}
        {tab === "awards"        && <AwardsTab />}
        {tab === "speakers"      && <SpeakersTab />}
        {tab === "program"       && <ProgramTab />}
        {tab === "contacts"      && <ContactsTab />}
        {tab === "social"        && <SocialTab />}
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallback = window.setTimeout(() => setLoading(false), 3000);

    supabase.auth.getSession()
      .then(({ data }) => {
        setSession(data.session);
        setLoading(false);
      })
      .catch(() => setLoading(false))
      .finally(() => window.clearTimeout(fallback));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    return () => {
      subscription.unsubscribe();
      window.clearTimeout(fallback);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={24} className="animate-spin text-brand" />
      </div>
    );
  }

  if (!session) return <LoginForm />;
  return <Dashboard session={session} />;
}
