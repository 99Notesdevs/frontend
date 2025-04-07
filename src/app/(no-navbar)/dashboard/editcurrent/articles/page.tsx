"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TiptapEditor from '@/components/ui/tiptapeditor';
import { env } from '@/config/env';
import Cookie from 'js-cookie';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface CurrentArticleType {
  id: number;
  title: string;
  content: string;
  author: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  parentSlug: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<CurrentArticleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<CurrentArticleType | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const token = Cookie.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    getValues
  } = useForm<CurrentArticleType>({
    resolver: zodResolver(
      z.object({
        id: z.number(),
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
        author: z.string().min(1, "Author is required"),
        slug: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        parentSlug: z.string()
      })
    ),
    defaultValues: {
      id: 0,
      title: "",
      content: "",
      author: "",
      slug: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      parentSlug: ""
    }
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parentSlug = urlParams.get('parentPageName');
    if (parentSlug) {
      // Replace forward slashes with spaces
      const encodedSlug = parentSlug.replace(/\//g, ' ');
      fetchArticles(encodedSlug);
    }
  }, []);

  const fetchArticles = async (parentSlug: string) => {
    try {
      // Replace forward slashes with spaces before encoding
      console.log(parentSlug)
      const response = await fetch(`${env.API}/currentArticle/parent/${parentSlug}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      setArticles(data.data || []); 
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleEdit = (article: CurrentArticleType) => {
    setEditingArticle(article);
    setShowEditForm(true);
    reset({
      id: article.id,
      title: article.title,
      content: article.content,
      author: article.author,
      slug: article.slug,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      parentSlug: article.parentSlug
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`${env.API}/currentArticle/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      setArticles(articles.filter(article => article.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  const handleEditorChange = (content: string) => {
    // Update the form value and trigger validation
    setValue('content', content, { shouldValidate: true });
    // Update the editingArticle state for immediate preview
    if (editingArticle) {
      console.log("ARtivle", editingArticle)
      setEditingArticle(prev => ({
        ...prev,
        content,
        // Ensure all required fields are present
        id: prev?.id || 0,
        title: prev?.title || '',
        author: prev?.author || '',
        slug: prev?.slug || '',
        createdAt: prev?.createdAt || new Date(),
        updatedAt: new Date(),
        parentSlug: prev?.parentSlug || ''
      }));
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = getValues();
    console.log("Form submission started");
    console.log("Form data:", formData);
    
    try {
      // Generate slug from title
      const parentSlug = editingArticle?.parentSlug || 'current-affairs';
      const baseSlug = formData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const slug = `${parentSlug} ${baseSlug}`;
      console.log(parentSlug);
      console.log(baseSlug);
      console.log(slug);

      const updateData = {
        title: formData.title,
        content: formData.content,
        author: formData.author,
        slug,
        parentSlug,
        updatedAt: new Date()
      };
      console.log(updateData)

      const response = await fetch(`${env.API}/currentArticle/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update article');
      }

      const { data } = await response.json();
      setArticles(prevArticles => 
        prevArticles.map(article => 
          article.id === formData.id ? { ...article, ...data } : article
        )
      );
      setShowEditForm(false);
      setEditingArticle(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Current Articles</h1>
      
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(article)}
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(article.id)}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-gray-600">Author: {article.author}</p>
            {article.content && (
              <div className="mt-2" dangerouslySetInnerHTML={{ __html: article.content }} />
            )}
          </div>
        ))}
      </div>

      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Edit Article</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  {...register('title')}
                  className="w-full"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <Input
                  {...register('author')}
                  className="w-full"
                />
                {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <TiptapEditor
                  content={editingArticle?.content || ''}
                  onChange={handleEditorChange}
                />
                {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingArticle(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}