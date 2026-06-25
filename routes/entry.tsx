import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Logo } from "@/components/Logo";
import { MathSymbols } from "@/components/MathSymbols";
import { saveStudent, verifyAccessCode } from "@/lib/quiz-session";

export const Route = createFileRoute("/entry")({
  head: () => ({
    meta: [
      { title: "Student Entry - KanithaPor 2026" },
      { name: "description", content: "Register as a participant for KanithaPor 2026." },
    ],
  }),
  component: EntryPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  schoolName: z.string().trim().min(2, "Enter your school name").max(120),
  standard: z.coerce.number().int().min(1).max(6),
  accessCode: z.string().trim().min(1, "Access code is required").max(40),
});

function EntryPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    let shouldResetSubmitting = true;

    try {
      const fd = new FormData(e.currentTarget);
      const parsed = schema.safeParse({
        fullName: fd.get("fullName"),
        schoolName: fd.get("schoolName"),
        standard: fd.get("standard"),
        accessCode: fd.get("accessCode"),
      });

      if (!parsed.success) {
        const errs: Record<string, string> = {};
        for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
        setErrors(errs);
        return;
      }

      const ok = await verifyAccessCode(parsed.data.accessCode);
      if (!ok) {
        setErrors({ accessCode: "Invalid access code." });
        return;
      }

      saveStudent({
        ...parsed.data,
        category: parsed.data.standard <= 3 ? "junior" : "senior",
      });
      shouldResetSubmitting = false;
      navigate({ to: "/quiz" });
    } catch (error) {
      console.error(error);
      setErrors({ accessCode: "Unable to verify access code right now. Please try again." });
    } finally {
      if (shouldResetSubmitting) setSubmitting(false);
    }
  }

  const stdOptions = [1, 2, 3, 4, 5, 6];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-hero">
      <MathSymbols />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center justify-center px-4 py-4">
        <div className="grid w-full gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="hidden flex-col items-center justify-center text-center lg:flex">
            <Link to="/"><Logo className="h-36 w-auto drop-shadow-xl" /></Link>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground">Welcome, champion.</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">Enter your details and step into the arena.</p>
          </div>

          <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card/95 p-6 shadow-glow backdrop-blur" noValidate>
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <Link to="/"><Logo className="h-12 w-auto" /></Link>
              <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">Home</Link>
            </div>
            <h1 className="font-display text-2xl font-bold">Participant Entry</h1>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Full Name" name="fullName" placeholder="Arjun Kumar" error={errors.fullName} />
              <Field label="School Name" name="schoolName" placeholder="Bharath Vidyalaya" error={errors.schoolName} />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">Standard</label>
                <select name="standard" defaultValue="" className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30">
                  <option value="" disabled>Select</option>
                  {stdOptions.map((n) => <option key={n} value={n}>{`Standard ${n}`}</option>)}
                </select>
                {errors.standard && <p className="mt-1 text-xs text-destructive">{errors.standard}</p>}
              </div>
              <Field label="Access Code" name="accessCode" placeholder="School code" error={errors.accessCode} />
            </div>

            <button type="submit" disabled={submitting} className="mt-5 w-full rounded-xl bg-gradient-cta px-6 py-3 font-semibold text-white shadow-soft transition hover:scale-[1.01] disabled:opacity-60">
              {submitting ? "Checking..." : "Continue to Quiz"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, placeholder, error }: { label: string; name: string; placeholder?: string; error?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-foreground">{label}</label>
      <input name={name} placeholder={placeholder} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30" />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
