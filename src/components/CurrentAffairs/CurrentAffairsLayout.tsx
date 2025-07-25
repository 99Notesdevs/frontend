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
  title: string;
  path: string;
  icon: { image: any };
}

interface NavSection {
  title: string;
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
  const pathname = usePathname();
  const [navSections, setNavSections] = useState<NavSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    "Daily Current Affairs": true,
    "Monthly Current Affairs": false,
    "Yearly Current Affairs": false,
  });

  // Memoize the toggleSection function to prevent unnecessary re-renders
  const memoizedToggleSection = useCallback((sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  }, []);

  // Memoize the children to prevent unnecessary re-renders
  const memoizedChildren = useMemo(() => children, [children]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        console.log("Fetching current affairs sections...");

        // Fetch directly from the backend API
        // Need to fetch all types (daily, monthly, yearly)
        const dailyResponse = (await api.get(`/currentAffair/type/daily`)) as {
          success: boolean;
          data: CurrentAffairSection[] | null;
        };

        const monthlyResponse = (await api.get(
          `/currentAffair/type/monthly`
        )) as { success: boolean; data: CurrentAffairSection[] | null };

        const yearlyResponse = (await api.get(
          `/currentAffair/type/yearly`
        )) as { success: boolean; data: CurrentAffairSection[] | null };

        // Combine all the responses
        const allSections = [];

        if (dailyResponse.success) {
          const dailyData = dailyResponse.data;
          if (dailyResponse.success && dailyData) {
            console.log("Daily sections:", dailyData.length);
            allSections.push(...dailyData);
          }
        } else {
          console.error("Daily response not OK");
        }

        if (monthlyResponse.success) {
          const monthlyData = monthlyResponse.data;
          if (monthlyResponse.success && monthlyData) {
            console.log("Monthly sections:", monthlyData.length);
            allSections.push(...monthlyData);
          }
        } else {
          console.error("Monthly response not OK");
        }

        if (yearlyResponse.success) {
          const yearlyData = yearlyResponse.data;
          console.log("Yearly response status:");
          if (yearlyResponse.success && yearlyData) {
            console.log("Yearly sections:", yearlyData.length);
            allSections.push(...yearlyData);
          }
        } else {
          console.error("Yearly response not OK");
        }

        // Log the data for debugging
        console.log("Total fetched sections:", allSections.length);

        // Group sections by type
        const groupedSections: Record<string, CurrentAffairSection[]> = {};

        allSections.forEach((section: CurrentAffairSection) => {
          if (!groupedSections[section.type]) {
            groupedSections[section.type] = [];
          }
          groupedSections[section.type].push(section);
        });

        // Create navigation sections
        const navigationSections: NavSection[] = [
          {
            title: "Daily Current Affairs",
            items: (groupedSections["daily"] || [])
              .filter((item: CurrentAffairSection) => !item.link)
              .map((section) => {
                // Extract the last part of the slug for the path
                const pathSlug = section.slug.split("/").pop() || section.slug;
                return {
                  title: section.title,
                  path: `/current-affairs/${pathSlug}`,
                  icon: { image: null },
                };
              }),
          },
          {
            title: "Monthly Current Affairs",
            items: (groupedSections["monthly"] || [])
              .filter((item: CurrentAffairSection) => !item.link)
              .map((section) => {
                // Extract the last part of the slug for the path
                const pathSlug = section.slug.split("/").pop() || section.slug;
                return {
                  title: section.title,
                  path: `/current-affairs/${pathSlug}`,
                  icon: { image: null },
                };
              }),
          },
          {
            title: "Yearly Current Affairs",
            items: (groupedSections["yearly"] || [])
              .filter((item: CurrentAffairSection) => !item.link)
              .map((section) => {
                // Extract the last part of the slug for the path
                const pathSlug = section.slug.split("/").pop() || section.slug;
                return {
                  title: section.title,
                  path: `/current-affairs/${pathSlug}`,
                  icon: { image: null },
                };
              }),
          },
        ];

        // Filter out empty sections
        const filteredSections = navigationSections.filter(
          (section) => section.items.length > 0
        );

        setNavSections(filteredSections);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sections:", error);
        // Don't use fallback, just set empty sections
        setNavSections([]);
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-slate-900 pt-8 transition-colors duration-200">
        <section className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6">
          {/* On mobile */}
          <div className="flex flex-col md:hidden">
            <main className="flex-1">
              <article className="bg-[var(--bg-main)] dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-900/30">
                {memoizedChildren}
              </article>
            </main>
          </div>

          {/* Sidebar - now at the same level as main content */}
          <aside className="w-full md:w-[340px] lg:w-[400px] flex-shrink-0">
            <nav className="bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-900/30 md:sticky md:top-24">
              {/* Navigation section */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500" />
                </div>
              ) : (
                <section className="p-5 space-y-5">
                  {navSections.map((section, sectionIndex) => (
                    <article
                      key={sectionIndex}
                      className="border-b border-[var(--text-disabled)] pb-3 last:border-b-0"
                    >
                      <button
                        onClick={() => memoizedToggleSection(section.title)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-base font-semibold 
                        ${
                          expandedSections[section.title]
                            ? "bg-[var(--nav-primary)] text-white"
                            : "text-[var(--surface-darker)] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                        }
                        rounded-md transition-colors duration-200`}
                      >
                        <span className="flex items-center gap-1">
                          {section.title}
                        </span>
                        <svg
                          className={`h-4 w-4 transform transition-transform duration-300 text-gray-500 ${
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
                        {section.items.map((item, itemIndex) => (
                          <Link
                            key={itemIndex}
                            href={item.path}
                            className="group flex items-center px-5 py-2 text-[1.07rem] font-medium rounded-md text-[var(--text-strong)] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-[var(--surface-darker)] dark:hover:text-white transition-all duration-200"
                          >
                            <span className="mr-1">•</span>
                            <span className="truncate">{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    </article>
                  ))}
                </section>
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

          {/* On tablet/desktop: Display main content second */}
          <div className="hidden md:flex flex-1">
            <main className="w-full">
              <article className="bg-[var(--bg-main)] dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-900/30">
                {memoizedChildren}
              </article>
            </main>
          </div>
        </section>
      </div>
    </>
  );
};

export default CurrentAffairsLayout;
