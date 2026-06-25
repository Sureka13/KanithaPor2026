const symbols = ["Σ", "π", "√", "∫", "÷", "∞", "α", "β", "Δ", "∑", "θ", "λ", "×", "≠", "≈"];

export function MathSymbols() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {symbols.map((s, i) => {
        const top = (i * 37) % 95;
        const left = (i * 53) % 95;
        const size = 24 + ((i * 11) % 64);
        const delay = (i % 7) * 0.6;
        const isOrange = i % 3 === 0;
        return (
          <span
            key={i}
            className="absolute animate-float-slow font-display font-bold select-none"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              fontSize: `${size}px`,
              color: isOrange
                ? "color-mix(in oklab, var(--brand-orange) 65%, transparent)"
                : "color-mix(in oklab, var(--brand-blue) 30%, transparent)",
              animationDelay: `${delay}s`,
            }}
          >
            {s}
          </span>
        );
      })}
    </div>
  );
}
