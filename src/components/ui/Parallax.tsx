"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { PHYSICS_SCROLL } from "@/lib/motion";

type ParallaxProps = {
  children: ReactNode;
  /**
   * Total travel in px across the element's pass through the viewport. The
   * layer starts at its natural position and drifts *up* against the scroll,
   * which is what makes it read as sitting further back.
   */
  distance?: number;
  /** Extra zoom by the end of the pass, e.g. 0.06 for a slow 6% push in. */
  zoom?: number;
  className?: string;
};

/**
 * A layer that moves at its own rate as the page scrolls past it.
 *
 * The raw `scrollYProgress` is stepped: it updates once per scroll event, and
 * a transform driven straight off it judders on trackpads. Running it through
 * a low-stiffness spring smooths the steps into a continuous value, and the
 * few frames of lag that adds are exactly what makes the layer feel like it
 * has mass.
 *
 * Both ranges are anchored at the identity value for progress 0, which is
 * what the server renders. That keeps the emitted `style` attribute the same
 * in both motion modes — a reduced-motion branch that changed it would be a
 * hydration mismatch, since `useReducedMotion()` is false on the server and
 * true on the client's first render.
 */
export function Parallax({
  children,
  distance = 60,
  zoom = 0,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, PHYSICS_SCROLL);

  const y = useTransform(smooth, [0, 1], [0, reduced ? 0 : -distance]);
  const scale = useTransform(smooth, [0, 1], [1, reduced ? 1 : 1 + zoom]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        className="h-full w-full"
        style={{ y, scale, willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
