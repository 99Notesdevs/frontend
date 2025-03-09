import React from 'react';
import Head from 'next/head';

const syllabusData = [
  {
    title: "Preliminary Examination",
    description: "Two papers of objective type (multiple choice questions) and carry a maximum of 400 marks",
    icon: "📝",
    papers: [
      {
        name: "General Studies Paper I (200 marks)",
        topics: [
          "Current events of national and international importance",
          "History of India and Indian National Movement",
          "Indian and World Geography - Physical, Social, Economic Geography of India and the World",
          "Indian Polity and Governance - Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues, etc.",
          "Economic and Social Development - Sustainable Development, Poverty, Inclusion, Demographics, Social Sector Initiatives, etc.",
          "Environmental Ecology, Biodiversity and Climate Change",
          "General Science and Technology"
        ],
        duration: "2 hours",
        questions: "100 questions"
      },
      {
        name: "CSAT - General Studies Paper II (200 marks)",
        topics: [
          "Comprehension",
          "Interpersonal skills including communication skills",
          "Logical reasoning and analytical ability",
          "Decision making and problem solving",
          "General mental ability",
          "Basic numeracy and data interpretation (Class X level)"
        ],
        duration: "2 hours",
        questions: "80 questions",
        note: "Qualifying in nature - minimum 33% marks required"
      }
    ]
  },
  {
    title: "Main Examination",
    description: "Written examination consisting of 9 papers, including 2 qualifying papers in languages",
    icon: "✍️",
    papers: [
      {
        name: "Qualifying Papers",
        topics: [
          "Paper A - Any Indian Language (300 marks)",
          "Paper B - English (300 marks)"
        ],
        note: "Qualifying in nature - marks not counted for ranking"
      },
      {
        name: "Essay",
        topics: ["Paper I - Essay (250 marks)"],
        duration: "3 hours",
        note: "Choice of topics from various fields"
      },
      {
        name: "General Studies",
        topics: [
          "Paper I - Indian Heritage and Culture, History and Geography (250 marks)",
          "Paper II - Governance, Constitution, Polity, Social Justice (250 marks)",
          "Paper III - Technology, Economic Development, Biodiversity, Security (250 marks)",
          "Paper IV - Ethics, Integrity and Aptitude (250 marks)"
        ],
        duration: "3 hours each"
      },
      {
        name: "Optional Subject",
        topics: [
          "Paper I - Optional Subject (250 marks)",
          "Paper II - Optional Subject (250 marks)"
        ],
        duration: "3 hours each",
        note: "One subject to be selected from the list of optional subjects"
      }
    ]
  },
  {
    title: "Interview/Personality Test",
    description: "The candidate will be interviewed by a Board who will have before them a record of their career",
    icon: "🗣️",
    marks: "275 marks",
    keyAreas: [
      "Intellectual qualities",
      "Critical powers of assimilation",
      "Clear and logical exposition",
      "Balance of judgement",
      "Quality of responses",
      "Leadership traits",
      "Mental alertness",
      "Knowledge of current affairs",
      "Moral integrity",
      "Social cohesion and leadership"
    ]
  }
];

const UPSCSyllabusPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>UPSC Syllabus - Free Study Material</title>
        <meta name="description" content="Detailed UPSC Civil Services Examination syllabus for Prelims, Mains, and Interview" />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">UPSC Syllabus</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Complete syllabus for Civil Services Examination - Preliminary, Main Examination, and Interview
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Syllabus Sections */}
        <div className="space-y-8">
          {syllabusData.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Section Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{section.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    <p className="text-gray-600 mt-1">{section.description}</p>
                  </div>
                </div>
              </div>

              {/* Section Content */}
              <div className="p-6">
                {section.papers ? (
                  <div className="space-y-6">
                    {section.papers.map((paper, pIndex) => (
                      <div key={pIndex} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{paper.name}</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          {paper.topics.map((topic, tIndex) => (
                            <li key={tIndex}>{topic}</li>
                          ))}
                        </ul>
                        {paper.duration && (
                          <div className="mt-3 text-sm text-gray-500">
                            Duration: {paper.duration}
                          </div>
                        )}
                        {paper.questions && (
                          <div className="mt-1 text-sm text-gray-500">
                            Questions: {paper.questions}
                          </div>
                        )}
                        {paper.note && (
                          <div className="mt-2 text-sm text-blue-600">
                            Note: {paper.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-3 text-gray-500">Marks: {section.marks}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Areas of Assessment</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                      {section.keyAreas.map((area, aIndex) => (
                        <li key={aIndex} className="flex items-center">
                          <span className="mr-2">•</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Notes */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notes</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>The syllabus is indicative and not exhaustive</li>
            <li>Questions may be asked from related topics even if not explicitly mentioned</li>
            <li>Current affairs and their application to various topics is important</li>
            <li>Focus on fundamental understanding and analytical abilities</li>
            <li>Regular updates may be made to the syllabus - stay informed through official UPSC website</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UPSCSyllabusPage; 