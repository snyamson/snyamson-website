import type { PortableTextBlock } from "@portabletext/types";
import { groq } from "next-sanity";

import type { SanityImage } from "@/sanity/image";

/** Rich-text body, as stored by Sanity's block editor. */
export type PortableTextBlocks = PortableTextBlock[];

/* ------------------------------------------------------------------ *
 * Shared shapes
 * ------------------------------------------------------------------ */

export type Cta = {
  label: string;
  href: string;
};

export type LinkItem = {
  label: string;
  href: string;
};

export type SocialPlatform =
  | "linkedin"
  | "github"
  | "twitter"
  | "facebook"
  | "youtube"
  | "medium";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};

/* ------------------------------------------------------------------ *
 * Site settings
 * ------------------------------------------------------------------ */

export type SiteSettings = {
  logoText: string;
  phone: string;
  email: string;
  address: string;
  socials: SocialLink[];
  navLinks: LinkItem[];
  /** Top-right underlined link in the nav, e.g. "Book a call". */
  ctaLabel: string;
  ctaHref: string;
  footerBlurb: string;
  footerLinks: LinkItem[];
  copyright: string;
};

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    logoText,
    phone,
    email,
    address,
    "socials": coalesce(socials[]{ platform, url }, []),
    "navLinks": coalesce(navLinks[]{ label, href }, []),
    ctaLabel,
    ctaHref,
    footerBlurb,
    "footerLinks": coalesce(footerLinks[]{ label, href }, []),
    copyright
  }
`;

/* ------------------------------------------------------------------ *
 * Hero
 * ------------------------------------------------------------------ */

/** One of the "+200 / Projects completed" pairs above the greeting. */
export type HeroStat = {
  value: string;
  label: string;
};

export type Hero = {
  /** The oversized display word, e.g. "Hello". */
  greeting: string;
  /** The dashed line under it, e.g. "It's Solomon — analytics engineer". */
  tagline: string;
  /** Rotated label running up the left rail. */
  railLabel: string;
  stats: HeroStat[];
  bio: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  portrait: SanityImage | null;
};

export const heroQuery = groq`
  *[_type == "hero"][0]{
    greeting,
    tagline,
    railLabel,
    "stats": coalesce(stats[]{ value, label }, []),
    bio,
    primaryCta{ label, href },
    secondaryCta{ label, href },
    portrait
  }
`;

/* ------------------------------------------------------------------ *
 * Specialities — rendered as the "What I do" band
 * ------------------------------------------------------------------ */

export type Speciality = {
  _id: string;
  title: string;
  icon: string;
  description: string;
  order: number;
};

export const specialitiesQuery = groq`
  *[_type == "speciality"] | order(order asc){
    _id,
    title,
    icon,
    description,
    order
  }
`;

/* ------------------------------------------------------------------ *
 * Process
 * ------------------------------------------------------------------ */

export type ProcessStep = {
  _id: string;
  title: string;
  icon: string;
  description: string;
  order: number;
};

export const processStepsQuery = groq`
  *[_type == "processStep"] | order(order asc){
    _id,
    title,
    icon,
    description,
    order
  }
`;

/* ------------------------------------------------------------------ *
 * Services
 * ------------------------------------------------------------------ */

export type Service = {
  _id: string;
  title: string;
  icon: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  order: number;
};

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc){
    _id,
    title,
    icon,
    description,
    ctaLabel,
    ctaHref,
    order
  }
`;

/* ------------------------------------------------------------------ *
 * Projects
 * ------------------------------------------------------------------ */

/** Everything the four-up grid card needs, and nothing more. */
export type Project = {
  _id: string;
  title: string;
  slug: string;
  /** Meta line under the title, e.g. "Programme dashboard". */
  category: string;
  /** Second half of the meta line, e.g. "Analytics engineering". */
  discipline: string;
  thumbnail: SanityImage | null;
  url: string | null;
  year: string | null;
  order: number;
};

const projectCardFields = groq`
  _id,
  title,
  "slug": slug.current,
  category,
  discipline,
  thumbnail,
  url,
  year,
  order
`;

/**
 * Newest work first. `year` is a string, so four-digit years sort correctly
 * as text; `coalesce` keeps a project with no year at the bottom rather than
 * letting a null land unpredictably. `order` breaks ties within a year, and
 * is the only thing an editor has to touch to arrange work from one year.
 *
 * The home page takes the first four straight off this list, so publishing a
 * 2026 project puts it on the front page with no other action.
 */
export const projectsQuery = groq`
  *[_type == "project" && defined(slug.current)]
    | order(coalesce(year, "0000") desc, order asc){
      ${projectCardFields}
    }
`;

/** A metric pulled out of the case study, e.g. "9 days → 1". */
export type ProjectResult = {
  value: string;
  label: string;
};

export type GalleryImage = SanityImage & {
  caption?: string;
};

export type ProjectDetail = Project & {
  client: string | null;
  role: string | null;
  duration: string | null;
  tools: string[];
  summary: string | null;
  challenge: PortableTextBlocks;
  approach: PortableTextBlocks;
  outcome: PortableTextBlocks;
  results: ProjectResult[];
  heroImage: SanityImage | null;
  gallery: GalleryImage[];
};

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    ${projectCardFields},
    client,
    role,
    duration,
    "tools": coalesce(tools, []),
    summary,
    "challenge": coalesce(challenge, []),
    "approach": coalesce(approach, []),
    "outcome": coalesce(outcome, []),
    "results": coalesce(results[]{ value, label }, []),
    heroImage,
    "gallery": coalesce(gallery, [])
  }
`;

/** Slugs for `generateStaticParams`. */
export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)].slug.current
`;

/**
 * The two projects that follow this one in order, wrapping at the end.
 * Derived from the already-fetched list rather than a second query — it is
 * genuinely "next" that way, and costs nothing.
 */
export function nextProjects(all: Project[], slug: string, count = 2): Project[] {
  const index = all.findIndex((project) => project.slug === slug);
  if (index === -1) return all.slice(0, count);
  return Array.from({ length: Math.min(count, all.length - 1) }, (_, offset) => {
    return all[(index + offset + 1) % all.length];
  });
}

/* ------------------------------------------------------------------ *
 * Contact
 * ------------------------------------------------------------------ */

export type Contact = {
  heading: string;
  blurb: string;
  /** Options in the "Project type" select. */
  projectTypes: string[];
  availabilityNote: string;
  available: boolean;
  submitLabel: string;
};

export const contactQuery = groq`
  *[_type == "contact"][0]{
    heading,
    blurb,
    "projectTypes": coalesce(projectTypes, []),
    availabilityNote,
    "available": coalesce(available, true),
    submitLabel
  }
`;
