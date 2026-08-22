"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

import { PHYSICS_SCROLL } from "@/lib/motion";

/**
 * The hairline under the nav that fills as the document is read.
 *
 * It is sand-deep rather than ink: this is a status mark, not a piece of the
 * layout, and at 2px it is the one place the accent can carry a full-width
 * shape without competing with the type. Hidden from assistive tech — a
 * screen reader has better ways to know where it is in a document.
 *
 * Reduced motion drops the smoothing spring but keeps the bar. It reports a
 * position the reader is already producing themselves; it does not move on
 * its own, so there is nothing here to suppress. Swapping the source rather
 * than the markup also keeps the server and client renders identical.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, PHYSICS_SCROLL);

  return (
    <motion.div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-sand-deep"
      style={{ scaleX: reduced ? scrollYProgress : smooth }}
    />
  );
}
