import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type ProctorEventRow = { type: string; question_number: number | null; occurred_at: string };

const TYPE_LABEL: Record<string, string> = {
  "window-blur": "Switched away from window",
  "tab-hidden": "Switched tabs",
  "fullscreen-exit": "Exited fullscreen",
};

export function FlagBadge({ sessionId, count }: { sessionId: string; count: number }) {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<ProctorEventRow[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function openDetail() {
    if (count === 0) return;
    setOpen(true);
    if (events) return;
    setLoading(true);
    const { data } = await supabase
      .from("proctor_events")
      .select("type, question_number, occurred_at")
      .eq("session_id", sessionId)
      .order("occurred_at", { ascending: true });
    setEvents((data ?? []) as ProctorEventRow[]);
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={openDetail}
        disabled={count === 0}
        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
          count ? "cursor-pointer bg-destructive/15 text-destructive hover:bg-destructive/25" : "cursor-default bg-success/15 text-success"
        }`}
      >
        {count}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-glow" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold">Flag details</h3>
              <button onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
            </div>
            <div className="mt-3 max-h-72 space-y-1.5 overflow-auto text-xs">
              {loading && <p className="text-muted-foreground">Loading…</p>}
              {!loading && events?.length === 0 && <p className="text-muted-foreground">No detail recorded.</p>}
              {events?.map((e, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-2.5 py-1.5">
                  <span>{TYPE_LABEL[e.type] ?? e.type}{e.question_number ? ` · Q${e.question_number}` : ""}</span>
                  <span className="text-muted-foreground">{new Date(e.occurred_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
