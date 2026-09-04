/**
 * CV fallback content — used only when Sanity is unreachable or empty.
 * Sanity is the source of truth; this exists so the page never renders blank.
 *
 * ── NO PERSONAL CONTACT DETAILS IN THIS FILE ──
 *
 * This repository is public. Phone numbers, email addresses and profile
 * links are deliberately left empty here and live in Sanity instead, where
 * they can be changed or removed at will. A value committed to a public
 * repository is permanent — deleting it later does not retract clones,
 * forks or cached views — so it must not be written here again.
 *
 * The blank fields are not a bug: every renderer omits an empty value
 * entirely, so the CV degrades to name, headline and history rather than
 * showing gaps.
 *
 * Still to correct in the Studio:
 *   1. Warc Consultants is marked `current`, carried over from the old CV.
 *      That cannot read as "Present" alongside full-time study in Passau
 *      without an end date or a note that it is remote/part-time.
 *   2. The German language certificates are placeholders for structure only.
 *      Replace the school, city, grade and date with the real ones.
 *   3. The AGRA project runs Sep–Nov 2024 here. Only the year is known;
 *      the months are a twelve-week window standing in for the real ones.
 *      Set them before anyone reads this as a date.
 *   4. The Warc BI platform starts Jan 2026 here. Only "2026, ongoing" is
 *      confirmed — the month is a placeholder. Set the real start date.
 */
import type {
  CvCertification,
  CvEducation,
  CvExperience,
  CvLanguage,
  CvProfile,
  CvProject,
  CvSkillGroup,
} from "@/lib/cv";

export const seedCvProfile: CvProfile = {
  fullName: "Solomon Nyamson",
  headline: "Development economist · Monitoring, evaluation & data",
  summary:
    "Development economist working at the join between field data and the decisions it is supposed to inform. Currently reading for an MA in Development Studies at the University of Passau on a DAAD scholarship, after four years building monitoring and evaluation systems for agricultural programmes across West Africa.",
  // Contact details live in Sanity, never here. See the note at the top.
  email: "",
  phone: "",
  location: "",
  nationality: "",
  links: [],
};

export const seedCvEducation: CvEducation[] = [
  {
    _id: "cv-education-passau",
    qualification: "MA Development Studies",
    institution: "Universität Passau",
    location: "Passau",
    country: "Germany",
    startDate: "2025-10-01",
    endDate: null,
    current: true,
    expectedGraduation: "September 2027",
    status: "Semester 2",
    grade: null,
    scholarship: "DAAD",
    description:
      "Interdisciplinary programme spanning development economics, governance and empirical research methods, with a focus on how policy interventions are measured and evaluated. Coursework combines quantitative impact evaluation with the political economy of development, building toward a thesis on measuring programme outcomes where baseline data is incomplete.",
    coursework: [],
    awards: [],
  },
  {
    _id: "cv-education-knust",
    qualification: "BA Economics",
    institution: "Kwame Nkrumah University of Science and Technology (KNUST)",
    location: "Kumasi",
    country: "Ghana",
    startDate: "2017-09-01",
    endDate: "2021-11-01",
    current: false,
    expectedGraduation: null,
    status: null,
    grade: "First Class Honours",
    scholarship: "GNPC Foundation Local Scholarship",
    description: null,
    coursework: [
      "Advanced Econometrics",
      "Statistics and Probability",
      "Development Economics",
      "Advanced Calculus I & II",
      "Data Analysis",
      "Research Methodology",
    ],
    awards: ["GNPC Foundation Local Scholarship", "Dean's List 2021 (Top 5%)"],
  },
];

export const seedCvExperience: CvExperience[] = [
  {
    _id: "cv-exp-warc",
    category: "professional",
    role: "Monitoring, Evaluation and Learning Officer",
    organisation: "Warc Consultants LLC",
    location: "Accra, Ghana",
    startDate: "2023-12-01",
    endDate: null,
    current: true,
    highlights: [
      "Spearhead evaluation and reporting for a $1M silo project in Ghana's Upper West region, targeting post-harvest loss reduction and food security through data-driven agricultural policy.",
      "Lead quarterly and milestone reporting on the impact of 20,000+ farmers under the $7M West African Investment Trade Hub fund, \"The New African Farmer — Regenerative Agriculture\", reporting to the Trade Hub, Mastercard and IDH.",
      "Collaborate with Poverty Stoplight (Paraguay) on self-administered surveys assessing poverty levels among farmers in Sierra Leone, enabling targeted socioeconomic strategies.",
      "Work with 60 Decibels and Acumen to evaluate Warc Africa's farmer impact in the Upper West, aligning programmes with the national agricultural development agenda.",
      "Optimise data collection pipelines to close data gaps and raise quality, underpinning development and impact assessments used in policy formulation.",
    ],
  },
  {
    _id: "cv-exp-bapways",
    category: "professional",
    role: "Administrative Assistant & Project Lead",
    organisation: "Bapways Agri Solutions",
    location: "Kumasi, Ghana",
    startDate: "2022-10-01",
    endDate: "2023-11-01",
    current: false,
    highlights: [
      "Analysed key metrics for 1,800 cassava farmers from the Ministry of Agriculture, Ashanti Region, and deployed a Power BI dashboard that cut costs on the cassava growing initiative by 15%.",
      "Led the Kobo Collect server implementation, improving the data collection pipeline by 45% and putting timely data in front of management.",
    ],
  },
  {
    _id: "cv-exp-gra",
    category: "professional",
    role: "Return Processing Officer (National Service)",
    organisation: "Ghana Revenue Authority",
    location: "Kumasi, Ghana",
    startDate: "2021-10-01",
    endDate: "2022-09-01",
    current: false,
    highlights: [
      "Monitored taxpayer ledgers to verify compliance and withholding declarations, reporting discrepancies to enforcement and updating the taxpayer database — a 18% increase in the tax net.",
      "Validated quarterly and yearly financial records through filed account monitoring and desk reviews.",
      "Analysed 2,500 taxpayer data points to identify non-filers and late-filers, contributing to a 25% reduction in non-filers across the 2021 and 2022 assessment years.",
    ],
  },
  {
    _id: "cv-exp-research-findev",
    category: "research",
    role: "Lead Researcher",
    organisation:
      "Quantitative Study on the Impact of Financial Development on Agricultural Sector Growth in Ghana",
    location: null,
    startDate: "2023-10-01",
    endDate: "2023-10-01",
    current: false,
    highlights: [
      "Time series analysis from 1970 to 2017 using a Cobb–Douglas framework and a Vector Error Correction Model, examining financial development proxies — credit, liquid liabilities, domestic credit — against agricultural value-added growth.",
      "Found that monetary sector credit to the private sector had a positive long-run effect on agricultural growth, while the liquid liabilities to GDP ratio and net domestic credit had unexpectedly negative impacts.",
      "Showed inflation, rural population growth, fertiliser usage and temperature change positively influencing output, yielding policy implications for financing, subsidies, youth engagement, mechanisation and crop-specific boards.",
    ],
  },
  {
    _id: "cv-exp-research-precision",
    category: "research",
    role: "Lead Researcher",
    organisation:
      "Enhancing Precision Agriculture through Stack Ensemble ML Modelling",
    location: null,
    startDate: "2023-08-01",
    endDate: "2023-08-01",
    current: false,
    highlights: [
      "Independent research project advancing precision agriculture technique.",
      "Applied stack ensemble regression algorithms to crop recommendation systems in place of conventional single-algorithm approaches, raising predictive accuracy.",
      "Aimed at data-driven practice that improves yields, sustainability and farmer livelihoods.",
    ],
  },
  {
    _id: "cv-exp-research-knust",
    category: "research",
    role: "Research Associate",
    organisation: "Department of Economics, KNUST",
    location: "Kumasi, Ghana",
    startDate: "2021-07-01",
    endDate: "2021-08-01",
    current: false,
    highlights: [
      "Led data collection for the NHIS Ghana research project, implementing questionnaires and methodologies across diverse communities.",
      "Coordinated multiple data collection projects to completion while maintaining data integrity.",
      "Designed survey instruments tailored to varying community contexts, supporting accurate data acquisition.",
    ],
  },
  {
    _id: "cv-exp-teaching-knust",
    category: "teaching",
    role: "Peer Tutor",
    organisation: "Department of Economics, KNUST",
    location: "Kumasi, Ghana",
    startDate: "2018-10-01",
    endDate: "2021-08-01",
    current: false,
    highlights: [
      "Facilitated tutorial sessions for 80 colleagues, tailoring lessons to individual needs — 75 students achieved grades A and B in their final exams.",
      "Mentored 20 students in research data collection, analysis and presentation.",
    ],
  },
];

export const seedCvProjects: CvProject[] = [
  {
    _id: "cv-project-warc-bi",
    title: "Business Intelligence Platform — Warc Group, Ghana & Uganda",
    role: "Analytics Engineer",
    organisation: "Warc Group LLC",
    location: "Ghana & Uganda",
    // Only "2026, ongoing" is confirmed — see note 4 at the top of this file.
    startDate: "2026-01-01",
    endDate: null,
    current: true,
    summary:
      "An enterprise BI platform consolidating six source systems across Ghana and Uganda into one governed Power BI semantic model, built on a Medallion architecture and deployed through Azure DevOps.",
    highlights: [
      "Stood up the ingestion layer on a dedicated AWS EC2 Windows Server: an NSSM-managed SSH tunnel forwarding the Odoo.sh PostgreSQL database to localhost:5433 as a Windows service, the PostgreSQL ODBC driver over it, and the On-Premises Data Gateway on the same instance — the two databases accept no inbound connections, so nothing could be modelled until the route existed and survived a reboot unattended.",
      "Staged Odoo ERP, the Farmer App, Kedebah, Uganda’s AppSheet/Google Sheets operation, Oanda FX rates and Microsoft Graph into six independently scheduled Power BI Dataflows, so a slow ERP extract cannot hold up the mobile app data and a failing source fails alone.",
      "Built the Medallion architecture inside Power Query: Bronze pulls each dataflow untransformed so a source schema change lands in one place, Silver applies type casting, Table.Combine across the three transaction apps and coalesce rules for their conflicting timestamps, and Gold is thin references to Silver — dim_farmers, dim_hubs, dim_products and fct_transactions.",
      "Automated the FX feed with a Power Automate Desktop bot on the same instance, pulling daily and monthly Oanda rates into Dataverse, and read historical Kedebah records held in S3 through Amazon Athena rather than moving them.",
      "Enforced governance in the platform rather than in documentation: Row-Level Security so the Ghana and Uganda teams read only their own rows out of one model, and data and report workspaces separated on a thin-report architecture so backend schema work and report work deploy independently.",
      "Set up promotion across six workspaces through Power BI Deployment Pipelines with an Azure DevOps refresh.yml driving dataflow and semantic model refresh, so no schema change reaches production without passing the pipeline.",
      "Delivered the operational tier — produce inventory, purchase transactions consolidated across both countries, and live exchange rates. Sales consolidation and the sales-input inventory dashboard are in progress, ahead of hub performance, offtaker distribution KPIs and an executive layer.",
    ],
    tools: [
      "Power BI",
      "Power Query (M)",
      "Azure DevOps",
      "AWS EC2 & Athena",
      "PostgreSQL / ODBC",
      "Power Automate Desktop",
    ],
    url: "/work/warc-business-intelligence-platform",
  },
  {
    _id: "cv-project-rice-dialogues",
    title: "Rice Policy Dialogues — Sierra Leone",
    role: "Data Analyst & M&E Consultant",
    organisation:
      "AGRA and the Sierra Leone Rice Observatory, funded by UK FCDO, delivered through Warc Consultants LLC",
    location: "Sierra Leone",
    startDate: "2026-08-01",
    endDate: null,
    current: true,
    summary:
      "A five-phase policy engagement for AGRA and the Sierra Leone Rice Observatory: identify the constraints holding back the rice sector, convene the actors who would have to fix them, and land recommendations with named institutional owners.",
    highlights: [
      "Support the development of the key informant interview and focus group instruments used to validate the six policy bottlenecks surfaced by the desk review, and to surface the constraints widely experienced but never documented.",
      "Contribute to the stakeholder mapping across the value chain and wider policy ecosystem, assessing influence and interest to design a tiered engagement that separates breadth of voice from depth of consultation.",
      "Analyse consultation findings by thematic area, feeding the consolidation of overlapping constraints and the scoring of each issue against a common seven-criterion framework covering impact, breadth, feasibility, private investment, food security and time to results.",
      "Work within a policy landscape spanning the Feed Salone Strategy, the National Rice Development Strategy, ECOWAP and the ECOWAS Rice Offensive, so recommendations sit coherently against national and regional commitments rather than beside them.",
    ],
    tools: [
      "Stakeholder mapping",
      "Key informant interviews",
      "Thematic analysis",
      "Policy prioritisation",
    ],
    url: "/work/rice-policy-dialogues-sierra-leone",
  },
  {
    _id: "cv-project-iwmi-rainfed",
    title:
      "Rainfed Water Management and Climate Risk Study — Upper West, Ghana",
    role: "Data & M&E Supervisor",
    organisation: "IWMI, delivered through Warc Consultants LLC",
    location: "Sissala East & Sissala West, Upper West Region",
    startDate: "2025-01-01",
    endDate: "2025-02-01",
    current: false,
    summary:
      "The Upper West leg of a three-zone study for the USAID Feed the Future Innovation Lab for Irrigation and Mechanization Systems, on the risks smallholders face in rainfed farming and what they already do about them.",
    highlights: [
      "Adapted and pretested IWMI’s draft quantitative and qualitative instruments for the Upper West context, and harmonised them with the teams covering the other two agro-ecological zones so the three datasets could be pooled rather than only filed together.",
      "Programmed the instruments into KoBo Collect in the local languages, trained four enumerators over two days, and ran a community entry and pilot round before live collection to find the questions people would not answer as written.",
      "Supervised 130 household surveys across five communities in Sissala East and Sissala West — twenty-six per community, five above the analysis minimum so records lost to quality checks would not put the sample under.",
      "Ran quality checks daily against the collection protocol and kept the progress dashboard current, so an enumerator drifting from the script was corrected the next morning rather than at the end of the round.",
      "Oversaw key informant interviews and focus group discussions with input dealers, commercial and irrigation farmers, the district agriculture directorate and the environmental protection agency, alongside GPS crop classification inside an IWMI-supplied watershed boundary.",
      "Delivered the cleaned quantitative dataset in STATA with a codebook, the transcribed qualitative material, and initial analysis and reporting. Work ended in February 2025 when USAID cancelled the programme.",
    ],
    tools: [
      "KoBo Collect",
      "STATA",
      "GPS crop classification",
      "Enumerator training",
    ],
    url: "/work/iwmi-rainfed-water-management",
  },
  {
    _id: "cv-project-agra-regulatory",
    title:
      "Assessment of the Business Regulatory Environment for Youth and MSMEs in Ghana",
    role: "Data Analyst & M&E Expert",
    organisation: "AGRA, delivered through Warc Consultants LLC",
    location: "Ghana",
    // Only the year is confirmed — see note 3 at the top of this file.
    startDate: "2024-09-01",
    endDate: "2024-11-01",
    current: false,
    summary:
      "A twelve-week qualitative study of Ghana’s business registration and product certification processes, commissioned to give AGRA evidence for policy advocacy on behalf of youth and small agribusinesses.",
    highlights: [
      "Built the key informant interview and focus group guides so regulators and agripreneurs were put to the same questions, letting the process as written be compared directly against the process as experienced.",
      "Ran transcription and coding alongside fieldwork rather than after it, so gaps in the evidence surfaced while the field team was still in place.",
      "Coded and analysed the full transcript set in MAXQDA against a framework drawn from the material — bureaucratic delay, cost, awareness, gender, accessibility and compliance pressure — and quantified each theme so findings could be reported as a share of respondents.",
      "Established that the barrier is belief rather than price: sole proprietorship registration costs 120 cedis, while respondents described it as unaffordable and assumed registering would trigger an immediate tax bill.",
      "Found 70% of respondents citing bureaucratic delay against a published two-to-five day turnaround, and a gender split in which women dominate processing and packaging but register far less than men.",
      "Wrote up the evidence into the policy document setting out the registration and certification requirements and the reforms the findings support.",
    ],
    tools: [
      "MAXQDA",
      "Key informant interviews",
      "Focus group discussions",
      "Thematic analysis",
    ],
    url: "/work/agra-regulatory-environment-ghana",
  },
  {
    _id: "cv-project-aip",
    title: "Agricultural Intensification Programme (AIP) — Ghana & Sierra Leone",
    role: "M&E Consultant",
    organisation: "Warc Consultants LLC",
    location: "Ghana & Sierra Leone",
    startDate: "2025-01-01",
    endDate: "2026-02-01",
    current: false,
    summary:
      "A two-country programme replacing the farm production displaced by forest restoration, where the yield claim had to be provable farmer by farmer.",
    highlights: [
      "Built one management system covering both countries, holding farmer profiles, plot allocations, plot boundary maps and input distribution in a single record, so a farmer, the land they were given and what they received against it can be read together.",
      "Collected and analysed baseline grower records for enrolled farmers in ODK Collect, including a socio-economic survey and self-reported yields for the three years before the programme on each piece of land.",
      "Designed the crop and boundary mapping survey and automated plot map generation with satellite layers and coordinates, so every plot in the programme traces back to the participant it was assigned to.",
      "Wrote the end-of-year impact assessment methodology, using coarsened exact matching to pair treatment and control farmers on geography, farm size, land type and tenure, crop mix, gender, age band, input use and market access, at 95% confidence and 80% power.",
      "Set the field screening rules and an adaptive sampling protocol for communities where enough matched controls could not be found, so shortfalls are recorded with the bias they introduce rather than quietly dropped.",
    ],
    tools: [
      "ODK Collect",
      "GPS plot mapping",
      "Coarsened exact matching",
    ],
    url: "/work/aip-ghana-sierra-leone",
  },
];

export const seedCvCertifications: CvCertification[] = [
  {
    _id: "cv-cert-acumen",
    title: "Social Impact Analysis",
    category: "professional",
    issuer: "Acumen Academy",
    location: null,
    country: null,
    grade: null,
    date: null,
    inProgress: true,
    url: null,
    order: 1,
  },
  {
    _id: "cv-cert-pcap",
    title: "PCAP: Certified Associate in Python Programming",
    category: "professional",
    issuer: "Python Institute",
    location: null,
    country: null,
    grade: null,
    date: null,
    inProgress: true,
    url: null,
    order: 2,
  },
  {
    _id: "cv-cert-azubi",
    title: "ScaleWork Data Analyst Professional",
    category: "professional",
    issuer: "Azubi Africa",
    location: null,
    country: null,
    grade: null,
    date: "2024-02-01",
    inProgress: false,
    url: null,
    order: 3,
  },
  {
    _id: "cv-cert-google",
    title: "Google Advanced Data Analytics Professional",
    category: "professional",
    issuer: "Google US Scholar, Coursera",
    location: null,
    country: null,
    grade: null,
    date: "2023-12-01",
    inProgress: false,
    url: null,
    order: 4,
  },
  /* ⚠️ Placeholders for shape only — replace with your real certificates. */
  {
    _id: "cv-cert-german-a1",
    title: "German A1 — Goethe-Zertifikat",
    category: "language",
    issuer: "Replace with your school",
    location: "Replace with city",
    country: "Ghana",
    grade: "Replace with grade",
    date: "2025-01-01",
    inProgress: false,
    url: null,
    order: 1,
  },
  {
    _id: "cv-cert-german-a2",
    title: "German A2 — Goethe-Zertifikat",
    category: "language",
    issuer: "Replace with your school",
    location: "Replace with city",
    country: "Germany",
    grade: "Replace with grade",
    date: "2025-06-01",
    inProgress: false,
    url: null,
    order: 2,
  },
];

export const seedCvLanguages: CvLanguage[] = [
  { _id: "cv-lang-en", language: "English", level: "Native speaker", order: 1 },
  { _id: "cv-lang-de", language: "German", level: "In progress — see certificates", order: 2 },
];

export const seedCvSkills: CvSkillGroup[] = [
  {
    _id: "cv-skill-technical",
    label: "Technical",
    items: ["STATA", "Python (advanced)", "SQL", "SAS", "Power BI", "Excel"],
    order: 1,
  },
  {
    _id: "cv-skill-research",
    label: "Research",
    items: [
      "Data collection",
      "Literature review",
      "Analytical thinking",
      "Writing & communication",
    ],
    order: 2,
  },
  {
    _id: "cv-skill-viz",
    label: "Data & visualisation",
    items: ["Data cleaning", "Exploratory data analysis", "Plotly", "Dashboard design"],
    order: 3,
  },
  {
    _id: "cv-skill-pm",
    label: "Project management",
    items: ["Microsoft Teams", "Kanban", "Stakeholder reporting"],
    order: 4,
  },
];
