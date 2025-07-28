"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { env } from "@/config/env";
import { api } from "@/config/api/route";

export interface Template {
  id: string;
  name: string;
  description?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  questionNumber?: number;
  image: string;
  author?: {
    id: string;
    name: string;
  };
  admin?: {
    id: string;
    name: string;
  };
  metadata: string;
  slug: string;
  tags: Array<{ name: string }>;
  parentSlug: string;
  createdAt: string;
  template: Template;
  parent: Article | null;
  children: Article[];
  FAQ?: string; // FAQ data as stringified JSON
}

interface SuggestedArticlesProps {
  currentArticle: Article;
  className?: string;
}

export function SuggestedArticles({
  currentArticle,
  className,
}: SuggestedArticlesProps) {
  const [suggestedArticles, setSuggestedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [articleCount, setArticleCount] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Fetch related articles based on tags
  useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (!currentArticle.tags || currentArticle.tags.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch articles for all tags in parallel
        const tagPromises = currentArticle.tags.map(tag => 
          api.get<{ success: boolean; data: Article[] }>(`/tag/${tag.name}?skip=0&take=15`)
        );
        
        const responses = await Promise.all(tagPromises);
        
        // Combine and deduplicate articles
        const allArticles = responses.flatMap(response => 
          response.success ? response.data : []
        );
        
        // Create a map to deduplicate articles by ID
        const uniqueArticles = new Map<string, Article>();
        allArticles.forEach(article => {
          if (article.id !== currentArticle.id) {
            uniqueArticles.set(article.id, article);
          }
        });
        
        // Get the count of unique related articles
        const countResponse = await api.get<{ success: boolean; count: number }>(
          `/tag/count/${currentArticle.tags[0].name}`
        );
        
        // Convert map values back to array and take first 3
        const filteredArticles = Array.from(uniqueArticles.values()).slice(0, 3);
        
        setSuggestedArticles(filteredArticles);
        setArticleCount(countResponse.success ? countResponse.count : 0);
      } catch (error) {
        console.error('Error fetching related articles:', error);
        setSuggestedArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [currentArticle]);

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (!scrollContainerRef.current || suggestedArticles.length <= 1) return;

    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    let scrollLeft = 0;
    const scrollSpeed = 1; // pixels per frame

    const scroll = () => {
      if (!scrollContainerRef.current) return;
      
      scrollLeft += scrollSpeed;
      
      // If we've scrolled to the end, reset to start
      if (scrollLeft >= scrollWidth - clientWidth) {
        scrollLeft = 0;
        // Add a small delay before starting again
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }
        }, 500);
      } else {
        scrollContainerRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    };

    // Start scrolling after 0.5s delay
    const timeout = setTimeout(() => {
      scrollInterval.current = setInterval(scroll, 30); // ~30fps
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [suggestedArticles.length]);

  useEffect(() => {
    const cleanup = startAutoScroll();
    return () => {
      if (cleanup) cleanup();
    };
  }, [startAutoScroll]);

  useEffect(() => {
    if (!sidebarRef.current) return;

    const observer = new IntersectionObserver(
      ([e]) => {
        setIsSticky(e.intersectionRatio < 1);
      },
      { threshold: [1] }
    );

    observer.observe(sidebarRef.current);
    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className={cn("w-full max-w-xs mx-auto lg:mx-0 lg:absolute lg:right-0 lg:top-24", className)}>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Loading suggestions...
          </h3>
        </div>
      </div>
    );
  }

  if (suggestedArticles.length === 0) return null;

  return (
    <>
      <div
        ref={sidebarRef}
        className={cn(
          "w-full max-w-xs mx-auto lg:mx-0 lg:absolute lg:right-0 lg:top-24 transition-all duration-200",
          isSticky ? "lg:sticky lg:top-24" : "lg:relative lg:top-0",
          className
        )}
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              You might also like
            </h3>
            {articleCount > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {articleCount}+ related articles
              </span>
            )}
          </div>
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {suggestedArticles.map((article) => (
              <div 
                key={article.id}
                className="flex-shrink-0 w-64 rounded-lg p-2 transition-colors duration-200"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Link
                  href={`/articles/${article.slug}`}
                  className="group block h-full"
                >
                  <div className="flex items-start gap-3">
                    {article.image && (
                      <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                        {article.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {/* Scroll indicators */}
          {suggestedArticles.length > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              {suggestedArticles.map((_, index) => (
                <div 
                  key={index}
                  className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

export default SuggestedArticles;