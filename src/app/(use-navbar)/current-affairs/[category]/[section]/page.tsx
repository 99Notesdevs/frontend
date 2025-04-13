import React from "react";
import Link from "next/link";
import { env } from "@/config/env";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import { X } from "lucide-react";
import DraggableTocButton from "@/components/navigation/DraggableTocButton";
import { Metadata } from "next";

// Define types for the data
interface CurrentAffairArticle {
  id: number;
  title: string;
  content?: string;
  slug: string;
  author?: string;
  metadata?: string;
  createdAt?: string;
  updatedAt?: string;
  parentSlug?: string;
  parentId?: number;
}

type Params = Promise<{ category: string; section: string }>;

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const { category, section } = await params;
  const page = await fetchArticle(category, section);

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

// Server component to fetch data
const CurrentAffairArticlePage = async ({
  params,
}: {params: Params}) => {
  // Await params to fix the Next.js error
  const { category, section } = await params;
  
  // The section parameter is actually the article slug
  const articleSlug = section;
  
  // Fetch the article
  const article = await fetchArticle(category, articleSlug);
  // @ts-ignore
  const jsonLD = JSON.parse(article?.metadata).schemaData || "{}";

  return (
    <>
    <section>
      <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLD }} />
    </section>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-5">
      <div className="container max-w-7xl mx-auto px-4 py-8">

        {/* TOC Container with checkbox hack for toggle */}
      <input type="checkbox" id="toc-toggle" className="hidden peer" />
      
      {/* Draggable TOC Button */}
      <DraggableTocButton />

      {/* TOC Sidebar */}
      <div className="fixed left-0 top-0 h-full w-[280px] sm:w-[320px] bg-white/95 
      backdrop-blur-sm shadow-xl -translate-x-full peer-checked:translate-x-0 
      transition-all duration-300 ease-in-out z-[90] border-r-2 border-gray-200">
        {/* Close Button - Moved outside scrollable area */}
        <label
          htmlFor="toc-toggle"
          className="absolute top-4 right-4 p-2 cursor-pointer rounded-full
          hover:bg-gray-100 transition-colors duration-200 z-[100]
          bg-white shadow-md border border-gray-200"
        >
          <X className="w-5 h-5 text-gray-600 hover:text-gray-900" />
        </label>

        {/* Left TOC Sidebar */}
        <div className="p-6 h-full mt-[50px] pb-24 overflow-y-auto">
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 
          shadow-inner transition-all duration-300 hover:border-gray-300
          sticky top-[100px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 
            border-gray-300 pb-2 flex items-center gap-2">
              <span className="text-gray-500">📑</span>
              <span>Table of Content</span>
            </h3>
            <div className="pr-2 space-y-1 max-h-[70vh] overflow-y-auto">
              <TableOfContents content={article?.content} />
            </div>
          </div>
        </div>
      </div>
        
        {article ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main content column */}
            <div className="lg:col-span-8">
              <div className="max-w-3xl">
                {/* Back button - Enhanced */}
                <div className="mb-8">
                  <Link
                    href={`/current-affairs/${category}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                    bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700
                    hover:bg-white hover:border-gray-300 transition duration-200
                    shadow-sm hover:shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to {category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")}
                  </Link>
                </div>

                {/* Article Card - Enhanced */}
                <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl 
                overflow-hidden border border-gray-200 transition-all duration-300
                hover:shadow-2xl">
                  <div className="p-8 md:p-10">
                    {/* Article Header - Enhanced */}
                    <header className="mb-10 border-b border-gray-200/80 pb-8">
                      {/* <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900
                      leading-tight gradient-text">{article.title}</h1> */}
                      
                      {/* Metadata - Enhanced */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {article.author && (
                          <div className="flex items-center gap-2 bg-blue-50/50 
                          px-3 py-1.5 rounded-full border border-blue-100/50
                          hover:bg-blue-50 transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{article.author}</span>
                          </div>
                        )}
                        {article.createdAt && (
                          <div className="flex items-center gap-2 bg-blue-50/50 
                          px-3 py-1.5 rounded-full border border-blue-100/50
                          hover:bg-blue-50 transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <time dateTime={article.createdAt}>
                              {new Date(article.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                          </div>
                        )}
                        <div className="flex items-center gap-2 bg-blue-50/50 
                        px-3 py-1.5 rounded-full border border-blue-100/50
                        hover:bg-blue-50 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          <span>{category.replace(/-/g, " ")}</span>
                        </div>
                      </div>
                    </header>

                    {/* Article Content - Enhanced */}
                    <div className="prose prose-lg max-w-none prose-headings:text-gray-900
                    prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline
                    hover:prose-a:underline prose-img:rounded-xl prose-strong:text-gray-900
                    prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50
                    prose-blockquote:rounded-r-lg prose-blockquote:py-2">
                      {article.content ? (
                        <>
                          <div dangerouslySetInnerHTML={{ __html: article.content }} />
                          {/* Debug info - remove in production */}
                          <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
                            <h4 className="font-bold mb-2">Debug Info (remove in production):</h4>
                            <p>Content length: {article.content.length} characters</p>
                            <p>Content type: {typeof article.content}</p>
                            <p>Raw content preview: {article.content.substring(0, 100)}...</p>
                          </div>
                        </>
                      ) : (
                        <p>No content available for this article.</p>
                      )}
                    </div>

                    {/* Related Topics - Enhanced */}
                    <div className="mt-12 pt-6 border-t border-gray-200/80">
                      <h3 className="font-semibold text-xl mb-4 text-gray-900">Related Topics</h3>
                      <div className="flex flex-wrap gap-3">
                        <span className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 
                        text-blue-800 px-4 py-2 rounded-full text-sm font-medium
                        border border-blue-100 hover:shadow-md transition-all duration-200">
                          Current Affairs
                        </span>
                        <span className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 
                        text-blue-800 px-4 py-2 rounded-full text-sm font-medium
                        border border-blue-100 hover:shadow-md transition-all duration-200">
                          {category.replace(/-/g, " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
            {/* Right Sidebar */}
            <div className="lg:col-span-4 hidden lg:block space-y-4 sm:space-y-6 mt-12">
              {/* Sticky Container */}
              <div className="relative">
                {/* TOC Section */}
                <div className="sticky top-8 space-y-4 sm:space-y-6">
                  <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-4 sm:p-6 
                  transition-all duration-300 hover:shadow-xl">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2">
                      📑 Table of Contents
                    </h3>
                    <div className="pr-2">
                      <TableOfContents content={article?.content} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl
          shadow-xl max-w-2xl mx-auto border border-gray-200">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-500 mb-6">
              The article you're looking for could not be found.
            </p>
            <Link
              href={`/current-affairs/${category}`}
              className="text-blue-600 hover:underline"
            >
              Go back to {category.replace(/-/g, " ")} articles
            </Link>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

// Helper function to fetch a specific article
async function fetchArticle(category: string, articleSlug: string): Promise<CurrentAffairArticle | null> {
  try {
    // Log the input parameters
    
    // Construct the full slug exactly as it would be in the database
    // Based on the seed data, the format is: current-affairs/category/sample-article
    const fullSlug = `current-affairs/${category}/${articleSlug}`;
    
    // Make a direct API call to get the article by its full slug
    const response = await fetch(`${env.API}/currentArticle/slug/${encodeURIComponent(fullSlug)}`, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        return data.data;
      } else {
        console.log(`API returned success but no article data was found`);
      }
    } else {      
      // Try a different approach - fetch all articles and find a match
      const allArticlesResponse = await fetch(`${env.API}/currentArticle`, {
        headers: {
          "Content-Type": "application/json",
        },
        // cache: 'no-store'
      });
      
      if (allArticlesResponse.ok) {
        const allArticlesData = await allArticlesResponse.json();
        
        if (allArticlesData.status === 'success' && allArticlesData.data) {
          const allArticles = allArticlesData.data;
          
          // Try to find an article that matches our criteria
          const matchingArticle = allArticles.find((a: any) => {
            // Try exact match on full slug
            if (a.slug === fullSlug) {
              return true;
            }
            
            // Try match on the last part of the slug
            const slugParts = a.slug.split('/');
            const lastPart = slugParts[slugParts.length - 1];
            if (lastPart === articleSlug) {
              return true;
            }
            
            // Try match on parent slug
            if (a.parentSlug === `current-affairs/${category}`) {
              return true;
            }
            
            return false;
          });
          
          if (matchingArticle) {            
            // Fetch the full article with content
            const fullArticleResponse = await fetch(`${env.API}/currentArticle/slug/${encodeURIComponent(matchingArticle.slug)}`, {
              headers: {
                "Content-Type": "application/json",
              },
              // cache: 'no-store'
            });
            
            if (fullArticleResponse.ok) {
              const fullArticleData = await fullArticleResponse.json();
              if (fullArticleData.status === 'success' && fullArticleData.data) {
                return fullArticleData.data;
              }
            }
          }
        }
      }
    }
    
    console.error(`Article not found for slug: ${articleSlug}`);
    return null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export default CurrentAffairArticlePage;