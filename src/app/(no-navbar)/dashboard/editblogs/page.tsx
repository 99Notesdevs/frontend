"use client";

import React, { useEffect, useState } from "react";
import { env } from "@/config/env";
import Cookie from "js-cookie";

import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CalendarDaysIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { BlogForm } from "@/components/dashboard/forms";
import { BlogFormValues } from "@/components/dashboard/forms/BlogForm";
import { uploadImageToS3 } from "@/config/imageUploadS3";
interface BlogType {
  id: number;
  title: string;
  content: string;
  slug: string;
  order: number;
  metadata?: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
}

export default function ArticlesPage() {
  const [selectedPage, setSelectedPage] = useState<BlogType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<BlogType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPages, setFilteredPages] = useState<BlogType[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(
    selectedPage?.imageUrl || null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const itemsPerPage = 2;
  const token = Cookie.get("token");

  const fetchPages = async (parentSlug?: string, searchTerm = "") => {
    try {
      setError(null);
      setLoading(true);

      const skip = (currentPage - 1) * itemsPerPage;
      const url = searchTerm
        ? `${
            env.API
          }/blog/search?skip=${skip}&take=${itemsPerPage}&query=${encodeURIComponent(
            searchTerm
          )}`
        : `${env.API}/blog?skip=${skip}&take=${itemsPerPage}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch pages");
      }

      const data = await response.json();
      const pagesData = data.data || [];

      // Get total count for pagination
      const countResponse = await fetch(`${env.API}/blog/count`);
      if (!countResponse.ok) {
        throw new Error("Failed to fetch pages count");
      }
      const countData = await countResponse.json();
      const totalItems = countData.data || 0;

      setPages(pagesData);
      setFilteredPages(pagesData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (err) {
      console.error("Error fetching pages:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (selectedPage) {
      // Load the form data when a page is selected
      setImagePreview(selectedPage.imageUrl || null);
    }
  }, [selectedPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    fetchPages(undefined, query);
  };

  const handleEdit = (page: BlogType) => {
    setSelectedPage(page);
    setImagePreview(page.imageUrl || null);
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

    return doc.body.innerHTML;
  };

  const handleEditSubmit = async (formData: BlogFormValues) => {
    try {
      if (!token) {
        setError("Authentication required");
        return;
      }

      // Generate slug from title
      const baseSlug = formData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      const slug = `blog/${baseSlug}`;

      formData.content = await handleImageUpload(formData.content);
      const updateData = {
        title: formData.title,
        content: formData.content,
        slug: slug,
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
        }),
      };

      if (!selectedPage) {
        setError("No page selected");
        return;
      }

      const response = await fetch(`${env.API}/blog/${selectedPage.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update blog");
      }

      const { data } = await response.json();
      setSelectedPage(data);

      // Refresh the page list
      fetchPages();

      // Clear error if any
      setError(null);
    } catch (err) {
      console.error("Error updating blog:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the blog"
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      const response = await fetch(`${env.API}/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete blog");
      }

      // Refresh the page list
      fetchPages();
      setSelectedPage(null);
      setDeleteConfirm(null);
      setError(null);
    } catch (err) {
      console.error("Error deleting blog:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the blog"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => {
            fetchPages();
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Blog List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={handleSearch}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setError(null);
                  setSelectedPage(null);
                  setImagePreview(null);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading blogs...
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleEdit(page)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{page.title}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(page.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(page);
                        }}
                        className="p-2 text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(page.id);
                        }}
                        className="p-2 text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded ${
                      page === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Blog Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
          {selectedPage ? (
            <BlogForm
              onSubmit={handleEditSubmit}
              defaultValues={{
                title: selectedPage.title,
                content: selectedPage.content,
                metaTitle: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).metaTitle || ""
                  : "",
                metaDescription: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).metaDescription || ""
                  : "",
                metaKeywords: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).metaKeywords || ""
                  : "",
                robots: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).robots || ""
                  : "",
                ogTitle: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).ogTitle || ""
                  : "",
                ogDescription: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).ogDescription || ""
                  : "",
                ogImage: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).ogImage || ""
                  : "",
                ogType: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).ogType || ""
                  : "",
                twitterCard: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).twitterCard || ""
                  : "",
                twitterTitle: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).twitterTitle || ""
                  : "",
                twitterDescription: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).twitterDescription || ""
                  : "",
                twitterImage: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).twitterImage || ""
                  : "",
                canonicalUrl: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).canonicalUrl || ""
                  : "",
                schemaData: selectedPage.metadata
                  ? JSON.parse(selectedPage.metadata).schemaData || ""
                  : "",
              }}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a blog to edit
            </div>
          )}
        </div>
      </div>
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this blog?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600"
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
