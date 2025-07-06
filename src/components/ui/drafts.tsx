"use client"

import { useEffect, useState } from "react"
import { TrashIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { draftStorage, type DraftData } from "@/utils/indexeddb-drafts"

interface DraftsProps {
  types?: string[] // Optional array of draft types to show
  onSelectDraft?: (draftId: string, draftType: string) => void
}

export default function Drafts({ types, onSelectDraft }: DraftsProps) {
  const [drafts, setDrafts] = useState<DraftData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Default draft types if none provided
  const DRAFT_TYPES = types || ["blog", "currentAffair", "article", "upscNotes", "generalStudies", "currentArticle"]

  useEffect(() => {
    loadDrafts()
  }, [types])

  const loadDrafts = async () => {
    try {
      setLoading(true)
      setError(null)
      const allDrafts: DraftData[] = []

      // Load drafts for each type
      for (const type of DRAFT_TYPES) {
        try {
          const typeDrafts = await draftStorage.getAllDraftsByType(type)
          allDrafts.push(...typeDrafts)
        } catch (err) {
          console.error(`Error loading ${type} drafts:`, err)
        }
      }

      // Sort by updated date (most recent first)
      allDrafts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

      setDrafts(allDrafts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drafts")
      console.error("Error loading drafts:", err)
    } finally {
      setLoading(false)
    }
  }

  const deleteDraft = async (draftId: string) => {
    try {
      await draftStorage.deleteDraft(draftId)
      await loadDrafts() // Refresh the list
    } catch (err) {
      console.error("Error deleting draft:", err)
      setError("Failed to delete draft")
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDraftTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      blog: "Blog",
      currentAffair: "Current Affair",
      article: "Article",
      upscNotes: "UPSC Notes",
      generalStudies: "General Studies",
      currentArticle: "Current Article",
    }
    return typeLabels[type] || type
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {error}
        <Button onClick={loadDrafts} className="ml-2 text-sm bg-transparent" variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  if (drafts.length === 0) {
    return <div className="p-4 text-center text-gray-500">No drafts available</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Drafts ({drafts.length})</h2>
        <Button onClick={loadDrafts} variant="outline" size="sm" disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {drafts.map((draft) => (
          <div
            key={`${draft.draftType}-${draft.id}`}  
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelectDraft?.(draft.id!, draft.draftType)}>
              <div className="flex items-center space-x-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{draft.title || "Untitled Draft"}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {getDraftTypeLabel(draft.draftType)}
                    </span>
                    <span>•</span>
                    <span>Updated: {formatDate(draft.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Are you sure you want to delete "${draft.title || "Untitled Draft"}"?`)) {
                  deleteDraft(draft.id!)
                }
              }}
              className="h-8 w-8 ml-2"
            >
              <TrashIcon className="h-4 w-4" />
              <span className="sr-only">Delete {draft.title}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
