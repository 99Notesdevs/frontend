import React from 'react';
import { BaseTemplateProps } from './types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { TableOfContents } from '@/components/navigation/TableOfContents';
import SearchBar from '@/components/Navbar/SearchBar';
import SocialMedia from '@/components/navigation/socialmedia';
import Ads from '../navigation/Ads';
import ContactForm from "@/components/common/ContactForm/ContactForm";
import ContactMap from '@/components/ui/ContactMap';

interface CurrentAffairContent {
  title: string;
  content: string;
}

export const CurrentAffairTemplate: React.FC<BaseTemplateProps> = ({ page }) => {
  const { title, content, children } = page;
  const mainContent = content || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-secondary to-white">
      <div className="min-h-screen bg-background-tertiary">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Main Content */}
          <div className="mb-16">
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-2xl font-bold text-primary mb-3">{title}</h2>
              <div className="w-24 h-1 bg-accent-color rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {children?.map((child: any) => (
                <Link key={child.id} href={`/${child.slug}`} className="group">
                  <div className="bg-background-tertiary rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 h-[450px] flex flex-col justify-between transform hover:-translate-y-1 border border-background-secondary">
                    <div>
                      <div className="flex flex-col items-center mb-8">
                        <h3 className="text-2xl font-semibold text-primary group-hover:text-accent-color transition-colors text-center">
                          {child.title}
                  </h3>
                  </div>
                      <div className="text-gray-600 text-lg leading-relaxed h-[100px] overflow-hidden">
                        <span className="block overflow-hidden text-ellipsis">
                          <span 
                            dangerouslySetInnerHTML={{ __html: child.content }}
                            className="block overflow-hidden text-ellipsis"
                          ></span>
                        </span>
                      </div>
                </div>
                    <div className="text-yellow-500 group-hover:text-yellow-600 font-medium flex items-center justify-center">
                      <span className="text-sm">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="text-yellow-500 group-hover:text-yellow-600 font-medium flex items-center justify-center">
                <div dangerouslySetInnerHTML={{ __html: mainContent }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ContactForm />
              <ContactMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairTemplate;