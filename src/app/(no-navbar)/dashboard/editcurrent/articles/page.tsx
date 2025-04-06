"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Cookie from 'js-cookie';
import { env } from '@/config/env';
import TiptapEditor from '@/components/ui/tiptapeditor';

interface CurrentAffairArticleType {
  id: number;
  title: string;
  content: string;
  slug: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  parentSlug: string;
  type: string; // Add type property to the interface
}

interface ParentPage {
  type: string;
  // Add other properties that might be needed
}

interface PageListProps {
  pages: CurrentAffairArticleType[];
  selectedType: string; // Add selectedType property to the interface
}

export function PageListArticles({ selectedType }: PageListProps) {
  const [selectedPage, setSelectedPage] = useState<CurrentAffairArticleType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<CurrentAffairArticleType[]>([]);
  const [formData, setFormData] = useState<Partial<CurrentAffairArticleType>>({});
  const token = Cookie.get('token');

  useEffect(() => {
    if (selectedPage) {
      setFormData({
        title: selectedPage.title,
        content: selectedPage.content,
        author: selectedPage.author,
        slug: selectedPage.slug,
        parentSlug: selectedPage.parentSlug,
        type: selectedPage.type,
        createdAt: selectedPage.createdAt,
        updatedAt: selectedPage.updatedAt
      });
    }
  }, [selectedPage]);

  const handleInputChange = (field: keyof CurrentAffairArticleType, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fetchPages = async () => {
    try {
      setLoading(true);
      
      // First, check if we have a valid token
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Get the parent page name from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const parentPageName = urlParams.get('parentPageName');

      // Fetch articles by parent slug
      const response = await fetch(`${env.API}/currentArticle/parent/${parentPageName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.headers.get('content-type')?.includes('text/html')) {
        const errorText = await response.text();
        throw new Error(`API returned HTML response. Response: ${errorText}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Failed to fetch articles');
        } catch {
          throw new Error(`API Error: ${errorText}`);
        }
      }

      const data = await response.json();
      const articles = data?.data || []; // Extract the articles array from the response

      // Log the articles and parentPageName for debugging
      console.log('Articles:', articles);
      console.log('Parent Page Name:', parentPageName);

      setPages(articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pageId: number) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`${env.API}/currentArticle/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete article');
      }

      // Refresh the page list
      fetchPages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (!selectedPage) {
        setError('No page selected');
        return;
      }

      // Generate slug from title
      const baseSlug = (formData.title ?? '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const slug = `${selectedPage.parentSlug}/${baseSlug}`;

      // Validate all required fields
      if (!formData.title || typeof formData.title !== 'string') {
        setError('Title is required and must be a string');
        return;
      }
      if (!formData.content || typeof formData.content !== 'string') {
        setError('Content is required and must be a string');
        return;
      }
      if (!formData.author || typeof formData.author !== 'string') {
        setError('Author is required and must be a string');
        return;
      }

      const updateData = {
        title: formData.title,
        content: formData.content,
        parentSlug: selectedPage.parentSlug,
        slug,
        author: formData.author
      };

      console.log('Sending update data:', updateData); // Debug log

      const response = await fetch(`${env.API}/currentArticle/${selectedPage.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update article');
      }

      const { data } = await response.json();
      setSelectedPage(data);
      setFormData(data);
      fetchPages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Edit Current Affair Articles</h1>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p>Loading articles...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      {!loading && !error && pages.length === 0 && (
        <div className="text-center py-8">
          <p>No articles found</p>
        </div>
      )}

      {!loading && !error && pages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{page.title}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {page.content ? page.content.substring(0, 100) : 'No content available'}...
              </p>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/current-affairs/${page.slug}`}
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPage(page)}
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(page.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPage && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Article</h2>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              await handleEditSubmit();
            }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <Input
                    value={formData.author || ''}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <TiptapEditor
                    content={formData.content || ''}
                    onChange={(content) => handleInputChange('content', content)}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedPage(null);
                      setFormData({});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageListArticles;