"use client"

import { useRouter } from "next/router"
import ArticleEditor from "@/components/article-editor"

export default function NewArticlePage() {
  const router = useRouter()

  const handleSave = async (article: any) => {
    try {
      // Here you would typically make an API call to save the article
      // For now, we'll just simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // After saving, redirect to the articles list
      router.push("/dashboard/articles")
    } catch (error) {
      console.error("Failed to save article:", error)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-20">
      <ArticleEditor onSave={handleSave} />
    </div>
  )
}

