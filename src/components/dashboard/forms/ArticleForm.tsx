"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import TiptapEditor from "@/components/ui/tiptapeditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/Checkbox";
import Image from "next/image";
import { uploadImageToS3 } from "@/config/imageUploadS3";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/ui/tags/tag-input";

const articleSchema = z.object({
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
  showInNav: z.boolean().default(false),
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
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  } | null>(null);

  const form = useForm<ArticleFormData>({
    resolver: (values) => {
      let errors = {};
      const messages = [];

      if (!values.title || values.title.length < 2) {
        messages.push("Title must be at least 2 characters");
        errors = {
          ...errors,
          title: { message: "" }
        };
      }

      if (!values.content || values.content.length < 10) {
        messages.push("Content must be at least 10 characters");
        errors = {
          ...errors,
          content: { message: "" }
        };
      }

      if (!values.imageUrl) {
        messages.push("Image is required");
        errors = {
          ...errors,
          imageUrl: { message: "" }
        };
      }

      if (messages.length > 0) {
        setAlert({
          message: `Please fix the following:\n• ${messages.join('\n• ')}`,
          type: "error"
        });
        return { values: {}, errors };
      }

      setAlert(null);
      return { values, errors: {} };
    },
    defaultValues: initialData || {
      title: "",
      content: "",
      tags: [],
      imageUrl: "",
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
    },
  });

  const handleEditorChange = (content: string) => {
    form.setValue("content", content, { shouldValidate: true });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            form.setValue("imageUrl", s3Url, { shouldValidate: true });
          } else {
            form.setValue("imageUrl", "www.google.com/fallbackUrl");
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
      imageUrl: data.imageUrl || '',
      tags: data.tags || [],
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
    };
    onSubmit(transformedData);
  };

  return (
    <div className="relative">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
        {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
              <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
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
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Image <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border-[var(--admin-border)]"
                    {...field}
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
                      <p className="text-sm text-green-500">Image uploaded successfully</p>
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
              <FormLabel>Main Content <span className="text-red-500">*</span></FormLabel>
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
                    value={field.value || "noindex,nofollow"}
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue="noindex,nofollow"
                  >
                    <SelectTrigger className="text-white">
                      <SelectValue placeholder="No index, No follow" />
                    </SelectTrigger>
                    <SelectContent className="text-white">
                      <SelectItem value="noindex,nofollow">No index, No follow</SelectItem>
                      <SelectItem value="index,nofollow">Index, No follow</SelectItem>
                      <SelectItem value="noindex,follow">No index, Follow</SelectItem>
                      <SelectItem value="index,follow">Index, Follow</SelectItem>
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
              <FormItem>
                <FormLabel>OG Image</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
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
          </div>

        <Button disabled={isUploading} type="submit" className="w-full mt-6 bg-slate-300 hover:bg-slate-400">
            {isUploading ? 'Uploading...' : 'Save'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
