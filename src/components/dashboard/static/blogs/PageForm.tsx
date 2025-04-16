"use client";

import React from 'react';
import { BlogForm } from '@/components/dashboard/forms';
import { env } from '@/config/env';
import Cookie from 'js-cookie';

interface BlogType {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
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
  };
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogFormValues {
  title: string;
  content: string;
  imageUrl?: string;
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
  slug: string;
  order?: number;
}

interface PageFormProps {
  editPage?: BlogType | null;
}

export default function PageForm({ editPage = null }: PageFormProps) {
  const token = Cookie.get('token');

  const handleSubmit = async (data: BlogFormValues) => {
    try {
      // Normalize the slug by replacing spaces with hyphens
      const normalizedSlug = data.slug.replace(/\s+/g, '-');
      
      // Create metadata object from individual fields
      const metadata = {
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        robots: data.robots,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
        ogType: data.ogType,
        twitterCard: data.twitterCard,
        twitterTitle: data.twitterTitle,
        twitterDescription: data.twitterDescription,
        twitterImage: data.twitterImage,
        canonicalUrl: data.canonicalUrl,
        schemaData: data.schemaData
      };

      // Stringify metadata and create final form data
      const formData = {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        metadata: JSON.stringify(metadata),
        slug: normalizedSlug,
        order: data.order
      };

      const response = await fetch(`${env.API}/blog`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save blog');
      }

      // Refresh the page after successful submission
      window.location.reload();
    } catch (error) {
      console.error('Error saving blog:', error);
      // Add proper error handling here
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{editPage ? 'Edit Blog' : 'Add New Blog'}</h1>
      <BlogForm onSubmit={handleSubmit} defaultValues={editPage || undefined} />
    </div>
  );
}
 