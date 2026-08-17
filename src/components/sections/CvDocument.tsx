import { Mail, MapPin, Phone } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import {
  educationFacts,
  EXPERIENCE_SECTIONS,
  formatMonth,
  formatRange,
  type Cv,
  type CvCertification,
  type CvEducation,
  type CvExperience,
} from "@/lib/cv";
import { STAGGER } from "@/lib/motion";

/**
 * Section masthead: label on the left, content on the right. The whole CV
 * runs on this one two-column rhythm, which is what lets a dense document
 * stay scannable.
 */
function Section({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "grid gap-y-6 border-t border-border pt-10 lg:grid-cols-[minmax(0,0.28fr)_minmax(0,1fr)] lg:gap-x-14",
        className,
      )}
    >
      <Reveal>
        <h2 className="eyebrow lg:sticky lg:top-28">{label}</h2>
      </Reveal>
      <div>{children}</div>
    </section>
  );
}

/** Shared row chrome: title line left, dates right, detail beneath. */
function Entry({
  title,
  subtitle,
  meta,
  dates,
  children,
  delay = 0,
}: {
  title: string;
  subtitle?: string | null;
  meta?: string | null;
  dates: string;
  children?: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="border-b border-border pb-8 last:border-b-0 last:pb-0">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
        <h3 className="font-display text-[19px] font-medium leading-[1.3] tracking-[-0.015em] text-ink">
          {title}
        </h3>
        {dates ? (
          <p className="shrink-0 font-body text-[11px] uppercase tracking-[0.16em] text-muted">
            {dates}
          </p>
        ) : null}
      </div>

      {subtitle ? (
        <p className="mt-1.5 font-body text-[14px] text-ink">{subtitle}</p>
      ) : null}
      {meta ? <p className="mt-1 font-body text-[13px] text-muted">{meta}</p> : null}

      {children}
    </Reveal>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3.5 text-[14px] leading-[1.8] text-muted">
          <span
            className="mt-[11px] h-1 w-3 shrink-0 rounded-full bg-sand-deep"
            aria-hidden
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Small pill row used for coursework and skills. */
function Tags({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-border-strong px-3 py-1.5 font-body text-[11px] text-ink"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function EducationEntry({ item, delay }: { item: CvEducation; delay: number }) {
  const place = [item.institution, item.location, item.country]
    .filter(Boolean)
    .join(" · ");

  /* Status, scholarship and expected graduation are what make an in-progress
     degree legible — a bare "Oct 2025 — Present" says almost nothing. */
  const facts = educationFacts(item);

  return (
    <Entry
      title={item.qualification}
      subtitle={place}
      dates={formatRange(item.startDate, item.endDate, item.current)}
      delay={delay}
    >
      {facts.length > 0 ? (
        <ul className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2">
          {facts.map((fact) => (
            <li
              key={fact}
              className="rounded-full bg-sand px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.1em] text-ink"
            >
              {fact}
            </li>
          ))}
        </ul>
      ) : null}

      {item.description ? (
        <p className="mt-4 max-w-[62ch] text-[14px] leading-[1.85] text-muted">
          {item.description}
        </p>
      ) : null}

      {item.coursework.length > 0 ? (
        <>
          <p className="mt-6 font-body text-[10px] uppercase tracking-[0.2em] text-muted">
            Coursework
          </p>
          <Tags items={item.coursework} />
        </>
      ) : null}

      {item.awards.length > 0 ? (
        <>
          <p className="mt-6 font-body text-[10px] uppercase tracking-[0.2em] text-muted">
            Awards
          </p>
          <Bullets items={item.awards} />
        </>
      ) : null}
    </Entry>
  );
}

function ExperienceEntry({ item, delay }: { item: CvExperience; delay: number }) {
  return (
    <Entry
      title={item.role}
      subtitle={item.organisation}
      meta={item.location}
      dates={formatRange(item.startDate, item.endDate, item.current)}
      delay={delay}
    >
      <Bullets items={item.highlights} />
    </Entry>
  );
}

function CertificationRow({ item }: { item: CvCertification }) {
  const place = [item.issuer, item.location, item.country].filter(Boolean).join(" · ");
  const when = item.inProgress ? "In progress" : formatMonth(item.date);

  return (
    <li className="flex flex-col gap-1 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
      <div>
        <p className="font-body text-[15px] text-ink">{item.title}</p>
        {place ? (
          <p className="mt-1 font-body text-[13px] text-muted">{place}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-baseline gap-4">
        {item.grade ? (
          <span className="rounded-full bg-sand px-3 py-1 font-body text-[11px] uppercase tracking-[0.1em] text-ink">
            {item.grade}
          </span>
        ) : null}
        {when ? (
          <span className="font-body text-[11px] uppercase tracking-[0.16em] text-muted">
            {when}
          </span>
        ) : null}
      </div>
    </li>
  );
}

export function CvDocument({ cv }: { cv: Cv }) {
  const { profile } = cv;
  const professionalCerts = cv.certifications.filter((c) => c.category !== "language");
  const languageCerts = cv.certifications.filter((c) => c.category === "language");

  return (
    <div className="space-y-14 lg:space-y-16">
      {/* Header */}
      <header>
        <Reveal>
          <h1 className="font-display text-[clamp(40px,6.4vw,76px)] font-light leading-[0.98] tracking-[-0.035em] text-ink">
            {profile.fullName}
          </h1>
        </Reveal>
        {profile.headline ? (
          <Reveal delay={0.06}>
            <p className="mt-4 font-body text-[15px] text-ink">{profile.headline}</p>
          </Reveal>
        ) : null}

        <Reveal delay={0.12}>
          <ul className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 font-body text-[13px] text-muted">
            {profile.location ? (
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                {profile.location}
              </li>
            ) : null}
            {profile.email ? (
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                <a
                  href={`mailto:${profile.email}`}
                  className="underline-offset-4 hover:text-ink hover:underline"
                >
                  {profile.email}
                </a>
              </li>
            ) : null}
            {profile.phone ? (
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                  className="underline-offset-4 hover:text-ink hover:underline"
                >
                  {profile.phone}
                </a>
              </li>
            ) : null}
            {profile.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline-offset-4 hover:text-ink hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
            {profile.nationality ? <li>{profile.nationality}</li> : null}
          </ul>
        </Reveal>

        {profile.summary ? (
          <Reveal delay={0.18}>
            <p className="mt-9 max-w-[68ch] text-[15px] leading-[1.85] text-muted">
              {profile.summary}
            </p>
          </Reveal>
        ) : null}
      </header>

      {cv.education.length > 0 ? (
        <Section label="Education">
          <div className="space-y-8">
            {cv.education.map((item, index) => (
              <EducationEntry key={item._id} item={item} delay={index * STAGGER} />
            ))}
          </div>
        </Section>
      ) : null}

      {EXPERIENCE_SECTIONS.map(({ category, label }) => {
        const items = cv.experience.filter((item) => item.category === category);
        if (items.length === 0) return null;
        return (
          <Section key={category} label={label}>
            <div className="space-y-8">
              {items.map((item, index) => (
                <ExperienceEntry key={item._id} item={item} delay={index * STAGGER} />
              ))}
            </div>
          </Section>
        );
      })}

      {professionalCerts.length > 0 ? (
        <Section label="Certification">
          <ul>
            {professionalCerts.map((item) => (
              <CertificationRow key={item._id} item={item} />
            ))}
          </ul>
        </Section>
      ) : null}

      {(cv.languages.length > 0 || languageCerts.length > 0) && (
        <Section label="Languages">
          {cv.languages.length > 0 ? (
            <ul className="flex flex-wrap gap-x-10 gap-y-4">
              {cv.languages.map((item) => (
                <li key={item._id}>
                  <p className="font-body text-[15px] text-ink">{item.language}</p>
                  {item.level ? (
                    <p className="mt-1 font-body text-[13px] text-muted">{item.level}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          {languageCerts.length > 0 ? (
            <ul className={cn(cv.languages.length > 0 && "mt-8 border-t border-border")}>
              {languageCerts.map((item) => (
                <CertificationRow key={item._id} item={item} />
              ))}
            </ul>
          ) : null}
        </Section>
      )}

      {cv.skills.length > 0 ? (
        <Section label="Skills">
          <div className="space-y-8">
            {cv.skills.map((group, index) => (
              <Reveal key={group._id} delay={index * STAGGER}>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted">
                  {group.label}
                </p>
                <Tags items={group.items} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
