"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CustomLinkForm, type CustomLinkFormData } from '@/components/dashboard/forms/CustomLinkForm';
import { env } from '@/config/env';
import Cookie from 'js-cookie';

import { PencilIcon, TrashIcon, EyeIcon, ArrowLeftIcon, CalendarIcon, CalendarDaysIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { CurrentAffairForm, CurrentArticleForm, CurrentArticleFormValues } from '@/components/dashboard/forms';
import Drafts from '@/components/ui/drafts';

interface CurrentAffairType {
  id: number;
  title: string;
  content: string;
  slug: string;
  author: string;
  link: string | null;
  blogs: {
    id: string;
    title: string;
    content: string;
    slug: string;
    author: string;
    parentSlug: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  parentSlug: string;
  metadata?: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
  quizQuestions: string | null;
}

export default function ArticlesPage() {
  const [selectedPage, setSelectedPage] = useState<CurrentAffairType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<CurrentAffairType[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(selectedPage?.imageUrl || null);
  const token = Cookie.get('token');

  const handleEditSubmit = async (formData: CurrentArticleFormValues) => {
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
        author: formData.author,
        link: null,
        parentSlug: selectedPage?.parentSlug || '',
        slug: selectedPage?.slug || '',
        updatedAt: new Date(),
        imageUrl: formData.imageUrl,
        quizQuestions: formData.quizQuestions || '[]', // Ensure we have a valid string
        metadata: JSON.stringify({
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          metaKeywords: formData.metaKeywords,
          robots: formData.robots,
          ogTitle: formData.ogTitle,
          ogDescription: formData.ogDescription,
          ogImage: formData.ogImage,
          ogType: formData.ogType,
          twitterCard: formData.twitterCard,
          twitterTitle: formData.twitterTitle,
          twitterDescription: formData.twitterDescription,
          twitterImage: formData.twitterImage,
          canonicalUrl: formData.canonicalUrl,
          schemaData: formData.schemaData,
          header: formData.header,
          body: formData.body
        })
      };

      if (!selectedPage) {
        setError('No page selected');
        return;
      }
      
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
      
      // Refresh the page list
      const urlParams = new URLSearchParams(window.location.search);
      const parentSlug = urlParams.get('parentPageName');
      if (parentSlug) {
        fetchPages(parentSlug);
      }
      
      // Refresh the page after successful submission
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };
  const handleCustomLinkSubmit = async (formData: CustomLinkFormData) => {
    try {
      if (!selectedPage) {
        setError('No page selected');
        return;
      }

      const updateData = {
        title: formData.title,
        link: formData.link,
        showInNav: formData.showInNav,
        content: "dummy",
        slug:"dummy",
        parentSlug:selectedPage.parentSlug,
        author:"dummy",
        updatedAt: new Date(),
        imageUrl: "",
        metadata: ""
      };

      const response = await fetch(`${env.API}/currentArticle/${selectedPage.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update page');
      }

      // Refresh the page list/ Refresh the page list
      const urlParams = new URLSearchParams(window.location.search);
      const parentSlug = urlParams.get('parentPageName');
      if (parentSlug) {
        fetchPages(parentSlug);
      }
      
      // Refresh the page after successful submission
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parentSlug = urlParams.get('parentPageName');
    if (parentSlug) {
      fetchPages(parentSlug);
    }
  }, []);

  useEffect(() => {
    if (selectedPage) {
      console.log('Selected page content:', selectedPage);
      
      // Parse metadata string into object if it exists
      const parsedMetadata = selectedPage.metadata ? JSON.parse(selectedPage.metadata) : {};
      
      // Prepare default values for the form
      const defaultValues = {
        title: selectedPage.title,
        content: selectedPage.content || '',
        author: selectedPage.author || '',
        imageUrl: selectedPage.imageUrl || '',
        metaTitle: parsedMetadata.metaTitle || '',
        metaDescription: parsedMetadata.metaDescription || '',
        metaKeywords: parsedMetadata.metaKeywords || '',
        robots: parsedMetadata.robots || '',
        ogTitle: parsedMetadata.ogTitle || '',
        ogDescription: parsedMetadata.ogDescription || '',
        ogImage: parsedMetadata.ogImage || '',
        ogType: parsedMetadata.ogType || '',
        twitterCard: parsedMetadata.twitterCard || '',
        twitterTitle: parsedMetadata.twitterTitle || '',
        twitterDescription: parsedMetadata.twitterDescription || '',
        twitterImage: parsedMetadata.twitterImage || '',
        canonicalUrl: parsedMetadata.canonicalUrl || '',
        schemaData: parsedMetadata.schemaData || '',
        header: parsedMetadata.header || '',
        body: parsedMetadata.body || '',
        quizQuestions: selectedPage.quizQuestions || '[]', // Ensure we always have a valid JSON string
      };

      setImagePreview(selectedPage.imageUrl || null);
    }
  }, [selectedPage]);

  const handleDelete = async (pageId: number) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

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
        throw new Error(errorData.message || 'Failed to delete page');
      }

      // Refresh the page list
      const urlParams = new URLSearchParams(window.location.search);
      const parentSlug = urlParams.get('parentPageName');
      if (parentSlug) {
        fetchPages(parentSlug);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchPages = async (parentSlug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${env.API}/currentArticle/parent/${parentSlug}`, {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="bg-[var(--admin-bg-secondary)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Edit Articles
            </h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  (window.location.href = "/dashboard/editcurrent")
                }
                className="border-[var(--admin-bg-primary)] text-white hover:bg-[var(--admin-bg-primary)]"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p>Loading articles...</p>
        </div>
      )}

      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

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
                <div
                  className="text-[var(--admin-secondary)] text-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: page.content ? (
                      page.content.substring(0, 100)
                    ) : (
                      <p>No content Available</p>
                    ),
                  }}
                ></div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPage(page);
                    // Scroll to the form container after a small delay to ensure it's mounted
                    setTimeout(() => {
                      const formContainer = document.querySelector('.bg-white.rounded-lg.shadow-sm');
                      if (formContainer) {
                        formContainer.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="border-[var(--admin-border)] text-[var(--admin-primary)] hover:bg-[var(--admin-bg-light)]"
                >
                  <PencilIcon className="w-4 h-4 mr-2 text-blue-500" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(page.id)}
                  className="border-[var(--admin-border)] text-red-600 hover:bg-red-50"
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
              <h2 className="text-xl font-semibold text-[var(--admin-bg-dark)]">
                Edit Article
              </h2>
              {selectedPage.link ? (
                <CustomLinkForm
                  initialData={{
                    title: selectedPage.title,
                    link: selectedPage.link,
                    showInNav:  false
                  }}
                  onSubmit={handleCustomLinkSubmit}
                />
              ) : (
                <CurrentArticleForm
                  onSubmit={handleEditSubmit}
                  defaultValues={{
                    title: selectedPage.title,
                    content: selectedPage.content || '',
                  author: selectedPage.author || '',
                  blogs: selectedPage.blogs || [],  
                  slug: selectedPage.slug || '',
                  imageUrl: selectedPage.imageUrl || '',
                  metaTitle: selectedPage.metadata ? JSON.parse(selectedPage.metadata).metaTitle || '' : '',
                  metaDescription: selectedPage.metadata ? JSON.parse(selectedPage.metadata).metaDescription || '' : '',
                  metaKeywords: selectedPage.metadata ? JSON.parse(selectedPage.metadata).metaKeywords || '' : '',
                  robots: selectedPage.metadata ? JSON.parse(selectedPage.metadata).robots || '' : '',
                  ogTitle: selectedPage.metadata ? JSON.parse(selectedPage.metadata).ogTitle || '' : '',
                  ogDescription: selectedPage.metadata ? JSON.parse(selectedPage.metadata).ogDescription || '' : '',
                  ogImage: selectedPage.metadata ? JSON.parse(selectedPage.metadata).ogImage || '' : '',
                  ogType: selectedPage.metadata ? JSON.parse(selectedPage.metadata).ogType || '' : '',
                  twitterCard: selectedPage.metadata ? JSON.parse(selectedPage.metadata).twitterCard || '' : '',
                  twitterTitle: selectedPage.metadata ? JSON.parse(selectedPage.metadata).twitterTitle || '' : '',
                  twitterDescription: selectedPage.metadata ? JSON.parse(selectedPage.metadata).twitterDescription || '' : '',
                  twitterImage: selectedPage.metadata ? JSON.parse(selectedPage.metadata).twitterImage || '' : '',
                  canonicalUrl: selectedPage.metadata ? JSON.parse(selectedPage.metadata).canonicalUrl || '' : '',
                  schemaData: selectedPage.metadata ? JSON.parse(selectedPage.metadata).schemaData || '' : '',
                  quizQuestions: selectedPage.quizQuestions || '[]', // Ensure we always have a valid JSON string
                  header: selectedPage.metadata ? JSON.parse(selectedPage.metadata).header || '' : '',
                  body: selectedPage.metadata ? JSON.parse(selectedPage.metadata).body || '' : ''
                }}
              />)}
            </div>
          </div>
        </div>
      )}
      <Drafts/>
    </div>
  );
}