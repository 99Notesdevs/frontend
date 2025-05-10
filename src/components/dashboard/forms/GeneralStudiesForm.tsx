"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TiptapEditor from "@/components/ui/tiptapeditor";
import { useEffect, useState } from "react";
import Image from "next/image";
import { uploadImageToS3 } from "@/config/imageUploadS3";
import { Label } from "@radix-ui/react-label";
import { Alert } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DraftDialog from "@/components/ui/DraftDialog";

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  imageUrl: z.string(),
  showInNav: z.boolean().default(false),
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
  author: z.string().optional(),
});

export type GeneralStudiesFormValues = z.infer<typeof formSchema>;

interface GeneralStudiesFormProps {
  onSubmit: (data: GeneralStudiesFormValues) => void;
  defaultValues?: Partial<GeneralStudiesFormValues>;
  folder: string;
}

export function GeneralStudiesForm({
  onSubmit,
  defaultValues,
  folder,
}: GeneralStudiesFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.imageUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  } | null>(null);
  const [showDraftDialog, setShowDraftDialog] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem("generalStudiesDraft");
    if (savedDraft) {
      setShowDraftDialog(true); // Show the dialog if a draft exists
    }
  }, []);

  const loadDraft = () => {
    const savedDraft = localStorage.getItem("generalStudiesDraft");
    if (savedDraft) {
      form.reset(JSON.parse(savedDraft)); // Populate the form with the saved draft
    }
    setShowDraftDialog(false); // Close the dialog
  };

  const startNew = () => {
    form.reset(defaultValues || {}); // Reset the form to initial data or empty
    setShowDraftDialog(false); // Close the dialog
  };

  const saveDraft = () => {
    const draftData = form.getValues(); // Get the current form values
    try {
      // Save the draft to local storage or send it to an API
      localStorage.setItem("generalStudiesDraft", JSON.stringify(draftData));
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

  const form = useForm<GeneralStudiesFormValues>({
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

      if (!values.imageUrl) {
        messages.push("Image is required");
        errors = {
          ...errors,
          imageUrl: { message: "" },
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
      title: "",
      content: "",
      imageUrl: "",
      showInNav: true,
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
      author: "",
      header: "",
      body: "",
      ...defaultValues,
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

          const s3Url = await uploadImageToS3(formData, folder); // Call your S3 upload function
          if (s3Url) {
            // Update the image field with the S3 URL
            form.setValue("imageUrl", s3Url, { shouldValidate: true });
          } else {
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
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter title"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
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
                    Author
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter author"
                      {...field}
                      className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>
                  Image <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                      {...field}
                    />

                    {imagePreview ? (
                      <div className="space-y-2">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-blue-100">
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
                </FormControl>
              </FormItem>
            )}
          />

          {/* Main Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  Content <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="border border-blue-100 rounded-lg overflow-hidden">
                    <TiptapEditor
                      content={form.getValues("content")}
                      onChange={(html) => form.setValue("content", html)}
                    />
                  </div>
                </FormControl>
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
                    <SelectTrigger className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg text-white">
                      <SelectValue placeholder="No index, No follow" />
                    </SelectTrigger>
                    <SelectContent className="text-white">
                      <SelectItem value="noindex,nofollow">
                        No index, No follow
                      </SelectItem>
                      <SelectItem value="index,nofollow">
                        Index, No follow
                      </SelectItem>
                      <SelectItem value="noindex,follow">
                        No index, Follow
                      </SelectItem>
                      <SelectItem value="index,follow">
                        Index, Follow
                      </SelectItem>
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ogImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  OG Image URL
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter OG image URL"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
              </FormItem>
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
                  <SelectTrigger className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg text-white">
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
            className="bg-gray-300 hover:bg-gray-400"
          >
            Save as draft
          </Button>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              disabled={isUploading}
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-colors duration-200"
            >
              {isUploading ? "Uploading..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
