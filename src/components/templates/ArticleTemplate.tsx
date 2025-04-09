"use client";
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
import DraggableTocButton from "@/components/navigation/DraggableTocButton";
import { Comments } from "@/components/ui/comments";
import Ads from "../navigation/Ads";
import { env } from "@/config/env";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const LockBox = () => {
  const router = useRouter();
  return (
    <div className="relative bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 p-8 shadow-lg my-8 transform hover:scale-[1.02] transition-all duration-300">
      <div className="absolute -top-3 -left-3 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12v6a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V8a2 2 0 012-2h5l5 4V8l-1.8-.4a4.74 4.74 0 01.4-2.3zM5 12a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2h-5l-5 4v-4H5a2 2 0 01-2-2v-4z" />
        </svg>
      </div>
      
      <div className="flex flex-col items-center text-center">
        <h3 className="text-2xl font-bold text-red-800 mb-4">🔒 This Content is Locked</h3>
        <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
          Please subscribe to unlock full access to this article. Get instant access to premium content and exclusive study materials.
        </p>
        <button
          onClick={() => router.push("/users/login")}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/50 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

const parseLockedContent = (content: string, isAuthorized: boolean): (string | JSX.Element)[] => {
  const parts = content.split(/<lock>(.*?)<\/lock>/g);
  const result: (string | JSX.Element)[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      result.push(parts[i]);
    } else {
      result.push(isAuthorized ? parts[i] : <LockBox key={`lock-${i}`} />);
    }
  }
  return result;
};

export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ page }) => {
  const router = useRouter();
  const { title, content, metadata } = page;
  const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null);
  const [mainContentFinal, setMainContentFinal] = useState<(string | JSX.Element)[]>([]);
  const token = Cookies.get("token");

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }
      try {
        const res = await axios.get(`${env.API}/user/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthorized(res.data.success);
      } catch {
        setIsAuthorized(false);
      }
    };
    checkAuthorization();
  }, [token]);

  useEffect(() => {
    if (isAuthorized !== null) {
      const result = parseLockedContent(content || "", isAuthorized);
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

  const parentId = page.slug;
  const { tags, date, readTime, coverImage } = (metadata as any) || {};
  const displayImage = (page.imageUrl || coverImage) as string;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative w-full overflow-x-hidden">
      <input type="checkbox" id="toc-toggle" className="hidden peer" />
      <DraggableTocButton />

      <div className="fixed left-0 top-0 h-full w-[280px] sm:w-[320px] bg-white/95 backdrop-blur-sm shadow-xl -translate-x-full peer-checked:translate-x-0 transition-all duration-300 ease-in-out z-[90] border-r-2 border-gray-200">
        <label htmlFor="toc-toggle" className="absolute top-4 right-4 p-2 cursor-pointer rounded-full hover:bg-gray-100 transition-colors duration-200 z-[100] bg-white shadow-md border border-gray-200">
          <X className="w-5 h-5 text-gray-600 hover:text-gray-900" />
        </label>
        <div className="p-6 h-full mt-[50px] pb-24 overflow-y-auto">
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 shadow-inner transition-all duration-300 hover:border-gray-300 sticky top-[100px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2 flex items-center gap-2">
              <span className="text-gray-500">📑</span>
              <span>Table of Content</span>
            </h3>
            <div className="pr-2 space-y-1 max-h-[70vh] overflow-y-auto">
              <TableOfContents content={content} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-12 transition-all duration-300 md:peer-checked:pl-[280px] lg:peer-checked:pl-[320px]">
        <Breadcrumb />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
          <main className="lg:col-span-8 xl:col-span-9 space-y-4 sm:space-y-8">
            {displayImage && (
              <div className="bg-white border border-blue-100 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] mb-12">
                <div className="relative w-full h-[400px]">
                  <Image src={displayImage} alt={title} fill className="object-cover" priority />
                </div>
              </div>
            )}

            <div className="bg-white border rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 relative inline-block bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent px-2">
                  {title}
                </h1>
              </div>
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none [&>*]:w-full">
                {mainContentFinal.map((part, idx) =>
                  typeof part === "string" ? (
                    <div key={idx} dangerouslySetInnerHTML={{ __html: part }} />
                  ) : (
                    <div key={idx}>{part}</div>
                  )
                )}
              </div>
            </div>

            <Comments parentId={parentId} />
          </main>

          <aside className="lg:col-span-4 xl:col-span-3 space-y-4 sm:space-y-6">
            <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl mb-4 sm:mb-6">
              <SearchBar />
            </div>

            <div className="relative">
              <div className="sticky top-8 space-y-4 sm:space-y-6">
                <div className="hidden lg:block bg-white border border-blue-100 rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2">📑 Table of Contents</h3>
                  <div className="pr-2">
                    <TableOfContents content={content} />
                  </div>
                </div>

                <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2 flex items-center gap-2">
                    <span className="text-blue-500">🌐</span>
                    <span>Connect With Us</span>
                  </h3>
                  <div className="py-2 h-9">
                    <SocialMedia />
                  </div>
                </div>

                <div className="bg-white border border-blue-100 rounded-xl shadow-lg">
                   <ContactForm />
               </div>

                <div className="bg-white border border-blue-100 rounded-xl shadow-lg">
                  <Ads imageUrl="/" altText="ads" />
                </div>

                {tags && tags.length > 0 && (
                  <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2">🏷 Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag:any) => (
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
