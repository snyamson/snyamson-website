import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * `screen-teal` — for a portrait shot on a black studio backdrop. Screening
 *   the photo over a flat ink-teal plate maps its black to exactly the plate
 *   colour, so the image's rectangle disappears; the feather then dissolves
 *   the plate into the paper. Lit tones keep their full range.
 *
 * `plain` — for a portrait already rendered on a warm-paper backdrop. No
 *   plate, no blending; only the feather, and only to soften the crop.
 *
 * Switch to `plain` once the re-rendered photo lands — see README-DESIGN.md
 * for the image prompt.
 */
export type PortraitTreatment = "screen-teal" | "plain";

type HeroPortraitProps = {
  src: string;
  alt: string;
  treatment?: PortraitTreatment;
  className?: string;
};

export function HeroPortrait({
  src,
  alt,
  treatment = "screen-teal",
  className,
}: HeroPortraitProps) {
  const screened = treatment === "screen-teal";

  return (
    <div
      className={cn(
        "portrait-feather relative isolate h-full w-full",
        screened && "portrait-plate",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 1024px) 92vw, 620px"
        className={cn(
          "object-cover object-[50%_22%]",
          screened && "portrait-screen",
        )}
      />
    </div>
  );
}
