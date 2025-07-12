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
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Related Topics</h2>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Related Topics</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-300 dark:border-slate-700 hover:shadow-md transition-all duration-300 p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
        Related Topics
      </h2>
      {blogs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm pt-4 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          No related topics found
        </p>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <div 
              key={blog.id} 
              className="group relative hover:bg-gray-50/70 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            >
              <a 
                href={`/blog/${blog.slug}`} 
                className="block p-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                title={blog.title}
              >
                <div className="flex items-center space-x-2">
                  <svg 
                    className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5-5 5M5 7l5 5-5 5"
                    />
                  </svg>
                  <span className="line-clamp-2 group-hover:underline">
                    {blog.title}
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};