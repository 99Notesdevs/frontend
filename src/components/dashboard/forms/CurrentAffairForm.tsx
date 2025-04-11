import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import TiptapEditor from '@/components/ui/tiptapeditor';

const currentAffairSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
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
});

type CurrentAffairFormValues = z.infer<typeof currentAffairSchema>;

interface CurrentAffairFormProps {
  onSubmit: (data: CurrentAffairFormValues) => void;
  defaultValues?: CurrentAffairFormValues;
}

export const CurrentAffairForm: React.FC<CurrentAffairFormProps> = ({ onSubmit, defaultValues }) => {
  const form = useForm<CurrentAffairFormValues>({
    resolver: zodResolver(currentAffairSchema),
    defaultValues: defaultValues || {
      title: '',
      content: '<p></p>',
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
    },
  });

  const handleSubmit = (data: CurrentAffairFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter title" />
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
                <TiptapEditor
                  content={field.value}
                  onChange={(content) => field.onChange(content)}
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
              <FormLabel>Meta Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter meta title" />
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
                <Input {...field} placeholder="Enter meta description" />
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
                <Input {...field} placeholder="Enter meta keywords" />
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
                <Input {...field} placeholder="Enter OG title" />
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
                <Input {...field} placeholder="Enter OG description" />
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
                <Input {...field} placeholder="Enter OG image URL" />
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
                <Input {...field} placeholder="Enter Twitter title" />
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
                <Input {...field} placeholder="Enter Twitter description" />
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
                <Input {...field} placeholder="Enter Twitter image URL" />
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
                <Input {...field} placeholder="Enter canonical URL" />
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
                <Input {...field} placeholder="Enter schema data" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};