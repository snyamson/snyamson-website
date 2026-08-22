"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";

import { PHYSICS_SNAPPY } from "@/lib/motion";

type MagneticProps = {
  children: ReactNode;
  /** Maximum pull, in px, at the far corner of the element. */
  strength?: number;
  className?: string;
};

/**
 * Leans whatever it wraps a few pixels toward the pointer, and springs back
 * when the pointer leaves.
 *
 * Reserved for the single primary action on a view. The effect works because
 * it is rare: applied to every link it stops reading as "this one answers
 * you" and starts reading as a page that will not hold still.
 *
 * Only pointer events drive it, so a touch screen never triggers it and
 * nothing runs until the pointer is actually over the element. Reduced
 * motion is handled by the spring itself — the CSS override in `globals.css`
 * cannot reach a transform written by JS, so the strength is checked against
 * the media query at the moment of the move instead.
 */
export function Magnetic({ children, strength = 8, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), PHYSICS_SNAPPY);
  const y = useSpring(useMotionValue(0), PHYSICS_SNAPPY);

  function onPointerMove(event: PointerEvent<HTMLSpanElement>) {
    const node = ref.current;
    if (!node || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const box = node.getBoundingClientRect();
    // Offset from the element's centre, normalised to -1…1 on each axis.
    const dx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
    const dy = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);

    x.set(dx * strength);
    y.set(dy * strength);
  }

  function release() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-flex" }}
      onPointerMove={onPointerMove}
      onPointerLeave={release}
      onPointerCancel={release}
    >
      {children}
    </motion.span>
  );
}
