"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/config/api/route";

interface SearchBarBlogsProps {
  onResultClick: (blog: any) => void;
  onClose?: () => void;
  compact?: boolean;
}

const SearchBarBlogs = ({ onResultClick, onClose, compact = false }: SearchBarBlogsProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await api.get<{ 
        success: boolean; 
        data: Array<{
          id: number;
          slug: string;
          title: string;
          content: string;
          metadata: string;
          imageUrl: string;
          order: number;
          createdAt: string;
          updatedAt: string;
        }> 
      }>(`/blog/search?query=${encodeURIComponent(searchQuery)}`);
      
      if (response.success) {
        setResults(Array.isArray(response.data) ? response.data : []);
      } else {
        setResults([]);
      }
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        console.error("Error fetching search results:", error);
        setResults([]);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim()) {
      setIsLoading(true);
      debounceTimerRef.current = setTimeout(() => {
        handleSearch(value);
      }, 300);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className={`relative w-full ${compact ? "max-w-full" : "max-w-2xl"}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className={`w-full px-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--admin-bg-primary)] ${
            compact ? "py-2 text-sm" : "py-2 text-base"
          }`}
          placeholder="Search blogs by title or content..."
          autoFocus={!compact}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-8 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
        {isLoading ? (
          <div className="absolute right-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
          </div>
        ) : (
          <div className="absolute right-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {isFocused && query && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {isLoading ? (
            <div className="p-2 text-sm text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-1 max-h-60 overflow-y-auto">
              {results.map((result) => (
                <li
                  key={result.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur
                    onResultClick(result);
                    setQuery("");
                    setResults([]);
                  }}
                >
                  <div className="font-medium">{result.title}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {result.content?.replace(/<[^>]*>/g, "").substring(0, 60)}...
                  </div>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="p-2 text-sm text-gray-500">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBarBlogs;
