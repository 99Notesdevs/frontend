import React from "react";
import Link from "next/link";
import { env } from "@/config/env";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import { X } from "lucide-react";
import DraggableTocButton from "@/components/navigation/DraggableTocButton";
import { Metadata } from "next";
import QuizWrapper from "@/components/quiz/QuizWrapper";
import Whatsapp from "@/components/ui/whatsapp";

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

  quizQuestions?: string;
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
  const quizQuestions =  JSON.parse(article?.quizQuestions || "[]");
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
      <div className="container max-w-7xl mx-auto px-4 py-2">

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
            <div className="lg:col-span-7 xl:col-start-2 xl:col-span-7 pt-[50px]">
              <div className="bg-white border rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300">
                {/* Article Header */}
                <div className="text-center mb-8 sm:mb-12"></div>
                {/* Article Header */}
                <div className="text-center mb-8 sm:mb-12">
                  
                    <div className="mb-4">
                      <Link
                        href={`/current-affairs/${category}`}
                        className="text-amber-500 hover:text-blue-800 font-medium text-sm"
                      >
                        {category}
                      </Link>
                    </div>
                  
                  {article?.metadata && (
                    <>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                      {JSON.parse(article.metadata).metaTitle}
                    </h1>
                    <p className="text-sm text-gray-600">
                      By {article.author} • {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }).replace(/\//g, '/') : 'N/A'}
                    </p>
                    <Whatsapp />
                    </>
                  )}
                </div>
                <div
                  className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
                  prose-headings:font-semibold
                  prose-headings:tracking-normal
                  prose-headings:text-left
                  prose-headings:relative
                  prose-headings:mb-6
                  
                  prose-h1:text-3xl sm:prose-h1:text-4xl
                  prose-h1:font-bold
                  prose-h1:text-gray-800
                  prose-h1:leading-tight
                  
                  prose-h2:text-2xl sm:prose-h2:text-3xl
                  prose-h2:text-gray-700
                  prose-h2:pb-2
                  prose-h2:after:content-['']
                  prose-h2:after:block
                  prose-h2:after:w-16
                  prose-h2:after:h-[2px]
                  prose-h2:after:mt-2
                  prose-h2:after:bg-yellow-500
                  prose-h2:after:rounded-full
                  
                  prose-h3:text-xl sm:prose-h3:text-2xl
                  prose-h3:text-gray-600
                  prose-h3:font-medium
                  prose-h3:pl-3
                  
                  prose-h4:text-lg sm:prose-h4:text-xl
                  prose-h4:text-gray-600
                  prose-h4:font-medium
                  prose-h4:before:content-['§']
                  prose-h4:before:text-yellow-500
                  prose-h4:before:mr-2
                  prose-h4:before:opacity-70
                  
                  prose-p:text-gray-600
                  prose-p:leading-relaxed
                  prose-p:tracking-wide
                  prose-strong:text-gray-800
                  prose-a:text-blue-600
                  prose-a:no-underline
                  prose-a:border-b-2
                  prose-a:border-blue-200
                  prose-a:transition-colors
                  prose-a:hover:border-blue-500
                  prose-blockquote:border-l-blue-500
                  prose-blockquote:bg-blue-50
                  prose-blockquote:p-3 sm:prose-blockquote:p-4
                  prose-blockquote:rounded-r-lg
                  prose-pre:bg-gray-50
                  prose-pre:rounded-lg
                  prose-pre:p-3 sm:prose-pre:p-4
                  prose-img:rounded-lg
                  prose-img:shadow-md
                  prose-ul:list-disc
                  prose-ul:pl-4 sm:prose-ul:pl-6
                  prose-ol:list-decimal
                  prose-ol:pl-4 sm:prose-ol:pl-6
                  [&>*]:w-full"
                >
                  {article.content ? (
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  ) : (
                    <p>No content available for this article.</p>
                  )}
                </div>
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
                    Table of Contents
                  </h3>
                  <div className="pr-2">
                    <TableOfContents content={article?.content} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>        ) : (
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
        {quizQuestions.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Quiz</h2>
            <QuizWrapper questions={quizQuestions} />
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