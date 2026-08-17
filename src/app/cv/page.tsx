import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CvDocument } from "@/components/sections/CvDocument";
import { CvDownload } from "@/components/ui/CvDownload";
import { OrbitArcs } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { getCv } from "@/lib/getCv";
import { siteSettingsQuery, type SiteSettings } from "@/lib/queries";
import { seedSiteSettings } from "@/lib/seed";
import { sanityFetch } from "@/sanity/client";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getCv();
  return {
    title: "CV",
    description:
      profile.summary ||
      `Curriculum vitae for ${profile.fullName} — ${profile.headline}`,
  };
}

export default async function CvPage() {
  const [settings, cv] = await Promise.all([
    sanityFetch<SiteSettings>(siteSettingsQuery, seedSiteSettings),
    getCv(),
  ]);

  const site: SiteSettings = { ...seedSiteSettings, ...settings };

  return (
    <>
      <Navbar settings={site} />

      <main>
        <section className="relative overflow-hidden pt-[56px] lg:pt-[72px]">
          <OrbitArcs className="pointer-events-none absolute -right-[180px] -top-[130px] hidden h-[440px] w-[440px] opacity-55 xl:block" />

          <div className="shell relative">
            <div className="flex flex-wrap items-center justify-between gap-6">
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

              {/* Sits at the top as well as the foot — a recruiter should not
                  have to scroll a long document to find the download. */}
              <Reveal delay={0.06}>
                <CvDownload />
              </Reveal>
            </div>

            <div className="mt-14 pb-[88px] lg:pb-[110px]">
              <CvDocument cv={cv} />
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface py-[64px] lg:py-[80px]">
          <div className="shell">
            <div className="flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
              <Reveal>
                <div>
                  <h2 className="font-display text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[32px]">
                    Take a copy with you
                  </h2>
                  <p className="mt-3 max-w-[460px] text-[14px] leading-[1.8] text-muted">
                    Generated from this page, so the download is never a stale
                    file sitting in a folder somewhere.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <CvDownload />
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={site} />
    </>
  );
}
