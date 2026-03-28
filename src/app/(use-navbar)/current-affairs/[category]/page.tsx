import React from "react";
import CurrentAffairsPage from "@/components/CurrentAffairs/CurrentAffairsPage";
import { Metadata } from "next";
import { api } from "@/config/api/route";

// Define interfaces to match the database schema
interface Article {
  id: number;
  title: string;
  content?: string;
  slug: string;
  link: string;
  imageUrl?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: string;
  parentSlug?: string;
  parentId?: number;
}

interface CurrentAffair {
  id: number;
  title: string;
  content: string;
  slug: string;
  type: string;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

type Params = Promise<{
  category: string;
}>;

async function getPage(
  slug: string
): Promise<CurrentAffair | null> {
  try {
    const fullSlug = `current-affairs/${slug}`;
    const modifiedSlug = fullSlug.replace(/\s+/g, ' ');
    const response = await api.get(`/currentAffair/slug/${encodeURIComponent(modifiedSlug)}`) as { success: boolean, data: CurrentAffair | null };
    const page = response.data;

    if (!page) {
      return null;
    }

    return page as CurrentAffair;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const { category } = await params;
  const page = await getPage(category);

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

// Make the component async and properly handle the dynamic params
const CurrentAffairsSectionPage = async ({
  params,
}: {params: Params}) => {
  // Await params to fix the Next.js error
  const { category } = await Promise.resolve(params);

  // The category parameter is the last part of the slug
  // For example, if the full slug is 'current-affairs/news-analysis',
  // the category parameter will be 'news-analysis'
  const fullSlug = `current-affairs/${category}`;

  // Fetch the current affair section data
  let currentAffair: CurrentAffair | null = null;
  let articles: Article[] = [];
  let error: string | null = null;

  try {
    // Convert forward slashes to spaces to match backend format
    const modifiedSlug = fullSlug.replace(/\//g, ' ');
    
    try {
      // For server components, use the backend API directly
      // Looking at the backend routes, the endpoint for getting a section by slug is /currentAffair/slug/:slug
      const sectionResponse = await api.get(`/currentAffair/slug/${encodeURIComponent(modifiedSlug)}`) as { success: boolean, data: CurrentAffair | null };

      if (!sectionResponse.success) {
        throw new Error(`Failed to fetch section data: ${sectionResponse.data}`);
      }

      currentAffair = sectionResponse.data;
    } catch (fetchError) {
      console.error("Error fetching section data:", fetchError);
      error = "Failed to load section data. Please check your internet connection and try again.";
    }

    try {
      // Fetch all articles
      const articlesResponse = await api.get(`/currentArticle`) as { success: boolean, data: Article[] | null };

      if (!articlesResponse.success) {
        throw new Error(`Failed to fetch articles: ${articlesResponse.data}`);
      }

      const articlesData = articlesResponse.data;
      if (articlesData) {
        const allArticles = articlesData;
        articles = allArticles.filter((article: Article) => {
          return article.parentSlug === fullSlug;
        });

      } else {
        throw new Error("Invalid response from server");
      }
    } catch (fetchError) {
      console.error("Error fetching articles:", fetchError);
      error = error || "Failed to load articles. Please check your internet connection and try again.";
    }
  } catch (error) {
    console.error("Error in CurrentAffairsSectionPage:", error);
    error = "Failed to load data. Please check your internet connection and try again.";
  }

  return (
    <>
      <CurrentAffairsPage
        category={category}
        initialCurrentAffair={currentAffair}
        initialArticles={articles}
        initialError={error}
      />
    </>
  );
};

export default CurrentAffairsSectionPage;