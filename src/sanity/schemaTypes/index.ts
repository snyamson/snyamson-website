import type { SchemaTypeDefinition } from "sanity";

import { contact } from "./contact";
import {
  cvCertification,
  cvEducation,
  cvExperience,
  cvLanguage,
  cvProfile,
  cvSkillGroup,
} from "./cv";
import { hero } from "./hero";
import { processStep } from "./processStep";
import { project } from "./project";
import { service } from "./service";
import { siteSettings } from "./siteSettings";
import { speciality } from "./speciality";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  hero,
  contact,
  speciality,
  processStep,
  service,
  project,
  cvProfile,
  cvEducation,
  cvExperience,
  cvCertification,
  cvLanguage,
  cvSkillGroup,
];
