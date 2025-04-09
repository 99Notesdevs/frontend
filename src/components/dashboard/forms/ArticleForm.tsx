"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import TiptapEditor from "@/components/ui/tiptapeditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { uploadImageToS3 } from "@/config/imageUploadS3";

const articleSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  imageUrl: z.string().optional(),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      imageUrl: "",
    },
  });

  const handleEditorChange = (content: string) => {
    setValue("content", content, { shouldValidate: true });
  };

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
            setValue("imageUrl", s3Url, { shouldValidate: true });
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

  const handleSubmitForm = (data: ArticleFormData) => {
    // Transform the form data to match the expected page structure
    const transformedData = {
      title: data.title,
      content: data.content,
      image: data.imageUrl || ''
    };
    onSubmit(transformedData);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input type="text" id="title" {...register("title")} className="mt-1" />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <Label htmlFor="image">Featured Image</Label>
        <Input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1"
        />

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
      </div>

      {/* Main Content */}
      <div>
        <Label>Main Content</Label>
        <div className="mt-1">
          <TiptapEditor
            content={watch("content")}
            onChange={handleEditorChange}
          />
        </div>
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Save
      </Button>
    </form>
  );
};
