"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FaPlus, FaEdit } from "react-icons/fa";
import { isAuth, AuthResponse } from "@/lib/isAuth";
import { useState, useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Navigation items organized by role and category
const navigationItems = {
  admin: [
    {
      category: "Employee Management",
      items: [
        { icon: FaEdit, text: "Manage Employees", path: "/dashboard/manageemployees" },
        { icon: FaPlus, text: "Add Admin", path: "/dashboard/addadmin" }
      ]
    },
    {
      category: "User Management",
      items: [
        { icon: FaEdit, text: "Manage Users", path: "/dashboard/manageusers" }
      ]
    },
    {
      category: "Content Management",
      items: [
        { icon: FaPlus, text: "Add Article", path: "/dashboard/add" },
        { icon: FaEdit, text: "Edit Articles", path: "/dashboard/edit" },
        { icon: FaPlus, text: "Add Current Affair", path: "/dashboard/current-affair" },
        { icon: FaEdit, text: "Edit Current Affairs", path: "/dashboard/editcurrent" },
        { icon: FaPlus, text: "Add Blogs", path: "/dashboard/blogs" },
        { icon: FaEdit, text: "Manage Blogs", path: "/dashboard/editblogs" }
      ]
    },
    {
      category: "Site Management",
      items: [
        { icon: FaEdit, text: "Edit About99", path: "/dashboard/update-about" },
        { icon: FaEdit, text: "Edit Home", path: "/dashboard/update-home" },
        { icon: FaEdit, text: "Manage Forms", path: "/dashboard/forms" }
      ]
    },
    {
      category: "Content Organization",
      items: [
        { icon: FaEdit, text: "Sort Articles", path: "/dashboard/sort" },
        { icon: FaEdit, text: "Sort Current Affairs", path: "/dashboard/sortCurrent" }
      ]
    },
    {
      category: "Subscription",
      items: [
        { icon: FaEdit, text: "Manage Subscriptions", path: "/dashboard/subscription" }
      ]
    }
  ],
  author: [
    {
      category: "Content Creation",
      items: [
        { icon: FaPlus, text: "Add Article", path: "/dashboard/add" },
        { icon: FaPlus, text: "Add Current Affair", path: "/dashboard/current-affair" },
        { icon: FaPlus, text: "Add Blogs", path: "/dashboard/blogs" }
      ]
    }
  ],
  editor: [
    {
      category: "Content Management",
      items: [
        { icon: FaEdit, text: "Edit Articles", path: "/dashboard/edit" },
        { icon: FaEdit, text: "Manage Blogs", path: "/dashboard/editblogs" },
        { icon: FaEdit, text: "Edit Current Affairs", path: "/dashboard/editcurrent" }
      ]
    }
  ]
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthResponse | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuth();
      setAuthState(auth);
    };

    checkAuth();
  }, []);

  if (!authState) {
    return <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[var(--admin-bg-secondary)] via-[var(--admin-bg-primary)] to-[var(--admin-bg-dark]">
      <span className="text-[var(--admin-border)] text-lg font-medium animate-pulse">Loading dashboard...</span>
    </div>;
  }

  if (!authState.isAuthenticated) {
    router.push("/operator");
    return null;
  }

  const isAdmin = authState.role === "admin";
  const isEditor = authState.role === "editor";
  const isAuthor = authState.role === "author";

  // Get navigation items based on role
  const getNavigationItems = () => {
    if (isAdmin) {
      return [...navigationItems.admin];
    }
    if (isEditor) {
      return navigationItems.editor;
    }
    if (isAuthor) {
      return navigationItems.author;
    }
    return [];
  };

  const navigation = getNavigationItems();

  return (
    <div className={`flex min-h-screen bg-gradient-to-br from-[var(--admin-bg-lightest)] via-[var(--admin-bg-light)] to-[var(--bg-elevated)] ${inter.className}`}>
      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-60 bg-[var(--admin-bg-secondary)] border-r border-[var(--admin-bg-dark)] flex flex-col transition-transform transform lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ minWidth: 240 }}
      >
        <div className="flex items-center h-16 px-6 border-b border-[var(--admin-bg-dark)]">
          {/* Make Dashboard title clickable to go to /dashboard */}
          <button
            onClick={() => { router.push("/dashboard"); setSidebarOpen(false); }}
            className="text-xl font-bold tracking-tight text-white hover:text-indigo-400 transition-colors focus:outline-none"
            style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
            aria-label="Go to Dashboard"
          >
            Dashboard
          </button>
          <button
            className="ml-auto text-[var(--admin-scroll-thumb-hover)] hover:text-white focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {navigation.map((section, sectionIdx) => (
            <div key={section.category} className="mb-4">
              <h3 className="px-4 mb-2 text-xs font-semibold text-white uppercase tracking-wider">
                {section.category}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => { router.push(item.path); setSidebarOpen(false); }}
                      className={`group relative flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-150 text-left text-base font-medium
                        ${isActive 
                          ? "bg-white/10 text-white border-l-4 border-white" 
                          : "text-[var(--admin-scroll-thumb)] hover:bg-[var(--admin-bg-primary)]/50 hover:text-white"}
                      `}
                      title={item.text}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-[var(--admin-scroll-thumb-hover)] group-hover:text-white'}`} />
                      <span className="truncate">{item.text}</span>
                    </button>
                  );
                })}
              </div>
              {sectionIdx < navigation.length - 1 && (
                <div className="my-4 border-t border-[var(--admin-bg-primary)]/50" />
              )}
            </div>
          ))}
        </nav>
      </aside>
      {/* Sidebar toggle button for mobile */}
      {!sidebarOpen && (
        <button
          className="fixed z-50 top-4 left-4 p-2 rounded-md bg-[var(--admin-bg-secondary)] text-[var(--admin-scroll-thumb)] hover:text-white hover:bg-[var(--admin-bg-primary)] focus:outline-none shadow-lg lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      )}
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
