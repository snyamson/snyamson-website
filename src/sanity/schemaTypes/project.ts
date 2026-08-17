import { ImagesIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/** Body copy: headings and lists, no nested images — the gallery owns those. */
const richText = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Heading", value: "h3" },
    ],
    lists: [{ title: "Bullet", value: "bullet" }],
    marks: {
      decorators: [
        { title: "Bold", value: "strong" },
        { title: "Italic", value: "em" },
      ],
      annotations: [
        defineArrayMember({
          name: "link",
          type: "object",
          title: "Link",
          fields: [defineField({ name: "href", type: "url", title: "URL" })],
        }),
      ],
    },
  }),
];

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: ImagesIcon,
  groups: [
    { name: "card", title: "Card", default: true },
    { name: "facts", title: "Facts" },
    { name: "story", title: "Story" },
    { name: "media", title: "Media" },
  ],
  fields: [
    /* ---- Card: what shows in the four-up grid ---- */
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "card",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "The URL for this project's page, e.g. /work/cash-transfer-monitoring",
      type: "slug",
      group: "card",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: 'First half of the meta line, e.g. "Programme dashboard"',
      type: "string",
      group: "card",
    }),
    defineField({
      name: "discipline",
      title: "Discipline",
      description: 'Second half of the meta line, e.g. "Analytics engineering"',
      type: "string",
      group: "card",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      description: "Shown on the home page card. 4:3 works best.",
      type: "image",
      group: "card",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "order",
      title: "Order",
      description:
        "Only breaks ties between projects sharing a Year. The home page shows the four most recent by Year, so set Year to control what appears there.",
      type: "number",
      group: "card",
      validation: (rule) => rule.required().integer().min(1),
    }),

    /* ---- Facts: the meta strip on the detail page ---- */
    defineField({
      name: "client",
      title: "Client",
      description: 'Leave blank or write "Confidential" where you cannot name them.',
      type: "string",
      group: "facts",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      group: "facts",
    }),
    defineField({
      name: "role",
      title: "Role",
      description: 'e.g. "Analytics engineer, lead"',
      type: "string",
      group: "facts",
    }),
    defineField({
      name: "duration",
      title: "Duration",
      description: 'e.g. "6 months"',
      type: "string",
      group: "facts",
    }),
    defineField({
      name: "tools",
      title: "Tools",
      description: "Stack and platforms used. Rendered as small pills.",
      type: "array",
      group: "facts",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "url",
      title: "External link",
      description: "Live dashboard, repository or published report, if there is one.",
      type: "url",
      group: "facts",
    }),

    /* ---- Story ---- */
    defineField({
      name: "summary",
      title: "Summary",
      description: "One or two sentences. Also used as the page's meta description.",
      type: "text",
      rows: 3,
      group: "story",
    }),
    defineField({
      name: "challenge",
      title: "The challenge",
      description: "What was broken, and what it was costing them.",
      type: "array",
      group: "story",
      of: richText,
    }),
    defineField({
      name: "approach",
      title: "The approach",
      description: "What you actually built, and the reasoning behind it.",
      type: "array",
      group: "story",
      of: richText,
    }),
    defineField({
      name: "outcome",
      title: "The outcome",
      description: "What changed once it was in place.",
      type: "array",
      group: "story",
      of: richText,
    }),
    defineField({
      name: "results",
      title: "Result metrics",
      description:
        "The two or three numbers worth pulling out. These do more to win work than any paragraph.",
      type: "array",
      group: "story",
      of: [
        defineArrayMember({
          type: "object",
          name: "result",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              description: 'Shown large, e.g. "9 days → 1"',
              type: "string",
            }),
            defineField({
              name: "label",
              title: "Label",
              description: 'Shown small underneath, e.g. "Donor reporting cycle"',
              type: "string",
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),

    /* ---- Media ---- */
    defineField({
      name: "heroImage",
      title: "Hero image",
      description: "Wide banner at the top of the project page. Falls back to the thumbnail.",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      description: "Screens, diagrams and outputs, shown between the story sections.",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  orderings: [
    { name: "order", title: "Order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: {
      title: "title",
      media: "thumbnail",
      category: "category",
      year: "year",
    },
    prepare: ({ title, media, category, year }) => ({
      title,
      subtitle: [year, category].filter(Boolean).join(" · "),
      media,
    }),
  },
});
