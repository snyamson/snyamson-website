import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { InkButton } from "@/components/ui/Buttons";
import { OrbitArcs } from "@/components/ui/Decor";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { STAGGER } from "@/lib/motion";
import {
  projectsQuery,
  siteSettingsQuery,
  type Project,
  type SiteSettings,
} from "@/lib/queries";
import { seedProjects, seedSiteSettings } from "@/lib/seed";
import { breadcrumbSchema } from "@/lib/structuredData";
import { JsonLd } from "@/components/ui/JsonLd";
import { sanityFetch } from "@/sanity/client";
import { siteUrl } from "@/sanity/env";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Selected work",
  description:
    "Pipelines, indicator libraries and dashboards built for programme teams, response coordinators and sustainability leads.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Selected work",
    description:
      "Pipelines, indicator libraries and dashboards built for programme teams, response coordinators and sustainability leads.",
    url: `${siteUrl}/work`,
    type: "website",
  },
};

export default async function WorkPage() {
  const [settings, projects] = await Promise.all([
    sanityFetch<SiteSettings>(siteSettingsQuery, seedSiteSettings),
    sanityFetch<Project[]>(projectsQuery, seedProjects),
  ]);

  const site: SiteSettings = { ...seedSiteSettings, ...settings };

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(siteUrl, [
          { name: "Home", path: "/" },
          { name: "Selected work", path: "/work" },
        ])}
      />

      <Navbar settings={site} />

      <main>
        {/* Masthead */}
        <section className="relative overflow-hidden pb-[56px] pt-[56px] lg:pb-[72px] lg:pt-[80px]">
          <OrbitArcs className="pointer-events-none absolute -right-[170px] -top-[120px] hidden h-[460px] w-[460px] opacity-60 xl:block" />

          <div className="shell-wide relative">
            <Reveal>
              <Link
                href="/"
                className="group inline-flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:text-ink"
              >
                <span
                  className="h-px w-6 bg-current transition-all duration-[250ms] ease-out group-hover:w-8"
                  aria-hidden
                />
                Back home
              </Link>
            </Reveal>

            <div className="mt-10 grid gap-y-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-x-16">
              <div>
                <Reveal delay={0.05}>
                  <h1 className="font-display text-[clamp(52px,8vw,104px)] font-extralight leading-[0.92] tracking-[-0.04em] text-ink">
                    Selected work
                  </h1>
                </Reveal>
              </div>

              <div>
                <Reveal delay={0.12}>
                  <p className="max-w-[440px] text-[14px] leading-[1.85] text-muted">
                    Pipelines, indicator libraries and dashboards built for
                    programme teams, response coordinators and sustainability
                    leads. Every one had to survive an audit, a handover, or a
                    donor asking where a number came from.
                  </p>
                </Reveal>

                <Reveal delay={0.18}>
                  <p className="mt-6 flex items-baseline gap-3 font-body text-[11px] uppercase tracking-[0.2em] text-muted">
                    <span className="font-display text-[28px] font-light tracking-[-0.02em] text-ink">
                      {String(projects.length).padStart(2, "0")}
                    </span>
                    {projects.length === 1 ? "project" : "projects"}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Grid. Every second card is dropped down a little on wide screens —
            an even grid of six reads like a spreadsheet, and this is meant to
            read like a portfolio. */}
        <section className="pb-[88px] lg:pb-[120px]">
          <div className="shell-wide">
            {projects.length === 0 ? (
              <p className="border-t border-border pt-10 text-[14px] text-muted">
                No projects published yet.
              </p>
            ) : (
              <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:gap-x-12 lg:gap-y-20">
                {projects.map((project, index) => (
                  <Reveal
                    as="li"
                    key={project._id}
                    delay={(index % 2) * STAGGER}
                    className={index % 2 === 1 ? "lg:mt-[88px]" : undefined}
                  >
                    <ProjectCard project={project} index={index} variant="feature" />
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Closing prompt */}
        <section className="border-t border-border bg-surface py-[72px] lg:py-[96px]">
          <div className="shell-wide">
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
              <Reveal>
                <h2 className="max-w-[560px] font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[38px]">
                  Have a reporting problem that looks like one of these?
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <InkButton href="/#contact">Start a project</InkButton>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={site} />
    </>
  );
}
