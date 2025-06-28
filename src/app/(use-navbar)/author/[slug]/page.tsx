"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { env } from '@/config/env';

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
        const response = await fetch(`${env.API}/author/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch author data');
        const data = await response.json();
        setAuthor(data);
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
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="bg-gray-200 rounded p-6">
            <div className="h-12 w-24 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Error</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Author Not Found</h1>
        <p>The requested author could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Author Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">{author.name}</h2>
        {author.imageUrl && (
          <img
            src={author.imageUrl}
            alt={author.name}
            className="w-24 h-24 rounded-full mb-4"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        )}
        <p className="text-gray-600 mb-4">{author.email}</p>
        {author.description && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p>{author.description}</p>
          </div>
        )}
        <div className="text-sm text-gray-500">
          Joined: {new Date(author.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}