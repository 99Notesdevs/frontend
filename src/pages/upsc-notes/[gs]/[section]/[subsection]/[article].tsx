import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { ParsedUrlQuery } from 'querystring';
import { env } from '@/config/env';

// Helper function to replace lodash capitalize
const capitalize = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const formatBreadcrumbText = (text: string = '') => {
    if (!text) return '';
    
    if (text.startsWith('general-studies-')) {
        return `General Studies ${text.split('-')[2]}`;
    }
    
    return text
        .split('-')
        .map(word => capitalize(word))
        .join(' ');
};

interface ArticleProps {
    title: string;
    content: string;
    tags: string[];
    image?: string;
    updatedAt?: string;
}

const ArticlePage: React.FC<ArticleProps> = ({ title, content, tags, image, updatedAt }) => {
    const router = useRouter();
    const { gs, section, subsection, article } = router.query;

    // Show loading state while router is not ready
    if (!router.isReady) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Link href="/upsc-notes">
                            <span className="hover:text-blue-600 transition-colors cursor-pointer font-medium">UPSC Notes</span>
                        </Link>
                        <span>›</span>
                        <Link href={`/upsc-notes/${gs}`}>
                            <span className="hover:text-blue-600 transition-colors cursor-pointer">
                                {gs ? formatBreadcrumbText(gs as string) : ''}
                            </span>
                        </Link>
                        <span>›</span>
                        <Link href={`/upsc-notes/${gs}/${section}`}>
                            <span className="hover:text-blue-600 transition-colors cursor-pointer">
                                {section ? formatBreadcrumbText(section as string) : ''}
                            </span>
                        </Link>
                        <span>›</span>
                        <Link href={`/upsc-notes/${gs}/${section}/${subsection}`}>
                            <span className="hover:text-blue-600 transition-colors cursor-pointer">
                                {subsection ? formatBreadcrumbText(subsection as string) : ''}
                            </span>
                        </Link>
                        <span>›</span>
                        <span className="text-blue-600 font-medium">
                            {article ? formatBreadcrumbText(article as string) : ''}
                        </span>
                    </div>
                </div>
            </nav>

            {/* Article Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
                    <article className="prose prose-lg max-w-none">
                        {/* Title Section */}
                        <div className="mb-8 border-b pb-6">
                            <div className="relative inline-block">
                                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 leading-tight tracking-wide">
                                    {title}
                                </h1>
                                <div className="absolute bottom-0 left-0 w-full h-3 bg-yellow-300 opacity-50 -z-10"></div>
                            </div>
                            <div className="w-full h-1 bg-yellow-300 mt-2"></div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 my-6">
                                {tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-blue-150 transition-all duration-300 transform hover:scale-105"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Meta Information */}
                            {updatedAt && (
                                <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg w-fit">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Last updated: {updatedAt}
                                </div>
                            )}
                        </div>

                        {/* Featured Image */}
                        {image && (
                            <div className="relative h-[500px] mb-8 rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                                <img
                                    src={image}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="text-gray-800 leading-relaxed">
                            <div 
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>
                        <div>{content}</div>

                        {/* Share and Navigation Section */}
                        <div className="mt-12 pt-6 border-t">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                {/* Share Buttons */}
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-gray-700">Share:</span>
                                    <button className="p-2.5 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-110">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                                        </svg>
                                    </button>
                                    <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                        </svg>
                                    </button>
                                    <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 11.305l-7.19-.618L24 10.087zM7.411 0L6.41 7.19l-.618-7.19zm8.156 8.156l-3.078 3.077 3.078-3.077zM0 7.411l7.19 1.001L0 6.41zm8.156 8.156l3.077 3.078-3.077-3.078zM16.589 24l1.001-7.19.618 7.19zm-8.156-8.156l-3.077-3.077 3.077 3.077zM24 16.589l-7.19-.618L24 17.913z"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* Print Button */}
                                <button 
                                    onClick={() => window.print()}
                                    className="inline-flex items-center px-6 py-2.5 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print Article
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { article } = context.params as ParsedUrlQuery;

    // Fetch article data from your backend
    const response = await axios.get(`${env.API}/notes/${article}`);
    const articleData = response.data.data;

    return {
        props: {
            title: articleData.title,
            content: articleData.content,
            tags: articleData.tags,
            image: articleData.image || null,
            updatedAt: articleData.updatedAt || null,
        },
    };
};

export default ArticlePage;