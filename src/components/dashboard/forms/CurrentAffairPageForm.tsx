"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { uploadImageToS3 } from "@/config/imageUploadS3"
import { Label } from "@radix-ui/react-label"
import { Alert } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DraftDialog from "@/components/ui/DraftDialog"
import { useIndexedDBDrafts } from "@/hooks/useIndexedDBDrafts"

const TiptapEditor = dynamic(() => import("@/components/ui/tiptapeditor").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  ),
})

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  imageUrl: z.string(),
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
  header: z.string().optional(),
  body: z.string().optional(),
  author: z.string().optional(),
})

export type CurrentAffairPageFormValues = z.infer<typeof formSchema>

interface CurrentAffairPageFormProps {
  onSubmit: (data: CurrentAffairPageFormValues) => void
  defaultValues?: Partial<CurrentAffairPageFormValues>
  folder: string
}

export function CurrentAffairPageForm({ onSubmit, defaultValues, folder }: CurrentAffairPageFormProps) {
  const parseImageUrl = (url: string | undefined): [string, string] => {
    try {
      return JSON.parse(url || "[]") as [string, string]
    } catch (error) {
      return ["", ""]
    }
  }

  const getImageUrl = (url: string | undefined): string => {
    const [imageUrl] = parseImageUrl(url)
    return imageUrl
  }

  const getImageAlt = (url: string | undefined): string => {
    const [, altText] = parseImageUrl(url)
    return altText
  }

  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.imageUrl ? getImageUrl(defaultValues.imageUrl) : null,
  )
  const [ogimagePreview, setOgImagePreview] = useState<string | null>(
    defaultValues?.ogImage ? getImageUrl(defaultValues.ogImage) : null,
  )
  const [isUploading, setIsUploading] = useState(false)
  const [alert, setAlert] = useState<{
    message: string
    type: "error" | "success" | "warning"
  } | null>(null)
  const [showDraftDialog, setShowDraftDialog] = useState(false)

  const {
    drafts,
    currentDraftId,
    isLoading: isLoadingDrafts,
    error: draftError,
    saveDraft: saveDraftToDB,
    deleteDraft,
    getDraft,
    loadDrafts,
    setCurrentDraftId,
  } = useIndexedDBDrafts<CurrentAffairPageFormValues>({
    draftType: "currentAffairPage",
    defaultTitle: "Untitled Current Affair Page",
    autoSaveInterval: 30000,
  })

  const defaultFormValues: CurrentAffairPageFormValues = {
    title: "",
    content: "",
    imageUrl: JSON.stringify(["", ""]),
    showInNav: true,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    robots: "noindex,nofollow",
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
    author: "",
    header: "",
    body: "",
  }

  const form = useForm<CurrentAffairPageFormValues>({
    resolver: (values) => {
      let errors = {}
      const messages = []

      if (!values.title || values.title.length < 2) {
        messages.push("Title must be at least 2 characters")
        errors = {
          ...errors,
          title: { message: "" },
        }
      }

      if (!values.content || values.content.length < 10) {
        messages.push("Content must be at least 10 characters")
        errors = {
          ...errors,
          content: { message: "" },
        }
      }

      if (!values.imageUrl) {
        messages.push("Image is required")
        errors = {
          ...errors,
          imageUrl: { message: "" },
        }
      }

      if (messages.length > 0) {
        setAlert({
          message: `Please fix the following:\n• ${messages.join("\n• ")}`,
          type: "error",
        })
        return { values: {}, errors }
      }

      setAlert(null)
      return { values, errors: {} }
    },
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (drafts.length > 0 && !isLoadingDrafts && !currentDraftId) {
      setShowDraftDialog(true)
    }
  }, [drafts, isLoadingDrafts, currentDraftId])

  const loadDraft = async () => {
    await loadDrafts()
    if (drafts.length > 0) {
      setShowDraftDialog(true)
    }
  }

  const selectDraft = useCallback(
    async (draftId: string) => {
      try {
        const selectedDraft = await getDraft(draftId)
        if (selectedDraft) {
          form.reset(selectedDraft.data)
          setCurrentDraftId(selectedDraft.id!)
          setImagePreview(getImageUrl(selectedDraft.data.imageUrl))
          if (selectedDraft.data.ogImage) {
            setOgImagePreview(getImageUrl(selectedDraft.data.ogImage))
          }
          setShowDraftDialog(false)
        }
      } catch (error) {
        console.error("Error selecting draft:", error)
        setAlert({
          message: "Failed to load draft. Please try again.",
          type: "error",
        })
      }
    },
    [getDraft, form, setCurrentDraftId],
  )

  const saveDraft = useCallback(async () => {
    const draftData = form.getValues()
    const title = draftData.title || "Untitled Draft"

    try {
      await saveDraftToDB(title, draftData)
      // if(savedId==null){
      //   return;
      // }
      // if (!currentDraftId) {
      //   setCurrentDraftId(savedId)
      // }

      setAlert({
        message: "Draft saved successfully!",
        type: "success",
      })
    } catch (error) {
      console.error("Error saving draft:", error)
      setAlert({
        message: "Failed to save draft. Please try again.",
        type: "error",
      })
    }
  }, [form, saveDraftToDB, currentDraftId, setCurrentDraftId])

  const startNew = useCallback(() => {
    form.reset(defaultFormValues)
    setCurrentDraftId(null)
    setImagePreview(null)
    setOgImagePreview(null)
    setShowDraftDialog(false)
  }, [form, setCurrentDraftId])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const result = reader.result as string
          setImagePreview(result)

          const formData = new FormData()
          formData.append("imageUrl", file)

          const s3Url = await uploadImageToS3(formData, folder, file.name)
          if (s3Url) {
            form.setValue("imageUrl", JSON.stringify([s3Url, ""]), {
              shouldValidate: true,
            })
          } else {
            form.setValue("imageUrl", JSON.stringify(["/www.google.com/fallbackUrl", ""]), {
              shouldValidate: true,
            })
            throw new Error("Failed to upload image to S3")
          }
        } catch (error) {
          console.error("Error uploading image:", error)
        } finally {
          setIsUploading(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOGUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const result = reader.result as string
          setOgImagePreview(result)

          const formData = new FormData()
          formData.append("imageUrl", file)

          const s3Url = await uploadImageToS3(formData, "BlogOGImages", file.name)
          if (s3Url) {
            form.setValue("ogImage", JSON.stringify([s3Url, ""]), {
              shouldValidate: true,
            })
          } else {
            form.setValue("ogImage", JSON.stringify(["/www.google.com/fallbackUrl", ""]), {
              shouldValidate: true,
            })
            throw new Error("Failed to upload image to S3")
          }
        } catch (error) {
          console.error("Error uploading image:", error)
        } finally {
          setIsUploading(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      const draftData = form.getValues()
      if (draftData.title && draftData.title.trim().length > 0) {
        try {
          await saveDraft()
        } catch (error) {
          console.error("Auto-save failed:", error)
        }
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [saveDraft])

  return (
    <div className="relative">
      <DraftDialog
        open={showDraftDialog}
        onClose={() => setShowDraftDialog(false)}
        onLoadDraft={loadDraft}
        onStartNew={startNew}
        drafts={drafts.map((draft) => ({
          id: draft.id!,
          title: draft.title,
          data: draft.data,
          updatedAt: draft.updatedAt,
        }))}
        onSelectDraft={selectDraft}
      />
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter title"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
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
                  <FormLabel className="text-gray-500 font-medium">Author</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter author"
                      {...field}
                      className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <div className="space-y-4">
                <div>
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field: altField }) => (
                      <FormItem>
                        <FormLabel>Image Alt Text</FormLabel>
                        <FormControl>
                          <Input
                            value={getImageAlt(altField.value)}
                            onChange={(e) => {
                              const [imageUrl, altText] = parseImageUrl(altField.value)
                              altField.onChange(JSON.stringify([imageUrl, e.target.value]))
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe the image for accessibility. This will be used as the alt text.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border-[var(--admin-border)]"
                />

                {imagePreview ? (
                  <div className="space-y-2">
                    <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-[var(--admin-border)]">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Image preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-green-500">Image uploaded successfully</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No image uploaded</p>
                )}
              </div>
            )}
          />

          {/* Main Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">
                  Content <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="border border-blue-100 rounded-lg overflow-hidden">
                    <TiptapEditor
                      content={form.getValues("content")}
                      onChange={(html) => form.setValue("content", html)}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* All the metadata fields with the same pattern as other forms */}
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">Meta Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter meta title"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">Meta Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter meta description"
                    {...field}
                    className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="robots"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 font-medium">Robots</FormLabel>
                <FormControl>
                  <Select value={field.value || "noindex,nofollow"} onValueChange={field.onChange}>
                    <SelectTrigger className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg">
                      <SelectValue placeholder="No index, No follow" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="index,follow">Index & Follow (Default)</SelectItem>
                      <SelectItem value="noindex,follow">No Index, Follow</SelectItem>
                      <SelectItem value="index,nofollow">Index, No Follow</SelectItem>
                      <SelectItem value="noindex,nofollow">No Index & No Follow</SelectItem>
                      <SelectItem value="noarchive">No Archive</SelectItem>
                      <SelectItem value="nosnippet">No Snippet</SelectItem>
                      <SelectItem value="data-nosnippet">Data No Snippet</SelectItem>
                      <SelectItem value="max-snippet:0">Max Snippet: None</SelectItem>
                      <SelectItem value="max-snippet:-1">Max Snippet: Unlimited</SelectItem>
                      <SelectItem value="max-snippet:50">Max Snippet: 50 Characters</SelectItem>
                      <SelectItem value="noimageindex">No Image Index</SelectItem>
                      <SelectItem value="nocache">No Cache</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ogImage"
            render={({ field }) => (
              <div className="space-y-4">
                <FormLabel>OG Image</FormLabel>
                <Input {...field} />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleOGUpload}
                  className="border-[var(--admin-border)]"
                />

                {ogimagePreview ? (
                  <div className="space-y-2">
                    <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-[var(--admin-border)]">
                      <Image
                        src={ogimagePreview || "/placeholder.svg"}
                        alt="Image preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-green-500">Image uploaded successfully</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No image uploaded</p>
                )}
              </div>
            )}
          />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="showInNav">Show in Navigation</Label>
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="showInNav"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value ? "show" : "hide"}
                          onValueChange={(value) => field.onChange(value === "show")}
                        >
                          <SelectTrigger className="border-blue-100 focus:border-blue-300 focus:ring-blue-300 rounded-lg">
                            <SelectValue placeholder="Show in Navbar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="show">Show in Navbar</SelectItem>
                            <SelectItem value="hide">Do not Show in Navbar</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Button type="button" onClick={saveDraft} className="bg-gray-300 hover:bg-gray-400 mr-5">
            Save as draft
          </Button>

          <Button
            disabled={isUploading}
            type="submit"
            className="bg-slate-700 text-white rounded-md hover:bg-slate-800"
          >
            {isUploading ? "Uploading..." : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
