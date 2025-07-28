"use client";
import { useState, useEffect, useCallback } from "react";
import { ArticleTemplateProps } from "./types";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import SearchBar from "@/components/Navbar/SearchBar";
import QuizWrapper from "@/components/quiz/QuizWrapper";
import Image from "next/image";
import SocialMedia from "@/components/navigation/socialmedia";
import ContactForm from "@/components/common/ContactForm/ContactForm";
import AssistiveTouch from "@/components/navigation/Assistivetouch";
import { Comments } from "@/components/ui/comments";
import Ads from "../navigation/Ads";
import Cookies from "js-cookie";
import { isLocked } from "@/lib/islocked";
import Breadcrumb from "@/components/ui/breadcrumb";
// import { LiveChat } from "@/components/livechat/livechat";
import { Tags } from "@/components/ui/tags/Tags";
import Bookmark from "../ui/Bookmark";
import Quiz from "@/components/quiz/quiz";
import FAQPage from "@/components/FAQp/faqp";
import { BackToTop } from "@/components/ui/reachtotop";
import { DownloadPdf } from "@/components/ui/downloadpdf";
import { WhatsAppPdf } from "@/components/ui/whatsapp-pdf";
import { api } from "@/config/api/route";
import { env } from "@/config/env";
import { SuggestedArticles } from "@/components/navigation/suggested-article";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explaination: string;
  creatorName: string;
  year?: number;
}

const processContent = async (content: string, isAuthorized: boolean) => {
  const isContentLocked = await isLocked();
  return content.replace(/<lock>\s*([^]*?)\s*<\/lock>/g, (lockedContent) => {
    return isAuthorized || !isContentLocked
      ? lockedContent
      : `<div class="locked-content">
           <p>${lockedContent}</p>
           <a href="/subscription" class="login-link">Subscribe</a>
         </div>`;
  });
};

export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ page }) => {
  console.log("page", page);
  const { title, content, metadata } = page;
  const parsedMetadata =
    typeof metadata === "string" ? JSON.parse(metadata) : metadata || {};

  // const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mainContentFinal, setMainContentFinal] = useState("");
  const token = Cookies.get("token");
  // @ts-ignore
  const jsonLD = parsedMetadata.schemaData;
  const headScripts =
    parsedMetadata?.header
      ?.split("||")
      ?.map((script: string) => script.trim()) || [];
  const bodyScripts =
    parsedMetadata?.body?.split("||")?.map((script: string) => script.trim()) ||
    [];
  const bookmarkBy = (page as any)?.bookmarkBy || [];
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;
    const userId = localStorage.getItem("userId");
    if (!userId || !Array.isArray(bookmarkBy) || bookmarkBy.length === 0) {
      setIsBookmarked(false);
      return;
    }
    const found = bookmarkBy.some(
      (item: any) => String(item.id) === String(userId)
    );
    setIsBookmarked(found);
  }, [bookmarkBy]);

  const [showQuiz, setShowQuiz] = useState(true);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // useEffect(() => {
  //   const handleToggleChat = (event: CustomEvent) => {
  //     setIsLiveChatOpen(event.detail.isOpen);
  //   };

  //   window.addEventListener('toggleChat', handleToggleChat as EventListener);

  //   return () => {
  //     window.removeEventListener('toggleChat', handleToggleChat as EventListener);
  //   };
  // }, []);
  const fetchQuestions = useCallback(async () => {
    if (!page?.id || !page?.categories?.[0]?.id) {
      // Don't proceed if page ID or category ID is not defined
      setCurrentQuestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const limit =
        page.questionNumber || localStorage.getItem("practiceQuestions") || 10;
      const response = await fetch(
        `${env.API_TEST}/questions/practice?categoryId=${page.categories[0].id}&limit=${limit}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const { data } = await response.json();
      setCurrentQuestions(data);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. Please try again.");
      setCurrentQuestions([]);
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
      await fetchQuestions();
    };
    loadQuestions();
  }, [fetchQuestions]);

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

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const res = (await api.get(`/user/check`)) as { success: boolean };
        setIsAuthorized(res.success);
      } catch (error) {
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, [token]);

  // Process content and add IDs to headings
  const processContentWithIds = useCallback((html: string): string => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Process h2 headings
      const headings = doc.querySelectorAll("h2");
      headings.forEach((heading, index) => {
        const text = heading.textContent || "";
        const id =
          text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "") || `heading-${index}`;

        heading.id = id;
      });

      return doc.body.innerHTML;
    } catch (error) {
      console.error("Error processing content:", error);
      return html;
    }
  }, []);

  useEffect(() => {
    const processContentAsync = async () => {
      if (isAuthorized !== null && content) {
        // First process the locked content
        let processedContent = await processContent(content, isAuthorized);
        // Then add IDs to headings
        processedContent = processContentWithIds(processedContent);
        setMainContentFinal(processedContent);
      }
    };

    processContentAsync();
  }, [isAuthorized, content, processContentWithIds]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // @ts-ignore
  const parentId = page.slug;

  const { tags, coverImage, relatedArticles } = parsedMetadata || {};

  // Use either the content image or the metadata coverImage
  // @ts-ignore
  const displayImagearray = JSON.parse(page.imageUrl) || (coverImage as string);
  const displayImage = displayImagearray[0];
  const displayImageAlt = displayImagearray[1];
  const formattedDate = page.createdAt
    ? new Date(page.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "N/A";

  return (
    <>
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLD }}
        />
      </section>
      <main>
        <div className="min-h-screen bg-gradient-to-b from-[var(--bg-main)] to-white dark:from-slate-900 dark:to-slate-900">
          {/* Assistive Touch */}
          <AssistiveTouch content={mainContentFinal} />

          <div className="w-full max-w-[1400px] mx-auto px-2 lg:px-10 py-4 sm:py-6">
            <Breadcrumb
              containerClasses="bg-muted/40 px-4 py-2 rounded-md"
              activeClasses="font-semibold"
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-4">
              {/* Main Content Column */}
              <main className="lg:col-start-1 lg:col-span-8 space-y-4 sm:space-y-6">
                {/* Featured Image */}
                {displayImage && (
                  <div className="bg-white dark:bg-slate-800 border border-[var(--info-surface)] dark:border-slate-700 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.01] dark:shadow-slate-800/50">
                    <div className="relative w-full h-[300px] md:h-[400px]">
                      <Image
                        src={`${displayImage}`}
                        alt={displayImageAlt}
                        fill
                        className="object-cover w-full"
                        priority
                      />
                    </div>
                  </div>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-3 text-center">
                  {page.title}
                </h1>

                <div className="flex gap-3 justify-center">
                  <WhatsAppPdf
                    phoneNumber="+919876543210"
                    message="Hello, I'd like to get the PDF notes for [Article Name]."
                    className="w-full h-12"
                  />
                  <DownloadPdf />
                </div>
                <div className="lg:hidden sticky bottom-6 mt-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-900/50">
                    <div className="bg-gradient-to-br from-white to-[#f8f9fa] dark:from-slate-800 dark:to-slate-900 border-2 border-[var(--info-surface)] dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-slate-900/50">
                      <div className="p-3">
                        <h2 className="text-xl font-semibold mb-4 text-[var(--surface-dark)] dark:text-slate-200 border-b-2 border-[var(--info-surface)] dark:border-slate-600 pb-2">
                          Practice Questions
                        </h2>
                        <QuizWrapper
                          questions={currentQuestions}
                          onQuizComplete={handleQuizComplete}
                          onRetry={fetchQuestions}
                          isLoading={isLoading}
                          error={error}
                        />
                      </div>

                      {!isLoading && !error && (
                        <div className="bg-gray-50 dark:bg-slate-800 px-6 py-3 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                            <svg className="h-4 w-4 mr-1.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            {currentQuestions.length} Questions
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                {/* Article Content */}
                <div className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-slate-900/50 w-full  mb-8 sm:mb-10 rounded-xl overflow-hidden">
                  <div className="p-2 pt-5">
                    <Tags tags={page.tags} />
                    <div
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: mainContentFinal }}
                    />
                  </div>
                </div>
                {page.FAQ && (
                  <div className="bg-white dark:bg-slate-800  rounded-xl shadow-lg p-4 sm:p-6 mt-4">
                    <FAQPage data={page.FAQ} />
                  </div>
                )}
                {/* <button 
                    onClick={() => setIsLiveChatOpen(!isLiveChatOpen)}
                    className="px-4 py-2 bg-[var(--info-surface)] text-[var(--text-strong)] rounded-lg hover:bg-[var(--info-surface-hover)] transition-colors"
                  >
                    {isLiveChatOpen ? "Close Chat" : "Open Chat"}
                  </button> */}

                {isAuthorized && <Comments parentId={parentId} />}

                {/* Suggested Articles Section */}
                <div className="bg-white dark:bg-slate-800 border border-[var(--info-surface)] dark:border-slate-700 rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-700/50">
                  <SuggestedArticles
                    currentArticle={page}
                  />
                </div>
              </main>

              {/* Right Sidebar */}
              <aside className="lg:col-span-4 space-y-4 sm:space-y-6 w-full">
                {/* Sidebar content - No longer conditionally hidden */}
                <div>
                  {/* Search Bar */}
                  <div
                    className="hidden lg:block flex justify-left bg-white dark:bg-slate-800 border border-[var(--info-surface)] dark:border-slate-700 rounded-xl shadow-lg p-4 sm:p-6 
                        transition-all duration-300 hover:shadow-xl mb-4 sm:mb-6"
                  >
                    <div className="w-[100%] mr-2">
                      <SearchBar />
                    </div>
                    {isAuthorized && (
                      <Bookmark
                        articleId={page.id}
                        initialBookmarked={isBookmarked}
                      />
                    )}
                  </div>

                  {/* TOC Section */}
                  <div
                    className="hidden lg:block bg-white dark:bg-slate-800 border border-[var(--info-surface)] dark:border-slate-700 rounded-xl shadow-lg p-4 sm:p-6 
                        transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-700/50 mb-4 sm:mb-6"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-[var(--surface-dark)] dark:text-slate-200 border-b-2 border-[var(--info-surface)] dark:border-slate-600 pb-2">
                      Table of Contents
                    </h3>
                    <div className="pr-2">
                      <TableOfContents content={mainContentFinal} />
                    </div>
                  </div>

                  {/* Practice Questions Section - Sticky Footer */}
                  <div className="hidden lg:block sticky bottom-6 mt-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-900/50">
                    <div className="bg-gradient-to-br from-white to-[#f8f9fa] dark:from-slate-800 dark:to-slate-900 border-2 border-[var(--info-surface)] dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-slate-900/50">
                      <div className="p-3">
                        <h2 className="text-xl font-semibold mb-4 text-[var(--surface-dark)] dark:text-slate-200 border-b-2 border-[var(--info-surface)] dark:border-slate-600 pb-2">
                          Practice Questions
                        </h2>
                        <QuizWrapper
                          questions={currentQuestions}
                          onQuizComplete={handleQuizComplete}
                          onRetry={fetchQuestions}
                          isLoading={isLoading}
                          error={error}
                        />
                      </div>

                      {!isLoading && !error && (
                        <div className="bg-gray-50 dark:bg-slate-800 px-6 py-3 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                            <svg className="h-4 w-4 mr-1.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            {currentQuestions.length} Questions
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Media Section */}
                  <div className="bg-white dark:bg-slate-800 border border-[var(--info-surface)] dark:border-slate-700 rounded-xl shadow-lg p-4 sm:p-6 mt-4">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--surface-dark)] dark:text-white border-b-2 border-[var(--info-surface)] pb-2 flex items-center gap-2">
                      <span className="text-[var(--action-primary)]">🌐</span>
                      <span>Connect With Us</span>
                    </h3>
                    <div className="space-y-4 sm:space-y-6">
                      <SocialMedia />
                    </div>
                  </div>

                  {/* Contact Form Section */}
                  <div className="bg-white dark:bg-slate-800 border border-[var(--info-surface)] dark:border-slate-700 rounded-xl shadow-lg mt-4">
                    <ContactForm />
                  </div>

                  {/* Ads Section */}
                  <div className="bg-white dark:bg-slate-800 border border-[var(--info-surface)] dark:border-slate-700 rounded-xl shadow-lg mt-4">
                    <Ads imageUrl="/" altText="ads" />
                  </div>

                  {/* Tags Section */}
                  <div>
                    {tags && tags.length > 0 && (
                      <Tags tags={tags.map((tag: string) => ({ name: tag }))} />
                    )}
                  </div>
                </div>
              </aside>

              {/* LiveChat Component */}
              {/* <div className={`${isLiveChatOpen ? 'block' : 'hidden'} fixed inset-0 z-[99999] lg:z-[99999]`}>
                  <div className="absolute inset-0 bg-black/20" onClick={() => setIsLiveChatOpen(false)}></div>
                  <div className="absolute right-4 bottom-[15vh] h-[70vh] md:h-[60vh] w-[90%] sm:w-[400px] z-max">
                    <LiveChat id={page.id} />
                  </div>
                </div> */}

              {/* LiveChat Toggle Button */}
              {/* <button 
                  onClick={() => setIsLiveChatOpen(!isLiveChatOpen)}
                  className="fixed bottom-6 right-6 z-max bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
                >
                  {isLiveChatOpen ? (
                    <>
                      <span>Close Chat</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Chat with us</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03 8.25-9 8.25s9 3.694 9 8.25z" />
                      </svg>
                    </>
                  )}
                </button> */}
            </div>
          </div>
        </div>
        <BackToTop />
      </main>
    </>
  );
};

export default ArticleTemplate;
