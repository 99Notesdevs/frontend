import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface ArticlePreview {
    slug: string;
    title: string;
    description: string;
    image?: string;
    topics: string[];
    readTime?: string;
    lastUpdated?: string;
}

const ancientIndiaArticles: ArticlePreview[] = [
    {
        slug: 'what-is-history',
        title: 'What is History? Sources & Types of History',
        description: 'Understanding the fundamentals of history, its sources, and different types of historical studies',
        image: '/images/what-is-history.jpg',
        topics: ['Definition of History', 'Types of History', 'Historical Timeline', 'Sources of History'],
        readTime: '10 min',
        lastUpdated: '2024-03-15'
    },
    {
        slug: 'prehistoric-india',
        title: 'Prehistoric India: Stone Age Cultures',
        description: 'Explore the earliest human settlements and stone age cultures in the Indian subcontinent',
        image: '/images/prehistoric-india.jpg',
        topics: ['Paleolithic Age', 'Mesolithic Age', 'Neolithic Age', 'Chalcolithic Age'],
        readTime: '15 min',
        lastUpdated: '2024-03-14'
    },
    {
        slug: 'indus-valley-civilization',
        title: 'Indus Valley Civilization',
        description: 'Comprehensive study of one of the world\'s earliest urban civilizations',
        image: '/images/indus-valley.jpg',
        topics: ['Urban Planning', 'Trade & Commerce', 'Art & Culture', 'Decline'],
        readTime: '20 min',
        lastUpdated: '2024-03-13'
    }
];

const AncientIndiaPage = () => {
    const router = useRouter();
    const { gs, section } = router.query;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gray-900 h-72">
                <img
                    src="/images/ancient-india-hero.jpg"
                    alt="Ancient India"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-5xl font-bold mb-4">Ancient India</h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            Explore the rich history of ancient India from prehistoric times to the end of the ancient period
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm font-medium text-gray-500 mb-8">
                    <Link href="/upsc-notes">
                        <span className="hover:text-gray-700 cursor-pointer">UPSC Notes</span>
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href={`/upsc-notes/${gs}`}>
                        <span className="hover:text-gray-700 cursor-pointer">{gs?.toString().toUpperCase()}</span>
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href={`/upsc-notes/${gs}/${section}`}>
                        <span className="hover:text-gray-700 cursor-pointer">History</span>
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Ancient India</span>
                </nav>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ancientIndiaArticles.map((article) => (
                        <div key={article.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            {article.image && (
                                <div className="h-48 bg-gray-200">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h2>
                                <p className="text-gray-600 mb-4">{article.description}</p>
                                
                                {/* Topics */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {article.topics.map((topic, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Meta Information */}
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    {article.readTime && (
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {article.readTime}
                                        </span>
                                    )}
                                    {article.lastUpdated && (
                                        <span>Updated: {article.lastUpdated}</span>
                                    )}
                                </div>

                                <Link href={`/upsc-notes/${gs}/${section}/ancient-india/${article.slug}`}>
                                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300">
                                        Read Article
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AncientIndiaPage; 