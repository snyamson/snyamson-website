/**
 * Fallback content. Every section renders from this when Sanity is
 * unconfigured, empty, or unreachable, so the site is never blank.
 *
 * NOTE: the hero stat figures below are placeholders in the right voice —
 * set them to your real numbers in the Studio before the site goes public.
 */
import type {
  Contact,
  Hero,
  PortableTextBlocks,
  ProcessStep,
  Project,
  ProjectDetail,
  Service,
  SiteSettings,
  Speciality,
} from "@/lib/queries";

/* Portable Text needs `_key` on every node. Seeded keys are deterministic so
   a re-import updates the same document rather than duplicating it. */
let keySeed = 0;
const nextKey = () => `seed${(keySeed += 1).toString(36)}`;

function blocks(...paragraphs: string[]): PortableTextBlocks {
  return paragraphs.map((text) => ({
    _type: "block",
    _key: nextKey(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: nextKey(), text, marks: [] }],
  }));
}

export const seedSiteSettings: SiteSettings = {
  logoText: "snyamson",
  // Left empty on purpose — this repository is public, and contact details
  // belong in Sanity where they can be changed or removed. Anything written
  // here is permanent once pushed. Every consumer omits empty values.
  phone: "",
  email: "",
  address: "",
  socials: [
    { platform: "linkedin", url: "https://www.linkedin.com/" },
    { platform: "github", url: "https://github.com/" },
    { platform: "twitter", url: "https://x.com/" },
    { platform: "medium", url: "https://medium.com/" },
  ],
  navLinks: [
    { label: "Work", href: "#work" },
    { label: "What I Do", href: "#what-i-do" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "CV", href: "/cv" },
  ],
  ctaLabel: "Book A Call",
  ctaHref: "#contact",
  footerBlurb:
    "I build the data layer that programme teams actually trust — clean pipelines, documented indicators, and reporting that holds up in front of a donor, a board, or an auditor.",
  footerLinks: [
    { label: "Work", href: "#work" },
    { label: "What I Do", href: "#what-i-do" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "CV", href: "/cv" },
    { label: "Contact", href: "#contact" },
  ],
  copyright: `© ${new Date().getFullYear()} Solomon Nyamson. All rights reserved.`,
};

export const seedHero: Hero = {
  greeting: "Hello",
  tagline: "It's Solomon — an analytics engineer",
  railLabel: "Analytics engineer",
  stats: [
    { value: "+40", label: "Indicators modelled" },
    { value: "+12", label: "Programmes supported" },
  ],
  bio: "I turn messy programme data into models, indicators and dashboards that people can act on. Monitoring and evaluation, humanitarian response analysis, and ESG reporting — built to survive audit, handover and scale.",
  primaryCta: { label: "Start a project", href: "#contact" },
  secondaryCta: { label: "View selected work", href: "#work" },
  portrait: null,
};

export const seedSpecialities: Speciality[] = [
  {
    _id: "seed-speciality-1",
    title: "Monitoring & evaluation",
    icon: "target",
    description:
      "Logframes and indicator libraries turned into tested data models, so every number traces back to a definition.",
    order: 1,
  },
  {
    _id: "seed-speciality-2",
    title: "Humanitarian data",
    icon: "globe",
    description:
      "Needs assessments and beneficiary registries cleaned, de-duplicated and geocoded, ready for cluster reporting.",
    order: 2,
  },
  {
    _id: "seed-speciality-3",
    title: "ESG & impact reporting",
    icon: "leaf",
    description:
      "GRI and IFRS S1/S2 disclosures modelled as auditable pipelines, with lineage from raw reading to published figure.",
    order: 3,
  },
  {
    _id: "seed-speciality-4",
    title: "Analytics engineering",
    icon: "workflow",
    description:
      "Warehouses, dbt models and tested transformations your team can query without waiting on me first.",
    order: 4,
  },
];

export const seedProcessSteps: ProcessStep[] = [
  {
    _id: "seed-step-1",
    title: "Discover",
    icon: "search",
    description: "Understanding the programme, the decisions, and the data you already hold.",
    order: 1,
  },
  {
    _id: "seed-step-2",
    title: "Define",
    icon: "target",
    description: "Indicator definitions, disaggregation and reporting calendar agreed in writing.",
    order: 2,
  },
  {
    _id: "seed-step-3",
    title: "Model",
    icon: "layers",
    description: "Sources mapped into a tested warehouse layer with documented lineage.",
    order: 3,
  },
  {
    _id: "seed-step-4",
    title: "Build",
    icon: "workflow",
    description: "Pipelines, quality tests and dashboards built around the decision, not the source system.",
    order: 4,
  },
  {
    _id: "seed-step-5",
    title: "Handover",
    icon: "shield",
    description: "Documentation, ownership and training so the reporting outlives the engagement.",
    order: 5,
  },
];

export const seedServices: Service[] = [
  {
    _id: "seed-service-1",
    title: "Analytics engineering",
    icon: "workflow",
    description:
      "dbt models, tested transformations and a warehouse your team can query without asking me first.",
    ctaLabel: "Discuss a project",
    ctaHref: "#contact",
    order: 1,
  },
  {
    _id: "seed-service-2",
    title: "M&E framework design",
    icon: "target",
    description:
      "Indicator definitions, disaggregation rules and reporting calendars agreed before a single form is built.",
    ctaLabel: "Discuss a project",
    ctaHref: "#contact",
    order: 2,
  },
  {
    _id: "seed-service-3",
    title: "Survey & data collection",
    icon: "clipboard",
    description:
      "ODK, KoBo and CommCare instruments with validation, offline sync and clean export straight into the pipeline.",
    ctaLabel: "Discuss a project",
    ctaHref: "#contact",
    order: 3,
  },
  {
    _id: "seed-service-4",
    title: "Dashboards & BI",
    icon: "barChart",
    description:
      "Power BI and Superset reporting built around the decision, not around whatever the source system happened to store.",
    ctaLabel: "Discuss a project",
    ctaHref: "#contact",
    order: 4,
  },
  {
    _id: "seed-service-5",
    title: "ESG reporting",
    icon: "leaf",
    description:
      "Emissions, workforce and supply chain metrics assembled to a disclosure standard, with evidence attached.",
    ctaLabel: "Discuss a project",
    ctaHref: "#contact",
    order: 5,
  },
  {
    _id: "seed-service-6",
    title: "Data quality & governance",
    icon: "shield",
    description:
      "Automated tests, anomaly checks and documented ownership so bad data is caught long before a donor sees it.",
    ctaLabel: "Discuss a project",
    ctaHref: "#contact",
    order: 6,
  },
];

/**
 * ⚠️ DRAFT CONTENT — READ BEFORE LAUNCH.
 *
 * These six case studies are structurally complete but the specifics are
 * illustrative, not a record of real engagements. Every `client`, `year`,
 * `duration` and every figure under `results` is a placeholder written in
 * the right voice so the pages are not empty while you fill them in.
 *
 * Rewrite each one in the Studio — or delete the ones that never happened —
 * before the site is public. Publishing these as-is would be claiming work
 * that has not been described accurately.
 */
export const seedProjectDetails: ProjectDetail[] = [
  {
    _id: "seed-project-1",
    title: "Cash transfer monitoring",
    slug: "cash-transfer-monitoring",
    category: "Programme dashboard",
    discipline: "Analytics engineering",
    thumbnail: null,
    heroImage: null,
    gallery: [],
    url: null,
    order: 1,
    client: "Confidential — international NGO",
    year: "2025",
    role: "Analytics engineer, lead",
    duration: "5 months",
    tools: ["dbt", "PostgreSQL", "KoBo Toolbox", "Power BI"],
    summary:
      "A distribution programme running across four districts with no single view of who had been paid, when, or whether the transfer had reached the right household.",
    challenge: blocks(
      "Payment records lived in the finance system, beneficiary records in KoBo, and verification calls in a spreadsheet a field officer maintained by hand. Reconciling the three took most of a week each month, and by the time it was done the numbers were already out of date.",
      "The programme could report how much money had moved. It could not reliably report how many distinct households had received it, which is the number the donor actually asked for.",
    ),
    approach: blocks(
      "I modelled the three sources into a single warehouse layer, keyed on a household identifier agreed with the field team rather than assumed from the data. Where the identifier was missing, the pipeline flags the record for review instead of guessing.",
      "Transfers, verifications and grievances then hang off that spine as separate fact tables, so a payment can be traced end to end without joining across systems by hand.",
      "Data-quality tests run on every load: duplicate identifiers, transfers without a matching registration, and verification dates that precede the payment.",
    ),
    outcome: blocks(
      "Monthly reconciliation became a dashboard refresh. The field team now sees failed and unverified transfers while there is still time to act on them, rather than in a report written six weeks later.",
    ),
    results: [
      { value: "9 days → 1", label: "Monthly reconciliation" },
      { value: "100%", label: "Transfers traceable to a household" },
    ],
  },
  {
    _id: "seed-project-2",
    title: "Needs assessment pipeline",
    slug: "needs-assessment-pipeline",
    category: "Humanitarian response",
    discipline: "Data modelling",
    thumbnail: null,
    heroImage: null,
    gallery: [],
    url: null,
    order: 2,
    client: "Confidential — multi-agency consortium",
    year: "2024",
    role: "Data lead",
    duration: "8 months",
    tools: ["Python", "PostGIS", "KoBo Toolbox", "Superset"],
    summary:
      "Six partner agencies collecting the same assessment on six slightly different forms, which meant the consortium could never total anything without a manual merge.",
    challenge: blocks(
      "Each partner had adapted the core questionnaire locally. Response options had drifted, district names were spelled three ways, and household size was a number in some forms and a bracket in others.",
      "Cluster reporting deadlines did not move, so the merge was done under time pressure every round — which is exactly when transcription errors get introduced.",
    ),
    approach: blocks(
      "I wrote a canonical schema for the assessment and a per-partner mapping into it, so each agency could keep the form its enumerators were trained on.",
      "Geographies were resolved against an official administrative gazetteer rather than free text, which made district-level aggregation reliable for the first time.",
      "The pipeline runs on ingest and produces both the cluster submission format and a partner-level quality report showing what failed and why.",
    ),
    outcome: blocks(
      "Partners kept their forms, the consortium got one dataset, and the quality report moved the conversation from arguing about whose numbers were right to fixing the specific records that were wrong.",
    ),
    results: [
      { value: "6 → 1", label: "Assessment formats reconciled" },
      { value: "Same day", label: "Cluster submission turnaround" },
    ],
  },
  {
    _id: "seed-project-3",
    title: "Indicator library",
    slug: "indicator-library",
    category: "M&E framework",
    discipline: "Data governance",
    thumbnail: null,
    heroImage: null,
    gallery: [],
    url: null,
    order: 3,
    client: "Confidential — development programme",
    year: "2024",
    role: "M&E data architect",
    duration: "4 months",
    tools: ["dbt", "Snowflake", "Git"],
    summary:
      "Forty-odd indicators reported quarterly, each defined slightly differently depending on who was asked and which report you read.",
    challenge: blocks(
      "The logframe named the indicators but not how to calculate them. Denominators varied between teams, disaggregation was inconsistent, and nobody could say whether two reports that disagreed were both wrong or both right about different things.",
      "This surfaces at the worst possible moment — during an evaluation, when the numbers have to be defended.",
    ),
    approach: blocks(
      "Every indicator got a written definition: numerator, denominator, disaggregation, reporting frequency, source, and the specific exclusions. The definition lives in version control next to the model that implements it.",
      "Each one is then a tested dbt model. If a definition changes, the change is a reviewable commit rather than a new spreadsheet.",
    ),
    outcome: blocks(
      "Reports became reproducible. When a figure is questioned, the answer is a definition and a lineage graph rather than an argument.",
    ),
    results: [
      { value: "40+", label: "Indicators defined and tested" },
      { value: "Full", label: "Lineage from source to published figure" },
    ],
  },
  {
    _id: "seed-project-4",
    title: "Scope 1–3 emissions model",
    slug: "scope-1-3-emissions-model",
    category: "ESG reporting",
    discipline: "Disclosure & assurance",
    thumbnail: null,
    heroImage: null,
    gallery: [],
    url: null,
    order: 4,
    client: "Confidential — ESG advisory practice",
    year: "2023",
    role: "Data analyst, sustainability reporting",
    duration: "7 months",
    tools: ["Python", "BigQuery", "dbt", "Looker Studio"],
    summary:
      "Emissions assembled from meter readings, fleet logs and procurement extracts, needing to survive third-party assurance.",
    challenge: blocks(
      "The previous year's figure had been built in a spreadsheet nobody could fully explain. Assurance raised evidence requests the team could not answer quickly, and each one cost days.",
      "Scope 3 was the hardest part: spend-based estimates mixed with supplier-reported actuals, with no consistent record of which method had been used where.",
    ),
    approach: blocks(
      "Each emissions source became a modelled table carrying its activity data, emission factor, factor source and calculation method as columns — so the method is part of the record, not a footnote.",
      "Factor versions are pinned by reporting year, which means a restatement is explicit rather than a silent change when a factor library updates.",
    ),
    outcome: blocks(
      "The assurance pack became a query. Evidence requests that previously meant reconstructing a calculation now resolve by pointing at the row and its lineage.",
    ),
    results: [
      { value: "~50%", label: "Fewer assurance evidence requests" },
      { value: "Scope 1–3", label: "Coverage with documented method" },
    ],
  },
  {
    _id: "seed-project-5",
    title: "Beneficiary de-duplication",
    slug: "beneficiary-de-duplication",
    category: "Registry service",
    discipline: "Data quality",
    thumbnail: null,
    heroImage: null,
    gallery: [],
    url: null,
    order: 5,
    client: "Confidential — regional response",
    year: "2023",
    role: "Analytics engineer",
    duration: "3 months",
    tools: ["Python", "PostgreSQL", "Dedupe"],
    summary:
      "Multiple partners registering the same households at intake, inflating reach figures and risking duplicate assistance.",
    challenge: blocks(
      "Names were transliterated inconsistently, dates of birth were often approximate, and no shared identifier existed across partners. Exact matching found almost nothing; loose matching produced false positives that would have wrongly excluded real households.",
    ),
    approach: blocks(
      "A probabilistic matching service scores candidate pairs across name, date of birth, location and household composition, then routes anything in the uncertain band to a human reviewer rather than deciding automatically.",
      "Exclusion is never automatic. The service flags; a caseworker decides.",
    ),
    outcome: blocks(
      "Reach figures became defensible, and the review queue gave partners a shared, auditable record of why a household was or was not treated as a duplicate.",
    ),
    results: [
      { value: "Human-in-loop", label: "No automatic exclusions" },
      { value: "Auditable", label: "Every merge decision recorded" },
    ],
  },
  {
    _id: "seed-project-6",
    title: "Grant reporting automation",
    slug: "grant-reporting-automation",
    category: "Donor reporting",
    discipline: "Pipeline automation",
    thumbnail: null,
    heroImage: null,
    gallery: [],
    url: null,
    order: 6,
    client: "Confidential — independent engagement",
    year: "2025",
    role: "Analytics engineer",
    duration: "2 months",
    tools: ["Python", "dbt", "GitHub Actions"],
    summary:
      "Four donors, four reporting templates, and the same underlying figures being re-derived by hand for each one.",
    challenge: blocks(
      "Because each template was built separately, the same indicator could end up different across two reports submitted in the same week — usually a filter someone forgot to apply.",
    ),
    approach: blocks(
      "One modelled results layer, with each donor template as a thin projection over it. The figures are derived once; the templates only reshape them.",
      "Generation runs on a schedule and fails loudly when an indicator is missing, rather than emitting a blank cell.",
    ),
    outcome: blocks(
      "Reports agree with each other by construction, and the reporting week stopped being the busiest week of the quarter.",
    ),
    results: [
      { value: "4 → 1", label: "Sources of truth" },
      { value: "Automated", label: "Template generation" },
    ],
  },
];

/** The card view the grids use — derived so the two never drift. */
export const seedProjects: Project[] = seedProjectDetails.map(
  ({
    _id,
    title,
    slug,
    category,
    discipline,
    thumbnail,
    url,
    year,
    order,
  }) => ({
    _id,
    title,
    slug,
    category,
    discipline,
    thumbnail,
    url,
    year,
    order,
  }),
)
  // Sorted to match `projectsQuery` exactly — newest year first, `order`
  // breaking ties. If the fallback disagreed with the query, the home page
  // would show a different four when Sanity was unreachable.
  .sort(
    (a, b) =>
      (b.year ?? "0000").localeCompare(a.year ?? "0000") || a.order - b.order,
  );

export const seedContact: Contact = {
  heading: "Let's build reporting you can defend",
  blurb:
    "Have a dataset that needs a straight answer, or a reporting cycle that keeps slipping? Tell me what decision the data has to support and I'll tell you what it takes to get there.",
  projectTypes: [
    "Monitoring & evaluation",
    "Humanitarian data analysis",
    "ESG & impact reporting",
    "Analytics engineering",
    "Dashboards & BI",
    "Something else",
  ],
  availabilityNote: "Available for consulting and fractional data leadership",
  available: true,
  submitLabel: "Send message",
};
