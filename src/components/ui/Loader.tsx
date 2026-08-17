"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { GaugeRing } from "@/components/ui/GaugeRing";
import { cn } from "@/lib/cn";
import { useLoadProgress } from "@/lib/useLoadProgress";

/** How long the fade-out runs before the overlay is unmounted. */
const EXIT_MS = 550;

/**
 * First-load overlay. Route changes are handled separately by
 * RouteTransition — this only ever mounts once, on a full page load.
 */
export function Loader() {
  const reduced = useReducedMotion() ?? false;
  const { progress, done, markPortraitReady } = useLoadProgress(reduced);
  const [unmounted, setUnmounted] = useState(false);

  /**
   * A cached image can finish loading before React attaches onLoad, so the
   * event never fires and the signal never settles. The ref runs after the
   * element exists, where `complete` is the reliable answer.
   */
  const portraitRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete) markPortraitReady();
    },
    [markPortraitReady],
  );

  // Hold the scroll position while the overlay is up, so a visitor who
  // scrolls during load does not land halfway down the page on reveal.
  useEffect(() => {
    if (done) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [done]);

  /**
   * The exit is a plain CSS transition plus a timer rather than
   * AnimatePresence: its exit never completed here, leaving an opaque
   * overlay mounted over the whole site. A timeout always fires.
   */
  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => setUnmounted(true), reduced ? 0 : EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [done, reduced]);

  if (unmounted) return null;

  const percent = Math.round(progress * 100);

  return (
    <div
      data-loader
      role="status"
      aria-live="polite"
      aria-label={`Loading, ${percent} percent`}
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center bg-bg transition-opacity ease-out",
        // Clicks pass through the moment we start fading, so the site is
        // usable even if the unmount timer were somehow delayed.
        done ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      style={{ transitionDuration: `${reduced ? 0 : EXIT_MS}ms` }}
    >
      <div
        className="flex flex-col items-center transition-transform ease-out"
        style={{
          transitionDuration: `${reduced ? 0 : EXIT_MS}ms`,
          transform: done && !reduced ? "scale(1.08)" : "scale(1)",
        }}
      >
        <GaugeRing
          progress={progress}
          imageRef={portraitRef}
          onImageSettled={markPortraitReady}
        />

        <p className="mt-8 font-display text-[13px] tabular-nums tracking-[0.28em] text-ink">
          {String(percent).padStart(3, "0")}
        </p>
        <p className="mt-2 font-body text-[10px] uppercase tracking-[0.3em] text-muted">
          snyamson
        </p>
      </div>
    </div>
  );
}
