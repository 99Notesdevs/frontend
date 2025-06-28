import { notFound } from 'next/navigation';
import type { BaseTemplateProps } from '@/components/templates/types';
import { UpscNotesTemplate } from '@/components/templates/UpscNotesTemplate';
import { ArticleTemplate } from '@/components/templates/ArticleTemplate';
import { GeneralStudiesTemplate } from '@/components/templates/GeneralStudiesTemplate';
import { env } from '@/config/env';
import { CurrentAffairTemplate } from '@/components/templates/CurrentAffairTemplate';
import { Metadata } from 'next';

// Map template IDs to components
const TEMPLATE_MAP: Record<string, React.FC<any>> = {
  'upsc-notes': UpscNotesTemplate,
  'article': ArticleTemplate,
  'general-studies': GeneralStudiesTemplate,
  'study-material': ArticleTemplate, // Using ArticleTemplate as base for study material
  'current-affairs': CurrentAffairTemplate,
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

type Params = { slug: string; section: string[] };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, section } = await params;
  const page = await getPage(slug, section);

  if (!page || !page.metadata) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }
  
  // @ts-ignore
  const JSONMetaData = JSON.parse(page.metadata);
  
  return {
    title: JSONMetaData.metaTitle || "Default Title",
    description: JSONMetaData.metaDescription || "Default description",
    keywords: JSONMetaData.metaKeywords || "Default keywords",
    robots: JSONMetaData.robots || "index, follow",
    openGraph: {
      title: JSONMetaData.ogTitle || "Default OG Title",
      description: JSONMetaData.ogDescription || "Default OG Description",
      url: JSONMetaData.canonicalUrl || "https://example.com",
      images: [
        {
          url: JSONMetaData.ogImage || "https://example.com/default-image.jpg",
        },
      ],
      type: JSONMetaData.ogType || "website",
    },
    twitter: {
      card: JSONMetaData.twitterCard || "summary_large_image",
      title: JSONMetaData.twitterTitle || "Default Twitter Title",
      description:
        JSONMetaData.twitterDescription || "Default Twitter Description",
      images: [
        {
          url:
            JSONMetaData.twitterImage ||
            "https://example.com/default-twitter-image.jpg",
        },
      ],
    },
    alternates: {
      canonical:
        JSONMetaData.canonicalUrl ||
        "https://example.com/default-canonical-url",
    },
  };
}

export default async function Page({ params }: { params: Params }) {
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
