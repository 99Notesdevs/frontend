"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { env } from '@/config/env';

// Helper function to replace lodash capitalize
const capitalize = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

interface ArticlePreview {
    slug: string;
    title: string;
    image?: string;
    tags: string[];
    createdAt?: string;
    updatedAt?: string;
}

// ------------
// Sample data structure for different subsections
// const sampleArticles: Record<string, ArticlePreview[]> = {
//     'ancient-india': [
//         {
//             slug: 'introduction-ancient-india',
//             title: 'Introduction to Ancient India',
//             description: 'A comprehensive overview of Ancient Indian history, from the Indus Valley Civilization to the Gupta Empire',
//             image: '/images/ancient-india-intro.jpg',
//             topics: ['Indus Valley', 'Vedic Period', 'Mauryan Empire', 'Gupta Dynasty'],
//             readTime: '15 min',
//             lastUpdated: '2024-03-15'
//         },
//         {
//             slug: 'indus-valley-civilization',
//             title: 'Indus Valley Civilization',
//             description: 'Explore the urban planning, trade networks, and cultural achievements of the Indus Valley Civilization',
//             topics: ['Urban Planning', 'Trade Routes', 'Art & Culture', 'Decline'],
//             readTime: '20 min',
//             lastUpdated: '2024-03-14'
//         }
//     ],
//     'medieval-india': [
//         {
//             slug: 'delhi-sultanate',
//             title: 'The Delhi Sultanate',
//             description: 'Understanding the five dynasties that ruled Delhi and their impact on Indian history',
//             topics: ['Slave Dynasty', 'Khilji Dynasty', 'Tughlaq Dynasty', 'Administration'],
//             readTime: '25 min',
//             lastUpdated: '2024-03-13'
//         }
//     ],
//     'monetary-policy': [
//         {
//             slug: 'rbi-functions',
//             title: 'Functions of RBI',
//             description: 'Detailed analysis of the roles and responsibilities of the Reserve Bank of India',
//             topics: ['Monetary Policy', 'Banking Regulation', 'Currency Management'],
//             readTime: '18 min',
//             lastUpdated: '2024-03-15'
//         }
//     ],
//     'indian-constitution': [
//         {
//             slug: 'introduction-constitution',
//             title: 'Introduction to Indian Constitution',
//             description: 'Understanding the historical background, making, and salient features of the Indian Constitution',
//             topics: ['Historical Background', 'Constituent Assembly', 'Salient Features'],
//             readTime: '20 min',
//             lastUpdated: '2024-03-15'
//         },
//         {
//             slug: 'fundamental-rights',
//             title: 'Fundamental Rights',
//             description: 'Comprehensive guide to the Fundamental Rights guaranteed by the Indian Constitution',
//             topics: ['Right to Equality', 'Right to Freedom', 'Right against Exploitation'],
//             readTime: '22 min',
//             lastUpdated: '2024-03-14'
//         },
//         {
//             slug: 'directive-principles',
//             title: 'Directive Principles of State Policy',
//             description: 'Understanding the guidelines and principles for the state to follow while making laws',
//             topics: ['Socialistic Principles', 'Gandhian Principles', 'Liberal-Intellectual Principles'],
//             readTime: '18 min',
//             lastUpdated: '2024-03-13'
//         },
//         {
//             slug: 'union-executive',
//             title: 'Union Executive',
//             description: 'Detailed analysis of the President, Prime Minister, and Council of Ministers',
//             topics: ['President', 'Prime Minister', 'Council of Ministers', 'Cabinet'],
//             readTime: '25 min',
//             lastUpdated: '2024-03-12'
//         }
//     ]
// };

// // This would typically come from your API or database
// const getArticlesForSubsectiontest = (gs: string, section: string, subsection: string): ArticlePreview[] => {
//     // In production, this would be an API call
//     return sampleArticles[subsection] || [
//         {
//             slug: `introduction-${subsection}`,
//             title: `Introduction to ${formatBreadcrumbText(subsection)}`,
//             description: `Comprehensive overview of ${formatBreadcrumbText(subsection)} and its significance in ${formatBreadcrumbText(section)}`,
//             image: `/images/${subsection}-intro.jpg`,
//             topics: ['Overview', 'Key Concepts', 'Important Terms'],
//             readTime: '10 min',
//             lastUpdated: new Date().toISOString().split('T')[0]
//         }
//     ];
// };
// ---------

const getArticlesForSubsection = async (subsection: string): Promise<ArticlePreview[]> => {
    const response = await axios.get(`${env.API}/article/${subsection}`);
    return response.data.data;
}

const formatBreadcrumbText = (text: string = '') => {
    if (!text) return '';
    
    // Handle special case for general-studies-X format
    if (text.startsWith('general-studies-')) {
        return `General Studies ${text.split('-')[2]}`;
    }
    
    return text
        .split('-')
        .map(word => capitalize(word))
        .join(' ');
};

const SubsectionPage = () => {
    const router = useRouter();
    const { gs, section, subsection } = router.query;

    // Show loading state while router is not ready
    if (!router.isReady) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const [articles, setArticles] = useState<ArticlePreview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (subsection) {
            getArticlesForSubsection(subsection as string).then(data => {
                setArticles(data);
                setLoading(false);
            });
        }
    }, [subsection]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const heroTitle = subsection ? formatBreadcrumbText(subsection as string) : '';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gray-900 h-72">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-5xl font-bold mb-4">{heroTitle}</h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            Explore comprehensive study materials and detailed notes
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
                        <span className="hover:text-gray-700 cursor-pointer">
                            {gs ? formatBreadcrumbText(gs as string) : ''}
                        </span>
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href={`/upsc-notes/${gs}/${section}`}>
                        <span className="hover:text-gray-700 cursor-pointer">
                            {section ? formatBreadcrumbText(section as string) : ''}
                        </span>
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{heroTitle}</span>
                </nav>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <div 
                            key={article.slug} 
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
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
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {article.title}
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Click on Read More to explore detailed notes on this article
                                </p>
                                
                                {/* Topics */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {article.tags.map((topic, idx) => (
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
                                    {article.updatedAt && (
                                        <span>Updated: {article.updatedAt}</span>
                                    )}
                                </div>

                                <button
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                                    onClick={() => router.push({
                                        pathname: `/upsc-notes/${gs}/${section}/${subsection}/${article.slug}`,
                                        query: { 
                                            title: article.title,
                                            tags: article.tags.join(','),
                                            image: article.image,
                                            updatedAt: article.updatedAt
                                        },
                                    })}
                                >
                                    Read More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubsectionPage;