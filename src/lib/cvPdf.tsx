import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import {
  educationFacts,
  EXPERIENCE_SECTIONS,
  formatMonth,
  formatRange,
  type Cv,
  type CvCertification,
  type CvProject,
} from "@/lib/cv";

/**
 * The PDF layout.
 *
 * This is a second implementation of the CV design — @react-pdf/renderer has
 * its own primitives and no CSS, so nothing from the web page carries over.
 * The two are kept in step by sharing the data loader and the date
 * formatters in src/lib/cv.ts; a change to the *design* has to be made here
 * as well as in CvDocument.tsx.
 *
 * Typeface is Helvetica, one of the fourteen fonts every PDF reader has
 * built in. Registering Inter would mean fetching font files at render time,
 * which can fail in a serverless function and would leave the download
 * broken rather than merely off-brand.
 *
 * The body is white rather than the site's warm paper: a CV gets printed,
 * and a full-bleed background colour wastes ink on somebody else's printer.
 * The brand shows in the ink-teal rules and sand highlights instead.
 */

const INK = "#053D3A";
const SAND = "#FFE2B8";
const SAND_DEEP = "#F0C177";
const MUTED = "#4C6360";
const BORDER = "#E4D8C6";

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 54,
    paddingHorizontal: 46,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.5,
    color: MUTED,
    backgroundColor: "#FFFFFF",
  },

  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    // Without this the line box is tight to the cap height, and the
    // descender of a "y" or "g" runs into whatever sits underneath.
    lineHeight: 1.2,
    letterSpacing: -0.6,
    color: INK,
  },
  headline: { marginTop: 8, fontSize: 10.5, color: INK },
  contactRow: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 8.5,
    color: MUTED,
  },
  contactItem: { marginRight: 12, marginBottom: 3 },
  link: { color: INK, textDecoration: "none" },
  summary: { marginTop: 14, fontSize: 9.5, lineHeight: 1.6, color: MUTED },

  rule: { marginTop: 18, height: 2, backgroundColor: INK },

  section: { marginTop: 18 },
  sectionLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.6,
    color: INK,
    textTransform: "uppercase",
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    borderBottomStyle: "solid",
  },

  entry: { marginTop: 11 },
  entryHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: INK,
    flex: 1,
    paddingRight: 12,
  },
  entryDates: { fontSize: 8, color: MUTED, letterSpacing: 0.6 },
  entrySubtitle: { marginTop: 2, fontSize: 9.5, color: INK },
  entryMeta: { marginTop: 1, fontSize: 8.5, color: MUTED },

  factRow: { marginTop: 6, flexDirection: "row", flexWrap: "wrap" },
  fact: {
    marginRight: 5,
    marginBottom: 4,
    paddingVertical: 2.5,
    paddingHorizontal: 6,
    backgroundColor: SAND,
    color: INK,
    fontSize: 7.5,
    letterSpacing: 0.4,
  },

  bullets: { marginTop: 5 },
  bulletRow: { flexDirection: "row", marginBottom: 3 },
  bulletMark: {
    width: 7,
    marginTop: 5,
    marginRight: 7,
    height: 1.6,
    backgroundColor: SAND_DEEP,
  },
  bulletText: { flex: 1, fontSize: 9, lineHeight: 1.55, color: MUTED },

  description: { marginTop: 6, fontSize: 9, lineHeight: 1.6, color: MUTED },

  smallLabel: {
    marginTop: 8,
    fontSize: 7.5,
    letterSpacing: 1.4,
    color: MUTED,
    textTransform: "uppercase",
  },
  tagRow: { marginTop: 4, flexDirection: "row", flexWrap: "wrap" },
  tag: {
    marginRight: 4,
    marginBottom: 4,
    paddingVertical: 2.5,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: "solid",
    color: INK,
    fontSize: 7.5,
  },

  certRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    borderBottomStyle: "solid",
  },
  certRight: { flexDirection: "row", alignItems: "center" },

  langRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  langItem: { marginRight: 28, marginBottom: 6 },

  footer: {
    position: "absolute",
    bottom: 26,
    left: 46,
    right: 46,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: MUTED,
  },
});

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.bullets}>
      {items.map((item, index) => (
        <View key={index} style={styles.bulletRow} wrap={false}>
          <View style={styles.bulletMark} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function Tags({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.tagRow}>
      {items.map((item) => (
        <Text key={item} style={styles.tag}>
          {item}
        </Text>
      ))}
    </View>
  );
}

/**
 * A project entry. Same furniture as a job, with the summary line and the
 * tools row a job does not have.
 */
function ProjectEntry({ item }: { item: CvProject }) {
  const place = [item.organisation, item.location].filter(Boolean).join(" · ");

  return (
    <View style={styles.entry}>
      <View style={styles.entryHead} wrap={false}>
        <Text style={styles.entryTitle}>{item.role}</Text>
        <Text style={styles.entryDates}>
          {formatRange(item.startDate, item.endDate, item.current)}
        </Text>
      </View>
      <Text style={styles.entrySubtitle}>{item.title}</Text>
      {place ? <Text style={styles.entryMeta}>{place}</Text> : null}
      {item.summary ? (
        <Text style={styles.description}>{item.summary}</Text>
      ) : null}
      <Bullets items={item.highlights} />
      <Tags items={item.tools} />
    </View>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function CertRow({ item }: { item: CvCertification }) {
  const place = [item.issuer, item.location, item.country].filter(Boolean).join(" · ");
  const when = item.inProgress ? "In progress" : formatMonth(item.date);

  return (
    <View style={styles.certRow} wrap={false}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 9.5, color: INK }}>{item.title}</Text>
        {place ? <Text style={styles.entryMeta}>{place}</Text> : null}
      </View>
      <View style={styles.certRight}>
        {item.grade ? <Text style={styles.fact}>{item.grade}</Text> : null}
        {when ? <Text style={styles.entryDates}>{when}</Text> : null}
      </View>
    </View>
  );
}

export function CvPdf({ cv }: { cv: Cv }) {
  const { profile } = cv;
  const professionalCerts = cv.certifications.filter((c) => c.category !== "language");
  const languageCerts = cv.certifications.filter((c) => c.category === "language");

  return (
    <Document
      title={`${profile.fullName} — CV`}
      author={profile.fullName}
      subject={profile.headline}
      creator="snyamson.com"
      producer="snyamson.com"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View>
          <Text style={styles.name}>{profile.fullName}</Text>
          {profile.headline ? (
            <Text style={styles.headline}>{profile.headline}</Text>
          ) : null}

          <View style={styles.contactRow}>
            {profile.location ? (
              <Text style={styles.contactItem}>{profile.location}</Text>
            ) : null}
            {profile.email ? (
              <Link src={`mailto:${profile.email}`} style={styles.contactItem}>
                <Text style={styles.link}>{profile.email}</Text>
              </Link>
            ) : null}
            {profile.phone ? (
              <Text style={styles.contactItem}>{profile.phone}</Text>
            ) : null}
            {profile.links.map((link) => (
              <Link key={link.url} src={link.url} style={styles.contactItem}>
                <Text style={styles.link}>{link.label}</Text>
              </Link>
            ))}
            {profile.nationality ? (
              <Text style={styles.contactItem}>{profile.nationality}</Text>
            ) : null}
          </View>

          {profile.summary ? (
            <Text style={styles.summary}>{profile.summary}</Text>
          ) : null}

          <View style={styles.rule} />
        </View>

        {/* Education */}
        {cv.education.length > 0 ? (
          <Section label="Education">
            {cv.education.map((item) => {
              const place = [item.institution, item.location, item.country]
                .filter(Boolean)
                .join(" · ");
              const facts = educationFacts(item);

              return (
                <View key={item._id} style={styles.entry} wrap={false}>
                  <View style={styles.entryHead}>
                    <Text style={styles.entryTitle}>{item.qualification}</Text>
                    <Text style={styles.entryDates}>
                      {formatRange(item.startDate, item.endDate, item.current)}
                    </Text>
                  </View>
                  <Text style={styles.entrySubtitle}>{place}</Text>

                  {facts.length > 0 ? (
                    <View style={styles.factRow}>
                      {facts.map((fact) => (
                        <Text key={fact} style={styles.fact}>
                          {fact}
                        </Text>
                      ))}
                    </View>
                  ) : null}

                  {item.description ? (
                    <Text style={styles.description}>{item.description}</Text>
                  ) : null}

                  {item.coursework.length > 0 ? (
                    <>
                      <Text style={styles.smallLabel}>Coursework</Text>
                      <Tags items={item.coursework} />
                    </>
                  ) : null}

                  {item.awards.length > 0 ? (
                    <>
                      <Text style={styles.smallLabel}>Awards</Text>
                      <Bullets items={item.awards} />
                    </>
                  ) : null}
                </View>
              );
            })}
          </Section>
        ) : null}

        {/* Experience, grouped */}
        {EXPERIENCE_SECTIONS.map(({ category, label }) => {
          const items = cv.experience.filter((item) => item.category === category);
          if (items.length === 0) return null;
          return (
            <Section key={category} label={label}>
              {items.map((item) => (
                <View key={item._id} style={styles.entry}>
                  <View style={styles.entryHead} wrap={false}>
                    <Text style={styles.entryTitle}>{item.role}</Text>
                    <Text style={styles.entryDates}>
                      {formatRange(item.startDate, item.endDate, item.current)}
                    </Text>
                  </View>
                  <Text style={styles.entrySubtitle}>{item.organisation}</Text>
                  {item.location ? (
                    <Text style={styles.entryMeta}>{item.location}</Text>
                  ) : null}
                  <Bullets items={item.highlights} />
                </View>
              ))}
            </Section>
          );
        })}

        {/* Selected projects */}
        {cv.projects.length > 0 ? (
          <Section label="Selected projects">
            {cv.projects.map((item) => (
              <ProjectEntry key={item._id} item={item} />
            ))}
          </Section>
        ) : null}

        {/* Certification */}
        {professionalCerts.length > 0 ? (
          <Section label="Certification">
            {professionalCerts.map((item) => (
              <CertRow key={item._id} item={item} />
            ))}
          </Section>
        ) : null}

        {/* Languages */}
        {cv.languages.length > 0 || languageCerts.length > 0 ? (
          <Section label="Languages">
            {cv.languages.length > 0 ? (
              <View style={styles.langRow}>
                {cv.languages.map((item) => (
                  <View key={item._id} style={styles.langItem}>
                    <Text style={{ fontSize: 9.5, color: INK }}>{item.language}</Text>
                    {item.level ? (
                      <Text style={styles.entryMeta}>{item.level}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            ) : null}
            {languageCerts.map((item) => (
              <CertRow key={item._id} item={item} />
            ))}
          </Section>
        ) : null}

        {/* Skills */}
        {cv.skills.length > 0 ? (
          <Section label="Skills">
            {cv.skills.map((group) => (
              <View key={group._id} wrap={false}>
                <Text style={styles.smallLabel}>{group.label}</Text>
                <Tags items={group.items} />
              </View>
            ))}
          </Section>
        ) : null}

        <View style={styles.footer} fixed>
          <Text>{profile.fullName}</Text>
          <Text
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
