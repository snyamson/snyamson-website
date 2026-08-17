import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { iconOptions } from "./iconOptions";

export const speciality = defineType({
  name: "speciality",
  title: "Speciality",
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
      name: "icon",
      title: "Icon",
      type: "string",
      options: { list: [...iconOptions] },
      initialValue: "barChart",
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
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
  preview: { select: { title: "title", subtitle: "icon" } },
});
