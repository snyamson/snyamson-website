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
    _id: "seed-project-rice-dialogues",
    title: "Rice policy dialogues",
    slug: "rice-policy-dialogues-sierra-leone",
    category: "Rice sector policy",
    discipline: "Evidence & stakeholder analysis",
    thumbnail: null,
    heroImage: null,
    gallery: [],
    url: null,
    order: 1,
    client: "AGRA and SLeRO, funded by UK FCDO",
    year: "2026",
    role: "Data analyst & M&E consultant",
    duration: "Aug 2026 — ongoing",
    tools: ["Stakeholder mapping", "Key informant interviews", "Thematic analysis"],
    summary:
      "Sierra Leone is not short of rice policy. Getting the sector to agree which few things to fix first, and who owns them, is the work.",
    challenge: blocks(
      "Feed Salone, the National Rice Development Strategy, ECOWAP and the ECOWAS Rice Offensive all point in broadly the same direction. The historical record says the problem has rarely been the absence of a policy — it has been weak and inconsistent implementation, thin institutional ownership, and programmes that did not outlive the funding or the politics that started them.",
      "So the assignment is not to write another strategy. It is to work out which constraints actually bind, get the people who would have to act on them into the same room, and come out with recommendations that have a named owner and a realistic timeline. That is harder than analysis, because prioritising means telling some people their issue did not make the list.",
    ),
    approach: blocks(
      "The assignment runs in five phases for AGRA and the Sierra Leone Rice Observatory: inception and policy landscape review, identification and prioritisation of constraints, stakeholder mapping, facilitated dialogue, then documentation, validation and synthesis. I work the evidence side of it — the interview and discussion instruments, the stakeholder mapping, and the thematic analysis that turns consultation into findings.",
      "The desk review put six bottlenecks on the table: trade and market policy, input and seed systems, production and land use, finance and private-sector development, value chain coordination, and governance and implementation. None is treated as settled. Each goes to stakeholders to confirm it is still live rather than historical, and to surface the constraints that are widely experienced but never written down — which a desk review cannot find by definition.",
      "Prioritisation runs on one set of seven criteria applied to every issue: how strongly it affects sector performance, how many actors it touches, whether policy can address it at all, how feasible reform is in the current context, whether it would draw private investment, what it would do for food security and smallholders, and how quickly results would show. Scoring everything the same way is what makes the shortlist defensible to the people whose issue is left off it.",
      "Engagement is tiered on purpose, separating breadth of voice from depth of consultation. A wide pool validates the priorities through short surveys; those with direct influence or institutional responsibility go through key informant interviews; about twenty-five people deliberate in the dialogue itself; and senior decision-makers close it by taking ownership of what comes out.",
    ),
    outcome: blocks(
      "This one is still running. The inception report and policy landscape review are delivered, and the work is at the point of testing the six preliminary bottlenecks against what stakeholders actually experience before anything is scored.",
      "The dialogue, and the recommendation matrix that has to come out of it with named institutions, indicative timelines and resourcing against each action, are still ahead.",
    ),
    results: [
      { value: "6", label: "Policy bottlenecks surfaced by the desk review" },
      { value: "7", label: "Criteria every bottleneck is scored against" },
      { value: "4", label: "Engagement layers, from broad validation to decision-makers" },
      { value: "25", label: "Participants in the dialogue itself" },
    ],
  },
  {
    _id: "seed-project-iwmi",
    title: "Rainfed water management study",
    slug: "iwmi-rainfed-water-management",
    category: "Climate resilience research",
    discipline: "Field data operations",
    thumbnail: null,
    heroImage: null,
    gallery: [],
    url: null,
    order: 1,
    client: "IWMI, delivered through Warc Consultants",
    year: "2025",
    role: "Data & M&E supervisor",
    duration: "2 months of 3",
    tools: ["KoBo Collect", "STATA", "GPS crop classification"],
    summary:
      "How smallholders in northern Ghana are coping with a rainy season that keeps moving — asked of the farmers rather than inferred from rainfall records.",
    challenge: blocks(
      "The USAID Feed the Future Innovation Lab for Irrigation and Mechanization Systems wanted to know what would have to change before supplementary irrigation and soil and water conservation were worth a smallholder’s money. In northern Ghana one rainy season carries the year, it has become shorter and harder to predict, and the question of what farmers do about it is usually answered from the outside — from rainfall series and yield gaps rather than from the people farming.",
      "It also had to be answered three times over. IWMI was running the study across three agro-ecological zones with a different team in each. A dataset that was clean for the Upper West but coded differently from the others would have been useless for the only comparison that mattered.",
    ),
    approach: blocks(
      "Warc covered the Upper West leg, in the Sudan Savannah. I supervised the data side of it: adapting IWMI’s draft instruments to the local context, pretesting them in the field, and getting them harmonised with the other two regions so the three datasets could be pooled rather than merely filed together.",
      "The instruments were programmed into KoBo Collect and translated into the languages the enumerators would actually be working in. Four enumerators were trained over two days in Tumu, then sent out for a community entry and pilot round — one survey each — before any real collection started, to find the questions people would not answer as written.",
      "Fieldwork ran across five communities in Sissala East and Sissala West. The target was 130 households, twenty-six per community: five above the minimum the analysis needed, on the assumption that some records would not survive quality checks.",
      "Quality control ran daily rather than at the end. Submissions were checked against the protocol as they arrived and the progress dashboard kept current, so an enumerator drifting from the script was corrected the next morning instead of after the round — which is the only point at which it is still fixable.",
      "Alongside the household survey ran key informant interviews with input dealers, commercial and irrigation farmers, the district agriculture directorate and the environmental protection agency, and focus group discussions with smallholders. Crop classification points were collected by GPS inside a watershed boundary IWMI supplied.",
    ),
    outcome: blocks(
      "The fieldwork finished. Every household survey, interview and discussion was completed, the qualitative material was transcribed, and the quantitative dataset was cleaned and handed over in STATA format with a codebook. Initial analysis and a report went back to IWMI.",
      "Then the funding stopped. USAID cancelled the programme in February 2025 and the study ended before the three-zone comparison it was built for could be run. The Upper West data is complete, clean and documented; the question it was collected to answer is still open.",
    ),
    results: [
      { value: "130", label: "Households surveyed across five communities" },
      { value: "14", label: "Key informant interviews and focus group discussions" },
      { value: "4", label: "Enumerators trained and supervised in the field" },
      { value: "Feb 2025", label: "Cut short when USAID funding was cancelled" },
    ],
  },
  {
    _id: "seed-project-agra",
    title: "Regulatory environment assessment",
    slug: "agra-regulatory-environment-ghana",
    category: "Policy & advocacy research",
    discipline: "Qualitative analysis",
    thumbnail: null,
    heroImage: null,
    gallery: [],
    url: null,
    order: 1,
    client: "AGRA, delivered through Warc Consultants",
    year: "2024",
    role: "Data analyst & M&E expert",
    duration: "12 weeks",
    tools: ["MAXQDA", "Key informant interviews", "Focus group discussions"],
    summary:
      "Why young people and small agribusinesses in Ghana stay unregistered — and what the answer turned out to be, once you stopped asking the regulators and started asking the entrepreneurs.",
    challenge: blocks(
      "AGRA wanted to advocate for reform of Ghana’s business registration and product certification processes, on the grounds that they were shutting youth and small agribusinesses out of the formal economy. To do that they needed evidence, and there was very little of it: plenty of published procedure, almost nothing on what the process actually costs a person trying to get through it.",
      "The awkward part is that the two sides do not describe the same system. The regulators describe the process as written down. The entrepreneurs describe the process as experienced. An assessment that only captured one of those would have produced recommendations aimed at a problem nobody has.",
    ),
    approach: blocks(
      "The study ran in three phases over twelve weeks: a desk review of the legislation and the agencies that administer it, then primary qualitative fieldwork, then analysis and reporting.",
      "I worked on the instruments and the analysis. The interview and discussion guides were built to put the same questions to both sides — regulators and agencies on one hand, agripreneurs and MSMEs on the other — so the two accounts could be compared directly rather than reported side by side.",
      "Fieldwork was key informant interviews with regulatory bodies, ministries and private sector institutions, plus focus group discussions with agripreneurs in Northern Ghana. Every session was recorded and transcribed, and coding started while collection was still running, so gaps showed up in time to go back and fill them rather than after the field team had gone home.",
      "Coding and thematic analysis were done in MAXQDA. Transcripts were coded to a framework that grew out of the material — bureaucratic delay, cost, awareness, gender, accessibility, compliance pressure — and then refined into sub-themes and counted, so a finding could be reported as a share of respondents rather than as an impression.",
    ),
    outcome: blocks(
      "The headline finding was a gap between belief and fact. Entrepreneurs consistently described registration as prohibitively expensive; a sole proprietorship costs 120 cedis. What actually stops people is the belief that registering triggers an immediate tax bill, the absence of anyone to guide them through it, and repeat trips to an office because the requirements were never made clear.",
      "Seventy per cent of respondents pointed to bureaucratic delay. Against a published two-to-five working day turnaround, people reported going back and forth for over a month. Women were registering far less than men in farming while dominating processing and packaging, held back by capital, land tenure and the time the process demands.",
      "The findings went into a policy document setting out the registration and certification requirements alongside the reforms the evidence supports — a startup desk inside the regulators, agencies bringing registration out to the districts, and tax incentives that are actually communicated to the people eligible for them.",
    ),
    results: [
      { value: "70%", label: "Of respondents citing bureaucratic delay" },
      {
        value: "120",
        label: "Cedis to register a sole proprietorship, against a belief it is unaffordable",
      },
      {
        value: "2–5 days",
        label: "Published registration turnaround, against reports of over a month",
      },
      {
        value: "Both sides",
        label: "Regulators and agripreneurs put to the same questions",
      },
    ],
  },
  {
    _id: "seed-project-aip",
    title: "Agricultural intensification M&E",
    slug: "aip-ghana-sierra-leone",
    category: "Ghana & Sierra Leone",
    discipline: "M&E systems & impact design",
    thumbnail: null,
    heroImage: null,
    gallery: [],
    url: null,
    order: 2,
    client: "Confidential — forest carbon developer",
    year: "2026",
    role: "M&E consultant",
    duration: "14 months",
    tools: ["ODK Collect", "GPS plot mapping", "Coarsened exact matching"],
    summary:
      "A two-country programme raising farm yields to replace the production that forest restoration displaced, with carbon credits resting on proving the extra tonnes were real.",
    challenge: blocks(
      "Forest restoration took land out of production in Ghana and Sierra Leone. The programme had to put the same output back outside the restored area — plantain in Ghana, rice, cassava and groundnut in Sierra Leone — and be able to show it had done so before carbon credits could be issued.",
      "That claim only holds if you can say what each farmer used to produce, what they produce now, and that the difference came from the programme rather than from the weather or a good year. At the start none of that existed on paper. Farmers were known by name in a community, plots were known by sight, and past yields were whatever someone remembered.",
    ),
    approach: blocks(
      "I built one management system covering both countries, holding the whole chain in a single record: the farmer profile captured at enrollment, the plots that farmer was allocated, the boundary of each plot, and every input handed out against them. One farmer, one record, in Ghana and in Sierra Leone.",
      "Baseline grower records were collected in ODK Collect at enrollment — a socio-economic survey plus self-reported yields going back three years for each piece of land. A farmer moving onto new land is recorded twice: the history of the new plot, and their own history on the land they farmed before. Without both, an increase in yield could just be a better field.",
      "Every plot was walked and mapped. The survey captures the crop and the boundary, and plot maps are generated automatically with satellite layers and coordinates, so any plot in the programme can be pulled up and matched to the participant it was assigned to.",
      "For the end-of-year impact assessment I wrote the design as a matched comparison rather than a before-and-after. Treatment and control farmers are paired using coarsened exact matching on geography, farm size, distance from home to farm, land and soil type, tenure, crop mix, gender, age band, input use and time to the nearest market — so like is compared with like. The comparison is set at 95% confidence, a 5% margin of error and 80% power.",
      "Field teams screen farmers against the matching criteria as they go, and only farmers who match take the evaluation survey. Where a community cannot supply enough matched controls, it stays in the study with the shortfall written down and the bias it introduces stated, rather than being quietly dropped.",
    ),
    outcome: blocks(
      "The programme can answer the question it exists to answer: for any enrolled farmer, what was grown before, on which piece of land, and what has changed since. Enrollment, plot allocation, mapping and input distribution stopped being four separate exercises and became one record.",
      "The yield claim rests on a matched control group built from stated criteria rather than on a before-and-after that any auditor could pick apart, and the places where matching fell short are written into the record instead of hidden.",
    ),
    results: [
      { value: "2", label: "Countries running on one system" },
      { value: "5", label: "Crops under monitoring" },
      { value: "3 years", label: "Historic yield baseline per plot" },
      { value: "1:1", label: "Matched treatment and control design" },
    ],
  },
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
    order: 2,
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
