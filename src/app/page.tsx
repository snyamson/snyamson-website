import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { WhatIDo } from "@/components/sections/WhatIDo";
import {
  contactQuery,
  heroQuery,
  processStepsQuery,
  projectsQuery,
  servicesQuery,
  siteSettingsQuery,
  specialitiesQuery,
  type Contact as ContactContent,
  type Hero as HeroContent,
  type ProcessStep,
  type Project,
  type Service,
  type SiteSettings,
  type Speciality,
} from "@/lib/queries";
import {
  seedContact,
  seedHero,
  seedProcessSteps,
  seedProjects,
  seedServices,
  seedSiteSettings,
  seedSpecialities,
} from "@/lib/seed";
import { sanityFetch } from "@/sanity/client";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, hero, specialities, processSteps, services, projects, contact] =
    await Promise.all([
      sanityFetch<SiteSettings>(siteSettingsQuery, seedSiteSettings),
      sanityFetch<HeroContent>(heroQuery, seedHero),
      sanityFetch<Speciality[]>(specialitiesQuery, seedSpecialities),
      sanityFetch<ProcessStep[]>(processStepsQuery, seedProcessSteps),
      sanityFetch<Service[]>(servicesQuery, seedServices),
      sanityFetch<Project[]>(projectsQuery, seedProjects),
      sanityFetch<ContactContent>(contactQuery, seedContact),
    ]);

  // A partially filled singleton should not blank out the nav or the footer,
  // so merge field-by-field over the seed.
  const site: SiteSettings = { ...seedSiteSettings, ...stripEmpty(settings) };
  const heroContent: HeroContent = { ...seedHero, ...stripEmpty(hero) };
  const contactContent: ContactContent = { ...seedContact, ...stripEmpty(contact) };

  return (
    <>
      <Navbar settings={site} />

      <main>
        <Hero hero={heroContent} />
        <FeaturedWork projects={projects} />
        <WhatIDo specialities={specialities} />
        <Services services={services} />
        <Process steps={processSteps} />
        <Contact contact={contactContent} settings={site} />
      </main>

      <Footer settings={site} />
    </>
  );
}

/** Drop null/undefined/empty values so they never override a seed field. */
function stripEmpty<T extends object>(value: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, entry] of Object.entries(value) as [keyof T, T[keyof T]][]) {
    if (entry === null || entry === undefined) continue;
    if (typeof entry === "string" && entry.trim() === "") continue;
    if (Array.isArray(entry) && entry.length === 0) continue;
    result[key] = entry;
  }
  return result;
}
