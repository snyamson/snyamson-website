"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { OrbitArcs } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeading";
import { resolveIcon } from "@/lib/icons";
import { PHYSICS_SCROLL, STAGGER } from "@/lib/motion";
import type { ProcessStep } from "@/lib/queries";

/**
 * One node on the rail. It is unlit until the drawing line reaches it, then
 * fills ink and throws a ring — the section's only piece of feedback, and
 * the thing that turns a line being drawn into a route being travelled.
 *
 * `at` is the node's own position along the rail, 0–1. The window is short
 * on purpose: a node should look switched, not dimmed up.
 */
function RailNode({
  progress,
  at,
  lit,
}: {
  progress: MotionValue<number>;
  at: number;
  lit: boolean;
}) {
  const fill = useTransform(progress, [at - 0.04, at], [0, 1]);
  const ring = useTransform(progress, [at - 0.04, at, at + 0.09], [0, 1, 0]);
  const ringScale = useTransform(progress, [at - 0.04, at + 0.09], [1, 2.8]);

  return (
    <span className="relative flex items-center justify-center">
      <motion.span
        className="absolute h-3 w-3 rounded-full border border-ink"
        style={lit ? { opacity: 0 } : { opacity: ring, scale: ringScale }}
        aria-hidden
      />
      <span
        className="relative grid h-3 w-3 place-items-center rounded-full border border-border-strong bg-bg"
        aria-hidden
      >
        <motion.span
          className="h-1 w-1 rounded-full bg-ink"
          style={lit ? { opacity: 1, scale: 1 } : { opacity: fill, scale: fill }}
        />
      </span>
    </span>
  );
}

/**
 * The horizontal rail. The lit portion's width tracks how far the reader has
 * scrolled through the section, so the line draws left-to-right as the step
 * cards arrive beneath it.
 */
function Rail({ count }: { count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 60%"],
  });
  // Smoothed for the same reason as every other scroll-linked value here:
  // the raw progress arrives in steps, and a line drawing in steps looks
  // like a repaint rather than a movement.
  const progress = useSpring(scrollYProgress, PHYSICS_SCROLL);
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);

  // The lit rule is the one place reduced motion changes a style value rather
  // than a transition, so it can only apply after mount — during hydration
  // both modes must render the 0% the server emitted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const lit = mounted && (reduced ?? false);

  return (
    <div ref={ref} className="relative hidden h-3 lg:block">
      <span
        className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border"
        aria-hidden
      />
      <motion.span
        className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-ink"
        style={lit ? { width: "100%" } : { width }}
        aria-hidden
      />

      {/* One node per step, centred over its card. Each sits at the middle of
          its own column, which is where the drawing line crosses it. */}
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: count }, (_, index) => (
          <RailNode
            key={index}
            progress={progress}
            at={(index + 0.5) / count}
            lit={lit}
          />
        ))}
      </div>
    </div>
  );
}

export function Process({ steps }: { steps: ProcessStep[] }) {
  if (steps.length === 0) return null;

  return (
    <section
      id="process"
      className="relative scroll-mt-24 overflow-hidden py-[72px] lg:py-[104px]"
    >
      <OrbitArcs className="pointer-events-none absolute -right-[140px] top-[40px] hidden h-[420px] w-[420px] opacity-70 xl:block" />

      <div className="shell-wide relative">
        <SectionHeader eyebrow="My process" note="A clear roadmap to the answer." />

        <div className="mt-12">
          <Rail count={steps.length} />

          {/* `--steps` drives the column count at lg so each card lands
              under its own node on the rail. */}
          <ol
            className="process-grid grid gap-4 sm:grid-cols-2 lg:mt-5 lg:gap-5"
            style={{ "--steps": steps.length } as React.CSSProperties}
          >
            {steps.map((step, index) => {
              const Icon = resolveIcon(step.icon);
              return (
                <Reveal
                  as="li"
                  key={step._id}
                  delay={index * STAGGER}
                  spotlight
                  className="flex h-full flex-col rounded-card border border-border bg-card px-6 py-6 transition-[transform,border-color,box-shadow] duration-[250ms] ease-out hover:-translate-y-1.5 hover:border-border-strong hover:shadow-[0_18px_40px_-28px_color-mix(in_oklab,var(--color-ink)_45%,transparent)]"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className="h-[17px] w-[17px] shrink-0 text-ink transition-transform duration-[250ms] ease-out group-hover:-translate-y-0.5"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <h3 className="font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-ink">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-[13px] leading-[1.75] text-muted">
                    {step.description}
                  </p>
                  <span
                    className="mt-auto pt-6 font-display text-[12px] tracking-[0.1em] text-border-strong transition-colors duration-[250ms] group-hover:text-ink"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
