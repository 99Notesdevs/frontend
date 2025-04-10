import React from "react";
import { BaseTemplateProps } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import SearchBar from "@/components/Navbar/SearchBar";
import SocialMedia from "@/components/navigation/socialmedia";
import Ads from "../navigation/Ads";
import ContactForm from "@/components/common/ContactForm/ContactForm";
import ContactMap from "@/components/ui/ContactMap";

export const CurrentAffairTemplate: React.FC<BaseTemplateProps> = ({
  page,
}) => {
  const { title, content, children } = page;
  const mainContent = content || "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-secondary to-white">
      <div className="bg-background-tertiary py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Page Title */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-primary mb-3">{title}</h2>
            <div className="w-24 h-1 bg-accent-color rounded-full mx-auto"></div>
          </div>

          {/* Main Content */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Child Cards */}
              {children?.map((child: any) => (
                <Link key={child.id} href={`/${child.slug}`} className="group">
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 h-[400px] flex flex-col justify-between border border-gray-200">
                    <div>
                      <h3 className="text-xl font-semibold text-primary group-hover:text-accent-color transition-colors text-center mb-4">
                        {child.title}
                      </h3>
                      <div className="text-gray-600 text-sm leading-relaxed h-[80px] overflow-hidden">
                        <span
                          dangerouslySetInnerHTML={{ __html: child.content }}
                          className="block overflow-hidden text-ellipsis"
                        ></span>
                      </div>
                    </div>
                    <div className="text-yellow-500 group-hover:text-yellow-600 font-medium flex items-center justify-center mt-4">
                      <span className="text-sm">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Main Content */}
            {mainContent && (
              <div className="mt-12">
                <div
                  className="prose prose-lg text-gray-700 mx-auto"
                  dangerouslySetInnerHTML={{ __html: mainContent }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ContactForm />
            <ContactMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairTemplate;
