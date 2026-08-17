import Image from "next/image";
import type { Ref } from "react";

import { cn } from "@/lib/cn";

/**
 * Deliberately the local asset, not the Sanity portrait: a loading indicator
 * that waits on a remote image to render itself is self-defeating.
 */
export const LOADER_PORTRAIT = "/hero-portrait.png";

/* Ring geometry, in the SVG's own 200×200 coordinate space. */
const CENTRE = 100;
const TICK_COUNT = 60;
const TICK_INNER = 68;
const TICK_MINOR = 74;
const TICK_MAJOR = 79;

/* The progress mask is a fat stroked circle sitting over the tick band, so
   one animated attribute reveals all sixty ticks instead of sixty elements
   each animating their own colour. */
const MASK_RADIUS = 73;
const MASK_CIRCUMFERENCE = 2 * Math.PI * MASK_RADIUS;

const OUTER_RADIUS = 90;
const OUTER_CIRCUMFERENCE = 2 * Math.PI * OUTER_RADIUS;

/**
 * Rounded deliberately. ECMAScript does not require Math.sin/Math.cos to be
 * correctly rounded, so Node and the browser can disagree in the final bit —
 * and since these coordinates are computed at module scope, both render the
 * ring independently and React reports a hydration mismatch. Three decimals
 * is far finer than a 200-unit viewBox can show, and identical everywhere.
 */
const round = (value: number) => Math.round(value * 1000) / 1000;

/** A radial axis: sixty ticks, every fifth one longer, like a gauge. */
const TICKS = Array.from({ length: TICK_COUNT }, (_, index) => {
  const angle = (index / TICK_COUNT) * Math.PI * 2 - Math.PI / 2;
  const outer = index % 5 === 0 ? TICK_MAJOR : TICK_MINOR;
  return {
    x1: round(CENTRE + Math.cos(angle) * TICK_INNER),
    y1: round(CENTRE + Math.sin(angle) * TICK_INNER),
    x2: round(CENTRE + Math.cos(angle) * outer),
    y2: round(CENTRE + Math.sin(angle) * outer),
  };
});

function TickRing({ stroke, width }: { stroke: string; width: number }) {
  return (
    <g stroke={stroke} strokeWidth={width} strokeLinecap="round">
      {TICKS.map((tick, index) => (
        <line key={index} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} />
      ))}
    </g>
  );
}

type GaugeRingProps = {
  /**
   * 0 → 1. Ignored when `indeterminate`, where the lit arc is a fixed wedge
   * that simply turns — there is nothing honest to measure during a route
   * change, so it must not pretend to.
   */
  progress?: number;
  indeterminate?: boolean;
  /** Loader only: reports when the portrait has actually painted. */
  imageRef?: Ref<HTMLImageElement>;
  onImageSettled?: () => void;
  className?: string;
};

export function GaugeRing({
  progress = 0,
  indeterminate = false,
  imageRef,
  onImageSettled,
  className,
}: GaugeRingProps) {
  const maskId = indeterminate ? "gauge-mask-indeterminate" : "gauge-mask-progress";
  const lit = indeterminate ? 0.26 : progress;

  return (
    <div className={cn("relative grid h-[220px] w-[220px] place-items-center", className)}>
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        fill="none"
        aria-hidden
      >
        <defs>
          <mask id={maskId}>
            <g
              className={indeterminate ? "animate-[var(--animate-ring-spin)]" : undefined}
              style={indeterminate ? { transformOrigin: "100px 100px" } : undefined}
            >
              <circle
                cx={CENTRE}
                cy={CENTRE}
                r={MASK_RADIUS}
                fill="none"
                stroke="#fff"
                strokeWidth={18}
                strokeDasharray={`${MASK_CIRCUMFERENCE * lit} ${MASK_CIRCUMFERENCE}`}
                transform={`rotate(-90 ${CENTRE} ${CENTRE})`}
                style={
                  indeterminate
                    ? undefined
                    : {
                        transition:
                          "stroke-dasharray 700ms cubic-bezier(0.22,1,0.36,1)",
                      }
                }
              />
            </g>
          </mask>
        </defs>

        {/* Unlit axis */}
        <TickRing stroke="var(--color-border-strong)" width={1.5} />
        {/* The same axis in ink, revealed by the mask */}
        <g mask={`url(#${maskId})`}>
          <TickRing stroke="var(--color-ink)" width={2} />
        </g>

        {/* Outer dashed ring, and a sand arc turning against it */}
        <g
          className="animate-[var(--animate-ring-drift)]"
          style={{ transformOrigin: "100px 100px" }}
        >
          <circle
            cx={CENTRE}
            cy={CENTRE}
            r={OUTER_RADIUS}
            stroke="var(--color-border)"
            strokeWidth={1}
            strokeDasharray="2 9"
          />
        </g>
        <g
          className="animate-[var(--animate-ring-spin)]"
          style={{ transformOrigin: "100px 100px" }}
        >
          <circle
            cx={CENTRE}
            cy={CENTRE}
            r={OUTER_RADIUS}
            stroke="var(--color-sand-deep)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={`${OUTER_CIRCUMFERENCE * 0.16} ${OUTER_CIRCUMFERENCE}`}
          />
        </g>
      </svg>

      {/* Explicit dimensions rather than `fill` + `sizes`: a 108px size hint
          made Next's optimiser serve a 31px thumbnail. The scale crops in
          past the shoulders — at this diameter a full head-and-shoulders
          frame is too small to read as a face. */}
      <div className="relative h-[108px] w-[108px] overflow-hidden rounded-full bg-surface">
        <Image
          ref={imageRef}
          src={LOADER_PORTRAIT}
          alt=""
          width={320}
          height={320}
          priority
          onLoad={onImageSettled}
          onError={onImageSettled}
          className="h-full w-full origin-top scale-[1.42] object-cover object-top"
        />
      </div>
    </div>
  );
}
