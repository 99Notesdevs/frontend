'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import TiptapEditor from '@/components/ui/tiptapeditor';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { uploadImageToS3 } from '@/config/imageUploadS3';
import { Alert } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  imageUrl: z.string(),
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
});

export type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  onSubmit: (data: BlogFormValues) => Promise<void>;
  defaultValues?: Partial<BlogFormValues>;
}

export function BlogForm({ onSubmit, defaultValues }: BlogFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  } | null>(null);

  const form = useForm<BlogFormValues>({
    resolver: (values) => {
      let errors = {};
      const messages = [];

      if (!values.title || values.title.length < 2) {
        messages.push("Title must be at least 2 characters");
        errors = {
          ...errors,
          title: { message: "Title must be at least 2 characters" }
        };
      }

      if (!values.content || values.content.length < 10) {
        messages.push("Content must be at least 10 characters");
        errors = {
          ...errors,
          content: { message: "Content must be at least 10 characters" }
        };
      }

      if (!values.imageUrl) {
        messages.push("Image is required");
        errors = {
          ...errors,
          imageUrl: { message: "Image is required" }
        };
      } else if (!values.imageUrl.match(/^https?:\/\/.+$/)) {
        messages.push("Please provide a valid image URL");
        errors = {
          ...errors,
          imageUrl: { message: "Please provide a valid image URL" }
        };
      }

      if (!values.slug) {
        messages.push("Slug is required");
        errors = {
          ...errors,
          slug: { message: "Slug is required" }
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
    defaultValues: defaultValues || {
      title: '',
      content: '',
      imageUrl: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      robots: '',
      ogTitle: '',  
      ogDescription: '',
      ogImage: '',
      ogType: '',
      twitterCard: '',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      canonicalUrl: '',
      schemaData: '',
      header: '',
      body: '',
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

          // Upload the image to S3
          const formData = new FormData();
          formData.append("imageUrl", file);

          const s3Url = await uploadImageToS3(formData);
          if (s3Url) {
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

  const handleFormSubmit = async (data: BlogFormValues) => {
    try {
      await onSubmit(data);
      setAlert({
        message: "Blog post saved successfully!",
        type: "success"
      });
    } catch (error) {
      setAlert({
        message: "Failed to save blog post. Please try again.",
        type: "error"
      });
    }
  };

  return (
    <div className="relative">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
          className={`font-bold px-4 py-3 rounded mb-4 ${alert.type === 'error' ? 'bg-red-100 text-red-800 border border-red-400' : alert.type === 'success' ? 'bg-green-100 text-green-800 border border-green-400' : 'bg-yellow-100 text-yellow-800 border border-yellow-400'}`}
        />
      )}
      <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Show success message */}
          {isSuccess && (
            <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
              {successMessage}
            </div>
          )}
          
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter blog title" {...field} />
                </FormControl>
                {fieldState.error?.message && (
                  <div className="text-red-600 font-semibold text-sm mt-1">{fieldState.error.message}</div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Content *</FormLabel>
                <FormControl>
                  <TiptapEditor content={field.value} onChange={field.onChange} />
                </FormControl>
                {fieldState.error?.message && (
                  <div className="text-red-600 font-semibold text-sm mt-1">{fieldState.error.message}</div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Image *</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-4">
                    {imagePreview && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={imagePreview}
                          alt="Blog image preview"
                          fill
                          className="object-cover rounded-lg"
                          priority
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="text-sm text-blue-500 mt-2">Uploading image...</div>
                    )}
                  </div>
                </FormControl>
                {fieldState.error?.message && (
                  <div className="text-red-600 font-semibold text-sm mt-1">{fieldState.error.message}</div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter slug" {...field} />
                </FormControl>
                {fieldState.error?.message && (
                  <div className="text-red-600 font-semibold text-sm mt-1">{fieldState.error.message}</div>
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
              <FormItem>
                <FormLabel>OG Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter OG image URL" {...field} />
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

        <Button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white" disabled={isUploading || form.formState.isSubmitting}>
          {isUploading || form.formState.isSubmitting ? "Processing..." : "Save Blog"}
        </Button>
      </form>
    </Form>
  </div>
  );
}