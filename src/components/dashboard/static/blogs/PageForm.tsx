"use client";

import React from "react";
import { BlogForm } from "@/components/dashboard/forms";
import { uploadImageToS3 } from "@/config/imageUploadS3";
import Drafts from "@/components/ui/drafts";
import { api } from "@/config/api/route";

interface BlogType {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  tags?: string[];
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
  tags?: string[];
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
  slug: string;
  order?: number;
}

interface PageFormProps {
  editPage?: BlogType | null;
}

export default function PageForm({ editPage = null }: PageFormProps) {
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
      const fileName =
        (img.getAttribute("title") || getFormattedDate()) + ".png";

      if (isBlob || isBase64) {
        try {
          const response = await fetch(src);
          const blob = await response.blob();

          const formData = new FormData();
          formData.append("imageUrl", blob, "image.png");

          const url =
            (await uploadImageToS3(formData, "BlogsContent", fileName)) ||
            "error";
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

  const handleSubmit = async (data: BlogFormValues) => {
    try {
      // Normalize the slug by replacing spaces with hyphens
      // const normalizedSlug = data.title.replace(/\s+/g, '-').toLowerCase();

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
        schemaData: data.schemaData,
        header: data.header,
        body: data.body,
      };

      data.content = await handleImageUpload(data.content);
      // Stringify metadata and create final form data
      const formData = {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        metadata: JSON.stringify(metadata),
        tags: data.tags,
        slug: data.slug,
        order: data.order,
      };

      const response = (await api.post(`/blog`, formData)) as {
        success: boolean;
      };

      if (!response.success) {
        throw new Error("Failed to save blog");
      }

      // Refresh the page after successful submission
      window.location.reload();
    } catch (error) {
      console.error("Error saving blog:", error);
      // Add proper error handling here
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {editPage ? "Edit Blog" : "Add New Blog"}
      </h1>
      <BlogForm onSubmit={handleSubmit} defaultValues={editPage || undefined} />
      <Drafts types={["blogDrafts"]} />
    </div>
  );
}
