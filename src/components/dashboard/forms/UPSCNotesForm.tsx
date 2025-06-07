import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Editor from "@/components/ui/tiptapeditor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  showInNav: z.boolean().default(true),
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
  const [drafts, setDrafts] = useState<
    {
      title: string;
      data: FormData & {
        imageUrl: string | undefined;
        showInNav: boolean | undefined;
      };
    }[]
  >([]);
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
  useEffect(() => {
    const savedDrafts = localStorage.getItem("upscNotesDrafts");
    if (savedDrafts) {
      const parsedDrafts = JSON.parse(savedDrafts);
      setDrafts(parsedDrafts);
      if (parsedDrafts.length > 0) {
        setShowDraftDialog(true);
      }
    }
  }, []);

  const loadDraft = () => {
    const savedDrafts = localStorage.getItem("upscNotesDrafts");
    if (savedDrafts) {
      const parsedDrafts = JSON.parse(savedDrafts);
      if (parsedDrafts.length > 0) {
        setShowDraftDialog(true);
      }
    }
  };

  const selectDraft = (title: string) => {
    const savedDrafts = localStorage.getItem("upscNotesDrafts");
    if (savedDrafts) {
      const parsedDrafts = JSON.parse(savedDrafts);
      const selectedDraft = parsedDrafts.find(
        (draft: {
          title: string;
          data: FormData & {
            imageUrl: string | undefined;
            showInNav: boolean | undefined;
          };
        }) => draft.title === title
      );
      if (selectedDraft) {
        form.reset(selectedDraft.data);
        setShowDraftDialog(false);
      }
    }
  };

  const saveDraft = () => {
    const draftData = form.getValues();
    const draftTitle = draftData.title || `Draft ${Date.now()}`;

    try {
      const savedDrafts = localStorage.getItem("upscNotesDrafts");
      const existingDrafts = savedDrafts ? JSON.parse(savedDrafts) : [];

      // Remove any existing draft with the same title
      const filteredDrafts = existingDrafts.filter(
        (draft: {
          title: string;
          data: FormData & {
            imageUrl: string | undefined;
            showInNav: boolean | undefined;
          };
        }) => draft.title !== draftTitle
      );

      // Add the new draft
      const newDraft = {
        title: draftTitle,
        data: draftData,
      };

      const updatedDrafts = [...filteredDrafts, newDraft];
      localStorage.setItem("upscNotesDrafts", JSON.stringify(updatedDrafts));

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
    form.reset(initialData || {});
    setShowDraftDialog(false);
  };

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
    defaultValues: initialData || {
      title: "",
      content: "",
      showInNav: true,
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
      questionNumber: undefined,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
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
  
            const s3Url = await uploadImageToS3(formData, "BlogOGImages", file.name);
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
                  <Editor content={field.value} onChange={field.onChange} />
                </FormControl>
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
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue="noindex,nofollow"
                  >
                    <SelectTrigger className="text-white">
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
              </FormItem>
            )}
          />

          {/* OG Title */}
          <FormField
            control={form.control}
            name="ogTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OG Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Open Graph title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* OG Description */}
          <FormField
            control={form.control}
            name="ogDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OG Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Open Graph description"
                    {...field}
                  />
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

          {/* OG Type */}
          <FormField
            control={form.control}
            name="ogType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OG Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Open Graph type" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Twitter Card */}
          <FormField
            control={form.control}
            name="twitterCard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter Card</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Twitter card type" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Twitter Title */}
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

          {/* Twitter Description */}
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

          {/* Twitter Image */}
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

          {/* Canonical URL */}
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

          {/* Schema Data */}
          <FormField
            control={form.control}
            name="schemaData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schema Data (JSON-LD)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter schema data as JSON" {...field} />
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
                    <SelectItem value="hide">Do not Show in Navbar</SelectItem>
                  </SelectContent>
                </Select>
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
