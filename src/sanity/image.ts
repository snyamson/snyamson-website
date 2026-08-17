import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

export type SanityImage = Image & {
  alt?: string;
};

export function urlForImage(source: SanityImage | undefined | null) {
  if (!source?.asset) return undefined;
  return builder.image(source).auto("format").fit("max");
}

/**
 * Resolve a Sanity image to a plain URL, or fall back to a local asset so a
 * section never renders a broken <Image />.
 */
export function imageUrl(
  source: SanityImage | undefined | null,
  fallback: string,
  width = 800,
  height?: number,
): string {
  const url = urlForImage(source);
  if (!url) return fallback;
  const sized = height ? url.width(width).height(height) : url.width(width);
  return sized.url();
}
