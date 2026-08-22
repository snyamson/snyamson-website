/**
 * Pushes the seed content in src/lib/seed.ts into a Sanity dataset, so the
 * Studio opens populated instead of blank.
 *
 * Run it with Node's native TypeScript support — no build step, no extra
 * dependency:
 *
 *   node --env-file=.env.local scripts/sanity-import.ts            # dry run
 *   node --env-file=.env.local scripts/sanity-import.ts --write    # create missing
 *   node --env-file=.env.local scripts/sanity-import.ts --write --replace
 *   node --env-file=.env.local scripts/sanity-import.ts --write --images
 *
 * Defaults are deliberately cautious:
 *   - without --write nothing is sent, it only prints what it would do
 *   - --write uses createIfNotExists, so your edits are never overwritten
 *   - --replace is the only way to clobber existing documents
 *   - --images is the only way to upload artwork (see below)
 *
 * Requires SANITY_WRITE_TOKEN in .env.local — create one with Editor rights
 * at https://www.sanity.io/manage under API → Tokens.
 *
 * NOTE: seed.ts only ever imports types from "@/lib/queries", and type-only
 * imports are erased before execution, so the "@/" alias never has to
 * resolve here. Keep it that way or this script needs a bundler.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import { createClient } from "@sanity/client";

import {
  seedContact,
  seedHero,
  seedProcessSteps,
  seedProjectDetails,
  seedServices,
  seedSiteSettings,
  seedSpecialities,
} from "../src/lib/seed.ts";
import {
  seedCvCertifications,
  seedCvEducation,
  seedCvExperience,
  seedCvLanguages,
  seedCvProfile,
  seedCvProjects,
  seedCvSkills,
} from "../src/lib/cvSeed.ts";

type Doc = Record<string, unknown> & { _id: string; _type: string };

const args = new Set(process.argv.slice(2));
const write = args.has("--write");
const replace = args.has("--replace");
const images = args.has("--images");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";
const token = process.env.SANITY_WRITE_TOKEN;

function fail(message: string): never {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

if (!projectId || projectId === "your-project-id") {
  fail(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is unset or still the placeholder.\n    Set it in .env.local — find it with `npx sanity projects list`.",
  );
}
if (write && !token) {
  fail(
    "SANITY_WRITE_TOKEN is not set.\n    Create an Editor token at https://www.sanity.io/manage → API → Tokens,\n    then add SANITY_WRITE_TOKEN=... to .env.local.",
  );
}

/** Array members in Sanity need a stable _key, or the Studio complains. */
function keyed<T extends object>(items: T[], prefix: string): (T & { _key: string })[] {
  return items.map((item, index) => ({ ...item, _key: `${prefix}-${index}` }));
}

/** Drop nulls and empty arrays so unset fields stay unset in the Studio. */
function clean(doc: Doc): Doc {
  const out: Doc = { _id: doc._id, _type: doc._type };
  for (const [key, value] of Object.entries(doc)) {
    if (key === "_id" || key === "_type") continue;
    if (value === null || value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out;
}

const docs: Doc[] = [
  clean({
    _id: "siteSettings",
    _type: "siteSettings",
    ...seedSiteSettings,
    socials: keyed(seedSiteSettings.socials, "social"),
    navLinks: keyed(seedSiteSettings.navLinks, "nav"),
    footerLinks: keyed(seedSiteSettings.footerLinks, "footer"),
  }),

  clean({
    _id: "hero",
    _type: "hero",
    ...seedHero,
    stats: keyed(seedHero.stats, "stat"),
  }),

  clean({
    _id: "contact",
    _type: "contact",
    ...seedContact,
  }),

  ...seedSpecialities.map((item) =>
    clean({
      ...item,
      _id: `speciality-${item.order}`,
      _type: "speciality",
    }),
  ),

  ...seedProcessSteps.map((step) =>
    clean({
      ...step,
      _id: `processStep-${step.order}`,
      _type: "processStep",
    }),
  ),

  ...seedServices.map((service) =>
    clean({
      ...service,
      _id: `service-${service.order}`,
      _type: "service",
    }),
  ),

  clean({
    _id: "cvProfile",
    _type: "cvProfile",
    ...seedCvProfile,
    links: keyed(seedCvProfile.links, "link"),
  }),

  ...seedCvEducation.map((item) =>
    clean({ ...item, _type: "cvEducation" }),
  ),
  ...seedCvExperience.map((item) =>
    clean({ ...item, _type: "cvExperience" }),
  ),
  ...seedCvProjects.map((item) =>
    clean({ ...item, _type: "cvProject" }),
  ),
  ...seedCvCertifications.map((item) =>
    clean({ ...item, _type: "cvCertification" }),
  ),
  ...seedCvLanguages.map((item) => clean({ ...item, _type: "cvLanguage" })),
  ...seedCvSkills.map((item) => clean({ ...item, _type: "cvSkillGroup" })),

  ...seedProjectDetails.map((project) => {
    // `slug` is a plain string in the seed but a slug object in Sanity, and
    // the image fields stay unset until real assets are uploaded.
    const { slug, thumbnail, heroImage, gallery, results, ...rest } = project;
    void thumbnail;
    void heroImage;
    void gallery;

    return clean({
      ...rest,
      _id: `project-${slug}`,
      _type: "project",
      slug: { _type: "slug", current: slug },
      results: keyed(results, "result"),
    });
  }),
];

const byType = docs.reduce<Record<string, number>>((acc, doc) => {
  acc[doc._type] = (acc[doc._type] ?? 0) + 1;
  return acc;
}, {});

console.log(`\n  Project  ${projectId}`);
console.log(`  Dataset  ${dataset}`);
console.log(`  Mode     ${!write ? "dry run" : replace ? "REPLACE existing" : "create if missing"}`);
console.log(`  Images   ${images ? "upload and attach" : "skipped (pass --images)"}\n`);
console.log(`  ${docs.length} documents:`);
for (const [type, count] of Object.entries(byType)) {
  console.log(`    ${String(count).padStart(3)}  ${type}`);
}

if (!write) {
  console.log("\n  Dry run — nothing sent. Re-run with --write to apply.\n");
  process.exit(0);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const tx = docs.reduce(
  (transaction, doc) =>
    replace ? transaction.createOrReplace(doc) : transaction.createIfNotExists(doc),
  client.transaction(),
);

try {
  await tx.commit();
  console.log(`\n  ✓ Imported. Open the Studio at /studio to review.\n`);
  if (!replace) {
    console.log(
      "  Existing documents were left untouched. Use --replace to overwrite them.\n",
    );
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n  ✗ Import failed: ${message}\n`);
  if (/Session does not match|Unauthorized|permission/i.test(message)) {
    console.error(
      "    That usually means SANITY_WRITE_TOKEN is missing Editor rights,\n    or belongs to a different project.\n",
    );
  }
  process.exit(1);
}

/* ------------------------------------------------------------------ *
 * Artwork
 *
 * Kept out of the document transaction on purpose. Uploading is a separate
 * request per file, it is the slow part of this script, and it is the only
 * part that can fail because of something on disk rather than in the data —
 * so it runs last, once the content is safely in, and only when asked for.
 *
 * Sanity keys assets by content hash, so re-running this does not pile up
 * copies of the same image; the second upload resolves to the first asset.
 *
 * A patch rather than part of the create: `createIfNotExists` leaves an
 * existing document alone, which is right for copy an editor may have
 * rewritten but wrong for artwork generated from a file in the repo.
 * ------------------------------------------------------------------ */
type Artwork = { slug: string; title: string; field: string; file: string };

const artwork: Artwork[] = seedProjectDetails.flatMap((project) => [
  {
    slug: project.slug,
    title: project.title,
    field: "thumbnail",
    file: `${project.slug}-thumbnail.png`,
  },
  {
    slug: project.slug,
    title: project.title,
    field: "heroImage",
    file: `${project.slug}-banner.png`,
  },
]);

if (images) {
  let attached = 0;
  console.log("  Artwork:");

  for (const item of artwork) {
    const filePath = path.join(process.cwd(), "public", "work", item.file);

    let data: Buffer;
    try {
      data = await readFile(filePath);
    } catch {
      // No artwork for this project yet, which is the normal case — the
      // placeholder components draw the card instead.
      continue;
    }

    try {
      const asset = await client.assets.upload("image", data, {
        filename: item.file,
      });

      await client
        .patch(`project-${item.slug}`)
        .set({
          [item.field]: {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
            alt: item.title,
          },
        })
        .commit();

      attached += 1;
      console.log(`    ${item.file} -> ${item.slug}.${item.field}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`    failed on ${item.file}: ${message}`);
    }
  }

  console.log(`  ${attached} image${attached === 1 ? "" : "s"} attached.`);
}
