export * from "./types";
import { UpscNotesTemplate } from "./UpscNotesTemplate";
import { GeneralStudiesTemplate } from "./GeneralStudiesTemplate";
import { ArticleTemplate } from "./ArticleTemplate";
import { CurrentAffairTemplate } from "./CurrentAffairTemplate";
import { BlogTemplate } from "./BlogTemplate";

// Template mapping for dynamic template selection
export const templateMap = {
  "upsc-notes": UpscNotesTemplate,
  "general-studies": GeneralStudiesTemplate,
  article: ArticleTemplate,
  "current-affairs": CurrentAffairTemplate,
  blog: BlogTemplate,
} as const;

export type TemplateType = keyof typeof templateMap;
