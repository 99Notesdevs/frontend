"use client";
import type React from "react";
import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import DraftDialog from "@/components/ui/DraftDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { uploadImageToS3 } from "@/config/imageUploadS3";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Alert } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/ui/tags/tag-input";
import { FAQEditor, type FAQEditorRef } from "../../FAQp/FAQEditor";
import { useIndexedDBDrafts } from "@/hooks/useIndexedDBDrafts";

const TiptapEditor = dynamic(
  () => import("@/components/ui/tiptapeditor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    ),
  }
);

// Configure Tiptap to avoid SSR hydration issues
TiptapEditor.displayName = "TiptapEditor";

const articleSchema = z.object({
  title: z.string(),
  content: z.string(),
  imageUrl: z.string(),
  tags: z.array(z.string()).optional(),
  category: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  robots: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  ogType: z.string().optional(),
  twitterCard: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  schemaData: z.string().optional(),
  header: z.string().optional(),
  body: z.string().optional(),
  showInNav: z.boolean().default(false),
  questionNumber: z.number().optional(),
  FAQ: z.string().optional(),
  status: z.string().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  initialData?: ArticleFormData;
  onSubmit: (data: ArticleFormData) => Promise<void>;
  onSuccess?: () => void;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  initialData,
  onSubmit,
  onSuccess,
}) => {
  const faqEditorRef = useRef<FAQEditorRef>(null);

  const parseImageUrl = (url: string | undefined): [string, string] => {
    try {
      return JSON.parse(url || "[]") as [string, string];
    } catch (error) {
      return ["", ""];
    }
  };

  const getImageUrl = (url: string | undefined): string => {
    const [imageUrl] = parseImageUrl(url);
    return imageUrl;
  };

  const getImageAlt = (url: string | undefined): string => {
    const [, altText] = parseImageUrl(url);
    return altText;
  };

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl ? getImageUrl(initialData.imageUrl) : null
  );
  const [ogimagePreview, setOgImagePreview] = useState<string | null>(
    initialData?.ogImage ? getImageUrl(initialData.ogImage) : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  } | null>(null);
  const [showDraftDialog, setShowDraftDialog] = useState(false);

  const {
    drafts,
    currentDraftId,
    isLoading: isLoadingDrafts,
    error: draftError,
    saveDraft: saveDraftToDB,
    deleteDraft,
    getDraft,
    loadDrafts,
    setCurrentDraftId,
  } = useIndexedDBDrafts<ArticleFormData>({
    draftType: "article",
    defaultTitle: "Untitled Article",
    autoSaveInterval: 30000,
  });

  // Default form values
  const defaultFormValues: ArticleFormData = {
    title: "",
    content: "",
    imageUrl: "",
    tags: [],
    category: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    robots: "index,follow",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "",
    twitterCard: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    canonicalUrl: "",
    schemaData: "",
    header: "",
    body: "",
    showInNav: false,
    questionNumber: undefined,
    FAQ: JSON.stringify({ general: [] }),
  };

  const form = useForm<ArticleFormData>({
    resolver: (values) => {
      let errors = {};

      if (!values.title || values.title.length < 2) {
        errors = {
          ...errors,
          title: { message: "Title must be at least 2 characters" },
        };
      }

      if (!values.content || values.content.length < 10) {
        errors = {
          ...errors,
          content: { message: "Content must be at least 10 characters" },
        };
      }

      // NOTE: Resolver must be pure (no setState). Alerts should be handled outside.
      if (Object.keys(errors).length > 0) {
        return { values: {}, errors };
      }

      return { values, errors: {} };
    },
    defaultValues: {
      ...defaultFormValues,
      ...initialData,
    },
  });

  // Show validation messages to the user (keep resolver pure)
  useEffect(() => {
    const { errors } = form.formState;

    const messages = [
      errors.title?.message ? String(errors.title.message) : null,
      errors.content?.message ? String(errors.content.message) : null,
    ].filter(Boolean) as string[];

    if (messages.length > 0) {
      setAlert((prev) => {
        // Avoid unnecessary state updates to prevent re-render churn
        const next = { message: `Please fix the following:\n• ${messages.join("\n• ")}`, type: "error" as const };
        if (prev?.type === next.type && prev.message === next.message) return prev;
        return next;
      });
      return;
    }

    // Only clear if it's a validation error alert (don't wipe success alerts)
    setAlert((prev) => (prev?.type === "error" ? null : prev));
  }, [form.formState.errors]);

  const [currentSubcategory, setCurrentSubcategory] = useState("");
  // @ts-ignore
  const [mainCategory, setMainCategory] = useState(initialData?.category?.[0]?.name || "");
  // @ts-ignore
  const [subcategories, setSubcategories] = useState<string[]>(initialData?.category?.slice(1)?.map((category) => category.name) || []);

  useEffect(() => {
    if (drafts.length > 0 && !isLoadingDrafts && !currentDraftId) {
      setShowDraftDialog(true);
    }
  }, [drafts, isLoadingDrafts, currentDraftId]);

  // Update main category to match title
  const title = form.watch("title");
  useEffect(() => {
    if (title && title !== mainCategory) {
      setMainCategory(title);
      form.setValue("category", [title, ...subcategories]);
    }
  }, [title, mainCategory, subcategories, form]);

  const loadDraft = async () => {
    await loadDrafts();
    if (drafts.length > 0) {
      setShowDraftDialog(true);
    }
  };

  const selectDraft = useCallback(
    async (draftId: string) => {
      try {
        const selectedDraft = await getDraft(draftId);
        if (selectedDraft) {
          const formData = { ...selectedDraft.data };

          // Handle FAQ data properly
          if (!formData.FAQ || formData.FAQ === "") {
            formData.FAQ = JSON.stringify({ general: [] });
          } else {
            try {
              const faqData = JSON.parse(formData.FAQ);
              if (
                !faqData ||
                !faqData.general ||
                !Array.isArray(faqData.general)
              ) {
                formData.FAQ = JSON.stringify({ general: [] });
              }
            } catch (e) {
              console.warn("Invalid FAQ data in draft, resetting to empty");
              formData.FAQ = JSON.stringify({ general: [] });
            }
          }

          // Reset form with draft data
          form.reset(formData);
          setCurrentDraftId(selectedDraft.id!);

          // Handle categories
          if (formData.category && Array.isArray(formData.category)) {
            setMainCategory(formData.category[0]?.name || "");
            setSubcategories(
              formData.category
                .slice(1)
                ?.map((category: { name: string }) => category.name) || []
            );
          }

          // Handle image previews
          if (formData.imageUrl) {
            setImagePreview(getImageUrl(formData.imageUrl));
          }
          if (formData.ogImage) {
            setOgImagePreview(getImageUrl(formData.ogImage));
          }

          setShowDraftDialog(false);
        }
      } catch (error) {
        console.error("Error selecting draft:", error);
        setAlert({
          message: "Failed to load draft. Please try again.",
          type: "error",
        });
      }
    },
    [getDraft, form, setCurrentDraftId]
  );

  const saveDraft = useCallback(async () => {
    const draftData = form.getValues();
    const title = draftData.title || "Untitled Draft";
    console.log("Saving draft with data:", draftData);
    try {
      // Ensure FAQ data is properly serialized
      if (!draftData.FAQ || draftData.FAQ === "") {
        draftData.FAQ = JSON.stringify({ general: [] });
      } else {
        try {
          JSON.parse(draftData.FAQ);
        } catch (e) {
          console.warn("Invalid FAQ data, resetting to empty");
          draftData.FAQ = JSON.stringify({ general: [] });
        }
      }
      console.log("Saving draft with data:", draftData);
      await saveDraftToDB(title, draftData);
      // console.log("Saved draft with ID:", savedId)
      // if(savedId==null){
      //   return;
      // }
      // if (!currentDraftId) {
      //   setCurrentDraftId(savedId)
      // }
      console.log("Draft saved successfully!");
      setAlert({
        message: "Draft saved successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      setAlert({
        message: "Failed to save draft. Please try again.",
        type: "error",
      });
    }
  }, [form, saveDraftToDB, currentDraftId, setCurrentDraftId]);

  const startNew = useCallback(() => {
    // Reset everything to initial state
    form.reset(defaultFormValues);
    setCurrentDraftId(null);
    setImagePreview(null);
    setOgImagePreview(null);
    setMainCategory("");
    setSubcategories([]);
    setCurrentSubcategory("");

    // Reset FAQ editor
    if (faqEditorRef.current) {
      faqEditorRef.current.reset();
    }

    setShowDraftDialog(false);
  }, [form, setCurrentDraftId]);

  const addSubcategory = () => {
    if (currentSubcategory.trim()) {
      setSubcategories([...subcategories, currentSubcategory.trim()]);
      setCurrentSubcategory("");
    }
  };

  const removeSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const handleMainCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainCategory(e.target.value);
    form.setValue("category", [e.target.value]);
  };

  const handleSubmitForm = async (data: ArticleFormData) => {
    setIsUploading(true);
    setUploadSuccess(false);
    
    try {
      const transformedData = {
        ...data,
        category: [mainCategory, ...subcategories].filter(Boolean) as string[],
      };

      await onSubmit(transformedData);
      setUploadSuccess(true);
      
      // Call onSuccess callback after a short delay to show the success message
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlert({
        message: "Failed to submit the form. Please try again.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditorChange = (content: string) => {
    form.setValue("content", content, { shouldValidate: true });
  };

  // Handle beforeunload event
  useLayoutEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploading) {
        // Standard way to show the confirmation dialog
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = 'You have an upload in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isUploading]);

  // Handle route changes (for Next.js)
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (isUploading && !window.confirm('You have an upload in progress. Are you sure you want to leave?')) {
        throw 'Route change aborted. Please wait for the upload to complete.';
      }
    };

    // For Next.js router
    if (typeof window !== 'undefined' && (window as any).next) {
      const router = (window as any).next.router;
      if (router) {
        router.events?.on('routeChangeStart', handleRouteChange);
        return () => {
          router.events?.off('routeChangeStart', handleRouteChange);
        };
      }
    }
  }, [isUploading]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setIsImageUploading(true);
      setHasUnsavedChanges(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const result = reader.result as string;
          setImagePreview(result);

          const formData = new FormData();
          formData.append("imageUrl", file);

          const s3Url = await uploadImageToS3(
            formData,
            "ArticlesType",
            file.name
          );
          if (s3Url) {
            form.setValue("imageUrl", JSON.stringify([s3Url, ""]), {
              shouldValidate: true,
            });
          } else {
            form.setValue(
              "imageUrl",
              JSON.stringify(["/www.google.com/fallbackUrl", ""]),
              {
                shouldValidate: true,
              }
            );
            throw new Error("Failed to upload image to S3");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setIsImageUploading(false);
          setHasUnsavedChanges(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOGUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setIsImageUploading(true);
      setHasUnsavedChanges(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const result = reader.result as string;
          setOgImagePreview(result);

          const formData = new FormData();
          formData.append("imageUrl", file);

          const s3Url = await uploadImageToS3(
            formData,
            "ArticleOGImages",
            file.name
          );
          if (s3Url) {
            form.setValue("ogImage", JSON.stringify([s3Url, ""]), {
              shouldValidate: true,
            });
          } else {
            form.setValue(
              "ogImage",
              JSON.stringify(["/www.google.com/fallbackUrl", ""]),
              {
                shouldValidate: true,
              }
            );
            throw new Error("Failed to upload image to S3");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setIsImageUploading(false);
          setHasUnsavedChanges(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(async () => {
      const draftData = form.getValues();
      if (draftData.title && draftData.title.trim().length > 0) {
        try {
          await saveDraft();
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [saveDraft]);

  return (
    <div className="relative">
      <DraftDialog
        open={showDraftDialog}
        onClose={() => setShowDraftDialog(false)}
        onLoadDraft={loadDraft}
        onStartNew={startNew}
        drafts={drafts.map((draft) => ({
          id: draft.id!,
          title: draft.title,
          data: draft.data,
          updatedAt: draft.updatedAt,
        }))}
        onSelectDraft={selectDraft}
      />
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      {/* Uploading Modal */}
      <Dialog open={isUploading && !isImageUploading}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-lg font-medium">Uploading your article...</p>
            <p className="text-sm text-muted-foreground">Please wait while we save your changes.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="space-y-6"
        >
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title(Slug) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} className="border-[var(--admin-border)]" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <div className="space-y-4">
                <div>
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field: altField }) => (
                      <FormItem>
                        <FormLabel>Image Alt Text</FormLabel>
                        <FormControl>
                          <Input
                            value={getImageAlt(altField.value)}
                            onChange={(e) => {
                              const [imageUrl, altText] = parseImageUrl(
                                altField.value
                              );
                              altField.onChange(
                                JSON.stringify([imageUrl, e.target.value])
                              );
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe the image for accessibility. This will be
                          used as the alt text.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border-[var(--admin-border)]"
                />

                {imagePreview ? (
                  <div className="space-y-2">
                    <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-[var(--admin-border)]">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Image preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-green-500">
                      Image uploaded successfully
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No image uploaded</p>
                )}
              </div>
            )}
          />

          {/* Main Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Main Content <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <TiptapEditor
                    content={field.value}
                    onChange={handleEditorChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Tags */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagInput
                    value={value || []}
                    onChange={onChange}
                    placeholder="Add tags..."
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Categories */}
          <div className="space-y-4">
            <div>
              <Label>Main Category</Label>
              <div className="mb-4">
                <Input
                  value={mainCategory}
                  onChange={handleMainCategoryChange}
                  placeholder="Enter main category"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label>Subcategories</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentSubcategory}
                  onChange={(e) => setCurrentSubcategory(e.target.value)}
                  placeholder="Add subcategory"
                />
                <Button type="button" onClick={addSubcategory}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {subcategories.map((sub, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {sub}
                    <button
                      type="button"
                      onClick={() => removeSubcategory(index)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metadata fields */}
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Keywords</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="robots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Robots</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? "index,follow"}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select robots directive" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="index,follow">
                          Index & Follow (Default)
                        </SelectItem>
                        <SelectItem value="noindex,follow">
                          No Index, Follow
                        </SelectItem>
                        <SelectItem value="index,nofollow">
                          Index, No Follow
                        </SelectItem>
                        <SelectItem value="noindex,nofollow">
                          No Index & No Follow
                        </SelectItem>
                        <SelectItem value="noarchive">No Archive</SelectItem>
                        <SelectItem value="nosnippet">No Snippet</SelectItem>
                        <SelectItem value="data-nosnippet">
                          Data No Snippet
                        </SelectItem>
                        <SelectItem value="max-snippet:0">
                          Max Snippet: None
                        </SelectItem>
                        <SelectItem value="max-snippet:-1">
                          Max Snippet: Unlimited
                        </SelectItem>
                        <SelectItem value="max-snippet:50">
                          Max Snippet: 50 Characters
                        </SelectItem>
                        <SelectItem value="noimageindex">
                          No Image Index
                        </SelectItem>
                        <SelectItem value="nocache">No Cache</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ogTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ogDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ogImage"
              render={({ field }) => (
                <div className="space-y-4">
                  <FormLabel>OG Image</FormLabel>
                  <Input {...field} />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleOGUpload}
                    className="border-[var(--admin-border)]"
                  />

                  {ogimagePreview ? (
                    <div className="space-y-2">
                      <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-[var(--admin-border)]">
                        <Image
                          src={ogimagePreview || "/placeholder.svg"}
                          alt="Image preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm text-green-500">
                        Image uploaded successfully
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No image uploaded</p>
                  )}
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="ogType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitterCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter Card</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitterTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitterDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitterImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter Image</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="canonicalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canonical URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schemaData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schema Data</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="header"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Header</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Practice Questions Number(Not Required)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="showInNav">Show in Navigation</Label>
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="showInNav"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value ? "show" : "hide"}
                            onValueChange={(value) =>
                              field.onChange(value === "show")
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Show in Navbar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="show">
                                Show in Navbar
                              </SelectItem>
                              <SelectItem value="hide">
                                Do not Show in Navbar
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* FAQ Editor Section */}
            <div className="space-y-4">
              <div>
                <Label>FAQs</Label>
                <FormField
                  control={form.control}
                  name="FAQ"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FAQEditor
                          ref={faqEditorRef}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Add frequently asked questions in a structured format.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={saveDraft}
            className="bg-gray-300 hover:bg-gray-400 mr-5"
          >
            Save as draft
          </Button>

          <Button
            disabled={isUploading}
            type="submit"
            className="mt-6 bg-slate-700 hover:bg-slate-800 text-white"
          >
            {isUploading ? "Uploading..." : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
