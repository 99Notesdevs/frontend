'use client';
import { useState, useEffect } from "react";
import { ArticleTemplateProps } from "./types";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import SearchBar from "@/components/Navbar/SearchBar";
import Image from "next/image";
import { X } from "lucide-react";
import SocialMedia from "@/components/navigation/socialmedia";
import ContactForm from "@/components/common/ContactForm/ContactForm";
import AssistiveTouch from "@/components/navigation/Assistivetouch";
import { Comments } from "@/components/ui/comments";
import Ads from "../navigation/Ads";
import { env } from "@/config/env";
import axios from "axios";
import Cookies from "js-cookie";
import WhatsApp from '@/components/ui/whatsapp';
const processContent = (content: string, isAuthorized: boolean) => {
  return content.replace(/<lock>(.*?)<\/lock>/g, (lockedContent) => {
    return isAuthorized
      ? lockedContent
      : `<div class="locked-content">
           <p>${lockedContent}</p>
           <a href="/subscription" class="login-link">Subscribe</a>
         </div>`;
  });
};

export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ page }) => {
  const { title, content, metadata } = page;
  const parsedMetadata = typeof metadata === 'string' ? JSON.parse(metadata) : metadata || {};

  const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null);
  const [mainContentFinal, setMainContentFinal] = useState(content || "");
  const token = Cookies.get("token");
  // @ts-ignore
  const jsonLD = parsedMetadata.schemaData;

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
    if (isAuthorized !== null) {
      const result = processContent(content || "", isAuthorized);
      setMainContentFinal(result);
    }
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

  const { tags, coverImage } =
    parsedMetadata || {};

  // Use either the content image or the metadata coverImage
  // @ts-ignore
  const displayImage = page.imageUrl || coverImage as string;

  // Function to process content and handle lock tags
  return (
    <>
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLD }}
        />
      </section>
      <main>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative w-full overflow-x-hidden">
          {/* Assistive Touch */}
          <AssistiveTouch content={mainContentFinal} />


          {/* Main Content with padding adjustment */}
          <div
            className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-12 
        transition-all duration-300 md:peer-checked:pl-[280px] lg:peer-checked:pl-[320px]"
          >
            {/* <Breadcrumb /> */}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 mt-4 sm:mt-12">
              {/* Main Content Column */}
              <main className="lg:col-start-1 lg:col-span-6 xl:col-start-2 xl:col-span-7 space-y-4 sm:space-y-8">
                {/* Featured Image */}
                {displayImage && (
                  <div className="bg-white border border-blue-100 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] mb-12">
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
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {page.parent.title}
                        </a>
                      </div>
                    )}
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {parsedMetadata.metaTitle || 'Untitled Article'}
                    </h1>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Created: {page.createdAt ? new Date(page.createdAt).toLocaleDateString() : 'N/A'}
                  </div>

                  <WhatsApp />
                  <div className="text-center mb-8 sm:mb-12">
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
                    {mainContentFinal}
                  </div>
                </div>
                <Comments parentId={parentId} />

              </main>
              {/* Right Sidebar */}
              <aside className="lg:col-start-7 xl:col-start-9 lg:col-span-3 xl:col-span-3 space-y-4 sm:space-y-6">
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
                         Table of Contents
                      </h3>
                      <div className="pr-2">
                        <TableOfContents content={mainContentFinal} />
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
                          🏷 Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag: string) => (
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
              </aside>{" "}
            </div>
           
          </div>
        </div>
      </main>
    </>
  );
};

export default ArticleTemplate;