import { notFound } from "next/navigation";
import type { BaseTemplateProps } from "@/components/templates/types";
import { UpscNotesTemplate } from "@/components/templates/UpscNotesTemplate";
import { ArticleTemplate } from "@/components/templates/ArticleTemplate";
import { GeneralStudiesTemplate } from "@/components/templates/GeneralStudiesTemplate";
import { CurrentAffairTemplate } from "@/components/templates/CurrentAffairTemplate";
import { env } from "@/config/env";
import { Metadata } from "next";

// Map template IDs to components
const TEMPLATE_MAP: Record<string, any> = {
  "upsc-notes": UpscNotesTemplate,
  "article": ArticleTemplate,
  "general-studies": GeneralStudiesTemplate,
  "study-material": ArticleTemplate, // Using ArticleTemplate as base for study material
  "current-affairs": CurrentAffairTemplate,
};

async function getPage(
  slug: string
): Promise<BaseTemplateProps["page"] | null> {
  try {

    const response = await fetch(`${env.API}/page/slug/${slug}`);
    const res = await response.json();
    const page = res.data;

    if (!page) {
      return null;
    }

    return page as BaseTemplateProps["page"];
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await getPage(params.slug);

  if (!page || !page.metadata) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }
  // @ts-ignore
  const JSONMetaData = JSON.parse(page.metadata);
  console.log("JSONMetaData", JSONMetaData.schemaData);
  
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

type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  // Ensure params is properly awaited by using it in an async context
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  // Get the correct template component using template ID
  const Template = TEMPLATE_MAP[page.template.id];

  if (!Template) {
    console.error(`Template ${page.template.id} not found in TEMPLATE_MAP`);
    throw new Error(`Template ${page.template.id} not found`);
  }

  return <Template page={page} />;
}
