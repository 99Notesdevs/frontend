import React, { useState, useEffect } from "react";
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

type Params = {
  category: string;
};

// Helper function to safely parse JSON
const safeJsonParse = <T,>(jsonString: string | undefined, defaultValue: T): T => {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.warn('Failed to parse JSON:', e);
    return defaultValue;
  }
};

async function getPage(slug: string): Promise<CurrentAffair | null> {
  try {
    const fullSlug = `current-affairs/${slug}`;
    const normalizedSlug = fullSlug.replace(/-/g, ' ');
    const response = await fetch(
      `${env.API}/currentAffair/slug/${encodeURIComponent(normalizedSlug)}`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );
    
    if (!response.ok) return null;
    
    const res = await response.json();
    return res.data as CurrentAffair || null;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

type OpenGraphType = 
  | "article" 
  | "website" 
  | "book" 
  | "profile" 
  | "music.song" 
  | "music.album" 
  | "music.playlist" 
  | "music.radio_station" 
  | "video.movie" 
  | "video.episode" 
  | "video.tv_show" 
  | "video.other";

type TwitterCardType = 
  | "summary" 
  | "summary_large_image" 
  | "app" 
  | "player";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = params;
  const page = await getPage(category);

  if (!page?.metadata) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  const parsedMetadata = safeJsonParse<{
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    robots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: OpenGraphType;
    twitterCard?: TwitterCardType;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    canonicalUrl?: string;
  }>(page.metadata, {});

  const title = parsedMetadata.metaTitle || page.title || "Default Title";
  const description = parsedMetadata.metaDescription || "Default Description";
  const canonicalUrl = parsedMetadata.canonicalUrl || `https://example.com/current-affairs/${category}`;
  const ogImage = parsedMetadata.ogImage || "https://example.com/default-image.jpg";
  const twitterImage = parsedMetadata.twitterImage || ogImage;

  return {
    title,
    description,
    keywords: parsedMetadata.metaKeywords || "Default keywords",
    robots: parsedMetadata.robots || "index, follow",
    openGraph: {
      title: parsedMetadata.ogTitle || title,
      description: parsedMetadata.ogDescription || description,
      url: canonicalUrl,
      images: [{ url: ogImage }],
      type: parsedMetadata.ogType || "website",
    },
    twitter: {
      card: parsedMetadata.twitterCard || "summary_large_image",
      title: parsedMetadata.twitterTitle || title,
      description: parsedMetadata.twitterDescription || description,
      images: [{ url: twitterImage }],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

const CurrentAffairsSectionPage = async ({ params }: { params: Params }) => {
  const { category } = params;
  const fullSlug = `current-affairs/${category}`;
  const normalizedSlug = fullSlug.replace(/-/g, ' ');

  // Add loading state
  const [currentAffair, setCurrentAffair] = useState<CurrentAffair | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch section data
        const sectionResponse = await fetch(
          `${env.API}/currentAffair/slug/${encodeURIComponent(normalizedSlug)}`,
          { next: { revalidate: 60 } }
        );

        if (!sectionResponse.ok) throw new Error('Failed to fetch section data');
        
        const sectionData = await sectionResponse.json();
        if (sectionData.status === 'success' && sectionData.data) {
          setCurrentAffair(sectionData.data);
        } else {
          throw new Error('No data returned');
        }

        // Fetch articles
        const articlesResponse = await fetch(`${env.API}/currentArticle`);
        if (!articlesResponse.ok) throw new Error('Failed to fetch articles');
        
        const articlesData = await articlesResponse.json();
        if (articlesData.status === 'success' && articlesData.data) {
          const filteredArticles = articlesData.data.filter(
            (article: Article) => article.parentSlug === fullSlug
          );
          setArticles(filteredArticles);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [normalizedSlug, fullSlug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error || !currentAffair) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-[var(--surface-darker)] mb-4">
            {error || 'Page not found'}
          </h1>
          <Link 
            href="/current-affairs" 
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  // Parse metadata once
  const parsedMetadata = safeJsonParse<{
    schemaData?: any;
    // Add other metadata fields as needed
  }>(currentAffair.metadata, {});

  // Handle JSON-LD schema
  const jsonLD = typeof parsedMetadata.schemaData === 'string'
    ? parsedMetadata.schemaData
    : JSON.stringify(parsedMetadata.schemaData || {});

  // Handle image URL safely
  let imageSrc = '';
  let imageAlt = '';
  try {
    const parsedImage = safeJsonParse<string[]>(
      currentAffair.imageUrl || '[]',
      []
    );
    imageSrc = parsedImage[0] || '';
    imageAlt = parsedImage[1] || '';
  } catch (e) {
    console.warn('Invalid image URL format');
  }

  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    // Handle potentially undefined createdAt values
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <>
      {/* Add JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLD }}
      />
      
      <main>
        <CurrentAffairsLayout>
          {/* Hero Section */}
          <div className="px-4 py-6">
            <div className="container mx-auto">
              {/* Image */}
              {imageSrc && (
                <div className="relative aspect-video w-full mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="max-w-4xl mx-auto">
                <div className="mt-4 mb-6">
                  <p className="text-xl font-bold text-center text-[var(--surface-dark)]">
                    {currentAffair?.metadata ? 
                      safeJsonParse<{ metaTitle?: string }>(currentAffair.metadata, {}).metaTitle || 'Title Of page'
                      : 'Title Of page'}
                  </p>
                  <div className="w-full h-[3px] bg-[var(--nav-primary)] rounded-full mt-2"></div>
                </div>
                <div className="mt-2 mb-4">
                  <p className="text-sm text-[var(--text-tertiary)]">
                    {currentAffair?.metadata ? 
                      safeJsonParse<{ metaDescription?: string }>(currentAffair.metadata, {}).metaDescription || 'Description Of page'
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
                        ? 'bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-lg transition-all duration-200'
                        : 'bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-200'
                    }`}
                  >
                    
                    {currentAffair?.type === 'daily' ? (
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--surface-darker)]">
                            {article.title}
                          </h3>
                        </div>
                        <Link
                          href={article.link || `/current-affairs/${category}/${article.slug.split("/").pop()}`}
                          className="text-blue-600 font-medium hover:text-blue-800"
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
                          className="text-[var(--primary)] hover:text-[var(--secondary)] transition-colors"
                        >
                          <h2 className="text-xl sm:text-2xl font-semibold">
                            {article.title}
                          </h2>
                        </Link>
                        
                        <div className="w-full">
                          <p className="text-sm text-[var(--text-tertiary)]">
                            {article.metadata ? 
                              safeJsonParse<{ description?: string }>(article.metadata, {}).description || 'In-depth analysis of important current events and their relevance for UPSC Civil Services Examination.'
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
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
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
                  <h3 className="text-xl font-semibold text-[var(--surface-darker)] mb-2">
                    No Articles Found
                  </h3>
                  <p className="text-[var(--text-tertiary)]">Check back later for new content.</p>
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
              dangerouslySetInnerHTML={{ __html: currentAffair?.content || "" }}
            ></div>
          </div>
        </CurrentAffairsLayout>
      </main>
    </>
  );
};

export default CurrentAffairsSectionPage;