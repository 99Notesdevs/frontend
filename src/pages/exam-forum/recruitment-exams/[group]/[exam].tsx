import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { FaCalendar, FaBook, FaClipboardList, FaGraduationCap, FaFileAlt } from "react-icons/fa";

// This would typically come from an API or database
const examData = {
  "civil-services-ias-ips-ifs": {
    title: "Civil Services (IAS, IPS, IFS)",
    description: "The Civil Services Examination (CSE) is a nationwide competitive examination in India conducted by the Union Public Service Commission for recruitment to various Civil Services of the Government of India.",
    pattern: {
      stages: [
        {
          name: "Preliminary Examination",
          details: [
            "Two objective papers: GS Paper I and CSAT Paper II",
            "Total marks: 400 (200 each)",
            "Duration: 2 hours per paper",
            "CSAT is qualifying in nature (minimum 33% required)"
          ]
        },
        {
          name: "Main Examination",
          details: [
            "9 papers in total (2 qualifying + 7 for ranking)",
            "Essay paper of 250 marks",
            "4 General Studies papers of 250 marks each",
            "2 Optional subject papers of 250 marks each",
            "Total marks: 1750"
          ]
        },
        {
          name: "Interview/Personality Test",
          details: [
            "275 marks",
            "Tests candidate's mental calibre",
            "Assesses suitability for civil service"
          ]
        }
      ]
    },
    eligibility: {
      education: "Bachelor's degree in any discipline",
      age: "21-32 years (with relaxation for reserved categories)",
      attempts: "6 attempts for General category (more for reserved categories)",
      nationality: "Indian citizen"
    },
    syllabus: {
      preliminary: [
        "Current events of national and international importance",
        "History of India and Indian National Movement",
        "Indian and World Geography",
        "Indian Polity and Governance",
        "Economic and Social Development",
        "Environmental Ecology, Biodiversity & Climate Change",
        "General Science"
      ],
      mains: [
        "Indian Heritage and Culture",
        "Governance, Constitution, Polity",
        "Social Justice and International relations",
        "Technology, Economic Development, Bio-diversity",
        "Ethics, Integrity, and Aptitude",
        "Optional Subject (2 papers)"
      ]
    },
    importantDates: {
      notification: "February",
      prelimsExam: "May-June",
      mainsExam: "September",
      interview: "March-May",
      finalResult: "May-June"
    }
  }
  // Add more exams here
};

const ExamPage: React.FC = () => {
  const router = useRouter();
  const { exam } = router.query;
  const examInfo = examData[exam as keyof typeof examData];

  if (!examInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{examInfo.title} - Exam Details - 99Notes</title>
        <meta 
          name="description" 
          content={`Complete information about ${examInfo.title} including exam pattern, syllabus, eligibility criteria, and important dates.`} 
        />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{examInfo.title}</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              {examInfo.description}
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Exam Pattern */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaClipboardList className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Exam Pattern</h2>
                </div>
                <div className="space-y-6">
                  {examInfo.pattern.stages.map((stage, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{stage.name}</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {stage.details.map((detail, dIndex) => (
                          <li key={dIndex}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Syllabus */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaBook className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Syllabus</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Preliminary Examination</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      {examInfo.syllabus.preliminary.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Main Examination</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      {examInfo.syllabus.mains.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            {/* Eligibility */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaGraduationCap className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Eligibility</h2>
                </div>
                <dl className="space-y-4">
                  {Object.entries(examInfo.eligibility).map(([key, value]) => (
                    <div key={key}>
                      <dt className="font-medium text-gray-900 capitalize">{key}</dt>
                      <dd className="text-gray-600 mt-1">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Important Dates */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaCalendar className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Important Dates</h2>
                </div>
                <dl className="space-y-4">
                  {Object.entries(examInfo.importantDates).map(([key, value]) => (
                    <div key={key}>
                      <dt className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                      <dd className="text-gray-600 mt-1">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaFileAlt className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Quick Links</h2>
                </div>
                <div className="space-y-3">
                  <Link
                    href="#"
                    className="block w-full px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                  >
                    Previous Year Papers
                  </Link>
                  <Link
                    href="#"
                    className="block w-full px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                  >
                    Study Material
                  </Link>
                  <Link
                    href="#"
                    className="block w-full px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                  >
                    Discussion Forum
                  </Link>
                  <Link
                    href="#"
                    className="block w-full px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                  >
                    Official Website
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamPage; 