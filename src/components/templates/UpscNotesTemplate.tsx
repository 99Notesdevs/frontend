"use client"
import React, { useEffect } from "react";
import ContactForm from "@/components/common/ContactForm/ContactForm";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
import SocialMedia from "@/components/navigation/socialmedia";
import { BaseTemplateProps } from "./types";
import Ads from "../navigation/Ads";

export const UpscNotesTemplate: React.FC<BaseTemplateProps> = ({ page }) => {
  const { title, content, metadata } = page;
  // @ts-ignore
  const jsonLD = JSON.parse(metadata)?.schemaData || "";
  const parsedMetadata = JSON.parse(metadata);
  const headScripts = parsedMetadata.header.split(",").map((script: string) => script.trim()) || [];
  const bodyScripts = parsedMetadata.body.split(",").map((script: string) => script.trim()) || [];

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
    <body>
    <section>
      <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLD }} />
    </section>
      <main>
        <div className="min-h-screen bg-gradient-to-b from-[var(--bg-main)] to-white">
          {/* Increase max width of the container */}
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 lg:py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 mt-7 lg:mt-16">
              {/* Adjust sidebar width */}
              <aside className="lg:col-span-4 order-2 lg:order-1">
                {/* Rest of sidebar content remains same */}
                <div className="relative">
                  <div className="sticky top-8 space-y-6">
                    {/* Navigation Section */}
                    <div className="bg-white border border-[var(--border-light)] rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
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
                    <div className="bg-white border border-[var(--border-light)] rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                      <h3 className="text-lg font-semibold mb-4 text-[var(--primary)] border-b-2 border-[var(--border-light)] pb-2 flex items-center gap-2">
                        <span className="text-[var(--primary)]">📝</span>
                        <span>Contact Us</span>
                      </h3>
                      <ContactForm />
                    </div>

                    {/* Social Media Section */}
                    <div className="bg-white border border-[var(--border-light)] rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
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

              {/* Adjust main content width */}
              <main className="lg:col-span-8 order-1 lg:order-2">
                <article className="bg-white border border-[var(--border-light)] rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 lg:p-8">
                  <div
                    className="prose prose-lg max-w-none
                  prose-headings:font-bold 
                  prose-headings:text-center
                  prose-headings:mb-6
                  prose-h1:border-b 
                  prose-h1:border-[var(--accent)] 
                  prose-h1:pb-2 
                  prose-h1:text-3xl
                  prose-h2:border-b 
                  prose-h2:border-[var(--accent)] 
                  prose-h2:pb-2 
                  prose-h2:text-2xl
                  prose-h3:text-xl
                  prose-h3:border-0
                  prose-h4:border-0
                  prose-h5:border-0
                  prose-h6:border-0
                  prose-p:text-[var(--text-strong)]
                  prose-p:leading-relaxed
                  prose-p:my-4
                  prose-a:text-[var(--primary)] 
                  prose-a:no-underline 
                  hover:prose-a:text-[var(--accent)]
                  prose-a:transition-colors
                  prose-strong:text-[var(--primary)]
                  prose-ul:list-disc
                  prose-ul:pl-6
                  prose-ul:my-4
                  prose-ol:pl-6
                  prose-ol:my-4
                  prose-li:marker:text-[var(--text-tertiary)]
                  prose-li:mb-2
                  prose-blockquote:border-l-4
                  prose-blockquote:border-[var(--border-light)]
                  prose-blockquote:bg-[var(--tertiary)]
                  prose-blockquote:p-4
                  prose-blockquote:rounded-r-lg
                  prose-blockquote:my-6
                  prose-img:rounded-lg
                  prose-img:shadow-md
                  prose-img:my-8"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </article>
              </main>
            </div>
          </div>
        </div>
      </main>
    </body>
  );
};

export default UpscNotesTemplate;
