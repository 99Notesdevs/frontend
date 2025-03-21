import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, PlusCircle, Plus, Edit } from 'lucide-react'
import ArticleBrowser from "@/components/ArticleBrowser"
import { useRouter } from 'next/navigation';

// Mock articles data - replace with API call
const mockArticles = [
  {
    id: '1',
    title: 'Introduction to Ancient India',
    path: ['UPSC Notes', 'General Studies 1', 'History', 'Ancient India'],
    updatedAt: '2025-03-21',
  },
  {
    id: '2',
    title: 'Medieval Indian History',
    path: ['UPSC Notes', 'General Studies 1', 'History', 'Medieval India'],
    updatedAt: '2025-03-21',
  },
];

export const metadata: Metadata = {
  title: "Article Dashboard",
  description: "Manage and create your articles",
}

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-15">
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl xl:text-6xl">
              Admin Dashboard
            </h1>
            <p className="max-w-[700px] text-slate-600 md:text-lg">
              Create and manage your content with ease.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-6">
        <div className="container px-4 md:px-6">
          {/* Article Browser Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Browse & Edit Articles</h2>
            <div className="grid grid-cols-1 gap-6">
              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/dashboard/add')}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Article
                </button>
                <button
                  onClick={() => router.push('/dashboard/edit')}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Articles
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
