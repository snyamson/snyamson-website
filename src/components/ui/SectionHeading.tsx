import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  /** Small uppercase label, e.g. "Featured work". */
  eyebrow: string;
  /** Optional light note set inline after the eyebrow, as on "My process". */
  note?: string;
  /** Optional action pinned to the right, e.g. a "View all projects" link. */
  action?: ReactNode;
  className?: string;
};

/**
 * The section masthead used everywhere: eyebrow on the left, an optional
 * note beside it and an optional action pushed to the right — matching the
 * "FEATURED WORK … VIEW ALL PROJECTS" and "MY PROCESS  A clear roadmap"
 * rows in the reference.
 */
export function SectionHeader({
  eyebrow,
  note,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <Reveal>
      <div
        className={cn(
          "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3",
          className,
        )}
      >
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <h2 className="eyebrow">{eyebrow}</h2>
          {note ? (
            <p className="font-body text-[13px] text-muted">{note}</p>
          ) : null}
        </div>
        {action}
      </div>
    </Reveal>
  );
}

type SectionStatementProps = {
  /** The large display line, e.g. "Model. Test. Report." */
  statement: string;
  intro?: string;
  className?: string;
};

/** The bold display statement that follows an eyebrow in the "What I do" band. */
export function SectionStatement({
  statement,
  intro,
  className,
}: SectionStatementProps) {
  return (
    <div className={className}>
      <Reveal delay={0.06}>
        <p className="font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[36px]">
          {statement}
        </p>
      </Reveal>
      {intro ? (
        <Reveal delay={0.12}>
          <p className="mt-4 max-w-[340px] text-[14px] leading-[1.75] text-muted">
            {intro}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
