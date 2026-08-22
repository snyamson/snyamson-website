import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Parallax } from "@/components/ui/Parallax";
import { ProjectPlaceholder } from "@/components/ui/Placeholders";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/queries";
import { urlForImage } from "@/sanity/image";

type Variant = "compact" | "feature";

type ProjectCardProps = {
  project: Project;
  /** Position in the rendered list — drives the placeholder art and the index label. */
  index: number;
  variant?: Variant;
  className?: string;
};

/**
 * One project, in two sizes: `compact` for the home page's four-up row and
 * `feature` for the /work index, which has room for an index number, the
 * year, and a larger image.
 *
 * Shared so the two grids cannot drift apart as the card evolves.
 */
export function ProjectCard({
  project,
  index,
  variant = "compact",
  className,
}: ProjectCardProps) {
  const feature = variant === "feature";
  const thumbUrl = urlForImage(project.thumbnail)
    ?.width(feature ? 1200 : 760)
    .height(feature ? 900 : 570)
    .url();

  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn("group/card block h-full", className)}
      aria-label={project.title}
    >
      <article className="flex h-full flex-col">
        <div
          className={cn(
            "relative aspect-[4/3] w-full overflow-hidden rounded-card border border-border bg-surface",
            "transition-colors duration-[250ms] group-hover/card:border-border-strong",
          )}
        >
          {/* Overscanned top and bottom so the parallax drift always has
              image to pull into frame — a layer that moves inside a fixed
              crop must be larger than the crop or it exposes its own edge. */}
          <div className="absolute inset-x-0 -inset-y-[9%]">
            <Parallax className="h-full w-full" distance={34} zoom={0.05}>
              {/* Muted until hovered, then full colour with a slow push in. */}
              <div className="relative h-full w-full saturate-[0.35] transition-[filter,transform] duration-[550ms] ease-out group-hover/card:scale-[1.04] group-hover/card:saturate-100">
                {thumbUrl ? (
                  <Image
                    src={thumbUrl}
                    alt={project.thumbnail?.alt ?? project.title}
                    fill
                    sizes={
                      feature
                        ? "(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 620px"
                        : "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
                    }
                    className="object-cover object-top"
                  />
                ) : (
                  <ProjectPlaceholder index={index} title={project.title} />
                )}
              </div>
            </Parallax>
          </div>

        </div>

        <div
          className={cn(
            "mt-5 border-t border-border",
            feature ? "pt-5" : "pt-4",
          )}
        >
          {feature ? (
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <span className="font-display text-[12px] tracking-[0.18em] text-border-strong">
                {String(index + 1).padStart(2, "0")}
              </span>
              {project.year ? (
                <span className="font-body text-[11px] uppercase tracking-[0.18em] text-muted">
                  {project.year}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="flex items-start justify-between gap-4">
            <h3
              className={cn(
                "relative text-ink",
                feature
                  ? "font-display text-[24px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[28px]"
                  : "font-body text-[12px] font-semibold uppercase tracking-[0.14em]",
              )}
            >
              <span className="relative">
                {project.title}
                {/* The same wipe as UnderlineLink, so a card and a link read
                    as the same gesture at two sizes. */}
                <span
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-sand-deep transition-transform duration-[400ms] ease-out group-hover/card:scale-x-100"
                  aria-hidden
                />
              </span>
            </h3>

            {feature ? (
              <ArrowUpRight
                className="mt-1 h-5 w-5 shrink-0 text-ink transition-transform duration-[250ms] ease-out group-hover/card:translate-x-1 group-hover/card:-translate-y-1"
                strokeWidth={1.4}
                aria-hidden
              />
            ) : null}
          </div>

          <p
            className={cn(
              "font-body text-muted",
              feature ? "mt-3 text-[13px]" : "mt-2 text-[12px]",
            )}
          >
            {[project.category, project.discipline].filter(Boolean).join(" • ")}
          </p>
        </div>
      </article>
    </Link>
  );
}
