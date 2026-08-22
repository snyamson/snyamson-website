import {
  cvCertificationsQuery,
  cvEducationQuery,
  cvExperienceQuery,
  cvLanguagesQuery,
  cvProfileQuery,
  cvProjectsQuery,
  cvSkillsQuery,
  type Cv,
  type CvCertification,
  type CvEducation,
  type CvExperience,
  type CvLanguage,
  type CvProfile,
  type CvProject,
  type CvSkillGroup,
} from "@/lib/cv";
import {
  seedCvCertifications,
  seedCvEducation,
  seedCvExperience,
  seedCvLanguages,
  seedCvProfile,
  seedCvProjects,
  seedCvSkills,
} from "@/lib/cvSeed";
import { sanityFetch } from "@/sanity/client";

/**
 * Single source for CV content. The page and the PDF route both call this,
 * so a downloaded CV can never show something different from the one on
 * screen.
 */
export async function getCv(): Promise<Cv> {
  const [
    profile,
    education,
    experience,
    projects,
    certifications,
    languages,
    skills,
  ] = await Promise.all([
    sanityFetch<CvProfile>(cvProfileQuery, seedCvProfile),
    sanityFetch<CvEducation[]>(cvEducationQuery, seedCvEducation),
    sanityFetch<CvExperience[]>(cvExperienceQuery, seedCvExperience),
    sanityFetch<CvProject[]>(cvProjectsQuery, seedCvProjects),
    sanityFetch<CvCertification[]>(cvCertificationsQuery, seedCvCertifications),
    sanityFetch<CvLanguage[]>(cvLanguagesQuery, seedCvLanguages),
    sanityFetch<CvSkillGroup[]>(cvSkillsQuery, seedCvSkills),
  ]);

  return {
    /*
     * Deliberately NOT merged field-by-field against the seed, unlike the
     * marketing-page singletons.
     *
     * On a CV, leaving a field blank is a decision — "I do not want my phone
     * number published" is not the same as "I have not filled this in yet".
     * A field-by-field merge cannot tell those apart, so clearing the phone
     * in the Studio would silently restore the seed's number.
     *
     * So once a cvProfile document exists, it is the whole truth. The seed is
     * only used when there is no document at all (sanityFetch returns the
     * fallback for a null result). `fullName` is the single exception: a CV
     * with no name on it is broken rather than minimal.
     */
    profile: {
      ...profile,
      fullName: profile.fullName || seedCvProfile.fullName,
    },
    education,
    experience,
    projects,
    certifications,
    languages,
    skills,
  };
}

/** Filename used for both downloads. */
export function cvFileName(profile: CvProfile, extension: "pdf" | "html"): string {
  const slug = profile.fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "cv"}-cv.${extension}`;
}
