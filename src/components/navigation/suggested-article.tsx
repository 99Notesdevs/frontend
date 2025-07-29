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
      <div className={cn("w-full", className)}>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-800 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="flex space-x-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-64">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[16/9] mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (suggestedArticles.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={sidebarRef}
        className={cn(
          "w-full transition-all duration-200",
          isSticky ? "lg:sticky lg:top-6" : "relative"
        )}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* Header */}
          <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-2.5-3-2.5 3-2.5-3L7 12H5V5z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  You might also like
                </h3>
              </div>
              {articleCount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                  {articleCount}+ related articles
                </span>
              )}
            </div>
          </div>
          
          {/* Articles Carousel */}
          <div className="relative py-4">
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-5 pb-6 px-5 scrollbar-hide snap-x"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth',
                scrollPadding: '0 20px',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {suggestedArticles.map((article) => (
                <div 
                  key={article.id}
                  className="flex-shrink-0 w-64 snap-start group"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <Link
                    href={`/${article.slug}`}
                    className="block h-full p-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    <div className="flex flex-col h-full">
                      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700/50 mb-3 group-hover:shadow-md transition-all duration-300">
                        <Image
                          src={article.image || '/placeholder-article.jpg'}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 256px"
                          priority={false}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors duration-200 mb-2 px-1">
                        {article.title}
                      </h4>
                      {article.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 px-1 mt-auto">
                          {article.tags.slice(0, 2).map((tag, i) => (
                            <span 
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 transition-colors duration-200 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50"
                            >
                              {tag.name}
                            </span>
                          ))}
                          {article.tags.length > 2 && (
                            <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                              +{article.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Gradient fade effect */}
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
            
            {/* Scroll indicators */}
            {suggestedArticles.length > 1 && (
              <div className="flex justify-center gap-2 mt-4 px-2">
                {suggestedArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (scrollContainerRef.current) {
                        const container = scrollContainerRef.current;
                        const cardWidth = 256; // w-64
                        const scrollPosition = index * (cardWidth + 20); // card width + gap
                        container.scrollTo({
                          left: scrollPosition,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className={`w-2.5 h-1.5 rounded-full transition-all duration-200 ${
                      index === 0 ? 'w-6 bg-blue-500' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    aria-label={`Go to article ${index + 1}`}
                  />
                ))}
              </div>
            )}
            
            {/* Navigation arrows for larger screens */}
            <button 
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({
                    left: -200,
                    behavior: 'smooth'
                  });
                }
              }}
              className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({
                    left: 200,
                    behavior: 'smooth'
                  });
                }
              }}
              className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
          width: 0;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-start {
          scroll-snap-align: start;
        }
      `}</style>
    </div>
  );
}

export default SuggestedArticles;