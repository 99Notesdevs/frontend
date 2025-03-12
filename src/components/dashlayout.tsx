"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Edit, Settings, Menu, X, Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for dark mode preference
    if (
      localStorage.getItem("darkMode") === "true" ||
      (!("darkMode" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("darkMode", "false")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("darkMode", "true")
    }
  }

  const routes = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Articles",
      href: "/articles",
      icon: FileText,
    },
    {
      title: "Editor",
      href: "/editor",
      icon: Edit,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:flex">
        <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            <FileText className="h-6 w-6" />
            <span>Article Dashboard</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto p-4">
          <ul className="space-y-2">
            {routes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === route.href
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">© 2025 Article Dashboard</div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white dark:bg-gray-950">
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
              <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                <FileText className="h-6 w-6" />
                <span>Article Dashboard</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {routes.map((route) => (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        pathname === route.href
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <route.icon className="h-5 w-5" />
                      <span>{route.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950 md:px-6">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="rounded-md border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
              Help
            </button>
            <button className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
              Account
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

