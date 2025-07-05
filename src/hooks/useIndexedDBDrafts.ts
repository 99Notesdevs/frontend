"use client"

import { useState, useEffect, useCallback } from "react"
import { draftStorage, type DraftData } from "@/utils/indexeddb-drafts"

interface UseIndexedDBDraftsOptions<T> {
  draftType: string // Changed from formId to draftType
  defaultTitle: string
  autoSaveInterval?: number
  onDraftSelect?: (draftData: T) => void
}

interface UseIndexedDBDraftsReturn<T> {
  drafts: DraftData[]
  currentDraftId: string | null
  isLoading: boolean
  error: string | null
  saveDraft: (title: string, data: T) => Promise<void>
  deleteDraft: (id: string) => Promise<void>
  getDraft: (id: string) => Promise<DraftData | null>
  loadDrafts: () => Promise<void>
  clearAllDrafts: () => Promise<void>
  setCurrentDraftId: (id: string | null) => void
}

export function useIndexedDBDrafts<T = any>({
  draftType,
  defaultTitle,
  autoSaveInterval = 30000,
  onDraftSelect,
}: UseIndexedDBDraftsOptions<T>): UseIndexedDBDraftsReturn<T> {
  const [drafts, setDrafts] = useState<DraftData[]>([])
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDrafts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const allDrafts = await draftStorage.getAllDraftsByType(draftType)
      setDrafts(allDrafts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drafts")
      console.error("Error loading drafts:", err)
    } finally {
      setIsLoading(false)
    }
  }, [draftType])

  const saveDraft = useCallback(
    async (title: string, data: T) => {
      try {
        setError(null)
        console.log("Current draft ID:", currentDraftId)
      
        // Convert ID to string if it exists, otherwise pass null
        const idToSave = currentDraftId ? String(currentDraftId) : null
        const savedId = await draftStorage.saveDraft(idToSave, title, data, draftType)
        
        // Always ensure the saved ID is stored as a string
        const stringId = String(savedId)
        if (currentDraftId !== stringId) {
          setCurrentDraftId(stringId)
        }
        console.log("here saving")
        await loadDrafts() // Refresh the drafts list
        console.log("here saved")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save draft")
        console.error("Error saving draft:", err)
        throw err
      }
    },
    [loadDrafts, currentDraftId, draftType],
  )

  const deleteDraft = useCallback(
    async (id: string) => {
      try {
        setError(null)
        await draftStorage.deleteDraft(id)
        if (currentDraftId === id) {
          setCurrentDraftId(null)
        }
        await loadDrafts() // Refresh the drafts list
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete draft")
        console.error("Error deleting draft:", err)
        throw err
      }
    },
    [loadDrafts, currentDraftId],
  )

  const getDraft = useCallback(async (id: string) => {
    try {
      setError(null)
      return await draftStorage.getDraftById(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get draft")
      console.error("Error getting draft:", err)
      return null
    }
  }, [])

  const clearAllDrafts = useCallback(async () => {
    try {
      setError(null)
      await draftStorage.clearAllDrafts()
      setDrafts([])
      setCurrentDraftId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear drafts")
      console.error("Error clearing drafts:", err)
      throw err
    }
  }, [])

  useEffect(() => {
    loadDrafts()
  }, [loadDrafts])

  return {
    drafts,
    currentDraftId,
    isLoading,
    error,
    saveDraft,
    deleteDraft,
    getDraft,
    loadDrafts,
    clearAllDrafts,
    setCurrentDraftId,
  }
}
