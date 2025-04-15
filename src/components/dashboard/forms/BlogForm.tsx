'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import TiptapEditor from '@/components/ui/tiptapeditor';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { uploadImageToS3 } from '@/config/imageUploadS3';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  imageUrl: z.string().url("Image URL must be a valid URL").optional(),
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
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  order: z.number().min(0, 'Order must be a positive number').optional(),
});

export type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  onSubmit: (data: BlogFormValues) => Promise<void>;
  defaultValues?: Partial<BlogFormValues>;
}

export function BlogForm({ onSubmit, defaultValues }: BlogFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      title: '',
      content: '',
      slug: '',
      order: 0,
    },
  });

  const handleSubmit = async (data: BlogFormValues) => {
    try {
      // Normalize the slug by replacing spaces with hyphens
      const normalizedSlug = data.slug.replace(/\s+/g, '-');
      
      // Update the form data with the normalized slug
      const formData = {
        ...data,
        slug: normalizedSlug,
        metadata: JSON.stringify({
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
          schemaData: data.schemaData
        })
      };

      await onSubmit(formData);
      
      // Don't reload the page here, let the parent component handle it
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error; // Let the parent component handle the error
    }
  };

  // Function to generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim() // Remove whitespace from start and end
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };

  // Watch title changes and update slug
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && value.title) {
        const newSlug = generateSlug(value.title);
        form.setValue('slug', newSlug, { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <TiptapEditor content={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  {imagePreview && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Metadata Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Metadata</h3>
          
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter meta title" {...field} />
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
                  <Input placeholder="Enter meta description" {...field} />
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
                  <Input placeholder="Enter meta keywords" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Open Graph Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Open Graph</h3>
          
          <FormField
            control={form.control}
            name="ogTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OG Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter OG title" {...field} />
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
                  <Input placeholder="Enter OG description" {...field} />
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
                <FormLabel>OG Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter OG image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Twitter Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Twitter Card</h3>
          
          <FormField
            control={form.control}
            name="twitterTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Twitter title" {...field} />
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
                  <Input placeholder="Enter Twitter description" {...field} />
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
                <FormLabel>Twitter Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Twitter image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Save Blog"}
        </Button>
      </form>
    </Form>
  );
}