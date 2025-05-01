import React, { useState } from "react";
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
} from "@/components/ui/form";
import { Label } from "@radix-ui/react-label";
import { Checkbox } from "@/components/ui/Checkbox";
import { Alert } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
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
      showInNav: false,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormLabel>Content <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Editor content={field.value} onChange={field.onChange} />
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
                    <SelectContent className="text-white">
                      <SelectItem value="noindex,nofollow">No index,No follow</SelectItem>
                      <SelectItem value="index,nofollow">Index,No follow</SelectItem>
                      <SelectItem value="noindex,follow">No index,Follow</SelectItem>
                      <SelectItem value="index,follow">Index,Follow</SelectItem>
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
                  <Input placeholder="Enter Open Graph description" {...field} />
                </FormControl>
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

          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpscNotesForm;
