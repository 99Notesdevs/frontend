import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import CurrentAffairsLayout from '@/components/CurrentAffairs/CurrentAffairsLayout';
import { sectionConfig } from '@/config/currentAffairs';

// This interface should match your database schema
interface Article {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  topics: string[];
  type: string;
}

interface PageConfig {
  title: string;
  description: string;
  topics: string[];
}

// Sample data generator based on category and section
const generateSampleArticles = (category: string, section: string): Article[] => {
  if (section === 'hindu-editorial') {
    return [
      {
        slug: 'climate-change-policy',
        title: "Climate Action: India's Path to Net-Zero Emissions",
        date: new Date().toISOString(),
        excerpt: "Analysis of The Hindu editorial discussing India's climate change commitments, policy framework, and the challenges in achieving net-zero emissions targets.",
        topics: ['Environment', 'International Relations', 'Economy'],
        type: section
      },
      {
        slug: 'judicial-reforms',
        title: "Reforming India's Judiciary: Challenges and Solutions",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        excerpt: "The Hindu editorial examines the pressing need for judicial reforms in India, focusing on pendency of cases, infrastructure needs, and modernization of courts.",
        topics: ['Polity', 'Governance', 'Social Issues'],
        type: section
      },
      {
        slug: 'digital-economy',
        title: "Digital India: Opportunities and Challenges",
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        excerpt: "Analysis of The Hindu editorial on India's digital transformation, covering digital payments, e-governance initiatives, and cybersecurity concerns.",
        topics: ['Economy', 'Technology', 'Governance'],
        type: section
      }
    ];
  }
  
  // Default sample articles for other sections
  const baseArticles = [
    {
      slug: 'sample-article-1',
      title: `Sample ${section} Article 1`,
      date: new Date().toISOString(),
      excerpt: `This is a sample ${section} article for ${category} current affairs.`,
      topics: sectionConfig[section]?.topics.slice(0, 2) || ['General'],
      type: section
    },
    {
      slug: 'sample-article-2',
      title: `Sample ${section} Article 2`,
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      excerpt: `Another sample ${section} article for ${category} current affairs.`,
      topics: sectionConfig[section]?.topics.slice(1, 3) || ['General'],
      type: section
    }
  ];

  return baseArticles;
};

const CurrentAffairsSectionPage = () => {
  const router = useRouter();
  const { category, section } = router.query;
  const path = `/current-affairs/${category}/${section}`;

  // State for filters
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');

  // Get configuration for the current section
  const config = sectionConfig[section as string] || {
    title: 'Current Affairs',
    description: 'Stay updated with comprehensive coverage of current affairs.',
    topics: ['General']
  };

  // Generate sample articles
  const articles = generateSampleArticles(category as string, section as string);

  // Filter and sort articles
  const filteredArticles = articles
    .filter(article => {
      const matchesTopic = selectedTopic === 'all' || article.topics.includes(selectedTopic);
      const matchesSearch = !searchQuery || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTopic && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'latest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  return (
    <CurrentAffairsLayout activeSection={path}>
      <Head>
        <title>{config.title} - UPSC Current Affairs</title>
        <meta name="description" content={config.description} />
      </Head>

      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{config.title}</h1>
        <p className="text-gray-600">{config.description}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select 
            className="px-3 py-2 border rounded-md text-sm text-gray-700"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="all">All Topics</option>
            {config.topics.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
          <select 
            className="px-3 py-2 border rounded-md text-sm text-gray-700"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <input 
            type="text" 
            placeholder="Search articles..." 
            className="px-3 py-2 border rounded-md text-sm flex-grow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        {filteredArticles.map((article) => (
          <Link 
            key={article.slug}
            href={`/current-affairs/${category}/${section}/${article.slug}`}
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span className="mx-2">•</span>
                <span>{config.title}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {article.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            1
          </button>
          <button className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Showing {filteredArticles.length} articles
        </div>
      </div>
    </CurrentAffairsLayout>
  );
};

export default CurrentAffairsSectionPage; 