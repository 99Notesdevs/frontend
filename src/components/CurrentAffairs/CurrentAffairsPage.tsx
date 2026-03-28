"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  type: "daily" | "monthly" | "yearly";
  link?: string;
  order?: number;
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
  const [activeTab, setActiveTab] = useState<"daily" | "monthly" | "yearly">("daily");
  const [currentAffair, setCurrentAffair] = useState<CurrentAffair | null>(initialCurrentAffair);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [error, setError] = useState<string | null>(initialError);
  const [typeSections, setTypeSections] = useState<CurrentAffair[]>([]);
  const [activeParentSlug, setActiveParentSlug] = useState<string | null>(
    initialCurrentAffair?.slug || null
  );
  const [topicPages, setTopicPages] = useState<Article[]>([]);
  const [dailySectionsWithArticles, setDailySectionsWithArticles] = useState<
    Array<{ section: CurrentAffair; articles: Article[] }>
  >([]);

  const extractMetaDescription = (metadata?: string) => {
    if (!metadata) return "In-depth analysis of important current events and their relevance for UPSC Civil Services Examination.";

    try {
      const parsed = JSON.parse(metadata);
      return parsed.metaDescription || parsed.description || "In-depth analysis of important current events and their relevance for UPSC Civil Services Examination.";
    } catch {
      return "In-depth analysis of important current events and their relevance for UPSC Civil Services Examination.";
    }
  };

  const getCategoryFromSlug = (slug?: string) => {
    if (!slug) return category;
    const segments = slug.split("/").filter(Boolean);
    return segments[segments.length - 1] || category;
  };

  const fetchByType = async (type: "daily" | "monthly" | "yearly") => {
    try {
      const response = (await api.get(`/currentAffiar/type/${type}`)) as {
        success: boolean;
        data: CurrentAffair[] | null;
      };

      if (response.success && response.data) return response.data;
    } catch {
      // Fallback for alternate backend route spelling.
    }

    const fallbackResponse = (await api.get(`/currentAffair/type/${type}`)) as {
      success: boolean;
      data: CurrentAffair[] | null;
    };

    if (!fallbackResponse.success || !fallbackResponse.data) return [];
    return fallbackResponse.data;
  };

  const fetchArticlesByParentSlug = async (parentSlug: string, skip = 0, take = 5) => {
    const encodedSlug = encodeURIComponent(parentSlug);
    try {
      const response = (await api.get(
        `/currentArticle/parent/${encodedSlug}?skip=${skip}&take=${take}`
      )) as {
        success: boolean;
        data: Article[] | null;
      };

      if (response.success && response.data) return response.data;
    } catch {
      // Fallback to non-paginated endpoint when query params are not supported.
    }

    const fallbackResponse = (await api.get(`/currentArticle/parent/${encodedSlug}`)) as {
      success: boolean;
      data: Article[] | null;
    };

    if (!fallbackResponse.success || !fallbackResponse.data) {
      throw new Error("Failed to load section articles.");
    }

    return fallbackResponse.data.slice(skip, skip + take);
  };

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

  useEffect(() => {
    if (initialCurrentAffair?.type) {
      setActiveTab(initialCurrentAffair.type);
      return;
    }

    if (category === "monthly" || category === "yearly" || category === "daily") {
      setActiveTab(category);
    }
  }, [category, initialCurrentAffair?.type]);

  useEffect(() => {
    const loadTabSections = async () => {
      try {
        const sections = (await fetchByType(activeTab))
          .filter((section) => !section.link)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setTypeSections(sections);

        if (!sections.length) {
          setCurrentAffair(null);
          setArticles([]);
          setActiveParentSlug(null);
          return;
        }

        const selected =
          sections.find((s) => s.slug === activeParentSlug) ||
          sections[0];

        setCurrentAffair(selected);
        setActiveParentSlug(selected.slug);

        const sectionArticles = await fetchArticlesByParentSlug(selected.slug, 0, 5);
        setArticles(sectionArticles);

        if (activeTab === "daily") {
          const grouped = await Promise.all(
            sections.map(async (section) => {
              const sectionArticlesData = await fetchArticlesByParentSlug(section.slug, 0, 5);
              return { section, articles: sectionArticlesData };
            })
          );
          setDailySectionsWithArticles(grouped);
        } else {
          setDailySectionsWithArticles([]);
        }

        setError(null);
      } catch (err) {
        console.error("Error loading current affairs sections:", err);
        setError("Failed to load section data.");
      }
    };

    loadTabSections();
  }, [activeTab]);

  const handleTabSwitch = (tabType: "daily" | "monthly" | "yearly") => {
    setActiveTab(tabType);
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

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      {/* Page Header - Full Width */}
      <div className="bg-[#18191B] py-8 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-15%,rgba(24,101,242,.3)_0%,transparent_60%),radial-gradient(ellipse_40%_35%_at_90%_110%,rgba(90,107,50,.2)_0%,transparent_55%)]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[11px] font-black tracking-[0.12em] uppercase text-[#f5f1ecb3]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              {formattedDate}
            </span>
          </div>

          <div className="mb-6">
            <h1 className="font-serif text-[clamp(1.5rem,5vw,2.2rem)] font-bold text-[#F5F1EC] leading-tight tracking-[-0.02em] mb-2">
              Current Affairs
              <span className="italic text-[#E8B84B] block">worth remembering.</span>
            </h1>
            <p className="text-[#f5f1ec80] text-sm sm:text-[0.86rem] leading-relaxed max-w-[520px]">
              Every story mapped to the GS paper it'll appear in. Read it once. Know exactly which exam it'll hit.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleTabSwitch('daily')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-[0.05em] font-black transition-all border ${
                activeTab === 'daily'
                  ? 'bg-[#1865F2] border-[#1865F2] text-white'
                  : 'bg-white/10 border-white/15 text-[#f5f1ec99] hover:bg-white/20'
              }`}
            >
              📰 Daily
            </button>
            <button
              onClick={() => handleTabSwitch('monthly')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-[0.05em] font-black transition-all border ${
                activeTab === 'monthly'
                  ? 'bg-[#1865F2] border-[#1865F2] text-white'
                  : 'bg-white/10 border-white/15 text-[#f5f1ec99] hover:bg-white/20'
              }`}
            >
              📅 Monthly
            </button>
            <button
              onClick={() => handleTabSwitch('yearly')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-[0.05em] font-black transition-all border ${
                activeTab === 'yearly'
                  ? 'bg-[#1865F2] border-[#1865F2] text-white'
                  : 'bg-white/10 border-white/15 text-[#f5f1ec99] hover:bg-white/20'
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
                  href={`/current-affairs/${getCategoryFromSlug(activeParentSlug || currentAffair?.slug)}/${sortedArticles[0]?.slug
                    .split("/")
                    .pop()}`}
                  className="bg-white/20 text-white border border-white/25 px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/30 transition-colors whitespace-nowrap"
                >
                  Read Now →
                </Link>
              </div>
            )}

            {activeTab === "daily" && dailySectionsWithArticles.length > 0 ? (
              <div className="space-y-8">
                {dailySectionsWithArticles.map(({ section, articles: sectionArticles }, index) => (
                  <div key={section.id}>
                    <div className={`text-[10px] sm:text-[11px] font-black tracking-[0.2em] uppercase text-gray-500 flex items-center gap-2 mb-4 ${index > 0 ? "mt-8" : ""}`}>
                      {section.title}
                      <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-600 px-2 py-0.5 text-[9px] sm:text-[10px] tracking-[0.06em]">
                        {sectionArticles.length} Articles
                      </span>
                      <span className="flex-1 h-px bg-gray-200"></span>
                    </div>

                    <div className="space-y-4">
                      {sectionArticles.map((article) => (
                        <div
                          key={article.id}
                          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-gray-300 dark:hover:border-slate-600"
                        >
                          <div className="flex">
                            <div className="w-1 bg-blue-500 flex-shrink-0"></div>
                            <div className="flex-1 p-4">
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="text-xs font-black uppercase tracking-wider px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                  {section.type}
                                </span>
                                <span className="text-xs font-black uppercase tracking-wider px-2 py-1 bg-green-100 text-green-800 rounded">
                                  New
                                </span>
                              </div>

                              <Link
                                href={`/current-affairs/${getCategoryFromSlug(section.slug)}/${article.slug
                                  .split("/")
                                  .pop()}`}
                                className="block group"
                              >
                                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {article.title}
                                </h3>
                              </Link>

                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                {extractMetaDescription(article.metadata)}
                              </p>

                              <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                    {section.title} · GS Paper
                                  </span>
                                </div>

                                <Link
                                  href={`/current-affairs/${getCategoryFromSlug(section.slug)}/${article.slug
                                    .split("/")
                                    .pop()}`}
                                  className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1 rounded text-xs font-bold hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors"
                                >
                                  Read →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="pt-1">
                        <Link
                          href={`/current-affairs/${getCategoryFromSlug(section.slug)}`}
                          className="inline-flex items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100"
                        >
                          Show More In {section.title}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
                          {extractMetaDescription(article.metadata)}
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
                              href={`/current-affairs/${getCategoryFromSlug(activeParentSlug || currentAffair?.slug)}/${article.slug
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
            )}
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

      <div className="bg-[#18191B] px-4 py-12 mt-8">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_-5%,rgba(24,101,242,.3)_0%,transparent_62%)]"></div>
          <div className="relative z-10">
            <h2 className="font-serif text-[clamp(1.6rem,5vw,2.3rem)] font-bold text-[#F5F1EC] leading-tight tracking-[-0.02em] mb-3">
              Read. Quiz.
              <span className="italic text-[#E8B84B]"> Remember.</span>
            </h2>
            <p className="text-sm sm:text-[0.85rem] text-[#f5f1ec70] leading-relaxed mb-6">
              Current affairs without practice is just skimming. Quiz yourself on today's news - free, every day, no login needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="bg-[#F5F1EC] text-[#18191B] px-6 py-3 rounded-lg text-sm font-black hover:bg-white transition-colors"
              >
                Take Today's Quiz →
              </Link>
              <Link
                href="/"
                className="border border-white/20 text-[#f5f1ec99] px-6 py-3 rounded-lg text-sm font-bold hover:text-[#f5f1ec] hover:border-white/40 transition-colors"
              >
                Read GS Notes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentAffairsPage;
