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

// Navigation items organized by role
const navigationItems = {
  admin: [
    // Employee Management
    { 
      icon: FaEdit, 
      text: "Manage Employees", 
      path: "/dashboard/manageemployees" 
    },
    { 
      icon: FaPlus, 
      text: "Add Admin", 
      path: "/dashboard/addadmin" 
    },
    // Content Management
    { 
      icon: FaPlus, 
      text: "Add Article", 
      path: "/dashboard/add" 
    },
    { 
      icon: FaEdit, 
      text: "Edit Articles", 
      path: "/dashboard/edit" 
    },
    { 
      icon: FaPlus, 
      text: "Add Current Affair", 
      path: "/dashboard/current-affair" 
    },
    { 
      icon: FaEdit, 
      text: "Edit Current Affairs", 
      path: "/dashboard/editcurrent" 
    },
    { 
      icon: FaPlus, 
      text: "Add Blogs", 
      path: "/dashboard/blogs" 
    },
    { 
      icon: FaEdit, 
      text: "Manage Blogs", 
      path: "/dashboard/editblogs" 
    },

    // Site Management
    { 
      icon: FaEdit, 
      text: "Edit About99", 
      path: "/dashboard/update-about" 
    },
    { 
      icon: FaEdit, 
      text: "Manage Forms", 
      path: "/dashboard/forms" 
    },

    // Sorting
    { 
      icon: FaEdit, 
      text: "Sort", 
      path: "/dashboard/sort" 
    },
    { 
      icon: FaEdit, 
      text: "Sort Current Affairs", 
      path: "/dashboard/sortCurrent" 
    },

    // Subscription Management
    { 
      icon: FaEdit, 
      text: "Manage Subscriptions", 
      path: "/dashboard/subscription" 
    }
  ],
  author: [
    { 
      icon: FaPlus, 
      text: "Add Article", 
      path: "/dashboard/add" 
    },
    { 
      icon: FaPlus, 
      text: "Add Current Affair", 
      path: "/dashboard/current-affair" 
    },
    { 
      icon: FaPlus, 
      text: "Add Blogs", 
      path: "/dashboard/blogs" 
    },

  ],
  editor: [
    { 
      icon: FaEdit, 
      text: "Edit Articles", 
      path: "/dashboard/edit" 
    },
    {
      icon: FaEdit, 
      text: "Manage Blogs", 
      path: "/dashboard/editblogs" 
    },
    { 
      icon: FaEdit, 
      text: "Edit Current Affairs", 
      path: "/dashboard/editcurrent" 
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
    return <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#181f2a] via-[#232b3a] to-[#1a2130]">
      <span className="text-slate-200 text-lg font-medium animate-pulse">Loading dashboard...</span>
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
    <div className={`flex min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#f8f9ff] ${inter.className}`}>
      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-60 bg-slate-800 border-r border-slate-900 flex flex-col transition-transform transform lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ minWidth: 240 }}
      >
        <div className="flex items-center h-16 px-6 border-b border-slate-900">
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
            className="ml-auto text-slate-400 hover:text-white focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item, idx) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => { router.push(item.path); setSidebarOpen(false); }}
                className={`group flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-150 text-left text-base font-medium
                  ${isActive ? "bg-slate-700 text-white border-l-4 border-indigo-500" : "text-slate-300 hover:bg-slate-700 hover:text-white"}
                `}
                style={{ outline: "none" }}
              >
                <Icon className="w-5 h-5 mr-3 text-slate-400 group-hover:text-white" />
                <span className="truncate">{item.text}</span>
              </button>
            );
          })}
        </nav>
      </aside>
      {/* Sidebar toggle button for mobile */}
      {!sidebarOpen && (
        <button
          className="fixed z-50 top-4 left-4 p-2 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none shadow-lg lg:hidden"
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
