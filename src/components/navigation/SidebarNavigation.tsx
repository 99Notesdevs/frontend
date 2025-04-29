"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { env } from '@/config/env';

interface PageItem {
  id: string;
  title: string;
  slug: string;
  link?: string;
  level: number;
  parentId: string | null;
  children?: PageItem[];
}

interface SidebarNavigationProps {
  currentPageId?: string;
  basePath?: string;
  hideParent?: boolean;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  currentPageId,
  basePath = '',
  hideParent = false
}) => {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const normalizedBasePath = basePath.startsWith('/') ? basePath.substring(1) : basePath;
        const response = await fetch(`${env.API}/page/navigation?basePath=${normalizedBasePath}`);
        if (!response.ok) {
          throw new Error('Failed to fetch pages');
        }
        const { data } = await response.json();
        
        if (data.length > 0) {
          const pagesWithChildren = buildPageHierarchy(data);
          setPages(pagesWithChildren);
        } else {
          setPages([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pages:', error);
        setError('Failed to load navigation');
        setLoading(false);
        setPages([]);
      }
    };

    fetchPages();
  }, [basePath]);

  const buildPageHierarchy = (flatPages: PageItem[]): PageItem[] => {
    const pageMap = new Map<string, PageItem>();
    const rootPages: PageItem[] = [];

    // First pass: Create a map of all pages
    flatPages.forEach(page => {
      pageMap.set(page.id, { ...page, children: [] });
    });

    // Second pass: Build the hierarchy
    flatPages.forEach(page => {
      const pageWithChildren = pageMap.get(page.id)!;
      if (page.parentId && pageMap.has(page.parentId)) {
        const parent = pageMap.get(page.parentId)!;
        parent.children = parent.children || [];
        parent.children.push(pageWithChildren);
      } else {
        rootPages.push(pageWithChildren);
      }
    });
  return rootPages;
  };

  const renderNavItem = (page: PageItem, level: number = 0) => {
    const isCurrentPage = currentPageId === page.id;
    const hasChildren = page.children && page.children.length > 0;

    return (
      <div key={page.id} className="w-full">
        <Link 
          href={page.link ? page.link : `/${page.slug}`}
          className={`
            group flex items-center py-2 px-4 text-[15px] rounded-md transition-all duration-200
            ${isCurrentPage 
              ? 'text-blue-600 bg-blue-50/70 font-medium' 
              : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }
            ${level === 0 ? 'font-medium text-slate-800' : ''}
            ${level === 1 ? 'font-normal' : ''}
            ${level >= 2 ? 'ml-6 font-normal' : ''}
          `}
        >
          {level >= 2 && (
            <span className="mr-2 text-slate-400 text-xs">•</span>
          )}
          {page.title}
        </Link>
        {hasChildren && page.children && (
          <div className="mt-0.5 mb-1">
            {page.children.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-2 p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-5 bg-slate-100 rounded-md w-full"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <nav className="w-full max-h-[80vh] overflow-y-auto custom-scrollbar space-y-3">
      <div className="px-4">
        {pages.map(page => renderNavItem(page))}
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </nav>
  );
};

export default SidebarNavigation;