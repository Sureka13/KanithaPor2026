import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FlagBadge } from "@/components/FlagBadge";

type Row = {
  id: string;
  session_id: string;
  full_name: string;
  school_name: string;
  standard: number | null;
  score: number;
  total: number;
  time_taken_seconds: number;
  flag_count: number;
  reason: string;
  submitted_at: string;
};

export function ResultsTable({ category, title }: { category: "junior" | "senior"; title: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const standardRange = category === "junior" ? { min: 1, max: 3 } : { min: 4, max: 6 };

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("submissions")
        .select("id, session_id, full_name, school_name, standard, score, total, time_taken_seconds, flag_count, reason, submitted_at")
        .gte("standard", standardRange.min)
        .lte("standard", standardRange.max)
        .order("submitted_at", { ascending: false });
      setRows((data ?? []) as Row[]);
    })();
  }, [standardRange.max, standardRange.min]);

  function exportCSV() {
    const data = [
      ["Name","School","Standard","Score","Total","Time(s)","Flags","Reason","SubmittedAt"],
      ...rows.map((r) => [r.full_name, r.school_name, r.standard ?? "", r.score, r.total, r.time_taken_seconds, r.flag_count, r.reason, r.submitted_at]),
    ];
    const csv = data.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `kanithapor-${category}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full flex-col p-5">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{rows.length} submissions</p>
        </div>
        <button onClick={exportCSV} disabled={rows.length === 0} className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          Export CSV
        </button>
      </div>
      <div className="mx-auto mt-4 w-full max-w-6xl flex-1 min-h-0 overflow-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/80 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Name</th><th className="px-4 py-2">School</th>
              <th className="px-4 py-2">Standard</th>
              <th className="px-4 py-2">Score</th><th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Flags</th><th className="px-4 py-2">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No submissions yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-2 font-medium">{r.full_name}</td>
                <td className="px-4 py-2 text-muted-foreground">{r.school_name}</td>
                <td className="px-4 py-2">{r.standard ?? "—"}</td>
                <td className="px-4 py-2 font-semibold">{r.score}/{r.total}</td>
                <td className="px-4 py-2 tabular-nums">{Math.floor(r.time_taken_seconds/60)}m {r.time_taken_seconds%60}s</td>
                <td className="px-4 py-2">
                  <FlagBadge sessionId={r.session_id} count={r.flag_count} />
                </td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{new Date(r.submitted_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
