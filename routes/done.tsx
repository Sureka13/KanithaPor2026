import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { MathSymbols } from "@/components/MathSymbols";

export const Route = createFileRoute("/done")({
  head: () => ({ meta: [{ title: "Thank You — KanithaPor 2026" }] }),
  component: DonePage,
});

function DonePage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-hero">
      <MathSymbols />
      <div className="relative z-10 mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 text-center">
        <Logo className="h-24 w-auto drop-shadow-xl md:h-32" />
        <div className="mt-6 rounded-3xl border border-border bg-card/95 p-8 shadow-glow backdrop-blur">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">Submission received</div>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            Thank you for participating!
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Your submission has been successfully recorded.
          </p>
          <p className="mt-2 text-base text-muted-foreground">
            Our judging team will review all responses and verify the results.
            Official results and qualification announcements will be released
            after the review process is completed.
          </p>
          <p className="mt-4 font-display text-lg font-semibold text-brand-blue-deep">
            Thank you for participating in KanithaPor 2026.
          </p>
          <Link to="/" className="mt-6 inline-block rounded-xl bg-gradient-cta px-6 py-3 font-semibold text-white shadow-soft">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
