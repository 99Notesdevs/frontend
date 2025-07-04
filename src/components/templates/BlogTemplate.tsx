"use client";
import Image from "next/image";
import { BlogTemplateProps } from "./types";
import { format } from "date-fns";
import { useEffect } from "react";
import { RelatedTopics } from "../Blogs/relatedTopics";
import { Tags } from "@/components/ui/tags/Tags";
import Breadcrumb from "@/components/ui/breadcrumb";

export const BlogTemplate: React.FC<BlogTemplateProps> = ({ page }) => {
  const { title, content, metadata, imageUrl, slug } = page;
  const displayImagearray = JSON.parse(imageUrl || "") ;
  const displayImage = displayImagearray[0];
  const displayImageAlt = displayImagearray[1];
  const parsedMetadata =
    typeof metadata === "string" ? JSON.parse(metadata) : metadata || {};
  const { tags } = parsedMetadata || {};
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
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = script.trim();
            const scriptElement = tempDiv.firstChild as HTMLScriptElement;
            if (scriptElement && scriptElement.tagName === "SCRIPT") {
              document.head.appendChild(scriptElement);
            }
          } else {
            const scriptElement = document.createElement("script");
            scriptElement.textContent = script;
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
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = script.trim();
            const scriptElement = tempDiv.firstChild as HTMLScriptElement;
            if (scriptElement && scriptElement.tagName === "SCRIPT") {
              document.body.appendChild(scriptElement);
            }
          } else {
            const scriptElement = document.createElement("script");
            scriptElement.textContent = script;
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
      <main>
        <div className="min-h-screen bg-gradient-to-b from-[var(--bg-main)] to-white relative w-full overflow-x-hidden">
          <div className="w-full max-w-[1400px] xl:max-w-6.5xl mx-auto px-2 lg:px-8 py-4 sm:py-6">
            <Breadcrumb
            containerClasses="bg-muted/40 px-4 py-2 rounded-md"
            activeClasses="font-semibold"
          />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 mt-5">
              {/* Main Content Column */}
              <main className="lg:col-start-1 lg:col-span-9 space-y-4 sm:space-y-6">
                <div className="bg-white border shadow-lg rounded-xl">
                  {/* Featured Image */}
                  {imageUrl && (
                    <div className="w-full">
                      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] bg-gray-50">
                        <Image
                          src={`${displayImage}`}
                          alt={displayImageAlt}
                          fill
                          className="object-cover rounded-t-xl"
                          priority
                        />
                      </div>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--surface-darker)] mb-3">
                      {title}
                    </h1>

                    <div className="text-sm text-[var(--text-tertiary)] mb-2 ml-2">
                      By 99Notes
                    </div>

                    <div
                      className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
                      prose-headings:font-semibold
                      prose-headings:tracking-normal
                      prose-headings:text-left
                      prose-headings:relative
                      prose-headings:mb-6
                      
                      prose-h1:text-2xl sm:prose-h1:text-3xl lg:prose-h1:text-3xl
                      prose-h1:font-bold
                      prose-h1:text-gray-800
                      prose-h1:leading-tight
                      
                      prose-h2:text-2xl sm:prose-h2:text-2xl
                      prose-h2:text-gray-700
                      prose-h2:pb-2
                      prose-h2:after:content-['']
                      prose-h2:after:block
                      prose-h2:after:w-16
                      prose-h2:after:h-[2px]
                      prose-h2:after:mt-2
                      prose-h2:after:bg-yellow-500
                      prose-h2:after:rounded-full
                      
                      prose-h3:text-xl sm:prose-h3:text-2xl
                      prose-h3:text-gray-600
                      prose-h3:font-medium
                      prose-h3:pl-3
                      
                      prose-h4:text-lg sm:prose-h4:text-xl
                      prose-h4:text-gray-600
                      prose-h4:font-medium
                      prose-h4:before:content-['§']
                      prose-h4:before:text-yellow-500
                      prose-h4:before:mr-2
                      prose-h4:before:opacity-70
                      
                      prose-p:text-gray-600
                      prose-p:leading-relaxed
                      prose-p:tracking-wide
                      prose-strong:text-gray-800
                      prose-a:text-blue-600
                      prose-a:no-underline
                      prose-a:border-b-2
                      prose-a:border-blue-200
                      prose-a:transition-colors
                      prose-a:hover:border-blue-500
                      prose-blockquote:border-l-blue-500
                      prose-blockquote:bg-blue-50
                      prose-blockquote:p-3 sm:prose-blockquote:p-4
                      prose-blockquote:rounded-r-lg
                      prose-pre:bg-gray-50
                      prose-pre:rounded-lg
                      prose-pre:p-3 sm:prose-pre:p-4
                      prose-img:rounded-lg
                      prose-img:shadow-md
                      prose-ul:list-disc
                      prose-ul:pl-4 sm:prose-ul:pl-6
                      prose-ol:list-decimal
                      prose-ol:pl-4 sm:prose-ol:pl-6
                      [&>*]:w-full"
                    >
                      <div dangerouslySetInnerHTML={{ __html: content || "" }}></div>
                    </div>

                    {tags && tags.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Tags</h3>
                        <Tags tags={tags} />
                      </div>
                    )}
                  </div>
                </div>
              </main>

              {/* Sidebar */}
              <aside className="lg:col-start-10 lg:col-span-3 xl:col-start-10 xl:col-span-3 space-y-4 sm:space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Related Topics</h2>
                  <p className="text-[var(--text-base)]">Coming soon...</p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
      />
    </>
  );
};
