"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/cn";
import { EASE, INSTANT, VIEWPORT } from "@/lib/motion";

type RuleDrawProps = {
  delay?: number;
  /**
   * `accent` is sand-deep, for a rule that is a mark rather than a division.
   * `inverse` is the hairline as it has to be drawn on the ink ground, where
   * the paper's own border colour would be invisible.
   */
  tone?: "border" | "accent" | "inverse";
  className?: string;
};

/**
 * A hairline that draws itself left to right when it is scrolled to.
 *
 * Scale rather than width: `width` is a layout property and animating it
 * makes the browser re-lay-out the row on every frame, while `scaleX` runs
 * entirely on the compositor. The rule is one pixel tall, so the distortion
 * a scale would normally cause has nothing to distort.
 */
export function RuleDraw({
  delay = 0,
  tone = "border",
  className,
}: RuleDrawProps) {
  const reduced = useReducedMotion();

  return (
    <motion.span
      aria-hidden
      className={cn(
        "block h-px w-full origin-left",
        tone === "accent" && "bg-sand-deep",
        tone === "inverse" && "bg-sand/15",
        tone === "border" && "bg-border",
        className,
      )}
      initial={{ scaleX: 0 }}
      {...(reduced
        ? { animate: { scaleX: 1 } }
        : { whileInView: { scaleX: 1 }, viewport: VIEWPORT })}
      transition={reduced ? INSTANT : { duration: 1, delay, ease: EASE }}
    />
  );
}
