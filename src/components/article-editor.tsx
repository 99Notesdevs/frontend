"use client"

import type React from "react"

import { useState } from "react"
import { Save, Download, X, Plus } from "lucide-react"

interface Article {
  title: string
  content: string
  tags: string[]
  image?: string
  updatedAt?: string
}

export function ArticleEditor({ initialData }: { initialData?: Article }) {
  const [article, setArticle] = useState<Article>(
    initialData || {
      title: "",
      content: "",
      tags: [],
      image: "",
      updatedAt: new Date().toISOString().split("T")[0],
    },
  )
  const [tagInput, setTagInput] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: "", message: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setArticle((prev) => ({ ...prev, [name]: value }))
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
    // Create a JSON string from the article data
    const jsonData = JSON.stringify(article, null, 2)

    // Create a blob from the JSON string
    const blob = new Blob([jsonData], { type: "application/json" })

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary anchor element
    const a = document.createElement("a")
    a.href = url
    a.download = `article-${article.title.toLowerCase().replace(/\s+/g, "-")}.json`

    // Trigger the download
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showToast("Article exported", "Your article has been exported as JSON")
  }

  const saveArticle = () => {
    // Update the updatedAt timestamp
    const updatedArticle = {
      ...article,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    setArticle(updatedArticle)

    // In a real app, you would save to a database here
    showToast("Article saved", "Your article has been saved successfully")
  }

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toastVisible && (
        <div className="fixed right-4 top-4 z-50 w-72 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">{toastMessage.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{toastMessage.message}</p>
            </div>
            <button
              onClick={() => setToastVisible(false)}
              className="ml-4 inline-flex h-5 w-5 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Article</h2>
        <div className="flex gap-2">
          <button
            onClick={exportToJson}
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-900 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-900"
          >
            <Download className="mr-2 h-4 w-4" /> Export JSON
          </button>
          <button
            onClick={saveArticle}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-gray-900"
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={article.title}
            onChange={handleChange}
            placeholder="Enter article title"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="grid gap-3">
          <label htmlFor="image" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Image URL (optional)
          </label>
          <input
            id="image"
            name="image"
            value={article.image || ""}
            onChange={handleChange}
            placeholder="Enter image URL"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500"
          />
          {article.image && (
            <div className="mt-2">
              <img
                src={article.image || "/placeholder.svg"}
                alt="Article preview"
                className="max-h-40 rounded-md object-cover"
              />
            </div>
          )}
        </div>

        <div className="grid gap-3">
          <label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={article.content}
            onChange={handleChange}
            placeholder="Write your article content here..."
            className="min-h-[200px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="grid gap-3">
          <label htmlFor="tags" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag and press Enter"
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-900 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-900"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {tag}
                <button
                  className="ml-1 rounded-full p-0.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag}</span>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="p-4">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Preview JSON Output</h3>
            <pre className="max-h-60 overflow-auto rounded-md bg-gray-100 p-4 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              {JSON.stringify(article, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

