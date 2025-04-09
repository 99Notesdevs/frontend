"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TiptapEditor from '@/components/ui/tiptapeditor';
import { env } from '@/config/env';
import Cookie from 'js-cookie';

import { PencilIcon, TrashIcon, EyeIcon, ArrowLeftIcon, CalendarIcon, CalendarDaysIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadImageToS3 } from '@/config/imageUploadS3';
import Image from 'next/image';

interface CurrentAffairType {
  id: number;
  title: string;
  content: string;
  type: string; // daily, monthly, yearly
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
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
  const [selectedPage, setSelectedPage] = useState<CurrentAffairType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<CurrentAffairType[]>([]);
  const [selectedType, setSelectedType] = useState<'daily' | 'monthly' | 'yearly' | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(selectedPage?.imageUrl || null);
  const [imageLoading, setImageLoading] = useState(false);
  const token = Cookie.get('token');


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
        updatedAt: z.date(),
        imageUrl: z.string().nullable()
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
      imageUrl: null,
      dailyArticle: []
    }
  });

  useEffect(() => {
    fetchPages('daily'); // Fetch daily pages on initial load
  }, []);

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
        imageUrl: selectedPage.imageUrl || null,
        dailyArticle: selectedPage.dailyArticle || []
      });
      setValue('content', selectedPage.content || '');
      setImagePreview(selectedPage.imageUrl || null);
    }
  }, [selectedPage, selectedType, reset, setValue]);

  const handleEditorChange = (content: string) => {
    setValue('content', content, { shouldValidate: true });
    if (selectedPage) {
      // setEditingArticle(prev => prev ? { ...prev, content } : null);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Show a preview of the image
          const result = reader.result as string;
          setImagePreview(result);

          // Upload the image to S3
          const formData = new FormData();
          formData.append("image", file);

          const s3Url = await uploadImageToS3(formData);
          if (s3Url) {
            setValue("imageUrl", s3Url, { shouldValidate: true });
          } else {
            throw new Error("Failed to upload image to S3");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          setError("Failed to upload image. Please try again.");
        } finally {
          setImageLoading(false);
        }
      };
      reader.readAsDataURL(file);
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
        updatedAt: new Date(),
        imageUrl: formData.imageUrl,
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
      
      // Refresh the page after successful submission
      window.location.reload();
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
      <div className="mb-8">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Edit Current Affairs</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/dashboard/current-affair'}
                className="border-slate-700 text-white hover:bg-slate-700"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Type Selection */}
      <div className="mb-8">
        <div className="flex gap-4">
          <Button
            variant={selectedType === 'daily' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('daily')}
            className="flex-1 border-slate-200 text-slate-900 hover:bg-slate-50 transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <CalendarIcon className="w-5 h-5 text-slate-500" />
              <span>Daily</span>
            </div>
          </Button>
          <Button
            variant={selectedType === 'monthly' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('monthly')}
            className="flex-1 border-slate-200 text-slate-900 hover:bg-slate-50 transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-slate-500" />
              <span>Monthly</span>
            </div>
          </Button>
          <Button
            variant={selectedType === 'yearly' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('yearly')}
            className="flex-1 border-slate-200 text-slate-900 hover:bg-slate-50 transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <CalendarIcon className="w-5 h-5 text-slate-500" />
              <span>Yearly</span>
            </div>
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
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {page.content ? page.content.substring(0, 150) + '...' : 'No content available'}
              </p>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/current-affairs/${page.slug}`}
                  className="border-slate-200 text-slate-900 hover:bg-slate-50"
                >
                  <EyeIcon className="w-4 h-4 mr-2 text-slate-500" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPage(page)}
                  className="border-slate-200 text-blue-600 hover:bg-blue-50"
                >
                  <PencilIcon className="w-4 h-4 mr-2 text-blue-500" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const parentPageName = page.slug.replace(/\//g, " ");
                    window.location.href = `/dashboard/editcurrent/articles?parentPageName=${parentPageName}`;
                  }}
                  className="border-slate-200 text-blue-600 hover:bg-blue-50"
                >
                  <PencilIcon className="w-4 h-4 mr-2 text-blue-500" />
                  Edit Articles
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(page.id)}
                  className="border-slate-200 text-red-600 hover:bg-red-50"
                >
                  <TrashIcon className="w-4 h-4 mr-2 text-red-500" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPage && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900">Edit Current Affair</h2>
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title
                    </label>
                    <Input
                      {...register("title")}
                      className="w-full"
                      placeholder="Enter title"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                      Content
                    </label>
                    <div className="rounded-lg border border-slate-200 bg-white">
                      <TiptapEditor
                        content={getValues("content") || ""}
                        onChange={handleEditorChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                {imagePreview && (
                  <div className="relative w-full h-64 mb-4">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={imageLoading}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                />
                {imageLoading && (
                  <div className="text-sm text-gray-600">Uploading image...</div>
                )}
                {errors.imageUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
                )}
              </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setSelectedPage(null);
                        reset();
                      }}
                      className="border-slate-200 text-slate-900 hover:bg-slate-50"
                    >
                      <XMarkIcon className="w-4 h-4 mr-2 text-slate-500" />
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <CheckIcon className="w-4 h-4 mr-2 text-white" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}