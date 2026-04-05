import React from "react";
import CurrentAffairsPage from "@/components/CurrentAffairs/CurrentAffairsPage";
import { api } from "@/config/api/route";

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
  type: "daily" | "monthly" | "yearly";
  link?: string;
  order?: number;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

export const metadata = {
  title: "Current Affairs - 99Notes",
  description: "Current Affairs for UPSC Civil Services Examination",
};

const fetchByType = async (type: "daily" | "monthly" | "yearly") => {
  try {
    const response = (await api.get(`/currentAffair/type/${type}`)) as {
      success: boolean;
      data: CurrentAffair[] | null;
    };

    if (response.success && response.data) return response.data;
  } catch {
    // Fallback for alternate backend route spelling.
  }

  const fallbackResponse = (await api.get(`/currentAffair/type/${type}`)) as {
    success: boolean;
    data: CurrentAffair[] | null;
  };

  if (!fallbackResponse.success || !fallbackResponse.data) return [];
  return fallbackResponse.data;
};

const fetchArticlesByParentSlug = async (parentSlug: string): Promise<Article[]> => {
  const encodedSlug = encodeURIComponent(parentSlug);
  const response = (await api.get(`/currentArticle/parent/${encodedSlug}`)) as {
    success: boolean;
    data: Article[] | null;
  };

  if (!response.success || !response.data) return [];
  return response.data;
};

const CurrentAffairsIndexPage = async () => {
  let initialCurrentAffair: CurrentAffair | null = null;
  let initialArticles: Article[] = [];
  let initialError: string | null = null;

  try {
    const dailySections = (await fetchByType("daily"))
      .filter((section) => !section.link)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    initialCurrentAffair = dailySections[0] || null;

    if (initialCurrentAffair?.slug) {
      initialArticles = await fetchArticlesByParentSlug(initialCurrentAffair.slug);
    }
  } catch (error) {
    console.error("Error loading current affairs index:", error);
    initialError = "Failed to load current affairs.";
  }

  return (
    <CurrentAffairsPage
      category="daily"
      initialCurrentAffair={initialCurrentAffair}
      initialArticles={initialArticles}
      initialError={initialError}
    />
  );
};

export default CurrentAffairsIndexPage;
