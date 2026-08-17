import type { MetadataRoute } from "next";

import { projectsQuery, type Project } from "@/lib/queries";
import { seedProjects } from "@/lib/seed";
import { sanityFetch } from "@/sanity/client";
import { siteUrl } from "@/sanity/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await sanityFetch<Project[]>(projectsQuery, seedProjects);
  const now = new Date();

  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/cv`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...projects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
