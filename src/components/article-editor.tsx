"use client"

import { useState } from "react"
import { Save, Download, X, Plus } from "lucide-react"
import TiptapEditor from "./tiptapeditor"
import { cn } from "@/lib/utils"

interface Article {
  title: string
  content: string
  tags: string[]
  image?: string
  updatedAt?: string
}

interface ArticleEditorProps {
  initialData?: Article
  onSave?: (article: Article) => Promise<void>
}

const ArticleEditor = ({ initialData, onSave }: ArticleEditorProps) => {
  const [article, setArticle] = useState<Article>(
    initialData || {
      title: "",
      content: "",
      tags: [],
      image: "",
      updatedAt: new Date().toISOString().split("T")[0],
    }
  )
  const [tagInput, setTagInput] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: "", message: "" })
  const [saving, setSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setArticle((prev) => ({ ...prev, [name]: value }))
  }

  const setContent = (content: string) => {
    setArticle((prev) => ({ ...prev, content }))
  }

  const addTag = () => {
    if (tagInput.trim() && !article.tags.includes(tagInput.trim())) {
      setArticle((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setArticle((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const showToast = (title: string, message: string) => {
    setToastMessage({ title, message })
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  const exportToJson = () => {
    const jsonData = JSON.stringify(article, null, 2)
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `article-${article.title.toLowerCase().replace(/\s+/g, "-")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast("Article exported", "Your article has been exported as JSON")
  }

  const saveArticle = async () => {
    if (saving) return

    try {
      setSaving(true)
      const updatedArticle = {
        ...article,
        updatedAt: new Date().toISOString().split("T")[0],
      }

      if (onSave) {
        await onSave(updatedArticle)
      }

      setArticle(updatedArticle)
      showToast("Article saved", "Your article has been saved successfully")
    } catch (error) {
      showToast("Error", "Failed to save article")
      console.error("Failed to save article:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-black space-y-8 w-full max-w-5xl mx-auto p-6">
      {/* Toast notification */}
      {toastVisible && (
        <div className="fixed right-4 top-4 z-50 w-72 transform transition-all duration-300 ease-in-out translate-y-0 opacity-100">
          <div className="rounded-lg bg-white/95 backdrop-blur-sm p-4 shadow-lg dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl xl:text-6xl">
                <h3 className="font-medium text-gray-900 dark:text-white">{toastMessage.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{toastMessage.message}</p>
              </div>
              <button
                onClick={() => setToastVisible(false)}
                className="ml-4 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          {initialData ? "Edit Article" : "Create New Article"}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={exportToJson}
            className={cn(
              "inline-flex items-center justify-center rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm px-5 py-2.5",
              "text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md",
              "focus:outline-none focus:ring-2 focus:ring-gray-500/40 focus:ring-offset-2",
              "dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800/80",
              "dark:focus:ring-gray-500 dark:focus:ring-offset-gray-900"
            )}
          >
            <Download className="mr-2 h-4 w-4" /> Export JSON
          </button>
          <button
            onClick={saveArticle}
            disabled={saving}
            className={cn(
              "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5",
              "text-sm font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2",
              "dark:focus:ring-offset-gray-900",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            )}
          >
            <Save className={cn("mr-2 h-4 w-4", saving && "animate-spin")} /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid gap-8">
        <div className="grid gap-3">
          <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={article.title}
            onChange={handleChange}
            placeholder="Enter a captivating title..."
            className={cn(
              "w-full rounded-lg border border-gray-300/50 bg-white/50 backdrop-blur-sm px-4 py-3",
              "text-gray-900 placeholder-gray-400/70 transition-all duration-200",
              "focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              "dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500/70",
              "dark:focus:border-blue-500/50 hover:border-gray-400/50 dark:hover:border-gray-600/50"
            )}
          />
        </div>

        <div className="grid gap-3">
          <label htmlFor="image" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Image URL (optional)
          </label>
          <input
            id="image"
            name="image"
            value={article.image}
            onChange={handleChange}
            placeholder="Paste your image URL here..."
            className={cn(
              "w-full rounded-lg border border-gray-300/50 bg-white/50 backdrop-blur-sm px-4 py-3",
              "text-gray-900 placeholder-gray-400/70 transition-all duration-200",
              "focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              "dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500/70",
              "dark:focus:border-blue-500/50 hover:border-gray-400/50 dark:hover:border-gray-600/50"
            )}
          />
          {article.image && (
            <div className="mt-2 group relative overflow-hidden rounded-lg">
              <img
                src={article.image}
                alt="Article preview"
                className="w-full max-h-60 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
        </div>

        <div className="grid gap-3">
          <label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </label>
          <div className="rounded-lg border border-gray-300/50 dark:border-gray-700/50 overflow-hidden">
            <TiptapEditor content={article.content} setContent={setContent} />
          </div>
        </div>

        <div className="grid gap-3">
          <label htmlFor="tags" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <div className="flex gap-3">
            <input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tags to categorize your article..."
              className={cn(
                "flex-1 rounded-lg border border-gray-300/50 bg-white/50 backdrop-blur-sm px-4 py-3",
                "text-gray-900 placeholder-gray-400/70 transition-all duration-200",
                "focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                "dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500/70",
                "dark:focus:border-blue-500/50 hover:border-gray-400/50 dark:hover:border-gray-600/50"
              )}
            />
            <button
              type="button"
              onClick={addTag}
              className={cn(
                "inline-flex items-center justify-center rounded-lg border border-gray-200/50 bg-white/50 backdrop-blur-sm px-4",
                "text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:ring-offset-2",
                "dark:border-gray-800/50 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800/80",
                "dark:focus:ring-gray-500 dark:focus:ring-offset-gray-900"
              )}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100/80 px-3 py-1 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200/80 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700/80"
              >
                {tag}
                <button
                  className="rounded-full p-0.5 text-gray-500/80 transition-colors hover:bg-gray-300/20 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600/20 dark:hover:text-gray-200"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag}</span>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200/50 bg-white/50 backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-900/50">
          <div className="p-6">
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Preview JSON Output</h3>
            <pre className="max-h-60 overflow-auto rounded-lg bg-gray-50/80 p-4 text-sm text-gray-800 dark:bg-gray-800/80 dark:text-gray-200 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {JSON.stringify(article, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleEditor
