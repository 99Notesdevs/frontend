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
    <div className="min-h-screen bg-gray-200">
      <div className="flex flex-col gap-8 pt-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Articles</h1>
          <Link
            href="/dashboard/editor"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="mr-2 h-4 w-4" /> New Article
          </Link>
        </div>
        <div className=" grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group overflow-hidden rounded-xl border border-gray-200/50 bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] dark:border-gray-800/50 dark:bg-gray-900/90"
            >
              <div className="relative">
                <img src={article.image || "/placeholder.svg"} alt={article.title} className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute right-2 top-2">
                  <div className="relative inline-block text-left">
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 backdrop-blur-sm hover:bg-white transition-all duration-200 dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-800"
                      aria-label="Article options"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">{article.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Updated on {article.updatedAt}</p>
                <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{article.content}</p>
                <div className="mt-4 flex flex-wrap gap-1.5 max-w-full">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-purple-50/80 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-purple-900/40 whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 p-4 dark:border-gray-800/50">
                <Link
                  href={`/dashboard/editor/${article.id}`}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-purple-200 bg-purple-50/80 px-4 py-2.5 text-sm font-medium text-purple-700 transition-all duration-200 hover:bg-purple-100 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-purple-800/50 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30 dark:hover:border-purple-700"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Article
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

