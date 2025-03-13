import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import axios from 'axios';
import { env } from '@/config/env';
import { ParsedUrlQuery } from 'querystring';

// Helper function to replace lodash capitalize
const capitalize = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

interface ArticlePreview {
    slug: string;
    title: string;
    content: string;
    image?: string;
    tags: string[];
    createdAt?: string;
    updatedAt?: string;
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

interface SubsectionPageProps {
    articles: ArticlePreview[];
    gs: string;
    section: string;
    subsection: string;
}

const SubsectionPage: React.FC<SubsectionPageProps> = ({ articles, gs, section, subsection }) => {
    const heroTitle = subsection ? formatBreadcrumbText(subsection) : '';

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
                            {gs ? formatBreadcrumbText(gs) : ''}
                        </span>
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href={`/upsc-notes/${gs}/${section}`}>
                        <span className="hover:text-gray-700 cursor-pointer">
                            {section ? formatBreadcrumbText(section) : ''}
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

                                <Link href={`/upsc-notes/${gs}/${section}/${subsection}/${article.slug}`}>
                                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300">
                                        Read More
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { gs, section, subsection } = context.params as ParsedUrlQuery;

    const response = await axios.get(`${env.API}/article/${subsection}`);
    const articles = response.data.data;

    return {
        props: {
            articles,
            gs,
            section,
            subsection,
        },
    };
};

export default SubsectionPage;