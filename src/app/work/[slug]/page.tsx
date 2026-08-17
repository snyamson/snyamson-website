import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { InkButton, UnderlineLink } from "@/components/ui/Buttons";
import { BannerPlaceholder } from "@/components/ui/Placeholders";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { STAGGER } from "@/lib/motion";
import {
  nextProjects,
  projectBySlugQuery,
  projectSlugsQuery,
  projectsQuery,
  siteSettingsQuery,
  type PortableTextBlocks,
  type Project,
  type ProjectDetail,
  type SiteSettings,
} from "@/lib/queries";
import { seedProjectDetails, seedProjects, seedSiteSettings } from "@/lib/seed";
import { sanityFetch } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

/** Pre-render every known slug; anything new is rendered on demand. */
export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(
    projectSlugsQuery,
    seedProjectDetails.map((project) => project.slug),
  );
  return slugs.map((slug) => ({ slug }));
}

async function getProject(slug: string): Promise<ProjectDetail | null> {
  const fallback = seedProjectDetails.find((project) => project.slug === slug) ?? null;
  return sanityFetch<ProjectDetail | null>(projectBySlugQuery, fallback, { slug });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.summary ?? undefined,
    openGraph: {
      title: project.title,
      description: project.summary ?? undefined,
      type: "article",
    },
  };
}

/** One label/value pair in the facts lattice. */
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border pt-4">
      <dt className="font-body text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}
      </dt>
      <dd className="mt-2 font-body text-[14px] text-ink">{value}</dd>
    </div>
  );
}

/** A titled block of the case study. Renders nothing when the body is empty. */
function Chapter({
  label,
  body,
  children,
}: {
  label: string;
  body: PortableTextBlocks;
  children?: React.ReactNode;
}) {
  if ((!body || body.length === 0) && !children) return null;

  return (
    <section className="grid gap-y-6 border-t border-border pt-10 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,1fr)] lg:gap-x-16">
      <Reveal>
        <h2 className="eyebrow">{label}</h2>
      </Reveal>
      <div>
        <Reveal delay={0.06}>
          <RichText value={body} />
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  const [settings, project, allProjects] = await Promise.all([
    sanityFetch<SiteSettings>(siteSettingsQuery, seedSiteSettings),
    getProject(slug),
    sanityFetch<Project[]>(projectsQuery, seedProjects),
  ]);

  if (!project) notFound();

  const site: SiteSettings = { ...seedSiteSettings, ...settings };
  const more = nextProjects(allProjects, slug);

  const bannerUrl = urlForImage(project.heroImage ?? project.thumbnail)
    ?.width(2000)
    .height(1000)
    .url();

  const facts = [
    project.client ? { label: "Client", value: project.client } : null,
    project.role ? { label: "Role", value: project.role } : null,
    project.duration ? { label: "Duration", value: project.duration } : null,
    project.year ? { label: "Year", value: project.year } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  const meta = [project.category, project.discipline].filter(Boolean).join(" • ");

  return (
    <>
      <Navbar settings={site} />

      <main>
        {/* Masthead */}
        <section className="pb-[48px] pt-[56px] lg:pt-[72px]">
          <div className="shell-wide">
            <Reveal>
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:text-ink"
              >
                <span
                  className="h-px w-6 bg-current transition-all duration-[250ms] ease-out group-hover:w-8"
                  aria-hidden
                />
                All work
              </Link>
            </Reveal>

            <div className="mt-10 grid gap-y-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-x-16">
              <div>
                {meta ? (
                  <Reveal delay={0.04}>
                    <p className="eyebrow">{meta}</p>
                  </Reveal>
                ) : null}
                <Reveal delay={0.08}>
                  <h1 className="mt-5 font-display text-[clamp(40px,6.4vw,80px)] font-light leading-[0.98] tracking-[-0.035em] text-ink">
                    {project.title}
                  </h1>
                </Reveal>
              </div>

              {project.summary ? (
                <Reveal delay={0.14}>
                  <p className="max-w-[460px] text-[15px] leading-[1.85] text-muted">
                    {project.summary}
                  </p>
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>

        {/* Banner */}
        <section className="pb-[56px] lg:pb-[72px]">
          <div className="shell-wide">
            <Reveal delay={0.1}>
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-card border border-border bg-surface">
                {bannerUrl ? (
                  <Image
                    src={bannerUrl}
                    alt={
                      project.heroImage?.alt ?? project.thumbnail?.alt ?? project.title
                    }
                    fill
                    priority
                    sizes="(max-width: 1440px) 100vw, 1400px"
                    className="object-cover object-top"
                  />
                ) : (
                  <BannerPlaceholder index={project.order - 1} title={project.title} />
                )}
              </div>
            </Reveal>
          </div>
        </section>

        <div className="shell-wide">
          {/* Facts */}
          {facts.length > 0 || project.tools.length > 0 || project.url ? (
            <section className="pb-[64px]">
              <Reveal>
                <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                  {facts.map((fact) => (
                    <Fact key={fact.label} label={fact.label} value={fact.value} />
                  ))}
                </dl>
              </Reveal>

              {project.tools.length > 0 || project.url ? (
                <Reveal delay={0.08}>
                  <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                    {project.tools.length > 0 ? (
                      <ul className="flex flex-wrap gap-2">
                        {project.tools.map((tool) => (
                          <li
                            key={tool}
                            className="rounded-full border border-border-strong px-3.5 py-1.5 font-body text-[11px] uppercase tracking-[0.12em] text-ink"
                          >
                            {tool}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {project.url ? (
                      <UnderlineLink href={project.url}>View live</UnderlineLink>
                    ) : null}
                  </div>
                </Reveal>
              ) : null}
            </section>
          ) : null}

          {/* Story */}
          <div className="space-y-14 pb-[72px] lg:space-y-16">
            <Chapter label="The challenge" body={project.challenge} />
            <Chapter label="The approach" body={project.approach}>
              {project.gallery.length > 0 ? (
                <ul className="mt-12 grid gap-6 sm:grid-cols-2">
                  {project.gallery.map((image, index) => {
                    const url = urlForImage(image)?.width(1000).height(750).url();
                    if (!url) return null;
                    return (
                      <Reveal
                        as="li"
                        key={image.asset?._ref ?? index}
                        delay={(index % 2) * STAGGER}
                      >
                        <figure>
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-border bg-surface">
                            <Image
                              src={url}
                              alt={image.alt ?? ""}
                              fill
                              sizes="(max-width: 640px) 92vw, 46vw"
                              className="object-cover object-top"
                            />
                          </div>
                          {image.caption ? (
                            <figcaption className="mt-3 font-body text-[12px] text-muted">
                              {image.caption}
                            </figcaption>
                          ) : null}
                        </figure>
                      </Reveal>
                    );
                  })}
                </ul>
              ) : null}
            </Chapter>
            <Chapter label="The outcome" body={project.outcome} />
          </div>
        </div>

        {/* Results — the numbers do more work than the prose, so they get
            the one inverted band on the page. */}
        {project.results.length > 0 ? (
          <section className="bg-ink py-[64px] lg:py-[80px]">
            <div className="shell-wide">
              <Reveal>
                <h2 className="font-body text-[11px] uppercase tracking-[0.22em] text-sand">
                  Results
                </h2>
              </Reveal>
              <dl className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {project.results.map((result, index) => (
                  <Reveal key={result.label} delay={(index % 4) * STAGGER}>
                    <div className="border-t border-sand/25 pt-5">
                      <dt className="sr-only">{result.label}</dt>
                      <dd>
                        <span className="block font-display text-[34px] font-light leading-none tracking-[-0.03em] text-sand sm:text-[40px]">
                          {result.value}
                        </span>
                        <span className="mt-3 block font-body text-[12px] leading-snug text-sand/70">
                          {result.label}
                        </span>
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </section>
        ) : null}

        {/* More work */}
        {more.length > 0 ? (
          <section className="border-t border-border py-[72px] lg:py-[96px]">
            <div className="shell-wide">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <Reveal>
                  <h2 className="eyebrow">Next project</h2>
                </Reveal>
                <Reveal>
                  <UnderlineLink href="/work">All work</UnderlineLink>
                </Reveal>
              </div>

              <ul className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-x-12">
                {more.map((item, index) => (
                  <Reveal as="li" key={item._id} delay={index * STAGGER}>
                    <ProjectCard project={item} index={item.order - 1} variant="feature" />
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* Closing prompt */}
        <section className="border-t border-border bg-surface py-[72px] lg:py-[96px]">
          <div className="shell-wide">
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
              <Reveal>
                <h2 className="max-w-[560px] font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[38px]">
                  Have a reporting problem that looks like this one?
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
