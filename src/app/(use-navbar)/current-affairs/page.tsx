import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { env } from '@/config/env';
import ContactForm from '@/components/ui/ContactForm';

interface CurrentAffairPage {
  id: string;
  title: string;
  content: string;
  type: 'daily' | 'monthly' | 'yearly';
  slug: string;
}

const CurrentAffairsIndex = async () => {
  try {
    // Fetch daily current affairs
    const dailyResponse = await fetch(`${env.API}/currentAffair/type/daily`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    const dailyData = await dailyResponse.json();
    const dailyPages = dailyData.data as CurrentAffairPage[];

    // Fetch monthly current affairs
    const monthlyResponse = await fetch(`${env.API}/currentAffair/type/monthly`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    const monthlyData = await monthlyResponse.json();
    const monthlyPages = monthlyData.data as CurrentAffairPage[];

    // Fetch yearly current affairs
    const yearlyResponse = await fetch(`${env.API}/currentAffair/type/yearly`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    const yearlyData = await yearlyResponse.json();
    const yearlyPages = yearlyData.data as CurrentAffairPage[];

    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Current Affairs - 99Notes</title>
          <meta name="description" content="Current Affairs for UPSC Civil Services Examination" />
        </Head>

        <div className="container mx-auto px-4 pt-12 max-w-5xl">
          {/* Daily Current Affairs */}
          <div className="mb-16">
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Daily Current Affairs</h2>
              <div className="w-24 h-1 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dailyPages.map((page) => (
                <Link key={page.id} href={`/${page.slug}`} className="group">
                  <div className="rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 h-[400px] flex flex-col justify-between transform hover:-translate-y-1 border border-gray-100">
                    <div>
                      <div className="flex flex-col items-center mb-8">
                      <span className="mb-6 group-hover:text-yellow-600 transition-colors">
                          <Image src="/news.png" alt="News" width={50} height={50} />
                        </span>
                        <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors text-center">
                          {page.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {page.content}
                      </p>
                    </div>
                    <div className="text-yellow-500 group-hover:text-yellow-600 font-medium flex items-center justify-center">
                      <span className="text-sm">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Monthly Current Affairs */}
          <div className="mb-16">
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Monthly Current Affairs</h2>
              <div className="w-24 h-1 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {monthlyPages.map((page) => (
                <Link key={page.id} href={`/${page.slug}`} className="group">
                  <div className="bg-gray-50 rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 h-[350px] flex flex-col justify-between transform hover:-translate-y-1 border border-gray-100">
                    <div>
                      <div className="flex flex-col items-center mb-8">
                        <span className="mb-6 group-hover:text-yellow-600 transition-colors">
                          <Image src="/news.png" alt="News" width={50} height={50} />
                        </span>
                        <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors text-center">
                          {page.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {page.content}
                      </p>
                    </div>
                    <div className="text-yellow-500 group-hover:text-yellow-600 font-medium flex items-center justify-center">
                      <span className="text-sm">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Yearly Current Affairs */}
          <div className="mb-16">
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Yearly Current Affairs</h2>
              <div className="w-24 h-1 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {yearlyPages.map((page) => (
                <Link key={page.id} href={`/${page.slug}`} className="group">
                  <div className="bg-gray-50 rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 h-[350px] flex flex-col justify-between transform hover:-translate-y-1 border border-gray-100">
                    <div>
                      <div className="flex flex-col items-center mb-8">
                      <span className="mb-6 group-hover:text-yellow-600 transition-colors">
                          <Image src="/news.png" alt="News" width={50} height={50} />
                        </span>
                        <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors text-center">
                          {page.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {page.content}
                      </p>
                    </div>
                    <div className="text-yellow-500 group-hover:text-yellow-600 font-medium flex items-center justify-center">
                      <span className="text-sm">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
          <div className="container mx-auto max-w-2xl mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Contact Us</h2>
                <ContactForm />
          </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching current affairs:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Content</h2>
            <p className="text-gray-600">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
      </div>
    );
  }
};

export default CurrentAffairsIndex;