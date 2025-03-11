import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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

const ArticlePage = () => {
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
                        {article ? formatBreadcrumbText(article as string) : ''}
                    </h1>
                    
                    {/* This would be replaced with actual article content from your CMS or database */}
                    <p className="text-gray-600">
                        Article content will be loaded here. Connect to your CMS or database to display the actual content.
                    </p>
                </article>
            </main>
        </div>
    );
};

export default ArticlePage; 