function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing environment variable "${name}". Copy .env.example to .env.local and fill it in — see https://www.sanity.io/manage for your project id.`,
    );
  }
  return value;
}

export const projectId: string = required(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);

export const dataset: string = required(
  "NEXT_PUBLIC_SANITY_DATASET",
  process.env.NEXT_PUBLIC_SANITY_DATASET,
);

export const apiVersion: string = required(
  "NEXT_PUBLIC_SANITY_API_VERSION",
  process.env.NEXT_PUBLIC_SANITY_API_VERSION,
);

/**
 * `your-project-id` is the placeholder shipped in .env.example. When it is
 * still in place there is no real dataset to talk to, so every query short
 * circuits to the seed content in src/lib/seed.ts instead of throwing.
 */
export const isSanityConfigured: boolean = projectId !== "your-project-id";

export const studioBasePath = "/studio";

/* ------------------------------------------------------------------ *
 * Environment
 *
 * Staging and production run identical code against the same dataset and
 * differ only in which perspective they read:
 *
 *   staging     -> "drafts",    unpublished edits are visible
 *   production  -> "published", only published documents
 *
 * That makes publishing in the Studio the promotion step, with no second
 * dataset to keep in sync.
 * ------------------------------------------------------------------ */

export type SiteEnv = "production" | "staging";

/** Anything other than an explicit "staging" is treated as production. */
export const siteEnv: SiteEnv =
  process.env.NEXT_PUBLIC_SITE_ENV === "staging" ? "staging" : "production";

export const isStaging = siteEnv === "staging";

/**
 * Server-only. Drafts are not public, so reading them needs a token with at
 * least Viewer rights. Never prefix this with NEXT_PUBLIC_ — a token that
 * can read unpublished content must not reach the browser.
 */
export const readToken: string | undefined =
  process.env.SANITY_READ_TOKEN?.trim() || undefined;

/**
 * Canonical origin for this deployment, used for metadataBase and robots.
 * Falls back to Vercel's generated URL so preview deploys resolve correctly.
 */
export const siteUrl: string = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "https://snyamson.com";
})();
