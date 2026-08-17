import { HomeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const ctaFields = [
  defineField({ name: "label", title: "Label", type: "string" }),
  defineField({ name: "href", title: "Href", type: "string" }),
];

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "greeting",
      title: "Greeting",
      description: 'The oversized display word, e.g. "Hello". One word reads best.',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      description: 'The dashed line under the greeting, e.g. "It’s Solomon — an analytics engineer"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "railLabel",
      title: "Rail label",
      description: "Rotated label running up the left edge of the hero.",
      type: "string",
    }),
    defineField({
      name: "stats",
      title: "Stats",
      description: "The figures above the greeting. Two or three work best.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              description: 'Shown large, e.g. "+40"',
              type: "string",
            }),
            defineField({
              name: "label",
              title: "Label",
              description: 'Shown small underneath, e.g. "Indicators modelled"',
              type: "string",
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "object",
      fields: ctaFields,
      options: { columns: 2 },
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "object",
      fields: ctaFields,
      options: { columns: 2 },
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      description:
        "Upload the version rendered on a warm-paper backdrop, then set treatment=\"plain\" on <HeroPortrait /> — see README-DESIGN.md.",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
  ],
  preview: {
    select: { title: "greeting", subtitle: "tagline" },
  },
});
