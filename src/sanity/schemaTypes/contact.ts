import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const contact = defineType({
  name: "contact",
  title: "Contact",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "blurb", title: "Blurb", type: "text", rows: 3 }),
    defineField({
      name: "projectTypes",
      title: "Project types",
      description: "Options in the form's project-type dropdown.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "available",
      title: "Currently available",
      description: "Drives the status dot beside the availability note.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "availabilityNote",
      title: "Availability note",
      type: "string",
    }),
    defineField({
      name: "submitLabel",
      title: "Submit button label",
      type: "string",
      initialValue: "Send message",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "availabilityNote" },
  },
});
