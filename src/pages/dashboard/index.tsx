import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: "Article Dashboard",
  description: "Manage and create your articles",
}

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pt-40">
      <section className="w-full py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Article Dashboard</h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Create, manage, and publish your articles with ease.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full py-6">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Articles Card */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="p-6">
                <h3 className="text-lg font-semibold">Articles</h3>
                <p className="text-sm text-gray-500">View and manage your articles</p>
                <div className="mt-4">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-gray-500">Total articles</p>
                </div>
              </div>
              <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                <Link 
                  href="/dashboard/articles" 
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-gray-900"
                >
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Create New Card */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="p-6">
                <h3 className="text-lg font-semibold">Create New</h3>
                <p className="text-sm text-gray-500">Write a new article</p>
                <div className="mt-4">
                  <p className="text-gray-500">Start writing your next article</p>
                </div>
              </div>
              <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                <Link 
                  href="/dashboard/editor" 
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-gray-900"
                >
                  New Article <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Settings Card */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="p-6">
                <h3 className="text-lg font-semibold">Settings</h3>
                <p className="text-sm text-gray-500">Configure your dashboard</p>
                <div className="mt-4">
                  <p className="text-gray-500">Customize your experience</p>
                </div>
              </div>
              <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                <Link 
                  href="/dashboard/settings" 
                  className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-900 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-900"
                >
                  Settings <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
