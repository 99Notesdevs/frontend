import type { Metadata } from "next"
import Link from "next/link"
import { Edit, MoreHorizontal, Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Articles",
  description: "View and manage your articles",
}

// Sample article data
const articles = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    content: "Next.js is a React framework for production...",
    tags: ["nextjs", "react", "tutorial"],
    image: "/placeholder.svg?height=200&width=300",
    updatedAt: "2025-03-10",
  },
  {
    id: "2",
    title: "Mastering TypeScript",
    content: "TypeScript adds static typing to JavaScript...",
    tags: ["typescript", "javascript", "programming"],
    image: "/placeholder.svg?height=200&width=300",
    updatedAt: "2025-03-08",
  },
  {
    id: "3",
    title: "Tailwind CSS Tips and Tricks",
    content: "Learn how to use Tailwind CSS effectively...",
    tags: ["css", "tailwind", "frontend"],
    image: "/placeholder.svg?height=200&width=300",
    updatedAt: "2025-03-05",
  },
]

export default function ArticlesPage() {
  return (
    <div className="flex flex-col gap-6 pt-40">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Articles</h1>
        <Link
          href="/dashboard/editor"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-gray-900"
        >
          <Plus className="mr-2 h-4 w-4" /> New Article
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div
            key={article.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="relative">
              <img src={article.image || "/placeholder.svg"} alt={article.title} className="h-40 w-full object-cover" />
              <div className="absolute right-2 top-2">
                <div className="relative inline-block text-left">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-white/80 text-gray-700 backdrop-blur-sm hover:bg-white dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-gray-900"
                    aria-label="Article options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {/* Dropdown menu would go here in a real implementation */}
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{article.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Updated on {article.updatedAt}</p>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{article.content}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <Link
                href={`/dashboard/editor/${article.id}`}
                className="inline-flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-900 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-900"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Article
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

