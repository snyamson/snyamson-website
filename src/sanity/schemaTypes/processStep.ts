import { BlockElementIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { iconOptions } from "./iconOptions";

export const processStep = defineType({
  name: "processStep",
  title: "Process step",
  type: "document",
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: 'One word reads best on the rail, e.g. "Discover"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: { list: [...iconOptions] },
      initialValue: "sparkles",
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "One or two short lines. Long copy breaks the card row.",
      type: "text",
      rows: 3,
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
    select: { title: "title", order: "order" },
    prepare: ({ title, order }) => ({ title, subtitle: `Step ${order ?? "?"}` }),
  },
});
