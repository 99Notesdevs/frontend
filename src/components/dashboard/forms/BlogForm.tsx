"use client";

import type React from "react";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tags/tag-input";
import { useEffect, useState, useCallback, useLayoutEffect } from "react";
import Image from "next/image";
import { uploadImageToS3 } from "@/config/imageUploadS3";
import { Alert } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DraftDialog from "@/components/ui/DraftDialog";
import { useIndexedDBDrafts } from "@/hooks/useIndexedDBDrafts";
import { isAuth, type AuthResponse } from "@/lib/isAuth";

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

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  imageUrl: z.string(),
  tags: z.array(z.string()).optional(),
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
  slug: z.string(),
  order: z.number().optional(),
  showInNav: z.boolean().default(false),
});

export type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  onSubmit: (data: BlogFormValues) => Promise<void>;
  defaultValues?: Partial<BlogFormValues>;
}

export function BlogForm({ onSubmit, defaultValues }: BlogFormProps) {
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
    defaultValues?.imageUrl ? getImageUrl(defaultValues.imageUrl) : null
  );
  const [ogimagePreview, setOgImagePreview] = useState<string | null>(
    defaultValues?.ogImage ? getImageUrl(defaultValues.ogImage) : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  } | null>(null);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "editor" | "author" | "user" | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
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
  } = useIndexedDBDrafts<BlogFormValues>({
    draftType: "blog",
    defaultTitle: "Untitled Blog",
    autoSaveInterval: 30000,
  });

  const defaultFormValues: BlogFormValues = {
    title: "",
    content: "",
    imageUrl: JSON.stringify(["", ""]),
    tags: [],
    slug: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    robots: "noindex,nofollow",
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
    showInNav: true,
  };

  const form = useForm<BlogFormValues>({
    resolver: (values) => {
      let errors = {};
      const messages = [];

      if (!values.title || values.title.length < 2) {
        messages.push("Title must be at least 2 characters");
        errors = {
          ...errors,
          title: { message: "Title must be at least 2 characters" },
        };
      }

      if (!values.content || values.content.length < 10) {
        messages.push("Content must be at least 10 characters");
        errors = {
          ...errors,
          content: { message: "Content must be at least 10 characters" },
        };
      }

      if (!values.imageUrl) {
        messages.push("Image is required");
        errors = {
          ...errors,
          imageUrl: { message: "Image is required" },
        };
      }

      if (!values.slug) {
        messages.push("Slug is required");
        errors = {
          ...errors,
          slug: { message: "Slug is required" },
        };
      }

      if (messages.length > 0) {
        setAlert({
          message: `Please fix the following:\n• ${messages.join("\n• ")}`,
          type: "error",
        });
        return { values: {}, errors };
      }

      setAlert(null);
      return { values, errors: {} };
    },
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (drafts.length > 0 && !isLoadingDrafts && !currentDraftId) {
      setShowDraftDialog(true);
    }
  }, [drafts, isLoadingDrafts, currentDraftId]);

  const saveDraft = useCallback(async () => {
    const draftData = form.getValues();
    const title = draftData.title || "Untitled Draft";

    try {
      await saveDraftToDB(title, draftData);
      // if(savedId==null){
      //   return;
      // }
      // if (!currentDraftId) {
      //   setCurrentDraftId(savedId)
      // }

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
          form.reset(selectedDraft.data);
          setCurrentDraftId(selectedDraft.id!);
          setImagePreview(getImageUrl(selectedDraft.data.imageUrl));
          if (selectedDraft.data.ogImage) {
            setOgImagePreview(getImageUrl(selectedDraft.data.ogImage));
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

  const startNew = useCallback(() => {
    form.reset(defaultFormValues);
    setCurrentDraftId(null);
    setImagePreview(null);
    setOgImagePreview(null);
    setShowDraftDialog(false);
  }, [form, setCurrentDraftId]);

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
      setIsUploading(true);
      setHasUnsavedChanges(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const result = reader.result as string;
          setImagePreview(result);

          const formData = new FormData();
          formData.append("imageUrl", file);

          const s3Url = await uploadImageToS3(formData, "Blogs", file.name);
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
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setIsUploading(false);
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
      setIsUploading(true);
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
            "BlogOGImages",
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
          setIsUploading(false);
          setHasUnsavedChanges(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: BlogFormValues) => {
    try {
      await onSubmit(data);
      setAlert({
        message: "Blog post saved successfully!",
        type: "success",
      });
      setTimeout(() => {
        setAlert(null);
      }, 9000);
    } catch (error) {
      setAlert({
        message: "Failed to save blog post. Please try again.",
        type: "error",
      });
    }
  };
  // Check user authentication and role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse: AuthResponse = await isAuth();
        setUserRole(authResponse.role);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUserRole(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

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
          className={`font-bold px-4 py-3 rounded mb-4 ${
            alert.type === "error"
              ? "bg-red-100 text-red-800 border border-red-400"
              : alert.type === "success"
              ? "bg-green-100 text-green-800 border border-green-400"
              : "bg-yellow-100 text-yellow-800 border border-yellow-400"
          }`}
        />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter blog title" 
                    {...field} 
                    disabled={userRole !== "admin" && !isLoadingAuth}
                  />
                </FormControl>
                {userRole !== "admin" && !isLoadingAuth && (
                  <FormDescription className="text-amber-600">
                    Only administrators can edit the title field.
                  </FormDescription>
                )}
                {fieldState.error?.message && (
                  <div className="text-red-600 font-semibold text-sm mt-1">
                    {fieldState.error.message}
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Content <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <TiptapEditor
                    content={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                {fieldState.error?.message && (
                  <div className="text-red-600 font-semibold text-sm mt-1">
                    {fieldState.error.message}
                  </div>
                )}
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="tags"
            render={({ field: { onChange, value, ...field }, formState }) => (
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
                {formState.errors.tags && (
                  <p className="mt-1 text-sm text-red-600">
                    {formState.errors.tags.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Slug <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter slug" {...field} />
                </FormControl>
                {fieldState.error?.message && (
                  <div className="text-red-600 font-semibold text-sm mt-1">
                    {fieldState.error.message}
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter meta title" {...field} />
                </FormControl>
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
                  <Input placeholder="Enter meta description" {...field} />
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
                  <Input placeholder="Enter meta keywords" {...field} />
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
                    value={field.value || "noindex,nofollow"}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No index, No follow" />
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
                  <Input placeholder="Enter OG title" {...field} />
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
                  <Input placeholder="Enter OG description" {...field} />
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
                  <Input placeholder="Enter OG Type" {...field} />
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
                  <Input placeholder="Enter Twitter Card" {...field} />
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
                  <Input placeholder="Enter Twitter title" {...field} />
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
                  <Input placeholder="Enter Twitter description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitterImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Twitter image URL" {...field} />
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
                  <Input placeholder="Enter canonical URL" {...field} />
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
                  <Input placeholder="Enter schema data" {...field} />
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
                  <Input placeholder="Enter header" {...field} />
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
                  <Input placeholder="Enter body" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="button"
            onClick={saveDraft}
            className="bg-gray-300 hover:bg-gray-400 mr-5"
          >
            Save as Draft
          </Button>

          <Button
            type="submit"
            className="bg-slate-700 hover:bg-slate-800 text-white"
            disabled={isUploading || form.formState.isSubmitting}
          >
            {isUploading || form.formState.isSubmitting
              ? "Processing..."
              : "Save Blog"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
