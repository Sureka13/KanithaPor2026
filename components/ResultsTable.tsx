import { useEffect, useMemo, useState } from "react";
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
  site: string;
};

export function ResultsTable({ category, title }: { category: "junior" | "senior"; title: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [siteFilter, setSiteFilter] = useState<"all" | "production" | "demo">("all");
  const standardRange = category === "junior" ? { min: 1, max: 3 } : { min: 4, max: 6 };

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("submissions")
        .select("id, session_id, full_name, school_name, standard, score, total, time_taken_seconds, flag_count, reason, submitted_at, site")
        .gte("standard", standardRange.min)
        .lte("standard", standardRange.max)
        .order("submitted_at", { ascending: false });
      setRows((data ?? []) as Row[]);
    })();
  }, [standardRange.max, standardRange.min]);

  const filteredRows = useMemo(
    () => (siteFilter === "all" ? rows : rows.filter((r) => r.site === siteFilter)),
    [rows, siteFilter],
  );

  function exportCSV() {
    const data = [
      ["Name","School","Standard","Score","Total","Time(s)","Flags","Source","Reason","SubmittedAt"],
      ...filteredRows.map((r) => [r.full_name, r.school_name, r.standard ?? "", r.score, r.total, r.time_taken_seconds, r.flag_count, r.site, r.reason, r.submitted_at]),
    ];
    const csv = data.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `kanithapor-${category}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full flex-col p-5">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{filteredRows.length} of {rows.length} submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <SiteFilterButton active={siteFilter === "all"} onClick={() => setSiteFilter("all")}>All</SiteFilterButton>
          <SiteFilterButton active={siteFilter === "production"} onClick={() => setSiteFilter("production")}>Live</SiteFilterButton>
          <SiteFilterButton active={siteFilter === "demo"} onClick={() => setSiteFilter("demo")}>Demo</SiteFilterButton>
          <button onClick={exportCSV} disabled={filteredRows.length === 0} className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
            Export CSV
          </button>
        </div>
      </div>
      <div className="mx-auto mt-4 w-full max-w-6xl flex-1 min-h-0 overflow-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/80 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Name</th><th className="px-4 py-2">School</th>
              <th className="px-4 py-2">Standard</th>
              <th className="px-4 py-2">Score</th><th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Flags</th><th className="px-4 py-2">Source</th><th className="px-4 py-2">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No submissions yet.</td></tr>}
            {filteredRows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-2 font-medium">{r.full_name}</td>
                <td className="px-4 py-2 text-muted-foreground">{r.school_name}</td>
                <td className="px-4 py-2">{r.standard ?? "—"}</td>
                <td className="px-4 py-2 font-semibold">{r.score}/{r.total}</td>
                <td className="px-4 py-2 tabular-nums">{Math.floor(r.time_taken_seconds/60)}m {r.time_taken_seconds%60}s</td>
                <td className="px-4 py-2">
                  <FlagBadge sessionId={r.session_id} count={r.flag_count} />
                </td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.site === "demo" ? "bg-brand-orange/15 text-brand-orange" : "bg-success/15 text-success"}`}>
                    {r.site === "demo" ? "Demo" : "Live"}
                  </span>
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

function SiteFilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${active ? "bg-gradient-cta text-white" : "border border-input bg-card text-muted-foreground hover:text-foreground"}`}>
      {children}
    </button>
  );
}
