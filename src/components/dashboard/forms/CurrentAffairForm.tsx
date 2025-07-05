"use client"
import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@radix-ui/react-label"
import Image from "next/image"
import { Alert } from "@/components/ui/alert"
import DraftDialog from "@/components/ui/DraftDialog"
import { uploadImageToS3 } from "@/config/imageUploadS3"
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
})

type CurrentAffairFormValues = z.infer<typeof currentAffairSchema>

interface CurrentAffairFormProps {
  onSubmit: (data: CurrentAffairFormValues) => void
  defaultValues?: CurrentAffairFormValues
}

export function CurrentAffairForm({ onSubmit, defaultValues }: CurrentAffairFormProps) {
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

  const [alert, setAlert] = useState<{
    message: string
    type: "error" | "success" | "warning"
  } | null>(null)
  const [showDraftDialog, setShowDraftDialog] = useState(false)
  const [ogimagePreview, setOgImagePreview] = useState<string | null>(
    defaultValues?.ogImage ? getImageUrl(defaultValues.ogImage) : null,
  )

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
  } = useIndexedDBDrafts<CurrentAffairFormValues>({
    draftType: "currentAffair",
    defaultTitle: "Untitled Current Affair",
    autoSaveInterval: 30000,
  })

  const defaultFormValues: CurrentAffairFormValues = {
    title: "",
    content: "",
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
    header: "",
    body: "",
    showInNav: true,
  }

  const form = useForm<CurrentAffairFormValues>({
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
      const savedId = await saveDraftToDB(title, draftData)
      if(savedId==null){
        return;
      }
      if (!currentDraftId) {
        setCurrentDraftId(savedId)
      }

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

  const handleOGUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const file = e.target.files?.[0]
    if (file) {
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
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const startNew = useCallback(() => {
    form.reset(defaultFormValues)
    setCurrentDraftId(null)
    setOgImagePreview(null)
    setShowDraftDialog(false)
  }, [form, setCurrentDraftId])

  const handleSubmit = (data: CurrentAffairFormValues) => {
    onSubmit(data)
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
                  <TiptapEditor content={field.value} onChange={(content) => field.onChange(content)} />
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
            name="robots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Robots</FormLabel>
                <FormControl>
                  <Select value={field.value || "noindex,nofollow"} onValueChange={field.onChange}>
                    <SelectTrigger>
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
                          <SelectTrigger>
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
            Save as Draft
          </Button>

          <Button type="submit" className="bg-slate-700 hover:bg-slate-900 text-white">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}
