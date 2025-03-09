import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Section {
    heading: string;
    content: string;
    keyPoints: string[];
    image?: string;
    subSections?: {
        title: string;
        content: string;
        points?: string[];
    }[];
}

interface ArticleContent {
    title: string;
    description?: string;
    sections: Section[];
    coverImage?: string;
    lastUpdated?: string;
    importance?: string;
    previousYearQuestions?: string[];
}

const sampleContent: Record<string, Record<string, ArticleContent>> = {
    history: {
        'what-is-history': {
            title: 'What is History? Sources & Types of History',
            description: 'Understanding the fundamentals of history, its sources, and different types of historical studies',
            coverImage: '/images/what-is-history-cover.jpg',
            lastUpdated: '2024-03-15',
            importance: 'Understanding the basics of history is crucial for UPSC preparation as it forms the foundation for studying various civilizations, cultures, and historical events.',
            sections: [
                {
                    heading: 'What is History?',
                    content: 'The word history is derived from the ancient Greek word "Historia", which translates into "an inquiry". Thus the knowledge acquired by the investigation of the events of the past is history. In simple terms, it is the enquiry of the "human past".',
                    keyPoints: [
                        'Derived from Greek word "Historia"',
                        'Means "an inquiry"',
                        'Study of human past',
                        'Investigation of past events'
                    ]
                },
                {
                    heading: 'Types of History',
                    content: 'History is divided mainly into 6 types: Political History, Diplomatic History, Cultural History, Social History, Economic History, and Intellectual History.',
                    keyPoints: [
                        'Political History - Focuses on governance, power, and political events',
                        'Diplomatic History - Studies international relations, treaties, conflicts, and diplomacy',
                        'Cultural History - Explores art, literature, music, religion, and traditions',
                        'Economic History - Focuses on trade routes, economic policies, and industrialization',
                        'Social History - Studies social interactions, class dynamics, and cultural practices',
                        'Intellectual History - Explores evolution of ideas, philosophical developments, and cultural ideologies'
                    ]
                },
                {
                    heading: 'Classification of Timeline in Historical Studies',
                    content: 'Historians have classified the study of history into different divisions based on the tools used in different ages, knowledge of writing and modes of communication.',
                    keyPoints: [
                        'Pre-history - Before invention of writing',
                        'Proto-history - Indirect evidence of writing exists',
                        'History - Written records available',
                        'Based on tools and communication modes',
                        'Helps understand human development stages'
                    ],
                    subSections: [
                        {
                            title: 'Pre-history',
                            content: 'It consists of the events that occurred before the invention of writing.',
                            points: [
                                'Palaeolithic age (Old Stone Age) - 2,500,000 MYA to 11,700 years ago',
                                'Mesolithic Period (Middle Stone Age) - 11,700 years ago to 6000 BCE',
                                'Neolithic Period (New Stone Age) - 6000 BCE to 1000 BCE',
                                'Chalcolithic Period (Stone-Copper Age) - Around 3000 BCE'
                            ]
                        },
                        {
                            title: 'Proto-history',
                            content: 'Refers to the civilization phase of history before the invention of writing but with indirect evidence of writing from other contemporary civilizations.',
                            points: [
                                'Period between prehistory and history',
                                'Indirect evidence of writing exists',
                                'Example: Indus Valley Civilization'
                            ]
                        }
                    ]
                }
            ],
            previousYearQuestions: [
                'Discuss the different types of history and their significance in understanding human civilization. (UPSC 2023)',
                'What are the major periods of Indian history? Elaborate with examples. (UPSC 2022)',
                'Explain the importance of archaeological sources in reconstructing ancient Indian history. (UPSC 2021)'
            ]
        },
        'ancient-india': {
            title: 'Ancient India',
            description: 'A comprehensive study of Indian history from prehistoric times to the end of the ancient period.',
            coverImage: '/images/ancient-india-cover.jpg',
            lastUpdated: '2024-03-15',
            importance: 'Ancient Indian history is crucial for understanding the foundations of Indian civilization, its cultural heritage, and the development of various social, political, and economic institutions.',
            previousYearQuestions: [
                'Discuss the main features of the Indus Valley Civilization. (UPSC 2023)',
                'Evaluate the contribution of Buddhism to Indian culture. (UPSC 2022)',
                'Analyze the causes for the rise and fall of the Mauryan Empire. (UPSC 2021)'
            ],
            sections: [
                {
                    heading: 'Indus Valley Civilization',
                    content: 'The Indus Valley Civilization was one of the world\'s earliest urban civilizations, flourishing around 2500 BCE. It was characterized by advanced urban planning, sophisticated drainage systems, and standardized weights and measures.',
                    image: '/images/indus-valley.jpg',
                    keyPoints: [
                        'Advanced Urban Planning',
                        'Great Bath at Mohenjo-daro',
                        'Sophisticated Drainage System',
                        'Standardized Weights and Measures',
                        'Script and Seals'
                    ],
                    subSections: [
                        {
                            title: 'Urban Planning',
                            content: 'Cities were built on a grid pattern with wide streets and sophisticated drainage systems.',
                            points: [
                                'Grid pattern layout',
                                'Citadel and lower town division',
                                'Advanced drainage system',
                                'Well-planned streets'
                            ]
                        },
                        {
                            title: 'Economic Life',
                            content: 'The civilization had a robust trading system and advanced craftsmanship.',
                            points: [
                                'Trade with Mesopotamia',
                                'Advanced metallurgy',
                                'Bead making',
                                'Pottery production'
                            ]
                        }
                    ]
                },
                {
                    heading: 'Vedic Period',
                    content: 'The Vedic period marked the beginning of the classical Indian civilization, characterized by the composition of the Vedas and the development of complex social and religious systems.',
                    image: '/images/vedic-period.jpg',
                    keyPoints: [
                        'Composition of the Vedas',
                        'Development of Social Classes',
                        'Religious Practices',
                        'Political Organization',
                        'Economic Activities'
                    ],
                    subSections: [
                        {
                            title: 'Social Structure',
                            content: 'The society was divided into four varnas: Brahmins, Kshatriyas, Vaishyas, and Shudras.',
                            points: [
                                'Varna system',
                                'Family structure',
                                'Role of women',
                                'Education system'
                            ]
                        }
                    ]
                }
            ]
        },
        'medieval-india': {
            title: 'Medieval India',
            sections: [
                {
                    heading: 'Delhi Sultanate',
                    content: 'The Delhi Sultanate was an Islamic empire based in Delhi that stretched over large parts of the Indian subcontinent for 320 years (1206–1526).',
                    keyPoints: [
                        'Administrative System',
                        'Military Campaigns',
                        'Cultural Developments',
                        'Economic Policies'
                    ]
                }
            ]
        }
    },
    geography: {
        'physical-geography': {
            title: 'Physical Geography',
            sections: [
                {
                    heading: 'Geomorphology',
                    content: 'Study of landforms, their processes, form and sediments at the surface of the Earth.',
                    keyPoints: [
                        'Plate Tectonics',
                        'Weathering and Erosion',
                        'River Systems',
                        'Coastal Processes'
                    ]
                }
            ]
        }
    }
    // Add more sections as needed
};

const Article = () => {
    const router = useRouter();
    const { gs, section, article } = router.query;
    const [activeSection, setActiveSection] = useState<string>('');
    const [readingProgress, setReadingProgress] = useState(0);
    const [showShareMenu, setShowShareMenu] = useState(false);

    // Convert query parameters to strings and handle undefined
    const sectionStr = section?.toString() || '';
    const articleStr = article?.toString() || '';
    const articleContent = sectionStr && articleStr && sampleContent[sectionStr]?.[articleStr];

    useEffect(() => {
        const handleScroll = () => {
            // Section tracking
            const sections = document.querySelectorAll('section[id]');
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = (section as HTMLElement).offsetTop;
                if (window.scrollY >= sectionTop - 100) {
                    currentSection = section.getAttribute('id') || '';
                }
            });
            setActiveSection(currentSection);

            // Reading progress
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setReadingProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const title = articleContent ? articleContent.title : 'UPSC Notes';
        
        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`);
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
                break;
            case 'whatsapp':
                window.open(`https://api.whatsapp.com/send?text=${title} ${url}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                // You might want to add a toast notification here
                break;
        }
        setShowShareMenu(false);
    };

    if (!articleContent) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-center text-3xl font-bold text-red-600 mb-8">Content Not Found</h1>
                    <p className="text-center text-gray-600 mb-8">The requested article content is not available.</p>
                    <div className="text-center">
                        <Link href={`/upsc-notes/${gs}/${section}`}>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                Back to Section
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Reading Progress Bar */}
            <div 
                className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50"
                style={{ transform: `translateX(${readingProgress - 100}%)` }}
            >
                <div className="h-full bg-blue-600 transition-transform duration-150" />
            </div>

            {/* Hero Section */}
            {articleContent.coverImage && (
                <div className="relative h-[70vh] bg-gray-900">
                    <img
                        src={articleContent.coverImage}
                        alt={articleContent.title}
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white max-w-4xl px-4">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <span className="px-3 py-1 bg-blue-600/80 rounded-full text-sm">
                                    {sectionStr.replace(/-/g, ' ')}
                                </span>
                                {articleContent.lastUpdated && (
                                    <span className="px-3 py-1 bg-gray-700/80 rounded-full text-sm">
                                        Updated: {articleContent.lastUpdated}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">{articleContent.title}</h1>
                            <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light">{articleContent.description}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb and Share Button */}
                <div className="flex items-center justify-between mb-8">
                    <nav className="flex items-center text-sm font-medium text-gray-500">
                        <Link href="/upsc-notes">
                            <span className="hover:text-gray-700 cursor-pointer">UPSC Notes</span>
                        </Link>
                        <span className="mx-2">/</span>
                        <Link href={`/upsc-notes/${gs}`}>
                            <span className="hover:text-gray-700 cursor-pointer">{gs?.toString().toUpperCase()}</span>
                        </Link>
                        <span className="mx-2">/</span>
                        <Link href={`/upsc-notes/${gs}/${section}`}>
                            <span className="hover:text-gray-700 cursor-pointer">{sectionStr.replace(/-/g, ' ')}</span>
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{articleContent.title}</span>
                    </nav>
                    
                    {/* Share Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            Share
                        </button>
                        
                        {/* Share Menu */}
                        {showShareMenu && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                <div className="py-1" role="menu">
                                    <button
                                        onClick={() => handleShare('twitter')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Share on Twitter
                                    </button>
                                    <button
                                        onClick={() => handleShare('facebook')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Share on Facebook
                                    </button>
                                    <button
                                        onClick={() => handleShare('whatsapp')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Share on WhatsApp
                                    </button>
                                    <button
                                        onClick={() => handleShare('copy')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Info Card */}
                {articleContent.importance && (
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-8 mb-12">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold mb-3">Why is this important?</h3>
                                <p className="text-white/90 text-lg leading-relaxed">{articleContent.importance}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - Table of Contents */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
                                <nav className="space-y-2">
                                    {articleContent.sections.map((section, index) => (
                                        <a
                                            key={index}
                                            href={`#section-${index}`}
                                            className={`block py-2 px-3 rounded-lg transition-colors duration-200 ${
                                                activeSection === `section-${index}`
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {section.heading}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            {/* Reading Progress Card */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-3">Reading Progress</h3>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${readingProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-2">{Math.round(readingProgress)}% Complete</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="space-y-12">
                            {articleContent.sections.map((section, index) => (
                                <section key={index} id={`section-${index}`} className="scroll-mt-8">
                                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                        {section.image && (
                                            <img
                                                src={section.image}
                                                alt={section.heading}
                                                className="w-full h-72 object-cover"
                                            />
                                        )}
                                        <div className="p-8">
                                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.heading}</h2>
                                            <p className="text-gray-600 text-lg leading-relaxed mb-8">{section.content}</p>
                                            
                                            {/* Key Points */}
                                            <div className="bg-blue-50 rounded-xl p-6 mb-8">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Points</h3>
                                                <ul className="space-y-3">
                                                    {section.keyPoints.map((point, idx) => (
                                                        <li key={idx} className="flex items-start">
                                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-medium text-sm mr-3 mt-0.5">
                                                                {idx + 1}
                                                            </span>
                                                            <span className="text-gray-700 flex-1">{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Sub Sections */}
                                            {section.subSections && section.subSections.map((subSection, subIdx) => (
                                                <div key={subIdx} className="border-l-4 border-blue-100 pl-6 mb-6">
                                                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                                                        {subSection.title}
                                                    </h4>
                                                    <p className="text-gray-600 mb-4">{subSection.content}</p>
                                                    {subSection.points && (
                                                        <ul className="space-y-2 text-gray-600">
                                                            {subSection.points.map((point, pointIdx) => (
                                                                <li key={pointIdx} className="flex items-center">
                                                                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                    {point}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Previous Year Questions */}
                        {articleContent.previousYearQuestions && (
                            <div className="sticky top-4 bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Previous Year Questions</h3>
                                <div className="space-y-4">
                                    {articleContent.previousYearQuestions.map((question, idx) => (
                                        <div key={idx} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                            <p className="text-gray-700">{question}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Article;
