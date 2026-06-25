import { supabase } from "@/integrations/supabase/client";

// The stored keys stay aligned with the existing database values:
// junior => Standards 1-3, senior => Standards 4-6.
export type Category = "junior" | "senior";

export type Student = {
  fullName: string;
  schoolName: string;
  standard: number | null;
  category: Category;
  accessCode: string;
};

export type ProctorEvent = {
  type: "window-blur" | "tab-hidden" | "fullscreen-exit";
  questionNumber: number;
  timestamp: number;
};

const STUDENT_KEY = "kp.currentStudent";
const SESSION_KEY = "kp.sessionId";

export const isBrowser = typeof window !== "undefined";

export function getSessionId(): string {
  if (!isBrowser) return "";
  let s = localStorage.getItem(SESSION_KEY);
  if (!s) {
    s = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, s);
  }
  return s;
}
export function resetSession() {
  if (!isBrowser) return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(STUDENT_KEY);
}

export function saveStudent(s: Student) {
  if (!isBrowser) return;
  localStorage.setItem(STUDENT_KEY, JSON.stringify(normalizeStudentCategory(s)));
}
export function loadStudent(): Student | null {
  if (!isBrowser) return null;
  const raw = localStorage.getItem(STUDENT_KEY);
  return raw ? normalizeStudentCategory(JSON.parse(raw) as Student) : null;
}

function normalizeStudentCategory(student: Student): Student {
  if (typeof student.standard !== "number") return student;
  return {
    ...student,
    category: student.standard <= 3 ? "junior" : "senior",
  };
}

export async function verifyAccessCode(code: string): Promise<boolean> {
  const { data } = await supabase
    .from("access_codes")
    .select("code")
    .eq("code", code.toUpperCase())
    .eq("enabled", true)
    .maybeSingle();
  return !!data;
}

export async function startSession(student: Student) {
  const normalizedStudent = normalizeStudentCategory(student);
  const sessionId = getSessionId();
  await supabase.from("active_sessions").upsert({
    session_id: sessionId,
    full_name: normalizedStudent.fullName,
    school_name: normalizedStudent.schoolName,
    standard: normalizedStudent.standard,
    category: normalizedStudent.category,
    started_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
  });
}

export async function heartbeat(snapshotPath?: string) {
  const sessionId = getSessionId();
  const patch = snapshotPath
    ? { last_seen_at: new Date().toISOString(), snapshot_path: snapshotPath }
    : { last_seen_at: new Date().toISOString() };
  await supabase.from("active_sessions").update(patch).eq("session_id", sessionId);
}

export async function uploadSnapshot(blob: Blob): Promise<string | null> {
  const sessionId = getSessionId();
  const path = `${sessionId}/latest.jpg`;
  const { error } = await supabase.storage
    .from("snapshots")
    .upload(path, blob, { upsert: true, contentType: "image/jpeg" });
  if (error) return null;
  return path;
}

export async function pushEvent(e: ProctorEvent) {
  const sessionId = getSessionId();
  await supabase.from("proctor_events").insert({
    session_id: sessionId,
    type: e.type,
    question_number: e.questionNumber,
    occurred_at: new Date(e.timestamp).toISOString(),
  });
}

export async function endSessionWithSubmission(args: {
  student: Student;
  score: number;
  total: number;
  timeTakenSeconds: number;
  reason: "completed" | "time-up";
  flagCount: number;
}) {
  const normalizedStudent = normalizeStudentCategory(args.student);
  const sessionId = getSessionId();
  await supabase.from("submissions").insert({
    session_id: sessionId,
    full_name: normalizedStudent.fullName,
    school_name: normalizedStudent.schoolName,
    standard: normalizedStudent.standard,
    category: normalizedStudent.category,
    round: 1,
    score: args.score,
    total: args.total,
    time_taken_seconds: args.timeTakenSeconds,
    reason: args.reason,
    flag_count: args.flagCount,
  });
  await supabase.from("active_sessions").delete().eq("session_id", sessionId);
  resetSession();
}
