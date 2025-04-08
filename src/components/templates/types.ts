export interface Page {
  id: string;
  title: string;
  content: string;
  image: string;
  metadata: Record<string, any>;
  slug: string;
  template: Template;
  parent: Page | null;
  children: Page[];
}

export interface Template {
  id: string;
  name: string;
  description?: string;
}

// Base content interface
export interface TemplateContent {
  title: string;
  content: string;
}

// Base template props interface
export interface BaseTemplateProps {
  page: Page & {
    content: TemplateContent;
    imageUrl?: String
  };
}

export interface ArticleTemplateProps extends BaseTemplateProps {}
export interface CurrentAffairTemplateProps extends BaseTemplateProps {}
export interface GeneralStudiesTemplateProps extends BaseTemplateProps {}
export interface UpscNotesTemplateProps extends BaseTemplateProps {}