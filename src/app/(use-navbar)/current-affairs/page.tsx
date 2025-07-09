import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { env } from '@/config/env';
import ContactForm from "@/components/common/ContactForm/ContactForm";

interface CurrentAffairPage {
  id: string;
  title: string;
  content: string;
  type: 'daily' | 'monthly' | 'yearly';
  slug: string;
  link?: string;
}

const formatContent = (content: string) => {
  // Remove HTML tags and extract first few lines
  const text = content.replace(/<[^>]+>/g, '').trim();
  const lines = text.split('\n').filter(line => line.trim());
  return lines.slice(0, 3).join(' ').replace(/\s+/g, ' ');
};

const CurrentAffairsIndex = async () => {
  try {
    // Fetch daily current affairs
    const dailyResponse = await fetch(`${env.API}/currentAffair/type/daily`);
    const dailyData = await dailyResponse.json();
    const dailyPages = dailyData.data.filter((page: CurrentAffairPage) => !page.link) as CurrentAffairPage[];

    // Fetch monthly current affairs
    const monthlyResponse = await fetch(`${env.API}/currentAffair/type/monthly`);
    const monthlyData = await monthlyResponse.json();
    const monthlyPages = monthlyData.data.filter((page: CurrentAffairPage) => !page.link) as CurrentAffairPage[];

    // Fetch yearly current affairs
    const yearlyResponse = await fetch(`${env.API}/currentAffair/type/yearly`);
    const yearlyData = await yearlyResponse.json();
    const yearlyPages = yearlyData.data.filter((page: CurrentAffairPage) => !page.link) as CurrentAffairPage[];

    return (
      <>
      <Head>
          <title>Current Affairs - 99Notes</title>
          <meta
            name="description"
            content="Current Affairs for UPSC Civil Services Examination"
            />
        </Head>
      <div className="min-h-screen bg-[var(--bg-elevated)] dark:bg-slate-900">
        

        <div className="container mx-auto px-4 pt-2 pb-12 max-w-7xl">
          {/* Daily Current Affairs */}
          <div className="mb-16 mt-12">
            <div className="flex flex-col items-center mb-8 pt-2 sm:mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-strong)] dark:text-white mb-3 text-center">
                Daily Current Affairs Analysis UPSC With Short Notes Topic Wise
              </h2>
              <div className="w-40 sm:w-96 h-1 bg-[var(--nav-secondary)] dark:bg-blue-500 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {dailyPages.map((page) => (
                <Link key={page.id} href={`/${page.slug}`} className="group block w-full">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-8 hover:shadow-xl transition-all duration-300 h-[400px] border border-[var(--border-light)] dark:border-slate-700 mx-auto max-w-sm flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col items-center mb-6">
                        <span className="mb-4 group-hover:text-[var(--nav-secondary)] transition-colors">
                          <Image
                            src="/news.png"
                            alt="News"
                            width={48}
                            height={48}
                          />
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-[var(--brand-identity)] dark:text-blue-400 group-hover:text-[var(--nav-secondary)] dark:group-hover:text-blue-300 transition-colors text-center">
                          {page.title}
                        </h3>
                      </div>
                      <div className="text-[var(--text-tertiary)] dark:text-slate-300 text-sm leading-relaxed h-[180px] overflow-hidden px-2">
                        <p className="block overflow-hidden text-ellipsis">
                          {formatContent(page.content)}
                        </p>
                      </div>
                    </div>
                    <div className="text-[var(--nav-primary)] dark:text-blue-400 group-hover:text-[var(--nav-secondary)] dark:group-hover:text-blue-300 font-medium flex items-center justify-center mt-4">
                      <span className="text-sm">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Monthly Current Affairs */}
          <div className="mb-16">
            <div className="flex flex-col items-center mb-8 sm:mb-10">
              <h2 className="text-xl sm:text-2xl font-medium text-[var(--text-strong)] mb-3 text-center">
                Monthly Current Affairs UPSC
              </h2>
              <div className="w-32 sm:w-80 h-1 bg-[var(--nav-secondary)] rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {monthlyPages.map((page) => (
                <Link key={page.id} href={`/${page.slug}`} className="group block w-full">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-8 hover:shadow-xl transition-all duration-300 h-[400px] border border-[var(--border-light)] dark:border-slate-700 mx-auto max-w-sm flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col items-center mb-6">
                        <span className="mb-4 group-hover:text-[var(--nav-secondary)] transition-colors">
                          <Image
                            src="/news.png"
                            alt="News"
                            width={48}
                            height={48}
                          />
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-[var(--brand-identity)] group-hover:text-[var(--nav-secondary)] transition-colors text-center mb-6">
                          {page.title}
                        </h3>
                      </div>
                      <div className="text-[var(--text-tertiary)] dark:text-slate-300 text-sm leading-relaxed h-[180px] overflow-hidden px-2">
                        <p className="block overflow-hidden text-ellipsis">
                          {formatContent(page.content)}
                        </p>
                      </div>
                    </div>
                    <div className="text-[var(--nav-primary)] dark:text-blue-400 group-hover:text-[var(--nav-secondary)] dark:group-hover:text-blue-300 font-medium flex items-center justify-center mt-4">
                      <span className="text-sm">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Yearly Current Affairs */}
          <div className="mb-16">
            <div className="flex flex-col items-center mb-8 sm:mb-10">
              <h2 className="text-xl sm:text-2xl font-medium text-[var(--text-strong)] mb-3 text-center">
                Yearly Current Affairs UPSC
              </h2>
              <div className="w-32 sm:w-80 h-1 bg-[var(--nav-secondary)] rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {yearlyPages.map((page) => (
                <Link key={page.id} href={`/${page.slug}`} className="group block w-full">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-8 hover:shadow-xl transition-all duration-300 h-[400px] border border-[var(--border-light)] dark:border-slate-700 mx-auto max-w-sm flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col items-center mb-6">
                        <span className="mb-4 group-hover:text-[var(--nav-secondary)] transition-colors">
                          <Image
                            src="/news.png"
                            alt="News"
                            width={48}
                            height={48}
                          />
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-[var(--brand-identity)] group-hover:text-[var(--nav-secondary)] transition-colors text-center mb-6">
                          {page.title}
                        </h3>
                      </div>
                      <div className="text-[var(--text-tertiary)] dark:text-slate-300 text-sm leading-relaxed h-[180px] overflow-hidden px-2">
                        <p className="block overflow-hidden text-ellipsis">
                          {formatContent(page.content)}
                        </p>
                      </div>
                    </div>
                    <div className="text-[var(--nav-primary)] dark:text-blue-400 group-hover:text-[var(--nav-secondary)] dark:group-hover:text-blue-300 font-medium flex items-center justify-center mt-4">
                      <span className="text-sm">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="container mx-auto max-w-2xl pb-5 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--surface-darker)] dark:text-white mb-2 text-center">
            Contact Us
          </h2>
          <ContactForm />
        </div>
     
      </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching current affairs:', error);
    return (  
      <div className="min-h-screen bg-[var(--bg-main)] dark:bg-slate-900">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-[var(--surface-darker)] dark:text-white mb-4">Error Loading Content</h2>
            <p className="text-[var(--text-tertiary)] dark:text-slate-300">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
      </div>
    );
  }
};

export default CurrentAffairsIndex;