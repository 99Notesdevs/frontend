import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
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

type FormData = z.infer<typeof formSchema>;

interface UpscNotesFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
}

export const UpscNotesForm: React.FC<UpscNotesFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
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
    },
  });

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form data changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
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
                <Editor content={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
                <Input placeholder="Enter robots meta tag" {...field} />
              </FormControl>
              <FormMessage />
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
              <FormMessage />
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
                <Input placeholder="Enter Open Graph description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* OG Image */}
        <FormField
          control={form.control}
          name="ogImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OG Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter Open Graph image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
};

export default UpscNotesForm;
