"use client";
import React from "react";
import { BaseTemplateProps } from "./types";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import SearchBar from "@/components/Navbar/SearchBar";
import Image from "next/image";
import { X } from "lucide-react";
import SocialMedia from "@/components/navigation/socialmedia";
import ContactForm from "@/components/common/ContactForm/ContactForm";
import DraggableTocButton from "@/components/navigation/DraggableTocButton";
import { Comments } from "@/components/ui/comments";
import Ads from "../navigation/Ads";
import { env } from "@/config/env";
import axios from "axios";
import Cookies from "js-cookie";

interface LockContentProps {
  children: React.ReactNode;
}

const LockContent: React.FC<LockContentProps> = ({ children }) => {
  const token = Cookies.get("token");

  // Check if token is valid
  const checkToken = async () => {
    if (!token) return false;
    try {
      const res = await axios.get(`${env.API}/user/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.success;
    } catch (error) {
      return false;
    }
  };

  const [isAuthorized, setIsAuthorized] = React.useState(false);
  React.useEffect(() => {
    checkToken().then(setIsAuthorized);
  }, []);

  if (!isAuthorized) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-800 font-medium">
          This content is locked and requires authentication. Please log in to
          view.
        </p>
      </div>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: typeof children === "string" ? children : "" }}></div>;
};

export const ArticleTemplate: React.FC<BaseTemplateProps> = ({ page }) => {
  const { title, content, metadata } = page;
  // @ts-ignore
  const parentId = page.slug;

  // Safely cast content to ArticleContent with fallbacks
  const articleContent = JSON.parse(content as unknown as string);
  const mainContent = articleContent.content.mainContent || "";

  const { tags, date, readTime, coverImage } = metadata as {
    tags?: string[];
    date?: string;
    readTime?: string;
    coverImage?: string;
  };

  // Use either the content image or the metadata coverImage
  const displayImage = articleContent.image || coverImage;

  // Function to process content and handle lock tags
  const processContent = (content: string) => {
    const parts = content.split(/(<lock>.*?<\/lock>)/g);
    return parts.map((part, index) => {
      if (part.startsWith("<lock>")) {
        const content = part.replace(/<lock>|<\/lock>/g, "");
        return <LockContent key={index}>{content}</LockContent>;
      }
      return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative w-full overflow-x-hidden">
      {/* TOC Container with checkbox hack for toggle */}
      <input type="checkbox" id="toc-toggle" className="hidden peer" />

      {/* Draggable TOC Button */}
      <DraggableTocButton />

      {/* TOC Sidebar */}
      <div
        className="fixed left-0 top-0 h-full w-[280px] sm:w-[320px] bg-white/95 
      backdrop-blur-sm shadow-xl -translate-x-full peer-checked:translate-x-0 
      transition-all duration-300 ease-in-out z-[90] border-r-2 border-gray-200"
      >
        {/* Close Button - Moved outside scrollable area */}
        <label
          htmlFor="toc-toggle"
          className="absolute top-4 right-4 p-2 cursor-pointer rounded-full
          hover:bg-gray-100 transition-colors duration-200 z-[100]
          bg-white shadow-md border border-gray-200"
        >
          <X className="w-5 h-5 text-gray-600 hover:text-gray-900" />
        </label>

        {/* Left TOC Sidebar */}
        <div className="p-6 h-full mt-[50px] pb-24 overflow-y-auto">
          <div
            className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 
          shadow-inner transition-all duration-300 hover:border-gray-300
          sticky top-[100px]"
          >
            <h3
              className="text-lg font-semibold text-gray-800 mb-4 border-b-2 
            border-gray-300 pb-2 flex items-center gap-2"
            >
              <span className="text-gray-500">📑</span>
              <span>Table of Content</span>
            </h3>
            <div className="pr-2 space-y-1 max-h-[70vh] overflow-y-auto">
              <TableOfContents content={mainContent} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with padding adjustment */}
      <div
        className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-12 
      transition-all duration-300 md:peer-checked:pl-[280px] lg:peer-checked:pl-[320px]"
      >
        <Breadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
          {/* Main Content Column */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-4 sm:space-y-8">
            {/* Featured Image */}
            {displayImage && (
              <div className="bg-white border border-blue-100 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] mb-12">
                <div className="relative w-full h-[400px]">
                  <Image
                    src={displayImage}
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
              <div className="text-center mb-8 sm:mb-12">
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 
                relative inline-block bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text 
                text-transparent px-2"
                >
                  {title}
                </h1>
                {date && (
                  <div className="text-gray-600 mb-2">
                    {new Date(date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
                {readTime && (
                  <div className="text-gray-500 text-sm">
                    ⏱️ {readTime} read
                  </div>
                )}
              </div>

              <div
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
                prose-headings:font-semibold
                prose-headings:tracking-normal
                prose-headings:text-left
                prose-headings:relative
                prose-headings:mb-6
                
                prose-h1:text-3xl sm:prose-h1:text-4xl
                prose-h1:font-bold
                prose-h1:text-gray-800
                prose-h1:leading-tight
                
                prose-h2:text-2xl sm:prose-h2:text-3xl
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
                {processContent(mainContent)}
              </div>
            </div>
            <Comments parentId={parentId} />
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4 sm:space-y-6">
            {/* Search Bar - Always visible at top */}
            <div
              className="bg-white border border-blue-100 rounded-xl shadow-lg p-4 sm:p-6 
            transition-all duration-300 hover:shadow-xl mb-4 sm:mb-6"
            >
              <SearchBar />
            </div>

            {/* Sticky Container */}
            <div className="relative">
              {/* TOC Section */}
              <div className="sticky top-8 space-y-4 sm:space-y-6">
                <div
                  className="hidden lg:block bg-white border border-blue-100 rounded-xl shadow-lg p-4 sm:p-6 
                transition-all duration-300 hover:shadow-xl"
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2">
                    📑 Table of Contents
                  </h3>
                  <div className="pr-2">
                    <TableOfContents content={mainContent} />
                  </div>
                </div>

                {/* Social Media Section - Fixed below TOC */}
                <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2 flex items-center gap-2">
                    <span className="text-blue-500">🌐</span>
                    <span>Connect With Us</span>
                  </h3>
                  <div className="py-2 h-9">
                    <SocialMedia />
                  </div>
                </div>

                {/* Contact Form Section */}
                <div className="bg-white border border-blue-100 rounded-xl shadow-lg">
                  <ContactForm />
                </div>

                <div className="bg-white border border-blue-100 rounded-xl shadow-lg">
                  <Ads imageUrl="/" altText="ads" />
                </div>

                {/* Tags Section - Fixed below Contact Form */}
                {tags && tags.length > 0 && (
                  <div
                    className="bg-white border border-blue-100 rounded-xl shadow-lg p-4 sm:p-6 
                  transition-all duration-300 hover:shadow-xl"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2">
                      🏷️ Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
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
  );
};

export default ArticleTemplate;
