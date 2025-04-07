"use client";

import React, { useEffect , useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TiptapEditor from '@/components/ui/tiptapeditor';
import { env } from '@/config/env';
import Cookie from 'js-cookie';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useForm} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
interface CurrentAffairType {
  id: number;
  title: string;
  content: string;
  type: string; // daily, monthly, yearly
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  dailyArticle?: CurrentAffairArticleType[];
}
interface CurrentAffairArticleType {
  id: number;
  title: string;
  content: string;
  slug: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  parentSlug: string;
}

export default function PageListCurrent() {
  const [selectedPage, setSelectedPage] = useState<CurrentAffairType |null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<CurrentAffairType[]>([]);
  const [selectedType, setSelectedType] = useState<'daily' | 'monthly' | 'yearly' | null>(null);
  // const token = Cookie.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    getValues
  } = useForm<CurrentAffairType>({
    resolver: zodResolver(
      z.object({
        id: z.number(),
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
        type: z.string(),
        slug: z.string(),
        createdAt: z.date(),
        updatedAt: z.date()
      })
    ),
    defaultValues: {
      id: 0,
      title: "",
      content: "",
      type: "",
      slug: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      dailyArticle: []
    }
  });
  const token = Cookie.get('token');

  useEffect(() => {
    if (selectedPage) {
      console.log('Selected page content:', selectedPage);
      reset({
        id: selectedPage.id,
        title: selectedPage.title,
        content: selectedPage.content || '',
        type: selectedType || selectedPage.type,
        slug: selectedPage.slug,
        createdAt: selectedPage.createdAt,
        updatedAt: selectedPage.updatedAt,
        dailyArticle: selectedPage.dailyArticle || []
      });
      setValue('content', selectedPage.content || '');
    }
  }, [selectedPage, selectedType, reset, setValue]);

  const handleEditorChange = (content: string) => {
    setValue('content', content, { shouldValidate: true });
    if (selectedPage) {
      // setEditingArticle(prev => prev ? { ...prev, content } : null);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = getValues();
    console.log("reaches");
    try {
      // Generate slug from title
      const baseSlug = formData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const slug = `current-affairs/${baseSlug}`;

      const updateData = {
        title: formData.title,
        content: formData.content,
        type: selectedType || formData.type || 'daily',
        slug,
        updatedAt: new Date()
      };

      if (!selectedPage) {
        setError('No page selected');
        return;
      }
      const response = await fetch(`${env.API}/currentAffair/${selectedPage.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update page');
      }

      const { data } = await response.json();
      setSelectedPage(data);
      if (selectedType) {
        fetchPages(selectedType);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchPages = async (type: 'daily' | 'monthly' | 'yearly') => {
    try {
      setLoading(true);
      const response = await fetch(`${env.API}/currentAffair/type/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch pages');
      }

      const { data } = await response.json();
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching current affairs:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
        type: error instanceof Error ? error.constructor.name : typeof error
      });

      setError(error instanceof Error ? error.message : 'Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: 'daily' | 'monthly' | 'yearly') => {
    setSelectedType(type);
    fetchPages(type);
  };

  const handleDelete = async (pageId: number) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`${env.API}/currentAffair/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete page');
      }

      // Refresh the page list
      if (selectedType) {
        fetchPages(selectedType);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Edit Current Affairs</h1>
      </div>

      {/* Type Selection */}
      <div className="mb-8">
        <div className="flex gap-4">
          <Button
            variant={selectedType === 'daily' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('daily')}
            className="flex-1"
          >
            Daily
          </Button>
          <Button
            variant={selectedType === 'monthly' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('monthly')}
            className="flex-1"
          >
            Monthly
          </Button>
          <Button
            variant={selectedType === 'yearly' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('yearly')}
            className="flex-1"
          >
            Yearly
          </Button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p>Loading pages...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      {!loading && !error && !selectedType && (
        <div className="text-center py-8">
          <p>Please select a type to view pages</p>
        </div>
      )}

      {!loading && !error && selectedType && pages.length === 0 && (
        <div className="text-center py-8">
          <p>No pages found for {selectedType} current affairs</p>
        </div>
      )}

      {!loading && !error && selectedType && pages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{page.title}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {page.content ? page.content.substring(0, 100) + '...' : 'No content available'}
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
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const parentPageName = page.slug.replace(/\//g, " ");
                    window.location.href = `/dashboard/editcurrent/articles?parentPageName=${parentPageName}`;
                  }}
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit Articles
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
            <h2 className="text-xl font-semibold mb-4">Edit Current Affair</h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <Input
                  {...register("title")}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <TiptapEditor
                  content={getValues("content") || ""}
                  onChange={handleEditorChange}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedPage(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}