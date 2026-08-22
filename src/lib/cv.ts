import { groq } from "next-sanity";

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export type CvLink = { label: string; url: string };

export type CvProfile = {
  fullName: string;
  headline: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  nationality: string;
  links: CvLink[];
};

export type CvEducation = {
  _id: string;
  qualification: string;
  institution: string;
  location: string | null;
  country: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  expectedGraduation: string | null;
  status: string | null;
  grade: string | null;
  scholarship: string | null;
  description: string | null;
  coursework: string[];
  awards: string[];
};

export type CvExperienceCategory = "professional" | "research" | "teaching";

export type CvExperience = {
  _id: string;
  category: CvExperienceCategory;
  role: string;
  organisation: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  highlights: string[];
};

/**
 * A named piece of work, listed separately from the job it sat under. See
 * the schema note: a consultancy that runs alongside a role does not belong
 * on the employment timeline.
 */
export type CvProject = {
  _id: string;
  title: string;
  role: string;
  organisation: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  summary: string | null;
  highlights: string[];
  tools: string[];
  url: string | null;
};

export type CvCertification = {
  _id: string;
  title: string;
  category: "professional" | "language";
  issuer: string | null;
  location: string | null;
  country: string | null;
  grade: string | null;
  date: string | null;
  inProgress: boolean;
  url: string | null;
  order: number;
};

export type CvLanguage = {
  _id: string;
  language: string;
  level: string | null;
  order: number;
};

export type CvSkillGroup = {
  _id: string;
  label: string;
  items: string[];
  order: number;
};

export type Cv = {
  profile: CvProfile;
  education: CvEducation[];
  experience: CvExperience[];
  projects: CvProject[];
  certifications: CvCertification[];
  languages: CvLanguage[];
  skills: CvSkillGroup[];
};

/* ------------------------------------------------------------------ *
 * Queries — every timeline is newest first.
 * ------------------------------------------------------------------ */

/**
 * Every field coalesces to an empty string rather than returning null.
 *
 * That is what makes "leave the phone blank" work: an unset field in Sanity
 * comes back as "", every renderer treats "" as absent and omits the whole
 * item, and nothing has to be deleted from the schema to hide it from the
 * CV. The type stays honest too — these really are strings.
 */
export const cvProfileQuery = groq`
  *[_type == "cvProfile"][0]{
    "fullName": coalesce(fullName, ""),
    "headline": coalesce(headline, ""),
    "summary": coalesce(summary, ""),
    "email": coalesce(email, ""),
    "phone": coalesce(phone, ""),
    "location": coalesce(location, ""),
    "nationality": coalesce(nationality, ""),
    "links": coalesce(links[]{ label, url }, [])
  }
`;

export const cvEducationQuery = groq`
  *[_type == "cvEducation"] | order(startDate desc){
    _id,
    qualification,
    institution,
    location,
    country,
    startDate,
    endDate,
    "current": coalesce(current, false),
    expectedGraduation,
    status,
    grade,
    scholarship,
    description,
    "coursework": coalesce(coursework, []),
    "awards": coalesce(awards, [])
  }
`;

export const cvExperienceQuery = groq`
  *[_type == "cvExperience"] | order(startDate desc){
    _id,
    category,
    role,
    organisation,
    location,
    startDate,
    endDate,
    "current": coalesce(current, false),
    "highlights": coalesce(highlights, [])
  }
`;

export const cvProjectsQuery = groq`
  *[_type == "cvProject"] | order(startDate desc){
    _id,
    title,
    role,
    organisation,
    location,
    startDate,
    endDate,
    "current": coalesce(current, false),
    summary,
    "highlights": coalesce(highlights, []),
    "tools": coalesce(tools, []),
    url
  }
`;

export const cvCertificationsQuery = groq`
  *[_type == "cvCertification"]
    | order(coalesce(date, "9999-12-31") desc, order asc){
      _id,
      title,
      category,
      issuer,
      location,
      country,
      grade,
      date,
      "inProgress": coalesce(inProgress, false),
      url,
      "order": coalesce(order, 1)
    }
`;

export const cvLanguagesQuery = groq`
  *[_type == "cvLanguage"] | order(order asc){
    _id, language, level, order
  }
`;

export const cvSkillsQuery = groq`
  *[_type == "cvSkillGroup"] | order(order asc){
    _id, label, "items": coalesce(items, []), order
  }
`;

/* ------------------------------------------------------------------ *
 * Formatting — shared by the web page and the PDF so a date can never
 * read one way on screen and another in the download.
 * ------------------------------------------------------------------ */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "2025-10-01" -> "Oct 2025". Returns "" for anything unparseable. */
export function formatMonth(value: string | null | undefined): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return `${MONTHS[parsed.getUTCMonth()]} ${parsed.getUTCFullYear()}`;
}

/** "Oct 2025 — Present" for a range, or a single month when there is no end. */
export function formatRange(
  start: string | null | undefined,
  end: string | null | undefined,
  current = false,
): string {
  const from = formatMonth(start);
  if (current) return from ? `${from} — Present` : "Present";
  const to = formatMonth(end);
  if (from && to) return from === to ? from : `${from} — ${to}`;
  return from || to;
}

/**
 * The pills shown against an education entry: status, grade, funding and
 * expected finish. Derived here rather than in each layout so the web page
 * and the PDF cannot disagree about what an entry says.
 *
 * The word "scholarship" is only appended when the award name does not
 * already contain it — otherwise "GNPC Foundation Local Scholarship" renders
 * as "…Scholarship scholarship".
 */
export function educationFacts(item: CvEducation): string[] {
  const funding = item.scholarship
    ? /scholarship|fellowship|stipend|bursary|grant/i.test(item.scholarship)
      ? item.scholarship
      : `${item.scholarship} scholarship`
    : null;

  return [
    item.status,
    item.grade,
    funding,
    item.expectedGraduation ? `Expected ${item.expectedGraduation}` : null,
  ].filter((fact): fact is string => Boolean(fact));
}

export const EXPERIENCE_SECTIONS: {
  category: CvExperienceCategory;
  label: string;
}[] = [
  { category: "professional", label: "Professional experience" },
  { category: "research", label: "Research experience" },
  { category: "teaching", label: "Teaching experience" },
];
