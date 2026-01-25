"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { isAuth, type AuthResponse } from "@/lib/isAuth";

const customLinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  showInNav: z.boolean().default(false),
  link: z.string().min(1, "Link is required"),
});

export type CustomLinkFormData = z.infer<typeof customLinkSchema>;

interface CustomLinkFormProps {
  initialData?: CustomLinkFormData;
  onSubmit: (data: CustomLinkFormData) => void;
}

export const CustomLinkForm: React.FC<CustomLinkFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [userRole, setUserRole] = useState<"admin" | "editor" | "author" | "user" | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse: AuthResponse = await isAuth();
        setUserRole(authResponse.role);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUserRole(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const form = useForm<CustomLinkFormData>({
    resolver: zodResolver(customLinkSchema),
    defaultValues: initialData || {
      title: "",
      showInNav: true,
      link: "",
    },
  });

  const handleSubmit = (data: CustomLinkFormData) => {
    onSubmit(data);
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
                <Input 
                  placeholder="Enter page title" 
                  {...field} 
                  disabled={userRole !== "admin" && !isLoadingAuth}
                />
              </FormControl>
              {userRole !== "admin" && !isLoadingAuth && (
                <FormDescription className="text-amber-600">
                  Only administrators can edit the title field.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="Enter page link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="showInNav"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <FormControl>
                <Select
                  value={field.value ? "show" : "hide"}
                  onValueChange={(value) => {
                    field.onChange(value === "show");
                  }}
                  defaultValue="hide"
                >
                  <SelectTrigger className="text-white">
                    <SelectValue placeholder="Show in Navbar" />
                  </SelectTrigger>
                  <SelectContent className="text-white">
                    <SelectItem value="show">Show in Navbar</SelectItem>
                    <SelectItem value="hide">Do not Show in Navbar</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Page
        </Button>
      </form>
    </Form>
  );
};
