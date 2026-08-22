"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { EASE, INSTANT, REVEAL_OFFSET, SPRING_GENTLE, VIEWPORT } from "@/lib/motion";

export type RevealDirection = "up" | "left" | "right" | "scale" | "mask";

/** `li` keeps `ul`/`ol` valid when the wrapper is the list item itself. */
const TAGS = { div: motion.div, li: motion.li } as const;

type RevealProps = {
  children: ReactNode;
  as?: keyof typeof TAGS;
  direction?: RevealDirection;
  delay?: number;
  /**
   * Adds the pointer-tracked warm wash. Lives here rather than in a wrapper
   * of its own because the handler has to sit on the same element as the
   * card, and the sections that use it are server components — a server
   * component cannot hand a function down, but it can hand down `true`.
   */
  spotlight?: boolean;
  className?: string;
};

const from: Record<RevealDirection, { x?: number; y?: number; scale?: number }> = {
  up: { y: REVEAL_OFFSET },
  left: { x: -REVEAL_OFFSET },
  right: { x: REVEAL_OFFSET },
  scale: { scale: 0.96 },
  /* `mask` moves a short distance and is uncovered by the inner clip below,
     rather than travelling — see the note on that clip. */
  mask: { y: 16 },
};

/**
 * The clip that gives `mask` its uncovering. It is applied to an inner
 * wrapper, never to the observed element itself.
 *
 * That is not a stylistic choice. `clip-path: inset(0 0 100% 0)` reduces an
 * element's visible area to nothing, and IntersectionObserver reports a
 * clipped element's `intersectionRatio` as 0 wherever it actually sits on
 * the page. An element clipped this way can therefore never satisfy the
 * `amount` threshold that is supposed to reveal it: it clips itself out of
 * its own trigger and stays invisible for the whole session, holding open a
 * gap the size of the content that should have been there.
 *
 * Keeping the clip one level in leaves the observed box at full size, so the
 * trigger measures the layout rather than the effect.
 */
const maskClip: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)" },
};

/**
 * The single entrance wrapper used across the site: section headings, cards
 * and list items all go through it.
 *
 * The transition is a gentle spring rather than a curve. A block arriving on
 * a duration lands on a schedule; a block arriving on a spring lands when its
 * own mass says so, and a column of them staggered by `STAGGER` reads as one
 * object settling instead of a queue of separate ones.
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
  spotlight = false,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = TAGS[as];

  const variants: Variants = {
    hidden: { opacity: 0, x: 0, y: 0, scale: 1, ...from[direction] },
    show: { opacity: 1, x: 0, y: 0, scale: 1 },
  };

  /* Written straight onto the node as custom properties. The gradient is a
     paint-only change, so this never enters React's render path — a
     pointermove that set state would re-render the card sixty times a
     second to move a highlight. */
  function trackPointer(event: PointerEvent<HTMLElement>) {
    const node = event.currentTarget;
    const box = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${event.clientX - box.left}px`);
    node.style.setProperty("--my", `${event.clientY - box.top}px`);
  }

  const body =
    direction === "mask" ? (
      <motion.div
        data-reveal-clip
        className="h-full w-full"
        variants={maskClip}
        transition={reduced ? INSTANT : { duration: 0.8, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    ) : (
      children
    );

  return (
    <Tag
      data-reveal
      className={cn(spotlight && "group relative isolate", className)}
      variants={variants}
      initial="hidden"
      {...(reduced
        ? { animate: "show" }
        : { whileInView: "show", viewport: VIEWPORT })}
      {...(spotlight ? { onPointerMove: trackPointer } : {})}
      transition={
        reduced
          ? INSTANT
          : {
              ...SPRING_GENTLE,
              delay,
              // Opacity on a spring lingers near the end of its curve, which
              // reads as a slow fade under a block that has already landed.
              opacity: { duration: 0.5, delay, ease: "easeOut" },
            }
      }
    >
      {spotlight ? <span className="spotlight" aria-hidden /> : null}
      {body}
    </Tag>
  );
}
