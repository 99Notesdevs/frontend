"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import TiptapEditor from "@/components/ui/tiptapeditor";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/ui/tags/tag-input";

const articleSchema = z.object({
  title: z.string(),
  content: z.string(),
  imageUrl: z.string(), // Will store stringified array
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
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
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  initialData?: ArticleFormData;
  onSubmit: (data: ArticleFormData) => void;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const parseImageUrl = (url: string | undefined): [string, string] => {
    try {
      return JSON.parse(url || '[]') as [string, string];
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
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  } | null>(null);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [drafts, setDrafts] = useState<
    { title: string; data: ArticleFormData }[]
  >([]);

  useEffect(() => {
    const savedDrafts = localStorage.getItem("articleDrafts");
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
      if (JSON.parse(savedDrafts).length > 0) {
        setShowDraftDialog(true);
      }
    }
  }, []);

  const loadDraft = () => {
    const savedDrafts = localStorage.getItem("articleDrafts");
    if (savedDrafts) {
      const parsedDrafts = JSON.parse(savedDrafts);
      if (parsedDrafts.length > 0) {
        setShowDraftDialog(true);
      }
    }
  };

  const selectDraft = (title: string) => {
    const savedDrafts = localStorage.getItem("articleDrafts");
    if (savedDrafts) {
      const parsedDrafts = JSON.parse(savedDrafts);
      const selectedDraft = parsedDrafts.find(
        (draft: { title: string; data: ArticleFormData }) =>
          draft.title === title
      );
      if (selectedDraft) {
        form.reset(selectedDraft.data);
        setImagePreview(getImageUrl(selectedDraft.data.imageUrl));
        setShowDraftDialog(false);
      }
    }
  };

  const saveDraft = () => {
    const draftData = form.getValues();
    const title = draftData.title || "Untitled Draft";
    try {
      const savedDrafts = localStorage.getItem("articleDrafts");
      const existingDrafts = savedDrafts ? JSON.parse(savedDrafts) : [];

      // Check if draft with same title exists, update it if it does
      const existingIndex = existingDrafts.findIndex(
        (draft: { title: string; data: ArticleFormData }) =>
          draft.title === title
      );
      if (existingIndex !== -1) {
        existingDrafts[existingIndex] = { title, data: draftData };
      } else {
        existingDrafts.push({ title, data: draftData });
      }

      localStorage.setItem("articleDrafts", JSON.stringify(existingDrafts));
      setDrafts(existingDrafts);
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
  };

  const startNew = () => {
    form.reset(initialData || {});
    setShowDraftDialog(false);
  };

  const form = useForm<ArticleFormData>({
    resolver: (values) => {
      let errors = {};
      const messages = [];

      if (!values.title || values.title.length < 2) {
        messages.push("Title must be at least 2 characters");
        errors = {
          ...errors,
          title: { message: "" },
        };
      }

      if (!values.content || values.content.length < 10) {
        messages.push("Content must be at least 10 characters");
        errors = {
          ...errors,
          content: { message: "" },
        };
      }

      if (!values.imageUrl || !getImageUrl(values.imageUrl)) {
        messages.push("Image is required");
        errors = {
          ...errors,
          imageUrl: "Image URL is required",
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
    defaultValues: initialData || {
      title: "",
      content: "",
      imageUrl: JSON.stringify(["", ""]), // Default empty values as stringified array
      tags: [],
      category: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      robots: "",
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
      questionNumber: undefined,
    },
  });

  const handleEditorChange = (content: string) => {
    form.setValue("content", content, { shouldValidate: true });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const result = reader.result as string;
          setImagePreview(result);

          const formData = new FormData();
          formData.append("imageUrl", file);

          const s3Url = await uploadImageToS3(formData, "ArticlesType");
          if (s3Url) {
            form.setValue("imageUrl", JSON.stringify([s3Url, ""]), { shouldValidate: true });
          } else {
            form.setValue("imageUrl", JSON.stringify(["/www.google.com/fallbackUrl", ""]), {
              shouldValidate: true,
            });
            throw new Error("Failed to upload image to S3");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setIsUploading(false);
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
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const result = reader.result as string;
          setOgImagePreview(result);

          const formData = new FormData();
          formData.append("imageUrl", file);

          const s3Url = await uploadImageToS3(formData, "ArticleOGImages");
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
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = (data: ArticleFormData) => {
    const transformedData = {
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl, // Send as stringified array
      tags: data.tags || [],
      category: data.category || "",
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
      showInNav: data.showInNav,
      questionNumber: data.questionNumber,
    };
    onSubmit(transformedData);
  };

  return (
    <div className="relative">
      <DraftDialog
        open={showDraftDialog}
        onClose={() => setShowDraftDialog(false)}
        onLoadDraft={loadDraft}
        onStartNew={startNew}
        drafts={drafts}
        onSelectDraft={selectDraft}
      />
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
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
                  Title <span className="text-red-500">*</span>
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
                        src={imagePreview}
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

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter category"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Metadata */}
          <div className="grid  gap-6">
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
                      value={field.value || "index,follow"}
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue="index,follow"
                    >
                      <SelectTrigger className="text-white">
                        <SelectValue placeholder="noindex, nofollow" />
                      </SelectTrigger>
                      <SelectContent className="text-white max-h-60 overflow-y-auto">
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
                          src={ogimagePreview}
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
                  <Select
                    value={form.watch("showInNav") ? "show" : "hide"}
                    onValueChange={(value) => {
                      form.setValue("showInNav", value === "show");
                    }}
                  >
                    <SelectTrigger className="text-white">
                      <SelectValue placeholder="Show in Navbar" />
                    </SelectTrigger>
                    <SelectContent className="text-white">
                      <SelectItem value="show">Show in Navbar</SelectItem>
                      <SelectItem value="hide">
                        Do not Show in Navbar
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
