import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { navItems } from '@/components/Navbar/navData';
import { Roboto } from 'next/font/google';

// Load the font
const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const GSPage = () => {
    const router = useRouter();
    const { gs } = router.query;
    const gsNumber = gs?.toString().match(/\d+/)?.[0] || '';
    const gsKey = `General Studies ${gsNumber}` as keyof typeof navItems['UPSC Notes'];
    const gsData = gsKey in navItems['UPSC Notes'] ? navItems['UPSC Notes'][gsKey] : null;

    if (!gsData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold text-red-600">Page Not Found</h1>
                    <p className="mt-4 text-gray-600">The requested General Studies section could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center py-12 ${roboto.className}`}>
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="text-sm mb-8">
                    <ol className="list-none p-0 inline-flex">
                        <li className="flex items-center">
                            <Link href="/upsc-notes">
                                <span className="text-blue-600 hover:text-blue-800 transition-colors duration-300">UPSC Notes</span>
                            </Link>
                            <svg className="w-3 h-3 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </li>
                        <li>
                            <span className="text-gray-700 font-medium">{gsKey}</span>
                        </li>
                    </ol>
                </nav>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                    <h1 className="text-4xl font-bold text-gray mb-8 border-b pb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{gsKey}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {Object.entries(gsData).map(([subject, topics]) => (
                            <div key={subject} 
                                className="bg-white rounded-lg p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 border border-gray-200 min-h-[350px]">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">{subject}</h2>
                                <ul className="space-y-3">
                                    {Array.isArray(topics) && topics.map((topic) => (
                                        <li key={topic}>
                                            <Link 
                                                href={`/upsc-notes/${gs}/${subject.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}/${topic.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}`}
                                            >
                                                <span className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors duration-300 text-sm flex items-center">
                                                    <span className="mr-2">•</span>
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
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <h2 className="text-3xl text-black font-bold mb-6  bg-clip-text">Quick Links</h2>
                        <div className="flex flex-wrap gap-4">
                            {['Current Affairs', 'Study Material', 'Exam Forum'].map((link) => (
                                <Link key={link} href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}>
                                    <span className="inline-block px-6 py-3 bg-white border border-blue-100 text-black rounded-lg hover:bg-blue-50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                                        {link}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GSPage;
