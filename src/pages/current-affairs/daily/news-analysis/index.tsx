import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CurrentAffairsLayout from '@/components/CurrentAffairs/CurrentAffairsLayout';

// This would typically come from your CMS or API
const sampleArticles = [
  {
    slug: 'green-hydrogen-mission',
    title: "India's Green Hydrogen Mission: A Step Towards Clean Energy",
    date: "2024-03-20",
    excerpt: "India has launched its ambitious National Green Hydrogen Mission with an outlay of ₹19,744 crore, aiming to make the country a global hub for green hydrogen production and export.",
    topics: ["Environment", "Energy", "Government Policies"]
  },
  {
    slug: 'supreme-court-electoral-bonds',
    title: "Supreme Court's Verdict on Electoral Bonds Scheme",
    date: "2024-03-19",
    excerpt: "The Supreme Court has struck down the Electoral Bonds Scheme, declaring it unconstitutional. Analysis of the judgment and its implications for electoral funding in India.",
    topics: ["Polity", "Governance", "Current Events"]
  },
  {
    slug: 'india-middle-east-corridor',
    title: "India-Middle East Economic Corridor: Strategic Analysis",
    date: "2024-03-18",
    excerpt: "Examining the strategic and economic implications of the newly announced India-Middle East Economic Corridor and its potential impact on regional trade.",
    topics: ["International Relations", "Economy", "Infrastructure"]
  }
];

const NewsAnalysisListPage = () => {
  return (
    <CurrentAffairsLayout activeSection="/current-affairs/daily/news-analysis">
      <Head>
        <title>Daily News Analysis - UPSC Current Affairs</title>
        <meta 
          name="description" 
          content="Comprehensive daily news analysis for UPSC Civil Services Examination preparation" 
        />
      </Head>

      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Daily News Analysis</h1>
        <p className="text-gray-600">
          In-depth analysis of important current events and their relevance for UPSC Civil Services Examination.
          Updated daily with comprehensive coverage and exam-oriented approach.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select className="px-3 py-2 border rounded-md text-sm text-gray-700">
            <option>All Topics</option>
            <option>Environment</option>
            <option>Economy</option>
            <option>Polity</option>
            <option>International Relations</option>
          </select>
          <select className="px-3 py-2 border rounded-md text-sm text-gray-700">
            <option>Latest First</option>
            <option>Oldest First</option>
            <option>Most Viewed</option>
          </select>
          <input 
            type="text" 
            placeholder="Search articles..." 
            className="px-3 py-2 border rounded-md text-sm flex-grow"
          />
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        {sampleArticles.map((article) => (
          <Link 
            key={article.slug}
            href={`/current-affairs/daily/news-analysis/${article.slug}`}
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <time dateTime={article.date}>{article.date}</time>
                <span className="mx-2">•</span>
                <span>Daily News Analysis</span>
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
      <div className="mt-8 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
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
        <div className="text-sm text-gray-500">
          Showing 1-3 of 50 articles
        </div>
      </div>
    </CurrentAffairsLayout>
  );
};

export default NewsAnalysisListPage; 