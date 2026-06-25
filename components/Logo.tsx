import kanithaPorLogo from "@/assets/kanithapor-logo-cropped.png";

export function Logo({ className = "h-16 w-auto" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden rounded-full border-4 border-brand-orange bg-card px-2 shadow-soft ${className}`}
      aria-label="KanithaPor 2026 - Math Quiz Competition"
    >
      <img
        src={kanithaPorLogo}
        alt="KanithaPor logo"
        className="h-full w-auto max-w-none object-contain"
      />
    </div>
  );
}
