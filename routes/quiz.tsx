import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { getQuestionsForCategory, QUIZ_DURATION_SECONDS, type Question } from "@/lib/questions";
import { shuffleQuestion } from "@/utils/shuffleQuestion";
import Draggable from "react-draggable";
import {
  getSessionId, loadStudent, pushEvent, startSession, heartbeat, uploadSnapshot, endSessionWithSubmission,
} from "@/lib/quiz-session";

type QuizPersistenceState = {
  category: "junior" | "senior";
  questions: Question[];
  answers: Record<number, number>;
  current: number;
  started: boolean;
  startedAt: number;
  timeLeft: number;
};

const QUIZ_STATE_PREFIX = "kp.quizState.";

function getQuizStateKey() {
  if (typeof window === "undefined") return `${QUIZ_STATE_PREFIX}unknown`;
  return `${QUIZ_STATE_PREFIX}${getSessionId()}`;
}

function loadPersistedQuizState(): QuizPersistenceState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(getQuizStateKey());
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizPersistenceState;
  } catch {
    return null;
  }
}

function savePersistedQuizState(state: QuizPersistenceState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getQuizStateKey(), JSON.stringify(state));
}

function clearPersistedQuizState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getQuizStateKey());
}

export const Route = createFileRoute("/quiz")({
  head: () => ({ meta: [{ title: "Quiz in Progress — KanithaPor 2026" }] }),
  component: QuizPage,
});

function QuizPage() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(() => loadStudent());
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [questions, setQuestions] = useState<Question[]>([]);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef<number>(0);
  const currentRef = useRef(0);
  const finishedRef = useRef(false);
  const flagCountRef = useRef(0);

  const quizQuestions: Question[] = useMemo(
    () => (student ? getQuestionsForCategory(student.category) : []),
    [student],
  );

  useEffect(() => {
    if (!student || quizQuestions.length === 0) return;

    const persisted = loadPersistedQuizState();
    const shouldRestore = persisted && persisted.category === student.category && persisted.questions.length === quizQuestions.length;

    if (shouldRestore) {
      setQuestions(persisted.questions);
      setAnswers(persisted.answers ?? {});
      setCurrent(persisted.current ?? 0);
      setStarted(persisted.started ?? false);
      setTimeLeft(persisted.timeLeft ?? QUIZ_DURATION_SECONDS);
      startedAtRef.current = persisted.startedAt ?? 0;
      return;
    }

    const initialQuestions = quizQuestions.map(shuffleQuestion);
    setQuestions(initialQuestions);
    setAnswers({});
    setCurrent(0);
    setStarted(false);
    setTimeLeft(QUIZ_DURATION_SECONDS);
    startedAtRef.current = 0;
    savePersistedQuizState({
      category: student.category,
      questions: initialQuestions,
      answers: {},
      current: 0,
      started: false,
      startedAt: 0,
      timeLeft: QUIZ_DURATION_SECONDS,
    });
  }, [student, quizQuestions]);

  useEffect(() => {
    if (!student || questions.length === 0) return;

    savePersistedQuizState({
      category: student.category,
      questions,
      answers,
      current,
      started,
      startedAt: startedAtRef.current,
      timeLeft,
    });
  }, [student, questions, answers, current, started, timeLeft]);

  useEffect(() => { if (!student) navigate({ to: "/entry" }); }, [student, navigate]);
  useEffect(() => { currentRef.current = current; }, [current]);

  useEffect(() => {
    const stream = streamRef.current;
    if (!stream) return;

    for (const video of [previewVideoRef.current, liveVideoRef.current]) {
      if (!video || video.srcObject === stream) continue;
      video.srcObject = stream;
      void video.play().catch(() => {});
    }
  }, [cameraReady, started]);

  // proctor listeners
  useEffect(() => {
    if (!started) return;
    const fire = (type: "window-blur" | "tab-hidden" | "fullscreen-exit") => {
      flagCountRef.current++;
      pushEvent({ type, questionNumber: currentRef.current + 1, timestamp: Date.now() });
    };
    const onBlur = () => fire("window-blur");
    const onVis = () => { if (document.hidden) fire("tab-hidden"); };
    const onFs = () => { if (!document.fullscreenElement) fire("fullscreen-exit"); };
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [started]);

  // timer
  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { clearInterval(id); finishQuiz("time-up"); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // snapshot every 10s + heartbeat
  useEffect(() => {
    if (!started) return;
    const tick = async () => {
      const video = liveVideoRef.current ?? previewVideoRef.current;
      if (!video || video.videoWidth === 0) { await heartbeat(); return; }
      const canvas = document.createElement("canvas");
      canvas.width = 320; canvas.height = 240;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const path = await uploadSnapshot(blob);
        if (path) await heartbeat(path);
        else await heartbeat();
      }, "image/jpeg", 0.6);
    };
    void tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, [started]);

  function getCameraErrorMessage(error: unknown) {
    if (!window.isSecureContext) {
      return "Camera access only works on HTTPS or localhost.";
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      return "This browser does not support camera access here.";
    }

    if (error instanceof DOMException) {
      switch (error.name) {
        case "NotAllowedError":
          return "Camera access was blocked. Allow it in your browser site settings, then try again.";
        case "NotFoundError":
          return "No camera was found on this device.";
        case "NotReadableError":
          return "Your camera is already being used by another app or browser tab.";
        case "OverconstrainedError":
          return "This device could not start the requested camera.";
        case "SecurityError":
          return "Camera access is blocked in this browser context.";
        case "AbortError":
          return "The camera request was interrupted. Please try again.";
      }
    }

    return "Camera permission is required to start the competition.";
  }

  async function requestCamera() {
    setCameraError(null);

    if (!window.isSecureContext) {
      setCameraReady(false);
      setCameraError("Camera access only works on HTTPS or localhost.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraReady(false);
      setCameraError("This browser does not support camera access here.");
      return;
    }

    const currentStream = streamRef.current;
    if (currentStream && currentStream.getTracks().some((track) => track.readyState === "live")) {
      setCameraReady(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      setCameraReady(true);
    } catch (error) {
      setCameraReady(false);
      setCameraError(getCameraErrorMessage(error));
    }
  }

  async function beginQuiz() {
    if (!cameraReady || !student) return;
    try { await document.documentElement.requestFullscreen(); } catch { /* allow */ }
    await startSession(student);
    startedAtRef.current = Date.now();
    setStarted(true);
  }

  async function finishQuiz(reason: "completed" | "time-up") {
    if (finishedRef.current || !student) return;
    finishedRef.current = true;
    const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
    const timeTakenSeconds = Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000));
    await endSessionWithSubmission({
      student, score, total: questions.length, timeTakenSeconds, reason,
      flagCount: flagCountRef.current,
    });
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    navigate({ to: "/done" });
  }

  if (!student) return null;

  const standardLabel = student.standard ? `Standard ${student.standard}` : "Standard";
  const categoryLabel = student.category === "junior" ? "Standards 1-3" : "Standards 4-6";

  // Pre-quiz
  if (!started) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-hero">
        <div className="mx-auto flex h-full max-w-3xl flex-col px-4 py-4">
          <div className="flex shrink-0 items-center justify-between">
            <Link to="/"><Logo className="h-14 w-auto" /></Link>
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Home</Link>
          </div>
          <div className="mt-3 grid flex-1 grid-rows-[auto_1fr_auto] gap-3 rounded-3xl border border-border bg-card/95 p-5 shadow-glow backdrop-blur min-h-0">
            <div>
              <h1 className="font-display text-2xl font-bold">Pre-flight Checks</h1>
              <p className="text-sm text-muted-foreground">
                Hello <span className="font-semibold text-foreground">{student.fullName}</span> - {standardLabel} ({categoryLabel}). Enable your camera to begin.
              </p>
            </div>

            <div className="min-h-0 overflow-hidden rounded-2xl border border-border bg-black/90">
              {cameraReady ? (
                <video ref={previewVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/60">Camera preview will appear here</div>
              )}
            </div>

            <div>
              {cameraError && <p className="mb-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{cameraError}</p>}
              <div className="grid gap-2 sm:grid-cols-2">
                <button onClick={requestCamera} disabled={cameraReady} className="rounded-xl border border-input bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary/80 disabled:opacity-60">
                  {cameraReady ? "✓ Camera ready" : "Enable Camera"}
                </button>
                <button onClick={beginQuiz} disabled={!cameraReady} className="rounded-xl bg-gradient-cta px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:scale-[1.01] disabled:opacity-50">
                  Begin Quiz →
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {Math.round(QUIZ_DURATION_SECONDS / 60)} min · {questions.length} questions · Fullscreen & tab switches are logged
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const questionLines = q.q
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line, index, lines) => index === 0 || line !== lines[index - 1]);
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const answered = Object.keys(answers).length;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <header className="shrink-0 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <Logo className="h-9 w-auto shrink-0" />
            <div className="hidden min-w-0 text-xs sm:block">
              <div className="truncate font-semibold text-foreground">{student.fullName}</div>
              <div className="truncate text-muted-foreground">{standardLabel} - {student.schoolName}</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{answered}/{questions.length}</div>
            <div className={`rounded-full px-3 py-1 font-mono text-sm font-bold tabular-nums ${timeLeft < 60 ? "bg-destructive text-destructive-foreground" : "bg-gradient-primary text-primary-foreground"}`}>
              {mins}:{secs}
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-muted">
          <div className="h-full bg-gradient-cta transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
      </header>

      {/* camera floating */}
{/* camera floating */}
      {/* camera floating */}
<Draggable>
  <div
    className="fixed top-20 left-2 z-30 w-24 cursor-move overflow-hidden rounded-lg border-2 border-brand-orange shadow-glow sm:bottom-3 sm:right-3 sm:top-auto sm:w-36"
  >
    <video
      ref={liveVideoRef}
      autoPlay
      muted
      playsInline
      className="w-full"
    />

    <div className="bg-black/70 py-1 text-center text-xs text-white">
      📹 Drag me
    </div>
  </div>
</Draggable>

      <main className="mx-auto flex w-full max-w-5xl flex-1 min-h-0 gap-4 px-4 py-3">
        <section className="flex flex-1 min-w-0 flex-col">
          <div className="text-[11px] font-semibold tracking-wider text-accent uppercase">
            Question {current + 1} of {questions.length}
          </div>
          <div className="mt-2 space-y-2 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
            {questionLines.map((line, index) => (
              <p key={index} className={index === 0 ? "text-xl font-bold text-foreground md:text-2xl" : "text-sm leading-6 text-muted-foreground md:text-base"}>
                {line}
              </p>
            ))}
          </div>
          <div className="mt-4 grid flex-1 min-h-0 content-start gap-2 overflow-auto">
            {q.options.map((opt, i) => {
              const selected = answers[current] === i;
              return (
                <button key={i} onClick={() => setAnswers((a) => ({ ...a, [current]: i }))}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    selected ? "border-brand-blue bg-brand-blue/10 shadow-soft" : "border-border bg-card hover:border-brand-orange/60 hover:bg-accent/5"
                  }`}>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${selected ? "bg-gradient-cta text-white" : "bg-secondary text-secondary-foreground"}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-medium text-foreground">{opt}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex shrink-0 items-center justify-between">
            <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
              className="rounded-lg border border-input bg-card px-4 py-2 text-sm font-semibold text-foreground disabled:opacity-40">← Previous</button>
            {current < questions.length - 1 ? (
              <button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                className="rounded-lg bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft">Next →</button>
            ) : (
              <button onClick={() => finishQuiz("completed")}
                className="rounded-lg bg-gradient-cta px-5 py-2 text-sm font-semibold text-white shadow-glow">Submit Quiz</button>
            )}
          </div>
        </section>

        <aside className="hidden w-48 shrink-0 flex-col rounded-2xl border border-border bg-card p-3 md:flex">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Navigator</div>
          <div className="grid flex-1 grid-cols-5 content-start gap-1.5 overflow-auto">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`aspect-square rounded text-xs font-bold transition ${
                  i === current ? "bg-gradient-cta text-white shadow-soft"
                    : answers[i] !== undefined ? "bg-brand-blue/15 text-brand-blue-deep"
                    : "bg-secondary text-muted-foreground hover:bg-muted"
                }`}>{i + 1}</button>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
