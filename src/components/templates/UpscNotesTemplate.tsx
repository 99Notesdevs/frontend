import React from "react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import ContactForm from "@/components/common/ContactForm/ContactForm";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
import SocialMedia from "@/components/navigation/socialmedia";
import { BaseTemplateProps } from "./types";
import Ads from "../navigation/Ads";

export const UpscNotesTemplate: React.FC<BaseTemplateProps> = ({ page }) => {
  const { title, content, metadata } = page;
  // @ts-ignore
  const jsonLD = JSON.parse(metadata).schemaData;

  return (
    <>
    <section>
      <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLD }} />
    </section>
      <main>
        <div className="min-h-screen bg-gradient-to-b from-background-secondary to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Breadcrumb />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
              {/* Left Sidebar with increased width */}
              <aside className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1">
                {/* Sticky Container */}
                <div className="relative">
                  <div className="sticky top-8 space-y-6">
                    {/* Navigation Section */}
                    <div className="bg-white border border-background-secondary rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                      <h3 className="text-lg font-semibold mb-4 text-primary border-b-2 border-background-secondary pb-2 flex items-center gap-2">
                        <span className="text-primary">📚</span>
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
                    <div className="bg-white border border-background-secondary rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                      <h3 className="text-lg font-semibold mb-4 text-primary border-b-2 border-background-secondary pb-2 flex items-center gap-2">
                        <span className="text-primary">📝</span>
                        <span>Contact Us</span>
                      </h3>
                      <ContactForm />
                    </div>

                    {/* Social Media Section */}
                    <div className="bg-white border border-background-secondary rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                      <h3 className="text-lg font-semibold mb-4 text-primary border-b-2 border-background-secondary pb-2 flex items-center gap-2">
                        <span className="text-primary">🌐</span>
                        <span>Connect With Us</span>
                      </h3>
                      <div className="py-2">
                        <SocialMedia />
                      </div>
                    </div>

                    <div className="bg-white border border-background-secondary rounded-xl shadow-lg">
                      <Ads imageUrl="/" altText="ads" />
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content with reduced width */}
              <main className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2">
                <article className="bg-white border border-background-secondary rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
                  {/* <h1 className="text-4xl sm:text-4xl font-bold mb-8 text-center">
                <span className="text-primary border-b-2 border-accent-color pb-2">
                  {page.title}
                </span>
              </h1> */}

                  <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {Array.isArray(page.metadata?.keywords)
                      ? page.metadata.keywords.map(
                          (keyword: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-sm px-4 py-2 bg-background-secondary text-primary border border-background-secondary rounded-lg hover:bg-background-tertiary transition-colors duration-200"
                            >
                              {keyword}
                            </Badge>
                          )
                        )
                      : null}
                  </div>

                  <div
                    className="prose prose-lg max-w-none
                  prose-headings:font-bold 
                  prose-headings:text-center
                  prose-headings:mb-6
                  prose-h1:border-b 
                  prose-h1:border-accent-color 
                  prose-h1:pb-2 
                  prose-h1:text-3xl
                  prose-h2:border-b 
                  prose-h2:border-accent-color 
                  prose-h2:pb-2 
                  prose-h2:text-2xl
                  prose-h3:text-xl
                  prose-h3:border-0
                  prose-h4:border-0
                  prose-h5:border-0
                  prose-h6:border-0
                  prose-p:text-secondary
                  prose-p:leading-relaxed
                  prose-p:my-4
                  prose-a:text-primary 
                  prose-a:no-underline 
                  hover:prose-a:text-accent-color
                  prose-a:transition-colors
                  prose-strong:text-primary
                  prose-ul:list-disc
                  prose-ul:pl-6
                  prose-ul:my-4
                  prose-ol:pl-6
                  prose-ol:my-4
                  prose-li:marker:text-gray-500
                  prose-li:mb-2
                  prose-blockquote:border-l-4
                  prose-blockquote:border-background-secondary
                  prose-blockquote:bg-background-tertiary
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
    </>
  );
};

export default UpscNotesTemplate;
