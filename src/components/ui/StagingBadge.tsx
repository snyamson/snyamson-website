import { isStaging } from "@/sanity/env";

/**
 * A permanent marker that this is not the live site.
 *
 * Staging and production are visually identical by design, which is exactly
 * why it is easy to edit the wrong one, screenshot the wrong one, or send
 * the wrong link to somebody. This makes the difference impossible to miss
 * without getting in the way of reviewing the design.
 *
 * Renders nothing at all in production — not hidden with CSS, absent from
 * the markup.
 */
export function StagingBadge() {
  if (!isStaging) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-1/2 z-[120] -translate-x-1/2"
      role="status"
      aria-label="Staging environment, showing unpublished drafts"
    >
      <p className="rounded-full bg-ink px-4 py-2 font-body text-[10px] uppercase tracking-[0.2em] text-sand shadow-[0_10px_30px_-12px_rgba(5,61,58,0.7)]">
        Staging · showing drafts
      </p>
    </div>
  );
}
