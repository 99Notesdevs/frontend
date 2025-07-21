"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { Alert } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DraftDialog from "@/components/ui/DraftDialog";
import { uploadImageToS3 } from "@/config/imageUploadS3";
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

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  showInNav: z.boolean().default(true),
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
  questionNumber: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface UpscNotesFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
}

export const UpscNotesForm: React.FC<UpscNotesFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  } | null>(null);
  const [showDraftDialog, setShowDraftDialog] = useState(false);

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

  const [ogimagePreview, setOgImagePreview] = useState<string | null>(
    initialData?.ogImage ? getImageUrl(initialData.ogImage) : null
  );

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
  } = useIndexedDBDrafts<FormData>({
    draftType: "upscNotes",
    defaultTitle: "Untitled UPSC Notes",
    autoSaveInterval: 30000,
  });

  const defaultFormValues: FormData = {
    title: "",
    content: "",
    showInNav: true,
    category: [],
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
    questionNumber: undefined,
  };

  useEffect(() => {
    if (drafts.length > 0 && !isLoadingDrafts && !currentDraftId) {
      setShowDraftDialog(true);
    }
  }, [drafts, isLoadingDrafts, currentDraftId]);

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

          // Handle categories
          if (
            selectedDraft.data.category &&
            Array.isArray(selectedDraft.data.category)
          ) {
            setMainCategory(selectedDraft.data.category[0] || "");
            setSubcategories(selectedDraft.data.category.slice(1) || []);
          }

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
    [getDraft, setCurrentDraftId]
  );

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
  }, [saveDraftToDB, currentDraftId, setCurrentDraftId]);

  const startNew = useCallback(() => {
    form.reset(defaultFormValues);
    setCurrentDraftId(null);
    setOgImagePreview(null);
    setMainCategory("");
    setSubcategories([]);
    setCurrentSubcategory("");
    setShowDraftDialog(false);
  }, [setCurrentDraftId]);

  const form = useForm<FormData>({
    resolver: (values) => {
      let errors = {};
      const messages = [];

      if (!values.title || values.title.trim() === "") {
        messages.push("Title is required");
        errors = {
          ...errors,
          title: { message: "" },
        };
      }

      if (!values.content || values.content.trim() === "") {
        messages.push("Content is required");
        errors = {
          ...errors,
          content: { message: "" },
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
      ...initialData,
    },
  });

  const [currentSubcategory, setCurrentSubcategory] = useState("");
  const [mainCategory, setMainCategory] = useState(
    initialData?.category?.[0] || ""
  );
  const [subcategories, setSubcategories] = useState<string[]>(
    initialData?.category?.slice(1) || []
  );

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

  const handleFormSubmit = async (data: FormData) => {
    try {
      const transformedData = {
        ...data,
        category: [mainCategory, ...subcategories].filter(Boolean) as string[],
      };

      await onSubmit(transformedData);
      setAlert({
        message: "Notes saved successfully!",
        type: "success",
      });
    } catch (error) {
      setAlert({
        message: "Failed to save notes. Please try again.",
        type: "error",
      });
    }
  };

  const handleOGUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
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
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
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
          </div>

          {/* Meta Title */}
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

          {/* Meta Description */}
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

          {/* Meta Keywords */}
          <FormField
            control={form.control}
            name="metaKeywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Keywords</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter meta keywords (comma-separated)"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Robots */}
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

          {/* OG Image */}
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
                            <SelectItem value="show">Show in Navbar</SelectItem>
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

          <Button
            type="button"
            onClick={saveDraft}
            className="bg-gray-300 hover:bg-gray-400 mr-5"
          >
            Save as draft
          </Button>

          <Button
            type="submit"
            className="bg-slate-700 hover:bg-slate-900 text-white"
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpscNotesForm;
