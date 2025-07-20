"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/config/api/route';

interface Author {
  id: string;
  name: string;
  email: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AuthorPage() {
  const params = useParams();
  const [author, setAuthor] = useState<Author | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safely get the slug from params
    const slug = !Array.isArray(params.slug) ? params.slug : params.slug?.[0];
    
    // Only proceed if we have a valid slug
    if (!slug) {
      setLoading(false);
      setError('Invalid author identifier');
      return;
    }

    const fetchAuthor = async () => {
      try {
        const response = await api.get(`/author/${slug}`) as { success: boolean, data: Author | null };
        if (!response.success) throw new Error('Failed to fetch author data');
        setAuthor(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load author information');
        console.error('Error fetching author:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="bg-gray-200 dark:bg-slate-800 rounded-lg p-6">
            <div className="h-12 w-24 bg-gray-300 dark:bg-slate-600 rounded-full mb-4 mx-auto"></div>
            <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/3 mb-4 mx-auto"></div>
            <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/2 mb-4 mx-auto"></div>
            <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4 dark:text-white">Error</h1>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4 dark:text-white">Author Not Found</h1>
        <p className="dark:text-gray-300">The requested author could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Author Profile</h1>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg dark:shadow-slate-900/30 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
        <div className="text-center">
          {author.imageUrl && (
            <img
              src={author.imageUrl}
              alt={author.name}
              className="w-32 h-32 rounded-full mb-6 mx-auto border-4 border-white dark:border-slate-700 shadow-md"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{author.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{author.email}</p>
          
          {author.description && (
            <div className="max-w-2xl mx-auto mb-6">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-3">About</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{author.description}</p>
            </div>
          )}
          
          <div className="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-700 pt-4">
            Member since {new Date(author.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}