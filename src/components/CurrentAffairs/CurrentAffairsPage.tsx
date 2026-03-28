"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/config/api/route";
import ContentWrapper from "@/components/Blogs/ContentWrapper";

// Define interfaces to match the database schema
interface Article {
  id: number;
  title: string;
  content?: string;
  slug: string;
  link: string;
  imageUrl?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: string;
  parentSlug?: string;
  parentId?: number;
}

interface CurrentAffair {
  id: number;
  title: string;
  content: string;
  slug: string;
  type: string;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

interface CurrentAffairsPageProps {
  category: string;
  initialCurrentAffair: CurrentAffair | null;
  initialArticles: Article[];
  initialError: string | null;
}

const CurrentAffairsPage: React.FC<CurrentAffairsPageProps> = ({
  category,
  initialCurrentAffair,
  initialArticles,
  initialError,
}) => {
  const TOPIC_PARENT_ID = 718;
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [currentAffair, setCurrentAffair] = useState<CurrentAffair | null>(initialCurrentAffair);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [error, setError] = useState<string | null>(initialError);
  const [allSections, setAllSections] = useState<CurrentAffair[]>([]);
  const [topicPages, setTopicPages] = useState<Article[]>([]);

  // Fetch all sections for tab navigation
  useEffect(() => {
    const fetchAllSections = async () => {
      try {
        const response = await api.get('/currentAffair') as {
          success: boolean;
          data: CurrentAffair[] | null;
        };
        
        if (response.success && response.data) {
          setAllSections(response.data);
        }
      } catch (error) {
        console.error('Error fetching all sections:', error);
      }
    };

    fetchAllSections();
  }, []);

  // Fetch sidebar pages under a fixed parent category.
  useEffect(() => {
    const fetchTopicPages = async () => {
      try {
        const response = await api.get(`/page/parent/${TOPIC_PARENT_ID}`) as {
          success: boolean;
          data: Article[] | null;
        };

        if (response.success && response.data) {
          setTopicPages(response.data);
        }
      } catch (err) {
        console.error('Error fetching topic pages:', err);
      }
    };

    fetchTopicPages();
  }, [TOPIC_PARENT_ID]);

  // Handle tab switching
  const handleTabSwitch = async (tabType: 'daily' | 'monthly' | 'yearly') => {
    setActiveTab(tabType);
    
    // Find the section for this tab type
    const section = allSections.find(section => section.type === tabType);
    if (section) {
      try {
        // Fetch articles for this section
        const articlesResponse = await api.get(`/currentArticle`) as {
          success: boolean;
          data: Article[] | null;
        };

        if (articlesResponse.success && articlesResponse.data) {
          const allArticles = articlesResponse.data;
          const sectionArticles = allArticles.filter((article: Article) => {
            return article.parentSlug === section.slug;
          });

          setCurrentAffair(section);
          setArticles(sectionArticles);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching section articles:', error);
        setError("Failed to load section data.");
      }
    }
  };

  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Link href="/current-affairs" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header - Full Width */}
      <div className="bg-gray-900 dark:bg-slate-900 py-8 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-green-600/20"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
              {currentAffair?.metadata ? 
                (() => {
                  try {
                    const parsed = JSON.parse(currentAffair.metadata);
                    return parsed.metaTitle || 'Current Affairs';
                  } catch (e) {
                    return 'Current Affairs';
                  }
                })()
                : 'Current Affairs'}
              <span className="italic text-yellow-400 block">worth remembering.</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mb-8">
              Every story mapped to the GS paper it'll appear in. Read it once. Know exactly which exam it'll hit.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleTabSwitch('daily')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === 'daily'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              📰 Daily
            </button>
            <button
              onClick={() => handleTabSwitch('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              📅 Monthly
            </button>
            <button
              onClick={() => handleTabSwitch('yearly')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              📊 Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Today's Focus Strip */}
            {sortedArticles.length > 0 && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 mb-6 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs font-black uppercase tracking-wider text-white/55 mb-1">
                    Today's Focus
                  </div>
                  <div className="font-serif text-lg font-bold text-white">
                    {sortedArticles[0]?.title}
                  </div>
                  <div className="text-sm text-white/55 mt-1">
                    Current Affairs · {currentAffair?.type || 'General'} · 5 min read
                  </div>
                </div>
                <Link
                  href={`/current-affairs/${category}/${sortedArticles[0]?.slug
                    .split("/")
                    .pop()}`}
                  className="bg-white/20 text-white border border-white/25 px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/30 transition-colors whitespace-nowrap"
                >
                  Read Now →
                </Link>
              </div>
            )}

            {/* Articles Grid */}
            <div className="space-y-6">
              {sortedArticles.length > 0 ? (
                sortedArticles.map((article, index) => (
                  <div
                    key={article.id}
                    className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-gray-300 dark:hover:border-slate-600"
                  >
                    <div className="flex">
                      {/* Left Accent Bar */}
                      <div className="w-1 bg-blue-500 flex-shrink-0"></div>
                      
                      {/* Article Body */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs font-black uppercase tracking-wider px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {currentAffair?.type || 'GS'}
                          </span>
                          <span className="text-xs font-black uppercase tracking-wider px-2 py-1 bg-green-100 text-green-800 rounded">
                            New
                          </span>
                        </div>
                        
                        <Link
                          href={`/current-affairs/${category}/${article.slug
                            .split("/")
                            .pop()}`}
                          className="block group"
                        >
                          <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {article.title}
                          </h3>
                        </Link>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {article.metadata ? 
                            (() => {
                              try {
                                const parsed = JSON.parse(article.metadata);
                                return parsed.description || 'In-depth analysis of important current events and their relevance for UPSC Civil Services Examination.';
                              } catch (e) {
                                return 'In-depth analysis of important current events and their relevance for UPSC Civil Services Examination.';
                              }
                            })()
                            : 'In-depth analysis of important current events and their relevance for UPSC Civil Services Examination.'}
                        </p>
                        
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                              {currentAffair?.title || 'Current Affairs'} · GS Paper
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ⏱ 5 min read
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Link
                              href={`/current-affairs/${category}/${article.slug
                                .split("/")
                                .pop()}`}
                              className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1 rounded text-xs font-bold hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors"
                            >
                              Read →
                            </Link>
                            <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-1 rounded text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-700 dark:hover:text-green-300 hover:border-green-500 transition-colors">
                              Mark Read
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-12 text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Articles Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300">Check back later for new content.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="space-y-6">
              {/* Daily Quiz CTA */}
              <div className="bg-gray-900 dark:bg-slate-900 rounded-lg p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-transparent"></div>
                <div className="relative z-10">
                  <div className="text-xs font-black uppercase tracking-wider text-yellow-400 mb-2">
                    🎯 Daily Quiz
                  </div>
                  <div className="font-serif text-lg font-bold text-white mb-2">
                    Test today's current affairs in 5 questions.
                  </div>
                  <div className="text-sm text-gray-300 mb-4">
                    Toppers solve this before 10 AM. You still have time.
                  </div>
                  <Link
                    href="/"
                    className="bg-blue-600 text-white w-full px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors block text-center"
                  >
                    Start Today's Quiz →
                  </Link>
                </div>
              </div>

              {/* Browse by Topic */}
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 border-b border-gray-200 dark:border-slate-600 flex items-center gap-2">
                  <span className="text-lg">🗂</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    Browse by Topic
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  {topicPages.length > 0 ? (
                    topicPages.map((page, index) => (
                      <Link
                        key={page.id}
                        href={`/${page.slug}`}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded transition-colors"
                      >
                        <span className="text-lg">📄</span>
                        <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                          {page.title}
                        </span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {index + 1}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 p-2">
                      No topic pages found.
                    </div>
                  )}
                </div>
              </div>

              {/* GS Paper Mapping */}
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 border-b border-gray-200 dark:border-slate-600 flex items-center gap-2">
                  <span className="text-lg">📌</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    GS Paper Mapping
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Every article on this page is tagged to the exact GS paper it's most likely to appear in. Read smart, not everything.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-black uppercase px-2 py-1 bg-orange-100 text-orange-800 rounded">GS Paper 1</span>
                    <span className="text-xs font-black uppercase px-2 py-1 bg-blue-100 text-blue-800 rounded">GS Paper 2</span>
                    <span className="text-xs font-black uppercase px-2 py-1 bg-yellow-100 text-yellow-800 rounded">GS Paper 3</span>
                    <span className="text-xs font-black uppercase px-2 py-1 bg-purple-100 text-purple-800 rounded">GS Paper 4</span>
                    <span className="text-xs font-black uppercase px-2 py-1 bg-green-100 text-green-800 rounded">Environment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {currentAffair?.content ? (
          <div className="mt-12">
            <ContentWrapper input={currentAffair.content}/>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CurrentAffairsPage;
