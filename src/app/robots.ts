import type { MetadataRoute } from "next";

import { isStaging, siteUrl } from "@/sanity/env";

/**
 * Staging must never be indexed. Left open it would compete with the real
 * site in search results and expose unpublished drafts, so it disallows
 * everything and advertises no sitemap.
 *
 * The Studio is excluded on both, since an authenticated admin route has no
 * business in an index.
 */
export default function robots(): MetadataRoute.Robots {
  if (isStaging) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
