"use client";
import React, { useCallback, useEffect, useState } from "react";
import { BaseTemplateProps } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import QuizWrapper from "@/components/quiz/QuizWrapper";
import { env } from "@/config/env";
import Breadcrumb from "@/components/ui/breadcrumb";
import { BackToTop } from "@/components/ui/reachtotop";
interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explaination: string;
  creatorName: string;
  year?: number;
}
interface GeneralStudiesContent {
  title: string;
  content: string;
  imageUrl?: string;
}

interface QuizProgress {
  score: number;
  total: number;
  answered: number;
  currentQuestion: number;
  isCompleted: boolean;
}

export const GeneralStudiesTemplate: React.FC<BaseTemplateProps> = ({
  page,
}) => {
    console.log(page);
  const { title, content, metadata, imageUrl } = page;
  const mainContent = content || "";
  // @ts-ignore
  const jsonLD = JSON.parse(metadata).schemaData;
  // Default image if none is provided
  const pageImagearray = JSON.parse(imageUrl || "");
  const pageImage = pageImagearray[0];
  const pageImageAlt = pageImagearray[1];

  const parsedMetadata = JSON.parse(metadata);
  const headScripts =
    parsedMetadata?.header
      ?.split("||")
      ?.map((script: string) => script.trim()) || [];
  const bodyScripts =
    parsedMetadata?.body?.split("||")?.map((script: string) => script.trim()) ||
    [];
  const quizChildren = page.children.filter(
    (child: any) =>
      child.templateId !== "custom-link" &&
      Array.isArray(child.categories) &&
      child.categories[0]?.id
  );

  const [selectedQuizChildId, setSelectedQuizChildId] = useState<
    string | number | null
  >(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [quizProgress, setQuizProgress] = useState<QuizProgress>({
    score: 0,
    total: 0,
    answered: 0,
    currentQuestion: 0,
    isCompleted: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedQuizChild: any = quizChildren.find(
    (child: any) => String(child.id) === String(selectedQuizChildId)
  );
  const selectedQuizCategoryId = selectedQuizChild?.categories?.[0]?.id;

  const fetchQuestions = useCallback(async () => {
    const categoryId = selectedQuizCategoryId;
    if (!categoryId) return;

    setIsLoading(true);
    setError(null);
    setQuizProgress({
      score: 0,
      total: 0,
      answered: 0,
      currentQuestion: 0,
      isCompleted: false,
    });

    try {
      const limit =
        page.questionNumber || localStorage.getItem("practiceQuestions") || 10;
      const response = await fetch(
        `${env.API_TEST}/questions/practice?categoryId=${categoryId}&limit=${limit}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const { data } = await response.json();
      setCurrentQuestions(data);
      setQuizProgress({
        score: 0,
        total: Array.isArray(data) ? data.length : 0,
        answered: 0,
        currentQuestion: 0,
        isCompleted: false,
      });
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page?.questionNumber, selectedQuizCategoryId]);

  const handleQuizComplete = () => {};

  useEffect(() => {
    if (!quizChildren.length) {
      setSelectedQuizChildId(null);
      return;
    }

    setSelectedQuizChildId((prevSelected) => {
      if (
        prevSelected !== null &&
        quizChildren.some(
          (child: any) => String(child.id) === String(prevSelected)
        )
      ) {
        return prevSelected;
      }

      return quizChildren[0].id;
    });
  }, [quizChildren]);

  useEffect(() => {
    if (!selectedQuizCategoryId) {
      setCurrentQuestions([]);
      return;
    }

    fetchQuestions();
  }, [fetchQuestions, selectedQuizCategoryId]);

  useEffect(() => {
    // Inject head scripts
    if (headScripts) {
      headScripts.forEach((script: string) => {
        try {
          if (script.startsWith("<script")) {
            // Parse the full <script> tag and extract attributes
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = script.trim();
            const scriptElement = tempDiv.firstChild as HTMLScriptElement;
            if (scriptElement && scriptElement.tagName === "SCRIPT") {
              document.head.appendChild(scriptElement);
            }
          } else {
            // Handle raw JavaScript content
            const scriptElement = document.createElement("script");
            scriptElement.textContent = script; // Use textContent for raw JavaScript
            document.head.appendChild(scriptElement);
          }
        } catch (error) {
          console.error("Error injecting head script:", error, script);
        }
      });
    }

    // Inject body scripts
    if (bodyScripts) {
      bodyScripts.forEach((script: string) => {
        try {
          if (script.startsWith("<script")) {
            // Parse the full <script> tag and extract attributes
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = script.trim();
            const scriptElement = tempDiv.firstChild as HTMLScriptElement;
            if (scriptElement && scriptElement.tagName === "SCRIPT") {
              document.body.appendChild(scriptElement);
            }
          } else {
            // Handle raw JavaScript content
            const scriptElement = document.createElement("script");
            scriptElement.textContent = script; // Use textContent for raw JavaScript
            document.body.appendChild(scriptElement);
          }
        } catch (error) {
          console.error("Error injecting body script:", error, script);
        }
      });
    }
  }, [headScripts, bodyScripts]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToQuizSection = () => {
    const element = document.getElementById("gs-spark-section");
    if (!element) return;

    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const handlePracticeClick = (childId: string | number) => {
    setSelectedQuizChildId(childId);
    scrollToQuizSection();
  };

  // Function to scroll to specific child card
  const scrollToChildCard = (childId: string) => {
    const element = document.getElementById(`child-card-${childId}`);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // Add highlight effect
      element.style.outline = "2px solid #3B82F6";
      element.style.outlineOffset = "4px";
      setTimeout(() => {
        element.style.outline = "none";
      }, 2000);
    }
  };

  // Filter out custom-link templates and paginate
  const filteredChildren = quizChildren;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredChildren.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);

  return (
    <>
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLD }}
        />
      </section>
      <main>
        <div className="min-h-screen bg-gradient-to-b from-[var(--bg-main)] to-white dark:from-slate-900 dark:to-slate-800">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-0 md:px-6 lg:px-8 py-4 sm:py-8">
            <Breadcrumb
              containerClasses="bg-muted/40 px-1 py-2 rounded-md"
              activeClasses="font-semibold"
            />
            
            {/* Hero Section */}
            <div className="py-8 md:py-12">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4 text-gray-900 dark:text-white">
                    The notes your topper<br />never shared with you.<br />
                    <span className="italic text-blue-600 dark:text-blue-400">Until now.</span>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-16px leading-relaxed max-w-lg">
                    12 GS subjects. Curated for UPSC Prelims & Mains.<br />
                    Read the concept, solve questions on it — <strong>right there, side by side.</strong><br />
                    No paywalls. No detours. Just the road to selection.
                  </p>
                </div>
                <div className="lg:max-w-[270px] w-full">
                  <div className="bg-gray-900 text-white rounded-xl p-6 shadow-xl">
                    <span className="text-yellow-400 text-xs font-black uppercase tracking-wider mb-2 block">
                      ★ Only on 99Notes
                    </span>
                    <p className="font-serif text-lg italic leading-relaxed mb-3">
                      <strong>Read a concept. Solve it immediately.</strong> Side by side, on the same screen.
                    </p>
                    <p className="text-gray-400 text-sm font-sans">
                      Every other platform makes you switch tabs to practice. We don't.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Subject Strip */}
            {page.children && page.children.length > 0 && (
              <div className="sticky top-16 z-30 bg-white/97 dark:bg-slate-900/97 border-b border-gray-200 dark:border-slate-700 backdrop-blur-sm">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-0 md:px-6 lg:px-8">
                  <div className="flex gap-1 py-2 overflow-x-auto scrollbar-hide">
                    {page.children.map((child: any, index: number) => {
                      if (child.templateId === "custom-link") {
                        return null;
                      }
                      
                      return (
                        <button
                          key={child.id}
                          onClick={() => scrollToChildCard(child.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200 whitespace-nowrap flex-shrink-0"
                        >
                          <span className="text-xs">
                            {index === 0 && '⚖️'}
                            {index === 1 && '🏛️'}
                            {index === 2 && '📈'}
                            {index === 3 && '🌍'}
                            {index === 4 && '👥'}
                            {index === 5 && '🏛'}
                            {index === 6 && '🌐'}
                            {index === 7 && '🌾'}
                            {index === 8 && '🔬'}
                            {index === 9 && '🌿'}
                            {index === 10 && '🛡️'}
                            {index === 11 && '✨'}
                            {index === 12 && '📚'}
                          </span>
                          {child.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Main Content - Full Width */}
            <div className="space-y-6 sm:space-y-8">
              {/* Related Topics Section - Card Grid Layout */}
              {page.children && page.children.length > 0 && (
                <div className="mb-8 sm:mb-10">
                  <div className="flex flex-col items-center mb-6 sm:mb-8">
                    <h2 className="text-2xl font-medium text-[var(--primary)] mb-1 text-center">
                      {JSON.parse(metadata).metaTitle ||
                        title ||
                        "Related Topics"}
                    </h2>
                    <p className="text-[var(--text-tertiary)] dark:text-slate-300 text-sm mb-1 text-center">
                      {JSON.parse(metadata).metaDescription ||
                        "Explore related topics to gain a deeper understanding of subject."}
                    </p>
                    <div className="w-full h-1 bg-[var(--highlight-bg)] dark:bg-blue-500/30 rounded-full"></div>
                  </div>
                  
                  {/* Card Grid - 3 columns on desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {page.children.map((child: any) => {
                      // Skip children with custom-link template
                      if (child.templateId === "custom-link") {
                        return null;
                      }

                      let childContent;
                      try {
                        if (typeof child.content === "string") {
                          childContent = child.content;
                        } else {
                          childContent = child.content || {};
                        }
                      } catch (error) {
                        console.error("Error parsing child content:", error);
                        childContent = {};
                      }

                      const childImagearray = JSON.parse(
                        child.imageUrl || ""
                      );
                      const childImage = childImagearray[0];
                      const childImageAlt = childImagearray[1];

                      return (
                        <div
                          key={child.id}
                          className="group transform transition-all hover:-translate-y-1"
                        >
                          <Card 
                            id={`child-card-${child.id}`}
                            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 dark:border dark:border-slate-700 overflow-hidden"
                          >
                            {/* Card Stripe */}
                            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                            
                            {/* Card Body */}
                            <div className="p-4 sm:p-6">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-lg">📚</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg font-semibold mb-2 text-[var(--primary)] line-clamp-2">
                                    {child.title}
                                  </h3>
                                  <span className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                                    Topic
                                  </span>
                                </div>
                              </div>
                              
                              <div className="relative w-full h-32 mb-4">
                                <Image
                                  src={`${childImage}`}
                                  alt={childImageAlt}
                                  fill
                                  className="object-cover rounded-lg"
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                />
                              </div>
                              
                              <p className="text-[var(--text-tertiary)] dark:text-slate-300 text-sm line-clamp-3 mb-4">
                                {child.content
                                  ? child.content
                                      .replace(/<[^>]*>/g, "") // Remove HTML tags
                                      .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
                                      .slice(0, 150) // Get first 150 characters
                                      .trim() +
                                    (child.content.length > 150 ? "..." : "")
                                  : "No content available"}
                              </p>
                              
                              <div className="flex gap-2">
                                <Link
                                  href={`/${child.slug}`}
                                  className="flex-1 inline-flex items-center justify-center bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors"
                                >
                                  Read Notes →
                                </Link>
                                <button
                                  onClick={() => handlePracticeClick(child.id)}
                                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                  Practice ↗
                                </button>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="h-0.5 bg-gray-200 dark:bg-gray-700">
                              <div className="h-full bg-blue-500 w-0 transition-all duration-600"></div>
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white"
                        >
                          «
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white"
                        >
                          ‹
                        </button>

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                                  currentPage === pageNum
                                    ? "bg-blue-500 text-white"
                                    : "border hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white dark:hover:text-white"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white"
                        >
                          ›
                        </button>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white"
                        >
                          »
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Main Content Section */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 dark:border dark:border-slate-700">
                <CardContent className="p-y-5 p-x-2 lg:p-10">
                  <div
                    className="prose prose-lg max-w-none
                    prose-h1:text-gray-900 dark:text-white prose-h1:text-center prose-h1:font-bold prose-h1:border-b-2 prose-h1:border-yellow-400 dark:border-yellow-500 prose-h1:pb-2 prose-h1:mb-6
                    prose-h2:text-gray-900 dark:text-white prose-h2:text-center prose-h2:font-bold prose-h2:border-b-2 prose-h2:border-yellow-400 dark:border-yellow-500 prose-h2:pb-2 prose-h2:mb-6
                    prose-h3:text-gray-900 dark:text-white prose-h3:text-center prose-h3:font-bold prose-h3:pb-2 prose-h3:mb-6
                    prose-h4:text-gray-900 dark:text-white prose-h4:text-center prose-h4:font-bold prose-h4:pb-2 prose-h4:mb-6
                    prose-h5:text-gray-900 dark:text-white prose-h5:text-center prose-h5:font-bold prose-h5:pb-2 prose-h5:mb-6
                    prose-h6:text-gray-900 dark:text-white prose-h6:text-center prose-h6:font-bold prose-h6:pb-2 prose-h6:mb-6
                    prose-p:text-gray-700 dark:text-gray-200 prose-p:leading-relaxed 
                    prose-a:text-blue-600 hover:prose-a:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300
                    prose-img:rounded-lg prose-img:shadow-lg 
                    prose-strong:text-gray-900 dark:text-white
                    dark:prose-invert
                    prose-headings:dark:text-white
                    prose-p:dark:text-gray-200
                    prose-li:dark:text-gray-200
                    prose-strong:dark:text-white"
                    dangerouslySetInnerHTML={{ __html: mainContent }}
                  />
                </CardContent>
              </Card>

              {/* GS Spark - Quick Challenge */}
              <div id="gs-spark-section" className="mt-12 mb-8">
                  <div className="bg-gray-50 dark:bg-slate-800 border-t border-b border-gray-200 dark:border-slate-700 py-16 px-6">
                    <div className="max-w-4xl mx-auto text-center mb-8">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 block">
                        GS Spark — Quick Challenge
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        How sharp are you <span className="italic text-yellow-500 dark:text-yellow-400">right now?</span>
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Pick a subject. Answer 5 questions. See your score.<br />
                        Most toppers got question #3 wrong. Will you?
                      </p>
                    </div>
                    
                    <div className="max-w-2xl mx-auto">
                      {quizChildren.length > 0 && (
                        <div className="flex gap-2 justify-center flex-wrap mb-6">
                          {quizChildren.map((child: any) => {
                            const isActive =
                              String(selectedQuizChildId) === String(child.id);

                            return (
                              <button
                                key={child.id}
                                onClick={() => setSelectedQuizChildId(child.id)}
                                className={`px-3 py-1 rounded-full border text-xs font-bold transition-all duration-200 ${
                                  isActive
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:border-blue-500 hover:text-blue-600"
                                }`}
                              >
                                {child.title}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200 dark:border-slate-700 px-6 py-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-blue-600 text-white rounded-full">
                              {selectedQuizChild?.title || "General Studies"}
                            </span>
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                              Score: <span className="text-gray-900 dark:text-white">{quizProgress.score}</span> / <span className="text-gray-900 dark:text-white">{quizProgress.total || currentQuestions.length || 0}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
                              <p className="text-gray-600 font-medium">
                                Loading Questions...
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Preparing your practice session
                              </p>
                            </div>
                          ) : error ? (
                            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <svg
                                    className="h-5 w-5 text-red-500 dark:text-red-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700 dark:text-red-200">
                                    {error}
                                  </p>
                                  <button
                                    onClick={fetchQuestions}
                                    className="mt-2 text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-600 dark:hover:text-red-400 underline"
                                  >
                                    Try Again
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="animate-fade-in">
                              <QuizWrapper
                                questions={currentQuestions}
                                onQuizComplete={handleQuizComplete}
                                onRetry={fetchQuestions}
                                isLoading={isLoading}
                                error={error}
                                onProgressChange={setQuizProgress}
                              />
                            </div>
                          )}
                        </div>

                        {!isLoading && !error && currentQuestions.length > 0 && (
                          <div className="bg-gray-50 dark:bg-slate-800 px-6 py-3 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <svg
                                className="h-4 w-4 mr-1.5 text-yellow-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {currentQuestions.length} Questions
                            </div>
                            <button
                              onClick={() =>
                                window.scrollTo({
                                  top: 0,
                                  behavior: "smooth",
                                })
                              }
                              className="text-sm font-medium text-yellow-600 hover:text-yellow-700 flex items-center"
                            >
                              <span>Back to Top</span>
                              <svg
                                className="h-4 w-4 ml-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <BackToTop />
        </div>
      </main>
    </>
  );
};

export default GeneralStudiesTemplate;
