"use client";

import { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface Draft {
  title: string;
  type: string;
  data: any;
}

interface DraftsProps {
  types?: string[]; // Optional array of draft types to show
}

export default function Drafts({ types }: DraftsProps) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  // Default draft types if none provided
  const DRAFT_TYPES = types || [
    "blogDrafts",
    "currentAffairDrafts",
    "articleDrafts",
    "upscNotesDrafts",
    "generalStudiesDrafts",
    "currentArticleDrafts",
  ];

  useEffect(() => {
    loadDrafts();
  }, [types]); // Add types to dependency array

  const loadDrafts = () => {
    const allDrafts: Draft[] = [];
    
    DRAFT_TYPES.forEach(type => {
      const savedDrafts = localStorage.getItem(type);
      if (savedDrafts) {
        const parsedDrafts = JSON.parse(savedDrafts);
        parsedDrafts.forEach((draft: any) => {
          allDrafts.push({
            ...draft,
            type: type.replace("Drafts", "")
          });
        });
      }
    });

    setDrafts(allDrafts);
    setLoading(false);
  };

  const deleteDraft = (type: string, title: string) => {
    const savedDrafts = localStorage.getItem(type);
    if (savedDrafts) {
      const parsedDrafts = JSON.parse(savedDrafts);
      const updatedDrafts = parsedDrafts.filter((draft: any) => draft.title !== title);
      localStorage.setItem(type, JSON.stringify(updatedDrafts));
      loadDrafts(); // Refresh the list
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No drafts available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Saved Drafts</h2>
      <div className="space-y-2">
        {drafts.map((draft) => (
          <div key={`${draft.type}-${draft.title}`} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {draft.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    Type: {draft.type}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteDraft(`${draft.type}Drafts`, draft.title)}
              className="h-8 w-8"
            >
              <TrashIcon className="h-4 w-4" />
              <span className="sr-only">Delete {draft.title}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}