import type { Cv } from "@/lib/cv";
import type { Project, SiteSettings, Speciality } from "@/lib/queries";

/**
 * JSON-LD for search engines.
 *
 * The point of the Person graph is entity recognition: when somebody
 * searches the name, Google has to decide that this site *is* that person
 * rather than a page mentioning them. `sameAs` is what does the work — it
 * ties the site to profiles Google already trusts, and those profiles should
 * link back for the association to hold in both directions.
 *
 * Deliberately omitted: email and telephone. Both are valid schema.org
 * properties, but publishing them as machine-readable JSON hands them to
 * scrapers, and they do nothing for entity recognition. Contact details
 * stay in the rendered page only.
 */

const PERSON_ID = "#person";

type Args = {
  siteUrl: string;
  settings: SiteSettings;
  cv: Cv;
  specialities?: Speciality[];
};

/** Every profile the site knows about, deduplicated. */
function sameAs(settings: SiteSettings, cv: Cv): string[] {
  const urls = [
    ...settings.socials.map((social) => social.url),
    ...cv.profile.links.map((link) => link.url),
  ].filter((url): url is string => Boolean(url && /^https?:\/\//.test(url)));

  // A bare "https://github.com/" placeholder is worse than nothing — it
  // points Google at a homepage that says nothing about this person.
  const meaningful = urls.filter((url) => {
    const { pathname } = new URL(url);
    return pathname.replace(/\/$/, "").length > 0;
  });

  return [...new Set(meaningful)];
}

export function personSchema({ siteUrl, settings, cv, specialities = [] }: Args) {
  const { profile } = cv;

  const alumniOf = cv.education.map((item) => ({
    "@type": "CollegeOrUniversity",
    name: item.institution,
    ...(item.country ? { address: { "@type": "PostalAddress", addressCountry: item.country } } : {}),
  }));

  const current = cv.experience.find(
    (item) => item.category === "professional" && item.current,
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/${PERSON_ID}`,
    name: profile.fullName,
    url: siteUrl,
    ...(profile.headline ? { jobTitle: profile.headline } : {}),
    ...(profile.summary ? { description: profile.summary } : {}),
    ...(profile.nationality ? { nationality: profile.nationality } : {}),
    ...(profile.location
      ? { address: { "@type": "PostalAddress", addressLocality: profile.location } }
      : {}),
    sameAs: sameAs(settings, cv),
    ...(alumniOf.length > 0 ? { alumniOf } : {}),
    ...(current
      ? { worksFor: { "@type": "Organization", name: current.organisation } }
      : {}),
    knowsAbout: [
      ...specialities.map((item) => item.title),
      ...cv.skills.flatMap((group) => group.items),
    ].slice(0, 24),
    knowsLanguage: cv.languages.map((item) => item.language),
  };
}

export function websiteSchema({ siteUrl, settings, cv }: Args) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: settings.logoText,
    ...(cv.profile.headline ? { description: cv.profile.headline } : {}),
    publisher: { "@id": `${siteUrl}/${PERSON_ID}` },
    inLanguage: "en",
  };
}

/** The CV page is the canonical description of the person. */
export function profilePageSchema({ siteUrl, cv }: Pick<Args, "siteUrl" | "cv">) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/cv#profilepage`,
    url: `${siteUrl}/cv`,
    name: `${cv.profile.fullName} — CV`,
    mainEntity: { "@id": `${siteUrl}/${PERSON_ID}` },
  };
}

/** A case study, credited to the person so the work reinforces the entity. */
export function projectSchema({
  siteUrl,
  project,
  summary,
}: {
  siteUrl: string;
  project: Project;
  summary: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${siteUrl}/work/${project.slug}#work`,
    name: project.title,
    url: `${siteUrl}/work/${project.slug}`,
    ...(summary ? { description: summary } : {}),
    ...(project.year ? { dateCreated: project.year } : {}),
    ...(project.category ? { genre: project.category } : {}),
    creator: { "@id": `${siteUrl}/${PERSON_ID}` },
    author: { "@id": `${siteUrl}/${PERSON_ID}` },
  };
}

/** Breadcrumbs give Google the site's shape and can surface as sitelinks. */
export function breadcrumbSchema(
  siteUrl: string,
  trail: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
}
