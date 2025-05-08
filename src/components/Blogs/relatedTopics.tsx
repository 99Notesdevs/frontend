"use client";
import { useEffect, useState } from 'react';
import { env } from '@/config/env';

interface Blog {
  id: number;
  slug: string;
  title: string;
}

interface RelatedTopicsProps {
  currentBlogSlug: string;
}

export const RelatedTopics = ({ currentBlogSlug }: RelatedTopicsProps) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 6;
  const skip = 0;

  useEffect(() => {
    const fetchRandomBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${env.API}/blog?skip=${skip}&take=${itemsPerPage}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const result = await response.json();
        
        // Check if data exists and is an array
        if (!result.data || !Array.isArray(result.data)) {
          throw new Error('Invalid response format');
        }

        // Filter out the current blog and shuffle the results
        const filteredBlogs = result.data.filter((blog: Blog) => blog.slug !== currentBlogSlug);        const shuffled = [...filteredBlogs].sort(() => 0.5 - Math.random());
        
        // If we have less than itemsPerPage blogs after filtering, show all we have
        const displayBlogs = shuffled.length >= itemsPerPage 
          ? shuffled.slice(0, itemsPerPage) 
          : shuffled;

        setBlogs(displayBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomBlogs();
  }, [currentBlogSlug]);

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Related Topics</h2>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Related Topics</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded w-3/4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-gray-200 transition-all duration-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
        Related Topics
      </h2>
      {blogs.length === 0 ? (
        <p className="text-gray-500 text-sm pt-4">No related topics found</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div 
              key={blog.id} 
              className="group relative hover:bg-gray-50 rounded-lg p-3 transition-all duration-200"
            >
              <h3 className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">
                <a href={`/blog/${blog.slug}`} className="block">
                  {blog.title}
                </a>
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};