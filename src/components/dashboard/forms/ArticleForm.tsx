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

const articleSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  imageUrl: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  robots: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url("OG Image must be a valid URL").optional(),
  ogType: z.string().optional(),
  twitterCard: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().url("Twitter Image must be a valid URL").optional(),
  canonicalUrl: z.string().url("Canonical URL must be a valid URL").optional(),
  schemaData: z.string().optional(),
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

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
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
      showInNav: false,
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

          const s3Url = await uploadImageToS3(formData);
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
      showInNav: data.showInNav,
    };
    onSubmit(transformedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1"
                />
              </FormControl>
              {imagePreview && (
                <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={imagePreview}
                    alt="Image preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Main Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Content</FormLabel>
              <FormControl>
                <TiptapEditor
                  content={field.value}
                  onChange={handleEditorChange}
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
                <FormMessage />
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
                <FormMessage />
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
                  <Input {...field} />
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
                <FormLabel>OG Title</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>OG Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="showInNav">Show in Navigation</Label>
              <div className="flex items-center space-x-2">
              <Checkbox
                id="showInNav"
                checked={!!form.watch("showInNav")}
                onCheckedChange={(checked: boolean) => {
                  form.setValue("showInNav", !!checked);
                }}
              />

              </div>
            </div>
          </div>
        </div>

        <Button disabled={isUploading} type="submit" className="w-full mt-6">
          {isUploading ? 'Uploading...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
};
