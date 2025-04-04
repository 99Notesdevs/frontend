import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import ContactForm from "@/components/ui/ContactForm";
import SidebarNavigation from "@/components/navigation/SidebarNavigation";
import SocialMedia from "@/components/navigation/socialmedia";
import { metadata } from "@/app/(use-navbar)/layout";
import { BaseTemplateProps } from "./types";
import Ads from "../navigation/Ads";
// import { UpscNotesTemplateProps } from "./types";

interface PageItem {
  id: string;
  title: string;
  slug: string;
  level: number;
  children?: PageItem[];
}

interface UpscNotesTemplateProps {
  page: {
    id: string;
    title: string;
    content: string;
    slug: string;
    metadata: Record<string, any>;
    template: {
      id: string;
      name: string;
    };
    children: PageItem[];
  };
}

export const UpscNotesTemplate: React.FC<UpscNotesTemplateProps> = ({
  page,
}) => {

  const { title, content } = page;
  const jsonContent = JSON.parse(content);

  if (!jsonContent || typeof jsonContent !== "object") {
    console.error("Invalid content structure:", content);
    return <div>Error: Invalid content structure</div>;
  }

  const {
    content: mainContent = "",
  } = jsonContent;


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Left Sidebar with increased width */}
          <aside className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1">
            {/* Sticky Container */}
            <div className="relative">
              <div className="sticky top-8 space-y-6">
                {/* Navigation Section */}
                <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2 flex items-center gap-2">
                    <span className="text-blue-500">📚</span>
                    <span>Complete UPSC Notes</span>
                  </h3>
                  <div className="pr-2 max-h-[60vh] overflow-y-auto">
                    <SidebarNavigation 
                      currentPageId={page.id.toString()} 
                      basePath={page.slug.split('/')[0]}
                      hideParent={true}
                    />
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2 flex items-center gap-2">
                    <span className="text-blue-500">📝</span>
                    <span>Contact Us</span>
                  </h3>
                  <ContactForm />
                </div>

                {/* Social Media Section */}
                <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2 flex items-center gap-2">
                    <span className="text-blue-500">🌐</span>
                    <span>Connect With Us</span>
                  </h3>
                  <div className="py-2">
                    <SocialMedia />
                  </div>
                </div>

                <div className="bg-white border border-blue-100 rounded-xl shadow-lg">
                  <Ads imageUrl ="/" altText="ads"  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content with reduced width */}
          <main className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2">
            <article className="bg-white border border-blue-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
              <h1 className="text-4xl sm:text-4xl font-bold mb-8 text-center">
                <span className="text-indigo-900 border-b-2 border-yellow-400 pb-2">
                  {title}
                </span>
              </h1>

              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {Array.isArray(metadata?.keywords) ? metadata.keywords.map((keyword: string, index: number) => (
                  <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                  {keyword}
                  </Badge>
                )) : null}
              </div>

              {mainContent ? (
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:font-bold 
                    prose-headings:text-center
                    prose-headings:mb-6
                    prose-h1:border-b 
                    prose-h1:border-yellow-500 
                    prose-h1:pb-2 
                    prose-h1:text-3xl
                    prose-h2:border-b 
                    prose-h2:border-yellow-500 
                    prose-h2:pb-2 
                    prose-h2:text-2xl
                    prose-h3:text-xl
                    prose-h3:border-0
                    prose-h4:border-0
                    prose-h5:border-0
                    prose-h6:border-0
                    prose-p:text-gray-700
                    prose-p:leading-relaxed
                    prose-p:my-4
                    prose-a:text-blue-600 
                    prose-a:no-underline 
                    hover:prose-a:text-blue-500
                    prose-a:transition-colors
                    prose-strong:text-gray-800
                    prose-ul:list-disc
                    prose-ul:pl-6
                    prose-ul:my-4
                    prose-ol:pl-6
                    prose-ol:my-4
                    prose-li:marker:text-gray-500
                    prose-li:mb-2
                    prose-blockquote:border-l-4
                    prose-blockquote:border-gray-300
                    prose-blockquote:bg-gray-50
                    prose-blockquote:p-4
                    prose-blockquote:rounded-r-lg
                    prose-blockquote:my-6
                    prose-img:rounded-lg
                    prose-img:shadow-md
                    prose-img:my-8"
                  dangerouslySetInnerHTML={{ __html: mainContent }}
                />
              ) : (
                <div className="text-red-500 text-center font-medium">No content available</div>
              )}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UpscNotesTemplate;
