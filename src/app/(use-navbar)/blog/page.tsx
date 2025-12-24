"use client";
import React, { useState, useEffect, useRef } from "react";
import BlogCard from "@/components/Blogs/BlogCard";
import { api } from "@/config/api/route";

interface Blog {
  id: string;
  title: string;
  imageUrl: string;
  metadata: string;
  createdAt: string;
  content: string;
  slug: string;
  alt: string;
}

const ITEMS_PER_PAGE = 12;

const BlogsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Ref to track the latest request ID for logical cancellation
  const requestIdRef = useRef(0);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
      // when a new search term is applied, reset to first page
      setCurrentPage(1);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchBlogs = async (searchTerm: string = "") => {
    // Increment request id and capture it locally
    const currentRequestId = ++requestIdRef.current;

    try {
      setError(null);
      setLoading(true);

      let url: string;
      if (searchTerm) {
        url = `/blog/title/${encodeURIComponent(searchTerm)}`;
      } else {
        const skip = (currentPage - 1) * ITEMS_PER_PAGE;
        url = `/blog?skip=${skip}&take=${ITEMS_PER_PAGE}`;
      }

      const response = (await api.get(url)) as {
        success: boolean;
        data: Blog[] | null;
      };

      // If a newer request has started, ignore this response
      if (currentRequestId !== requestIdRef.current) return;

      if (!response.success) {
        throw new Error("Failed to fetch blogs");
      }

      const blogsData = response.data || [];

      let items = totalItems;
      if (!searchTerm && items === 0) {
        try {
          const countResponse = (await api.get(`/blog/count`)) as {
            success: boolean;
            data: number | null;
          };

          // Again, ignore if this request is outdated
          if (currentRequestId !== requestIdRef.current) return;

          if (countResponse.success) {
            items = countResponse.data || 0;
            setTotalItems(items);
          }
        } catch (err) {
          console.warn("Could not fetch total count:", err);
        }
      }

      if (items === 0 && !searchTerm) {
        items = blogsData.length;
        setTotalItems(items);
      }

      setFilteredBlogs(blogsData);
      setTotalPages(Math.max(1, Math.ceil(items / ITEMS_PER_PAGE)));
    } catch (err) {
      // Ignore errors from outdated requests
      if (currentRequestId !== requestIdRef.current) return;

      console.error("Error fetching blogs:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setFilteredBlogs([]);
    } finally {
      // Only clear loading if this is the latest request
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBlogs(debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-900 p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
          Loading blog posts...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-900 p-6">
        <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-red-500 text-lg mb-6 dark:text-red-400">{error}</p>
          <button
            onClick={() => fetchBlogs(debouncedSearchQuery)}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-8">
      <div className="w-full max-w-[2000px] px-4 sm:px-8 flex flex-col">
        {/* Title and search section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--surface-darker)] dark:text-white text-left">
            Blog Posts
          </h1>
          <form onSubmit={handleSearch} className="w-full sm:w-auto max-w-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
                className="flex-1 px-4 py-2 text-base border border-[var(--border-light)] dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-0"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-base font-medium"
              >
                Search
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Blog posts grid */}
        <div className="mb-4">
          <p className="text-sm text-[var(--text-tertiary)] dark:text-gray-400">
            Showing {filteredBlogs.length} of{" "}
            {totalItems || totalPages * ITEMS_PER_PAGE} blog posts
            {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
          </p>
        </div>
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--text-tertiary)] dark:text-gray-400 text-lg">
              No blogs found. Try a different search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => {
              let imageUrl = "";
              let alt = "";

              try {
                const parsed = JSON.parse(blog.imageUrl);
                imageUrl = Array.isArray(parsed) ? parsed[0] : parsed;
                alt =
                  Array.isArray(parsed) && parsed[1] ? parsed[1] : blog.title;
              } catch (e) {
                console.warn("Invalid image URL format for blog:", blog.title);
                imageUrl = blog.imageUrl || "";
                alt = blog.alt || blog.title;
              }

              return (
                <BlogCard
                  key={blog.id}
                  blog={{
                    id: blog.id,
                    title: blog.title,
                    slug: blog.slug,
                    content: blog.content,
                    metadata: blog.metadata,
                    imageUrl: imageUrl,
                    alt: alt,
                    author: "99Notes",
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Pagination - simplified style */}
        <div className="flex justify-center mt-12 mb-16">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>

            <div className="hidden md:flex space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate page numbers to show (current page in the middle when possible)
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-4 py-2 text-gray-700 dark:text-gray-400">
                  ...
                </span>
              )}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {totalPages}
                </button>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>

            <div className="hidden md:block text-sm text-gray-700 dark:text-gray-400 ml-4">
              Page {currentPage} of {totalPages}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
