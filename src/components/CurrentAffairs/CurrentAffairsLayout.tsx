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
      <section className="max-w-7xl mx-auto px-2">
        {/* Main content - full width */}
        <div className="w-full">
          <main className="w-full overflow-hidden">
            <article className="bg-[var(--bg-main)] dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-900/30 p-2">
              {memoizedChildren}
            </article>
          </main>
        </div>
      </section>
    </div>
  );
};

export default CurrentAffairsLayout;