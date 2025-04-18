"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import {ArticleForm, UpscNotesForm, GeneralStudiesForm , CurrentAffairForm} from '@/components/dashboard/forms';
import Cookie from 'js-cookie';
import { env } from '@/config/env';
import { uploadImageToS3 } from '@/config/imageUploadS3';

interface Page {
  id: number;
  slug: string;
  title: string;
  templateId: string;
  updatedAt: string;
  content: string;
  imageUrl: string | null;
  parentId?: number;
  level?: number;
  order?: number;
  metadata?: {
    keywords?: string[];
    lastUpdated?: string;
    teamSize?: number;
  };
}

function PageList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pageIdToDelete, setPageIdToDelete] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const token = Cookie.get('token');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch(`${env.API}/page`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch pages');
            const { data } = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageById = async (pageId: number) => {
    try {
      const response = await fetch(`${env.API}/page/id/${pageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch page');
      const { data } = await response.json();
      setSelectedPage(data);
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching page:', error);
    }
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
  
        if (isBlob || isBase64) {
          try {
            const response = await fetch(src);
            const blob = await response.blob();
  
            const formData = new FormData();
            formData.append("imageUrl", blob, "image.png");
  
            const url = (await uploadImageToS3(formData)) || "error";
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

  const saveEdit = async (formData: any) => {
    if (!selectedPage) return;
    console.log('Form data:', formData);

    try {
      // Generate new slug from title if it has changed
      const newTitle = formData.title;
      const newSlug = newTitle.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Get the current page's level in the hierarchy
      const currentLevel = selectedPage.slug.split('/').length;
      
      formData.content = await handleImageUpload(formData.content);
      // Create the page data object
      const pageData = {
        id: selectedPage.id,
        title: newTitle,
        slug:
          selectedPage.title !== newTitle
            ? [
                ...selectedPage.slug.split("/").slice(0, currentLevel - 1),
                newSlug,
              ].join("/")
            : selectedPage.slug,
        templateId: selectedPage.templateId,
        parentId: selectedPage.parentId || null,
        imageUrl: formData.imageUrl,
        content: formData.content,
        metadata: {
          lastUpdated: new Date().toISOString(),
          teamSize: formData.metadata?.teamSize || 0,
          metaTitle: formData.metaTitle || "",
          metaDescription: formData.metaDescription || "",
          metaKeywords: formData.metaKeywords || "",
          robots: formData.robots || "",
          ogTitle: formData.ogTitle || "",
          ogDescription: formData.ogDescription || "",
          ogImage: formData.ogImage || "",
          ogType: formData.ogType || "",
          twitterCard: formData.twitterCard || "",
          twitterTitle: formData.twitterTitle || "",
          twitterDescription: formData.twitterDescription || "",
          twitterImage: formData.twitterImage || "",
          canonicalUrl: formData.canonicalUrl || "",
          schemaData: formData.schemaData || "",
        },
        level: selectedPage.level || 0,
        showInNav: true,
        order: selectedPage.order || 0,
        updatedAt: new Date().toISOString(),
      };

      // Prepare data for API submission with stringified content and metadata
      const apiPageData = {
        ...pageData,
        content: pageData.content,
        metadata: JSON.stringify(pageData.metadata)
      };

      const response = await fetch(`${env.API}/page/${selectedPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(apiPageData)
      });
      
      if (!response.ok) throw new Error('Failed to update page');
      
      // Refresh the page list
      fetchPages();
      setSelectedPage(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const getInitialFormData = (page: Page, templateId: string): any => {
    const parsedContent = page.content || "";
    // @ts-ignore
    const metadata = JSON.parse(page.metadata || "{}");
    const parsedimage=page.imageUrl || undefined;
    switch (templateId) {
      case 'article':
        return {
          title: page.title || "",
          content: parsedContent || "",
          imageUrl: parsedimage || undefined,
          metaTitle: metadata.metaTitle || "",
          metaDescription: metadata.metaDescription || "",
          metaKeywords: metadata.metaKeywords || "",
          robots: metadata.robots || "",
          ogTitle: metadata.ogTitle || "",
          ogDescription: metadata.ogDescription || "",
          ogImage: metadata.ogImage || "",
          ogType: metadata.ogType || "",
          twitterCard: metadata.twitterCard || "",
          twitterTitle: metadata.twitterTitle || "",
          twitterDescription: metadata.twitterDescription || "",
          twitterImage: metadata.twitterImage || "",
          canonicalUrl: metadata.canonicalUrl || "",
          schemaData: metadata.schemaData || "",
        };
      
      case 'general-studies':
        return {
          title: page.title || "",
          content: parsedContent || "",
          imageUrl: parsedimage || undefined,
          metaTitle: metadata.metaTitle || "",
          metaDescription: metadata.metaDescription || "",
          metaKeywords: metadata.metaKeywords || "",
          robots: metadata.robots || "",
          ogTitle: metadata.ogTitle || "",
          ogDescription: metadata.ogDescription || "",
          ogImage: metadata.ogImage || "",
          ogType: metadata.ogType || "",
          twitterCard: metadata.twitterCard || "",
          twitterTitle: metadata.twitterTitle || "",
          twitterDescription: metadata.twitterDescription || "",
          twitterImage: metadata.twitterImage || "",
          canonicalUrl: metadata.canonicalUrl || "",
          schemaData: metadata.schemaData || "",
        };
      
      case 'current-affairs':
        return {
          title: page.title || "",
          content: parsedContent || "",
          imageUrl: parsedimage || undefined,
          metaTitle: metadata.metaTitle || "",
          metaDescription: metadata.metaDescription || "",
          metaKeywords: metadata.metaKeywords || "",
          robots: metadata.robots || "",
          ogTitle: metadata.ogTitle || "",
          ogDescription: metadata.ogDescription || "",
          ogImage: metadata.ogImage || "",
          ogType: metadata.ogType || "",
          twitterCard: metadata.twitterCard || "",
          twitterTitle: metadata.twitterTitle || "",
          twitterDescription: metadata.twitterDescription || "",
          twitterImage: metadata.twitterImage || "",
          canonicalUrl: metadata.canonicalUrl || "",
          schemaData: metadata.schemaData || "",
        };
      case 'upsc-notes':
        return {
          title: page.title || "",
          content: parsedContent || "",
          metaTitle: metadata.metaTitle || "",
          metaDescription: metadata.metaDescription || "",
          metaKeywords: metadata.metaKeywords || "",
          robots: metadata.robots || "",
          ogTitle: metadata.ogTitle || "",
          ogDescription: metadata.ogDescription || "",
          ogImage: metadata.ogImage || "",
          ogType: metadata.ogType || "",
          twitterCard: metadata.twitterCard || "",
          twitterTitle: metadata.twitterTitle || "",
          twitterDescription: metadata.twitterDescription || "",
          twitterImage: metadata.twitterImage || "",
          canonicalUrl: metadata.canonicalUrl || "",
          schemaData: metadata.schemaData || "",
        };
      default:
        return {
          title: page.title || "",
          content: parsedContent || "",
          imageUrl: parsedimage || undefined,
          metaTitle: metadata.metaTitle || "",
          metaDescription: metadata.metaDescription || "",
          metaKeywords: metadata.metaKeywords || "",
          robots: metadata.robots || "",
          ogTitle: metadata.ogTitle || "",
          ogDescription: metadata.ogDescription || "",
          ogImage: metadata.ogImage || "",
          ogType: metadata.ogType || "",
          twitterCard: metadata.twitterCard || "",
          twitterTitle: metadata.twitterTitle || "",
          twitterDescription: metadata.twitterDescription || "",
          twitterImage: metadata.twitterImage || "",
          canonicalUrl: metadata.canonicalUrl || "",
          schemaData: metadata.schemaData || "",
        };
    }
  };

  const openDeleteModal = (pageId: number) => {
    setShowDeleteModal(true);
    setPageIdToDelete(pageId);
  }

  const handleDelete = async () => {
    if(!pageIdToDelete) return;

    try {
      await fetch(`${env.API}/page/${pageIdToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPages();
      setShowDeleteModal(false);
      setPageIdToDelete(null);
    } catch (error) {
      console.error('Error deleting page:', error);
      setPageIdToDelete(null);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Management
        </h1>
        <p className="text-gray-600">Manage your pages and content</p>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No pages found. Create your first page to get started!
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Pages</h2>
              <Link
                href="/dashboard/add"
                target="_blank"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Page
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Path
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr
                      key={page.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {page.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{page.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {page.templateId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(page.updatedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => fetchPageById(page.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(page.id)}
                            className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                          <Link
                            href={`/${page.slug}`}
                            target="_blank"
                            className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50 transition-colors"
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showForm && selectedPage && (
        <div className="mt-8">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Page</h2>
            <div className="space-y-6">
              {selectedPage.templateId === "article" && (
                <ArticleForm
                  onSubmit={saveEdit}
                  initialData={getInitialFormData(
                    selectedPage,
                    selectedPage.templateId
                  )}
                />
              )}
              {selectedPage.templateId === "upsc-notes" && (
                <UpscNotesForm
                  onSubmit={saveEdit}
                  initialData={getInitialFormData(
                    selectedPage,
                    selectedPage.templateId
                  )}
                />
              )}
              {selectedPage.templateId === "general-studies" && (
                <GeneralStudiesForm
                  onSubmit={saveEdit}
                  defaultValues={getInitialFormData(
                    selectedPage,
                    selectedPage.templateId
                  )}
                />
              )}
              {selectedPage.templateId === "current-affairs" && (
                <CurrentAffairForm
                  onSubmit={saveEdit}
                  defaultValues={getInitialFormData(
                    selectedPage,
                    selectedPage.templateId
                  )}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this page? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageList;