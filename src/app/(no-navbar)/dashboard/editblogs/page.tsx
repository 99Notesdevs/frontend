"use client";

import React, { useEffect, useState, useRef } from "react";
import { api } from "@/config/api/route";
import Cookie from "js-cookie";
import SearchBarBlogs from "@/components/Navbar/SearchBarBlogs";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BlogForm } from "@/components/dashboard/forms";
import { BlogFormValues } from "@/components/dashboard/forms/BlogForm";
import { uploadImageToS3 } from "@/config/imageUploadS3";
import Drafts from "@/components/ui/drafts";
interface BlogType {
  id: number;
  title: string;
  content: string;
  slug: string;
  order: number;
  metadata?: string;
  tags?: string[];
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filteredPages, setFilteredPages] = useState<BlogType[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(
    selectedPage?.imageUrl || null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const itemsPerPage = 10;
  const token = Cookie.get("token");

  const fetchPages = async (searchTerm = "") => {
    try {
      setError(null);
      setLoading(true);

      const skip = (currentPage - 1) * itemsPerPage;
      const url =`/blog?skip=${skip}&take=${itemsPerPage}`;

      const response = (await api.get(url)) as {
        success: boolean; 
        data: BlogType[];
        message?: string;
      };

      // Handle case when no blogs are found
      if (response.success && (!response.data || response.data.length === 0)) {
        setPages([]);
        setFilteredPages([]);
        setTotalPages(0);
        return;
      }

      if (!response.success) {
        // If the error is specifically about blogs not found, handle it gracefully
        if (response.message === "Blogs not found") {
          setPages([]);
          setFilteredPages([]);
          setTotalPages(0);
          return;
        }
        throw new Error(response.message || "Failed to fetch pages");
      }

      const pagesData = response.data || [];

      // Get total count for pagination
      const countResponse = (await api.get(`/blog/count`)) as {
        success: boolean; 
        data: number;
        message?: string;
      };
      
      if (!countResponse.success) {
        console.warn("Failed to fetch pages count:", countResponse.message);
        // Don't throw error here, we can still continue with the data we have
      }
      
      const totalItems = countResponse.data || pagesData.length;

      setPages(pagesData);
      setFilteredPages(pagesData);
      setTotalPages(Math.max(1, Math.ceil(totalItems / itemsPerPage)));
    } catch (err) {
      console.error("Error fetching pages:", err);
      // Don't show error for 'Blogs not found' case, just set empty state
      if (err instanceof Error && err.message.includes("Blogs not found")) {
        setPages([]);
        setFilteredPages([]);
        setTotalPages(0);
      } else {
        setError(err instanceof Error ? err.message : "An error occurred while fetching blogs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (selectedPage) {
      setImagePreview(selectedPage.imageUrl || null);
    }
  }, [selectedPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
const handleSearchResultClick = async (blog: any) => {
  try {
    setLoading(true);
    const response = await api.get(`/blog/slug/${blog.slug}`) as {
        success: boolean; data: BlogType;
      };
    
    if (response.success) {
      setSelectedPage(response.data);
      setError(null);
      setSearchQuery("");
      
      // Scroll to the form container after a small delay to ensure the form is mounted
      setTimeout(() => {
        const formContainer = document.querySelector(
          ".bg-white.p-6.rounded-xl.shadow-md"
        );
        if (formContainer) {
          formContainer.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    setError("Failed to load the selected blog. Please try again.");
  } finally {
    setLoading(false);
  }
};
  const handleEdit = async (page: BlogType) => {
    setSelectedPage(page);
    setError(null);

    // Scroll to the form container after a small delay to ensure the form is mounted
    setTimeout(() => {
      const formContainer = document.querySelector(
        ".bg-white.p-6.rounded-xl.shadow-md"
      );
      if (formContainer) {
        formContainer.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    setImagePreview(page.imageUrl || null);
  };

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
      const fileNmae =
        (img.getAttribute("title") || getFormattedDate()) + ".png";

      if (isBlob || isBase64) {
        try {
          const response = await fetch(src);
          const blob = await response.blob();

          const formData = new FormData();
          formData.append("imageUrl", blob, "image.png");

          const url =
            (await uploadImageToS3(formData, "BlogsContent", fileNmae)) ||
            "error";
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

      // Log the raw form data
      console.log("Raw form data:", formData);

      // Generate slug from title
      // const baseSlug = formData.title
      //   .toLowerCase()
      //   .replace(/\s+/g, '-')
      //   .replace(/[^a-z0-9-]/g, '');
      // const slug = `${baseSlug}`;

      // Create metadata object
      const metadata = {
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
        header: formData.header || "",
        body: formData.body || "",
      };

      // Log the metadata object
      console.log("Metadata object:", metadata);

      formData.content = await handleImageUpload(formData.content);
      const updateData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        slug: formData.slug,
        updatedAt: new Date(),
        imageUrl: formData.imageUrl || "",
        metadata: JSON.stringify(metadata),
      };

      // Log the final update data that will be sent
      console.log("Final update data to be sent:", updateData);

      if (!selectedPage) {
        setError("No page selected");
        return;
      }

      const response = (await api.put(
        `/blog/${selectedPage.id}`,
        updateData
      )) as { success: boolean; data: BlogType };

      if (!response.success) {
        throw new Error("Failed to update blog");
      }

      const { data } = response;
      setSelectedPage(data);

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
      const response = (await api.delete(`/blog/${id}`)) as any;

      console.log("Delete response:", response);

      // Check different possible response structures
      const isSuccess = response?.success || response?.data?.success;
      
      if (!isSuccess) {
        throw new Error("Failed to delete blog");
      }

      // Show success message and refresh the blogs list
      setShowDeleteSuccess(true);
      setSelectedPage(null);
      setDeleteConfirm(null);
      setError(null);
      
      // Refresh the blogs list
      await fetchPages(searchQuery);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowDeleteSuccess(false);
      }, 3000);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--admin-primary)]"></div>
      </div>
    );
  }

  // Don't show error page for empty state, handle it in the main UI
  if (error && pages.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-[var(--admin-primary)]">{error}</p>
        <button
          onClick={() => {
            fetchPages();
          }}
          className="bg-[var(--admin-bg-primary)] hover:bg-[var(--admin-bg-secondary)] text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Blog List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-full max-w-md">
                <SearchBarBlogs
                  onResultClick={handleSearchResultClick}
                  compact={false}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setError(null);
                  setSelectedPage(null);
                  setImagePreview(null);
                }}
                className="bg-[var(--admin-bg-primary)] hover:bg-[var(--admin-bg-secondary)] text-white font-bold py-2 px-4 rounded"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="text-[var(--admin-primary)]">{error}</p>
            </div>
          )}
          
          {showDeleteSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Blog deleted successfully!
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-[var(--admin-primary)]">
              Loading blogs...
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPages.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Blogs Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchQuery 
                      ? 'No blogs match your search. Try different keywords.' 
                      : 'You haven\'t created any blogs yet. Click the button below to create your first blog post.'}
                  </p>
                  <button
                    onClick={() => setSelectedPage(null)}
                    className="bg-[var(--admin-bg-primary)] hover:bg-[var(--admin-bg-secondary)] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    Create Your First Blog
                  </button>
                </div>
              ) : (
                filteredPages.map((page) => (
                <div
                  key={page.id}
                  className="bg-[var(--admin-bg-lightest)] p-4 rounded-lg hover:bg-[var(--admin-bg-light)] transition-colors cursor-pointer"
                  onClick={() => handleEdit(page)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{page.title}</h3>
                      <p className="text-sm text-[var(--admin-primary)]">
                        Created: {new Date(page.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(page);
                        }}
                        className="p-2 text-[var(--admin-primary)] hover:text-[var(--admin-secondary)]"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(page.id);
                        }}
                        className="p-2 text-red-500 hover:text-red-600"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4 px-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>

              {/* First page */}
              <button
                onClick={() => handlePageChange(1)}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md ${
                  currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                } transition-colors`}
              >
                1
              </button>

              {/* Ellipsis if needed */}
              {currentPage > 3 && (
                <span className="px-2 py-2">...</span>
              )}

              {/* Current page and adjacent pages */}
              {Array.from(
                { length: Math.min(3, totalPages - 2) },
                (_, i) => {
                  let pageNum;
                  if (currentPage <= 2) {
                    pageNum = i + 2; // Show 2,3,4 if on first few pages
                  } else if (currentPage >= totalPages - 1) {
                    pageNum = totalPages - 3 + i; // Show last 3 pages if on last few pages
                  } else {
                    pageNum = currentPage - 1 + i; // Show current page with one before and after
                  }

                  if (pageNum > 1 && pageNum < totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md ${
                          currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                        } transition-colors`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                }
              )}

              {/* Ellipsis if needed */}
              {currentPage < totalPages - 2 && totalPages > 5 && (
                <span className="px-2 py-2">...</span>
              )}

              {/* Last page */}
              {totalPages > 1 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md ${
                    currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors`}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 sm:px-4 sm:py-2 rounded-md bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition-colors"
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
                title: selectedPage?.title || "",
                content: selectedPage?.content || "",
                slug: selectedPage?.slug || "",
                order: selectedPage?.order || 0,
                imageUrl: selectedPage?.imageUrl || "",
                tags: selectedPage?.tags || [],
                metaTitle: JSON.parse(selectedPage.metadata || "")?.metaTitle,
                metaDescription: JSON.parse(selectedPage.metadata || "")
                  ?.metaDescription,
                metaKeywords: JSON.parse(selectedPage.metadata || "")
                  .metaKeywords,
                robots: JSON.parse(selectedPage.metadata || "").robots,
                ogTitle: JSON.parse(selectedPage.metadata || "")?.ogTitle,
                ogDescription: JSON.parse(selectedPage.metadata || "")
                  ?.ogDescription,
                ogImage: JSON.parse(selectedPage.metadata || "")?.ogImage,
                ogType: JSON.parse(selectedPage.metadata || "")?.ogType,
                twitterCard: JSON.parse(selectedPage.metadata || "")
                  ?.twitterCard,
                twitterTitle: JSON.parse(selectedPage.metadata || "")
                  ?.twitterTitle,
                twitterDescription: JSON.parse(selectedPage.metadata || "")
                  ?.twitterDescription,
                twitterImage: JSON.parse(selectedPage.metadata || "")
                  ?.twitterImage,
                canonicalUrl: JSON.parse(selectedPage.metadata || "")
                  ?.canonicalUrl,
                schemaData: JSON.parse(selectedPage.metadata || "")?.schemaData,
                header: JSON.parse(selectedPage.metadata || "")?.header,
                body: JSON.parse(selectedPage.metadata || "")?.body,
              }}
            />
          ) : (
            <div className="text-center py-8 text-[var(--admin-primary)]">
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
                className="px-4 py-2 text-[var(--admin-secondary)] hover:text-[var(--admin-bg-dark)]"
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
      <Drafts types={["blogDrafts"]} />
    </div>
  );
}
