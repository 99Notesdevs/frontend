import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { navigationSections } from '@/config/currentAffairs';

const CategoryIndex = () => {
  const router = useRouter();
  const { category } = router.query;

  // Find the current category section
  const currentSection = navigationSections.find(section => {
    return section.items.some(item => item.path.includes(`/${category}/`));
  });

  if (!currentSection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The requested category does not exist.</p>
          <Link 
            href="/current-affairs"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Back to Current Affairs
          </Link>
        </div>
      </div>
    );
  }

  // Filter items for the current category
  const categoryItems = currentSection.items.filter(item => 
    item.path.includes(`/${category}/`)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 h-72">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentSection.title}</h1>
            <p className="text-xl opacity-90">
              {getCategoryDescription(category as string)}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-gray-500 mb-8">
          <Link href="/current-affairs">
            <span className="hover:text-gray-700 cursor-pointer">Current Affairs</span>
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{currentSection.title}</span>
        </nav>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryItems.map((item, index) => (
            <Link key={index} href={item.path} className="group">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {getSectionDescription(item.title)}
                </p>
                <div className="mt-4 flex items-center text-sm text-blue-600 group-hover:text-blue-800">
                  View Section
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getCategoryFeatures(category as string).map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get category description
const getCategoryDescription = (category: string): string => {
  const descriptions: { [key: string]: string } = {
    'daily': 'Stay updated with comprehensive daily current affairs coverage for UPSC preparation',
    'monthly': 'Access monthly magazines and compilations for in-depth UPSC preparation',
    'yearly': 'Important yearly documents and reports for UPSC Civil Services Examination'
  };

  return descriptions[category] || 'Comprehensive current affairs coverage for UPSC preparation';
};

// Helper function to get section description
const getSectionDescription = (title: string): string => {
  const descriptions: { [key: string]: string } = {
    'Daily News Analysis': 'Comprehensive analysis of important current events with UPSC perspective',
    'The Hindu Editorial': 'In-depth analysis of The Hindu newspaper editorials',
    'Indian Express Editorial': 'Analysis of Indian Express editorials with UPSC relevance',
    'PIB Analysis': 'Coverage of important government announcements and initiatives',
    'Daily MCQ Quiz': 'Practice questions based on current affairs',
    'Answer Writing Practice': 'Daily answer writing questions for Mains preparation',
    'Monthly Compilation': 'Monthly digest of important current affairs',
    'Yojana Magazine': 'Analysis of Yojana magazine for UPSC preparation',
    'Kurukshetra Magazine': 'Coverage of Kurukshetra magazine with rural focus',
    'Science Reporter': 'Important science and technology updates',
    'Union Budget': 'Comprehensive analysis of Union Budget',
    'Economic Survey': 'Key insights from Economic Survey',
    'Year End Review': 'Annual compilation of important events'
  };

  return descriptions[title] || 'Stay updated with comprehensive coverage';
};

// Helper function to get category features
const getCategoryFeatures = (category: string) => {
  const features: { [key: string]: Array<{ icon: string; title: string; description: string }> } = {
    'daily': [
      {
        icon: '🔄',
        title: 'Daily Updates',
        description: 'Fresh content updated every day with the latest developments'
      },
      {
        icon: '📝',
        title: 'Practice Questions',
        description: 'MCQs and answer writing questions based on daily current affairs'
      },
      {
        icon: '🎯',
        title: 'UPSC Focus',
        description: 'Content specifically curated for civil services examination'
      }
    ],
    'monthly': [
      {
        icon: '📚',
        title: 'Comprehensive Coverage',
        description: 'In-depth analysis of monthly magazines and current affairs'
      },
      {
        icon: '📊',
        title: 'Structured Learning',
        description: 'Organized content for systematic preparation'
      },
      {
        icon: '🔍',
        title: 'Topic-wise Analysis',
        description: 'Detailed coverage of important topics from various sources'
      }
    ],
    'yearly': [
      {
        icon: '📈',
        title: 'Economic Focus',
        description: 'Detailed analysis of budget and economic developments'
      },
      {
        icon: '📋',
        title: 'Annual Reviews',
        description: 'Comprehensive year-end analysis of important events'
      },
      {
        icon: '🎯',
        title: 'Exam Relevance',
        description: 'Focus on UPSC-relevant aspects of yearly documents'
      }
    ]
  };

  return features[category] || features['daily'];
};

export default CategoryIndex; 