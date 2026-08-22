"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

import { EASE } from "@/lib/motion";

type CounterProps = {
  /** The finished figure, exactly as it should read — "40", "2.4k", "98%". */
  value: string;
  className?: string;
};

/** The leading digits of a figure, and whatever trails them ("k", "%", "+"). */
const NUMERIC = /^(\d+(?:\.\d+)?)(.*)$/;

/**
 * A figure that counts up the first time it is scrolled to.
 *
 * The final value is what renders on the server and what React holds in the
 * tree — the count is written straight to `textContent` and never through
 * state, so the figure is correct before hydration, correct without JS, and
 * correct for anything reading the DOM. Only the pixels are animated.
 *
 * Anything that is not a plain number (a range, a date, "n/a") is passed
 * through untouched rather than guessed at.
 */
export function Counter({ value, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduced) return;

    const match = NUMERIC.exec(value);
    if (!match) return;

    const target = Number(match[1]);
    const decimals = (match[1].split(".")[1] ?? "").length;
    const suffix = match[2];

    const controls = animate(0, target, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (latest) => {
        node.textContent = latest.toFixed(decimals) + suffix;
      },
      onComplete: () => {
        node.textContent = value;
      },
    });

    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
