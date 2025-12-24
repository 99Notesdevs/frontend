import React from "react";
import Link from "next/link";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import { Metadata } from "next";
import CurrentArticleQuiz from "@/components/quiz/CurrentArticleQuiz";
import Whatsapp from "@/components/ui/whatsapp";
import AssistiveTouch from "@/components/navigation/Assistivetouch";
import { Tag } from "lucide-react";
import { api } from "@/config/api/route";
import ContentWrapper from "@/components/Blogs/ContentWrapper";
import SocialMedia from "@/components/navigation/socialmedia";
import Ads from "@/components/navigation/Ads";

// Define types for the data
interface Tag {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CurrentAffairBlog {
  id: number;
  title: string;
  content?: string;
  slug: string;
  tags?: (string | Tag)[];
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  parentSlug?: string;
}

interface CurrentAffairArticle {
  id: number;
  title: string;
  content?: string;
  slug: string;
  tags?: string[];
  author?: string;
  metadata?: string;
  createdAt?: string;
  updatedAt?: string;
  parentSlug?: string;
  parentId?: number;
  blogs?: CurrentAffairBlog[];
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
  console.log(article);
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
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-200">
      <div className="container max-w-7xl mx-auto px-4 py-2">
        <AssistiveTouch content={article?.content || ""} />

        {article ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main content column - adjusting padding top for mobile */}
            <div className="lg:col-span-8 pt-4 lg:pt-[50px]">
              <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-lg dark:shadow-slate-900/30 p-4 hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 mb-4">
                {/* Article Header */}
                <div className="text-center mb-8 sm:mb-12">
                  
                    <div className="mb-4">
                      <Link
                        href={`/current-affairs/${category}`}
                        className="text-[var(--secondary)] hover:text-blue-800 dark:hover:text-blue-400 font-medium text-sm transition-colors duration-200"
                      >
                        {category}
                      </Link>
                    </div>

                    
                  
                  {article?.metadata && (
                    <>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--surface-dark)] dark:text-white mb-8">
                      {JSON.parse(article.metadata).metaTitle}
                    </h1>
                    <p className="text-sm text-[var(--text-tertiary)] dark:text-slate-300 mb-2" >
                      By {article.author} • {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }).replace(/\//g, '/') : 'N/A'}
                    </p>
                    
                    {/* Tags */}
                    {article.metadata && JSON.parse(article.metadata).tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center my-4">
                        {JSON.parse(article.metadata).tags.map((tag: string, index: number) => (
                          <Link
                            key={index}
                            href={`/tag/${encodeURIComponent(tag)}`}
                            className="group"
                          >
                            <span 
                              className="inline-block bg-yellow-50 dark:bg-yellow-900/30 text-[var(--primary)] dark:text-yellow-400 hover:bg-[var(--info-surface)] dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer px-3 py-1 text-sm font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-7"><Whatsapp /></div>
                    </>
                  )}
                </div>
                {article.content ? (
                    <ContentWrapper input={article.content}/>
                  ) : (
                    <p>No content available for this article.</p>
                )}

                {/* Blog content with tags */}
                {article.blogs && article.blogs.length > 0 && (
                  <div className="mt-12 space-y-12">
                    {article.blogs.map((blog, index) => (
                      <div key={blog.id} id={`blog-${index}`}>
                        <article 
                          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none pt-8 border-t border-gray-200"
                        >
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                              {blog.tags.map((tag, i) => {
                                const tagName = typeof tag === 'string' ? tag : tag.name || '';
                                return (
                                  <Link
                                    key={i}
                                    href={`/tag/${encodeURIComponent(tagName)}`}
                                    className="group"
                                  >
                                    <span 
                                      className="inline-block bg-yellow-50 text-[var(--primary)] hover:bg-[var(--info-surface)] transition-colors duration-200 cursor-pointer px-3 py-1 text-sm font-medium rounded-full"
                                    >
                                      {tagName}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                          {blog.content && (
                            <div 
                              className="text-gray-700"
                              dangerouslySetInnerHTML={{ 
                                __html: blog.content.replace(
                                  /<h2[^>]*>([\s\S]*?)<\/h2>/g, 
                                  (match, content) => {
                                    const cleanText = content
                                      .toLowerCase()
                                      .replace(/[^\w\s]/g, '')
                                      .replace(/\s+/g, '-')
                                      .replace(/-+/g, '-')
                                      .replace(/^-+|-+$/g, '');
                                    const id = cleanText || `blog-${index}-heading`;
                                    return `<h2 id="${id}">${content}</h2>`;
                                  }
                                ) 
                              }} 
                            />
                          )}
                        </article>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Blogs Section - Integrated with content */}
            
            {/* Right Sidebar */}
            <div className="lg:col-span-4 lg:block mt-12 space-y-4">
              {/* Table of Contents */}
              <div className="sticky top-8 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
                    Table of Contents
                  </h3>
                  <TableOfContents 
                    content={article.content || ''}
                    blogs={article.blogs?.map(blog => ({
                      content: blog.content || ''
                    })) || []}
                  />
                </div>

                {/* Social Media Section */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
                    Connect With Us
                  </h3>
                  <div className="flex justify-center">
                    <SocialMedia />
                  </div>
                </div>

                {/* Shop Ad Section */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold p-4 text-slate-800 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    Our Shop
                  </h3>
                  <Ads 
                    imageUrl="/shop-banner.jpg" 
                    altText="Visit 99Notes Shop"
                  />
                </div>

                {/* Quiz Section */}
                {quizQuestions.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Quiz</h3>
                    {/* <QuizWrapper questions={quizQuestions} /> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl
            shadow-xl max-w-2xl mx-auto border border-gray-200">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-[var(--text-tertiary)] mb-6">
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
            <CurrentArticleQuiz questions={quizQuestions} />
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
    const response = await api.get(`/currentArticle/slug/${encodeURIComponent(fullSlug)}`) as { success: boolean, data: CurrentAffairArticle | null };

    if (response.success) {
      const data = response.data;

      if (response.success && data) {
        return data;
      } else {
        console.log(`API returned success but no article data was found`);
      }
    } else {      
      // Try a different approach - fetch all articles and find a match
      const allArticlesResponse = await api.get(`/currentArticle`) as { success: boolean, data: CurrentAffairArticle[] | null };

        if (allArticlesResponse.success && allArticlesResponse.data) {
          const allArticles = allArticlesResponse.data;

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
            const fullArticleResponse = await api.get(`/currentArticle/slug/${encodeURIComponent(matchingArticle.slug)}`) as { success: boolean, data: CurrentAffairArticle | null };

            if (fullArticleResponse.success) {
              const fullArticleData = fullArticleResponse.data;
              return fullArticleData;
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