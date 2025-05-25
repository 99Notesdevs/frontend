export interface Page {
  id: string;
  title: string;
  content: string;
  questionNumber?: number;
  image: string;
  author?: {
    id: string;
    name: string;
  };
  admin?: {
    id: string;
    name: string;
  };
  metadata: string;
  slug: string;
  tags: Array<{ name: string }>;
  parentSlug: string;
  createdAt: string;
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
    imageUrl?: string;
    templateId: string;
    categories?: {
      id: string;
    };
  };
}

export interface ArticleTemplateProps extends BaseTemplateProps {}
export interface CurrentAffairTemplateProps extends BaseTemplateProps {}
export interface GeneralStudiesTemplateProps extends BaseTemplateProps {}
export interface UpscNotesTemplateProps extends BaseTemplateProps {}
export interface BlogTemplateProps extends BaseTemplateProps {}