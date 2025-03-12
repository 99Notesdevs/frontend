"use client"

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ArticleEditor from "@/components/article-editor"; // Updated import

// This would typically come from your API
const articles = {
  "1": {
    id: "1",
    title: "Getting Started with Next.js",
    content: "Next.js is a React framework for production...",
    tags: ["nextjs", "react", "tutorial"],
    image: "/placeholder.svg?height=200&width=300",
    updatedAt: "2025-03-10",
  },
  "2": {
    title: "Mastering TypeScript",
    content: "TypeScript adds static typing to JavaScript...",
    tags: ["typescript", "javascript", "programming"],
    image: "/placeholder.svg?height=200&width=300",
    updatedAt: "2025-03-08",
  },
  "3": {
    title: "Tailwind CSS Tips and Tricks",
    content: "Learn how to use Tailwind CSS effectively...",
    tags: ["css", "tailwind", "frontend"],
    image: "/placeholder.svg?height=200&width=300",
    updatedAt: "2025-03-05",
  },
}

export default function EditArticlePage() {
  const router = useRouter();
  const { slug } = router.query; // Get slug from URL
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      // Here you would typically fetch the article from your API
      // For now, we'll use the mock data
      const articleData = articles[slug as keyof typeof articles];
      if (articleData) {
        setArticle(articleData);
      }
      setLoading(false);
    }
  }, [slug]);

  const handleSave = async (updatedArticle: any) => {
    try {
      // Here you would typically make an API call to update the article
      // For now, we'll just simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // After saving, redirect to the articles list
      router.push("/dashboard/articles");
    } catch (error) {
      console.error("Failed to update article:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Article not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-20">
      <ArticleEditor initialData={article} onSave={handleSave} />
    </div>
  );
}
