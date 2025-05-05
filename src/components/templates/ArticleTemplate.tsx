"use client";
import { useState, useEffect } from "react";
import { ArticleTemplateProps } from "./types";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import SearchBar from "@/components/Navbar/SearchBar";
import Image from "next/image";
import SocialMedia from "@/components/navigation/socialmedia";
import ContactForm from "@/components/common/ContactForm/ContactForm";
import AssistiveTouch from "@/components/navigation/Assistivetouch";
import { Comments } from "@/components/ui/comments";
import Ads from "../navigation/Ads";
import { env } from "@/config/env";
import axios from "axios";
import Cookies from "js-cookie";
import WhatsApp from "@/components/ui/whatsapp";
import { isLocked } from "@/lib/islocked";


const processContent = async (content: string, isAuthorized: boolean) => {
  const isContentLocked = await isLocked();
  return content.replace(/<lock>\s*([^]*?)\s*<\/lock>/g, (lockedContent) => {
    return   isAuthorized || !isContentLocked
      ? lockedContent
      : `<div class="locked-content">
           <p>${lockedContent}</p>
           <a href="/subscription" class="login-link">Subscribe</a>
         </div>`;
  });
};

export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ page }) => {
  const { title, content, metadata } = page;
  const parsedMetadata =
    typeof metadata === "string" ? JSON.parse(metadata) : metadata || {};

  const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null);
  const [mainContentFinal, setMainContentFinal] = useState(content || "");
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
        const res = await axios.get(`${env.API}/user/check`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAuthorized(res.data.success);
      } catch (error) {
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, [token]);

  useEffect(() => {
    const processContentAsync = async () => {
      if (isAuthorized !== null) {
        const result = await processContent(content || "", isAuthorized);
        setMainContentFinal(result);
      }
    };

    processContentAsync();
  }, [isAuthorized, content]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // @ts-ignore
  const parentId = page.slug;

  const { tags, coverImage } = parsedMetadata || {};

  // Use either the content image or the metadata coverImage
  // @ts-ignore
  const displayImage = page.imageUrl || (coverImage as string);

  return (
      <>
        <section>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLD }}
          />
        </section>
        <main>
          <div className="min-h-screen bg-white relative w-full overflow-x-hidden">
            {/* Assistive Touch */}
            <AssistiveTouch content={mainContentFinal} />

            <div
              className="w-full max-w-[1400px] mx-auto px-4 lg:px-10 py-4 sm:py-12 
        transition-all duration-300 md:peer-checked:pl-[280px] lg:peer-checked:pl-[320px]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-4">
                {/* Main Content Column */}
                <main className="lg:col-start-1 lg:col-span-8 space-y-4 sm:space-y-8">
                  {/* Featured Image */}
                  {displayImage && (
                    <div className="bg-white border border-[var(--info-surface)] rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] mb-12">
                      <div className="relative w-full h-[400px]">
                        <Image
                          src={`${displayImage}`}
                          alt={title}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="bg-white border rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                    {/* Article Header */}
                    <div className="text-center mb-6">
                      {page.parent && (
                        <div className="mb-4">
                          <a
                            href={`/${page.parent.slug}`}
                            className="text-[var(--action-primary)] hover:text-[var(--accent-link)] transition-colors"
                          >
                            {page.parent.title}
                          </a>
                        </div>
                      )}

                      <h1 className="text-3xl font-bold text-[var(--surface-darker)] mb-2">
                        {parsedMetadata.metaTitle || "Untitled Article"}
                      </h1>
                    </div>

                    <div className="text-xs text-[var(--text-tertiary)] mb-4">
                      {" "}
                      {page.createdAt
                        ? new Date(page.createdAt).toLocaleDateString()
                        : "N/A"}
                    </div>

                    <WhatsApp />
                    <div className="text-center mb-8 sm:mb-12"></div>

                    <div
                      className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
                    prose-headings:font-semibold
                    prose-headings:tracking-normal
                    prose-headings:text-left
                    prose-headings:relative
                    prose-headings:mb-6
                    
                    prose-h1:text-3xl sm:prose-h1:text-4xl
                    prose-h1:font-bold
                    prose-h1:text-[var(--surface-dark)]
                    prose-h1:leading-tight
                    
                    prose-h2:text-2xl sm:prose-h2:text-3xl
                    prose-h2:text-[var(--text-strong)]
                    prose-h2:pb-2
                    prose-h2:after:content-['']
                    prose-h2:after:block
                    prose-h2:after:w-16
                    prose-h2:after:h-[2px]
                    prose-h2:after:mt-2
                    prose-h2:after:bg-[var(--primary)]
                    prose-h2:after:rounded-full
                    
                    prose-h3:text-xl sm:prose-h3:text-2xl
                    prose-h3:text-[var(--text-tertiary)]
                    
                    prose-p:text-[var(--text-tertiary)]
                    prose-strong:text-[var(--surface-dark)]
                    prose-a:text-[var(--action-primary)]
                    prose-a:border-[var(--info-surface)]
                    prose-a:hover:border-[var(--accent-link)]
                    
                    prose-blockquote:border-l-[var(--action-primary)]
                    prose-blockquote:bg-[var(--bg-subtle)]"
                    >
                      {mainContentFinal}
                    </div>
                  </div>
                  <Comments parentId={parentId} />
                </main>

                {/* Right Sidebar */}
                <aside className="lg:col-span-4 space-y-4 sm:space-y-6">
                  {/* Search Bar */}
                  <div
                    className="bg-white border border-[var(--info-surface)] rounded-xl shadow-lg p-4 sm:p-6 
                    transition-all duration-300 hover:shadow-xl mb-4 sm:mb-6"
                  >
                    <SearchBar />
                  </div>

                  {/* Sticky Container */}
                  <div className="relative">
                    {/* TOC Section */}
                    <div className="sticky top-8 space-y-4 sm:space-y-6">
                      <div
                        className="hidden lg:block bg-white border border-[var(--info-surface)] rounded-xl shadow-lg p-4 sm:p-6 
                      transition-all duration-300 hover:shadow-xl"
                      >
                        <h3 className="text-lg font-semibold mb-4 text-[var(--surface-dark)] border-b-2 border-[var(--info-surface)] pb-2">
                          Table of Contents
                        </h3>
                        <div className="pr-2">
                          <TableOfContents content={mainContentFinal} />
                        </div>
                      </div>

                      {/* Social Media Section */}
                      <div className="bg-white border border-[var(--info-surface)] rounded-xl shadow-lg p-4 sm:p-6">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--surface-dark)] border-b-2 border-[var(--info-surface)] pb-2 flex items-center gap-2">
                          <span className="text-[var(--action-primary)]">
                            🌐
                          </span>
                          <span>Connect With Us</span>
                        </h3>
                        <div className="py-2 h-9">
                          <SocialMedia />
                        </div>
                      </div>

                      {/* Contact Form Section */}
                      <div className="bg-white border border-[var(--info-surface)] rounded-xl shadow-lg">
                        <ContactForm />
                      </div>

                      <div className="bg-white border border-[var(--info-surface)] rounded-xl shadow-lg">
                        <Ads imageUrl="/" altText="ads" />
                      </div>

                      {/* Tags Section */}
                      {tags && tags.length > 0 && (
                        <div className="bg-white border border-[var(--info-surface)] rounded-xl shadow-lg p-4 sm:p-6">
                          <h3 className="text-lg font-semibold mb-4 text-[var(--surface-dark)] border-b-2 border-[var(--info-surface)] pb-2">
                            🏷 Tags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-[var(--bg-subtle)] text-[var(--action-primary)] hover:bg-[var(--info-surface)] transition-colors duration-200 cursor-pointer"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
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

export default ArticleTemplate;
