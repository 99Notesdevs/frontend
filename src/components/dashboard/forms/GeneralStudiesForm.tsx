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

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  image: z.string().optional(),
});

export type GeneralStudiesFormValues = z.infer<typeof formSchema>;

interface GeneralStudiesFormProps {
  onSubmit: (data: GeneralStudiesFormValues) => void;
  defaultValues?: Partial<GeneralStudiesFormValues>;
}

export function GeneralStudiesForm({ onSubmit, defaultValues }: GeneralStudiesFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.image || null);

  const form = useForm<GeneralStudiesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      image: '',
      ...defaultValues,
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            // Show a preview of the image
            const result = reader.result as string;
            setImagePreview(result);
            console.log(file);
  
            // Upload the image to S3
            const formData = new FormData();
            formData.append("image", file);
  
            const s3Url = await uploadImageToS3(formData); // Call your S3 upload function
            if (s3Url) {
              // Update the image field with the S3 URL
              form.setValue("image", s3Url, { shouldValidate: true });
            } else {
              throw new Error("Failed to upload image to S3");
            }
          } catch (error) {
            console.error("Error uploading image:", error);
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
              <FormLabel className="text-gray-500 font-medium">Title</FormLabel>
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

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-gray-500 font-medium">Featured Image</FormLabel>
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
              <FormLabel className="text-gray-500 font-medium">Content</FormLabel>
              <FormControl>
                <div className="border border-blue-100 rounded-lg overflow-hidden">
                  <TiptapEditor
                    content={form.getValues('content')}
                    onChange={(html) => form.setValue('content', html)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-colors duration-200"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}