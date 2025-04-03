import { notFound } from 'next/navigation';
import type { BaseTemplateProps } from '@/components/templates/types';
import { UpscNotesTemplate } from '@/components/templates/UpscNotesTemplate';
import { ArticleTemplate } from '@/components/templates/ArticleTemplate';
import { GeneralStudiesTemplate } from '@/components/templates/GeneralStudiesTemplate';
import { env } from '@/config/env';
import { CurrentAffairTemplate } from '@/components/templates/CurrentAffairTemplate';

// Map template IDs to components
const TEMPLATE_MAP: Record<string, React.FC<any>> = {
  'upsc-notes': UpscNotesTemplate,
  'article': ArticleTemplate,
  'general-studies': GeneralStudiesTemplate,
  'study-material': ArticleTemplate, // Using ArticleTemplate as base for study material
  'current-affair': CurrentAffairTemplate,
};

async function getPage(slug: string, section: string[]): Promise<BaseTemplateProps['page'] | null> {
  try {
    const fullPath = `${slug} ${section.join(' ')}`; // slugs seperated by space will be rejoined with / in the backend 
    const response = await fetch(`${env.API}/page/slug/${fullPath}`);
    const res = await response.json();
    const page = res.data;

    if (!page) {
      return null;
    }

    return page as BaseTemplateProps['page'];
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

type Params = Promise<{slug: string; section: string[]}>;

export const generateMetadata = async ({ params }: {params: Params}) => {
  const { slug, section } = await params;
  const page = await getPage(slug, section);

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: page.title,
    description: (page.metadata as { description?: string })?.description || `${page.title} - 99Notes`,
  };
};

export default async function Page({ params }: {params: Params}) {
  const { slug, section } = await params;
  const page = await getPage(slug, section);

  if (!page) {
    notFound();
  }

  // Get the correct template component using template ID
  const TemplateComponent = TEMPLATE_MAP[page.template.id];
  if (!TemplateComponent) {
    console.error('No template component found for:', page.template.id);
    notFound();
  }
  return <TemplateComponent page={page} />;
}
