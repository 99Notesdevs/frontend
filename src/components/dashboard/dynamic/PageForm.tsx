"use client";

import React, { useState, useEffect } from "react";
import {
  ArticleForm,
  GeneralStudiesForm,
  UpscNotesForm,
  CurrentAffairForm,
  BlogForm,
  CustomLinkForm,
} from "../forms";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { env } from "@/config/env";
import Cookie from "js-cookie";
import { uploadImageToS3 } from "@/config/imageUploadS3";
import {
  Checkbox,
} from "@/components/ui/Checkbox";

interface TemplateType {
  id: string;
  name: string;
  description: string;
  layout: any;
  createdAt: Date;
  updatedAt: Date;
}

interface Page {
    id: string;
    title: string;
    slug: string;
    level: number;
    showInNav: boolean;
    parentId?: string | null;
}

interface PageWithRelations extends Page {
    parent: PageWithRelations | null;
  children: PageWithRelations[];
  data?: any;
}

interface PageFormProps {
  editPage?: PageWithRelations | null;
}

interface PageFormData extends Record<string, any> {
  title?: string;
  hero?: {
    title: string;
  };
  content?: string;
  imageUrl?: string;
  slug?: string;
  link?: string;
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
}

export function PageForm({ editPage = null }: PageFormProps) {
  const [pages, setPages] = useState<PageWithRelations[]>([]);
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    Array(7).fill("")
  );
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookie.get("token");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchPages();
    fetchTemplates();
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
      showToast("Failed to load pages. Please try again.", "error");
    }
  };

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${env.API}/template`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();

      setTemplates(data.templates || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching templates:", error);
      showToast("Failed to load templates. Please try again.", "error");
      setIsLoading(false);
    }
  };

  const handleLevelChange = (level: number, value: string) => {
    const newLevels = [...selectedLevels];
    newLevels[level] = value === "_none" ? "" : value; // Convert _none to empty string
    // Clear all subsequent levels
    for (let i = level + 1; i < newLevels.length; i++) {
      newLevels[i] = "";
    }
    setSelectedLevels(newLevels);
  };

  const getPagesForLevel = (level: number): PageWithRelations[] => {
    // For level 0, return only root pages (no parent)
    if (level === 0) {
      return pages.filter((page) => !page.parent && page.showInNav);
    }

    const parentId = selectedLevels[level - 1];
    if (!parentId) return [];

    // Filter by both parent ID, level, and showInNav to prevent duplicate levels
    return pages.filter(
      (page) => 
        page.parent?.id === parentId && 
        page.level === level + 1 && 
        page.showInNav
    );
  };

  const getCurrentLevel = (): number => {
    let level = 0;
    for (let i = 0; i < selectedLevels.length; i++) {
      if (selectedLevels[i]) level = i + 1;
    }
    return level;
  };

  const getSelectedParentId = (): string | null => {
    return selectedLevels.filter(Boolean).pop() || null;
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

          const url = (await uploadImageToS3(formData, "ContentImages")) || "error";
          img.setAttribute("src", url);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error uploading image:", error.message);
          }
          showToast("Failed to upload image. Please try again.", "error");
        }
      }
    }

    return doc.body.innerHTML;
  };

  const handleSubmit = async (formData: PageFormData) => {
    try {
      const parentId = getSelectedParentId();
      const currentTemplate = templates.find((t) => t.id === selectedTemplate);

      if (!currentTemplate) {
        throw new Error("No template selected");
      }
      // Generate the full path for the slug
      const fullPath = selectedLevels
        .filter((level) => level)
        .map((level) => {
          // Get the page for this level
          const page = pages.find((p) => p.id === level);
          if (!page) return "";

          // Extract just the last segment of the slug, not the full path
          // This prevents duplication of parent paths
          const slugParts = page.slug.split("/");
          return slugParts[slugParts.length - 1];
        })
        .concat(
          (formData.title || formData.hero?.title || "")
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
        )
        .join("/");

      // Calculate the correct level based on the path depth
      // This ensures the level in the database matches the actual path depth
      const pathLevel = selectedLevels.filter(Boolean).length + 1;

      // @ts-ignore
      formData.content = await handleImageUpload(formData.content);
      // Create the page data based on template type
      const pageData = {
        title: formData.title || formData.hero?.title,
        slug: fullPath,
        link: currentTemplate.id === "custom-link" ? formData.link : "",
        templateId: currentTemplate.id,
        parentId: parentId || null,
        content: currentTemplate.id === "custom-link" ? "dummyContent" : formData.content, // Directly use the HTML content
        metadata: {
          lastUpdated: new Date().toISOString(),
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
        imageUrl: formData.imageUrl,
        level: pathLevel || 0, // Use the path depth as the level
        showInNav: formData.showInNav,
        order: 0,
      };

      if (!pageData.title) {
        throw new Error("Title is required");
      }

      // Prepare data for API submission
      const apiPageData = {
        ...pageData,
        metadata: JSON.stringify(pageData.metadata),
      };

      // Submit to API
      const response = await fetch(`${env.API}/page`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiPageData),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          responseData.message || responseData.error || "Failed to create page"
        );
      }

      // Reset form and refresh
      setSelectedTemplate("");
      setSelectedLevels(Array(7).fill(""));
      setStep(1);
      await fetchPages();

      // Show success message
      showToast("Page created successfully!", "success");
    } catch (error) {
      console.error("Error creating page:", error);
      showToast("Failed to create page. Please try again.", "error");
    }
  };

  // Validate content based on template type
  // const validateContentByTemplate = (templateId: string, content: any) => {
  //   switch (templateId) {
  //     case "article":
  //       if (!formData.title) throw new Error("Title is required");
  //       if (!formData.content || formData.content.length < 10) {
  //         throw new Error("Content must be at least 10 characters");
  //       }
  //       break;

  //     case "general-studies":
  //       if (!content.title) throw new Error("Title is required");
  //       if (!content.content || content.content.length < 10) {
  //         throw new Error("Content must be at least 10 characters");
  //       }
  //       break;

  //     case "upsc-notes":
  //       if (!content.title) throw new Error("Title is required");
  //       if (!content.content || content.content.length < 10) {
  //         throw new Error("Content must be at least 10 characters");
  //       }
  //       break;

  //     default:
  //       break;
  //   }
  // };

  const renderTemplateForm = () => {
    const currentTemplate = templates.find((t) => t.id === selectedTemplate);
    if (!currentTemplate) {
      return null;
    }

    const formProps = {
      onSubmit: handleSubmit,
      defaultValues: editPage?.data || undefined,
      folder: "GeneralStudies"
    };

    // Map template IDs to form components
    const templateForms: Record<string, React.ComponentType<any>> = {
      article: ArticleForm,
      "general-studies": GeneralStudiesForm,
      "upsc-notes": UpscNotesForm,
      "blog": BlogForm,
      "current-affairs": CurrentAffairForm,
      "custom-link": CustomLinkForm,
    };

    const FormComponent = templateForms[currentTemplate.id];
    if (!FormComponent) {
      console.error(
        "No form component found for template ID:",
        currentTemplate.id
      );
      return null;
    }

    return <FormComponent {...formProps} />;
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Select Page Location
              </h3>
              <div className="space-y-4">
                {Array.from({ length: getCurrentLevel() + 1 }).map(
                  (_, level) => (
                    <div key={level}>
                      <label className="block text-sm font-medium text-slate-800 mb-1">
                        Level {level + 1}{" "}
                        {level >= 4 && "(Not shown in navbar)"}
                      </label>
                      <Select
                        value={selectedLevels[level]}
                        onValueChange={(value: string) =>
                          handleLevelChange(level, value)
                        }
                      >
                        <SelectTrigger className="w-full border-slate-200 text-white focus:border-slate-400 focus:ring-slate-400">
                          <SelectValue
                            placeholder={
                              level === 0
                                ? "Select root page"
                                : `Select level ${level + 1} page`
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">
                            {level === 0
                              ? "No parent (Root level)"
                              : `Create as level ${level + 1} page`}
                          </SelectItem>
                          {getPagesForLevel(level).map(
                            (page: PageWithRelations) => (
                              <SelectItem key={page.id} value={page.id}>
                                {page.title}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-slate-800 text-white px-8 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                >
                  Next: Select Template
                </Button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Select Template
              </h3>
              <Select
                value={selectedTemplate || "_none"}
                onValueChange={(value: string) => {
                  setSelectedTemplate(value === "_none" ? "" : value);
                }}
              >
                <SelectTrigger className="w-full border-slate-200 text-white focus:border-slate-400 focus:ring-slate-400">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Choose a template...</SelectItem>
                  {!isLoading && templates?.length > 0 ? (
                    templates.map((template: TemplateType) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="_loading">
                      Loading templates...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <div className="mt-6 flex justify-between">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="border-slate-200 text-slate-800 hover:bg-slate-50"
                >
                  Back to Path Selection
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedTemplate}
                  className="bg-slate-800 text-white px-8 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
                >
                  Next: Fill Form
                </Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Fill Page Details
                </h3>
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Back to Template Selection
                </Button>
              </div>
              {renderTemplateForm()}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === "success"
              ? "bg-slate-900 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <p className="text-sm">{toast.message}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        {[
          { number: 1, title: "Select Path" },
          { number: 2, title: "Choose Template" },
          { number: 3, title: "Fill Details" },
        ].map((s) => (
          <div key={s.number} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= s.number
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {s.number}
            </div>
            <span
              className={`ml-2 ${
                step >= s.number ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {s.title}
            </span>
            {s.number < 3 && <div className="w-24 h-px mx-4 bg-slate-200" />}
          </div>
        ))}
      </div>

      {renderStepContent()}
    </div>
  );
}
