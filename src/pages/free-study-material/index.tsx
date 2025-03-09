import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Sample data for downloadable materials
const downloadableMaterials = [
  {
    title: "UPSC Prelims Study Guide 2024",
    description: "Comprehensive study material covering all GS Paper I topics with practice questions",
    fileSize: "12.5 MB",
    format: "PDF",
    downloadLink: "/materials/upsc-prelims-guide-2024.pdf",
    coverImage: "/images/prelims-guide-cover.jpg"
  },
  {
    title: "Indian Polity Quick Revision Notes",
    description: "Concise notes on Indian Constitution, Governance, and Political System",
    fileSize: "8.2 MB",
    format: "PDF",
    downloadLink: "/materials/polity-revision-notes.pdf",
    coverImage: "/images/polity-notes-cover.jpg"
  },
  {
    title: "Economy & Current Affairs Compilation",
    description: "Latest economic developments and current affairs analysis for UPSC",
    fileSize: "15.8 MB",
    format: "PDF",
    downloadLink: "/materials/economy-current-affairs.pdf",
    coverImage: "/images/economy-cover.jpg"
  }
];

// Sample data for UPSC syllabus
const upseSyllabus = [
  {
    title: "Preliminary Examination",
    description: "Two papers of objective type (multiple choice questions) and carry a maximum of 400 marks",
    papers: [
      {
        name: "General Studies Paper I",
        topics: [
          "Current events of national and international importance",
          "History of India and Indian National Movement",
          "Indian and World Geography",
          "Indian Polity and Governance",
          "Economic and Social Development",
          "Environmental Ecology, Biodiversity & Climate Change",
          "General Science"
        ]
      },
      {
        name: "CSAT (General Studies Paper II)",
        topics: [
          "Comprehension",
          "Interpersonal skills including communication skills",
          "Logical reasoning and analytical ability",
          "Decision making and problem solving",
          "General mental ability",
          "Basic numeracy and data interpretation"
        ]
      }
    ]
  },
  {
    title: "Main Examination",
    description: "Written examination consisting of 9 papers, including 2 qualifying papers in languages",
    papers: [
      {
        name: "Paper A & B - Languages",
        topics: ["Any Indian Language", "English"]
      },
      {
        name: "General Studies",
        topics: [
          "GS-I: Indian Heritage and Culture, History and Geography",
          "GS-II: Governance, Constitution, Polity, Social Justice",
          "GS-III: Technology, Economic Development, Biodiversity, Security",
          "GS-IV: Ethics, Integrity and Aptitude"
        ]
      }
    ]
  },
  {
    title: "Interview/Personality Test",
    description: "275 Marks - Testing the candidate's personality and suitability for civil services",
    topics: [
      "Intellectual qualities",
      "Social traits",
      "Interest in current affairs",
      "Critical observation powers",
      "Clear and logical exposition",
      "Balance of judgement",
      "Leadership qualities"
    ]
  }
];

// Sample data for Indian Constitution
const constitutionData = [
  {
    title: "Preamble",
    content: "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC...",
    keyFeatures: [
      "Sovereignty",
      "Socialism",
      "Secularism",
      "Democracy",
      "Republic",
      "Justice",
      "Liberty",
      "Equality",
      "Fraternity"
    ],
    dateAdopted: "26 November 1949",
    lastAmended: "2020"
  },
  {
    title: "Fundamental Rights",
    articles: "Articles 12-35",
    rights: [
      "Right to Equality (Articles 14-18)",
      "Right to Freedom (Articles 19-22)",
      "Right against Exploitation (Articles 23-24)",
      "Right to Freedom of Religion (Articles 25-28)",
      "Cultural and Educational Rights (Articles 29-30)",
      "Right to Constitutional Remedies (Article 32)"
    ]
  },
  {
    title: "Directive Principles",
    articles: "Articles 36-51",
    principles: [
      "Economic and Social Planning",
      "Equal Justice and Free Legal Aid",
      "Organization of Village Panchayats",
      "Right to Work and Education",
      "Protection of Environment and Wildlife",
      "Separation of Judiciary from Executive"
    ]
  }
];

const FreeStudyMaterialPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Free Study Material - UPSC Preparation</title>
        <meta name="description" content="Download free study materials for UPSC preparation" />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Free Study Material</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Access comprehensive study materials, UPSC syllabus, and constitutional knowledge to ace your civil services examination
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Downloadable Materials Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Downloadable Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {downloadableMaterials.map((material, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img
                    src={material.coverImage}
                    alt={material.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{material.title}</h3>
                  <p className="text-gray-600 mb-4">{material.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{material.fileSize}</span>
                    <span>{material.format}</span>
                  </div>
                  <a
                    href={material.downloadLink}
                    className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Download Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* UPSC Syllabus Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">UPSC Syllabus</h2>
          <div className="space-y-8">
            {upseSyllabus.map((exam, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{exam.title}</h3>
                <p className="text-gray-600 mb-6">{exam.description}</p>
                {exam.papers ? (
                  <div className="space-y-6">
                    {exam.papers.map((paper, pIndex) => (
                      <div key={pIndex} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-3">{paper.name}</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          {paper.topics.map((topic, tIndex) => (
                            <li key={tIndex}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {exam.topics.map((topic, tIndex) => (
                      <li key={tIndex}>{topic}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Indian Constitution Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Indian Constitution</h2>
          <div className="space-y-8">
            {constitutionData.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">{section.title}</h3>
                  {section.articles && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {section.articles}
                    </span>
                  )}
                </div>
                {section.content && (
                  <p className="text-gray-600 mb-4 italic">{section.content}</p>
                )}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    {section.keyFeatures ? "Key Features" : 
                     section.rights ? "Fundamental Rights" :
                     "Key Principles"}
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                    {(section.keyFeatures || section.rights || section.principles).map((item, iIndex) => (
                      <li key={iIndex} className="flex items-center">
                        <span className="mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {section.dateAdopted && (
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>Date Adopted: {section.dateAdopted}</span>
                    <span>Last Amended: {section.lastAmended}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FreeStudyMaterialPage;
