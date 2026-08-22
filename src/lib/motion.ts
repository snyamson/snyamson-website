import type { SpringOptions, Transition } from "framer-motion";

/** Soft ease-out used by every entrance in the site. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Distance a revealed block travels before settling. */
export const REVEAL_OFFSET = 24;

export const REVEAL_DURATION = 0.6;

/** Gap between staggered siblings (cards, hero lines, timeline entries). */
export const STAGGER = 0.08;

/** Gap between the shards of one split line — tighter than between blocks. */
export const LINE_STAGGER = 0.045;

/**
 * Springs, in the weights the page uses. Ease curves get an element to its
 * destination; springs make it look like something moved it. Damping is high
 * across the board because this is an editorial layout — nothing here bounces.
 *
 *   SMOOTH — panels and shared marks. Settles, never overshoots.
 *   SNAPPY — buttons and controls: light, fast, answers the pointer.
 *   GENTLE — large slow objects (section blocks, cards) where a fast spring
 *            would read as a snap rather than a movement.
 *   SCROLL — not animation but smoothing. It follows a `useScroll` value that
 *            is already continuous and only takes the jitter out of it; the
 *            few frames of lag are what give a parallax layer its mass.
 *
 * Each weight is declared as bare physics because that is what `useSpring`
 * takes, and the `transition`-prop form is derived from it — two shapes, one
 * definition, so a tuning change cannot apply to only half the site.
 */
export const PHYSICS_SMOOTH: SpringOptions = {
  stiffness: 300,
  damping: 30,
  mass: 1,
};

export const PHYSICS_SNAPPY: SpringOptions = {
  stiffness: 400,
  damping: 26,
  mass: 0.8,
};

export const PHYSICS_GENTLE: SpringOptions = {
  stiffness: 140,
  damping: 22,
  mass: 1.1,
};

export const PHYSICS_SCROLL: SpringOptions = {
  stiffness: 90,
  damping: 26,
  restDelta: 0.001,
};

export const SPRING_SMOOTH: Transition = { type: "spring", ...PHYSICS_SMOOTH };
export const SPRING_SNAPPY: Transition = { type: "spring", ...PHYSICS_SNAPPY };
export const SPRING_GENTLE: Transition = { type: "spring", ...PHYSICS_GENTLE };

/** Shared hover/interaction timing — 250ms everywhere. */
export const HOVER_TRANSITION: Transition = {
  duration: 0.25,
  ease: EASE,
};

/**
 * The viewport trigger every scroll reveal shares. A block starts moving once
 * a fifth of it has crossed the fold, and the bottom margin pulls the trigger
 * line up off the very edge so nothing animates while already being read.
 */
export const VIEWPORT = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -8% 0px",
} as const;

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
