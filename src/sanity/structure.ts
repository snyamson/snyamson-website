import {
  BlockElementIcon,
  CaseIcon,
  CogIcon,
  DocumentIcon,
  EarthGlobeIcon,
  EnvelopeIcon,
  HomeIcon,
  ImagesIcon,
  StarIcon,
  UserIcon,
} from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

/**
 * Singletons (site settings, hero, contact) open straight into their
 * document; everything else is a plain ordered list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Hero")
        .icon(HomeIcon)
        .child(S.document().schemaType("hero").documentId("hero")),
      S.listItem()
        .title("Contact")
        .icon(EnvelopeIcon)
        .child(S.document().schemaType("contact").documentId("contact")),
      S.divider(),
      S.documentTypeListItem("project").title("Projects").icon(ImagesIcon),
      S.documentTypeListItem("speciality").title("What I do").icon(StarIcon),
      S.documentTypeListItem("service").title("Services").icon(CaseIcon),
      S.documentTypeListItem("processStep").title("Process steps").icon(BlockElementIcon),
      S.divider(),
      S.listItem()
        .title("CV")
        .icon(UserIcon)
        .child(
          S.list()
            .title("CV")
            .items([
              S.listItem()
                .title("Profile")
                .icon(UserIcon)
                .child(S.document().schemaType("cvProfile").documentId("cvProfile")),
              S.divider(),
              S.documentTypeListItem("cvEducation").title("Education").icon(DocumentIcon),
              S.documentTypeListItem("cvExperience").title("Experience").icon(CaseIcon),
              S.documentTypeListItem("cvCertification")
                .title("Certifications")
                .icon(StarIcon),
              S.documentTypeListItem("cvLanguage").title("Languages").icon(EarthGlobeIcon),
              S.documentTypeListItem("cvSkillGroup").title("Skills").icon(StarIcon),
            ]),
        ),
    ]);
