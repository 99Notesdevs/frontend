"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
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
}

const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchBlogs = async (searchTerm: string = "") => {
    try {
      setError(null);
      setLoading(true);

      const skip = (currentPage - 1) * itemsPerPage;
      const url = searchTerm
        ? `${env.API}/blog/search?skip=${skip}&take=${itemsPerPage}&query=${encodeURIComponent(searchTerm)}`
        : `${env.API}/blog?skip=${skip}&take=${itemsPerPage}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      const blogsData = data.data || [];

      // Get total count for pagination
      const countResponse = await fetch(`${env.API}/blog/count`);
      if (!countResponse.ok) {
        throw new Error("No blogs available");
      }
      const countData = await countResponse.json();
      const totalItems = countData.data || 0;

      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, itemsPerPage]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredBlogs(blogs);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${env.API}/blog/slug/${searchQuery}`);
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to search blogs");
      }

      const data = await response.json();
      const searchResults = data.data || [];
      setFilteredBlogs(searchResults);
      setTotalPages(Math.ceil(searchResults.length / itemsPerPage));
      setCurrentPage(1); // Reset to first page when searching
    } catch (error) {
      console.error("Error searching blogs:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <body>
      <div className="flex justify-center items-center min-h-screen bg-[var(--bg-main)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
      </body>
    );
  }

  if (error) {
    return (
      <body>
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
      </body>
    );
  }

  return (
    <body>
    <div className="min-h-screen bg-[var(--bg-elevated)] pt-8 sm:pt-28">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 flex flex-col">
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
                className="w-full sm:w-auto px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-base font-medium"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Blog posts grid */}
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
                    createdAt: new Date(blog.createdAt),
                    slug: blog.slug,
                    content: blog.content,
                    metadata: blog.metadata, 
                    imageUrl: blog.imageUrl,
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
    </body>
  );
};

export default BlogsPage;
