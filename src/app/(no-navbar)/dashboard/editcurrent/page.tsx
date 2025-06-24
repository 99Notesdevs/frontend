"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CurrentAffairPageForm, type CurrentAffairPageFormValues } from '@/components/dashboard/forms/CurrentAffairPageForm';
import { CustomLinkForm, type CustomLinkFormData } from '@/components/dashboard/forms/CustomLinkForm';
import { env } from '@/config/env';
import Cookie from 'js-cookie';

import { PencilIcon, TrashIcon, EyeIcon, ArrowLeftIcon, CalendarIcon, CalendarDaysIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { uploadImageToS3 } from '@/config/imageUploadS3';
import Drafts from '@/components/ui/drafts';

interface CurrentAffairType {
  id: number;
  title: string;
  content: string;
  type: string; // daily, monthly, yearly
  slug: string;
  link: string;
  metadata?: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
  dailyArticle?: CurrentAffairArticleType[];
  showInNav?: boolean;
}

interface CurrentAffairArticleType {
  id: number;
  title: string;
  content: string;
  slug: string;
  link: string;
  author: string;
  metadata?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    robots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    canonicalUrl?: string;
    schemaData?: string;
    header?: string;
    body?: string;
  }
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
  const token = Cookie.get('token');

  const getFormattedDate = () => {
    const uid = Math.random().toString(36).slice(2, 6);
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const DD = pad(now.getDate());
    const MM = pad(now.getMonth() + 1);
    const YYYY = now.getFullYear();
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    return `${DD}${MM}${YYYY}_${hh}${mm}${ss}_${uid}`;
  };

  const handleImageUpload = async (content: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const imgTags = doc.querySelectorAll("img");
    
        for (const img of imgTags) {
          const src = img.getAttribute("src");
          if (!src) continue;
          console.log("I was here");
          const isBlob = src.startsWith("blob:");
          const isBase64 = src.startsWith("data:image");
          const fileNmae = (img.getAttribute("title") || getFormattedDate()) + ".png";
    
          if (isBlob || isBase64) {
            try {
              const response = await fetch(src);
              const blob = await response.blob();
    
              const formData = new FormData();
              formData.append("imageUrl", blob, "image.png");
    
              const url =
                (await uploadImageToS3(formData, "CurrentAffairImages", fileNmae)) || "error";
              img.setAttribute("src", url);
            } catch (error: unknown) {
              if (error instanceof Error) {
                console.error("Error uploading image:", error.message);
              }
            }
          }
        }
    
        return doc.body.innerHTML; // ⬅️ Only return after finishing all images
      };

  const handleEditSubmit = async (formData: CurrentAffairPageFormValues) => {
    try {
      // Generate slug from title
      const baseSlug = formData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const slug = `current-affairs/${baseSlug}`;

      const content = await handleImageUpload(formData.content || "");

      const updateData = {
        title: formData.title,
        content: content,
        type: selectedType || 'daily',
        slug,
        showInNav: formData.showInNav,
        updatedAt: new Date(),
        imageUrl: formData.imageUrl,
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
        type: selectedType || 'daily',
        slug:"dummy",
        updatedAt: new Date(),
        imageUrl: "",
        metadata: ""
      };

      const response = await fetch(`${env.API}/currentAffair/${selectedPage.id}`, {
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

      // Refresh the page list
      if (selectedType) {
        fetchPages(selectedType);
      }
      
      // Refresh the page after successful submission
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchPages('daily'); // Fetch daily pages on initial load
  }, []);

  useEffect(() => {
    if (selectedPage) {
      console.log('Selected page content:', selectedPage);
      
      // Parse metadata string into object if it exists
      const parsedMetadata =  JSON.parse(selectedPage.metadata || '{}');
      
      // Prepare default values for the form
      const defaultValues = {
        title: selectedPage.title,
        content: selectedPage.content || '',
        imageUrl: selectedPage.imageUrl || '',
        showInNav: selectedPage.showInNav || false,
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
        body: parsedMetadata.body || ''
      };

      setImagePreview(selectedPage.imageUrl || null);
    }
  }, [selectedPage, selectedType]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="bg-[var(--admin-bg-secondary)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Edit Current Affairs
            </h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  (window.location.href = "/dashboard")
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

      {/* Type Selection */}
      <div className="mb-8">
        <div className="flex gap-4">
          <Button
            variant={selectedType === "daily" ? "default" : "outline"}
            onClick={() => handleTypeChange("daily")}
            className="flex-1 border-[var(--admin-border)] text-[var(--admin-bg-dark)] hover:bg-[var(--admin-bg-light)] transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[var(--admin-primary)]" />
              <span>Daily</span>
            </div>
          </Button>
          <Button
            variant={selectedType === "monthly" ? "default" : "outline"}
            onClick={() => handleTypeChange("monthly")}
            className="flex-1 border-[var(--admin-border)] text-[var(--admin-bg-dark)] hover:bg-[var(--admin-bg-light)] transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-[var(--admin-primary)]" />
              <span>Monthly</span>
            </div>
          </Button>
          <Button
            variant={selectedType === "yearly" ? "default" : "outline"}
            onClick={() => handleTypeChange("yearly")}
            className="flex-1 border-[var(--admin-border)] text-[var(--admin-bg-dark)] hover:bg-[var(--admin-bg-light)] transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[var(--admin-primary)]" />
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

      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

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
                {/* <div
                  className="text-gray-600 text-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: page.content ? (
                      page.content.substring(0, 100)
                    ) : (
                      <p>No content Available</p>
                    ),
                  }}
                ></div> */}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    (window.location.href = `/${page.slug}`)
                  }
                  className="border-[var(--admin-border)] text-[var(--admin-bg-dark)] hover:bg-[var(--admin-bg-light)]"
                >
                  <EyeIcon className="w-4 h-4 mr-2 text-[var(--admin-primary)]" />
                  View
                </Button>
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
                  className="border-[var(--admin-border)] text-blue-600 hover:bg-blue-50"
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
                  className="border-[var(--admin-border)] text-blue-600 hover:bg-blue-50"
                >
                  <PencilIcon className="w-4 h-4 mr-2 text-blue-500" />
                  Edit Articles
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
                Edit Current Affair
              </h2>
              {selectedPage.link ? (
                <CustomLinkForm
                  initialData={{
                    title: selectedPage.title,
                    link: selectedPage.link,
                    showInNav: selectedPage.showInNav || false
                  }}
                  onSubmit={handleCustomLinkSubmit}
                />
              ) : (
                <CurrentAffairPageForm
                  defaultValues={{
                    title: selectedPage.title,
                    content: selectedPage.content || '',
                    showInNav: selectedPage.showInNav || false,
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
                    header: selectedPage.metadata ? JSON.parse(selectedPage.metadata).header || '' : '',
                    body: selectedPage.metadata ? JSON.parse(selectedPage.metadata).body || '' : ''
                  }}
                  onSubmit={handleEditSubmit} folder={"CurrentAffairs"}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <Drafts/>
    </div>
  );
}