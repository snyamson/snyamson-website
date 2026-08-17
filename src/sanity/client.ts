import { createClient, type QueryParams } from "next-sanity";

import {
  apiVersion,
  dataset,
  isSanityConfigured,
  isStaging,
  projectId,
  readToken,
} from "./env";

const isDev = process.env.NODE_ENV === "development";

/*
 * Staging reads unpublished drafts so edits can be reviewed before they go
 * live; production reads only what has been published. Same dataset, same
 * code — publishing in the Studio is what promotes content.
 */
if (isStaging && isSanityConfigured && !readToken) {
  // Not thrown: a missing token should degrade to published content rather
  // than take the whole staging site down.
  console.warn(
    "[sanity] NEXT_PUBLIC_SITE_ENV=staging but SANITY_READ_TOKEN is unset — " +
      "drafts cannot be read, so staging will show published content only.",
  );
}

const readsDrafts = isStaging && Boolean(readToken);

/**
 * Cache tag every content query carries. The revalidate webhook
 * (src/app/api/revalidate/route.ts) busts this tag when you publish, which
 * is what makes an edit appear immediately rather than on the next timer.
 */
export const SANITY_TAG = "sanity-content";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // The CDN is fast and cheap but serves a cached copy. In development that
  // gets between you and your own edits, and the CDN cannot serve drafts at
  // all — so both of those read from the live API.
  useCdn: !isDev && !readsDrafts,
  perspective: readsDrafts ? "drafts" : "published",
  ...(readsDrafts ? { token: readToken } : {}),
});

/**
 * Every section of the site is allowed to render without a CMS behind it.
 * `sanityFetch` never throws: if Sanity is unconfigured, unreachable, or
 * simply returns nothing, the caller's fallback is used instead.
 *
 * Caching, by environment:
 *   dev      — never cached, so a publish shows on the next refresh.
 *   staging  — never cached either. The whole point of staging is to see an
 *              edit the moment it is saved; a 60s window would make it look
 *              broken while you waited.
 *   prod     — cached until the publish webhook clears the tag, with a 60s
 *              ceiling as a safety net in case the webhook is misconfigured.
 */
export async function sanityFetch<T>(
  query: string,
  fallback: T,
  params: QueryParams = {},
): Promise<T> {
  if (!isSanityConfigured) return fallback;

  try {
    const data = await client.fetch<T>(
      query,
      params,
      isDev || readsDrafts
        ? { cache: "no-store" }
        : { next: { revalidate: 60, tags: [SANITY_TAG] } },
    );

    if (data === null || data === undefined) return fallback;
    if (Array.isArray(data) && data.length === 0) return fallback;

    return data;
  } catch (error) {
    console.warn(
      `[sanity] query failed, falling back to seed content: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return fallback;
  }
}
