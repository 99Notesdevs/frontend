import { notFound } from "next/navigation";
import type { BaseTemplateProps } from "@/components/templates/types";
import { UpscNotesTemplate } from "@/components/templates/UpscNotesTemplate";
import { ArticleTemplate } from "@/components/templates/ArticleTemplate";
import { GeneralStudiesTemplate } from "@/components/templates/GeneralStudiesTemplate";
import { CurrentAffairTemplate } from "@/components/templates/CurrentAffairTemplate";
import { env } from "@/config/env";
import { Metadata } from "next";
import { BlogTemplate } from "@/components/templates/BlogTemplate";

// Map template IDs to components
const TEMPLATE_MAP: Record<string, React.ComponentType<BaseTemplateProps>> = {
  "upsc-notes": UpscNotesTemplate,
  "article": ArticleTemplate,
  "general-studies": GeneralStudiesTemplate,
  "current-affairs": CurrentAffairTemplate,
  "blog": BlogTemplate,
};

async function getPage(
  slug: string
): Promise<BaseTemplateProps["page"] | null> {
  try {
    const response = await fetch(`${env.API}/page/slug/${slug}`);
    const res = await response.json();
    
    if (!response.ok) {
      console.error("API Error:", res);
      return null;
    }

    const page = res.data;

    if (!page) {
      return null;
    }

    // Ensure template ID is properly set
    const templateId = page.template?.id || "";
    const template = {
      id: templateId,
      name: page.template?.name || "",
      description: page.template?.description || ""
    };

    return {
      ...page,
      template,
      templateId: templateId
    } as BaseTemplateProps["page"];
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const slug = (await params).slug;
  const page = await getPage(slug);

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
  // Ensure params is properly awaited by using it in an async context
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  // Get the correct template component using template ID
  const Template = TEMPLATE_MAP[page.templateId];

  if (!Template) {
    console.error(`Template ${page.templateId} not found in TEMPLATE_MAP`);
    throw new Error(`Template ${page.templateId} not found`);
  }

  return <Template page={page} />;
}