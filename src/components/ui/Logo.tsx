import { cn } from "@/lib/cn";

type LogoProps = {
  text: string;
  className?: string;
  /** Inverted for the ink-teal footer. */
  tone?: "ink" | "sand";
};

/**
 * Mark plus wordmark. The mark is an "S" cut from a square — a data step,
 * drawn with the same hairline weight as the rest of the page.
 */
export function Logo({ text, className, tone = "ink" }: LogoProps) {
  const color = tone === "sand" ? "var(--color-sand)" : "var(--color-ink)";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 24 24" className="h-[24px] w-[24px]" aria-hidden>
        <rect
          x="1.6"
          y="1.6"
          width="20.8"
          height="20.8"
          rx="2"
          fill="none"
          stroke={color}
          strokeWidth="1.4"
        />
        <path
          d="M16.4 8.2H10a1.9 1.9 0 0 0 0 3.8h4a1.9 1.9 0 0 1 0 3.8H7.6"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={cn(
          "font-display text-[17px] font-medium tracking-[-0.02em]",
          tone === "sand" ? "text-sand" : "text-ink",
        )}
      >
        {text}
      </span>
    </span>
  );
}
