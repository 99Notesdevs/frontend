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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="relative bg-gray-900 h-80">
                <div className="absolute inset-0">
                    <div className="absolute inset-0" />
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <h1 className="text-5xl font-bold mb-4 tracking-tight animate-fade-in">
                            {heroTitle}
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto font-light leading-relaxed text-gray-200">
                            Discover comprehensive study materials and expertly curated notes
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm font-medium text-gray-600 mb-12 flex-wrap">
                    <Link href="/upsc-notes">
                        <span className="hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                            UPSC Notes
                        </span>
                    </Link>
                    <svg className="mx-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link href={`/upsc-notes/${gs}`}>
                        <span className="hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                            {gs ? formatBreadcrumbText(gs) : ''}
                        </span>
                    </Link>
                    <svg className="mx-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link href={`/upsc-notes/${gs}/${section}`}>
                        <span className="hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                            {section ? formatBreadcrumbText(section) : ''}
                        </span>
                    </Link>
                    <svg className="mx-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-900">{heroTitle}</span>
                </nav>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {articles.map((article) => (
                        <div 
                            key={article.slug} 
                            className="group bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]"
                        >
                            {article.image && (
                                <div className="h-64 overflow-hidden rounded-t-xl">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            )}
                            <div className="p-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                                    {article.title}
                                </h2>
                                <p className="text-gray-600 mb-6 text-base line-clamp-2">
                                    Click to explore detailed notes on this topic
                                </p>
                                
                                <div className="mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {article.tags.map((topic, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300"
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                                    {article.updatedAt && (
                                        <span className="flex items-center group-hover:text-blue-600 transition-colors duration-300">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {article.updatedAt}
                                        </span>
                                    )}
                                </div>

                                <Link href={`/upsc-notes/${gs}/${section}/${subsection}/${article.slug}`}>
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-sm hover:shadow-xl text-lg">
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

    const response = await axios.get(`${env.API}/notes/parents/${subsection}`);
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