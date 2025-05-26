"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import TiptapEditor from "@/components/ui/tiptapeditor";
import { useEffect, useState } from "react";
import Image from "next/image";
import { uploadImageToS3 } from "@/config/imageUploadS3";
import { Alert } from "@/components/ui/alert";
import { QuizQuestions } from "@/components/dashboard/static/current-affair/QuizQuestions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DraftDialog from "@/components/ui/DraftDialog";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  imageUrl: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  quizQuestions: z.string().optional(),
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
  author: z.string().optional(),
});

export type CurrentArticleFormValues = z.infer<typeof formSchema>;

interface CurrentArticleFormProps {
  onSubmit: (data: CurrentArticleFormValues) => void;
  defaultValues?: Partial<CurrentArticleFormValues>;
}

export function CurrentArticleForm({
  onSubmit,
  defaultValues,
}: CurrentArticleFormProps) {
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
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [drafts, setDrafts] = useState<
    {
      title: string;
      data: CurrentArticleFormValues & {
        imageUrl: string | undefined;
        showInNav: boolean | undefined;
        quizQuestions: string;
      };
    }[]
  >([]);

  useEffect(() => {
    const savedDrafts = localStorage.getItem("currentArticleDrafts");
    if (savedDrafts) {
      const parsedDrafts = JSON.parse(savedDrafts);
      setDrafts(parsedDrafts);
      if (parsedDrafts.length > 0) {
        setShowDraftDialog(true);
      }
    }
  }, []);

  const loadDraft = () => {
    const savedDrafts = localStorage.getItem("currentArticleDrafts");
    if (savedDrafts) {
      const parsedDrafts = JSON.parse(savedDrafts);
      if (parsedDrafts.length > 0) {
        setShowDraftDialog(true);
      }
    }
  };

  const selectDraft = (title: string) => {
    const savedDrafts = localStorage.getItem("currentArticleDrafts");
    if (savedDrafts) {
      const parsedDrafts = JSON.parse(savedDrafts);
      const selectedDraft = parsedDrafts.find(
        (draft: { title: string; data: CurrentArticleFormValues }) =>
          draft.title === title
      );
      if (selectedDraft) {
        // The quiz questions are already in JSON string format
        const draftData = {
          ...selectedDraft.data,
        };

        form.reset(draftData);
        setImagePreview(getImageUrl(selectedDraft.data.imageUrl));

        console.log("selectedDraft.data", selectedDraft.data);
        setShowDraftDialog(false);
      }
    }
  };

  const saveDraft = async () => {
    try {
      const draftTitle = form.getValues("title") || "Untitled Draft";
      const draftData = form.getValues();

      const savedDrafts = localStorage.getItem("currentArticleDrafts");
      const existingDrafts = savedDrafts ? JSON.parse(savedDrafts) : [];

      // Remove any existing draft with the same title
      const filteredDrafts = existingDrafts.filter(
        (draft: { title: string; data: CurrentArticleFormValues }) =>
          draft.title !== draftTitle
      );

      // Add the new draft with all form data
      const newDraft = {
        title: draftTitle,
        data: {
          ...draftData,
          imageUrl: draftData.imageUrl || imagePreview,
          showInNav: false,
          quizQuestions:
            draftData.quizQuestions ||
            JSON.stringify([
              {
                id: 1,
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
                explanation: "",
              },
            ]),
        } as CurrentArticleFormValues & {
          imageUrl: string | undefined;
          showInNav: boolean | undefined;
          quizQuestions: string;
        },
      };

      console.log("newDraft", newDraft);
      const updatedDrafts = [...filteredDrafts, newDraft];
      localStorage.setItem(
        "currentArticleDrafts",
        JSON.stringify(updatedDrafts)
      );

      setDrafts(updatedDrafts);
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
    form.reset(defaultValues || {});
    setShowDraftDialog(false);
  };

  const form = useForm<CurrentArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: JSON.stringify(["", ""]), // Default empty values as stringified array
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      quizQuestions: "",
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
      author: "",
      ...defaultValues,
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Show a preview of the image
          const result = reader.result as string;
          setImagePreview(result);
          console.log(file);

          // Upload the image to S3
          const formData = new FormData();
          formData.append("imageUrl", file);

          const s3Url = await uploadImageToS3(formData, "CurrentArticle"); // Call your S3 upload function
          if (s3Url) {
            form.setValue("imageUrl", JSON.stringify([s3Url, ""]), {
              shouldValidate: true,
            });
          } else {
            form.setValue(
              "imageUrl",
              JSON.stringify(["www.google.com/fallbackUrl", ""]),
              {
                shouldValidate: true,
              }
            );
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
  
            const s3Url = await uploadImageToS3(formData, "BlogOGImages");
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  Title *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter title"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author */}
          {defaultValues?.author && (
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500 font-medium">
                    Author *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter author"
                      {...field}
                      className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={isUploading}
                />
                {imagePreview && (
                  <div className="space-y-2">
                    <div className="relative h-48 w-full">
                      <Image
                        src={imagePreview}
                        alt="Current Article image preview"
                        fill
                        className="object-cover rounded-lg"
                        priority
                      />
                    </div>
                    <p className="text-sm text-green-500">
                      Image uploaded successfully
                    </p>
                  </div>
                )}
                {isUploading && (
                  <div className="text-sm text-blue-500 mt-2">
                    Uploading image...
                  </div>
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
                <FormLabel className="text-gray-500 font-medium">
                  Content *
                </FormLabel>
                <FormControl>
                  <div className="border border-blue-100 rounded-lg overflow-hidden">
                    <TiptapEditor
                      content={form.getValues("content")}
                      onChange={(html) => form.setValue("content", html)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quiz Questions */}
          <FormField
            control={form.control}
            name="quizQuestions"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  Quiz Questions
                </FormLabel>
                <FormControl>
                  <QuizQuestions
                    defaultValue={value || "[]"}
                    onChange={(questions) => {
                      onChange(questions);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Metadata Fields */}
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  Meta Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter meta title"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
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
                <FormLabel className="text-gray-500 font-medium">
                  Meta Description
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter meta description"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaKeywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  Meta Keywords
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter meta keywords"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="robots"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  Robots
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value || "noindex,nofollow"}
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue="noindex,nofollow"
                  >
                    <SelectTrigger className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg text-gray-500">
                      <SelectValue placeholder="No index, No follow" />
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ogTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  OG Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter OG title"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ogDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  OG Description
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter OG description"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
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
            name="twitterTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  Twitter Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Twitter title"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitterDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  Twitter Description
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Twitter description"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitterImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  Twitter Image URL
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Twitter image URL"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="canonicalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  Canonical URL
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter canonical URL"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schemaData"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  Schema Data
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter schema data"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage />
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

          <Button
            type="button"
            onClick={saveDraft}
            className="bg-gray-300 hover:bg-gray-400 mr-5"
          >
            Save as draft
          </Button>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              disabled={isUploading}
              type="submit"
              className="bg-slate-700 text-white px-8 py-2 rounded-lg hover:bg-slate-800 transition-colors duration-200"
            >
              {isUploading ? "Uploading..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
