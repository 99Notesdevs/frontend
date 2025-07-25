'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon } from "lucide-react";
import { api } from '@/config/api/route';
import { env } from '@/config/env';

interface SearchResultItem {
  id: string;
  title: string;
  slug: string;
  type: 'page' | 'blog' | 'current-affair';
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: Array<{
    id: number;
    name: string;
  }>;
}

const itemsPerPage = 9;

export default function SearchResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      try {
        setIsLoading(true);
        const searchUrl = `/search/global?query=${encodeURIComponent(query)}`;
        console.log('Fetching search results from:', searchUrl);
        
        const response = await api.get<SearchResultItem[] | { [key: string]: SearchResultItem[] }>(searchUrl);
        console.log('Search API Response:', response);
        
        let searchResults: SearchResultItem[] = [];
        
        // If response is an array, use it directly
        if (Array.isArray(response)) {
          searchResults = response;
        } 
        // If response is an object with arrays as values, flatten them
        else if (response && typeof response === 'object') {
          searchResults = Object.values(response).flat();
        }
        
        console.log('Processed search results:', searchResults);
        setResults(searchResults);
        setTotalItems(searchResults.length);
        setTotalPages(1); // No pagination for now, show all results on one page
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("An error occurred while fetching search results. Please try again later.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'page':
        return 'Article';
      case 'blog':
        return 'Blog Post';
      case 'current-affair':
        return 'Current Affair';
      default:
        return type;
    }
  };

  // Loading skeleton component
  const CardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md dark:shadow-slate-900/30 border border-gray-200 dark:border-slate-700">
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-slate-700"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12 border rounded-lg bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
      <SearchIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" />
      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
        {error ? 'Error fetching results' : 'No results found'}
      </h3>
      <p className="mt-1 text-gray-500 dark:text-slate-400">
        {error ? (
          <span className="text-red-500 dark:text-red-400">{error}</span>
        ) : (
          `We couldn't find any results for "${query}". Try different keywords.`
        )}
      </p>
      {error && (
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );

  if (isLoading && results.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Search Results for: <span className="text-[var(--nav-primary)]">{query}</span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)] rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-r" role="alert">
          <p className="font-bold flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Error
          </p>
          <p className="mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 dark:bg-slate-900 min-h-screen px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Search Results for: <span className="text-[var(--nav-primary)]">{query}</span>
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-[var(--nav-primary)] to-[var(--nav-secondary)] rounded-full mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">
          Found {totalItems} {totalItems === 1 ? 'result' : 'results'} for your search
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {results.map((item, index) => (
            <div 
              key={`${item.id || 'item'}-${item.type || 'unknown'}-${index}`}
              className="group flex items-start p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => router.push(`/${item.slug}`)}
            >
              {/* Thumbnail */}
              {item.imageUrl && (
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden mr-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title || 'Result thumbnail'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                    {item.type ? getTypeLabel(item.type) : 'Result'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title || 'Untitled'}
                </h3>
                
                {item.content && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {item.content.replace(/<[^>]*>?/gm, '')}
                  </p>
                )}
                
                {item.slug && (
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    {item.slug}
                  </div>
                )}
              </div>
              
              {/* Arrow icon */}
              <div className="ml-4 text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4">
          <EmptyState />
        </div>
      )}
    </div>
  );
}
