"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TiptapEditor from "@/components/ui/tiptapeditor";
import { Label } from "@radix-ui/react-label";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Alert } from "@/components/ui/alert";
import DraftDialog from "@/components/ui/DraftDialog";

const currentAffairSchema = z.object({
  title: z.string(),
  content: z.string(),
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
  showInNav: z.boolean().optional(),
});

type CurrentAffairFormValues = z.infer<typeof currentAffairSchema>;

interface CurrentAffairFormProps {
  onSubmit: (data: CurrentAffairFormValues) => void;
  defaultValues?: CurrentAffairFormValues;
}

export function CurrentAffairForm({
  onSubmit,
  defaultValues,
}: CurrentAffairFormProps) {
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  } | null>(null);
  const [showDraftDialog, setShowDraftDialog] = useState(true);

  useEffect(() => {
    const savedDraft = localStorage.getItem("currentAffairDraft");
    if (savedDraft) {
      setShowDraftDialog(true); // Show the dialog if a draft exists
    }
  }, []);

  const loadDraft = () => {
    const savedDraft = localStorage.getItem("currentAffairDraft");
    if (savedDraft) {
      form.reset(JSON.parse(savedDraft)); // Populate the form with the saved draft
    }
    setShowDraftDialog(false); // Close the dialog
  };

  const startNew = () => {
    form.reset(defaultValues || {}); // Reset the form to default values or empty
    setShowDraftDialog(false); // Close the dialog
  };

  const saveDraft = () => {
    const draftData = form.getValues(); // Get the current form values
    try {
      // Save the draft to local storage or send it to an API
      localStorage.setItem("currentAffairDraft", JSON.stringify(draftData));
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

  const form = useForm<CurrentAffairFormValues>({
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
    defaultValues: defaultValues || {
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
      header: "",
      body: "",
      showInNav: true,
    },
  });

  const handleSubmit = (data: CurrentAffairFormValues) => {
    onSubmit(data);
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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter title" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Content <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <TiptapEditor
                    content={field.value}
                    onChange={(content) => field.onChange(content)}
                  />
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
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter meta title" />
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
                  <Input {...field} placeholder="Enter meta description" />
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
                  <SelectTrigger>
                    <SelectValue placeholder="Show in Navbar" />
                  </SelectTrigger>
                  <SelectContent>
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
            Save as Draft
          </Button>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
