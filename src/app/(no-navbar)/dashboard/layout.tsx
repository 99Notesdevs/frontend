"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { useRouter } from "next/navigation";
import { FaPlus, FaEdit } from "react-icons/fa";

const inter = Inter({
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f8f9ff]">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-slate-200">
            <div className="p-4">
              <h1
                className={`${plusJakarta.className} text-[2rem] font-bold tracking-tight text-slate-900 mb-8`}
              >
                Admin Dashboard
              </h1>
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => router.push("/dashboard/add")}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaPlus className="w-5 h-5" />
                Add Article
              </button>
              <button
                onClick={() => router.push("/dashboard/current-affair")}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaPlus className="w-5 h-5" />
                Add Current Affair
              </button>
              <button
                onClick={() => router.push("/dashboard/update-about")}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaEdit className="w-5 h-5" />
                Edit About99
              </button>
              <button
                onClick={() => router.push("/dashboard/edit")}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaEdit className="w-5 h-5" />
                Edit Articles
              </button>
              <button
                onClick={() => router.push("/dashboard/editcurrent")}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaEdit className="w-5 h-5" />
                Edit Current Affairs
              </button>
              <button
                onClick={() => router.push("/dashboard/forms")}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaEdit className="w-5 h-5" />
                Manage Forms
              </button>
              <button
                onClick={() => router.push("/dashboard/blogs")}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaPlus className="w-5 h-5" />
                Add Blogs
              </button>
              <button
                onClick={() => router.push("/dashboard/editblogs")}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaEdit className="w-5 h-5" />
                Manage Blogs
              </button>
              <button
                onClick={() => router.push("/dashboard/sort")}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaEdit className="w-5 h-5" />
                Sort
              </button>
              <button
                onClick={() => router.push("/dashboard/sortCurrent")}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaEdit className="w-5 h-5" />
                Sort Current Affairs
              </button>
              <button
                onClick={() => router.push("/dashboard/subscription")}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaEdit className="w-5 h-5" />
                Manage Subscriptions
              </button>
            </nav>
          </div>
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
