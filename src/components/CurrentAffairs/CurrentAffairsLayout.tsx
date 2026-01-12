"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ContactForm from "../common/ContactForm/ContactForm";
import SocialMedia from "../navigation/socialmedia";
import { api } from "@/config/api/route";
// import Ads from "../navigation/Ads";

interface CurrentAffairSection {
  id: number;
  title: string;
  content: string;
  link: string;
  type: string; // daily, monthly, yearly
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface NavItem {
  id: string;
  title: string;
  path: string;
  type: string;
  icon: { image: any };
}

interface NavSection {
  title: string;
  type: string;
  items: NavItem[];
}

interface CurrentAffairsLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
}

const CurrentAffairsLayout: React.FC<CurrentAffairsLayoutProps> = ({
  children,
  activeSection = "",
}) => {
  const [navSections, setNavSections] = useState<NavSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  // Memoize the toggleSection function to prevent unnecessary re-renders
  const memoizedToggleSection = useCallback((sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  }, []);

  // Memoize the children to prevent unnecessary re-renders
  const memoizedChildren = useMemo(() => children, [children]);

  // Memoized function to process and group current affairs data
  const processCurrentAffairs = useCallback((data: CurrentAffairSection[]) => {
    if (!data || !Array.isArray(data)) return [];

    // Group sections by type
    const groupedSections = data.reduce<Record<string, CurrentAffairSection[]>>((acc, section) => {
      if (!section.type) return acc;
      if (!acc[section.type]) {
        acc[section.type] = [];
      }
      acc[section.type].push(section);
      return acc;
    }, {});

    // Create navigation sections
    const typeConfigs = [
      { type: 'daily', title: 'Daily Current Affairs' },
      { type: 'monthly', title: 'Monthly Current Affairs' },
      { type: 'yearly', title: 'Yearly Current Affairs' }
    ];

    return typeConfigs
      .map(({ type, title }) => ({
        title,
        type,
        items: (groupedSections[type] || [])
          .filter((item: CurrentAffairSection) => !item.link && item.slug)
          .map((section) => {
            const pathSlug = section.slug.split('/').pop() || section.slug;
            return {
              id: section.id.toString(),
              title: section.title,
              path: `/current-affairs/${pathSlug}`,
              type: section.type,
              icon: { image: null },
            };
          })
      }))
      .filter(section => section.items.length > 0);
  }, []);

  // Handle item click
// Update the handleItemClick function
const handleItemClick = useCallback((itemId: string, sectionTitle: string) => {
  setActiveItemId(itemId);
  
  // Close all sections first
  const updatedSections: Record<string, boolean> = {};
  navSections.forEach(section => {
    updatedSections[section.title] = section.title === sectionTitle;
  });
  
  // Then expand the clicked section
  updatedSections[sectionTitle] = true;
  
  setExpandedSections(updatedSections);
}, [navSections]);

  // Fetch all current affairs in a single request
  useEffect(() => {
    const fetchAllCurrentAffairs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/currentAffair') as {
          success: boolean;
          data: CurrentAffairSection[] | null;
        };
        
        if (response.success && response.data) {
          const processedSections = processCurrentAffairs(response.data);
          setNavSections(processedSections);
          
         
        }
      } catch (error) {
        console.error('Error fetching current affairs:', error);
        setNavSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCurrentAffairs();
  }, [processCurrentAffairs]);

  const pathname = usePathname();
  // Only show sidebar on /current-affairs/[category] page
  const isCategoryPage = /^\/current-affairs\/[^/]+$/.test(pathname);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-8 transition-colors duration-200">
      <section className="max-w-7xl mx-auto px-2 flex flex-col md:flex-row gap-6">
        {/* On mobile */}
        <div className="flex flex-col md:hidden">
          <main className="flex-1">
            <article className="bg-[var(--bg-main)] dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-900/30">
              {memoizedChildren}
            </article>
          </main>
        </div>

        {/* Sidebar - Only shown on /current-affairs/[category] */}
        {isCategoryPage && (
          <aside className="hidden md:block w-[340px] lg:w-[450px] flex-shrink-0 -ml-8">
          <nav className="bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-900/30 md:sticky md:top-24">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500" />
              </div>
            ) : (
              <div className="p-5 space-y-5 bg-[var(--bg-main)] dark:bg-slate-800">
                {navSections.map((section) => (
                  <article
                    key={section.type}
                    className="border-b border-[var(--text-disabled)] pb-3 last:border-b-0"
                  >
                    <button
                      onClick={() => memoizedToggleSection(section.title)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-base font-semibold rounded-md transition-colors ${
                        expandedSections[section.title]
                          ? "bg-[var(--nav-primary)] text-white"
                          : "text-[var(--surface-darker)] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {section.title}
                      </span>
                      <svg
                        className={`h-4 w-4 transform transition-transform duration-300 ${
                          expandedSections[section.title] ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    <div
                      className={`mt-2 overflow-hidden transition-all duration-300 ${
                        expandedSections[section.title]
                          ? "max-h-[1000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {section.items.map((item) => {
                        const isActive = activeItemId === item.id;
                        return (
                          <div key={item.id} className="relative">
                            <Link
                              href={item.path}
                              onClick={() => handleItemClick(item.id, section.title)}
                              className={`block py-1.5 px-2 rounded-md transition-colors ${
                                isActive
                                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              <span className="mr-1">•</span>
                              <span className="truncate">{item.title}</span>
                            </Link>
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="border-t border-[var(--border-light)] dark:border-slate-700 bg-[var(--bg-main)] dark:bg-slate-800 p-6 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-orange-500 dark:text-orange-400 flex items-center justify-center gap-2">
                  Contact Us
                </h3>
                <div className="w-64 h-[4px] bg-[var(--nav-primary)] dark:bg-blue-600 mx-auto my-2"></div>
                <ContactForm />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-orange-500 flex items-center justify-center gap-2">
                  Connect with Us
                </h3>
                <div className="w-64 h-[4px] bg-[var(--nav-primary)] dark:bg-blue-600 mx-auto my-2"></div>
                <div className="flex flex-wrap gap-4 justify-center text-gray-800 dark:text-gray-200">
                  <SocialMedia />
                </div>
              </div>
              {/* <Ads imageUrl="/99notes.in" altText="Advertisement" /> */}
            </div>
          </nav>
        </aside>
        )}

        {/* Main content - full width on all pages except [category] */}
        <div className={`${isCategoryPage ? 'hidden md:flex flex-1' : 'w-full'}`}>
          <main className="w-full">
            <article className="">
              {memoizedChildren}
            </article>
          </main>
        </div>
      </section>
    </div>
  );
};

export default CurrentAffairsLayout;