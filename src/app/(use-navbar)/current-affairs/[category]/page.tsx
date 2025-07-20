import React from "react";
import Link from "next/link";
import Image from "next/image";
import CurrentAffairsLayout from "@/components/CurrentAffairs/CurrentAffairsLayout";
import { env } from "@/config/env";
import { Metadata } from "next";
import SearchBar from "@/components/Navbar/SearchBar";
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
    const response = await fetch(`${env.API}/currentAffair/slug/${encodeURIComponent(modifiedSlug)}`);
    const res = await response.json();
    const page = res.data;

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-[var(--surface-darker)] dark:text-white mb-4">Error</h1>
          <p className="text-[var(--text-tertiary)] dark:text-gray-300 mb-4">{error}</p>
          <Link href="/current-affairs" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    // Handle potentially undefined createdAt values
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
  // @ts-ignore
  const jsonLD = JSON.parse(currentAffair?.metadata).schemaData || "";
  return (
    <>
    <section>
      <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLD }} />
    </section>
    <main>
    <CurrentAffairsLayout>
      {/* Hero Section */}
      <div className="px-4 py-6">
        <div className="container mx-auto">
        {/* <div className="container ">
        <Breadcrumb /> */}
          {/* Image */}
          {currentAffair?.imageUrl && (
            <div className="relative aspect-video w-full mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
              <Image
                src={JSON.parse(currentAffair.imageUrl)[0]}
                alt={JSON.parse(currentAffair.imageUrl)[1]}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
          <div className="max-w-4xl mx-auto">
            <div className="mt-4 mb-6">
              <p className="text-xl font-bold text-center text-[var(--surface-dark)] dark:text-white">
                {currentAffair?.metadata ? 
                  (() => {
                    try {
                      const parsed = JSON.parse(currentAffair.metadata);
                      return parsed.metaTitle || 'Title Of page';
                    } catch (e) {
                      return 'Title Of page';
                    }
                  })()
                  : 'Title Of page'}
              </p>
              <div className="w-full h-[3px] bg-[var(--nav-primary)] rounded-full mt-2"></div>
            </div>
            <div className="mt-2 mb-4">
              <p className="text-sm text-[var(--text-tertiary)] dark:text-gray-300">
                {currentAffair?.metadata ? 
                  (() => {
                    try {
                      const parsed = JSON.parse(currentAffair.metadata);
                      return parsed.metaDescription || 'Description Of page';
                    } catch (e) {
                      return 'Description Of page';
                    }
                  })()
                  : 'Description Of page'}
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {currentAffair?.type === 'daily' && (
          <SearchBar />
        )}
        <div className="grid grid-cols-1 gap-6 mt-5 mb-4">
          {sortedArticles.length > 0 ? (
            sortedArticles.map((article) => (
              <div
                key={article.id}
                className={`group ${
                  currentAffair?.type === 'daily'
                    ? 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all duration-200'
                    : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all duration-200'
                }`}
              >
                
                {currentAffair?.type === 'daily' ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--surface-darker)] dark:text-white">
                        {article.title}
                      </h3>
                    </div>
                    <Link
                      href={article.link || `/current-affairs/${category}/${article.slug.split("/").pop()}`}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                      Read More
                    </Link>
                  </div>
                ) : (
                  <>
                <div className="flex flex-col items-center gap-4">
                  <Link
                    href={`/current-affairs/${category}/${article.slug
                      .split("/")
                      .pop()}`}
                    className="text-[var(--primary)] hover:text-[var(--secondary)] dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <h2 className="text-xl sm:text-2xl font-semibold">
                      {article.title}
                    </h2>
                  </Link>
                  
                  <div className="w-full">
                    <p className="text-sm text-[var(--text-tertiary)] dark:text-gray-300">
                      {article.metadata ? 
                        (() => {
                          try {
                            const parsed = JSON.parse(article.metadata);
                            return parsed.description || 'In-depth analysis of important current events and their relevance for UPSC Civil Services Examination.';
                          } catch (e) {
                            return 'In-depth analysis of important current events and their relevance for UPSC Civil Services Examination.';
                          }
                        })()
                        : 'In-depth analysis of important current events and their relevance for UPSC Civil Services Examination.'}
                    </p>
                    <div className="w-full h-[2px] bg-[var(--primary)] rounded-full mt-2"></div>
                  </div>
                </div>
                
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-[var(--text-disabled)] mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-[var(--surface-darker)] dark:text-white mb-2">
                No Articles Found
              </h3>
              <p className="text-[var(--text-tertiary)] dark:text-gray-300">Check back later for new content.</p>
            </div>
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
                prose-h1:text-gray-800 dark:prose-h1:text-gray-100
                prose-h1:leading-tight
                
                prose-h2:text-2xl sm:prose-h2:text-3xl
                prose-h2:text-gray-700 dark:prose-h2:text-gray-200
                prose-h2:pb-2
                prose-h2:after:content-['']
                prose-h2:after:block
                prose-h2:after:w-16
                prose-h2:after:h-[2px]
                prose-h2:after:mt-2
                prose-h2:after:bg-yellow-500
                prose-h2:after:rounded-full
                
                prose-h3:text-xl sm:prose-h3:text-2xl
                prose-h3:text-gray-600 dark:prose-h3:text-gray-300
                prose-h3:font-medium
                prose-h3:pl-3
                
                prose-h4:text-lg sm:prose-h4:text-xl
                prose-h4:text-gray-600 dark:prose-h4:text-gray-300
                prose-h4:font-medium
                prose-h4:before:content-['§']
                prose-h4:before:text-yellow-500
                prose-h4:before:mr-2
                prose-h4:before:opacity-70
                
                prose-p:text-gray-600 dark:prose-p:text-gray-300
                prose-p:leading-relaxed
                prose-p:tracking-wide
                prose-strong:text-gray-800 dark:prose-strong:text-gray-100
                prose-a:text-blue-600 dark:prose-a:text-blue-400
                prose-a:no-underline
                prose-a:border-b-2
                prose-a:border-blue-200
                prose-a:transition-colors
                prose-a:hover:border-blue-500
                prose-blockquote:border-l-blue-500
                prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-slate-700/30
                prose-blockquote:p-3 sm:prose-blockquote:p-4
                prose-blockquote:rounded-r-lg
                prose-pre:bg-gray-50 dark:prose-pre:bg-slate-800/50
                prose-pre:rounded-lg
                prose-pre:p-3 sm:prose-pre:p-4
                prose-img:rounded-lg
                prose-img:shadow-md dark:prose-img:border dark:prose-img:border-slate-700/50
                prose-ul:list-disc
                prose-ul:pl-4 sm:prose-ul:pl-6
                prose-ol:list-decimal
                prose-ol:pl-4 sm:prose-ol:pl-6
                [&>*]:w-full"
          dangerouslySetInnerHTML={{ __html: currentAffair?.content || "" }}
        ></div>
      </div>
    </CurrentAffairsLayout>
    </main>
    </>
  );
};

export default CurrentAffairsSectionPage;