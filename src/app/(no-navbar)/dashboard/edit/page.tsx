"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  ArticleForm,
  UpscNotesForm,
  GeneralStudiesForm,
  CurrentAffairForm,
  BlogForm,
  CustomLinkForm,
} from "@/components/dashboard/forms";
import Cookie from "js-cookie";
import { env } from "@/config/env";
import { uploadImageToS3 } from "@/config/imageUploadS3";
import Drafts from "@/components/ui/drafts";

interface Page {
  id: number;
  slug: string;
  title: string;
  categories?: Array<{ id: number; name: string }>;
  tags: Array<{
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>;
  FAQ: string;
  templateId: string;
  showInNav: boolean;
  updatedAt: string;
  content: string;
  imageUrl: string | null;
  parentId?: number;
  level?: number;
  order?: number;
  metadata?: string;
  link?: string;
}

function PageList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pageIdToDelete, setPageIdToDelete] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const token = Cookie.get("token");

  const categories = [
    { id: "all", name: "All Pages" },
    { id: "article", name: "Articles" },
    { id: "upsc-notes", name: "UPSC Notes" },
    { id: "general-studies", name: "General Studies" },
    { id: "current-affairs", name: "Current Affairs" },
    { id: "blog", name: "Blogs" },
    { id: "custom-link", name: "Custom Links" },
  ];

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || page.templateId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPages.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch(`${env.API}/page`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch pages");
      const { data } = await response.json();
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageById = async (pageId: number) => {
    try {
      const response = await fetch(`${env.API}/page/id/${pageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch page");
      const { data } = await response.json();
      setSelectedPage(data);
      setShowForm(true);

      // Scroll to the form container after a small delay to ensure the form is mounted
      setTimeout(() => {
        const formContainer = document.querySelector(
          ".bg-white.shadow-sm.rounded-lg.p-6"
        );
        if (formContainer) {
          formContainer.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      console.error("Error fetching page:", error);
    }
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
            (await uploadImageToS3(formData, "ContentImages", fileNmae)) ||
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

  const saveEdit = async (formData: any) => {
    if (!selectedPage) return;
    console.log("Form data:", formData);

    try {
      // Generate new slug from title if it has changed
      const newTitle = formData.title;
      const newSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // Get the current page's level in the hierarchy
      const currentLevel = selectedPage.slug.split("/").length;

      formData.content = await handleImageUpload(formData.content);
      // Create the page data object
      const pageData = {
        id: selectedPage.id,
        title: newTitle,
        slug:
          selectedPage.templateId === "blog"
            ? formData.slug
            : selectedPage.title !== newTitle
            ? [
                ...selectedPage.slug.split("/").slice(0, currentLevel - 1),
                newSlug,
              ].join("/")
            : selectedPage.slug,
        templateId: selectedPage.templateId,
        category: formData.category,
        parentId: selectedPage.parentId || null,
        FAQ: formData.FAQ,
        imageUrl: formData.imageUrl,
        content:
          selectedPage.templateId === "custom-link"
            ? "dummy"
            : formData.content,
        link: selectedPage.templateId === "custom-link" ? formData.link : null,
        metadata: {
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
        },
        level: selectedPage.level || 0,
        showInNav: formData.showInNav || false,
        order: selectedPage.order || 0,
        updatedAt: new Date().toISOString(),
        tags: formData.tags,
      };

      // Prepare data for API submission with stringified content and metadata
      const apiPageData = {
        ...pageData,
        content: pageData.content,
        metadata: JSON.stringify(pageData.metadata),
      };

      const response = await fetch(`${env.API}/page/${selectedPage.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiPageData),
      });

      if (!response.ok) throw new Error("Failed to update page");

      // Refresh the page list
      fetchPages();
      setSelectedPage(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const getInitialFormData = (page: Page, templateId: string): any => {
    const parsedContent = page.content || "";
    // @ts-ignore
    const metadata = JSON.parse(page.metadata || "{}");
    const parsedimage = page.imageUrl || undefined;
    switch (templateId) {
      case "article":
        return {
          title: page.title || "",
          content: parsedContent || "",
          showInNav: page.showInNav || false,
          FAQ: page.FAQ || "",
          imageUrl: parsedimage || undefined,
          category: page.categories || [],
          tags: page.tags.map((tag) => tag.name) || [],
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
          header: metadata.header || "",
          body: metadata.body || "",
        };

      case "general-studies":
        return {
          title: page.title || "",
          content: parsedContent || "",
          showInNav: page.showInNav || false,
          category: page.categories || [],
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
          header: metadata.header || "",
          body: metadata.body || "",
        };

      case "current-affairs":
        return {
          title: page.title || "",
          content: parsedContent || "",
          showInNav: page.showInNav || false,
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
          header: metadata.header || "",
          body: metadata.body || "",
        };
      case "upsc-notes":
        return {
          title: page.title || "",
          content: parsedContent || "",
          showInNav: page.showInNav || false,
          category: page.categories || [],
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
          header: metadata.header || "",
          body: metadata.body || "",
        };
      case "blog":
        return {
          title: page.title || "",
          content: parsedContent || "",
          showInNav: false,
          imageUrl: parsedimage || undefined,
          slug: page.slug || "",
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
          header: metadata.header || "",
          body: metadata.body || "",
        };
      case "custom-link":
        return {
          title: page.title || "",
          content: parsedContent || "",
          link: page.link || "",
          showInNav: page.showInNav || false,
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
          header: metadata.header || "",
          body: metadata.body || "",
        };
    }
  };
  const openDeleteModal = (pageId: number) => {
    setShowDeleteModal(true);
    setPageIdToDelete(pageId);
  };

  const handleDelete = async () => {
    if (!pageIdToDelete) return;

    try {
      await fetch(`${env.API}/page/${pageIdToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPages();
      setShowDeleteModal(false);
      setPageIdToDelete(null);
    } catch (error) {
      console.error("Error deleting page:", error);
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
      <div className="mb-6 mt-7 ml-2">
        <h1 className="text-3xl font-bold text-[var(--admin-bg-dark)] mb-1">
          Page Management
        </h1>
        <p className="text-[var(--admin-secondary)]">
          Manage your pages and content
        </p>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--admin-primary)] text-lg">
            No pages found. Create your first page to get started!
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[var(--admin-bg-dark)]">
                Pages
              </h2>
              <Link
                href="/dashboard/add"
                target="_blank"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Page
              </Link>
            </div>

            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Search pages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-[var(--admin-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--admin-border)]">
                <thead className="bg-[var(--admin-bg-lightest)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--admin-primary)] uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--admin-primary)] uppercase tracking-wider">
                      Path
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--admin-primary)] uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--admin-primary)] uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--admin-primary)] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[var(--admin-border)]">
                  {currentItems.map((page) => (
                    <tr
                      key={page.id}
                      className="hover:bg-[var(--admin-bg-lightest)] transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[var(--admin-bg-dark)]">
                          {page.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--admin-primary)]">
                          {page.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--admin-primary)]">
                          {page.templateId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--admin-primary)]">
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
                            href={page.link ? page.link : `/${page.slug}`}
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

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-[var(--admin-border)] px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstItem + 1}</span>
                    {" to "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredPages.length)}
                    </span>
                    {" of "}
                    <span className="font-medium">{filteredPages.length}</span>
                    {" results"}
                  </p>
                </div>
                <div>
                  <nav className="flex flex-wrap gap-1 justify-center" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ${
                            page === currentPage
                              ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                              : "text-gray-900 ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && selectedPage && (
        <div className="mt-8">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[var(--admin-bg-dark)] mb-6">
              Edit Page
            </h2>
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
                  folder={"GeneralStudies"}
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
              {selectedPage.templateId === "blog" && (
                <BlogForm
                  onSubmit={saveEdit}
                  defaultValues={getInitialFormData(
                    selectedPage,
                    selectedPage.templateId
                  )}
                />
              )}
              {selectedPage.templateId === "custom-link" && (
                <CustomLinkForm
                  onSubmit={saveEdit}
                  initialData={getInitialFormData(
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
            <h2 className="text-lg font-semibold text-[var(--admin-bg-dark)] mb-4">
              Confirm Deletion
            </h2>
            <p className="text-[var(--admin-secondary)] mb-6">
              Are you sure you want to delete this page? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-[var(--admin-bg-light)] text-[var(--admin-bg-primary)] rounded-md hover:bg-gray-300"
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
      <Drafts />
    </div>
  );
}

export default PageList;
