"use client";
import React, { useState, useEffect } from "react";
import { env } from "@/config/env";
import BlogCard from "@/components/Blogs/BlogCard";

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
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async (searchTerm: string = "") => {
    try {
      setError(null);
      setLoading(true);

      let url: string;
      if (searchTerm) {
        // Use title search endpoint if there's a search term
        url = `${env.API}/blog/title/${encodeURIComponent(searchTerm)}`;
      } else {
        // Use paginated endpoint for regular listing
        const skip = (currentPage - 1) * ITEMS_PER_PAGE;
        url = `${env.API}/blog?skip=${skip}&take=${ITEMS_PER_PAGE}`;
      }

      // Fetch blogs
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      const blogsData = data.data || [];

      // Get total count (only needed for pagination when not searching)
      let totalItems = blogsData.length;
      if (!searchTerm) {
        try {
          const countResponse = await fetch(`${env.API}/blog/count`);
          if (countResponse.ok) {
            const countData = await countResponse.json();
            totalItems = countData.data || 0;
          }
        } catch (err) {
          console.warn("Could not fetch total count:", err);
        }
      }

      setFilteredBlogs(blogsData);
      setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setFilteredBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchBlogs('');
      return;
    }
    setCurrentPage(1);
    fetchBlogs(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchBlogs('');
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--bg-main)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-main)]">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => fetchBlogs()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient:bg-gray-50 to bg-white pt-8 ">
      <div className="w-full max-w-[2000px] px-4 sm:px-8 flex flex-col">
        {/* Title and search section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--surface-darker)] text-left">
            Blog Posts
          </h1>
          <form onSubmit={handleSearch} className="w-full sm:w-auto max-w-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
                className="flex-1 px-4 py-2 text-base border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-0"
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
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Blog posts grid */}
        <div className="mb-4">
          <p className="text-sm text-[var(--text-tertiary)]">
            Showing {filteredBlogs.length} of {totalPages * ITEMS_PER_PAGE} blog posts
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--text-tertiary)] text-lg">No blogs found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-200">
                <BlogCard
                  blog={{
                    id: blog.id,
                    title: blog.title,
                    slug: blog.slug,
                    content: blog.content,
                    metadata: blog.metadata,
                    imageUrl: (() => {
                      try {
                        const parsed = JSON.parse(blog.imageUrl);
                        return parsed[0] || '';
                      } catch {
                        console.warn('Invalid image URL format for blog:', blog.title);
                        return '';
                      }
                    })(),
                    alt: (() => {
                      try {
                        const parsed = JSON.parse(blog.imageUrl);
                        return parsed[1] || '';
                      } catch {
                        return '';
                      }
                    })()
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination - simplified style */}
        <div className="flex justify-center mt-8 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
            >
              ← Previous
            </button>
            <span className="text-sm font-medium text-[var(--text-strong)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
