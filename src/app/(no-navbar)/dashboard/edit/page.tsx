"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import {ArticleForm, UpscNotesForm, GeneralStudiesForm , CurrentAffairForm} from '@/components/dashboard/forms';
import Cookie from 'js-cookie';
import { env } from '@/config/env';

interface Page {
  id: number;
  slug: string;
  title: string;
  templateId: string;
  updatedAt: string;
  content: string;
  image: string | null;
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

  const saveEdit = async (formData: any) => {
    if (!selectedPage) return;

    try {
      // Generate new slug from title if it has changed
      const newTitle = formData.title;
      const newSlug = newTitle.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Get the current page's level in the hierarchy
      const currentLevel = selectedPage.slug.split('/').length;
      
      // Create the page data object
      const pageData = {
        id: selectedPage.id,
        title: newTitle,
        slug: selectedPage.title !== newTitle 
          ? [...selectedPage.slug.split('/').slice(0, currentLevel - 1), newSlug].join('/') 
          : selectedPage.slug,
        templateId: selectedPage.templateId,
        parentId: selectedPage.parentId || null,
        content: formData.content,
        metadata: selectedPage.metadata || {
          lastUpdated: new Date().toISOString(),
          teamSize: 0
        },
        level: selectedPage.level || 0,
        showInNav: true,
        order: selectedPage.order || 0,
        updatedAt: new Date().toISOString()
      };

      // Prepare data for API submission with stringified content and metadata
      const apiPageData = {
        ...pageData,
        content: JSON.stringify(pageData.content),
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
    const parsedContent = page.content;
    const parsedimage=page.image || undefined;
    switch (templateId) {
      case 'article':
        return {
          title: page.title || '',
          content: parsedContent || '',
        };
      
      case 'general-studies':
        return {
          title: page.title || '',
          content: parsedContent || '',
          image: parsedimage || undefined,
        };
      
      case 'current-affairs':
        return {
          title: page.title || '',
          content: parsedContent || '',
          image: parsedimage || undefined,
        };
      case 'upsc-notes':
        return {
          title: page.title || '',
          content: parsedContent || '',
        };
      default:
        return {
          title: page.title || '',
          content: parsedContent || '',
          image: parsedimage || undefined,
        };
    }
  };

  const handleDelete = async (pageId: number) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }

    try {
      await fetch(`${env.API}/page/${pageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300"></div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No pages found. Create your first page to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          <tr className="bg-slate-50">
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Path
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Template
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Last Updated
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {pages.map((page) => (
            <tr key={page.id} className="hover:bg-slate-50 transition-colors duration-150">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                {page.title}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {page.slug}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {page.templateId}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {new Date(page.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex space-x-2">
                  <button
                    onClick={() => fetchPageById(page.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && selectedPage && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Edit Page</h2>
          <div className="space-y-4">
            {selectedPage.templateId === 'article' && (
              <ArticleForm 
                onSubmit={saveEdit} 
                initialData={getInitialFormData(selectedPage, selectedPage.templateId)} 
              />
            )}
            {selectedPage.templateId === 'upsc-notes' && (
              <UpscNotesForm 
                onSubmit={saveEdit} 
                initialData={getInitialFormData(selectedPage, selectedPage.templateId)} 
              />
            )}
            {selectedPage.templateId === 'general-studies' && (
              <GeneralStudiesForm 
                onSubmit={saveEdit} 
                defaultValues={getInitialFormData(selectedPage, selectedPage.templateId)} 
              />
            )}
            {selectedPage.templateId === 'current-affairs' && (
              <CurrentAffairForm 
                onSubmit={saveEdit} 
                defaultValues={getInitialFormData(selectedPage, selectedPage.templateId)} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PageList;