import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { MathSymbols } from "@/components/MathSymbols";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KanithaPor 2026 — Math Quiz Competition" },
      { name: "description", content: "KanithaPor 2026 (கணிதப் போர்) — an interactive math competition for Indian students." },
      { property: "og:title", content: "KanithaPor 2026 — Math Quiz Competition" },
      { property: "og:description", content: "Where champions think. Where numbers speak." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-hero">
      <MathSymbols />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 py-6 text-center">
        <Logo className="h-32 w-auto drop-shadow-xl md:h-44" />

        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Math Competition · 2026
        </span>

        <h1 className="mt-3 text-4xl leading-[1.05] font-bold text-foreground md:text-6xl">
          கணிதப் போர் <span className="text-gradient-cta">2026</span>
        </h1>
        <p className="mt-2 font-display text-xl text-brand-blue-deep md:text-2xl">
          KanithaPor — The Math War
        </p>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground md:text-lg">
          Where champions think. <span className="text-foreground font-medium">Where numbers speak.</span>
        </p>

        <Link
          to="/entry"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-cta px-8 py-3.5 text-base font-semibold text-white shadow-glow animate-pulse-glow transition hover:scale-105"
        >
          Start Competition <span>→</span>
        </Link>

        <div className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-4">
          <Tier badge="Level 1" tier="Standards 1-3" desc="WINNING ROUND." accent="blue" />
          <Tier badge="Level 2" tier="Standard 4-6" desc="QUALIFYING ROUND." accent="orange" />
        </div>

        <div className="mt-5 hidden gap-3 text-xs text-muted-foreground sm:flex">
          <span>· Fullscreen & tab switches logged</span>
          <span>· 60 minute timer</span>
        </div>
      </div>
    </div>
  );
}

function Tier({ badge, tier, desc, accent }: { badge: string; tier: string; desc: string; accent: "blue" | "orange" }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/90 p-4 text-left shadow-soft backdrop-blur">
      <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl opacity-60 ${accent === "blue" ? "bg-brand-blue/30" : "bg-brand-orange/40"}`} />
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${accent === "blue" ? "bg-brand-blue/10 text-brand-blue-deep" : "bg-brand-orange/15 text-brand-orange"}`}>{badge}</span>
      <h3 className="mt-1.5 text-lg font-bold text-foreground">{tier}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
