"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  readTime?: string;
  date?: string;
}

interface SuggestedArticlesProps {
  articles: Article[];
  currentArticleId: string;
  className?: string;
}

export function SuggestedArticles({
  articles,
  currentArticleId,
  className,
}: SuggestedArticlesProps) {
  const [isSticky, setIsSticky] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Filter out current article and limit to 3 suggestions
  const suggestedArticles = articles
    .filter((article) => article.id !== currentArticleId)
    .slice(0, 3);

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
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            You might also like
          </h3>
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
                      {article.readTime && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {article.readTime}
                        </p>
                      )}
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