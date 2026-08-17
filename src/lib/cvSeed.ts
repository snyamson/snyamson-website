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
 */
import type {
  CvCertification,
  CvEducation,
  CvExperience,
  CvLanguage,
  CvProfile,
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
