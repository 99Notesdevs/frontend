"use client";
import React, { useCallback, useEffect, useState } from "react";
import { BaseTemplateProps } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import SearchBar from "@/components/Navbar/SearchBar";
import SocialMedia from "@/components/navigation/socialmedia";
import Ads from "../navigation/Ads";
import Quiz from '@/components/quiz/quiz';
import { env } from "@/config/env";
import Cookies from "js-cookie";
import Breadcrumb from "@/components/ui/breadcrumb";
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

export const GeneralStudiesTemplate: React.FC<BaseTemplateProps> = ({
  page,
}) => {
  const { title, content, metadata, children, imageUrl } = page;
  const mainContent = content || "";
  // @ts-ignore
  const jsonLD = JSON.parse(metadata).schemaData;
  // Default image if none is provided
  const pageImagearray = JSON.parse(imageUrl || "") ;
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
    const [showQuiz, setShowQuiz] = useState(true);
    const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);
    const fetchQuestions = useCallback(async () => {
      if (!page?.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const limit = page.questionNumber || localStorage.getItem("practiceQuestions") || 10;
        const response = await fetch(
          `${env.API_TEST}/questions/practice?categoryId=${page.categories?.id}&limit=${limit}`,
          {
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
  
        const { data } = await response.json();
        setCurrentQuestions(data);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, [page?.id, page?.questionNumber]);
    const handleStartQuiz = async () => {
      if (!showQuiz) {
        await fetchQuestions();
      }
      setShowQuiz(!showQuiz);
    };
  
    const handleQuizComplete = () => {
      setShowQuiz(false);
    };
  // Fetch questions when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      if (!hasFetched) {
        await fetchQuestions();
        setHasFetched(true);
      }
    };
    loadQuestions();
  }, [fetchQuestions, hasFetched]);

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

  return (
      <>
        <section>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLD }}
          />
        </section>
        <main>
          <div className="min-h-screen bg-gradient-to-b from-[var(--bg-main)] to-white">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-0 md:px-6 lg:px-8 py-4 sm:py-8">
              <Breadcrumb
            containerClasses="bg-muted/40 px-1 py-2 rounded-md"
            activeClasses="font-semibold"
          />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Left Column - Main Image and Content */}
                <div className="lg:col-span-8 space-y-4 sm:space-y-6">
                  {/* Main Topic Image */}
                  <div className="bg-white border border-[var(--info-surface)] rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
                    <div className="relative w-full h-[300px] md:h-[400px]">
                      <Image
                        src={`${pageImage || "/"}`}
                        alt={pageImageAlt}
                        fill
                        className="object-cover w-full h-full"
                        priority
                      />
                    </div>
                  </div>

                  {/* Related Topics Section */}
                  {page.children && page.children.length > 0 && (
                    <div className="mb-8 sm:mb-10">
                      <div className="flex flex-col items-center mb-6 sm:mb-8">
                        <h2 className="text-2xl font-medium text-[var(--primary)] mb-1 text-center">
                          {JSON.parse(metadata).metaTitle || title || "Related Topics"}
                        </h2>
                        <p className="text-[var(--text-tertiary)] text-sm mb-1 text-center">
                          {JSON.parse(metadata).metaDescription ||
                            "Explore related topics to gain a deeper understanding of the subject."}
                        </p>
                        <div className="w-full h-1 bg-[var(--highlight-bg)] rounded-full"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                            console.error(
                              "Error parsing child content:",
                              error
                            );
                            childContent = {};
                          }

                          const childImagearray = JSON.parse(child.imageUrl || "") ;
                          const childImage = childImagearray[0];
                          const childImageAlt = childImagearray[1];

                          return (
                            <Link
                              href={`/${child.slug}`}
                              key={child.id}
                              className="group transform transition-all hover:-translate-y-1"
                            >
                              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90">
                                <div className="relative w-full h-48 ">
                                  <Image
                                    src={`${childImage}`}
                                    alt={childImageAlt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                  />
                                </div>
                                <div className="p-6">
                                  <h3 className="text-lg font-semibold mb-2 text-[var(--primary)]">
                                    {child.title}
                                  </h3>
                                  <p className="text-[var(--text-tertiary)] text-sm line-clamp-2">
                                    {child.content
                                      ? child.content
                                          .replace(/<[^>]*>/g, "") // Remove HTML tags
                                          .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
                                          .slice(0, 100) // Get first 100 characters
                                          .trim() +
                                        (child.content.length > 100
                                          ? "..."
                                          : "")
                                      : "No content available"}
                                  </p>
                                </div>
                              </Card>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Main Content Section */}
                  <Card className="border-0 shadow-xl bg-white/90">
                    <CardContent className="p-y-5 p-x-2 lg:p-10">
                      <div
                        className="prose prose-lg max-w-none
                    prose-h1:text-gray-900 prose-h1:text-center prose-h1:font-bold prose-h1:border-b-2 prose-h1:border-yellow-400 prose-h1:pb-2 prose-h1:mb-6
                    prose-h2:text-gray-900 prose-h2:text-center prose-h2:font-bold prose-h2:border-b-2 prose-h2:border-yellow-400 prose-h2:pb-2 prose-h2:mb-6
                    prose-h3:text-gray-900 prose-h3:text-center prose-h3:font-bold prose-h3:pb-2 prose-h3:mb-6
                    prose-h4:text-gray-900 prose-h4:text-center prose-h4:font-bold prose-h4:pb-2 prose-h4:mb-6
                    prose-h5:text-gray-900 prose-h5:text-center prose-h5:font-bold prose-h5:pb-2 prose-h5:mb-6
                    prose-h6:text-gray-900 prose-h6:text-center prose-h6:font-bold prose-h6:pb-2 prose-h6:mb-6
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg prose-img:shadow-lg prose-strong:text-gray-900"
                        dangerouslySetInnerHTML={{ __html: mainContent }}
                      />
                    </CardContent>
                  </Card>

                </div>

                {/* Right Sidebar */}
                <aside className="lg:col-span-4 space-y-4 sm:space-y-6">
                  {/* Search Bar */}
                  <div
                    className="bg-white border border-[var(--border-light)] rounded-xl shadow-lg p-4 sm:p-6 
                    transition-all duration-300 hover:shadow-xl mb-4 sm:mb-6"
                  >
                    <SearchBar />
                  </div>

                 

                  {/* Sticky Container */}
                  <div className="relative">
                    <div className="sticky top-8 space-y-4 sm:space-y-6">
                      {/* Table of Contents Section */}
                      <div className="bg-white border border-[var(--border-light)] rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--primary)] border-b-2 border-[var(--border-light)] pb-2 flex items-center gap-2">
                          <span className="text-[var(--primary)]">📑</span>
                          <span>Table of Contents</span>
                        </h3>
                        <div className="pr-2">
                          <TableOfContents content={mainContent} />
                        </div>
                      </div>

                      {/* Practice Questions Section */}
                      <div className="sticky bottom-6 mt-6 transition-all duration-300 hover:shadow-xl">
                        <div className="bg-gradient-to-br from-white to-[#f8f9fa] border-2 border-[var(--info-surface)] rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                          <div className="bg-gradient-to-r from-yellow-500 to-amber-300 px-6 py-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                              <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </span>
                              <span className="drop-shadow-sm">Practice PYQs</span>
                            </h3>
                            <p className="text-white/90 text-sm mt-1">Test your knowledge with these practice questions</p>
                          </div>
                          
                          <div className="p-6">
                            {isLoading ? (
                              <div className="flex flex-col items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
                                <p className="text-gray-600 font-medium">Loading Questions...</p>
                                <p className="text-sm text-gray-500 mt-1">Preparing your practice session</p>
                              </div>
                            ) : error ? (
                              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <div className="flex">
                                  <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                    <button 
                                      onClick={fetchQuestions}
                                      className="mt-2 text-sm font-medium text-red-700 hover:text-red-600 underline"
                                    >
                                      Try Again
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="animate-fade-in">
                                <Quiz 
                                  questions={currentQuestions} 
                                  onQuizComplete={handleQuizComplete} 
                                />
                              </div>
                            )}
                          </div>
                          
                          {!isLoading && !error && (
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                              <div className="flex items-center text-sm text-gray-500">
                                <svg className="h-4 w-4 mr-1.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                {currentQuestions.length} Questions
                              </div>
                              <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-sm font-medium text-yellow-600 hover:text-yellow-700 flex items-center"
                              >
                                <span>Back to Top</span>
                                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Social Media Section */}
                      <div className="bg-white border border-[var(--border-light)] rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--primary)] border-b-2 border-[var(--border-light)] pb-2 flex items-center gap-2">
                          <span className="text-[var(--primary)]">🌐</span>
                          <span>Connect With Us</span>
                        </h3>
                        <div className="py-2">
                          <SocialMedia />
                        </div>
                      </div>

                      <div className="bg-white border border-[var(--border-light)] rounded-xl shadow-lg">
                        <Ads imageUrl="/" altText="ads" />
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </main>
      </>
  );
};

export default GeneralStudiesTemplate;
