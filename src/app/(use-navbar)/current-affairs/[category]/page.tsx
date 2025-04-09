import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import CurrentAffairsLayout from "@/components/CurrentAffairs/CurrentAffairsLayout";
import { sectionConfig } from "@/config/currentAffairs";
import { env } from "@/config/env";

// Define interfaces to match the database schema
interface Article {
  id: number;
  title: string;
  content?: string;
  slug: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  parentSlug?: string;
  parentId?: number;
}

interface CurrentAffair {
  id: number;
  title: string;
  content: string;
  slug: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

type Params = Promise<{
  category: string;
}>;

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
    const modifiedSlug = fullSlug.replace(/\s+/g, ' ');
    
    try {
      // For server components, use the backend API directly
      // Looking at the backend routes, the endpoint for getting a section by slug is /currentAffair/slug/:slug
      const sectionResponse = await fetch(`${env.API}/currentAffair/slug/${encodeURIComponent(modifiedSlug)}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!sectionResponse.ok) {
        throw new Error(`Failed to fetch section data: ${sectionResponse.statusText}`);
      }

      const sectionData = await sectionResponse.json();
      if (sectionData.status === 'success' && sectionData.data) {
        currentAffair = sectionData.data;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (fetchError) {
      console.error("Error fetching section data:", fetchError);
      error = "Failed to load section data. Please check your internet connection and try again.";
    }

    try {
      // Fetch all articles
      const articlesResponse = await fetch(`${env.API}/currentArticle`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!articlesResponse.ok) {
        throw new Error(`Failed to fetch articles: ${articlesResponse.statusText}`);
      }

      const articlesData = await articlesResponse.json();
      if (articlesData.status === 'success' && articlesData.data) {
        const allArticles = articlesData.data;
        articles = allArticles.filter((article: Article) => {
          const slugParts = article.slug.split('/');

          // Remove the last part (the article name) to get the parent slug
          const extractedParentSlug = slugParts.slice(0, -1).join('/');

          // Check if the extracted parent slug matches the current page's fullSlug
          const matches = extractedParentSlug === fullSlug;

          return matches;
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/current-affairs" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  // Get the section config for this category
  
  const sectionInfo = sectionConfig[category] || {
    title: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " "),
    description: "Latest updates and analysis",
    topics: ["General"],
  };
  

  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    // Handle potentially undefined createdAt values
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <CurrentAffairsLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <Breadcrumb />
          {/*Image */}
          {currentAffair?.imageUrl && (
            <div className="relative aspect-video w-full mb-6 rounded-lg overflow-hidden">
              <Image
                src={currentAffair.imageUrl}
                alt={currentAffair.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {currentAffair?.title || sectionInfo.title}
            </h1>
            <div dangerouslySetInnerHTML={{ __html: currentAffair?.content || '' }}></div>
            {/* <p className="text-lg text-gray-600 mb-6" } /> */}

            {/* <div className="flex flex-wrap gap-2">
              {sectionInfo.topics.map((topic) => (
                <span
                  key={topic}
                  className="bg-white shadow-sm border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div> */}
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          {sortedArticles.length > 0 ? (
            sortedArticles.map((article) => (
              <div
                key={article.id}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="sm:flex sm:items-center sm:justify-between mb-4 text-sm">
                  <div className="flex items-center gap-4 text-gray-500 mb-2 sm:mb-0">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                      </svg>
                      {article.author || 'Unknown'}
                    </span>
                    <span className="hidden sm:flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                      </svg>
                      {article.createdAt ? new Date(article.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : 'No date'}
                    </span>
                  </div>
                  <Link
                    href={`/current-affairs/${category}/${article.slug.split('/').pop()}`}
                    className="inline-flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform"
                  >
                    Read Full Article
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>

                <Link
                  href={`/current-affairs/${category}/${article.slug.split('/').pop()}`}
                  className="block group-hover:text-blue-600 transition-colors"
                >
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {article.content?.substring(0, 300)}...
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-gray-500">Check back later for new content.</p>
            </div>
          )}
        </div>
      </div>
    </CurrentAffairsLayout>
  );
};

export default CurrentAffairsSectionPage;