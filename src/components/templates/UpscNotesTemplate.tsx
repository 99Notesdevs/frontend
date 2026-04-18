"use client";
import React, { useEffect } from "react";
import ContactForm from "@/components/common/ContactForm/ContactForm";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
import SocialMedia from "@/components/navigation/socialmedia";
import { BaseTemplateProps } from "./types";
import Ads from "../navigation/Ads";
import Breadcrumb from "@/components/ui/breadcrumb";
import { BackToTop } from "@/components/ui/reachtotop";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export const UpscNotesTemplate: React.FC<BaseTemplateProps> = ({ page }) => {
  const { title, content, metadata } = page;
  // @ts-ignore
  const jsonLD = JSON.parse(metadata)?.schemaData || "";
  const parsedMetadata = JSON.parse(metadata);
  const headScripts =
    parsedMetadata?.header
      ?.split("||")
      ?.map((script: string) => script.trim()) || [];
  const bodyScripts =
    parsedMetadata?.body?.split("||")?.map((script: string) => script.trim()) ||
    [];

  useEffect(() => {
    // Inject head scripts
    if (headScripts) {
      headScripts.forEach((script: string) => {
        // console.log(script);
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
        // console.log(script);
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
      <main className="dark:bg-slate-900">
        <div className="min-h-screen bg-gradient-to-b from-[var(--bg-main)] to-white dark:from-slate-800 dark:to-slate-900">
          {/* Responsive container */}
          <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-8 pt-4 lg:pt-7 lg:py-10">
            <Breadcrumb
              containerClasses="bg-muted/40 dark:bg-slate-800/50 px-4 py-2 rounded-md"
              activeClasses="font-semibold"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 mt-4 lg:mt-7">
              {/* Sidebar */}
              <aside className="lg:col-span-4 order-2 lg:order-1 mb-6 lg:mb-0">
                <div className="relative">
                  <div className="sticky top-4 lg:top-8 space-y-4 lg:space-y-6">
                    {/* Navigation Section */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-800/50">
                      <h3 className="text-lg font-semibold mb-4 text-[var(--primary)] border-b-2 border-[var(--border-light)] pb-2 flex items-center gap-2">
                        <span className="text-[var(--primary)]">📚</span>
                        <span>Complete UPSC Notes</span>
                      </h3>
                      <div className="pr-2 max-h-[60vh] overflow-y-auto">
                        <SidebarNavigation
                          currentPageId={page.id.toString()}
                          basePath={page.slug.split("/")[0]}
                          hideParent={true}
                        />
                      </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-800/50">
                      <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b-2 border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">
                          📝
                        </span>
                        <span>Contact Us</span>
                      </h3>
                      <div className="dark:bg-slate-800/50 dark:p-4 dark:rounded-lg">
                        <ContactForm />
                      </div>
                    </div>

                    {/* Practice Questions Section */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-800/50">
                      <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b-2 border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">
                          📚
                        </span>
                        <span>Practice Questions</span>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                        Test your knowledge with these practice questions based
                        on this article.
                      </p>
                      <div className="text-center">
                        <button
                          onClick={() =>
                            (window.location.href = `/quiz?categoryId=${page?.categories?.[0].id}`)
                          }
                          className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 focus:ring-opacity-50 w-full"
                        >
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-700 to-blue-800 dark:from-blue-800 dark:to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                          <svg
                            className="w-5 h-5 mr-2 text-white"
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
                          <span className="relative">Start Practicing</span>
                        </button>
                      </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-800/50">
                      <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b-2 border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">
                          🌐
                        </span>
                        <span>Connect With Us</span>
                      </h3>
                      <div className="py-2">
                        <SocialMedia />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                      <Ads imageUrl="/" altText="ads" />
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <main className="lg:col-span-8 order-1 lg:order-2">
                {/* Page Title with Underline */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 lg:p-6 mb-6">
                  <h1 className="text-3xl font-bold text-[var(--primary)] text-center border-b-2 border-blue-600 dark:border-blue-400 pb-3">
                    {title}
                  </h1>
                </div>

                {/* Child Topics Section */}
                {page.children && page.children.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 lg:p-6 mb-6">               
                    
                    {/* Card Grid - Responsive layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      {page.children.map((child: any) => {
                        // Skip children with custom-link template
                        if (child.templateId === "custom-link") {
                          return null;
                        }

                        // Handle imageUrl - it might be an array or invalid URL
                        let childImage = "/placeholder-image.jpg";
                        if (child.imageUrl) {
                          // If imageUrl is an array, take the first valid element
                          if (Array.isArray(child.imageUrl)) {
                            childImage = child.imageUrl[0] && 
                                         typeof child.imageUrl[0] === 'string' && 
                                         child.imageUrl[0].trim() !== '' 
                                       ? child.imageUrl[0] 
                                       : "/placeholder-image.jpg";
                          } else if (typeof child.imageUrl === 'string' && child.imageUrl.trim() !== '') {
                            // Ensure it's a valid URL format
                            if (child.imageUrl.startsWith('/') || child.imageUrl.startsWith('http://') || child.imageUrl.startsWith('https://')) {
                              childImage = child.imageUrl;
                            }
                          }
                        }
                        
                        const childImageAlt = child.title || "Topic image";

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
                              <div className="p-3 sm:p-4">
                                <div className="flex items-start gap-2 mb-2">
                                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm">ð</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold mb-1 text-[var(--primary)] line-clamp-2">
                                      {child.title}
                                    </h3>
                                    <span className="inline-block text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                                      Topic
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="relative w-full h-20 mb-3">
                                  <Image
                                    src={childImage}
                                    alt={childImageAlt}
                                    fill
                                    className="object-cover rounded-lg"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
                                  />
                                </div>
                                
                                <p className="text-[var(--text-tertiary)] dark:text-slate-300 text-xs line-clamp-2 mb-3">
                                  {child.content
                                    ? child.content
                                        .replace(/<[^>]*>/g, "") // Remove HTML tags
                                        .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
                                        .slice(0, 100) // Get first 100 characters
                                        .trim() +
                                      (child.content.length > 100 ? "..." : "")
                                    : "No content available"}
                                </p>
                                
                                <div className="flex gap-2">
                                  <Link
                                    href={`/${child.slug}`}
                                    className="flex-1 inline-flex items-center justify-center bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors"
                                  >
                                    Read Notes â
                                  </Link>
                                </div>
                              </div>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Main Article Content */}
                <article className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 lg:p-8">
                  <div
                    className="prose prose-lg max-w-none dark:prose-invert
                  prose-headings:font-bold 
                  prose-headings:text-center
                  prose-headings:mb-6
                  prose-h1:border-b 
                  prose-h1:border-blue-600 dark:border-blue-400
                  prose-h1:pb-2 
                  prose-h1:text-3xl
                  prose-h1:text-gray-900 dark:text-white
                  prose-h2:border-b 
                  prose-h2:border-blue-500 dark:border-blue-400
                  prose-h2:pb-2 
                  prose-h2:text-2xl
                  prose-h2:text-gray-800 dark:text-gray-100
                  prose-h3:text-xl
                  prose-h3:text-gray-700 dark:text-blue-300
                  prose-h3:border-0
                  prose-h4:text-lg
                  prose-h4:text-gray-700 dark:text-blue-200
                  prose-h4:border-0
                  prose-h5:text-base
                  prose-h5:text-gray-700 dark:text-gray-200
                  prose-h5:border-0
                  prose-h6:text-sm
                  prose-h6:text-gray-700 dark:text-gray-300
                  prose-h6:border-0
                  prose-p:text-gray-700 dark:text-gray-200
                  prose-p:leading-relaxed
                  prose-p:my-4
                  prose-a:text-blue-600 dark:text-blue-400
                  prose-a:no-underline 
                  hover:prose-a:text-blue-700 dark:hover:text-blue-300
                  hover:prose-a:underline
                  prose-a:transition-colors
                  prose-strong:text-gray-900 dark:text-white
                  prose-ul:list-disc
                  prose-ul:pl-6
                  prose-ul:my-4
                  prose-ol:pl-6
                  prose-ol:my-4
                  prose-li:marker:text-gray-500 dark:text-gray-400
                  prose-li:mb-2
                  prose-li:text-gray-700 dark:text-gray-200
                  prose-blockquote:border-l-4
                  prose-blockquote:border-blue-500 dark:border-blue-400
                  prose-blockquote:bg-blue-50 dark:bg-slate-700/70
                  prose-blockquote:text-gray-700 dark:text-gray-200
                  prose-blockquote:p-4
                  prose-blockquote:rounded-r-lg
                  prose-blockquote:my-6
                  prose-img:rounded-lg
                  prose-img:shadow-md
                  prose-img:my-8
                  prose-code:bg-gray-100 dark:bg-slate-700
                  prose-code:px-1.5 py-0.5 rounded
                  prose-code:text-gray-800 dark:text-gray-100
                  prose-pre:bg-gray-100 dark:bg-slate-800
                  prose-pre:rounded-lg
                  prose-pre:p-4
                  prose-pre:overflow-x-auto
                  dark:prose-headings:text-white
                  dark:prose-p:text-gray-200
                  dark:prose-li:text-gray-200
                  dark:prose-strong:text-white"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </article>
              </main>
            </div>
          </div>
          <BackToTop />
        </div>
      </main>
    </>
  );
};

export default UpscNotesTemplate;
