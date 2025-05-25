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
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Left Column - Main Image and Content */}
                <div className="lg:col-span-8 space-y-4 sm:space-y-6">
                  {/* Main Topic Image */}
                  <Card className="border-0 shadow-xl bg-white/90 overflow-hidden mb-8 sm:mb-10 w-full">
                    <div className="relative w-full min-h-[300px] h-[60vh] max-h-[800px]">
                      <Image
                        src={`${pageImage || "/"}`}
                        alt={pageImageAlt}
                        fill
                        className="object-cover w-full h-full"
                        sizes="100vw"
                        priority
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'center',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        {/* <div className="p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)] tracking-tight">{title}</h1>
                  </div> */}
                      </div>
                    </div>
                  </Card>

                  {/* Related Topics Section */}
                  {page.children && page.children.length > 0 && (
                    <div className="mb-8 sm:mb-10">
                      <div className="flex flex-col items-center mb-6 sm:mb-8">
                        <h2 className="text-2xl font-medium text-[var(--primary)] mb-1 text-center">
                          {JSON.parse(metadata).metaTitle || "Related Topics"}
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
                  <div className="bg-white border border-[var(--border-light)] rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--primary)] border-b-2 border-[var(--border-light)] pb-3 flex items-center gap-2">
                      <span className="text-[var(--primary)]">📝</span>
                      <span>Practice Questions</span>
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">Test your knowledge with these practice questions based on this article.</p>
                    <div className="text-center">
                        <button
                          onClick={handleStartQuiz}
                          className="group relative w-full inline-flex items-center justify-center px-4 py-3 overflow-hidden font-medium text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
                        >
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
                          <svg
                            className="w-5 h-5 mr-2 text-gray-900 group-hover:text-white transition-colors duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            ></path>
                          </svg>
                          <span className="relative group-hover:text-white transition-colors duration-200">
                            Start Practicing
                          </span>
                        </button>
                      </div>
                    {showQuiz ? (
                    <div className="mt-6 p-4 bg-white rounded-lg shadow">
                      {isLoading ? (
                        <div className="text-center py-4">Loading questions...</div>
                      ) : error ? (
                        <div className="text-red-500 text-center py-4">{error}</div>
                      ) : (
                        <Quiz 
                          questions={currentQuestions} 
                          onQuizComplete={handleQuizComplete} 
                        />
                      )}
                    </div>
                  ) : (
                    <div className="mt-6 p-6 bg-white rounded-lg shadow">
                      <h3 className="text-xl font-semibold mb-4">Test Your Knowledge</h3>
                      <p className="text-gray-600 mb-4">
                        Test your knowledge with these practice questions based on this article.
                      </p>
                    </div>
                  )}
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
