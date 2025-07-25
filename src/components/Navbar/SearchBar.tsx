"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/config/api/route";

interface SearchBarProps {
  onClose?: () => void;
  compact?: boolean;
}

const SearchBar = ({ onClose, compact = false }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Use Next.js router for navigation

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.get<any[] | { [key: string]: any[] }>(
        `/search/global?query=${encodeURIComponent(searchQuery)}`
      );

      let searchResults: any[] = [];
      
      // If response is an array, use it directly
      if (Array.isArray(response)) {
        searchResults = response;
      } 
      // If response is an object with arrays as values, flatten them
      else if (response && typeof response === 'object') {
        searchResults = Object.values(response).flat();
      }
      
      setResults(searchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Trigger search
    handleSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      // Navigate to search results page with query parameter
      router.push(`/search-result?q=${encodeURIComponent(query)}`);
      if (onClose) onClose();
    }
  };

  const handleResultClick = (slug: string) => {
    // Redirect to the specific slug
    router.push(`/${slug}`);
  };

  return (
    <div className={`relative w-full ${compact ? 'max-w-full' : 'max-w-2xl mx-auto'}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
            compact ? 'py-2 text-sm' : 'py-3 text-base'
          }`}
          placeholder="Search for articles, topics, or resources..."
          autoFocus={!compact}
        />
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {isFocused && query && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg dark:shadow-slate-900/50">
          {isLoading ? (
            <div className="p-4 text-sm text-gray-500 dark:text-slate-400">
              Loading...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-1">
              {results.map((result: any, index: number) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-800 dark:text-slate-200 transition-colors duration-200"
                  onClick={() => handleResultClick(result.slug)}
                >
                  {/* Display image if available */}
                  {result.imageUrl && (
                    <img
                      src={result.imageUrl}
                      alt={result.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <div className="ml-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {result.title || "Untitled"}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-slate-400">
                      {result.content?.replace(/<[^>]*>/g, "").slice(0, 50)}...
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-500 dark:text-slate-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
