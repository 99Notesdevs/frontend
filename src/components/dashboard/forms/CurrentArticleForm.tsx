'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import TiptapEditor from '@/components/ui/tiptapeditor';
import { useState } from 'react';
import Image from 'next/image';
import { uploadImageToS3 } from '@/config/imageUploadS3';
import { set } from 'date-fns';
import { QuizQuestions } from '@/components/dashboard/static/current-affair/QuizQuestions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
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

export function CurrentArticleForm({ onSubmit, defaultValues }: CurrentArticleFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<CurrentArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      imageUrl: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      quizQuestions: '',
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
      author: '',
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
  
            const s3Url = await uploadImageToS3(formData); // Call your S3 upload function
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-500 font-medium">Title *</FormLabel>
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
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-gray-500 font-medium">
                Featured Image *
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

                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-blue-100">
                      <Image
                        src={imagePreview}
                        alt="Image preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
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
                  defaultValue={value || '[]'}
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
                  <SelectContent className="text-gray-500">
                    <SelectItem value="noindex,nofollow">No index, No follow</SelectItem>
                    <SelectItem value="index,nofollow">Index, No follow</SelectItem>
                    <SelectItem value="noindex,follow">No index, Follow</SelectItem>
                    <SelectItem value="index,follow">Index, Follow</SelectItem>
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
              <FormMessage />
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
  );
}