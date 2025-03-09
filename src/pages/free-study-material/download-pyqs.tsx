import React from 'react';
import Head from 'next/head';

const downloadablePYQs = [
  {
    title: "UPSC CSE Prelims 2023",
    description: "Complete set of GS Paper I and CSAT questions with detailed solutions",
    fileSize: "15.2 MB",
    format: "PDF",
    downloadLink: "/materials/upsc-prelims-2023.pdf",
    coverImage: "/images/prelims-2023.jpg",
    papers: ["GS Paper I", "CSAT"]
  },
  {
    title: "UPSC CSE Mains 2023",
    description: "Question papers for all GS papers and Essay with approach to answers",
    fileSize: "28.5 MB",
    format: "PDF",
    downloadLink: "/materials/upsc-mains-2023.pdf",
    coverImage: "/images/mains-2023.jpg",
    papers: ["Essay", "GS-I", "GS-II", "GS-III", "GS-IV"]
  },
  {
    title: "UPSC CSE Prelims 2022",
    description: "Previous year questions with detailed explanations and topic-wise analysis",
    fileSize: "14.8 MB",
    format: "PDF",
    downloadLink: "/materials/upsc-prelims-2022.pdf",
    coverImage: "/images/prelims-2022.jpg",
    papers: ["GS Paper I", "CSAT"]
  }
];

const DownloadPYQsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Download UPSC Previous Year Papers - Free Study Material</title>
        <meta name="description" content="Download UPSC CSE previous year question papers with detailed solutions" />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Previous Year Question Papers</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Download UPSC Civil Services Examination previous year papers with detailed solutions and analysis
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Download Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {downloadablePYQs.map((pyq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img
                  src={pyq.coverImage}
                  alt={pyq.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{pyq.title}</h3>
                <p className="text-gray-600 mb-4">{pyq.description}</p>
                
                {/* Papers included */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Papers Included:</h4>
                  <div className="flex flex-wrap gap-2">
                    {pyq.papers.map((paper, pIndex) => (
                      <span
                        key={pIndex}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {paper}
                      </span>
                    ))}
                  </div>
                </div>

                {/* File info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{pyq.fileSize}</span>
                  <span>{pyq.format}</span>
                </div>

                {/* Download button */}
                <a
                  href={pyq.downloadLink}
                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Download Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notes</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>All papers come with detailed solutions and explanations</li>
            <li>Topic-wise analysis is provided to help identify important areas</li>
            <li>Previous years' trends and pattern analysis included</li>
            <li>Updated with the latest exam pattern and syllabus changes</li>
            <li>Suitable for both Prelims and Mains preparation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DownloadPYQsPage; 