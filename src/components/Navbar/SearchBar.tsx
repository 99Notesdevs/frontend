"use client";

import { env } from "@/config/env";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
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
      const response = await fetch(
        `${env.API}/search/global?query=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();

      // Convert the response object into an array of results
      const formattedResults = Object.values(data);
      setResults(formattedResults);
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

  const handleResultClick = (slug: string) => {
    // Redirect to the specific slug
    router.push(`/${slug}`);
  };

  return (
    <div className="relative flex flex-col items-center pr-15">
      <div className={`relative group bg-white border border-black w-full`}>
        <input
          type="text"
          placeholder="Search notes, subjects..."
          className="w-full py-1.5 pl-8 pr-3 text-sm text-[var(--text-strong)] placeholder-[var(--text-tertiary)] 
                    bg-transparent border-none outline-none"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-2.5">
          <svg
            className="w-4 h-4 text-[var(--text-tertiary)]"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isFocused && query && (
        <div className="absolute top-full mt-2 w-full bg-white border border-[var(--border-light)] rounded-lg shadow-lg z-10">
          {isLoading ? (
            <div className="p-4 text-sm text-[var(--text-tertiary)]">Loading...</div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-[var(--border-light)]">
              {results.map((result: any, index: number) => (
                <li
                  key={index}
                  className="p-2 hover:bg-[var(--bg-main)] cursor-pointer text-sm text-[var(--text-strong)] flex items-start gap-4"
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
                  <div>
                    <h3 className="font-semibold">
                      {result.title || "Untitled"}
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {result.content.replace(/<[^>]*>/g, "").slice(0, 50)}...
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-[var(--text-tertiary)]">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
