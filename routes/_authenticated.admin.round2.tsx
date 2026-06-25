import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Row = {
  id: string;
  full_name: string;
  school_name: string;
  standard: number | null;
  score: number;
  total: number;
  time_taken_seconds: number;
  flag_count: number;
};

export const Route = createFileRoute("/_authenticated/admin/round2")({
  component: Round2Page,
});

function Round2Page() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("submissions")
        .select("id, full_name, school_name, standard, score, total, time_taken_seconds, flag_count")
        .gte("standard", 4).lte("standard", 6).eq("round", 1)
        .order("score", { ascending: false })
        .order("time_taken_seconds", { ascending: true })
        .limit(200);
      setRows((data ?? []) as Row[]);
    })();
  }, []);

  function exportCSV() {
    const top = rows.slice(0, 50);
    const data = [
      ["Rank","Name","School","Standard","Score","Total","Time(s)","Flags"],
      ...top.map((r, i) => [i + 1, r.full_name, r.school_name, r.standard ?? "", r.score, r.total, r.time_taken_seconds, r.flag_count]),
    ];
    const csv = data.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `kanithapor-round2-top50.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full flex-col p-5">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Standards 4-6 Round 1 Rankings</h1>
          <p className="text-sm text-muted-foreground">Top 50 qualify for Round 2 from Standards 4-6. Only admins see this list.</p>
        </div>
        <button onClick={exportCSV} disabled={rows.length === 0} className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          Export Top 50 CSV
        </button>
      </div>
      <div className="mx-auto mt-4 w-full max-w-6xl flex-1 min-h-0 overflow-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/80 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Rank</th><th className="px-4 py-2">Name</th><th className="px-4 py-2">School</th>
              <th className="px-4 py-2">Standard</th><th className="px-4 py-2">Score</th><th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No Standards 4-6 submissions yet.</td></tr>}
            {rows.map((r, i) => {
              const qualified = i < 50;
              return (
                <tr key={r.id} className={`border-t border-border ${qualified ? "bg-success/5" : ""}`}>
                  <td className="px-4 py-2 font-bold">{i + 1}</td>
                  <td className="px-4 py-2">{r.full_name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.school_name}</td>
                  <td className="px-4 py-2">{r.standard ?? "—"}</td>
                  <td className="px-4 py-2 font-semibold">{r.score}/{r.total}</td>
                  <td className="px-4 py-2 tabular-nums">{Math.floor(r.time_taken_seconds/60)}m {r.time_taken_seconds%60}s</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${qualified ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                      {qualified ? "Qualified" : "—"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
