import type { Transition } from "framer-motion";

/** Soft ease-out used by every entrance in the site. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Distance a revealed block travels before settling. */
export const REVEAL_OFFSET = 24;

export const REVEAL_DURATION = 0.6;

/** Gap between staggered siblings (cards, hero lines, timeline entries). */
export const STAGGER = 0.08;

/** Shared hover/interaction timing — 250ms everywhere. */
export const HOVER_TRANSITION: Transition = {
  duration: 0.25,
  ease: EASE,
};

/**
 * The reduced-motion transition. Every animated component keeps its markup and
 * its `initial` state identical in both modes and swaps only the transition,
 * so the element lands on its final frame with no elapsed time.
 *
 * Branching the markup instead — `initial={reduced ? false : {...}}`, or
 * returning a plain element — breaks hydration: `useReducedMotion()` is false
 * during SSR but true on the client's first render, so the server and client
 * trees disagree and React throws the whole tree away.
 */
export const INSTANT: Transition = { duration: 0 };
