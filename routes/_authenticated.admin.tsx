import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — KanithaPor 2026" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const TABS = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/junior", label: "Standards 1-3 Results" },
  { to: "/admin/senior", label: "Standards 4-6 Results" },
  { to: "/admin/round2", label: "Round 2 (Top 50)" },
  { to: "/admin/monitor", label: "Live Monitoring" },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <header className="shrink-0 border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2.5">
          <Link to="/admin" className="flex items-center gap-3">
            <Logo className="h-10 w-auto" />
            <span className="border-l border-border pl-3 font-display text-base font-semibold">Admin</span>
          </Link>
          <button onClick={signOut} className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted">
            Sign Out
          </button>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 pb-1">
          {TABS.map((t) => {
            const active = path === t.to;
            return (
              <Link key={t.to} to={t.to as any}
                className={`whitespace-nowrap rounded-t-lg px-3 py-1.5 text-xs font-semibold transition ${
                  active ? "bg-background text-foreground border-x border-t border-border" : "text-muted-foreground hover:text-foreground"
                }`}>
                {t.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
