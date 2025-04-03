
export interface Page {
  id: string;
  title: string;
  content: string;
  metadata: Record<string, any>;
}

export interface Template {
  id: string;
    template: Template; // Define the Template interface below
  description?: string;
}

export interface BaseTemplateProps {
  page: Page & {
    template: Template;
    parent: Page | null;
    children: Page[];
  };
}

export interface JsonContent {
  [key: string]: any;
}

export interface JsonMetadata {
  [key: string]: any;
}

export interface TemplateData extends BaseTemplateProps {
  slug: string;
  parentId?: string;
  level: number;
  showInNav: boolean;
}

// export interface BaseTemplateProps {
//   page: {
//     title: string;
//     content: string;
//     metadata: Record<string, any>;
//     template: {
//       id: string;
//     };
//   };
// }

// export interface UpscNotesTemplateProps extends BaseTemplateProps {
//   page: {
//     title: string;
//     content: string;
//     metadata: {
//       tags?: string[];
//       date?: string;
//       readTime?: string;
//       coverImage?: string;
//     };
//     template: {
//       id: 'upsc-notes';
//     };
//   };
// }

// export interface GeneralTemplateProps extends BaseTemplateProps {
//   page: {
//     title: string;
//     content: string;
//     metadata: {
//       tags?: string[];
//       date?: string;
//       readTime?: string;
//       coverImage?: string;
//     };
//     template: {
//       id: 'article' | 'general-studies' | 'study-material';
//     };
//     children: Array<{
//       id: string;
//       slug: string;
//       title: string;
//       content: string;
//       image?: string;
//     }>;
//   };
// }