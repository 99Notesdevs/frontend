import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CurrentAffairsArticle from '@/components/CurrentAffairs/CurrentAffairsArticle';
import CurrentAffairsLayout from '@/components/CurrentAffairs/CurrentAffairsLayout';

// This would typically come from your CMS or API
const sampleArticle = {
  title: "India's Green Hydrogen Mission: A Step Towards Clean Energy",
  date: "2024-03-20",
  content: `
    <h2>Introduction</h2>
    <p>India has launched its ambitious National Green Hydrogen Mission with an outlay of ₹19,744 crore, aiming to make the country a global hub for green hydrogen production and export.</p>

    <h2>Key Points</h2>
    <ul>
      <li>The mission aims to develop green hydrogen production capacity of at least 5 MMT per annum by 2030</li>
      <li>Expected to create over 6 lakh jobs and attract investments of more than ₹8 lakh crore</li>
      <li>Focus on developing indigenous manufacturing capabilities and R&D infrastructure</li>
    </ul>

    <h2>Significance</h2>
    <p>The mission represents a major step towards achieving India's climate goals and energy security. It will help reduce dependence on fossil fuels and promote sustainable development.</p>

    <h2>Challenges</h2>
    <ul>
      <li>High production costs</li>
      <li>Infrastructure development needs</li>
      <li>Technology gaps</li>
      <li>Market development</li>
    </ul>

    <h2>Way Forward</h2>
    <p>Success of the mission will depend on effective implementation, policy support, and development of the entire green hydrogen ecosystem including production, storage, and transportation infrastructure.</p>
  `,
  topics: [
    "Environment",
    "Energy",
    "Government Policies",
    "Science & Technology"
  ],
  relatedArticles: [
    {
      title: "India's Solar Energy Goals: Progress and Challenges",
      path: "/current-affairs/daily/news-analysis/india-solar-energy-goals"
    },
    {
      title: "National Hydrogen Energy Mission: Key Features",
      path: "/current-affairs/daily/news-analysis/national-hydrogen-energy-mission"
    },
    {
      title: "Renewable Energy Targets: A Global Perspective",
      path: "/current-affairs/daily/news-analysis/renewable-energy-targets"
    }
  ],
  pdfLink: "/pdfs/green-hydrogen-mission-notes.pdf"
};

const CurrentAffairsArticlePage = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <CurrentAffairsLayout activeSection="/current-affairs/daily/news-analysis">
      <Head>
        <title>{sampleArticle.title} - UPSC Current Affairs</title>
        <meta name="description" content={sampleArticle.title} />
      </Head>

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm font-medium text-gray-500 mb-8">
        <a href="/current-affairs" className="hover:text-gray-900">Current Affairs</a>
        <span className="mx-2">/</span>
        <a href="/current-affairs/daily" className="hover:text-gray-900">Daily</a>
        <span className="mx-2">/</span>
        <a href="/current-affairs/daily/news-analysis" className="hover:text-gray-900">News Analysis</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{slug}</span>
      </nav>

      <CurrentAffairsArticle {...sampleArticle} />

      {/* Additional Resources */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="#"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="text-2xl mr-3">📝</span>
              <div>
                <h3 className="font-medium text-gray-900">Practice Questions</h3>
                <p className="text-sm text-gray-600">Test your understanding</p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="text-2xl mr-3">📚</span>
              <div>
                <h3 className="font-medium text-gray-900">Study Material</h3>
                <p className="text-sm text-gray-600">Additional reading material</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </CurrentAffairsLayout>
  );
};

export default CurrentAffairsArticlePage; 