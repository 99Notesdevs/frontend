"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { useRouter } from "next/navigation";
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
  const [authState, setAuthState] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuth();
      setAuthState(auth);
    };

    checkAuth();
  }, []);

  if (!authState) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
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
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200">
        <div className="p-4">
          <h1
            className={`${plusJakarta.className} text-[2rem] font-bold tracking-tight text-slate-900 mb-8`}
          >
            {isAdmin ? "Admin Dashboard" : "User Dashboard"}
          </h1>
        </div>
        <nav className="space-y-1">
          {navigation.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.text}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
