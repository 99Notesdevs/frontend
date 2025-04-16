"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { env } from "@/config/env";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  publishedDate: string;
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
  const itemsPerPage = 2;

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
      const response = await fetch(`${env.API}/blog/${searchQuery}`);
      
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchBlogs()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
      <div className="container mx-auto px-4 py-8 bg-gray-100 rounded-xl shadow-lg my-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8 py-5">
          Blogs
        </h1>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <div className="w-full md:w-1/4">
            <div className="mb-4 p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="border border-gray-200 p-3 rounded-lg w-full mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-3 rounded-lg w-full hover:bg-blue-700 transition-all duration-300 mb-4 font-medium shadow-sm hover:shadow-md"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Search'}
                </button>
              </form>
            </div>
          </div>
          <div className="w-full md:w-3/4">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              {filteredBlogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No blogs found' : 'No blogs available'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="block"
                      >
                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h3>
                          <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{new Date(blog.publishedDate).toLocaleDateString()}</span>
                            <span className="text-blue-600 hover:text-blue-800 font-medium">Read More</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              {filteredBlogs.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded ${
                          page === currentPage
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 1024px) and (max-width: 1550px) {
          .container {
            padding: 2.5rem;
          }
          .text-4xl {
            font-size: 2.5rem;
          }
          .grid-cols-1 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .md:w-1/4 {
            width: 30%;
          }
          .md:w-3/4 {
            width: 70%;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogsPage;
