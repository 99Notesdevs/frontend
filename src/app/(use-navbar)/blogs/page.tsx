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
        throw new Error('Failed to fetch blogs');
      }

      const data = await response.json();
      const blogsData = data.data || [];
      
      // Get total count for pagination
      const countResponse = await fetch(`${env.API}/blog/count`);
      if (!countResponse.ok) {
        throw new Error('No blogs available');
      }
      const countData = await countResponse.json();
      const totalItems = countData.data || 0;

      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
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
        throw new Error('Failed to search blogs');
      }

      const data = await response.json();
      const searchResults = data.data || [];
      setFilteredBlogs(searchResults);
      setTotalPages(Math.ceil(searchResults.length / itemsPerPage));
      setCurrentPage(1); // Reset to first page when searching
    } catch (error) {
      console.error('Error searching blogs:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => fetchBlogs()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-8">Blogs</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
        {filteredBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={{
              id: blog.id,
              title: blog.title,
              createdAt: new Date(blog.createdAt),
              slug: blog.slug,
              content: blog.content,
              metadata: blog.metadata,
              imageUrl: blog.imageUrl
            }}
          />
        ))}
      </div>

      <div className="flex justify-center items-center mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="mx-4">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogsPage;
