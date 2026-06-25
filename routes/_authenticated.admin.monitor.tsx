import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Sess = {
  session_id: string;
  full_name: string;
  school_name: string | null;
  standard: number | null;
  category: string;
  snapshot_path: string | null;
  last_seen_at: string;
};

export const Route = createFileRoute("/_authenticated/admin/monitor")({
  component: MonitorPage,
});

function MonitorPage() {
  const [sessions, setSessions] = useState<Sess[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      const sinceIso = new Date(Date.now() - 60_000).toISOString();
      const { data } = await supabase
        .from("active_sessions")
        .select("session_id, full_name, school_name, standard, category, snapshot_path, last_seen_at")
        .gte("last_seen_at", sinceIso)
        .order("started_at", { ascending: true });
      if (cancelled) return;
      const list = (data ?? []) as Sess[];
      setSessions(list);
      // sign URLs for snapshots
      const paths = list.filter((s) => s.snapshot_path).map((s) => s.snapshot_path!);
      if (paths.length) {
        const { data: signed } = await supabase.storage.from("snapshots").createSignedUrls(paths, 60);
        const map: Record<string, string> = {};
        signed?.forEach((s, i) => { if (s.signedUrl) map[paths[i]] = s.signedUrl + `&t=${Date.now()}`; });
        setUrls(map);
      } else {
        setUrls({});
      }
    }
    refresh();
    const id = setInterval(refresh, 5000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return (
    <div className="flex h-full flex-col p-5">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="font-display text-xl font-bold">Live Monitoring</h1>
        <p className="text-sm text-muted-foreground">
          Snapshot refreshed every ~10 seconds per participant. Only administrators can view these feeds.
        </p>
      </div>
      <div className="mx-auto mt-4 w-full max-w-7xl flex-1 min-h-0 overflow-auto">
        {sessions.length === 0 ? (
          <div className="grid h-full place-items-center rounded-2xl border border-dashed border-border bg-card text-muted-foreground">
            No active participants right now.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sessions.map((s) => {
              const isUpperGroup = (s.standard ?? 0) >= 4 || (s.standard == null && s.category === "senior");
              return (
              <div key={s.session_id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="relative aspect-video w-full bg-black">
                  {s.snapshot_path && urls[s.snapshot_path] ? (
                    <img src={urls[s.snapshot_path]} alt={s.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-white/50">Awaiting snapshot…</div>
                  )}
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> LIVE
                  </span>
                  <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${isUpperGroup ? "bg-brand-orange text-white" : "bg-brand-blue text-white"}`}>
                    {isUpperGroup ? "Std 4-6" : "Std 1-3"}
                  </span>
                </div>
                <div className="p-3">
                  <div className="truncate font-semibold text-foreground">{s.full_name}</div>
                  <div className="truncate text-xs text-muted-foreground">{s.school_name ?? "—"}</div>
                  <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                    <span>ID: {s.session_id.slice(0, 8)}</span>
                    <span>{`Standard ${s.standard}`}</span>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
