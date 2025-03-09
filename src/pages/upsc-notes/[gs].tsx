import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { navItems } from '@/components/Navbar/navData';

const GSPage = () => {
    const router = useRouter();
    const { gs } = router.query;
    const gsNumber = gs?.toString().match(/\d+/)?.[0] || '';
    const gsKey = `General Studies ${gsNumber}` as keyof typeof navItems['UPSC Notes'];
    const gsData = gsKey in navItems['UPSC Notes'] ? navItems['UPSC Notes'][gsKey] : null;

    if (!gsData) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold text-red-600">Page Not Found</h1>
                    <p className="mt-4 text-gray-600">The requested General Studies section could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="text-sm mb-6">
                    <ol className="list-none p-0 inline-flex">
                        <li className="flex items-center">
                            <Link href="/upsc-notes">
                                <span className="text-blue-600 hover:text-blue-800">UPSC Notes</span>
                            </Link>
                            <svg className="w-3 h-3 mx-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </li>
                        <li>
                            <span className="text-gray-700">{gsKey}</span>
                        </li>
                    </ol>
                </nav>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">{gsKey}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(gsData).map(([subject, topics]) => (
                            <div key={subject} className="bg-gray-50 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">{subject}</h2>
                                <ul className="space-y-2">
                                    {Array.isArray(topics) && topics.map((topic) => (
                                        <li key={topic}>
                                            <Link 
                                                href={`/upsc-notes/${gs}/${subject.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}/${topic.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}`}
                                            >
                                                <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                                    {topic}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Quick Links */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Links</h2>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/current-affairs">
                                <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 cursor-pointer">
                                    Current Affairs
                                </span>
                            </Link>
                            <Link href="/free-study-material">
                                <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 cursor-pointer">
                                    Study Material
                                </span>
                            </Link>
                            <Link href="/exam-forum">
                                <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 cursor-pointer">
                                    Exam Forum
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GSPage;
