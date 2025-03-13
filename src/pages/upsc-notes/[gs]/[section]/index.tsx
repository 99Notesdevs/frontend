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
                    <span className="text-gray-900">{sectionStr.replace(/-/g, ' ')}</span>
                </nav>

                {/* Section Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center capitalize">
                    {sectionStr.replace(/-/g, ' ')}
                </h1>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(topics).map(([slug, topic]) => (
                        <div key={slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            {topic.image && (
                                <div className="h-48 bg-gray-200">
                                    <img
                                        src={topic.image}
                                        alt={topic.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{topic.title}</h2>
                                <p className="text-gray-600 mb-4">{topic.description}</p>
                                
                                
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

export default SectionPage; 