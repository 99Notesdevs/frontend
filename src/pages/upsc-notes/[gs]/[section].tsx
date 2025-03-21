import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface ArticleInfo {
    title: string;
    description: string;
    image?: string;
    topics: string[];
}

const sectionData: Record<string, {
    title: string;
    description: string;
    articles: Record<string, ArticleInfo>;
}> = {
    history: {
        title: 'History',
        description: 'Comprehensive coverage of Indian History from ancient times to modern era',
        articles: {
            'ancient-india': {
                title: 'Ancient India',
                description: 'Study of Indian civilization from prehistoric times to the end of the ancient period',
                image: '/images/ancient-india.jpg',
                topics: [
                    'Prehistoric Period',
                    'Indus Valley Civilization',
                    'Vedic Age',
                    'Buddhism and Jainism',
                    'Mauryan Empire'
                ]
            },
            'medieval-india': {
                title: 'Medieval India',
                description: 'Analysis of Indian history from 8th to 18th century CE',
                image: '/images/medieval-india.jpg',
                topics: [
                    'Delhi Sultanate',
                    'Vijayanagara Empire',
                    'Mughal Empire',
                    'Bhakti Movement',
                    'Art and Architecture'
                ]
            },
            'modern-india': {
                title: 'Modern India',
                description: 'Study of Indian history from advent of European powers to independence',
                image: '/images/modern-india.jpg',
                topics: [
                    'British East India Company',
                    'Revolt of 1857',
                    'Indian National Movement',
                    'Partition of India',
                    'Integration of States'
                ]
            }
        }
    },
    geography: {
        title: 'Geography',
        description: 'Study of physical features and human interaction with environment',
        articles: {
            'physical-geography': {
                title: 'Physical Geography',
                description: 'Understanding Earth\'s physical features and natural phenomena',
                image: '/images/physical-geography.jpg',
                topics: [
                    'Geomorphology',
                    'Climatology',
                    'Oceanography',
                    'Biogeography',
                    'Environmental Geography'
                ]
            },
            'human-geography': {
                title: 'Human Geography',
                description: 'Analysis of human interaction with environment',
                image: '/images/human-geography.jpg',
                topics: [
                    'Population Geography',
                    'Economic Geography',
                    'Settlement Geography',
                    'Cultural Geography',
                    'Political Geography'
                ]
            },
            'world-geography': {
                title: 'World Geography',
                description: 'Study of world\'s major geographical features and regions',
                image: '/images/world-geography.jpg',
                topics: [
                    'Major Physical Features',
                    'Climate Regions',
                    'Natural Resources',
                    'Economic Geography',
                    'Geopolitical Regions'
                ]
            }
        }
    },
    polity: {
        title: 'Indian Polity',
        description: 'Understanding Indian political system and constitutional framework',
        articles: {
            'constitution': {
                title: 'Indian Constitution',
                description: 'Detailed study of Indian Constitution and its features',
                image: '/images/constitution.jpg',
                topics: [
                    'Constitutional Development',
                    'Fundamental Rights',
                    'Directive Principles',
                    'Federal Structure',
                    'Constitutional Amendments'
                ]
            },
            'governance': {
                title: 'Governance',
                description: 'Study of governance systems and administrative structures',
                image: '/images/governance.jpg',
                topics: [
                    'Executive',
                    'Legislature',
                    'Judiciary',
                    'Local Governance',
                    'Administrative Reforms'
                ]
            },
            'public-policy': {
                title: 'Public Policy',
                description: 'Analysis of public policies and their implementation',
                image: '/images/public-policy.jpg',
                topics: [
                    'Policy Making Process',
                    'Social Welfare Policies',
                    'Economic Policies',
                    'Environmental Policies',
                    'Implementation Challenges'
                ]
            }
        }
    }
};

const Section = () => {
    const router = useRouter();
    const { gs, section } = router.query;
    const sectionStr = section?.toString() || '';
    const currentSection = sectionData[sectionStr];

    if (!currentSection) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-center text-3xl font-bold text-red-600 mb-8">Section Not Found</h1>
                    <p className="text-center text-gray-600 mb-8">The requested section is not available.</p>
                    <div className="text-center">
                        <Link href={`/upsc-notes/${gs}`}>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                Back to General Studies
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
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
                    <span className="text-gray-900">{currentSection.title}</span>
                </nav>

                {/* Section Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentSection.title}</h1>
                    <p className="text-xl text-gray-600">{currentSection.description}</p>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(currentSection.articles).map(([slug, article]) => (
                        <div key={slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Key Topics:</h3>
                                <ul className="space-y-1 text-gray-600 mb-6">
                                    {article.topics.map((topic, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                                <Link href={`/upsc-notes/${gs}/${section}/${slug}`}>
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

export default Section;
// same for backend  dev
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';

// const Section = () => {
//     const router = useRouter();
//     const { gs, section } = router.query;
//     const [currentSection, setCurrentSection] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (section) {
//             fetch(`/api/sections/${section}`)
//                 .then((response) => response.json())
//                 .then((data) => {
//                     setCurrentSection(data);
//                     setLoading(false);
//                 })
//                 .catch((err) => {
//                     setError('Failed to load section data');
//                     setLoading(false);
//                 });
//         }
//     }, [section]);

//     if (loading) {
//         return <div className="text-center py-12">Loading...</div>;
//     }

//     if (error || !currentSection) {
//         return (
//             <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//                 <div className="max-w-7xl mx-auto">
//                     <h1 className="text-center text-3xl font-bold text-red-600 mb-8">Section Not Found</h1>
//                     <p className="text-center text-gray-600 mb-8">The requested section is not available.</p>
//                     <div className="text-center">
//                         <Link href={`/upsc-notes/${gs}`}>
//                             <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
//                                 Back to General Studies
//                             </button>
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//                 <nav className="flex items-center text-sm font-medium text-gray-500 mb-8">
//                     <Link href="/upsc-notes">
//                         <span className="hover:text-gray-700 cursor-pointer">UPSC Notes</span>
//                     </Link>
//                     <span className="mx-2">/</span>
//                     <Link href={`/upsc-notes/${gs}`}>
//                         <span className="hover:text-gray-700 cursor-pointer">{gs?.toString().toUpperCase()}</span>
//                     </Link>
//                     <span className="mx-2">/</span>
//                     <span className="text-gray-900">{currentSection.title}</span>
//                 </nav>

//                 <div className="text-center mb-12">
//                     <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentSection.title}</h1>
//                     <p className="text-xl text-gray-600">{currentSection.description}</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {currentSection.articles.map((article) => (
//                         <div key={article.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//                             {article.image && (
//                                 <div className="h-48 bg-gray-200">
//                                     <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
//                                 </div>
//                             )}
//                             <div className="p-6">
//                                 <h2 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h2>
//                                 <p className="text-gray-600 mb-4">{article.description}</p>
//                                 <h3 className="text-lg font-medium text-gray-900 mb-2">Key Topics:</h3>
//                                 <ul className="space-y-1 text-gray-600 mb-6">
//                                     {article.topics.map((topic, index) => (
//                                         <li key={index} className="flex items-start">
//                                             <span className="text-blue-500 mr-2">•</span>
//                                             {topic}
//                                         </li>
//                                     ))}
//                                 </ul>
//                                 <Link href={`/upsc-notes/${gs}/${section}/${article.slug}`}>
//                                     <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300">
//                                         Read More
//                                     </button>
//                                 </Link>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Section;
