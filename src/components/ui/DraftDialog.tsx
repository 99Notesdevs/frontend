"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Draft {
  id: string
  title: string
  data: any
  updatedAt: Date
}

interface DraftDialogProps {
  open: boolean
  onClose: () => void
  onLoadDraft: () => void
  onStartNew: () => void
  drafts: Draft[]
  onSelectDraft: (draftId: string) => void
}

const DraftDialog: React.FC<DraftDialogProps> = ({ open, onClose, onLoadDraft, onStartNew, drafts, onSelectDraft }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Load Draft</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You have {drafts.length} saved draft{drafts.length !== 1 ? "s" : ""}. Would you like to continue with one of
            them or start fresh?
          </p>

          {drafts.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectDraft(draft.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{draft.title || "Untitled Draft"}</p>
                    <p className="text-xs text-gray-500">{formatDate(draft.updatedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={onStartNew} variant="outline" className="flex-1 text-[var(--admin-bg-dark)]">
              Start New
            </Button>
            <Button onClick={onClose} className="flex-1 text-[var(--admin-bg-dark)]">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DraftDialog
