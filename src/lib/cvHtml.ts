import { escapeHtml } from "@/lib/email/templates";
import {
  educationFacts,
  EXPERIENCE_SECTIONS,
  formatMonth,
  formatRange,
  type Cv,
  type CvCertification,
} from "@/lib/cv";

/**
 * A single self-contained HTML file of the CV.
 *
 * Everything is inlined — no stylesheet link, no webfont, no image — so the
 * file works from a USB stick, an email attachment, or a machine with no
 * network. That constraint is why this is hand-written rather than a render
 * of the React page: the page depends on a built stylesheet that would not
 * travel with the download.
 *
 * All interpolated values are escaped. CV content is authored by one trusted
 * person, but this file gets emailed to strangers and is not the place to be
 * relaxed about it.
 */

const INK = "#053D3A";
const SAND = "#FFE2B8";
const SAND_DEEP = "#F0C177";
const PAPER = "#FDF7EE";
const MUTED = "#4C6360";
const BORDER = "#E4D8C6";
const BORDER_STRONG = "#CBBCA4";

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const e = escapeHtml;

function bullets(items: string[]): string {
  if (items.length === 0) return "";
  return `<ul class="bullets">${items
    .map((item) => `<li>${e(item)}</li>`)
    .join("")}</ul>`;
}

function tags(items: string[]): string {
  if (items.length === 0) return "";
  return `<ul class="tags">${items.map((item) => `<li>${e(item)}</li>`).join("")}</ul>`;
}

function section(label: string, body: string): string {
  if (!body.trim()) return "";
  return `<section class="section">
    <h2>${e(label)}</h2>
    <div class="section-body">${body}</div>
  </section>`;
}

function certRow(item: CvCertification): string {
  const place = [item.issuer, item.location, item.country].filter(Boolean).join(" · ");
  const when = item.inProgress ? "In progress" : formatMonth(item.date);
  return `<li class="cert">
    <div>
      <p class="cert-title">${e(item.title)}</p>
      ${place ? `<p class="meta">${e(place)}</p>` : ""}
    </div>
    <div class="cert-right">
      ${item.grade ? `<span class="fact">${e(item.grade)}</span>` : ""}
      ${when ? `<span class="dates">${e(when)}</span>` : ""}
    </div>
  </li>`;
}

export function cvToHtml(cv: Cv): string {
  const { profile } = cv;
  const professionalCerts = cv.certifications.filter((c) => c.category !== "language");
  const languageCerts = cv.certifications.filter((c) => c.category === "language");

  const contact = [
    profile.location ? e(profile.location) : null,
    profile.email
      ? `<a href="mailto:${e(profile.email)}">${e(profile.email)}</a>`
      : null,
    profile.phone ? e(profile.phone) : null,
    ...profile.links.map(
      (link) =>
        `<a href="${e(link.url)}" target="_blank" rel="noreferrer noopener">${e(link.label)}</a>`,
    ),
    profile.nationality ? e(profile.nationality) : null,
  ]
    .filter(Boolean)
    .join('<span class="sep">·</span>');

  const education = cv.education
    .map((item) => {
      const place = [item.institution, item.location, item.country]
        .filter(Boolean)
        .join(" · ");
      const facts = educationFacts(item);

      return `<article class="entry">
        <div class="entry-head">
          <h3>${e(item.qualification)}</h3>
          <span class="dates">${e(formatRange(item.startDate, item.endDate, item.current))}</span>
        </div>
        <p class="subtitle">${e(place)}</p>
        ${
          facts.length > 0
            ? `<ul class="facts">${facts.map((f) => `<li>${e(f)}</li>`).join("")}</ul>`
            : ""
        }
        ${item.description ? `<p class="body">${e(item.description)}</p>` : ""}
        ${item.coursework.length > 0 ? `<p class="small-label">Coursework</p>${tags(item.coursework)}` : ""}
        ${item.awards.length > 0 ? `<p class="small-label">Awards</p>${bullets(item.awards)}` : ""}
      </article>`;
    })
    .join("");

  const experienceSections = EXPERIENCE_SECTIONS.map(({ category, label }) => {
    const items = cv.experience.filter((item) => item.category === category);
    if (items.length === 0) return "";
    return section(
      label,
      items
        .map(
          (item) => `<article class="entry">
            <div class="entry-head">
              <h3>${e(item.role)}</h3>
              <span class="dates">${e(formatRange(item.startDate, item.endDate, item.current))}</span>
            </div>
            <p class="subtitle">${e(item.organisation)}</p>
            ${item.location ? `<p class="meta">${e(item.location)}</p>` : ""}
            ${bullets(item.highlights)}
          </article>`,
        )
        .join(""),
    );
  }).join("");

  const languages = `${
    cv.languages.length > 0
      ? `<ul class="langs">${cv.languages
          .map(
            (item) =>
              `<li><p class="cert-title">${e(item.language)}</p>${
                item.level ? `<p class="meta">${e(item.level)}</p>` : ""
              }</li>`,
          )
          .join("")}</ul>`
      : ""
  }${
    languageCerts.length > 0
      ? `<ul class="certs">${languageCerts.map(certRow).join("")}</ul>`
      : ""
  }`;

  const skills = cv.skills
    .map(
      (group) =>
        `<div class="skill-group"><p class="small-label">${e(group.label)}</p>${tags(group.items)}</div>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${e(profile.fullName)} — CV</title>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; background: ${PAPER}; color: ${MUTED};
    font-family: ${FONT}; font-size: 15px; line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }
  .sheet { max-width: 860px; margin: 0 auto; padding: 56px 32px 80px; }
  h1, h2, h3 { color: ${INK}; margin: 0; }
  a { color: ${INK}; text-decoration: none; border-bottom: 1px solid ${BORDER_STRONG}; }
  p { margin: 0; }

  h1 { font-size: 46px; font-weight: 300; letter-spacing: -1.4px; line-height: 1; }
  .headline { margin-top: 14px; color: ${INK}; font-size: 15px; }
  .contact { margin-top: 22px; font-size: 13px; }
  .sep { padding: 0 10px; color: ${BORDER_STRONG}; }
  .summary { margin-top: 26px; max-width: 68ch; }

  .section { margin-top: 44px; border-top: 1px solid ${BORDER}; padding-top: 28px; }
  .section h2 {
    font-size: 11px; font-weight: 600; letter-spacing: 2.4px;
    text-transform: uppercase; margin-bottom: 22px;
  }

  .entry { padding-bottom: 26px; border-bottom: 1px solid ${BORDER}; margin-bottom: 26px; }
  .entry:last-child { border-bottom: 0; margin-bottom: 0; padding-bottom: 0; }
  .entry-head { display: flex; justify-content: space-between; align-items: baseline; gap: 24px; }
  .entry h3 { font-size: 19px; font-weight: 500; letter-spacing: -0.3px; line-height: 1.3; }
  .dates { flex: none; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: ${MUTED}; }
  .subtitle { margin-top: 6px; color: ${INK}; font-size: 14px; }
  .meta { margin-top: 3px; font-size: 13px; color: ${MUTED}; }
  .body { margin-top: 14px; max-width: 62ch; font-size: 14px; }

  ul { margin: 0; padding: 0; list-style: none; }
  .facts { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px; }
  .facts li {
    background: ${SAND}; color: ${INK}; border-radius: 999px;
    padding: 5px 12px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
  }
  .tags { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; }
  .tags li { border: 1px solid ${BORDER_STRONG}; border-radius: 999px; padding: 5px 12px; font-size: 11px; color: ${INK}; }
  .bullets { margin-top: 14px; }
  .bullets li { position: relative; padding-left: 26px; margin-bottom: 9px; font-size: 14px; }
  .bullets li::before {
    content: ""; position: absolute; left: 0; top: 11px;
    width: 12px; height: 3px; border-radius: 999px; background: ${SAND_DEEP};
  }
  .small-label { margin-top: 20px; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED}; }

  .certs li.cert, .cert {
    display: flex; justify-content: space-between; align-items: baseline; gap: 24px;
    padding: 14px 0; border-bottom: 1px solid ${BORDER};
  }
  .cert:last-child { border-bottom: 0; }
  .cert-title { color: ${INK}; font-size: 15px; }
  .cert-right { display: flex; align-items: baseline; gap: 14px; flex: none; }
  .fact { background: ${SAND}; color: ${INK}; border-radius: 999px; padding: 4px 11px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
  .langs { display: flex; flex-wrap: wrap; gap: 12px 44px; margin-bottom: 22px; }
  .skill-group + .skill-group { margin-top: 22px; }

  /* Printing this file should also produce something sane. */
  @page { size: A4; margin: 16mm; }
  @media print {
    body { background: #fff; font-size: 10.5pt; }
    .sheet { padding: 0; max-width: none; }
    .entry, .cert { break-inside: avoid; }
    .section { break-inside: auto; }
    h1 { font-size: 28pt; }
  }
</style>
</head>
<body>
<main class="sheet">
  <header>
    <h1>${e(profile.fullName)}</h1>
    ${profile.headline ? `<p class="headline">${e(profile.headline)}</p>` : ""}
    ${contact ? `<p class="contact">${contact}</p>` : ""}
    ${profile.summary ? `<p class="summary">${e(profile.summary)}</p>` : ""}
  </header>

  ${section("Education", education)}
  ${experienceSections}
  ${
    professionalCerts.length > 0
      ? section(
          "Certification",
          `<ul class="certs">${professionalCerts.map(certRow).join("")}</ul>`,
        )
      : ""
  }
  ${section("Languages", languages)}
  ${section("Skills", skills)}
</main>
</body>
</html>`;
}
