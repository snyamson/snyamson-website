"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { EASE, INSTANT, REVEAL_DURATION, REVEAL_OFFSET } from "@/lib/motion";

export type RevealDirection = "up" | "left" | "right" | "scale";

/** `li` keeps `ul`/`ol` valid when the wrapper is the list item itself. */
const TAGS = { div: motion.div, li: motion.li } as const;

type RevealProps = {
  children: ReactNode;
  as?: keyof typeof TAGS;
  direction?: RevealDirection;
  delay?: number;
  className?: string;
};

const from: Record<RevealDirection, { x?: number; y?: number; scale?: number }> = {
  up: { y: REVEAL_OFFSET },
  left: { x: -REVEAL_OFFSET },
  right: { x: REVEAL_OFFSET },
  scale: { scale: 0.96 },
};

/**
 * The single entrance wrapper used across the site: section headings, cards
 * and list items all go through it.
 *
 * Under `prefers-reduced-motion: reduce` the markup and the `initial` state are
 * unchanged — only the trigger and the transition swap. The content settles on
 * mount rather than on scroll, instantly, so nothing is left mid-transform and
 * nothing below the fold waits to be scrolled to.
 *
 * The `data-reveal` hook lets the no-script style in the root layout force
 * every wrapper visible when JS never arrives.
 */
export function Reveal({
  children,
  as = "div",
  direction = "up",
  delay = 0,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = TAGS[as];

  const hidden = { opacity: 0, x: 0, y: 0, scale: 1, ...from[direction] };
  const shown = { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <Tag
      data-reveal
      className={className}
      initial={hidden}
      {...(reduced
        ? { animate: shown }
        : {
            whileInView: shown,
            viewport: { once: true, amount: 0.25 },
          })}
      transition={
        reduced ? INSTANT : { duration: REVEAL_DURATION, delay, ease: EASE }
      }
    >
      {children}
    </Tag>
  );
}
