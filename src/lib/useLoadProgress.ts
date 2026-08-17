"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/** Never dismiss faster than this — a loader that flashes reads as a glitch. */
const MIN_DISPLAY_MS = 700;

/** Never hold longer than this. One stalled asset must not trap the visitor. */
const MAX_DISPLAY_MS = 4000;

type Signal = "fonts" | "portrait" | "window";

const SIGNALS: Signal[] = ["fonts", "portrait", "window"];

type LoadState = {
  /** 0 → 1, reflecting assets actually settled. */
  progress: number;
  /** True once everything is ready and the minimum display has elapsed. */
  done: boolean;
  /**
   * Hand to the portrait's onLoad *and* onError. Reporting from the element
   * really on screen is the only honest measure: preloading a second copy
   * timed a different asset than the one being displayed, and
   * HTMLImageElement.decode() on a detached image can never settle at all.
   */
  markPortraitReady: () => void;
};

/** Resolves when the window `load` event fires, or immediately if it already has. */
function windowLoaded(): Promise<void> {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

/**
 * Progress derived from real readiness signals rather than a timer, so the
 * number on screen means something: web fonts settled, the portrait painted,
 * and the window load event fired.
 *
 * `skipMinimum` (reduced motion) dismisses the moment the work is done.
 */
export function useLoadProgress(skipMinimum = false): LoadState {
  const [ready, setReady] = useState<Record<Signal, boolean>>({
    fonts: false,
    portrait: false,
    window: false,
  });
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [expired, setExpired] = useState(false);

  const mark = useCallback((signal: Signal) => {
    setReady((current) =>
      current[signal] ? current : { ...current, [signal]: true },
    );
  }, []);

  const markPortraitReady = useCallback(() => mark("portrait"), [mark]);

  useEffect(() => {
    let cancelled = false;
    const settle = (signal: Signal) => () => {
      if (!cancelled) mark(signal);
    };

    // Settle on rejection too — a font that fails to load is still a
    // resolved question, and must not hold the page hostage.
    (document.fonts ? document.fonts.ready : Promise.resolve()).finally(
      settle("fonts"),
    );
    windowLoaded().finally(settle("window"));

    const minimum = window.setTimeout(
      () => {
        if (!cancelled) setMinimumElapsed(true);
      },
      skipMinimum ? 0 : MIN_DISPLAY_MS,
    );

    // Backstop: show the site regardless once the ceiling is reached.
    const ceiling = window.setTimeout(() => {
      if (!cancelled) setExpired(true);
    }, MAX_DISPLAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(minimum);
      window.clearTimeout(ceiling);
    };
  }, [mark, skipMinimum]);

  const settled = useMemo(
    () => SIGNALS.filter((signal) => ready[signal]).length,
    [ready],
  );

  const allReady = settled === SIGNALS.length;

  return {
    progress: expired ? 1 : settled / SIGNALS.length,
    done: expired || (allReady && minimumElapsed),
    markPortraitReady,
  };
}
