import { supabase } from "@/integrations/supabase/client";

// The stored keys stay aligned with the existing database values:
// junior => Standards 1-3, senior => Standards 4-6.
export type Category = "junior" | "senior";

export type Student = {
  fullName: string;
  schoolName: string;
  standard: number | null;
  category: Category;
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



// Silent audit trail: not shown live, but visible per-student in the admin
// results tables afterward. Best-effort — losing one flag event is fine,
// losing the exam isn't, so this never throws into the caller.
export async function pushEvent(e: ProctorEvent) {
  const sessionId = getSessionId();
  try {
    await supabase.from("proctor_events").insert({
      session_id: sessionId,
      type: e.type,
      question_number: e.questionNumber,
      occurred_at: new Date(e.timestamp).toISOString(),
    });
  } catch {
    /* best-effort */
  }
}

// The one write that must never be silently lost: a student's final score.
// On a free-tier project, a burst of ~500 simultaneous submissions at
// "time's up" can get rate-limited — retry a few times, and if that still
// fails, queue it in localStorage so it isn't gone. flushPendingSubmissions()
// (called on app load) will keep trying to deliver it.
const PENDING_SUBMISSIONS_KEY = "kp.pendingSubmissions";

type SubmissionPayload = {
  session_id: string;
  full_name: string;
  school_name: string;
  standard: number | null;
  category: Category;
  round: number;
  score: number;
  total: number;
  time_taken_seconds: number;
  reason: "completed" | "time-up";
  flag_count: number;
};

function loadPendingSubmissions(): SubmissionPayload[] {
  if (!isBrowser) return [];
  try {
    return JSON.parse(localStorage.getItem(PENDING_SUBMISSIONS_KEY) ?? "[]") as SubmissionPayload[];
  } catch {
    return [];
  }
}

function savePendingSubmissions(list: SubmissionPayload[]) {
  if (!isBrowser) return;
  localStorage.setItem(PENDING_SUBMISSIONS_KEY, JSON.stringify(list));
}

async function insertSubmission(payload: SubmissionPayload): Promise<boolean> {
  try {
    const { error } = await supabase.from("submissions").insert(payload);
    return !error;
  } catch {
    return false;
  }
}

export async function flushPendingSubmissions() {
  const pending = loadPendingSubmissions();
  if (!pending.length) return;
  const stillPending: SubmissionPayload[] = [];
  for (const payload of pending) {
    const ok = await insertSubmission(payload);
    if (!ok) stillPending.push(payload);
  }
  savePendingSubmissions(stillPending);
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
  const payload: SubmissionPayload = {
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
  };

  let ok = false;
  for (let attempt = 0; attempt < 4 && !ok; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, attempt * 800));
    ok = await insertSubmission(payload);
  }
  if (!ok) {
    savePendingSubmissions([...loadPendingSubmissions(), payload]);
  }

  resetSession();
}
