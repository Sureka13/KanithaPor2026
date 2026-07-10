import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

function Overview() {
  const [stats, setStats] = useState({ std13: 0, std46: 0, flagged: 0 });
  useEffect(() => {
    (async () => {
      const [std13, std46, flagged] = await Promise.all([
        supabase.from("submissions").select("id", { count: "exact", head: true }).gte("standard", 1).lte("standard", 3),
        supabase.from("submissions").select("id", { count: "exact", head: true }).gte("standard", 4).lte("standard", 6),
        supabase.from("submissions").select("id", { count: "exact", head: true }).gt("flag_count", 0),
      ]);
      setStats({
        std13: std13.count ?? 0,
        std46: std46.count ?? 0,
        flagged: flagged.count ?? 0,
      });
    })();
  }, []);

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
        <StatBox label="Standards 1-3 Submissions" value={stats.std13} />
        <StatBox label="Standards 4-6 Submissions" value={stats.std46} />
        <StatBox label="Flagged" value={stats.flagged} warn />
      </div>
      <div className="mx-auto mt-6 max-w-6xl rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Welcome, Administrator</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the tabs above to review Standards 1-3 and Standards 4-6 results, and manage Round 2 qualification.
        </p>
      </div>
    </div>
  );
}

function StatBox({ label, value, accent, warn }: { label: string; value: number; accent?: boolean; warn?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border p-5 ${accent ? "bg-gradient-accent" : warn ? "bg-destructive/10" : "bg-card"}`}>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold text-foreground">{value}</div>
    </div>
  );
}
