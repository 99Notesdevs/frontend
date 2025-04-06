import { notFound } from "next/navigation";
import type { BaseTemplateProps } from "@/components/templates/types";
import { UpscNotesTemplate } from "@/components/templates/UpscNotesTemplate";
import { ArticleTemplate } from "@/components/templates/ArticleTemplate";
import { GeneralStudiesTemplate } from "@/components/templates/GeneralStudiesTemplate";
import { CurrentAffairTemplate } from "@/components/templates/CurrentAffairTemplate";
import { env } from "@/config/env";

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
