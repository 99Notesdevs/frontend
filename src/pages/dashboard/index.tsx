import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: "Article Dashboard",
  description: "Manage and create your articles",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-15">
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl xl:text-6xl">
              Admin Dashboard
            </h1>
            <p className="max-w-[700px] text-slate-600 md:text-lg">
              Create, manage, and publish your articles with ease.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full py-6">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Articles Card */}
            <div className="group relative overflow-hidden rounded-xl bg-white p-1 shadow-lg transition-all hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <div className="relative p-6">
                <h3 className="text-xl font-semibold text-gray-800">Articles</h3>
                <p className="mt-2 text-sm text-gray-600">View and manage your articles</p>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-indigo-600">12</p>
                  <p className="text-sm text-gray-500">Total articles</p>
                </div>
              </div>
              <div className="relative border-t border-gray-100 p-4">
                <Link 
                  href="/dashboard/articles" 
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Create New Card */}
            <div className="group relative overflow-hidden rounded-xl bg-white p-1 shadow-lg transition-all hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <div className="relative p-6">
                <h3 className="text-xl font-semibold text-gray-800">Create New</h3>
                <p className="mt-2 text-sm text-gray-600">Write a new article</p>
                <div className="mt-4">
                  <p className="text-gray-600">Start writing your next article</p>
                </div>
              </div>
              <div className="relative border-t border-gray-100 p-4">
                <Link 
                  href="/dashboard/editor" 
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  New Article <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/*Update subsection card*/}
            <div className="group relative overflow-hidden rounded-xl bg-white p-1 shadow-lg transition-all hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-teal-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <div className="relative p-6">
                <h3 className="text-xl font-semibold text-gray-800">Update Subsections</h3>
                <p className="mt-2 text-sm text-gray-600">Update the relations among articles</p>
                <div className="mt-4">
                  <p className="text-gray-600">Simply select and update.</p>
                </div>
              </div>
              <div className="relative border-t border-gray-100 p-4">
                <Link 
                  href="/dashboard/updateSubsections" 
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Update Subsections <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Settings Card */}
            <div className="group relative overflow-hidden rounded-xl bg-white p-1 shadow-lg transition-all hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-teal-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <div className="relative p-6">
                <h3 className="text-xl font-semibold text-gray-800">Settings</h3>
                <p className="mt-2 text-sm text-gray-600">Configure your dashboard</p>
                <div className="mt-4">
                  <p className="text-gray-600">Customize your experience</p>
                </div>
              </div>
              <div className="relative border-t border-gray-100 p-4">
                <Link 
                  href="/dashboard/settings" 
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
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
