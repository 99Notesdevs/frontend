import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { ParsedUrlQuery } from 'querystring';

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
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/upsc-notes">
                            <span className="hover:text-gray-900 cursor-pointer">UPSC Notes</span>
                        </Link>
                        <span>/</span>
                        <Link href={`/upsc-notes/${gs}`}>
                            <span className="hover:text-gray-900 cursor-pointer">
                                {gs ? formatBreadcrumbText(gs as string) : ''}
                            </span>
                        </Link>
                        <span>/</span>
                        <Link href={`/upsc-notes/${gs}/${section}`}>
                            <span className="hover:text-gray-900 cursor-pointer">
                                {section ? formatBreadcrumbText(section as string) : ''}
                            </span>
                        </Link>
                        <span>/</span>
                        <Link href={`/upsc-notes/${gs}/${section}/${subsection}`}>
                            <span className="hover:text-gray-900 cursor-pointer">
                                {subsection ? formatBreadcrumbText(subsection as string) : ''}
                            </span>
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900">
                            {article ? formatBreadcrumbText(article as string) : ''}
                        </span>
                    </div>
                </div>
            </nav>

            {/* Article Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <article className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">
                        {title}
                    </h1>
                    
                    {image && (
                        <div className="h-64 bg-gray-200 mb-8">
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Tags */}
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <p className="text-gray-600 mb-8">
                        {content}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        {updatedAt && (
                            <span>Updated: {updatedAt}</span>
                        )}
                    </div>
                </article>
            </main>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { article } = context.params as ParsedUrlQuery;

    // Fetch article data from your backend
    const response = await axios.get(`http://localhost:5000/api/v1/article/slug/${article}`);
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