import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "logoText",
      title: "Logo text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "address", title: "Address", type: "string" }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "GitHub", value: "github" },
                  { title: "X / Twitter", value: "twitter" },
                  { title: "Facebook", value: "facebook" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Medium", value: "medium" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "navLinks",
      title: "Navigation links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "navLink",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "ctaLabel",
      title: "Header CTA label",
      description: 'The underlined link at the top right, e.g. "Book A Call"',
      type: "string",
    }),
    defineField({ name: "ctaHref", title: "Header CTA href", type: "string" }),
    defineField({ name: "footerBlurb", title: "Footer blurb", type: "text", rows: 4 }),
    defineField({
      name: "footerLinks",
      title: "Footer links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "footerLink",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({ name: "copyright", title: "Copyright line", type: "string" }),
  ],
  preview: {
    select: { title: "logoText" },
    prepare: ({ title }) => ({ title: title ?? "Site settings" }),
  },
});
