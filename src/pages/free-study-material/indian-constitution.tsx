import React from 'react';
import Head from 'next/head';

const constitutionData = [
  {
    title: "Preamble",
    icon: "⚖️",
    content: "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens...",
    keyFeatures: [
      {
        title: "Sovereignty",
        description: "India is an independent nation with no external control"
      },
      {
        title: "Socialist",
        description: "Wealth is shared for common good and there is social ownership"
      },
      {
        title: "Secular",
        description: "Equal respect for all religions and no state religion"
      },
      {
        title: "Democratic",
        description: "Government elected by the people through universal adult franchise"
      },
      {
        title: "Republic",
        description: "Head of state is elected, not hereditary"
      }
    ],
    dateAdopted: "26 November 1949",
    lastAmended: "42nd Amendment, 1976"
  },
  {
    title: "Fundamental Rights",
    icon: "🔔",
    articles: "Articles 12-35",
    description: "Basic human rights guaranteed to all citizens",
    rights: [
      {
        title: "Right to Equality (Articles 14-18)",
        points: [
          "Equality before law",
          "Prohibition of discrimination",
          "Equality of opportunity",
          "Abolition of untouchability"
        ]
      },
      {
        title: "Right to Freedom (Articles 19-22)",
        points: [
          "Freedom of speech and expression",
          "Freedom of assembly",
          "Freedom of movement",
          "Freedom of profession",
          "Protection of life and personal liberty"
        ]
      },
      {
        title: "Right against Exploitation (Articles 23-24)",
        points: [
          "Prohibition of human trafficking",
          "Prohibition of child labor"
        ]
      },
      {
        title: "Right to Freedom of Religion (Articles 25-28)",
        points: [
          "Freedom of conscience and religion",
          "Freedom to manage religious affairs",
          "Freedom from religious taxation"
        ]
      }
    ]
  },
  {
    title: "Directive Principles",
    icon: "📋",
    articles: "Articles 36-51",
    description: "Guidelines for state policy making",
    principles: [
      {
        category: "Economic Principles",
        points: [
          "Equal distribution of material resources",
          "Prevention of concentration of wealth",
          "Equal pay for equal work",
          "Right to work and education"
        ]
      },
      {
        category: "Social Principles",
        points: [
          "Adequate means of livelihood",
          "Equal justice and free legal aid",
          "Organization of village panchayats",
          "Raising level of nutrition and public health"
        ]
      },
      {
        category: "Gandhian Principles",
        points: [
          "Promotion of cottage industries",
          "Prevention of cow slaughter",
          "Promotion of rural development",
          "Protection of monuments"
        ]
      }
    ]
  },
  {
    title: "Fundamental Duties",
    icon: "📜",
    articles: "Article 51A",
    description: "Moral obligations of all citizens",
    duties: [
      "To abide by the Constitution and respect its ideals",
      "To cherish and follow the noble ideals of freedom struggle",
      "To uphold and protect the sovereignty, unity and integrity of India",
      "To defend the country and render national service when called upon",
      "To promote harmony and spirit of common brotherhood",
      "To preserve the rich heritage of our composite culture",
      "To protect and improve the natural environment",
      "To develop scientific temper and spirit of inquiry",
      "To safeguard public property and abjure violence",
      "To strive towards excellence in all spheres"
    ]
  }
];

const IndianConstitutionPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Indian Constitution - Free Study Material</title>
        <meta name="description" content="Learn about Indian Constitution - Preamble, Fundamental Rights, Directive Principles, and more" />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Indian Constitution</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Comprehensive guide to the Constitution of India - The world's longest written constitution
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Constitution Sections */}
        <div className="space-y-8">
          {constitutionData.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Section Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{section.icon}</span>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                      {section.articles && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {section.articles}
                        </span>
                      )}
                    </div>
                    {section.description && (
                      <p className="text-gray-600 mt-1">{section.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Content */}
              <div className="p-6">
                {section.content && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 italic text-gray-600">
                    {section.content}
                  </div>
                )}

                {section.keyFeatures && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.keyFeatures.map((feature, fIndex) => (
                      <div key={fIndex} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.rights && (
                  <div className="space-y-6">
                    {section.rights.map((right, rIndex) => (
                      <div key={rIndex} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{right.title}</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          {right.points.map((point, pIndex) => (
                            <li key={pIndex}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.principles && (
                  <div className="space-y-6">
                    {section.principles.map((principle, pIndex) => (
                      <div key={pIndex} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{principle.category}</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          {principle.points.map((point, pointIndex) => (
                            <li key={pointIndex}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.duties && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2 text-gray-600">
                      {section.duties.map((duty, dIndex) => (
                        <li key={dIndex} className="flex items-start">
                          <span className="mr-2">{dIndex + 1}.</span>
                          <span>{duty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.dateAdopted && (
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>Date Adopted: {section.dateAdopted}</span>
                    <span>Last Amended: {section.lastAmended}</span>
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
            <li>The Constitution of India is the supreme law of the country</li>
            <li>It lays down the framework for political principles, procedures, powers, and duties</li>
            <li>Originally had 395 articles in 22 parts and 8 schedules</li>
            <li>Currently has 448 articles in 25 parts and 12 schedules</li>
            <li>Longest written constitution of any sovereign country in the world</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IndianConstitutionPage; 