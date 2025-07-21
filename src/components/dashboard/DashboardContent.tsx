"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Dynamic imports
import { PageForm as DefaultPageForm } from "./dynamic/PageForm";

// Static imports
import { PageForm as CurrentAffairPageForm } from "./static/current-affair/PageForm";
import BlogsPageForm from "./static/blogs/PageForm";

// Define a more generic type for the PageForm component
type AnyPageForm = React.ComponentType<any>;

export function DashboardContent() {
  const pathname = usePathname();
  const [PageForm, setPageForm] = useState<AnyPageForm>(() => DefaultPageForm);

  useEffect(() => {
    // Determine which components to use based on the current path
    if (pathname?.includes("/current-affair")) {
      setPageForm(() => CurrentAffairPageForm);
    } else if (pathname?.includes("/blogs")) {
      setPageForm(() => BlogsPageForm);
    } else {
      // Default components
      setPageForm(() => DefaultPageForm);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Create New Page Section */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-800 to-slate-700 p-6">
            <h2 className="text-2xl font-bold text-white">Create New Page</h2>
            <p className="mt-1 text-slate-300">
              Create and publish new content using our templates
            </p>
          </div>
          <div className="p-6 bg-slate-50">
            <PageForm />
          </div>
        </section>
      </div>
    </div>
  );
}
