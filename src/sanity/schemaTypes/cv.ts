import {
  CaseIcon,
  DocumentIcon,
  EarthGlobeIcon,
  StarIcon,
  UserIcon,
} from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The CV is modelled as six document types rather than one big blob, so each
 * kind of entry gets fields that actually fit it — an education entry needs a
 * scholarship and a coursework list, a job needs bullet highlights, and a
 * language certificate needs a grade and an issuing school.
 *
 * Everything is sorted newest-first from `startDate`, which is why that field
 * is required on anything that appears on a timeline.
 */

/** Header block: the one singleton. */
export const cvProfile = defineType({
  name: "cvProfile",
  title: "CV profile",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "fullName",
      title: "Full name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      description: 'Sits under the name, e.g. "Development economist & M&E specialist"',
      type: "string",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      description: "Two or three sentences. Appears at the top of the CV and in the PDF.",
      type: "text",
      rows: 4,
    }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({
      name: "location",
      title: "Location",
      description: 'Where you are now, e.g. "Passau, Germany"',
      type: "string",
    }),
    defineField({ name: "nationality", title: "Nationality", type: "string" }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "cvLink",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "fullName", subtitle: "headline" },
    prepare: ({ title, subtitle }) => ({ title: title ?? "CV profile", subtitle }),
  },
});

export const cvEducation = defineType({
  name: "cvEducation",
  title: "CV — education",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "qualification",
      title: "Qualification",
      description: 'e.g. "MA Development Studies"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "location", title: "City", type: "string" }),
    defineField({ name: "country", title: "Country", type: "string" }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End date",
      description: "Leave empty if in progress.",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
    }),
    defineField({
      name: "current",
      title: "Currently studying",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "expectedGraduation",
      title: "Expected graduation",
      description: 'Shown when still in progress, e.g. "September 2027"',
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      description: 'Where you are in the programme, e.g. "Semester 2"',
      type: "string",
    }),
    defineField({
      name: "grade",
      title: "Grade / classification",
      description: 'e.g. "First Class Honours"',
      type: "string",
    }),
    defineField({
      name: "scholarship",
      title: "Scholarship",
      description: 'e.g. "DAAD"',
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "What the programme covers, and what you are working on.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "coursework",
      title: "Coursework",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "awards",
      title: "Awards",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  orderings: [
    {
      name: "recent",
      title: "Most recent first",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "qualification", subtitle: "institution" },
  },
});

export const cvExperience = defineType({
  name: "cvExperience",
  title: "CV — experience",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "category",
      title: "Category",
      description: "Which CV section this belongs under.",
      type: "string",
      options: {
        list: [
          { title: "Professional", value: "professional" },
          { title: "Research", value: "research" },
          { title: "Teaching", value: "teaching" },
        ],
        layout: "radio",
      },
      initialValue: "professional",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "organisation",
      title: "Organisation",
      description: "For research entries this can be the project title.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End date",
      description: "Leave empty if this is ongoing.",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
    }),
    defineField({
      name: "current",
      title: "Current",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      description: "One achievement per entry. Lead with the outcome where you can.",
      type: "array",
      of: [{ type: "text", rows: 3 }],
    }),
  ],
  orderings: [
    {
      name: "recent",
      title: "Most recent first",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "role", subtitle: "organisation", category: "category" },
    prepare: ({ title, subtitle, category }) => ({
      title,
      subtitle: [category, subtitle].filter(Boolean).join(" · "),
    }),
  },
});

export const cvCertification = defineType({
  name: "cvCertification",
  title: "CV — certification",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Professional", value: "professional" },
          { title: "Language", value: "language" },
        ],
        layout: "radio",
      },
      initialValue: "professional",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "issuer",
      title: "Issuer / school",
      type: "string",
    }),
    defineField({ name: "location", title: "City", type: "string" }),
    defineField({ name: "country", title: "Country", type: "string" }),
    defineField({
      name: "grade",
      title: "Grade",
      description: 'e.g. "B2 — 87%" or "Sehr gut"',
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Date awarded",
      description: "Leave empty if still in progress.",
      type: "date",
      options: { dateFormat: "MMMM YYYY" },
    }),
    defineField({
      name: "inProgress",
      title: "In progress",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "url", title: "Credential URL", type: "url" }),
    defineField({
      name: "order",
      title: "Order",
      description: "Only used to break ties between entries with the same date.",
      type: "number",
      initialValue: 1,
    }),
  ],
  orderings: [
    { name: "recent", title: "Most recent first", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "issuer", grade: "grade" },
    prepare: ({ title, subtitle, grade }) => ({
      title,
      subtitle: [subtitle, grade].filter(Boolean).join(" · "),
    }),
  },
});

export const cvLanguage = defineType({
  name: "cvLanguage",
  title: "CV — language",
  type: "document",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "level",
      title: "Level",
      description: 'e.g. "Native speaker" or "B1 (CEFR)"',
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.required().integer().min(1),
    }),
  ],
  orderings: [
    { name: "order", title: "Order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "language", subtitle: "level" } },
});

export const cvSkillGroup = defineType({
  name: "cvSkillGroup",
  title: "CV — skill group",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      description: 'e.g. "Technical", "Research", "Data visualisation"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.required().integer().min(1),
    }),
  ],
  orderings: [
    { name: "order", title: "Order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "label", items: "items" },
    prepare: ({ title, items }) => ({
      title,
      subtitle: Array.isArray(items) ? items.slice(0, 4).join(", ") : undefined,
    }),
  },
});
