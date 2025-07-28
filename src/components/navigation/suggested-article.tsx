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
        const filteredArticles = Array.from(uniqueArticles.values()).slice(0, 15);
        
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

  // Simple and reliable auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (!scrollContainerRef.current || suggestedArticles.length <= 1) return;

    const container = scrollContainerRef.current;
    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per frame
    let isPaused = false;
    let animationFrameId: number;

    const scroll = () => {
      if (!scrollContainerRef.current || isPaused) return;
      
      const { scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;
      
      // If we've scrolled to the end, reset to start
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
        container.scrollTo({ left: 0, behavior: 'auto' });
        // Wait a bit before starting to scroll again
        setTimeout(() => {
          animationFrameId = requestAnimationFrame(scroll);
        }, 2000); // 2 second pause at the end
        return;
      }
      
      // Update scroll position
      scrollPosition += scrollSpeed;
      container.scrollTo({ left: scrollPosition, behavior: 'auto' });
      
      // Continue the animation
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Start scrolling after a short delay
    const timeout = setTimeout(() => {
      animationFrameId = requestAnimationFrame(scroll);
    }, 1000);

    // Pause on hover
    const pauseScroll = () => {
      isPaused = true;
    };
    
    const resumeScroll = () => {
      if (isPaused) {
        isPaused = false;
        animationFrameId = requestAnimationFrame(scroll);
      }
    };

    if (container) {
      container.addEventListener('mouseenter', pauseScroll);
      container.addEventListener('touchstart', pauseScroll);
      container.addEventListener('mouseleave', resumeScroll);
      container.addEventListener('touchend', resumeScroll);
    }

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener('mouseenter', pauseScroll);
        container.removeEventListener('touchstart', pauseScroll);
        container.removeEventListener('mouseleave', resumeScroll);
        container.removeEventListener('touchend', resumeScroll);
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
          "w-full mx-auto lg:absolute lg:right-0 lg:top-24 transition-all duration-200",
          isSticky ? "lg:sticky lg:top-24" : "lg:relative lg:top-0",
          className
        )}
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
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
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2 scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                maskImage: 'linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)',
                WebkitMaskImage: '-webkit-linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)',
                scrollBehavior: 'auto', // Disable default smooth scrolling for better control
              }}
            >
              {suggestedArticles.map((article) => (
                <div 
                  key={article.id}
                  className="flex-shrink-0 w-64 rounded-lg overflow-hidden transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 group"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <Link
                    href={`/articles/${article.slug}`}
                    className="block h-full p-4"
                  >
                    <div className="flex flex-col">
                      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 mb-3">
                        <Image
                          src={article.image || '/placeholder-article.jpg'}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 256px"
                          priority={false}
                        />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors duration-200 mb-2 text-center">
                        {article.title}
                      </h4>
                      {article.tags?.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1">
                          {article.tags.slice(0, 2).map((tag, i) => (
                            <span 
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                            >
                              {tag.name}
                            </span>
                          ))}
                          {article.tags.length > 2 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{article.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
          </div>
          {/* Enhanced scroll indicators */}
          {suggestedArticles.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {suggestedArticles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      const container = scrollContainerRef.current;
                      const scrollPosition = index * (container.scrollWidth / suggestedArticles.length);
                      container.scrollTo({
                        left: scrollPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                  aria-label={`Go to article ${index + 1}`}
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