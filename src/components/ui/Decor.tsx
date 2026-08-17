import { cn } from "@/lib/cn";

/**
 * The rotated label running up the hero's left edge, with the hairline rule
 * below it. Reads bottom-to-top, as in the reference.
 */
export function RailLabel({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <span
        className="font-body text-[11px] uppercase tracking-[0.24em] text-muted"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {children}
      </span>
      <span className="h-[120px] w-px bg-border-strong" aria-hidden />
    </div>
  );
}

/**
 * Faint concentric arcs with a single lit node — the orbit motif behind the
 * process rail and the contact block. Purely decorative.
 */
export function OrbitArcs({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={cn("block", className)}
      fill="none"
      aria-hidden
    >
      <circle cx="200" cy="200" r="196" stroke="var(--color-border)" strokeWidth="1" />
      <circle
        cx="200"
        cy="200"
        r="150"
        stroke="var(--color-border)"
        strokeWidth="1"
        strokeDasharray="3 7"
      />
      <circle cx="200" cy="200" r="104" stroke="var(--color-border)" strokeWidth="1" />
      <path
        d="M200 4a196 196 0 0 1 138.6 57.4"
        stroke="var(--color-sand-deep)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="338" cy="62" r="4" fill="var(--color-ink)" />
    </svg>
  );
}

/** Full-width hairline used to separate stacked bands. */
export function Hairline({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} aria-hidden />;
}
