import type { Metadata } from "next"
import { ArticleEditor } from "@/components/article-editor"

export const metadata: Metadata = {
  title: "Article Editor",
  description: "Create and edit your articles",
}

export default function EditorPage() {
  return (
    <div className="flex flex-col gap-6 pt-40">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Article Editor</h1>
      <ArticleEditor />
    </div>
  )
}

