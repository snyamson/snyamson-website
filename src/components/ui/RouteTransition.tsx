"use client";

import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { GaugeRing } from "@/components/ui/GaugeRing";
import { cn } from "@/lib/cn";

/** Fade out once the new route has painted. Matches --animate-overlay-in. */
const FADE_MS = 320;

/** Keep the overlay up at least this long, or a fast route change flickers. */
const MIN_VISIBLE_MS = 420;

/** Never hold longer than this, whatever the router is doing. */
const MAX_VISIBLE_MS = 5000;

type Phase = "idle" | "open" | "closing";

/**
 * The same gauge as the first-load screen, shown between routes.
 *
 * The overlay is raised on link *click* rather than on the pathname
 * changing — by the time the pathname updates the navigation has already
 * happened, so an effect watching it would animate after the fact. It comes
 * down when the new pathname has rendered.
 *
 * Nothing measurable is happening during a route change, so the ring runs
 * indeterminate rather than showing a fake percentage.
 *
 * The fade-in is a CSS animation on mount, not a state flag flipped from
 * requestAnimationFrame. The rAF handoff raced React's commit and the
 * overlay could stay mounted at opacity 0 — invisible, but covering the
 * page. An animation that starts when the element is painted cannot race.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const reduced = useReducedMotion() ?? false;

  const [phase, setPhase] = useState<Phase>("idle");
  const shownAt = useRef(0);
  const target = useRef<string | null>(null);

  const close = useCallback(() => {
    setPhase("closing");
    target.current = null;
    window.setTimeout(() => setPhase("idle"), reduced ? 0 : FADE_MS);
  }, [reduced]);

  /* Raise the overlay when an internal link is about to navigate. */
  useEffect(() => {
    if (reduced) return;

    function onClick(event: MouseEvent) {
      // Let the browser handle modified clicks — they open new tabs and
      // never navigate this document.
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page, or only the hash differs — no navigation to cover.
      if (url.pathname === window.location.pathname) return;

      target.current = url.pathname;
      shownAt.current = performance.now();
      setPhase("open");
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [reduced]);

  /* Lower it once the destination has rendered. */
  useEffect(() => {
    if (phase !== "open") return;
    if (target.current !== null && target.current !== pathname) return;

    const elapsed = performance.now() - shownAt.current;
    const timer = window.setTimeout(close, Math.max(0, MIN_VISIBLE_MS - elapsed));
    return () => window.clearTimeout(timer);
  }, [pathname, phase, close]);

  /* Backstop: a navigation that never completes must not strand the visitor. */
  useEffect(() => {
    if (phase !== "open") return;
    const bail = window.setTimeout(close, MAX_VISIBLE_MS);
    return () => window.clearTimeout(bail);
  }, [phase, close]);

  if (phase === "idle") return null;

  const closing = phase === "closing";

  return (
    <div
      data-route-transition
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className={cn(
        "fixed inset-0 z-[90] grid place-items-center bg-bg",
        closing
          ? "pointer-events-none opacity-0 transition-opacity ease-out"
          : "animate-[var(--animate-overlay-in)]",
      )}
      style={closing ? { transitionDuration: `${FADE_MS}ms` } : undefined}
    >
      <GaugeRing indeterminate />
    </div>
  );
}
