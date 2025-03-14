import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface TopicContent {
    title: string;
    description: string;
    keyTopics?: string[];
    image?: string;
}

const sectionContent: Record<string, Record<string, TopicContent>> = {
    history: {
        'ancient-india': {
            title: 'Ancient India',
            description: 'Comprehensive study of Indian history from prehistoric times to the end of the ancient period.',
            image: '/images/ancient-india.jpg'
        },
        'medieval-india': {
            title: 'Medieval India',
            description: 'Study of Indian history from the 8th century to the 18th century CE.',
            keyTopics: [
                'Delhi Sultanate',
                'Vijayanagara Empire',
                'Mughal Empire',
                'Bhakti Movement',
                'Art and Architecture'
            ],
            image: '/images/medieval-india.jpg'
        },
        'modern-india': {
            title: 'Modern India',
            description: 'Analysis of Indian history from the advent of European powers to independence.',
            keyTopics: [
                'British East India Company',
                'Revolt of 1857',
                'Indian National Movement',
                'Partition of India',
                'Integration of Princely States'
            ],
            image: '/images/modern-india.jpg'
        }
    },
    geography: {
        'physical-geography': {
            title: 'Physical Geography',
            description: 'Study of natural features and phenomena of the Earth.',
            keyTopics: [
                'Geomorphology',
                'Climatology',
                'Oceanography',
                'Biogeography',
                'Environmental Geography'
            ],
            image: '/images/physical-geography.jpg'
        },
        'human-geography': {
            title: 'Human Geography',
            description: 'Study of human interaction with the environment and spatial organization.',
            keyTopics: [
                'Population Geography',
                'Economic Geography',
                'Settlement Geography',
                'Cultural Geography',
                'Political Geography'
            ],
            image: '/images/human-geography.jpg'
        }
    },
    polity: {
        'constitution': {
            title: 'Indian Constitution',
            description: 'Comprehensive study of the Indian Constitution and its features.',
            keyTopics: [
                'Constitutional Development',
                'Fundamental Rights',
                'Directive Principles',
                'Federal Structure',
                'Constitutional Amendments'
            ],
            image: '/images/constitution.jpg'
        },
        'governance': {
            title: 'Governance',
            description: 'Study of governance systems and administrative structures in India.',
            keyTopics: [
                'Executive Branch',
                'Legislative Process',
                'Judicial System',
                'Local Governance',
                'Administrative Reforms'
            ],
            image: '/images/governance.jpg'
        }
    },
    society: {
        'indian-society': {
            title: 'Indian Society',
            description: 'Understanding the structure and dynamics of Indian society.',
            keyTopics: [
                'Social Structure',
                'Caste System',
                'Urbanization',
                'Gender Issues',
                'Social Movements'
            ],
            image: '/images/indian-society.jpg'
        },
        'social-issues': {
            title: 'Social Issues',
            description: 'Analysis of contemporary social issues and challenges in India.',
            keyTopics: [
                'Poverty and Inequality',
                'Education System',
                'Healthcare Challenges',
                'Environmental Issues',
                'Social Security'
            ],
            image: '/images/social-issues.jpg'
        }
    }
};

const SectionPage = () => {
    const router = useRouter();
    const { gs, section } = router.query;

    // Convert query parameters to strings and handle undefined
    const sectionStr = section?.toString() || '';
    const topics = sectionContent[sectionStr];

    if (!topics) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-center text-3xl font-bold text-red-600 mb-8">Section Not Found</h1>
                    <p className="text-center text-gray-600 mb-8">The requested section content is not available.</p>
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm font-medium text-gray-600 mb-12 bg-white/50 p-4 rounded-lg backdrop-blur-sm hover:bg-white/70 transition-colors duration-300">
                    <Link href="/upsc-notes">
                        <span className="hover:text-blue-600 hover:scale-105 inline-block transform transition-all duration-200 cursor-pointer">UPSC Notes</span>
                    </Link>
                    <span className="mx-2 hover:text-blue-500 transition-colors duration-200">→</span>
                    <Link href={`/upsc-notes/${gs}`}>
                        <span className="hover:text-blue-600 hover:scale-105 inline-block transform transition-all duration-200 cursor-pointer">{gs?.toString().toUpperCase()}</span>
                    </Link>
                    <span className="mx-2 hover:text-blue-500 transition-colors duration-200">→</span>
                    <span className="text-blue-700 font-semibold hover:text-blue-800 transition-colors duration-200">{sectionStr.replace(/-/g, ' ')}</span>
                </nav>

                {/* Section Title */}
                <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center capitalize hover:scale-105 transition-transform duration-300">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-500">
                        {sectionStr.replace(/-/g, ' ')}
                    </span>
                </h1>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {Object.entries(topics).map(([slug, topic]) => (
                        <div key={slug} 
                            className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1">
                            {topic.image && (
                                <div className="h-72 bg-gray-200 overflow-hidden">
                                    <img
                                        src={topic.image}
                                        alt={topic.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    />
                                </div>
                            )}
                            <div className="p-10 group-hover:bg-gradient-to-b from-white to-blue-50 transition-all duration-300">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 group-hover:translate-x-1 transform">
                                    {topic.title}
                                </h2>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                    {topic.description}
                                </p>
                                {topic.keyTopics && (
                                    <div className="mb-8">
                                        <div className="flex flex-wrap gap-3">
                                            {topic.keyTopics.map((keyTopic, index) => (
                                                <span 
                                                    key={index} 
                                                    className="inline-block px-4 py-2 text-base bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 hover:text-blue-700 hover:scale-105 transform transition-all duration-300 cursor-default"
                                                >
                                                    {keyTopic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <Link href={`/upsc-notes/${gs}/${section}/${slug}`}>
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-lg text-lg font-semibold 
                                        hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-300 
                                        hover:shadow-lg hover:scale-[1.02] active:scale-95 
                                        group-hover:from-indigo-600 group-hover:to-blue-600
                                        relative overflow-hidden">
                                        <span className="relative z-10">Explore Topic</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

export default SectionPage;